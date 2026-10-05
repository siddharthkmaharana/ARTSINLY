import React from "react";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  Globe,
  Compass,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  HeartHandshake,
} from "lucide-react";

export default function AboutPage() {
  const craftTerroirs = [
    {
      region: "Gujarat • Kutch",
      craft: "Smoked Terracotta & Ajrakh",
      giTag: "GI-IN-GJ-449",
      description:
        "Riverbed clay reduction firing and 16-stage natural indigo mud-resist printing practiced in Dhamadka and Khavda.",
      imageUrl:
        "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
    },
    {
      region: "Rajasthan • Nathdwara & Jaipur",
      craft: "Pichwai Miniatures & Quartz Blue Pottery",
      giTag: "GI-IN-RJ-102",
      description:
        "Crushed lapis lazuli on hand-loomed khadi with 24K gold leafing, and clay-free quartz faience low-fired in wood kilns.",
      imageUrl:
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    },
    {
      region: "Andhra Pradesh • Srikalahasti",
      craft: "Freehand Pen Kalamkari",
      giTag: "GI-IN-AP-018",
      description:
        "Bamboo reed kalam drawing with fermented iron-jaggery liquor, washed in the sacred Swarnamukhi temple waters.",
      imageUrl:
        "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=800&q=80",
    },
    {
      region: "West Bengal • Bankura & Bikna",
      craft: "Dhokra Lost-Wax Bell Metal",
      giTag: "GI-IN-WB-052",
      description:
        "Non-ferrous bronze cast hollow over clay cores wrapped in pure beeswax threads, preserving 4,000-year Mohenjo-daro metallurgy.",
      imageUrl:
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#1E1E1C] py-5 sm:py-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb matching exact site standard */}
        <nav className="flex items-center space-x-2 text-[11px] text-[#8C877E] mb-8 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link href="/" className="hover:text-[#1E1E1C] transition-colors">
            Home
          </Link>
          <span>•</span>
          <span className="text-[#6B665E]">About Us</span>
          <span>•</span>
          <span className="text-[#6B665E] truncate">
            The ARTSINLY Heritage Charter & Savoir-Faire
          </span>
        </nav>

        {/* 1. Header Manifesto */}
        <div className="max-w-3xl mb-14 sm:mb-18 space-y-3">
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#C2410C] uppercase tracking-[0.25em] block">
            THE SAVOIR-FAIRE OF INDIAN MASTERS
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-normal leading-[1.12] text-[#1E1E1C] tracking-tight">
            Restoring Sovereignty, Dignity & Provenance to Indian Craft Lineages.
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6A62] leading-relaxed max-w-2xl font-light pt-1">
            ARTSINLY is an open, fair-trade digital pavilion connecting verified generational custodians
            directly with contemporary collectors and architectural spaces worldwide—eliminating
            exploitative intermediaries and preserving endangered ancestral knowledge.
          </p>
        </div>

        {/* 2. Hero Split: The Historical Reality & The Sovereign Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-20 sm:mb-28">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1E1E1C]">
              The Crisis of Dilution & The Call for Curatorial Sovereignty
            </h2>
            <div className="space-y-4 text-xs sm:text-[13px] text-[#6E6A62] leading-relaxed font-light">
              <p>
                For centuries, traditional Indian crafts flourished under royal patronage and temple
                commissions. In the modern industrial era, multi-layered merchant networks, machine
                replicas, and predatory middle tiers severed master artisans from the true economic
                value of their labour.
              </p>
              <p>
                When an artisan stops practicing, an irreplaceable library of natural botany, sacred
                metallurgy, mineral processing, and ancestral folklore goes extinct forever. Young
                apprentices are forced into metropolitan factory jobs, abandoning 900-year lineages.
              </p>
              <p>
                ARTSINLY does not view traditional craft as an antique curiosity, but as a sophisticated,
                sustainable technology for the contemporary architectural home. We provide master artisans
                with a sovereign digital storefront where they dictate their own pricing, receive direct
                settlement, and connect with global collectors.
              </p>
            </div>

            <blockquote className="border-l-2 border-[#C2410C] pl-4 py-1 italic text-xs sm:text-sm text-[#1E1E1C] bg-[#F4EFE6]/50 rounded-r">
              &ldquo;When a craft dies, a whole way of understanding nature and beauty disappears with it.&rdquo;
            </blockquote>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#DDD5C8] shadow-md bg-[#ECE6DC]">
              <img
                src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85"
                alt="Master Artisan shaping clay and minerals in traditional workshop"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1E1E1C]/85 to-transparent p-6 text-white">
                <span className="text-[10px] uppercase font-semibold text-[#C2410C] tracking-widest block mb-0.5">
                  ATELIER ARCHIVE
                </span>
                <p className="text-xs text-white/90 font-light">
                  Raw mineral glazes, hand-turned wheels, and slow wood firing in the desert ateliers of Rajasthan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. The Three Pillars of Integrity (Matching Trust Banner from Artisans page) */}
        <div className="mb-20 sm:mb-28">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-1">
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#C2410C] uppercase tracking-[0.2em] block">
              THE THREE PILLARS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1E1E1C] tracking-tight">
              Our Operating Charter
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
            <div className="bg-[#FAF7F2] border border-[#E5E0D7] rounded-xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <Award className="w-6 h-6 text-[#C2410C] mb-4 stroke-[1.8]" />
                <h3 className="font-serif text-base sm:text-lg font-medium text-[#1E1E1C] mb-2">
                  Direct Sovereign Compensation
                </h3>
                <p className="text-xs sm:text-[13px] text-[#6E6A62] leading-relaxed font-light">
                  Over 88% of every acquisition settles directly into the master artisan&apos;s bank account
                  within 48 hours. Zero speculative merchant markups, zero predatory commissions.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#EAE5DD] text-[11px] font-mono text-[#8C877E]">
                BENCHMARK: 88.4% AVERAGE DISBURSEMENT
              </div>
            </div>

            <div className="bg-[#FAF7F2] border border-[#E5E0D7] rounded-xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <ShieldCheck className="w-6 h-6 text-[#C2410C] mb-4 stroke-[1.8]" />
                <h3 className="font-serif text-base sm:text-lg font-medium text-[#1E1E1C] mb-2">
                  GI Certified Authenticity
                </h3>
                <p className="text-xs sm:text-[13px] text-[#6E6A62] leading-relaxed font-light">
                  Every listed work is registered with official Geographical Indication (GI) registries.
                  We verify native river silts, organic vegetable mordants, and generational lineage.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#EAE5DD] text-[11px] font-mono text-[#8C877E]">
                REGISTRY: GI-IN LEDGER COMPLIANT
              </div>
            </div>

            <div className="bg-[#FAF7F2] border border-[#E5E0D7] rounded-xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <Globe className="w-6 h-6 text-[#C2410C] mb-4 stroke-[1.8]" />
                <h3 className="font-serif text-base sm:text-lg font-medium text-[#1E1E1C] mb-2">
                  Archival & Climate-Neutral Transit
                </h3>
                <p className="text-xs sm:text-[13px] text-[#6E6A62] leading-relaxed font-light">
                  Climate-neutral, plastic-free packaging delivered to collectors across 34 countries.
                  Packed with sun-dried agricultural straw, molded cotton pulp, and custom timber crating.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#EAE5DD] text-[11px] font-mono text-[#8C877E]">
                STANDARD: 100% BIODEGRADABLE CRATING
              </div>
            </div>
          </div>
        </div>

        {/* 4. Craft Terroirs: Regional Corridors of Mastery */}
        <div className="mb-20 sm:mb-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#C2410C] uppercase tracking-[0.2em] block mb-1">
                TERROIRS OF INDIA
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1E1E1C] tracking-tight">
                Living Craft Corridors
              </h2>
            </div>
            <Link
              href="/catalog"
              className="text-xs font-semibold text-[#1E1E1C] hover:text-[#C2410C] transition-colors inline-flex items-center gap-1"
            >
              <span>Explore All Terroirs In Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {craftTerroirs.map((terroir, idx) => (
              <div
                key={idx}
                className="bg-[#FAF7F2] border border-[#E5E0D7] rounded-xl overflow-hidden hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full bg-[#ECE6DC] overflow-hidden">
                    <img
                      src={terroir.imageUrl}
                      alt={terroir.craft}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="bg-white/90 backdrop-blur-xs text-[#1E1E1C] text-[10px] font-mono font-medium px-2 py-0.5 rounded-full shadow-2xs border border-black/5">
                        {terroir.giTag}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <span className="text-[10px] text-[#8C877E] uppercase font-semibold tracking-wider block mb-1">
                      {terroir.region}
                    </span>
                    <h3 className="font-serif text-base font-medium text-[#1E1E1C] group-hover:text-[#C2410C] transition-colors mb-2">
                      {terroir.craft}
                    </h3>
                    <p className="text-xs text-[#6E6A62] leading-relaxed font-light">
                      {terroir.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-[#EFEBE4] mt-2">
                  <Link
                    href="/catalog"
                    className="text-xs font-semibold text-[#1E1E1C] hover:text-[#C2410C] inline-flex items-center gap-1 pt-3"
                  >
                    <span>View Atelier Artifacts</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. The Curatorial Standards Benchmark */}
        <div className="bg-[#F4EFE6]/70 border border-[#E3DDD1] rounded-2xl p-6 sm:p-10 mb-20 sm:mb-28">
          <div className="max-w-2xl mb-8">
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#C2410C] uppercase tracking-[0.2em] block mb-1">
              CURATORIAL RIGOR
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1E1E1C] tracking-tight">
              The 4 Benchmarks of Authentication
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-[#1E1E1C] text-white flex items-center justify-center text-xs font-serif shrink-0">
                1
              </div>
              <div>
                <h4 className="font-serif text-base font-medium text-[#1E1E1C] mb-1">
                  Indigenous Raw Material Purity
                </h4>
                <p className="text-xs text-[#6E6A62] leading-relaxed font-light">
                  Strictly natural river clays, unadulterated botanical indigo, madder roots, organic beeswax,
                  and certified mineral pigments. Zero synthetic chemical binders.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-[#1E1E1C] text-white flex items-center justify-center text-xs font-serif shrink-0">
                2
              </div>
              <div>
                <h4 className="font-serif text-base font-medium text-[#1E1E1C] mb-1">
                  Zero Synthetic Mechanization
                </h4>
                <p className="text-xs text-[#6E6A62] leading-relaxed font-light">
                  No automated injection molds, machine embroidery, or industrial screen prints. Every piece
                  embodies the distinct hand, breath, and kiln temperature of its master artisan.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-[#1E1E1C] text-white flex items-center justify-center text-xs font-serif shrink-0">
                3
              </div>
              <div>
                <h4 className="font-serif text-base font-medium text-[#1E1E1C] mb-1">
                  Master Signature & Provenance Tag
                </h4>
                <p className="text-xs text-[#6E6A62] leading-relaxed font-light">
                  Each artifact bears the master artisan&apos;s physical signature or seal, registered in our
                  GI digital ledger with exact date of kiln reduction or weaving completion.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-[#1E1E1C] text-white flex items-center justify-center text-xs font-serif shrink-0">
                4
              </div>
              <div>
                <h4 className="font-serif text-base font-medium text-[#1E1E1C] mb-1">
                  Generational Apprentice Support
                </h4>
                <p className="text-xs text-[#6E6A62] leading-relaxed font-light">
                  Purchases fund local guild training programs, ensuring ancestral methods are actively taught
                  to next-generation apprentice circles rather than lost to industrial migration.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Closing Call to Action: The Ebony Pavilion Banner */}
        <div className="bg-[#1A1A18] text-[#FAF7F2] rounded-2xl p-8 sm:p-14 text-center space-y-6 mb-16 shadow-xl">
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#C2410C] tracking-[0.25em] uppercase">
            AN INVITATION TO PATRONS & GUILDS
          </span>

          <h2 className="font-serif text-2xl sm:text-4xl font-normal text-white max-w-2xl mx-auto leading-snug">
            Are You a Traditional Artisan, Interior Architect, or Private Collector?
          </h2>

          <p className="text-xs sm:text-sm text-[#A8A49A] max-w-xl mx-auto leading-relaxed font-light">
            ARTSINLY curates bespoke architectural commissions, museum acquisitions, and verified direct
            artisan onboarding with zero registration fees.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/seller/dashboard"
              className="px-7 py-3 rounded-md bg-[#C2410C] hover:bg-[#A33408] text-white text-xs font-medium uppercase tracking-widest transition-colors shadow-xs"
            >
              Open Artisan Studio
            </Link>

            <Link
              href="/explore"
              className="px-7 py-3 rounded-md border border-[#55524B] hover:border-white text-white text-xs font-medium uppercase tracking-widest transition-colors"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
