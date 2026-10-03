"use client";

import React, { Suspense } from "react";
import { ExploreShowcase } from "@/components/explore/ExploreShowcase";

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#807C74]">Loading Handcrafted Heritage...</div>}>
      <ExploreShowcase />
    </Suspense>
  );
}
