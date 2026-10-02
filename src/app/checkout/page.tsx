"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
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
} from "lucide-react";

export default function CheckoutPage() {
  const { cart, subtotalPaise, clearCart } = useCart();

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

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "cod">("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const shippingFeePaise = subtotalPaise > 200000 ? 0 : 15000;
  const taxPaise = Math.round(subtotalPaise * 0.05);
  const totalPaise = subtotalPaise + shippingFeePaise + taxPaise;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate safe order creation & payment confirmation
    setTimeout(() => {
      const generatedOrder = `ART-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedOrder);
      setIsProcessing(false);
      setOrderConfirmed(true);
      clearCart();
    }, 1500);
  };

  if (orderConfirmed) {
    return (
      <div className="bg-[#F8F5EF] min-h-[75vh] py-16 flex items-center justify-center">
        <div className="max-w-lg w-full mx-auto px-4 text-center bg-white border border-[#E8E0D2] rounded-xl p-8 sm:p-12 shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#EBF0E9] text-[#52644B] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-semibold text-[#89714F] uppercase tracking-widest block mb-1">
              Order Confirmed & Payment Received
            </span>
            <h1 className="font-serif text-3xl font-medium text-[#20201D]">
              Thank You for Supporting Master Craftsmen!
            </h1>
          </div>

          <div className="p-4 bg-[#F8F5EF] rounded border border-[#DCD0BD] text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-[#6B685F]">Order Number:</span>
              <span className="font-semibold text-[#20201D]">{orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B685F]">Delivery Address:</span>
              <span className="font-medium text-[#20201D]">
                {formData.fullName}, {formData.city}, {formData.state} - {formData.postalCode}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B685F]">Settlement Status:</span>
              <span className="text-[#52644B] font-semibold">Artisan Notified</span>
            </div>
            <div className="flex justify-between border-t border-[#E8E0D2] pt-2">
              <span className="text-[#6B685F]">Estimated Dispatch:</span>
              <span className="font-medium text-[#20201D]">Within 48 hours</span>
            </div>
          </div>

          <p className="text-xs text-[#6B685F] leading-relaxed">
            We have sent an order confirmation and live shipment tracking link to{" "}
            <strong>{formData.email}</strong>. Our artisans are carefully preparing your piece in eco-friendly packaging.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/buyer/dashboard"
              className="flex-1 py-3 px-4 rounded bg-[#20201D] text-white text-xs font-semibold hover:bg-[#89714F] transition-colors"
            >
              View Order in Dashboard
            </Link>
            <Link
              href="/products"
              className="flex-1 py-3 px-4 rounded border border-[#DCD0BD] text-[#20201D] text-xs font-semibold hover:bg-[#F3ECE1] transition-colors"
            >
              Continue Exploring
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !orderConfirmed) {
    return (
      <div className="bg-[#F8F5EF] min-h-[60vh] py-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-[#89714F] mx-auto" />
          <h2 className="font-serif text-2xl font-medium text-[#20201D]">No items to checkout</h2>
          <Link
            href="/products"
            className="inline-block px-5 py-2.5 bg-[#20201D] text-white text-xs font-semibold rounded hover:bg-[#89714F]"
          >
            Explore Catalogue
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
            <span>256-Bit SSL Encrypted Indian Gateway</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#20201D]">
            Order Checkout
          </h1>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Delivery Address & Payment Method */}
          <div className="lg:col-span-7 space-y-8">
            {/* Delivery Address Section */}
            <div className="bg-white border border-[#E8E0D2] rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-[#F3ECE1]">
                <Truck className="w-5 h-5 text-[#89714F]" />
                <h2 className="font-serif text-xl font-medium text-[#20201D]">
                  1. Delivery Details (Pan-India)
                </h2>
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
                  <label className="block text-[#6B685F] mb-1 font-medium">Mobile Phone (for OTP & Delivery)</label>
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
                  <label className="block text-[#6B685F] mb-1 font-medium">Email Address (for Receipt)</label>
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

            {/* Payment Method Section */}
            <div className="bg-white border border-[#E8E0D2] rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-[#F3ECE1]">
                <ShieldCheck className="w-5 h-5 text-[#89714F]" />
                <h2 className="font-serif text-xl font-medium text-[#20201D]">
                  2. Select Payment Method
                </h2>
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
                      <span>Instant UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
                    </div>
                    <p className="text-[11px] text-[#6B685F]">
                      Direct zero-surcharge transfer from your linked bank account.
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
                      <span>Credit / Debit Cards (Visa, MasterCard, RuPay)</span>
                    </div>
                    <p className="text-[11px] text-[#6B685F]">
                      Secured with 3D Secure OTP authentication.
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
                      <span>Indian NetBanking (SBI, HDFC, ICICI, Axis & 50+ Banks)</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Pay CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E8E0D2] rounded-xl p-6 space-y-6 shadow-xs sticky top-28">
              <h3 className="font-serif text-xl font-medium text-[#20201D] pb-3 border-b border-[#F3ECE1]">
                Order Items ({cart.length})
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="font-semibold text-[#89714F]">×{item.quantity}</span>
                      <span className="truncate text-[#20201D]">{item.product.title}</span>
                    </div>
                    <span className="font-semibold text-[#20201D] shrink-0">
                      {formatINR(item.product.pricePaise * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="pt-4 border-t border-[#F3ECE1] space-y-2.5 text-xs text-[#6B685F]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#20201D]">{formatINR(subtotalPaise)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Shipping</span>
                  <span className="font-semibold text-[#20201D]">
                    {shippingFeePaise === 0 ? "FREE" : formatINR(shippingFeePaise)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="font-semibold text-[#20201D]">{formatINR(taxPaise)}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-semibold text-[#20201D] pt-3 border-t border-[#F3ECE1]">
                  <span>Total Payable</span>
                  <span className="text-xl">{formatINR(totalPaise)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 px-6 rounded bg-[#20201D] hover:bg-[#89714F] text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-60"
              >
                {isProcessing ? (
                  <span>Contacting Secure Gateway...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize Payment & Place Order • {formatINR(totalPaise)}</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-[#6B685F] text-center leading-relaxed">
                By placing this order, you are entering into a direct craft contract with the certified regional artisan. Payout is held safely in escrow until delivery is verified.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
