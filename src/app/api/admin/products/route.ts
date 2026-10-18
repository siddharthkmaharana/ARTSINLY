import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

/**
 * GET /api/admin/products
 * List all products across the platform with moderation status and seller details
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // "PUBLISHED", "ARCHIVED", "DRAFT"

    const where: any = {};
    if (status) where.status = status;

    const products = await prisma.product.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            shopName: true,
            artisanName: true,
            state: true,
            isVerified: true,
            giCode: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        inventory: true,
        images: { orderBy: { displayOrder: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    const mapped = products.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      craftType: p.craftType,
      status: p.status,
      basePricePaise: p.basePricePaise,
      priceDisplay: `₹${(p.basePricePaise / 100).toFixed(2)}`,
      stock: p.inventory?.[0]?.quantity ?? 0,
      seller: p.seller,
      category: p.category?.name || "Traditional Crafts",
      imageUrl: p.images?.[0]?.url || "",
      createdAt: p.createdAt,
    }));

    return NextResponse.json({ success: true, products: mapped });
  } catch (error: any) {
    console.error("Admin products GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load products for moderation" },
      { status: 500 }
    );
  }
}
