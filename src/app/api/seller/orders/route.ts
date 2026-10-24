import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";

/**
 * GET /api/seller/orders
 * Returns orders containing handcrafted items crafted by the authenticated seller.
 */
export async function GET(req: NextRequest) {
  try {
    const token =
      req.cookies.get("artsinly_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find seller profile
    let seller: any = null;
    try {
      seller = await prisma.sellerProfile.findUnique({
        where: { userId: payload.userId },
      });
    } catch {
      // Database offline fallback
      return NextResponse.json({ orders: [] });
    }

    if (!seller) {
      return NextResponse.json({ orders: [] });
    }

    // Find all order items belonging to this seller
    const orderItems = await prisma.orderItem.findMany({
      where: { sellerId: seller.id },
      include: {
        order: {
          include: {
            buyer: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
            shipments: true,
            payments: true,
          },
        },
        product: {
          include: {
            images: { where: { isPrimary: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Group items by order
    const orderMap = new Map<string, any>();
    for (const item of orderItems) {
      if (!orderMap.has(item.orderId)) {
        orderMap.set(item.orderId, {
          id: item.order.id,
          orderNumber: item.order.orderNumber,
          createdAt: item.order.createdAt,
          status: item.order.status,
          paymentStatus: item.order.paymentStatus,
          shipmentStatus: item.order.shipmentStatus,
          addressSnapshot: item.order.addressSnapshot,
          buyer: item.order.buyer,
          shipments: item.order.shipments,
          payments: item.order.payments,
          sellerItems: [],
          sellerTotalPaise: 0,
        });
      }

      const ord = orderMap.get(item.orderId);
      ord.sellerItems.push({
        id: item.id,
        productId: item.productId,
        title: item.title,
        pricePaise: item.pricePaise,
        quantity: item.quantity,
        imageUrl: item.product?.images?.[0]?.url || "",
      });
      ord.sellerTotalPaise += item.pricePaise * item.quantity;
    }

    const orders = Array.from(orderMap.values());

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("Seller orders GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
