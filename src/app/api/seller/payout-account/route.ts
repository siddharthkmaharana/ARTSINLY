import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSellerPayoutAccount, saveSellerPayoutAccount } from "@/lib/payments/onboarding";

/**
 * GET /api/seller/payout-account
 * Retrieve current artisan payout account and KYC status
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const seller = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!seller) {
      return NextResponse.json({ error: "Seller profile not found" }, { status: 404 });
    }

    const account = await getSellerPayoutAccount(seller.id);
    return NextResponse.json({ success: true, account });
  } catch (error: any) {
    console.error("Get payout account error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch payout account" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/seller/payout-account
 * Onboard or update artisan bank details and tax PAN under Section 194-O
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const seller = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!seller) {
      return NextResponse.json({ error: "Seller profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const result = await saveSellerPayoutAccount(seller.id, user.id, body);

    return NextResponse.json({
      success: true,
      message: "Bank account and tax credentials submitted and verified successfully.",
      account: result,
    });
  } catch (error: any) {
    console.error("Save payout account error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update payout account" },
      { status: 400 }
    );
  }
}
