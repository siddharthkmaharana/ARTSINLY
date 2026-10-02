"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CATEGORIES, REGIONS } from "@/lib/mock-data";
import {
  ArrowLeft,
  Sparkles,
  Upload,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

export default function NewProductListingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: "",
    craftType: "Jaipur Blue Pottery",
    categorySlug: "pottery-ceramics",
    regionSlug: "rajasthan",
    priceRupees: "",
    stock: "5",
    isMadeToOrder: false,
    leadTimeDays: "7",
    dimensions: "10\" H × 5\" Diameter",
    materials: "Quartz, glass cullet, natural gum, cobalt glaze",
    careInstructions: "Wipe gently with damp cotton cloth.",
    description: "",
    story: "",
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, isMadeToOrder: e.target.checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/seller/dashboard");
      }, 1500);
    }, 1000);
  };

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/seller/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-[#89714F] hover:underline mb-2 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Seller Dashboard</span>
          </Link>
          <h1 className="font-serif text-3xl font-medium text-[#20201D]">
            Publish a New Regional Craft Listing
          </h1>
          <p className="text-xs sm:text-sm text-[#6B685F] mt-1">
            Provide authentic provenance, fair-trade pricing, and the heritage story behind your piece.
          </p>
        </div>

        {success ? (
          <div className="bg-white border border-[#E8E0D2] rounded-xl p-8 text-center space-y-4 shadow-xs">
            <CheckCircle className="w-12 h-12 text-[#52644B] mx-auto" />
            <h2 className="font-serif text-2xl font-medium text-[#20201D]">
              Listing Published Successfully!
            </h2>
            <p className="text-xs text-[#6B685F]">
              Your craft piece has been submitted to the regional catalogue. Redirecting to your dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-[#E8E0D2] rounded-xl p-6 sm:p-8 space-y-8 shadow-xs">
            {/* Section 1: Basic Information */}
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-medium text-[#20201D] pb-2 border-b border-[#F3ECE1]">
                1. Craft Identity
              </h2>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#20201D]">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Cobalt Persian Flower Motif Blue Pottery Vase"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#DCD0BD] rounded text-xs text-[#20201D] focus:outline-none focus:border-[#89714F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#20201D] mb-1">
                    Craft Category *
                  </label>
                  <select
                    name="categorySlug"
                    value={form.categorySlug}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#DCD0BD] rounded text-xs text-[#20201D] focus:outline-none focus:border-[#89714F]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#20201D] mb-1">
                    Geographic Region / Cluster *
                  </label>
                  <select
                    name="regionSlug"
                    value={form.regionSlug}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#DCD0BD] rounded text-xs text-[#20201D] focus:outline-none focus:border-[#89714F]"
                  >
                    {REGIONS.map((r) => (
                      <option key={r.id} value={r.slug}>
                        {r.name} ({r.state})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20201D] mb-1">
                  Specific Craft Technique *
                </label>
                <input
                  type="text"
                  name="craftType"
                  required
                  placeholder="e.g. Lost-Wax Bell Metal Casting, Rogan Castor Oil Freehand"
                  value={form.craftType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#DCD0BD] rounded text-xs text-[#20201D] focus:outline-none focus:border-[#89714F]"
                />
              </div>
            </div>

            {/* Section 2: Narrative & Story */}
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-medium text-[#20201D] pb-2 border-b border-[#F3ECE1]">
                2. Cultural Story & Description
              </h2>

              <div>
                <label className="block text-xs font-semibold text-[#20201D] mb-1">
                  Description of Piece *
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  placeholder="Describe the aesthetic, function, and visual beauty of this creation..."
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#DCD0BD] rounded text-xs text-[#20201D] focus:outline-none focus:border-[#89714F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20201D] mb-1">
                  The Heritage Story (Ancestral Technique)
                </label>
                <textarea
                  name="story"
                  rows={4}
                  placeholder="Tell buyers how this piece was born: the earth sourced, how pigments were extracted, how long it took..."
                  value={form.story}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#DCD0BD] rounded text-xs text-[#20201D] focus:outline-none focus:border-[#89714F]"
                />
              </div>
            </div>

            {/* Section 3: Commercial & Pricing */}
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-medium text-[#20201D] pb-2 border-b border-[#F3ECE1]">
                3. Pricing & Inventory
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#20201D] mb-1">
                    Your Selling Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    name="priceRupees"
                    required
                    placeholder="e.g. 3500"
                    value={form.priceRupees}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#DCD0BD] rounded text-xs text-[#20201D] focus:outline-none focus:border-[#89714F]"
                  />
                  <span className="text-[10px] text-[#52644B] block mt-1">
                    You receive 85% directly on payout.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#20201D] mb-1">
                    Ready Stock (Units)
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#DCD0BD] rounded text-xs text-[#20201D] focus:outline-none focus:border-[#89714F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#20201D] mb-1">
                    Lead Time (Days if Commission)
                  </label>
                  <input
                    type="number"
                    name="leadTimeDays"
                    value={form.leadTimeDays}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#DCD0BD] rounded text-xs text-[#20201D] focus:outline-none focus:border-[#89714F]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-[#20201D] cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={form.isMadeToOrder}
                  onChange={handleCheckbox}
                  className="accent-[#89714F] rounded"
                />
                <span>This item is custom made to order upon buyer purchase</span>
              </label>
            </div>

            {/* Section 4: Specifications */}
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-medium text-[#20201D] pb-2 border-b border-[#F3ECE1]">
                4. Specifications & Materials
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#20201D] mb-1">
                    Dimensions (e.g. Height × Width)
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    value={form.dimensions}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#DCD0BD] rounded text-xs text-[#20201D] focus:outline-none focus:border-[#89714F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#20201D] mb-1">
                    Materials & Natural Dyes Used
                  </label>
                  <input
                    type="text"
                    name="materials"
                    value={form.materials}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#DCD0BD] rounded text-xs text-[#20201D] focus:outline-none focus:border-[#89714F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20201D] mb-1">
                  Product Image URL (High Resolution)
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#DCD0BD] rounded text-xs text-[#20201D] focus:outline-none focus:border-[#89714F]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#F3ECE1] flex justify-end gap-3">
              <Link
                href="/seller/dashboard"
                className="px-5 py-2.5 rounded border border-[#DCD0BD] text-xs font-semibold text-[#20201D] hover:bg-[#F8F5EF]"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded bg-[#20201D] hover:bg-[#89714F] text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-60"
              >
                {isSubmitting ? "Publishing Listing..." : "Publish to Marketplace"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
