"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PRODUCTS } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/products/ProductCard";
import {
  Package,
  Heart,
  MapPin,
  User,
  Truck,
  ExternalLink,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";

function BuyerDashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as "orders" | "wishlist" | "addresses") || "orders";
  const [activeTab, setActiveTab] = useState(initialTab);

  const { wishlist } = useCart();
  const wishlistProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  // Mock buyer orders
  const orders = [
    {
      id: "ART-842918",
      date: "01 Oct 2026",
      status: "IN_TRANSIT",
      statusText: "Dispatched from Sanganer Kiln",
      carrier: "BlueDart Express Insured",
      trackingNumber: "BD-IN-98124018",
      estimatedDelivery: "05 Oct 2026",
      items: [
        {
          product: PRODUCTS[0],
          quantity: 1,
        },
      ],
      totalPaise: 385000,
    },
    {
      id: "ART-719302",
      date: "14 Sep 2026",
      status: "DELIVERED",
      statusText: "Delivered to Residence",
      carrier: "Delhivery Air Fragile",
      trackingNumber: "DLV-90812349",
      deliveredOn: "18 Sep 2026",
      items: [
        {
          product: PRODUCTS[4],
          quantity: 2,
        },
      ],
      totalPaise: 330000,
    },
  ];

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Buyer Header */}
        <div className="bg-white border border-[#E8E0D2] rounded-xl p-6 sm:p-8 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#F4EFE6] border border-[#DCD0BD] flex items-center justify-center text-[#89714F] font-serif text-xl font-bold">
              AS
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#20201D]">
                Aarav Sharma
              </h1>
              <p className="text-xs text-[#6B685F]">
                Patron Member • Supporting 4 Artisan Clusters
              </p>
            </div>
          </div>

          <Link
            href="/products"
            className="px-4 py-2 bg-[#20201D] hover:bg-[#89714F] text-white text-xs font-semibold rounded transition-colors"
          >
            Explore New Curations
          </Link>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-[#E8E0D2] gap-8 mb-8 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === "orders"
                ? "border-[#89714F] text-[#20201D]"
                : "border-transparent text-[#6B685F] hover:text-[#20201D]"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === "wishlist"
                ? "border-[#89714F] text-[#20201D]"
                : "border-transparent text-[#6B685F] hover:text-[#20201D]"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Wishlist ({wishlistProducts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("addresses")}
            className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === "addresses"
                ? "border-[#89714F] text-[#20201D]"
                : "border-transparent text-[#6B685F] hover:text-[#20201D]"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Delivery Addresses</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-[#E8E0D2] rounded-xl overflow-hidden shadow-xs"
              >
                {/* Order Top Bar */}
                <div className="bg-[#F8F5EF] p-4 sm:p-5 border-b border-[#E8E0D2] flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <span className="text-[#6B685F] block">Order Placed</span>
                      <span className="font-semibold text-[#20201D]">{order.date}</span>
                    </div>
                    <div>
                      <span className="text-[#6B685F] block">Total Amount</span>
                      <span className="font-semibold font-serif text-sm text-[#20201D]">
                        {formatINR(order.totalPaise)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6B685F] block">Order ID</span>
                      <span className="font-semibold text-[#20201D]">{order.id}</span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold ${
                      order.status === "DELIVERED"
                        ? "bg-[#EBF0E9] text-[#52644B]"
                        : "bg-[#F4EFE6] text-[#89714F]"
                    }`}
                  >
                    {order.status === "DELIVERED" ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Truck className="w-3.5 h-3.5" />
                    )}
                    <span>{order.statusText}</span>
                  </span>
                </div>

                {/* Tracking & Items */}
                <div className="p-6 space-y-4">
                  {order.status === "IN_TRANSIT" && (
                    <div className="p-3 bg-[#F8F5EF] border border-[#DCD0BD] rounded-lg text-xs flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-[#20201D]">
                        <Clock className="w-4 h-4 text-[#89714F]" />
                        <span>
                          Estimated Arrival: <strong>{order.estimatedDelivery}</strong> via {order.carrier}
                        </span>
                      </div>
                      <span className="font-mono text-[#89714F] text-[11px]">
                        AWB: {order.trackingNumber}
                      </span>
                    </div>
                  )}

                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-4 py-2 border-b last:border-0 border-[#F3ECE1]"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.product.images[0]?.url}
                          alt={item.product.title}
                          className="w-16 h-20 object-cover rounded bg-[#F3ECE1] border border-[#DCD0BD]"
                        />
                        <div>
                          <h3 className="font-serif text-sm sm:text-base font-medium text-[#20201D]">
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="hover:text-[#89714F]"
                            >
                              {item.product.title}
                            </Link>
                          </h3>
                          <p className="text-xs text-[#6B685F]">
                            By {item.product.artisan.artisanName} • {item.product.state}
                          </p>
                          <span className="text-xs font-semibold text-[#89714F]">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-serif text-base font-semibold text-[#20201D] block">
                          {formatINR(item.product.pricePaise * item.quantity)}
                        </span>
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="text-[11px] text-[#89714F] hover:underline"
                        >
                          Write a Review
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Wishlist */}
        {activeTab === "wishlist" && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div className="bg-white border border-[#E8E0D2] rounded-xl p-12 text-center space-y-4">
                <Heart className="w-10 h-10 text-[#89714F] mx-auto opacity-60" />
                <h3 className="font-serif text-xl font-medium text-[#20201D]">
                  No Saved Pieces in Wishlist
                </h3>
                <p className="text-xs text-[#6B685F] max-w-sm mx-auto">
                  Click the heart icon on any craft to save it for future curation or custom inquiries.
                </p>
                <Link
                  href="/products"
                  className="inline-block px-5 py-2.5 bg-[#20201D] text-white rounded text-xs font-semibold hover:bg-[#89714F]"
                >
                  Browse Catalogue
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saved Addresses */}
        {activeTab === "addresses" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-[#89714F] rounded-xl p-6 relative space-y-3">
              <span className="absolute top-4 right-4 text-[10px] bg-[#EBF0E9] text-[#52644B] px-2 py-0.5 rounded font-semibold uppercase">
                Default
              </span>
              <h3 className="font-serif text-base font-semibold text-[#20201D]">
                Aarav Sharma (Home)
              </h3>
              <p className="text-xs text-[#6B685F] leading-relaxed">
                42, Shanti Niketan, Civil Lines<br />
                Near Heritage Clock Tower<br />
                Jaipur, Rajasthan — 302006<br />
                Phone: +91 98765 43210
              </p>
              <div className="pt-2 flex gap-3 text-xs">
                <button className="text-[#89714F] font-semibold hover:underline">
                  Edit Address
                </button>
              </div>
            </div>

            <div className="border-2 border-dashed border-[#DCD0BD] rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-2 hover:border-[#89714F] cursor-pointer transition-colors bg-white/50">
              <MapPin className="w-8 h-8 text-[#89714F]" />
              <span className="text-xs font-semibold text-[#20201D]">
                + Add New Delivery Location
              </span>
              <span className="text-[11px] text-[#6B685F]">
                Save work, studio, or gifting destination
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BuyerDashboardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm">Loading your dashboard...</div>}>
      <BuyerDashboardContent />
    </Suspense>
  );
}
