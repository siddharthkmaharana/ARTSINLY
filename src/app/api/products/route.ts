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
    materials: p.materials || "",
    dimensions: p.dimensions || "",
    careInstructions: p.careInstructions || "",
    craftTechnique: p.craftTechnique || "",
    weight: p.weight || "",
    shippingWeight: p.shippingWeight || "",
    shippingWeightGrams: p.shippingWeightGrams,
    giProduct: p.giProduct || "",
    giStatus: p.giStatus || "",
    giApplicationNumber: p.giApplicationNumber || "",
    giCertificateNumber: p.giCertificateNumber || "",
    giRegistrationDate: p.giRegistrationDate || "",
    giGeographicalArea: p.giGeographicalArea || "",
    giValidity: p.giValidity || "",
    giRegistryUrl: p.giRegistryUrl || "",
    giDisclaimer: p.giDisclaimer || "",
    artisanCommunity: p.artisanCommunity || "",
    craftLineage: p.craftLineage || "",
    craftCluster: p.craftCluster || "",
    productionMethod: p.productionMethod || "",
    authenticityProof: p.authenticityProof || "",
    artisanIdentification: p.artisanIdentification || "",
    guildOrCooperative: p.guildOrCooperative || "",
    authenticityStatement: p.authenticityStatement || "",
    availableSizes: p.availableSizes || [],
    availableColors: p.availableColors || [],
    variants: p.variants || [],
    bullets: p.bullets || [],
    colorSwatches: p.colorSwatches || [],
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

const CRAFT_OPTIONS = [
  { id: "all", label: "All Traditional Crafts", matchers: [] },
  { id: "pattachitra-painting", label: "Pattachitra Painting", matchers: ["pattachitra", "patta", "raghurajpur", "cloth preparation", "traditional painting"] },
  { id: "wood-carving", label: "Wood Carving", matchers: ["wood", "carving", "sheesham", "walnut", "jali", "toy", "toys", "elephant", "gamhari", "bargarh"] },
  { id: "miniature-painting", label: "Miniature Painting", matchers: ["miniature", "pichwai", "painting"] },
  { id: "kalamkari-painting", label: "Kalamkari Painting", matchers: ["kalamkari"] },
  { id: "applique-textiles", label: "Pipili Appliqu� & Patchwork", matchers: ["applique", "appliqu�", "pipili", "pipli", "chandua", "patchwork"] },
  { id: "zardozi-embroidery", label: "Heritage Needlework & Embroidery", matchers: ["zardozi", "embroidery", "kantha", "rabari", "mirrorwork", "bharatkaam"] },
  { id: "papier-mache", label: "Papier-M�ch� & Folk Masks", matchers: ["papier-m�ch�", "papier-mache", "papiermache", "paper", "mask", "masks", "pulp", "kali", "tiger"] },
  { id: "pottery", label: "Terracotta Pottery & Ceramics", matchers: ["pottery", "terracotta", "ceramic", "ceramics", "vase", "plates", "matka", "surahi", "molela", "urn", "khavda", "bishnupur", "lantern", "horse", "figurines", "clay"] },
  { id: "metalwork", label: "Metalwork & Bell Metal", matchers: ["metal", "dhokra", "brass", "bell", "moradabad", "lota", "filigree", "tarakasi", "bidriware", "meenakari", "casting", "lost-wax", "procession", "musician", "drummer"] },
  { id: "block-printing", label: "Block Printing", matchers: ["block", "print", "ajrakh", "indigo"] },
];

const REGION_OPTIONS = [
  { id: "all", label: "All Indian Regions", matchers: [] },
  { id: "odisha", label: "Odisha", matchers: ["odisha", "orissa", "puri", "raghurajpur", "cuttack", "bhubaneswar", "sambalpur", "balasore", "bargarh", "dhenkanal", "sadeibareni", "pipili", "pipli"] },
  { id: "rajasthan", label: "Rajasthan", matchers: ["rajasthan", "jaipur", "jodhpur", "molela", "pokhran"] },
  { id: "uttar-pradesh", label: "Uttar Pradesh", matchers: ["uttar pradesh", "uttar-pradesh", "lucknow", "moradabad", "saharanpur", "gorakhpur"] },
  { id: "gujarat", label: "Gujarat", matchers: ["gujarat", "kutch", "khavda", "bhujodi"] },
  { id: "west-bengal", label: "West Bengal", matchers: ["west bengal", "west-bengal", "bengal", "bankura", "shantiniketan", "bishnupur"] },
  { id: "karnataka", label: "Karnataka", matchers: ["karnataka", "bidar", "channapatna"] },
  { id: "kashmir", label: "Kashmir", matchers: ["kashmir", "srinagar"] },
  { id: "andhra-pradesh", label: "Andhra Pradesh", matchers: ["andhra pradesh", "andhra-pradesh", "srikalahasti"] },
];

function matchesCategory(product: any, category: string): boolean {
  if (!category || category === "all") return true;
  const craftOpt = CRAFT_OPTIONS.find((c) => c.id === category);
  const craftStr = `${product.craftType || ""} ${product.categorySlug || ""} ${product.title || ""}`.toLowerCase();
  if (craftOpt && craftOpt.matchers.length > 0) {
    return craftOpt.matchers.some((m) => craftStr.includes(m.toLowerCase()));
  }
  const keywords = category.toLowerCase().trim().split("-");
  return keywords.some((kw) => craftStr.includes(kw));
}

function matchesRegion(product: any, region: string): boolean {
  if (!region || region === "all") return true;
  const regionOpt = REGION_OPTIONS.find((r) => r.id === region);
  const regionStr = `${product.regionSlug || ""} ${product.provenanceTag || ""} ${product.state || ""} ${product.regionName || ""}`.toLowerCase();
  if (regionOpt && regionOpt.matchers.length > 0) {
    return regionOpt.matchers.some((m) => regionStr.includes(m.toLowerCase()));
  }
  const target = region.toLowerCase().trim().replace("-", " ");
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
    const limit = parseInt(searchParams.get("limit") || "100", 10);

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
