import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import { WebVitalsMonitor } from "@/components/monitoring/WebVitalsMonitor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://artsinly.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ARTSINLY — Regional Artisans Marketplace",
    template: "%s | ARTSINLY Heritage Guild",
  },
  description:
    "Discover authentic Indian heritage crafts, handmade pottery, handloom textiles, folk art, and metalcraft directly from certified master artisans.",
  keywords: [
    "Indian crafts",
    "handmade pottery",
    "Kutch terracotta",
    "Jaipur blue pottery",
    "Madhubani painting",
    "Dokra art",
    "Kashmiri Pashmina",
    "GI certified crafts",
    "artisan direct fair trade",
  ],
  authors: [{ name: "ARTSINLY Curatorial Guild" }],
  creator: "ARTSINLY",
  publisher: "ARTSINLY Fair Trade Pavilion",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "google-site-verification-artsinly-guild",
  },
  openGraph: {
    title: "ARTSINLY — Regional Artisans Marketplace",
    description: "Authentic, certified regional crafts directly from master makers across India.",
    url: siteUrl,
    siteName: "ARTSINLY",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85",
        width: 1200,
        height: 630,
        alt: "ARTSINLY Handcrafted Masterpieces",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ARTSINLY — Regional Artisans Marketplace",
    description: "Authentic, certified regional crafts directly from master makers.",
    images: ["https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${dmSerif.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="image"
          href="https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&fm=webp&w=1200&q=85"
          type="image/webp"
          fetchPriority="high"
        />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('artsinly-theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-[#DCD0BD] selection:text-[#20201D] dark:selection:bg-[#A44A3F] dark:selection:text-white transition-colors duration-200">
        {/* Accessible Skip Link for Screen Readers & Keyboard Navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#1E1E1C] focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] text-xs font-semibold"
        >
          Skip to main content
        </a>

        <AuthProvider>
          <ThemeProvider>
            <CartProvider>
              <WebVitalsMonitor />
              <Header />
              <main id="main-content" role="main" tabIndex={-1} className="flex-grow focus:outline-none">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
