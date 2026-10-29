import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ExploreShowcase } from "@/components/explore/ExploreShowcase";

export const metadata: Metadata = {
  title: "Explore Handcrafted Heritage | Interactive Artisan Showcase",
  description:
    "Immerse yourself in certified Indian crafts. Explore interactive swatches, detailed wood-kiln terracotta textures, and curatorial craft specifications.",
  alternates: {
    canonical: "/explore",
  },
  openGraph: {
    title: "Explore Handcrafted Heritage | ARTSINLY",
    description:
      "Interactive exploration of certified Indian heritage crafts directly from generational guild masters.",
    url: "/explore",
  },
};

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-[#807C74]">
          Loading Handcrafted Heritage...
        </div>
      }
    >
      <ExploreShowcase />
    </Suspense>
  );
}

