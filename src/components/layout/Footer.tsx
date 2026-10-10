"use client";

import React from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";

export function Footer() {
  return (
    <footer className="bg-[#EDE9E2] text-[#3A3834] pt-14 pb-12 border-t border-[#DDD8CE] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4 space-y-3">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl tracking-[0.08em] text-[#1E1E1C] font-normal uppercase">
                ARTISANLY
              </span>
            </Link>
            <p className="text-xs text-[#68645C] leading-relaxed max-w-sm">
              An open, fair-trade digital pavilion connecting verified Indian generational artisans directly with contemporary collectors worldwide.
            </p>
            <div className="pt-2 text-[11px] text-[#858076]">
              © 2026 ARTISANLY • Registered Fair Trade Platform
            </div>
          </div>

          {/* Column 2: CRAFT DISCIPLINES */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-[11px] font-semibold text-[#1E1E1C] uppercase tracking-wider">
              Craft Disciplines
            </h5>
            <ul className="space-y-2 text-xs text-[#68645C]">
              <li>
                <Link href="/explore?craft=terracotta" className="hover:text-[#1E1E1C] transition-colors">
                  Kutch Terracotta
                </Link>
              </li>
              <li>
                <Link href="/explore?craft=wood" className="hover:text-[#1E1E1C] transition-colors">
                  Sheesham Wood Carving
                </Link>
              </li>
              <li>
                <Link href="/explore?craft=miniature" className="hover:text-[#1E1E1C] transition-colors">
                  Pichwai Miniatures
                </Link>
              </li>
              <li>
                <Link href="/explore?craft=dhokra" className="hover:text-[#1E1E1C] transition-colors">
                  Dhokra Lost-Wax
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: PAVILION PERSPECTIVES */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-[11px] font-semibold text-[#1E1E1C] uppercase tracking-wider">
              Pavilion Perspectives
            </h5>
            <ul className="space-y-2 text-xs text-[#68645C]">
              <li>
                <Link href="/explore" className="hover:text-[#1E1E1C] transition-colors">
                  Collector View
                </Link>
              </li>
              <li>
                <Link href="/seller/dashboard" className="hover:text-[#1E1E1C] transition-colors">
                  Artisan Guild Login
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#1E1E1C] transition-colors">
                  GI Moderation
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#1E1E1C] transition-colors">
                  Fair Pricing Ethics
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: THE CRAFT GAZETTE */}
          <div className="lg:col-span-4 space-y-3">
            <h5 className="text-[11px] font-semibold text-[#1E1E1C] uppercase tracking-wider">
              The Craft Gazette
            </h5>
            <p className="text-xs text-[#68645C] leading-relaxed max-w-sm">
              Seasonal dispatches on rare craft revivals, wood firing calendars, and artisan field notes.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 pt-1 max-w-sm">
              <input
                type="email"
                placeholder="collector@domain.com"
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDD7CE] rounded text-[#1E1E1C] placeholder-[#9E988E] focus:outline-none focus:border-[#89714F]"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-full bg-[#1E1E1C] hover:bg-[#3B3A36] text-white text-xs font-semibold shrink-0 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>
        {/* Bottom Bar: Copyright & Theme Toggle */}
        <div className="mt-12 pt-6 border-t border-[#DDD8CE] dark:border-[#2D2A25] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#858076] dark:text-[#A39D91]">
          <div>
            © 2026 ARTISANLY • Registered Fair Trade Platform & Sovereign Craft Ledger
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
