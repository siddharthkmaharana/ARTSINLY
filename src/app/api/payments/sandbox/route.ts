import { NextRequest, NextResponse } from "next/server";
import { generateReferenceId } from "@/lib/id";
import { confirmOrderAndReserveStock, failOrderPayment } from "@/lib/payments/orders";

/**
 * POST /api/payments/sandbox
 * 
 * Simulates a secure payment gateway transaction in the development sandbox.
 * Strictly adheres to Flowchart:
 * Step 5: Create payment with provider
 * Step 6: Verified payment result:
 *   - Failure -> Keep order unpaid (status PENDING, paymentStatus FAILED, no stock deducted, no sellers alerted)
 *   - Success -> Confirm order and reserve stock (status CONFIRMED, paymentStatus COMPLETED, deducts inventory, notifies sellers)
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

    // Branch A: Failure -> Keep order unpaid
    if (simulateFailure) {
      const failed = await failOrderPayment({
        orderId,
        orderNumber,
        failureReason: "Simulated sandbox card decline / UPI authorization rejection",
        provider: `SANDBOX_${paymentMethod.toUpperCase()}`,
      });

      return NextResponse.json(
        {
          success: false,
          error: "Simulated payment authorization failed. Please try another card or UPI ID.",
          order: {
            id: failed.order.id,
            orderNumber: failed.order.orderNumber,
            status: failed.order.status,
            paymentStatus: failed.order.paymentStatus,
          },
        },
        { status: 400 }
      );
    }

    // Branch B: Success -> Confirm order and reserve stock, notify sellers
    const referenceId = generateReferenceId(`SBX_${paymentMethod.toUpperCase()}`);

    const result = await confirmOrderAndReserveStock({
      orderId,
      orderNumber,
      paymentReference: referenceId,
      provider: `SANDBOX_${paymentMethod.toUpperCase()}`,
      metadata: {
        method: paymentMethod,
        gateway: "ARTSINLY Escrow Payment Sandbox",
        settlement: "HELD_IN_ESCROW",
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      payment: {
        id: result.payment?.id || `pay_${Date.now()}`,
        referenceId: result.payment?.referenceId || referenceId,
        provider: result.payment?.provider || `SANDBOX_${paymentMethod.toUpperCase()}`,
        status: result.payment?.status || "COMPLETED",
        amountPaise: result.payment?.amountPaise || result.order.totalPaise,
      },
      order: {
        id: result.order.id,
        orderNumber: result.order.orderNumber,
        status: result.order.status,
        paymentStatus: result.order.paymentStatus,
        shipmentStatus: result.order.shipmentStatus,
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
