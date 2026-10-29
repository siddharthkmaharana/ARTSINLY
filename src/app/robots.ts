import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://artsinly.com";

  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/catalog",
          "/products",
          "/products/*",
          "/artisans",
          "/artisans/*",
          "/about",
          "/blog",
          "/blog/*",
          "/new-arrivals",
          "/best-sellers",
          "/terms",
          "/privacy",
          "/shipping",
          "/refunds",
          "/seller-policy",
          "/grievance",
          "/_next/static/*",
          "/_next/image*",
          "/favicon.ico",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/buyer/*",
          "/seller/*",
          "/checkout",
          "/cart",
        ],
      },
      {
        userAgent: "*",
        allow: [
          "/",
          "/catalog",
          "/products",
          "/products/*",
          "/artisans",
          "/artisans/*",
          "/about",
          "/blog",
          "/blog/*",
          "/new-arrivals",
          "/best-sellers",
          "/terms",
          "/privacy",
          "/shipping",
          "/refunds",
          "/seller-policy",
          "/grievance",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/buyer/*",
          "/seller/*",
          "/checkout",
          "/cart",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
