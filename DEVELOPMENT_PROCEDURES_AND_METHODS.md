# ARTSINLY — Architecture, Development Procedures & Methods Guide

> **Official Standard Operating Manual & Living Development Guide**  
> *Last Updated: October 31, 2026*  
> *Applies to: All future page creations, product additions, refactoring, and feature enhancements.*

---

## 1. Executive Summary & Core Philosophy

**ARTSINLY** is a high-luxury, direct-from-artisan digital marketplace dedicated to preserving and celebrating certified Indian regional handicrafts, terracotta pottery, traditional metalwork, handlooms, and indigenous folk arts.

The platform is built upon four fundamental cornerstones:
1. **Uncompromising Aesthetic & Cultural Authenticity**: Presenting authentic, local, handmade Indian crafts with real human artisan lineages, Geographical Indication (GI) provenance, and museum-grade visual standards.
2. **Strict Architectural & SEO Invariants**: Single `<h1>` per page, JSON-LD Schema (Breadcrumbs, FAQ, Product, Artisan), WebP asset optimization, zero Cumulative Layout Shift (CLS), and sub-2-second page loads.
3. **Zero-Float Minor Unit Monetary Protocol**: Zero tolerance for floating-point arithmetic; every financial transaction is strictly computed in integer paise minor units (`pricePaise`, `basePricePaise`).
4. **Transparent Multi-Vendor Sovereign Economics**: Strict multi-vendor parcel fulfillment, 84% artisan net remittance, 15% marketplace commission, 1% statutory Section 194-O TDS deduction, and CPA 2020 consumer protection compliance.

Whenever you build, modify, or extend any part of ARTSINLY, **you must strictly consult and follow the procedures and methods detailed in this document**.

---

## 2. Technology Stack & Project Structure

- **Framework**: Next.js 16 (App Router)
- **Runtime**: Node.js 20+ with React 19
- **Type Safety**: TypeScript 5.x (Strict Mode)
- **Styling**: Tailwind CSS + Custom High-Luxury Serif & Sans Design Tokens
- **Database**: PostgreSQL with Prisma ORM + In-Memory Resilient Mock Fallback
- **Structured Data**: Schema.org JSON-LD (Product, BreadcrumbList, FAQPage, Organization, Person)
- **Icons**: Lucide React

### Directory Topology
```
ARTSINLY/
├── DEVELOPMENT_PROCEDURES_AND_METHODS.md  <-- THIS MASTER GUIDE
├── package.json                           <-- Dependencies & build scripts
├── prisma/
│   └── schema.prisma                      <-- Schema definitions (Int paise, non-guessable IDs)
├── public/                                <-- Static assets, favicon, robots.txt, icons
├── scripts/                               <-- 5 Automated Verification Test Suites
│   ├── test_system_suite.js               <-- Health, telemetry, sitemap, security headers
│   ├── test_database_rules.js             <-- UUIDs, integer money, order immutability
│   ├── test_multivendor_checkout_and_payments.js <-- Parcel segregation, checkout, TDS
│   ├── test_seller_product_management.js  <-- Seller CRUD, authorization, workflows
│   └── test_payments_and_legal.js         <-- Gateway onboarding, CPA 2020 grievance
└── src/
    ├── app/                               <-- Next.js 16 App Router pages & API routes
    │   ├── page.tsx                       <-- Homepage (Living Terroirs gallery & ateliers)
    │   ├── catalog/                       <-- Advanced catalog browser
    │   ├── products/[slug]/               <-- Dynamic product showcase & purchase flows
    │   ├── artisans/[slug]/               <-- Master artisan profiles & living stories
    │   ├── checkout/                      <-- Multi-vendor checkout flow
    │   ├── seller/dashboard/              <-- Artisan management studio
    │   ├── sitemap.ts                     <-- Dynamic XML sitemap generator
    │   ├── robots.ts                      <-- Search engine crawling directives
    │   └── api/                           <-- Next.js Serverless API Route Handlers
    ├── components/
    │   ├── layout/                        <-- Header, Footer, Navigation
    │   ├── catalog/                       <-- CatalogView (live search, craft/region filters)
    │   ├── products/                      <-- ProductCard, Gallery, Specification grids
    │   ├── seo/                           <-- FaqSection, JsonLd scripts
    │   └── ui/                            <-- Breadcrumbs, Modals, Image uploaders
    ├── lib/
    │   ├── auth.ts                        <-- JWT authentication & session resolution
    │   ├── id.ts                          <-- Cryptographic non-guessable ID engine
    │   ├── money.ts                       <-- Integer paise minor unit currency math
    │   ├── mock-data.ts                   <-- Curated master catalog, artisans, regions
    │   ├── prisma.ts                      <-- Singleton Prisma database client
    │   ├── db/                            <-- Database access layer (products, sellers, audit)
    │   ├── monitoring/logger.ts           <-- Structured telemetry & metric logger
    │   └── seo/schema.ts                  <-- Schema.org JSON-LD generators
    └── types/
        └── index.ts                       <-- Shared TypeScript interfaces and domain contracts
```

---

## 3. Strict Architectural Invariants & Rules

Every page, component, and API endpoint must satisfy these 9 mandatory rules.

### Rule 1: Strictly Single `<h1>` per Page
- Every route in `src/app/` must have **exactly one `<h1>` element**.
- The `<h1>` must contain the primary page title and relevant SEO keywords.
- Section titles across the page must use `<h2>`.
- Card titles, gallery items, and accordion titles must use `<h3>` or `<h4>`.
- Never nest an `<h1>` inside reusable components or repeated loop cards.

### Rule 2: Dynamic Breadcrumbs with Schema.org JSON-LD
- Every inner page (e.g. `/products/[slug]`, `/catalog`, `/artisans/[slug]`, `/about`, `/contact`) must render the `<Breadcrumbs />` component (`src/components/ui/Breadcrumbs.tsx`).
- The component must automatically embed a `<script type="application/ld+json">` containing a valid `BreadcrumbList` schema with 1-indexed item positions and canonical URLs.

### Rule 3: Accessible FAQ Section with `FAQPage` JSON-LD Schema
- Important landing pages and informational pages must incorporate `<FaqSection />` (`src/components/seo/FaqSection.tsx`).
- It must render an accessible `<details><summary>` accordion with full keyboard navigability.
- It must automatically embed a valid Schema.org `FAQPage` JSON-LD payload with all questions and answers.

### Rule 4: High-Performance Image Optimization & Zero CLS
- **Format**: All images must be WebP format (`&fm=webp` query parameter on dynamic URLs, or native `.webp` files).
- **Explicit Dimensions**: Every image tag must specify explicit `width` and `height` attributes (e.g. `width={400} height={300}`).
- **Aspect Ratio Containers**: Images must always be wrapped in CSS aspect-ratio containers (e.g. `aspect-[4/3]`, `aspect-[4/5]`, `aspect-square`) with `w-full h-full object-cover`. This guarantees that browsers reserve exact layout space before images load, completely eliminating Cumulative Layout Shift (**CLS = 0**).
- **Asynchronous Decoding & Lazy Loading**: All below-the-fold images must specify `loading="lazy"` and `decoding="async"`. The hero image at the top of the viewport must specify `fetchPriority="high"`.
- **Descriptive Alt Text**: Every image must provide an authentic, descriptive `alt` attribute describing the craft, material, and region. Empty or generic (`alt="image"`) strings are strictly prohibited.

### Rule 5: Sub-2-Second Load Speed
- Font declarations must use Next.js font optimization (`next/font/google`) with `display: 'swap'`.
- All CSS must be utility-compiled with zero runtime CSS-in-JS overhead.
- HTTP responses must declare caching headers: `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`.

### Rule 6: E-E-A-T & Real Human Artisan Provenance
- No generic, synthetic, or AI-generated filler text.
- Every craft must feature a verified human master artisan profile, authentic generational lineage story, genuine materials, traditional firing/weaving techniques, and valid Indian Geographical Indication (GI) provenance codes (e.g., `GI-IN-GJ-449`, `GI-IN-RJ-084`, `GI-IN-UP-237`).

### Rule 7: Zero-Float Minor Unit Currency Protocol (Paise Rule)
- **Absolute prohibition of floating-point numbers** for financial data storage, database columns, or financial arithmetic.
- All monetary amounts in the database and API payloads must be integers representing **paise** (1 Rupee = 100 paise).
- Floating-point representations (e.g., `126.99`) lead to IEEE-754 precision bugs. In ARTSINLY, this is strictly stored as `12699` paise.
- Currency conversions must always use helper functions in `src/lib/money.ts`:
  - `rupeesToPaise(rupees: number | string): number`
  - `paiseToRupeesString(paise: number): string`
  - `formatPaise(paise: number): string`

### Rule 8: Cryptographic Non-Guessable Identifiers
- Sequential integer IDs (`1`, `2`, `3`) and `Math.random()` are strictly forbidden.
- All database records, order tokens, tracking codes, and grievance tickets must use cryptographically secure non-guessable identifiers:
  - Database primary keys: CUID (`@default(cuid())`) or UUID v4 (`@default(uuid())`).
  - Order numbers: `generateOrderNumber()` -> `ART-2026-AA845E1D987C`
  - Tracking numbers: `generateTrackingNumber()` -> `AWB-6605C264`
  - Payment reference IDs: `generateReferenceId()` -> `SBX_UPI_1793457439634_B2A5C8E0`
  - Grievance tickets: `generateGrievanceTicketId("GRV")` -> `GRV-20261031-8F01FE`

### Rule 9: Multi-Vendor Parcel Checkout & Statutory Legal Compliance
- Multi-seller shopping carts must be automatically partitioned into independent seller parcels.
- Each seller receives an isolated parcel subtotal, shipment tracking number, and dispatch alert.
- Cancellation or refund of one seller's parcel must never cancel or affect another seller's parcel.
- Settlement calculations must strictly enforce:
  - **84% Artisan Net Remittance**
  - **15% Marketplace Platform Commission**
  - **1% Statutory Section 194-O Income Tax TDS Deduction**
  - Mathematical conservation: `netRemittance + commission + tds === grossSales` (always holds 100%).
- Full compliance with **Consumer Protection (E-Commerce) Rules, 2020**:
  - Published Nodal Grievance Redressal Officer.
  - Statutory 48-hour formal acknowledgement SLA.
  - Statutory 30-day resolution window.

---

## 4. Key Functions, Methods & Modules Reference

### 4.1 Currency & Money Helpers (`src/lib/money.ts`)
```ts
// Convert Rupee string or number to integer paise minor units
export function rupeesToPaise(val: number | string): number;

// Convert integer paise to decimal string ("12699" -> "126.99")
export function paiseToRupeesString(paise: number): string;

// Format integer paise with Rupee symbol ("12699" -> "₹126.99")
export function formatPaise(paise: number): string;

// Split gross sales into 84% artisan share, 15% commission, 1% TDS
export function calculateFairTradeSplit(grossPaise: number): {
  netRemittancePaise: number;
  commissionPaise: number;
  tdsPaise: number;
};
```

### 4.2 Cryptographic ID Generation (`src/lib/id.ts`)
```ts
export function generateUUID(): string;
export function generateOrderNumber(): string;
export function generateTrackingNumber(): string;
export function generateReferenceId(prefix?: string): string;
export function generateGrievanceTicketId(prefix?: string): string;
export function isNonGuessableId(id: string): boolean;
```

### 4.3 Structured Data & SEO Generators (`src/lib/seo/schema.ts`)
```ts
// Generate Schema.org Product JSON-LD
export function generateProductSchema(product: Product): object;

// Generate Schema.org BreadcrumbList JSON-LD
export function generateBreadcrumbSchema(items: { name: string; url: string }[]): object;

// Generate Schema.org FAQPage JSON-LD
export function generateFaqSchema(faqs: { question: string; answer: string }[]): object;

// Generate Schema.org Person (Artisan) JSON-LD
export function generateArtisanSchema(artisan: Artisan): object;
```

### 4.4 Unified Catalog API (`src/app/api/products/route.ts`)
- Retrieves products with server-side pagination, search queries, craft filters, and region filters.
- Seamlessly queries the live PostgreSQL database via Prisma and merges with the curated catalog from `src/lib/mock-data.ts`.
- Formats prices in both `priceDollars` and `pricePaise`.

---

## 5. Standard Operating Procedure (SOP): How to Add New Regional Indian Crafts

When adding a new authentic regional craft product to ARTSINLY, execute the following 7 steps in exact order:

### Step 1: Assign Schema-Valid Product Fields
Each product record in `src/lib/mock-data.ts` (and in the database) must provide:
- `id`: Non-guessable string starting with `prod-` (e.g. `prod-molela-plaque`).
- `title`: Full authentic title including craft type and provenance.
- `shortTitle`: Abbreviated title ending with ellipsis for compact UI widgets.
- `slug`: URL-friendly kebab-case slug.
- `description`: Detailed architectural and artisanal description.
- `excerpt`: Concise 1-sentence synopsis for social sharing & previews.
- `story`: Generational lineage narrative, raw material provenance, and firing/weaving technique.
- `craftType`: The specific craft tradition (e.g. `"Terracotta Relief Art"`, `"Meenakari Brass Metalwork"`).
- `categorySlug`: Maps to a valid category (`"terracotta-pottery"`, `"dhokra-metal"`, `"wood-carving"`, `"blue-pottery"`, `"block-printing"`, `"zardozi-embroidery"`).
- `regionSlug`: Matches an active region (`"rajasthan"`, `"uttar-pradesh"`, `"gujarat"`, `"west-bengal"`, `"karnataka"`, `"kashmir"`, `"andhra-pradesh"`).
- `state`: Indian state of provenance.
- `provenanceTag`: Human-readable terroir badge (e.g. `"Molela, Rajsamand, Rajasthan"`).
- `byline`: Artisan master or guild attribution.
- `dimensions`: Physical dimensions with height, width, and depth.
- `materials`: Detailed breakdown of indigenous clays, wood species, metals, or organic dyes.
- `careInstructions`: Specific preservation instructions.
- `priceDollars`: Float representation (for backwards UI display).
- `priceDisplay`: Human-readable formatted string (e.g. `"₹2,200"`).
- `pricePaise`: Strict integer paise minor units (`220000`).
- `originalPricePaise`: Integer original price in paise for strikethrough comparison.
- `stock`: Current in-stock quantity.
- `isMadeToOrder`: Boolean indicating if the piece is made on demand.
- `leadTimeDays`: Number of business days required for creation and dispatch.
- `status`: Strictly `"PUBLISHED"`.
- `rating`: Rating score (e.g. `4.95`).
- `reviewCount`: Number of verified collector reviews.
- `tags`: Array of search tags for faceted filtering.

### Step 2: Assign Master Artisan Profile
- If the artisan does not exist in `ARTISANS` in `src/lib/mock-data.ts`, create a new `Artisan` object:
  - `id`: `art-<slug>`
  - `shopName`: Authentic guild or studio name.
  - `artisanName`: Master artisan's full legal name.
  - `bio`: Custodial master biography.
  - `story`: Five-generation background, raw material harvesting, and ancestral methodology.
  - `craftTradition`: Traditional craft name.
  - `state` and `locality`: Village/district address.
  - `isVerified`: `true`.
  - `avatarUrl`: WebP portrait of the master artisan.
  - `yearsOfExperience`: Integer years of practice.
  - `featuredQuote`: Philosophical quote regarding their craft.
  - `productCount`: Number of active studio releases.

### Step 3: Optimize Image Assets
- Every image must:
  - Be WebP formatted (`&fm=webp` query parameter appended to URL).
  - Include an explicit `altText` describing the piece.
  - Have primary image marked `isPrimary: true`.

### Step 4: Catalog & Filter Synchronization
- Open `src/components/catalog/CatalogView.tsx`.
- Ensure `CRAFT_OPTIONS` and `REGION_OPTIONS` include keyword matchers that recognize the new craft and region.

### Step 5: Execute Automated Verification
- Run TypeScript compiler check: `npx tsc --noEmit`.
- Run all 5 test scripts in `scripts/`.
- Ensure zero errors.

---

## 6. Catalog of Newly Added Indian Regional Crafts

The following 13 authentic Indian regional crafts have been added to the master catalog, matching the uploaded catalog reference and famous Indian GI craft traditions:

| # | Product Title | Craft Type | Region & Terroir | GI Code / Provenance | Price (INR) | Minor Units (`pricePaise`) |
|---|---|---|---|---|---|---|
| 1 | **Ancestral Sheesham Wood High-Relief Jali Carved Panel** | Wood Carving | Saharanpur, Uttar Pradesh | GI-IN-UP-185 | ₹1,500 | 150,000 |
| 2 | **Molela Hand-Pressed Terracotta Votive Temple Plaque** | Terracotta Relief | Molela, Rajsamand, Rajasthan | GI-IN-RJ-084 | ₹2,200 | 220,000 |
| 3 | **Hand-Painted Terracotta Earthenware Matka Cluster** | Terracotta Pottery | Pokhran, Rajasthan | GI-IN-RJ-412 | ₹1,100 | 110,000 |
| 4 | **Gorakhpur Hand-Etched Terracotta Decorative Floral Urn** | Terracotta Pottery | Gorakhpur, Uttar Pradesh | GI-IN-UP-634 | ₹1,400 | 140,000 |
| 5 | **Moradabad Hand-Engraved Meenakari Brass Floral Jar** | Meenakari Metalwork | Moradabad "Peetal Nagri", UP | GI-IN-UP-237 | ₹3,200 | 320,000 |
| 6 | **Jaipur Cobalt Quartz Blue Pottery Floral Urn** | Blue Pottery | Sanganer, Jaipur, Rajasthan | GI-IN-RJ-002 | ₹1,600 | 160,000 |
| 7 | **Kutch Khavda Burnished Clay Surahi & Earthen Pot Trio** | Terracotta Pottery | Khavda, Kutch, Gujarat | GI-IN-GJ-449 | ₹1,200 | 120,000 |
| 8 | **Kutch Rabari Bharatkaam Hand-Embroidered Mirrorwork Tapestry** | Rabari Needlework | Bhujodi, Kutch, Gujarat | GI-IN-GJ-178 | ₹1,500 | 150,000 |
| 9 | **Bastar Bell Metal Dhokra Handcrafted Sacred Lota & Vessel Set** | Dhokra Bell Metal | Bikna, Bankura, West Bengal | GI-IN-WB-058 | ₹1,800 | 180,000 |
| 10 | **Cuttack & Bengal Tarakasi Silver Filigree Sacred Temple Shrine** | Silver Filigree | Cuttack & Bengal Guilds | GI-IN-OD-372 | ₹2,800 | 280,000 |
| 11 | **Nakshi Kantha Narrative Hand-Embroidered Silk Tapestry** | Kantha Embroidery | Bolpur, Shantiniketan, WB | GI-IN-WB-112 | ₹2,400 | 240,000 |
| 12 | **Bidriware Pure Silver-Inlaid Zinc Alloy Goblet & Flagon** | Bidriware Metal Inlay | Bidar, Karnataka | GI-IN-KA-011 | ₹2,600 | 260,000 |
| 13 | **Bishnupur Terracotta Temple Relief Tile & Bankura Horse** | Terracotta Pottery | Bishnupur, Bankura, West Bengal | GI-IN-WB-088 | ₹1,350 | 135,000 |

*Note: All 11 pre-existing catalog products (`prod-vase`, `prod-clock`, `prod-pichwai`, `prod-dhokra-bag`, `prod-zardozi`, `prod-ajrakh-throw`, `prod-blue-plates`, `prod-kalamkari`, `prod-lamp`, `prod-bluepottery-vessel`, `prod-walnut-box`) have been fully preserved without deletion or disruption.*

---

## 7. Verification & Automated Testing Runbook

Before committing or pushing any code to git, the developer or AI assistant **must run and pass all 6 validation steps**:

```bash
# 1. TypeScript Strict Typecheck (must return 0 errors)
npx tsc --noEmit

# 2. System Verification Suite (Health, Core Web Vitals, Telemetry, Sitemap, Robots)
node scripts/test_system_suite.js
# Expected: 38 PASSED, 0 FAILED

# 3. Database Rules Suite (UUIDs, Minor Unit Paise Math, Order Immutability)
node scripts/test_database_rules.js
# Expected: 59 PASSED, 0 FAILED

# 4. Multi-Vendor Checkout Suite (Parcel Segregation, 84/15/1 Split, TDS, Webhook Idempotency)
node scripts/test_multivendor_checkout_and_payments.js
# Expected: 34 PASSED, 0 FAILED

# 5. Seller Product Management Suite (CRUD, GI Codes, Status Workflows, Multi-Seller Isolation)
node scripts/test_seller_product_management.js
# Expected: 55 PASSED, 0 FAILED

# 6. Payment Onboarding & Legal Review Suite (Gateway Provider, Bank Verification, CPA 2020)
node scripts/test_payments_and_legal.js
# Expected: 39 PASSED, 0 FAILED
```

---

## 8. Procedure for Updating this Documentation

Whenever a new feature, database model, payment rule, or craft collection is added to ARTSINLY:
1. Apply the code changes cleanly to the respective source files.
2. Verify all test suites pass.
3. Open `DEVELOPMENT_PROCEDURES_AND_METHODS.md`.
4. Update the **"Last Updated"** timestamp in the header.
5. Record the new functions, schemas, or products in Sections 4, 5, or 6.
6. Commit this documentation file alongside the codebase diff to maintain complete project history.
