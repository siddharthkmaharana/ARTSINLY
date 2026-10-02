import React from "react";
import Link from "next/link";
import { PRODUCTS, ARTISANS, CATEGORIES, REGIONS } from "@/lib/mock-data";
import { ProductCard } from "@/components/products/ProductCard";
import { ArtisanCard } from "@/components/artisans/ArtisanCard";
import {
  ArrowRight,
  Sparkles,
  MapPin,
  ShieldCheck,
  HeartHandshake,
  Compass,
  ArrowUpRight,
} from "lucide-react";

export default function HomePage() {
  const featuredProducts = PRODUCTS.slice(0, 4);
  const featuredArtisans = ARTISANS.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section - Editorial Heritage Showcase */}
      <section className="relative overflow-hidden bg-[#F8F5EF] pt-12 pb-20 sm:pt-16 sm:pb-28 border-b border-[#E8E0D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Editorial Manifesto */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#DCD0BD] text-xs font-semibold text-[#89714F] tracking-wide uppercase shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Living Craft Heritage of India</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#20201D] leading-[1.12] tracking-tight font-normal">
                Direct from the hands of the masters who breathe life into <span className="italic font-serif text-[#89714F]">earth & thread.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#6B685F] leading-relaxed max-w-2xl font-light">
                ARTSINLY is a curated marketplace honouring regional Indian artisans. From Persian-inspired Jaipur blue pottery to 400-year-old Kutch Rogan art, acquire certified authentic crafts with complete transparency and fair-trade dignity.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/products"
                  className="px-6 py-3.5 rounded bg-[#20201D] hover:bg-[#89714F] text-[#FFFFFF] text-sm font-medium transition-all shadow-sm flex items-center gap-2 group"
                >
                  <span>Explore Catalogue</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/artisans"
                  className="px-6 py-3.5 rounded bg-[#FFFFFF] hover:bg-[#F3ECE1] border border-[#DCD0BD] text-[#20201D] text-sm font-medium transition-all flex items-center gap-2"
                >
                  <span>Meet Master Artisans</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[#E8E0D2] grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <div className="font-serif text-2xl font-medium text-[#20201D]">100%</div>
                  <div className="text-xs text-[#6B685F]">Direct Artisan Payout</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-medium text-[#20201D]">GI-Tagged</div>
                  <div className="text-xs text-[#6B685F]">Heritage Provenance</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-medium text-[#20201D]">Plastic-Free</div>
                  <div className="text-xs text-[#6B685F]">Insured Safe Transit</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Large Visual Card */}
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-[#DCD0BD] shadow-xl bg-[#F3ECE1]">
                  <img
                    src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85"
                    alt="Master Potter painting traditional pottery"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#20201D]/75 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-xs text-[#DCD0BD] uppercase tracking-wider font-semibold">
                      Featured Tradition
                    </span>
                    <h3 className="font-serif text-2xl font-medium mb-1">
                      Jaipur Blue Pottery
                    </h3>
                    <p className="text-xs text-white/90 line-clamp-2">
                      Crafted without clay using quartz powder and Egyptian paste, fired in traditional wood kilns by Maheshwar Kumbhar.
                    </p>
                  </div>
                </div>

                {/* Overlaid Micro Card */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-md border border-[#DCD0BD] shadow-lg max-w-xs hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#DCD0BD]">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                        alt="Maheshwar Kumbhar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#20201D]">
                        Maheshwar Kumbhar
                      </h4>
                      <p className="text-[11px] text-[#89714F]">
                        Master Potter • 32 Years
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#6B685F] mt-2 italic">
                    &ldquo;Every vessel holds the memory of generations.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Craft Categories Bar */}
      <section className="py-16 bg-[#FFFFFF] border-b border-[#E8E0D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-semibold text-[#89714F] uppercase tracking-widest block mb-1">
                Curated Disciplines
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#20201D]">
                Explore by Craft Tradition
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-semibold text-[#89714F] hover:text-[#20201D] flex items-center gap-1 mt-3 md:mt-0"
            >
              <span>View All Categories</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative rounded-md overflow-hidden border border-[#E8E0D2] bg-[#F8F5EF] flex flex-col hover:border-[#89714F] transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#F3ECE1]">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3.5 flex flex-col flex-grow justify-between">
                  <h3 className="font-serif text-sm font-medium text-[#20201D] group-hover:text-[#89714F] transition-colors leading-tight mb-1">
                    {category.name}
                  </h3>
                  <span className="text-[11px] text-[#6B685F]">
                    {category.itemCount} Authentic Pieces
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Masterpieces */}
      <section className="py-16 sm:py-24 bg-[#F8F5EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold text-[#89714F] uppercase tracking-widest block mb-1">
                Master's Selection
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#20201D]">
                Curated Craft Masterpieces
              </h2>
              <p className="text-sm text-[#6B685F] mt-2 max-w-xl">
                Individually signed, numbered, and handcrafted artifacts ready for immediate insured shipping.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#DCD0BD] rounded bg-white text-xs font-semibold text-[#20201D] hover:bg-[#F3ECE1] transition-colors mt-4 md:mt-0"
            >
              <span>Browse Full Catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Regional Roots Showcase */}
      <section className="py-16 sm:py-20 bg-[#FFFFFF] border-y border-[#E8E0D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#89714F] uppercase tracking-widest block mb-2">
              Geography of Art
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#20201D]">
              Explore by Geographic Origin
            </h2>
            <p className="text-sm text-[#6B685F] mt-3">
              India's crafts are deeply intertwined with local soils, minerals, climate, and ancestral communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REGIONS.slice(0, 6).map((region) => (
              <Link
                key={region.id}
                href={`/products?region=${region.slug}`}
                className="group relative rounded-md overflow-hidden border border-[#E8E0D2] bg-[#F8F5EF] hover:border-[#89714F] transition-all flex flex-col"
              >
                <div className="aspect-[16/9] overflow-hidden relative">
                  <img
                    src={region.imageUrl}
                    alt={region.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#20201D]/70 via-transparent to-transparent flex items-end p-4">
                    <div>
                      <div className="flex items-center gap-1 text-white/90 text-xs font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#DCD0BD]" />
                        <span>{region.state}</span>
                      </div>
                      <h3 className="font-serif text-xl font-medium text-white">
                        {region.name}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow justify-between">
                  <p className="text-xs text-[#6B685F] leading-relaxed mb-3 line-clamp-2">
                    {region.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {region.craftTraditions.map((tradition, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-[#F4EFE6] text-[#89714F] px-2 py-0.5 rounded font-medium border border-[#DCD0BD]"
                      >
                        {tradition}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Master Artisan Spotlight */}
      <section className="py-16 sm:py-24 bg-[#F8F5EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold text-[#89714F] uppercase tracking-widest block mb-1">
                Living Treasures
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#20201D]">
                Meet the Master Custodians
              </h2>
              <p className="text-sm text-[#6B685F] mt-2 max-w-xl">
                Every purchase sustains an artisan's workshop, apprentice school, and community heritage.
              </p>
            </div>
            <Link
              href="/artisans"
              className="text-xs font-semibold text-[#89714F] hover:text-[#20201D] flex items-center gap-1 mt-3 md:mt-0"
            >
              <span>Explore All Artisans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArtisans.map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. The ARTSINLY Manifesto & Promise */}
      <section className="py-20 bg-[#20201D] text-[#F8F5EF] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <span className="text-xs font-semibold text-[#DCD0BD] tracking-[0.25em] uppercase">
            Our Cultural Commitment
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl font-medium leading-tight text-[#FFFFFF]">
            &ldquo;When a craft dies, a whole way of understanding nature and beauty disappears with it.&rdquo;
          </h2>

          <p className="text-sm sm:text-base text-[#A8A49A] max-w-2xl mx-auto leading-relaxed font-light">
            Mass factory replication dilutes sacred techniques. ARTSINLY exists to provide master artisans with a dignified digital storefront, setting their own prices and speaking directly to those who cherish generational craft.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/about"
              className="px-6 py-3 rounded bg-[#89714F] hover:bg-[#A44A3F] text-white text-xs font-semibold tracking-wide transition-colors"
            >
              Read Our Fair Trade Charter
            </Link>
            <Link
              href="/seller/dashboard"
              className="px-6 py-3 rounded border border-[#DCD0BD] hover:bg-white hover:text-[#20201D] text-[#DCD0BD] text-xs font-semibold tracking-wide transition-colors"
            >
              Join as a Seller
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
