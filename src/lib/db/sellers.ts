import { prisma } from "@/lib/prisma";
import { SellerProfile } from "@prisma/client";

export interface CreateSellerProfileInput {
  userId: string;
  shopName: string;
  slug: string;
  artisanName?: string;
  bio?: string;
  story?: string;
  craftTradition: string;
  state: string;
  locality?: string;
  giCode?: string;
  isVerified?: boolean;
  yearsOfExperience?: number;
  avatarUrl?: string;
  bannerUrl?: string;
}

export interface UpdateSellerProfileInput {
  shopName?: string;
  slug?: string;
  artisanName?: string;
  bio?: string;
  story?: string;
  craftTradition?: string;
  state?: string;
  locality?: string;
  giCode?: string;
  isVerified?: boolean;
  yearsOfExperience?: number;
  avatarUrl?: string;
  bannerUrl?: string;
}

/**
 * Get all verified seller profiles with their product counts
 */
export async function getAllSellers(verifiedOnly = false) {
  return prisma.sellerProfile.findMany({
    where: verifiedOnly ? { isVerified: true } : undefined,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
        },
      },
      _count: {
        select: { products: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get seller profile by unique slug
 */
export async function getSellerBySlug(slug: string) {
  return prisma.sellerProfile.findUnique({
    where: { slug },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
        },
      },
      products: {
        where: { status: "PUBLISHED" },
        include: {
          images: {
            orderBy: { displayOrder: "asc" },
          },
          variants: true,
          category: true,
          region: true,
        },
      },
      _count: {
        select: { products: true },
      },
    },
  });
}

/**
 * Get seller profile by User ID
 */
export async function getSellerByUserId(userId: string) {
  return prisma.sellerProfile.findUnique({
    where: { userId },
    include: {
      products: {
        include: {
          images: true,
          variants: true,
          inventory: true,
        },
      },
    },
  });
}

/**
 * Create a new artisan seller profile
 */
export async function createSellerProfile(
  data: CreateSellerProfileInput
): Promise<SellerProfile> {
  return prisma.$transaction(async (tx) => {
    // 1. Create the seller profile
    const profile = await tx.sellerProfile.create({
      data,
    });

    // 2. Ensure user role is updated to SELLER
    await tx.user.update({
      where: { id: data.userId },
      data: { role: "SELLER" },
    });

    return profile;
  });
}

/**
 * Update an existing seller profile
 */
export async function updateSellerProfile(
  id: string,
  data: UpdateSellerProfileInput
): Promise<SellerProfile> {
  return prisma.sellerProfile.update({
    where: { id },
    data,
  });
}
