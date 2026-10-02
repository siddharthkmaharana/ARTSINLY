import React from "react";
import Link from "next/link";
import {
  HeartHandshake,
  Compass,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#F8F5EF] min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header Manifesto */}
        <div className="text-center space-y-4">
          <span className="text-xs font-semibold text-[#89714F] tracking-[0.25em] uppercase">
            Our Purpose & Heritage
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#20201D] leading-tight">
            Restoring Dignity to Indian Craft Heritage
          </h1>
          <p className="text-base sm:text-lg text-[#6B685F] leading-relaxed max-w-2xl mx-auto font-light">
            ARTSINLY connects discerning patrons worldwide directly with verified master artisans across India’s traditional craft clusters.
          </p>
        </div>

        {/* Vision Narrative */}
        <div className="bg-white border border-[#E8E0D2] rounded-xl p-8 sm:p-12 shadow-xs space-y-6">
          <h2 className="font-serif text-2xl font-medium text-[#20201D]">
            The Challenge of Modern Craftsmanship
          </h2>
          <p className="text-sm text-[#6B685F] leading-relaxed">
            For generations, traditional crafts were sustained by royal patronage and sacred temple commissions. In the modern industrial era, multi-layered merchant networks, factory machine imitations, and predatory middlemen have separated artisans from the true economic value of their labour.
          </p>
          <p className="text-sm text-[#6B685F] leading-relaxed">
            Many young apprentices are forced to abandon their family lineages for low-paying factory jobs in metropolitan areas. When an artisan stops practicing, an irreplaceable library of natural botany, metallurgy, mineral processing, and ancestral folklore goes extinct forever.
          </p>

          <blockquote className="border-l-3 border-[#89714F] pl-4 py-2 italic text-sm text-[#20201D] bg-[#F8F5EF] rounded-r">
            &ldquo;We do not view traditional crafts as antique relics of the past, but as living, sustainable technologies for the future.&rdquo;
          </blockquote>
        </div>

        {/* Pillars of Integrity */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#20201D]">
              Our Operating Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E8E0D2] rounded-xl p-6 space-y-3">
              <HeartHandshake className="w-6 h-6 text-[#89714F]" />
              <h3 className="font-serif text-lg font-medium text-[#20201D]">
                Direct Fair Settlement
              </h3>
              <p className="text-xs text-[#6B685F] leading-relaxed">
                Artisans set their own prices. Up to 85% of customer payments settle directly into the artisan&apos;s bank account.
              </p>
            </div>

            <div className="bg-white border border-[#E8E0D2] rounded-xl p-6 space-y-3">
              <Compass className="w-6 h-6 text-[#89714F]" />
              <h3 className="font-serif text-lg font-medium text-[#20201D]">
                Geographical Provenance
              </h3>
              <p className="text-xs text-[#6B685F] leading-relaxed">
                Every listing is tied to certified GI clusters: Jaipur blue pottery, Kutch Rogan, Mithila Madhubani, and Bastar Dokra.
              </p>
            </div>

            <div className="bg-white border border-[#E8E0D2] rounded-xl p-6 space-y-3">
              <ShieldCheck className="w-6 h-6 text-[#89714F]" />
              <h3 className="font-serif text-lg font-medium text-[#20201D]">
                Eco-Friendly Protection
              </h3>
              <p className="text-xs text-[#6B685F] leading-relaxed">
                We replace non-biodegradable plastics with sun-dried agricultural straw, molded pulp, and certified recyclable cartons.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-[#20201D] text-white rounded-xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="font-serif text-3xl font-medium text-white">
            Are You a Traditional Artisan or Guild?
          </h2>
          <p className="text-xs sm:text-sm text-[#A8A49A] max-w-xl mx-auto leading-relaxed">
            ARTSINLY provides free regional onboarding, digital photography assistance, and zero setup charges. Join our community of master makers today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/seller/dashboard"
              className="px-6 py-3 rounded bg-[#89714F] hover:bg-white hover:text-[#20201D] text-white text-xs font-semibold tracking-wide transition-colors"
            >
              Open Your Artisan Shop
            </Link>
            <Link
              href="/products"
              className="px-6 py-3 rounded border border-[#DCD0BD] hover:bg-white hover:text-[#20201D] text-[#DCD0BD] text-xs font-semibold tracking-wide transition-colors"
            >
              Explore the Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
