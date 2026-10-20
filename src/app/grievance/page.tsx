"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldAlert, CheckCircle2, Clock, Mail, Phone, MapPin } from "lucide-react";

export default function GrievancePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    orderNumber: "",
    category: "DELIVERY_DAMAGE",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [ticketResult, setTicketResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setTicketResult(null);

    try {
      const res = await fetch("/api/grievance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register grievance");
      }

      setTicketResult(data);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] dark:bg-[#121110] text-[#20201D] dark:text-[#E8E4DC] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="border-b border-[#EAE5DD] dark:border-[#2D2A25] pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#C2410C] uppercase tracking-wider mb-2">
            <span>Statutory Nodal Office</span>
            <span>•</span>
            <span>Rule 5(9) Consumer Protection E-Commerce Rules, 2020</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1E1E1C] dark:text-white font-normal mb-3">
            Consumer Grievance Redressal Portal
          </h1>
          <p className="text-sm text-[#6E6A62] dark:text-[#A8A297] leading-relaxed">
            In compliance with the Consumer Protection Act, 2019 and the Digital Personal Data Protection Act, 2023, ARTSINLY maintains a designated Grievance Redressal mechanism with statutory turnaround times.
          </p>
        </div>

        {/* Nodal Officer Contact Card */}
        <div className="p-6 rounded-xl bg-[#EDE9E2] dark:bg-[#1E1C18] border border-[#DDD8CE] dark:border-[#33302A]">
          <h2 className="font-serif text-xl text-[#1E1E1C] dark:text-white mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#C2410C]" />
            <span>Designated Statutory Officers</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-[#C2410C] uppercase tracking-wider block">
                Nodal Grievance Officer
              </span>
              <p className="font-semibold text-[#1E1E1C] dark:text-white text-base">
                Siddharth K. Maharana
              </p>
              <p className="text-[#6E6A62] dark:text-[#A8A297]">
                Head of Legal, Regulatory Affairs &amp; Intermediary Compliance
              </p>
              <div className="pt-2 space-y-1.5 text-xs text-[#4A4742] dark:text-[#C5BFB5]">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#89714F]" />
                  <a href="mailto:grievance@artsinly.com" className="hover:underline">grievance@artsinly.com</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#89714F]" />
                  <span>+91 11 4987 6543 (Mon–Sat, 10:00 AM – 6:00 PM IST)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-[#52644B] uppercase tracking-wider block">
                Physical Office &amp; Jurisdiction
              </span>
              <p className="font-semibold text-[#1E1E1C] dark:text-white text-base">
                Registered Corporate Cell
              </p>
              <div className="flex items-start gap-2 text-xs text-[#4A4742] dark:text-[#C5BFB5]">
                <MapPin className="w-4 h-4 text-[#89714F] shrink-0 mt-0.5" />
                <address className="not-italic leading-relaxed">
                  ARTSINLY CRAFT PAVILION PVT. LTD.<br />
                  Level 4, Statesman House, Barakhamba Road,<br />
                  Connaught Place, New Delhi 110001, India
                </address>
              </div>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-[#7A756D] dark:text-[#A8A297]">
                <Clock className="w-3.5 h-3.5 text-[#89714F]" />
                <span>Statutory Acknowledgement: <strong>within 48 Hours</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Grievance Filing Form */}
        <div className="p-6 sm:p-8 rounded-xl bg-white dark:bg-[#181714] border border-[#EAE5DD] dark:border-[#2D2A25] shadow-xs">
          <h2 className="font-serif text-2xl text-[#1E1E1C] dark:text-white mb-2">
            Register a Formal Consumer Grievance
          </h2>
          <p className="text-xs text-[#6E6A62] dark:text-[#A8A297] mb-6">
            Upon submitting this form, you will receive a verifiable statutory ticket number with guaranteed escalation to the Nodal Grievance Officer.
          </p>

          {ticketResult ? (
            <div className="p-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-semibold text-emerald-900 dark:text-emerald-200">
                  Grievance Registered Successfully
                </h3>
              </div>
              <div className="p-4 rounded-md bg-white dark:bg-[#121110] border border-emerald-200 dark:border-emerald-900 text-xs sm:text-sm space-y-2">
                <p>
                  <strong>Statutory Ticket Reference:</strong>{" "}
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold text-base">
                    {ticketResult.ticketId}
                  </span>
                </p>
                <p className="text-[#4A4742] dark:text-[#C5BFB5] leading-relaxed">
                  {ticketResult.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTicketResult(null);
                  setFormData({
                    fullName: "",
                    email: "",
                    phone: "",
                    orderNumber: "",
                    category: "DELIVERY_DAMAGE",
                    description: "",
                  });
                }}
                className="text-xs font-semibold text-[#1E1E1C] dark:text-white underline"
              >
                File another grievance ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              {errorMessage && (
                <div className="p-3 rounded-md bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-xs border border-rose-200 dark:border-rose-800">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-medium text-[#403E39] dark:text-[#D5CFC5] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Radhika Sen"
                    className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-[#1E1C18] border border-[#DDD7CE] dark:border-[#38342E] rounded-md text-xs focus:ring-1 focus:ring-[#C2410C] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-[#403E39] dark:text-[#D5CFC5] mb-1">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. collector@domain.com"
                    className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-[#1E1C18] border border-[#DDD7CE] dark:border-[#38342E] rounded-md text-xs focus:ring-1 focus:ring-[#C2410C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-[#403E39] dark:text-[#D5CFC5] mb-1">
                    Contact Phone (Optional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-[#1E1C18] border border-[#DDD7CE] dark:border-[#38342E] rounded-md text-xs focus:ring-1 focus:ring-[#C2410C] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="orderNumber" className="block text-xs font-medium text-[#403E39] dark:text-[#D5CFC5] mb-1">
                    Order Number (If applicable)
                  </label>
                  <input
                    id="orderNumber"
                    type="text"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    placeholder="e.g. ORD-1729000-XYZ"
                    className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-[#1E1C18] border border-[#DDD7CE] dark:border-[#38342E] rounded-md text-xs focus:ring-1 focus:ring-[#C2410C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-xs font-medium text-[#403E39] dark:text-[#D5CFC5] mb-1">
                  Grievance Category *
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-[#1E1C18] border border-[#DDD7CE] dark:border-[#38342E] rounded-md text-xs focus:ring-1 focus:ring-[#C2410C] focus:outline-none"
                >
                  <option value="DELIVERY_DAMAGE">Transit Damage / Broken Piece Delivered</option>
                  <option value="DEFECT_OR_MISMATCH">Material Mismatch / Catalog Description Deviation</option>
                  <option value="REFUND_DELAY">Refund Settlement Delayed Beyond 7 Days</option>
                  <option value="AUTHENTICITY_QUESTION">Provenance / GI Certification Invalidation</option>
                  <option value="DATA_PRIVACY">Digital Personal Data Protection (DPDP) Inquiry</option>
                  <option value="OTHER_DISPUTE">Other Consumer Intermediary Dispute</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-xs font-medium text-[#403E39] dark:text-[#D5CFC5] mb-1">
                  Detailed Description of Grievance *
                </label>
                <textarea
                  id="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Please state the specific dates, unboxing observations, piece details, and requested resolution..."
                  className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-[#1E1C18] border border-[#DDD7CE] dark:border-[#38342E] rounded-md text-xs focus:ring-1 focus:ring-[#C2410C] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-md bg-[#1E1E1C] hover:bg-[#383734] text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Registering Grievance..." : "Submit Formal Grievance to Nodal Officer"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Statutory SLAs */}
        <div className="border-t border-[#EAE5DD] dark:border-[#2D2A25] pt-6 text-xs text-[#7A756D] dark:text-[#A8A297] space-y-2">
          <h3 className="font-semibold text-sm text-[#1E1E1C] dark:text-white">
            Statutory Escalation &amp; National Consumer Helpline (NCH)
          </h3>
          <p className="leading-relaxed">
            In the event that your grievance is not acknowledged within 48 hours or resolved within 30 days by our Nodal Officer, you may escalate the matter directly to the National Consumer Helpline (Department of Consumer Affairs, Government of India) at Toll-Free 1915 or online at consumerhelpline.gov.in.
          </p>
        </div>
      </div>
    </div>
  );
}
