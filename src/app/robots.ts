import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://artsinly.com";

  return {
    rules: [
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
          "/new-arrivals",
          "/best-sellers",
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
