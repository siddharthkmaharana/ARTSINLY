import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";
import {
  getFallbackUserById,
  getFallbackUserByEmail,
  withDbTimeout,
} from "@/lib/auth-store";

export async function GET(req: NextRequest) {
  try {
    const token =
      req.cookies.get("artsinly_token")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ user: null });
    }

    let user: any = null;
    try {
      user = await withDbTimeout(
        prisma.user.findUnique({
          where: { id: payload.userId },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            avatar: true,
            phone: true,
            sellerProfile: true,
          },
        }),
        500
      );
    } catch {
      // Database offline or unreachable, fall back to resilient local store
    }

    if (!user) {
      user =
        getFallbackUserById(payload.userId) ||
        getFallbackUserByEmail(payload.email);
    }

    if (!user) {
      user = {
        id: payload.userId,
        email: payload.email,
        name: payload.name || "Member",
        role: payload.role,
        avatar: null,
        phone: null,
        sellerProfile:
          payload.role === "SELLER"
            ? {
                id: "seller_devendra_01",
                shopName: "Devendra Terracotta Works",
                artisanName: payload.name || "Master Artisan",
              }
            : null,
      };
    }

    return NextResponse.json({ user: user || null });
  } catch (error: any) {
    console.error("Auth check error:", error);
    return NextResponse.json({ user: null });
  }
}
