"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Menu, X } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<"collector" | "artisan" | "admin">("collector");

  const isCatalogActive = pathname.startsWith("/catalog") || pathname.startsWith("/products");
  const isExploreActive = pathname.startsWith("/explore") && !isCatalogActive;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE5DD] transition-colors">
      {/* 1. Topmost Utility Bar */}
      <div className="bg-[#FAF8F5] border-b border-[#EFEBE4] text-[11px] text-[#7A756D] py-1 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-normal tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" />
          <span>ARTSINLY • Modern Editorial Pavilion for Indian Generational Masters</span>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <span className="text-[#9E988E]">Role Mode:</span>
          <button
            onClick={() => setActiveRole("collector")}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
              activeRole === "collector"
                ? "bg-[#1E1E1C] text-white shadow-2xs"
                : "text-[#6E6A62] hover:text-[#1E1E1C]"
            }`}
          >
            Collector (Buyer)
          </button>
          <Link
            href="/seller/dashboard"
            onClick={() => setActiveRole("artisan")}
            className={`text-[10px] font-medium transition-colors ${
              activeRole === "artisan"
                ? "font-semibold text-[#1E1E1C]"
                : "text-[#6E6A62] hover:text-[#1E1E1C]"
            }`}
          >
            Artisan Studio
          </Link>
          <Link
            href="/about#gi-ledger"
            onClick={() => setActiveRole("admin")}
            className={`text-[10px] font-medium transition-colors ${
              activeRole === "admin"
                ? "font-semibold text-[#1E1E1C]"
                : "text-[#6E6A62] hover:text-[#1E1E1C]"
            }`}
          >
            Admin / GI Ledger
          </Link>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo on Left */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center">
              <span className="font-serif text-2xl sm:text-[25px] tracking-[0.08em] text-[#1E1E1C] font-normal uppercase">
                ARTISANLY
              </span>
            </Link>
          </div>

          {/* Desktop Navigation in Center */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs sm:text-[13px] font-medium text-[#403E39]">
            {/* Explore with black dot underneath when active */}
            <Link
              href="/explore"
              className={`relative hover:text-[#1E1E1C] transition-colors py-1 flex flex-col items-center ${
                isExploreActive ? "text-[#1E1E1C] font-semibold" : "text-[#403E39]"
              }`}
            >
              <span>Explore</span>
              {isExploreActive ? (
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E1E1C] absolute -bottom-1" />
              ) : null}
            </Link>

            {/* Catalog with black dot underneath when active */}
            <Link
              href="/catalog"
              className={`relative hover:text-[#1E1E1C] transition-colors py-1 flex flex-col items-center ${
                isCatalogActive ? "text-[#1E1E1C] font-semibold" : "text-[#403E39]"
              }`}
            >
              <span>Catalog</span>
              {isCatalogActive ? (
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E1E1C] absolute -bottom-1" />
              ) : null}
            </Link>

            <Link
              href="/artisans"
              className="hover:text-[#1E1E1C] transition-colors"
            >
              Our Artisans
            </Link>

            <Link
              href="/explore?filter=new"
              className="hover:text-[#1E1E1C] transition-colors"
            >
              New Arrivals
            </Link>

            <Link
              href="/explore?filter=bestsellers"
              className="hover:text-[#1E1E1C] transition-colors"
            >
              Best Sellers
            </Link>

            <Link
              href="/about"
              className="hover:text-[#1E1E1C] transition-colors"
            >
              About Us
            </Link>

            <Link
              href="/about#journal"
              className="hover:text-[#1E1E1C] transition-colors"
            >
              Blog
            </Link>
          </nav>

          {/* Right items: Cart Box & Login */}
          <div className="flex items-center space-x-4 sm:space-x-5 text-xs sm:text-[13px] font-medium text-[#20201D]">
            <Link
              href="/cart"
              className="border border-[#D5CFC5] hover:border-[#1E1E1C] rounded-md px-2.5 py-1.5 flex items-center gap-1.5 text-xs transition-colors bg-white/50"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#1E1E1C]" />
              <span>Cart ({cartCount})</span>
            </Link>

            <Link
              href="/buyer/dashboard"
              className="hover:text-[#89714F] transition-colors"
            >
              Login
            </Link>

            {/* Mobile Menu Toggle Button */}
            <div className="flex items-center lg:hidden ml-1">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 text-[#20201D] hover:text-[#89714F] focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EAE5DD] bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-3 text-sm">
          <Link
            href="/explore"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 font-medium text-[#1E1E1C] hover:text-[#89714F]"
          >
            Explore
          </Link>
          <Link
            href="/catalog"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 font-medium text-[#1E1E1C] hover:text-[#89714F]"
          >
            Catalog
          </Link>
          <Link
            href="/artisans"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 font-medium text-[#1E1E1C] hover:text-[#89714F]"
          >
            Our Artisans
          </Link>
          <Link
            href="/explore?filter=new"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 font-medium text-[#1E1E1C] hover:text-[#89714F]"
          >
            New Arrivals
          </Link>
          <Link
            href="/explore?filter=bestsellers"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 font-medium text-[#1E1E1C] hover:text-[#89714F]"
          >
            Best Sellers
          </Link>
          <Link
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 font-medium text-[#1E1E1C] hover:text-[#89714F]"
          >
            About Us
          </Link>
          <div className="pt-2 border-t border-[#EAE5DD] flex items-center justify-between">
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 text-sm font-semibold text-[#1E1E1C]"
            >
              Cart ({cartCount})
            </Link>
            <Link
              href="/seller/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 text-sm font-semibold text-[#89714F]"
            >
              Artisan Studio
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
