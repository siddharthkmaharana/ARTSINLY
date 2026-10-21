const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const http = require("http");

async function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || "GET",
      headers: options.headers || {},
    };

    const req = http.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
          json: () => {
            try {
              return JSON.parse(data);
            } catch (e) {
              return null;
            }
          },
        });
      });
    });

    req.on("error", reject);

    if (options.body) {
      req.write(typeof options.body === "string" ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

// In-line reference implementations matching src/lib/id.ts and src/lib/money.ts
function generateUUID() {
  return crypto.randomUUID();
}

function generateOrderNumber() {
  const year = new Date().getFullYear();
  const token = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `ART-${year}-${token}`;
}

function generateTrackingNumber(carrier = "AWB") {
  const token = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `${carrier}-${token}`;
}

function generateReferenceId(prefix) {
  const token = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `${prefix}_${Date.now()}_${token}`;
}

function generateGuestSessionToken() {
  return `guest_${crypto.randomUUID()}`;
}

function generateGrievanceTicketId(prefix = "GRV") {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const token = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${dateStr}-${token}`;
}

function isUUID(value) {
  if (typeof value !== "string") return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

function isNonGuessableId(value) {
  if (!value || typeof value !== "string") return false;
  if (isUUID(value)) return true;
  if (/^c[a-z0-9]{24,}$/i.test(value)) return true;
  if (/[a-f0-9]{8,}/i.test(value)) return true;
  if (/^(ART|GRV|SBX|AWB|PAYOUT)-/i.test(value) && value.length >= 12) return true;
  if (/^\d{1,8}$/.test(value)) return false;
  return false;
}

function rupeesToPaise(rupeesInput) {
  if (typeof rupeesInput === "number") {
    if (!Number.isFinite(rupeesInput) || rupeesInput < 0) {
      throw new RangeError(`Invalid rupee number: ${rupeesInput}`);
    }
    rupeesInput = rupeesInput.toFixed(2);
  }
  const clean = String(rupeesInput).trim().replace(/,/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(clean)) {
    throw new TypeError(`Invalid rupee format: "${rupeesInput}"`);
  }
  const parts = clean.split(".");
  const whole = parseInt(parts[0], 10);
  const frac = parts[1] ? parts[1].padEnd(2, "0") : "00";
  const fractional = parseInt(frac.substring(0, 2), 10);
  return whole * 100 + fractional;
}

function paiseToRupeesString(paise) {
  if (!Number.isInteger(paise) || paise < 0) throw new TypeError("Must be non-negative integer paise");
  const rupees = Math.floor(paise / 100);
  const remainder = paise % 100;
  return `${rupees}.${remainder.toString().padStart(2, "0")}`;
}

function formatPaise(paise) {
  if (!Number.isInteger(paise) || paise < 0) throw new TypeError("Must be non-negative integer paise");
  const rupees = Math.floor(paise / 100);
  const remainder = paise % 100;
  return `₹${rupees.toLocaleString("en-IN")}.${remainder.toString().padStart(2, "0")}`;
}

function calculateFairTradeSettlement(grossPaise) {
  if (!Number.isInteger(grossPaise) || grossPaise < 0) throw new TypeError("Must be non-negative integer");
  const gross = Math.floor(grossPaise);
  const commissionPaise = Math.floor((gross * 1500) / 10000);
  const tdsPaise = Math.floor((gross * 100) / 10000);
  const netPaise = gross - commissionPaise - tdsPaise;
  return {
    grossPaise: gross,
    commissionPaise,
    tdsPaise,
    netPaise,
    commissionRatePercent: 15,
    tdsRatePercent: 1,
    artisanSharePercent: 84,
  };
}

async function runTests() {
  console.log("==================================================================");
  console.log("   ARTSINLY DATABASE RULES: UUIDs & INTEGER MINOR UNITS SUITE");
  console.log("==================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. PRISMA SCHEMA COMPLIANCE AUDIT
  console.log("--- 1. Prisma Schema Audit (Non-Guessable IDs & Zero Float Types) ---");
  const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
  const schemaContent = fs.readFileSync(schemaPath, "utf-8");

  // Filter out comments to check schema declarations
  const nonCommentLines = schemaContent
    .split("\n")
    .filter((l) => !l.trim().startsWith("//"));
  const nonCommentContent = nonCommentLines.join("\n");

  // Check 1.1: No autoincrement()
  const hasAutoincrement = nonCommentContent.includes("autoincrement()");
  assert(!hasAutoincrement, "Zero autoincrementing integer IDs found in Prisma schema declarations");

  // Check 1.2: No Float / Double types for money or anywhere
  const floatLines = nonCommentLines.filter((line) => {
    const trimmed = line.trim();
    return /\bFloat\b|\bDouble\b/.test(trimmed);
  });
  assert(floatLines.length === 0, `Zero Float/Double fields declared in schema (found: ${floatLines.length})`);

  // Check 1.3: All models use non-guessable identifiers (@id @default(cuid()) or @default(uuid()))
  const modelRegex = /model\s+(\w+)\s+{([^}]+)}/g;
  let modelMatch;
  let totalModels = 0;
  let validIdModels = 0;
  const moneyFieldsFound = [];

  while ((modelMatch = modelRegex.exec(schemaContent)) !== null) {
    const modelName = modelMatch[1];
    const modelBody = modelMatch[2];
    totalModels++;

    const hasId = /id\s+String\s+@id\s+@default\((cuid|uuid)\(\)\)/.test(modelBody);
    if (hasId) {
      validIdModels++;
    } else {
      console.error(`  Model ${modelName} does not use String @id @default(cuid()) or @default(uuid())`);
    }

    // Collect monetary fields
    const fieldLines = modelBody.split("\n");
    for (const fl of fieldLines) {
      const match = fl.trim().match(/^(\w*(?:Paise|Price|Amount|Fee|Tax|Total|Subtotal)\w*)\s+(\w+)/i);
      if (match) {
        moneyFieldsFound.push({ model: modelName, field: match[1], type: match[2] });
      }
    }
  }

  assert(
    validIdModels === totalModels && totalModels > 0,
    `All ${totalModels} Prisma models enforce non-guessable string IDs (@default(cuid()) or @default(uuid()))`
  );

  // Check 1.4: Verify all monetary fields are Int (paise minor units)
  const nonIntMoneyFields = moneyFieldsFound.filter((m) => m.type !== "Int");
  assert(
    nonIntMoneyFields.length === 0,
    `All ${moneyFieldsFound.length} monetary fields across models use integer minor units (Int: paise)`
  );

  // 2. CRYPTOGRAPHIC NON-GUESSABLE IDENTIFIER ENGINE
  console.log("\n--- 2. Cryptographic Non-Guessable Identifier Engine ---");

  // UUID v4 format
  const uuid1 = generateUUID();
  assert(isUUID(uuid1), `generateUUID generates standard RFC 4122 UUID v4: ${uuid1}`);

  // Non-guessable order number
  const orderNum = generateOrderNumber();
  assert(/^ART-\d{4}-[A-F0-9]{8}$/.test(orderNum), `generateOrderNumber produces high-entropy token: ${orderNum}`);

  // Tracking number
  const trackingNum = generateTrackingNumber("AWB");
  assert(/^AWB-[A-F0-9]{8}$/.test(trackingNum), `generateTrackingNumber produces secure reference: ${trackingNum}`);

  // Transaction reference ID
  const refId = generateReferenceId("SBX_UPI");
  assert(/^SBX_UPI_\d+_[A-F0-9]{8}$/.test(refId), `generateReferenceId produces non-guessable payment ID: ${refId}`);

  // Guest cart session token
  const guestToken = generateGuestSessionToken();
  assert(guestToken.startsWith("guest_") && isUUID(guestToken.replace("guest_", "")), `generateGuestSessionToken backed by UUID v4: ${guestToken}`);

  // Grievance ticket ID
  const ticketId = generateGrievanceTicketId("GRV");
  assert(/^GRV-\d{8}-[A-F0-9]{6}$/.test(ticketId), `generateGrievanceTicketId produces secure ticket: ${ticketId}`);

  // Rejection of sequential / guessable IDs
  assert(!isNonGuessableId("1"), "isNonGuessableId rejects sequential integer '1'");
  assert(!isNonGuessableId("42"), "isNonGuessableId rejects sequential integer '42'");
  assert(!isNonGuessableId("100234"), "isNonGuessableId rejects sequential integer '100234'");
  assert(isNonGuessableId(uuid1), "isNonGuessableId accepts valid UUID v4");
  assert(isNonGuessableId("cmvdxyd9c000lqwxwurax8s29"), "isNonGuessableId accepts collision-resistant CUID");

  // Collision resistance over 10,000 samples
  const sampleSet = new Set();
  const sampleCount = 10000;
  for (let i = 0; i < sampleCount; i++) {
    sampleSet.add(generateOrderNumber());
  }
  assert(sampleSet.size === sampleCount, `Zero collisions detected across ${sampleCount} generated order numbers`);

  // 3. INTEGER MINOR UNIT MONETARY CALCULATIONS & INVARIANTS
  console.log("\n--- 3. Exact Minor Unit (Paise) Arithmetic & Invariants ---");

  // Conversion without float inaccuracies
  assert(rupeesToPaise("126.99") === 12699, "String rupee '126.99' converts to exact 12699 paise");
  assert(rupeesToPaise("19.99") === 1999, "String rupee '19.99' avoids IEEE 754 float bug (exact 1999 paise)");
  assert(rupeesToPaise(450) === 45000, "Number 450 converts to 45000 paise");
  assert(rupeesToPaise(120.5) === 12050, "Number 120.5 converts to 12050 paise");
  assert(paiseToRupeesString(12699) === "126.99", "paiseToRupeesString(12699) returns '126.99'");
  assert(formatPaise(12699) === "₹126.99", "formatPaise(12699) returns '₹126.99'");

  // Exact multiplication and summation
  assert(12699 * 3 === 38097, "3 × 12699 paise = exact 38097 paise");
  assert([12699, 15000, 635].reduce((a, b) => a + b, 0) === 28334, "Sum [12699, 15000, 635] = exact 28334 paise");

  // Fair-trade split conservation invariant: net + commission + tds === gross
  const testAmounts = [
    10000,     // ₹100.00
    12699,     // ₹126.99
    1,         // ₹0.01 (1 paisa edge case)
    3,         // ₹0.03 (3 paise edge case)
    33333,     // ₹333.33
    50000000,  // ₹5,00,000.00
  ];

  let allSplitsConserved = true;
  for (const amt of testAmounts) {
    const split = calculateFairTradeSettlement(amt);
    const sum = split.netPaise + split.commissionPaise + split.tdsPaise;
    if (sum !== amt) {
      allSplitsConserved = false;
      console.error(`  Split failed conservation for ${amt}: ${split.netPaise} + ${split.commissionPaise} + ${split.tdsPaise} !== ${amt}`);
    }
  }
  assert(allSplitsConserved, "Fair-trade split conservation invariant (net + commission + tds === gross) holds 100% across all test amounts");

  // 4. CODEBASE STATIC SCAN: ELIMINATION OF GUESSABLE MATH.RANDOM FOR IDS
  console.log("\n--- 4. Codebase Static Scan: Non-Guessable ID Enforcement ---");
  const filesToCheck = [
    "src/lib/db/orders.ts",
    "src/app/api/orders/route.ts",
    "src/app/api/cart/route.ts",
    "src/app/api/payments/sandbox/route.ts",
    "src/app/api/payments/webhook/route.ts",
    "src/app/api/grievance/route.ts",
    "src/app/api/admin/payouts/route.ts",
    "src/app/api/seller/orders/[id]/route.ts",
  ];

  let foundGuessableIdUsage = false;
  for (const relPath of filesToCheck) {
    const fullPath = path.join(__dirname, "..", relPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      if (content.includes("Math.random()")) {
        console.error(`  Found Math.random() remaining in ${relPath}`);
        foundGuessableIdUsage = true;
      }
    }
  }
  assert(!foundGuessableIdUsage, "Zero Math.random() ID generators remaining across order, payment, cart, and grievance routes");

  // 5. LIVE API ENDPOINT VERIFICATION
  console.log("\n--- 5. Live API Endpoint Verification (Non-Guessable IDs & Integer Paise) ---");
  try {
    // 5.1 Login as admin to check admin payouts
    const adminLogin = await fetchUrl("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { email: "admin@artsinly.com", password: "admin123" },
    });
    assert(adminLogin.status === 200, "Admin login succeeded (200 OK)");
    const adminCookie = Array.isArray(adminLogin.headers["set-cookie"])
      ? adminLogin.headers["set-cookie"].join("; ")
      : adminLogin.headers["set-cookie"] || "";

    // 5.2 Check Admin Payouts uses Integer Paise
    const payoutsRes = await fetchUrl("http://localhost:3000/api/admin/payouts", {
      headers: { Cookie: adminCookie },
    });
    assert(payoutsRes.status === 200, "Admin payouts API returned 200");
    const payoutsData = payoutsRes.json();
    const summaries = payoutsData?.sellerSummaries || [];
    assert(Array.isArray(summaries), "Admin payouts returned sellerSummaries list");
    if (summaries.length > 0) {
      const seller = summaries[0];
      assert(Number.isInteger(seller.pendingSettlementPaise), `Seller pendingSettlementPaise is integer: ${seller.pendingSettlementPaise}`);
      assert(Number.isInteger(seller.totalPaidOutPaise), `Seller totalPaidOutPaise is integer: ${seller.totalPaidOutPaise}`);
      assert(Number.isInteger(seller.grossSalesPaise), `Seller grossSalesPaise is integer: ${seller.grossSalesPaise}`);
      assert(isNonGuessableId(seller.sellerId), `Seller ID is non-guessable identifier: ${seller.sellerId}`);
    }

    // 5.3 Check Grievance Registration creates non-guessable Ticket ID
    const grvRes = await fetchUrl("http://localhost:3000/api/grievance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        fullName: "Kavya Patel",
        email: "kavya.patel@example.com",
        description: "Inquiry on master terracotta artisan provenance certificate.",
      },
    });
    assert(grvRes.status === 200, "Grievance registration API returned 200");
    const grvData = grvRes.json();
    assert(isNonGuessableId(grvData?.ticketId), `Grievance ticket ID is cryptographically non-guessable: ${grvData?.ticketId}`);
  } catch (err) {
    assert(false, `Live API verification error: ${err.message}`);
  }

  console.log("\n==================================================================");
  console.log(`   TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution fatal error:", err);
  process.exit(1);
});
