import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";
import { rupeesToPaise } from "@/lib/money";
import { fallbackSellerProducts, VALID_PRODUCT_STATUSES } from "../route";
import { ProductStatus } from "@prisma/client";
import { generateSecureId } from "@/lib/id";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function getFallbackStore(): any[] {
  return (globalThis as any).__artsinly_seller_products || fallbackSellerProducts;
}

async function withDbTimeout<T>(promise: Promise<T>, ms = 2000): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("DB_TIMEOUT")), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

/**
 * Helper to authenticate seller session
 */
async function authenticateSeller(req: NextRequest) {
  const token =
    req.cookies.get("artsinly_token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) return null;

  const payload = verifySessionToken(token);
  if (!payload) return null;

  try {
    const seller = await withDbTimeout(
      prisma.sellerProfile.findUnique({
        where: { userId: payload.userId },
      }),
      1500
    );
    if (seller) return seller;
  } catch {
    // Database offline
  }

  // Fallback seller profile linked to the authenticated user ID
  return {
    id: payload.userId === "cmvdxyd9c000lqwxwurax8s29" ? "cmvdxyd9c000lqwxwurax8s29" : `seller_${payload.userId}`,
    userId: payload.userId,
    shopName: "Devendra Terracotta Studio",
    artisanName: "Devendra Kumbhar",
    craftTradition: "Terracotta Pottery",
    state: "Gujarat",
    locality: "Kutch",
    giCode: "GI-IN-GJ-449",
  };
}

/**
 * GET /api/seller/products/[id]
 * Retrieves product details with strict ownership verification
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const seller = await authenticateSeller(req);
    if (!seller) {
      return NextResponse.json({ error: "Unauthorized: Missing authentication" }, { status: 401 });
    }

    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          images: { orderBy: { displayOrder: "asc" } },
          variants: true,
          inventory: true,
          category: true,
          region: true,
        },
      });

      if (product) {
        // Strict Authorization: seller can only view their own products
        if (product.sellerId !== seller.id) {
          return NextResponse.json(
            { error: "Forbidden: You are not authorized to view this product" },
            { status: 403 }
          );
        }
        return NextResponse.json({ product });
      }
    } catch {
      // Database offline fallback
    }

    const fallback = getFallbackStore().find((p: any) => p.id === id);
    if (fallback) {
      if (fallback.sellerId !== seller.id) {
        return NextResponse.json(
          { error: "Forbidden: You are not authorized to view this product" },
          { status: 403 }
        );
      }
      return NextResponse.json({ product: fallback });
    }

    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  } catch (error: any) {
    console.error("Seller product GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

/**
 * PUT/PATCH /api/seller/products/[id]
 * Updates product details with server-side validation and authorization
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const seller = await authenticateSeller(req);
    if (!seller) {
      return NextResponse.json({ error: "Unauthorized: Missing authentication" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      productName,
      description,
      craftType,
      craftCategory,
      craftTechnique,
      regionOfOrigin,
      provenanceTag,
      price,
      imageUrl,
      images, // Multiple images array
      stock,
      availableQuantity,
      quantity,
      isMadeToOrder,
      leadTimeDays,
      dimensions,
      materials,
      weight,
      shippingWeightGrams,
      careInstructions,
      authenticityDetails,
      giCode,
      status,
      variants, // Variants array
    } = body;

    const actualTitle = title ?? productName;
    const actualCraft = craftCategory ?? craftType;
    const actualRegion = regionOfOrigin ?? provenanceTag;
    const stockVal = stock ?? availableQuantity ?? quantity;

    let pricePaise: number | undefined;
    if (price !== undefined && price !== null && price !== "") {
      try {
        pricePaise = rupeesToPaise(price);
      } catch (err: any) {
        return NextResponse.json(
          { error: `Invalid price amount: ${err.message}` },
          { status: 400 }
        );
      }
    }

    // Status validation
    let finalStatus: ProductStatus | undefined;
    if (status) {
      const upperStatus = String(status).toUpperCase() as ProductStatus;
      if (VALID_PRODUCT_STATUSES.includes(upperStatus)) {
        finalStatus = upperStatus;
      }
    }

    const parsedLeadTime = leadTimeDays !== undefined
      ? Math.max(0, parseInt(String(leadTimeDays), 10) || 0)
      : undefined;

    const parsedShippingWeight = shippingWeightGrams !== undefined && shippingWeightGrams !== null && shippingWeightGrams !== ""
      ? Math.max(0, parseInt(String(shippingWeightGrams), 10) || 0)
      : undefined;

    try {
      // 1. Fetch existing product to verify existence and strict ownership
      const existing = await withDbTimeout(
        prisma.product.findUnique({
          where: { id },
          include: { inventory: true, variants: true, images: true },
        }),
        1500
      );

      if (existing) {
        // Strict Authorization check
        if (existing.sellerId !== seller.id) {
          return NextResponse.json(
            { error: "Forbidden: You are not authorized to modify products belonging to another artisan." },
            { status: 403 }
          );
        }

        const updated = await prisma.$transaction(async (tx) => {
          // Prepare image mutations if images provided
          let imagesUpdate: any = undefined;
          if (Array.isArray(images) && images.length > 0) {
            imagesUpdate = {
              deleteMany: {},
              create: images.map((img: any, idx: number) => ({
                url: typeof img === "string" ? img : img.url,
                altText: (typeof img === "object" ? img.altText : null) || actualTitle || existing.title,
                isPrimary: typeof img === "object" ? Boolean(img.isPrimary) : idx === 0,
                displayOrder: typeof img === "object" && typeof img.displayOrder === "number" ? img.displayOrder : idx,
              })),
            };
          } else if (imageUrl) {
            imagesUpdate = {
              deleteMany: {},
              create: [
                {
                  url: imageUrl,
                  altText: actualTitle || existing.title,
                  isPrimary: true,
                  displayOrder: 0,
                },
              ],
            };
          }

          // 1. Update product root fields
          const prod = await tx.product.update({
            where: { id },
            data: {
              title: actualTitle ?? existing.title,
              description: description ?? existing.description,
              craftType: actualCraft ?? existing.craftType,
              craftTechnique: craftTechnique !== undefined ? craftTechnique : existing.craftTechnique,
              provenanceTag: actualRegion ?? existing.provenanceTag,
              giCode: giCode !== undefined ? giCode : existing.giCode,
              authenticityDetails: authenticityDetails !== undefined ? authenticityDetails : existing.authenticityDetails,
              dimensions: dimensions !== undefined ? dimensions : existing.dimensions,
              materials: materials !== undefined ? materials : existing.materials,
              weight: weight !== undefined ? weight : existing.weight,
              shippingWeightGrams: parsedShippingWeight !== undefined ? parsedShippingWeight : existing.shippingWeightGrams,
              careInstructions: careInstructions !== undefined ? careInstructions : existing.careInstructions,
              isMadeToOrder: isMadeToOrder !== undefined ? Boolean(isMadeToOrder) : existing.isMadeToOrder,
              leadTimeDays: parsedLeadTime !== undefined ? parsedLeadTime : existing.leadTimeDays,
              basePricePaise: pricePaise ?? existing.basePricePaise,
              status: finalStatus ?? existing.status,
              images: imagesUpdate,
            },
            include: {
              images: { orderBy: { displayOrder: "asc" } },
              inventory: true,
              variants: true,
              category: true,
              region: true,
            },
          });

          // 2. Update variants if provided
          if (Array.isArray(variants) && variants.length > 0) {
            // Delete old variants and inventory
            await tx.inventory.deleteMany({ where: { productId: id } });
            await tx.productVariant.deleteMany({ where: { productId: id } });

            for (const v of variants) {
              let vPricePaise = pricePaise ?? existing.basePricePaise;
              if (v.price !== undefined && v.price !== null && v.price !== "") {
                try {
                  vPricePaise = rupeesToPaise(v.price);
                } catch {
                  vPricePaise = pricePaise ?? existing.basePricePaise;
                }
              } else if (v.pricePaise) {
                vPricePaise = parseInt(String(v.pricePaise), 10) || vPricePaise;
              }

              const vStock = isMadeToOrder
                ? 0
                : Math.max(0, parseInt(String(v.stock ?? v.quantity ?? stockVal ?? 1), 10) || 0);

              const createdVar = await tx.productVariant.create({
                data: {
                  productId: id,
                  sku: (v.sku || `${existing.slug.substring(0, 8).toUpperCase()}-${generateSecureId(undefined, 2)}`).trim(),
                  name: (v.name || "Edition").trim(),
                  colorName: v.colorName || undefined,
                  colorHex: v.colorHex || undefined,
                  sizeOption: v.sizeOption || undefined,
                  pricePaise: vPricePaise,
                  isDefault: Boolean(v.isDefault),
                },
              });

              await tx.inventory.create({
                data: {
                  productId: id,
                  variantId: createdVar.id,
                  quantity: vStock,
                  reservedQuantity: 0,
                  sku: createdVar.sku,
                },
              });
            }
          } else {
            // Update default variant price if price changed
            if (pricePaise !== undefined) {
              await tx.productVariant.updateMany({
                where: { productId: id, isDefault: true },
                data: { pricePaise },
              });
            }

            // Update inventory stock if specified
            if (stockVal !== undefined) {
              const stockNum = Math.max(0, parseInt(String(stockVal), 10) || 0);
              const inv = existing.inventory[0];
              if (inv) {
                await tx.inventory.update({
                  where: { id: inv.id },
                  data: { quantity: isMadeToOrder ? 0 : stockNum },
                });
              } else {
                await tx.inventory.create({
                  data: {
                    productId: id,
                    quantity: isMadeToOrder ? 0 : stockNum,
                    reservedQuantity: 0,
                  },
                });
              }
            }
          }

          return tx.product.findUnique({
            where: { id },
            include: {
              images: { orderBy: { displayOrder: "asc" } },
              inventory: true,
              variants: true,
              category: true,
              region: true,
            },
          });
        });

        return NextResponse.json({ success: true, product: updated });
      }
    } catch {
      // Database offline fallback
    }

    // Fallback store update with strict authorization check
    const store = getFallbackStore();
    const fallbackIdx = store.findIndex((p: any) => p.id === id);
    if (fallbackIdx >= 0) {
      const current = store[fallbackIdx];
      // Strict ownership check
      if (current.sellerId !== seller.id) {
        return NextResponse.json(
          { error: "Forbidden: You are not authorized to modify products belonging to another artisan." },
          { status: 403 }
        );
      }

      const updatedPaise = pricePaise ?? current.basePricePaise;
      const updatedStock = isMadeToOrder
        ? 0
        : stockVal !== undefined
        ? Math.max(0, parseInt(String(stockVal), 10) || 0)
        : current.inventory[0]?.quantity ?? 1;

      let updatedImages = current.images;
      if (Array.isArray(images) && images.length > 0) {
        updatedImages = images.map((img: any, idx: number) => ({
          id: img.id || generateSecureId("img_"),
          url: typeof img === "string" ? img : img.url,
          altText: (typeof img === "object" ? img.altText : null) || actualTitle || current.title,
          isPrimary: typeof img === "object" ? Boolean(img.isPrimary) : idx === 0,
          displayOrder: typeof img === "object" && typeof img.displayOrder === "number" ? img.displayOrder : idx,
        }));
      } else if (imageUrl) {
        updatedImages = [
          {
            id: generateSecureId("img_"),
            url: imageUrl,
            altText: actualTitle ?? current.title,
            isPrimary: true,
            displayOrder: 0,
          },
        ];
      }

      let updatedVariants = current.variants;
      if (Array.isArray(variants) && variants.length > 0) {
        updatedVariants = variants.map((v: any, idx: number) => ({
          id: v.id || generateSecureId("var_"),
          name: v.name || `Variant ${idx + 1}`,
          sku: v.sku || `${current.slug.substring(0, 8).toUpperCase()}-V${idx + 1}`,
          colorName: v.colorName || null,
          colorHex: v.colorHex || null,
          sizeOption: v.sizeOption || null,
          pricePaise: v.price ? rupeesToPaise(v.price) : (v.pricePaise || updatedPaise),
          isDefault: Boolean(v.isDefault ?? idx === 0),
          stock: isMadeToOrder ? 0 : (v.stock || updatedStock),
        }));
      } else if (pricePaise !== undefined) {
        updatedVariants = [
          {
            ...current.variants[0],
            pricePaise: updatedPaise,
          },
        ];
      }

      const updatedProd = {
        ...current,
        title: actualTitle ?? current.title,
        craftType: actualCraft ?? current.craftType,
        craftTechnique: craftTechnique !== undefined ? craftTechnique : current.craftTechnique,
        provenanceTag: actualRegion ?? current.provenanceTag,
        description: description ?? current.description,
        dimensions: dimensions !== undefined ? dimensions : current.dimensions,
        materials: materials !== undefined ? materials : current.materials,
        weight: weight !== undefined ? weight : current.weight,
        shippingWeightGrams: parsedShippingWeight !== undefined ? parsedShippingWeight : current.shippingWeightGrams,
        careInstructions: careInstructions !== undefined ? careInstructions : current.careInstructions,
        authenticityDetails: authenticityDetails !== undefined ? authenticityDetails : current.authenticityDetails,
        giCode: giCode !== undefined ? giCode : current.giCode,
        isMadeToOrder: isMadeToOrder !== undefined ? Boolean(isMadeToOrder) : current.isMadeToOrder,
        leadTimeDays: parsedLeadTime !== undefined ? parsedLeadTime : current.leadTimeDays,
        basePricePaise: updatedPaise,
        status: finalStatus ?? current.status,
        updatedAt: new Date().toISOString(),
        images: updatedImages,
        variants: updatedVariants,
        inventory: [
          {
            ...current.inventory[0],
            quantity: updatedStock,
          },
        ],
      };
      store[fallbackIdx] = updatedProd;
      return NextResponse.json({ success: true, product: updatedProd });
    }

    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  } catch (error: any) {
    console.error("Seller product update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/seller/products/[id]
 * Removes or archives product with strict ownership verification
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const seller = await authenticateSeller(req);
    if (!seller) {
      return NextResponse.json({ error: "Unauthorized: Missing authentication" }, { status: 401 });
    }

    try {
      const existing = await withDbTimeout(
        prisma.product.findUnique({
          where: { id },
        }),
        1500
      );

      if (existing) {
        // Strict Authorization check
        if (existing.sellerId !== seller.id) {
          return NextResponse.json(
            { error: "Forbidden: You are not authorized to delete products belonging to another artisan." },
            { status: 403 }
          );
        }

        // Check if product is in any orders
        const orderItemsCount = await prisma.orderItem.count({
          where: { productId: id },
        });

        if (orderItemsCount > 0) {
          // Archive instead of hard delete to preserve historical order records
          await prisma.product.update({
            where: { id },
            data: { status: "ARCHIVED" },
          });
          return NextResponse.json({
            success: true,
            action: "ARCHIVED",
            message: "Product has associated orders and was safely marked as ARCHIVED to protect purchase history.",
          });
        }

        // Safe to delete if no orders attached
        await prisma.$transaction(async (tx) => {
          await tx.cartItem.deleteMany({ where: { productId: id } });
          await tx.wishlistItem.deleteMany({ where: { productId: id } });
          await tx.review.deleteMany({ where: { productId: id } });
          await tx.inventory.deleteMany({ where: { productId: id } });
          await tx.productVariant.deleteMany({ where: { productId: id } });
          await tx.productImage.deleteMany({ where: { productId: id } });
          await tx.product.delete({ where: { id } });
        });

        return NextResponse.json({
          success: true,
          action: "DELETED",
          message: "Product deleted successfully.",
        });
      }
    } catch {
      // Database offline fallback
    }

    // Remove or archive in fallback store
    const store = getFallbackStore();
    const idx = store.findIndex((p: any) => p.id === id);
    if (idx >= 0) {
      const item = store[idx];
      // Strict ownership check
      if (item.sellerId !== seller.id) {
        return NextResponse.json(
          { error: "Forbidden: You are not authorized to delete products belonging to another artisan." },
          { status: 403 }
        );
      }
      store.splice(idx, 1);
      return NextResponse.json({
        success: true,
        action: "DELETED",
        message: "Product removed from catalogue.",
      });
    }

    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  } catch (error: any) {
    console.error("Seller product DELETE error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to remove product" },
      { status: 500 }
    );
  }
}
