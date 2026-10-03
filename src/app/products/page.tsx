"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PRODUCTS, CATEGORIES, REGIONS } from "@/lib/mock-data";
import { ProductCard } from "@/components/products/ProductCard";
import { Search, ChevronDown } from "lucide-react";

function ExploreContent() {
  const searchParams = useSearchParams();

  // URL search params
  const initialCategory = searchParams.get("craft") || searchParams.get("category") || "all";
  const initialRegion = searchParams.get("region") || "all";
  const initialQuery = searchParams.get("q") || "";

  // Local state for interactive filtering
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [maxPrice, setMaxPrice] = useState(300);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesArtisan = product.artisan.artisanName.toLowerCase().includes(q);
        const matchesCraft = product.craftType.toLowerCase().includes(q);
        const matchesRegion = (product.provenanceTag || product.regionName).toLowerCase().includes(q);
        if (!matchesTitle && !matchesArtisan && !matchesCraft && !matchesRegion) {
          return false;
        }
      }

      // Region
      if (selectedRegion !== "all") {
        const prodRegion = (product.provenanceTag || product.regionSlug || "").toLowerCase();
        if (!prodRegion.includes(selectedRegion.toLowerCase())) {
          return false;
        }
      }

      // Craft Discipline
      if (selectedCategory !== "all") {
        const prodCraft = (product.craftType || product.categorySlug || "").toLowerCase();
        if (!prodCraft.includes(selectedCategory.toLowerCase())) {
          return false;
        }
      }

      // Price filter (dollar price <= maxPrice)
      const price = product.priceDollars || (product.pricePaise / 100 / 83);
      if (price > maxPrice) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedRegion, selectedCategory, maxPrice]);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb line from screenshot */}
        <nav className="flex items-center space-x-2 text-[11px] text-[#8C877E] mb-6">
          <Link href="/" className="hover:text-[#1E1E1C]">Home</Link>
          <span>›</span>
          <Link href="/explore" className="hover:text-[#1E1E1C]">Explore</Link>
          <span>›</span>
          <span className="text-[#8C877E]">Lighting</span>
          <span>›</span>
          <span className="text-[#6B665E] truncate">Dhokra Lost-Wax Cast Brass Tribal Forest Lamp</span>
        </nav>

        {/* Section Header */}
        <div className="mb-6">
          <span className="text-[11px] font-semibold text-[#A65D47] uppercase tracking-[0.2em] block mb-1">
            The Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-normal text-[#1E1E1C] tracking-tight leading-tight mb-2">
            Discover Handcrafted Heritage
          </h1>
          <p className="text-xs sm:text-[13px] text-[#6E6A62] max-w-2xl leading-relaxed">
            Filter directly by regional indigenous craft tradition, natural materials, and authentic village clusters. Every purchase supports master generational guilds.
          </p>
        </div>

        {/* Unified Filter Bar (Matches exact screenshot container) */}
        <div className="bg-[#ECE8E1] border border-[#DDD8CE] rounded-[10px] p-3.5 mb-10 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
            {/* Search Input Box */}
            <div className="lg:col-span-4 relative">
              <div className="relative flex items-center bg-white border border-[#D5CFC5] rounded-md px-3 py-2 shadow-2xs">
                <Search className="w-3.5 h-3.5 text-[#9E988E] shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Search by craft, artisan, region..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-transparent text-[#1E1E1C] placeholder-[#9E988E] focus:outline-none"
                />
              </div>
            </div>

            {/* Region / Provenance Dropdown */}
            <div className="lg:col-span-3 flex flex-col justify-center">
              <label className="text-[9px] font-semibold text-[#807B72] uppercase tracking-wider block mb-0.5">
                Region / Provenance
              </label>
              <div className="relative">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full text-xs bg-transparent text-[#1E1E1C] font-medium py-1 pr-6 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="all">All Regions of India</option>
                  <option value="gujarat">Gujarat</option>
                  <option value="bengal">Bengal</option>
                  <option value="rajasthan">Rajasthan</option>
                  <option value="kashmir">Kashmir</option>
                  <option value="bihar">Bihar</option>
                  <option value="karnataka">Karnataka</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#6E6A62] absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Craft Discipline Dropdown */}
            <div className="lg:col-span-3 flex flex-col justify-center">
              <label className="text-[9px] font-semibold text-[#807B72] uppercase tracking-wider block mb-0.5">
                Craft Discipline
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full text-xs bg-transparent text-[#1E1E1C] font-medium py-1 pr-6 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="all">All Traditional Crafts</option>
                  <option value="terracotta">Terracotta Pottery</option>
                  <option value="block">Block Print</option>
                  <option value="dhokra">Dhokra Metal</option>
                  <option value="blue">Blue Pottery</option>
                  <option value="wood">Wood Carving</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#6E6A62] absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Max Price Slider */}
            <div className="lg:col-span-2 flex flex-col justify-center">
              <div className="flex items-center justify-between text-[9px] font-semibold text-[#807B72] uppercase tracking-wider mb-1">
                <span>Max Price</span>
                <span className="text-[#1E1E1C] font-semibold">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#1E1E1C] h-1.5 bg-[#D5CFC5] rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 3-Column Product Cards Grid (Identical to screenshot) */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#FAF7F2] border border-[#E5E0D7] rounded-lg p-12 text-center space-y-3 mb-12">
            <h3 className="font-serif text-lg font-medium text-[#1E1E1C]">
              No pieces match your selected filters
            </h3>
            <p className="text-xs text-[#68645C]">
              Try adjusting the max price slider or choosing another craft discipline or region.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedRegion("all");
                setSearchQuery("");
                setMaxPrice(300);
              }}
              className="px-4 py-1.5 bg-[#1E1E1C] text-white text-xs font-semibold rounded-full hover:bg-[#3B3A36]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mb-16">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#807C74]">Loading Handcrafted Heritage...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
