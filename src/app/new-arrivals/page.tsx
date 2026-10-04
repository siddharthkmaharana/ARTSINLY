"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";
import { Check } from "lucide-react";

interface NewDropItem {
  id: string;
  slug: string;
  badgeText: string;
  title: string;
  subtitle: string;
  description: string;
  priceDisplay: string;
  imageUrl: string;
}

const FRESH_DROPS: NewDropItem[] = [
  {
    id: "drop-1",
    slug: "modern-ethnic-ceramic-vase-terracotta-indigenous-pattern",
    badgeText: "JUST UNFIRED",
    title: "Modern Ethnic Ceramic Vase – Terracotta Vase with Indigenous Pattern",
    subtitle: "Minimalist Abstract Matte Decor for Living Room, Shelf & Tabletop Styling",
    description:
      "Elevate your home decor with this exquisite set of 2 modern ceramic vases, featuring a sculptural, abstract design that combines organic warmth with contemporary living room, shelf, and tabletop styling.",
    priceDisplay: "₹126.99",
    imageUrl:
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "drop-2",
    slug: "sacred-srinathji-gold-leaf-pichwai-miniature",
    badgeText: "JUST UNFIRED",
    title: "Sacred Srinathji Gold-Leaf Pichwai Miniature Painting",
    subtitle: "Pure Mineral Pigments on Hand-Loomed Cotton with 24K Leafing",
    description:
      "Painted with squirrel-hair brushes under high magnification. Features the divine cow and lotus pond symbolism of Nathdwara shrines executed with crushed lapis and malachite bound with natural gums.",
    priceDisplay: "₹1,500.00",
    imageUrl:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "drop-3",
    slug: "zardozi-hand-embroidered-velvet-adornment",
    badgeText: "JUST UNFIRED",
    title: "Zardozi Hand-Embroidered Velvet Wall Tapestry",
    subtitle: "Gilded Metallic Wire Threading with Semi-Precious Agate Stones",
    description:
      "Created over 140 artisan-hours on a stretched wooden Adda frame. Intricate couching holds hand-cut metallic wires in royal court relief, bordered by heirloom seed pearls and floral bullion filigree.",
    priceDisplay: "₹540.00",
    imageUrl:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "drop-4",
    slug: "jaipur-persian-quartz-blue-glazed-dinner-plates",
    badgeText: "JUST UNFIRED",
    title: "Jaipur Persian Quartz Blue Glazed Chalice",
    subtitle: "Clay-Free Egyptian Faience with Cobalt Brushwork",
    description:
      "An exceptional example of Jaipur blue pottery, formulated without clay from powdered quartz stone and natural plant gum, low-fired in wood-burning kilns for durable vitreous beauty.",
    priceDisplay: "₹110.00",
    imageUrl:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=85",
  },
];

export default function NewArrivalsPage() {
  const { addToCart } = useCart();
  const [claimedMap, setClaimedMap] = useState<Record<string, boolean>>({});

  const handleClaim = (item: NewDropItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const matchedProduct = PRODUCTS.find((p) => p.slug === item.slug) || PRODUCTS[0];
    addToCart(matchedProduct, 1);

    setClaimedMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setClaimedMap((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-5 sm:py-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb line from screenshot */}
        <nav className="flex items-center space-x-2 text-[11px] text-[#8C877E] mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
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

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#C2410C] uppercase tracking-[0.2em] block mb-1">
              FRESH FROM THE KILNS
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#1E1E1C] tracking-tight leading-tight">
              Fresh Drops • October 2026 Batch
            </h1>
          </div>

          <p className="text-xs text-[#7A756D] max-w-xs md:text-right leading-relaxed shrink-0">
            Each batch is strictly limited to what an artisan cluster can produce during the current celestial drying season.
          </p>
        </div>

        {/* 2-Column × 2-Row Horizontal Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7 mb-16">
          {FRESH_DROPS.map((drop) => {
            const isClaimed = claimedMap[drop.id];

            return (
              <div
                key={drop.id}
                className="bg-[#FAF7F2] border border-[#E5E0D7] rounded-xl overflow-hidden grid grid-cols-1 sm:grid-cols-12 hover:shadow-md hover:border-[#D5CFC5] transition-all group"
              >
                {/* Left Side: Product Image */}
                <Link
                  href={`/products/${drop.slug}`}
                  className="sm:col-span-5 relative aspect-square sm:aspect-auto w-full overflow-hidden bg-[#ECE6DC]"
                >
                  <img
                    src={drop.imageUrl}
                    alt={drop.title}
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                </Link>

                {/* Right Side: Content */}
                <div className="sm:col-span-7 p-5 sm:p-6 flex flex-col justify-between">
                  <div>
                    {/* Badge */}
                    <span className="inline-block bg-[#8A4B38] text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase mb-2">
                      {drop.badgeText}
                    </span>

                    {/* Title */}
                    <h3 className="font-serif text-base sm:text-[17px] font-medium text-[#1E1E1C] leading-snug hover:text-[#8A4B38] transition-colors mb-1.5">
                      <Link href={`/products/${drop.slug}`}>
                        {drop.title}
                      </Link>
                    </h3>

                    {/* Subtitle */}
                    <p className="text-xs italic text-[#706C64] leading-relaxed mb-2.5 line-clamp-1 font-serif">
                      {drop.subtitle}
                    </p>

                    {/* Excerpt */}
                    <p className="text-xs text-[#6B665E] leading-relaxed line-clamp-3 mb-4">
                      {drop.description}
                    </p>
                  </div>

                  {/* Bottom Row: Price & Claim Piece Button */}
                  <div className="pt-2 flex items-center justify-between border-t border-[#EAE5DD]">
                    <div className="text-base sm:text-lg font-semibold text-[#1E1E1C] tracking-tight">
                      {drop.priceDisplay}
                    </div>

                    <button
                      onClick={(e) => handleClaim(drop, e)}
                      className={`px-5 py-2 rounded-full text-xs font-semibold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer ${
                        isClaimed
                          ? "bg-[#52644B] text-white"
                          : "bg-[#1E1E1C] hover:bg-black text-white"
                      }`}
                    >
                      {isClaimed ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Piece Claimed</span>
                        </>
                      ) : (
                        "Claim Piece"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
