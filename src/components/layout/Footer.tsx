import React from "react";
import Link from "next/link";
import { ShieldCheck, HeartHandshake, Compass, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#20201D] text-[#F8F5EF] pt-16 pb-12 border-t border-[#3B3A36]">
      {/* Heritage & Values Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-[#3B3A36]">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-full bg-[#2C2B27] text-[#DCD0BD]">
              <HeartHandshake className="w-6 h-6 text-[#89714F]" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-medium text-[#FFFFFF] mb-1">
                Direct Artisan Honorarium
              </h4>
              <p className="text-xs text-[#A8A49A] leading-relaxed">
                Zero predatory middlemen. Up to 85% of each sale goes directly to the master creator and their village guild.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-full bg-[#2C2B27] text-[#DCD0BD]">
              <Compass className="w-6 h-6 text-[#89714F]" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-medium text-[#FFFFFF] mb-1">
                Geographic Authenticity
              </h4>
              <p className="text-xs text-[#A8A49A] leading-relaxed">
                Every craft is certified with its Geographical Indication (GI) heritage and physical workshop origin.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-full bg-[#2C2B27] text-[#DCD0BD]">
              <ShieldCheck className="w-6 h-6 text-[#89714F]" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-medium text-[#FFFFFF] mb-1">
                Insured Fragile Transit
              </h4>
              <p className="text-xs text-[#A8A49A] leading-relaxed">
                Museum-grade biodegradable packaging with transit protection for delicate terracotta, bronze, and glasswork.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl tracking-tight text-[#FFFFFF] font-medium">
                ARTSINLY
              </span>
              <span className="block text-[10px] tracking-[0.25em] uppercase text-[#DCD0BD] font-medium">
                Regional Artisans Marketplace
              </span>
            </Link>
            <p className="text-xs text-[#A8A49A] leading-relaxed max-w-sm">
              Dedicated to preserving living Indian craft heritage. Connecting connoisseurs of genuine handmade artifacts with the rural master creators who breathe life into clay, thread, brass, and wood.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#2C2B27] border border-[#3B3A36] text-[11px] text-[#DCD0BD]">
                <Sparkles className="w-3.5 h-3.5 text-[#89714F]" />
                Preserving 400+ years of generational skill
              </span>
            </div>
          </div>

          {/* Regional Traditions */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-[#FFFFFF] uppercase tracking-wider mb-4">
              Regional Origins
            </h5>
            <ul className="space-y-2.5 text-xs text-[#A8A49A]">
              <li>
                <Link href="/products?region=rajasthan" className="hover:text-[#FFFFFF] transition-colors">
                  Jaipur Blue Pottery
                </Link>
              </li>
              <li>
                <Link href="/products?region=gujarat" className="hover:text-[#FFFFFF] transition-colors">
                  Kutch Rogan & Ajrakh
                </Link>
              </li>
              <li>
                <Link href="/products?region=bihar" className="hover:text-[#FFFFFF] transition-colors">
                  Mithila Madhubani
                </Link>
              </li>
              <li>
                <Link href="/products?region=chhattisgarh" className="hover:text-[#FFFFFF] transition-colors">
                  Bastar Lost-Wax Dokra
                </Link>
              </li>
              <li>
                <Link href="/products?region=karnataka" className="hover:text-[#FFFFFF] transition-colors">
                  Channapatna Lacquer Wood
                </Link>
              </li>
              <li>
                <Link href="/products?region=kashmir" className="hover:text-[#FFFFFF] transition-colors">
                  Kashmiri Handspun Pashmina
                </Link>
              </li>
            </ul>
          </div>

          {/* Marketplace Navigation */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-[#FFFFFF] uppercase tracking-wider mb-4">
              Explore
            </h5>
            <ul className="space-y-2.5 text-xs text-[#A8A49A]">
              <li>
                <Link href="/products" className="hover:text-[#FFFFFF] transition-colors">
                  All Handmade Masterpieces
                </Link>
              </li>
              <li>
                <Link href="/artisans" className="hover:text-[#FFFFFF] transition-colors">
                  Meet the Artisans
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FFFFFF] transition-colors">
                  Our Mission & Ethics
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#FFFFFF] transition-colors">
                  Cart & Safe Checkout
                </Link>
              </li>
              <li>
                <Link href="/buyer/dashboard" className="hover:text-[#FFFFFF] transition-colors">
                  Track Your Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Seller & Platform */}
          <div>
            <h5 className="font-serif text-sm font-semibold text-[#FFFFFF] uppercase tracking-wider mb-4">
              For Artisans
            </h5>
            <ul className="space-y-2.5 text-xs text-[#A8A49A]">
              <li>
                <Link href="/seller/dashboard" className="hover:text-[#FFFFFF] transition-colors font-medium text-[#DCD0BD]">
                  Seller Studio Login
                </Link>
              </li>
              <li>
                <Link href="/seller/products/new" className="hover:text-[#FFFFFF] transition-colors">
                  Publish a Craft Listing
                </Link>
              </li>
              <li>
                <Link href="/about#seller-guidelines" className="hover:text-[#FFFFFF] transition-colors">
                  Fair Trade Standards
                </Link>
              </li>
              <li>
                <Link href="/seller/dashboard" className="hover:text-[#FFFFFF] transition-colors">
                  Payouts & Settlements
                </Link>
              </li>
              <li>
                <span className="text-[11px] text-[#78756E] block mt-2">
                  Need onboarding assistance? artisans@artsinly.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-[#3B3A36] flex flex-col sm:flex-row items-center justify-between text-xs text-[#78756E]">
          <p>© {new Date().getFullYear()} ARTSINLY. All rights reserved. Handcrafted in India.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/about" className="hover:text-[#A8A49A]">Privacy Policy</Link>
            <Link href="/about" className="hover:text-[#A8A49A]">Buyer Protection</Link>
            <Link href="/about" className="hover:text-[#A8A49A]">GI Verification</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
