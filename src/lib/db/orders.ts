import { prisma } from "@/lib/prisma";
import { Order, OrderStatus, PaymentStatus, ShipmentStatus } from "@prisma/client";
import { generateOrderNumber } from "@/lib/id";

export interface CreateOrderItemInput {
  productId: string;
  variantId?: string;
  sellerId: string;
  title: string;
  pricePaise: number; // Unit price snapshotted at purchase time
  quantity: number;
  sellerShopName?: string;
  sellerArtisanName?: string;
  productSnapshot?: any;
}

export interface CreateOrderInput {
  buyerId: string;
  items: CreateOrderItemInput[];
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
    phone: string;
  };
  shippingFeePaise?: number;
  taxPaise?: number;
}

/**
 * Create a new order, order items, deduct inventory, and optionally empty the buyer's cart.
 * Strict Database Invariants:
 * 1. Saves unit price and seller snapshot on each OrderItem at purchase time.
 * 2. Initializes paymentStatus, orderStatus, and shipmentStatus separately.
 */
export async function createOrder(data: CreateOrderInput): Promise<Order> {
  const { buyerId, items, shippingAddress, shippingFeePaise = 0, taxPaise = 0 } = data;

  const subtotalPaise = items.reduce(
    (sum, item) => sum + item.pricePaise * item.quantity,
    0
  );
  const totalPaise = subtotalPaise + shippingFeePaise + taxPaise;

  return prisma.$transaction(async (tx) => {
    // 1. Create the order with segregated status trackers
    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        buyerId,
        totalPaise,
        subtotalPaise,
        shippingFeePaise,
        taxPaise,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        shipmentStatus: ShipmentStatus.PENDING,
        addressSnapshot: shippingAddress,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            sellerId: item.sellerId,
            title: item.title,
            pricePaise: item.pricePaise, // Immutable unit price at purchase time
            quantity: item.quantity,
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

    // 2. Adjust inventory for each purchased item
    for (const item of items) {
      const where = item.variantId
        ? { variantId: item.variantId }
        : { productId: item.productId };

      await tx.inventory.updateMany({
        where,
        data: {
          quantity: { decrement: item.quantity },
        },
      });
    }

    // 3. Clear user's active cart
    const userCart = await tx.cart.findUnique({
      where: { userId: buyerId },
    });
    if (userCart) {
      await tx.cartItem.deleteMany({
        where: { cartId: userCart.id },
      });
    }

    return order;
  });
}

/**
 * Get order by ID with complete relations
 */
export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true } },
            },
          },
          variant: true,
          seller: true,
        },
      },
      buyer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      payments: true,
      shipments: true,
    },
  });
}

/**
 * Get order by unique order number
 */
export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
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
      buyer: true,
      payments: true,
      shipments: true,
    },
  });
}

/**
 * Get orders placed by a specific buyer
 */
export async function getOrdersByBuyer(buyerId: string) {
  return prisma.order.findMany({
    where: { buyerId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true } },
            },
          },
        },
      },
      shipments: true,
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Update order lifecycle status (CONFIRMED, PROCESSING, CANCELLED, REFUNDED, etc.)
 * Strictly maintains payment and shipment status independently.
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<Order> {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
}

/**
 * Update financial payment status (PENDING, AUTHORIZED, COMPLETED, FAILED, REFUNDED)
 * strictly separate from order lifecycle and logistics shipment.
 */
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus
): Promise<Order> {
  return prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus },
  });
}

/**
 * Update logistics shipment status (PENDING, LABEL_CREATED, IN_TRANSIT, DELIVERED, etc.)
 * strictly separate from order lifecycle and payment settlement.
 */
export async function updateShipmentStatus(
  orderId: string,
  shipmentStatus: ShipmentStatus
): Promise<Order> {
  return prisma.order.update({
    where: { id: orderId },
    data: { shipmentStatus },
  });
}

/**
 * Retrieve immutable historical order snapshot
 * Guarantees purchase-time unit prices and seller identity are intact even if products were subsequently edited.
 */
export async function getHistoricalOrderSnapshot(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      paymentStatus: true,
      shipmentStatus: true,
      totalPaise: true,
      subtotalPaise: true,
      shippingFeePaise: true,
      taxPaise: true,
      addressSnapshot: true,
      createdAt: true,
      items: {
        select: {
          id: true,
          productId: true,
          title: true,
          pricePaise: true, // Immutable historical price at purchase
          quantity: true,
          sellerId: true, // Immutable seller at purchase
          sellerShopName: true,
          sellerArtisanName: true,
        },
      },
    },
  });
}
