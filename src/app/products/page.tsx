import React, { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/CatalogView";

export const metadata: Metadata = {
  title: "Handcrafted Heritage Artifacts & Artisanal Collections",
  description:
    "Browse authentic handcrafted treasures directly from master Indian artisans. Certified terracotta, blue pottery, Pashmina shawls, and Pichwai paintings.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Handcrafted Heritage Artifacts | ARTSINLY",
    description:
      "Browse authentic handcrafted treasures directly from master Indian artisans. Certified terracotta, blue pottery, Pashmina shawls, and Pichwai paintings.",
    url: "/products",
  },
};

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#FAF7F2] min-h-screen py-16 text-center text-xs text-[#807C74]">
          Loading Advanced Crafts Catalog...
        </div>
      }
    >
      <CatalogView />
    </Suspense>
  );
}
