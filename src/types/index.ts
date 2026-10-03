export type Role = "BUYER" | "SELLER" | "ADMIN";

export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export interface Artisan {
  id: string;
  shopName: string;
  slug: string;
  artisanName: string;
  bio: string;
  story: string;
  craftTradition: string;
  state: string;
  locality: string;
  isVerified: boolean;
  avatarUrl: string;
  bannerUrl?: string;
  yearsOfExperience: number;
  featuredQuote?: string;
  productCount?: number;
}

export interface Region {
  id: string;
  name: string;
  slug: string;
  state: string;
  description: string;
  imageUrl: string;
  craftTraditions: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  itemCount?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  isPrimary?: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  story: string;
  craftType: string;
  categorySlug: string;
  categoryName: string;
  regionSlug: string;
  regionName: string;
  state: string;
  dimensions: string;
  materials: string;
  careInstructions: string;
  pricePaise: number; // e.g. 240000 = ₹2,400
  priceDollars?: number; // e.g. 126.99
  priceDisplay?: string; // e.g. "$126.99"
  excerpt?: string;
  byline?: string;
  provenanceTag?: string;
  originalPricePaise?: number;
  stock: number;
  isMadeToOrder: boolean;
  leadTimeDays: number;
  status: ProductStatus;
  artisan: Artisan;
  images: ProductImage[];
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  pricePaise: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotalPaise: number;
  shippingFeePaise: number;
  taxPaise: number;
  totalPaise: number;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
  trackingNumber?: string;
  carrier?: string;
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  date: string;
  locality?: string;
}
