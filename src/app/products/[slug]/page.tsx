"use client";

import React, { use, Suspense } from "react";
import { ExploreShowcase } from "@/components/explore/ExploreShowcase";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#807C74]">Loading Handcrafted Heritage...</div>}>
      <ExploreShowcase productSlug={resolvedParams.slug} />
    </Suspense>
  );
}
