/**
 * ARTSINLY - SELLER PRODUCT MANAGEMENT SPECIFICATION VERIFICATION SUITE
 * 
 * Verifies:
 * 1. Proposed product-upload form specifications:
 *    - Product name
 *    - Craft category (default: "Painting")
 *    - Region of origin (default: "Odisha")
 *    - Price (₹) -> integer minor units (paise) with zero floating-point math
 *    - Available quantity
 *    - Description
 *    - [ ] Made to order checkbox
 * 2. PRODUCT PREVIEW live rendering specification:
 *    - "Your product name" fallback
 *    - "Painting · Odisha" category and origin representation
 *    - "₹1,200" formatted price
 *    - "1 available" or "Made to order" availability state
 * 3. Security invariants:
 *    - Non-guessable IDs (CUID / UUID v4)
 *    - Zero float math for monetary calculations
 * 4. API endpoints:
 *    - POST /api/seller/products
 *    - GET /api/seller/products
 *    - PUT /api/seller/products/[id]
 *    - DELETE /api/seller/products/[id]
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const http = require("http");

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = "") {
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName} ${details ? `(${details})` : ""}`);
  }
}

// In-line monetary utility matching src/lib/money.ts
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

function formatINRPreviewPrice(val) {
  if (!val || !String(val).trim()) return "₹1,200";
  try {
    const clean = String(val).replace(/,/g, "").trim();
    const num = parseFloat(clean);
    if (isNaN(num) || num < 0) return "₹1,200";
    return `₹${Math.floor(num).toLocaleString("en-IN")}${
      clean.includes(".") ? "." + clean.split(".")[1].substring(0, 2) : ""
    }`;
  } catch {
    return "₹1,200";
  }
}

function computeProductPreview({ title, craftCategory, regionOfOrigin, price, availableQuantity, isMadeToOrder }) {
  const previewTitle = (title && title.trim()) ? title.trim() : "Your product name";
  const previewSubtitle = `${craftCategory || "Painting"} · ${regionOfOrigin || "Odisha"}`;
  const previewPrice = formatINRPreviewPrice(price);
  const previewAvailability = isMadeToOrder
    ? "Made to order"
    : `${availableQuantity || "1"} available`;

  return {
    title: previewTitle,
    subtitle: previewSubtitle,
    price: previewPrice,
    availability: previewAvailability,
  };
}

async function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || "GET",
      headers: options.headers || {},
      timeout: options.timeout || 25000,
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
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timed out"));
    });

    if (options.body) {
      req.write(typeof options.body === "string" ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

const AUTH_SECRET = process.env.AUTH_SECRET || "artsinly-dev-secret-key-32-chars-minimum-token";

function createSellerJwtToken() {
  const data = Buffer.from(
    JSON.stringify({
      userId: "cmvdxyd9c000lqwxwurax8s29",
      email: "artisan.devendra@artsinly.test",
      role: "SELLER",
      name: "Devendra Kumbhar",
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    })
  ).toString("base64url");

  const signature = crypto.createHmac("sha256", AUTH_SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
}

async function runTests() {
  console.log("\n================================================================================");
  console.log(" ARTSINLY - SELLER PRODUCT MANAGEMENT SPECIFICATION SUITE");
  console.log("================================================================================\n");

  console.log("--- 1. PROPOSED PRODUCT-UPLOAD FORM & PRODUCT PREVIEW LOGIC ---");

  // Test 1: Default empty state preview matches specification verbatim
  const defaultPreview = computeProductPreview({
    title: "",
    craftCategory: "Painting",
    regionOfOrigin: "Odisha",
    price: "1200",
    availableQuantity: "1",
    isMadeToOrder: false,
  });

  assert(defaultPreview.title === "Your product name", "Default preview title is 'Your product name'");
  assert(defaultPreview.subtitle === "Painting · Odisha", "Default preview subtitle is 'Painting · Odisha'");
  assert(defaultPreview.price === "₹1,200", "Default preview price is '₹1,200'");
  assert(defaultPreview.availability === "1 available", "Default preview availability is '1 available'");

  // Test 2: Made to order checkbox changes availability indicator
  const madeToOrderPreview = computeProductPreview({
    title: "Sacred Srinathji Gold-Leaf Pichwai",
    craftCategory: "Painting",
    regionOfOrigin: "Odisha",
    price: "1200",
    availableQuantity: "1",
    isMadeToOrder: true,
  });

  assert(madeToOrderPreview.availability === "Made to order", "Made to order toggle updates preview to 'Made to order'");
  assert(madeToOrderPreview.subtitle === "Painting · Odisha", "Subtitle retains 'Painting · Odisha'");

  // Test 3: Real-time typing updates preview title and subtitle
  const customPreview = computeProductPreview({
    title: "Terracotta Reduction Pitcher",
    craftCategory: "Terracotta Pottery",
    regionOfOrigin: "Gujarat",
    price: "2450",
    availableQuantity: "5",
    isMadeToOrder: false,
  });

  assert(customPreview.title === "Terracotta Reduction Pitcher", "Custom title updates in preview");
  assert(customPreview.subtitle === "Terracotta Pottery · Gujarat", "Craft category and region combine with ' · '");
  assert(customPreview.price === "₹2,450", "Price formats with Indian numbering system '₹2,450'");
  assert(customPreview.availability === "5 available", "Quantity updates to '5 available'");

  console.log("\n--- 2. MONETARY INVARIANTS (ZERO FLOAT ARITHMETIC) ---");

  // Test 4: Integer minor units conversion
  assert(rupeesToPaise("1200") === 120000, "₹1200 converts to exactly 120000 paise");
  assert(rupeesToPaise("1,200") === 120000, "₹1,200 with comma converts to 120000 paise");
  assert(rupeesToPaise(1200) === 120000, "Numeric 1200 converts to 120000 paise");
  assert(rupeesToPaise("126.99") === 12699, "₹126.99 converts to 12699 paise without float rounding flaws");

  console.log("\n--- 3. API ENDPOINTS INTEGRATION ---");

  const token = createSellerJwtToken();
  const authHeaders = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    // Test 5: GET /api/seller/products
    console.log("  Testing GET /api/seller/products...");
    const getRes = await fetchUrl("http://localhost:3000/api/seller/products", {
      headers: authHeaders,
    });
    console.log("  [DEBUG] GET /api/seller/products response:", getRes.status, getRes.body);
    assert(getRes.status === 200, "GET /api/seller/products returns 200 OK");
    const getData = getRes.json();
    assert(getData && Array.isArray(getData.products), "GET response contains products array");
    assert(getData.products.length > 0, `Returned ${getData?.products?.length || 0} products for seller`);

    // Test 6: POST /api/seller/products with proposed specification
    console.log("  Testing POST /api/seller/products (Upload New Craft)...");
    const newCraftPayload = {
      productName: "Heritage Raghurajpur Pattachitra Scroll",
      craftCategory: "Painting",
      regionOfOrigin: "Odisha",
      price: "1200",
      availableQuantity: "1",
      description: "Traditional palm leaf etching created with natural mineral dyes and vegetable lacquer.",
      isMadeToOrder: false,
      imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    };

    const postRes = await fetchUrl("http://localhost:3000/api/seller/products", {
      method: "POST",
      headers: authHeaders,
      body: newCraftPayload,
    });

    assert(postRes.status === 200, "POST /api/seller/products returns 200 OK");
    const postData = postRes.json();
    assert(postData && postData.success === true, "POST response indicates success: true");
    assert(postData?.product?.title === "Heritage Raghurajpur Pattachitra Scroll", "Created product title matches input");
    assert(postData?.product?.craftType === "Painting", "Created product craftType is 'Painting'");
    assert(postData?.product?.provenanceTag === "Odisha", "Created product provenanceTag is 'Odisha'");
    assert(postData?.product?.basePricePaise === 120000, "Product basePricePaise is integer 120000 paise");
    assert(postData?.product?.isMadeToOrder === false, "Product isMadeToOrder is false");

    const createdProductId = postData?.product?.id;
    assert(typeof createdProductId === "string" && createdProductId.length > 5, `Non-guessable ID generated: ${createdProductId}`);

    // Test 7: POST /api/seller/products with Made to Order enabled
    console.log("  Testing POST /api/seller/products with Made to Order...");
    const madeToOrderPayload = {
      productName: "Custom Pichwai Temple Hanging",
      craftCategory: "Painting",
      regionOfOrigin: "Odisha",
      price: "4500",
      description: "Commissioned gold-leaf miniature art made to order.",
      isMadeToOrder: true,
    };

    const mtoRes = await fetchUrl("http://localhost:3000/api/seller/products", {
      method: "POST",
      headers: authHeaders,
      body: madeToOrderPayload,
    });

    assert(mtoRes.status === 200, "POST Made-to-order craft returns 200 OK");
    const mtoData = mtoRes.json();
    assert(mtoData?.product?.isMadeToOrder === true, "Created product has isMadeToOrder: true");
    assert(mtoData?.product?.basePricePaise === 450000, "Made to order price is integer 450000 paise (₹4,500)");

    // Test 8: PUT /api/seller/products/[id]
    if (createdProductId) {
      console.log(`  Testing PUT /api/seller/products/${createdProductId} (Edit Craft)...`);
      const updatePayload = {
        title: "Heritage Raghurajpur Pattachitra Scroll - Deluxe Edition",
        craftCategory: "Painting",
        regionOfOrigin: "Odisha",
        price: "1500",
        availableQuantity: "3",
      };

      const putRes = await fetchUrl(`http://localhost:3000/api/seller/products/${createdProductId}`, {
        method: "PUT",
        headers: authHeaders,
        body: updatePayload,
      });

      assert(putRes.status === 200, "PUT /api/seller/products/[id] returns 200 OK");
      const putData = putRes.json();
      assert(putData && putData.success === true, "PUT response indicates success: true");
      assert(putData?.product?.title.includes("Deluxe Edition"), "Updated title saved successfully");
      assert(putData?.product?.basePricePaise === 150000, "Updated price is integer 150000 paise (₹1,500)");

      // Test 9: DELETE /api/seller/products/[id]
      console.log(`  Testing DELETE /api/seller/products/${createdProductId}...`);
      const delRes = await fetchUrl(`http://localhost:3000/api/seller/products/${createdProductId}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      assert(delRes.status === 200, "DELETE /api/seller/products/[id] returns 200 OK");
      const delData = delRes.json();
      assert(delData && delData.success === true, "DELETE response indicates success: true");
    }

    // Test 10: Unauthorized access rejection
    console.log("  Testing 401 Unauthorized for unauthenticated requests...");
    const unauthRes = await fetchUrl("http://localhost:3000/api/seller/products");
    assert(unauthRes.status === 401, "Unauthenticated GET /api/seller/products is rejected with 401");

    const unauthPostRes = await fetchUrl("http://localhost:3000/api/seller/products", {
      method: "POST",
      body: { title: "Unauth Craft" },
    });
    assert(unauthPostRes.status === 401, "Unauthenticated POST /api/seller/products is rejected with 401");

  } catch (netErr) {
    console.error("Network or test execution error:", netErr.message);
    failedTests++;
  }

  console.log("\n================================================================================");
  console.log(` TOTAL VERIFICATION SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log("================================================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests();
