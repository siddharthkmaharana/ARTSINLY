"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  User,
  Sparkles,
  MapPin,
  Store,
} from "lucide-react";

export function Header() {
  const router = useRouter();
  const { cartCount, wishlist } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F5EF]/95 backdrop-blur-md border-b border-[#E8E0D2] transition-colors">
      {/* Top Banner */}
      <div className="bg-[#20201D] text-[#F8F5EF] text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#DCD0BD]" />
        <span>Authentic Indian Heritage Crafts • Fair Trade Direct from Master Artisans</span>
        <span className="hidden md:inline text-[#DCD0BD]">• Pan-India Free Insured Shipping</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#20201D] hover:text-[#89714F] focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Logo & Brand Identity */}
          <div className="flex items-center">
            <Link href="/" className="flex flex-col items-start group">
              <span className="font-serif text-2xl sm:text-3xl tracking-tight text-[#20201D] group-hover:text-[#89714F] transition-colors font-medium">
                ARTSINLY
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#89714F] font-medium -mt-1">
                Regional Artisans
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-normal text-[#20201D]">
            <Link
              href="/products"
              className="hover:text-[#89714F] transition-colors"
            >
              Explore Catalogue
            </Link>
            <Link
              href="/artisans"
              className="hover:text-[#89714F] transition-colors flex items-center gap-1.5"
            >
              <span>Artisan Directory</span>
            </Link>
            <Link
              href="/about"
              className="hover:text-[#89714F] transition-colors"
            >
              Our Heritage & Ethics
            </Link>
            <Link
              href="/seller/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#F4EFE6] text-[#89714F] hover:bg-[#89714F] hover:text-[#FFFFFF] border border-[#DCD0BD] transition-all"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Seller Studio</span>
            </Link>
          </nav>

          {/* Search, Wishlist, Cart & Profile */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Search Bar (Desktop) */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center relative w-48 lg:w-64"
            >
              <input
                type="text"
                placeholder="Search crafts, regions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FFFFFF] border border-[#DCD0BD] rounded-full text-[#20201D] placeholder-[#6B685F] focus:outline-none focus:border-[#89714F] focus:ring-1 focus:ring-[#89714F] transition-all"
              />
              <Search className="w-4 h-4 text-[#89714F] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1.5 text-[#20201D] hover:text-[#89714F] md:hidden"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/buyer/dashboard?tab=wishlist"
              className="relative p-1.5 text-[#20201D] hover:text-[#89714F] transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#89714F] text-[#FFFFFF] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-1.5 text-[#20201D] hover:text-[#89714F] transition-colors flex items-center"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#20201D] text-[#FFFFFF] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account Portal Dropdown / Link */}
            <Link
              href="/buyer/dashboard"
              className="p-1.5 text-[#20201D] hover:text-[#89714F] transition-colors"
              title="Buyer Account"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Mobile Search Box */}
        {isSearchOpen && (
          <div className="py-3 px-2 md:hidden border-t border-[#E8E0D2]">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search blue pottery, Madhubani, Dokra..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#DCD0BD] rounded-lg text-[#20201D] focus:outline-none focus:border-[#89714F]"
              />
              <Search className="w-4 h-4 text-[#89714F] absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E0D2] bg-[#F8F5EF] px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#20201D] hover:text-[#89714F]"
          >
            Explore Catalogue
          </Link>
          <Link
            href="/artisans"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#20201D] hover:text-[#89714F]"
          >
            Artisan Directory & Stories
          </Link>
          <Link
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-[#20201D] hover:text-[#89714F]"
          >
            Heritage & Fair-Trade Ethics
          </Link>
          <div className="pt-2 border-t border-[#E8E0D2] flex flex-col gap-2">
            <Link
              href="/seller/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#20201D] text-[#FFFFFF] rounded text-sm font-medium hover:bg-[#89714F] transition-colors"
            >
              <Store className="w-4 h-4" />
              <span>Seller Studio & Inventory</span>
            </Link>
            <Link
              href="/buyer/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2 px-4 border border-[#DCD0BD] text-[#20201D] rounded text-sm font-medium hover:bg-[#F3ECE1] transition-colors"
            >
              <User className="w-4 h-4" />
              <span>My Orders & Addresses</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
