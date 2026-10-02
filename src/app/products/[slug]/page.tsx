"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS, REVIEWS } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/products/ProductCard";
import {
  Heart,
  ShoppingBag,
  Star,
  Check,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  Share2,
} from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"story" | "specs" | "reviews">("story");

  const inWishlist = isInWishlist(product.id);
  const productReviews = REVIEWS.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.categorySlug === product.categorySlug || p.regionSlug === product.regionSlug)
  ).slice(0, 3);

  const currentImage = product.images[selectedImageIndex]?.url || product.images[0]?.url;

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Trail */}
        <nav className="flex items-center space-x-2 text-xs text-[#6B685F] mb-8">
          <Link href="/" className="hover:text-[#20201D]">Home</Link>
          <ChevronRight className="w-3 h-3 text-[#A8A49A]" />
          <Link href="/products" className="hover:text-[#20201D]">Catalogue</Link>
          <ChevronRight className="w-3 h-3 text-[#A8A49A]" />
          <Link href={`/products?category=${product.categorySlug}`} className="hover:text-[#20201D]">
            {product.categoryName}
          </Link>
          <ChevronRight className="w-3 h-3 text-[#A8A49A]" />
          <span className="text-[#20201D] font-medium truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Product Top Section: Gallery + Commercial Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white border border-[#E8E0D2] rounded-xl p-6 sm:p-10 shadow-xs mb-14">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Display View */}
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-[#F3ECE1] border border-[#DCD0BD]">
              <img
                src={currentImage}
                alt={product.title}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                <span className="inline-flex items-center gap-1 bg-[#FFFFFF]/95 backdrop-blur-sm px-3 py-1 rounded text-xs font-semibold text-[#20201D] shadow-xs border border-[#DCD0BD]">
                  <MapPin className="w-3.5 h-3.5 text-[#89714F]" />
                  {product.state}
                </span>
                {product.isMadeToOrder && (
                  <span className="bg-[#89714F] text-[#FFFFFF] text-xs font-semibold px-2.5 py-0.5 rounded shadow-xs">
                    Made to Order ({product.leadTimeDays} Days)
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Selectors */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded border-2 overflow-hidden transition-all ${
                      selectedImageIndex === idx
                        ? "border-[#89714F] ring-2 ring-[#89714F]/20"
                        : "border-[#DCD0BD] opacity-70 hover:opacity-100"
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
            )}
          </div>

          {/* Right: Product Metadata & Purchasing */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Artisan Header attribution */}
              <div className="flex items-center justify-between border-b border-[#F3ECE1] pb-3">
                <Link
                  href={`/artisans/${product.artisan.slug}`}
                  className="flex items-center gap-2 group"
                >
                  <img
                    src={product.artisan.avatarUrl}
                    alt={product.artisan.artisanName}
                    className="w-8 h-8 rounded-full object-cover border border-[#DCD0BD]"
                  />
                  <div>
                    <span className="text-xs text-[#6B685F] block">Master Craftsman</span>
                    <span className="text-xs font-semibold text-[#20201D] group-hover:text-[#89714F] transition-colors">
                      {product.artisan.artisanName}
                    </span>
                  </div>
                </Link>

                <div className="flex items-center gap-1 text-[#89714F] text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-[#89714F]" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-[#A8A49A]">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title & Craft Type */}
              <div>
                <span className="text-xs font-semibold tracking-wider text-[#89714F] uppercase">
                  {product.craftType}
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#20201D] leading-tight mt-1">
                  {product.title}
                </h1>
              </div>

              {/* Pricing in INR */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="font-serif text-3xl font-medium text-[#20201D]">
                  {formatINR(product.pricePaise)}
                </span>
                {product.originalPricePaise && (
                  <span className="text-sm text-[#A8A49A] line-through">
                    {formatINR(product.originalPricePaise)}
                  </span>
                )}
                <span className="text-xs text-[#52644B] font-semibold bg-[#EBF0E9] px-2 py-0.5 rounded">
                  Fair-trade price (Zero Middlemen)
                </span>
              </div>

              {/* Short summary */}
              <p className="text-xs sm:text-sm text-[#6B685F] leading-relaxed">
                {product.description}
              </p>

              {/* Stock / Lead time Notice */}
              <div className="p-3 bg-[#F8F5EF] border border-[#DCD0BD] rounded-lg text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-[#20201D]">
                  <Sparkles className="w-4 h-4 text-[#89714F]" />
                  <span>
                    {product.stock > 0
                      ? `In Stock (${product.stock} units hand-finished in ${product.artisan.locality})`
                      : `Handmade upon order commission`}
                  </span>
                </div>
                <p className="text-[#6B685F] text-[11px]">
                  {product.isMadeToOrder
                    ? `Requires ${product.leadTimeDays} days of master artisan labor before dispatch.`
                    : `Dispatched within 24–48 hours via insured air transit.`}
                </p>
              </div>

              {/* Quantity & Actions */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#DCD0BD] rounded bg-[#F8F5EF]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-sm text-[#20201D] hover:bg-[#E8E0D2] transition-colors"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-xs font-semibold text-[#20201D]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-sm text-[#20201D] hover:bg-[#E8E0D2] transition-colors"
                      disabled={quantity >= 10}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`flex-grow py-3 px-6 rounded text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all ${
                      isAdded
                        ? "bg-[#52644B] text-white"
                        : "bg-[#20201D] hover:bg-[#89714F] text-white"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Your Shopping Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag • {formatINR(product.pricePaise * quantity)}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="p-3 border border-[#DCD0BD] rounded hover:border-[#89714F] bg-white text-[#20201D] transition-colors"
                    title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        inWishlist ? "fill-[#89714F] text-[#89714F]" : "text-[#20201D]"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Buyer Trust Points */}
            <div className="pt-6 border-t border-[#F3ECE1] grid grid-cols-2 gap-4 text-xs text-[#6B685F]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#89714F] shrink-0" />
                <span>GI Tag & Origin Certificate</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#89714F] shrink-0" />
                <span>Damage-Protected Transit</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#89714F] shrink-0" />
                <span>7-Day Authenticity Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#89714F] shrink-0" />
                <span>Direct Artisan Honorarium</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: The Story / Craft Specs / Reviews */}
        <div className="bg-white border border-[#E8E0D2] rounded-xl p-6 sm:p-10 shadow-xs mb-16">
          <div className="flex border-b border-[#E8E0D2] gap-8 mb-8 text-sm">
            <button
              onClick={() => setActiveTab("story")}
              className={`pb-3 font-serif text-lg font-medium transition-colors border-b-2 ${
                activeTab === "story"
                  ? "border-[#89714F] text-[#20201D]"
                  : "border-transparent text-[#6B685F] hover:text-[#20201D]"
              }`}
            >
              The Story of this Piece
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              className={`pb-3 font-serif text-lg font-medium transition-colors border-b-2 ${
                activeTab === "specs"
                  ? "border-[#89714F] text-[#20201D]"
                  : "border-transparent text-[#6B685F] hover:text-[#20201D]"
              }`}
            >
              Materials & Dimensions
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 font-serif text-lg font-medium transition-colors border-b-2 ${
                activeTab === "reviews"
                  ? "border-[#89714F] text-[#20201D]"
                  : "border-transparent text-[#6B685F] hover:text-[#20201D]"
              }`}
            >
              Reviews ({productReviews.length || product.reviewCount})
            </button>
          </div>

          {/* Tab 1: Story */}
          {activeTab === "story" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-serif text-xl font-medium text-[#20201D] mb-2">
                  Ancestral Technique & Cultural Narrative
                </h3>
                <p className="text-sm text-[#6B685F] leading-relaxed">
                  {product.story}
                </p>
              </div>

              {/* Artisan Profile Spotlight Card inside tab */}
              <div className="p-6 rounded-lg bg-[#F8F5EF] border border-[#DCD0BD] flex flex-col sm:flex-row gap-5 items-start">
                <img
                  src={product.artisan.avatarUrl}
                  alt={product.artisan.artisanName}
                  className="w-16 h-16 rounded-full object-cover border border-[#DCD0BD] shrink-0"
                />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif text-base font-semibold text-[#20201D]">
                      {product.artisan.artisanName}
                    </h4>
                    <span className="text-[10px] bg-[#EBF0E9] text-[#52644B] px-2 py-0.5 rounded font-semibold">
                      Verified Master
                    </span>
                  </div>
                  <p className="text-xs text-[#89714F]">
                    {product.artisan.shopName} • {product.artisan.locality}
                  </p>
                  <p className="text-xs text-[#6B685F] leading-relaxed">
                    {product.artisan.bio}
                  </p>
                  <Link
                    href={`/artisans/${product.artisan.slug}`}
                    className="inline-flex items-center text-xs font-semibold text-[#89714F] hover:underline pt-1"
                  >
                    View All Works by {product.artisan.artisanName} →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Specs */}
          {activeTab === "specs" && (
            <div className="max-w-2xl space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-3 py-2.5 border-b border-[#F3ECE1]">
                <span className="font-semibold text-[#6B685F]">Dimensions</span>
                <span className="col-span-2 text-[#20201D]">{product.dimensions}</span>
              </div>
              <div className="grid grid-cols-3 py-2.5 border-b border-[#F3ECE1]">
                <span className="font-semibold text-[#6B685F]">Materials Used</span>
                <span className="col-span-2 text-[#20201D]">{product.materials}</span>
              </div>
              <div className="grid grid-cols-3 py-2.5 border-b border-[#F3ECE1]">
                <span className="font-semibold text-[#6B685F]">Origin Cluster</span>
                <span className="col-span-2 text-[#20201D]">
                  {product.regionName}, {product.state}
                </span>
              </div>
              <div className="grid grid-cols-3 py-2.5 border-b border-[#F3ECE1]">
                <span className="font-semibold text-[#6B685F]">Care Guidelines</span>
                <span className="col-span-2 text-[#20201D]">{product.careInstructions}</span>
              </div>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === "reviews" && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center gap-4 p-4 bg-[#F8F5EF] rounded border border-[#DCD0BD]">
                <div className="text-center">
                  <div className="font-serif text-3xl font-medium text-[#20201D]">
                    {product.rating.toFixed(1)}
                  </div>
                  <div className="flex justify-center text-[#89714F] my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#89714F]" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#6B685F]">Verified Community Ratings</span>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                {productReviews.length === 0 ? (
                  <p className="text-xs text-[#6B685F]">
                    No written reviews yet. Be the first collector to review this authentic piece!
                  </p>
                ) : (
                  productReviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded border border-[#F3ECE1] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#20201D]">{rev.authorName}</span>
                        <span className="text-[#A8A49A]">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex text-[#89714F]">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-[#89714F]" />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-[#20201D]">{rev.title}</span>
                      </div>
                      <p className="text-xs text-[#6B685F] leading-relaxed">{rev.comment}</p>
                      {rev.locality && (
                        <span className="text-[10px] text-[#A8A49A] block">
                          Verified purchase from {rev.locality}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related Regional Creations */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs font-semibold text-[#89714F] uppercase tracking-wider block mb-1">
                  Discover More
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#20201D]">
                  Related Regional Crafts
                </h2>
              </div>
              <Link href="/products" className="text-xs font-semibold text-[#89714F] hover:underline">
                View All Crafts →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
