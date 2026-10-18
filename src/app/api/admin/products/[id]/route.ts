import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { logAuditEvent } from "@/lib/db/audit";
import { ProductStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/admin/products/[id]
 * Moderates a product: approve/publish, archive, or unpublish with reason
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const { id } = await params;
    const body = await req.json();
    const { status, reason } = body;

    const validStatuses: ProductStatus[] = [
      ProductStatus.PUBLISHED,
      ProductStatus.ARCHIVED,
      ProductStatus.DRAFT,
    ];

    if (!status || !validStatuses.includes(status as ProductStatus)) {
      return NextResponse.json(
        {
          error: `Invalid product status: ${status}. Expected one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: { id: true, shopName: true, artisanName: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { status: status as ProductStatus },
    });

    // Record in Audit Log
    await logAuditEvent({
      userId: auth.user!.id,
      action: "PRODUCT_MODERATED",
      details: {
        productId: product.id,
        title: product.title,
        sellerId: product.sellerId,
        sellerShop: product.seller.shopName,
        previousStatus: product.status,
        newStatus: status,
        reason: reason || `Admin updated status to ${status}`,
        adminEmail: auth.user!.email,
      },
    });

    return NextResponse.json({
      success: true,
      product: updated,
      message: `Product "${product.title}" status changed to ${status}.`,
    });
  } catch (error: any) {
    console.error("Admin product moderation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to moderate product" },
      { status: 500 }
    );
  }
}
