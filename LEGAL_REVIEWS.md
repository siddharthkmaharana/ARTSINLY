# ARTSINLY — Legal & Regulatory Compliance Review

**Effective Date:** October 20, 2026  
**Operating Entity:** ARTSINLY CRAFT PAVILION PRIVATE LIMITED  
**Registered Office:** Level 4, Statesman House, Barakhamba Road, Connaught Place, New Delhi 110001, India  
**Jurisdiction:** Republic of India  

---

## Executive Summary

ARTSINLY operates as a sovereign digital pavilion and fair-trade electronic intermediary connecting certified Indian generational master artisans with contemporary global and domestic collectors. 

This document constitutes the formal **Operational Legal Review and Statutory Compliance Audit**, evaluating platform architecture, seller onboarding, consumer disclosures, and payment settlement mechanisms against Indian statutes governing electronic commerce, financial transactions, data privacy, and heritage intellectual property.

---

## 1. Consumer Protection (E-Commerce) Rules, 2020 Compliance Audit

*Enacted under the Consumer Protection Act, 2019 (Act No. 35 of 2019).*

| Requirement | Statutory Rule | Platform Implementation | Status |
| :--- | :--- | :--- | :--- |
| **Legal Entity Disclosure** | Rule 5(1) | Legal entity name, registered office address, and contact email publicly disclosed in footer and Terms of Service (`/terms`). | **COMPLIANT** |
| **Grievance Redressal Officer** | Rule 5(9) | Appointed Nodal Grievance Officer: **Siddharth K. Maharana**, Head of Legal & Regulatory Affairs (`grievance@artsinly.com`, +91 11 4987 6543). Dedicated portal at `/grievance`. | **COMPLIANT** |
| **Grievance Turnaround SLA** | Rule 5(9) | Statutory acknowledgement generated within 48 hours with automated ticket ID (`GRV-YYYYMMDD-XXXX`). Mandatory resolution window of 30 days enforced via audit logging. | **COMPLIANT** |
| **Returns & Refund Policy** | Rule 5(3)(e) | 7-day fair-trade return window for damaged, defective, or misdescribed crafts published at `/refunds`. Direct credit to original payment source within 5–7 business days. | **COMPLIANT** |
| **Country of Origin Declaration** | Rule 6(5) | All products catalogued on ARTSINLY explicitly state "India" along with regional provenance cluster (e.g. Kutch, Rajasthan, Bastar, Bengal). | **COMPLIANT** |
| **No Unilateral Cancellation Fee** | Rule 5(3)(b) | No cancellation charges imposed on consumers for cancellations initiated before cluster courier dispatch. | **COMPLIANT** |
| **Price Transparency** | Rule 5(3)(a) | Displayed prices in Indian Rupees (INR) inclusive of Goods & Services Tax (GST) with itemized shipping fees at checkout. | **COMPLIANT** |

---

## 2. Reserve Bank of India (RBI) Payment Aggregator (PAPG) & Escrow Guidelines

*Ref: RBI/DPSS/2019-20/174 DPSS.CO.PD.No.1810/02.14.008/2019-20.*

### 2.1 Nodal / Escrow Account Operation
* **Mechanism:** All consumer payments (via UPI, Debit/Credit Card, Net Banking) are held securely in an RBI-compliant Scheduled Commercial Bank Escrow Account.
* **Release Condition:** Buyer funds are held in escrow until order delivery is verified via courier Air Waybill (AWB) API and the initial 7-day return cooling period elapses.
* **Settlement Timeline:** Payouts to artisan seller bank accounts operate on a strict **T+2 business day cycle** following delivery confirmation.

### 2.2 Payment Gateway Merchant Categorization (MCC)
* **Merchant Category Code:** **MCC 5971 / 5970** (*Art Dealers, Commercial Galleries, and Cultural Handicrafts*).
* **Pre-Flight Production Guardrails:** Live payment processing is programmatically locked (`canProcessLivePayments: false`) until corporate KYB, commercial PAN, GSTIN certificate, and nodal bank mapping are formally approved by the payment aggregator partner (Razorpay / Cashfree / Stripe India).

### 2.3 Webhook Idempotency & Cryptographic Signature Verification
* **Cryptographic Integrity:** Webhook payloads received at `/api/payments/webhook` are validated using HMAC SHA-256 signatures with timing-safe comparison (`crypto.timingSafeEqual`).
* **Idempotent Processing:** Every webhook event ID (`eventId`) is deduplicated against the `AuditLog` table, preventing double-crediting or duplicate status mutations.

---

## 3. Tax Compliance & Income Tax Act (Section 194-O) Review

*Ref: Section 194-O of the Income Tax Act, 1961 (Payment of certain sums by e-commerce operator to e-commerce participant).*

### 3.1 TDS on E-Commerce Sales
* **Statutory Rate:** **1% Tax Deducted at Source (TDS)** is computed on the gross sale amount of goods facilitated through the digital pavilion.
* **PAN Mapping:** Artisans must provide a validated Permanent Account Number (PAN) during studio onboarding (`/api/seller/payout-account`). TDS deductions are remitted quarterly under Section 194-O using Form 26Q and reflected in the artisan's Form 26AS.
* **Economics Example:**
  * Gross Collector Price: **₹1,000.00**
  * Marketplace Platform Fee (15%): **₹150.00**
  * Section 194-O TDS (1%): **₹10.00**
  * Net Artisan Remittance (84%): **₹840.00**

### 3.2 Goods and Services Tax (GST) & Micro-Artisan Exemption
* In accordance with **Notification No. 56/2018 - Central Tax** and **Notification No. 34/2023 - Central Tax**, individual handicraft artisans with annual aggregate turnover not exceeding ₹20 Lakhs (or ₹40 Lakhs for goods) are eligible for exemption from mandatory GST registration when supplying through e-commerce operators, provided they possess a valid PAN and furnish a self-declaration.
* ARTSINLY's onboarding flow captures this declaration under the `taxExemptionDeclared` audit ledger.

---

## 4. Digital Personal Data Protection Act (DPDP Act), 2023 Compliance Review

*Enacted under Act No. 22 of 2023.*

| DPDP Principle | Statutory Mandate | Platform Implementation |
| :--- | :--- | :--- |
| **Notice & Consent** | Section 5 & 6 | Clear, accessible notice provided at checkout and registration in plain English. Policy published at `/privacy`. |
| **Purpose Limitation** | Section 4 | Data collected (delivery address, name, phone) is used strictly for physical logistics delivery and tax receipts. |
| **Data Principal Rights** | Sections 11–14 | Patrons and artisans can request access, correction, or erasure of personal data by contacting `privacy@artsinly.com` or via `/grievance`. |
| **Zero Monetization** | Ethical Charter | Strict prohibition against selling, renting, or trading customer data to external ad networks. |
| **Security Safeguards** | Section 8(5) | Passwords hashed using bcrypt; bank account numbers masked (`•••• •••• 8912`); API routes rate-limited with security headers (`nosniff`, `SAMEORIGIN`). |

---

## 5. Information Technology Act, 2000 & Intermediary Guidelines, 2021

*Ref: Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.*

* **Intermediary Status:** ARTSINLY qualifies as an "Intermediary" under Section 2(1)(w) of the Information Technology Act, 2000 and is entitled to safe harbor protections under **Section 79** of the Act.
* **Prohibited Content & Counterfeiting:** Terms of Service (`/terms`) and Seller Policy (`/seller-policy`) explicitly prohibit the listing of counterfeit items, stolen cultural artifacts, machine-cast replicas, or antiquities restricted under the *Antiquities and Art Treasures Act, 1972*.
* **Takedown Mechanism:** A designated mechanism is provided for intellectual property owners and authorized GI guilds to submit infringement notices to `legal@artsinly.com` for takedown within 36 hours.

---

## 6. Geographical Indications (GI) of Goods Act, 1999 Review

*Enacted under Act No. 48 of 1999.*

* **Authenticity Warranty:** Master artisans claiming Geographical Indication pedigree (e.g., Kutch Terracotta, Pichwai Paintings, Dhokra Brass, Blue Pottery of Jaipur, Kashmiri Pashmina) must provide evidence of authorized user status or lineage certification.
* **Misrepresentation Safeguards:** Listings falsely misrepresenting machine-made wares as GI-certified are flagged, quarantined, and archived by administrative moderators with an immutable record entered into the `AuditLog`.

---

## 7. Operational Readiness Checklist

- [x] **Statutory Terms of Service published:** [`/terms`](file:///c:/Users/sidsm/PROJECTS/ARTSINLY/src/app/terms/page.tsx)
- [x] **DPDP Act 2023 Privacy Policy published:** [`/privacy`](file:///c:/Users/sidsm/PROJECTS/ARTSINLY/src/app/privacy/page.tsx)
- [x] **Consumer Protection Returns & Refund Policy published:** [`/refunds`](file:///c:/Users/sidsm/PROJECTS/ARTSINLY/src/app/refunds/page.tsx)
- [x] **Shipping & Packaging Policy published:** [`/shipping`](file:///c:/Users/sidsm/PROJECTS/ARTSINLY/src/app/shipping/page.tsx)
- [x] **Artisan Seller Agreement (84% fair remittance) published:** [`/seller-policy`](file:///c:/Users/sidsm/PROJECTS/ARTSINLY/src/app/seller-policy/page.tsx)
- [x] **Nodal Grievance Redressal Portal & API active:** [`/grievance`](file:///c:/Users/sidsm/PROJECTS/ARTSINLY/src/app/grievance/page.tsx) & [`/api/grievance`](file:///c:/Users/sidsm/PROJECTS/ARTSINLY/src/app/api/grievance/route.ts)
- [x] **Payment Provider Onboarding & Compliance Engine active:** [`src/lib/payments/provider.ts`](file:///c:/Users/sidsm/PROJECTS/ARTSINLY/src/lib/payments/provider.ts)
- [x] **Seller Bank Onboarding & Payouts Engine active:** [`src/lib/payments/onboarding.ts`](file:///c:/Users/sidsm/PROJECTS/ARTSINLY/src/lib/payments/onboarding.ts)
- [x] **Idempotent Webhook Listener with HMAC SHA-256 active:** [`src/app/api/payments/webhook/route.ts`](file:///c:/Users/sidsm/PROJECTS/ARTSINLY/src/app/api/payments/webhook/route.ts)
- [x] **Admin Payment Gateway & Escrow Ledger active:** [`src/app/admin/page.tsx`](file:///c:/Users/sidsm/PROJECTS/ARTSINLY/src/app/admin/page.tsx)
- [x] **Artisan Studio Bank Setup active:** [`src/app/seller/dashboard/page.tsx`](file:///c:/Users/sidsm/PROJECTS/ARTSINLY/src/app/seller/dashboard/page.tsx)

---
*Signed and sealed by the Legal & Compliance Cell, ARTSINLY CRAFT PAVILION PVT. LTD.*
