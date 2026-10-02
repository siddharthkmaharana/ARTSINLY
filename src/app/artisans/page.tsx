import React from "react";
import { ARTISANS } from "@/lib/mock-data";
import { ArtisanCard } from "@/components/artisans/ArtisanCard";
import { Sparkles, MapPin, Award } from "lucide-react";

export default function ArtisansDirectoryPage() {
  return (
    <div className="bg-[#F8F5EF] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Directory Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#DCD0BD] text-xs font-semibold text-[#89714F] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Living National Treasures</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#20201D] tracking-tight">
            The Master Artisan Directory
          </h1>

          <p className="text-sm sm:text-base text-[#6B685F] leading-relaxed">
            Discover the individual masters, women collectives, and family guilds carrying centuries of sacred craft tradition. When you acquire their work, you directly support their living independence.
          </p>
        </div>

        {/* Artisans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ARTISANS.map((artisan) => (
            <ArtisanCard key={artisan.id} artisan={artisan} />
          ))}
        </div>
      </div>
    </div>
  );
}
