import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Award, ShieldCheck, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Meet Master Guild Artisans & Shilp Guru Awardees",
  description:
    "Discover generational master makers, Shilp Guru awardees, and state master artisans preserving indigenous pottery, handloom weaving, miniature painting, and metalcraft.",
  alternates: {
    canonical: "/artisans",
  },
  openGraph: {
    title: "Meet Master Guild Artisans | ARTSINLY",
    description:
      "Generational master makers preserving indigenous pottery, handloom weaving, miniature painting, and metalcraft across India.",
    url: "/artisans",
  },
};

interface ArtisanShowcaseItem {
  id: string;
  slug: string;
  craftTitle: string;
  artisanWithLocation: string;
  giCode: string;
  imageUrl: string;
}

const ARTISANS_SHOWCASE: ArtisanShowcaseItem[] = [
  {
    id: "artisan-chitrakara",
    slug: "raghurajpur-chitrakara-guild",
    craftTitle: "Pattachitra Painting",
    artisanWithLocation: "Master Chitrakara Artisans • Raghurajpur",
    giCode: "GI-IN-OD-88",
    imageUrl: "/images/Artisans/Pattachitra Painter.png",
  },
  {
    id: "artisan-pottery-odisha",
    slug: "sambalpur-kumbhakar-pottery",
    craftTitle: "Terracotta Pottery",
    artisanWithLocation: "Master Kumbhar Artisans • Sambalpur",
    giCode: "GI-IN-OD-POT",
    imageUrl: "/images/Artisans/Pottery Artist.png",
  },
  {
    id: "artisan-papiermache-wood",
    slug: "bargarh-woodcraft-guild",
    craftTitle: "Papier-Mâché & Wood Carving",
    artisanWithLocation: "Master Folk Artisans • Bargarh",
    giCode: "GI-IN-OD-PMC",
    imageUrl: "/images/Artisans/Papier-Mäché and Wood Carving Artist.png",
  },
  {
    id: "artisan-dhokra-brass",
    slug: "saptasajya-dhokra-collective",
    craftTitle: "Dhokra Lost-Wax Brasswork",
    artisanWithLocation: "Master Dhokra Artisans • Dhenkanal",
    giCode: "GI-IN-OD-1322",
    imageUrl: "/images/Artisans/Brasswork in the Artisan Workshop.png",
  },
  {
    id: "artisan-pipili-applique",
    slug: "pipili-applique-cooperative",
    craftTitle: "Pipili Appliqué & Patchwork",
    artisanWithLocation: "Master Pipili Artisans • Pipili, Puri",
    giCode: "GI-IN-OD-86",
    imageUrl: "/images/Artisans/Artisan Stitching Colorful Appliqué.png",
  },
  {
    id: "artisan-miniature-pichwai",
    slug: "nathdwara-pichwai-atelier",
    craftTitle: "Miniature Painting & Pichwai",
    artisanWithLocation: "Master Miniature Artisans • Nathdwara",
    giCode: "GI-IN-RJ-PCH",
    imageUrl: "/images/Artisans/Indian Miniature Artist at Work.png",
  },
];

export default function ArtisansPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen py-5 sm:py-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb line */}
        <Breadcrumbs
          items={[
            { name: "Artisans & Guilds", url: "/artisans" },
          ]}
          className="mb-6"
        />

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#C2410C] uppercase tracking-[0.2em] block">
            PRESERVERS OF HERITAGE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#1E1E1C] tracking-tight">
            Our Artisans
          </h1>
          <p className="text-xs sm:text-[13px] text-[#6E6A62] leading-relaxed max-w-lg mx-auto">
            Meet the generational custodians who transform native earth, forest wood, organic indigo, and fire into living Indian art.
          </p>
        </div>

        {/* 6-Card Artisans Grid (3x2 Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mb-14">
          {ARTISANS_SHOWCASE.map((artisan) => (
            <Link
              key={artisan.id}
              href={`/artisans/${artisan.slug}`}
              className="group flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Photo Box */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#ECE6DC] shadow-xs border border-[#DDD5C8]">
                <img
                  src={artisan.imageUrl}
                  alt={artisan.artisanWithLocation || "Featured master artisan"}
                  width={400}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Text Info */}
              <h3 className="font-serif text-base font-semibold text-[#1E1E1C] mt-3.5 mb-1 group-hover:text-[#C2410C] transition-colors">
                {artisan.craftTitle}
              </h3>
              <p className="text-xs text-[#7A756D] mb-2 font-normal">
                {artisan.artisanWithLocation}
              </p>

              {/* GI Code Pill */}
              <span className="inline-block bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full shadow-2xs">
                {artisan.giCode}
              </span>
            </Link>
          ))}
        </div>

        {/* Bottom Feature Banner (Trust & Impact Panel) */}
        <div className="bg-[#FAF7F2] border border-[#E5E0D7] rounded-2xl p-6 sm:p-8 mb-16 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#E5E0D7]">
            {/* Feature 1 */}
            <div className="px-4 pt-4 md:pt-0">
              <Award className="w-5 h-5 mx-auto text-[#C2410C] mb-2.5 stroke-[1.75]" />
              <h4 className="font-serif text-sm sm:text-base font-semibold text-[#1E1E1C] mb-1">
                Direct Compensation
              </h4>
              <p className="text-xs text-[#6E6A62] leading-relaxed max-w-xs mx-auto">
                Over 88% of every sale goes directly to the master artisan bank account.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="px-4 pt-4 md:pt-0">
              <ShieldCheck className="w-5 h-5 mx-auto text-[#C2410C] mb-2.5 stroke-[1.75]" />
              <h4 className="font-serif text-sm sm:text-base font-semibold text-[#1E1E1C] mb-1">
                GI Certified Origin
              </h4>
              <p className="text-xs text-[#6E6A62] leading-relaxed max-w-xs mx-auto">
                Every craft carries authentic Geographical Indication verification codes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="px-4 pt-4 md:pt-0">
              <Globe className="w-5 h-5 mx-auto text-[#C2410C] mb-2.5 stroke-[1.75]" />
              <h4 className="font-serif text-sm sm:text-base font-semibold text-[#1E1E1C] mb-1">
                Living Traditions
              </h4>
              <p className="text-xs text-[#6E6A62] leading-relaxed max-w-xs mx-auto">
                Supporting generational lineages fighting against mass-factory replication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
