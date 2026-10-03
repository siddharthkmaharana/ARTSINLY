"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PRODUCTS } from "@/lib/mock-data";
import { ProductCard } from "@/components/products/ProductCard";
import { Search, Check } from "lucide-react";

interface CraftOption {
  id: string;
  label: string;
  matchers: string[];
}

const CRAFT_OPTIONS: CraftOption[] = [
  { id: "all", label: "All Traditional Crafts", matchers: [] },
  { id: "wood-carving", label: "Wood Carving", matchers: ["wood", "carving", "sheesham", "walnut"] },
  { id: "miniature-painting", label: "Miniature Painting", matchers: ["miniature", "pichwai", "painting"] },
  { id: "kalamkari-painting", label: "Kalamkari Painting", matchers: ["kalamkari"] },
  { id: "zardozi-embroidery", label: "Zardozi Embroidery", matchers: ["zardozi", "embroidery"] },
  { id: "pottery", label: "Pottery", matchers: ["pottery", "terracotta", "ceramic", "vase", "plates"] },
  { id: "metalwork", label: "Metalwork", matchers: ["metal", "dhokra", "brass", "bell"] },
  { id: "block-printing", label: "Block Printing", matchers: ["block", "print", "ajrakh", "indigo"] },
];

interface RegionOption {
  id: string;
  label: string;
  matchers: string[];
}

const REGION_OPTIONS: RegionOption[] = [
  { id: "all", label: "All Indian Regions", matchers: [] },
  { id: "rajasthan", label: "Rajasthan", matchers: ["rajasthan"] },
  { id: "uttar-pradesh", label: "Uttar Pradesh", matchers: ["uttar pradesh", "uttar-pradesh", "lucknow"] },
  { id: "gujarat", label: "Gujarat", matchers: ["gujarat", "kutch"] },
  { id: "west-bengal", label: "West Bengal", matchers: ["west bengal", "west-bengal", "bengal", "bankura"] },
  { id: "andhra-pradesh", label: "Andhra Pradesh", matchers: ["andhra pradesh", "andhra-pradesh", "srikalahasti"] },
];

interface ArtisanLineageOption {
  id: string;
  label: string;
  artisanName: string;
}

const ARTISAN_LINEAGE_OPTIONS: ArtisanLineageOption[] = [
  { id: "devendra", label: "Devendra Prajapati (Pottery)", artisanName: "Devendra Prajapati" },
  { id: "meenakshi", label: "Meenakshi Rathore (Meenakari Jewel...)", artisanName: "Meenakshi Rathore" },
  { id: "rameshwar", label: "Rameshwar Chitrakar (Kalamkari Pain...)", artisanName: "Rameshwar Chitrakar" },
  { id: "bhuribai", label: "Bhuri Bai (Gond Art)", artisanName: "Bhuri Bai" },
];

export function CatalogView() {
  const searchParams = useSearchParams();

  const initialCraft = searchParams.get("craft") || searchParams.get("category") || "all";
  const initialRegion = searchParams.get("region") || "all";
  const initialQuery = searchParams.get("q") || "";

  const [selectedCraft, setSelectedCraft] = useState(initialCraft);
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [priceCap, setPriceCap] = useState(1500);
  const [selectedArtisan, setSelectedArtisan] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleReset = () => {
    setSelectedCraft("all");
    setSelectedRegion("all");
    setPriceCap(1500);
    setSelectedArtisan(null);
    setSearchQuery("");
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesArtisan = product.artisan.artisanName.toLowerCase().includes(q) ||
          (product.byline || "").toLowerCase().includes(q);
        const matchesCraft = product.craftType.toLowerCase().includes(q);
        const matchesRegion = (product.provenanceTag || product.regionName || product.state).toLowerCase().includes(q);
        if (!matchesTitle && !matchesArtisan && !matchesCraft && !matchesRegion) {
          return false;
        }
      }

      // 2. Craft Filter
      if (selectedCraft !== "all") {
        const craftConfig = CRAFT_OPTIONS.find((c) => c.id === selectedCraft);
        if (craftConfig && craftConfig.matchers.length > 0) {
          const productCraftString = `${product.craftType} ${product.categorySlug} ${product.title}`.toLowerCase();
          const matches = craftConfig.matchers.some((m) => productCraftString.includes(m));
          if (!matches) return false;
        }
      }

      // 3. Region Filter
      if (selectedRegion !== "all") {
        const regionConfig = REGION_OPTIONS.find((r) => r.id === selectedRegion);
        if (regionConfig && regionConfig.matchers.length > 0) {
          const productRegionString = `${product.regionSlug} ${product.provenanceTag} ${product.state}`.toLowerCase();
          const matches = regionConfig.matchers.some((m) => productRegionString.includes(m));
          if (!matches) return false;
        }
      }

      // 4. Price Cap Filter
      const price = product.priceDollars || (product.pricePaise / 100 / 83);
      if (price > priceCap) {
        return false;
      }

      // 5. Artisan Lineage Filter
      if (selectedArtisan) {
        const artisanConfig = ARTISAN_LINEAGE_OPTIONS.find((a) => a.id === selectedArtisan);
        if (artisanConfig) {
          const matchesName = product.artisan.artisanName.toLowerCase().includes(artisanConfig.artisanName.toLowerCase()) ||
            (product.byline || "").toLowerCase().includes(artisanConfig.artisanName.toLowerCase());
          if (!matchesName) return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCraft, selectedRegion, priceCap, selectedArtisan]);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-5 sm:py-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb line from screenshot */}
        <nav className="flex items-center space-x-2 text-[11px] text-[#8C877E] mb-5 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link href="/" className="hover:text-[#1E1E1C] transition-colors">
            Home
          </Link>
          <span>•</span>
          <Link href="/explore" className="hover:text-[#1E1E1C] transition-colors">
            Explore
          </Link>
          <span>•</span>
          <span className="hover:text-[#1E1E1C] transition-colors cursor-pointer">
            Vases
          </span>
          <span>•</span>
          <span className="text-[#6B665E] truncate">
            Modern Ethnic Ceramic Vase – Terracotta Vase with Indigenous Pattern
          </span>
        </nav>

        {/* Section Header with Title and Search Input */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#C2410C] uppercase tracking-[0.2em] block mb-1.5">
              CURATED INDIAN CRAFTS
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-normal text-[#1E1E1C] tracking-tight leading-tight mb-2">
              Advanced Crafts Catalog
            </h1>
            <p className="text-xs sm:text-[13px] text-[#6E6A62] max-w-xl leading-relaxed">
              Discover authenticated handmade works categorized by lineage guilds, geographical regions, and traditional methods.
            </p>
          </div>

          {/* Search Pill */}
          <div className="w-full md:w-80 shrink-0">
            <div className="relative flex items-center bg-[#EDE8E0] hover:bg-[#EAE4DC] border border-[#DDD6CC] rounded-full px-4 py-2 transition-colors">
              <Search className="w-3.5 h-3.5 text-[#8C877E] mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="Search craft, artisan, region..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-[#1E1E1C] placeholder-[#8C877E] outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[#8C877E] hover:text-[#1E1E1C] text-xs ml-1"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2-Column Main Layout: Left Sidebar + Right 3-Column Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start mb-16">
          {/* Left Column: Advanced Filtering Sidebar */}
          <aside className="lg:col-span-3 w-full bg-[#ECE6DC]/75 border border-[#DDD5C8] rounded-xl p-5 shadow-2xs">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#DDD5C8]/80">
              <h2 className="font-serif text-base font-semibold text-[#1E1E1C]">
                Advanced Filtering
              </h2>
              <button
                onClick={handleReset}
                className="text-xs text-[#7A756D] hover:text-[#1E1E1C] underline transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* CRAFT BY */}
            <div className="mb-5">
              <span className="text-[10px] font-bold tracking-[0.14em] text-[#555049] uppercase block mb-2">
                CRAFT BY
              </span>
              <div className="space-y-0.5">
                {CRAFT_OPTIONS.map((craft) => {
                  const isSelected = selectedCraft === craft.id;
                  return (
                    <button
                      key={craft.id}
                      onClick={() => setSelectedCraft(craft.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-[#1E1E1C] text-white font-medium shadow-2xs"
                          : "text-[#3A3834] hover:bg-black/5"
                      }`}
                    >
                      <span className="truncate">{craft.label}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-white stroke-[2.5] shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* REGION */}
            <div className="mb-5 pt-4 border-t border-[#DDD5C8]/80">
              <span className="text-[10px] font-bold tracking-[0.14em] text-[#555049] uppercase block mb-2">
                REGION
              </span>
              <div className="space-y-0.5">
                {REGION_OPTIONS.map((region) => {
                  const isSelected = selectedRegion === region.id;
                  return (
                    <button
                      key={region.id}
                      onClick={() => setSelectedRegion(region.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-[#1E1E1C] text-white font-medium shadow-2xs"
                          : "text-[#3A3834] hover:bg-black/5"
                      }`}
                    >
                      <span className="truncate">{region.label}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-white stroke-[2.5] shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PRICE CAP */}
            <div className="mb-5 pt-4 border-t border-[#DDD5C8]/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold tracking-[0.14em] text-[#555049] uppercase">
                  PRICE CAP
                </span>
                <span className="text-xs font-bold text-[#1E1E1C]">
                  ${priceCap}
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={1500}
                step={10}
                value={priceCap}
                onChange={(e) => setPriceCap(Number(e.target.value))}
                className="w-full h-1.5 bg-[#1E1E1C] rounded-lg appearance-none cursor-pointer accent-[#1E1E1C]"
              />
              <div className="flex items-center justify-between text-[10px] text-[#8C877E] mt-1.5 font-medium">
                <span>$100</span>
                <span>$1,500+</span>
              </div>
            </div>

            {/* ARTISAN LINEAGE */}
            <div className="pt-4 border-t border-[#DDD5C8]/80">
              <span className="text-[10px] font-bold tracking-[0.14em] text-[#555049] uppercase block mb-2.5">
                ARTISAN LINEAGE
              </span>
              <div className="space-y-2">
                {ARTISAN_LINEAGE_OPTIONS.map((artisan) => {
                  const isSelected = selectedArtisan === artisan.id;
                  return (
                    <button
                      key={artisan.id}
                      onClick={() =>
                        setSelectedArtisan(
                          selectedArtisan === artisan.id ? null : artisan.id
                        )
                      }
                      className={`w-full text-left text-xs transition-colors flex items-start gap-2 group cursor-pointer ${
                        isSelected
                          ? "text-[#C2410C] font-semibold"
                          : "text-[#4A463F] hover:text-[#1E1E1C]"
                      }`}
                    >
                      <span className="text-[#C2410C] text-[10px] mt-0.5">•</span>
                      <span className="truncate">{artisan.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Column: 3-Column Products Grid */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-[#ECE6DC]/50 border border-[#DDD5C8] rounded-xl p-12 text-center space-y-3">
                <h3 className="font-serif text-lg font-medium text-[#1E1E1C]">
                  No authenticated crafts match this filter combination
                </h3>
                <p className="text-xs text-[#6E6A62]">
                  Try adjusting your price cap or craft discipline in the sidebar.
                </p>
                <button
                  onClick={handleReset}
                  className="px-4 py-1.5 bg-[#1E1E1C] text-white text-xs font-semibold rounded-full hover:bg-black transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="catalog"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
