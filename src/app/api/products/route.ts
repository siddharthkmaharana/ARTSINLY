import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/monitoring/logger";
import { PRODUCTS } from "@/lib/mock-data";

function formatProduct(p: any) {
  const primaryImage =
    p.images?.find((img: any) => img.isPrimary)?.url ||
    p.images?.[0]?.url ||
    p.imageUrl ||
    "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80";

  const pricePaise =
    typeof p.pricePaise === "number"
      ? p.pricePaise
      : typeof p.basePricePaise === "number"
      ? p.basePricePaise
      : Math.round((p.priceDollars || 0) * 100);

  const priceDollars = typeof p.priceDollars === "number" ? p.priceDollars : pricePaise / 100;

  const ratingCount = p.reviews?.length || p.reviewCount || p.ratingCount || 18;
  const avgRating =
    p.reviews && p.reviews.length > 0
      ? (p.reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) / p.reviews.length).toFixed(2)
      : typeof p.rating === "number"
      ? p.rating.toFixed(2)
      : "4.95";

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    subtitle: (p.subtitle || p.description || "").slice(0, 80) + "...",
    description: p.description || p.subtitle || "",
    priceDollars,
    pricePaise,
    priceDisplay: p.priceDisplay || `₹${priceDollars.toFixed(2)}`,
    originalPriceDisplay: p.originalPriceDisplay || `₹${Math.floor(priceDollars * 1.2)}`,
    imageUrl: primaryImage,
    images: (p.images || []).map((img: any, idx: number) => ({
      id: img.id || `img_${idx}`,
      url: img.url,
      altText: img.altText || p.title,
      isPrimary: img.isPrimary ?? idx === 0,
    })),
    categorySlug: p.category?.slug || p.categorySlug || "traditional-crafts",
    craftType: p.craftType || p.category?.name || p.categoryName || "Handcrafted",
    regionSlug: p.region?.slug || p.regionSlug || "pan-india",
    regionName: p.region?.name || p.regionName || p.provenanceTag || "India",
    state: p.seller?.state || p.state || p.provenanceTag || "India",
    provenanceTag: p.provenanceTag || p.seller?.state || p.state || "India",
    giCode: p.giCode || p.seller?.giCode || "GI-IN-CERTIFIED",
    rating: parseFloat(avgRating),
    ratingCount,
    byline: p.byline
      ? p.byline.startsWith("Master Guild")
        ? p.byline
        : `Master Guild • ${p.byline}`
      : `Master Guild • ${p.seller?.shopName || "Artisan Guild"}`,
    artisan: {
      id: p.seller?.id || p.artisan?.id || "artisan_01",
      artisanName: p.seller?.artisanName || p.artisan?.artisanName || p.seller?.shopName || p.byline || "Master Artisan",
      guildName: p.seller?.shopName || p.artisan?.guildName || p.artisan?.shopName || "Artisan Guild",
      location: p.seller?.locality
        ? `${p.seller.locality}, ${p.seller.state || "India"}`
        : p.artisan?.location || `${p.regionName || p.state || "India"}`,
      giCode: p.seller?.giCode || p.artisan?.giCode || p.giCode || "GI-IN-CERTIFIED",
      imageUrl:
        p.seller?.avatarUrl ||
        p.artisan?.avatarUrl ||
        p.artisan?.imageUrl ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    },
  };
}

function matchesSearch(product: any, term: string): boolean {
  if (!term || !term.trim()) return true;
  const q = term.toLowerCase().trim();
  const title = (product.title || "").toLowerCase();
  const desc = (product.description || product.subtitle || "").toLowerCase();
  const craft = (product.craftType || product.categorySlug || "").toLowerCase();
  const prov = (product.provenanceTag || product.regionName || product.state || "").toLowerCase();
  const artisan = (product.artisan?.artisanName || product.byline || "").toLowerCase();
  return title.includes(q) || desc.includes(q) || craft.includes(q) || prov.includes(q) || artisan.includes(q);
}

function matchesCategory(product: any, category: string): boolean {
  if (!category || category === "all") return true;
  const target = category.toLowerCase().trim();
  const keywords = target.split("-");
  const craftStr = `${product.craftType || ""} ${product.categorySlug || ""} ${product.title || ""}`.toLowerCase();
  return keywords.some((kw) => craftStr.includes(kw));
}

function matchesRegion(product: any, region: string): boolean {
  if (!region || region === "all") return true;
  const target = region.toLowerCase().trim().replace("-", " ");
  const regionStr = `${product.regionSlug || ""} ${product.provenanceTag || ""} ${product.state || ""} ${product.regionName || ""}`.toLowerCase();
  return regionStr.includes(target) || regionStr.includes(region.toLowerCase().trim());
}

function matchesMaxPrice(product: any, maxPrice?: number): boolean {
  if (maxPrice === undefined || isNaN(maxPrice)) return true;
  const price = product.priceDollars || ((product.pricePaise || 0) / 100);
  return price <= maxPrice;
}

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

    let dbProducts: any[] = [];
    try {
      dbProducts = await prisma.product.findMany({
        where: { status: "PUBLISHED" },
        include: {
          images: { orderBy: { displayOrder: "asc" } },
          variants: true,
          seller: true,
          category: true,
          region: true,
          reviews: { select: { rating: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (dbError: any) {
      logger.warn("Database unavailable for products query, using resilient seed fallback", { error: dbError.message });
      dbProducts = [];
    }

    // Format DB products
    const formattedDbProducts = dbProducts.map(formatProduct);
    const seenSlugs = new Set(formattedDbProducts.map((p) => p.slug));

    // Format Mock products from the complete curated catalogue that are not duplicates of DB items
    const formattedMockProducts = PRODUCTS
      .filter((p) => !seenSlugs.has(p.slug))
      .map(formatProduct);

    // Merge: Live database products take precedence, curated master crafts complete the full editorial catalog
    const allProducts = [...formattedDbProducts, ...formattedMockProducts];

    // Apply filtering across the entire unified catalog
    const filteredProducts = allProducts.filter((p) => {
      if (!matchesSearch(p, search)) return false;
      if (!matchesCategory(p, category)) return false;
      if (!matchesRegion(p, region)) return false;
      if (!matchesMaxPrice(p, maxPrice)) return false;
      return true;
    });

    const skip = (page - 1) * limit;
    const totalCount = filteredProducts.length;
    const pagedProducts = filteredProducts.slice(skip, skip + limit);

    const durationMs = performance.now() - startTime;
    logger.metric("fetch_products_catalog", durationMs, {
      count: pagedProducts.length,
      totalCount,
      category,
      region,
      page,
    });

    return NextResponse.json(
      {
        success: true,
        products: pagedProducts,
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
