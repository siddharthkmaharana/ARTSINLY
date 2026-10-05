import { prisma } from "@/lib/prisma";
import { ProductVariant } from "@prisma/client";

export interface CreateVariantInput {
  productId: string;
  sku: string;
  name: string;
  colorName?: string;
  colorHex?: string;
  sizeOption?: string;
  materialOption?: string;
  pricePaise: number;
  compareAtPricePaise?: number;
  isDefault?: boolean;
  initialStock?: number;
}

export interface UpdateVariantInput {
  name?: string;
  sku?: string;
  colorName?: string;
  colorHex?: string;
  sizeOption?: string;
  materialOption?: string;
  pricePaise?: number;
  compareAtPricePaise?: number;
  isDefault?: boolean;
}

/**
 * Get all variants for a given product
 */
export async function getVariantsByProduct(productId: string) {
  return prisma.productVariant.findMany({
    where: { productId },
    include: {
      inventory: true,
    },
    orderBy: { pricePaise: "asc" },
  });
}

/**
 * Get variant by unique ID
 */
export async function getVariantById(id: string) {
  return prisma.productVariant.findUnique({
    where: { id },
    include: {
      product: true,
      inventory: true,
    },
  });
}

/**
 * Get variant by SKU
 */
export async function getVariantBySku(sku: string) {
  return prisma.productVariant.findUnique({
    where: { sku },
    include: {
      product: true,
      inventory: true,
    },
  });
}

/**
 * Create a new product variant with automated inventory allocation
 */
export async function createVariant(
  data: CreateVariantInput
): Promise<ProductVariant> {
  const { initialStock = 0, ...variantData } = data;

  return prisma.$transaction(async (tx) => {
    // If setting as default, reset other variants' isDefault flag
    if (variantData.isDefault) {
      await tx.productVariant.updateMany({
        where: { productId: variantData.productId },
        data: { isDefault: false },
      });
    }

    const variant = await tx.productVariant.create({
      data: variantData,
    });

    // Create corresponding inventory record
    await tx.inventory.create({
      data: {
        productId: variant.productId,
        variantId: variant.id,
        quantity: initialStock,
        sku: variant.sku,
      },
    });

    return variant;
  });
}

/**
 * Update variant details
 */
export async function updateVariant(
  id: string,
  data: UpdateVariantInput
): Promise<ProductVariant> {
  return prisma.productVariant.update({
    where: { id },
    data,
  });
}

/**
 * Delete a product variant
 */
export async function deleteVariant(id: string): Promise<ProductVariant> {
  return prisma.productVariant.delete({
    where: { id },
  });
}
