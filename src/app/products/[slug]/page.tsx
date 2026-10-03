"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS, REVIEWS } from "@/lib/mock-data";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/products/ProductCard";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Check,
  Award,
  Sparkles,
  MapPin,
  ShieldCheck,
} from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const product = PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];

  if (!product) {
    notFound();
  }

  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSwatchIndex, setSelectedSwatchIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const productReviews = REVIEWS.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const images = product.images.length > 0 ? product.images : [
    { id: "img-fallback", url: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85", altText: product.title }
  ];

  const currentImage = images[selectedImageIndex]?.url || images[0]?.url;

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const displayPrice = product.priceDisplay || `$${(product.priceDollars || 126.99).toFixed(2)}`;
  const displayOriginalPrice = product.originalPriceDisplay || "$155.00";
  const badgeText = product.badgeText || "Direct Artisan Pricing";
  const subtitle = product.subtitle || "Minimalist Abstract Matte Decor for Living Room, Shelf & Tabletop Styling";

  const swatches = product.colorSwatches && product.colorSwatches.length > 0
    ? product.colorSwatches
    : [
        { name: "Raw Terracotta", hex: "#8A4B38" },
        { name: "Sand Matte", hex: "#C8BEAF" },
      ];

  const bullets = product.bullets && product.bullets.length > 0
    ? product.bullets
    : [
        "Authentic raw smoked terracotta with burnished finish",
        "Hand-painted indigenous geometric motifs using iron-oxide minerals",
        "Wheel-thrown and low-fired in traditional wood-burning village kilns",
        "Treated with organic beeswax sealant on the interior",
      ];

  const provenanceTag = product.provenanceTag || product.state || "Gujarat";
  const craftTag = (product.craftType || "Terracotta Pottery").toUpperCase();

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Product Showcase Section (Matches Uploaded Screenshot) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          {/* Left Column: Thumbnails Stack + Main Image */}
          <div className="lg:col-span-7 flex gap-3 sm:gap-4 items-start">
            {/* Vertical Thumbnails Stack on the left */}
            <div className="flex flex-col gap-2.5 sm:gap-3 shrink-0">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded overflow-hidden transition-all duration-200 bg-[#EFEBE4] ${
                    selectedImageIndex === idx
                      ? "ring-2 ring-[#1E1E1C] opacity-100"
                      : "opacity-70 hover:opacity-100 border border-[#DDD8CE]"
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

            {/* Main Hero Image Container */}
            <div className="relative flex-grow aspect-[4/5] rounded overflow-hidden bg-[#EFEBE4] group border border-[#E5E0D7]">
              <img
                src={currentImage}
                alt={product.title}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Tag pill in top-left: e.g. GUJARAT • TERRACOTTA POTTERY */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-white/90 backdrop-blur-xs text-[#20201D] text-[10px] sm:text-[11px] font-medium tracking-wider uppercase px-3 py-1 rounded-full shadow-xs border border-black/5">
                  {provenanceTag} • {craftTag}
                </span>
              </div>

              {/* Carousel Left Navigation Arrow */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/70 hover:bg-white text-[#1E1E1C] flex items-center justify-center shadow-xs backdrop-blur-xs transition-all opacity-80 hover:opacity-100 z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Carousel Right Navigation Arrow */}
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/70 hover:bg-white text-[#1E1E1C] flex items-center justify-center shadow-xs backdrop-blur-xs transition-all opacity-80 hover:opacity-100 z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Title, Subtitle, Swatches, Price, Description, Bullets, Actions */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1E1E1C] font-normal leading-[1.18] tracking-tight">
              {product.title}
            </h1>

            {/* Subtitle in Italic */}
            <p className="italic font-serif text-sm sm:text-base text-[#68645C] mt-2 mb-4 leading-relaxed font-normal">
              {subtitle}
            </p>

            {/* Color Swatches */}
            <div className="flex items-center gap-2.5 mb-5">
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
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-[#1E1E1C] tracking-tight">
                {displayPrice}
              </span>
              <span className="text-sm text-[#9E988E] line-through ml-2">
                {displayOriginalPrice}
              </span>
              <span className="bg-[#F4EDE4] text-[#8A4B38] text-[11px] font-semibold px-2 py-0.5 rounded ml-2">
                {badgeText}
              </span>
            </div>

            {/* Description Paragraph */}
            <p className="text-xs sm:text-[13px] text-[#55524B] leading-relaxed my-3 font-normal">
              {product.description}
            </p>

            {/* Feature Bullets */}
            <ul className="space-y-2 mb-7 text-xs sm:text-[13px] text-[#55524B]">
              {bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#807C74]">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            {/* Action Buttons: Add to Cart (Black Pill) + Add to Wishlist (Hollow Pill) */}
            <div className="flex items-center gap-3">
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
                onClick={() => toggleWishlist(product.id)}
                className={`py-3 px-6 rounded-full text-xs font-semibold border border-[#D5CFC5] hover:border-[#1E1E1C] transition-all flex items-center justify-center gap-2 ${
                  inWishlist
                    ? "bg-[#FAF7F2] text-[#89714F] border-[#89714F]"
                    : "bg-transparent hover:bg-white text-[#1E1E1C]"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    inWishlist ? "fill-[#89714F] text-[#89714F]" : "text-[#1E1E1C]"
                  }`}
                />
                <span>{inWishlist ? "In Wishlist" : "Add to Wishlist"}</span>
              </button>
            </div>

            {/* Separator line */}
            <div className="border-t border-[#EAE5DD] mt-8 pt-6 flex items-center justify-between text-xs text-[#68645C]">
              <span>Dimensions: {product.dimensions}</span>
              <span>Stock: {product.stock > 0 ? `${product.stock} units ready` : "Made to order"}</span>
            </div>
          </div>
        </div>

        {/* Lower Section: Master Artisan Custodian Info */}
        <div className="border-t border-[#EAE5DD] pt-12 pb-8 mb-12">
          <div className="bg-[#FAF7F2] border border-[#E5E0D7] rounded-lg p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start justify-between">
            <div className="flex items-start gap-4">
              <img
                src={product.artisan.avatarUrl}
                alt={product.artisan.artisanName}
                className="w-16 h-16 rounded-full object-cover border border-[#D5CFC5] shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-medium text-[#1E1E1C]">
                    Crafted by {product.artisan.artisanName}
                  </h3>
                  <span className="text-[10px] bg-[#EBF0E9] text-[#52644B] px-2 py-0.5 rounded font-semibold uppercase">
                    Verified Master
                  </span>
                </div>
                <p className="text-xs text-[#89714F] font-medium">
                  {product.artisan.shopName} • {product.artisan.locality}, {product.state}
                </p>
                <p className="text-xs text-[#68645C] max-w-2xl leading-relaxed pt-1">
                  {product.artisan.bio}
                </p>
              </div>
            </div>

            <Link
              href={`/artisans/${product.artisan.slug}`}
              className="px-5 py-2 rounded-full border border-[#D5CFC5] hover:border-[#1E1E1C] bg-white text-xs font-semibold text-[#1E1E1C] shrink-0 transition-colors"
            >
              View Artisan Profile
            </Link>
          </div>
        </div>

        {/* Related Heritage Crafts */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-[#EAE5DD] pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-semibold text-[#A65D47] uppercase tracking-[0.2em] block mb-1">
                Explore More
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1E1E1C]">
                Related Handcrafted Creations
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
