import { prisma } from "@/lib/prisma";
import { Order, OrderStatus } from "@prisma/client";

export interface CreateOrderItemInput {
  productId: string;
  variantId?: string;
  sellerId: string;
  title: string;
  pricePaise: number;
  quantity: number;
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
 * Generate unique editorial order number (e.g. ARTSINLY-2026-X8F2Q)
 */
function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ART-${year}-${randomStr}`;
}

/**
 * Create a new order, order items, deduct inventory, and optionally empty the buyer's cart
 */
export async function createOrder(data: CreateOrderInput): Promise<Order> {
  const { buyerId, items, shippingAddress, shippingFeePaise = 0, taxPaise = 0 } = data;

  const subtotalPaise = items.reduce(
    (sum, item) => sum + item.pricePaise * item.quantity,
    0
  );
  const totalPaise = subtotalPaise + shippingFeePaise + taxPaise;

  return prisma.$transaction(async (tx) => {
    // 1. Create the order
    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        buyerId,
        totalPaise,
        subtotalPaise,
        shippingFeePaise,
        taxPaise,
        addressSnapshot: shippingAddress,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            sellerId: item.sellerId,
            title: item.title,
            pricePaise: item.pricePaise,
            quantity: item.quantity,
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
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Update order status (SHIPPED, DELIVERED, CANCELLED, etc.)
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
