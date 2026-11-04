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

  const mockProduct =
    PRODUCTS.find((p) => p.slug === slug) ||
    (slug === "indian-mythological-palace-painting" || slug === "divine-court-of-the-gods-pattachitra"
      ? PRODUCTS.find((p) => p.id === "prod-mythological-palace-painting")
      : slug === "royal-heritage-handcrafted-pipili-applique-wall-hanging" || slug === "royal-heritage-pipili-applique-wall-hanging" || slug === "pipili-applique-wall-hanging" || slug === "pipili-chandua-wall-hanging"
      ? PRODUCTS.find((p) => p.id === "prod-pipili-applique-wall-hanging")
      : slug === "sambalpur-heritage-handcrafted-terracotta-lantern" || slug === "sambalpur-terracotta-lantern"
      ? PRODUCTS.find((p) => p.id === "prod-sambalpur-terracotta-lantern")
      : slug === "balasore-heritage-handcrafted-terracotta-horse-pair" || slug === "balasore-terracotta-horse-pair"
      ? PRODUCTS.find((p) => p.id === "prod-balasore-terracotta-horses")
      : slug === "divine-expressions-kali-tiger-papier-mache-mask-set" || slug === "divine-expressions-handcrafted-traditional-mask-pair" || slug === "papier-mache-mask-set"
      ? PRODUCTS.find((p) => p.id === "prod-papier-mache-mask-set")
      : slug === "royal-heritage-hand-painted-wooden-elephant-pair" || slug === "royal-heritage-hand-painted-elephant-pair"
      ? PRODUCTS.find((p) => p.id === "prod-bargarh-wooden-elephant-pair")
      : slug === "royal-procession-handcrafted-dhokra-elephant-sculpture" || slug === "royal-procession-handcrafted-dhokra-brass-elephant"
      ? PRODUCTS.find((p) => p.id === "prod-sadeibareni-dhokra-elephant")
      : slug === "tribal-rhythms-handcrafted-dhokra-musician-sculpture" || slug === "tribal-rhythms-dhokra-musician"
      ? PRODUCTS.find((p) => p.id === "prod-sadeibareni-dhokra-musician")
      : slug === "modern-ethnic-ceramic-vase-ivory-minimalist-edition" || slug === "modern-ethnic-ceramic-vase-terracotta-vase" || slug === "modern-ethnic-ceramic-vase" || slug === "modern-ethnic-ceramic-vase-terracotta"
      ? PRODUCTS.find((p) => p.id === "prod-vase")
      : slug === "sacred-srinathji-gold-leaf-pichwai-miniature-painting" || slug === "sacred-srinathji-gold-leaf-pichwai" || slug === "sacred-srinathji-pichwai"
      ? PRODUCTS.find((p) => p.id === "prod-pichwai")
      : undefined);
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
      <ExploreShowcase productSlug={resolvedParams.slug} key={resolvedParams.slug} />
    </Suspense>
  );
}

