import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/db/audit";
import { logger } from "@/lib/monitoring/logger";

/**
 * Verifies webhook HMAC SHA-256 signature
 */
function verifyWebhookSignature(payload: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) return false;
  try {
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

/**
 * POST /api/payments/webhook
 * Production-ready webhook listener for Payment Gateway events (Razorpay / Stripe / Sandbox)
 * Implements cryptographic signature verification and idempotent processing.
 */
export async function POST(req: NextRequest) {
  const startTime = performance.now();
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || req.headers.get("x-webhook-signature");
    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || "artsinly_dev_webhook_secret_key_12345";

    // In production, strictly require matching signature
    const isSignatureValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
    const isDev = process.env.NODE_ENV !== "production";

    if (!isSignatureValid && !isDev) {
      logger.warn("Payment webhook rejected: invalid signature", { signature });
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const event = payload.event || "payment.captured";
    const eventId = payload.id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 1. Idempotency Check: Avoid processing duplicate webhook deliveries
    const existingLog = await prisma.auditLog.findFirst({
      where: {
        action: "PAYMENT_WEBHOOK_PROCESSED",
        details: {
          path: ["eventId"],
          equals: eventId,
        },
      },
    });

    if (existingLog) {
      logger.info("Webhook duplicate ignored (idempotent)", { eventId });
      return NextResponse.json({ received: true, duplicate: true, eventId });
    }

    // 2. Process Gateway Event
    const paymentEntity = payload.payload?.payment?.entity || payload.payment || {};
    const orderNumber = paymentEntity.notes?.orderNumber || payload.orderNumber;
    const paymentReference = paymentEntity.id || payload.referenceId;
    const amountPaise = paymentEntity.amount || payload.amountPaise;

    if (event === "payment.captured" || event === "order.paid") {
      if (orderNumber) {
        const order = await prisma.order.findUnique({
          where: { orderNumber },
        });

        if (order) {
          await prisma.$transaction([
            prisma.payment.create({
              data: {
                orderId: order.id,
                provider: "RAZORPAY_WEBHOOK",
                referenceId: paymentReference,
                amountPaise: amountPaise || order.totalPaise,
                status: "COMPLETED",
                metadata: {
                  eventId,
                  gatewayEvent: event,
                  receivedAt: new Date().toISOString(),
                },
              },
            }),
            prisma.order.update({
              where: { id: order.id },
              data: { status: "CONFIRMED" },
            }),
          ]);
        }
      }
    } else if (event === "payment.failed") {
      if (orderNumber) {
        const order = await prisma.order.findUnique({ where: { orderNumber } });
        if (order) {
          await prisma.payment.create({
            data: {
              orderId: order.id,
              provider: "RAZORPAY_WEBHOOK",
              referenceId: paymentReference,
              amountPaise: amountPaise || order.totalPaise,
              status: "FAILED",
              metadata: {
                eventId,
                errorReason: paymentEntity.error_description || "Card declined or UPI timeout",
              },
            },
          });
        }
      }
    }

    // 3. Record in Audit Log for permanent deduplication and audit trail
    await logAuditEvent({
      action: "PAYMENT_WEBHOOK_PROCESSED",
      details: {
        eventId,
        event,
        paymentReference,
        orderNumber,
        processedAt: new Date().toISOString(),
        durationMs: Math.round(performance.now() - startTime),
      },
    });

    return NextResponse.json({
      received: true,
      processed: true,
      eventId,
      event,
    });
  } catch (error: any) {
    logger.error("Payment webhook handler error", { error: error.message });
    return NextResponse.json(
      { error: error.message || "Webhook processing error" },
      { status: 500 }
    );
  }
}
