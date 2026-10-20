import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSellerPayoutSummary } from "@/lib/payments/onboarding";

/**
 * GET /api/seller/payouts
 * Retrieve artisan earnings, commissions, TDS, and payout settlement history
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

    const summary = await getSellerPayoutSummary(seller.id);

    return NextResponse.json({
      success: true,
      summary: {
        ...summary,
        currency: "INR",
        feeStructure: {
          commissionPercent: 15,
          tdsPercent: 1,
          artisanSharePercent: 84,
        },
      },
    });
  } catch (error: any) {
    console.error("Seller payouts error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch payouts summary" },
      { status: 500 }
    );
  }
}
