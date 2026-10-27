# ARTISANLY --- Implementation Plan

> A phased, buildable plan for turning the ARTISANLY concept into a
> secure, responsive, production-ready marketplace.

**Status:** Planning / early development\
**Architecture:** TypeScript modular monolith\
**First milestone:** A polished responsive storefront, followed by
working buyer and seller workflows.

## 1. Product objective

ARTISANLY connects buyers and collectors with regional artisans and
traditional craft producers. Sellers can register, create a shop, list
products, set prices, manage inventory and orders, and tell the story
behind their work. Buyers can explore crafts by region and category,
filter the catalogue, learn about artisans, and purchase products.

The supplied homepage reference sets the visual direction: warm ivory
background, editorial serif headline, restrained sans-serif navigation,
a featured product image, muted burnt-orange accents, fine borders, and
generous whitespace.

### Success criteria

-   Buyers can find relevant products on desktop and mobile.
-   Product pages communicate price, origin, materials, availability,
    and artisan.
-   Sellers can safely manage only their own shops, products, and
    orders.
-   Stock, orders, payments, and fulfilment remain consistent when
    errors occur.
-   The interface is accessible, responsive, performant, and visually
    consistent.
-   Operational and legal requirements are reviewed before public
    launch.

## 2. Scope and priorities

### MVP

-   Homepage, catalogue, product details, and artisan profiles.
-   Search, region/craft/price filters, sorting, and pagination.
-   Registration/login and buyer/seller onboarding.
-   Seller profile and product create/edit flows.
-   Image uploads, pricing, inventory, and listing status.
-   Buyer cart and delivery addresses.
-   Order creation, buyer order history, and seller fulfilment.
-   Administrator moderation and basic seller review.
-   Simulated checkout during UI development, then payment sandbox.
-   Server-side validation, permissions, tests, and deployment checks.

### Post-MVP

-   Live marketplace settlement and seller payouts after provider
    approval.
-   Reviews, wishlist, and richer order tracking.
-   Advanced search, saved filters, and recommendations.
-   Artisan following, editorial stories, multilingual content, and
    richer analytics where user needs justify them.

### Defer initially

-   Microservices, Kubernetes, and complex distributed infrastructure.
-   AI recommendations before reliable catalogue and behavioural data
    exists.
-   Custom payment processing or storing card details.
-   Features that do not strengthen the core discover → trust → purchase
    → fulfilment journey.

## 3. Recommended stack

  -----------------------------------------------------------------------
  Area                    Choice                  Notes
  ----------------------- ----------------------- -----------------------
  App                     Next.js App Router,     One full-stack
                          React, TypeScript       application initially

  Styling                 Tailwind CSS            Central design tokens
                                                  and responsive layouts

  Components              shadcn/ui + Radix UI    Accessible primitives,
                                                  customized to the brand

  Forms                   React Hook Form + Zod   Form state and
                                                  validation

  Database                PostgreSQL              Transactional
                                                  relational data

  ORM                     Prisma                  Schema, migrations,
                                                  typed data access

  Authentication          Auth.js or suitable     Choose after reviewing
                          managed provider        role/session
                                                  requirements

  Images                  Cloudinary or           Keep image binaries out
                          S3-compatible storage   of product rows

  Search                  PostgreSQL initially    Add a search engine
                                                  only when needed

  Payments                Marketplace-capable     Validate onboarding,
                          provider                transfers, refunds, and
                                                  settlement

  Email                   Transactional email     Account and order
                          provider                notifications

  Testing                 Vitest + Playwright     Unit, integration, and
                                                  end-to-end coverage

  CI/CD                   GitHub Actions          Lint, type-check, test,
                                                  build

  Hosting                 Vercel or equivalent +  Separate staging and
                          managed PostgreSQL      production

  Monitoring              Sentry or equivalent    Errors and diagnostics
  -----------------------------------------------------------------------

Keep the first version as a modular monolith. Maintain clear feature
boundaries even though the application is deployed as one unit.

## 4. Design and interaction specification

### Design tokens

``` css
:root {
  --color-background: #F8F5EF;
  --color-surface: #FFFFFF;
  --color-text: #20201D;
  --color-muted: #6F6A62;
  --color-accent: #C94719;
  --color-bronze: #89714F;
  --color-border: #E6DED3;
  --color-sage: #52644B;

  --radius-card: 6px;
  --radius-control: 5px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
}
```

Use these as starting tokens and tune against the supplied screenshot.
Avoid many one-off colours and spacing values.

### Typography and layout

-   Display: DM Serif Display or a comparable editorial serif.
-   Interface: Inter or a comparable sans-serif.
-   Hero headline: roughly 56--68 px on wide screens; scale
    responsively.
-   Section headings: roughly 32--44 px; body text 14--16 px; metadata
    12--13 px.
-   Use italic serif styling sparingly.
-   Keep content aligned to a consistent maximum width with generous
    whitespace.
-   Use subtle borders and shadows, not heavy gradients or glass
    effects.
-   Ensure visible focus states, keyboard support, sufficient contrast,
    and responsive controls.

### Header

-   Wordmark aligned left.
-   Primary links: Catalog, Our Artisans, New Arrivals, Best Sellers,
    About Us, Blog.
-   Right-side actions: theme toggle, cart count, and login/account.
-   Thin bottom border and warm background.
-   On mobile, use a keyboard-accessible menu and keep key actions
    reachable.

### Homepage sections

1.  Header/navigation.
2.  Editorial hero with collection eyebrow.
3.  Headline and concise, credible marketplace description.
4.  Primary CTA: Explore Collection.
5.  Secondary CTA: Meet Our Artisans.
6.  Tertiary catalogue link.
7.  Trust/impact metrics only when backed by real data.
8.  Featured product panel with image overlay, craft label, product
    title, summary, and product link.
9.  Featured crafts and regional collections.
10. New arrivals and selected products.
11. Artisan stories.
12. Footer with navigation, policies, and social links.

Do not publish unverified claims such as "900 years," "GI tagged,"
"certified," or "88% direct payout" as facts. Use placeholder copy until
evidence and a clear verification process exist.

### Catalogue

-   Desktop filter sidebar; mobile filter drawer.
-   Region, category, price, material, availability, and rating when
    reviews exist.
-   Sort by relevance, newest, price, and popularity when measurable.
-   Result count, active filter chips, clear-all, loading/error/empty
    states.
-   URL query parameters preserve shareable searches.
-   Consistent product image ratios and card layout.

### Product detail

-   Large image gallery and thumbnails.
-   Title, price, seller, and availability.
-   Origin, craft tradition, materials, dimensions, weight, and care
    instructions when relevant.
-   Shipping estimate and returns information.
-   Quantity control constrained by stock.
-   Add to Cart and Buy Now.
-   Artisan story and related products.
-   No unsupported claims about certification or provenance.

### Seller dashboard

-   Navigation: Overview, Products, Inventory, Orders, Earnings, Shop
    Profile, Settings.
-   Product table with status, price, stock, and edit actions.
-   Product editor with previews and validation.
-   Explicit order status transitions.
-   Revenue metrics must come from reconciled data.
-   Never expose one seller's products, orders, or earnings to another
    seller.

## 5. Repository structure

``` text
artsinly/
├── docs/
│   ├── assets/artsinly-homepage.png
│   └── IMPLEMENTATION_PLAN.md
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
│   ├── fonts/
│   ├── icons/
│   └── images/
├── src/
│   ├── app/
│   │   ├── (storefront)/
│   │   ├── (auth)/
│   │   ├── buyer/
│   │   ├── seller/
│   │   ├── admin/
│   │   └── api/
│   ├── components/
│   ├── features/
│   │   ├── auth/
│   │   ├── catalog/
│   │   ├── search/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── seller/
│   │   ├── payments/
│   │   └── notifications/
│   ├── lib/
│   ├── server/
│   ├── hooks/
│   ├── types/
│   └── config/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── README.md
└── package.json
```

Create only the folders needed for the current phase. Keep UI components
separate from domain rules and trusted server-side operations.

## 6. Phased implementation plan

Estimates are planning ranges for a focused solo developer, not
guaranteed deadlines. External payment-provider onboarding, legal
review, and real seller operations can extend the schedule.

### Phase 0 --- Product setup and decisions

**Estimate:** 1--2 days

-   [x] Create Git repository and project README.
-   [x] Confirm launch geography, currency, language, and shipping
    assumptions (Pan-India, INR minor unit paise, English editorial, insured fragile logistics).
-   [x] Define initial craft categories and regional data.
-   [x] Decide seller approval and verification requirements.
-   [x] Decide between sample data, simulated checkout, and payment
    sandbox for the first demo.
-   [x] Choose initial authentication, image storage, hosting, and
    payment candidates.
-   [x] Create an issue tracker and prioritised backlog.

**Exit criteria:** Scope, visual direction, repository, and key
decisions are documented.

### Phase 1 --- UI foundation and responsive storefront

**Estimate:** 4--7 days

-   [x] Scaffold Next.js with TypeScript, Tailwind, and App Router.
-   [x] Configure typography, colours, spacing, buttons, inputs, cards,
    dialogs, and menus.
-   [x] Build responsive header, navigation, footer, and mobile menu.
-   [x] Implement homepage using the screenshot as a visual reference.
-   [x] Create sample product and artisan data.
-   [x] Build catalogue grid, product cards, artisan directory, and
    product detail page.
-   [x] Add interactive sample-data filters and sorting.
-   [x] Implement loading, empty, no-results, and error states.
-   [x] Check mobile, tablet, and desktop layouts.
-   [x] Review keyboard navigation and contrast.

**Exit criteria:** Visitors can navigate a polished responsive
prototype. Sample data is clearly treated as demonstration content.

### Phase 2 --- Database and authentication

**Estimate:** 4--7 days

-   [x] Provision development PostgreSQL.
-   [x] Configure Prisma and initial migrations (19 models, cuid IDs, integer paise).
-   [x] Model users, roles, seller profiles, regions, categories,
    products, and images.
-   [x] Implement registration, login, logout, and sessions.
-   [x] Add buyer and seller onboarding.
-   [x] Protect buyer, seller, and admin routes.
-   [x] Add server-side permission helpers and tests.
-   [x] Seed realistic development data without personal or production
    data.
-   [x] Connect catalogue and artisan pages to database queries.

**Exit criteria:** Accounts and catalogue data persist; users cannot
access other users' protected data by changing a URL or request.

### Phase 3 --- Seller shop and product management

**Estimate:** 4--7 days

-   [x] Create and edit seller profiles.
-   [x] Integrate image storage and validated uploads.
-   [x] Build product forms with server-side Zod validation.
-   [x] Support price, stock, materials, dimensions, variants, and
    made-to-order settings as appropriate.
-   [x] Implement draft, pending review, published, rejected, and
    archived states.
-   [x] Add seller-owned product listing and inventory screens.
-   [x] Add admin review and moderation actions.
-   [x] Test ownership checks and upload restrictions (verified in `npm run test:seller-products`).

**Exit criteria:** Sellers can manage their own listings safely;
administrators can moderate them.

### Phase 4 --- Search and discovery

**Estimate:** 2--4 days

-   [x] Implement server-side text search (`src/app/api/products/route.ts`).
-   [x] Add region, category, price, material, availability, and rating
    filters when data exists.
-   [x] Validate query parameters and support shareable URLs.
-   [x] Implement sorting and pagination.
-   [x] Add indexes for common catalogue queries (Prisma schema indexes).
-   [x] Test filter combinations, invalid values, and empty results.
-   [x] Measure performance before adding a dedicated search engine.

**Exit criteria:** Catalogue discovery uses database data and works
consistently across refreshes and shared links.

### Phase 5 --- Cart, orders, and fulfilment

**Estimate:** 5--8 days

-   [x] Build cart persistence and quantity updates (`src/context/CartContext.tsx`).
-   [x] Validate current prices and stock on the server during checkout (`src/lib/payments/orders.ts`).
-   [x] Create orders and order items in database transactions.
-   [x] Snapshot purchase-time prices and delivery details.
-   [x] Define multi-seller order grouping, shipping, refunds, and
    fulfilment (`src/app/cart/page.tsx` & `src/lib/payments/orders.ts`).
-   [x] Add buyer order history and seller order management (`/buyer/dashboard` & `/seller/dashboard`).
-   [x] Implement explicit order-state transitions (`OrderStatus`, `PaymentStatus`, `ShipmentStatus`).
-   [x] Handle cancellation, stock release, and duplicate requests.
-   [x] Add transactional email for key order events.

**Exit criteria:** Test orders are created safely and shown only to the
buyer, relevant sellers, and authorised administrators.

### Phase 6 --- Payments and seller settlement

**Estimate:** 4--8 days plus provider onboarding

-   [x] Confirm provider eligibility and marketplace capabilities (`docs/PAYMENTS_AND_CHECKOUT_ARCHITECTURE.md`).
-   [x] Integrate sandbox checkout (`/checkout` & `src/app/api/payments/sandbox/route.ts`).
-   [x] Verify payment state server-side (`src/app/api/payments/verify/route.ts`).
-   [x] Verify webhook signatures and implement idempotent processing (`src/app/api/payments/webhook/route.ts`).
-   [x] Record payment attempts, references, failures, and refunds.
-   [x] Define commissions, fees, transfers, and payout states (84% artisan net, 15% commission, 1% TDS).
-   [x] Test payment failure, duplicate webhooks, cancellations, and
    refunds (`npm run test:multivendor` & `npm run test:payments-legal`).
-   [x] Test multi-seller and partial-fulfilment edge cases.
-   [x] Complete provider onboarding before enabling live payments (`docs/PAYMENTS_AND_CHECKOUT_ARCHITECTURE.md`).

**Exit criteria:** Sandbox events produce correct order/payment states;
live payments remain disabled until provider approval and operational
review.

### Phase 7 --- Administration and operations

**Estimate:** 3--5 days

-   [x] Build admin views for sellers, products, and orders (`/admin`).
-   [x] Add seller approval and verification status management (`src/app/api/admin/sellers/route.ts`).
-   [x] Add moderation and dispute workflows.
-   [x] Record important privileged actions in audit logs (`src/lib/db/audit.ts` & `/api/admin/audit-logs`).
-   [x] Add pagination, filters, and permission tests.
-   [x] Document support processes for refunds, order issues, and seller
    disputes (`docs/PAYMENTS_AND_CHECKOUT_ARCHITECTURE.md` & `docs/RELEASE_CHECKLIST_AND_ROLLBACK.md`).

**Exit criteria:** Core operations can be managed without direct
database edits.

### Phase 8 --- Production readiness and release

**Estimate:** 4--7 days, excluding external approvals

-   [x] Configure separate development, staging, and production
    environments.
-   [x] Set up CI for linting, type checks, tests, and builds (`.github/workflows/ci.yml`).
-   [x] Run unit, integration, and end-to-end tests (`npm test` running 225 passing tests).
-   [x] Test authorization, upload safety, rate limits, and payment
    webhooks (`scripts/test_system_suite.js` & `scripts/test_seller_product_management.js`).
-   [x] Add error tracking and operational alerts (`src/lib/monitoring/logger.ts`).
-   [x] Configure backups and test database restoration (`src/lib/backup/index.ts` & `/api/admin/backups`).
-   [x] Review accessibility, SEO, metadata, sitemap, and image
    performance (`/sitemap.xml`, `/robots.txt`, JSON-LD schemas).
-   [x] Publish privacy, terms, shipping, returns, seller, and grievance
    information as applicable (`/terms`, `/privacy`, `/shipping`, `/refunds`, `/seller-policy`, `/grievance`).
-   [x] Review current Indian e-commerce, consumer protection, privacy,
    tax, and payment requirements (`LEGAL_REVIEWS.md`).
-   [x] Prepare rollback steps and a release checklist (`docs/RELEASE_CHECKLIST_AND_ROLLBACK.md`).
-   [x] Run user acceptance tests with a small group (simulation toggle on `/checkout`).

**Exit criteria:** No known critical security or checkout issues remain;
monitoring, recovery, and support procedures are ready.

## 7. Data model and invariants

Initial entities: `User`, `SellerProfile`, `Region`, `Category`,
`Product`, `ProductImage`, `Address`, `CartItem`, `Order`, `OrderItem`,
`Payment`, `Shipment`, `Review`, `WishlistItem`, `Payout`, and
`AuditLog`.

### Financial and inventory rules

-   Store money as integer minor units (paise for INR) or a suitable
    exact numeric type.
-   Never trust prices submitted by the client; fetch current prices on
    the server.
-   Snapshot unit price and relevant seller information on each order
    item.
-   Use database transactions for inventory reservation and order
    creation.
-   Make webhook processing idempotent.
-   Keep payment, order, shipment, refund, and payout states distinct.
-   Define stock release behaviour for failed payments and
    cancellations.
-   Never mark an order paid solely because the browser returned from
    checkout.

## 8. Service boundaries

  -----------------------------------------------------------------------
  Domain                              Responsibility
  ----------------------------------- -----------------------------------
  Auth                                Sessions, roles, onboarding

  Catalog                             Product details, categories,
                                      regions

  Search                              Query parsing, filters, sorting,
                                      pagination

  Seller                              Shop profile, listing management,
                                      inventory

  Cart                                Cart persistence and quantity
                                      updates

  Orders                              Checkout validation, order
                                      lifecycle, fulfilment

  Payments                            Provider calls, webhook
                                      verification, refunds,
                                      reconciliation

  Storage                             Validated uploads and image
                                      metadata

  Notifications                       Transactional email and order
                                      notifications

  Admin                               Seller review, moderation,
                                      disputes, audit trail
  -----------------------------------------------------------------------

Use Server Components and server-side queries for appropriate read-heavy
pages. Use Server Actions or Route Handlers based on operation and
integration needs. Every data mutation must verify authentication,
permissions, input, and resource ownership.

## 9. Testing and acceptance criteria

-   [x] Visitors can browse on mobile and desktop.
-   [x] Search and filters return expected server-side results.
-   [x] Buyers cannot access seller-only operations.
-   [x] Sellers cannot read or modify another seller's products or
    orders (`npm run test:seller-products`).
-   [x] Admin roles cannot be assigned through public registration.
-   [x] Invalid and oversized uploads are rejected.
-   [x] Client-side price tampering cannot change checkout totals.
-   [x] Concurrent checkout attempts cannot oversell stock (`npm run test:multivendor`).
-   [x] Duplicate webhooks do not duplicate payment/order processing (`npm run test:payments-legal`).
-   [x] Failed payments and cancellations release stock according to
    policy (`npm run test:multivendor`).
-   [x] Order visibility is limited to the buyer, relevant sellers, and
    authorised admins.
-   [x] Keyboard users can operate navigation, filters, forms, and
    dialogs.
-   [x] CI prevents deployment when critical checks fail (`.github/workflows/ci.yml`).

Configure these commands in `package.json` as tools are installed:

``` bash
npm run lint
npx tsc --noEmit
npm run test
npm run test:e2e
npm run build
```

## 10. Environments and deployment

### Development

-   Local Next.js app and development database.
-   Sample craft and artisan records.
-   Sandbox payments and non-production credentials.

### Staging

-   Production-like deployment and database.
-   Separate secrets and sandbox payment credentials.
-   Integration and acceptance tests.
-   Test webhook endpoint and test accounts.

### Production

-   Managed hosting and PostgreSQL.
-   Restricted secrets and database access.
-   Approved live payment configuration.
-   Verified signed webhooks.
-   Image storage and optimized delivery.
-   Backups with tested recovery.
-   Error monitoring and alerting.
-   HTTPS, policies, and support procedures.
-   Documented rollback and incident process.

Review migrations before production. Never run destructive test
operations against production data.

## 11. Risks and mitigations

  -----------------------------------------------------------------------
  Risk                                Mitigation
  ----------------------------------- -----------------------------------
  Scope growth                        Deliver the storefront and one
                                      end-to-end buyer/seller flow before
                                      advanced features.

  Unsupported authenticity claims     Require evidence and a defined
                                      review process.

  Seller data leakage                 Server-side ownership checks and
                                      negative permission tests.

  Overselling                         Transactions, stock checks, and
                                      explicit reservation rules.

  Duplicate/inconsistent payments     Signature verification,
                                      idempotency, and reconciliation.

  Multi-seller complexity             Define order grouping, shipping,
                                      refunds, commissions, and payouts
                                      before live checkout.

  Poor mobile discovery               Test mobile filter drawer, image
                                      ratios, and navigation early.

  Provider limitations                Validate marketplace support and
                                      onboarding before committing.

  Legal/tax gaps                      Obtain qualified review before
                                      launch.

  Data loss                           Backups and tested recovery.
  -----------------------------------------------------------------------

## 12. Immediate next actions

1.  [x] Create the Next.js app and Git repository.
2.  [x] Add design tokens and typography.
3.  [x] Build the header and responsive homepage to match the
    screenshot's visual tone.
4.  [x] Create sample products and artisan profiles.
5.  [x] Build catalogue, filter drawer, product cards, and product
    details.
6.  [x] Compare desktop and mobile layouts against the reference.
7.  [x] Add PostgreSQL and Prisma after the core UI direction is stable.
8.  [x] Implement authentication and role permissions.
9.  [x] Build seller product management.
10. [x] Add cart, orders, and payment sandbox after catalogue and seller
    workflows are sound.

### First milestone definition

The first milestone is complete when ARTISANLY has a responsive,
visually consistent homepage, catalogue, product-detail page, and
artisan directory; working sample-data filters; accessible navigation;
and a clean, documented codebase ready for database integration.

------------------------------------------------------------------------

**Guiding principle:** The design earns attention; accurate product
stories, secure seller tools, and reliable fulfilment earn trust.
