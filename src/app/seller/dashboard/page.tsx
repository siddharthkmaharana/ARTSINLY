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
  Tag,
  Palette,
  Ruler,
  Weight as WeightIcon,
  FileCheck,
  RotateCcw,
} from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";
import MultiImageUploader, { CraftImageItem } from "@/components/ui/MultiImageUploader";
import { useAuth } from "@/context/AuthContext";
import { formatINR } from "@/lib/utils";

export interface FormVariantItem {
  id: string;
  name: string;
  sizeOption: string;
  colorName: string;
  colorHex: string;
  price: string;
  stock: string;
  sku: string;
  isDefault: boolean;
}

interface StudioProduct {
  id: string;
  slug: string;
  title: string;
  category: string;
  craftAndMaterial: string;
  craftTechnique?: string | null;
  regionOfOrigin?: string;
  price: number; // in rupees
  priceDisplay: string;
  status: string;
  imageUrl: string;
  images?: CraftImageItem[];
  stock: number;
  isMadeToOrder?: boolean;
  leadTimeDays?: number;
  description?: string;
  dimensions?: string | null;
  materials?: string | null;
  weight?: string | null;
  shippingWeightGrams?: number | null;
  careInstructions?: string | null;
  authenticityDetails?: string | null;
  giCode?: string | null;
  variants?: Array<{
    id: string;
    name: string;
    sku: string;
    sizeOption?: string | null;
    colorName?: string | null;
    colorHex?: string | null;
    pricePaise: number;
    isDefault: boolean;
    stock?: number;
  }>;
}

interface SellerOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentStatus?: string;
  shipmentStatus?: string;
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
  payments?: Array<{
    id: string;
    status: string;
    provider?: string;
  }>;
  shipments?: Array<{
    carrier: string;
    trackingNumber: string;
    status: string;
  }>;
}

export const CRAFT_CATEGORIES = [
  "Painting",
  "Terracotta Pottery",
  "Wood Carving",
  "Metal Casting (Dhokra)",
  "Handloom Weaving",
  "Stone Carving",
  "Zari & Embroidery",
  "Leather Craft (Mojari)",
  "Jewelry & Silver Filigree (Tarakasi)",
  "Paper Mache & Folk Toys",
];

export const REGIONS_OF_ORIGIN = [
  "Odisha",
  "Rajasthan",
  "Gujarat",
  "West Bengal",
  "Kashmir",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Bihar",
  "Kerala",
  "Madhya Pradesh",
  "Andhra Pradesh",
  "Karnataka",
  "Assam",
  "Maharashtra",
];

export const getFormattedPreviewPrice = (val: string) => {
  if (!val || !val.trim()) return "₹1,200";
  try {
    const clean = val.replace(/,/g, "").trim();
    const num = parseFloat(clean);
    if (isNaN(num) || num < 0) return "₹1,200";
    return `₹${Math.floor(num).toLocaleString("en-IN")}${
      clean.includes(".") ? "." + clean.split(".")[1].substring(0, 2) : ""
    }`;
  } catch {
    return "₹1,200";
  }
};

const FALLBACK_PRODUCTS: StudioProduct[] = [
  {
    id: "sp-1",
    slug: "modern-ethnic-ceramic-vase-terracotta-indigenous-pattern",
    title: "Modern Ethnic Ceramic Vase",
    category: "Vases",
    craftAndMaterial: "Terracotta Pottery",
    regionOfOrigin: "Gujarat",
    price: 126.99,
    priceDisplay: "₹126.99",
    status: "Live in Marketplace",
    imageUrl:
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=300&q=80",
    stock: 12,
    isMadeToOrder: false,
  },
  {
    id: "sp-2",
    slug: "hand-carved-floral-high-relief-sheesham-clock",
    title: "Hand-Carved Floral High-Relief Sheesham Panel",
    category: "Wall Decor",
    craftAndMaterial: "Wood Carving",
    regionOfOrigin: "Rajasthan",
    price: 700.0,
    priceDisplay: "₹700.00",
    status: "Live in Marketplace",
    imageUrl:
      "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=300&q=80",
    stock: 4,
    isMadeToOrder: true,
  },
  {
    id: "sp-3",
    slug: "sacred-srinathji-gold-leaf-pichwai-miniature",
    title: "Sacred Srinathji Gold-Leaf Pichwai Miniature Painting",
    category: "Paintings",
    craftAndMaterial: "Painting",
    regionOfOrigin: "Odisha",
    price: 1200.0,
    priceDisplay: "₹1,200.00",
    status: "Live in Marketplace",
    imageUrl:
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=300&q=80",
    stock: 1,
    isMadeToOrder: false,
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

  // Catalogue Filter State
  const [catalogueStatusFilter, setCatalogueStatusFilter] = useState<string>("ALL");

  // "Add a new craft" Form & Live Preview State (Specification + Production Extensions)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCraftCategory, setNewCraftCategory] = useState("Painting"); // specification default
  const [newRegionOfOrigin, setNewRegionOfOrigin] = useState("Odisha"); // specification default
  const [newPrice, setNewPrice] = useState("1200"); // specification default
  const [newAvailableQuantity, setNewAvailableQuantity] = useState("1"); // specification default
  const [newDescription, setNewDescription] = useState("");
  const [newIsMadeToOrder, setNewIsMadeToOrder] = useState(false); // [ ] Made to order
  const [newLeadTimeDays, setNewLeadTimeDays] = useState("7");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImages, setNewImages] = useState<CraftImageItem[]>([]);
  const [newCraftTechnique, setNewCraftTechnique] = useState("Natural Mineral Pigment Tempera");
  const [newMaterials, setNewMaterials] = useState("Tussar silk fabric, organic vegetable dyes & 24K gold foil");
  const [newDimensions, setNewDimensions] = useState("12 x 16 inches");
  const [newWeight, setNewWeight] = useState("450 g");
  const [newShippingWeightGrams, setNewShippingWeightGrams] = useState("600");
  const [newCareInstructions, setNewCareInstructions] = useState("Keep away from direct sunlight & moisture. Dust gently with dry muslin cloth.");
  const [newAuthenticityDetails, setNewAuthenticityDetails] = useState("Certified Odisha Artisan Guild member registry #OD-ART-8824. Heritage Pattachitra Council seal.");
  const [newGiCode, setNewGiCode] = useState("GI-IN-OD-112");
  const [newStatus, setNewStatus] = useState<string>("PUBLISHED");
  const [newHasVariants, setNewHasVariants] = useState(false);
  const [newVariants, setNewVariants] = useState<FormVariantItem[]>([]);
  const [newActivePreviewImageIndex, setNewActivePreviewImageIndex] = useState(0);
  const [newSelectedVariantId, setNewSelectedVariantId] = useState<string | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<StudioProduct | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCraftCategory, setEditCraftCategory] = useState("Painting");
  const [editRegionOfOrigin, setEditRegionOfOrigin] = useState("Odisha");
  const [editPrice, setEditPrice] = useState("1200");
  const [editAvailableQuantity, setEditAvailableQuantity] = useState("1");
  const [editDescription, setEditDescription] = useState("");
  const [editIsMadeToOrder, setEditIsMadeToOrder] = useState(false);
  const [editLeadTimeDays, setEditLeadTimeDays] = useState("7");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editImages, setEditImages] = useState<CraftImageItem[]>([]);
  const [editCraftTechnique, setEditCraftTechnique] = useState("");
  const [editMaterials, setEditMaterials] = useState("");
  const [editDimensions, setEditDimensions] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const [editShippingWeightGrams, setEditShippingWeightGrams] = useState("");
  const [editCareInstructions, setEditCareInstructions] = useState("");
  const [editAuthenticityDetails, setEditAuthenticityDetails] = useState("");
  const [editProductGiCode, setEditProductGiCode] = useState("");
  const [editStatus, setEditStatus] = useState("PUBLISHED");
  const [editHasVariants, setEditHasVariants] = useState(false);
  const [editVariants, setEditVariants] = useState<FormVariantItem[]>([]);
  const [editActivePreviewImageIndex, setEditActivePreviewImageIndex] = useState(0);
  const [editSelectedVariantId, setEditSelectedVariantId] = useState<string | null>(null);
  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);

  // Fulfillment Modal State
  const [selectedOrderForFulfilment, setSelectedOrderForFulfilment] = useState<SellerOrder | null>(null);
  const [fulfilmentStatus, setFulfilmentStatus] = useState<string>("PROCESSING");
  const [carrierName, setCarrierName] = useState<string>("BlueDart Express Insured");
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [cancellationReason, setCancellationReason] = useState<string>("");
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
          const mapped: StudioProduct[] = prodData.products.map((p: any) => {
            const stockQty = p.inventory?.[0]?.quantity ?? (p.isMadeToOrder ? 0 : 1);
            const priceRs = p.basePricePaise / 100;
            const primaryImg = p.images?.find((img: any) => img.isPrimary)?.url || p.images?.[0]?.url;
            return {
              id: p.id,
              slug: p.slug,
              title: p.title,
              category: p.category?.name || "Painting",
              craftAndMaterial: p.craftType || "Painting",
              craftTechnique: p.craftTechnique,
              regionOfOrigin: p.provenanceTag || "Odisha",
              price: priceRs,
              priceDisplay: formatINR(p.basePricePaise),
              status: p.status || "PUBLISHED",
              imageUrl:
                primaryImg ||
                "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=300&q=80",
              images: p.images || [],
              stock: stockQty,
              isMadeToOrder: Boolean(p.isMadeToOrder),
              leadTimeDays: p.leadTimeDays || 0,
              description: p.description,
              dimensions: p.dimensions,
              materials: p.materials,
              weight: p.weight,
              shippingWeightGrams: p.shippingWeightGrams,
              careInstructions: p.careInstructions,
              authenticityDetails: p.authenticityDetails,
              giCode: p.giCode,
              variants: p.variants || [],
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

  // Handle Product Create ("Add a new craft")
  const handleCreateProduct = async (e?: React.FormEvent, targetStatus?: string) => {
    if (e) e.preventDefault();
    if (!newTitle.trim() || !newPrice) {
      alert("Product name and price (₹) are required.");
      return;
    }

    const chosenStatus = targetStatus || newStatus;

    try {
      setIsCreatingProduct(true);
      const res = await fetch("/api/seller/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          craftCategory: newCraftCategory,
          regionOfOrigin: newRegionOfOrigin,
          price: newPrice,
          availableQuantity: newIsMadeToOrder ? 0 : (parseInt(newAvailableQuantity, 10) || 1),
          description: newDescription,
          isMadeToOrder: newIsMadeToOrder,
          leadTimeDays: newIsMadeToOrder ? (parseInt(newLeadTimeDays, 10) || 7) : 0,
          craftTechnique: newCraftTechnique,
          materials: newMaterials,
          dimensions: newDimensions,
          weight: newWeight,
          shippingWeightGrams: newShippingWeightGrams ? parseInt(newShippingWeightGrams, 10) : null,
          careInstructions: newCareInstructions,
          authenticityDetails: newAuthenticityDetails,
          giCode: newGiCode,
          status: chosenStatus,
          imageUrl:
            newImages.find((img) => img.isPrimary)?.url ||
            newImages[0]?.url ||
            newImageUrl ||
            "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
          images: newImages,
          variants: newHasVariants
            ? newVariants.map((v) => ({
                name: v.name,
                sku: v.sku,
                sizeOption: v.sizeOption,
                colorName: v.colorName,
                colorHex: v.colorHex,
                price: v.price,
                stock: parseInt(v.stock, 10) || 0,
                isDefault: v.isDefault,
              }))
            : [],
        }),
      });

      if (res.ok) {
        await loadData();
        setIsModalOpen(false);
        // Reset form
        setNewTitle("");
        setNewCraftCategory("Painting");
        setNewRegionOfOrigin("Odisha");
        setNewPrice("1200");
        setNewAvailableQuantity("1");
        setNewDescription("");
        setNewIsMadeToOrder(false);
        setNewLeadTimeDays("7");
        setNewImageUrl("");
        setNewImages([]);
        setNewHasVariants(false);
        setNewVariants([]);
        setNewStatus("PUBLISHED");
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
    setEditCraftCategory(prod.craftAndMaterial || "Painting");
    setEditRegionOfOrigin(prod.regionOfOrigin || "Odisha");
    setEditPrice(prod.price.toString());
    setEditAvailableQuantity(prod.stock.toString());
    setEditIsMadeToOrder(Boolean(prod.isMadeToOrder));
    setEditLeadTimeDays(prod.leadTimeDays ? prod.leadTimeDays.toString() : "7");
    setEditImageUrl(prod.imageUrl);
    setEditImages(
      prod.images && prod.images.length > 0
        ? prod.images
        : prod.imageUrl
        ? [{ id: "edit_img_0", url: prod.imageUrl, isPrimary: true, displayOrder: 0 }]
        : []
    );
    setEditCraftTechnique(prod.craftTechnique || "");
    setEditMaterials(prod.materials || "");
    setEditDimensions(prod.dimensions || "");
    setEditWeight(prod.weight || "");
    setEditShippingWeightGrams(prod.shippingWeightGrams ? prod.shippingWeightGrams.toString() : "");
    setEditCareInstructions(prod.careInstructions || "");
    setEditAuthenticityDetails(prod.authenticityDetails || "");
    setEditProductGiCode(prod.giCode || "");
    setEditStatus(prod.status || "PUBLISHED");
    if (prod.variants && prod.variants.length > 0) {
      setEditHasVariants(true);
      setEditVariants(
        prod.variants.map((v, i) => ({
          id: v.id || `ev_${i}`,
          name: v.name,
          sizeOption: v.sizeOption || "",
          colorName: v.colorName || "",
          colorHex: v.colorHex || "#8A4B38",
          price: (v.pricePaise / 100).toString(),
          stock: (v.stock ?? 1).toString(),
          sku: v.sku,
          isDefault: v.isDefault,
        }))
      );
    } else {
      setEditHasVariants(false);
      setEditVariants([]);
    }
    setEditActivePreviewImageIndex(0);
    setEditSelectedVariantId(null);
  };

  // Handle Product Update
  const handleUpdateProduct = async (e?: React.FormEvent, targetStatus?: string) => {
    if (e) e.preventDefault();
    if (!editingProduct) return;

    const chosenStatus = targetStatus || editStatus;

    try {
      setIsUpdatingProduct(true);
      const res = await fetch(`/api/seller/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          craftCategory: editCraftCategory,
          regionOfOrigin: editRegionOfOrigin,
          price: editPrice,
          stock: editIsMadeToOrder ? 0 : (parseInt(editAvailableQuantity, 10) || 1),
          isMadeToOrder: editIsMadeToOrder,
          leadTimeDays: editIsMadeToOrder ? (parseInt(editLeadTimeDays, 10) || 7) : 0,
          description: editDescription,
          craftTechnique: editCraftTechnique,
          materials: editMaterials,
          dimensions: editDimensions,
          weight: editWeight,
          shippingWeightGrams: editShippingWeightGrams ? parseInt(editShippingWeightGrams, 10) : null,
          careInstructions: editCareInstructions,
          authenticityDetails: editAuthenticityDetails,
          giCode: editProductGiCode,
          status: chosenStatus,
          imageUrl:
            editImages.find((img) => img.isPrimary)?.url ||
            editImages[0]?.url ||
            editImageUrl,
          images: editImages,
          variants: editHasVariants
            ? editVariants.map((v) => ({
                name: v.name,
                sku: v.sku,
                sizeOption: v.sizeOption,
                colorName: v.colorName,
                colorHex: v.colorHex,
                price: v.price,
                stock: parseInt(v.stock, 10) || 0,
                isDefault: v.isDefault,
              }))
            : [],
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

  // Handle Quick Status Transition from catalogue
  const handleStatusTransition = async (productId: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/seller/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        await loadData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update status");
      }
    } catch (err: any) {
      alert(err.message || "Failed to update status");
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
    const randomToken = typeof window !== "undefined" && window.crypto?.getRandomValues
      ? Array.from(window.crypto.getRandomValues(new Uint8Array(4)), (b) => b.toString(16).padStart(2, "0")).join("").toUpperCase()
      : Date.now().toString(36).toUpperCase();
    setTrackingNumber(
      existingShipment?.trackingNumber || `BD-IN-${randomToken}`
    );
  };

  // Handle Fulfilment Update
  const handleUpdateFulfilment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForFulfilment) return;

    try {
      setIsUpdatingFulfilment(true);
      const isCancellation = fulfilmentStatus === "CANCELLED";
      const res = await fetch(`/api/seller/orders/${selectedOrderForFulfilment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: fulfilmentStatus,
          carrier: carrierName,
          trackingNumber,
          cancellationReason,
          action: isCancellation ? "CANCEL_ITEM" : undefined,
        }),
      });

      if (res.ok) {
        await loadData();
        setSelectedOrderForFulfilment(null);
        setCancellationReason("");
        alert(
          isCancellation
            ? "Your items have been cancelled and buyer has been issued a partial refund. Your inventory has been restored."
            : fulfilmentStatus === "SHIPPED"
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
              className="bg-[#1E1E1C] hover:bg-[#383734] text-white text-xs font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0 active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#C2410C]" />
              <span>Add a new craft</span>
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
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#8C877E] font-medium hidden sm:inline">
                  Showing {products.length} Products
                </span>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add a new craft</span>
                </button>
              </div>
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-semibold text-[#7A756D] uppercase tracking-wider mr-1">
                Filter:
              </span>
              {[
                { key: "ALL", label: `All (${products.length})` },
                {
                  key: "PUBLISHED",
                  label: `Published (${
                    products.filter((p) => p.status === "PUBLISHED" || p.status === "Live in Marketplace").length
                  })`,
                },
                {
                  key: "PENDING_REVIEW",
                  label: `Pending Review (${
                    products.filter((p) => p.status === "PENDING_REVIEW").length
                  })`,
                },
                {
                  key: "DRAFT",
                  label: `Drafts (${
                    products.filter((p) => p.status === "DRAFT").length
                  })`,
                },
                {
                  key: "ARCHIVED",
                  label: `Archived (${
                    products.filter((p) => p.status === "ARCHIVED" || p.status === "Archived").length
                  })`,
                },
              ].map((pill) => (
                <button
                  key={pill.key}
                  type="button"
                  onClick={() => setCatalogueStatusFilter(pill.key)}
                  className={`px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap ${
                    catalogueStatusFilter === pill.key
                      ? "bg-[#1E1E1C] text-white shadow-xs"
                      : "bg-[#F3EFEA] text-[#6E6A62] hover:bg-[#EAE4DC] hover:text-[#1E1E1C]"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Product Cards Grid */}
            {products.filter((p) => {
              if (catalogueStatusFilter === "ALL") return true;
              if (catalogueStatusFilter === "PUBLISHED")
                return p.status === "PUBLISHED" || p.status === "Live in Marketplace";
              if (catalogueStatusFilter === "PENDING_REVIEW") return p.status === "PENDING_REVIEW";
              if (catalogueStatusFilter === "DRAFT") return p.status === "DRAFT";
              if (catalogueStatusFilter === "ARCHIVED")
                return p.status === "ARCHIVED" || p.status === "Archived";
              return true;
            }).length === 0 ? (
              <div className="p-10 text-center bg-[#FAF7F2] rounded-xl border border-dashed border-[#DDD5C8]">
                <Layers className="w-8 h-8 text-[#8C877E] mx-auto mb-2 opacity-60" />
                <h4 className="font-serif text-base text-[#1E1E1C]">No pieces in this view</h4>
                <p className="text-xs text-[#7A756D] mt-1">
                  Adjust the status filter or click "Add a new craft" to create a new artisan listing.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products
                  .filter((p) => {
                    if (catalogueStatusFilter === "ALL") return true;
                    if (catalogueStatusFilter === "PUBLISHED")
                      return p.status === "PUBLISHED" || p.status === "Live in Marketplace";
                    if (catalogueStatusFilter === "PENDING_REVIEW")
                      return p.status === "PENDING_REVIEW";
                    if (catalogueStatusFilter === "DRAFT") return p.status === "DRAFT";
                    if (catalogueStatusFilter === "ARCHIVED")
                      return p.status === "ARCHIVED" || p.status === "Archived";
                    return true;
                  })
                  .map((item) => {
                    const isPublished = item.status === "PUBLISHED" || item.status === "Live in Marketplace";
                    const isPending = item.status === "PENDING_REVIEW";
                    const isDraft = item.status === "DRAFT";
                    const isArchived = item.status === "ARCHIVED" || item.status === "Archived";
                    const hasVariants = item.variants && item.variants.length > 0;

                    return (
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

                          {/* Status Badge */}
                          <div className="absolute top-2 right-2">
                            {isPublished && (
                              <span className="bg-emerald-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                                <Check className="w-2.5 h-2.5" />
                                <span>Published</span>
                              </span>
                            )}
                            {isPending && (
                              <span className="bg-amber-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                                <Clock className="w-2.5 h-2.5" />
                                <span>Pending Review</span>
                              </span>
                            )}
                            {isDraft && (
                              <span className="bg-slate-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                                <FileCheck className="w-2.5 h-2.5" />
                                <span>Draft</span>
                              </span>
                            )}
                            {isArchived && (
                              <span className="bg-stone-500 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                                <Archive className="w-2.5 h-2.5" />
                                <span>Archived</span>
                              </span>
                            )}
                          </div>

                          {/* Made to Order Tag */}
                          {item.isMadeToOrder && (
                            <span className="absolute top-2 left-2 bg-amber-900/85 text-amber-50 backdrop-blur-xs text-[9px] font-bold px-2 py-0.5 rounded shadow-xs">
                              Made to order {item.leadTimeDays ? `(${item.leadTimeDays}d)` : ""}
                            </span>
                          )}

                          {/* Multiple Images Indicator */}
                          {item.images && item.images.length > 1 && (
                            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-medium px-1.5 py-0.5 rounded backdrop-blur-xs">
                              +{item.images.length} photos
                            </span>
                          )}
                        </div>

                        <div className="p-3.5 flex flex-col justify-between flex-grow">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[9px] font-semibold text-[#C2410C] uppercase tracking-wider truncate">
                                {item.craftAndMaterial} · {item.regionOfOrigin || "Odisha"}
                              </span>
                              {hasVariants && (
                                <span className="text-[9px] font-medium text-[#7A756D] bg-[#EAE4DC] px-1.5 py-0.2 rounded shrink-0">
                                  {item.variants?.length} variants
                                </span>
                              )}
                            </div>

                            <h3 className="font-serif text-xs sm:text-sm font-medium text-[#1E1E1C] line-clamp-1 mb-1">
                              {item.title}
                            </h3>

                            {item.craftTechnique && (
                              <p className="text-[10px] text-[#7A756D] line-clamp-1 mb-1 italic">
                                {item.craftTechnique}
                              </p>
                            )}

                            {/* Stock Level Controls */}
                            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-[#E5E0D7] my-2 text-xs">
                              <span className="text-[#7A756D] text-[11px]">Availability:</span>
                              {item.isMadeToOrder ? (
                                <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  Made to order
                                </span>
                              ) : (
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
                                    {item.stock} available
                                  </span>
                                  <button
                                    onClick={() => handleStockAdjust(item.id, item.stock, 1)}
                                    className="w-5 h-5 rounded bg-[#FAF7F2] hover:bg-[#EAE5DD] text-[#1E1E1C] flex items-center justify-center font-bold text-xs cursor-pointer"
                                    title="Increase stock"
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Lifecycle Status Actions */}
                          <div className="pt-2 border-t border-[#EAE5DD] flex items-center justify-between gap-1 mt-1">
                            <span className="text-xs sm:text-sm font-semibold text-[#1E1E1C]">
                              {item.priceDisplay}
                            </span>

                            <div className="flex items-center gap-1">
                              {isDraft && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusTransition(item.id, "PUBLISHED")}
                                  className="text-[9.5px] px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded border border-emerald-200 font-medium cursor-pointer"
                                  title="Publish Draft"
                                >
                                  Publish
                                </button>
                              )}
                              {isPending && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusTransition(item.id, "PUBLISHED")}
                                  className="text-[9.5px] px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded border border-emerald-200 font-medium cursor-pointer"
                                  title="Approve & Publish"
                                >
                                  Publish
                                </button>
                              )}
                              {isPublished && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusTransition(item.id, "ARCHIVED")}
                                  className="text-[9.5px] px-1.5 py-0.5 text-[#7A756D] hover:text-[#1E1E1C] rounded font-medium cursor-pointer"
                                  title="Archive piece"
                                >
                                  Archive
                                </button>
                              )}
                              {isArchived && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusTransition(item.id, "PUBLISHED")}
                                  className="text-[9.5px] px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded border border-emerald-200 font-medium cursor-pointer"
                                  title="Reactivate piece"
                                >
                                  Reactivate
                                </button>
                              )}

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
                                title="Delete Piece"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <Link
                                href={`/products/${item.slug}`}
                                className="text-[10px] text-[#C2410C] hover:underline font-semibold ml-0.5"
                              >
                                View →
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
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

                        {/* Separate Status Badges: Payment, Shipment & Order */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                              (ord.paymentStatus || ord.payments?.[0]?.status) === "COMPLETED"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : (ord.paymentStatus || ord.payments?.[0]?.status) === "REFUNDED"
                                ? "bg-red-50 text-red-800 border border-red-200"
                                : "bg-amber-50 text-amber-800 border border-amber-200"
                            }`}
                          >
                            Payment: {ord.paymentStatus || ord.payments?.[0]?.status || "PENDING"}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                              (ord.shipmentStatus || ord.shipments?.[0]?.status) === "DELIVERED"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : (ord.shipmentStatus || ord.shipments?.[0]?.status) === "SHIPPED" || (ord.shipmentStatus || ord.shipments?.[0]?.status) === "IN_TRANSIT"
                                ? "bg-sky-50 text-sky-800 border border-sky-200"
                                : "bg-stone-50 text-stone-700 border border-stone-200"
                            }`}
                          >
                            <Truck className="w-3 h-3" />
                            Shipment: {ord.shipmentStatus || ord.shipments?.[0]?.status || "PENDING"}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold ${
                              ord.status === "DELIVERED"
                                ? "bg-emerald-100 text-emerald-800"
                                : ord.status === "REFUNDED"
                                ? "bg-red-100 text-red-800"
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
                            <span>Order: {ord.status}</span>
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

      {/* MODAL 1: ADD A NEW CRAFT (PROPOSED PRODUCT-UPLOAD FORM & PRODUCTION PREVIEW) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#FAF7F2] border border-[#DDD5C8] rounded-2xl p-5 sm:p-8 max-w-5xl w-full shadow-2xl relative max-h-[94vh] overflow-y-auto my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EAE5DD]">
              <div>
                <span className="text-[10px] font-semibold text-[#C2410C] uppercase tracking-[0.2em] block mb-0.5">
                  ARTISAN STOREFRONT STUDIO · SELF-SERVE CRAFT MANAGEMENT
                </span>
                <h3 className="font-serif text-2xl font-normal text-[#1E1E1C]">
                  Add a new craft
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#ECE6DC] text-[#666] transition-colors cursor-pointer"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2-Column Responsive Specification Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Proposed product-upload form & Production Extensions */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-[#EFEBE4]">
                  <span className="text-xs font-bold text-[#1E1E1C] uppercase tracking-wider">
                    Proposed product-upload form
                  </span>
                  <span className="text-[10px] font-mono bg-[#EFEBE4] text-[#7A756D] px-2 py-0.5 rounded">
                    Implementation Spec
                  </span>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateProduct(e, newStatus);
                  }}
                  className="space-y-4"
                >
                  {/* Product name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                      Product name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Traditional Pattachitra Palm Leaf Painting"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] transition-all"
                    />
                  </div>

                  {/* Craft category & Region of origin */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                        Craft category
                      </label>
                      <select
                        value={newCraftCategory}
                        onChange={(e) => setNewCraftCategory(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C] cursor-pointer"
                      >
                        {CRAFT_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                        Region of origin
                      </label>
                      <select
                        value={newRegionOfOrigin}
                        onChange={(e) => setNewRegionOfOrigin(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C] cursor-pointer"
                      >
                        {REGIONS_OF_ORIGIN.map((reg) => (
                          <option key={reg} value={reg}>
                            {reg}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Price (₹) & Available quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                        Price (₹) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs font-medium text-[#7A756D]">
                          ₹
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="1200"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          className="w-full text-xs pl-7 pr-3 py-2.5 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C] font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                        Available quantity
                      </label>
                      <input
                        type="number"
                        min="0"
                        disabled={newIsMadeToOrder}
                        value={newIsMadeToOrder ? "" : newAvailableQuantity}
                        onChange={(e) => setNewAvailableQuantity(e.target.value)}
                        placeholder={newIsMadeToOrder ? "Made to order" : "1"}
                        className={`w-full text-xs px-3 py-2.5 bg-white border rounded-lg focus:outline-none font-mono ${
                          newIsMadeToOrder
                            ? "bg-[#EFEBE4] text-[#8C877E] border-[#DDD5C8] cursor-not-allowed"
                            : "border-[#D5CFC5] focus:border-[#C2410C]"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe the cultural lineage, natural pigments, seasoned wood, and artisan heritage..."
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C]"
                    />
                  </div>

                  {/* [ ] Made to order & Lead Time */}
                  <div className="p-3 bg-white border border-[#DDD5C8] rounded-xl space-y-2.5">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newIsMadeToOrder}
                        onChange={(e) => setNewIsMadeToOrder(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-[#C2410C] focus:ring-[#C2410C] accent-[#C2410C] cursor-pointer"
                      />
                      <div className="select-none">
                        <span className="text-xs font-semibold text-[#1E1E1C] block">
                          Made to order
                        </span>
                        <span className="text-[11px] text-[#7A756D] leading-tight block">
                          Each piece is custom crafted upon receiving an order. Fixed stock is not deducted.
                        </span>
                      </div>
                    </label>

                    {newIsMadeToOrder && (
                      <div className="pt-2 border-t border-[#F0EBE1] flex items-center gap-3">
                        <label className="text-xs font-semibold text-[#1E1E1C] whitespace-nowrap">
                          Lead time (days):
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="90"
                          value={newLeadTimeDays}
                          onChange={(e) => setNewLeadTimeDays(e.target.value)}
                          className="w-24 text-xs px-3 py-1.5 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C] font-mono"
                        />
                        <span className="text-[11px] text-[#7A756D]">
                          days to craft and prepare for dispatch
                        </span>
                      </div>
                    )}
                  </div>

                  {/* PRODUCTION SECTION: MULTIPLE PRODUCT IMAGES */}
                  <div className="pt-2 border-t border-[#EAE5DD]">
                    <MultiImageUploader
                      images={newImages}
                      onChange={setNewImages}
                      folder="artsinly/products"
                      label="Product Photography & Multiple Views"
                      helperText="Drag and drop or select multiple photographs (angles, hallmark, close-up texture). Star to choose cover."
                    />
                  </div>

                  {/* PRODUCTION SECTION: CRAFT DETAILS, MATERIALS & AUTHENTICITY */}
                  <div className="pt-3 border-t border-[#EAE5DD] space-y-3">
                    <div className="flex items-center gap-2">
                      <Palette className="w-3.5 h-3.5 text-[#C2410C]" />
                      <span className="text-xs font-bold text-[#1E1E1C] uppercase tracking-wider">
                        Craft Technique, Materials & Authenticity
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                          Craft technique
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Lost-Wax Casting / Natural Pigment Tempera"
                          value={newCraftTechnique}
                          onChange={(e) => setNewCraftTechnique(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                          Materials
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Bell metal, beeswax, riverbed clay"
                          value={newMaterials}
                          onChange={(e) => setNewMaterials(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                          Dimensions
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 12 in W × 16 in H"
                          value={newDimensions}
                          onChange={(e) => setNewDimensions(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                          Weight
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 450 g / 1.2 kg"
                          value={newWeight}
                          onChange={(e) => setNewWeight(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                          Shipping weight (g)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 600"
                          value={newShippingWeightGrams}
                          onChange={(e) => setNewShippingWeightGrams(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C] font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                        Care instructions
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Wipe gently with dry cloth. Keep away from moisture."
                        value={newCareInstructions}
                        onChange={(e) => setNewCareInstructions(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                          GI Certificate Code
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. GI-IN-OD-112"
                          value={newGiCode}
                          onChange={(e) => setNewGiCode(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                          Authenticity & Guild Lineage
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Certified Guild Registry #OD-8824"
                          value={newAuthenticityDetails}
                          onChange={(e) => setNewAuthenticityDetails(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PRODUCTION SECTION: VARIANTS (SIZE / COLOUR) */}
                  <div className="pt-3 border-t border-[#EAE5DD] space-y-3">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newHasVariants}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setNewHasVariants(checked);
                          if (checked && newVariants.length === 0) {
                            setNewVariants([
                              {
                                id: "v_1",
                                name: "Standard (12x16\")",
                                sizeOption: "12x16 inches",
                                colorName: "Traditional Carmine",
                                colorHex: "#B91C1C",
                                price: newPrice || "1200",
                                stock: newAvailableQuantity || "1",
                                sku: "VAR-STD-01",
                                isDefault: true,
                              },
                              {
                                id: "v_2",
                                name: "Grand Edition (18x24\")",
                                sizeOption: "18x24 inches",
                                colorName: "Traditional Carmine",
                                colorHex: "#B91C1C",
                                price: "2400",
                                stock: "2",
                                sku: "VAR-GRD-02",
                                isDefault: false,
                              },
                            ]);
                          }
                        }}
                        className="w-4 h-4 rounded text-[#C2410C] focus:ring-[#C2410C] accent-[#C2410C] cursor-pointer"
                      />
                      <span className="text-xs font-bold text-[#1E1E1C] uppercase tracking-wider">
                        This craft has variants (such as size or colour)
                      </span>
                    </label>

                    {newHasVariants && (
                      <div className="bg-[#FAF7F2] border border-[#DDD5C8] rounded-xl p-3.5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-[#7A756D] font-medium">
                            Configure options, variant pricing, and stock
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newId = `v_${Date.now()}`;
                              setNewVariants([
                                ...newVariants,
                                {
                                  id: newId,
                                  name: `Option ${newVariants.length + 1}`,
                                  sizeOption: "",
                                  colorName: "",
                                  colorHex: "#8A4B38",
                                  price: newPrice || "1200",
                                  stock: "1",
                                  sku: `VAR-${newVariants.length + 1}`,
                                  isDefault: false,
                                },
                              ]);
                            }}
                            className="px-2.5 py-1 bg-white border border-[#DDD5C8] text-[#1E1E1C] rounded text-xs hover:border-[#C2410C] font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3 text-[#C2410C]" />
                            <span>Add Variant</span>
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {newVariants.map((v, idx) => (
                            <div
                              key={v.id}
                              className="p-3 bg-white border border-[#E5E0D7] rounded-lg space-y-2 text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-[#1E1E1C]">
                                  Variant #{idx + 1}: {v.name || "Untitled Variant"}
                                </span>
                                <div className="flex items-center gap-2">
                                  <label className="flex items-center gap-1 text-[11px] text-[#7A756D] cursor-pointer">
                                    <input
                                      type="radio"
                                      name="defaultVariant"
                                      checked={v.isDefault}
                                      onChange={() => {
                                        setNewVariants(
                                          newVariants.map((item, i) => ({
                                            ...item,
                                            isDefault: i === idx,
                                          }))
                                        );
                                      }}
                                      className="accent-[#C2410C]"
                                    />
                                    <span>Default</span>
                                  </label>
                                  {newVariants.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const filtered = newVariants.filter((_, i) => i !== idx);
                                        if (!filtered.some((item) => item.isDefault) && filtered.length > 0) {
                                          filtered[0].isDefault = true;
                                        }
                                        setNewVariants(filtered);
                                      }}
                                      className="text-red-600 hover:text-red-700 p-1"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <input
                                  type="text"
                                  placeholder="Variant name"
                                  value={v.name}
                                  onChange={(e) => {
                                    const copy = [...newVariants];
                                    copy[idx].name = e.target.value;
                                    setNewVariants(copy);
                                  }}
                                  className="px-2.5 py-1.5 border border-[#D5CFC5] rounded text-xs"
                                />
                                <input
                                  type="text"
                                  placeholder="Size (e.g. 14x18 in)"
                                  value={v.sizeOption}
                                  onChange={(e) => {
                                    const copy = [...newVariants];
                                    copy[idx].sizeOption = e.target.value;
                                    setNewVariants(copy);
                                  }}
                                  className="px-2.5 py-1.5 border border-[#D5CFC5] rounded text-xs"
                                />
                                <input
                                  type="text"
                                  placeholder="Price (₹)"
                                  value={v.price}
                                  onChange={(e) => {
                                    const copy = [...newVariants];
                                    copy[idx].price = e.target.value;
                                    setNewVariants(copy);
                                  }}
                                  className="px-2.5 py-1.5 border border-[#D5CFC5] rounded text-xs font-mono"
                                />
                                <input
                                  type="number"
                                  placeholder="Stock"
                                  disabled={newIsMadeToOrder}
                                  value={newIsMadeToOrder ? "" : v.stock}
                                  onChange={(e) => {
                                    const copy = [...newVariants];
                                    copy[idx].stock = e.target.value;
                                    setNewVariants(copy);
                                  }}
                                  className="px-2.5 py-1.5 border border-[#D5CFC5] rounded text-xs font-mono disabled:bg-stone-100"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PRODUCTION SECTION: PUBLISHING ACTIONS (DRAFT, REVIEW, PUBLISHED) */}
                  <div className="pt-4 border-t border-[#EAE5DD] flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-[#D5CFC5] text-xs font-medium rounded-lg hover:bg-[#ECE6DC] text-[#1E1E1C] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isCreatingProduct}
                        onClick={() => handleCreateProduct(undefined, "DRAFT")}
                        className="px-3.5 py-2 border border-[#8C877E] text-[#4A4742] hover:bg-[#EAE4DC] text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Save as Draft</span>
                      </button>

                      <button
                        type="button"
                        disabled={isCreatingProduct}
                        onClick={() => handleCreateProduct(undefined, "PENDING_REVIEW")}
                        className="px-3.5 py-2 border border-amber-500 bg-amber-50 text-amber-900 hover:bg-amber-100 text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span>Submit for Review</span>
                      </button>

                      <button
                        type="button"
                        disabled={isCreatingProduct}
                        onClick={() => handleCreateProduct(undefined, "PUBLISHED")}
                        className="px-4 py-2 bg-[#1E1E1C] hover:bg-[#383734] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {isCreatingProduct ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C2410C]" />
                            <span>Publishing...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 text-[#C2410C]" />
                            <span>Publish Craft</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Right Column: PRODUCTION LIVE PREVIEW */}
              <div className="lg:col-span-5 lg:sticky lg:top-4 bg-[#F5EFEB] p-4 sm:p-5 rounded-xl border border-[#DDD5C8] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8E1D5]">
                  <span className="text-[11px] font-bold text-[#C2410C] uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    PRODUCT PREVIEW
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Live Reactive
                    </span>
                    <span className="text-[9px] font-bold bg-[#1E1E1C] text-white px-2 py-0.5 rounded uppercase tracking-wider">
                      {newStatus}
                    </span>
                  </div>
                </div>

                {/* THE LIVE PREVIEW CARD */}
                <div className="bg-white border-2 border-[#DDD5C8] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  {/* Primary Featured Image View */}
                  {(() => {
                    const activeImg =
                      newImages[newActivePreviewImageIndex]?.url ||
                      newImages.find((img) => img.isPrimary)?.url ||
                      newImageUrl;

                    return (
                      <div className="aspect-[4/3] w-full bg-[#EFEBE4] relative overflow-hidden flex items-center justify-center">
                        {activeImg ? (
                          <img
                            src={activeImg}
                            alt={newTitle || "Craft Preview"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <Store className="w-8 h-8 text-[#C2410C] mx-auto mb-1 opacity-70" />
                            <span className="text-[10px] text-[#8C877E] font-medium block">
                              Authentic Handcrafted Visual
                            </span>
                          </div>
                        )}
                        <span className="absolute top-2 left-2 text-[9px] font-semibold bg-black/75 text-white backdrop-blur-xs px-2 py-0.5 rounded flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          GI Certified Origin
                        </span>
                        <span className="absolute top-2 right-2 text-[9px] font-semibold bg-emerald-600 text-white px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
                          Live
                        </span>
                      </div>
                    );
                  })()}

                  {/* Multi-Image Clickable Thumbnail Strip */}
                  {newImages.length > 1 && (
                    <div className="p-2 bg-[#FAF7F2] border-b border-[#EFEBE4] flex items-center gap-1.5 overflow-x-auto">
                      {newImages.map((img, i) => (
                        <button
                          key={img.id}
                          type="button"
                          onClick={() => setNewActivePreviewImageIndex(i)}
                          className={`w-10 h-10 rounded-md overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                            newActivePreviewImageIndex === i
                              ? "border-[#C2410C] scale-105"
                              : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={img.url} alt="thumb" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Card Content Matching User Specification */}
                  <div className="p-4 space-y-2.5">
                    {/* Your product name */}
                    <h4 className="font-serif text-base sm:text-lg font-medium text-[#1E1E1C] line-clamp-1">
                      {newTitle.trim() || "Your product name"}
                    </h4>

                    {/* Painting · Odisha */}
                    <p className="text-xs text-[#7A756D] font-medium">
                      {newCraftCategory || "Painting"} · {newRegionOfOrigin || "Odisha"}
                    </p>

                    {/* Interactive Variant Pills (if enabled) */}
                    {newHasVariants && newVariants.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10px] font-semibold text-[#8C877E] uppercase tracking-wider block mb-1">
                          Available Options:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {newVariants.map((v) => {
                            const isSelected = newSelectedVariantId === v.id || (!newSelectedVariantId && v.isDefault);
                            return (
                              <button
                                key={v.id}
                                type="button"
                                onClick={() => setNewSelectedVariantId(v.id)}
                                className={`text-[10.5px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-[#1E1E1C] text-white border-[#1E1E1C] font-semibold"
                                    : "bg-white text-[#6E6A62] border-[#DDD5C8] hover:border-[#1E1E1C]"
                                }`}
                              >
                                {v.sizeOption || v.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Dynamic Price Display */}
                    {(() => {
                      const selectedVariant = newVariants.find((v) => v.id === newSelectedVariantId);
                      const displayPrice = selectedVariant?.price || newPrice;
                      return (
                        <div className="font-serif text-xl sm:text-2xl font-normal text-[#1E1E1C] pt-1">
                          {getFormattedPreviewPrice(displayPrice)}
                        </div>
                      );
                    })()}

                    {/* 1 available or Made to order */}
                    <div className="flex items-center gap-1.5 text-xs text-[#5C564E] pt-1 border-t border-[#F0EBE1]">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          newIsMadeToOrder ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                        }`}
                      />
                      <span className="font-medium">
                        {newIsMadeToOrder
                          ? `Made to order (${newLeadTimeDays || "7"} days lead time)`
                          : (() => {
                              const selectedVariant = newVariants.find((v) => v.id === newSelectedVariantId);
                              const qty = selectedVariant ? selectedVariant.stock : newAvailableQuantity;
                              return `${qty || "1"} available`;
                            })()}
                      </span>
                    </div>

                    {/* Production Craft & Material Specs */}
                    {(newCraftTechnique || newMaterials) && (
                      <div className="pt-1.5 border-t border-[#F0EBE1] text-[10.5px] text-[#7A756D] space-y-0.5">
                        {newCraftTechnique && (
                          <p className="line-clamp-1">
                            <strong className="text-[#1E1E1C]">Technique:</strong> {newCraftTechnique}
                          </p>
                        )}
                        {newMaterials && (
                          <p className="line-clamp-1">
                            <strong className="text-[#1E1E1C]">Materials:</strong> {newMaterials}
                          </p>
                        )}
                      </div>
                    )}

                    {(newDimensions || newWeight) && (
                      <div className="text-[10px] text-[#8C877E] flex items-center gap-2">
                        {newDimensions && <span>📐 {newDimensions}</span>}
                        {newWeight && <span>⚖️ {newWeight}</span>}
                      </div>
                    )}

                    {newDescription && (
                      <p className="text-[11px] text-[#8C877E] line-clamp-2 italic pt-1 border-t border-[#F0EBE1]">
                        "{newDescription}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#EAE3D6] text-[10px] text-[#6E6A62] leading-relaxed">
                  💡 <strong>Artisan Rule:</strong> All buyer orders snapshot the current price and seller details at purchase time, protecting historical orders from later catalog adjustments.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT HANDCRAFTED LISTING (WITH REAL-TIME PREVIEW & PRODUCTION SUITE) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#FAF7F2] border border-[#DDD5C8] rounded-2xl p-5 sm:p-8 max-w-5xl w-full shadow-2xl relative max-h-[94vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EAE5DD]">
              <div>
                <span className="text-[10px] font-semibold text-[#C2410C] uppercase tracking-[0.2em] block mb-0.5">
                  EDIT PIECE & LIFECYCLE
                </span>
                <h3 className="font-serif text-2xl font-normal text-[#1E1E1C]">
                  Update Product Listing
                </h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-full hover:bg-[#ECE6DC] text-[#666] transition-colors cursor-pointer"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Edit Form */}
              <div className="lg:col-span-7 space-y-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateProduct(e, editStatus);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                      Product name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                        Craft category
                      </label>
                      <select
                        value={editCraftCategory}
                        onChange={(e) => setEditCraftCategory(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C] cursor-pointer"
                      >
                        {CRAFT_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                        Region of origin
                      </label>
                      <select
                        value={editRegionOfOrigin}
                        onChange={(e) => setEditRegionOfOrigin(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C] cursor-pointer"
                      >
                        {REGIONS_OF_ORIGIN.map((reg) => (
                          <option key={reg} value={reg}>
                            {reg}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                        Price (₹) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs font-medium text-[#7A756D]">
                          ₹
                        </span>
                        <input
                          type="text"
                          required
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="w-full text-xs pl-7 pr-3 py-2.5 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C] font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                        Available quantity
                      </label>
                      <input
                        type="number"
                        min="0"
                        disabled={editIsMadeToOrder}
                        value={editIsMadeToOrder ? "" : editAvailableQuantity}
                        onChange={(e) => setEditAvailableQuantity(e.target.value)}
                        placeholder={editIsMadeToOrder ? "Made to order" : "1"}
                        className={`w-full text-xs px-3 py-2.5 bg-white border rounded-lg focus:outline-none font-mono ${
                          editIsMadeToOrder
                            ? "bg-[#EFEBE4] text-[#8C877E] border-[#DDD5C8] cursor-not-allowed"
                            : "border-[#D5CFC5] focus:border-[#C2410C]"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C]"
                    />
                  </div>

                  {/* Made to order & Lead Time */}
                  <div className="p-3 bg-white border border-[#DDD5C8] rounded-xl space-y-2.5">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editIsMadeToOrder}
                        onChange={(e) => setEditIsMadeToOrder(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-[#C2410C] focus:ring-[#C2410C] accent-[#C2410C] cursor-pointer"
                      />
                      <div className="select-none">
                        <span className="text-xs font-semibold text-[#1E1E1C] block">
                          Made to order
                        </span>
                        <span className="text-[11px] text-[#7A756D] leading-tight block">
                          Custom crafted upon receiving order. Shelf inventory is not decremented.
                        </span>
                      </div>
                    </label>

                    {editIsMadeToOrder && (
                      <div className="pt-2 border-t border-[#F0EBE1] flex items-center gap-3">
                        <label className="text-xs font-semibold text-[#1E1E1C] whitespace-nowrap">
                          Lead time (days):
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="90"
                          value={editLeadTimeDays}
                          onChange={(e) => setEditLeadTimeDays(e.target.value)}
                          className="w-24 text-xs px-3 py-1.5 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C] font-mono"
                        />
                        <span className="text-[11px] text-[#7A756D]">
                          days required to hand-craft
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Multi-Image Uploader in Edit Modal */}
                  <div className="pt-2 border-t border-[#EAE5DD]">
                    <MultiImageUploader
                      images={editImages}
                      onChange={setEditImages}
                      folder="artsinly/products"
                      label="Piece Photographs & Gallery"
                      helperText="Update photography, reorder angles, and set primary cover."
                    />
                  </div>

                  {/* Craft Technique, Materials & Dimensions */}
                  <div className="pt-3 border-t border-[#EAE5DD] space-y-3">
                    <span className="text-xs font-bold text-[#1E1E1C] uppercase tracking-wider block">
                      Craft Specifications
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                          Craft technique
                        </label>
                        <input
                          type="text"
                          value={editCraftTechnique}
                          onChange={(e) => setEditCraftTechnique(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                          Materials
                        </label>
                        <input
                          type="text"
                          value={editMaterials}
                          onChange={(e) => setEditMaterials(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                          Dimensions
                        </label>
                        <input
                          type="text"
                          value={editDimensions}
                          onChange={(e) => setEditDimensions(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                          Weight
                        </label>
                        <input
                          type="text"
                          value={editWeight}
                          onChange={(e) => setEditWeight(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                          Shipping weight (g)
                        </label>
                        <input
                          type="number"
                          value={editShippingWeightGrams}
                          onChange={(e) => setEditShippingWeightGrams(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C] font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                        Care instructions
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Wipe gently with dry cloth. Keep away from moisture."
                        value={editCareInstructions}
                        onChange={(e) => setEditCareInstructions(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                          GI Certificate Code
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. GI-IN-OD-112"
                          value={editProductGiCode}
                          onChange={(e) => setEditProductGiCode(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                          Authenticity & Guild Lineage
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Certified Guild Registry #OD-8824"
                          value={editAuthenticityDetails}
                          onChange={(e) => setEditAuthenticityDetails(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-white border border-[#D5CFC5] rounded-lg focus:outline-none focus:border-[#C2410C]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Edit Variants */}
                  <div className="pt-3 border-t border-[#EAE5DD] space-y-3">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editHasVariants}
                        onChange={(e) => setEditHasVariants(e.target.checked)}
                        className="w-4 h-4 rounded text-[#C2410C] focus:ring-[#C2410C] accent-[#C2410C] cursor-pointer"
                      />
                      <span className="text-xs font-bold text-[#1E1E1C] uppercase tracking-wider">
                        Configure Variants (Size / Colour)
                      </span>
                    </label>

                    {editHasVariants && (
                      <div className="bg-[#FAF7F2] border border-[#DDD5C8] rounded-xl p-3.5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-[#7A756D] font-medium">
                            Manage options and pricing
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newId = `ev_${Date.now()}`;
                              setEditVariants([
                                ...editVariants,
                                {
                                  id: newId,
                                  name: `Option ${editVariants.length + 1}`,
                                  sizeOption: "",
                                  colorName: "",
                                  colorHex: "#8A4B38",
                                  price: editPrice || "1200",
                                  stock: "1",
                                  sku: `VAR-${editVariants.length + 1}`,
                                  isDefault: false,
                                },
                              ]);
                            }}
                            className="px-2.5 py-1 bg-white border border-[#DDD5C8] text-[#1E1E1C] rounded text-xs hover:border-[#C2410C] font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3 text-[#C2410C]" />
                            <span>Add Variant</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {editVariants.map((v, idx) => (
                            <div
                              key={v.id}
                              className="p-3 bg-white border border-[#E5E0D7] rounded-lg space-y-2 text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-[#1E1E1C]">
                                  {v.name || `Variant ${idx + 1}`}
                                </span>
                                <div className="flex items-center gap-2">
                                  <label className="flex items-center gap-1 text-[11px] text-[#7A756D] cursor-pointer">
                                    <input
                                      type="radio"
                                      name="editDefaultVariant"
                                      checked={v.isDefault}
                                      onChange={() => {
                                        setEditVariants(
                                          editVariants.map((item, i) => ({
                                            ...item,
                                            isDefault: i === idx,
                                          }))
                                        );
                                      }}
                                      className="accent-[#C2410C]"
                                    />
                                    <span>Default</span>
                                  </label>
                                  {editVariants.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const filtered = editVariants.filter((_, i) => i !== idx);
                                        if (!filtered.some((item) => item.isDefault) && filtered.length > 0) {
                                          filtered[0].isDefault = true;
                                        }
                                        setEditVariants(filtered);
                                      }}
                                      className="text-red-600 hover:text-red-700 p-1"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <input
                                  type="text"
                                  placeholder="Variant name"
                                  value={v.name}
                                  onChange={(e) => {
                                    const copy = [...editVariants];
                                    copy[idx].name = e.target.value;
                                    setEditVariants(copy);
                                  }}
                                  className="px-2.5 py-1.5 border border-[#D5CFC5] rounded text-xs"
                                />
                                <input
                                  type="text"
                                  placeholder="Size option"
                                  value={v.sizeOption}
                                  onChange={(e) => {
                                    const copy = [...editVariants];
                                    copy[idx].sizeOption = e.target.value;
                                    setEditVariants(copy);
                                  }}
                                  className="px-2.5 py-1.5 border border-[#D5CFC5] rounded text-xs"
                                />
                                <input
                                  type="text"
                                  placeholder="Price (₹)"
                                  value={v.price}
                                  onChange={(e) => {
                                    const copy = [...editVariants];
                                    copy[idx].price = e.target.value;
                                    setEditVariants(copy);
                                  }}
                                  className="px-2.5 py-1.5 border border-[#D5CFC5] rounded text-xs font-mono"
                                />
                                <input
                                  type="number"
                                  placeholder="Stock"
                                  disabled={editIsMadeToOrder}
                                  value={editIsMadeToOrder ? "" : v.stock}
                                  onChange={(e) => {
                                    const copy = [...editVariants];
                                    copy[idx].stock = e.target.value;
                                    setEditVariants(copy);
                                  }}
                                  className="px-2.5 py-1.5 border border-[#D5CFC5] rounded text-xs font-mono"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submission Actions */}
                  <div className="pt-4 border-t border-[#EAE5DD] flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 border border-[#D5CFC5] text-xs font-medium rounded-lg hover:bg-[#ECE6DC] text-[#1E1E1C] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isUpdatingProduct}
                        onClick={() => handleUpdateProduct(undefined, "DRAFT")}
                        className="px-3.5 py-2 border border-[#8C877E] text-[#4A4742] hover:bg-[#EAE4DC] text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Save as Draft
                      </button>

                      <button
                        type="button"
                        disabled={isUpdatingProduct}
                        onClick={() => handleUpdateProduct(undefined, "PENDING_REVIEW")}
                        className="px-3.5 py-2 border border-amber-500 bg-amber-50 text-amber-900 hover:bg-amber-100 text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Submit for Review
                      </button>

                      <button
                        type="button"
                        disabled={isUpdatingProduct}
                        onClick={() => handleUpdateProduct(undefined, "PUBLISHED")}
                        className="px-5 py-2.5 bg-[#1E1E1C] text-white text-xs font-semibold rounded-lg hover:bg-[#383734] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-xs"
                      >
                        {isUpdatingProduct ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving Changes...</span>
                          </>
                        ) : (
                          <span>Save & Publish</span>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Right Column: Live Preview for Edited Product */}
              <div className="lg:col-span-5 lg:sticky lg:top-4 bg-[#F5EFEB] p-4 sm:p-5 rounded-xl border border-[#DDD5C8] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8E1D5]">
                  <span className="text-[11px] font-bold text-[#C2410C] uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    PRODUCT PREVIEW
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Live Editing
                    </span>
                    <span className="text-[9px] font-bold bg-[#1E1E1C] text-white px-2 py-0.5 rounded uppercase">
                      {editStatus}
                    </span>
                  </div>
                </div>

                <div className="bg-white border-2 border-[#DDD5C8] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  {/* Active Featured Image View */}
                  {(() => {
                    const activeImg =
                      editImages[editActivePreviewImageIndex]?.url ||
                      editImages.find((img) => img.isPrimary)?.url ||
                      editImageUrl;

                    return (
                      <div className="aspect-[4/3] w-full bg-[#EFEBE4] relative overflow-hidden flex items-center justify-center">
                        {activeImg ? (
                          <img
                            src={activeImg}
                            alt={editTitle || "Craft Preview"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <Store className="w-8 h-8 text-[#C2410C] mx-auto mb-1 opacity-70" />
                            <span className="text-[10px] text-[#8C877E] font-medium block">
                              Handcrafted Studio Visual
                            </span>
                          </div>
                        )}
                        <span className="absolute top-2 left-2 text-[9px] font-semibold bg-black/70 text-white backdrop-blur-xs px-2 py-0.5 rounded flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          GI Certified Origin
                        </span>
                      </div>
                    );
                  })()}

                  {/* Thumbnail Selector */}
                  {editImages.length > 1 && (
                    <div className="p-2 bg-[#FAF7F2] border-b border-[#EFEBE4] flex items-center gap-1.5 overflow-x-auto">
                      {editImages.map((img, i) => (
                        <button
                          key={img.id}
                          type="button"
                          onClick={() => setEditActivePreviewImageIndex(i)}
                          className={`w-10 h-10 rounded-md overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                            editActivePreviewImageIndex === i
                              ? "border-[#C2410C] scale-105"
                              : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={img.url} alt="thumb" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="p-4 space-y-2">
                    <h4 className="font-serif text-base sm:text-lg font-medium text-[#1E1E1C] line-clamp-1">
                      {editTitle.trim() || "Your product name"}
                    </h4>
                    <p className="text-xs text-[#7A756D] font-medium">
                      {editCraftCategory || "Painting"} · {editRegionOfOrigin || "Odisha"}
                    </p>

                    {/* Variant Selector in Preview */}
                    {editHasVariants && editVariants.length > 0 && (
                      <div className="pt-1 flex flex-wrap gap-1.5">
                        {editVariants.map((v) => {
                          const isSelected = editSelectedVariantId === v.id || (!editSelectedVariantId && v.isDefault);
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => setEditSelectedVariantId(v.id)}
                              className={`text-[10px] px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#1E1E1C] text-white border-[#1E1E1C] font-semibold"
                                  : "bg-white text-[#6E6A62] border-[#DDD5C8]"
                              }`}
                            >
                              {v.sizeOption || v.name}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="font-serif text-xl sm:text-2xl font-normal text-[#1E1E1C] pt-1">
                      {(() => {
                        const sel = editVariants.find((v) => v.id === editSelectedVariantId);
                        return getFormattedPreviewPrice(sel?.price || editPrice);
                      })()}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#5C564E] pt-1 border-t border-[#F0EBE1]">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          editIsMadeToOrder ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                        }`}
                      />
                      <span className="font-medium">
                        {editIsMadeToOrder
                          ? `Made to order (${editLeadTimeDays || "7"} days lead time)`
                          : (() => {
                              const sel = editVariants.find((v) => v.id === editSelectedVariantId);
                              return `${sel ? sel.stock : (editAvailableQuantity || "1")} available`;
                            })()}
                      </span>
                    </div>

                    {(editCraftTechnique || editMaterials) && (
                      <div className="pt-1.5 border-t border-[#F0EBE1] text-[10.5px] text-[#7A756D] space-y-0.5">
                        {editCraftTechnique && (
                          <p className="line-clamp-1">
                            <strong>Technique:</strong> {editCraftTechnique}
                          </p>
                        )}
                        {editMaterials && (
                          <p className="line-clamp-1">
                            <strong>Materials:</strong> {editMaterials}
                          </p>
                        )}
                      </div>
                    )}

                    {editDescription && (
                      <p className="text-[11px] text-[#8C877E] line-clamp-2 italic pt-1 border-t border-[#F0EBE1]">
                        "{editDescription}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
                  <option value="CANCELLED">UNABLE TO FULFILL — Cancel Item & Trigger Partial Refund (Rule 6)</option>
                </select>
              </div>

              {fulfilmentStatus === "CANCELLED" ? (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg space-y-2 text-xs text-red-900">
                  <label className="block font-semibold">
                    State Reason for Cancellation *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Ceramic cracked during final kiln firing; unable to re-fire in time."
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-red-300 rounded-md focus:outline-none focus:border-red-600 text-xs"
                  />
                  <p className="text-[11px] text-red-700">
                    Rule 6 Protocol: Submitting will cancel your item(s), unlock inventory, credit an automatic partial refund to the buyer, and preserve any other artisan's items in the order.
                  </p>
                </div>
              ) : (
                <>
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
                </>
              )}

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
