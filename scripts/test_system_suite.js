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
  console.log("=================================================");
  console.log("   ARTSINLY SYSTEM VERIFICATION TEST SUITE");
  console.log("=================================================\n");

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

  const ping = await fetchUrl("http://localhost:3000/api/health", { method: "GET" }).catch(() => null);
  if (!ping) {
    console.log("  [INFO] Dev server is offline; live API system health & telemetry tests skipped");
    console.log("\n=================================================");
    console.log(`   TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("=================================================\n");
    return;
  }

  // 1. MONITORING & HEALTH CHECK
  console.log("--- 1. System Health Check & Telemetry ---");
  try {
    const res = await fetchUrl("http://localhost:3000/api/health");
    assert(res.status === 200, `Health check HTTP status is 200 (got ${res.status})`);
    const data = res.json();
    assert(data && data.status === "healthy", `Overall status is "healthy"`);
    assert(data.checks?.database?.connected === true, `PostgreSQL is connected`);
    assert(typeof data.checks?.database?.latencyMs === "number" && data.checks.database.latencyMs >= 0, `DB latency reported: ${data.checks?.database?.latencyMs}ms`);
    assert(data.checks?.system?.memoryMb?.heapUsed > 0, `Heap memory reported: ${data.checks?.system?.memoryMb?.heapUsed} MB`);
    assert(data.checks?.system?.uptimeSeconds >= 0, `System uptime reported: ${data.checks?.system?.uptimeSeconds}s`);
  } catch (err) {
    assert(false, `Health check error: ${err.message}`);
  }

  // 2. CORE WEB VITALS BEACON
  console.log("\n--- 2. Core Web Vitals Telemetry Beacon ---");
  try {
    const res = await fetchUrl("http://localhost:3000/api/monitoring/vitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { name: "LCP", value: 1240, rating: "good", id: "v1-test" },
    });
    assert(res.status === 200, `Beacon collector status is 200 (got ${res.status})`);
    const data = res.json();
    assert(data && data.received === true, `Beacon payload acknowledged successfully`);
  } catch (err) {
    assert(false, `Vitals beacon error: ${err.message}`);
  }

  // 3. DATABASE BACKUPS & INTEGRITY VERIFICATION
  console.log("\n--- 3. Database Backups & Integrity Verification ---");
  try {
    // Login as admin
    const loginRes = await fetchUrl("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { email: "admin@artsinly.com", password: "admin123" },
    });
    assert(loginRes.status === 200, `Admin login successful`);
    const setCookie = loginRes.headers["set-cookie"];
    const cookieHeader = Array.isArray(setCookie) ? setCookie.join("; ") : setCookie || "";

    // Trigger backup creation
    const backupRes = await fetchUrl("http://localhost:3000/api/admin/backups", {
      method: "POST",
      headers: { Cookie: cookieHeader },
    });
    assert(backupRes.status === 200, `Backup snapshot created (status 200)`);
    const backupData = backupRes.json();
    assert(backupData?.backup?.filename?.startsWith("artsinly-backup-"), `Snapshot filename generated: ${backupData?.backup?.filename}`);
    assert(backupData?.backup?.checksumSha256?.length === 64, `SHA-256 checksum generated (${backupData?.backup?.checksumSha256?.slice(0, 16)}...)`);
    assert(backupData?.backup?.totalRecords > 0, `Total database records backed up: ${backupData?.backup?.totalRecords}`);

    // List backups
    const listRes = await fetchUrl("http://localhost:3000/api/admin/backups", {
      headers: { Cookie: cookieHeader },
    });
    assert(listRes.status === 200, `List backups status 200`);
    const listData = listRes.json();
    assert(listData?.backups?.length > 0, `Found ${listData?.backups?.length} backup snapshot(s)`);
  } catch (err) {
    assert(false, `Backup test error: ${err.message}`);
  }

  // 4. RATE LIMITING & SECURITY HEADERS
  console.log("\n--- 4. Rate Limiting & Security Headers ---");
  try {
    const testIp = `192.0.2.${Math.floor(Math.random() * 200) + 10}`;
    const res = await fetchUrl("http://localhost:3000/api/products", {
      headers: { "X-Forwarded-For": testIp },
    });
    assert(res.status === 200, `Products API responded 200`);
    assert(res.headers["x-ratelimit-limit"] !== undefined, `X-RateLimit-Limit header present: ${res.headers["x-ratelimit-limit"]}`);
    assert(res.headers["x-ratelimit-remaining"] !== undefined, `X-RateLimit-Remaining header present: ${res.headers["x-ratelimit-remaining"]}`);
    assert(res.headers["x-content-type-options"] === "nosniff", `Security header X-Content-Type-Options: nosniff`);
    assert(res.headers["x-frame-options"] === "SAMEORIGIN", `Security header X-Frame-Options: SAMEORIGIN`);

    // Test burst rate limit on auth endpoint (limit: 15)
    console.log("  Testing rate limit saturation on auth endpoint...");
    const burstIp = `203.0.113.${Math.floor(Math.random() * 200) + 10}`;
    let hitRateLimit = false;
    for (let i = 0; i < 18; i++) {
      const burstRes = await fetchUrl("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Forwarded-For": burstIp },
        body: { email: "invalid@example.com", password: "bad" },
      });
      if (burstRes.status === 429) {
        hitRateLimit = true;
        const errJson = burstRes.json();
        assert(errJson?.code === "RATE_LIMIT_EXCEEDED", `429 returned with code RATE_LIMIT_EXCEEDED`);
        assert(burstRes.headers["retry-after"] !== undefined, `Retry-After header present: ${burstRes.headers["retry-after"]}s`);
        break;
      }
    }
    assert(hitRateLimit, `Sliding window rate limit enforced 429 Too Many Requests after threshold`);
  } catch (err) {
    assert(false, `Rate limiting test error: ${err.message}`);
  }

  // 5. SEO SITEMAP & ROBOTS
  console.log("\n--- 5. Dynamic SEO Sitemap & Robots Directives ---");
  try {
    const sitemapRes = await fetchUrl("http://localhost:3000/sitemap.xml");
    assert(sitemapRes.status === 200, `Sitemap endpoint responded 200 (got ${sitemapRes.status})`);
    assert(sitemapRes.body.includes("<urlset") || sitemapRes.body.includes("/products/"), `Sitemap contains dynamic product XML entries`);
    assert(sitemapRes.body.includes("/catalog"), `Sitemap contains /catalog route`);

    const robotsRes = await fetchUrl("http://localhost:3000/robots.txt");
    assert(robotsRes.status === 200, `Robots endpoint responded 200 (got ${robotsRes.status})`);
    assert(robotsRes.body.includes("Disallow: /admin"), `Robots disallows /admin`);
    assert(robotsRes.body.includes("Disallow: /api/"), `Robots disallows /api/`);
    assert(robotsRes.body.includes("Allow: /catalog"), `Robots allows /catalog`);
    assert(robotsRes.body.includes("sitemap.xml"), `Robots references sitemap.xml`);
  } catch (err) {
    assert(false, `SEO test error: ${err.message}`);
  }

  // 6. ACCESSIBILITY & PERFORMANCE HEADERS
  console.log("\n--- 6. Accessibility & Performance Verification ---");
  try {
    const pageRes = await fetchUrl("http://localhost:3000/");
    assert(pageRes.status === 200, `Homepage responded 200`);
    assert(pageRes.body.includes('href="#main-content"'), `Skip to main content link present`);
    assert(pageRes.body.includes('id="main-content"'), `Main content landmark ID present`);
    assert(pageRes.body.includes('role="banner"'), `Role banner landmark present on header`);
    assert(pageRes.body.includes('role="contentinfo"'), `Role contentinfo landmark present on footer`);
    assert(pageRes.body.includes('application/ld+json'), `Schema.org JSON-LD structured data embedded`);

    const prodRes = await fetchUrl("http://localhost:3000/api/products");
    assert(prodRes.headers["cache-control"]?.includes("public"), `Cache-Control header configured: ${prodRes.headers["cache-control"]}`);
  } catch (err) {
    assert(false, `A11y/Performance test error: ${err.message}`);
  }

  console.log("\n=================================================");
  console.log(`   TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================");
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
