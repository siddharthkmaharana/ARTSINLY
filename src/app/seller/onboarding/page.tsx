"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Sparkles,
  Award,
  MapPin,
  Building2,
  FileCheck2,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

const CRAFT_OPTIONS = [
  "Terracotta Pottery",
  "Wood Carving",
  "Miniature Painting",
  "Dhokra Lost-Wax Metalwork",
  "Block Printing",
  "Zardozi Needlework",
  "Blue Pottery",
  "Kalamkari Painting",
  "Meenakari Enameling",
  "Pashmina Weaving",
];

const STATE_OPTIONS = [
  "Gujarat",
  "Rajasthan",
  "West Bengal",
  "Uttar Pradesh",
  "Madhya Pradesh",
  "Andhra Pradesh",
  "Odisha",
  "Jammu & Kashmir",
  "Karnataka",
  "Bihar",
];

export default function SellerOnboardingPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [shopName, setShopName] = useState("");
  const [artisanName, setArtisanName] = useState(user?.name || "");
  const [craftTradition, setCraftTradition] = useState("Terracotta Pottery");
  const [state, setState] = useState("Gujarat");
  const [locality, setLocality] = useState("");
  const [giCode, setGiCode] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("18");
  const [bio, setBio] = useState("");
  const [story, setStory] = useState("");
  const [bannerUrl, setBannerUrl] = useState(
    "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85"
  );
  const [avatarUrl, setAvatarUrl] = useState(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim()) {
      setError("Please provide your Atelier or Shop Name.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/seller/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopName,
          artisanName: artisanName || shopName,
          craftTradition,
          state,
          locality,
          giCode,
          yearsOfExperience: parseInt(yearsOfExperience, 10) || 0,
          bio: bio || `Master artisan specializing in authentic Indian ${craftTradition}.`,
          story: story || `Preserving ancestral heritage techniques handed down through generations in ${locality || state}.`,
          bannerUrl,
          avatarUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize seller studio profile");
      }

      await refreshUser();
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/seller/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 sm:py-16 text-[#1E1E1C]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0E6] border border-[#E8D7C8] text-[#C2410C] text-[11px] font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Artisan Onboarding</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#1E1E1C] font-normal tracking-tight">
            Register Your Living Atelier
          </h1>

          <p className="text-xs sm:text-sm text-[#6E6A62] max-w-lg mx-auto leading-relaxed">
            ARTSINLY connects genuine generational master artisans directly with collectors. Complete your atelier credentials to activate your sovereign studio storefront.
          </p>
        </div>

        {/* Onboarding Form Card */}
        <div className="bg-white border border-[#E5E0D7] rounded-2xl p-6 sm:p-10 shadow-sm">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          {isSuccess ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="font-serif text-2xl font-normal text-[#1E1E1C]">
                Atelier Profile Authenticated!
              </h3>
              <p className="text-xs text-[#6E6A62]">
                Your studio storefront is now established in the database. Redirecting to your Artisan Dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Studio Identity */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-[#C2410C] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#F0EBE1] pb-2">
                  <Building2 className="w-4 h-4" />
                  <span>1. Studio & Artisan Identity</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#4A4742] mb-1.5">
                      Atelier / Shop Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="e.g. Kutch Terracotta Guild"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DDD8CE] bg-[#FAF8F5] text-[#1E1E1C] placeholder-[#9E988E] focus:outline-none focus:border-[#C2410C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A4742] mb-1.5">
                      Master Artisan Name
                    </label>
                    <input
                      type="text"
                      value={artisanName}
                      onChange={(e) => setArtisanName(e.target.value)}
                      placeholder="e.g. Devendra Prajapati"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DDD8CE] bg-[#FAF8F5] text-[#1E1E1C] placeholder-[#9E988E] focus:outline-none focus:border-[#C2410C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#4A4742] mb-1.5">
                      Craft Tradition *
                    </label>
                    <select
                      value={craftTradition}
                      onChange={(e) => setCraftTradition(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DDD8CE] bg-[#FAF8F5] text-[#1E1E1C] focus:outline-none focus:border-[#C2410C]"
                    >
                      {CRAFT_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A4742] mb-1.5">
                      Years of Practice / Generation
                    </label>
                    <input
                      type="number"
                      value={yearsOfExperience}
                      onChange={(e) => setYearsOfExperience(e.target.value)}
                      placeholder="Years practicing craft"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DDD8CE] bg-[#FAF8F5] text-[#1E1E1C] focus:outline-none focus:border-[#C2410C]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Regional Provenance & GI */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-semibold text-[#C2410C] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#F0EBE1] pb-2">
                  <MapPin className="w-4 h-4" />
                  <span>2. Geographical Provenance & Terroir</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#4A4742] mb-1.5">
                      State / Province *
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DDD8CE] bg-[#FAF8F5] text-[#1E1E1C] focus:outline-none focus:border-[#C2410C]"
                    >
                      {STATE_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A4742] mb-1.5">
                      District / Village Locality
                    </label>
                    <input
                      type="text"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder="e.g. Bhuj, Kutch District"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DDD8CE] bg-[#FAF8F5] text-[#1E1E1C] placeholder-[#9E988E] focus:outline-none focus:border-[#C2410C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A4742] mb-1.5 flex items-center justify-between">
                    <span>Geographical Indication (GI) Code (If Registered)</span>
                    <span className="text-[10px] text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Grants Verified Badge</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    value={giCode}
                    onChange={(e) => setGiCode(e.target.value)}
                    placeholder="e.g. GI-IN-GJ-449"
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DDD8CE] bg-[#FAF8F5] text-[#1E1E1C] placeholder-[#9E988E] focus:outline-none focus:border-[#C2410C]"
                  />
                </div>
              </div>

              {/* Section 3: Story & Bio */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-semibold text-[#C2410C] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#F0EBE1] pb-2">
                  <FileCheck2 className="w-4 h-4" />
                  <span>3. Living Heritage Story</span>
                </h3>

                <div>
                  <label className="block text-xs font-medium text-[#4A4742] mb-1.5">
                    Short Bio (Appears on Product Pages)
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Carrying on the ancient Kutch terracotta craft, using indigenous riverbed clay fired in traditional wood-burning kilns..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DDD8CE] bg-[#FAF8F5] text-[#1E1E1C] placeholder-[#9E988E] focus:outline-none focus:border-[#C2410C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A4742] mb-1.5">
                    Generational Technique & Atelier Heritage
                  </label>
                  <textarea
                    rows={3}
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    placeholder="Describe ancestral techniques, tools, natural minerals, and apprentice traditions..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DDD8CE] bg-[#FAF8F5] text-[#1E1E1C] placeholder-[#9E988E] focus:outline-none focus:border-[#C2410C]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-[#F0EBE1] flex items-center justify-between">
                <p className="text-[11px] text-[#7A756D]">
                  Stored permanently in PostgreSQL. Editable anytime in your Studio.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#1E1E1C] hover:bg-[#383734] text-white px-7 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating Studio...</span>
                    </>
                  ) : (
                    <>
                      <span>Establish Atelier Studio</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
