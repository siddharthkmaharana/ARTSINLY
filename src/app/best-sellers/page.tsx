"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";
import { Award, Check } from "lucide-react";

interface BestSellerItem {
  id: string;
  rankBadge: string;
  slug: string;
  originAndCraft: string;
  title: string;
  ratingText: string;
  priceDisplay: string;
  imageUrl: string;
}

const BEST_SELLERS: BestSellerItem[] = [
  {
    id: "seller-1",
    rankBadge: "Top #1",
    slug: "modern-ethnic-ceramic-vase-terracotta-indigenous-pattern",
    originAndCraft: "GUJARAT • TERRACOTTA POTTERY",
    title: "Modern Ethnic Ceramic Vase – Terracotta Vase with Indigenous Pattern",
    ratingText: "4.92 / 5.0 (38 verified collectors)",
    priceDisplay: "₹126.99",
    imageUrl:
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "seller-2",
    rankBadge: "Top #2",
    slug: "hand-carved-floral-high-relief-sheesham-clock",
    originAndCraft: "RAJASTHAN • WOOD CARVING",
    title: "Hand-Carved Floral High-Relief Sheesham Panel",
    ratingText: "4.96 / 5.0 (22 verified collectors)",
    priceDisplay: "₹700.00",
    imageUrl:
      "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "seller-3",
    rankBadge: "Top #3",
    slug: "sacred-srinathji-gold-leaf-pichwai-miniature",
    originAndCraft: "RAJASTHAN • MINIATURE PAINTING",
    title: "Sacred Srinathji Gold-Leaf Pichwai Miniature Painting",
    ratingText: "5 / 5.0 (14 verified collectors)",
    priceDisplay: "₹1500.00",
    imageUrl:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "seller-4",
    rankBadge: "Top #4",
    slug: "dhokra-primitive-tribal-bell-metal-vessel",
    originAndCraft: "WEST BENGAL • METALWORK",
    title: "Dhokra Primitive Tribal Bell-Metal Lost-Wax Vessel",
    ratingText: "4.88 / 5.0 (45 verified collectors)",
    priceDisplay: "₹190.00",
    imageUrl:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "seller-5",
    rankBadge: "Top #5",
    slug: "heritage-ajrakh-16-stage-indigo-botanical-throw",
    originAndCraft: "GUJARAT • BLOCK PRINTING",
    title: "Heritage Ajrakh 16-Stage Indigo Botanical Throw",
    ratingText: "4.98 / 5.0 (67 verified collectors)",
    priceDisplay: "₹184.00",
    imageUrl:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "seller-6",
    rankBadge: "Top #6",
    slug: "kalamkari-tree-of-life-hand-drawn-narrative-scroll",
    originAndCraft: "ANDHRA PRADESH • KALAMKARI PAINTING",
    title: "Kalamkari Tree of Life Hand-Drawn Wall Scroll",
    ratingText: "4.93 / 5.0 (16 verified collectors)",
    priceDisplay: "₹320.00",
    imageUrl:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=85",
  },
];

export default function BestSellersPage() {
  const { addToCart } = useCart();
  const [acquiredMap, setAcquiredMap] = useState<Record<string, boolean>>({});

  const handleAcquire = (item: BestSellerItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const matchedProduct =
      PRODUCTS.find((p) => p.slug === item.slug) || PRODUCTS[0];
    addToCart(matchedProduct, 1);

    setAcquiredMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAcquiredMap((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-5 sm:py-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb line matching exact screenshot */}
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
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#C2410C] uppercase tracking-[0.2em] block">
            RECOGNIZED EXCELLENCE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#1E1E1C] tracking-tight">
            Our Most Beloved Crafts
          </h1>
          <p className="text-xs sm:text-[13px] text-[#6E6A62] leading-relaxed max-w-lg mx-auto">
            Pieces that have garnered national awards and grace international architectural collections.
          </p>
        </div>

        {/* 3-Column × 2-Row Ranked Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mb-16">
          {BEST_SELLERS.map((item) => {
            const isAcquired = acquiredMap[item.id];

            return (
              <div
                key={item.id}
                className="bg-[#FAF7F2] border border-[#E5E0D7] rounded-xl p-3.5 sm:p-4 hover:shadow-md hover:border-[#D5CFC5] transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Product Image with Top # badge overlaid on top right */}
                  <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#ECE6DC] mb-3.5">
                    <Link href={`/products/${item.slug}`}>
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    </Link>

                    {/* Rank Pill Badge */}
                    <div className="absolute top-2.5 right-2.5 bg-[#1E1E1C] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full z-10 tracking-wider shadow-xs pointer-events-none">
                      {item.rankBadge}
                    </div>
                  </div>

                  {/* Craft & Region Meta */}
                  <span className="text-[10px] sm:text-[11px] font-semibold text-[#8C877E] uppercase tracking-wider block mb-1.5">
                    {item.originAndCraft}
                  </span>

                  {/* Title */}
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="font-serif text-[15px] sm:text-base font-normal text-[#1E1E1C] leading-snug line-clamp-2 h-11 mb-2 group-hover:text-[#C2410C] transition-colors">
                      {item.title}
                    </h3>
                  </Link>

                  {/* Rating / Verified Collectors */}
                  <div className="flex items-center gap-1.5 text-xs text-[#7A756D] mb-4">
                    <Award className="w-3.5 h-3.5 text-[#C2410C] shrink-0" />
                    <span>{item.ratingText}</span>
                  </div>
                </div>

                {/* Bottom Row: Price & Acquire Action */}
                <div className="flex items-center justify-between pt-2 border-t border-[#EFEBE4]">
                  <span className="text-base sm:text-lg font-medium text-[#1E1E1C]">
                    {item.priceDisplay}
                  </span>

                  <button
                    onClick={(e) => handleAcquire(item, e)}
                    className="bg-[#1E1E1C] text-white hover:bg-[#383734] px-4 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    {isAcquired ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Acquired</span>
                      </>
                    ) : (
                      <span>Acquire</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
