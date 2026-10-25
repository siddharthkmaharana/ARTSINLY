"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatINR } from "@/lib/utils";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Truck,
  CreditCard,
  QrCode,
  Building,
  Sparkles,
  ShoppingBag,
  Loader2,
  AlertCircle,
  Package,
  MapPin,
  RefreshCw,
  XCircle,
} from "lucide-react";

export default function CheckoutPage() {
  const { cart, subtotalPaise, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
    addressLine1: "42, Shanti Niketan, Civil Lines",
    addressLine2: "Near Heritage Clock Tower",
    city: "Jaipur",
    state: "Rajasthan",
    postalCode: "302006",
  });

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  // Multi-vendor parcel grouping for checkout
  const artisanPackages = useMemo(() => {
    const map = new Map<
      string,
      {
        artisanName: string;
        shopName: string;
        state: string;
        items: typeof cart;
        subtotalPaise: number;
      }
    >();

    for (const item of cart) {
      const artisan = item.product.artisan;
      const key = artisan?.id || artisan?.artisanName || item.product.state || "guild";
      if (!map.has(key)) {
        map.set(key, {
          artisanName: artisan?.artisanName || "Master Artisan",
          shopName: artisan?.shopName || "Artisan Heritage Studio",
          state: item.product.state || artisan?.state || "India",
          items: [],
          subtotalPaise: 0,
        });
      }
      const pkg = map.get(key)!;
      pkg.items.push(item);
      pkg.subtotalPaise += item.product.pricePaise * item.quantity;
    }

    return Array.from(map.values());
  }, [cart]);

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "ADDRESS" | "CREATING_ORDER" | "PROCESSING_PAYMENT" | "CONFIRMED" | "FAILED"
  >("ADDRESS");
  const [errorMessage, setErrorMessage] = useState("");
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  const shippingFeePaise = subtotalPaise > 200000 ? 0 : 15000;
  const taxPaise = Math.floor((subtotalPaise * 5) / 100);
  const totalPaise = subtotalPaise + shippingFeePaise + taxPaise;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Flowchart Execution:
   * 1. Buyer selects products
   * 2. Cart & Stock Validation
   * 3. Checkout and delivery address
   * 4. Create pending order (POST /api/orders)
   * 5. Create payment with provider (POST /api/payments/verify or /sandbox)
   * 6. Verified payment result:
   *    - Failure -> Keep order unpaid (status PENDING, paymentStatus FAILED, no stock deducted)
   *    - Success -> Confirm order and reserve stock (status CONFIRMED, paymentStatus COMPLETED)
   * 7. Notify relevant sellers
   */
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setCurrentStep("CREATING_ORDER");

    try {
      // Step 4: Create Pending Order (POST /api/orders)
      const orderPayload = {
        items: cart.map((item) => ({
          productId: item.product.id,
          variantId: undefined,
          quantity: item.quantity,
          title: item.product.title,
          pricePaise: item.product.pricePaise,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          phone: formData.phone,
        },
        buyerEmail: formData.email,
        buyerName: formData.fullName,
        buyerPhone: formData.phone,
        shippingFeePaise,
        taxPaise,
      };

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to create pending order record.");
      }

      setCurrentStep("PROCESSING_PAYMENT");

      // Step 5 & 6: Verified Payment Result (POST /api/payments/verify)
      // Production Rule 1 & 2: Server-side verification
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.order.id,
          orderNumber: orderData.order.orderNumber,
          provider: "sandbox",
          paymentMethod,
          simulateFailure, // Test failure branch
        }),
      });

      const verifyData = await verifyRes.json();

      // Flowchart Branch: Failure -> Keep order unpaid
      if (!verifyRes.ok || !verifyData.success) {
        setCurrentStep("FAILED");
        setErrorMessage(
          verifyData.error ||
            "Simulated Payment authorization was declined. Per marketplace rules, the order remains UNPAID in the database and inventory has not been deducted."
        );
        return;
      }

      // Flowchart Branch: Success -> Confirm order and reserve stock -> Notify relevant sellers
      setPlacedOrder({
        ...orderData.order,
        ...verifyData.order,
        paymentReference: verifyData.payment?.referenceId,
      });
      setCurrentStep("CONFIRMED");
      clearCart();
    } catch (err: any) {
      console.error("Checkout process error:", err);
      setCurrentStep("ADDRESS");
      setErrorMessage(err.message || "An unexpected error occurred during checkout.");
    }
  };

  // State A: Order Confirmed Screen
  if (currentStep === "CONFIRMED" && placedOrder) {
    return (
      <div className="bg-[#F8F5EF] min-h-[75vh] py-16 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto px-4 text-center bg-white border border-[#E8E0D2] rounded-2xl p-8 sm:p-12 shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#EBF0E9] text-[#52644B] flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-semibold text-[#89714F] uppercase tracking-widest block mb-1">
              Flowchart Step 6: Payment Result Verified & Order Confirmed
            </span>
            <h1 className="font-serif text-3xl font-medium text-[#20201D]">
              Thank You for Supporting Master Craftsmen!
            </h1>
          </div>

          <div className="p-5 bg-[#F8F5EF] rounded-xl border border-[#DCD0BD] text-xs space-y-3 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E0D2]">
              <span className="text-[#6B685F]">Order Number:</span>
              <span className="font-semibold text-[#20201D] font-mono text-sm">
                {placedOrder.orderNumber}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6B685F]">Payment Gateway Ref:</span>
              <span className="font-mono text-[#52644B] font-semibold">
                {placedOrder.paymentReference || "SBX-PAID-OK"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6B685F]">Payment Status:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                COMPLETED • HELD IN ESCROW
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6B685F]">Stock Reservation:</span>
              <span className="text-[#52644B] font-medium">
                Atomically Decremented & Reserved in DB
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-[#E8E0D2] pt-2">
              <span className="text-[#6B685F]">Delivery Destination:</span>
              <span className="font-medium text-[#20201D]">
                {formData.fullName}, {formData.city}, {formData.state} — {formData.postalCode}
              </span>
            </div>
          </div>

          {/* Multi-Vendor Packages Notification Status */}
          <div className="space-y-3 text-left">
            <span className="text-xs font-semibold text-[#20201D] uppercase tracking-wider block">
              Flowchart Step 7: Relevant Sellers Notified for Dispatch
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {artisanPackages.map((pkg, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8E0D2] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#20201D]">
                      Package {idx + 1}: {pkg.shopName}
                    </span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                      Alert Dispatched
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B685F]">
                    Artisan: {pkg.artisanName} ({pkg.state})
                  </p>
                  <p className="text-[10px] text-[#89714F]">
                    Status: Preparing in Atelier • Insured courier tracking will be generated on dispatch
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-[#6B685F] leading-relaxed">
            Confirmation receipt dispatched to <strong>{formData.email}</strong>. 84% of your payment is held safely in escrow and will settle directly to the artisans upon verified delivery.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/buyer/dashboard"
              className="flex-1 py-3 px-4 rounded-lg bg-[#20201D] text-white text-xs font-semibold hover:bg-[#89714F] transition-colors"
            >
              View Order in Dashboard
            </Link>
            <Link
              href="/products"
              className="flex-1 py-3 px-4 rounded-lg border border-[#DCD0BD] text-[#20201D] text-xs font-semibold hover:bg-[#F3ECE1] transition-colors"
            >
              Continue Exploring
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State B: Order Failed Screen (Demonstrating Flowchart: Failure -> Keep order unpaid)
  if (currentStep === "FAILED") {
    return (
      <div className="bg-[#F8F5EF] min-h-[70vh] py-16 flex items-center justify-center">
        <div className="max-w-xl w-full mx-auto px-4 text-center bg-white border border-red-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-semibold text-red-700 uppercase tracking-widest block mb-1">
              Flowchart Step 6 Branch: Verified Payment Failure
            </span>
            <h1 className="font-serif text-3xl font-medium text-[#20201D]">
              Payment Authorization Unsuccessful
            </h1>
          </div>

          <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-left text-xs text-red-800 space-y-2">
            <p className="font-semibold">Production Payment Rule Enforcement:</p>
            <p className="leading-relaxed">
              {errorMessage}
            </p>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-red-700">
              <li>Order state remains: <strong>PENDING (UNPAID)</strong></li>
              <li>Workshop inventory: <strong>0 units deducted / preserved</strong></li>
              <li>Artisan alerts: <strong>Suppressed / Not dispatched</strong></li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                setSimulateFailure(false);
                setCurrentStep("ADDRESS");
              }}
              className="flex-1 py-3 px-4 rounded-lg bg-[#20201D] text-white text-xs font-semibold hover:bg-[#89714F] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry with Successful Authorization</span>
            </button>
            <Link
              href="/cart"
              className="flex-1 py-3 px-4 rounded-lg border border-[#DCD0BD] text-[#20201D] text-xs font-semibold hover:bg-[#F3ECE1] transition-colors flex items-center justify-center"
            >
              Return to Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State C: Empty Cart
  if (cart.length === 0) {
    return (
      <div className="bg-[#F8F5EF] min-h-[60vh] py-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-[#89714F] mx-auto" />
          <h2 className="font-serif text-2xl font-medium text-[#20201D]">No items to checkout</h2>
          <Link
            href="/products"
            className="inline-block px-5 py-2.5 bg-[#20201D] text-white text-xs font-semibold rounded hover:bg-[#89714F]"
          >
            Explore Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[#89714F] mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Multi-Vendor Checkout • Verified Gateway Settlement • RBI Escrow</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#20201D]">
            Order Checkout
          </h1>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Delivery Address & Payment Method */}
          <div className="lg:col-span-7 space-y-8">
            {/* Delivery Address Section (Flowchart Step 3) */}
            <div className="bg-white border border-[#E8E0D2] rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-[#F3ECE1]">
                <Truck className="w-5 h-5 text-[#89714F]" />
                <div>
                  <h2 className="font-serif text-xl font-medium text-[#20201D]">
                    1. Delivery Details (Pan-India)
                  </h2>
                  <p className="text-[11px] text-[#6B685F]">
                    All parcels will be routed from their respective regional ateliers to this address.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#6B685F] mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#DCD0BD] rounded text-[#20201D] focus:outline-none focus:border-[#89714F]"
                  />
                </div>

                <div>
                  <label className="block text-[#6B685F] mb-1 font-medium">Mobile Phone (for Delivery OTP)</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#DCD0BD] rounded text-[#20201D] focus:outline-none focus:border-[#89714F]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#6B685F] mb-1 font-medium">Email Address (for Dispatch Tracking)</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#DCD0BD] rounded text-[#20201D] focus:outline-none focus:border-[#89714F]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#6B685F] mb-1 font-medium">Street Address / House No.</label>
                  <input
                    type="text"
                    name="addressLine1"
                    required
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#DCD0BD] rounded text-[#20201D] focus:outline-none focus:border-[#89714F]"
                  />
                </div>

                <div>
                  <label className="block text-[#6B685F] mb-1 font-medium">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#DCD0BD] rounded text-[#20201D] focus:outline-none focus:border-[#89714F]"
                  />
                </div>

                <div>
                  <label className="block text-[#6B685F] mb-1 font-medium">State</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#DCD0BD] rounded text-[#20201D] focus:outline-none focus:border-[#89714F]"
                  />
                </div>

                <div>
                  <label className="block text-[#6B685F] mb-1 font-medium">PIN Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#DCD0BD] rounded text-[#20201D] focus:outline-none focus:border-[#89714F]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method & Flowchart Simulator Section (Flowchart Step 5) */}
            <div className="bg-white border border-[#E8E0D2] rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-[#F3ECE1]">
                <ShieldCheck className="w-5 h-5 text-[#89714F]" />
                <div>
                  <h2 className="font-serif text-xl font-medium text-[#20201D]">
                    2. Payment Gateway Authorization
                  </h2>
                  <p className="text-[11px] text-[#6B685F]">
                    Production payment rules: Zero raw card storage • Server-side verification • RBI Escrow hold
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* UPI Option */}
                <label
                  onClick={() => setPaymentMethod("upi")}
                  className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === "upi"
                      ? "border-[#89714F] bg-[#F4EFE6]"
                      : "border-[#DCD0BD] hover:bg-[#F8F5EF]"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                    className="mt-1 accent-[#89714F]"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-xs text-[#20201D]">
                      <QrCode className="w-4 h-4 text-[#89714F]" />
                      <span>Instant UPI Gateway (Google Pay, PhonePe, Paytm, BHIM)</span>
                    </div>
                    <p className="text-[11px] text-[#6B685F]">
                      Direct bank-to-escrow payment with instantaneous server-side callback verification.
                    </p>
                  </div>
                </label>

                {/* Cards Option */}
                <label
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-[#89714F] bg-[#F4EFE6]"
                      : "border-[#DCD0BD] hover:bg-[#F8F5EF]"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="mt-1 accent-[#89714F]"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-xs text-[#20201D]">
                      <CreditCard className="w-4 h-4 text-[#89714F]" />
                      <span>Credit & Debit Cards (RuPay, Visa, MasterCard)</span>
                    </div>
                    <p className="text-[11px] text-[#6B685F]">
                      Simulates 3D-Secure 2.0 authorization with zero card exposure on client or server.
                    </p>
                  </div>
                </label>

                {/* NetBanking */}
                <label
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === "netbanking"
                      ? "border-[#89714F] bg-[#F4EFE6]"
                      : "border-[#DCD0BD] hover:bg-[#F8F5EF]"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "netbanking"}
                    onChange={() => setPaymentMethod("netbanking")}
                    className="mt-1 accent-[#89714F]"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-xs text-[#20201D]">
                      <Building className="w-4 h-4 text-[#89714F]" />
                      <span>NetBanking (SBI, HDFC, ICICI, Axis & 50+ Banks)</span>
                    </div>
                  </div>
                </label>
              </div>

              {/* Interactive Flowchart Verification Simulator Toggle */}
              <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#DCD0BD] space-y-2">
                <span className="text-xs font-semibold text-[#89714F] uppercase tracking-wider block">
                  Flowchart Verification Simulator
                </span>
                <p className="text-[11px] text-[#6B685F]">
                  Test both branches of the architecture flowchart during development:
                </p>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs text-[#20201D] cursor-pointer">
                    <input
                      type="radio"
                      name="simulateOutcome"
                      checked={!simulateFailure}
                      onChange={() => setSimulateFailure(false)}
                      className="accent-emerald-700"
                    />
                    <span className="font-medium text-emerald-800">
                      Success Branch (Confirm order, reserve stock, alert sellers)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#20201D] cursor-pointer">
                    <input
                      type="radio"
                      name="simulateOutcome"
                      checked={simulateFailure}
                      onChange={() => setSimulateFailure(true)}
                      className="accent-red-700"
                    />
                    <span className="font-medium text-red-800">
                      Failure Branch (Keep unpaid, 0 stock deducted)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Vendor Parcels & Pay CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E8E0D2] rounded-xl p-6 space-y-6 shadow-xs sticky top-28">
              <div className="flex items-center justify-between pb-3 border-b border-[#F3ECE1]">
                <h3 className="font-serif text-xl font-medium text-[#20201D]">
                  Multi-Vendor Parcels ({artisanPackages.length})
                </h3>
                <span className="text-[11px] text-[#89714F] font-semibold">
                  {cart.reduce((a, b) => a + b.quantity, 0)} Items
                </span>
              </div>

              {/* Grouped by Atelier */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {artisanPackages.map((pkg, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#FAF7F2] rounded-lg border border-[#E8E0D2] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold text-[#20201D]">
                      <span className="truncate">Parcel {idx + 1}: {pkg.shopName}</span>
                      <span className="shrink-0 text-[#89714F] font-mono">
                        {formatINR(pkg.subtotalPaise)}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#6B685F] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#89714F]" />
                      <span>{pkg.artisanName} • {pkg.state}</span>
                    </div>

                    <div className="divide-y divide-[#E8E0D2] pt-1">
                      {pkg.items.map((it) => (
                        <div key={it.id} className="py-1 flex justify-between text-[11px]">
                          <span className="text-[#20201D] truncate">
                            {it.quantity}× {it.product.title}
                          </span>
                          <span className="font-medium text-[#20201D] shrink-0">
                            {formatINR(it.product.pricePaise * it.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="pt-4 border-t border-[#F3ECE1] space-y-2.5 text-xs text-[#6B685F]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#20201D]">{formatINR(subtotalPaise)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Pan-India Transit</span>
                  <span className="font-semibold text-[#20201D]">
                    {shippingFeePaise === 0 ? "FREE" : formatINR(shippingFeePaise)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5% Handcrafted)</span>
                  <span className="font-semibold text-[#20201D]">{formatINR(taxPaise)}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-semibold text-[#20201D] pt-3 border-t border-[#F3ECE1]">
                  <span>Total Payable</span>
                  <span className="text-xl">{formatINR(totalPaise)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={currentStep === "CREATING_ORDER" || currentStep === "PROCESSING_PAYMENT"}
                className={`w-full py-4 px-6 rounded-lg text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-60 ${
                  simulateFailure ? "bg-red-700 hover:bg-red-800" : "bg-[#20201D] hover:bg-[#89714F]"
                }`}
              >
                {currentStep === "CREATING_ORDER" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Step 4: Creating Pending Order in PostgreSQL...</span>
                  </>
                ) : currentStep === "PROCESSING_PAYMENT" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Step 5 & 6: Verifying Payment Result Server-Side...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>
                      {simulateFailure ? "Test Simulated Failure Branch" : "Authorize Payment & Place Order"} • {formatINR(totalPaise)}
                    </span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-[#6B685F] text-center leading-relaxed">
                By clicking Authorize, you trigger the automated multi-vendor order allocation. Payouts are safely held in RBI-compliant escrow until verified delivery.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
