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

async function runTests() {
  console.log("==================================================================");
  console.log("   ARTSINLY PAYMENT ONBOARDING & LEGAL REVIEWS VERIFICATION SUITE");
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

  // 1. ADMIN AUTHENTICATION
  console.log("--- 1. Authentication for Compliance & Onboarding APIs ---");
  let adminCookie = "";
  let sellerCookie = "";
  try {
    const adminLogin = await fetchUrl("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { email: "admin@artsinly.com", password: "admin123" },
    });
    assert(adminLogin.status === 200, `Admin authentication succeeded (200 OK)`);
    const setCookie = adminLogin.headers["set-cookie"];
    adminCookie = Array.isArray(setCookie) ? setCookie.join("; ") : setCookie || "";

    const sellerLogin = await fetchUrl("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { email: "devendra.prajapati@artsinly.com", password: "password123" },
    });
    assert(sellerLogin.status === 200, `Artisan seller authentication succeeded (200 OK)`);
    const sCookie = sellerLogin.headers["set-cookie"];
    sellerCookie = Array.isArray(sCookie) ? sCookie.join("; ") : sCookie || "";
  } catch (err) {
    assert(false, `Login error: ${err.message}`);
  }

  // 2. PAYMENT PROVIDER ONBOARDING STATUS
  console.log("\n--- 2. Payment Provider Onboarding & Compliance Engine ---");
  try {
    const res = await fetchUrl("http://localhost:3000/api/payments/onboarding", {
      headers: { Cookie: adminCookie },
    });
    assert(res.status === 200, `Provider onboarding endpoint responded 200`);
    const data = res.json();
    assert(Boolean(data?.onboarding?.provider), `Gateway Provider configured: ${data?.onboarding?.provider}`);
    assert(data?.onboarding?.merchantCategoryCode === "5971", `Merchant Category Code is 5971 (Art & Handicrafts)`);
    assert(data?.onboarding?.settlementFrequencyDays === 2, `Settlement frequency is T+2 business days`);
    assert(data?.guidance?.rbiRegulation !== undefined, `RBI PAPG regulatory guideline reference embedded`);
  } catch (err) {
    assert(false, `Provider onboarding error: ${err.message}`);
  }

  // 3. ARTISAN BANK ONBOARDING & TAX CREDENTIALS (194-O)
  console.log("\n--- 3. Artisan Bank Onboarding & Tax Credentials ---");
  try {
    const bankRes = await fetchUrl("http://localhost:3000/api/seller/payout-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: sellerCookie,
      },
      body: {
        accountHolderName: "Devendra Prajapati",
        accountNumber: "50100456789123",
        confirmAccountNumber: "50100456789123",
        ifscCode: "HDFC0001234",
        bankName: "HDFC Bank, Kutch Branch",
        panNumber: "ABCDE1234F",
        gstin: "EXEMPT",
        taxExemptionDeclared: true,
      },
    });
    assert(bankRes.status === 200, `Seller bank onboarding submitted successfully (200 OK)`);
    const bankData = bankRes.json();
    assert(bankData?.account?.status === "VERIFIED", `Bank account verification status: VERIFIED`);
    assert(bankData?.account?.maskedAccountNumber?.includes("••••"), `Account number masked for security: ${bankData?.account?.maskedAccountNumber}`);

    // Fetch verified account
    const getBankRes = await fetchUrl("http://localhost:3000/api/seller/payout-account", {
      headers: { Cookie: sellerCookie },
    });
    assert(getBankRes.status === 200, `GET seller payout account responded 200`);
    const getBankData = getBankRes.json();
    assert(getBankData?.account?.isOnboarded === true, `Artisan account marked as onboarded`);
    assert(getBankData?.account?.ifscCode === "HDFC0001234", `IFSC code matches: HDFC0001234`);
  } catch (err) {
    assert(false, `Bank onboarding error: ${err.message}`);
  }

  // 4. ARTISAN PAYOUT ECONOMICS (84% SHARE, 15% COMMISSION, 1% TDS)
  console.log("\n--- 4. Artisan Payout Economics & Ledger ---");
  try {
    const payoutRes = await fetchUrl("http://localhost:3000/api/seller/payouts", {
      headers: { Cookie: sellerCookie },
    });
    assert(payoutRes.status === 200, `Seller payouts API responded 200`);
    const payoutData = payoutRes.json();
    assert(payoutData?.summary?.feeStructure?.artisanSharePercent === 84, `Net Artisan Remittance is 84%`);
    assert(payoutData?.summary?.feeStructure?.commissionPercent === 15, `Marketplace Platform Commission is 15%`);
    assert(payoutData?.summary?.feeStructure?.tdsPercent === 1, `Statutory Section 194-O TDS is 1%`);
    assert(typeof payoutData?.summary?.pendingSettlementPaise === "number", `Pending settlement balance reported`);
  } catch (err) {
    assert(false, `Payouts error: ${err.message}`);
  }

  // 5. WEBHOOK SIGNATURE VERIFICATION & IDEMPOTENCY
  console.log("\n--- 5. Payment Gateway Webhook Engine & Idempotency ---");
  try {
    const eventId = `evt_test_${Date.now()}`;
    const webhookPayload = {
      id: eventId,
      event: "payment.captured",
      payment: {
        id: `pay_${Date.now()}`,
        amount: 250000,
        notes: { orderNumber: "ORD-TEST-WEBHOOK" },
      },
    };

    // First delivery -> should be processed
    const hookRes1 = await fetchUrl("http://localhost:3000/api/payments/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Signature": "artsinly_dev_signature_valid",
      },
      body: webhookPayload,
    });
    assert(hookRes1.status === 200, `Webhook processed successfully (status 200)`);
    const hookData1 = hookRes1.json();
    assert(hookData1?.received === true && hookData1?.processed === true, `Event recognized and processed`);

    // Duplicate delivery with same eventId -> should be deduplicated (idempotent)
    const hookRes2 = await fetchUrl("http://localhost:3000/api/payments/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Signature": "artsinly_dev_signature_valid",
      },
      body: webhookPayload,
    });
    assert(hookRes2.status === 200, `Duplicate webhook responded 200 OK`);
    const hookData2 = hookRes2.json();
    assert(hookData2?.duplicate === true, `Duplicate webhook event recognized and deduplicated (idempotent)`);
  } catch (err) {
    assert(false, `Webhook test error: ${err.message}`);
  }

  // 6. STATUTORY CONSUMER GRIEVANCE REDRESSAL API
  console.log("\n--- 6. Statutory Consumer Grievance Redressal (CPA 2020) ---");
  try {
    const grvRes = await fetchUrl("http://localhost:3000/api/grievance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        fullName: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        phone: "+91 98765 43210",
        orderNumber: "ORD-1729000-TEST",
        category: "DELIVERY_DAMAGE",
        description: "Small hairline chip on base of terracotta vase upon unboxing.",
      },
    });
    assert(grvRes.status === 200, `Grievance API responded 200`);
    const grvData = grvRes.json();
    assert(grvData?.ticketId?.startsWith("GRV-"), `Statutory Ticket ID generated: ${grvData?.ticketId}`);
    assert(grvData?.sla?.acknowledgementWithinHours === 48, `48-hour statutory acknowledgement SLA committed`);
    assert(grvData?.sla?.resolutionDays === 30, `30-day statutory resolution window committed`);
    assert(Boolean(grvData?.sla?.officer), `Nodal Grievance Officer identified: ${grvData?.sla?.officer}`);
  } catch (err) {
    assert(false, `Grievance API error: ${err.message}`);
  }

  // 7. STATUTORY LEGAL PAGES RENDERING & DISCLOSURES
  console.log("\n--- 7. Public Statutory Legal Pages ---");
  const legalPages = [
    { path: "/terms", title: "Terms of Service", check: "Information Technology Act, 2000" },
    { path: "/privacy", title: "Privacy Policy", check: "Digital Personal Data Protection Act, 2023" },
    { path: "/shipping", title: "Shipping & Logistics", check: "PAN-India" },
    { path: "/refunds", title: "Returns & Refunds", check: "Consumer Protection (E-Commerce) Rules, 2020" },
    { path: "/seller-policy", title: "Artisan Seller Agreement", check: "84%" },
    { path: "/grievance", title: "Consumer Grievance Portal", check: "Nodal Grievance Officer" },
  ];

  for (const page of legalPages) {
    try {
      const res = await fetchUrl(`http://localhost:3000${page.path}`);
      assert(res.status === 200, `Page ${page.path} responded 200 OK`);
      assert(res.body.includes(page.check), `Page ${page.path} contains statutory reference: "${page.check}"`);
    } catch (err) {
      assert(false, `Failed to load ${page.path}: ${err.message}`);
    }
  }

  console.log("\n==================================================================");
  console.log(`   TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================================");
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
