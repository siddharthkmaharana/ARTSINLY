"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GUILD_PAIRINGS, PRODUCTS } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Product } from "@/types";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Check,
  FileText,
  ArrowUpRight,
  MapPin,
  Award,
  ShieldCheck,
  ExternalLink,
  Info,
  Plus,
  Minus,
  Layers,
} from "lucide-react";

interface ExploreShowcaseProps {
  productSlug?: string;
}

interface ShowcaseLayoutConfig {
  containerClass: string;
  imageFitClass: string;
}

/**
 * Determine the optimal container aspect ratio and image fit for each product
 * - Landscape framed artworks (e.g. Pattachitra): aspect-[4/3] with contain so the whole frame is visible
 * - Clocks and circular / square crafts: aspect-square with cover for a balanced, full view
 * - Pottery, vases, tapestries, 3D vessels: aspect-[4/5] with cover (original ARTSINLY full-view layout)
 */
function getProductShowcaseLayout(product: Product): ShowcaseLayoutConfig {
  const aspect = product.showcaseAspectRatio;
  const fit = product.imageFit;

  // 1. Explicit configuration on product object takes precedence
  if (aspect === "landscape") {
    return {
      containerClass: "aspect-[4/3] flex items-center justify-center",
      imageFitClass: fit === "cover" ? "object-cover object-center" : "object-contain object-center",
    };
  }
  if (aspect === "square") {
    return {
      containerClass: "aspect-square flex items-center justify-center",
      imageFitClass: fit === "contain" ? "object-contain object-center" : "object-cover object-center",
    };
  }
  if (aspect === "portrait") {
    return {
      containerClass: "aspect-[4/5]",
      imageFitClass: fit === "contain" ? "object-contain object-center" : "object-cover object-center",
    };
  }

  // 2. Fallbacks based on craft and slug
  if (
    product.slug === "jagannath-divine-heritage-pattachitra" ||
    product.craftType?.toLowerCase().includes("pattachitra")
  ) {
    return {
      containerClass: "aspect-[4/3] flex items-center justify-center",
      imageFitClass: "object-contain object-center",
    };
  }

  if (
    product.slug.includes("clock") ||
    product.title.toLowerCase().includes("clock") ||
    product.slug.includes("plates") ||
    product.dimensions?.toLowerCase().includes("diameter")
  ) {
    return {
      containerClass: "aspect-square flex items-center justify-center",
      imageFitClass: "object-cover object-center",
    };
  }

  // 3. Default for all other products (vases, terracotta, tapestries, metalwork, panels, etc.)
  // Perfectly restores original ARTSINLY layout with edge-to-edge full view
  return {
    containerClass: "aspect-[4/5]",
    imageFitClass: "object-cover object-center",
  };
}

export function ExploreShowcase({ productSlug }: ExploreShowcaseProps) {
  const currentProduct =
    PRODUCTS.find((p) => p.slug === productSlug) ||
    (productSlug === "indian-mythological-palace-painting" || productSlug === "divine-court-of-the-gods-pattachitra"
      ? PRODUCTS.find((p) => p.id === "prod-mythological-palace-painting")
      : productSlug === "royal-heritage-handcrafted-pipili-applique-wall-hanging" || productSlug === "royal-heritage-pipili-applique-wall-hanging" || productSlug === "pipili-applique-wall-hanging" || productSlug === "pipili-chandua-wall-hanging"
      ? PRODUCTS.find((p) => p.id === "prod-pipili-applique-wall-hanging")
      : productSlug === "sambalpur-heritage-handcrafted-terracotta-lantern" || productSlug === "sambalpur-terracotta-lantern"
      ? PRODUCTS.find((p) => p.id === "prod-sambalpur-terracotta-lantern")
      : productSlug === "balasore-heritage-handcrafted-terracotta-horse-pair" || productSlug === "balasore-terracotta-horse-pair"
      ? PRODUCTS.find((p) => p.id === "prod-balasore-terracotta-horses")
      : productSlug === "divine-expressions-kali-tiger-papier-mache-mask-set" || productSlug === "divine-expressions-handcrafted-traditional-mask-pair" || productSlug === "papier-mache-mask-set"
      ? PRODUCTS.find((p) => p.id === "prod-papier-mache-mask-set")
      : productSlug === "royal-heritage-hand-painted-wooden-elephant-pair" || productSlug === "royal-heritage-hand-painted-elephant-pair"
      ? PRODUCTS.find((p) => p.id === "prod-bargarh-wooden-elephant-pair")
      : productSlug === "royal-procession-handcrafted-dhokra-elephant-sculpture" || productSlug === "royal-procession-handcrafted-dhokra-brass-elephant"
      ? PRODUCTS.find((p) => p.id === "prod-sadeibareni-dhokra-elephant")
      : productSlug === "tribal-rhythms-handcrafted-dhokra-musician-sculpture" || productSlug === "tribal-rhythms-dhokra-musician"
      ? PRODUCTS.find((p) => p.id === "prod-sadeibareni-dhokra-musician")
      : productSlug === "modern-ethnic-ceramic-vase-ivory-minimalist-edition" || productSlug === "modern-ethnic-ceramic-vase-terracotta-vase" || productSlug === "modern-ethnic-ceramic-vase" || productSlug === "modern-ethnic-ceramic-vase-terracotta"
      ? PRODUCTS.find((p) => p.id === "prod-vase")
      : undefined) ||
    PRODUCTS[0];

  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightingMode, setLightingMode] = useState<"day" | "warm" | "museum">("museum");
  const [isAdded, setIsAdded] = useState(false);

  // Variant Configuration State
  const hasMultipleSizes = Boolean(
    currentProduct.availableSizes && currentProduct.availableSizes.length > 1
  );

  const availableSizes = hasMultipleSizes
    ? currentProduct.availableSizes!
    : currentProduct.availableSizes && currentProduct.availableSizes.length === 1
    ? currentProduct.availableSizes
    : [
        {
          id: "size-standard",
          name: "Standard",
          dimensions: currentProduct.dimensions || "Authentic Studio Scale",
          pricePaise: currentProduct.pricePaise || 450000,
          priceDisplay: currentProduct.priceDisplay || "₹4,500",
          originalPriceDisplay: currentProduct.originalPriceDisplay,
        },
      ];

  // Default to size marked isDefault or matching currentProduct.dimensions, else Medium, else first size
  const defaultSize =
    availableSizes.find((s) => s.isDefault) ||
    availableSizes.find((s) => s.dimensions === currentProduct.dimensions) ||
    availableSizes.find((s) => s.name.toLowerCase() === "medium") ||
    availableSizes[0];
  const [selectedSize, setSelectedSize] = useState(defaultSize);

  // Check if product has color themes enabled
  // Excluded specifically for Jagannath Pattachitra or when hasColorThemes === false
  const showColorThemes =
    currentProduct.hasColorThemes !== false &&
    currentProduct.slug !== "jagannath-divine-heritage-pattachitra" &&
    currentProduct.slug !== "divine-court-of-the-gods-pattachitra" &&
    currentProduct.slug !== "indian-mythological-palace-painting" &&
    currentProduct.slug !== "jagannath-trinity-divine-heritage-pattachitra" &&
    currentProduct.slug !== "divine-krishna-leela-radha-krishna-pattachitra" &&
    currentProduct.slug !== "sambalpur-heritage-handcrafted-terracotta-lantern" &&
    currentProduct.slug !== "balasore-heritage-handcrafted-terracotta-horse-pair" &&
    currentProduct.slug !== "divine-expressions-kali-tiger-papier-mache-mask-set" &&
    currentProduct.slug !== "divine-expressions-handcrafted-traditional-mask-pair" &&
    currentProduct.slug !== "royal-heritage-hand-painted-wooden-elephant-pair" &&
    currentProduct.slug !== "royal-heritage-hand-painted-elephant-pair" &&
    currentProduct.slug !== "royal-procession-handcrafted-dhokra-elephant-sculpture" &&
    currentProduct.slug !== "royal-procession-handcrafted-dhokra-brass-elephant" &&
    currentProduct.slug !== "tribal-rhythms-handcrafted-dhokra-musician-sculpture" &&
    currentProduct.slug !== "tribal-rhythms-dhokra-musician" &&
    ((currentProduct.availableColors && currentProduct.availableColors.length > 0) ||
      (currentProduct.colorSwatches && currentProduct.colorSwatches.length > 0));

  const availableColors = showColorThemes
    ? currentProduct.availableColors && currentProduct.availableColors.length > 0
      ? currentProduct.availableColors
      : currentProduct.colorSwatches || []
    : [];

  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(
    availableColors[0] || null
  );
  const [quantity, setQuantity] = useState(1);

  const inWishlist = isInWishlist(currentProduct.id);

  // Total price calculation
  const unitPricePaise = hasMultipleSizes
    ? selectedSize?.pricePaise || currentProduct.pricePaise || 450000
    : currentProduct.pricePaise || 450000;

  const totalPricePaise = unitPricePaise * quantity;
  const totalPriceDisplay = `₹${(totalPricePaise / 100).toLocaleString("en-IN")}`;
  const unitPriceDisplay = hasMultipleSizes
    ? selectedSize?.priceDisplay || currentProduct.priceDisplay || `₹${(unitPricePaise / 100).toLocaleString("en-IN")}`
    : currentProduct.priceDisplay || `₹${(unitPricePaise / 100).toLocaleString("en-IN")}`;

  // Strikethrough before-price calculation
  const displayOriginalPrice = hasMultipleSizes
    ? selectedSize?.originalPriceDisplay ||
      (selectedSize?.name.toLowerCase() === "small"
        ? "₹3,200"
        : selectedSize?.name.toLowerCase() === "large"
        ? "₹8,500"
        : "₹5,500")
    : currentProduct.originalPriceDisplay ||
      (currentProduct.originalPricePaise
        ? `₹${(currentProduct.originalPricePaise / 100).toLocaleString("en-IN")}`
        : "");

  const handleAddToCart = () => {
    const colorSuffix =
      showColorThemes && selectedColor
        ? `-${selectedColor.name.toLowerCase().replace(/\s+/g, "-")}`
        : "";
    const colorSubtitle =
      showColorThemes && selectedColor ? ` • ${selectedColor.name}` : "";

    const customizedProduct = {
      ...currentProduct,
      id: `${currentProduct.id}-${selectedSize.id}${colorSuffix}`,
      dimensions: hasMultipleSizes ? selectedSize.dimensions : currentProduct.dimensions,
      pricePaise: unitPricePaise,
      priceDollars: unitPricePaise / 100,
      priceDisplay: unitPriceDisplay,
      subtitle: hasMultipleSizes
        ? `${selectedSize.name} (${selectedSize.dimensions})${colorSubtitle}`
        : `${currentProduct.dimensions || "Handcrafted"}${colorSubtitle}`,
    };
    addToCart(customizedProduct, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  const images =
    currentProduct.images && currentProduct.images.length > 0
      ? currentProduct.images
      : [
          {
            id: "img-default-1",
            url: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&fm=webp&w=1200&q=85",
            altText: currentProduct.title,
            isPrimary: true,
          },
        ];

  const currentImage = images[selectedImageIndex]?.url || images[0]?.url;

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const badgeText = currentProduct.badgeText || "Direct Artisan Pricing";
  const subtitle = currentProduct.subtitle || "Traditional Handicraft · Heritage Collection";

  const provenanceTag = `${(currentProduct.provenanceTag || currentProduct.state || "India").toUpperCase()} • ${(currentProduct.craftType || "Handcrafted").toUpperCase()}`;
  const collectionState = (currentProduct.state || currentProduct.regionName || "HERITAGE").toUpperCase();

  // Layout styling derived for this specific product
  const showcaseLayout = getProductShowcaseLayout(currentProduct);

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
        <Breadcrumbs
          items={[
            { name: "Catalog", url: "/catalog" },
            {
              name: currentProduct.regionName || currentProduct.state || "Heritage",
              url: `/catalog?region=${currentProduct.regionSlug || "all"}`,
            },
            { name: currentProduct.title, url: `/products/${currentProduct.slug}` },
          ]}
          className="mb-6"
        />

        {/* 2. Main Product Showcase (Left Gallery + Right Configuration & Info) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          {/* Left Column: Vertical Thumbnails + Large Hero Image */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 items-start">
            {/* Vertical Thumbnails Stack */}
            <div className="flex sm:flex-col gap-2.5 sm:gap-3 shrink-0 overflow-x-auto sm:overflow-visible w-full sm:w-auto">
              {images.slice(0, 4).map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded overflow-hidden transition-all duration-200 bg-[#EFEBE4] shrink-0 ${
                    selectedImageIndex === idx
                      ? "ring-2 ring-[#1E1E1C] opacity-100 shadow-xs"
                      : "opacity-75 hover:opacity-100 border border-[#DDD8CE]"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.altText || `${currentProduct.title || "Craft item"} thumbnail view ${idx + 1}`}
                    width={64}
                    height={64}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Hero Showcase Container - dynamic layout per product */}
            <div
              className={`relative flex-grow w-full ${showcaseLayout.containerClass} rounded-xl overflow-hidden bg-[#EFEBE4] group border border-[#E5E0D7] shadow-xs`}
            >
              <img
                src={currentImage}
                alt={currentProduct.title || "Handcrafted heritage masterpiece"}
                width={1200}
                height={900}
                decoding="async"
                style={getLightingStyle()}
                className={`w-full h-full ${showcaseLayout.imageFitClass} transition-all duration-300`}
              />

              {/* Top-Right: Lighting Mode Switcher Pill */}
              <div className="absolute top-3.5 right-3.5 z-10">
                <div className="flex items-center gap-1 bg-white/90 backdrop-blur-xs text-[10px] text-[#6E6A62] font-mono px-2 py-1 rounded-full shadow-xs border border-black/5">
                  <span className="text-[#8C877E] uppercase text-[9px] mr-1">LIGHT :</span>
                  <button
                    onClick={() => setLightingMode("day")}
                    className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
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
                    className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
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
                    className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
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
              <div className="absolute bottom-4 left-4 z-10 max-w-[85%] truncate">
                <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-xs text-[#20201D] text-[10px] sm:text-[11px] font-medium tracking-wider uppercase px-3 py-1.5 rounded-full shadow-xs border border-black/5">
                  <MapPin className="w-3 h-3 text-[#A82626] shrink-0" />
                  <span className="truncate">{provenanceTag}</span>
                </span>
              </div>

              {/* Carousel Left & Right Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/70 hover:bg-white text-[#1E1E1C] flex items-center justify-center shadow-xs backdrop-blur-xs transition-all opacity-85 hover:opacity-100 z-10 cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/70 hover:bg-white text-[#1E1E1C] flex items-center justify-center shadow-xs backdrop-blur-xs transition-all opacity-85 hover:opacity-100 z-10 cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Title, Variants, Pricing, Description, Add to Cart */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            {/* Dynamic Collection Byline */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold text-[#A82626] tracking-[0.2em] uppercase">
                {`ARTSINLY · ${collectionState} HANDCRAFTED COLLECTION`}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-[34px] text-[#1E1E1C] font-normal leading-[1.18] tracking-tight">
              {currentProduct.title}
            </h1>

            {/* Subtitle in Italic Serif */}
            <p className="italic font-serif text-xs sm:text-sm text-[#68645C] mt-1.5 mb-3 leading-relaxed font-normal">
              {subtitle}
            </p>

            {/* Price Display */}
            <div className="flex items-baseline gap-2 mb-4 pb-3.5 border-b border-[#EAE5DD]">
              <span className="text-2xl sm:text-3xl font-bold text-[#1E1E1C] tracking-tight">
                {unitPriceDisplay}
              </span>
              {displayOriginalPrice && (
                <span className="text-xs sm:text-sm text-[#9E988E] line-through ml-1.5">
                  {displayOriginalPrice}
                </span>
              )}
              <span className="bg-[#FAF2EC] text-[#A82626] text-[10px] font-semibold px-2 py-0.5 rounded ml-2 border border-[#EEDCCF]">
                {badgeText}
              </span>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-[13px] text-[#55524B] leading-relaxed mb-4 font-normal">
              {currentProduct.description}
            </p>

            {/* SECTION 4: CONFIGURE VARIANTS INTERACTIVE PANEL */}
            <div className="bg-[#F6F2EB] border border-[#E3DCD1] rounded-xl p-4 sm:p-4.5 mb-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2DBD0] pb-2">
                <span className="text-[11px] font-bold tracking-[0.14em] text-[#2A2926] uppercase flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#A82626]" />
                  4. Configure Variants
                </span>
                <span className="text-[10px] font-mono text-[#7A756D]">
                  Handcrafted to order
                </span>
              </div>

              {/* Size Selector - Conditional: Only renders buttons if product has multiple sizes */}
              {hasMultipleSizes ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold text-[#3C3A35]">
                      Select Size:
                    </label>
                    <span className="text-[10px] text-[#7A756D] font-mono">
                      {selectedSize.dimensions}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSizes.map((size) => {
                      const isSelected = selectedSize.id === size.id;
                      return (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`p-2.5 rounded-lg text-left transition-all border cursor-pointer ${
                            isSelected
                              ? "bg-[#1E1E1C] text-white border-[#1E1E1C] shadow-xs"
                              : "bg-white/80 hover:bg-white text-[#2B2926] border-[#DDD5C8]"
                          }`}
                        >
                          <div className="text-[11px] font-bold truncate">{size.name}</div>
                          <div
                            className={`text-[10px] ${
                              isSelected ? "text-gray-300" : "text-[#7A756D]"
                            } truncate`}
                          >
                            {size.dimensions}
                          </div>
                          <div
                            className={`text-[11px] font-semibold mt-1 ${
                              isSelected ? "text-white" : "text-[#A82626]"
                            }`}
                          >
                            {size.priceDisplay}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold text-[#3C3A35]">
                      Craft Dimensions & Scale:
                    </label>
                    <span className="text-[10px] text-[#7A756D] font-mono">
                      Standard Studio Scale
                    </span>
                  </div>
                  <div className="bg-white/80 border border-[#DDD5C8] rounded-lg p-2.5 sm:p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-[#1E1E1C]">
                        {currentProduct.dimensions || "Authentic Handcrafted Dimensions"}
                      </div>
                      <div className="text-[10px] text-[#7A756D]">
                        Individually hand-shaped by master artisan
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#1E1E1C]">
                        {currentProduct.priceDisplay}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Color Theme Selector (rendered only for products that support color themes) */}
              {showColorThemes && availableColors.length > 0 && selectedColor && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold text-[#3C3A35]">
                      {availableColors[0]?.name.toLowerCase().includes("design")
                        ? "Select Design Option:"
                        : "Select Colour Theme:"}
                    </label>
                    <span className="text-[10px] font-mono font-medium text-[#1E1E1C]">
                      {selectedColor.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {availableColors.map((color, idx) => {
                      const isSelected = selectedColor.name === color.name;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedColor(color);
                            if (images && images.length > idx) {
                              setSelectedImageIndex(idx);
                            }
                          }}
                          className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#1E1E1C] text-white border-[#1E1E1C] shadow-xs"
                              : "bg-white/90 text-[#3A3834] border-[#DDD5C8] hover:border-[#1E1E1C]"
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-[11px] font-medium">{color.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector & Total Price */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E2DBD0]">
                <div>
                  <span className="text-[11px] font-semibold text-[#3C3A35] block mb-1">
                    Quantity:
                  </span>
                  <div className="flex items-center bg-white border border-[#DDD5C8] rounded-md overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="px-2.5 py-1 text-xs text-[#555049] hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 py-1 text-xs font-semibold font-mono text-[#1E1E1C]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      className="px-2.5 py-1 text-xs text-[#555049] hover:bg-black/5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-[#7A756D] block">
                    Total Price ({quantity} {quantity === 1 ? "unit" : "units"}):
                  </span>
                  <span className="text-xl font-bold text-[#1E1E1C]">
                    {totalPriceDisplay}
                  </span>
                </div>
              </div>

              {/* Selected Variant Summary Pill */}
              <div className="bg-white/70 rounded-md px-3 py-2 text-[11px] text-[#4A4741] flex flex-wrap items-center justify-between gap-1 border border-[#E5DFD4]">
                <span>
                  <strong>Selected:</strong>{" "}
                  {hasMultipleSizes
                    ? `${selectedSize.name} (${selectedSize.dimensions})`
                    : currentProduct.dimensions || "Standard Scale"}
                  {showColorThemes && selectedColor
                    ? selectedColor.name.toLowerCase().includes("design")
                      ? ` · ${selectedColor.name}`
                      : ` · Colour ${selectedColor.name}`
                    : ""}
                </span>
                <span className="text-[10px] text-[#2E7D52] font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Ready to dispatch
                </span>
              </div>
            </div>

            {/* Action Buttons: Add to Cart + Saved in Wishlist */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                className={`py-3 px-8 rounded-full text-xs font-semibold flex-1 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                  isAdded
                    ? "bg-[#2E7D52] text-white"
                    : "bg-[#1E1E1C] hover:bg-[#3B3A36] text-white"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>
                      Added {hasMultipleSizes ? selectedSize.name : "Item"} ({totalPriceDisplay}) to Cart
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      Add {hasMultipleSizes ? `${selectedSize.name} ` : ""}to Cart · {totalPriceDisplay}
                    </span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(currentProduct.id)}
                className={`py-3 px-5 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                  inWishlist
                    ? "bg-[#FAF2EC] border-[#E5D7CB] text-[#A82626]"
                    : "bg-[#FAF2EC] border-[#E5D7CB] text-[#A82626] hover:bg-[#F3ECE5]"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    inWishlist ? "fill-[#A82626] text-[#A82626]" : "text-[#A82626]"
                  }`}
                />
                <span>{inWishlist ? "Saved" : "Save"}</span>
              </button>
            </div>

            {/* Dynamic GI / Provenance Ledger Bar */}
            {currentProduct.giProduct ? (
              <div className="flex items-center justify-between text-xs py-3 mt-4 border-b border-[#EAE5DD]">
                <div className="flex items-center gap-1.5 text-[#2E7D52] font-medium text-xs">
                  <FileText className="w-3.5 h-3.5" />
                  <span>
                    GI Registered Craft · {currentProduct.giProduct}{" "}
                    {currentProduct.giApplicationNumber ? `(#${currentProduct.giApplicationNumber})` : ""}
                  </span>
                </div>
                {currentProduct.giRegistryUrl && (
                  <a
                    href={currentProduct.giRegistryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-[#1E1E1C] hover:text-[#A82626] uppercase tracking-wider underline underline-offset-2 flex items-center gap-1"
                  >
                    <span>GI Registry Record</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs py-3 mt-4 border-b border-[#EAE5DD]">
                <div className="flex items-center gap-1.5 text-[#2E7D52] font-medium text-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>
                    Authentic Regional Craft · {currentProduct.craftType} ({currentProduct.state || currentProduct.regionName})
                  </span>
                </div>
                <Link
                  href={`/catalog?region=${currentProduct.regionSlug || "all"}`}
                  className="text-[11px] font-semibold text-[#1E1E1C] hover:text-[#A82626] uppercase tracking-wider underline underline-offset-2 flex items-center gap-1"
                >
                  <span>Regional Ledger</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            {/* Dynamic Artisan Card Box */}
            <div className="bg-[#F7F4EE] border border-[#E8E2D8] rounded-lg p-3 sm:p-3.5 flex items-center justify-between gap-3 mt-4">
              <div className="flex items-center gap-3">
                <img
                  src={
                    currentProduct.artisan?.avatarUrl ||
                    (currentProduct.images && currentProduct.images[0]?.url) ||
                    "/images/products/Odisha Pattachitra painting with Frame.png"
                  }
                  alt={currentProduct.artisan?.artisanName || currentProduct.byline || "Master Artisan"}
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                  className="w-10 h-10 rounded-full object-cover border border-[#D5CFC5] shrink-0"
                />
                <div>
                  <h4 className="font-semibold text-xs text-[#1E1E1C]">
                    {currentProduct.artisan?.artisanName || currentProduct.byline || "Master Artisan"}
                  </h4>
                  <p className="text-[10px] text-[#807B72]">
                    {currentProduct.artisan?.locality || currentProduct.provenanceTag || currentProduct.state || "India"} •{" "}
                    {currentProduct.craftLineage || "Generational Lineage"}
                  </p>
                  <p className="text-[10px] text-[#6E6A62] line-clamp-1 mt-0.5">
                    {currentProduct.artisan?.story ||
                      currentProduct.artisan?.bio ||
                      currentProduct.story ||
                      "Preserving authentic generational handcraft traditions."}
                  </p>
                </div>
              </div>

              <Link
                href={
                  currentProduct.artisan?.slug
                    ? `/artisans/${currentProduct.artisan.slug}`
                    : `/catalog?region=${currentProduct.regionSlug || "all"}`
                }
                className="text-[11px] font-semibold text-[#A82626] hover:underline shrink-0 flex items-center gap-0.5"
              >
                <span>Artisan Profile</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3. THREE DETAILED SECTIONS: PRODUCT INFO, GI CERTIFICATION / PROVENANCE, AUTHENTICITY */}
        <div className="space-y-8 mb-16">
          {/* SECTION 1: PRODUCT INFORMATION */}
          <div className="bg-white border border-[#E5E0D7] rounded-xl p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#EAE5DD]">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#A82626] uppercase block mb-1">
                  SPECIFICATION ARCHITECTURE
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1E1E1C]">
                  1. Product Information
                </h2>
              </div>
              <span className="bg-[#FAF7F2] border border-[#E5E0D7] text-[#555049] text-[11px] font-mono px-3 py-1 rounded-full uppercase">
                {(currentProduct.state || currentProduct.regionName || "HERITAGE") +
                  " · " +
                  (currentProduct.craftType || "CRAFT")}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-[13px]">
              <div className="border border-[#F0ECE4] rounded-lg p-3.5 bg-[#FAF8F5]">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Product Name</span>
                <span className="font-semibold text-[#1E1E1C]">{currentProduct.title}</span>
              </div>

              <div className="border border-[#F0ECE4] rounded-lg p-3.5 bg-[#FAF8F5]">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Craft Category</span>
                <span className="font-semibold text-[#1E1E1C]">{currentProduct.craftType || "Traditional Craft"}</span>
              </div>

              <div className="border border-[#F0ECE4] rounded-lg p-3.5 bg-[#FAF8F5]">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Region of Origin</span>
                <span className="font-semibold text-[#1E1E1C]">{currentProduct.provenanceTag || currentProduct.state || "India"}</span>
              </div>

              <div className="border border-[#F0ECE4] rounded-lg p-3.5 bg-[#FAF8F5]">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Base Price</span>
                <span className="font-semibold text-[#1E1E1C]">
                  {hasMultipleSizes
                    ? `${defaultSize.priceDisplay} (${defaultSize.name} · ${defaultSize.dimensions})`
                    : `${currentProduct.priceDisplay || "₹" + ((currentProduct.pricePaise || 0) / 100).toLocaleString("en-IN")}`}
                </span>
              </div>

              <div className="border border-[#F0ECE4] rounded-lg p-3.5 bg-[#FAF8F5] md:col-span-2">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Description</span>
                <p className="text-[#3A3834] leading-relaxed">
                  {currentProduct.description}
                </p>
              </div>

              <div className="border border-[#F0ECE4] rounded-lg p-3.5 bg-[#FAF8F5] md:col-span-2">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Craft Technique</span>
                <p className="text-[#3A3834] leading-relaxed">
                  {currentProduct.craftTechnique ||
                    currentProduct.story ||
                    "Hand-shaped and finished using generational custodial craft methods."}
                </p>
              </div>

              <div className="border border-[#F0ECE4] rounded-lg p-3.5 bg-[#FAF8F5] md:col-span-2">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Materials</span>
                <p className="text-[#3A3834] leading-relaxed">
                  {currentProduct.materials || "Natural indigenous raw materials"}
                </p>
              </div>

              <div className="border border-[#F0ECE4] rounded-lg p-3.5 bg-[#FAF8F5]">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Dimensions</span>
                <span className="font-semibold text-[#1E1E1C]">
                  {hasMultipleSizes
                    ? `${selectedSize.dimensions} (Available in Small, Medium, Large)`
                    : currentProduct.dimensions}
                </span>
              </div>

              <div className="border border-[#F0ECE4] rounded-lg p-3.5 bg-[#FAF8F5]">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Weight / Shipping Weight</span>
                <span className="font-semibold text-[#1E1E1C]">
                  {currentProduct.weight
                    ? `${currentProduct.weight} · Shipping: ${currentProduct.shippingWeight || "Standard"}`
                    : "Standard Handcrafted Pack"}
                </span>
              </div>

              <div className="border border-[#F0ECE4] rounded-lg p-3.5 bg-[#FAF8F5] md:col-span-2">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Care Instructions</span>
                <p className="text-[#3A3834] leading-relaxed">
                  {currentProduct.careInstructions ||
                    "Handle with care. Dust gently using a soft, dry cloth. Keep away from excessive moisture."}
                </p>
              </div>
            </div>

            {/* Government Documentation Notice (Only for Odisha crafts or crafts with official documentation) */}
            {(currentProduct.state?.toLowerCase() === "odisha" || currentProduct.regionSlug === "odisha") && (
              <div className="mt-4 p-3.5 bg-[#F9F7F2] rounded-lg border border-[#E9E4D9] flex items-start gap-3">
                <Info className="w-4 h-4 text-[#A82626] shrink-0 mt-0.5" />
                <p className="text-xs text-[#555049] leading-relaxed">
                  <strong>Government of Odisha Documentation:</strong> The traditional canvas preparation and natural colour techniques are formally documented and safeguarded under the Odisha State Handloom & Handicrafts Directorate.
                </p>
              </div>
            )}

            {/* Traditional Unframed Cloth Canvas (Patta) Presentation (Only for Pattachitra) */}
            {(currentProduct.slug === "jagannath-divine-heritage-pattachitra" ||
              currentProduct.craftType?.toLowerCase().includes("pattachitra")) && (
              <div className="mt-6 pt-5 border-t border-[#EAE5DD] space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[#1E1E1C] uppercase tracking-wider">
                      Traditional Cloth Canvas (Patta) Detailing
                    </span>
                    <span className="text-[11px] text-[#7A756D] font-mono">
                      Pure natural pigments & tamarind glue canvas
                    </span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-[#E5E0D7] bg-[#FAF8F5] p-2 sm:p-3">
                    <img
                      src={
                        currentProduct.images && currentProduct.images.length > 1
                          ? currentProduct.images[1].url
                          : "/images/products/Odisha Pattachitra painting.png"
                      }
                      alt={`${currentProduct.title} canvas detail`}
                      width={1200}
                      height={896}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto rounded-lg object-contain shadow-2xs"
                    />
                    <div className="pt-2 px-1 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#6E6A62] gap-1">
                      <span>Individually hand-painted freehand linework with natural mineral pigments (without frame)</span>
                      <span className="italic font-serif">Raghurajpur Heritage Crafts Village · Puri, Odisha</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[#1E1E1C] uppercase tracking-wider">
                      Original Masterwork Painting (High-Resolution Scroll)
                    </span>
                    <span className="text-[11px] text-[#7A756D] font-mono">
                      Authentic master linework & sacred motifs
                    </span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-[#E5E0D7] bg-[#FAF8F5] p-2 sm:p-3">
                    <img
                      src={
                        currentProduct.images && currentProduct.images.length > 2
                          ? currentProduct.images[2].url
                          : currentProduct.images && currentProduct.images.length > 1
                          ? currentProduct.images[1].url
                          : "/images/products/Odisha Pattachitra painting Original.png"
                      }
                      alt={`${currentProduct.title} original scroll`}
                      width={1200}
                      height={896}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto rounded-lg object-contain shadow-2xs"
                    />
                    <div className="pt-2 px-1 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#6E6A62] gap-1">
                      <span>Full original scroll composition – {currentProduct.title}</span>
                      <span className="italic font-serif">Chitrakara Heritage Lineage · Puri, Odisha</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: GI CERTIFICATION / REGIONAL CRAFT PROVENANCE */}
          <div className="bg-white border border-[#E5E0D7] rounded-xl p-6 sm:p-8 shadow-2xs">
            {currentProduct.giProduct ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-[#EAE5DD] gap-2">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#2E7D52] uppercase block mb-1">
                      LEGAL & GEOGRAPHICAL INDICATION
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1E1E1C] flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#2E7D52]" />
                      2. GI Certification
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-1.5 bg-[#EAF5EE] text-[#2E7D52] text-xs font-semibold px-3 py-1 rounded-full border border-[#C5E5D0] self-start sm:self-auto">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    GI Status: {currentProduct.giStatus || "Registered"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs mb-5">
                  <div className="border border-[#EFEBE4] rounded-lg p-3 bg-[#FAF8F5]">
                    <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">GI Product</span>
                    <span className="font-semibold text-[#1E1E1C]">{currentProduct.giProduct}</span>
                  </div>

                  <div className="border border-[#EFEBE4] rounded-lg p-3 bg-[#FAF8F5]">
                    <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">GI Application Number</span>
                    <span className="font-semibold font-mono text-[#1E1E1C]">{currentProduct.giApplicationNumber || "88"}</span>
                  </div>

                  <div className="border border-[#EFEBE4] rounded-lg p-3 bg-[#FAF8F5]">
                    <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">GI Certificate Number</span>
                    <span className="font-semibold font-mono text-[#1E1E1C]">{currentProduct.giCertificateNumber || "70"}</span>
                  </div>

                  <div className="border border-[#EFEBE4] rounded-lg p-3 bg-[#FAF8F5]">
                    <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Registration Date</span>
                    <span className="font-semibold text-[#1E1E1C]">{currentProduct.giRegistrationDate || "10 July 2008"}</span>
                  </div>

                  <div className="border border-[#EFEBE4] rounded-lg p-3 bg-[#FAF8F5]">
                    <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Geographical Area</span>
                    <span className="font-semibold text-[#1E1E1C]">{currentProduct.giGeographicalArea || currentProduct.state || "Odisha, India"}</span>
                  </div>

                  <div className="border border-[#EFEBE4] rounded-lg p-3 bg-[#FAF8F5]">
                    <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Validity Listed</span>
                    <span className="font-semibold text-[#1E1E1C]">{currentProduct.giValidity || "Until 8 April 2027"}</span>
                  </div>
                </div>

                {currentProduct.giRegistryUrl && (
                  <div className="p-3.5 bg-[#FAF7F2] rounded-lg border border-[#EAE5DD] flex items-center justify-between flex-wrap gap-2 mb-4">
                    <span className="text-xs text-[#4A4741] font-medium">
                      GI Registered Craft Source: Official Intellectual Property India – GI Registry
                    </span>
                    <a
                      href={currentProduct.giRegistryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E7D52] hover:text-[#205739] underline underline-offset-2"
                    >
                      <span>View Official IP India Registry</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {/* Important GI Clarification Note */}
                <div className="p-4 bg-[#FFFBF0] rounded-lg border border-[#F3E5C8] text-xs text-[#6B5620] leading-relaxed">
                  <strong className="text-[#8C6D1F] block mb-1 font-semibold flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    Important Notice regarding GI Registration:
                  </strong>
                  {currentProduct.giDisclaimer ||
                    `The GI registration belongs to the registered craft (${currentProduct.giProduct}), not automatically to every individual product. The seller should provide applicable artisan or authorised producer documentation before claiming that a particular item is GI-certified.`}
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-[#EAE5DD] gap-2">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#2E7D52] uppercase block mb-1">
                      REGIONAL PROVENANCE & CUSTODIAL RECORDS
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1E1E1C] flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#2E7D52]" />
                      2. Regional Craft Heritage
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-1.5 bg-[#EAF5EE] text-[#2E7D52] text-xs font-semibold px-3 py-1 rounded-full border border-[#C5E5D0] self-start sm:self-auto">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    Custodial Craft: Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs mb-5">
                  <div className="border border-[#EFEBE4] rounded-lg p-3 bg-[#FAF8F5]">
                    <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Traditional Craft</span>
                    <span className="font-semibold text-[#1E1E1C]">{currentProduct.craftType}</span>
                  </div>

                  <div className="border border-[#EFEBE4] rounded-lg p-3 bg-[#FAF8F5]">
                    <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Geographic Region</span>
                    <span className="font-semibold text-[#1E1E1C]">{currentProduct.state || currentProduct.regionName}, India</span>
                  </div>

                  <div className="border border-[#EFEBE4] rounded-lg p-3 bg-[#FAF8F5]">
                    <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Craft Cluster / Origin</span>
                    <span className="font-semibold text-[#1E1E1C]">{currentProduct.provenanceTag || currentProduct.state}</span>
                  </div>

                  <div className="border border-[#EFEBE4] rounded-lg p-3 bg-[#FAF8F5]">
                    <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Artisan Custodian</span>
                    <span className="font-semibold text-[#1E1E1C]">{currentProduct.byline || currentProduct.artisan?.artisanName}</span>
                  </div>

                  <div className="border border-[#EFEBE4] rounded-lg p-3 bg-[#FAF8F5]">
                    <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Production Method</span>
                    <span className="font-semibold text-[#1E1E1C]">Individually hand-crafted</span>
                  </div>

                  <div className="border border-[#EFEBE4] rounded-lg p-3 bg-[#FAF8F5]">
                    <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Authenticity Ledger</span>
                    <span className="font-semibold text-[#1E1E1C]">ARTSINLY Certified Guild Maker</span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#FAF7F2] rounded-lg border border-[#EAE5DD] flex items-center justify-between flex-wrap gap-2 mb-4">
                  <span className="text-xs text-[#4A4741] font-medium">
                    Custodial Craft Documentation: Registered with State Handicrafts Directorate
                  </span>
                  <Link
                    href={`/catalog?region=${currentProduct.regionSlug || "all"}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E7D52] hover:text-[#205739] underline underline-offset-2"
                  >
                    <span>Explore {currentProduct.state || currentProduct.regionName} Crafts</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="p-4 bg-[#F8F6F1] rounded-lg border border-[#E5DFD4] text-xs text-[#555049] leading-relaxed">
                  <strong className="text-[#1E1E1C] block mb-1 font-semibold flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#A82626]" />
                    Authentic Regional Craftsmanship Guarantee:
                  </strong>
                  Every creation from {currentProduct.state || currentProduct.regionName} is crafted by generational custodians adhering to indigenous techniques and authentic local raw materials.
                </div>
              </>
            )}
          </div>

          {/* SECTION 3: AUTHENTICITY & GUILD LINEAGE */}
          <div className="bg-white border border-[#E5E0D7] rounded-xl p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#EAE5DD]">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#C2410C] uppercase block mb-1">
                  CUSTODIAL PROVENANCE & LINEAGE
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1E1E1C] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#C2410C]" />
                  3. Authenticity & Guild Lineage
                </h2>
              </div>
              <span className="bg-[#FAF2EC] border border-[#EEDCCF] text-[#C2410C] text-[11px] font-mono px-3 py-1 rounded-full uppercase">
                {currentProduct.artisanCommunity?.toUpperCase() ||
                  (currentProduct.craftType ? `${currentProduct.craftType.toUpperCase()} GUILD` : "MASTER GUILD")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs mb-5">
              <div className="border border-[#EFEBE4] rounded-lg p-3 bg-[#FAF8F5]">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Artisan Community</span>
                <span className="font-semibold text-[#1E1E1C]">{currentProduct.artisanCommunity || "Generational artisan community"}</span>
              </div>

              <div className="border border-[#EFEBE4] rounded-lg p-3 bg-[#FAF8F5]">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Traditional Craft Lineage</span>
                <span className="font-semibold text-[#1E1E1C]">{currentProduct.craftLineage || "Generational craft masters"}</span>
              </div>

              <div className="border border-[#EFEBE4] rounded-lg p-3 bg-[#FAF8F5]">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Craft Cluster</span>
                <span className="font-semibold text-[#1E1E1C]">
                  {currentProduct.craftCluster || currentProduct.provenanceTag || currentProduct.state}
                </span>
              </div>

              <div className="border border-[#EFEBE4] rounded-lg p-3 bg-[#FAF8F5]">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Production Method</span>
                <span className="font-semibold text-[#1E1E1C]">{currentProduct.productionMethod || "Individually hand-crafted"}</span>
              </div>

              <div className="border border-[#EFEBE4] rounded-lg p-3 bg-[#FAF8F5]">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Authenticity Proof</span>
                <span className="font-semibold text-[#1E1E1C]">{currentProduct.authenticityProof || "Artisan Certificate of Authenticity"}</span>
              </div>

              <div className="border border-[#EFEBE4] rounded-lg p-3 bg-[#FAF8F5]">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Artisan Identification</span>
                <span className="font-semibold text-[#1E1E1C]">
                  {currentProduct.artisanIdentification ||
                    currentProduct.byline ||
                    currentProduct.artisan?.artisanName ||
                    "Verified Studio Master"}
                </span>
              </div>

              <div className="border border-[#EFEBE4] rounded-lg p-3 bg-[#FAF8F5] sm:col-span-2 lg:col-span-3">
                <span className="text-[10px] font-mono text-[#8C877E] uppercase block mb-1">Guild / Cooperative Association</span>
                <span className="font-semibold text-[#1E1E1C]">
                  {currentProduct.guildOrCooperative ||
                    currentProduct.artisan?.shopName ||
                    `${currentProduct.byline || currentProduct.state} Master Artisans Guild`}
                </span>
              </div>
            </div>

            {/* Authenticity Statement for ARTSINLY */}
            <div className="p-4 bg-[#F8F6F1] rounded-lg border border-[#E5DFD4] text-xs leading-relaxed text-[#3C3A35]">
              <strong className="text-[#1E1E1C] block mb-1 font-serif text-sm">
                Authenticity statement for ARTSINLY:
              </strong>
              {currentProduct.authenticityStatement ||
                `Each artwork represents the traditional artistic heritage of ${
                  currentProduct.state || "India"
                }. The product listing identifies its artisan, place of origin, craft lineage and production method. An authenticity certificate accompanies the physical product when supplied by the artisan.`}
            </div>
          </div>
        </div>

        {/* 4. CURATED PAIRINGS / "From the Same Guild" (4-Card Grid) */}
        <div className="border-t border-[#EAE5DD] pt-12 pb-14">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-[10px] font-semibold text-[#807B72] uppercase tracking-[0.2em] block mb-1">
                Curated Regional Collections
              </span>
              <h2 className="font-serif text-2xl sm:text-[28px] font-normal text-[#1E1E1C]">
                Explore Indian Heritage Crafts
              </h2>
            </div>

            <Link
              href="/catalog"
              className="text-xs font-semibold text-[#1E1E1C] hover:text-[#A82626] tracking-wider uppercase transition-colors"
            >
              View Full Catalog →
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
                <div className="relative aspect-square w-full overflow-hidden bg-[#EFEBE4]">
                  <img
                    src={item.imageUrl}
                    alt={item.title || "Guild pairing craft item"}
                    width={320}
                    height={320}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                  />
                </div>

                <div className="p-3.5 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[9px] font-semibold text-[#807B72] uppercase tracking-wider block mb-1">
                      {item.categoryTag}
                    </span>
                    <h3 className="font-serif text-xs sm:text-[13px] font-medium text-[#1E1E1C] leading-snug line-clamp-1 group-hover:text-[#A82626] transition-colors mb-1.5">
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
