import assert from "assert";
import {
  getFallbackUserByEmail,
  getFallbackUserById,
  registerFallbackUser,
} from "../src/lib/auth-store";
import { verifyPassword, createSessionToken, verifySessionToken } from "../src/lib/auth";

async function runTests() {
  console.log("==================================================================");
  console.log("   ARTSINLY RESILIENT OFFLINE AUTHENTICATION VERIFICATION SUITE   ");
  console.log("==================================================================");

  // 1. Verify Built-in Demo Users
  console.log("\n--- 1. Built-in Demo Users Verification ---");
  const admin = getFallbackUserByEmail("admin@artsinly.com");
  assert(admin !== null, "Admin user must be loaded");
  assert.strictEqual(admin.role, "ADMIN");
  assert(verifyPassword("admin123", admin.passwordHash), "Admin password must verify");
  console.log("  [PASS] admin@artsinly.com loaded and authenticated");

  const seller = getFallbackUserByEmail("seller@artsinly.com");
  assert(seller !== null, "Seller user must be loaded");
  assert.strictEqual(seller.role, "SELLER");
  assert(seller.sellerProfile !== null, "Seller must have sellerProfile");
  assert(verifyPassword("seller123", seller.passwordHash), "Seller password must verify");
  console.log("  [PASS] seller@artsinly.com loaded and authenticated with artisan profile");

  const buyer = getFallbackUserByEmail("buyer@artsinly.com");
  assert(buyer !== null, "Buyer user must be loaded");
  assert.strictEqual(buyer.role, "BUYER");
  assert(verifyPassword("buyer123", buyer.passwordHash), "Buyer password must verify");
  console.log("  [PASS] buyer@artsinly.com loaded and authenticated");

  // 2. Register New Buyer Account
  console.log("\n--- 2. Dynamic Buyer Registration ---");
  const testBuyerEmail = `collector_${Date.now()}@example.com`;
  const registeredBuyer = registerFallbackUser({
    email: testBuyerEmail,
    password: "SecurePassword123!",
    name: "Priya Varma",
    role: "BUYER",
    phone: "+91 98765 43210",
  });

  assert(registeredBuyer.id.startsWith("usr_"), "User ID must be non-guessable string");
  assert.strictEqual(registeredBuyer.email, testBuyerEmail.toLowerCase());
  assert.strictEqual(registeredBuyer.name, "Priya Varma");
  assert.strictEqual(registeredBuyer.role, "BUYER");
  assert(verifyPassword("SecurePassword123!", registeredBuyer.passwordHash), "Buyer password must verify");
  console.log(`  [PASS] Dynamic buyer ${testBuyerEmail} registered successfully`);

  // Retrieve buyer from store
  const retrievedBuyer = getFallbackUserByEmail(testBuyerEmail);
  assert.deepStrictEqual(retrievedBuyer?.id, registeredBuyer.id);
  const byId = getFallbackUserById(registeredBuyer.id);
  assert.deepStrictEqual(byId?.email, testBuyerEmail.toLowerCase());
  console.log("  [PASS] Buyer lookup by email and ID verified");

  // 3. Register New Master Artisan (Seller) Account
  console.log("\n--- 3. Dynamic Master Artisan (Seller) Registration ---");
  const testSellerEmail = `artisan_${Date.now()}@example.com`;
  const registeredSeller = registerFallbackUser({
    email: testSellerEmail,
    password: "MasterPassword456!",
    name: "Rameshwar Mohapatra",
    role: "SELLER",
  });

  assert.strictEqual(registeredSeller.role, "SELLER");
  assert(registeredSeller.sellerProfile !== null, "Seller must receive auto-provisioned sellerProfile");
  assert.strictEqual(registeredSeller.sellerProfile?.artisanName, "Rameshwar Mohapatra");
  assert(registeredSeller.sellerProfile?.shopName.includes("Rameshwar Mohapatra"), "Shop name configured");
  assert(verifyPassword("MasterPassword456!", registeredSeller.passwordHash), "Seller password must verify");
  console.log(`  [PASS] Dynamic artisan ${testSellerEmail} registered with full sellerProfile`);

  // 4. Session Token Signing & Verification
  console.log("\n--- 4. Cryptographic Session Token Workflow ---");
  const token = createSessionToken({
    userId: registeredBuyer.id,
    email: registeredBuyer.email,
    role: registeredBuyer.role,
    name: registeredBuyer.name,
  });

  assert(typeof token === "string" && token.includes("."), "Session token must be dot-delimited HMAC");
  const verified = verifySessionToken(token);
  assert(verified !== null, "Token must verify successfully");
  assert.strictEqual(verified.userId, registeredBuyer.id);
  assert.strictEqual(verified.email, registeredBuyer.email);
  assert.strictEqual(verified.role, "BUYER");
  assert.strictEqual(verified.name, "Priya Varma");
  console.log("  [PASS] Session token generated and verified across simulated requests");

  console.log("\n==================================================================");
  console.log("   ALL OFFLINE AUTH & REGISTRATION TESTS PASSED (100% OK)         ");
  console.log("==================================================================");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

