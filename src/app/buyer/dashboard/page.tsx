"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PRODUCTS } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ProductCard } from "@/components/products/ProductCard";
import {
  Package,
  Heart,
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  Loader2,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  X,
} from "lucide-react";

interface SavedAddress {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  phone: string;
  isDefault: boolean;
}

function BuyerDashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as "orders" | "wishlist" | "addresses") || "orders";
  const [activeTab, setActiveTab] = useState(initialTab);
  const { user } = useAuth();
  const { wishlist } = useCart();
  const wishlistProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  // Orders state - strictly starts empty, populated only from actual DB / user orders
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Address state - strictly starts empty, populated only from actual DB / user addresses
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [formAddress, setFormAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    isDefault: false,
  });
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  // Fetch orders
  useEffect(() => {
    let isCancelled = false;
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled) {
            if (data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
              const mapped = data.orders.map((ord: any) => {
                const shipment = ord.shipments?.[0];
                const dateStr = new Date(ord.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });

                let statusText = "Order Received & Verified";
                if (ord.status === "CONFIRMED") statusText = "Artisan Preparing Craft";
                if (ord.status === "PROCESSING") statusText = "In Kiln / Atelier Finishing";
                if (ord.status === "SHIPPED") statusText = "In Insured Transit";
                if (ord.status === "DELIVERED") statusText = "Delivered to Residence";

                return {
                  id: ord.orderNumber || ord.id,
                  date: dateStr,
                  status: ord.status,
                  paymentStatus: ord.paymentStatus || ord.payments?.[0]?.status || "PENDING",
                  shipmentStatus: ord.shipmentStatus || shipment?.status || "PENDING",
                  statusText,
                  carrier: shipment?.carrier || "Pan-India Fragile Express",
                  trackingNumber: shipment?.trackingNumber || `AWB-${ord.orderNumber}`,
                  shipments: ord.shipments || [],
                  items: ord.items.map((item: any) => ({
                    title: item.title,
                    quantity: item.quantity,
                    pricePaise: item.pricePaise,
                    status: item.status || "PENDING",
                    imageUrl:
                      item.product?.images?.[0]?.url ||
                      "/images/products/Odisha/Sambalpur Terracotta decorative lantern.png",
                    artisanName: item.sellerArtisanName || item.seller?.artisanName || "Master Artisan",
                    state: item.seller?.state || "Heritage Craft",
                    slug: item.product?.slug || "handcrafted-piece",
                  })),
                  totalPaise: ord.totalPaise,
                };
              });
              setOrders(mapped);
            } else {
              setOrders([]);
            }
          }
        } else {
          if (!isCancelled) setOrders([]);
        }
      } catch (err) {
        console.error("Failed to fetch live buyer orders:", err);
        if (!isCancelled) setOrders([]);
      } finally {
        if (!isCancelled) setLoadingOrders(false);
      }
    };

    fetchOrders();
    return () => {
      isCancelled = true;
    };
  }, [user]);

  // Fetch addresses
  const fetchAddresses = async () => {
    if (!user) {
      setAddresses([]);
      return;
    }
    setLoadingAddresses(true);
    try {
      const res = await fetch("/api/user/addresses");
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data.addresses) ? data.addresses : [];
        setAddresses(list);
        if (typeof window !== "undefined") {
          localStorage.setItem(`artsinly_addresses_${user.id}`, JSON.stringify(list));
        }
      } else {
        if (typeof window !== "undefined") {
          const cached = localStorage.getItem(`artsinly_addresses_${user.id}`);
          if (cached) {
            setAddresses(JSON.parse(cached));
          } else {
            setAddresses([]);
          }
        }
      }
    } catch {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem(`artsinly_addresses_${user.id}`);
        if (cached) {
          setAddresses(JSON.parse(cached));
        } else {
          setAddresses([]);
        }
      }
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const openAddressModal = (addr?: SavedAddress) => {
    setAddressError(null);
    if (addr) {
      setEditingAddress(addr);
      setFormAddress({
        fullName: addr.fullName,
        phone: addr.phone,
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2 || "",
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        isDefault: addr.isDefault,
      });
    } else {
      setEditingAddress(null);
      setFormAddress({
        fullName: user?.name || "",
        phone: user?.phone || "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        isDefault: addresses.length === 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingAddress(true);
    setAddressError(null);

    try {
      if (editingAddress) {
        const res = await fetch("/api/user/addresses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingAddress.id,
            ...formAddress,
          }),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to update address");
        }
        const data = await res.json();
        const updated = addresses.map((a) => {
          if (a.id === editingAddress.id) return data.address;
          if (formAddress.isDefault) return { ...a, isDefault: false };
          return a;
        });
        setAddresses(updated);
        localStorage.setItem(`artsinly_addresses_${user.id}`, JSON.stringify(updated));
      } else {
        const res = await fetch("/api/user/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formAddress),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to create address");
        }
        const data = await res.json();
        const updated = formAddress.isDefault
          ? [data.address, ...addresses.map((a) => ({ ...a, isDefault: false }))]
          : [...addresses, data.address];
        setAddresses(updated);
        localStorage.setItem(`artsinly_addresses_${user.id}`, JSON.stringify(updated));
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setAddressError(err.message || "Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to remove this delivery address?")) return;
    if (!user) return;

    try {
      await fetch(`/api/user/addresses?id=${addressId}`, { method: "DELETE" });
      const filtered = addresses.filter((a) => a.id !== addressId);
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      setAddresses(filtered);
      localStorage.setItem(`artsinly_addresses_${user.id}`, JSON.stringify(filtered));
    } catch (err) {
      console.error("Failed to delete address:", err);
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    if (!user) return;
    try {
      await fetch("/api/user/addresses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: addressId, isDefault: true }),
      });
      const updated = addresses.map((a) => ({
        ...a,
        isDefault: a.id === addressId,
      }));
      setAddresses(updated);
      localStorage.setItem(`artsinly_addresses_${user.id}`, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to set default address:", err);
    }
  };

  const displayName = user?.name || (user?.email ? user.email.split("@")[0] : "Customer");
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Buyer Header */}
        <div className="bg-white border border-[#E8E0D2] rounded-xl p-6 sm:p-8 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#F4EFE6] border border-[#DCD0BD] flex items-center justify-center text-[#89714F] font-serif text-xl font-bold">
              {initials}
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#20201D]">
                {displayName}
              </h1>
              <p className="text-xs text-[#6B685F]">
                Patron Member • Supporting Indigenous Indian Heritage
              </p>
            </div>
          </div>

          <Link
            href="/catalog"
            className="px-4 py-2 bg-[#20201D] hover:bg-[#89714F] text-white text-xs font-semibold rounded transition-colors"
          >
            Explore Catalog
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
            <span>Saved Delivery Addresses ({addresses.length})</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {loadingOrders && (
              <div className="flex items-center justify-center p-8 text-xs text-[#89714F] gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking latest database orders...</span>
              </div>
            )}

            {!loadingOrders && orders.length === 0 && (
              <div className="bg-white border border-[#E8E0D2] rounded-xl p-12 text-center space-y-4">
                <Package className="w-10 h-10 text-[#89714F] mx-auto opacity-60" />
                <h3 className="font-serif text-xl font-medium text-[#20201D]">
                  No Orders Placed Yet
                </h3>
                <p className="text-xs text-[#6B685F] max-w-sm mx-auto">
                  When you acquire authentic handcrafted pieces from master artisans, their progress and insured transit details will appear here.
                </p>
                <Link
                  href="/catalog"
                  className="inline-block px-5 py-2.5 bg-[#20201D] text-white rounded text-xs font-semibold hover:bg-[#89714F] transition-colors"
                >
                  Explore Artisan Catalog
                </Link>
              </div>
            )}

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
                      <span className="text-[#6B685F] block">Order Identifier</span>
                      <span className="font-mono text-[11px] text-[#20201D] font-semibold">
                        #{order.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold uppercase tracking-wider ${
                        order.status === "DELIVERED"
                          ? "bg-[#EBF0E9] text-[#52644B]"
                          : order.status === "CONFIRMED" || order.status === "PROCESSING"
                          ? "bg-[#FBF4E6] text-[#A66E1E]"
                          : "bg-[#E6F0FA] text-[#1D5E99]"
                      }`}
                    >
                      {order.statusText}
                    </span>
                  </div>
                </div>

                {/* Items & Fulfillment Flow */}
                <div className="p-6 divide-y divide-[#F0EAE1]">
                  {order.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="py-5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg border border-[#E8E0D2]"
                        />
                        <div>
                          <div className="text-[11px] text-[#89714F] font-semibold uppercase tracking-wider">
                            {item.state} • {item.artisanName}
                          </div>
                          <h4 className="font-serif text-base font-medium text-[#20201D] mt-0.5">
                            {item.title}
                          </h4>
                          <div className="text-xs text-[#6B685F] mt-1">
                            Qty: {item.quantity} • {formatINR(item.pricePaise)} each
                          </div>
                          {item.status && (
                            <div className="mt-1">
                              <span className="text-[10px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded font-mono">
                                Sub-order: {item.status}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Direct Courier & Tracking Status */}
                      <div className="bg-[#FAF7F2] p-4 rounded-lg border border-[#E8E0D2] min-w-[280px]">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-[#6B685F] flex items-center gap-1.5 font-medium">
                            <Truck className="w-3.5 h-3.5 text-[#89714F]" />
                            {order.carrier}
                          </span>
                          <span className="text-[#89714F] font-semibold text-[11px]">
                            {order.status === "DELIVERED" ? "Delivered" : "In Transit"}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-[#20201D] bg-white p-2 rounded border border-[#E8E0D2] flex items-center justify-between">
                          <span>{order.trackingNumber}</span>
                          <span className="text-[10px] text-[#89714F] cursor-pointer hover:underline">
                            Track
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sub-shipments breakdown if multi-vendor */}
                {order.shipments && order.shipments.length > 1 && (
                  <div className="bg-[#FBF9F5] px-6 py-4 border-t border-[#E8E0D2] text-xs">
                    <span className="font-semibold text-[#20201D] block mb-2">
                      Multi-Vendor Atelier Shipments ({order.shipments.length} parcels):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.shipments.map((s: any, i: number) => (
                        <div key={i} className="bg-white p-2.5 rounded border border-[#E8E0D2]">
                          <div className="font-medium text-[#20201D]">
                            Parcel {i + 1}: {s.carrier || "Fragile Logistics"}
                          </div>
                          <div className="text-[#6B685F] text-[11px] font-mono">
                            AWB: {s.trackingNumber || "Pending Dispatch"} • Status: {s.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                  href="/catalog"
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
          <div>
            {loadingAddresses && (
              <div className="flex items-center justify-center p-8 text-xs text-[#89714F] gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading your saved delivery addresses...</span>
              </div>
            )}

            {!loadingAddresses && addresses.length === 0 ? (
              <div className="bg-white border border-[#E8E0D2] rounded-xl p-10 text-center space-y-4">
                <MapPin className="w-10 h-10 text-[#89714F] mx-auto opacity-60" />
                <h3 className="font-serif text-xl font-medium text-[#20201D]">
                  No Saved Delivery Addresses
                </h3>
                <p className="text-xs text-[#6B685F] max-w-sm mx-auto">
                  You have not added any delivery address yet. Add your residence, studio, or gifting destination to streamline dispatch from regional artisan ateliers.
                </p>
                <button
                  onClick={() => openAddressModal()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#20201D] text-white rounded text-xs font-semibold hover:bg-[#89714F] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Delivery Address</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`bg-white border-2 ${
                      addr.isDefault ? "border-[#89714F]" : "border-[#E8E0D2]"
                    } rounded-xl p-6 relative space-y-3 flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        {addr.isDefault ? (
                          <span className="text-[10px] bg-[#EBF0E9] text-[#52644B] px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                            Default
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-[11px] text-[#89714F] hover:underline font-medium cursor-pointer"
                          >
                            Set as Default
                          </button>
                        )}
                      </div>
                      <h3 className="font-serif text-base font-semibold text-[#20201D]">
                        {addr.fullName}
                      </h3>
                      <p className="text-xs text-[#6B685F] leading-relaxed mt-2">
                        {addr.addressLine1}
                        {addr.addressLine2 && (
                          <>
                            <br />
                            {addr.addressLine2}
                          </>
                        )}
                        <br />
                        {addr.city}, {addr.state} — {addr.postalCode}
                        <br />
                        {addr.country || "India"}
                        <br />
                        Phone: {addr.phone}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-xs">
                      <button
                        onClick={() => openAddressModal(addr)}
                        className="text-[#89714F] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Address</span>
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-red-600 hover:text-red-700 font-medium inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Card to add an additional address */}
                <div
                  onClick={() => openAddressModal()}
                  className="border-2 border-dashed border-[#DCD0BD] rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-2 hover:border-[#89714F] cursor-pointer transition-colors bg-white/50 min-h-[180px]"
                >
                  <MapPin className="w-8 h-8 text-[#89714F]" />
                  <span className="text-xs font-semibold text-[#20201D]">
                    + Add New Delivery Location
                  </span>
                  <span className="text-[11px] text-[#6B685F]">
                    Save residence, studio, or gifting destination
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Address Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-[#8A877E] hover:text-[#20201D] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="font-serif text-xl font-medium text-[#20201D]">
                {editingAddress ? "Edit Delivery Address" : "Add Delivery Address"}
              </h3>
              <p className="text-xs text-[#6B685F] mt-1">
                Parcels will be dispatched directly from master artisan ateliers to this address.
              </p>
            </div>

            {addressError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                {addressError}
              </div>
            )}

            <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#4A4740] font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formAddress.fullName}
                    onChange={(e) => setFormAddress({ ...formAddress, fullName: e.target.value })}
                    placeholder="e.g. Siddharth Verma"
                    className="w-full px-3 py-2 border border-[#DCD0BD] rounded focus:outline-none focus:border-[#89714F]"
                  />
                </div>
                <div>
                  <label className="block text-[#4A4740] font-medium mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formAddress.phone}
                    onChange={(e) => setFormAddress({ ...formAddress, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 border border-[#DCD0BD] rounded focus:outline-none focus:border-[#89714F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#4A4740] font-medium mb-1">Street Address / House No. *</label>
                <input
                  type="text"
                  required
                  value={formAddress.addressLine1}
                  onChange={(e) => setFormAddress({ ...formAddress, addressLine1: e.target.value })}
                  placeholder="Flat, floor, building name, street"
                  className="w-full px-3 py-2 border border-[#DCD0BD] rounded focus:outline-none focus:border-[#89714F]"
                />
              </div>

              <div>
                <label className="block text-[#4A4740] font-medium mb-1">Apartment / Locality / Landmark</label>
                <input
                  type="text"
                  value={formAddress.addressLine2}
                  onChange={(e) => setFormAddress({ ...formAddress, addressLine2: e.target.value })}
                  placeholder="Area, colony, or landmark (optional)"
                  className="w-full px-3 py-2 border border-[#DCD0BD] rounded focus:outline-none focus:border-[#89714F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#4A4740] font-medium mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formAddress.city}
                    onChange={(e) => setFormAddress({ ...formAddress, city: e.target.value })}
                    placeholder="e.g. Bhubaneswar"
                    className="w-full px-3 py-2 border border-[#DCD0BD] rounded focus:outline-none focus:border-[#89714F]"
                  />
                </div>
                <div>
                  <label className="block text-[#4A4740] font-medium mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={formAddress.state}
                    onChange={(e) => setFormAddress({ ...formAddress, state: e.target.value })}
                    placeholder="e.g. Odisha"
                    className="w-full px-3 py-2 border border-[#DCD0BD] rounded focus:outline-none focus:border-[#89714F]"
                  />
                </div>
                <div>
                  <label className="block text-[#4A4740] font-medium mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={formAddress.postalCode}
                    onChange={(e) => setFormAddress({ ...formAddress, postalCode: e.target.value })}
                    placeholder="e.g. 751001"
                    className="w-full px-3 py-2 border border-[#DCD0BD] rounded focus:outline-none focus:border-[#89714F]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefaultCheckbox"
                  checked={formAddress.isDefault}
                  onChange={(e) => setFormAddress({ ...formAddress, isDefault: e.target.checked })}
                  className="rounded border-[#DCD0BD] text-[#89714F] focus:ring-[#89714F]"
                />
                <label htmlFor="isDefaultCheckbox" className="text-xs text-[#20201D] cursor-pointer">
                  Set as default delivery address
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#F0EAE1]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#DCD0BD] text-[#6B685F] rounded hover:bg-stone-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAddress}
                  className="px-5 py-2 bg-[#20201D] text-white rounded font-semibold hover:bg-[#89714F] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingAddress && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingAddress ? "Save Changes" : "Add Address"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
