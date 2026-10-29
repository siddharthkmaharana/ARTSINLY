"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname.startsWith("/login")) return null;

  return (
    <footer role="contentinfo" className="bg-[#EDE9E2] text-[#3A3834] pt-14 pb-12 border-t border-[#DDD8CE] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4 space-y-3">
            <Link href="/" className="inline-block" aria-label="ARTSINLY Homepage">
              <span className="font-serif text-2xl tracking-[0.08em] text-[#1E1E1C] font-normal uppercase">
                ARTSINLY
              </span>
            </Link>
            <p className="text-xs text-[#68645C] leading-relaxed max-w-sm">
              An open, fair-trade digital pavilion connecting verified Indian generational artisans directly with contemporary collectors worldwide.
            </p>
            <div className="pt-2 text-[11px] text-[#858076]">
              © 2026 ARTSINLY • Registered Fair Trade Platform
            </div>
          </div>

          {/* Column 2: CRAFT DISCIPLINES & COLLECTIONS */}
          <nav aria-label="Craft Disciplines & Collections" className="lg:col-span-2 space-y-3">
            <h5 className="text-[11px] font-semibold text-[#1E1E1C] dark:text-white uppercase tracking-wider">
              Collections &amp; Crafts
            </h5>
            <ul className="space-y-2 text-xs text-[#68645C] dark:text-[#A8A297]">
              <li>
                <Link href="/products" className="hover:text-[#1E1E1C] dark:hover:text-white transition-colors">
                  All Certified Crafts
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-[#1E1E1C] dark:hover:text-white transition-colors">
                  Regional Craft Catalog
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="hover:text-[#1E1E1C] dark:hover:text-white transition-colors">
                  New Kiln Arrivals
                </Link>
              </li>
              <li>
                <Link href="/best-sellers" className="hover:text-[#1E1E1C] dark:hover:text-white transition-colors">
                  Best Seller Masterpieces
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-[#1E1E1C] dark:hover:text-white transition-colors">
                  Interactive Atelier
                </Link>
              </li>
              <li>
                <Link href="/artisans" className="hover:text-[#1E1E1C] dark:hover:text-white transition-colors">
                  Shilp Guru Makers
                </Link>
              </li>
            </ul>
          </nav>

          {/* Column 3: PAVILION PERSPECTIVES */}
          <nav aria-label="Pavilion Perspectives" className="lg:col-span-2 space-y-3">
            <h5 className="text-[11px] font-semibold text-[#1E1E1C] dark:text-white uppercase tracking-wider">
              Guild &amp; Heritage
            </h5>
            <ul className="space-y-2 text-xs text-[#68645C] dark:text-[#A8A297]">
              <li>
                <Link href="/about" className="hover:text-[#1E1E1C] dark:hover:text-white transition-colors">
                  Heritage Manifesto &amp; Ethics
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#1E1E1C] dark:hover:text-white transition-colors">
                  Stories Behind The Kilns
                </Link>
              </li>
              <li>
                <Link href="/artisan-studio" className="hover:text-[#1E1E1C] dark:hover:text-white transition-colors">
                  Artisan Studio Portal
                </Link>
              </li>
              <li>
                <Link href="/seller/onboarding" className="hover:text-[#1E1E1C] dark:hover:text-white transition-colors">
                  Artisan Application
                </Link>
              </li>
              <li>
                <Link href="/seller/dashboard" className="hover:text-[#1E1E1C] dark:hover:text-white transition-colors">
                  Artisan Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#1E1E1C] dark:hover:text-white transition-colors">
                  GI Moderation Portal
                </Link>
              </li>
            </ul>
          </nav>

          {/* Column 4: THE CRAFT GAZETTE */}
          <div className="lg:col-span-4 space-y-3">
            <h5 className="text-[11px] font-semibold text-[#1E1E1C] uppercase tracking-wider">
              The Craft Gazette
            </h5>
            <p className="text-xs text-[#68645C] leading-relaxed max-w-sm">
              Seasonal dispatches on rare craft revivals, wood firing calendars, and artisan field notes.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 pt-1 max-w-sm" aria-label="Newsletter Subscription">
              <label htmlFor="newsletter-email" className="sr-only">
                Email Address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="collector@domain.com"
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDD7CE] rounded text-[#1E1E1C] placeholder-[#9E988E] focus:outline-none focus:border-[#89714F] focus:ring-1 focus:ring-[#89714F]"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-full bg-[#1E1E1C] hover:bg-[#3B3A36] text-white text-xs font-semibold shrink-0 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#89714F]"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Statutory Legal & Compliance Bar */}
        <nav aria-label="Legal & Statutory Compliance" className="mt-10 pt-6 border-t border-[#DDD8CE] dark:border-[#2D2A25] flex flex-wrap items-center justify-between gap-y-3 text-[11px] text-[#6E6A62] dark:text-[#A8A297]">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/terms" className="hover:text-[#1E1E1C] dark:hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-[#1E1E1C] dark:hover:text-white transition-colors">
              Privacy Policy (DPDP)
            </Link>
            <Link href="/shipping" className="hover:text-[#1E1E1C] dark:hover:text-white transition-colors">
              Shipping &amp; Logistics
            </Link>
            <Link href="/refunds" className="hover:text-[#1E1E1C] dark:hover:text-white transition-colors">
              Returns &amp; Refunds
            </Link>
            <Link href="/seller-policy" className="hover:text-[#1E1E1C] dark:hover:text-white transition-colors">
              Artisan Agreement (84% Remittance)
            </Link>
            <Link href="/grievance" className="hover:text-[#C2410C] font-semibold transition-colors flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" />
              Grievance Redressal Officer
            </Link>
          </div>
          <div className="text-[10px] text-[#858076] dark:text-[#7A756D]">
            CPA 2019 • DPDP 2023 • Section 194-O TDS Compliant
          </div>
        </nav>

        {/* Bottom Bar: Copyright & Theme Toggle */}
        <div className="mt-6 pt-4 border-t border-[#E5E0D6] dark:border-[#24211D] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#858076] dark:text-[#A39D91]">
          <div>
            © 2026 ARTSINLY CRAFT PAVILION PVT. LTD. • Registered Fair Trade Platform &amp; Sovereign Craft Ledger
          </div>
          <div className="flex items-center gap-2">
            <span>Ambient Lighting:</span>
            <ThemeToggle variant="pill" />
          </div>
        </div>
      </div>
    </footer>
  );
}
