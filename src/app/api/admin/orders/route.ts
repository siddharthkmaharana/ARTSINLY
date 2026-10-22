import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

/**
 * GET /api/admin/orders
 * List all orders across the marketplace with buyer, seller items, payments, and shipments
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");
    const shipmentStatus = searchParams.get("shipmentStatus");

    const where: any = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (shipmentStatus) where.shipmentStatus = shipmentStatus;

    const orders = await prisma.order.findMany({
      where,
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            seller: {
              select: {
                id: true,
                shopName: true,
                artisanName: true,
              },
            },
            product: {
              select: {
                id: true,
                slug: true,
                images: { where: { isPrimary: true } },
              },
            },
          },
        },
        payments: true,
        shipments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("Admin orders GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load admin orders" },
      { status: 500 }
    );
  }
}
