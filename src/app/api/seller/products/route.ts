import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token =
      req.cookies.get("artsinly_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const seller = await prisma.sellerProfile.findUnique({
      where: { userId: payload.userId },
    });

    if (!seller) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: { sellerId: seller.id },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
        inventory: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("Seller products GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token =
      req.cookies.get("artsinly_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const seller = await prisma.sellerProfile.findUnique({
      where: { userId: payload.userId },
    });

    if (!seller) {
      return NextResponse.json(
        { error: "Seller profile not found. Please complete onboarding first." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      craftType,
      categorySlug = "terracotta-pottery",
      price, // numeric or string (e.g. 129.99 or 12999)
      imageUrl,
      initialStock = 10,
      dimensions,
      materials,
    } = body;

    if (!title || !price) {
      return NextResponse.json(
        { error: "Title and price are required" },
        { status: 400 }
      );
    }

    // Convert price to paise (e.g. ₹120.50 -> 12050 paise)
    const numericPrice = typeof price === "string" ? parseFloat(price.replace(/[^0-9.]/g, "")) : price;
    const pricePaise = Math.round(numericPrice * 100);

    // Find category
    let category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });
    if (!category) {
      category = await prisma.category.findFirst() || await prisma.category.create({
        data: {
          name: "Traditional Crafts",
          slug: "traditional-crafts",
          description: "Handcrafted traditional Indian arts",
        },
      });
    }

    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Math.floor(1000 + Math.random() * 9000);

    const product = await prisma.$transaction(async (tx) => {
      // 1. Create product
      const newProduct = await tx.product.create({
        data: {
          sellerId: seller.id,
          categoryId: category.id,
          title,
          slug,
          description: description || `Handcrafted ${craftType || seller.craftTradition} piece by ${seller.artisanName || seller.shopName}.`,
          craftType: craftType || seller.craftTradition,
          provenanceTag: seller.state,
          giCode: seller.giCode,
          dimensions: dimensions || "Standard Artisan Proportion",
          materials: materials || "Indigenous natural minerals & organic dyes",
          basePricePaise: pricePaise,
          status: "PUBLISHED",
          images: imageUrl
            ? {
                create: [
                  {
                    url: imageUrl,
                    altText: title,
                    isPrimary: true,
                    displayOrder: 0,
                  },
                ],
              }
            : undefined,
        },
      });

      // 2. Create default variant
      const variant = await tx.productVariant.create({
        data: {
          productId: newProduct.id,
          sku: `${slug.substring(0, 10).toUpperCase()}-STD`,
          name: "Standard Handcrafted Edition",
          pricePaise,
          isDefault: true,
        },
      });

      // 3. Create inventory
      await tx.inventory.create({
        data: {
          productId: newProduct.id,
          variantId: variant.id,
          quantity: Number(initialStock) || 5,
          reservedQuantity: 0,
          sku: variant.sku,
        },
      });

      return newProduct;
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product listing" },
      { status: 500 }
    );
  }
}
