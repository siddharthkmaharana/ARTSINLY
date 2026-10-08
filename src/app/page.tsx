import React from "react";
import Link from "next/link";
import { PRODUCTS, ARTISANS, CATEGORIES } from "@/lib/mock-data";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Sparkles,
  ShieldCheck,
  Globe,
  Compass,
} from "lucide-react";

export default function HomePage() {
  // Top 3 bestsellers matching the ranked Best Sellers design
  const topBestSellers = [
    {
      id: "top-1",
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
      id: "top-2",
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
      id: "top-3",
      rankBadge: "Top #3",
      slug: "sacred-srinathji-gold-leaf-pichwai-miniature",
      originAndCraft: "RAJASTHAN • MINIATURE PAINTING",
      title: "Sacred Srinathji Gold-Leaf Pichwai Miniature Painting",
      ratingText: "5 / 5.0 (14 verified collectors)",
      priceDisplay: "₹1,500.00",
      imageUrl:
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=85",
    },
  ];


  // Top 3 New Arrivals matching the Fresh Drops collection
  const freshDrops = [
    {
      id: "drop-1",
      badgeText: "JUST UNFIRED",
      slug: "dhokra-primitive-tribal-bell-metal-vessel",
      originAndCraft: "WEST BENGAL • BELL-METAL CASTING",
      title: "Dhokra Primitive Tribal Bell-Metal Lost-Wax Vessel",
      editionNote: "Single Batch • 1 of 4 Casts",
      priceDisplay: "₹190.00",
      imageUrl:
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85",
    },
    {
      id: "drop-2",
      badgeText: "FRESH FROM LOOM",
      slug: "heritage-ajrakh-16-stage-indigo-botanical-throw",
      originAndCraft: "GUJARAT • NATURAL DYE BLOCK PRINT",
      title: "Heritage Ajrakh 16-Stage Indigo Botanical Throw",
      editionNote: "Natural Indigo • River Washed",
      priceDisplay: "₹184.00",
      imageUrl:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85",
    },
    {
      id: "drop-3",
      badgeText: "LIMITED EDITION",
      slug: "zardozi-hand-embroidered-velvet-adornment",
      originAndCraft: "UTTAR PRADESH • ZARDOZI NEEDLEWORK",
      title: "Zardozi Hand-Embroidered Velvet Wall Tapestry",
      editionNote: "140 Artisan-Hours • Semi-Precious Agate",
      priceDisplay: "₹540.00",
      imageUrl:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85",
    },
  ];

  // 4 Featured Artisans matching the Our Artisans page
  const featuredArtisans = [
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
  ];


  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#1E1E1C]">
      {/* 1. Hero Section: High Luxury Editorial Presentation */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-[#EAE5DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-7">
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold text-[#C2410C] tracking-[0.25em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" />
                <span>EDITION 2026 • THE HERITAGE PAVILION</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[58px] font-normal leading-[1.12] tracking-tight text-[#1E1E1C]">
                Where Generational Mastery Meets{" "}
                <span className="italic font-serif">Contemporary Living Spaces.</span>
              </h1>

              <p className="text-xs sm:text-sm text-[#6E6A62] leading-relaxed max-w-xl font-light">
                ARTSINLY connects discerning collectors and architectural patrons directly
                with certified master artisans across India&apos;s ancestral craft terroirs.
                Preserving 900 years of living cultural heritage through sovereign direct
                compensation and authenticated Geographical Indication (GI).
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/explore"
                  className="px-7 py-3 rounded-md bg-[#1E1E1C] hover:bg-[#383734] text-white text-xs font-medium tracking-wider uppercase transition-all shadow-xs"
                >
                  Explore Collection
                </Link>

                <Link
                  href="/artisans"
                  className="px-7 py-3 rounded-md border border-[#DDD5C8] hover:border-[#1E1E1C] bg-white/60 text-[#1E1E1C] text-xs font-medium tracking-wider uppercase transition-all"
                >
                  Meet Our Artisans
                </Link>

                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1E1E1C] hover:text-[#C2410C] transition-colors ml-2 py-2"
                >
                  <span>Discover Full Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 3 Heritage Pillars Metric Bar */}
              <div className="pt-6 border-t border-[#EAE5DD] grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-normal text-[#1E1E1C]">
                    88%+
                  </div>
                  <div className="text-[11px] text-[#7A756D] mt-0.5">
                    Direct Master Payout
                  </div>
                </div>
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-normal text-[#1E1E1C]">
                    GI Tagged
                  </div>
                  <div className="text-[11px] text-[#7A756D] mt-0.5">
                    Authentic Provenance
                  </div>
                </div>
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-normal text-[#1E1E1C]">
                    34+
                  </div>
                  <div className="text-[11px] text-[#7A756D] mt-0.5">
                    Collector Living Spaces
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Museum Architectural Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-[#DDD5C8] shadow-md bg-[#ECE6DC] group">
                <img
                  src="https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85"
                  alt="Modern Ethnic Ceramic Vase – Terracotta Vase with Indigenous Pattern"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                />

                {/* Subtle Luxury Plaque Caption Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1E1E1C]/85 via-[#1E1E1C]/40 to-transparent p-6 text-white flex flex-col justify-end">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C2410C]">
                    FEATURED MASTERPIECE • KUTCH GUILD
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-normal text-white mt-1 mb-1">
                    Modern Ethnic Ceramic Vase
                  </h3>
                  <p className="text-xs text-white/80 font-light">
                    Hand-thrown reduction-fired terracotta with tribal slip motifs by Devendra Prajapati.
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-white/20">
                    <span className="text-white/90 font-medium">GI-IN-GJ-449</span>
                    <Link
                      href="/products/modern-ethnic-ceramic-vase-terracotta-indigenous-pattern"
                      className="hover:underline text-white font-medium inline-flex items-center gap-1"
                    >
                      <span>Acquire Piece</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Curated Disciplines: The Ateliers */}
      <section className="py-16 sm:py-20 border-b border-[#EAE5DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#C2410C] uppercase tracking-[0.2em] block mb-1">
                CURATED DISCIPLINES
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1E1E1C] tracking-tight">
                The Living Ateliers of India
              </h2>
            </div>
            <Link
              href="/catalog"
              className="text-xs font-semibold text-[#1E1E1C] hover:text-[#C2410C] transition-colors inline-flex items-center gap-1 shrink-0"
            >
              <span>Explore All 5 Craft Disciplines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/catalog?category=${category.slug}`}
                className="group bg-[#F4EFE6]/50 border border-[#E3DDD1] rounded-xl overflow-hidden hover:border-[#C2410C]/40 hover:shadow-md transition-all flex flex-col"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#ECE6DC]">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                </div>
                <div className="p-3.5 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-serif text-sm font-medium text-[#1E1E1C] group-hover:text-[#C2410C] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-[11px] text-[#7A756D] line-clamp-2 mt-1 font-light leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  <span className="text-[10px] text-[#8C877E] uppercase tracking-wider block mt-3 font-semibold">
                    {category.itemCount} Curated Pieces ↗
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Fresh From The Atelier: Recent Studio Releases */}
      <section className="py-16 sm:py-20 border-b border-[#EAE5DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#C2410C] uppercase tracking-[0.2em] block mb-1">
                FRESH FROM THE ATELIER
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1E1E1C] tracking-tight">
                Recent Studio Releases
              </h2>
              <p className="text-xs text-[#6E6A62] mt-1 max-w-lg leading-relaxed">
                Limited single-batch creations just completed by master rural guilds, ready for immediate acquisition.
              </p>
            </div>
            <Link
              href="/new-arrivals"
              className="text-xs font-semibold text-[#1E1E1C] hover:text-[#C2410C] transition-colors inline-flex items-center gap-1 shrink-0"
            >
              <span>Explore All Fresh Drops</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {freshDrops.map((item) => (
              <div
                key={item.id}
                className="bg-[#FAF7F2] border border-[#E5E0D7] rounded-xl p-3.5 sm:p-4 hover:shadow-md hover:border-[#D5CFC5] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#ECE6DC] mb-3.5">
                    <Link href={`/products/${item.slug}`}>
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    </Link>
                    <div className="absolute top-2.5 right-2.5 bg-[#C2410C] text-white text-[9.5px] font-semibold px-2.5 py-0.5 rounded-full z-10 tracking-wider shadow-xs pointer-events-none uppercase">
                      {item.badgeText}
                    </div>
                  </div>

                  <span className="text-[10px] sm:text-[11px] font-semibold text-[#8C877E] uppercase tracking-wider block mb-1.5">
                    {item.originAndCraft}
                  </span>

                  <Link href={`/products/${item.slug}`}>
                    <h3 className="font-serif text-[15px] sm:text-base font-normal text-[#1E1E1C] leading-snug line-clamp-2 h-11 mb-2 group-hover:text-[#C2410C] transition-colors">
                      {item.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1.5 text-xs text-[#7A756D] mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-[#C2410C] shrink-0" />
                    <span>{item.editionNote}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#EFEBE4]">
                  <span className="text-base sm:text-lg font-medium text-[#1E1E1C]">
                    {item.priceDisplay}
                  </span>

                  <Link
                    href={`/products/${item.slug}`}
                    className="border border-[#1E1E1C] bg-white text-[#1E1E1C] hover:bg-[#1E1E1C] hover:text-white px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all shadow-xs"
                  >
                    Acquire
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Recognized Excellence: Top Bestsellers Showcase */}
      <section className="py-16 sm:py-20 border-b border-[#EAE5DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#C2410C] uppercase tracking-[0.2em] block mb-1">
                RECOGNIZED EXCELLENCE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1E1E1C] tracking-tight">
                Our Most Beloved Masterpieces
              </h2>
              <p className="text-xs text-[#6E6A62] mt-1 max-w-lg leading-relaxed">
                Pieces that have garnered national awards and grace international architectural collections.
              </p>
            </div>
            <Link
              href="/best-sellers"
              className="text-xs font-semibold text-[#1E1E1C] hover:text-[#C2410C] transition-colors inline-flex items-center gap-1 shrink-0"
            >
              <span>View All 6 Ranked Crafts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {topBestSellers.map((item) => (
              <div
                key={item.id}
                className="bg-[#FAF7F2] border border-[#E5E0D7] rounded-xl p-3.5 sm:p-4 hover:shadow-md hover:border-[#D5CFC5] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#ECE6DC] mb-3.5">
                    <Link href={`/products/${item.slug}`}>
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    </Link>
                    <div className="absolute top-2.5 right-2.5 bg-[#1E1E1C] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full z-10 tracking-wider shadow-xs pointer-events-none">
                      {item.rankBadge}
                    </div>
                  </div>

                  <span className="text-[10px] sm:text-[11px] font-semibold text-[#8C877E] uppercase tracking-wider block mb-1.5">
                    {item.originAndCraft}
                  </span>

                  <Link href={`/products/${item.slug}`}>
                    <h3 className="font-serif text-[15px] sm:text-base font-normal text-[#1E1E1C] leading-snug line-clamp-2 h-11 mb-2 group-hover:text-[#C2410C] transition-colors">
                      {item.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1.5 text-xs text-[#7A756D] mb-4">
                    <Award className="w-3.5 h-3.5 text-[#C2410C] shrink-0" />
                    <span>{item.ratingText}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#EFEBE4]">
                  <span className="text-base sm:text-lg font-medium text-[#1E1E1C]">
                    {item.priceDisplay}
                  </span>

                  <Link
                    href={`/products/${item.slug}`}
                    className="bg-[#1E1E1C] text-white hover:bg-[#383734] px-4 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all shadow-xs"
                  >
                    Acquire
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. The Master Custodians: Living Heritage Artisans */}
      <section className="py-16 sm:py-20 border-b border-[#EAE5DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#C2410C] uppercase tracking-[0.2em] block">
              PRESERVERS OF HERITAGE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1E1E1C] tracking-tight">
              Our Artisans
            </h2>
            <p className="text-xs sm:text-[13px] text-[#6E6A62] leading-relaxed max-w-lg mx-auto font-light">
              Meet the generational custodians who transform native earth, forest wood, organic indigo, and fire into living Indian art.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 mb-10">
            {featuredArtisans.map((artisan) => (
              <Link
                key={artisan.id}
                href={`/artisans/${artisan.slug}`}
                className="group flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#ECE6DC] shadow-xs border border-[#DDD5C8]">
                  <img
                    src={artisan.imageUrl}
                    alt={artisan.artisanWithLocation}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                </div>

                <h3 className="font-serif text-base font-semibold text-[#1E1E1C] mt-3.5 mb-1 group-hover:text-[#C2410C] transition-colors">
                  {artisan.craftTitle}
                </h3>
                <p className="text-xs text-[#7A756D] mb-2 font-normal">
                  {artisan.artisanWithLocation}
                </p>

                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-emerald-300/80 bg-emerald-50 text-emerald-800 text-[10px] font-mono font-medium">
                  {artisan.giCode}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/artisans"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md border border-[#DDD5C8] hover:border-[#1E1E1C] bg-white text-xs font-semibold text-[#1E1E1C] transition-colors"
            >
              <span>Explore All 8 Master Artisans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>


      {/* 6. The Maison Manifesto: High Luxury Dark Editorial Pavilion */}
      <section className="py-20 sm:py-28 bg-[#1A1A18] text-[#FAF7F2] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#C2410C] tracking-[0.25em] uppercase">
            THE SAVOIR-FAIRE OF INDIAN MASTERS
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-[1.2] text-[#FAF7F2] tracking-tight">
            &ldquo;When a generational craft dies, a whole way of understanding nature, earth, and beauty disappears with it.&rdquo;
          </h2>

          <p className="text-xs sm:text-sm text-[#A8A49A] max-w-2xl mx-auto leading-relaxed font-light">
            Mass synthetic fabrication dilutes sacred techniques. ARTSINLY exists to provide master artisans
            with a dignified digital pavilion, returning sovereign price setting and speaking directly to those
            who cherish generational heirlooms.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/about"
              className="px-7 py-3.5 rounded-md bg-[#C2410C] hover:bg-[#A33408] text-white text-xs font-medium uppercase tracking-widest transition-colors shadow-xs"
            >
              Read Our Heritage Charter
            </Link>

            <Link
              href="/seller/dashboard"
              className="px-7 py-3.5 rounded-md border border-[#55524B] hover:border-white text-white text-xs font-medium uppercase tracking-widest transition-colors"
            >
              Artisan Guild Studio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
