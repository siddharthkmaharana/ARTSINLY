"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Menu, X } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isExploreActive = pathname === "/products" || pathname === "/explore";

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE5DD] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo on Left */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center">
              <span className="font-serif text-2xl sm:text-[26px] tracking-tight text-[#1E1E1C] font-normal lowercase">
                artisanale
              </span>
            </Link>
          </div>

          {/* Desktop Navigation in Center */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs sm:text-[13px] font-medium text-[#403E39]">
            <Link
              href="/products"
              className="hover:text-[#1E1E1C] transition-colors"
            >
              Reference View
            </Link>

            {/* Explore with active dot indicator */}
            <Link
              href="/explore"
              className="relative text-[#1E1E1C] hover:text-[#89714F] transition-colors py-1 flex flex-col items-center font-semibold"
            >
              <span>Explore</span>
              {isExploreActive ? (
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E1E1C] absolute -bottom-1" />
              ) : null}
            </Link>

            <Link
              href="/products?filter=new"
              className="hover:text-[#1E1E1C] transition-colors"
            >
              New Arrivals
            </Link>

            <Link
              href="/products?filter=bestsellers"
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

          {/* Right items: Cart & Login */}
          <div className="flex items-center space-x-5 text-xs sm:text-[13px] font-medium text-[#20201D]">
            <Link
              href="/cart"
              className="hover:text-[#89714F] transition-colors"
            >
              Cart ({cartCount})
            </Link>

            <Link
              href="/buyer/dashboard"
              className="hover:text-[#89714F] transition-colors"
            >
              Login
            </Link>

            {/* Mobile Menu Toggle Button */}
            <div className="flex items-center lg:hidden ml-2">
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
            href="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 font-medium text-[#1E1E1C] hover:text-[#89714F]"
          >
            Reference View
          </Link>
          <Link
            href="/products?filter=new"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 font-medium text-[#1E1E1C] hover:text-[#89714F]"
          >
            New Arrivals
          </Link>
          <Link
            href="/products?filter=bestsellers"
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
              Seller Studio
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
