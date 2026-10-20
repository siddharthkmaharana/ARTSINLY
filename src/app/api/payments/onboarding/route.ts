import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getPaymentProviderOnboardingStatus } from "@/lib/payments/provider";

/**
 * GET /api/payments/onboarding
 * Provides system-level Payment Provider Onboarding & Compliance Status (RBI PAPG).
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const status = getPaymentProviderOnboardingStatus();
    return NextResponse.json({
      success: true,
      onboarding: status,
      guidance: {
        rbiRegulation: "RBI/DPSS/2019-20/174 Guidelines on Regulation of Payment Aggregators and Payment Gateways",
        escrowMechanism: "All buyer funds are held in a scheduled commercial bank nodal/escrow account and released only on delivery completion.",
        section194OCompliance: "1% TDS is computed on gross sales before artisan remittance.",
      },
    });
  } catch (error: any) {
    console.error("Payment onboarding check error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check payment onboarding" },
      { status: 500 }
    );
  }
}
