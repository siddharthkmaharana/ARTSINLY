import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";

/**
 * GET /api/wishlist - Get product IDs in wishlist for logged-in user
 */
export async function GET(req: NextRequest) {
  try {
    const token =
      req.cookies.get("artsinly_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ wishlist: [] });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ wishlist: [] });
    }

    const items = await prisma.wishlistItem.findMany({
      where: { userId: payload.userId },
      select: { productId: true },
    });

    return NextResponse.json({
      wishlist: items.map((i) => i.productId),
    });
  } catch (error: any) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json({ wishlist: [] });
  }
}

/**
 * POST /api/wishlist - Toggle product in wishlist
 */
export async function POST(req: NextRequest) {
  try {
    const token =
      req.cookies.get("artsinly_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: payload.userId,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ inWishlist: false });
    } else {
      await prisma.wishlistItem.create({
        data: {
          userId: payload.userId,
          productId,
        },
      });
      return NextResponse.json({ inWishlist: true });
    }
  } catch (error: any) {
    console.error("Wishlist toggle error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update wishlist" },
      { status: 500 }
    );
  }
}
