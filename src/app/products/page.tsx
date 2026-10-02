"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PRODUCTS, CATEGORIES, REGIONS } from "@/lib/mock-data";
import { ProductCard } from "@/components/products/ProductCard";
import {
  SlidersHorizontal,
  Search,
  X,
  ChevronDown,
  Sparkles,
  RotateCcw,
} from "lucide-react";

function CatalogueContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL search params
  const initialCategory = searchParams.get("category") || "all";
  const initialRegion = searchParams.get("region") || "all";
  const initialQuery = searchParams.get("q") || "";

  // Local state for interactive filtering
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState("featured");
  const [madeToOrderOnly, setMadeToOrderOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceMax, setPriceMax] = useState(25000); // in Rupees
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesArtisan = product.artisan.artisanName.toLowerCase().includes(q);
        const matchesCraft = product.craftType.toLowerCase().includes(q);
        const matchesRegion = product.regionName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesArtisan && !matchesCraft && !matchesRegion) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== "all" && product.categorySlug !== selectedCategory) {
        return false;
      }

      // Region
      if (selectedRegion !== "all" && product.regionSlug !== selectedRegion) {
        return false;
      }

      // Made to order filter
      if (madeToOrderOnly && !product.isMadeToOrder) {
        return false;
      }

      // In stock filter
      if (inStockOnly && product.stock <= 0) {
        return false;
      }

      // Price filter (price in paise / 100 <= priceMax)
      if (product.pricePaise / 100 > priceMax) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") {
        return a.pricePaise - b.pricePaise;
      }
      if (sortBy === "price-high") {
        return b.pricePaise - a.pricePaise;
      }
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0; // featured default
    });
  }, [
    searchQuery,
    selectedCategory,
    selectedRegion,
    madeToOrderOnly,
    inStockOnly,
    priceMax,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedRegion("all");
    setSearchQuery("");
    setMadeToOrderOnly(false);
    setInStockOnly(false);
    setPriceMax(25000);
    setSortBy("featured");
    router.push("/products");
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedRegion !== "all" ||
    searchQuery !== "" ||
    madeToOrderOnly ||
    inStockOnly ||
    priceMax < 25000;

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[#89714F] mb-2">
            <span>Marketplace</span>
            <span>/</span>
            <span className="text-[#20201D] font-medium">Regional Catalogue</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#20201D]">
            Authentic Regional Crafts
          </h1>
          <p className="text-sm text-[#6B685F] mt-1 max-w-2xl">
            Each creation is an original, handmade work of art from traditional clusters across India.
          </p>
        </div>

        {/* Controls Bar: Search, Filter Toggle, Sort */}
        <div className="bg-white border border-[#E8E0D2] rounded-lg p-4 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
          {/* Search Input */}
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search by craft, artisan, or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8F5EF] border border-[#DCD0BD] rounded text-[#20201D] focus:outline-none focus:border-[#89714F]"
            />
            <Search className="w-4 h-4 text-[#89714F] absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B685F] hover:text-[#20201D]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="md:hidden inline-flex items-center gap-2 px-3.5 py-2 border border-[#DCD0BD] rounded text-xs font-medium text-[#20201D] bg-[#F8F5EF]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#89714F]" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#89714F]" />
              )}
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-xs text-[#6B685F] hidden sm:inline">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs bg-[#F8F5EF] border border-[#DCD0BD] rounded px-3 py-2 text-[#20201D] focus:outline-none focus:border-[#89714F]"
              >
                <option value="featured">Featured Curations</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
            <span className="text-[#6B685F]">Active Filters:</span>
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#DCD0BD] rounded text-[#20201D]">
                <span>
                  {CATEGORIES.find((c) => c.slug === selectedCategory)?.name ||
                    selectedCategory}
                </span>
                <button onClick={() => setSelectedCategory("all")}>
                  <X className="w-3 h-3 text-[#89714F]" />
                </button>
              </span>
            )}
            {selectedRegion !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#DCD0BD] rounded text-[#20201D]">
                <span>
                  {REGIONS.find((r) => r.slug === selectedRegion)?.name ||
                    selectedRegion}
                </span>
                <button onClick={() => setSelectedRegion("all")}>
                  <X className="w-3 h-3 text-[#89714F]" />
                </button>
              </span>
            )}
            {madeToOrderOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#DCD0BD] rounded text-[#20201D]">
                <span>Made to Order</span>
                <button onClick={() => setMadeToOrderOnly(false)}>
                  <X className="w-3 h-3 text-[#89714F]" />
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#DCD0BD] rounded text-[#20201D]">
                <span>In Stock Ready to Ship</span>
                <button onClick={() => setInStockOnly(false)}>
                  <X className="w-3 h-3 text-[#89714F]" />
                </button>
              </span>
            )}
            {priceMax < 25000 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#DCD0BD] rounded text-[#20201D]">
                <span>Under ₹{priceMax.toLocaleString("en-IN")}</span>
                <button onClick={() => setPriceMax(25000)}>
                  <X className="w-3 h-3 text-[#89714F]" />
                </button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-[#89714F] hover:underline flex items-center gap-1 ml-2 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>
        )}

        {/* Layout Grid: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block space-y-6">
            <div className="bg-white border border-[#E8E0D2] rounded-lg p-5 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#F3ECE1]">
                <h3 className="font-serif text-base font-medium text-[#20201D]">
                  Refine Search
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] text-[#89714F] hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="text-xs font-semibold text-[#89714F] uppercase tracking-wider mb-3">
                  Craft Tradition
                </h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left text-xs py-1.5 px-2 rounded transition-colors ${
                      selectedCategory === "all"
                        ? "bg-[#F4EFE6] font-semibold text-[#89714F]"
                        : "text-[#20201D] hover:bg-[#F8F5EF]"
                    }`}
                  >
                    All Crafts ({PRODUCTS.length})
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left text-xs py-1.5 px-2 rounded transition-colors flex items-center justify-between ${
                        selectedCategory === cat.slug
                          ? "bg-[#F4EFE6] font-semibold text-[#89714F]"
                          : "text-[#20201D] hover:bg-[#F8F5EF]"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] text-[#A8A49A]">
                        {PRODUCTS.filter((p) => p.categorySlug === cat.slug).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Regional Origins Filter */}
              <div className="pt-4 border-t border-[#F3ECE1]">
                <h4 className="text-xs font-semibold text-[#89714F] uppercase tracking-wider mb-3">
                  Geographic Region
                </h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedRegion("all")}
                    className={`w-full text-left text-xs py-1.5 px-2 rounded transition-colors ${
                      selectedRegion === "all"
                        ? "bg-[#F4EFE6] font-semibold text-[#89714F]"
                        : "text-[#20201D] hover:bg-[#F8F5EF]"
                    }`}
                  >
                    All Origins
                  </button>
                  {REGIONS.map((reg) => (
                    <button
                      key={reg.id}
                      onClick={() => setSelectedRegion(reg.slug)}
                      className={`w-full text-left text-xs py-1.5 px-2 rounded transition-colors flex items-center justify-between ${
                        selectedRegion === reg.slug
                          ? "bg-[#F4EFE6] font-semibold text-[#89714F]"
                          : "text-[#20201D] hover:bg-[#F8F5EF]"
                      }`}
                    >
                      <span className="truncate">{reg.name}</span>
                      <span className="text-[10px] text-[#A8A49A]">
                        {PRODUCTS.filter((p) => p.regionSlug === reg.slug).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-4 border-t border-[#F3ECE1]">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-[#89714F] uppercase tracking-wider">
                    Max Price
                  </h4>
                  <span className="text-xs font-semibold text-[#20201D]">
                    ₹{priceMax.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="25000"
                  step="500"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#89714F] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#A8A49A] mt-1">
                  <span>₹1,000</span>
                  <span>₹25,000+</span>
                </div>
              </div>

              {/* Availability Checks */}
              <div className="pt-4 border-t border-[#F3ECE1] space-y-2.5">
                <label className="flex items-center gap-2 text-xs text-[#20201D] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-[#89714F] rounded"
                  />
                  <span>In Stock (Ready to dispatch)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-[#20201D] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={madeToOrderOnly}
                    onChange={(e) => setMadeToOrderOnly(e.target.checked)}
                    className="accent-[#89714F] rounded"
                  />
                  <span>Commission / Made to Order</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products Area */}
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-[#6B685F]">
                Showing{" "}
                <span className="font-semibold text-[#20201D]">
                  {filteredProducts.length}
                </span>{" "}
                authentic items
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-[#E8E0D2] rounded-lg p-12 text-center space-y-4">
                <Sparkles className="w-8 h-8 text-[#89714F] mx-auto opacity-70" />
                <h3 className="font-serif text-xl font-medium text-[#20201D]">
                  No crafts match your current filters
                </h3>
                <p className="text-xs text-[#6B685F] max-w-sm mx-auto">
                  Try adjusting the price range, clearing the search keyword, or selecting another regional craft.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#20201D] text-white rounded text-xs font-semibold hover:bg-[#89714F] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-xs md:hidden">
          <div className="ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E0D2]">
              <h3 className="font-serif text-lg font-medium text-[#20201D]">
                Filter Crafts
              </h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1 text-[#20201D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Category */}
            <div>
              <h4 className="text-xs font-semibold text-[#89714F] uppercase tracking-wider mb-2">
                Craft Category
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left text-xs p-2 rounded ${
                    selectedCategory === "all" ? "bg-[#F4EFE6] text-[#89714F] font-bold" : ""
                  }`}
                >
                  All Crafts
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`w-full text-left text-xs p-2 rounded ${
                      selectedCategory === c.slug ? "bg-[#F4EFE6] text-[#89714F] font-bold" : ""
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Region */}
            <div className="pt-4 border-t border-[#E8E0D2]">
              <h4 className="text-xs font-semibold text-[#89714F] uppercase tracking-wider mb-2">
                Region
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedRegion("all")}
                  className={`w-full text-left text-xs p-2 rounded ${
                    selectedRegion === "all" ? "bg-[#F4EFE6] text-[#89714F] font-bold" : ""
                  }`}
                >
                  All Regions
                </button>
                {REGIONS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRegion(r.slug)}
                    className={`w-full text-left text-xs p-2 rounded ${
                      selectedRegion === r.slug ? "bg-[#F4EFE6] text-[#89714F] font-bold" : ""
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="w-full py-3 bg-[#20201D] text-white rounded text-xs font-semibold"
            >
              Apply Filters ({filteredProducts.length} Results)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm">Loading authentic craft catalogue...</div>}>
      <CatalogueContent />
    </Suspense>
  );
}
