"use client";

import React, { Suspense } from "react";
import { CatalogView } from "@/components/catalog/CatalogView";

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
