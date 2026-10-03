"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
} from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotalPaise } = useCart();

  const shippingFeePaise = subtotalPaise > 200000 ? 0 : 15000; // Free over ₹2,000
  const taxPaise = Math.round(subtotalPaise * 0.05); // 5% GST on handicrafts
  const totalPaise = subtotalPaise + shippingFeePaise + taxPaise;

  if (cart.length === 0) {
    return (
      <div className="bg-[#F8F5EF] min-h-[70vh] py-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#FFFFFF] border border-[#DCD0BD] flex items-center justify-center mx-auto text-[#89714F] shadow-xs">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#20201D]">
            Your Bag is Empty
          </h1>
          <p className="text-xs sm:text-sm text-[#6B685F] leading-relaxed">
            Every creation on ARTSINLY is an original masterpiece from a master artisan. Explore our curated collections to begin your collection.
          </p>
          <div>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[#20201D] text-white text-xs font-semibold hover:bg-[#89714F] transition-colors"
            >
              <span>Explore Handmade Crafts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#20201D]">
            Shopping Bag ({cart.reduce((acc, item) => acc + item.quantity, 0)})
          </h1>
          <p className="text-xs sm:text-sm text-[#6B685F] mt-1">
            Carefully packaged in eco-friendly protective straw and insured transit.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => {
              const primaryImg =
                item.product.images.find((i) => i.isPrimary)?.url ||
                item.product.images[0]?.url;

              return (
                <div
                  key={item.id}
                  className="bg-white border border-[#E8E0D2] rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between shadow-xs"
                >
                  <div className="flex gap-4 items-center">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="w-20 h-24 sm:w-24 sm:h-28 rounded bg-[#F3ECE1] overflow-hidden shrink-0 border border-[#DCD0BD]"
                    >
                      <img
                        src={primaryImg}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-[#89714F] uppercase tracking-wider block">
                        {item.product.craftType}
                      </span>
                      <h3 className="font-serif text-base sm:text-lg font-medium text-[#20201D] hover:text-[#89714F] leading-tight">
                        <Link href={`/products/${item.product.slug}`}>
                          {item.product.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-[#6B685F]">
                        Crafted by{" "}
                        <span className="font-medium text-[#20201D]">
                          {item.product.artisan.artisanName}
                        </span>{" "}
                        • {item.product.state}
                      </p>
                      <div className="font-serif text-base font-medium text-[#20201D] pt-1">
                        {formatINR(item.product.pricePaise)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Removal */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-[#F3ECE1]">
                    <div className="flex items-center border border-[#DCD0BD] rounded bg-[#F8F5EF]">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-1.5 text-[#20201D] hover:bg-[#E8E0D2] transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1 text-xs font-semibold text-[#20201D]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-1.5 text-[#20201D] hover:bg-[#E8E0D2] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="font-serif text-base font-semibold text-[#20201D]">
                        {formatINR(item.product.pricePaise * item.quantity)}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[#6B685F] hover:text-[#A44A3F] p-1.5 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Fair Trade Note */}
            <div className="p-4 rounded-lg bg-[#EBF0E9] border border-[#DCD0BD] flex items-center gap-3 text-xs text-[#52644B]">
              <HeartHandshake className="w-5 h-5 shrink-0 text-[#52644B]" />
              <span>
                <strong>Direct Artisan Payout:</strong> 85% of this order directly settles into the verified bank accounts of our rural artisans within 48 hours of dispatch.
              </span>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-[#E8E0D2] rounded-lg p-6 space-y-6 shadow-xs sticky top-28">
              <h2 className="font-serif text-xl font-medium text-[#20201D] pb-3 border-b border-[#F3ECE1]">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-[#6B685F]">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-[#20201D]">
                    {formatINR(subtotalPaise)}
                  </span>
                </div>
                <div className="flex justify-between text-[#6B685F]">
                  <span>Insured Fragile Shipping</span>
                  <span className="font-semibold text-[#20201D]">
                    {shippingFeePaise === 0 ? "FREE" : formatINR(shippingFeePaise)}
                  </span>
                </div>
                <div className="flex justify-between text-[#6B685F]">
                  <span>Estimated GST (5%)</span>
                  <span className="font-semibold text-[#20201D]">
                    {formatINR(taxPaise)}
                  </span>
                </div>

                {shippingFeePaise > 0 && (
                  <p className="text-[11px] text-[#89714F] italic">
                    Add {formatINR(200000 - subtotalPaise)} more to qualify for Free Shipping!
                  </p>
                )}

                <div className="pt-3 border-t border-[#F3ECE1] flex justify-between text-sm sm:text-base font-semibold text-[#20201D]">
                  <span className="font-serif text-lg">Total Amount</span>
                  <span className="font-serif text-xl text-[#20201D]">
                    {formatINR(totalPaise)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full py-3.5 px-4 rounded bg-[#20201D] hover:bg-[#89714F] text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-[#6B685F]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#52644B]" />
                <span>256-Bit Encrypted Indian Banking Channels</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
