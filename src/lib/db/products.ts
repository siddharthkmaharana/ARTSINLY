import { prisma } from "@/lib/prisma";
import { Product, ProductStatus, Prisma } from "@prisma/client";

export interface CreateProductInput {
  sellerId: string;
  categoryId: string;
  regionId?: string;
  title: string;
  slug: string;
  description: string;
  story?: string;
  craftType?: string;
  provenanceTag?: string;
  giCode?: string;
  dimensions?: string;
  materials?: string;
  careInstructions?: string;
  basePricePaise: number;
  isMadeToOrder?: boolean;
  leadTimeDays?: number;
  status?: ProductStatus;
  images?: { url: string; altText?: string; displayOrder?: number; isPrimary?: boolean }[];
  initialStock?: number;
}

export interface ProductFilterParams {
  categorySlug?: string;
  regionSlug?: string;
  status?: ProductStatus;
  search?: string;
  minPricePaise?: number;
  maxPricePaise?: number;
  sellerSlug?: string;
  page?: number;
  limit?: number;
}

/**
 * Query products with pagination, category/region filters, search, and variants
 */
export async function getProducts(params: ProductFilterParams = {}) {
  const {
    categorySlug,
    regionSlug,
    status = "PUBLISHED",
    search,
    minPricePaise,
    maxPricePaise,
    sellerSlug,
    page = 1,
    limit = 20,
  } = params;

  const where: Prisma.ProductWhereInput = {
    status,
    ...(categorySlug && { category: { slug: categorySlug } }),
    ...(regionSlug && { region: { slug: regionSlug } }),
    ...(sellerSlug && { seller: { slug: sellerSlug } }),
    ...(minPricePaise !== undefined || maxPricePaise !== undefined
      ? {
          basePricePaise: {
            ...(minPricePaise !== undefined && { gte: minPricePaise }),
            ...(maxPricePaise !== undefined && { lte: maxPricePaise }),
          },
        }
      : {}),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { craftType: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const skip = (page - 1) * limit;

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        images: {
          orderBy: { displayOrder: "asc" },
        },
        variants: {
          orderBy: { pricePaise: "asc" },
        },
        inventory: true,
        seller: {
          select: {
            id: true,
            shopName: true,
            slug: true,
            artisanName: true,
            craftTradition: true,
            locality: true,
            state: true,
            giCode: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
        category: true,
        region: true,
        _count: {
          select: { reviews: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}

/**
 * Fetch a single product by unique slug with complete relations
 */
export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { displayOrder: "asc" },
      },
      variants: {
        include: {
          inventory: true,
        },
        orderBy: { pricePaise: "asc" },
      },
      inventory: true,
      seller: {
        include: {
          user: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
      },
      category: true,
      region: true,
      reviews: {
        include: {
          buyer: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

/**
 * Create a new artisan craft product with initial inventory and images
 */
export async function createProduct(data: CreateProductInput): Promise<Product> {
  const { images, initialStock = 0, ...productData } = data;

  return prisma.$transaction(async (tx) => {
    // 1. Create the product
    const product = await tx.product.create({
      data: {
        ...productData,
        images: images && images.length > 0 ? { create: images } : undefined,
      },
    });

    // 2. Initialize inventory record
    await tx.inventory.create({
      data: {
        productId: product.id,
        quantity: initialStock,
      },
    });

    return product;
  });
}

/**
 * Update product information
 */
export async function updateProduct(
  id: string,
  data: Partial<CreateProductInput>
): Promise<Product> {
  const { images, initialStock, ...updateData } = data;

  return prisma.product.update({
    where: { id },
    data: updateData,
  });
}

/**
 * Soft delete or archive product
 */
export async function archiveProduct(id: string): Promise<Product> {
  return prisma.product.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });
}
