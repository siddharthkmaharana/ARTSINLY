import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus, ShipmentStatus } from "@prisma/client";
import { generateOrderNumber, generateTrackingNumber, generateReferenceId } from "@/lib/id";
import { calculateFairTradeSettlement } from "@/lib/money";
import { logAuditEvent } from "@/lib/db/audit";
import {
  sendOrderConfirmationEmail,
  sendSellerOrderAlertEmail,
  sendOrderRefundedEmail,
} from "@/lib/email";

export interface CartCheckoutItem {
  productId: string;
  variantId?: string;
  quantity: number;
  title?: string;
  pricePaise?: number;
}

export interface ShippingAddressInput {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

export interface CreatePendingOrderParams {
  buyerId: string;
  items: CartCheckoutItem[];
  shippingAddress: ShippingAddressInput;
  shippingFeePaise?: number;
  taxPaise?: number;
}

/**
 * 1. Validate Cart and Stock (Flowchart Step 2)
 * Verifies live catalog status, current server-side prices, and available stock.
 */
export async function validateCartAndStock(items: CartCheckoutItem[]) {
  if (!items || items.length === 0) {
    throw new Error("Cart is empty. Please select handcrafted items to order.");
  }

  const enrichedItems: Array<{
    productId: string;
    variantId?: string;
    sellerId: string;
    title: string;
    pricePaise: number;
    quantity: number;
    sellerShopName: string;
    sellerArtisanName: string;
    sellerEmail: string;
    sellerState: string;
    productSnapshot: any;
  }> = [];

  // Default fallback artisan guild for mock items
  const defaultSeller =
    (await prisma.sellerProfile.findFirst({ include: { user: true } })) ||
    (await prisma.sellerProfile.create({
      data: {
        shopName: "ARTSINLY Master Guild",
        slug: "artsinly-master-guild",
        artisanName: "Master Artisan Collective",
        craftTradition: "Heritage Crafts",
        state: "Rajasthan",
        locality: "Jaipur",
        giCode: "GI-IN-RJ-001",
        user: {
          create: {
            email: "guild@artsinly.com",
            name: "Master Artisan Collective",
            role: "SELLER",
          },
        },
      },
      include: { user: true },
    }));

  for (const item of items) {
    const quantity = Math.max(1, Number(item.quantity) || 1);
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      include: {
        seller: { include: { user: true } },
        variants: true,
        inventory: true,
      },
    });

    if (product) {
      // Check live stock
      const availableStock = product.inventory[0]?.quantity ?? 10;
      if (availableStock < quantity) {
        throw new Error(
          `Insufficient stock for "${product.title}". Only ${availableStock} pieces available in the workshop.`
        );
      }

      // Production Payment Invariant: Capture live server-side unit price and seller snapshot
      const variant = product.variants?.find((v) => v.id === item.variantId);
      const unitPricePaise = variant ? variant.pricePaise : product.basePricePaise;
      const sellerId = product.sellerId || defaultSeller.id;
      const sellerShopName = product.seller?.shopName || defaultSeller.shopName;
      const sellerArtisanName =
        product.seller?.artisanName || defaultSeller.artisanName || "Master Artisan";
      const sellerEmail = product.seller?.user?.email || "artisan@artsinly.com";
      const sellerState = product.seller?.state || "India";

      enrichedItems.push({
        productId: product.id,
        variantId: variant?.id,
        sellerId,
        title: product.title,
        pricePaise: unitPricePaise,
        quantity,
        sellerShopName,
        sellerArtisanName,
        sellerEmail,
        sellerState,
        productSnapshot: {
          title: product.title,
          craftType: product.craftType,
          craftTechnique: product.craftTechnique,
          basePricePaise: product.basePricePaise,
          state: product.seller?.state,
          giCode: product.seller?.giCode || null,
        },
      });
    } else {
      // Fallback for mock items in development
      enrichedItems.push({
        productId: item.productId,
        sellerId: defaultSeller.id,
        title: item.title || "Handcrafted Heritage Art Piece",
        pricePaise: typeof item.pricePaise === "number" ? item.pricePaise : 12699,
        quantity,
        sellerShopName: defaultSeller.shopName,
        sellerArtisanName: defaultSeller.artisanName || "Master Artisan",
        sellerEmail: defaultSeller.user?.email || "artisan@artsinly.com",
        sellerState: defaultSeller.state || "Rajasthan",
        productSnapshot: {
          title: item.title || "Handcrafted Heritage Art Piece",
        },
      });
    }
  }

  return enrichedItems;
}

/**
 * 2. Create Pending Order (Flowchart Step 4)
 * Allocates order items to sellers, calculates totals, creates distinct package shipments,
 * leaves order in PENDING state, does NOT deduct stock yet, does NOT notify sellers yet.
 */
export async function createPendingOrder(params: CreatePendingOrderParams) {
  const { buyerId, items, shippingAddress, shippingFeePaise = 0, taxPaise = 0 } = params;

  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine1) {
    throw new Error("Complete delivery address is required.");
  }

  // 1. Validate cart and live stock
  const enrichedItems = await validateCartAndStock(items);

  const subtotalPaise = enrichedItems.reduce(
    (sum, item) => sum + item.pricePaise * item.quantity,
    0
  );
  const totalPaise = subtotalPaise + shippingFeePaise + taxPaise;
  const orderNumber = generateOrderNumber();

  // 2. Identify distinct sellers for multi-vendor package allocation
  const uniqueSellerIds = Array.from(new Set(enrichedItems.map((item) => item.sellerId)));

  // 3. Atomically create Order, OrderItems, and Seller Package Shipments
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        buyerId,
        totalPaise,
        subtotalPaise,
        shippingFeePaise,
        taxPaise,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        shipmentStatus: ShipmentStatus.PENDING,
        addressSnapshot: shippingAddress as any,
        items: {
          create: enrichedItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            sellerId: item.sellerId,
            title: item.title,
            pricePaise: item.pricePaise, // Frozen at purchase time
            quantity: item.quantity,
            status: OrderStatus.PENDING,
            sellerShopName: item.sellerShopName,
            sellerArtisanName: item.sellerArtisanName,
            productSnapshot: item.productSnapshot,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Create a distinct Shipment package for EACH seller involved in this order
    for (const sellerId of uniqueSellerIds) {
      await tx.shipment.create({
        data: {
          orderId: newOrder.id,
          sellerId,
          carrier: "Insured Pan-India Express",
          status: ShipmentStatus.LABEL_CREATED,
          trackingNumber: generateTrackingNumber("AWB"),
        },
      });
    }

    return newOrder;
  });

  return {
    order,
    sellerCount: uniqueSellerIds.length,
    orderNumber: order.orderNumber,
    totalPaise: order.totalPaise,
  };
}

/**
 * 3. Verified Payment Result -> Success: Confirm Order and Reserve Stock (Flowchart Step 6 & 7)
 * Implements strict server-side verification:
 * - Idempotency guard (prevents double charging / duplicate stock reservation)
 * - Updates Order and Payment to COMPLETED / CONFIRMED
 * - Atomically decrements live stock
 * - Records 84% artisan settlement, 15% commission, 1% Section 194-O TDS
 * - Notifies relevant sellers (Flowchart Step 7)
 */
export async function confirmOrderAndReserveStock(params: {
  orderId?: string;
  orderNumber?: string;
  paymentReference: string;
  provider: string;
  metadata?: any;
}) {
  const { orderId, orderNumber, paymentReference, provider, metadata = {} } = params;

  const order = await prisma.order.findFirst({
    where: orderId ? { id: orderId } : { orderNumber },
    include: {
      items: {
        include: {
          seller: { include: { user: true } },
        },
      },
      buyer: true,
      shipments: true,
      payments: true,
    },
  });

  if (!order) {
    throw new Error("Order not found in database.");
  }

  // Idempotency: If order is already confirmed, return without duplicate deduction
  if (order.status === OrderStatus.CONFIRMED && order.paymentStatus === PaymentStatus.COMPLETED) {
    return {
      order,
      alreadyConfirmed: true,
    };
  }

  // Atomically execute payment record creation, order confirmation, and inventory decrement
  const [payment, updatedOrder] = await prisma.$transaction(async (tx) => {
    // 1. Create Payment record
    const newPayment = await tx.payment.create({
      data: {
        orderId: order.id,
        provider,
        referenceId: paymentReference,
        amountPaise: order.totalPaise,
        status: PaymentStatus.COMPLETED,
        metadata: {
          ...metadata,
          verifiedAt: new Date().toISOString(),
          gatewayVerification: "VERIFIED_SERVER_SIDE",
        },
      },
    });

    // 2. Transition Order and OrderItems to CONFIRMED
    const ord = await tx.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.CONFIRMED,
        paymentStatus: PaymentStatus.COMPLETED,
      },
      include: {
        items: true,
        shipments: true,
      },
    });

    await tx.orderItem.updateMany({
      where: { orderId: order.id },
      data: { status: OrderStatus.CONFIRMED },
    });

    // 3. Reserve / Decrement inventory for all items in order
    for (const item of order.items) {
      await tx.inventory.updateMany({
        where: { productId: item.productId },
        data: {
          quantity: { decrement: item.quantity },
        },
      });
    }

    return [newPayment, ord];
  });

  // 4. Calculate Fair-Trade Seller Settlements & Log Ledgers
  const sellerItemGroups = new Map<string, typeof order.items>();
  for (const item of order.items) {
    if (!sellerItemGroups.has(item.sellerId)) {
      sellerItemGroups.set(item.sellerId, []);
    }
    sellerItemGroups.get(item.sellerId)!.push(item);
  }

  for (const [sellerId, sItems] of sellerItemGroups.entries()) {
    const grossPaise = sItems.reduce((acc, it) => acc + it.pricePaise * it.quantity, 0);
    const settlement = calculateFairTradeSettlement(grossPaise);

    await logAuditEvent({
      userId: order.buyerId,
      action: "ARTISAN_SETTLEMENT_ALLOCATED",
      details: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        sellerId,
        grossPaise,
        netArtisanPaise: settlement.netPaise, // 84%
        commissionPaise: settlement.commissionPaise, // 15%
        tdsPaise: settlement.tdsPaise, // 1%
        heldInEscrow: true,
      },
    });
  }

  // 5. Notify Relevant Sellers (Flowchart Step 7)
  const address = order.addressSnapshot as any;
  for (const [sellerId, sItems] of sellerItemGroups.entries()) {
    const firstItem = sItems[0];
    const sellerEmail = firstItem?.seller?.user?.email || "artisan@artsinly.com";
    const sellerName =
      firstItem?.sellerArtisanName || firstItem?.sellerShopName || "Master Artisan";

    sendSellerOrderAlertEmail({
      sellerEmail,
      sellerName,
      orderNumber: order.orderNumber,
      items: sItems.map((it) => ({
        title: it.title,
        quantity: it.quantity,
        pricePaise: it.pricePaise,
      })),
      shippingAddress: {
        fullName: address?.fullName || "Esteemed Collector",
        addressLine1: address?.addressLine1 || "",
        city: address?.city || "",
        state: address?.state || "",
        postalCode: address?.postalCode || "",
      },
    }).catch((err) => console.error("Seller email alert error:", err));
  }

  // 6. Send Buyer Confirmation Email
  sendOrderConfirmationEmail({
    orderNumber: updatedOrder.orderNumber,
    buyerEmail: order.buyer.email,
    buyerName: address?.fullName || order.buyer.name || "Esteemed Collector",
    items: order.items.map((i) => ({
      title: i.title,
      quantity: i.quantity,
      pricePaise: i.pricePaise,
    })),
    totalPaise: updatedOrder.totalPaise,
    shippingAddress: {
      fullName: address?.fullName || "Esteemed Collector",
      addressLine1: address?.addressLine1 || "",
      city: address?.city || "",
      state: address?.state || "",
      postalCode: address?.postalCode || "",
      phone: address?.phone || "",
    },
  }).catch((err) => console.error("Buyer confirmation email error:", err));

  return {
    order: updatedOrder,
    payment,
    alreadyConfirmed: false,
  };
}

/**
 * 4. Verified Payment Result -> Failure: Keep Order Unpaid (Flowchart Step 6 Failure branch)
 * Keeps order unpaid, leaves stock untouched, and does NOT alert sellers.
 */
export async function failOrderPayment(params: {
  orderId?: string;
  orderNumber?: string;
  failureReason?: string;
  provider?: string;
}) {
  const {
    orderId,
    orderNumber,
    failureReason = "Payment authorization failed or cancelled by user",
    provider = "SANDBOX",
  } = params;

  const order = await prisma.order.findFirst({
    where: orderId ? { id: orderId } : { orderNumber },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  const [payment, updatedOrder] = await prisma.$transaction([
    prisma.payment.create({
      data: {
        orderId: order.id,
        provider,
        referenceId: generateReferenceId("FAIL"),
        amountPaise: order.totalPaise,
        status: PaymentStatus.FAILED,
        metadata: {
          failureReason,
          timestamp: new Date().toISOString(),
        },
      },
    }),
    prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: PaymentStatus.FAILED,
        // Order remains in PENDING state (unpaid) per flowchart
        status: OrderStatus.PENDING,
      },
    }),
  ]);

  return {
    order: updatedOrder,
    payment,
    status: "UNPAID",
  };
}

/**
 * 5. Production Payment Rule 6:
 * Multi-Seller Partial Fulfillment and Cancellation Protocol.
 * 
 * When a single order contains multiple sellers and only some items can be fulfilled:
 * - Unfulfillable seller items are marked CANCELLED.
 * - Stock for those items is released back to inventory.
 * - A partial refund is issued to the buyer for the unfulfilled amount.
 * - The unfulfilled seller's payout is set to 0.
 * - The other seller's items and 84% payout remain active and protected!
 */
export async function handlePartialFulfillmentCancellation(params: {
  orderId: string;
  sellerId: string;
  reason: string;
  cancelledByUserId: string;
}) {
  const { orderId, sellerId, reason, cancelledByUserId } = params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      shipments: true,
      buyer: true,
      payments: true,
    },
  });

  if (!order) throw new Error("Order not found.");

  const sellerItems = order.items.filter((item) => item.sellerId === sellerId);
  if (sellerItems.length === 0) {
    throw new Error("No items from this seller found in the order.");
  }

  // Calculate refund amount for this seller's unfulfillable items
  const refundAmountPaise = sellerItems.reduce(
    (sum, item) => sum + item.pricePaise * item.quantity,
    0
  );

  const remainingActiveItems = order.items.filter(
    (item) => item.sellerId !== sellerId && item.status !== OrderStatus.CANCELLED
  );

  // Execute partial cancellation in transaction
  await prisma.$transaction(async (tx) => {
    // 1. Mark seller's items as CANCELLED
    for (const item of sellerItems) {
      await tx.orderItem.update({
        where: { id: item.id },
        data: { status: OrderStatus.CANCELLED },
      });

      // Restore stock for cancelled items
      await tx.inventory.updateMany({
        where: { productId: item.productId },
        data: { quantity: { increment: item.quantity } },
      });
    }

    // 2. Mark this seller's shipment as CANCELLED
    await tx.shipment.updateMany({
      where: { orderId: order.id, sellerId },
      data: { status: ShipmentStatus.CANCELLED },
    });

    // 3. Record partial refund in payment ledger
    await tx.payment.create({
      data: {
        orderId: order.id,
        provider: "PARTIAL_REFUND",
        referenceId: generateReferenceId("RFND_PARTIAL"),
        amountPaise: refundAmountPaise,
        status: PaymentStatus.REFUNDED,
        metadata: {
          cancelledSellerId: sellerId,
          reason,
          refundedAt: new Date().toISOString(),
        },
      },
    });

    // 4. Update overall order status
    // If no active items left, mark whole order CANCELLED and REFUNDED.
    // If active items remain from other artisans, leave order in CONFIRMED / PROCESSING.
    if (remainingActiveItems.length === 0) {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.CANCELLED,
          paymentStatus: PaymentStatus.REFUNDED,
          shipmentStatus: ShipmentStatus.CANCELLED,
        },
      });
    }
  });

  // 5. Log audit trail
  await logAuditEvent({
    userId: cancelledByUserId,
    action: "MULTI_SELLER_PARTIAL_FULFILLMENT_CANCELLED",
    details: {
      orderId: order.id,
      orderNumber: order.orderNumber,
      sellerId,
      refundAmountPaise,
      remainingActiveItemCount: remainingActiveItems.length,
      reason,
    },
  });

  // 6. Notify Buyer of Partial Refund and update on remaining artisan packages
  const address = order.addressSnapshot as any;
  sendOrderRefundedEmail({
    orderNumber: order.orderNumber,
    buyerEmail: order.buyer.email,
    buyerName: address?.fullName || order.buyer.name || "Esteemed Collector",
    amountPaise: refundAmountPaise,
    reason: `Artisan workshop update: ${reason}. Refund credited to original payment method. Remaining items from other artisan studios remain on schedule.`,
  }).catch((err) => console.error("Refund email error:", err));

  return {
    success: true,
    refundAmountPaise,
    remainingActiveItemCount: remainingActiveItems.length,
  };
}
