"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminPage() {
  const [isApproved, setIsApproved] = useState(false);
  const [isTestRequested, setIsTestRequested] = useState(false);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-5 sm:py-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb line from screenshot */}
        <nav className="flex items-center space-x-2 text-[11px] text-[#8C877E] mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link href="/" className="hover:text-[#1E1E1C] transition-colors">
            Home
          </Link>
          <span>•</span>
          <Link href="/explore" className="hover:text-[#1E1E1C] transition-colors">
            Explore
          </Link>
          <span>•</span>
          <span className="hover:text-[#1E1E1C] transition-colors cursor-pointer">
            Vases
          </span>
          <span>•</span>
          <span className="text-[#6B665E] truncate">
            Modern Ethnic Ceramic Vase – Terracotta Vase with Indigenous Pattern
          </span>
        </nav>

        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#1E6B52] uppercase tracking-[0.2em] block mb-1">
            SUPER ADMINISTRATOR
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-normal text-[#1E1E1C] tracking-tight leading-tight mb-2">
            GI Authenticity &amp; Fair-Trade Verification Queue
          </h1>
          <p className="text-xs sm:text-[13px] text-[#6E6A62] leading-relaxed max-w-2xl font-light">
            Review pending regional master applications, authenticate GI provenance, and monitor fair pricing formulas.
          </p>
        </div>

        {/* 3 Verification Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mb-20">
          {/* Card 1: PENDING GI TAG REVIEWS */}
          <div className="bg-[#F4EFE6]/60 border border-[#E3DDD1] rounded-2xl p-5 sm:p-6 flex flex-col justify-between group hover:border-[#D5CFC5] transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#8C877E] uppercase tracking-wider">
                  PENDING GI TAG REVIEWS
                </span>
                <span className="bg-[#B34728] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full tracking-wide">
                  {isApproved ? "0 New" : "1 New"}
                </span>
              </div>

              {/* Inner Card Box */}
              <div className="bg-white/80 border border-[#E0D9CD] rounded-xl p-4 shadow-2xs">
                <h4 className="font-serif text-[15px] font-medium text-[#1E1E1C] mb-1">
                  Pashmina Weavers Guild
                </h4>
                <p className="text-xs text-[#7A756D] mb-4">
                  Srinagar, Kashmir • GI-IN-JK-003
                </p>

                <div className="flex items-center gap-2 pt-1">
                  {isApproved ? (
                    <div className="inline-flex items-center gap-1.5 text-xs text-[#1E6B52] font-medium py-1 px-2.5 bg-emerald-50 rounded border border-emerald-200">
                      <Check className="w-3.5 h-3.5" />
                      <span>Approved &amp; GI Enrolled</span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsApproved(true)}
                        className="bg-[#1E6B52] hover:bg-[#16533F] text-white text-xs font-medium px-4 py-1.5 rounded-md transition-colors shadow-2xs cursor-pointer active:scale-95"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => setIsTestRequested(!isTestRequested)}
                        className={`border border-[#D5CFC5] hover:border-[#1E1E1C] text-xs font-medium px-3.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                          isTestRequested ? "bg-[#ECE6DC] text-[#1E1E1C]" : "bg-white text-[#1E1E1C]"
                        }`}
                      >
                        {isTestRequested ? "Fiber Test Dispatched" : "Request Fiber Test"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: FAIR SHARE ALGORITHMIC AUDIT */}
          <div className="bg-[#F4EFE6]/60 border border-[#E3DDD1] rounded-2xl p-5 sm:p-6 flex flex-col justify-between group hover:border-[#D5CFC5] transition-all">
            <div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#8C877E] uppercase tracking-wider block mb-3">
                FAIR SHARE ALGORITHMIC AUDIT
              </span>
              <p className="text-xs sm:text-[12.5px] text-[#6E6A62] leading-relaxed mb-6 font-light">
                ARTSINLY automatically certifies that maker payout is ≥ 85% of customer price after payment processing.
              </p>
            </div>

            {/* Green Compliance Alert Box */}
            <div className="bg-[#EAF6ED] border border-[#B8E2C4] rounded-xl p-3.5 text-xs text-[#1E6B52] font-medium flex items-center gap-2">
              <span className="font-bold">✓</span>
              <span>100% of the 8 artisan guilds are operating in full compliance.</span>
            </div>
          </div>

          {/* Card 3: PLATFORM LEDGER METRICS */}
          <div className="bg-[#F4EFE6]/60 border border-[#E3DDD1] rounded-2xl p-5 sm:p-6 flex flex-col justify-between group hover:border-[#D5CFC5] transition-all">
            <div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#8C877E] uppercase tracking-wider block mb-4">
                PLATFORM LEDGER METRICS
              </span>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6E6A62]">Global Collectors</span>
                  <span className="font-serif font-medium text-sm text-[#1E1E1C]">14,290</span>
                </div>
                <div className="border-t border-[#EAE5DC]" />

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6E6A62]">Master Guilds Verified</span>
                  <span className="font-serif font-medium text-sm text-[#1E1E1C]">8 Clusters</span>
                </div>
                <div className="border-t border-[#EAE5DC]" />

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6E6A62]">Provenance Authenticity Rate</span>
                  <span className="font-semibold text-sm text-[#1E6B52]">99.98%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
