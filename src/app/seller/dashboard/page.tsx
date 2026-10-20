"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  X,
  Upload,
  Check,
  Edit3,
  ShieldCheck,
  Loader2,
  Sparkles,
  Store,
  Trash2,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Layers,
  Archive,
  AlertCircle,
  ExternalLink,
  Landmark,
  Building2,
  CreditCard,
  Receipt,
} from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";
import { useAuth } from "@/context/AuthContext";
import { formatINR } from "@/lib/utils";

interface StudioProduct {
  id: string;
  slug: string;
  title: string;
  category: string;
  craftAndMaterial: string;
  price: number; // in rupees
  priceDisplay: string;
  status: string;
  imageUrl: string;
  stock: number;
  description?: string;
  dimensions?: string;
  materials?: string;
}

interface SellerOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  buyer: {
    name: string;
    email: string;
    phone?: string;
  };
  addressSnapshot: {
    fullName: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    phone?: string;
  };
  sellerItems: Array<{
    id: string;
    productId: string;
    title: string;
    pricePaise: number;
    quantity: number;
    imageUrl: string;
  }>;
  sellerTotalPaise: number;
  shipments?: Array<{
    carrier: string;
    trackingNumber: string;
    status: string;
  }>;
}

const FALLBACK_PRODUCTS: StudioProduct[] = [
  {
    id: "sp-1",
    slug: "modern-ethnic-ceramic-vase-terracotta-indigenous-pattern",
    title: "Modern Ethnic Ceramic Vase",
    category: "Vases",
    craftAndMaterial: "Terracotta Pottery",
    price: 126.99,
    priceDisplay: "₹126.99",
    status: "Live in Marketplace",
    imageUrl:
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=300&q=80",
    stock: 12,
  },
  {
    id: "sp-2",
    slug: "hand-carved-floral-high-relief-sheesham-clock",
    title: "Hand-Carved Floral High-Relief Sheesham Panel",
    category: "Wall Decor",
    craftAndMaterial: "Wood Carving",
    price: 700.0,
    priceDisplay: "₹700.00",
    status: "Live in Marketplace",
    imageUrl:
      "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=300&q=80",
    stock: 4,
  },
  {
    id: "sp-3",
    slug: "sacred-srinathji-gold-leaf-pichwai-miniature",
    title: "Sacred Srinathji Gold-Leaf Pichwai Miniature Painting",
    category: "Paintings",
    craftAndMaterial: "Miniature Painting",
    price: 1500.0,
    priceDisplay: "₹1,500.00",
    status: "Live in Marketplace",
    imageUrl:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=300&q=80",
    stock: 2,
  },
];

export default function SellerDashboardPage() {
  const { user, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState<"catalogue" | "orders" | "payouts">("catalogue");
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [products, setProducts] = useState<StudioProduct[]>(FALLBACK_PRODUCTS);
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Bank Account & Payout Onboarding State
  const [payoutAccount, setPayoutAccount] = useState<any>(null);
  const [payoutSummary, setPayoutSummary] = useState<any>(null);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [bankHolderName, setBankHolderName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankConfirmAccount, setBankConfirmAccount] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [bankName, setBankName] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [gstin, setGstin] = useState("");
  const [taxExemption, setTaxExemption] = useState(true);
  const [isSavingBank, setIsSavingBank] = useState(false);
  const [bankSaveError, setBankSaveError] = useState("");
  const [bankSaveSuccess, setBankSaveSuccess] = useState("");

  // New Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCraft, setNewCraft] = useState("");
  const [newCategory, setNewCategory] = useState("Vases");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("10");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<StudioProduct | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCraft, setEditCraft] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("10");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);

  // Fulfillment Modal State
  const [selectedOrderForFulfilment, setSelectedOrderForFulfilment] = useState<SellerOrder | null>(null);
  const [fulfilmentStatus, setFulfilmentStatus] = useState<string>("PROCESSING");
  const [carrierName, setCarrierName] = useState<string>("BlueDart Express Insured");
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [isUpdatingFulfilment, setIsUpdatingFulfilment] = useState(false);

  // Edit Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editShopName, setEditShopName] = useState("");
  const [editArtisanName, setEditArtisanName] = useState("");
  const [editCraftTradition, setEditCraftTradition] = useState("");
  const [editState, setEditState] = useState("");
  const [editLocality, setEditLocality] = useState("");
  const [editGiCode, setEditGiCode] = useState("");
  const [editBio, setEditBio] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileRes, productsRes, ordersRes, accountRes, payoutsRes] = await Promise.all([
        fetch("/api/seller/profile"),
        fetch("/api/seller/products"),
        fetch("/api/seller/orders"),
        fetch("/api/seller/payout-account"),
        fetch("/api/seller/payouts"),
      ]);

      if (accountRes.ok) {
        const accData = await accountRes.json();
        setPayoutAccount(accData.account || null);
        if (accData.account?.isOnboarded) {
          setBankHolderName(accData.account.accountHolderName || "");
          setBankIfsc(accData.account.ifscCode || "");
          setBankName(accData.account.bankName || "");
        }
      }

      if (payoutsRes.ok) {
        const payData = await payoutsRes.json();
        setPayoutSummary(payData.summary || null);
      }

      if (profileRes.ok) {
        const profData = await profileRes.json();
        if (profData.profile) {
          setSellerProfile(profData.profile);
          setEditShopName(profData.profile.shopName || "");
          setEditArtisanName(profData.profile.artisanName || "");
          setEditCraftTradition(profData.profile.craftTradition || "");
          setEditState(profData.profile.state || "");
          setEditLocality(profData.profile.locality || "");
          setEditGiCode(profData.profile.giCode || "");
          setEditBio(profData.profile.bio || "");
        }
      }

      if (productsRes.ok) {
        const prodData = await productsRes.json();
        if (prodData.products && prodData.products.length > 0) {
          const mapped = prodData.products.map((p: any) => {
            const stockQty = p.inventory?.[0]?.quantity ?? 10;
            const priceRs = p.basePricePaise / 100;
            return {
              id: p.id,
              slug: p.slug,
              title: p.title,
              category: p.category?.name || "Traditional Crafts",
              craftAndMaterial: p.craftType || "Handcrafted Heritage",
              price: priceRs,
              priceDisplay: `₹${priceRs.toFixed(2)}`,
              status: p.status === "ARCHIVED" ? "Archived" : "Live in Marketplace",
              imageUrl:
                p.images?.[0]?.url ||
                "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=300&q=80",
              stock: stockQty,
              description: p.description,
              dimensions: p.dimensions,
              materials: p.materials,
            };
          });
          setProducts(mapped);
        }
      }

      if (ordersRes.ok) {
        const ordData = await ordersRes.json();
        if (ordData.orders) {
          setOrders(ordData.orders);
        }
      }
    } catch (err) {
      console.error("Failed to load seller dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Handle Product Create
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    try {
      setIsCreatingProduct(true);
      const res = await fetch("/api/seller/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          craftType: newCraft || sellerProfile?.craftTradition || "Traditional Crafts",
          price: newPrice,
          initialStock: parseInt(newStock, 10) || 10,
          description: newDescription,
          imageUrl:
            newImageUrl ||
            "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
        }),
      });

      if (res.ok) {
        await loadData();
        setIsModalOpen(false);
        setNewTitle("");
        setNewCraft("");
        setNewPrice("");
        setNewStock("10");
        setNewImageUrl("");
        setNewDescription("");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create product listing");
      }
    } catch (err: any) {
      alert(err.message || "Failed to create product listing");
    } finally {
      setIsCreatingProduct(false);
    }
  };

  // Open Edit Product Modal
  const openEditProduct = (prod: StudioProduct) => {
    setEditingProduct(prod);
    setEditTitle(prod.title);
    setEditCraft(prod.craftAndMaterial);
    setEditPrice(prod.price.toString());
    setEditStock(prod.stock.toString());
    setEditImageUrl(prod.imageUrl);
    setEditDescription(prod.description || "");
  };

  // Handle Product Update
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      setIsUpdatingProduct(true);
      const res = await fetch(`/api/seller/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          craftType: editCraft,
          price: editPrice,
          stock: editStock,
          imageUrl: editImageUrl,
          description: editDescription,
        }),
      });

      if (res.ok) {
        await loadData();
        setEditingProduct(null);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update product");
      }
    } catch (err: any) {
      alert(err.message || "Failed to update product");
    } finally {
      setIsUpdatingProduct(false);
    }
  };

  // Handle Product Delete / Archive
  const handleDeleteProduct = async (productId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete or archive "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/seller/products/${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Product removed.");
        await loadData();
      } else {
        alert(data.error || "Failed to remove product");
      }
    } catch (err: any) {
      alert(err.message || "Failed to remove product");
    }
  };

  // Handle Stock Quick Adjust
  const handleStockAdjust = async (productId: string, currentStock: number, delta: number) => {
    const newStockVal = Math.max(0, currentStock + delta);
    try {
      const res = await fetch(`/api/seller/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStockVal }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, stock: newStockVal } : p))
        );
      }
    } catch (err) {
      console.error("Stock adjust error:", err);
    }
  };

  // Open Fulfilment Modal
  const openFulfilmentModal = (order: SellerOrder) => {
    setSelectedOrderForFulfilment(order);
    setFulfilmentStatus(order.status === "PENDING" ? "PROCESSING" : order.status);
    const existingShipment = order.shipments?.[0];
    setCarrierName(existingShipment?.carrier || "BlueDart Express Insured");
    setTrackingNumber(
      existingShipment?.trackingNumber || `BD-IN-${Math.floor(10000000 + Math.random() * 90000000)}`
    );
  };

  // Handle Fulfilment Update
  const handleUpdateFulfilment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForFulfilment) return;

    try {
      setIsUpdatingFulfilment(true);
      const res = await fetch(`/api/seller/orders/${selectedOrderForFulfilment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: fulfilmentStatus,
          carrier: carrierName,
          trackingNumber,
        }),
      });

      if (res.ok) {
        await loadData();
        setSelectedOrderForFulfilment(null);
        alert(
          fulfilmentStatus === "SHIPPED"
            ? "Order marked as SHIPPED! Dispatch tracking email sent to buyer."
            : "Order fulfillment status updated successfully!"
        );
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update fulfillment");
      }
    } catch (err: any) {
      alert(err.message || "Failed to update fulfillment");
    } finally {
      setIsUpdatingFulfilment(false);
    }
  };

  // Handle Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);
      const res = await fetch("/api/seller/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopName: editShopName,
          artisanName: editArtisanName,
          craftTradition: editCraftTradition,
          state: editState,
          locality: editLocality,
          giCode: editGiCode,
          bio: editBio,
        }),
      });

      if (res.ok) {
        await loadData();
        await refreshUser();
        setIsProfileModalOpen(false);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update profile");
      }
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Save Bank Account & Tax Onboarding
  const handleSaveBankAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setBankSaveError("");
    setBankSaveSuccess("");

    if (bankAccountNumber !== bankConfirmAccount) {
      setBankSaveError("Account numbers do not match.");
      return;
    }

    try {
      setIsSavingBank(true);
      const res = await fetch("/api/seller/payout-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountHolderName: bankHolderName,
          accountNumber: bankAccountNumber,
          confirmAccountNumber: bankConfirmAccount,
          ifscCode: bankIfsc,
          bankName,
          panNumber,
          gstin: taxExemption ? "EXEMPT" : gstin,
          taxExemptionDeclared: taxExemption,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update bank account");
      }

      setBankSaveSuccess("Bank account and PAN credentials verified successfully!");
      setIsEditingBank(false);
      await loadData();
    } catch (err: any) {
      setBankSaveError(err.message || "Failed to update bank account");
    } finally {
      setIsSavingBank(false);
    }
  };

  const displayShopName = sellerProfile?.shopName || "Devendra Prajapati Pottery Studio";
  const displayLocation = `${sellerProfile?.locality ? sellerProfile.locality + ", " : ""}${
    sellerProfile?.state || "Gujarat"
  }`;
  const displayGiCode = sellerProfile?.giCode || "GI-IN-GJ-449";

  const totalSalesPaise = orders.reduce((sum, ord) => sum + ord.sellerTotalPaise, 0);
  const pendingOrdersCount = orders.filter(
    (o) => o.status === "PENDING" || o.status === "CONFIRMED" || o.status === "PROCESSING"
  ).length;

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
          <span className="text-[#6B665E] truncate">Artisan Studio Dashboard</span>
        </nav>

        {/* Studio Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#C2410C] uppercase tracking-[0.2em] block">
                ARTISAN STOREFRONT STUDIO
              </span>
              {sellerProfile?.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>GI Verified Master</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1E1E1C] tracking-tight leading-tight mb-1">
                {displayShopName}
              </h1>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="text-xs text-[#7A756D] hover:text-[#C2410C] flex items-center gap-1 border border-[#DDD8CE] px-2.5 py-1 rounded-md hover:border-[#C2410C] transition-colors cursor-pointer"
                title="Edit Studio Profile"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Profile</span>
              </button>
            </div>

            <p className="text-xs text-[#7A756D]">
              {displayLocation} • GI ID: #{displayGiCode}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!sellerProfile && (
              <Link
                href="/seller/onboarding"
                className="bg-white border border-[#DDD5C8] hover:border-[#1E1E1C] text-[#1E1E1C] text-xs font-medium px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Store className="w-3.5 h-3.5 text-[#C2410C]" />
                <span>Complete Onboarding</span>
              </Link>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1E1E1C] hover:bg-[#383734] text-white text-xs font-medium px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Publish New Handcrafted Listing</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          <div className="bg-[#FAF7F2] border border-[#E5E0D7] rounded-xl p-4 sm:p-5 hover:border-[#D5CFC5] transition-all">
            <span className="text-[10px] uppercase font-semibold text-[#8C877E] tracking-wider block mb-1.5">
              NET MAKER REVENUE
            </span>
            <div className="font-serif text-2xl sm:text-[28px] font-normal text-[#1E1E1C] tracking-tight mb-1">
              {formatINR(totalSalesPaise > 0 ? totalSalesPaise : 39240000)}
            </div>
            <span className="text-[11px] text-[#0284C7] font-medium block">
              88% Direct Artisan Escrow
            </span>
          </div>

          <div className="bg-[#FAF7F2] border border-[#E5E0D7] rounded-xl p-4 sm:p-5 hover:border-[#D5CFC5] transition-all">
            <span className="text-[10px] uppercase font-semibold text-[#8C877E] tracking-wider block mb-1.5">
              PUBLISHED PIECES
            </span>
            <div className="font-serif text-2xl sm:text-[28px] font-normal text-[#1E1E1C] tracking-tight mb-1">
              {products.length}
            </div>
            <span className="text-[11px] text-[#16A34A] font-medium block">
              Persistent in Database
            </span>
          </div>

          <div className="bg-[#FAF7F2] border border-[#E5E0D7] rounded-xl p-4 sm:p-5 hover:border-[#D5CFC5] transition-all">
            <span className="text-[10px] uppercase font-semibold text-[#8C877E] tracking-wider block mb-1.5">
              ACTIVE COMMISSIONS
            </span>
            <div className="font-serif text-2xl sm:text-[28px] font-normal text-[#1E1E1C] tracking-tight mb-1">
              {pendingOrdersCount}
            </div>
            <span className="text-[11px] text-[#C2410C] font-medium block">
              Orders Requiring Dispatch
            </span>
          </div>

          <div className="bg-[#FAF7F2] border border-[#E5E0D7] rounded-xl p-4 sm:p-5 hover:border-[#D5CFC5] transition-all">
            <span className="text-[10px] uppercase font-semibold text-[#8C877E] tracking-wider block mb-1.5">
              GI PROVENANCE TRUST
            </span>
            <div className="font-serif text-2xl sm:text-[28px] font-normal text-[#1E1E1C] tracking-tight mb-1">
              100%
            </div>
            <span className="text-[11px] text-[#7A756D] font-medium block">
              Certified Geographical Origin
            </span>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-[#E5E0D7] gap-8 mb-6 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab("catalogue")}
            className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === "catalogue"
                ? "border-[#C2410C] text-[#1E1E1C]"
                : "border-transparent text-[#7A756D] hover:text-[#1E1E1C]"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Atelier Catalogue ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === "orders"
                ? "border-[#C2410C] text-[#1E1E1C]"
                : "border-transparent text-[#7A756D] hover:text-[#1E1E1C]"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders & Fulfilment</span>
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#C2410C] text-white text-[10px] font-bold">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("payouts")}
            className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === "payouts"
                ? "border-[#C2410C] text-[#1E1E1C]"
                : "border-transparent text-[#7A756D] hover:text-[#1E1E1C]"
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Bank Onboarding & Settlements</span>
            {payoutAccount?.isOnboarded ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Bank Verified" />
            ) : (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                Action Required
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: ATELIER CATALOGUE */}
        {activeTab === "catalogue" && (
          <div className="border border-[#E5E0D7] rounded-2xl bg-white p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl text-[#1E1E1C] font-normal">
                  Atelier Handcrafted Catalogue & Inventory
                </h2>
                <p className="text-xs text-[#7A756D] mt-0.5">
                  Manage product details, pricing, available stock levels, and active status in real time.
                </p>
              </div>
              <span className="text-xs text-[#8C877E] font-medium">
                Showing {products.length} Products
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="border border-[#E5E0D7] rounded-xl overflow-hidden bg-[#FAF7F2] flex flex-col group hover:shadow-md transition-all"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-[#ECE6DC] relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <span
                      className={`absolute top-2 right-2 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        item.status === "Archived" ? "bg-stone-500" : "bg-emerald-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="p-3.5 flex flex-col justify-between flex-grow">
                    <div>
                      <span className="text-[9px] font-semibold text-[#C2410C] uppercase tracking-wider block mb-1">
                        {item.craftAndMaterial}
                      </span>
                      <h3 className="font-serif text-xs sm:text-sm font-medium text-[#1E1E1C] line-clamp-1 mb-1">
                        {item.title}
                      </h3>

                      {/* Stock Level Controls */}
                      <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-[#E5E0D7] my-2 text-xs">
                        <span className="text-[#7A756D] text-[11px]">Stock:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStockAdjust(item.id, item.stock, -1)}
                            className="w-5 h-5 rounded bg-[#FAF7F2] hover:bg-[#EAE5DD] text-[#1E1E1C] flex items-center justify-center font-bold text-xs cursor-pointer"
                            title="Decrease stock"
                          >
                            -
                          </button>
                          <span
                            className={`font-semibold font-mono ${
                              item.stock <= 2 ? "text-amber-600 font-bold" : "text-[#1E1E1C]"
                            }`}
                          >
                            {item.stock}
                          </span>
                          <button
                            onClick={() => handleStockAdjust(item.id, item.stock, 1)}
                            className="w-5 h-5 rounded bg-[#FAF7F2] hover:bg-[#EAE5DD] text-[#1E1E1C] flex items-center justify-center font-bold text-xs cursor-pointer"
                            title="Increase stock"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#EAE5DD] flex items-center justify-between mt-2">
                      <span className="text-xs sm:text-sm font-semibold text-[#1E1E1C]">
                        {item.priceDisplay}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditProduct(item)}
                          className="p-1 rounded text-[#7A756D] hover:text-[#C2410C] hover:bg-[#ECE6DC] transition-colors cursor-pointer"
                          title="Edit Piece"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(item.id, item.title)}
                          className="p-1 rounded text-[#7A756D] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete / Archive Piece"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/products/${item.slug}`}
                          className="text-[10px] text-[#C2410C] hover:underline font-semibold ml-1"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS & FULFILMENT */}
        {activeTab === "orders" && (
          <div className="border border-[#E5E0D7] rounded-2xl bg-white p-5 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl text-[#1E1E1C] font-normal">
                  Orders & Dispatch Fulfilment
                </h2>
                <p className="text-xs text-[#7A756D] mt-0.5">
                  Verify customer purchases, update packaging/kiln status, and dispatch with tracked insured carriers.
                </p>
              </div>
              <span className="text-xs text-[#8C877E] font-medium">
                {orders.length} Total Orders Recorded
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center space-y-3 bg-[#FAF7F2] rounded-xl border border-dashed border-[#DDD5C8]">
                <Package className="w-10 h-10 text-[#8C877E] mx-auto opacity-70" />
                <h3 className="font-serif text-lg text-[#1E1E1C]">No Incoming Studio Orders Yet</h3>
                <p className="text-xs text-[#7A756D] max-w-sm mx-auto">
                  When a collector places an order for your handcrafted creations, order specifications and delivery details will appear here instantly.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => {
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
                      className="border border-[#E5E0D7] rounded-xl p-5 bg-[#FAF7F2] space-y-4 hover:border-[#D5CFC5] transition-all"
                    >
                      {/* Order Header */}
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
                            <span className="text-[#1E1E1C] font-medium">{dateStr}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-[#8C877E] block">
                              BUYER
                            </span>
                            <span className="text-[#1E1E1C] font-medium">
                              {address?.fullName || ord.buyer?.name || "Collector"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-[#8C877E] block">
                              DESTINATION
                            </span>
                            <span className="text-[#1E1E1C] font-medium">
                              {address?.city}, {address?.state}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge & Fulfilment Action */}
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold ${
                              ord.status === "DELIVERED"
                                ? "bg-emerald-100 text-emerald-800"
                                : ord.status === "SHIPPED"
                                ? "bg-sky-100 text-sky-800"
                                : ord.status === "PROCESSING"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-[#F3ECE1] text-[#89714F]"
                            }`}
                          >
                            {ord.status === "DELIVERED" && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {ord.status === "SHIPPED" && <Truck className="w-3.5 h-3.5" />}
                            {ord.status === "PROCESSING" && <Clock className="w-3.5 h-3.5" />}
                            <span>{ord.status}</span>
                          </span>

                          <button
                            onClick={() => openFulfilmentModal(ord)}
                            className="px-3 py-1.5 rounded-md bg-[#1E1E1C] hover:bg-[#383734] text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Truck className="w-3 h-3" />
                            <span>Manage Fulfilment</span>
                          </button>
                        </div>
                      </div>

                      {/* Items Ordered */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-8 space-y-2">
                          {ord.sellerItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 text-xs">
                              {item.imageUrl && (
                                <img
                                  src={item.imageUrl}
                                  alt={item.title}
                                  className="w-12 h-12 object-cover rounded border border-[#E5E0D7]"
                                />
                              )}
                              <div>
                                <h4 className="font-medium text-[#1E1E1C]">{item.title}</h4>
                                <span className="text-[#7A756D] text-[11px]">
                                  Qty: <strong>{item.quantity}</strong> • Unit Price:{" "}
                                  {formatINR(item.pricePaise)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="md:col-span-4 bg-white p-3 rounded-lg border border-[#E5E0D7] text-xs space-y-1 text-right">
                          <span className="text-[10px] uppercase font-semibold text-[#8C877E] block">
                            YOUR STUDIO PAYOUT
                          </span>
                          <div className="font-serif text-lg font-semibold text-[#1E1E1C]">
                            {formatINR(ord.sellerTotalPaise)}
                          </div>
                          {shipment?.trackingNumber && (
                            <div className="text-[11px] text-[#7A756D] font-mono">
                              AWB: {shipment.trackingNumber} ({shipment.carrier})
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

        {/* TAB 3: BANK ONBOARDING & SETTLEMENTS */}
        {activeTab === "payouts" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="border border-[#E5E0D7] rounded-2xl bg-white p-5 sm:p-7 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#52644B] uppercase tracking-wider mb-1">
                    <span>RBI PAPG &amp; Section 194-O Compliant</span>
                    <span>•</span>
                    <span>Escrow Settlement</span>
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl text-[#1E1E1C] font-normal">
                    Bank Onboarding &amp; Artisan Settlements
                  </h2>
                  <p className="text-xs text-[#7A756D] mt-0.5">
                    Link your direct bank account for scheduled T+2 settlements, PAN for 1% TDS, and view fair-trade earnings.
                  </p>
                </div>
              </div>

              {/* Fair Trade Split Metric Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#FAF7F2] border border-[#E5E0D7] mb-8">
                <div className="p-3">
                  <span className="text-[10px] uppercase font-semibold text-[#8C877E] block mb-1">
                    YOUR NET SHARE
                  </span>
                  <div className="font-serif text-2xl font-bold text-[#52644B]">84%</div>
                  <span className="text-[11px] text-[#7A756D]">Direct artisan livelihood payout</span>
                </div>
                <div className="p-3">
                  <span className="text-[10px] uppercase font-semibold text-[#8C877E] block mb-1">
                    PLATFORM COMMISSION
                  </span>
                  <div className="font-serif text-2xl font-bold text-[#1E1E1C]">15%</div>
                  <span className="text-[11px] text-[#7A756D]">Gateway fees, curation &amp; hosting</span>
                </div>
                <div className="p-3">
                  <span className="text-[10px] uppercase font-semibold text-[#8C877E] block mb-1">
                    SECTION 194-O TDS
                  </span>
                  <div className="font-serif text-2xl font-bold text-[#C2410C]">1%</div>
                  <span className="text-[11px] text-[#7A756D]">Deposited to Government under your PAN</span>
                </div>
              </div>

              {/* 2-Column Grid: Bank Details + Settlement Ledger */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Bank Account Onboarding */}
                <div className="lg:col-span-6 p-5 sm:p-6 rounded-xl border border-[#E5E0D7] bg-[#FAF8F5]">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EAE5DD]">
                    <div className="flex items-center gap-2">
                      <Landmark className="w-5 h-5 text-[#89714F]" />
                      <h3 className="font-semibold text-sm text-[#1E1E1C]">
                        Settlement Bank Account
                      </h3>
                    </div>
                    {payoutAccount?.isOnboarded && !isEditingBank && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  {bankSaveSuccess && (
                    <div className="p-3 rounded-md bg-emerald-50 text-emerald-800 text-xs mb-4 border border-emerald-200">
                      {bankSaveSuccess}
                    </div>
                  )}

                  {bankSaveError && (
                    <div className="p-3 rounded-md bg-rose-50 text-rose-800 text-xs mb-4 border border-rose-200">
                      {bankSaveError}
                    </div>
                  )}

                  {payoutAccount?.isOnboarded && !isEditingBank ? (
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-3 p-4 rounded-lg bg-white border border-[#E5E0D7]">
                        <div>
                          <span className="text-[10px] uppercase text-[#8C877E] block">Beneficiary</span>
                          <span className="font-medium text-[#1E1E1C]">{payoutAccount.accountHolderName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-[#8C877E] block">Bank Name</span>
                          <span className="font-medium text-[#1E1E1C]">{payoutAccount.bankName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-[#8C877E] block">Account Number</span>
                          <span className="font-mono font-medium text-[#1E1E1C]">{payoutAccount.maskedAccountNumber}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-[#8C877E] block">IFSC Code</span>
                          <span className="font-mono font-medium text-[#1E1E1C]">{payoutAccount.ifscCode}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-[#8C877E] block">PAN (194-O)</span>
                          <span className="font-mono font-medium text-[#1E1E1C]">{payoutAccount.panNumber || "Submitted"}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-[#8C877E] block">GST Status</span>
                          <span className="font-medium text-[#52644B]">{payoutAccount.gstinStatus}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsEditingBank(true)}
                        className="px-4 py-2 rounded-md bg-[#1E1E1C] hover:bg-[#383734] text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Update Bank Account / Tax Info
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveBankAccount} className="space-y-3 text-xs">
                      <div>
                        <label className="block font-semibold text-[#1E1E1C] mb-1">
                          Account Holder Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={bankHolderName}
                          onChange={(e) => setBankHolderName(e.target.value)}
                          placeholder="As per bank passbook / cheque"
                          className="w-full px-3 py-1.5 bg-white border border-[#DDD7CE] rounded text-xs focus:ring-1 focus:ring-[#C2410C] focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-[#1E1E1C] mb-1">
                            Bank Account Number *
                          </label>
                          <input
                            type="password"
                            required
                            value={bankAccountNumber}
                            onChange={(e) => setBankAccountNumber(e.target.value)}
                            placeholder="Enter account number"
                            className="w-full px-3 py-1.5 bg-white border border-[#DDD7CE] rounded text-xs focus:ring-1 focus:ring-[#C2410C] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-[#1E1E1C] mb-1">
                            Confirm Account Number *
                          </label>
                          <input
                            type="text"
                            required
                            value={bankConfirmAccount}
                            onChange={(e) => setBankConfirmAccount(e.target.value)}
                            placeholder="Re-enter account number"
                            className="w-full px-3 py-1.5 bg-white border border-[#DDD7CE] rounded text-xs focus:ring-1 focus:ring-[#C2410C] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-[#1E1E1C] mb-1">
                            Bank IFSC Code *
                          </label>
                          <input
                            type="text"
                            required
                            value={bankIfsc}
                            onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                            placeholder="e.g. SBIN0001234"
                            maxLength={11}
                            className="w-full px-3 py-1.5 bg-white border border-[#DDD7CE] rounded text-xs font-mono uppercase focus:ring-1 focus:ring-[#C2410C] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-[#1E1E1C] mb-1">
                            Bank Name &amp; Branch *
                          </label>
                          <input
                            type="text"
                            required
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            placeholder="e.g. State Bank of India, Bhuj"
                            className="w-full px-3 py-1.5 bg-white border border-[#DDD7CE] rounded text-xs focus:ring-1 focus:ring-[#C2410C] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-[#1E1E1C] mb-1">
                            Artisan PAN (for 1% TDS) *
                          </label>
                          <input
                            type="text"
                            required
                            value={panNumber}
                            onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                            placeholder="e.g. ABCDE1234F"
                            maxLength={10}
                            className="w-full px-3 py-1.5 bg-white border border-[#DDD7CE] rounded text-xs font-mono uppercase focus:ring-1 focus:ring-[#C2410C] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-[#1E1E1C] mb-1">
                            GSTIN (Optional)
                          </label>
                          <input
                            type="text"
                            disabled={taxExemption}
                            value={gstin}
                            onChange={(e) => setGstin(e.target.value.toUpperCase())}
                            placeholder={taxExemption ? "EXEMPT" : "15-digit GSTIN"}
                            className="w-full px-3 py-1.5 bg-white border border-[#DDD7CE] rounded text-xs font-mono uppercase focus:ring-1 focus:ring-[#C2410C] focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          id="taxExemption"
                          type="checkbox"
                          checked={taxExemption}
                          onChange={(e) => setTaxExemption(e.target.checked)}
                          className="rounded text-[#C2410C] focus:ring-[#C2410C]"
                        />
                        <label htmlFor="taxExemption" className="text-[11px] text-[#6E6A62]">
                          I declare annual turnover under ₹20L/₹40L and claim composite exemption under GST Rules.
                        </label>
                      </div>

                      <div className="flex items-center gap-3 pt-3">
                        <button
                          type="submit"
                          disabled={isSavingBank}
                          className="px-4 py-2 rounded-md bg-[#1E1E1C] hover:bg-[#383734] text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isSavingBank ? "Verifying..." : "Verify & Onboard Bank Account"}
                        </button>
                        {payoutAccount?.isOnboarded && (
                          <button
                            type="button"
                            onClick={() => setIsEditingBank(false)}
                            className="px-4 py-2 rounded-md border border-[#DDD7CE] text-[#403E39] text-xs font-medium hover:bg-white"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </div>

                {/* Right: Balance & Settlement Statistics */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="p-5 sm:p-6 rounded-xl border border-[#E5E0D7] bg-[#FAF8F5]">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#EAE5DD]">
                      <Receipt className="w-5 h-5 text-[#89714F]" />
                      <h3 className="font-semibold text-sm text-[#1E1E1C]">
                        Settlement Balance &amp; Escrow
                      </h3>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center py-1.5 border-b border-[#EAE5DD]">
                        <span className="text-[#6E6A62]">Delivered Sales (Eligible for Settlement):</span>
                        <span className="font-semibold text-[#1E1E1C]">
                          {formatINR(payoutSummary?.deliveredSalesPaise || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-[#EAE5DD]">
                        <span className="text-[#6E6A62]">Platform Fee (15%):</span>
                        <span className="text-[#C2410C]">
                          - {formatINR(payoutSummary?.commissionPaise || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-[#EAE5DD]">
                        <span className="text-[#6E6A62]">Statutory Section 194-O TDS (1%):</span>
                        <span className="text-[#C2410C]">
                          - {formatINR(payoutSummary?.tdsPaise || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-[#EAE5DD]">
                        <span className="text-[#6E6A62]">Total Disbursed to Date:</span>
                        <span className="font-semibold text-[#52644B]">
                          {formatINR(payoutSummary?.totalPaidOutPaise || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 text-sm font-semibold text-[#1E1E1C]">
                        <span>Pending Settlement Balance:</span>
                        <span className="text-emerald-700 font-mono text-base">
                          {formatINR(payoutSummary?.pendingSettlementPaise || 0)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 rounded-lg bg-[#EFECE6] text-[11px] text-[#6E6A62] leading-relaxed">
                      💡 Escrow settlements are automatically scheduled on a T+2 business day cycle after the buyer marks the piece as delivered and the 7-day initial inspection window elapses.
                    </div>
                  </div>

                  {/* Past Disbursements Table */}
                  <div className="p-5 rounded-xl border border-[#E5E0D7] bg-white">
                    <h4 className="font-semibold text-xs text-[#1E1E1C] mb-3 uppercase tracking-wider">
                      Recent Bank Disbursements
                    </h4>
                    {!payoutSummary?.payouts || payoutSummary.payouts.length === 0 ? (
                      <p className="text-xs text-[#8C877E] italic py-2">
                        No previous bank payouts recorded yet. Disbursements appear here once delivered orders are settled.
                      </p>
                    ) : (
                      <div className="divide-y divide-[#EAE5DD] text-xs">
                        {payoutSummary.payouts.map((p: any) => (
                          <div key={p.id} className="py-2.5 flex justify-between items-center">
                            <div>
                              <span className="font-mono text-[11px] font-medium text-[#1E1E1C] block">
                                {p.referenceId || "DISB-BANK"}
                              </span>
                              <span className="text-[10px] text-[#8C877E]">
                                {new Date(p.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="font-semibold text-emerald-700 block">
                                {formatINR(p.amountPaise)}
                              </span>
                              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                                {p.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: PUBLISH NEW HANDCRAFTED LISTING */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] border border-[#DDD5C8] rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EAE5DD]">
              <div>
                <span className="text-[10px] font-semibold text-[#C2410C] uppercase tracking-wider block">
                  NEW LISTING
                </span>
                <h3 className="font-serif text-xl font-normal text-[#1E1E1C]">
                  Publish Handcrafted Piece
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-[#ECE6DC] text-[#666] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kutch Terracotta Hand-Thrown Reduction Pitcher"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#C2410C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                    Craft Discipline
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Terracotta Pottery"
                    value={newCraft}
                    onChange={(e) => setNewCraft(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#C2410C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#C2410C]"
                  >
                    <option value="Vases">Vases</option>
                    <option value="Wall Decor">Wall Decor</option>
                    <option value="Paintings">Paintings</option>
                    <option value="Vessels">Vessels</option>
                    <option value="Textiles">Textiles</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                    Price (₹ INR) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1450.00"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#C2410C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#C2410C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                  Description & Craft Story
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the clay sourcing, kiln firing, or sacred motifs..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#C2410C]"
                />
              </div>

              {/* Image Upload Component */}
              <div>
                <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                  Handcrafted Piece Image
                </label>
                <ImageUploader
                  folder="artsinly/products"
                  value={newImageUrl}
                  onChange={(url: string) => setNewImageUrl(url)}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#D5CFC5] text-xs font-medium rounded-md hover:bg-[#ECE6DC] text-[#1E1E1C] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingProduct}
                  className="px-5 py-2 bg-[#1E1E1C] text-white text-xs font-medium rounded-md hover:bg-[#383734] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {isCreatingProduct ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <span>Publish Piece</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT HANDCRAFTED LISTING */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] border border-[#DDD5C8] rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EAE5DD]">
              <div>
                <span className="text-[10px] font-semibold text-[#C2410C] uppercase tracking-wider block">
                  EDIT PIECE & INVENTORY
                </span>
                <h3 className="font-serif text-xl font-normal text-[#1E1E1C]">
                  Update Product Listing
                </h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-full hover:bg-[#ECE6DC] text-[#666] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#C2410C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                    Craft Discipline
                  </label>
                  <input
                    type="text"
                    required
                    value={editCraft}
                    onChange={(e) => setEditCraft(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#C2410C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                    Inventory Stock Available
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#C2410C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                  Price (₹ INR) *
                </label>
                <input
                  type="text"
                  required
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#C2410C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#C2410C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                  Product Image
                </label>
                <ImageUploader
                  folder="artsinly/products"
                  value={editImageUrl}
                  onChange={(url: string) => setEditImageUrl(url)}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-[#D5CFC5] text-xs font-medium rounded-md hover:bg-[#ECE6DC] text-[#1E1E1C] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingProduct}
                  className="px-5 py-2 bg-[#1E1E1C] text-white text-xs font-medium rounded-md hover:bg-[#383734] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {isUpdatingProduct ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating Database...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: MANAGE FULFILMENT & DISPATCH */}
      {selectedOrderForFulfilment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] border border-[#DDD5C8] rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EAE5DD]">
              <div>
                <span className="text-[10px] font-semibold text-[#C2410C] uppercase tracking-wider block">
                  FULFILMENT & DISPATCH
                </span>
                <h3 className="font-serif text-xl font-normal text-[#1E1E1C]">
                  Order #{selectedOrderForFulfilment.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForFulfilment(null)}
                className="p-1 rounded-full hover:bg-[#ECE6DC] text-[#666] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateFulfilment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1E1E1C] mb-1">
                  Fulfilment Status *
                </label>
                <select
                  value={fulfilmentStatus}
                  onChange={(e) => setFulfilmentStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#C2410C]"
                >
                  <option value="PROCESSING">PROCESSING — Being Crafted / Packaged in Atelier</option>
                  <option value="SHIPPED">SHIPPED — Dispatched with Insured Courier</option>
                  <option value="DELIVERED">DELIVERED — Verified Delivered to Collector</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1E1E1C] mb-1">
                  Logistics Carrier *
                </label>
                <select
                  value={carrierName}
                  onChange={(e) => setCarrierName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#C2410C]"
                >
                  <option value="BlueDart Express Insured">BlueDart Express Insured</option>
                  <option value="Delhivery Fragile Express">Delhivery Fragile Express</option>
                  <option value="India Post Speed Post">India Post Speed Post</option>
                  <option value="DTDC Premium Air">DTDC Premium Air</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1E1E1C] mb-1">
                  Tracking AWB Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BD-IN-98124018"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D5CFC5] rounded-md font-mono focus:outline-none focus:border-[#C2410C]"
                />
              </div>

              <div className="p-3 bg-white border border-[#E5E0D7] rounded-lg space-y-1.5 text-[11px] text-[#6B685F]">
                <div className="font-semibold text-[#1E1E1C]">Delivery Destination:</div>
                <div>
                  {selectedOrderForFulfilment.addressSnapshot?.fullName},{" "}
                  {selectedOrderForFulfilment.addressSnapshot?.addressLine1},{" "}
                  {selectedOrderForFulfilment.addressSnapshot?.city},{" "}
                  {selectedOrderForFulfilment.addressSnapshot?.state} -{" "}
                  {selectedOrderForFulfilment.addressSnapshot?.postalCode}
                </div>
                {selectedOrderForFulfilment.addressSnapshot?.phone && (
                  <div>Phone: {selectedOrderForFulfilment.addressSnapshot.phone}</div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForFulfilment(null)}
                  className="px-4 py-2 border border-[#D5CFC5] font-medium rounded-md hover:bg-[#ECE6DC] text-[#1E1E1C] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingFulfilment}
                  className="px-5 py-2 bg-[#1E1E1C] text-white font-medium rounded-md hover:bg-[#383734] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {isUpdatingFulfilment ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Dispatch...</span>
                    </>
                  ) : (
                    <span>Update & Send Dispatch Email</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT STUDIO PROFILE */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] border border-[#DDD5C8] rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EAE5DD]">
              <div>
                <span className="text-[10px] font-semibold text-[#C2410C] uppercase tracking-wider block">
                  STUDIO PROFILE
                </span>
                <h3 className="font-serif text-xl font-normal text-[#1E1E1C]">
                  Edit Artisan Storefront
                </h3>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1 rounded-full hover:bg-[#ECE6DC] text-[#666] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                  Atelier / Shop Name *
                </label>
                <input
                  type="text"
                  required
                  value={editShopName}
                  onChange={(e) => setEditShopName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#C2410C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                    Master Artisan Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editArtisanName}
                    onChange={(e) => setEditArtisanName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#C2410C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                    Craft Tradition *
                  </label>
                  <input
                    type="text"
                    required
                    value={editCraftTradition}
                    onChange={(e) => setEditCraftTradition(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#C2410C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#C2410C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                    Locality
                  </label>
                  <input
                    type="text"
                    value={editLocality}
                    onChange={(e) => setEditLocality(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#C2410C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                    GI Code
                  </label>
                  <input
                    type="text"
                    value={editGiCode}
                    onChange={(e) => setEditGiCode(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#C2410C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                  Studio Bio
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#C2410C]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 border border-[#D5CFC5] text-xs font-medium rounded-md hover:bg-[#ECE6DC] text-[#1E1E1C] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2 bg-[#1E1E1C] text-white text-xs font-medium rounded-md hover:bg-[#383734] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <span>Save Studio Profile</span>
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
