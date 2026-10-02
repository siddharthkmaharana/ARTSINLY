"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { formatINR } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingBag, Star, Check, Sparkles, MapPin } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const inWishlist = isInWishlist(product.id);

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
    toggleWishlist(product.id);
  };

  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="craft-card rounded-md overflow-hidden flex flex-col group relative">
      {/* 4:5 Aspect Ratio Image Container */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-craft w-full overflow-hidden bg-[#F3ECE1]"
      >
        <img
          src={primaryImage}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Region & Craft Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span className="inline-flex items-center gap-1 bg-[#FFFFFF]/95 backdrop-blur-sm px-2.5 py-0.5 rounded text-[11px] font-medium text-[#20201D] shadow-xs border border-[#E8E0D2]">
            <MapPin className="w-3 h-3 text-[#89714F]" />
            {product.state}
          </span>
          {product.isMadeToOrder && (
            <span className="bg-[#89714F] text-[#FFFFFF] text-[10px] font-semibold px-2 py-0.5 rounded tracking-wide uppercase">
              Made to Order
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] text-[#20201D] hover:text-[#89714F] transition-all shadow-xs backdrop-blur-sm"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              inWishlist ? "fill-[#89714F] text-[#89714F]" : "text-[#20201D]"
            }`}
          />
        </button>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-4 text-xs font-semibold rounded shadow-md flex items-center justify-center gap-1.5 transition-all ${
              isAdded
                ? "bg-[#52644B] text-[#FFFFFF]"
                : "bg-[#20201D] hover:bg-[#89714F] text-[#FFFFFF]"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Artisan & Lineage */}
          <div className="flex items-center justify-between text-xs text-[#6B685F] mb-1.5">
            <Link
              href={`/artisans/${product.artisan.slug}`}
              className="hover:text-[#89714F] font-medium truncate max-w-[70%]"
            >
              by {product.artisan.artisanName}
            </Link>
            <div className="flex items-center gap-0.5 text-[#89714F] font-medium text-[11px]">
              <Star className="w-3 h-3 fill-[#89714F]" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-[#A8A49A]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif text-base sm:text-lg font-medium text-[#20201D] leading-snug line-clamp-2 hover:text-[#89714F] transition-colors mb-2">
            <Link href={`/products/${product.slug}`}>{product.title}</Link>
          </h3>

          {/* Craft Tradition Tag */}
          <p className="text-xs text-[#89714F] font-medium tracking-wide mb-3">
            {product.craftType}
          </p>
        </div>

        {/* Pricing & Stock Details */}
        <div className="pt-3 border-t border-[#F3ECE1] flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-lg sm:text-xl font-medium text-[#20201D]">
              {formatINR(product.pricePaise)}
            </span>
            {product.originalPricePaise && (
              <span className="text-xs text-[#A8A49A] line-through">
                {formatINR(product.originalPricePaise)}
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#52644B] font-medium">
            {product.stock > 0 ? `${product.stock} in stock` : "Handmade on order"}
          </span>
        </div>
      </div>
    </div>
  );
}
