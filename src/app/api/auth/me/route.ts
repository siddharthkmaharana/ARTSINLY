import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";

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
      user = await prisma.user.findUnique({
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
      });
    } catch {
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
                artisanName: "Devendra Kumbhar",
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
