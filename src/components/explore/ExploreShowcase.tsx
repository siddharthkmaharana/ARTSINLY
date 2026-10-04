"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GUILD_PAIRINGS, PRODUCTS } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Check,
  FileText,
  ArrowUpRight,
  MapPin,
} from "lucide-react";

interface ExploreShowcaseProps {
  productSlug?: string;
}

export function ExploreShowcase({ productSlug }: ExploreShowcaseProps) {
  const currentProduct =
    PRODUCTS.find((p) => p.slug === productSlug) || PRODUCTS[0];

  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSwatchIndex, setSelectedSwatchIndex] = useState(0);
  const [lightingMode, setLightingMode] = useState<"day" | "warm" | "museum">("museum");
  const [isAdded, setIsAdded] = useState(false);

  const inWishlist = isInWishlist(currentProduct.id);

  const handleAddToCart = () => {
    addToCart(currentProduct, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const images =
    currentProduct.images && currentProduct.images.length > 0
      ? currentProduct.images
      : [
          {
            id: "img-1",
            url: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85",
            altText: currentProduct.title,
          },
          {
            id: "img-2",
            url: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=85",
            altText: "Ceramic vessels",
          },
          {
            id: "img-3",
            url: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1000&q=85",
            altText: "White vase",
          },
        ];

  const currentImage = images[selectedImageIndex]?.url || images[0]?.url;

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const displayPrice =
    currentProduct.priceDisplay ||
    `₹${(currentProduct.priceDollars || 127).toFixed(0)}`;
  const displayOriginalPrice =
    currentProduct.originalPriceDisplay || "₹155";
  const badgeText = "Direct Artisan Remuneration";
  const subtitle =
    currentProduct.subtitle ||
    "Minimalist Abstract Matte Decor for Living Room, Shelf & Tabletop Styling";

  const swatches = [
    { name: "Raw Terracotta", hex: "#8A4B38" },
    { name: "Sand Matte", hex: "#C8BEAF" },
  ];

  const bullets = [
    "Premium indigenous clay sourced from Kutch dry river basins",
    "Matte white and iron-red textured mineral surface",
    "Hand-finished for a refined, contemporary and artistic look",
    "Treated with organic beeswax sealant on the interior",
  ];

  const provenanceTag =
    `${(currentProduct.provenanceTag || "Gujarat").toUpperCase()} • ${(currentProduct.craftType || "Terracotta Pottery").toUpperCase()}`;

  // Lighting filter styles
  const getLightingStyle = () => {
    if (lightingMode === "day") {
      return { filter: "brightness(1.05) contrast(1.02)" };
    }
    if (lightingMode === "warm") {
      return { filter: "sepia(0.2) saturate(1.15) brightness(1.02)" };
    }
    return { filter: "contrast(1.08) saturate(1.05) brightness(0.97)" };
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-8 text-[#1E1E1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[11px] text-[#8C877E] mb-6">
          <Link href="/" className="hover:text-[#1E1E1C]">Home</Link>
          <span>•</span>
          <Link href="/explore" className="hover:text-[#1E1E1C]">Explore</Link>
          <span>•</span>
          <span className="hover:text-[#1E1E1C] cursor-pointer">Vases</span>
          <span>•</span>
          <span className="text-[#68645C] truncate">{currentProduct.title}</span>
        </nav>

        {/* 2. Main Product Showcase (Left Gallery + Right Info) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          {/* Left Column: Vertical Thumbnails + Large Hero Image */}
          <div className="lg:col-span-7 flex gap-3 sm:gap-4 items-start">
            {/* Vertical Thumbnails Stack */}
            <div className="flex flex-col gap-2.5 sm:gap-3 shrink-0">
              {images.slice(0, 3).map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded overflow-hidden transition-all duration-200 bg-[#EFEBE4] ${
                    selectedImageIndex === idx
                      ? "ring-2 ring-[#1E1E1C] opacity-100 shadow-xs"
                      : "opacity-75 hover:opacity-100 border border-[#DDD8CE]"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.altText}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Hero Showcase */}
            <div className="relative flex-grow aspect-[4/5] rounded overflow-hidden bg-[#EFEBE4] group border border-[#E5E0D7] shadow-xs">
              <img
                src={currentImage}
                alt={currentProduct.title}
                style={getLightingStyle()}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Top-Right: Lighting Mode Switcher Pill */}
              <div className="absolute top-3.5 right-3.5 z-10">
                <div className="flex items-center gap-1 bg-white/90 backdrop-blur-xs text-[10px] text-[#6E6A62] font-mono px-2 py-1 rounded-full shadow-xs border border-black/5">
                  <span className="text-[#8C877E] uppercase text-[9px] mr-1">LIGHT :</span>
                  <button
                    onClick={() => setLightingMode("day")}
                    className={`px-1.5 py-0.5 rounded transition-all ${
                      lightingMode === "day"
                        ? "bg-[#1E1E1C] text-white font-semibold"
                        : "hover:text-[#1E1E1C]"
                    }`}
                  >
                    Day
                  </button>
                  <span className="text-[#DDD8CE]">|</span>
                  <button
                    onClick={() => setLightingMode("warm")}
                    className={`px-1.5 py-0.5 rounded transition-all ${
                      lightingMode === "warm"
                        ? "bg-[#1E1E1C] text-white font-semibold"
                        : "hover:text-[#1E1E1C]"
                    }`}
                  >
                    Warm
                  </button>
                  <span className="text-[#DDD8CE]">|</span>
                  <button
                    onClick={() => setLightingMode("museum")}
                    className={`px-1.5 py-0.5 rounded transition-all ${
                      lightingMode === "museum"
                        ? "bg-[#1E1E1C] text-white font-semibold"
                        : "hover:text-[#1E1E1C]"
                    }`}
                  >
                    Museum
                  </button>
                </div>
              </div>

              {/* Bottom-Left: Provenance Tag Pill */}
              <div className="absolute bottom-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs text-[#20201D] text-[10px] sm:text-[11px] font-medium tracking-wider uppercase px-3 py-1.5 rounded-full shadow-xs border border-black/5">
                  <MapPin className="w-3 h-3 text-[#8A4B38]" />
                  <span>{provenanceTag}</span>
                </span>
              </div>

              {/* Carousel Left & Right Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/70 hover:bg-white text-[#1E1E1C] flex items-center justify-center shadow-xs backdrop-blur-xs transition-all opacity-85 hover:opacity-100 z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/70 hover:bg-white text-[#1E1E1C] flex items-center justify-center shadow-xs backdrop-blur-xs transition-all opacity-85 hover:opacity-100 z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Title, Subtitle, Swatches, Price, Description, Bullets, Actions, Ledger, Artisan */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-[36px] text-[#1E1E1C] font-normal leading-[1.16] tracking-tight">
              {currentProduct.title}
            </h1>

            {/* Subtitle in Italic Serif */}
            <p className="italic font-serif text-sm sm:text-base text-[#68645C] mt-2 mb-4 leading-relaxed font-normal">
              {subtitle}
            </p>

            {/* Color / Material Swatches */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center gap-2">
                {swatches.map((swatch, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSwatchIndex(idx)}
                    className={`w-6 h-6 rounded-full transition-all flex items-center justify-center ${
                      selectedSwatchIndex === idx
                        ? "ring-2 ring-[#1E1E1C] ring-offset-2 ring-offset-[#FAF8F5]"
                        : "border border-black/10 hover:scale-105"
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                    title={swatch.name}
                  />
                ))}
              </div>
              <span className="text-xs font-mono text-[#68645C] ml-1">
                {swatches[selectedSwatchIndex]?.name}
              </span>
            </div>

            {/* Price Block */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold text-[#1E1E1C] tracking-tight">
                {displayPrice}
              </span>
              <span className="text-sm text-[#9E988E] line-through ml-2">
                {displayOriginalPrice}
              </span>
              <span className="bg-[#F5ECE5] text-[#8A4B38] text-[11px] font-semibold px-2 py-0.5 rounded ml-2">
                {badgeText}
              </span>
            </div>

            {/* Description Paragraph */}
            <p className="text-xs sm:text-[13px] text-[#55524B] leading-relaxed my-2 font-normal">
              Elevate your home decor with this exquisite set of 2 modern ceramic vases, featuring a sculptural, abstract design that combines minimalism with elegance. Crafted from high-quality ceramic with a smooth matte white finish, these vases serve as stunning standalone art pieces or as stylish holders for dried flowers or decorative branches.
            </p>

            {/* Feature Bullets */}
            <ul className="space-y-1.5 my-3 text-xs sm:text-[13px] text-[#55524B]">
              {bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#807C74]">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            {/* Action Buttons: Add to Cart (Black Pill) + Saved in Wishlist (Pink/Beige Pill) */}
            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={handleAddToCart}
                className={`py-3 px-8 rounded-full text-xs font-semibold flex-1 transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                  isAdded
                    ? "bg-[#52644B] text-white"
                    : "bg-[#1E1E1C] hover:bg-[#3B3A36] text-white"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  "Add to Cart"
                )}
              </button>

              <button
                onClick={() => toggleWishlist(currentProduct.id)}
                className={`py-3 px-6 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                  inWishlist
                    ? "bg-[#FAF2EC] border border-[#E5D7CB] text-[#8A4B38]"
                    : "bg-[#FAF2EC] border border-[#E5D7CB] text-[#8A4B38] hover:bg-[#F3ECE5]"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    inWishlist ? "fill-[#8A4B38] text-[#8A4B38]" : "text-[#8A4B38]"
                  }`}
                />
                <span>{inWishlist ? "Saved in Wishlist" : "Save in Wishlist"}</span>
              </button>
            </div>

            {/* GI Registered Provenance Ledger Bar */}
            <div className="flex items-center justify-between text-xs py-3 mt-4 border-b border-[#EAE5DD]">
              <div className="flex items-center gap-1.5 text-[#2E7D52] font-medium text-xs">
                <FileText className="w-3.5 h-3.5" />
                <span>GI Registered Provenance Ledger</span>
              </div>
              <Link
                href="/about#gi-ledger"
                className="text-[11px] font-semibold text-[#1E1E1C] hover:text-[#8A4B38] uppercase tracking-wider underline underline-offset-2"
              >
                View Ledger Record
              </Link>
            </div>

            {/* Artisan Card Box */}
            <div className="bg-[#F7F4EE] border border-[#E8E2D8] rounded-lg p-3 sm:p-3.5 flex items-center justify-between gap-3 mt-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Devendra Prajapati"
                  className="w-10 h-10 rounded-full object-cover border border-[#D5CFC5] shrink-0"
                />
                <div>
                  <h4 className="font-semibold text-xs text-[#1E1E1C]">
                    Devendra Prajapati
                  </h4>
                  <p className="text-[10px] text-[#807B72]">
                    Kutch, Gujarat • 4th Generation Guild
                  </p>
                  <p className="text-[10px] text-[#6E6A62] line-clamp-1 mt-0.5">
                    Carrying on the ancient Kutch terracotta craft, Devendra uses riverbed clay fired in traditional wood-burning kilns, finished with...
                  </p>
                </div>
              </div>

              <Link
                href="/artisans/devendra-prajapati"
                className="text-[11px] font-semibold text-[#8A4B38] hover:underline shrink-0 flex items-center gap-0.5"
              >
                <span>Artisan Story</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3. CURATED PAIRINGS / "From the Same Guild" (4-Card Grid) */}
        <div className="border-t border-[#EAE5DD] pt-12 pb-14">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-[10px] font-semibold text-[#807B72] uppercase tracking-[0.2em] block mb-1">
                Curated Pairings
              </span>
              <h2 className="font-serif text-2xl sm:text-[28px] font-normal text-[#1E1E1C]">
                From the Same Guild
              </h2>
            </div>

            <Link
              href="/products"
              className="text-xs font-semibold text-[#1E1E1C] hover:text-[#8A4B38] tracking-wider uppercase transition-colors"
            >
              View All Pieces →
            </Link>
          </div>

          {/* 4 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {GUILD_PAIRINGS.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.slug}`}
                className="group flex flex-col bg-[#FAF7F2] border border-[#E5E0D7] rounded-md overflow-hidden hover:border-[#D5CFC5] hover:shadow-xs transition-all"
              >
                {/* 1:1 or 4:5 image container */}
                <div className="relative aspect-square w-full overflow-hidden bg-[#EFEBE4]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                  />
                </div>

                <div className="p-3.5 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[9px] font-semibold text-[#807B72] uppercase tracking-wider block mb-1">
                      {item.categoryTag}
                    </span>
                    <h3 className="font-serif text-xs sm:text-[13px] font-medium text-[#1E1E1C] leading-snug line-clamp-1 group-hover:text-[#8A4B38] transition-colors mb-1.5">
                      {item.title}
                    </h3>
                  </div>
                  <div className="text-xs font-semibold text-[#1E1E1C] pt-1">
                    {item.price}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
