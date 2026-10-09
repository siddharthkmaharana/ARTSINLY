"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, X, Upload, Check } from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";

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

const STUDIO_PRODUCTS: StudioProduct[] = [
  {
    id: "sp-1",
    slug: "modern-ethnic-ceramic-vase-terracotta-indigenous-pattern",
    title: "Modern Ethnic Ceramic Vase",
    category: "Vases",
    craftAndMaterial: "Terracotta Pottery",
    priceDisplay: "$126.99",
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
    priceDisplay: "$700.00",
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
    priceDisplay: "$1500.00",
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
    priceDisplay: "$190.00",
    status: "Live in Marketplace",
    imageUrl:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "sp-5",
    slug: "zardozi-hand-embroidered-velvet-adornment",
    title: "Zardozi Hand-Embroidered Velvet Wall Tapestry",
    category: "Textiles",
    craftAndMaterial: "Zardozi Embroidery",
    priceDisplay: "$540.00",
    status: "Live in Marketplace",
    imageUrl:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "sp-6",
    slug: "heritage-ajrakh-16-stage-indigo-botanical-throw",
    title: "Heritage Ajrakh 16-Stage Indigo Botanical Throw",
    category: "Textiles",
    craftAndMaterial: "Block Printing",
    priceDisplay: "$184.00",
    status: "Live in Marketplace",
    imageUrl:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "sp-7",
    slug: "jaipur-persian-quartz-blue-glazed-dinner-plates",
    title: "Jaipur Persian Quartz Blue Glazed Chalice",
    category: "Vases",
    craftAndMaterial: "Blue Pottery",
    priceDisplay: "$110.00",
    status: "Live in Marketplace",
    imageUrl:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "sp-8",
    slug: "kalamkari-tree-of-life-hand-drawn-narrative-scroll",
    title: "Kalamkari Tree of Life Hand-Drawn Wall Scroll",
    category: "Paintings",
    craftAndMaterial: "Kalamkari Painting",
    priceDisplay: "$320.00",
    status: "Live in Marketplace",
    imageUrl:
      "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=300&q=80",
  },
];

export default function SellerDashboardPage() {
  const [products, setProducts] = useState<StudioProduct[]>(STUDIO_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCraft, setNewCraft] = useState("");
  const [newCategory, setNewCategory] = useState("Vases");
  const [newPrice, setNewPrice] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    const newProd: StudioProduct = {
      id: `sp-${Date.now()}`,
      slug: "modern-ethnic-ceramic-vase-terracotta-indigenous-pattern",
      title: newTitle,
      category: newCategory,
      craftAndMaterial: newCraft || "Terracotta Pottery",
      priceDisplay: newPrice.startsWith("$") ? newPrice : `$${newPrice}`,
      status: "Live in Marketplace",
      imageUrl:
        "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=300&q=80",
    };

    setProducts([newProd, ...products]);
    setIsModalOpen(false);
    setNewTitle("");
    setNewCraft("");
    setNewPrice("");
    setNewImageUrl("");
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-5 sm:py-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb line from screenshot */}
        <nav className="flex items-center space-x-2 text-[11px] text-[#8C877E] mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link href="/" className="hover:text-[#1E1E1C] transition-colors">
            Home
          </Link>
          <span>•</span>
          <Link href="/explore" className="hover:text-[#1E1E1C] transition-colors">
            Explore
          </Link>
          <span>•</span>
          <span className="hover:text-[#1E1E1C] transition-colors cursor-pointer">
            Vases
          </span>
          <span>•</span>
          <span className="text-[#6B665E] truncate">
            Modern Ethnic Ceramic Vase – Terracotta Vase with Indigenous Pattern
          </span>
        </nav>

        {/* Studio Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#C2410C] uppercase tracking-[0.2em] block mb-1">
              ARTISAN STOREFRONT STUDIO
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1E1E1C] tracking-tight leading-tight mb-1">
              Devendra Prajapati Pottery Studio
            </h1>
            <p className="text-xs text-[#7A756D]">
              Kutch District, Gujarat • GI ID: #GI-IN-GJ-449
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#1E1E1C] hover:bg-[#383734] text-white text-xs font-medium px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish New Handcrafted Listing</span>
          </button>
        </div>

        {/* 4 Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          {/* Card 1 */}
          <div className="bg-[#FAF7F2] border border-[#E5E0D7] rounded-xl p-4 sm:p-5 hover:border-[#D5CFC5] transition-all">
            <span className="text-[10px] uppercase font-semibold text-[#8C877E] tracking-wider block mb-1.5">
              NET MAKER PAYOUT
            </span>
            <div className="font-serif text-2xl sm:text-[28px] font-normal text-[#1E1E1C] tracking-tight mb-1">
              $4,892.40
            </div>
            <span className="text-[11px] text-[#0284C7] font-medium block">
              88% Fair Direct Share
            </span>
          </div>

          {/* Card 2 */}
          <div className="bg-[#FAF7F2] border border-[#E5E0D7] rounded-xl p-4 sm:p-5 hover:border-[#D5CFC5] transition-all">
            <span className="text-[10px] uppercase font-semibold text-[#8C877E] tracking-wider block mb-1.5">
              KILN ORDERS IN QUEUE
            </span>
            <div className="font-serif text-2xl sm:text-[28px] font-normal text-[#1E1E1C] tracking-tight mb-1">
              14
            </div>
            <span className="text-[11px] text-[#7A756D] block">
              3 in drying stage
            </span>
          </div>

          {/* Card 3 */}
          <div className="bg-[#FAF7F2] border border-[#E5E0D7] rounded-xl p-4 sm:p-5 hover:border-[#D5CFC5] transition-all">
            <span className="text-[10px] uppercase font-semibold text-[#8C877E] tracking-wider block mb-1.5">
              ACTIVE CATALOG PIECES
            </span>
            <div className="font-serif text-2xl sm:text-[28px] font-normal text-[#1E1E1C] tracking-tight mb-1">
              {products.length}
            </div>
            <span className="text-[11px] text-[#1E6B52] font-medium block">
              All GI Verified
            </span>
          </div>

          {/* Card 4 */}
          <div className="bg-[#FAF7F2] border border-[#E5E0D7] rounded-xl p-4 sm:p-5 hover:border-[#D5CFC5] transition-all">
            <span className="text-[10px] uppercase font-semibold text-[#8C877E] tracking-wider block mb-1.5">
              MASTER GUILD RATING
            </span>
            <div className="font-serif text-2xl sm:text-[28px] font-normal text-[#1E1E1C] tracking-tight mb-1 flex items-center gap-1">
              <span>4.98</span>
              <span className="text-base text-[#1E1E1C]">★</span>
            </div>
            <span className="text-[11px] text-[#7A756D] block">
              100% on time dispatch
            </span>
          </div>
        </div>

        {/* Product Portfolio Table Card */}
        <div className="bg-[#FAF7F2] border border-[#E5E0D7] rounded-2xl overflow-hidden mb-16 shadow-2xs">
          {/* Table Header Strip */}
          <div className="px-6 py-4 border-b border-[#EAE5DD] flex items-center justify-between">
            <h2 className="font-serif text-lg sm:text-xl font-medium text-[#1E1E1C]">
              Your Product Portfolio
            </h2>
            <span className="text-xs text-[#8C877E] font-mono">
              Live studio inventory
            </span>
          </div>

          {/* Table Element */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4EFE6]/60 border-b border-[#EAE5DD] text-[10px] sm:text-[11px] font-semibold text-[#8C877E] uppercase tracking-wider">
                <tr>
                  <th scope="col" className="py-3 px-6">
                    PRODUCT
                  </th>
                  <th scope="col" className="py-3 px-6">
                    CRAFT &amp; MATERIAL
                  </th>
                  <th scope="col" className="py-3 px-6">
                    PRICE
                  </th>
                  <th scope="col" className="py-3 px-6">
                    STATUS
                  </th>
                  <th scope="col" className="py-3 px-6 text-right">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEBE4] text-[#1E1E1C]">
                {products.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#F7F3EC] transition-colors"
                  >
                    {/* Product Thumbnail & Titles */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-[#ECE6DC] shrink-0 border border-[#DDD5C8]">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-[13px] text-[#1E1E1C] line-clamp-1">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-[#7A756D]">
                            {item.category}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Craft & Material */}
                    <td className="py-3.5 px-6 text-xs text-[#55524B]">
                      {item.craftAndMaterial}
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-6 font-semibold text-xs text-[#1E1E1C]">
                      {item.priceDisplay}
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-6">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#DCFCE7] text-[#15803D]">
                        {item.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-xs text-[#1E1E1C] hover:text-[#C2410C] underline underline-offset-2 transition-colors font-medium"
                      >
                        Preview
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Publish Listing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1E1E1C]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] border border-[#DDD5C8] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DD] mb-5">
              <div>
                <span className="text-[10px] font-semibold text-[#C2410C] uppercase tracking-wider block">
                  GUILD ATELIER
                </span>
                <h3 className="font-serif text-xl font-medium text-[#1E1E1C]">
                  Publish New Handcrafted Listing
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
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kutch Terracotta Hand-Thrown Pitcher"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#1E1E1C]"
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
                    className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#1E1E1C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#1E1E1C]"
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
                  Price ($ USD)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. $145.00"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-md focus:outline-none focus:border-[#1E1E1C]"
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
                  className="px-5 py-2 bg-[#1E1E1C] text-white text-xs font-medium rounded-md hover:bg-[#383734] transition-colors"
                >
                  Submit for GI Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
