import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artisan Seller Agreement & Code of Fair Trade Ethics",
  description:
    "Standards, payout economics (84% direct remittance), GI authenticity warranty, and marketplace operational terms for master artisans on ARTSINLY.",
  alternates: {
    canonical: "/seller-policy",
  },
};

export default function SellerPolicyPage() {
  return (
    <div className="bg-[#FAF8F5] dark:bg-[#121110] text-[#20201D] dark:text-[#E8E4DC] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="border-b border-[#EAE5DD] dark:border-[#2D2A25] pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#89714F] uppercase tracking-wider mb-2">
            <span>Fair Trade Guild Standards</span>
            <span>•</span>
            <span>Artisan Direct Pact</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1E1E1C] dark:text-white font-normal mb-3">
            Artisan Seller Agreement &amp; Code of Ethics
          </h1>
          <p className="text-sm text-[#6E6A62] dark:text-[#A8A297] leading-relaxed">
            Protecting ancestral craft wisdom, ensuring economic dignity, and providing transparent direct market access.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            1. The Fair Trade Economic Model (84% Direct Remittance)
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            Unlike commercial e-commerce channels where intermediaries extract 40% to 60% of product margins, ARTSINLY operates on an artisan-first economic model:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center my-6">
            <div className="p-5 rounded-lg bg-[#EFECE6] dark:bg-[#1E1C18] border border-[#DDD8CE] dark:border-[#33302A]">
              <span className="block font-serif text-3xl text-[#1E1E1C] dark:text-white font-semibold mb-1">84%</span>
              <span className="text-xs font-medium text-[#52644B]">Net Artisan Remittance</span>
              <p className="text-[11px] text-[#7A756D] dark:text-[#A8A297] mt-1.5 leading-snug">
                Directly transferred to your registered bank account upon order delivery.
              </p>
            </div>
            <div className="p-5 rounded-lg bg-[#EFECE6] dark:bg-[#1E1C18] border border-[#DDD8CE] dark:border-[#33302A]">
              <span className="block font-serif text-3xl text-[#1E1E1C] dark:text-white font-semibold mb-1">15%</span>
              <span className="text-xs font-medium text-[#1E1E1C] dark:text-white">Marketplace Platform Fee</span>
              <p className="text-[11px] text-[#7A756D] dark:text-[#A8A297] mt-1.5 leading-snug">
                Covers payment gateway fees, curatorial review, server hosting, and global collector promotion.
              </p>
            </div>
            <div className="p-5 rounded-lg bg-[#EFECE6] dark:bg-[#1E1C18] border border-[#DDD8CE] dark:border-[#33302A]">
              <span className="block font-serif text-3xl text-[#1E1E1C] dark:text-white font-semibold mb-1">1%</span>
              <span className="text-xs font-medium text-[#C2410C]">Statutory Section 194-O TDS</span>
              <p className="text-[11px] text-[#7A756D] dark:text-[#A8A297] mt-1.5 leading-snug">
                Government income tax deducted at source and deposited under your PAN.
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            <strong>Zero Listing Fees:</strong> There are no monthly subscriptions, cataloging fees, or hidden penalties. You only contribute when a patron successfully acquires your work.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            2. Payout Settlements &amp; Bank Onboarding
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            In compliance with Reserve Bank of India (RBI) guidelines and Section 194-O of the Income Tax Act:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5]">
            <li>All sellers must onboard a valid Indian Bank Account and Permanent Account Number (PAN) in their <Link href="/seller/dashboard" className="text-[#C2410C] underline">Artisan Studio Dashboard</Link>.</li>
            <li>Artisans with annual turnover below ₹20 Lakhs (or ₹40 Lakhs) may submit a composite exemption declaration in lieu of a GSTIN.</li>
            <li>Payout settlements are processed in <strong>T+2 business days</strong> following confirmed buyer delivery and elapse of the initial return window.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            3. Code of Ethics &amp; Authenticity Warranty
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            Every artisan on ARTSINLY pledges to maintain the sacred integrity of Indian generational crafts:
          </p>
          <div className="space-y-3 text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5]">
            <p><strong>• Genuine Handcrafted Origin:</strong> No industrial factory castings, machine-printed textiles, or automated mold presses may be represented as handmade.</p>
            <p><strong>• Geographical Indication Integrity:</strong> GI tags may only be applied by certified artisans native to the registered region (e.g. Dokra from Bastar/Bengal, Pichwai from Nathdwara, Pashmina from Kashmir).</p>
            <p><strong>• Fair Labor &amp; No Child Labor:</strong> Full compliance with the Child and Adolescent Labour (Prohibition and Regulation) Act, 1986. Guild apprenticeships must respect statutory education and welfare mandates.</p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            4. Artisan Studio &amp; Payout Account Setup
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            Ready to link your bank account or manage your catalogue? Access your seller studio directly:
          </p>
          <div className="pt-2">
            <Link
              href="/seller/dashboard"
              className="inline-block px-5 py-2.5 rounded-md bg-[#1E1E1C] text-white hover:bg-[#383734] text-xs font-semibold transition-all shadow-xs"
            >
              Go to Artisan Studio &amp; Payout Settings →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
