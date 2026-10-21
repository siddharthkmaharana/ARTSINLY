import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";
import { rupeesToPaise } from "@/lib/money";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Helper to authenticate seller
 */
async function authenticateSeller(req: NextRequest) {
  const token =
    req.cookies.get("artsinly_token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) return null;

  const payload = verifySessionToken(token);
  if (!payload) return null;

  const seller = await prisma.sellerProfile.findUnique({
    where: { userId: payload.userId },
  });

  return seller;
}

/**
 * GET /api/seller/products/[id]
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const seller = await authenticateSeller(req);
    if (!seller) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const product = await prisma.product.findFirst({
      where: { id, sellerId: seller.id },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
        inventory: true,
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error("Seller product GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

/**
 * PUT/PATCH /api/seller/products/[id] - Update product details & inventory
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const seller = await authenticateSeller(req);
    if (!seller) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const existing = await prisma.product.findFirst({
      where: { id, sellerId: seller.id },
      include: { inventory: true, variants: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Product not found or access denied" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      craftType,
      price,
      imageUrl,
      stock,
      dimensions,
      materials,
      status,
    } = body;

    let pricePaise: number | undefined;
    if (price !== undefined) {
      pricePaise = rupeesToPaise(price);
    }

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update product basic details
      const prod = await tx.product.update({
        where: { id },
        data: {
          title: title ?? existing.title,
          description: description ?? existing.description,
          craftType: craftType ?? existing.craftType,
          dimensions: dimensions ?? existing.dimensions,
          materials: materials ?? existing.materials,
          basePricePaise: pricePaise ?? existing.basePricePaise,
          status: status ?? existing.status,
          images: imageUrl
            ? {
                deleteMany: {},
                create: [
                  {
                    url: imageUrl,
                    altText: title || existing.title,
                    isPrimary: true,
                    displayOrder: 0,
                  },
                ],
              }
            : undefined,
        },
        include: {
          images: true,
          inventory: true,
          variants: true,
        },
      });

      // 2. Update default variant price if price changed
      if (pricePaise !== undefined) {
        await tx.productVariant.updateMany({
          where: { productId: id, isDefault: true },
          data: { pricePaise },
        });
      }

      // 3. Update inventory stock if specified
      if (stock !== undefined) {
        const stockNum = Math.max(0, parseInt(stock, 10) || 0);
        const inv = existing.inventory[0];
        if (inv) {
          await tx.inventory.update({
            where: { id: inv.id },
            data: { quantity: stockNum },
          });
        } else {
          await tx.inventory.create({
            data: {
              productId: id,
              quantity: stockNum,
              reservedQuantity: 0,
            },
          });
        }
      }

      return prod;
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error("Seller product update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/seller/products/[id] - Archive or remove product
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const seller = await authenticateSeller(req);
    if (!seller) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.product.findFirst({
      where: { id, sellerId: seller.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Product not found or access denied" },
        { status: 404 }
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
        message: "Product has associated orders and was marked as ARCHIVED.",
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
  } catch (error: any) {
    console.error("Seller product DELETE error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to remove product" },
      { status: 500 }
    );
  }
}
