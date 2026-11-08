import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSessionToken } from "@/lib/auth";
import { Role } from "@prisma/client";
import {
  getFallbackUserByEmail,
  registerFallbackUser,
  withDbTimeout,
} from "@/lib/auth-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, role = "BUYER", phone } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userRole = role === "SELLER" ? Role.SELLER : Role.BUYER;

    let user: any = null;
    let dbAvailable = true;

    // 1. Attempt PostgreSQL via Prisma first (with fast timeout protection)
    try {
      const existing = await withDbTimeout(
        prisma.user.findUnique({
          where: { email: normalizedEmail },
        }),
        600
      );

      if (existing) {
        return NextResponse.json(
          { error: "An account with this email address already exists" },
          { status: 409 }
        );
      }

      // If user does not exist in DB, create new user in PostgreSQL
      const passwordHash = hashPassword(password);
      user = await withDbTimeout(
        prisma.user.create({
          data: {
            email: normalizedEmail,
            name: name?.trim() || normalizedEmail.split("@")[0],
            passwordHash,
            role: userRole,
            phone,
          },
          include: {
            sellerProfile: true,
          },
        }),
        1000
      );
    } catch (dbErr) {
      // PostgreSQL is offline or unreachable - fall back to resilient local store
      dbAvailable = false;
    }

    // 2. If database is offline, use resilient local auth store fallback
    if (!dbAvailable || !user) {
      const existingFallback = getFallbackUserByEmail(normalizedEmail);
      if (existingFallback) {
        return NextResponse.json(
          { error: "An account with this email address already exists" },
          { status: 409 }
        );
      }

      user = registerFallbackUser({
        email: normalizedEmail,
        password,
        name,
        role: userRole as "BUYER" | "SELLER",
        phone,
      });
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

    // Set HTTP-only session cookie
    response.cookies.set("artsinly_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Unable to complete registration. Please check your details and try again." },
      { status: 500 }
    );
  }
}
