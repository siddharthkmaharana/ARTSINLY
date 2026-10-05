import { prisma } from "@/lib/prisma";
import { Review } from "@prisma/client";

export interface CreateReviewInput {
  productId: string;
  buyerId: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerifiedPurchase?: boolean;
}

/**
 * Get all reviews for a specific product
 */
export async function getReviewsByProduct(productId: string) {
  return prisma.review.findMany({
    where: { productId },
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Calculate aggregate rating stats for a product
 */
export async function getProductRatingSummary(productId: string) {
  const reviews = await prisma.review.findMany({
    where: { productId },
    select: { rating: true },
  });

  if (reviews.length === 0) {
    return {
      averageRating: 0,
      reviewCount: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;

  for (const review of reviews) {
    sum += review.rating;
    const r = Math.min(5, Math.max(1, review.rating)) as 1 | 2 | 3 | 4 | 5;
    distribution[r] += 1;
  }

  return {
    averageRating: Number((sum / reviews.length).toFixed(1)),
    reviewCount: reviews.length,
    ratingDistribution: distribution,
  };
}

/**
 * Create a new verified product review
 */
export async function createReview(data: CreateReviewInput): Promise<Review> {
  if (data.rating < 1 || data.rating > 5) {
    throw new Error("Rating must be between 1 and 5 stars");
  }

  return prisma.review.create({
    data: {
      productId: data.productId,
      buyerId: data.buyerId,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      isVerifiedPurchase: data.isVerifiedPurchase ?? true,
    },
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
}
