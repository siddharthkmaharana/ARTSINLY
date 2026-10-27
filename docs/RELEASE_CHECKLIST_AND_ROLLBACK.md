# ARTISANLY --- Release Checklist, Rollback Runbook & Operational Procedures

This operational runbook defines the pre-flight checks, release checklist, zero-downtime rollback procedures, and incident recovery guidelines for the ARTISANLY craft marketplace, adhering to Phase 8 specifications in `IMPLEMENTATION_PLAN.md`.

---

## 1. Production Release Pre-Flight Checklist

Before deploying any release to production, the release coordinator and technical team must verify all items:

### A. Code Quality & Invariants
- [ ] **TypeScript Typecheck**: `npx tsc --noEmit` exits with status `0` and zero diagnostics.
- [ ] **Linting**: `npm run lint` passes without errors.
- [ ] **Database Invariants**: `npm run test:db-rules` passes (59 tests: UUID non-guessable IDs, zero IEEE 754 floats, integer paise, order immutability, state separation).
- [ ] **Seller Isolation**: `npm run test:seller-products` passes (55 tests: ownership authorization, craft specifications, GI verification).
- [ ] **Multi-Vendor Checkout**: `npm run test:multivendor` passes (34 tests: 10-step flowchart, Rule 1-6 compliance, partial fulfillment).
- [ ] **Payments & Legal**: `npm run test:payments-legal` passes (39 tests: Section 194-O, 84/15/1 split, CPA 2020 grievances, legal references).
- [ ] **System Health & Backups**: `npm run test:system` passes (38 tests: health check, backups, rate limiting, SEO).

### B. Secrets & Environment Variables Validation
Ensure no dummy keys or debug secrets are present in `.env.production`:
- [ ] `DATABASE_URL`: Production PostgreSQL connection string with SSL enabled (`sslmode=require`).
- [ ] `AUTH_SECRET`: Cryptographically strong 32+ character random secret (`openssl rand -base64 32`).
- [ ] `PAYMENT_PROVIDER_KEY_ID`: Production Razorpay Route / Gateway Key ID.
- [ ] `PAYMENT_PROVIDER_KEY_SECRET`: Production Gateway Secret (never commit to git or expose in client bundles).
- [ ] `PAYMENT_WEBHOOK_SECRET`: Gateway signed webhook secret for HMAC-SHA256 signature verification.
- [ ] `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` or AWS S3 credentials configured for authenticated asset storage.
- [ ] `EMAIL_API_KEY` & `EMAIL_FROM`: Transactional email provider verified domain (`orders@artsinly.com`).

### C. Database Migration & Integrity
- [ ] Backup created immediately prior to deployment: `POST /api/admin/backups` or `pg_dump`.
- [ ] Migration diff verified non-destructive (no unannounced column drops or table truncates).
- [ ] Run migration: `npx prisma migrate deploy`.

---

## 2. Zero-Downtime Rollback Runbook

If an unrecoverable bug, checkout failure, or fatal exception occurs post-deployment:

### Step 1: Immediate Triage (< 5 Minutes)
1. Check `/api/health` status.
2. Monitor error frequency in logs and telemetry beacon (`/api/monitoring/vitals`).
3. If checkout or payment verification is affected, temporarily toggle maintenance or sandbox fallback to prevent corrupted orders.

### Step 2: Deployment Reversion
- **Vercel / Cloud Platform**:
  1. Navigate to the deployment dashboard.
  2. Locate the last known good deployment tag (e.g., `git rev-parse HEAD~1`).
  3. Click **Instant Rollback** to redirect 100% of incoming traffic to the previous build.
  4. Instant rollback takes effect in < 15 seconds at the edge.
- **Self-Hosted / Containerized**:
  ```bash
  # Pull previous stable container image
  docker pull artsinly/app:previous-stable
  docker-compose up -d --no-deps app
  ```

### Step 3: Database Point-In-Time Restoration
If database schema changes or data corruption occurred:
1. List available snapshots:
   `GET /api/admin/backups` (or inspect `/backups` directory).
2. Verify backup checksum:
   ```bash
   sha256sum backups/artsinly-backup-YYYY-MM-DDTHH-MM-SS-MSZ.json
   ```
3. Restore database snapshot using the administration restore command:
   ```bash
   node -e "require('./src/lib/backup').restoreDatabaseBackup('artsinly-backup-YYYY-MM-DDTHH-MM-SS-MSZ.json')"
   ```
4. Verify record counts match pre-release metrics.

---

## 3. Incident Response & Escalation Matrix

| Severity | Description | Response Time | Action |
|---|---|---|---|
| **P0 - Blocker** | Payment gateway failure, data loss, security exposure, total checkout outage | < 15 minutes | Immediate rollback, alert Lead Engineer & Grievance Officer, notify affected users |
| **P1 - Critical** | Single seller cannot fulfill orders, webhook retry storm, image upload failure | < 1 hour | Hotfix release or fallback provider switch, manual ledger audit |
| **P2 - Moderate** | Minor UI rendering discrepancy, non-critical filter issue, telemetry delay | < 24 hours | Scheduled patch in next sprint cycle |

### Nodal Grievance & Legal Escalation
- **Nodal Grievance Officer**: Siddharth K. Maharana
- **Email**: `grievance@artsinly.com`
- **Statutory Acknowledgment**: Within 48 hours (Consumer Protection E-Commerce Rules 2020)
- **Resolution SLA**: Maximum 30 days from ticket receipt.

---

## 4. Post-Release Verification Checklist
Immediately after deploying to production:
1. [ ] Perform smoke purchase with test card/UPI on `/checkout`.
2. [ ] Verify buyer order confirmation email is queued.
3. [ ] Verify seller portal `/seller/dashboard` displays newly allocated order item.
4. [ ] Verify admin metrics `/admin` reflects accurate 84% artisan net, 15% commission, 1% TDS split.
5. [ ] Verify sitemap `/sitemap.xml` and robots `/robots.txt` respond with HTTP 200.
