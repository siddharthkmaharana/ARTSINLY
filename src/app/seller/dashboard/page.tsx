"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, X, Upload, Check, Edit3, ShieldCheck, Loader2, Sparkles, Store } from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";
import { useAuth } from "@/context/AuthContext";

interface StudioProduct {
  id: string;
  slug: string;
  title: string;
  category: string;
  craftAndMaterial: string;
  priceDisplay: string;
  status: string;
  imageUrl: string;
}

const FALLBACK_PRODUCTS: StudioProduct[] = [
  {
    id: "sp-1",
    slug: "modern-ethnic-ceramic-vase-terracotta-indigenous-pattern",
    title: "Modern Ethnic Ceramic Vase",
    category: "Vases",
    craftAndMaterial: "Terracotta Pottery",
    priceDisplay: "₹126.99",
    status: "Live in Marketplace",
    imageUrl:
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "sp-2",
    slug: "hand-carved-floral-high-relief-sheesham-clock",
    title: "Hand-Carved Floral High-Relief Sheesham Panel",
    category: "Wall Decor",
    craftAndMaterial: "Wood Carving",
    priceDisplay: "₹700.00",
    status: "Live in Marketplace",
    imageUrl:
      "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "sp-3",
    slug: "sacred-srinathji-gold-leaf-pichwai-miniature",
    title: "Sacred Srinathji Gold-Leaf Pichwai Miniature Painting",
    category: "Paintings",
    craftAndMaterial: "Miniature Painting",
    priceDisplay: "₹1,500.00",
    status: "Live in Marketplace",
    imageUrl:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "sp-4",
    slug: "dhokra-primitive-tribal-bell-metal-vessel",
    title: "Dhokra Primitive Tribal Bell-Metal Lost-Wax Vessel",
    category: "Vessels",
    craftAndMaterial: "Metalwork",
    priceDisplay: "₹190.00",
    status: "Live in Marketplace",
    imageUrl:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=300&q=80",
  },
];

export default function SellerDashboardPage() {
  const { user, refreshUser } = useAuth();

  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [products, setProducts] = useState<StudioProduct[]>(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);

  // New Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCraft, setNewCraft] = useState("");
  const [newCategory, setNewCategory] = useState("Vases");
  const [newPrice, setNewPrice] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

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
      const [profileRes, productsRes] = await Promise.all([
        fetch("/api/seller/profile"),
        fetch("/api/seller/products"),
      ]);

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
          const mapped = prodData.products.map((p: any) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            category: p.category?.name || "Traditional Crafts",
            craftAndMaterial: p.craftType || "Handcrafted Heritage",
            priceDisplay: `₹${(p.basePricePaise / 100).toFixed(2)}`,
            status: "Live in Marketplace",
            imageUrl:
              p.images?.[0]?.url ||
              "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=300&q=80",
          }));
          setProducts(mapped);
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
          imageUrl: newImageUrl || "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
        }),
      });

      if (res.ok) {
        await loadData();
        setIsModalOpen(false);
        setNewTitle("");
        setNewCraft("");
        setNewPrice("");
        setNewImageUrl("");
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

  const displayShopName = sellerProfile?.shopName || "Devendra Prajapati Pottery Studio";
  const displayLocation = `${sellerProfile?.locality ? sellerProfile.locality + ", " : ""}${
    sellerProfile?.state || "Gujarat"
  }`;
  const displayGiCode = sellerProfile?.giCode || "GI-IN-GJ-449";

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-5 sm:py-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb line */}
        <nav className="flex items-center space-x-2 text-[11px] text-[#8C877E] mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link href="/" className="hover:text-[#1E1E1C] transition-colors">
            Home
          </Link>
          <span>•</span>
          <Link href="/catalog" className="hover:text-[#1E1E1C] transition-colors">
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
                className="text-xs text-[#7A756D] hover:text-[#C2410C] flex items-center gap-1 border border-[#DDD8CE] px-2.5 py-1 rounded-md hover:border-[#C2410C] transition-colors"
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
              NET MAKER PAYOUT
            </span>
            <div className="font-serif text-2xl sm:text-[28px] font-normal text-[#1E1E1C] tracking-tight mb-1">
              ₹3,92,400
            </div>
            <span className="text-[11px] text-[#0284C7] font-medium block">
              88% Fair Direct Share
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
              3
            </div>
            <span className="text-[11px] text-[#C2410C] font-medium block">
              Architectural Orders
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
              Sovereign Ledger Record
            </span>
          </div>
        </div>

        {/* Studio Product Catalog Grid */}
        <div className="border border-[#E5E0D7] rounded-2xl bg-white p-5 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#1E1E1C] font-normal">
                Atelier Handcrafted Catalogue
              </h2>
              <p className="text-xs text-[#7A756D] mt-0.5">
                All certified heirloom pieces currently published and discoverable by collectors worldwide.
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
                  <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
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
                  </div>

                  <div className="pt-2 border-t border-[#EAE5DD] flex items-center justify-between mt-2">
                    <span className="text-xs sm:text-sm font-semibold text-[#1E1E1C]">
                      {item.priceDisplay}
                    </span>
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-[10px] text-[#C2410C] hover:underline font-semibold"
                    >
                      View Piece →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
                className="p-1 rounded-full hover:bg-[#ECE6DC] text-[#666] transition-colors"
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
                  className="px-4 py-2 border border-[#D5CFC5] text-xs font-medium rounded-md hover:bg-[#ECE6DC] text-[#1E1E1C] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingProduct}
                  className="px-5 py-2 bg-[#1E1E1C] text-white text-xs font-medium rounded-md hover:bg-[#383734] transition-colors flex items-center gap-1.5"
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

      {/* MODAL 2: EDIT STUDIO PROFILE */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] border border-[#DDD5C8] rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EAE5DD]">
              <div>
                <span className="text-[10px] font-semibold text-[#C2410C] uppercase tracking-wider block">
                  PROFILE MANAGEMENT
                </span>
                <h3 className="font-serif text-xl font-normal text-[#1E1E1C]">
                  Edit Studio Profile
                </h3>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1 rounded-full hover:bg-[#ECE6DC] text-[#666] transition-colors"
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

              <div>
                <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                  Master Artisan Name
                </label>
                <input
                  type="text"
                  value={editArtisanName}
                  onChange={(e) => setEditArtisanName(e.target.value)}
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
                    value={editCraftTradition}
                    onChange={(e) => setEditCraftTradition(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#C2410C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#C2410C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                    Locality / District
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
                    GI Registration Code
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
                  Atelier Bio
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
                  className="px-4 py-2 border border-[#D5CFC5] text-xs font-medium rounded-md hover:bg-[#ECE6DC] text-[#1E1E1C] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2 bg-[#1E1E1C] text-white text-xs font-medium rounded-md hover:bg-[#383734] transition-colors flex items-center gap-1.5"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Profile...</span>
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
    </div>
  );
}
