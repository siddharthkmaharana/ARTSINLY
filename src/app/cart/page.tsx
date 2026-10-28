"use client";

import React, { useMemo } from "react";
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
  Package,
  MapPin,
  Truck,
} from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotalPaise } = useCart();

  // Multi-vendor grouping by artisan atelier
  const artisanPackages = useMemo(() => {
    const map = new Map<
      string,
      {
        artisanName: string;
        shopName: string;
        state: string;
        craftTradition: string;
        items: typeof cart;
        packageSubtotalPaise: number;
      }
    >();

    for (const item of cart) {
      const artisan = item.product.artisan;
      const key = artisan?.id || artisan?.artisanName || item.product.state || "guild";
      if (!map.has(key)) {
        map.set(key, {
          artisanName: artisan?.artisanName || "Master Artisan Collective",
          shopName: artisan?.shopName || "Artisan Heritage Studio",
          state: item.product.state || artisan?.state || "India",
          craftTradition:
            artisan?.craftTradition || item.product.craftType || "Heritage Craft",
          items: [],
          packageSubtotalPaise: 0,
        });
      }
      const pkg = map.get(key)!;
      pkg.items.push(item);
      pkg.packageSubtotalPaise += item.product.pricePaise * item.quantity;
    }

    return Array.from(map.values());
  }, [cart]);

  const packageCount = artisanPackages.length;
  // Free insured shipping if subtotal > ₹2,000, otherwise ₹150 flat pan-India
  const shippingFeePaise = subtotalPaise > 200000 ? 0 : 15000;
  // 5% GST on handicrafts (integer minor units)
  const taxPaise = Math.floor((subtotalPaise * 5) / 100);
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
            Every creation on ARTSINLY is an original masterpiece from an authentic regional artisan.
            Explore our curated collections from Rajasthan, Odisha, Kashmir, and beyond.
          </p>
          <div>
            <Link
              href="/products"
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
          <div className="flex items-center gap-2 text-xs text-[#89714F] font-semibold uppercase tracking-wider mb-1">
            <Package className="w-4 h-4" />
            <span>Multi-Vendor Artisan Marketplace Checkout</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#20201D]">
            Shopping Bag ({cart.reduce((acc, item) => acc + item.quantity, 0)} Items)
          </h1>
          <p className="text-xs sm:text-sm text-[#6B685F] mt-1">
            {packageCount > 1
              ? `Your cart contains pieces from ${packageCount} independent artisan studios. Each studio packages and dispatches their parcels directly from their home workshop.`
              : "Carefully packaged in eco-friendly protective straw and insured fragile transit."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Cart Items Grouped by Artisan Studio */}
          <div className="lg:col-span-8 space-y-6">
            {artisanPackages.map((pkg, pIdx) => (
              <div
                key={pIdx}
                className="bg-white border border-[#E8E0D2] rounded-xl overflow-hidden shadow-xs"
              >
                {/* Artisan Workshop Header */}
                <div className="bg-[#FBF9F5] px-6 py-4 border-b border-[#E8E0D2] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F4EFE6] text-[#89714F] flex items-center justify-center font-serif text-xs font-bold border border-[#DCD0BD]">
                      {pIdx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm sm:text-base font-semibold text-[#20201D]">
                          Parcel {pIdx + 1}: {pkg.shopName}
                        </span>
                        <span className="text-[10px] bg-[#EBF0E9] text-[#52644B] px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                          Certified Artisan
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B685F] flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#89714F]" />
                        <span>
                          Crafted by <strong>{pkg.artisanName}</strong> • {pkg.state} ({pkg.craftTradition})
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-[#6B685F] block">Parcel Subtotal</span>
                    <span className="font-serif text-sm font-semibold text-[#20201D]">
                      {formatINR(pkg.packageSubtotalPaise)}
                    </span>
                  </div>
                </div>

                {/* Items in this Artisan Parcel */}
                <div className="p-6 divide-y divide-[#F3ECE1] space-y-4">
                  {pkg.items.map((item) => {
                    const primaryImg =
                      item.product.images.find((i) => i.isPrimary)?.url ||
                      item.product.images[0]?.url;

                    return (
                      <div
                        key={item.id}
                        className="pt-4 first:pt-0 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                      >
                        <div className="flex gap-4 items-center">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="w-20 h-24 sm:w-24 sm:h-28 rounded bg-[#F3ECE1] overflow-hidden shrink-0 border border-[#DCD0BD]"
                          >
                            <img
                              src={primaryImg}
                              alt={item.product.title || "Cart product craft item"}
                              className="w-full h-full object-cover"
                            />
                          </Link>

                          <div className="space-y-1">
                            <span className="text-[11px] font-semibold text-[#89714F] uppercase tracking-wider block">
                              {item.product.craftType}
                            </span>
                            <h3 className="font-serif text-base font-medium text-[#20201D] hover:text-[#89714F] leading-tight">
                              <Link href={`/products/${item.product.slug}`}>
                                {item.product.title}
                              </Link>
                            </h3>
                            <p className="text-xs text-[#6B685F]">
                              Stock status: <span className="text-emerald-700 font-medium">In Workshop ({item.product.stock > 0 ? `${item.product.stock} available` : "Made to order"})</span>
                            </p>
                            <div className="font-serif text-base font-medium text-[#20201D] pt-1">
                              {formatINR(item.product.pricePaise)}
                            </div>
                          </div>
                        </div>

                        {/* Quantity and Controls */}
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-[#F3ECE1]">
                          <div className="flex items-center border border-[#DCD0BD] rounded bg-[#F8F5EF]">
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                              className="p-1.5 text-[#20201D] hover:bg-[#E8E0D2] transition-colors cursor-pointer"
                              title="Decrease quantity"
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
                              className="p-1.5 text-[#20201D] hover:bg-[#E8E0D2] transition-colors cursor-pointer"
                              title="Increase quantity"
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
                            className="text-[#6B685F] hover:text-[#A44A3F] p-1.5 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Parcel Shipping Sub-Note */}
                <div className="bg-[#FAF7F2] px-6 py-2.5 border-t border-[#E8E0D2] text-[11px] text-[#6B685F] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#89714F]" />
                    <span>Dispatches via Insured Pan-India Courier from {pkg.state} within 48h</span>
                  </div>
                  <span className="text-[#52644B] font-semibold">Fragile-Safe Packaging</span>
                </div>
              </div>
            ))}

            {/* Direct Artisan Fair Trade Banner */}
            <div className="p-4 rounded-xl bg-[#EBF0E9] border border-[#DCD0BD] flex items-start gap-3.5 text-xs text-[#52644B]">
              <HeartHandshake className="w-5 h-5 shrink-0 text-[#52644B] mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold block text-sm">
                  Fair Trade & RBI Escrow Protection
                </span>
                <p className="leading-relaxed">
                  <strong>84% Direct Artisan Remittance:</strong> For every craft purchased, 84% settles directly into the artisan’s verified bank account under Section 194-O compliant TDS after delivery confirmation.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-[#E8E0D2] rounded-xl p-6 space-y-6 shadow-xs sticky top-28">
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
                  <span>Artisan Studios</span>
                  <span className="font-semibold text-[#20201D]">
                    {packageCount} Independent Atelier{packageCount > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex justify-between text-[#6B685F]">
                  <span>Insured Fragile Transit</span>
                  <span className="font-semibold text-[#20201D]">
                    {shippingFeePaise === 0 ? (
                      <span className="text-emerald-700 font-semibold">FREE</span>
                    ) : (
                      formatINR(shippingFeePaise)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-[#6B685F]">
                  <span>Estimated GST (5% Handcrafted)</span>
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
                className="w-full py-4 px-4 rounded-lg bg-[#20201D] hover:bg-[#89714F] text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="pt-2 space-y-2 border-t border-[#F3ECE1] text-[11px] text-[#6B685F]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#52644B]" />
                  <span>256-Bit Encrypted Indian Banking Channels</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#89714F]" />
                  <span>Doorstep Fragile Delivery Pan-India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
