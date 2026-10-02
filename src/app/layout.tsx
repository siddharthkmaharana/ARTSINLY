import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";

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
    <html lang="en" className={`${inter.variable} ${dmSerif.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#F8F5EF] text-[#20201D] selection:bg-[#DCD0BD] selection:text-[#20201D]">
        <CartProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
