import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ExploreShowcase } from "@/components/explore/ExploreShowcase";
import { PRODUCTS } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let title = "Handcrafted Heritage Masterpiece | ARTSINLY";
  let description =
    "Authentic Indian artisanal creation handcrafted by master makers with verifiable GI credentials.";
  let imageUrl =
    "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85";

  try {
    const dbProduct = await prisma.product.findUnique({
      where: { slug },
      include: { images: true },
    });
    if (dbProduct) {
      title = `${dbProduct.title} | ARTSINLY Heritage Guild`;
      description = dbProduct.description
        ? dbProduct.description.slice(0, 160)
        : description;
      if (dbProduct.images && dbProduct.images.length > 0) {
        imageUrl = dbProduct.images[0].url;
      }
    }
  } catch {
    // Fallback to static mock data
  }

  const mockProduct = PRODUCTS.find((p) => p.slug === slug);
  if (mockProduct) {
    title = `${mockProduct.title} | ARTSINLY`;
    description = mockProduct.description
      ? mockProduct.description.slice(0, 160)
      : description;
    if (mockProduct.images && mockProduct.images.length > 0) {
      imageUrl = mockProduct.images[0].url;
    }
  }

  return {
    title,
    description,
    alternates: {
      canonical: `/products/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/products/${slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-[#807C74]">
          Loading Handcrafted Heritage...
        </div>
      }
    >
      <ExploreShowcase productSlug={resolvedParams.slug} />
    </Suspense>
  );
}

