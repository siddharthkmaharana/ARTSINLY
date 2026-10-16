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

-   [ ] Create Git repository and project README.
-   [ ] Confirm launch geography, currency, language, and shipping
    assumptions.
-   [ ] Define initial craft categories and regional data.
-   [ ] Decide seller approval and verification requirements.
-   [ ] Decide between sample data, simulated checkout, and payment
    sandbox for the first demo.
-   [ ] Choose initial authentication, image storage, hosting, and
    payment candidates.
-   [ ] Create an issue tracker and prioritised backlog.

**Exit criteria:** Scope, visual direction, repository, and key
decisions are documented.

### Phase 1 --- UI foundation and responsive storefront

**Estimate:** 4--7 days

-   [ ] Scaffold Next.js with TypeScript, Tailwind, and App Router.
-   [ ] Configure typography, colours, spacing, buttons, inputs, cards,
    dialogs, and menus.
-   [ ] Build responsive header, navigation, footer, and mobile menu.
-   [ ] Implement homepage using the screenshot as a visual reference.
-   [ ] Create sample product and artisan data.
-   [ ] Build catalogue grid, product cards, artisan directory, and
    product detail page.
-   [ ] Add interactive sample-data filters and sorting.
-   [ ] Implement loading, empty, no-results, and error states.
-   [ ] Check mobile, tablet, and desktop layouts.
-   [ ] Review keyboard navigation and contrast.

**Exit criteria:** Visitors can navigate a polished responsive
prototype. Sample data is clearly treated as demonstration content.

### Phase 2 --- Database and authentication

**Estimate:** 4--7 days

-   [ ] Provision development PostgreSQL.
-   [ ] Configure Prisma and initial migrations.
-   [ ] Model users, roles, seller profiles, regions, categories,
    products, and images.
-   [ ] Implement registration, login, logout, and sessions.
-   [ ] Add buyer and seller onboarding.
-   [ ] Protect buyer, seller, and admin routes.
-   [ ] Add server-side permission helpers and tests.
-   [ ] Seed realistic development data without personal or production
    data.
-   [ ] Connect catalogue and artisan pages to database queries.

**Exit criteria:** Accounts and catalogue data persist; users cannot
access other users' protected data by changing a URL or request.

### Phase 3 --- Seller shop and product management

**Estimate:** 4--7 days

-   [ ] Create and edit seller profiles.
-   [ ] Integrate image storage and validated uploads.
-   [ ] Build product forms with server-side Zod validation.
-   [ ] Support price, stock, materials, dimensions, variants, and
    made-to-order settings as appropriate.
-   [ ] Implement draft, pending review, published, rejected, and
    archived states.
-   [ ] Add seller-owned product listing and inventory screens.
-   [ ] Add admin review and moderation actions.
-   [ ] Test ownership checks and upload restrictions.

**Exit criteria:** Sellers can manage their own listings safely;
administrators can moderate them.

### Phase 4 --- Search and discovery

**Estimate:** 2--4 days

-   [ ] Implement server-side text search.
-   [ ] Add region, category, price, material, availability, and rating
    filters when data exists.
-   [ ] Validate query parameters and support shareable URLs.
-   [ ] Implement sorting and pagination.
-   [ ] Add indexes for common catalogue queries.
-   [ ] Test filter combinations, invalid values, and empty results.
-   [ ] Measure performance before adding a dedicated search engine.

**Exit criteria:** Catalogue discovery uses database data and works
consistently across refreshes and shared links.

### Phase 5 --- Cart, orders, and fulfilment

**Estimate:** 5--8 days

-   [ ] Build cart persistence and quantity updates.
-   [ ] Validate current prices and stock on the server during checkout.
-   [ ] Create orders and order items in database transactions.
-   [ ] Snapshot purchase-time prices and delivery details.
-   [ ] Define multi-seller order grouping, shipping, refunds, and
    fulfilment.
-   [ ] Add buyer order history and seller order management.
-   [ ] Implement explicit order-state transitions.
-   [ ] Handle cancellation, stock release, and duplicate requests.
-   [ ] Add transactional email for key order events.

**Exit criteria:** Test orders are created safely and shown only to the
buyer, relevant sellers, and authorised administrators.

### Phase 6 --- Payments and seller settlement

**Estimate:** 4--8 days plus provider onboarding

-   [ ] Confirm provider eligibility and marketplace capabilities.
-   [ ] Integrate sandbox checkout.
-   [ ] Verify payment state server-side.
-   [ ] Verify webhook signatures and implement idempotent processing.
-   [ ] Record payment attempts, references, failures, and refunds.
-   [ ] Define commissions, fees, transfers, and payout states.
-   [ ] Test payment failure, duplicate webhooks, cancellations, and
    refunds.
-   [ ] Test multi-seller and partial-fulfilment edge cases.
-   [ ] Complete provider onboarding before enabling live payments.

**Exit criteria:** Sandbox events produce correct order/payment states;
live payments remain disabled until provider approval and operational
review.

### Phase 7 --- Administration and operations

**Estimate:** 3--5 days

-   [ ] Build admin views for sellers, products, and orders.
-   [ ] Add seller approval and verification status management.
-   [ ] Add moderation and dispute workflows.
-   [ ] Record important privileged actions in audit logs.
-   [ ] Add pagination, filters, and permission tests.
-   [ ] Document support processes for refunds, order issues, and seller
    disputes.

**Exit criteria:** Core operations can be managed without direct
database edits.

### Phase 8 --- Production readiness and release

**Estimate:** 4--7 days, excluding external approvals

-   [ ] Configure separate development, staging, and production
    environments.
-   [ ] Set up CI for linting, type checks, tests, and builds.
-   [ ] Run unit, integration, and end-to-end tests.
-   [ ] Test authorization, upload safety, rate limits, and payment
    webhooks.
-   [ ] Add error tracking and operational alerts.
-   [ ] Configure backups and test database restoration.
-   [ ] Review accessibility, SEO, metadata, sitemap, and image
    performance.
-   [ ] Publish privacy, terms, shipping, returns, seller, and grievance
    information as applicable.
-   [ ] Review current Indian e-commerce, consumer protection, privacy,
    tax, and payment requirements.
-   [ ] Prepare rollback steps and a release checklist.
-   [ ] Run user acceptance tests with a small group.

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

-   [ ] Visitors can browse on mobile and desktop.
-   [ ] Search and filters return expected server-side results.
-   [ ] Buyers cannot access seller-only operations.
-   [ ] Sellers cannot read or modify another seller's products or
    orders.
-   [ ] Admin roles cannot be assigned through public registration.
-   [ ] Invalid and oversized uploads are rejected.
-   [ ] Client-side price tampering cannot change checkout totals.
-   [ ] Concurrent checkout attempts cannot oversell stock.
-   [ ] Duplicate webhooks do not duplicate payment/order processing.
-   [ ] Failed payments and cancellations release stock according to
    policy.
-   [ ] Order visibility is limited to the buyer, relevant sellers, and
    authorised admins.
-   [ ] Keyboard users can operate navigation, filters, forms, and
    dialogs.
-   [ ] CI prevents deployment when critical checks fail.

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

1.  [ ] Create the Next.js app and Git repository.
2.  [ ] Add design tokens and typography.
3.  [ ] Build the header and responsive homepage to match the
    screenshot's visual tone.
4.  [ ] Create sample products and artisan profiles.
5.  [ ] Build catalogue, filter drawer, product cards, and product
    details.
6.  [ ] Compare desktop and mobile layouts against the reference.
7.  [ ] Add PostgreSQL and Prisma after the core UI direction is stable.
8.  [ ] Implement authentication and role permissions.
9.  [ ] Build seller product management.
10. [ ] Add cart, orders, and payment sandbox after catalogue and seller
    workflows are sound.

### First milestone definition

The first milestone is complete when ARTISANLY has a responsive,
visually consistent homepage, catalogue, product-detail page, and
artisan directory; working sample-data filters; accessible navigation;
and a clean, documented codebase ready for database integration.

------------------------------------------------------------------------

**Guiding principle:** The design earns attention; accurate product
stories, secure seller tools, and reliable fulfilment earn trust.
