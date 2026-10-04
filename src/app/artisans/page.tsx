import React from "react";
import Link from "next/link";
import { Award, ShieldCheck, Globe } from "lucide-react";

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
    id: "artisan-1",
    slug: "devendra-prajapati",
    craftTitle: "Pottery",
    artisanWithLocation: "Devendra Prajapati • Kutch",
    giCode: "GI-IN-GJ-449",
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "artisan-2",
    slug: "meenakshi-rathore",
    craftTitle: "Meenakari Jewellery",
    artisanWithLocation: "Meenakshi Rathore • Jaipur",
    giCode: "GI-IN-RJ-102",
    imageUrl:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "artisan-3",
    slug: "rameshwar-chitrakar",
    craftTitle: "Kalamkari Painting",
    artisanWithLocation: "Rameshwar Chitrakar • Srikalahasti",
    giCode: "GI-IN-AP-018",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "artisan-4",
    slug: "bhuri-bai",
    craftTitle: "Gond Art",
    artisanWithLocation: "Bhuri Bai • Dindori",
    giCode: "GI-IN-MP-204",
    imageUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "artisan-5",
    slug: "shankar-lal-jangid",
    craftTitle: "Wood Carving",
    artisanWithLocation: "Shankar Lal Jangid • Churu",
    giCode: "GI-IN-RJ-312",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "artisan-6",
    slug: "zarina-begum",
    craftTitle: "Zardozi Embroidery",
    artisanWithLocation: "Zarina Begum • Varanasi",
    giCode: "GI-IN-UP-177",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "artisan-7",
    slug: "kalyan-joshi",
    craftTitle: "Phad Painting",
    artisanWithLocation: "Kalyan Joshi • Bhilwara",
    giCode: "GI-IN-RJ-119",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "artisan-8",
    slug: "ismail-khatri",
    craftTitle: "Block Printing",
    artisanWithLocation: "Ismail Mohammad Khatri • Ajrakhpur",
    giCode: "GI-IN-GJ-063",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
  },
];

export default function ArtisansPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen py-5 sm:py-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb matching exact screenshot */}
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
            PRESERVERS OF HERITAGE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#1E1E1C] tracking-tight">
            Our Artisans
          </h1>
          <p className="text-xs sm:text-[13px] text-[#6E6A62] leading-relaxed max-w-lg mx-auto">
            Meet the generational custodians who transform native earth, forest wood, organic indigo, and fire into living Indian art.
          </p>
        </div>

        {/* 4-Column × 2-Row Artisans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 mb-14">
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
                  alt={artisan.artisanWithLocation}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                  loading="lazy"
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
              <ShieldCheck className="w-5 h-5 mx-auto text-[#0D9488] mb-2.5 stroke-[1.75]" />
              <h4 className="font-serif text-sm sm:text-base font-semibold text-[#1E1E1C] mb-1">
                GI Authenticated
              </h4>
              <p className="text-xs text-[#6E6A62] leading-relaxed max-w-xs mx-auto">
                Official Geographical Indication registries validated by curatorial experts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="px-4 pt-4 md:pt-0">
              <Globe className="w-5 h-5 mx-auto text-[#C2410C] mb-2.5 stroke-[1.75]" />
              <h4 className="font-serif text-sm sm:text-base font-semibold text-[#1E1E1C] mb-1">
                Global Living Spaces
              </h4>
              <p className="text-xs text-[#6E6A62] leading-relaxed max-w-xs mx-auto">
                Climate-neutral plastic-free packaging delivered to collectors in 34 countries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
