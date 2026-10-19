import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMIT_PROFILES } from "@/lib/rate-limit";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply rate limiting to API routes
  if (!pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Health checks bypass rate limiting to prevent false negatives from uptime pingers
  if (pathname === "/api/health") {
    return NextResponse.next();
  }

  // Extract client IP address
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip") || "127.0.0.1";

  // Select profile based on route sensitivity
  let profile: keyof typeof RATE_LIMIT_PROFILES = "api";
  if (pathname.startsWith("/api/auth")) {
    profile = "auth";
  } else if (pathname.startsWith("/api/orders") || pathname.startsWith("/api/payments")) {
    profile = "orders";
  } else if (pathname.startsWith("/api/upload")) {
    profile = "upload";
  }

  const rateLimit = checkRateLimit(ip, profile);

  // If rate limit exceeded, respond with 429 Too Many Requests
  if (!rateLimit.success) {
    return NextResponse.json(
      {
        error: "Too many requests. Please slow down and try again later.",
        code: "RATE_LIMIT_EXCEEDED",
        retryAfterSeconds: rateLimit.retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": rateLimit.retryAfterSeconds?.toString() || "60",
          "X-RateLimit-Limit": rateLimit.limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": Math.floor(rateLimit.resetTime / 1000).toString(),
        },
      }
    );
  }

  // Attach rate limit and security headers to response
  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", rateLimit.limit.toString());
  response.headers.set("X-RateLimit-Remaining", rateLimit.remaining.toString());
  response.headers.set("X-RateLimit-Reset", Math.floor(rateLimit.resetTime / 1000).toString());

  // Security Headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
