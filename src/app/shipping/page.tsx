import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Heritage Packaging Policy",
  description:
    "Domestic PAN-India logistics, museum-grade protective packaging for fragile crafts, transit timelines, and shipment tracking on ARTSINLY.",
};

export default function ShippingPage() {
  return (
    <div className="bg-[#FAF8F5] dark:bg-[#121110] text-[#20201D] dark:text-[#E8E4DC] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="border-b border-[#EAE5DD] dark:border-[#2D2A25] pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#89714F] uppercase tracking-wider mb-2">
            <span>Logistics &amp; Craft Preservation</span>
            <span>•</span>
            <span>PAN-India Artisan Dispatch</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1E1E1C] dark:text-white font-normal mb-3">
            Shipping &amp; Craft Handling Policy
          </h1>
          <p className="text-sm text-[#6E6A62] dark:text-[#A8A297] leading-relaxed">
            Delivering authentic masterworks safely from regional artisan clusters to your doorstep.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            1. Direct Cluster Fulfillment &amp; Courier Partners
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            To preserve provenance and ensure that master makers receive maximum fair compensation, all orders on ARTSINLY are dispatched directly from the respective artisan’s studio or registered cooperative. We partner with India’s leading logistics networks:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5]">
            <li><strong>Express Air &amp; Surface:</strong> Blue Dart, Delhivery, DTDC for major metro corridors and tier-1/tier-2 cities.</li>
            <li><strong>Sovereign Postal Reach:</strong> India Post Speed Post for remote heritage villages, tribal hamlets, and desert clusters (e.g. Kutch, Bastar, Dindori).</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            2. Transit Timelines &amp; Made-to-Order Lead Times
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border border-[#EAE5DD] dark:border-[#2D2A25]">
              <thead className="bg-[#EFECE6] dark:bg-[#1E1C18] text-[#1E1E1C] dark:text-white font-semibold">
                <tr>
                  <th className="p-3 border-b border-[#EAE5DD] dark:border-[#2D2A25]">Order Type</th>
                  <th className="p-3 border-b border-[#EAE5DD] dark:border-[#2D2A25]">Cluster Dispatch Time</th>
                  <th className="p-3 border-b border-[#EAE5DD] dark:border-[#2D2A25]">Estimated Delivery Window</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5DD] dark:divide-[#2D2A25] text-[#4A4742] dark:text-[#C5BFB5]">
                <tr>
                  <td className="p-3 font-medium text-[#1E1E1C] dark:text-white">Ready-to-Ship Pieces</td>
                  <td className="p-3">1 to 2 business days</td>
                  <td className="p-3">3 to 6 business days (PAN India)</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-[#1E1E1C] dark:text-white">Made-to-Order / Customized</td>
                  <td className="p-3">Craft-specific (7 to 21 days)</td>
                  <td className="p-3">Stated craft lead time + 3 to 5 transit days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            3. Museum-Grade Packaging for Fragile Crafts
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            Delicate crafts such as terracotta earthenware, Jaipur blue pottery quartz glazes, glass beadwork, and bronze castings receive multi-layer archival packaging:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5]">
            <li><strong>Acid-free glassine wrapping</strong> preventing surface abrasion on hand-painted Pichwai or miniature canvases.</li>
            <li><strong>Biodegradable air cushioning &amp; corrugated honeycomb inserts</strong> dampening physical shock during inter-state haulage.</li>
            <li><strong>Double-walled export-grade outer cartons</strong> marked with high-visibility Fragile indicators.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            4. Shipping Rates &amp; Real-Time Tracking
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            Standard domestic shipping is calculated at checkout based on weight and distance. All orders above <strong>₹2,500</strong> qualify for complimentary insured domestic shipping across India.
          </p>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            Upon cluster dispatch, you receive an automated SMS and email containing the courier Air Waybill (AWB) number and direct tracking link.
          </p>
        </section>

        {/* Support */}
        <div className="mt-8 p-5 rounded-lg bg-[#EFECE6] dark:bg-[#1E1C18] border border-[#DDD8CE] dark:border-[#33302A] text-xs">
          <p className="font-semibold text-sm text-[#1E1E1C] dark:text-white mb-1">Transit Support &amp; Damaged Delivery</p>
          <p className="text-[#6E6A62] dark:text-[#A8A297]">
            In the rare event of transit damage, notify us within 48 hours of receipt with unboxing photos via our <Link href="/refunds" className="text-[#C2410C] underline">Returns &amp; Refund Portal</Link> or email <a href="mailto:logistics@artsinly.com" className="text-[#C2410C] underline">logistics@artsinly.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
