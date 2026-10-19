import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { logger } from "@/lib/monitoring/logger";

export async function GET(req: NextRequest) {
  const startTime = performance.now();
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || searchParams.get("q") || "";
    const category = searchParams.get("category") || searchParams.get("craft") || "all";
    const region = searchParams.get("region") || "all";
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const where: Prisma.ProductWhereInput = {
      status: "PUBLISHED",
    };

    // Filter by search text
    if (search.trim()) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { craftType: { contains: search, mode: "insensitive" } },
        { provenanceTag: { contains: search, mode: "insensitive" } },
        { seller: { shopName: { contains: search, mode: "insensitive" } } },
        { seller: { artisanName: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Filter by craft / category
    if (category !== "all") {
      const craftKeywords = category.toLowerCase().split("-");
      const craftConditions: Prisma.ProductWhereInput[] = [
        { category: { slug: { contains: category, mode: "insensitive" } } },
        { craftType: { contains: craftKeywords[0], mode: "insensitive" } },
        ...craftKeywords.map((kw) => ({ title: { contains: kw, mode: "insensitive" as const } })),
      ];

      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
        { OR: craftConditions },
      ];
    }

    // Filter by region
    if (region !== "all") {
      const regionClean = region.toLowerCase().replace("-", " ");
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
        {
          OR: [
            { region: { slug: { contains: region, mode: "insensitive" } } },
            { provenanceTag: { contains: regionClean, mode: "insensitive" } },
            { seller: { state: { contains: regionClean, mode: "insensitive" } } },
          ],
        },
      ];
    }

    // Filter by price cap
    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      where.basePricePaise = {
        lte: Math.round(maxPrice * 100),
      };
    }

    const skip = (page - 1) * limit;

    const [dbProducts, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          images: { orderBy: { displayOrder: "asc" } },
          variants: true,
          seller: true,
          category: true,
          region: true,
          reviews: { select: { rating: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    // Format products for frontend consumption
    const formattedProducts = dbProducts.map((p) => {
      const primaryImage =
        p.images.find((img) => img.isPrimary)?.url ||
        p.images[0]?.url ||
        "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80";

      const ratingCount = p.reviews.length;
      const avgRating =
        ratingCount > 0
          ? (p.reviews.reduce((acc, r) => acc + r.rating, 0) / ratingCount).toFixed(2)
          : "4.95";

      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        subtitle: p.description.slice(0, 80) + "...",
        priceDollars: p.basePricePaise / 100,
        pricePaise: p.basePricePaise,
        priceDisplay: `₹${(p.basePricePaise / 100).toFixed(2)}`,
        originalPriceDisplay: `₹${((p.basePricePaise * 1.2) / 100).toFixed(0)}`,
        imageUrl: primaryImage,
        images: p.images.map((img) => ({
          id: img.id,
          url: img.url,
          altText: img.altText || p.title,
        })),
        categorySlug: p.category.slug,
        craftType: p.craftType || p.category.name,
        regionSlug: p.region?.slug || "pan-india",
        regionName: p.region?.name || p.provenanceTag || "India",
        state: p.seller.state || p.provenanceTag || "India",
        provenanceTag: p.provenanceTag || p.seller.state || "India",
        giCode: p.giCode || p.seller.giCode || "GI-IN-CERTIFIED",
        rating: parseFloat(avgRating),
        ratingCount: ratingCount || 12,
        byline: `Master Guild • ${p.seller.shopName}`,
        artisan: {
          id: p.seller.id,
          artisanName: p.seller.artisanName || p.seller.shopName,
          guildName: p.seller.shopName,
          location: `${p.seller.locality ? p.seller.locality + ", " : ""}${p.seller.state}`,
          giCode: p.seller.giCode || "GI-IN-CERTIFIED",
          imageUrl: p.seller.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
        },
      };
    });

    const durationMs = performance.now() - startTime;
    logger.metric("fetch_products_catalog", durationMs, {
      count: formattedProducts.length,
      category,
      region,
      page,
    });

    return NextResponse.json(
      {
        success: true,
        products: formattedProducts,
        totalCount,
        page,
        limit,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: any) {
    const durationMs = performance.now() - startTime;
    logger.error("Products catalog API error", { error: error.message, durationMs });
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
