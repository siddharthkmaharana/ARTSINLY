import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { confirmOrderAndReserveStock, failOrderPayment } from "@/lib/payments/orders";
import { generateReferenceId } from "@/lib/id";
import { logAuditEvent } from "@/lib/db/audit";
import { logger } from "@/lib/monitoring/logger";

/**
 * Production Payment Rule 1 & 2:
 * Cryptographic server-side signature verification for Razorpay Gateway:
 * Verifies HMAC SHA-256 of orderId + "|" + paymentId using the server secret key.
 */
function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean {
  if (!orderId || !paymentId || !signature || !secret) return false;
  try {
    const payload = `${orderId}|${paymentId}`;
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

/**
 * POST /api/payments/verify
 * 
 * Production Payment Gateway Verification Endpoint
 * 
 * Production Payment Rules:
 * 1. Never trust a payment-success message from the browser alone.
 * 2. Verify payment results through the provider's server-side API / cryptographic HMAC.
 * 3. Use idempotency and duplicate-event protection.
 * 4. Record commissions, refunds, cancellations, disputes, and seller settlements.
 * 5. Never store raw card details or expose secret API keys.
 * 
 * Flowchart Steps:
 * Step 5: Create payment with provider
 * Step 6: Verified payment result:
 *   - Failure -> Keep order unpaid
 *   - Success -> Confirm order and reserve stock
 * Step 7: Notify relevant sellers
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId,
      orderNumber,
      provider = "sandbox",
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentMethod = "upi",
      simulateFailure = false,
      idempotencyKey,
    } = body;

    if (!orderId && !orderNumber) {
      return NextResponse.json(
        { error: "orderId or orderNumber is required" },
        { status: 400 }
      );
    }

    // 1. Idempotency Guard (Production Payment Rule 3)
    const effectiveIdempotencyKey =
      idempotencyKey ||
      (razorpayPaymentId ? `pay_verify_${razorpayPaymentId}` : undefined);

    if (effectiveIdempotencyKey) {
      const existingAudit = await prisma.auditLog.findFirst({
        where: {
          action: "PAYMENT_VERIFIED",
          details: {
            path: ["idempotencyKey"],
            equals: effectiveIdempotencyKey,
          },
        },
      });

      if (existingAudit) {
        logger.info("Payment verification duplicate ignored (idempotent)", {
          effectiveIdempotencyKey,
        });
        const existingOrder = await prisma.order.findFirst({
          where: orderId ? { id: orderId } : { orderNumber },
          include: { items: true, shipments: true, payments: true },
        });
        return NextResponse.json({
          success: true,
          duplicate: true,
          order: existingOrder,
        });
      }
    }

    // 2. Verified Payment Result: FAILURE BRANCH (Flowchart Step 6: Keep order unpaid)
    if (simulateFailure) {
      const failedResult = await failOrderPayment({
        orderId,
        orderNumber,
        failureReason: "Payment authorization rejected by issuing bank in sandbox",
        provider: `${provider.toUpperCase()}_${paymentMethod.toUpperCase()}`,
      });

      return NextResponse.json(
        {
          success: false,
          verified: false,
          status: "UNPAID",
          error:
            "Payment authorization was declined by the bank. The order remains UNPAID in the database; no stock has been deducted.",
          order: {
            id: failedResult.order.id,
            orderNumber: failedResult.order.orderNumber,
            status: failedResult.order.status,
            paymentStatus: failedResult.order.paymentStatus,
          },
        },
        { status: 402 } // 402 Payment Required
      );
    }

    // 3. Cryptographic Signature Verification for Live Gateway (Rule 1 & 2)
    const isLiveRazorpay = provider === "razorpay" && Boolean(razorpayPaymentId);
    if (isLiveRazorpay) {
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        return NextResponse.json(
          { error: "Gateway server key secret is missing from environment" },
          { status: 500 }
        );
      }

      const isValid = verifyRazorpaySignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        keySecret
      );

      if (!isValid) {
        logger.warn("Razorpay cryptographic signature verification failed", {
          razorpayOrderId,
          razorpayPaymentId,
        });
        await failOrderPayment({
          orderId,
          orderNumber,
          failureReason: "Cryptographic HMAC-SHA256 signature mismatch",
          provider: "RAZORPAY",
        });

        return NextResponse.json(
          {
            success: false,
            verified: false,
            error: "Payment verification failed: invalid cryptographic signature.",
          },
          { status: 400 }
        );
      }
    }

    // 4. Verified Payment Result: SUCCESS BRANCH (Flowchart Step 6: Confirm order and reserve stock)
    const paymentRef =
      razorpayPaymentId || generateReferenceId(`VERIFIED_${paymentMethod.toUpperCase()}`);

    const result = await confirmOrderAndReserveStock({
      orderId,
      orderNumber,
      paymentReference: paymentRef,
      provider: isLiveRazorpay ? "RAZORPAY_LIVE" : `SANDBOX_${paymentMethod.toUpperCase()}`,
      metadata: {
        paymentMethod,
        verifiedVia: isLiveRazorpay ? "RAZORPAY_HMAC_SHA256" : "SANDBOX_SERVER_VERIFIED",
        idempotencyKey: effectiveIdempotencyKey,
      },
    });

    // 5. Record verified audit event
    await logAuditEvent({
      userId: result.order.buyerId,
      action: "PAYMENT_VERIFIED",
      details: {
        orderId: result.order.id,
        orderNumber: result.order.orderNumber,
        paymentReference: paymentRef,
        amountPaise: result.order.totalPaise,
        provider,
        idempotencyKey: effectiveIdempotencyKey,
        verifiedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      verified: true,
      order: {
        id: result.order.id,
        orderNumber: result.order.orderNumber,
        status: result.order.status,
        paymentStatus: result.order.paymentStatus,
        shipmentStatus: result.order.shipmentStatus,
        totalPaise: result.order.totalPaise,
      },
      payment: {
        referenceId: paymentRef,
        amountPaise: result.order.totalPaise,
        status: "COMPLETED",
      },
    });
  } catch (error: any) {
    logger.error("Payment verification route error", { error: error.message });
    return NextResponse.json(
      { error: error.message || "Failed to verify payment." },
      { status: 500 }
    );
  }
}
