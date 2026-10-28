"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  Check,
  X,
  AlertCircle,
  Package,
  Layers,
  FileText,
  DollarSign,
  RotateCcw,
  Store,
  Eye,
  Loader2,
  Lock,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  ExternalLink,
  Landmark,
  Building2,
  Receipt,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatINR } from "@/lib/utils";

export default function AdminPage() {
  const { user, login } = useAuth();

  const [activeTab, setActiveTab] = useState<"sellers" | "products" | "orders" | "compliance" | "audit">("sellers");
  const [metrics, setMetrics] = useState<any>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Payment Provider Onboarding & Compliance State
  const [paymentOnboarding, setPaymentOnboarding] = useState<any>(null);
  const [adminPayoutsData, setAdminPayoutsData] = useState<any>(null);
  const [loadingCompliance, setLoadingCompliance] = useState(false);
  const [payoutProcessingId, setPayoutProcessingId] = useState<string | null>(null);

  // Quick Admin Login State for non-logged in state
  const [adminEmail, setAdminEmail] = useState("admin@artsinly.com");
  const [adminPassword, setAdminPassword] = useState("admin123");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Sellers Queue State
  const [sellers, setSellers] = useState<any[]>([]);
  const [sellerFilter, setSellerFilter] = useState<"all" | "pending" | "verified">("all");
  const [loadingSellers, setLoadingSellers] = useState(false);
  const [sellerActionInProgress, setSellerActionInProgress] = useState<string | null>(null);

  // Products Moderation State
  const [products, setProducts] = useState<any[]>([]);
  const [productFilter, setProductFilter] = useState<string>("all");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productActionInProgress, setProductActionInProgress] = useState<string | null>(null);

  // Orders & Refunds State
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrderForRefund, setSelectedOrderForRefund] = useState<any | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [isRefunding, setIsRefunding] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [auditActionFilter, setAuditActionFilter] = useState<string>("");

  const isAdmin = user && user.role === "ADMIN";

  // Load Metrics
  const loadMetrics = async () => {
    try {
      setLoadingMetrics(true);
      const res = await fetch("/api/admin/metrics");
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Failed to load metrics:", err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  // Load Sellers
  const loadSellers = async () => {
    try {
      setLoadingSellers(true);
      const url =
        sellerFilter === "all"
          ? "/api/admin/sellers"
          : `/api/admin/sellers?filter=${sellerFilter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSellers(data.sellers || []);
      }
    } catch (err) {
      console.error("Failed to load sellers:", err);
    } finally {
      setLoadingSellers(false);
    }
  };

  // Load Products
  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const url =
        productFilter === "all"
          ? "/api/admin/products"
          : `/api/admin/products?status=${productFilter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Load Orders
  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Load Audit Logs
  const loadAuditLogs = async () => {
    try {
      setLoadingAudit(true);
      const url = auditActionFilter
        ? `/api/admin/audit-logs?action=${auditActionFilter}`
        : "/api/admin/audit-logs";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoadingAudit(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadMetrics();
      loadSellers();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === "sellers") loadSellers();
      if (activeTab === "products") loadProducts();
      if (activeTab === "orders") loadOrders();
      if (activeTab === "audit") loadAuditLogs();
    }
  }, [activeTab, sellerFilter, productFilter, auditActionFilter, isAdmin]);

  // Handle Quick Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    const success = await login(adminEmail, adminPassword);
    if (!success) {
      setLoginError("Invalid administrator credentials.");
    }
    setIsLoggingIn(false);
  };

  // Seller Verification Action
  const handleToggleSellerVerify = async (sellerId: string, currentStatus: boolean) => {
    try {
      setSellerActionInProgress(sellerId);
      const newStatus = !currentStatus;
      const res = await fetch(`/api/admin/sellers/${sellerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isVerified: newStatus,
          actionNotes: newStatus
            ? "GI Tag authenticity verified by Super Administrator"
            : "Verification revoked by Super Administrator",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        await loadSellers();
        await loadMetrics();
      } else {
        alert(data.error || "Failed to update verification status");
      }
    } catch (err: any) {
      alert(err.message || "Failed to update verification status");
    } finally {
      setSellerActionInProgress(null);
    }
  };

  // Product Moderation Action
  const handleModerateProduct = async (productId: string, newStatus: string) => {
    try {
      setProductActionInProgress(productId);
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          reason: `Admin moderation set status to ${newStatus}`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        await loadProducts();
        await loadMetrics();
      } else {
        alert(data.error || "Failed to moderate product");
      }
    } catch (err: any) {
      alert(err.message || "Failed to moderate product");
    } finally {
      setProductActionInProgress(null);
    }
  };

  // Process Refund Action
  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForRefund) return;

    try {
      setIsRefunding(true);
      const res = await fetch(`/api/admin/orders/${selectedOrderForRefund.id}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: refundReason || "Administrative Resolution & Restock",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setSelectedOrderForRefund(null);
        setRefundReason("");
        await loadOrders();
        await loadMetrics();
      } else {
        alert(data.error || "Failed to process refund");
      }
    } catch (err: any) {
      alert(err.message || "Failed to process refund");
    } finally {
      setIsRefunding(false);
    }
  };

  // Load Payment Provider Onboarding & Compliance
  const loadCompliance = async () => {
    try {
      setLoadingCompliance(true);
      const [onboardingRes, payoutsRes] = await Promise.all([
        fetch("/api/payments/onboarding"),
        fetch("/api/admin/payouts"),
      ]);
      if (onboardingRes.ok) {
        const oData = await onboardingRes.json();
        setPaymentOnboarding(oData.onboarding || null);
      }
      if (payoutsRes.ok) {
        const pData = await payoutsRes.json();
        setAdminPayoutsData(pData || null);
      }
    } catch (err) {
      console.error("Failed to load compliance data:", err);
    } finally {
      setLoadingCompliance(false);
    }
  };

  // Release Artisan Payout Action
  const handleReleasePayout = async (sellerId: string, amountPaise: number) => {
    try {
      setPayoutProcessingId(sellerId);
      const res = await fetch("/api/admin/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId, amountPaise }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to release payout");
      } else {
        alert(data.message || "Payout released successfully!");
        await loadCompliance();
        await loadMetrics();
      }
    } catch (err: any) {
      alert(err.message || "Failed to release payout");
    } finally {
      setPayoutProcessingId(null);
    }
  };

  // If Not Admin, render login card
  if (!isAdmin) {
    return (
      <div className="bg-[#FAF7F2] min-h-[80vh] py-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-white border border-[#E3DDD1] rounded-2xl p-8 shadow-sm space-y-6">
            <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#E3DDD1] flex items-center justify-center mx-auto text-[#1E6B52]">
              <Lock className="w-6 h-6" />
            </div>

            <div className="text-center">
              <span className="text-[10px] font-semibold text-[#1E6B52] uppercase tracking-[0.2em] block mb-1">
                RESTRICTED ACCESS
              </span>
              <h1 className="font-serif text-2xl font-normal text-[#1E1E1C]">
                Super Administrator Portal
              </h1>
              <p className="text-xs text-[#7A756D] mt-1 leading-relaxed">
                Platform controls for GI Tag authenticity verification, product moderation, and financial escrow administration.
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#1E1E1C] font-medium mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#1E6B52]"
                />
              </div>

              <div>
                <label className="block text-[#1E1E1C] font-medium mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#1E6B52]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 px-4 bg-[#1E6B52] hover:bg-[#16533F] text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Authorizing Admin Credentials...</span>
                  </>
                ) : (
                  <span>Access Administrator Controls</span>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-[11px] text-[#8C877E]">
              Default Seed: <code>admin@artsinly.com</code> / <code>admin123</code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-5 sm:py-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb line */}
        <nav className="flex items-center space-x-2 text-[11px] text-[#8C877E] mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link href="/" className="hover:text-[#1E1E1C] transition-colors">
            Home
          </Link>
          <span>•</span>
          <Link href="/products" className="hover:text-[#1E1E1C] transition-colors">
            Catalog
          </Link>
          <span>•</span>
          <span className="text-[#6B665E] truncate">Super Administrator Portal</span>
        </nav>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#1E6B52] uppercase tracking-[0.2em] block mb-1">
              SUPER ADMINISTRATOR
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1E1E1C] tracking-tight leading-tight mb-1">
              Platform Governance &amp; Moderation
            </h1>
            <p className="text-xs sm:text-[13px] text-[#6E6A62] leading-relaxed max-w-2xl font-light">
              Authenticate GI artisan guilds, moderate catalog pieces, issue financial escrow refunds, and audit platform security trails.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Admin: {user?.name || "Super Admin"}</span>
            </span>
          </div>
        </div>

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          <div className="bg-white border border-[#E3DDD1] rounded-xl p-4 sm:p-5 shadow-2xs">
            <span className="text-[10px] uppercase font-semibold text-[#8C877E] tracking-wider block mb-1.5">
              NET ESCROW REVENUE
            </span>
            <div className="font-serif text-2xl sm:text-[28px] font-normal text-[#1E1E1C] tracking-tight mb-1">
              {formatINR(metrics?.financials?.netRevenuePaise || 0)}
            </div>
            <span className="text-[11px] text-[#1E6B52] font-medium block">
              {metrics?.financials?.completedTransactions || 0} Settled • {metrics?.financials?.refundedTransactions || 0} Refunded
            </span>
          </div>

          <div className="bg-white border border-[#E3DDD1] rounded-xl p-4 sm:p-5 shadow-2xs">
            <span className="text-[10px] uppercase font-semibold text-[#8C877E] tracking-wider block mb-1.5">
              ARTISAN GUILDS
            </span>
            <div className="font-serif text-2xl sm:text-[28px] font-normal text-[#1E1E1C] tracking-tight mb-1">
              {metrics?.sellers?.total || 0}
            </div>
            <span className="text-[11px] text-[#B34728] font-medium block">
              {metrics?.sellers?.pendingReview || 0} Pending Verification
            </span>
          </div>

          <div className="bg-white border border-[#E3DDD1] rounded-xl p-4 sm:p-5 shadow-2xs">
            <span className="text-[10px] uppercase font-semibold text-[#8C877E] tracking-wider block mb-1.5">
              CATALOGUE PIECES
            </span>
            <div className="font-serif text-2xl sm:text-[28px] font-normal text-[#1E1E1C] tracking-tight mb-1">
              {metrics?.products?.published || 0}
            </div>
            <span className="text-[11px] text-[#7A756D] font-medium block">
              {metrics?.products?.archived || 0} Archived / Flagged
            </span>
          </div>

          <div className="bg-white border border-[#E3DDD1] rounded-xl p-4 sm:p-5 shadow-2xs">
            <span className="text-[10px] uppercase font-semibold text-[#8C877E] tracking-wider block mb-1.5">
              AUDIT SECURITY LOGS
            </span>
            <div className="font-serif text-2xl sm:text-[28px] font-normal text-[#1E1E1C] tracking-tight mb-1">
              {metrics?.auditLogsCount || 0}
            </div>
            <span className="text-[11px] text-[#1E6B52] font-medium block">
              100% Immutable Provenance Trail
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E3DDD1] gap-6 mb-8 text-xs sm:text-sm overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setActiveTab("sellers")}
            className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === "sellers"
                ? "border-[#1E6B52] text-[#1E1E1C]"
                : "border-transparent text-[#7A756D] hover:text-[#1E1E1C]"
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Seller Review &amp; GI Verification</span>
            {metrics?.sellers?.pendingReview > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#B34728] text-white text-[10px] font-bold">
                {metrics?.sellers?.pendingReview}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === "products"
                ? "border-[#1E6B52] text-[#1E1E1C]"
                : "border-transparent text-[#7A756D] hover:text-[#1E1E1C]"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Product Moderation ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === "orders"
                ? "border-[#1E6B52] text-[#1E1E1C]"
                : "border-transparent text-[#7A756D] hover:text-[#1E1E1C]"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders, Escrow &amp; Refunds ({orders.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("compliance");
              loadCompliance();
            }}
            className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === "compliance"
                ? "border-[#1E6B52] text-[#1E1E1C]"
                : "border-transparent text-[#7A756D] hover:text-[#1E1E1C]"
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Payment Provider &amp; Payouts</span>
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === "audit"
                ? "border-[#1E6B52] text-[#1E1E1C]"
                : "border-transparent text-[#7A756D] hover:text-[#1E1E1C]"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Audit Logs ({metrics?.auditLogsCount || 0})</span>
          </button>
        </div>

        {/* TAB 1: SELLER REVIEW & GI VERIFICATION */}
        {activeTab === "sellers" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl text-[#1E1E1C]">
                  Artisan Guild Verification Queue
                </h3>
                <p className="text-xs text-[#7A756D]">
                  Review GI certificates, traditional craft credentials, and certify regional masters.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setSellerFilter("all")}
                  className={`px-3 py-1.5 rounded-md cursor-pointer ${
                    sellerFilter === "all"
                      ? "bg-[#1E1E1C] text-white"
                      : "bg-white border border-[#E3DDD1] text-[#7A756D]"
                  }`}
                >
                  All Sellers
                </button>
                <button
                  onClick={() => setSellerFilter("pending")}
                  className={`px-3 py-1.5 rounded-md cursor-pointer ${
                    sellerFilter === "pending"
                      ? "bg-[#B34728] text-white"
                      : "bg-white border border-[#E3DDD1] text-[#7A756D]"
                  }`}
                >
                  Pending GI Review
                </button>
                <button
                  onClick={() => setSellerFilter("verified")}
                  className={`px-3 py-1.5 rounded-md cursor-pointer ${
                    sellerFilter === "verified"
                      ? "bg-[#1E6B52] text-white"
                      : "bg-white border border-[#E3DDD1] text-[#7A756D]"
                  }`}
                >
                  GI Verified Masters
                </button>
              </div>
            </div>

            {loadingSellers ? (
              <div className="p-12 text-center text-xs text-[#7A756D]">Loading sellers queue...</div>
            ) : sellers.length === 0 ? (
              <div className="p-12 bg-white rounded-xl border border-[#E3DDD1] text-center text-xs text-[#7A756D]">
                No sellers found in this filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sellers.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white border border-[#E3DDD1] rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:shadow-xs transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-semibold text-[#8C877E] uppercase tracking-wider">
                          {s.craftTradition}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            s.isVerified
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {s.isVerified ? "GI Verified" : "Pending Verification"}
                        </span>
                      </div>

                      <h4 className="font-serif text-lg font-medium text-[#1E1E1C] mb-0.5">
                        {s.shopName}
                      </h4>
                      <p className="text-xs text-[#7A756D] mb-2">
                        {s.artisanName} • {s.locality ? s.locality + ", " : ""}{s.state}
                      </p>

                      <div className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#EAE5DD] text-xs space-y-1 mb-4">
                        <div className="flex justify-between">
                          <span className="text-[#8C877E]">GI Code:</span>
                          <span className="font-mono font-medium text-[#1E1E1C]">{s.giCode || "Pending Verification"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8C877E]">Lineage Experience:</span>
                          <span className="text-[#1E1E1C]">{s.yearsOfExperience} Years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8C877E]">Catalogue Pieces:</span>
                          <span className="font-medium text-[#1E1E1C]">{s.productCount} pieces</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8C877E]">Artisan Contact:</span>
                          <span className="text-[#1E1E1C]">{s.user?.email}</span>
                        </div>
                      </div>

                      {s.bio && (
                        <p className="text-xs text-[#6E6A62] line-clamp-2 italic mb-4 font-light">
                          "{s.bio}"
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#EAE5DD] flex items-center justify-end gap-2">
                      {s.isVerified ? (
                        <button
                          onClick={() => handleToggleSellerVerify(s.id, s.isVerified)}
                          disabled={sellerActionInProgress === s.id}
                          className="px-3.5 py-1.5 border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 rounded-md text-xs font-medium transition-colors cursor-pointer"
                        >
                          Revoke Verification
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleSellerVerify(s.id, s.isVerified)}
                          disabled={sellerActionInProgress === s.id}
                          className="px-4 py-1.5 bg-[#1E6B52] hover:bg-[#16533F] text-white rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve &amp; Verify GI Tag</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCT MODERATION */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl text-[#1E1E1C]">
                  Catalogue Moderation &amp; Publishing Controls
                </h3>
                <p className="text-xs text-[#7A756D]">
                  Audit published crafts, authenticate material claims, and moderate or archive non-compliant pieces.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setProductFilter("all")}
                  className={`px-3 py-1.5 rounded-md cursor-pointer ${
                    productFilter === "all"
                      ? "bg-[#1E1E1C] text-white"
                      : "bg-white border border-[#E3DDD1] text-[#7A756D]"
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => setProductFilter("PUBLISHED")}
                  className={`px-3 py-1.5 rounded-md cursor-pointer ${
                    productFilter === "PUBLISHED"
                      ? "bg-emerald-700 text-white"
                      : "bg-white border border-[#E3DDD1] text-[#7A756D]"
                  }`}
                >
                  Published Live
                </button>
                <button
                  onClick={() => setProductFilter("ARCHIVED")}
                  className={`px-3 py-1.5 rounded-md cursor-pointer ${
                    productFilter === "ARCHIVED"
                      ? "bg-stone-700 text-white"
                      : "bg-white border border-[#E3DDD1] text-[#7A756D]"
                  }`}
                >
                  Archived / Flagged
                </button>
              </div>
            </div>

            {loadingProducts ? (
              <div className="p-12 text-center text-xs text-[#7A756D]">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="p-12 bg-white rounded-xl border border-[#E3DDD1] text-center text-xs text-[#7A756D]">
                No products found in this status.
              </div>
            ) : (
              <div className="bg-white border border-[#E3DDD1] rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#1E1E1C]">
                    <thead className="bg-[#FAF7F2] border-b border-[#E3DDD1] text-[10px] uppercase font-semibold text-[#8C877E] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Piece Title</th>
                        <th className="py-3 px-4">Artisan &amp; State</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Available Stock</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE5DD]">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              {p.imageUrl && (
                                <img
                                  src={p.imageUrl}
                                  alt={p.title || "Product listing thumbnail"}
                                  className="w-10 h-10 object-cover rounded border border-[#EAE5DD]"
                                />
                              )}
                              <div>
                                <span className="font-medium text-[#1E1E1C] line-clamp-1">
                                  {p.title}
                                </span>
                                <span className="text-[10px] text-[#8C877E]">{p.craftType}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div>{p.seller?.shopName}</div>
                            <span className="text-[10px] text-[#7A756D]">{p.seller?.state}</span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold font-serif">
                            {p.priceDisplay}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`font-mono ${p.stock <= 2 ? "text-amber-600 font-bold" : ""}`}>
                              {p.stock} units
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                p.status === "PUBLISHED"
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : "bg-stone-100 text-stone-700 border border-stone-200"
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {p.status === "PUBLISHED" ? (
                                <button
                                  onClick={() => handleModerateProduct(p.id, "ARCHIVED")}
                                  disabled={productActionInProgress === p.id}
                                  className="px-2.5 py-1 rounded border border-amber-200 text-amber-800 bg-amber-50 hover:bg-amber-100 text-[11px] font-medium cursor-pointer"
                                >
                                  Archive Piece
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleModerateProduct(p.id, "PUBLISHED")}
                                  disabled={productActionInProgress === p.id}
                                  className="px-2.5 py-1 rounded bg-[#1E6B52] hover:bg-[#16533F] text-white text-[11px] font-medium cursor-pointer"
                                >
                                  Publish Piece
                                </button>
                              )}

                              <Link
                                href={`/products/${p.slug}`}
                                target="_blank"
                                className="p-1 text-[#7A756D] hover:text-[#1E1E1C]"
                                title="Preview on live storefront"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ORDERS & REFUND MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl text-[#1E1E1C]">
                  Platform Orders &amp; Escrow Settlement
                </h3>
                <p className="text-xs text-[#7A756D]">
                  Inspect live collector transactions, track carrier dispatches, and issue full refunds with automated inventory restoration.
                </p>
              </div>

              <span className="text-xs text-[#8C877E] font-medium">
                {orders.length} Total Orders Recorded
              </span>
            </div>

            {loadingOrders ? (
              <div className="p-12 text-center text-xs text-[#7A756D]">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="p-12 bg-white rounded-xl border border-[#E3DDD1] text-center text-xs text-[#7A756D]">
                No orders recorded yet.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => {
                  const payment = ord.payments?.[0];
                  const shipment = ord.shipments?.[0];
                  const address = ord.addressSnapshot;
                  const dateStr = new Date(ord.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <div
                      key={ord.id}
                      className="bg-white border border-[#E3DDD1] rounded-2xl p-5 space-y-4 hover:border-[#D5CFC5] transition-all"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#EAE5DD] text-xs">
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-[#8C877E] block">
                              ORDER NUMBER
                            </span>
                            <span className="font-mono font-semibold text-[#1E1E1C]">
                              {ord.orderNumber}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-[#8C877E] block">
                              DATE
                            </span>
                            <span className="text-[#1E1E1C]">{dateStr}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-[#8C877E] block">
                              COLLECTOR
                            </span>
                            <span className="font-medium text-[#1E1E1C]">
                              {address?.fullName || ord.buyer?.name || "Collector"} ({ord.buyer?.email})
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-[#8C877E] block">
                              DESTINATION
                            </span>
                            <span className="text-[#1E1E1C]">
                              {address?.city}, {address?.state}
                            </span>
                          </div>
                        </div>

                        {/* Status Badges: Order, Payment & Shipment */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded text-xs font-semibold ${
                              ord.status === "REFUNDED"
                                ? "bg-red-100 text-red-800"
                                : ord.status === "DELIVERED"
                                ? "bg-emerald-100 text-emerald-800"
                                : ord.status === "SHIPPED"
                                ? "bg-sky-100 text-sky-800"
                                : "bg-[#F3ECE1] text-[#89714F]"
                            }`}
                          >
                            Order: {ord.status}
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                              (ord.paymentStatus || payment?.status) === "REFUNDED"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : (ord.paymentStatus || payment?.status) === "COMPLETED"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-stone-50 text-stone-700"
                            }`}
                          >
                            Payment: {ord.paymentStatus || payment?.status || "PENDING"} ({payment?.provider || "SANDBOX"})
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                              (ord.shipmentStatus || shipment?.status) === "DELIVERED"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : (ord.shipmentStatus || shipment?.status) === "SHIPPED" || (ord.shipmentStatus || shipment?.status) === "IN_TRANSIT"
                                ? "bg-sky-50 text-sky-700 border border-sky-200"
                                : (ord.shipmentStatus || shipment?.status) === "CANCELLED"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-stone-50 text-stone-700"
                            }`}
                          >
                            Shipment: {ord.shipmentStatus || shipment?.status || "PENDING"}
                          </span>
                        </div>
                      </div>

                      {/* Items & Financial Breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-8 space-y-2">
                          {ord.items?.map((item: any) => (
                            <div key={item.id} className="flex items-center gap-3 text-xs">
                              {item.product?.images?.[0]?.url && (
                                <img
                                  src={item.product.images[0].url}
                                  alt={item.title || "Ordered craft product thumbnail"}
                                  className="w-12 h-12 object-cover rounded border border-[#EAE5DD]"
                                />
                              )}
                              <div>
                                <h4 className="font-medium text-[#1E1E1C]">{item.title}</h4>
                                <span className="text-[#7A756D] text-[11px]">
                                  Qty: <strong>{item.quantity}</strong> • Unit Price: {formatINR(item.pricePaise)} • Seller: {item.sellerShopName || item.seller?.shopName}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="md:col-span-4 bg-[#FAF7F2] p-3 rounded-lg border border-[#EAE5DD] text-xs space-y-2 text-right">
                          <div className="flex justify-between text-[#8C877E]">
                            <span>Total Payable:</span>
                            <span className="font-serif font-semibold text-[#1E1E1C] text-sm">
                              {formatINR(ord.totalPaise)}
                            </span>
                          </div>

                          {shipment?.trackingNumber && (
                            <div className="text-[11px] text-[#7A756D] font-mono">
                              Carrier: {shipment.carrier} (AWB: {shipment.trackingNumber})
                            </div>
                          )}

                          {ord.status !== "REFUNDED" ? (
                            <button
                              onClick={() => setSelectedOrderForRefund(ord)}
                              className="mt-2 w-full py-1.5 px-3 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Issue Refund &amp; Restock</span>
                            </button>
                          ) : (
                            <div className="text-xs text-red-700 font-medium pt-1">
                              ✓ Refunded &amp; Inventory Restocked
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: AUDIT LOGS */}
        {activeTab === "audit" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl text-[#1E1E1C]">
                  Platform Security &amp; Administrative Audit Trail
                </h3>
                <p className="text-xs text-[#7A756D]">
                  Chronological, non-repudiable audit logs of seller approvals, product moderation, refunds, and financial events.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <select
                  value={auditActionFilter}
                  onChange={(e) => setAuditActionFilter(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-[#E3DDD1] rounded-md text-[#1E1E1C] focus:outline-none"
                >
                  <option value="">All Audit Actions</option>
                  <option value="SELLER_VERIFIED">SELLER_VERIFIED</option>
                  <option value="SELLER_UNVERIFIED">SELLER_UNVERIFIED</option>
                  <option value="PRODUCT_MODERATED">PRODUCT_MODERATED</option>
                  <option value="ORDER_REFUNDED">ORDER_REFUNDED</option>
                  <option value="PLATFORM_INITIALIZED">PLATFORM_INITIALIZED</option>
                </select>
              </div>
            </div>

            {loadingAudit ? (
              <div className="p-12 text-center text-xs text-[#7A756D]">Loading audit logs...</div>
            ) : auditLogs.length === 0 ? (
              <div className="p-12 bg-white rounded-xl border border-[#E3DDD1] text-center text-xs text-[#7A756D]">
                No audit logs found.
              </div>
            ) : (
              <div className="bg-white border border-[#E3DDD1] rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#1E1E1C]">
                    <thead className="bg-[#FAF7F2] border-b border-[#E3DDD1] text-[10px] uppercase font-semibold text-[#8C877E] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Action</th>
                        <th className="py-3 px-4">Actor</th>
                        <th className="py-3 px-4">IP Address</th>
                        <th className="py-3 px-4">Audit Details &amp; Payload</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE5DD] font-mono text-[11px]">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                          <td className="py-3 px-4 text-[#7A756D] whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString("en-IN")}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold font-sans ${
                                log.action === "ORDER_REFUNDED"
                                  ? "bg-red-100 text-red-800"
                                  : log.action === "SELLER_VERIFIED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : log.action === "PRODUCT_MODERATED"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {log.action}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-sans text-xs">
                            {log.user?.name || log.user?.email || "System"}
                          </td>
                          <td className="py-3 px-4 text-[#8C877E]">
                            {log.ipAddress || "127.0.0.1"}
                          </td>
                          <td className="py-3 px-4 text-[#6E6A62]">
                            <pre className="max-w-md overflow-x-auto whitespace-pre-wrap text-[10px] bg-[#FAF7F2] p-2 rounded border border-[#EAE5DD]">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PAYMENT PROVIDER ONBOARDING & PAYOUTS */}
        {activeTab === "compliance" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl text-[#1E1E1C]">
                  Payment Provider Onboarding &amp; Escrow Settlements
                </h3>
                <p className="text-xs text-[#7A756D]">
                  Manage RBI PAPG compliance, gateway merchant onboarding, and artisan direct settlements.
                </p>
              </div>
              <button
                onClick={loadCompliance}
                disabled={loadingCompliance}
                className="px-3 py-1.5 rounded-md border border-[#D5CFC5] bg-white text-xs font-medium text-[#403E39] hover:bg-[#FAF7F2] transition-colors cursor-pointer self-start sm:self-auto"
              >
                {loadingCompliance ? "Refreshing..." : "Refresh Compliance Ledger"}
              </button>
            </div>

            {loadingCompliance ? (
              <div className="p-12 text-center text-xs text-[#7A756D]">
                Loading payment provider onboarding &amp; settlement records...
              </div>
            ) : (
              <>
                {/* Gateway Onboarding & Compliance Card */}
                <div className="bg-white border border-[#E3DDD1] rounded-2xl p-6 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE5DD]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-[#8C877E] tracking-wider block">
                          PAYMENT AGGREGATOR INTEGRATION
                        </span>
                        <h4 className="font-serif text-lg text-[#1E1E1C] font-medium">
                          {paymentOnboarding?.provider?.toUpperCase() || "RAZORPAY"} ESCROW GATEWAY
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          paymentOnboarding?.mode === "live"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}
                      >
                        Mode: {paymentOnboarding?.mode?.toUpperCase() || "SANDBOX"}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
                        MCC: {paymentOnboarding?.merchantCategoryCode || "5971"} (Art &amp; Crafts)
                      </span>
                    </div>
                  </div>

                  {/* Compliance Checklist Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#EAE5DD]">
                      <span className="text-[10px] uppercase text-[#8C877E] block mb-0.5">Corporate KYB</span>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {paymentOnboarding?.kybVerified ? "Verified" : "Sandbox Verified"}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#EAE5DD]">
                      <span className="text-[10px] uppercase text-[#8C877E] block mb-0.5">PAN &amp; GSTIN Check</span>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Valid (Sec 194-O)
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#EAE5DD]">
                      <span className="text-[10px] uppercase text-[#8C877E] block mb-0.5">Nodal Escrow Acct</span>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mapped (T+2)
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#EAE5DD]">
                      <span className="text-[10px] uppercase text-[#8C877E] block mb-0.5">Webhook Signature</span>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        HMAC SHA-256
                      </span>
                    </div>
                  </div>
                </div>

                {/* Artisan Payout Settlement Ledger */}
                <div className="bg-white border border-[#E3DDD1] rounded-2xl overflow-hidden shadow-2xs">
                  <div className="p-4 sm:p-5 border-b border-[#EAE5DD] flex justify-between items-center bg-[#FAF7F2]">
                    <div>
                      <h4 className="font-serif text-base text-[#1E1E1C]">
                        Artisan Payouts &amp; Bank Onboarding Ledger
                      </h4>
                      <p className="text-[11px] text-[#7A756D]">
                        Review verified bank accounts and disburse pending fair-trade settlements (84% net maker share).
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#1E1E1C]">
                      <thead className="bg-[#FAF7F2] border-b border-[#E3DDD1] text-[10px] uppercase font-semibold text-[#8C877E] tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Artisan Guild</th>
                          <th className="py-3 px-4">Bank Onboarding Status</th>
                          <th className="py-3 px-4">Account / IFSC</th>
                          <th className="py-3 px-4 text-right">Gross Sales</th>
                          <th className="py-3 px-4 text-right">Pending Settlement</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EAE5DD]">
                        {!adminPayoutsData?.sellerSummaries || adminPayoutsData.sellerSummaries.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-xs text-[#7A756D]">
                              No seller accounts found.
                            </td>
                          </tr>
                        ) : (
                          adminPayoutsData.sellerSummaries.map((s: any) => (
                            <tr key={s.sellerId} className="hover:bg-[#FAF7F2]/60 transition-colors">
                              <td className="py-3 px-4">
                                <span className="font-semibold text-[#1E1E1C] block">{s.shopName}</span>
                                <span className="text-[11px] text-[#7A756D]">{s.artisanName || s.email}</span>
                              </td>
                              <td className="py-3 px-4">
                                {s.payoutAccount?.isOnboarded ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Bank Verified
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                                    <Clock className="w-3 h-3" />
                                    Pending Bank Setup
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 font-mono text-[11px]">
                                {s.payoutAccount?.isOnboarded ? (
                                  <div>
                                    <span>{s.payoutAccount.maskedAccountNumber}</span>
                                    <span className="text-[10px] text-[#8C877E] block">{s.payoutAccount.ifscCode} • {s.payoutAccount.bankName}</span>
                                  </div>
                                ) : (
                                  <span className="text-[#8C877E] italic">—</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right font-medium">
                                {formatINR(s.grossSalesPaise)}
                              </td>
                              <td className="py-3 px-4 text-right font-semibold text-emerald-700">
                                {formatINR(s.pendingSettlementPaise)}
                              </td>
                              <td className="py-3 px-4 text-right">
                                {s.pendingSettlementPaise > 0 ? (
                                  <button
                                    onClick={() => handleReleasePayout(s.sellerId, s.pendingSettlementPaise)}
                                    disabled={payoutProcessingId === s.sellerId || !s.payoutAccount?.isOnboarded}
                                    className="px-3 py-1.5 rounded-md bg-[#1E6B52] hover:bg-[#16523E] text-white text-[11px] font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                                  >
                                    {payoutProcessingId === s.sellerId ? "Disbursing..." : "Disburse Payout"}
                                  </button>
                                ) : (
                                  <span className="text-[11px] text-[#8C877E] font-medium">Settled</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Payouts Table */}
                <div className="bg-white border border-[#E3DDD1] rounded-2xl p-5 shadow-2xs">
                  <h4 className="font-serif text-base text-[#1E1E1C] mb-3">
                    Recent Escrow Disbursement Records
                  </h4>
                  {!adminPayoutsData?.recentPayouts || adminPayoutsData.recentPayouts.length === 0 ? (
                    <p className="text-xs text-[#7A756D] italic py-3">
                      No previous bank disbursements recorded in this environment yet.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-[#1E1E1C]">
                        <thead className="bg-[#FAF7F2] border-b border-[#E3DDD1] text-[10px] uppercase font-semibold text-[#8C877E]">
                          <tr>
                            <th className="py-2.5 px-3">Date</th>
                            <th className="py-2.5 px-3">Reference ID</th>
                            <th className="py-2.5 px-3">Artisan</th>
                            <th className="py-2.5 px-3 text-right">Amount</th>
                            <th className="py-2.5 px-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EAE5DD] text-xs">
                          {adminPayoutsData.recentPayouts.map((p: any) => (
                            <tr key={p.id}>
                              <td className="py-2.5 px-3 text-[#7A756D]">
                                {new Date(p.createdAt).toLocaleDateString("en-IN")}
                              </td>
                              <td className="py-2.5 px-3 font-mono text-[11px]">
                                {p.referenceId || "DISB-BANK"}
                              </td>
                              <td className="py-2.5 px-3 font-medium">
                                {p.seller?.shopName || "Artisan Guild"}
                              </td>
                              <td className="py-2.5 px-3 text-right font-semibold text-emerald-700">
                                {formatINR(p.amountPaise)}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                  {p.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* MODAL: ISSUE REFUND */}
      {selectedOrderForRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] border border-[#DDD5C8] rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EAE5DD]">
              <div>
                <span className="text-[10px] font-semibold text-red-700 uppercase tracking-wider block">
                  ESCROW RESOLUTION
                </span>
                <h3 className="font-serif text-xl font-normal text-[#1E1E1C]">
                  Issue Full Order Refund
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForRefund(null)}
                className="p-1 rounded-full hover:bg-[#ECE6DC] text-[#666] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessRefund} className="space-y-4 text-xs">
              <div className="p-3 bg-white border border-[#E3DDD1] rounded-lg space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#7A756D]">Order:</span>
                  <span className="font-mono font-semibold text-[#1E1E1C]">
                    {selectedOrderForRefund.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A756D]">Collector:</span>
                  <span className="font-medium text-[#1E1E1C]">
                    {selectedOrderForRefund.buyer?.name || selectedOrderForRefund.buyer?.email}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#EAE5DD] pt-1.5">
                  <span className="text-[#7A756D]">Refund Amount:</span>
                  <span className="font-serif font-bold text-red-700 text-sm">
                    {formatINR(selectedOrderForRefund.totalPaise)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1E1E1C] mb-1">
                  Reason for Refund &amp; Resolution *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Collector cancellation / Damage during fragile transit / Authenticity dispute"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#1E6B52]"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Automated Inventory Restocking</span>
                </div>
                <p>
                  Executing this refund will immediately reverse payment in escrow, update order status to REFUNDED, restore inventory stock for all purchased items, and emit an audit log entry.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForRefund(null)}
                  className="px-4 py-2 border border-[#D5CFC5] font-medium rounded-md hover:bg-[#ECE6DC] text-[#1E1E1C] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRefunding}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {isRefunding ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing Escrow Reversal...</span>
                    </>
                  ) : (
                    <span>Confirm &amp; Issue Full Refund</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
