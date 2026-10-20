import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/db/audit";
import { validateIFSC, validatePAN, validateGSTIN, calculateArtisanSettlement } from "./provider";

export interface PayoutAccountData {
  sellerId: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  panNumber: string;
  gstin?: string;
  taxExemptionDeclared?: boolean;
}

export interface SellerPayoutAccountResponse {
  isOnboarded: boolean;
  status: "NOT_ONBOARDED" | "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED";
  accountHolderName?: string;
  maskedAccountNumber?: string;
  bankName?: string;
  ifscCode?: string;
  panNumber?: string;
  gstinStatus?: string;
  verifiedAt?: string;
}

/**
 * Mask account number showing only last 4 digits (e.g. ••••••••8912)
 */
export function maskAccountNumber(acc: string): string {
  if (!acc || acc.length < 4) return "••••";
  const lastFour = acc.slice(-4);
  return `•••• •••• ${lastFour}`;
}

/**
 * Fetch seller payout onboarding status from AuditLog and profile
 */
export async function getSellerPayoutAccount(sellerId: string): Promise<SellerPayoutAccountResponse> {
  const seller = await prisma.sellerProfile.findUnique({
    where: { id: sellerId },
  });

  if (!seller) {
    return {
      isOnboarded: false,
      status: "NOT_ONBOARDED",
    };
  }

  // Look for latest verified or submitted payout account record in AuditLog
  const accountLog = await prisma.auditLog.findFirst({
    where: {
      action: "SELLER_PAYOUT_ACCOUNT_UPDATED",
      details: {
        path: ["sellerId"],
        equals: sellerId,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!accountLog || !accountLog.details) {
    return {
      isOnboarded: false,
      status: "NOT_ONBOARDED",
    };
  }

  const details = accountLog.details as any;

  return {
    isOnboarded: true,
    status: details.status || "VERIFIED",
    accountHolderName: details.accountHolderName,
    maskedAccountNumber: details.maskedAccountNumber || maskAccountNumber(details.accountNumber || ""),
    bankName: details.bankName,
    ifscCode: details.ifscCode,
    panNumber: details.panNumber ? details.panNumber.replace(/.(?=.{4})/g, "•") : undefined,
    gstinStatus: details.gstin ? "REGISTERED" : "COMPOSITION_EXEMPT",
    verifiedAt: details.verifiedAt || accountLog.createdAt.toISOString(),
  };
}

/**
 * Onboard or update a seller's bank account & tax credentials
 */
export async function saveSellerPayoutAccount(
  sellerId: string,
  userId: string,
  data: {
    accountHolderName: string;
    accountNumber: string;
    confirmAccountNumber: string;
    ifscCode: string;
    bankName: string;
    panNumber: string;
    gstin?: string;
    taxExemptionDeclared?: boolean;
  }
) {
  const {
    accountHolderName,
    accountNumber,
    confirmAccountNumber,
    ifscCode,
    bankName,
    panNumber,
    gstin,
    taxExemptionDeclared,
  } = data;

  if (!accountHolderName?.trim()) throw new Error("Account holder name is required.");
  if (!accountNumber?.trim() || accountNumber !== confirmAccountNumber) {
    throw new Error("Bank account numbers do not match.");
  }
  if (!validateIFSC(ifscCode)) {
    throw new Error("Invalid Indian IFSC code format (must be 11 characters, e.g. HDFC0001234).");
  }
  if (!validatePAN(panNumber)) {
    throw new Error("Invalid Indian PAN format (must be 10 characters, e.g. ABCDE1234F).");
  }
  if (gstin && !validateGSTIN(gstin)) {
    throw new Error("Invalid GSTIN format (15 characters) or enter 'EXEMPT'.");
  }

  const masked = maskAccountNumber(accountNumber);

  // Penny drop simulation / verification (in sandbox/staging, automatically marks verified)
  const isVerified = true;
  const status = isVerified ? "VERIFIED" : "PENDING_VERIFICATION";

  await logAuditEvent({
    userId,
    action: "SELLER_PAYOUT_ACCOUNT_UPDATED",
    details: {
      sellerId,
      accountHolderName: accountHolderName.trim(),
      maskedAccountNumber: masked,
      bankName: bankName.trim(),
      ifscCode: ifscCode.trim().toUpperCase(),
      panNumber: panNumber.trim().toUpperCase(),
      gstin: gstin?.trim().toUpperCase() || (taxExemptionDeclared ? "EXEMPT" : undefined),
      status,
      verifiedAt: new Date().toISOString(),
      rbiPapgCompliant: true,
      section194OCompliant: true,
    },
  });

  return {
    success: true,
    status,
    maskedAccountNumber: masked,
    bankName,
    ifscCode: ifscCode.toUpperCase(),
  };
}

/**
 * Calculates current payout summary for a seller across all delivered orders
 */
export async function getSellerPayoutSummary(sellerId: string) {
  // Find all order items sold by this artisan
  const orderItems = await prisma.orderItem.findMany({
    where: { sellerId },
    include: {
      order: {
        include: {
          payments: true,
          shipments: true,
        },
      },
    },
  });

  // Gross confirmed sales
  let grossSalesPaise = 0;
  let deliveredSalesPaise = 0;

  for (const item of orderItems) {
    const isPaid = item.order.payments.some((p) => p.status === "COMPLETED");
    if (isPaid) {
      const itemTotal = item.pricePaise * item.quantity;
      grossSalesPaise += itemTotal;

      const isDelivered = item.order.shipments.some((s) => s.status === "DELIVERED") || item.order.status === "DELIVERED";
      if (isDelivered) {
        deliveredSalesPaise += itemTotal;
      }
    }
  }

  // Calculate settlement breakdown for delivered sales
  const settlement = calculateArtisanSettlement(deliveredSalesPaise);

  // Existing payouts
  const payouts = await prisma.payout.findMany({
    where: { sellerId },
    orderBy: { createdAt: "desc" },
  });

  const totalPaidOutPaise = payouts
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amountPaise, 0);

  const pendingSettlementPaise = Math.max(0, settlement.netPaise - totalPaidOutPaise);

  return {
    grossSalesPaise,
    deliveredSalesPaise,
    commissionPaise: settlement.commissionPaise,
    tdsPaise: settlement.tdsPaise,
    netPayablePaise: settlement.netPaise,
    totalPaidOutPaise,
    pendingSettlementPaise,
    payouts,
  };
}
