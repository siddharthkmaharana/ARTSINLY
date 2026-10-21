import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";
import { generateSecureId } from "@/lib/id";

export async function GET(req: NextRequest) {
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

    const seller = await prisma.sellerProfile.findUnique({
      where: { userId: payload.userId },
      include: {
        user: {
          select: { id: true, email: true, name: true, avatar: true },
        },
        products: {
          include: {
            images: true,
            variants: true,
            inventory: true,
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({ profile: seller });
  } catch (error: any) {
    console.error("Seller profile GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load seller profile" },
      { status: 500 }
    );
  }
}

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
    const {
      shopName,
      artisanName,
      craftTradition,
      state,
      locality,
      giCode,
      yearsOfExperience = 0,
      bio,
      story,
      avatarUrl,
      bannerUrl,
    } = body;

    if (!shopName || !craftTradition || !state) {
      return NextResponse.json(
        { error: "Shop name, craft tradition, and state are required" },
        { status: 400 }
      );
    }

    const slug =
      shopName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      generateSecureId(undefined, 3);

    const profile = await prisma.$transaction(async (tx) => {
      // 1. Create or update profile
      const prof = await tx.sellerProfile.upsert({
        where: { userId: payload.userId },
        create: {
          userId: payload.userId,
          shopName,
          slug,
          artisanName: artisanName || payload.name || shopName,
          craftTradition,
          state,
          locality,
          giCode,
          yearsOfExperience: Number(yearsOfExperience) || 0,
          bio,
          story,
          avatarUrl,
          bannerUrl,
          isVerified: Boolean(giCode),
        },
        update: {
          shopName,
          artisanName: artisanName || payload.name || shopName,
          craftTradition,
          state,
          locality,
          giCode,
          yearsOfExperience: Number(yearsOfExperience) || 0,
          bio,
          story,
          avatarUrl: avatarUrl || undefined,
          bannerUrl: bannerUrl || undefined,
          isVerified: Boolean(giCode),
        },
      });

      // 2. Ensure user role is SELLER
      await tx.user.update({
        where: { id: payload.userId },
        data: { role: "SELLER" },
      });

      return prof;
    });

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error("Seller profile POST error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save seller profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}
