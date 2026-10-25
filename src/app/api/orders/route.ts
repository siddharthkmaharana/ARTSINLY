import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";
import { sendSellerOrderAlertEmail } from "@/lib/email";
import { generateOrderNumber } from "@/lib/id";

/**
 * GET /api/orders - Get orders for the logged-in buyer
 */
export async function GET(req: NextRequest) {
  try {
    const token =
      req.cookies.get("artsinly_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ orders: [] });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ orders: [] });
    }

    const orders = await prisma.order.findMany({
      where: { buyerId: payload.userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true } },
              },
            },
            seller: true,
          },
        },
        shipments: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("Orders GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders - Create a new order with inventory deduction and shipment record
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      shippingAddress,
      buyerEmail,
      buyerName,
      buyerPhone,
      shippingFeePaise = 0,
      taxPaise = 0,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty. Please select handcrafted items to order." },
        { status: 400 }
      );
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine1) {
      return NextResponse.json(
        { error: "Complete delivery address is required." },
        { status: 400 }
      );
    }

    // 1. Identify Buyer: Authenticated or Guest (auto-provision user)
    let buyerId: string;
    const token =
      req.cookies.get("artsinly_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    const payload = token ? verifySessionToken(token) : null;

    if (payload) {
      buyerId = payload.userId;
    } else {
      const email = (buyerEmail || "guest@artsinly.com").trim().toLowerCase();
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name: buyerName || shippingAddress.fullName || "Esteemed Collector",
            phone: buyerPhone || shippingAddress.phone || "",
            role: "BUYER",
          },
        });
      }
      buyerId = user.id;
    }

    // 2. Create Pending Order (Flowchart Step 4)
    // Allocates items to sellers, calculates totals, creates multi-seller package shipments,
    // leaves order in PENDING state, does NOT deduct stock yet, does NOT notify sellers yet.
    const { createPendingOrder } = await import("@/lib/payments/orders");
    const result = await createPendingOrder({
      buyerId,
      items,
      shippingAddress,
      shippingFeePaise,
      taxPaise,
    });

    return NextResponse.json({
      success: true,
      order: {
        id: result.order.id,
        orderNumber: result.order.orderNumber,
        totalPaise: result.order.totalPaise,
        status: result.order.status,
        paymentStatus: result.order.paymentStatus,
        shipmentStatus: result.order.shipmentStatus,
        sellerCount: result.sellerCount,
      },
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to place order. Please try again." },
      { status: 400 }
    );
  }
}

