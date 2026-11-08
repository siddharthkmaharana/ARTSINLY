import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  getFallbackUserByEmail,
  withDbTimeout,
} from "@/lib/auth-store";

export async function POST(req: NextRequest) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "127.0.0.1";
    const rl = checkRateLimit(ip, "auth");
    if (!rl.success) {
      return NextResponse.json(
        {
          error: "Too many requests. Please slow down and try again later.",
          code: "RATE_LIMIT_EXCEEDED",
          retryAfterSeconds: rl.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rl.retryAfterSeconds?.toString() || "60",
            "X-RateLimit-Limit": rl.limit.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user: any = null;

    // 1. Try PostgreSQL via Prisma first if database is reachable
    try {
      const queryPromise = prisma.user.findUnique({
        where: { email: normalizedEmail },
        include: {
          sellerProfile: true,
        },
      });
      user = await withDbTimeout(queryPromise, 500);
    } catch (dbErr) {
      // Database offline or slow, fall back to resilient local store
    }

    // 2. If not found in DB or DB is offline, check the resilient local fallback store
    // (This includes built-in demo accounts and all registered accounts during dev)
    if (!user) {
      user = getFallbackUserByEmail(normalizedEmail);
    }

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar || null,
        sellerProfile: user.sellerProfile || null,
      },
      token,
    });

    response.cookies.set("artsinly_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Unable to log in. Please check your credentials and try again." },
      { status: 500 }
    );
  }
}
