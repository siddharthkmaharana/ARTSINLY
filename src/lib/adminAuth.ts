import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";

export interface AdminAuthResult {
  authorized: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
    name?: string | null;
  };
  response?: NextResponse;
}

/**
 * Validates that the incoming request is from an authenticated Administrator.
 * Returns 401 if unauthenticated, 403 if authenticated user is not ADMIN.
 */
export async function requireAdmin(req: NextRequest): Promise<AdminAuthResult> {
  const token =
    req.cookies.get("artsinly_token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Authentication required. Please log in as an administrator." },
        { status: 401 }
      ),
    };
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Invalid or expired session token." },
        { status: 401 }
      ),
    };
  }

  // Verify user still exists in database and has ADMIN role
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
    },
  });

  if (!user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "User account not found." },
        { status: 401 }
      ),
    };
  }

  if (user.role !== "ADMIN") {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          error: "Forbidden. Administrative privileges required.",
          requiredRole: "ADMIN",
          currentRole: user.role,
        },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    user,
  };
}
