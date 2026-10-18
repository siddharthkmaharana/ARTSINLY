import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { logAuditEvent } from "@/lib/db/audit";
import { sendOrderRefundedEmail } from "@/lib/email";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/admin/orders/[id]/refund
 * Processes an administrative refund: reverses payment, marks order REFUNDED,
 * restocks product inventory, creates audit log, and notifies the collector.
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { reason = "Collector Request / Damaged Transit / Administrative Override" } = body;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: true,
        payments: true,
        shipments: true,
        buyer: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found in database" },
        { status: 404 }
      );
    }

    if (order.status === "REFUNDED") {
      return NextResponse.json(
        { error: "This order has already been fully refunded." },
        { status: 400 }
      );
    }

    // Atomically execute refund, inventory restock, and payment status update
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Order status to REFUNDED
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: { status: "REFUNDED" },
      });

      // 2. Update Payments to REFUNDED
      await tx.payment.updateMany({
        where: { orderId: order.id },
        data: { status: "REFUNDED" },
      });

      // 3. Restock Inventory for each item in the order
      const restockedItems = [];
      for (const item of order.items) {
        const invUpdate = await tx.inventory.updateMany({
          where: { productId: item.productId },
          data: {
            quantity: { increment: item.quantity },
          },
        });

        restockedItems.push({
          productId: item.productId,
          title: item.title,
          quantityRestocked: item.quantity,
          updatedCount: invUpdate.count,
        });
      }

      // 4. Update Shipment if in transit/label created
      if (order.shipments.length > 0) {
        await tx.shipment.updateMany({
          where: { orderId: order.id },
          data: { status: "CANCELLED" },
        });
      }

      // 5. Create immutable Audit Log
      const audit = await tx.auditLog.create({
        data: {
          userId: auth.user!.id,
          action: "ORDER_REFUNDED",
          details: {
            orderId: order.id,
            orderNumber: order.orderNumber,
            amountPaise: order.totalPaise,
            reason,
            buyerId: order.buyerId,
            buyerEmail: order.buyer.email,
            itemsRestocked: restockedItems,
            adminEmail: auth.user!.email,
          },
          ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
        },
      });

      return { updatedOrder, restockedItems, audit };
    });

    // 6. Send Refund Confirmation Email to Buyer (non-blocking)
    const address = order.addressSnapshot as any;
    sendOrderRefundedEmail({
      orderNumber: order.orderNumber,
      buyerEmail: order.buyer.email,
      buyerName: address?.fullName || order.buyer.name || "Esteemed Collector",
      amountPaise: order.totalPaise,
      reason,
    }).catch((err) => console.error("Error sending refund email:", err));

    return NextResponse.json({
      success: true,
      order: result.updatedOrder,
      restockedItems: result.restockedItems,
      auditLogId: result.audit.id,
      message: `Order #${order.orderNumber} successfully refunded. Inventory restored for ${result.restockedItems.length} products.`,
    });
  } catch (error: any) {
    console.error("Admin order refund error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process refund" },
      { status: 500 }
    );
  }
}
