import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";
import { sendShipmentDispatchedEmail } from "@/lib/email";
import { OrderStatus, ShipmentStatus } from "@prisma/client";
import { generateTrackingNumber } from "@/lib/id";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/seller/orders/[id]
 * Updates order fulfillment status, carrier details, and dispatch tracking.
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: orderId } = await params;
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

    const seller = await prisma.sellerProfile.findUnique({
      where: { userId: payload.userId },
    });

    if (!seller) {
      return NextResponse.json(
        { error: "Seller profile required to manage fulfillment" },
        { status: 403 }
      );
    }

    // Verify order contains items from this seller
    const orderItem = await prisma.orderItem.findFirst({
      where: { orderId, sellerId: seller.id },
      include: {
        order: {
          include: {
            buyer: true,
            shipments: true,
          },
        },
      },
    });

    if (!orderItem) {
      return NextResponse.json(
        { error: "Order not found or no items belonging to your studio" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      status, // "PROCESSING" | "SHIPPED" | "DELIVERED"
      carrier = "BlueDart Express Insured",
      trackingNumber,
    } = body;

    const validStatuses: OrderStatus[] = [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED,
    ];

    if (status && !validStatuses.includes(status as OrderStatus)) {
      return NextResponse.json(
        { error: `Invalid order status: ${status}` },
        { status: 400 }
      );
    }

    const existingShipment = orderItem.order.shipments[0];

    // Determine logistical ShipmentStatus
    const shipmentStatus: ShipmentStatus =
      status === "SHIPPED"
        ? ShipmentStatus.SHIPPED
        : status === "DELIVERED"
        ? ShipmentStatus.DELIVERED
        : status === "PROCESSING"
        ? ShipmentStatus.PROCESSING
        : ShipmentStatus.LABEL_CREATED;

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update order status and shipmentStatus independently (leaving paymentStatus intact)
      const ord = await tx.order.update({
        where: { id: orderId },
        data: {
          status: status ? (status as OrderStatus) : undefined,
          shipmentStatus,
        },
      });

      // 2. Update or create Shipment
      let ship;
      if (existingShipment) {
        ship = await tx.shipment.update({
          where: { id: existingShipment.id },
          data: {
            carrier: carrier || existingShipment.carrier,
            trackingNumber: trackingNumber || existingShipment.trackingNumber,
            status: shipmentStatus,
            shippedAt: status === "SHIPPED" ? new Date() : existingShipment.shippedAt,
            deliveredAt: status === "DELIVERED" ? new Date() : existingShipment.deliveredAt,
          },
        });
      } else {
        ship = await tx.shipment.create({
          data: {
            orderId,
            carrier: carrier || "Insured Express Courier",
            trackingNumber: trackingNumber || generateTrackingNumber("AWB"),
            status: shipmentStatus,
            shippedAt: status === "SHIPPED" ? new Date() : undefined,
            deliveredAt: status === "DELIVERED" ? new Date() : undefined,
          },
        });
      }

      return { order: ord, shipment: ship };
    });

    // 3. Trigger email to buyer if dispatched
    if (status === "SHIPPED" && updated.shipment.trackingNumber) {
      const address = orderItem.order.addressSnapshot as any;
      sendShipmentDispatchedEmail({
        orderNumber: orderItem.order.orderNumber,
        buyerEmail: orderItem.order.buyer.email,
        buyerName: address?.fullName || orderItem.order.buyer.name || "Esteemed Collector",
        carrier: updated.shipment.carrier,
        trackingNumber: updated.shipment.trackingNumber,
      }).catch((err) => console.error("Error sending shipment email:", err));
    }

    return NextResponse.json({
      success: true,
      order: updated.order,
      shipment: updated.shipment,
    });
  } catch (error: any) {
    console.error("Seller fulfillment update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update fulfillment" },
      { status: 500 }
    );
  }
}
