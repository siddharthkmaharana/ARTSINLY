import { prisma } from "@/lib/prisma";
import { Inventory } from "@prisma/client";

/**
 * Get inventory details for a product or specific variant
 */
export async function getInventory(productId: string, variantId?: string) {
  if (variantId) {
    return prisma.inventory.findUnique({
      where: { variantId },
    });
  }

  return prisma.inventory.findUnique({
    where: { productId },
  });
}

/**
 * Check if the requested quantity is available in stock
 */
export async function checkStockAvailability(
  productId: string,
  requestedQuantity: number,
  variantId?: string
): Promise<{ isAvailable: boolean; availableQuantity: number }> {
  const inventory = await getInventory(productId, variantId);

  if (!inventory) {
    return { isAvailable: false, availableQuantity: 0 };
  }

  const available = inventory.quantity - inventory.reservedQuantity;
  return {
    isAvailable: available >= requestedQuantity,
    availableQuantity: Math.max(0, available),
  };
}

/**
 * Adjust stock level (add or set quantity)
 */
export async function adjustStock(
  productId: string,
  quantityChange: number,
  variantId?: string
): Promise<Inventory> {
  const where = variantId ? { variantId } : { productId };

  return prisma.inventory.update({
    where,
    data: {
      quantity: {
        increment: quantityChange,
      },
    },
  });
}

/**
 * Reserve stock for an order being processed / in checkout
 */
export async function reserveStock(
  productId: string,
  quantity: number,
  variantId?: string
): Promise<boolean> {
  const where = variantId ? { variantId } : { productId };

  const result = await prisma.inventory.updateMany({
    where: {
      ...where,
      quantity: {
        gte: prisma.inventory.fields.reservedQuantity, // ensure stock >= reserved
      },
    },
    data: {
      reservedQuantity: {
        increment: quantity,
      },
    },
  });

  return result.count > 0;
}

/**
 * Release reserved stock if checkout is cancelled or payment fails
 */
export async function releaseReservedStock(
  productId: string,
  quantity: number,
  variantId?: string
): Promise<Inventory> {
  const where = variantId ? { variantId } : { productId };

  return prisma.inventory.update({
    where,
    data: {
      reservedQuantity: {
        decrement: quantity,
      },
    },
  });
}

/**
 * Commit stock deduction after successful order placement
 */
export async function commitStockDeduction(
  productId: string,
  quantity: number,
  variantId?: string
): Promise<Inventory> {
  const where = variantId ? { variantId } : { productId };

  return prisma.inventory.update({
    where,
    data: {
      quantity: {
        decrement: quantity,
      },
      reservedQuantity: {
        decrement: quantity,
      },
    },
  });
}
