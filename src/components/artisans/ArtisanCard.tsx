import React from "react";
import Link from "next/link";
import { Artisan } from "@/types";
import { MapPin, Award, ArrowUpRight } from "lucide-react";

interface ArtisanCardProps {
  artisan: Artisan;
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  return (
    <div className="craft-card rounded-md p-6 flex flex-col justify-between group hover:border-[#89714F] transition-all bg-white">
      <div>
        <div className="flex items-start gap-4 mb-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-[#DCD0BD]">
            <img
              src={artisan.avatarUrl}
              alt={artisan.artisanName}
              className="w-full h-full object-cover"
            />
            {artisan.isVerified && (
              <span
                className="absolute bottom-0 right-0 bg-[#52644B] text-white p-0.5 rounded-full"
                title="Verified Master Artisan"
              >
                <Award className="w-3 h-3" />
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#89714F] font-medium">
              <MapPin className="w-3 h-3" />
              <span>{artisan.locality}</span>
            </div>
            <h3 className="font-serif text-lg font-medium text-[#20201D] group-hover:text-[#89714F] transition-colors">
              <Link href={`/artisans/${artisan.slug}`}>{artisan.artisanName}</Link>
            </h3>
            <p className="text-xs text-[#6B685F]">{artisan.shopName}</p>
          </div>
        </div>

        <p className="text-xs text-[#89714F] font-semibold tracking-wide uppercase mb-2">
          {artisan.craftTradition} • {artisan.yearsOfExperience} Years of Lineage
        </p>

        <p className="text-xs text-[#6B685F] leading-relaxed line-clamp-3 mb-4">
          {artisan.bio}
        </p>

        {artisan.featuredQuote && (
          <blockquote className="border-l-2 border-[#DCD0BD] pl-3 py-1 my-3 text-xs italic text-[#20201D]/80 bg-[#F8F5EF] rounded-r">
            &ldquo;{artisan.featuredQuote}&rdquo;
          </blockquote>
        )}
      </div>

      <div className="pt-4 border-t border-[#F3ECE1] flex items-center justify-between">
        <span className="text-xs text-[#6B685F]">
          {artisan.productCount || 6} Handcrafted creations
        </span>
        <Link
          href={`/artisans/${artisan.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#89714F] group-hover:translate-x-0.5 transition-transform"
        >
          <span>View Studio</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
