import React, { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/CatalogView";

export const metadata: Metadata = {
  title: "GI Certified Handcrafted Masterpieces | Regional Crafts Catalog",
  description:
    "Explore authentic certified Indian crafts directly from master makers across Gujarat, Rajasthan, Bengal, and Kashmir. Filter by GI tag, craft terroir, and regional guild.",
  alternates: {
    canonical: "/catalog",
  },
  openGraph: {
    title: "GI Certified Handcrafted Masterpieces | ARTSINLY Catalog",
    description:
      "Explore authentic certified Indian crafts directly from master makers across Gujarat, Rajasthan, Bengal, and Kashmir.",
    url: "/catalog",
  },
};

export default function CatalogPage() {
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
