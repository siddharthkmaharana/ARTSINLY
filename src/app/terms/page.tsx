import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service & Pavilion Intermediary Agreement",
  description:
    "Statutory terms governing collector purchases, artisan marketplace transactions, GI heritage authenticity, and intermediary responsibilities under Indian Law.",
};

export default function TermsPage() {
  return (
    <div className="bg-[#FAF8F5] dark:bg-[#121110] text-[#20201D] dark:text-[#E8E4DC] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header Banner */}
        <div className="border-b border-[#EAE5DD] dark:border-[#2D2A25] pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#C2410C] uppercase tracking-wider mb-2">
            <span>Statutory Compliance</span>
            <span>•</span>
            <span>IT Act 2000 &amp; Consumer Protection 2020</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1E1E1C] dark:text-white font-normal mb-3">
            Terms of Service &amp; Intermediary Agreement
          </h1>
          <p className="text-sm text-[#6E6A62] dark:text-[#A8A297] leading-relaxed">
            Effective Date: October 20, 2026 • Registered Entity: ARTSINLY CRAFT PAVILION PVT. LTD. (New Delhi, India)
          </p>
        </div>

        {/* Section 1: Preamble & Nature of Platform */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            1. Preamble and Intermediary Status
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            Welcome to <strong>ARTSINLY</strong>. These Terms of Service constitute a legally binding electronic agreement under the <strong>Information Technology Act, 2000</strong>, the rules made thereunder, and the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>.
          </p>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            ARTSINLY operates as a specialized, fair-trade electronic intermediary connecting certified master artisans, craft guilds, and self-help collectives across India directly with contemporary collectors. Except where explicitly noted, contract of sale for any handcrafted masterpiece is executed directly between the purchasing collector and the verified artisan seller.
          </p>
        </section>

        {/* Section 2: Authenticity & GI Ledger */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            2. Authenticity, Heritage Warranty &amp; Geographical Indications (GI)
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            Every product catalogued on ARTSINLY undergoes verified curatorial screening. Sellers representing products under <strong>Geographical Indications of Goods (Registration and Protection) Act, 1999</strong> (such as Kutch Rogan Art, Jaipur Blue Pottery, Madhubani Art, or Dhokra Bell Metal) warrant that:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5]">
            <li>The item is handcrafted using traditional materials and techniques native to the declared geographic cluster.</li>
            <li>No industrial mass-production or machine-cast counterfeit processes have been substituted for generational artisanship.</li>
            <li>The seller is either an authorized user or direct master practitioner hailing from the registered craft community.</li>
          </ul>
        </section>

        {/* Section 3: Pricing, Currency & Taxes */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            3. Pricing, Payments, Currency &amp; Indian Tax Compliance
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            All prices displayed on ARTSINLY are in <strong>Indian Rupees (INR)</strong> and include applicable Goods and Services Tax (GST) unless indicated otherwise at checkout. All payments are securely collected via RBI-regulated payment aggregators into scheduled commercial bank escrow/nodal accounts in compliance with RBI guidelines on Payment Aggregators and Payment Gateways (PAPG).
          </p>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            In compliance with <strong>Section 194-O of the Income Tax Act, 1961</strong>, ARTSINLY deducts 1% Tax Deducted at Source (TDS) on the gross amount of sales facilitated through the digital pavilion, crediting the same against the artisan&apos;s Permanent Account Number (PAN).
          </p>
        </section>

        {/* Section 4: Handcrafted Variance */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            4. Handcrafted Nature &amp; Natural Tolerances
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            Because each item is shaped individually by hand, minor natural variations in dye saturation, wood grain, clay texture, mineral slip firing, and dimensions are inherent hallmarks of sovereign human craftsmanship rather than industrial flaws. Such organic characteristics are celebrated and do not constitute defects.
          </p>
        </section>

        {/* Section 5: Limitation of Liability & Disputes */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            5. Governing Law &amp; Jurisdiction
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            These terms are governed by and construed in accordance with the substantive laws of the Republic of India. In the event of any legal proceeding or dispute that cannot be resolved amicably through our statutory <Link href="/grievance" className="text-[#C2410C] underline">Grievance Redressal Mechanism</Link>, the competent courts of New Delhi, India shall retain exclusive territorial jurisdiction.
          </p>
        </section>

        {/* Section 6: Contact & Nodal Officer */}
        <div className="mt-12 p-6 rounded-lg bg-[#EFECE6] dark:bg-[#1E1C18] border border-[#DDD8CE] dark:border-[#33302A] text-xs space-y-2">
          <h3 className="font-semibold text-sm text-[#1E1E1C] dark:text-white">Statutory Contact Office</h3>
          <p>ARTSINLY CRAFT PAVILION PVT. LTD.</p>
          <p>Barakhamba Road, Connaught Place, New Delhi 110001, India</p>
          <p>Email: legal@artsinly.com • Grievance Officer: grievance@artsinly.com</p>
        </div>
      </div>
    </div>
  );
}
