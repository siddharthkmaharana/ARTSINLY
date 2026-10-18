import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

/**
 * GET /api/admin/sellers
 * List all seller profiles with verification status and cluster information
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // "pending", "verified", or undefined (all)

    const where: any = {};
    if (filter === "pending") where.isVerified = false;
    if (filter === "verified") where.isVerified = true;

    const sellers = await prisma.sellerProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
          },
        },
        products: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const mapped = sellers.map((s) => ({
      id: s.id,
      userId: s.userId,
      shopName: s.shopName,
      artisanName: s.artisanName,
      craftTradition: s.craftTradition,
      state: s.state,
      locality: s.locality,
      giCode: s.giCode,
      isVerified: s.isVerified,
      yearsOfExperience: s.yearsOfExperience,
      bio: s.bio,
      avatarUrl: s.avatarUrl,
      createdAt: s.createdAt,
      user: s.user,
      productCount: s.products.length,
      publishedProductCount: s.products.filter((p) => p.status === "PUBLISHED").length,
    }));

    return NextResponse.json({ success: true, sellers: mapped });
  } catch (error: any) {
    console.error("Admin sellers GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load seller verification queue" },
      { status: 500 }
    );
  }
}
