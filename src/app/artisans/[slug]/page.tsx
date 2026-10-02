import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTISANS, PRODUCTS } from "@/lib/mock-data";
import { ProductCard } from "@/components/products/ProductCard";
import {
  MapPin,
  Award,
  Calendar,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

interface ArtisanPageProps {
  params: Promise<{ slug: string }>;
}

export default function ArtisanProfilePage({ params }: ArtisanPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const artisan = ARTISANS.find((a) => a.slug === slug);

  if (!artisan) {
    notFound();
  }

  const artisanProducts = PRODUCTS.filter((p) => p.artisan.id === artisan.id);

  return (
    <div className="bg-[#F8F5EF] min-h-screen pb-16">
      {/* Banner / Cover */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#20201D]">
        {artisan.bannerUrl ? (
          <img
            src={artisan.bannerUrl}
            alt={artisan.shopName}
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-[#3B3A36]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#20201D] via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        {/* Artisan Profile Card */}
        <div className="bg-white border border-[#E8E0D2] rounded-xl p-6 sm:p-10 shadow-sm mb-12">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-md shrink-0 bg-[#F3ECE1]">
              <img
                src={artisan.avatarUrl}
                alt={artisan.artisanName}
                className="w-full h-full object-cover"
              />
              {artisan.isVerified && (
                <div
                  className="absolute bottom-1 right-1 bg-[#52644B] text-white p-1 rounded-full border-2 border-white shadow-xs"
                  title="Verified Master Artisan"
                >
                  <Award className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="space-y-3 flex-grow">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#89714F] uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>
                      {artisan.locality}, {artisan.state}
                    </span>
                  </div>
                  <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#20201D] mt-1">
                    {artisan.artisanName}
                  </h1>
                  <p className="text-sm text-[#6B685F] font-medium">{artisan.shopName}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#F4EFE6] border border-[#DCD0BD] text-xs font-medium text-[#89714F]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{artisan.craftTradition}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#EBF0E9] text-xs font-medium text-[#52644B]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified GI Artisan</span>
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#20201D] leading-relaxed max-w-3xl">
                {artisan.bio}
              </p>

              {artisan.featuredQuote && (
                <blockquote className="border-l-3 border-[#89714F] pl-4 py-1.5 text-xs sm:text-sm italic text-[#20201D]/85 bg-[#F8F5EF] rounded-r max-w-3xl">
                  &ldquo;{artisan.featuredQuote}&rdquo;
                </blockquote>
              )}
            </div>
          </div>

          {/* Deep Lineage Narrative */}
          <div className="mt-8 pt-8 border-t border-[#F3ECE1] grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-3">
              <h3 className="font-serif text-lg font-medium text-[#20201D]">
                Heritage & Family Workshop Tradition
              </h3>
              <p className="text-xs sm:text-sm text-[#6B685F] leading-relaxed">
                {artisan.story}
              </p>
            </div>
            <div className="bg-[#F8F5EF] p-5 rounded-lg border border-[#DCD0BD] space-y-3 text-xs">
              <h4 className="font-serif text-sm font-semibold text-[#20201D]">
                Artisan Workshop Info
              </h4>
              <div className="flex justify-between py-1 border-b border-[#E8E0D2]">
                <span className="text-[#6B685F]">Experience:</span>
                <span className="font-medium text-[#20201D]">{artisan.yearsOfExperience} Years</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E0D2]">
                <span className="text-[#6B685F]">Community Cluster:</span>
                <span className="font-medium text-[#20201D]">{artisan.locality}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E0D2]">
                <span className="text-[#6B685F]">Craft Tradition:</span>
                <span className="font-medium text-[#20201D]">{artisan.craftTradition}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#6B685F]">Payment Channel:</span>
                <span className="font-medium text-[#52644B]">Direct Fair-Trade</span>
              </div>
            </div>
          </div>
        </div>

        {/* Master's Available Creations */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-semibold text-[#89714F] uppercase tracking-wider block mb-1">
                From This Workshop
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#20201D]">
                Handcrafted Pieces by {artisan.artisanName}
              </h2>
            </div>
            <span className="text-xs text-[#6B685F]">
              {artisanProducts.length} Authenticated Pieces
            </span>
          </div>

          {artisanProducts.length === 0 ? (
            <div className="bg-white border border-[#E8E0D2] rounded-lg p-10 text-center text-xs text-[#6B685F]">
              No current listings available. New pieces are being fired in the kiln.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {artisanProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
