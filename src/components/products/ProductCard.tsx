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
    "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80";

  const displayPrice = product.priceDisplay || `₹${(product.priceDollars || (product.pricePaise / 100)).toFixed(0)}`;

  // Catalog Variant matching uploaded screenshot
  if (variant === "catalog") {
    return (
      <div className="bg-[#ECE6DC]/60 border border-[#DDD5C8] rounded-xl p-3 flex flex-col group transition-all duration-300 hover:shadow-md hover:border-[#CCC2B2]">
        {/* Product Image with Region Pill */}
        <Link
          href={`/products/${product.slug}`}
          className="block relative aspect-square w-full rounded-lg overflow-hidden bg-[#E2DBD0]"
        >
          <img
            src={primaryImage}
            alt={product.title}
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Region Tag Pill on top-left of image */}
          <div className="absolute top-2.5 left-2.5">
            <span className="bg-white/90 backdrop-blur-xs text-[#2A2926] text-[10px] font-medium px-2.5 py-0.5 rounded-full shadow-2xs border border-black/5">
              {product.provenanceTag || product.state}
            </span>
          </div>
        </Link>

        {/* Card Content */}
        <div className="pt-2.5 px-0.5 flex flex-col flex-grow justify-between">
          <div>
            {/* Craft on left | Artisan on right in italic */}
            <div className="flex items-center justify-between text-[11px] mb-1 gap-2">
              <span className="text-[#7A756D] font-normal truncate">
                {product.craftType}
              </span>
              <span className="text-[#555049] italic truncate shrink-0">
                {product.byline || product.artisan.artisanName}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-serif text-[13px] sm:text-[14px] font-medium text-[#1E1E1C] leading-snug truncate hover:text-[#89714F] transition-colors mb-2.5">
              <Link href={`/products/${product.slug}`}>
                {product.shortTitle || product.title}
              </Link>
            </h3>
          </div>

          {/* Bottom Row: Price on left | Heart + Add button on right */}
          <div className="pt-1 flex items-center justify-between gap-2">
            <div className="text-sm sm:text-base font-semibold text-[#1E1E1C] tracking-tight">
              {displayPrice}
            </div>

            <div className="flex items-center gap-1.5">
              {/* Wishlist Button */}
              <button
                onClick={handleWishlist}
                className="w-7 h-7 rounded-full border border-[#D5CFC5] bg-white flex items-center justify-center text-[#20201D] hover:border-[#1E1E1C] transition-colors shadow-2xs"
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={`w-3.5 h-3.5 transition-colors ${
                    inWishlist ? "fill-[#C2410C] text-[#C2410C]" : "text-[#7A756D]"
                  }`}
                />
              </button>

              {/* Add Black Pill Button */}
              <button
                onClick={handleAddToCart}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all shadow-2xs ${
                  isAdded
                    ? "bg-[#52644B] text-white"
                    : "bg-[#1E1E1C] hover:bg-black text-white"
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
    <div className="bg-[#FAF7F2] border border-[#E5E0D7] rounded-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-md hover:border-[#D5CFC5]">
      {/* Product Image with Region Pill */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-[4/5] w-full overflow-hidden bg-[#EFEBE4]"
      >
        <img
          src={primaryImage}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Region Tag Pill on top-left of image */}
        <div className="absolute top-3.5 left-3.5">
          <span className="bg-white/90 backdrop-blur-xs text-[#20201D] text-[11px] font-medium px-2.5 py-0.5 rounded-full shadow-xs border border-black/5">
            {product.provenanceTag || product.state}
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-[#FAF7F2]">
        <div>
          {/* Category on left | Artisan on right in italic */}
          <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
            <span className="text-[#807C74] font-normal truncate">
              {product.craftType}
            </span>
            <span className="text-[#706C64] italic truncate shrink-0">
              {product.byline || `By ${product.artisan.artisanName}`}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-base sm:text-[17px] font-medium text-[#1E1E1C] leading-snug line-clamp-2 hover:text-[#89714F] transition-colors mb-2">
            <Link href={`/products/${product.slug}`}>{product.title}</Link>
          </h3>

          {/* 2-line snippet */}
          <p className="text-xs text-[#736F66] line-clamp-2 leading-relaxed mb-4">
            {product.excerpt || product.description}
          </p>
        </div>

        {/* Bottom Row: Price on left | Heart + Add to Cart pill on right */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <div className="text-lg font-semibold text-[#1E1E1C] tracking-tight">
            {displayPrice}
          </div>

          <div className="flex items-center gap-2">
            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className="w-8 h-8 rounded-full border border-[#D5CFC5] bg-white flex items-center justify-center text-[#20201D] hover:border-[#89714F] hover:text-[#89714F] transition-colors"
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  inWishlist ? "fill-[#89714F] text-[#89714F]" : "text-[#20201D]"
                }`}
              />
            </button>

            {/* Add to Cart Black Pill Button */}
            <button
              onClick={handleAddToCart}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${
                isAdded
                  ? "bg-[#52644B] text-white"
                  : "bg-[#1E1E1C] hover:bg-[#3B3A36] text-white"
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
