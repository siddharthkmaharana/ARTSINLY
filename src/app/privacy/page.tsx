import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Digital Personal Data Protection (DPDP)",
  description:
    "Statutory disclosure of data collection, processing, storage, and Data Principal rights under India's Digital Personal Data Protection Act, 2023.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#FAF8F5] dark:bg-[#121110] text-[#20201D] dark:text-[#E8E4DC] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="border-b border-[#EAE5DD] dark:border-[#2D2A25] pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#52644B] uppercase tracking-wider mb-2">
            <span>Data Protection Compliance</span>
            <span>•</span>
            <span>DPDP Act 2023 (India)</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1E1E1C] dark:text-white font-normal mb-3">
            Digital Personal Data Protection Policy
          </h1>
          <p className="text-sm text-[#6E6A62] dark:text-[#A8A297] leading-relaxed">
            Effective Date: October 20, 2026 • Scope: All Collectors, Master Artisans, and Visitors
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            1. Introduction &amp; Lawful Grounds for Processing
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            ARTSINLY is committed to safeguarding the privacy and digital dignity of our patrons and artisan partners. This policy is formulated in strict compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>.
          </p>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            We process digital personal data solely on legitimate grounds including: explicit consent provided by you, execution and fulfillment of craft purchase contracts, statutory tax reporting (Section 194-O TDS), and regulatory compliance with the Reserve Bank of India (RBI) payment guidelines.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            2. Personal Data We Collect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5]">
            <div className="p-4 rounded-md bg-[#F4F1EB] dark:bg-[#1A1916] border border-[#E5E0D6] dark:border-[#2D2A25]">
              <h3 className="font-semibold text-sm text-[#1E1E1C] dark:text-white mb-2">For Collectors / Buyers</h3>
              <ul className="list-disc pl-4 space-y-1">
                <li>Full Name &amp; Contact Email</li>
                <li>Delivery Address &amp; Contact Number</li>
                <li>Payment transaction tokens (we do not store full card details or UPI PINs)</li>
                <li>Order history &amp; craft preferences</li>
              </ul>
            </div>
            <div className="p-4 rounded-md bg-[#F4F1EB] dark:bg-[#1A1916] border border-[#E5E0D6] dark:border-[#2D2A25]">
              <h3 className="font-semibold text-sm text-[#1E1E1C] dark:text-white mb-2">For Master Artisans / Sellers</h3>
              <ul className="list-disc pl-4 space-y-1">
                <li>Artisan Name, Studio / Shop details &amp; Bio</li>
                <li>Settlement Bank Account Number &amp; IFSC Code</li>
                <li>Permanent Account Number (PAN) for statutory TDS</li>
                <li>GSTIN or composition exemption declaration</li>
                <li>Geographical Indication (GI) certification documents</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            3. Zero Sale of Personal Data
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            ARTSINLY operates on strict fair-trade ethics. <strong>We never sell, rent, monetize, or trade your personal data to third-party advertisers or data brokers.</strong> Your delivery details are shared strictly with certified logistics couriers (e.g. Blue Dart, Delhivery, India Post) solely for physical order delivery.
          </p>
        </section>

        {/* Section 4: Data Principal Rights */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            4. Your Rights as a Data Principal under the DPDP Act
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            As a Data Principal under Indian law, you possess the statutory right to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5]">
            <li><strong>Right to Access:</strong> Request a summary of personal data held about you and processing activities undertaken.</li>
            <li><strong>Right to Correction &amp; Erasure:</strong> Request the correction of inaccurate or misleading data, and deletion of data when no longer legally required.</li>
            <li><strong>Right of Grievance Redressal:</strong> Submit a complaint regarding data processing to our Data Protection Officer with response guaranteed within 30 days.</li>
            <li><strong>Right to Nominate:</strong> Nominate an individual to exercise your data rights in the event of incapacity or death.</li>
          </ul>
        </section>

        {/* Section 5: Security & DPO */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            5. Data Protection Officer (DPO) Contact
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            For inquiries regarding personal data processing or to exercise any of your rights as a Data Principal, please contact our designated Data Protection Officer:
          </p>
          <div className="p-5 rounded-lg bg-[#EFECE6] dark:bg-[#1E1C18] border border-[#DDD8CE] dark:border-[#33302A] text-xs space-y-1.5">
            <p className="font-semibold text-sm text-[#1E1E1C] dark:text-white">Data Protection Officer — ARTSINLY</p>
            <p>Email: <a href="mailto:privacy@artsinly.com" className="text-[#C2410C] underline">privacy@artsinly.com</a></p>
            <p>Physical Address: Legal &amp; Compliance Cell, ARTSINLY CRAFT PAVILION, Connaught Place, New Delhi 110001, India</p>
            <p>Grievances Portal: <Link href="/grievance" className="text-[#C2410C] underline">File a formal Data Grievance online</Link></p>
          </div>
        </section>
      </div>
    </div>
  );
}
