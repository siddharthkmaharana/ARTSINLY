import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { logAuditEvent } from "@/lib/db/audit";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/admin/sellers/[id]
 * Reviews, approves GI verification, or suspends a seller profile
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const { id } = await params;
    const body = await req.json();
    const { isVerified, actionNotes } = body;

    if (typeof isVerified !== "boolean") {
      return NextResponse.json(
        { error: "isVerified (boolean) is required in request body" },
        { status: 400 }
      );
    }

    const seller = await prisma.sellerProfile.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!seller) {
      return NextResponse.json(
        { error: "Seller profile not found" },
        { status: 404 }
      );
    }

    const updatedSeller = await prisma.sellerProfile.update({
      where: { id },
      data: { isVerified },
      include: { user: true },
    });

    // Record in Audit Log
    const action = isVerified ? "SELLER_VERIFIED" : "SELLER_UNVERIFIED";
    await logAuditEvent({
      userId: auth.user!.id,
      action,
      details: {
        sellerId: seller.id,
        shopName: seller.shopName,
        artisanName: seller.artisanName,
        giCode: seller.giCode,
        state: seller.state,
        previousStatus: seller.isVerified,
        newStatus: isVerified,
        notes: actionNotes || (isVerified ? "GI Tag Authenticity Approved" : "Verification Revoked"),
        adminEmail: auth.user!.email,
      },
    });

    return NextResponse.json({
      success: true,
      seller: updatedSeller,
      message: isVerified
        ? `Seller "${seller.shopName}" has been GI Verified and certified.`
        : `Seller "${seller.shopName}" verification has been revoked.`,
    });
  } catch (error: any) {
    console.error("Admin seller update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update seller verification status" },
      { status: 500 }
    );
  }
}
