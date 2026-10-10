import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";

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

export const metadata: Metadata = {
  title: "ARTSINLY — Regional Artisans Marketplace",
  description:
    "Discover authentic Indian heritage crafts, handmade pottery, handloom textiles, folk art, and metalcraft directly from certified master artisans.",
  keywords: [
    "Indian crafts",
    "handmade",
    "Jaipur blue pottery",
    "Madhubani painting",
    "Dokra art",
    "Channapatna toys",
    "Kashmiri Pashmina",
    "Rogan art",
    "artisan marketplace",
  ],
  openGraph: {
    title: "ARTSINLY — Regional Artisans Marketplace",
    description: "Authentic, certified regional crafts directly from master makers.",
    siteName: "ARTSINLY",
    locale: "en_IN",
    type: "website",
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
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-[#DCD0BD] selection:text-[#20201D] dark:selection:bg-[#A44A3F] dark:selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <CartProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
