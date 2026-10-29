import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { PRODUCTS, ARTISANS } from "@/lib/mock-data";

const BLOG_SLUGS = [
  "the-sacred-smoke-kilns-of-molela",
  "ajrakh-printing-in-synchrony-with-the-stars",
  "why-imperfection-is-the-true-mark-of-heritage",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://artsinly.com";

  // Static core pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/artisans`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/new-arrivals`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/best-sellers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/refunds`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/seller-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/grievance`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Blog article routes
  const blogRoutes: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  try {
    // Dynamic products from PostgreSQL with mock fallback
    let productRoutes: MetadataRoute.Sitemap = [];
    try {
      const dbProducts = await prisma.product.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      });

      if (dbProducts.length > 0) {
        productRoutes = dbProducts.map((product) => ({
          url: `${baseUrl}/products/${product.slug}`,
          lastModified: product.updatedAt,
          changeFrequency: "weekly",
          priority: 0.8,
        }));
      }
    } catch {
      // Prisma not connected or table empty; fall back to static catalog
    }

    if (productRoutes.length === 0) {
      productRoutes = PRODUCTS.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }

    // Dynamic artisans/sellers from PostgreSQL with mock fallback
    let sellerRoutes: MetadataRoute.Sitemap = [];
    try {
      const dbSellers = await prisma.sellerProfile.findMany({
        where: { isVerified: true },
        select: { slug: true, updatedAt: true },
      });

      if (dbSellers.length > 0) {
        sellerRoutes = dbSellers.map((seller) => ({
          url: `${baseUrl}/artisans/${seller.slug}`,
          lastModified: seller.updatedAt,
          changeFrequency: "monthly",
          priority: 0.7,
        }));
      }
    } catch {
      // Prisma not connected or table empty; fall back to static artisans
    }

    if (sellerRoutes.length === 0) {
      sellerRoutes = ARTISANS.map((artisan) => ({
        url: `${baseUrl}/artisans/${artisan.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      }));
    }

    return [...staticRoutes, ...blogRoutes, ...productRoutes, ...sellerRoutes];
  } catch (err) {
    console.error("Error generating dynamic sitemap:", err);
    return [...staticRoutes, ...blogRoutes];
  }
}
