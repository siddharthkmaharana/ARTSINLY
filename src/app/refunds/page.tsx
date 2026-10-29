import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns, Replacements & Refund Policy",
  description:
    "Statutory consumer return rights, damaged item replacement guarantees, and fair-trade refund timelines compliant with Indian Consumer Protection Rules.",
  alternates: {
    canonical: "/refunds",
  },
};

export default function RefundsPage() {
  return (
    <div className="bg-[#FAF8F5] dark:bg-[#121110] text-[#20201D] dark:text-[#E8E4DC] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="border-b border-[#EAE5DD] dark:border-[#2D2A25] pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#C2410C] uppercase tracking-wider mb-2">
            <span>Consumer Protection Compliance</span>
            <span>•</span>
            <span>E-Commerce Rules, 2020 (India)</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1E1E1C] dark:text-white font-normal mb-3">
            Returns, Replacements &amp; Fair-Trade Refund Policy
          </h1>
          <p className="text-sm text-[#6E6A62] dark:text-[#A8A297] leading-relaxed">
            Statutory disclosure under Rule 5(3)(e) of the Consumer Protection (E-Commerce) Rules, 2020.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            1. 7-Day Fair-Trade Return Window
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            ARTSINLY guarantees a <strong>7-day return and replacement window</strong> from the date of confirmed delivery. You are fully entitled to initiate a return or replacement if:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5]">
            <li>The item was received in a physically damaged or broken condition during transit.</li>
            <li>The piece delivered is materially different from the photograph or technical description in the catalogue.</li>
            <li>A wrong variant or incorrect craft discipline was mistakenly dispatched.</li>
            <li>The piece exhibits structural manufacturing defects not attributable to natural handcrafted characteristics.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            2. Handcrafted Distinction vs. Physical Defects
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            Because our catalog consists solely of non-industrial, sovereign artisan masterpieces, authentic organic characteristics—such as natural terracotta kiln fire marks, vegetable dye color nuances, or hand-chiseled wood grain deviations—are not considered defects. Returns based purely on organic handcrafted uniqueness will be reviewed with our curatorial team to preserve fair livelihood protections for master makers.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            3. Reverse Pickup &amp; Safe Repackaging
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            When a return is approved for damaged or incorrect goods:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5]">
            <li><strong>Complimentary Reverse Pickup:</strong> Our logistics partner will pick up the package directly from your delivery address at no reverse shipping charge to you.</li>
            <li><strong>Original Condition:</strong> The piece must be placed back in its original archival padding and protective packaging to prevent secondary transit fracture.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            4. Statutory Refund Settlement Timelines
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            Once the returned piece is received and inspected at our pavilion warehouse or cluster studio:
          </p>
          <div className="p-4 rounded-md bg-[#F4F1EB] dark:bg-[#1A1916] border border-[#E5E0D6] dark:border-[#2D2A25] space-y-2 text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5]">
            <p><strong>Timeline:</strong> Refunds are initiated within <strong>24 to 48 hours</strong> of physical inspection approval.</p>
            <p><strong>Credit Destination:</strong> Remitted directly back to the original source account (UPI account, Credit/Debit Card, or Net Banking) via our RBI-authorized payment gateway partner.</p>
            <p><strong>Bank Posting:</strong> Typically reflects in your bank statement within <strong>5 to 7 business days</strong> as per standard banking settlement cycles.</p>
          </div>
        </section>

        {/* Section 5: How to Initiate */}
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white">
            5. How to Initiate a Return or Replacement
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
            To register a return request, please email <a href="mailto:returns@artsinly.com" className="text-[#C2410C] underline font-medium">returns@artsinly.com</a> with your order number and clear unboxing photographs, or submit a formal ticket through our <Link href="/grievance" className="text-[#C2410C] underline font-medium">Statutory Grievance Redressal Portal</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
