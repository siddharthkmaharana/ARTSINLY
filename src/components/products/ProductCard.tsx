"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Heart, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
  variant?: "catalog" | "default";
}

function getDisplayCraft(craftType?: string, categorySlug?: string, title?: string): string {
  const c = (craftType || "").toLowerCase();
  const s = (categorySlug || "").toLowerCase();
  const t = (title || "").toLowerCase();

  if (c.includes("pattachitra") || s.includes("pattachitra") || t.includes("pattachitra")) return "Pattachitra Painting";
  if (c.includes("applique") || c.includes("appliqué") || s.includes("applique") || t.includes("applique")) return "Pipili Appliqué";
  if (c.includes("dhokra") || s.includes("dhokra") || t.includes("dhokra")) return "Dhokra Metal";
  if (c.includes("papier") || c.includes("mask") || s.includes("mask") || t.includes("mask")) return "Papier-Mâché";
  if (c.includes("wood") || c.includes("toy") || s.includes("wood") || t.includes("wood") || t.includes("elephant")) {
    if (t.includes("dhokra")) return "Dhokra Metal";
    return "Wood Carving";
  }
  if (c.includes("terracotta") || c.includes("pottery") || c.includes("clay") || s.includes("terracotta") || s.includes("pottery")) {
    if (t.includes("blue pottery") || c.includes("blue")) return "Blue Pottery";
    return "Terracotta Pottery";
  }
  if (c.includes("zardozi") || s.includes("zardozi")) return "Zardozi Embroidery";
  if (c.includes("miniature") || c.includes("pichwai")) return "Miniature Painting";
  if (c.includes("kalamkari")) return "Kalamkari Painting";
  if (c.includes("block") || c.includes("ajrakh")) return "Block Print";
  if (c.includes("filigree") || c.includes("tarakasi")) return "Silver Filigree";
  if (c.includes("kantha")) return "Nakshi Kantha";
  if (c.includes("bidriware")) return "Bidriware Metal";

  if (craftType && craftType.length <= 22) return craftType;
  return craftType ? craftType.split("/")[0].split("–")[0].trim() : "Traditional Craft";
}

function getDisplayByline(product: Product): string {
  let byline = (product.byline || product.artisan?.artisanName || "").trim();
  if (!byline) return "Master Guild";

  if (byline.startsWith("Master Guild •")) {
    byline = byline.replace(/^Master Guild\s*•\s*/, "").trim();
  } else if (byline.startsWith("Master Guild")) {
    byline = byline.replace(/^Master Guild\s*/, "").trim();
  } else if (byline.startsWith("By ")) {
    byline = byline.replace(/^By\s*/, "").trim();
  }

  byline = byline
    .replace("Pipili Master Appliqué Artisan Cooperative", "Pipili Appliqué Guild")
    .replace("Pipili Heritage Appliqué Cooperative", "Pipili Appliqué Guild")
    .replace("Raghurajpur Heritage Chitrakara Guild", "Chitrakara Guild")
    .replace("Saptasajya Dhokra Artisans Foundation", "Sadeibareni Dhokra Guild")
    .replace("Sadeibareni Dhokra Artisan Guild", "Sadeibareni Dhokra Guild")
    .replace("Sambalpur Master Terracotta Guild", "Sambalpur Terracotta Guild")
    .replace("Sambalpur Terracotta Artisan Collective", "Sambalpur Terracotta Guild")
    .replace("Balasore Heritage Kumbhar Guild", "Balasore Kumbhar Guild")
    .replace("Balasore Kumbhar Heritage Artisans", "Balasore Kumbhar Guild")
    .replace("Puri Heritage Papier-Mâché Guild", "Puri Papier-Mâché Guild")
    .replace("Puri Heritage Papier-Mâché Artisans", "Puri Papier-Mâché Guild")
    .replace("Bargarh Master Woodcraft Guild", "Bargarh Woodcraft Guild")
    .replace("Bargarh Heritage Woodcarving Guild", "Bargarh Woodcraft Guild");

  return `Master Guild • ${byline}`;
}

function getDisplayRegionTag(product: Product): string {
  const prov = (product.provenanceTag || "").trim();
  const state = (product.state || product.regionName || "").trim();

  if (!prov || prov.toLowerCase() === "india") {
    return state || "India";
  }

  if (prov.length <= 16 && !prov.includes(",")) {
    return prov;
  }

  const cleanProv = prov.replace(/,?\s*India$/i, "").trim();
  const parts = cleanProv.split(",").map((s) => s.trim().replace(/^Western\s+/i, ""));

  if (parts.length >= 2) {
    const city = parts[0];
    const region = parts[parts.length - 1];
    return `${city} • ${region}`;
  }

  return cleanProv;
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [localFavorited, setLocalFavorited] = useState(product.initialFavorited ?? false);
  const inWishlist = isInWishlist(product.id) || localFavorited;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalFavorited(!inWishlist);
    toggleWishlist(product.id);
  };

  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    "/images/products/Odisha/Odisha Pattachitra painting with Frame.png";

  const displayPrice = product.priceDisplay || `₹${(product.priceDollars || (product.pricePaise / 100)).toFixed(0)}`;

  // Catalog Variant matching uploaded screenshot
  if (variant === "catalog") {
    return (
      <div className="bg-[#ECE6DC]/60 dark:bg-[#1A1815] border border-[#DDD5C8] dark:border-[#2D2A25] rounded-xl p-3 flex flex-col group transition-all duration-300 hover:shadow-md hover:border-[#CCC2B2] dark:hover:border-[#3D3933]">
        {/* Product Image with Region Pill */}
        <Link
          href={`/products/${product.slug}`}
          className="block relative aspect-square w-full rounded-lg overflow-hidden bg-[#E2DBD0] dark:bg-[#24211D]"
        >
          <img
            src={primaryImage}
            alt={
              product.title
                ? `${product.title} — Handcrafted ${product.craftType} from ${product.state}`
                : "Authentic Indian Handcrafted Heritage Craft"
            }
            width={400}
            height={400}
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
            loading="lazy"
            decoding="async"
          />

          {/* Region Tag Pill on top-left of image */}
          <div className="absolute top-2.5 left-2.5">
            <span className="bg-white/90 dark:bg-[#1E1C19]/90 backdrop-blur-xs text-[#2A2926] dark:text-[#FAF7F2] text-[10px] font-medium px-2.5 py-0.5 rounded-full shadow-2xs border border-black/5 dark:border-white/10">
              {getDisplayRegionTag(product)}
            </span>
          </div>
        </Link>

        {/* Card Content */}
        <div className="pt-2.5 px-0.5 flex flex-col flex-grow justify-between">
          <div>
            {/* Craft on left | Artisan on right in italic */}
            <div className="flex items-center justify-between text-[11px] mb-1 gap-2 overflow-hidden w-full">
              <span className="text-[#7A756D] dark:text-[#A8A297] font-normal truncate shrink min-w-0 max-w-[48%]">
                {getDisplayCraft(product.craftType, product.categorySlug, product.title)}
              </span>
              <span className="text-[#555049] dark:text-[#C5BFB5] italic truncate shrink min-w-0 max-w-[52%] text-right">
                {getDisplayByline(product)}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-serif text-[13px] sm:text-[14px] font-medium text-[#1E1E1C] dark:text-[#FAF7F2] leading-snug truncate hover:text-[#89714F] dark:hover:text-[#D4AF37] transition-colors mb-2.5">
              <Link href={`/products/${product.slug}`}>
                {product.shortTitle || product.title}
              </Link>
            </h3>
          </div>

          {/* Bottom Row: Price on left | Heart + Add button on right */}
          <div className="pt-1 flex items-center justify-between gap-2">
            <div className="text-sm sm:text-base font-semibold text-[#1E1E1C] dark:text-[#FAF7F2] tracking-tight">
              {displayPrice}
            </div>

            <div className="flex items-center gap-1.5">
              {/* Wishlist Button */}
              <button
                onClick={handleWishlist}
                className="w-7 h-7 rounded-full border border-[#D5CFC5] dark:border-[#33302A] bg-white dark:bg-[#25221E] flex items-center justify-center text-[#20201D] dark:text-[#FAF7F2] hover:border-[#1E1E1C] dark:hover:border-[#FAF7F2] transition-colors shadow-2xs cursor-pointer"
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={`w-3.5 h-3.5 transition-colors ${
                    inWishlist ? "fill-[#C2410C] text-[#C2410C]" : "text-[#7A756D] dark:text-[#A8A297]"
                  }`}
                />
              </button>

              {/* Add Black Pill Button */}
              <button
                onClick={handleAddToCart}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
                  isAdded
                    ? "bg-[#52644B] text-white"
                    : "bg-[#1E1E1C] hover:bg-black dark:bg-[#FAF7F2] dark:hover:bg-white text-white dark:text-[#141311]"
                }`}
              >
                {isAdded ? "Added" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default Variant (e.g. for homepage / other sections)
  return (
    <div className="bg-[#FAF7F2] dark:bg-[#1A1815] border border-[#E5E0D7] dark:border-[#2D2A25] rounded-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-md hover:border-[#D5CFC5] dark:hover:border-[#3D3933]">
      {/* Product Image with Region Pill */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-[4/5] w-full overflow-hidden bg-[#EFEBE4] dark:bg-[#24211D]"
      >
        <img
          src={primaryImage}
          alt={product.title || "Handcrafted artisan product"}
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Region Tag Pill on top-left of image */}
        <div className="absolute top-3.5 left-3.5">
          <span className="bg-white/90 dark:bg-[#1E1C19]/90 backdrop-blur-xs text-[#20201D] dark:text-[#FAF7F2] text-[11px] font-medium px-2.5 py-0.5 rounded-full shadow-xs border border-black/5 dark:border-white/10">
            {getDisplayRegionTag(product)}
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-[#FAF7F2] dark:bg-[#1A1815]">
        <div>
          {/* Category on left | Artisan on right in italic */}
          <div className="flex items-center justify-between text-xs mb-1.5 gap-2 overflow-hidden w-full">
            <span className="text-[#807C74] dark:text-[#A8A297] font-normal truncate shrink min-w-0 max-w-[48%]">
              {getDisplayCraft(product.craftType, product.categorySlug, product.title)}
            </span>
            <span className="text-[#706C64] dark:text-[#C5BFB5] italic truncate shrink min-w-0 max-w-[52%] text-right">
              {getDisplayByline(product)}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-base sm:text-[17px] font-medium text-[#1E1E1C] dark:text-[#FAF7F2] leading-snug line-clamp-2 hover:text-[#89714F] dark:hover:text-[#D4AF37] transition-colors mb-2">
            <Link href={`/products/${product.slug}`}>{product.title}</Link>
          </h3>

          {/* 2-line snippet */}
          <p className="text-xs text-[#736F66] dark:text-[#A8A297] line-clamp-2 leading-relaxed mb-4">
            {product.excerpt || product.description}
          </p>
        </div>

        {/* Bottom Row: Price on left | Heart + Add to Cart pill on right */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <div className="text-lg font-semibold text-[#1E1E1C] dark:text-[#FAF7F2] tracking-tight">
            {displayPrice}
          </div>

          <div className="flex items-center gap-2">
            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className="w-8 h-8 rounded-full border border-[#D5CFC5] dark:border-[#33302A] bg-white dark:bg-[#25221E] flex items-center justify-center text-[#20201D] dark:text-[#FAF7F2] hover:border-[#89714F] hover:text-[#89714F] transition-colors cursor-pointer"
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  inWishlist ? "fill-[#89714F] text-[#89714F]" : "text-[#20201D] dark:text-[#FAF7F2]"
                }`}
              />
            </button>

            {/* Add to Cart Black Pill Button */}
            <button
              onClick={handleAddToCart}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                isAdded
                  ? "bg-[#52644B] text-white"
                  : "bg-[#1E1E1C] hover:bg-[#3B3A36] dark:bg-[#FAF7F2] dark:hover:bg-white text-white dark:text-[#141311]"
              }`}
            >
              {isAdded ? (
                <span className="inline-flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </span>
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
