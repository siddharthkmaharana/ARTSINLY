import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Ranked Artisanal Masterpieces | Best Sellers",
  description:
    "Explore the most coveted and collected handcrafted creations across pottery, wood carving, miniature paintings, and heritage textiles.",
  alternates: {
    canonical: "/best-sellers",
  },
  openGraph: {
    title: "Top Ranked Artisanal Masterpieces | ARTSINLY Best Sellers",
    description:
      "Explore the most coveted and collected handcrafted creations across pottery, wood carving, miniature paintings, and heritage textiles.",
    url: "/best-sellers",
  },
};

export default function BestSellersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
