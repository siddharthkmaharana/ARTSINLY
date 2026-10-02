# ARTSINLY --- Regional Artisans Marketplace

> A modern, minimalist multi-vendor marketplace that connects regional
> artisans with buyers looking for authentic handmade crafts,
> traditional art, and culturally rooted products.

**ARTSINLY** is designed to help artisans create an online shop, publish
products, set their own prices, manage inventory and orders, and share
the stories behind their craft. Buyers can discover products by region,
craft type, material, and price, then save favourites and purchase
directly through the marketplace.

The visual direction combines **editorial e-commerce design** with
**Indian craft heritage**: warm ivory backgrounds, restrained
typography, generous whitespace, large product photography, and simple
navigation.

> **Project status:** In planning / development. Features listed below
> describe the intended product and may not all be implemented yet.

------------------------------------------------------------------------

## Contents

-   [Vision](#vision)
-   [Core Features](#core-features)
-   [User Roles](#user-roles)
-   [Design Direction](#design-direction)
-   [Technology Stack](#technology-stack)
-   [Architecture](#architecture)
-   [Project Structure](#project-structure)
-   [Getting Started](#getting-started)
-   [Environment Variables](#environment-variables)
-   [Data Model](#data-model)
-   [Key User Flows](#key-user-flows)
-   [Security and Reliability](#security-and-reliability)
-   [Testing](#testing)
-   [Deployment](#deployment)
-   [Development Roadmap](#development-roadmap)
-   [Contributing](#contributing)
-   [License](#license)

------------------------------------------------------------------------

## Vision

Traditional and regional crafts carry the history, skills, and identity
of the communities that create them. ARTISANLY aims to make these crafts
easier to discover and purchase while giving artisans a dedicated
digital storefront.

### Goals

-   Help artisans from different regions register and sell their work
    online.
-   Let sellers create product listings and set their own prices.
-   Help buyers discover products by craft, region, material,
    availability, and budget.
-   Present the artisan and the story behind each product alongside the
    product itself.
-   Provide reliable seller tools for inventory, order fulfilment, and
    earnings.
-   Build a secure, accessible, responsive platform that can grow from a
    prototype into a production marketplace.

## Core Features

### Buyer experience

-   Browse a curated marketplace of handmade and traditional crafts.
-   Search by product name, artisan, craft, or region.
-   Filter by region, craft category, price, material, availability, and
    rating.
-   Sort by relevance, newest arrivals, price, or popularity.
-   View product galleries, descriptions, dimensions, materials, care
    instructions, and origin.
-   Explore artisan profiles and their product collections.
-   Add products to a cart and wishlist.
-   Manage delivery addresses and view order history.
-   Track order and shipment status.
-   Leave reviews for eligible purchases.

### Seller experience

-   Register as a seller and complete shop onboarding.
-   Create an artisan profile with a biography, location, and craft
    tradition.
-   Upload product images and manage image ordering.
-   Create, edit, publish, archive, and manage product listings.
-   Set prices, stock levels, variants, and made-to-order lead times.
-   Manage incoming orders and update fulfilment status.
-   Review sales, earnings, commissions, and payout status.
-   Update shop information and account settings.

### Administrator experience

-   Review seller applications and verification status.
-   Moderate product listings and manage reported content.
-   Manage craft categories and regional metadata.
-   View and manage orders, disputes, refunds, and platform activity.
-   Configure marketplace settings and review audit logs.

### Marketplace and platform capabilities

-   Role-based access control for buyers, sellers, and administrators.
-   Responsive desktop, tablet, and mobile layouts.
-   Server-side product search, filtering, sorting, and pagination.
-   Secure image upload and optimized image delivery.
-   Payment-provider integration and signed webhook processing.
-   Transactional email notifications.
-   SEO metadata, sitemap, and shareable filtered URLs.
-   Automated tests, error monitoring, and deployment checks.

------------------------------------------------------------------------

## User Roles

  -----------------------------------------------------------------------
  Role                                Access
  ----------------------------------- -----------------------------------
  **Buyer**                           Browse products, manage a cart and
                                      wishlist, place orders, manage
                                      addresses, and review eligible
                                      purchases.

  **Seller**                          Manage their own shop, products,
                                      inventory, orders, and permitted
                                      earnings information.

  **Administrator**                   Manage platform operations, seller
                                      review, moderation, disputes,
                                      categories, and administrative
                                      settings.
  -----------------------------------------------------------------------

Public registration should allow a user to choose **Buyer** or
**Seller**. Administrative access must be granted through a protected
process; it must never be selectable from the public registration form.

Seller verification requirements and approval workflows should be
configured according to the marketplace's operating model and applicable
requirements.

------------------------------------------------------------------------

## Design Direction

ARTSINLY should feel like a premium editorial craft marketplace---not a
generic e-commerce template.

### Visual principles

-   **Quiet interface:** Let product photography provide most of the
    colour.
-   **Editorial typography:** Use serif display headings with a clean
    sans-serif for interface text.
-   **Generous whitespace:** Keep layouts open and content easy to scan.
-   **Subtle surfaces:** Prefer fine borders and restrained shadows over
    heavy cards and gradients.
-   **Consistent imagery:** Use well-lit, high-quality product images
    and consistent aspect ratios.
-   **Responsive by default:** Use a sidebar on wider catalogue layouts
    and a filter drawer on mobile.
-   **Accessible interactions:** Provide keyboard support, visible focus
    states, meaningful labels, and sufficient contrast.

### Initial design tokens

  Token          Value       Intended use
  -------------- ----------- -------------------------------------
  Warm ivory     `#F8F5EF`   Main page background
  White          `#FFFFFF`   Cards and panels
  Charcoal       `#20201D`   Text and primary actions
  Muted bronze   `#89714F`   Restrained accents
  Sand           `#DCD0BD`   Borders and secondary surfaces
  Sage           `#52644B`   Selected success and status accents

### Typography

-   **Display headings:** DM Serif Display
-   **Interface and body:** Inter
-   **Product photography:** Prefer a consistent `4:5` aspect ratio for
    catalogue cards.
-   **Corners:** Keep most cards and controls subtly rounded rather than
    pill-shaped.
-   **Layout:** Use a consistent spacing scale, for example 4, 8, 12,
    16, 24, 32, 48, and 64 px.

### Main pages

1.  **Homepage** --- editorial introduction, featured crafts, regional
    collections, artisan stories, and featured products.
2.  **Product catalogue** --- search, filters, sorting, result count,
    and product grid.
3.  **Product details** --- gallery, product information, price, stock,
    delivery details, and artisan profile.
4.  **Artisan directory** --- discover creators by craft and region.
5.  **Artisan profile** --- biography, location, craft tradition, and
    products.
6.  **Authentication and onboarding** --- registration, login, buyer
    onboarding, and seller onboarding.
7.  **Buyer dashboard** --- orders, wishlist, addresses, and account
    settings.
8.  **Seller dashboard** --- overview, products, inventory, orders,
    earnings, and shop profile.
9.  **Admin dashboard** --- seller review, moderation, orders, disputes,
    and platform settings.

------------------------------------------------------------------------

## Technology Stack

The proposed stack is TypeScript-based and begins as a **modular
monolith**: one application with clearly separated features and
server-side responsibilities.

  -----------------------------------------------------------------------
  Layer                   Technology              Purpose
  ----------------------- ----------------------- -----------------------
  Language                TypeScript              Type-safe application
                                                  development

  Framework               Next.js App Router      Routing, server
                                                  rendering, and
                                                  application endpoints

  UI                      React                   Reusable interactive
                                                  components

  Styling                 Tailwind CSS            Responsive styling and
                                                  design tokens

  UI primitives           shadcn/ui and Radix UI  Accessible menus,
                                                  dialogs, dropdowns, and
                                                  form controls

  Icons                   Lucide                  Consistent interface
                                                  icons

  Forms                   React Hook Form and Zod Form state and schema
                                                  validation

  Database                PostgreSQL              Relational marketplace
                                                  data

  ORM                     Prisma                  Schema management,
                                                  migrations, and
                                                  database access

  Authentication          Auth.js or a suitable   Identity, sessions, and
                          managed provider        sign-in

  Image storage           Cloudinary or           Product and artisan
                          S3-compatible object    images
                          storage                 

  Search                  PostgreSQL initially;   Text search and faceted
                          Meilisearch if needed   discovery
                          later                   

  Payments                A provider that         Checkout, payment
                          supports the intended   confirmation, refunds,
                          marketplace model       and seller settlement

  Email                   Resend or another       Order and account
                          transactional email     notifications
                          provider                

  Testing                 Vitest and Playwright   Unit, integration, and
                                                  end-to-end tests

  CI/CD                   GitHub Actions          Automated checks and
                                                  deployment workflow

  Hosting                 Vercel or equivalent    Application hosting

  Monitoring              Sentry or equivalent    Error tracking and
                                                  diagnostics
  -----------------------------------------------------------------------

Exact package versions and provider capabilities should be confirmed
when implementation begins. Payment-provider approval and marketplace
settlement support must be validated before committing to a live payment
flow.

### Why a modular monolith?

A modular monolith keeps early development simpler than microservices
while maintaining boundaries between catalog, authentication, cart,
orders, payments, seller tools, and administration. Separate services
can be considered later if actual scale or operational needs justify
them.

------------------------------------------------------------------------

## Architecture

``` mermaid
flowchart TD
    Buyer[Buyers and Artisans]
    Web[Next.js Application]
    Auth[Authentication and Authorization]
    DB[(Managed PostgreSQL)]
    Storage[Image and Object Storage]
    Payment[Marketplace Payment Provider]
    Email[Transactional Email]
    Jobs[Background Jobs]
    Monitor[Monitoring and Error Tracking]

    Buyer --> Web
    Web --> Auth
    Web --> DB
    Web --> Storage
    Web --> Payment
    Web --> Email
    Web --> Jobs
    Web --> Monitor
    Payment -->|Signed Webhooks| Web
```

### Architectural guidelines

-   Keep business rules and privileged operations on the server.
-   Use server-side validation even when forms also validate in the
    browser.
-   Check ownership and permissions on every protected operation.
-   Use database transactions for order creation and inventory changes.
-   Treat payment webhooks as untrusted until their signatures and event
    details are verified.
-   Make webhook and order-processing operations idempotent.
-   Keep payment-provider, storage, and email integrations behind small
    service modules.
-   Use URL query parameters for shareable catalogue searches and
    filters.

------------------------------------------------------------------------

## Project Structure

The following is the intended structure. Create folders as features are
implemented; not every folder needs to exist on day one.

``` text
artsinly/
├── public/
│   ├── fonts/
│   ├── icons/
│   └── images/
│       ├── hero/
│       ├── crafts/
│       └── placeholders/
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── src/
│   ├── app/
│   │   ├── (storefront)/
│   │   │   ├── page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── artisans/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── crafts/[slug]/page.tsx
│   │   │   ├── regions/[slug]/page.tsx
│   │   │   ├── search/page.tsx
│   │   │   ├── cart/page.tsx
│   │   │   ├── checkout/page.tsx
│   │   │   └── about/page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── select-role/page.tsx
│   │   │   ├── buyer-onboarding/page.tsx
│   │   │   └── seller-onboarding/page.tsx
│   │   ├── buyer/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   ├── wishlist/page.tsx
│   │   │   ├── addresses/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── seller/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── products/page.tsx
│   │   │   ├── products/new/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   ├── inventory/page.tsx
│   │   │   ├── earnings/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── admin/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── sellers/page.tsx
│   │   │   ├── products/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   ├── disputes/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── api/
│   │   │   ├── webhooks/payments/route.ts
│   │   │   └── uploads/route.ts
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── products/
│   │   ├── artisans/
│   │   ├── forms/
│   │   └── feedback/
│   ├── features/
│   │   ├── auth/
│   │   ├── catalog/
│   │   ├── search/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── seller/
│   │   ├── payments/
│   │   ├── reviews/
│   │   └── notifications/
│   ├── lib/
│   │   ├── db.ts
│   │   ├── auth.ts
│   │   ├── permissions.ts
│   │   ├── payments/
│   │   ├── storage/
│   │   ├── email/
│   │   ├── validations/
│   │   ├── rate-limit.ts
│   │   └── utils.ts
│   ├── server/
│   │   ├── actions/
│   │   ├── queries/
│   │   └── services/
│   ├── hooks/
│   ├── types/
│   └── config/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .gitignore
├── components.json
├── next.config.ts
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── playwright.config.ts
├── vitest.config.ts
└── README.md
```

------------------------------------------------------------------------

## Getting Started

### Prerequisites

Install the following before setting up the project:

-   Node.js LTS compatible with the selected Next.js version
-   npm (included with Node.js)
-   Git
-   A PostgreSQL database for backend development
-   Accounts for any external services you choose to integrate

### 1. Create the application

``` bash
npx create-next-app@latest artsinly
cd artsinly
```

When prompted, select TypeScript, ESLint, Tailwind CSS, App Router, and
the `src/` directory.

### 2. Install initial dependencies

``` bash
npm install @prisma/client zod react-hook-form @hookform/resolvers
npm install lucide-react
npm install -D prisma
```

Add shadcn/ui using its current setup instructions. Install
authentication, payment, storage, email, and testing dependencies when
their respective features are introduced.

### 3. Configure environment variables

Create a local environment file:

``` bash
cp .env.example .env
```

On Windows PowerShell, if needed:

``` powershell
Copy-Item .env.example .env
```

Set the values for your local environment. Never commit `.env` or real
secrets to Git.

### 4. Configure Prisma

After defining the initial database schema, run:

``` bash
npx prisma migrate dev --name init
npx prisma generate
```

If a seed script is configured, populate development data using the seed
command supported by your Prisma version and project configuration.

### 5. Start the development server

``` bash
npm run dev
```

Open <http://localhost:3000>.

### 6. Build for production

``` bash
npm run build
npm run start
```

The production build should be run after linting and type checks pass.

------------------------------------------------------------------------

## Environment Variables

Use `.env.example` to document required configuration without storing
actual credentials.

``` dotenv
# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Database
DATABASE_URL=""

# Authentication
AUTH_SECRET=""
AUTH_URL="http://localhost:3000"

# Image storage - configure the provider you select
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Payments - use sandbox credentials during development
PAYMENT_PROVIDER_KEY_ID=""
PAYMENT_PROVIDER_KEY_SECRET=""
PAYMENT_WEBHOOK_SECRET=""

# Transactional email
EMAIL_API_KEY=""
EMAIL_FROM=""

# Monitoring - optional during initial development
SENTRY_DSN=""
```

This is a template, not a guarantee that every variable is required by
the final implementation. Variable names must match the selected
authentication, storage, payment, and monitoring SDKs. Server secrets
must never use the `NEXT_PUBLIC_` prefix.

------------------------------------------------------------------------

## Data Model

The initial relational data model includes:

  -----------------------------------------------------------------------
  Entity                              Purpose
  ----------------------------------- -----------------------------------
  `User`                              Account identity and account status

  `SellerProfile`                     Shop name, slug, biography, region,
                                      and verification status

  `Region`                            State, locality, and regional
                                      metadata

  `Category`                          Hierarchical craft categories

  `Product`                           Product description, seller,
                                      category, price, stock, and status

  `ProductImage`                      Image storage key, alt text, and
                                      display order

  `Address`                           Buyer delivery addresses

  `CartItem`                          Products and quantities in a
                                      buyer's cart

  `Order`                             Buyer, totals, order status, and
                                      address snapshot

  `OrderItem`                         Seller, product, quantity, and
                                      purchase-time price

  `Payment`                           Provider reference, amount, and
                                      payment status

  `Shipment`                          Carrier, tracking details, and
                                      shipment status

  `Review`                            Buyer feedback and product rating

  `WishlistItem`                      Saved products

  `Payout`                            Seller settlement records

  `AuditLog`                          Administrative and
                                      security-relevant actions
  -----------------------------------------------------------------------

### Data integrity principles

-   Use database constraints and indexes for important relationships and
    unique fields.
-   Store money in integer minor units (for example, paise for INR) or
    an appropriate exact numeric type---never floating-point values for
    financial calculations.
-   Snapshot item prices and relevant seller information when an order
    is placed.
-   Separate payment, order, shipment, refund, and payout states.
-   Use transactions for stock reservation and order creation.
-   Define how cancelled orders, refunds, failed payments, and partial
    fulfilment affect inventory and payouts.

------------------------------------------------------------------------

## Key User Flows

### Buyer flow

1.  Browse or search the catalogue.
2.  Filter products by craft, region, and price.
3.  Open a product page and learn about its artisan.
4.  Add the product to the cart.
5.  Enter or select a delivery address.
6.  Complete checkout through the configured payment provider.
7.  Receive an order confirmation and follow fulfilment.
8.  Review the product after an eligible purchase.

### Seller flow

1.  Register and select the seller account type.
2.  Complete shop details and any required verification.
3.  Create a product listing and upload images.
4.  Set pricing, stock, and fulfilment details.
5.  Publish the product when permitted.
6.  Receive and fulfil orders.
7.  Review earnings and payout records.

### Administrator flow

1.  Review seller applications where approval is required.
2.  Moderate product listings and reports.
3.  Manage categories and regional metadata.
4.  Investigate disputes and coordinate permitted refunds.
5.  Review operational events and audit logs.

------------------------------------------------------------------------

## Security and Reliability

Security must be built into each feature rather than postponed until
launch.

-   Enforce server-side authentication, role checks, and resource
    ownership.
-   Never trust a client-provided role, price, discount, seller ID, or
    payment status.
-   Validate and normalize all input on the server.
-   Apply rate limits to login, registration, uploads, and other
    sensitive endpoints.
-   Restrict upload formats and file sizes; use safe storage and access
    policies.
-   Verify payment signatures and process webhook events idempotently.
-   Avoid logging passwords, access tokens, payment secrets, or
    unnecessary personal data.
-   Use secure session and cookie settings appropriate to the
    deployment.
-   Configure database backups and test the restoration process.
-   Monitor errors, failed payments, unusual activity, and operational
    health.
-   Provide appropriate privacy, retention, and deletion practices.
-   Keep dependencies updated and review security advisories.

Before a real launch, assess the applicable Indian e-commerce, consumer
protection, privacy, tax, seller verification, and payment settlement
requirements with qualified advisers.

------------------------------------------------------------------------

## Testing

Use automated tests at multiple levels.

  -----------------------------------------------------------------------
  Test type                           What to test
  ----------------------------------- -----------------------------------
  Unit                                Price calculations, validation
                                      schemas, filter parsing, and
                                      business rules

  Integration                         Database queries, permissions,
                                      stock changes, order creation, and
                                      webhook processing

  End-to-end                          Registration, seller onboarding,
                                      product creation, catalogue
                                      filtering, cart, checkout, and
                                      order tracking

  Security                            Unauthorized access, cross-seller
                                      data access, invalid uploads, and
                                      tampered prices

  Accessibility                       Keyboard navigation, form labels,
                                      focus states, and contrast

  Performance                         Image loading, catalogue response
                                      times, and high-traffic endpoints
  -----------------------------------------------------------------------

Suggested commands, depending on the scripts configured in
`package.json`:

``` bash
npm run lint
npx tsc --noEmit
npm run test
npm run test:e2e
npm run build
```

Not all scripts exist automatically. Configure the matching package
scripts and test tools before relying on these commands in CI.

------------------------------------------------------------------------

## Deployment

### Recommended deployment approach

-   **Application:** Vercel or an equivalent Next.js-compatible host.
-   **Database:** Managed PostgreSQL with backups and controlled network
    access.
-   **Images:** Cloudinary or private/public object storage according to
    access requirements.
-   **Payments:** Approved live marketplace account with verified
    webhook configuration.
-   **Email:** Configured transactional email provider and verified
    sending domain.
-   **Monitoring:** Error tracking, structured logs, and deployment
    alerts.
-   **Domain:** Custom domain with HTTPS.

### Environments

Maintain separate **development**, **staging**, and **production**
configurations. Use sandbox payment credentials outside production and
keep all environments' secrets separate.

### Release checklist

-   [ ] Required environment variables are configured.
-   [ ] Database migrations have been reviewed and applied safely.
-   [ ] Authentication and role-based access checks have been tested.
-   [ ] Payment callbacks and webhook signatures have been verified.
-   [ ] Order, refund, and inventory edge cases have been tested.
-   [ ] Backups and recovery procedures have been checked.
-   [ ] Privacy, terms, shipping, return, and seller policies are
    published.
-   [ ] Accessibility, mobile responsiveness, SEO, and performance have
    been reviewed.
-   [ ] Monitoring and alerting are enabled.
-   [ ] A rollback plan is available.

------------------------------------------------------------------------

## Development Roadmap

  -----------------------------------------------------------------------
  Phase                   Focus                   Expected outcome
  ----------------------- ----------------------- -----------------------
  **Phase 1 ---           Project setup, design   A polished clickable
  Foundation**            tokens, navigation,     prototype
                          responsive storefront,  
                          sample catalogue        

  **Phase 2 --- Core      PostgreSQL, Prisma,     Persistent user and
  data**                  authentication, roles,  product data
                          artisan profiles, real  
                          catalogue queries       

  **Phase 3 --- Seller    Product creation, image Sellers can manage
  tools**                 uploads, pricing,       their shops
                          inventory, listing      
                          status                  

  **Phase 4 --- Buying    Search, filters,        A complete buyer
  experience**            wishlist, cart,         journey
                          addresses, order        
                          creation                

  **Phase 5 ---           Payment integration,    End-to-end marketplace
  Marketplace             seller fulfilment,      workflows
  operations**            refunds, notifications, 
                          admin tools             

  **Phase 6 ---           Security review,        A release candidate
  Production readiness**  automated testing,      ready for launch review
                          monitoring, backups,    
                          compliance review       
  -----------------------------------------------------------------------

Prioritize a reliable end-to-end flow over adding many features at once.
Start with a small set of craft categories and verified sample listings,
then expand based on real seller and buyer feedback.

------------------------------------------------------------------------

## Contributing

Contributions and improvements are welcome.

1.  Create an issue describing the feature, bug, or design improvement.
2.  Fork the repository or create a feature branch.
3.  Keep changes focused and follow the existing project structure.
4.  Add or update tests for changed behaviour.
5.  Run linting, type checking, tests, and the production build.
6.  Submit a pull request with a clear summary and screenshots for UI
    changes.

Suggested branch names:

``` text
feature/product-catalogue
feature/seller-onboarding
feature/cart-checkout
fix/inventory-validation
docs/setup-guide
```

Do not commit secrets, real customer information, production database
exports, or unlicensed artwork.

## License

Choose and add a license before publishing the repository for reuse. If
you intend to keep the code proprietary, state the applicable terms
clearly. If you want others to reuse and contribute under an open-source
license, select one that matches your goals.

------------------------------------------------------------------------

## Project Summary

**ARTSINLY** is a proposed regional artisan marketplace built around
discovery, craftsmanship, and seller independence. Its design
prioritizes high-quality product photography, editorial typography,
subtle colours, and simple navigation, while its architecture supports
buyer accounts, seller shops, product management, search, orders,
payments, and administrative operations.

The long-term goal is to create a dependable digital marketplace where
regional artisans can present their work professionally and buyers can
discover the stories, skills, and traditions behind each craft.

**Built with a focus on craft, culture, and thoughtful commerce.**
