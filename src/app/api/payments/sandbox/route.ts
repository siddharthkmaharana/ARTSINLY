import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";

/**
 * POST /api/payments/sandbox
 * Simulates an instantaneous, secure payment gateway transaction in sandbox environment.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId,
      orderNumber,
      paymentMethod = "upi",
      simulateFailure = false,
    } = body;

    if (!orderId && !orderNumber) {
      return NextResponse.json(
        { error: "orderId or orderNumber is required" },
        { status: 400 }
      );
    }

    // Find the order
    const order = await prisma.order.findFirst({
      where: orderId ? { id: orderId } : { orderNumber },
      include: {
        items: true,
        buyer: true,
        shipments: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found in database" },
        { status: 404 }
      );
    }

    if (simulateFailure) {
      await prisma.payment.create({
        data: {
          orderId: order.id,
          provider: `SANDBOX_${paymentMethod.toUpperCase()}`,
          referenceId: `FAIL_${Date.now()}`,
          amountPaise: order.totalPaise,
          status: "FAILED",
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: "Simulated payment authorization failed. Please try another card or UPI ID.",
        },
        { status: 400 }
      );
    }

    const referenceId = `SBX_${paymentMethod.toUpperCase()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Record payment and confirm order in transaction
    const [payment, updatedOrder] = await prisma.$transaction([
      prisma.payment.create({
        data: {
          orderId: order.id,
          provider: `SANDBOX_${paymentMethod.toUpperCase()}`,
          referenceId,
          amountPaise: order.totalPaise,
          status: "COMPLETED",
          metadata: {
            method: paymentMethod,
            gateway: "ARTSINLY Escrow Payment Sandbox",
            settlement: "HELD_IN_ESCROW",
            timestamp: new Date().toISOString(),
          },
        },
      }),
      prisma.order.update({
        where: { id: order.id },
        data: {
          status: "CONFIRMED",
        },
        include: {
          items: true,
          shipments: true,
        },
      }),
    ]);

    // Send order confirmation email to buyer
    const address = order.addressSnapshot as any;
    sendOrderConfirmationEmail({
      orderNumber: updatedOrder.orderNumber,
      buyerEmail: order.buyer.email,
      buyerName: address?.fullName || order.buyer.name || "Esteemed Collector",
      items: updatedOrder.items.map((i) => ({
        title: i.title,
        quantity: i.quantity,
        pricePaise: i.pricePaise,
      })),
      totalPaise: updatedOrder.totalPaise,
      shippingAddress: {
        fullName: address?.fullName || "Aarav Sharma",
        addressLine1: address?.addressLine1 || "Civil Lines",
        city: address?.city || "Jaipur",
        state: address?.state || "Rajasthan",
        postalCode: address?.postalCode || "302006",
        phone: address?.phone || "+91 98765 43210",
      },
    }).catch((err) => console.error("Error sending confirmation email:", err));

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        referenceId: payment.referenceId,
        provider: payment.provider,
        status: payment.status,
        amountPaise: payment.amountPaise,
      },
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
      },
    });
  } catch (error: any) {
    console.error("Payment sandbox error:", error);
    return NextResponse.json(
      { error: error.message || "Payment processing failed" },
      { status: 500 }
    );
  }
}
