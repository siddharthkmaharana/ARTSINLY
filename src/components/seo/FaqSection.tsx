"use client";

import React, { useState } from "react";
import { ChevronDown, ShieldCheck, HelpCircle } from "lucide-react";
import { FaqJsonLd, FaqItem } from "@/components/seo/JsonLd";

export const CRAFT_FAQS: FaqItem[] = [
  {
    question: "How does ARTSINLY guarantee authentic Geographical Indication (GI) provenance?",
    answer:
      "Every piece on ARTSINLY is created by verified generational master artisans registered with their regional craft council. Master makers apply verified GI tags (such as Kutch Terracotta GI-IN-GJ-449 or Nathdwara Pichwai GI-IN-RJ-102) accompanied by individual artisan signature seals and workshop origin documentation.",
  },
  {
    question: "What is the 84% Direct Remittance model for master artisans?",
    answer:
      "Unlike traditional middlemen and craft exporters who absorb 60%–80% of retail margins, ARTSINLY disburses 84% of every purchase directly to the artisan's registered bank account within T+2 days of dispatch, while adhering to statutory 1% Section 194-O TDS.",
  },
  {
    question: "How are fragile terracotta pottery, bronze sculptures, and textiles packaged for transit?",
    answer:
      "We utilize museum-grade packaging: double-walled corrugated outer crates, shock-absorbing natural honeycomb paper cushioning, moisture-sealed barrier wraps, and edge-corner armor tested for domestic PAN-India road and air transit.",
  },
  {
    question: "Can collectors commission bespoke or made-to-order crafts directly from artisans?",
    answer:
      "Yes. Many guild masters offer made-to-order architectural commissions, custom dimensions for Pichwai paintings, and personalized pottery firing. Inquire directly on product pages with estimated lead times between 7 to 21 days.",
  },
  {
    question: "What is ARTSINLY's returns and replacement policy for handmade crafts?",
    answer:
      "Under our Fair Trade Consumer Protection warranty, collectors have 7 days upon delivery to report any transit damage or authentication concern. Because each piece is handmade and irreplaceable, we provide immediate free replacements or full refunds if a replacement cannot be crafted.",
  },
];

interface FaqSectionProps {
  title?: string;
  subtitle?: string;
  items?: FaqItem[];
  className?: string;
}

export function FaqSection({
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about GI heritage authenticity, master artisan payouts, and museum-grade craft shipping.",
  items = CRAFT_FAQS,
  className = "",
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      aria-label="Frequently Asked Questions"
      className={`py-12 sm:py-16 ${className}`}
    >
      <FaqJsonLd items={items} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE4D9] text-[#7A756D] text-[11px] font-semibold tracking-wider uppercase mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#C2410C]" />
            <span>Curatorial Transparency</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1E1E1C] dark:text-white tracking-tight mb-3">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6A62] dark:text-[#A8A297] leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-[#E5DFD5] dark:border-[#2D2A25] rounded-xl bg-white/70 dark:bg-[#1A1917]/70 backdrop-blur-xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between text-left p-4 sm:p-5 text-sm sm:text-base font-serif font-medium text-[#1E1E1C] dark:text-white hover:text-[#C2410C] dark:hover:text-[#E06D44] transition-colors gap-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#F4EFE6] dark:bg-[#2A2723] text-[#8C877E] flex items-center justify-center text-[11px] font-sans shrink-0 font-normal">
                      {index + 1}
                    </span>
                    <span>{item.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8C877E] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#C2410C]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5C5850] dark:text-[#B5B0A4] leading-relaxed font-light border-t border-[#F0EBE1] dark:border-[#272420]">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center text-xs text-[#8C877E] dark:text-[#9A958A] flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#52644B]" />
          <span>Statutory compliance with Consumer Protection (E-Commerce) Rules, 2020</span>
        </div>
      </div>
    </section>
  );
}
