"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PRODUCTS, ARTISANS } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";
import {
  Package,
  TrendingUp,
  ShoppingBag,
  Clock,
  Plus,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  Store,
  DollarSign,
  Eye,
  Settings,
} from "lucide-react";

export default function SellerDashboardPage() {
  const currentSeller = ARTISANS[0]; // Maheshwar Kumbhar (Jaipur Blue Pottery)
  const [activeTab, setActiveTab] = useState<"overview" | "listings" | "orders" | "payouts">("overview");

  // Simulated seller metrics
  const totalSalesPaise = 34500000; // ₹3,45,000
  const pendingPayoutPaise = 5200000; // ₹52,000
  const activeOrdersCount = 8;
  const sellerProducts = PRODUCTS.filter((p) => p.artisan.id === currentSeller.id);

  // Simulated orders
  const recentOrders = [
    {
      id: "ord-101",
      customer: "Priya Menon",
      item: "Hand-Painted Cobalt Floral Amphora",
      pricePaise: 385000,
      status: "DISPATCHED",
      date: "02 Oct 2026",
    },
    {
      id: "ord-102",
      customer: "Vikram Singhania",
      item: "Jaipur Quartz Indigo Planter",
      pricePaise: 240000,
      status: "PREPARING",
      date: "01 Oct 2026",
    },
    {
      id: "ord-103",
      customer: "Neha Kapoor",
      item: "Cobalt Persian Tile Set (4 pcs)",
      pricePaise: 180000,
      status: "DELIVERED",
      date: "28 Sep 2026",
    },
  ];

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Seller Shop Header */}
        <div className="bg-white border border-[#E8E0D2] rounded-xl p-6 sm:p-8 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentSeller.avatarUrl}
              alt={currentSeller.artisanName}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#89714F]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#20201D]">
                  {currentSeller.shopName}
                </h1>
                <span className="text-[10px] bg-[#EBF0E9] text-[#52644B] px-2 py-0.5 rounded font-semibold uppercase">
                  Verified Studio
                </span>
              </div>
              <p className="text-xs text-[#6B685F]">
                Artisan: {currentSeller.artisanName} • {currentSeller.locality}, {currentSeller.state}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href={`/artisans/${currentSeller.slug}`}
              className="flex-1 md:flex-none px-4 py-2 text-xs font-semibold rounded border border-[#DCD0BD] text-[#20201D] hover:bg-[#F8F5EF] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Public Storefront</span>
            </Link>
            <Link
              href="/seller/products/new"
              className="flex-1 md:flex-none px-4 py-2 text-xs font-semibold rounded bg-[#20201D] text-white hover:bg-[#89714F] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Craft Listing</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-[#E8E0D2] gap-6 mb-8 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 font-medium transition-colors border-b-2 ${
              activeTab === "overview"
                ? "border-[#89714F] text-[#20201D]"
                : "border-transparent text-[#6B685F] hover:text-[#20201D]"
            }`}
          >
            Studio Overview
          </button>
          <button
            onClick={() => setActiveTab("listings")}
            className={`pb-3 font-medium transition-colors border-b-2 ${
              activeTab === "listings"
                ? "border-[#89714F] text-[#20201D]"
                : "border-transparent text-[#6B685F] hover:text-[#20201D]"
            }`}
          >
            Craft Listings ({sellerProducts.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 font-medium transition-colors border-b-2 ${
              activeTab === "orders"
                ? "border-[#89714F] text-[#20201D]"
                : "border-transparent text-[#6B685F] hover:text-[#20201D]"
            }`}
          >
            Fulfilment Orders ({activeOrdersCount})
          </button>
          <button
            onClick={() => setActiveTab("payouts")}
            className={`pb-3 font-medium transition-colors border-b-2 ${
              activeTab === "payouts"
                ? "border-[#89714F] text-[#20201D]"
                : "border-transparent text-[#6B685F] hover:text-[#20201D]"
            }`}
          >
            Direct Payouts & Settlement
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-[#E8E0D2] rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-[#89714F] mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6B685F]">
                    Gross Art Sales
                  </span>
                  <TrendingUp className="w-5 h-5 text-[#89714F]" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-medium text-[#20201D]">
                  {formatINR(totalSalesPaise)}
                </div>
                <div className="text-[11px] text-[#52644B] font-medium mt-1">
                  ↑ 14% higher than last lunar month
                </div>
              </div>

              <div className="bg-white border border-[#E8E0D2] rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-[#89714F] mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6B685F]">
                    Upcoming Settlement
                  </span>
                  <DollarSign className="w-5 h-5 text-[#89714F]" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-medium text-[#20201D]">
                  {formatINR(pendingPayoutPaise)}
                </div>
                <div className="text-[11px] text-[#6B685F] mt-1">
                  Transfers to SBI Account ••••• 8421
                </div>
              </div>

              <div className="bg-white border border-[#E8E0D2] rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-[#89714F] mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6B685F]">
                    Pending Kiln & Packing
                  </span>
                  <Package className="w-5 h-5 text-[#89714F]" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-medium text-[#20201D]">
                  {activeOrdersCount} Pieces
                </div>
                <div className="text-[11px] text-[#89714F] font-medium mt-1">
                  3 due for courier handover today
                </div>
              </div>

              <div className="bg-white border border-[#E8E0D2] rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between text-[#89714F] mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6B685F]">
                    Artisan Rating
                  </span>
                  <CheckCircle className="w-5 h-5 text-[#52644B]" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-medium text-[#20201D]">
                  4.95 / 5.0
                </div>
                <div className="text-[11px] text-[#6B685F] mt-1">
                  Based on 64 verified collector reviews
                </div>
              </div>
            </div>

            {/* Recent Incoming Orders Table */}
            <div className="bg-white border border-[#E8E0D2] rounded-xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-medium text-[#20201D]">
                  Recent Orders Awaiting Dispatch
                </h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs text-[#89714F] font-semibold hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8F5EF] text-[#6B685F] uppercase border-y border-[#E8E0D2]">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Order ID</th>
                      <th className="py-2.5 px-4 font-semibold">Buyer Name</th>
                      <th className="py-2.5 px-4 font-semibold">Handcrafted Piece</th>
                      <th className="py-2.5 px-4 font-semibold">Settlement Value</th>
                      <th className="py-2.5 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3ECE1]">
                    {recentOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#F8F5EF]/60">
                        <td className="py-3 px-4 font-semibold text-[#20201D]">{ord.id}</td>
                        <td className="py-3 px-4 text-[#20201D]">{ord.customer}</td>
                        <td className="py-3 px-4 text-[#6B685F]">{ord.item}</td>
                        <td className="py-3 px-4 font-serif font-medium text-[#20201D]">
                          {formatINR(ord.pricePaise)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              ord.status === "DELIVERED"
                                ? "bg-[#EBF0E9] text-[#52644B]"
                                : ord.status === "DISPATCHED"
                                ? "bg-[#F4EFE6] text-[#89714F]"
                                : "bg-[#F8F5EF] text-[#20201D]"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Listings */}
        {activeTab === "listings" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-medium text-[#20201D]">
                Active Studio Listings
              </h3>
              <Link
                href="/seller/products/new"
                className="px-4 py-2 bg-[#20201D] text-white rounded text-xs font-semibold hover:bg-[#89714F] flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Listing</span>
              </Link>
            </div>

            <div className="bg-white border border-[#E8E0D2] rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F5EF] text-[#6B685F] uppercase border-b border-[#E8E0D2]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Craft Artifact</th>
                    <th className="py-3 px-4 font-semibold">Craft Category</th>
                    <th className="py-3 px-4 font-semibold">Unit Price</th>
                    <th className="py-3 px-4 font-semibold">Studio Stock</th>
                    <th className="py-3 px-4 font-semibold">Listing Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3ECE1]">
                  {sellerProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#F8F5EF]/60">
                      <td className="py-3 px-4 font-medium text-[#20201D] flex items-center gap-3">
                        <img
                          src={prod.images[0]?.url}
                          alt={prod.title}
                          className="w-10 h-12 object-cover rounded bg-[#F3ECE1] border border-[#DCD0BD]"
                        />
                        <span className="truncate max-w-xs">{prod.title}</span>
                      </td>
                      <td className="py-3 px-4 text-[#6B685F]">{prod.craftType}</td>
                      <td className="py-3 px-4 font-serif font-medium text-[#20201D]">
                        {formatINR(prod.pricePaise)}
                      </td>
                      <td className="py-3 px-4 text-[#20201D]">
                        {prod.stock > 0 ? `${prod.stock} units` : "Made to order"}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EBF0E9] text-[#52644B]">
                          PUBLISHED
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/products/${prod.slug}`}
                          className="text-[#89714F] hover:underline font-semibold"
                        >
                          View Live
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Orders */}
        {activeTab === "orders" && (
          <div className="bg-white border border-[#E8E0D2] rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-xl font-medium text-[#20201D]">
              All Shop Orders
            </h3>
            <p className="text-xs text-[#6B685F]">
              Mark orders as packed or dispatched to trigger automatic courier pickup at your village cluster.
            </p>
            <div className="space-y-3 pt-2">
              {recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded border border-[#E8E0D2] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                  <div>
                    <div className="font-semibold text-xs text-[#20201D]">
                      {ord.id} • {ord.item}
                    </div>
                    <div className="text-[11px] text-[#6B685F]">
                      Collector: {ord.customer} • Ordered on {ord.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-medium text-sm text-[#20201D]">
                      {formatINR(ord.pricePaise)}
                    </span>
                    <button className="px-3 py-1 bg-[#20201D] text-white rounded text-[11px] hover:bg-[#89714F]">
                      Print Shipping Slip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Payouts */}
        {activeTab === "payouts" && (
          <div className="bg-white border border-[#E8E0D2] rounded-xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3ECE1]">
              <div>
                <h3 className="font-serif text-xl font-medium text-[#20201D]">
                  Direct Bank Settlements
                </h3>
                <p className="text-xs text-[#6B685F]">
                  Settlements are processed directly to your Aadhaar-linked or IFSC bank account.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#6B685F]">Verified Account</span>
                <div className="font-medium text-xs text-[#20201D]">State Bank of India (Jaipur)</div>
              </div>
            </div>

            <div className="p-4 rounded bg-[#EBF0E9] border border-[#DCD0BD] text-xs text-[#52644B]">
              Next automatic settlement of <strong>{formatINR(pendingPayoutPaise)}</strong> scheduled for Tuesday, 06 Oct 2026.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
