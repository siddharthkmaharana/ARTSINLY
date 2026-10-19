import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isCloudinaryConfigured, getActiveStorageProvider } from "@/lib/storage";

export const dynamic = "force-dynamic";

/**
 * GET /api/health
 * Comprehensive infrastructure, database, and system health check
 */
export async function GET(req: NextRequest) {
  const startTime = performance.now();

  let dbConnected = false;
  let dbLatencyMs = -1;
  let dbError: string | null = null;

  try {
    const dbStart = performance.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Math.round(performance.now() - dbStart);
    dbConnected = true;
  } catch (err: any) {
    dbError = err.message || "Database connection failed";
  }

  const memory = process.memoryUsage();
  const memoryUsageMb = {
    rss: Math.round((memory.rss / (1024 * 1024)) * 100) / 100,
    heapTotal: Math.round((memory.heapTotal / (1024 * 1024)) * 100) / 100,
    heapUsed: Math.round((memory.heapUsed / (1024 * 1024)) * 100) / 100,
  };

  const uptimeSeconds = Math.round(process.uptime());
  const totalDurationMs = Math.round(performance.now() - startTime);

  const status = dbConnected ? "healthy" : "degraded";
  const statusCode = dbConnected ? 200 : 503;

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      service: "artsinly-marketplace",
      version: "0.1.0",
      environment: process.env.NODE_ENV || "development",
      checks: {
        database: {
          connected: dbConnected,
          latencyMs: dbLatencyMs,
          error: dbError,
        },
        storage: {
          provider: getActiveStorageProvider(),
          cloudinaryConfigured: isCloudinaryConfigured(),
        },
        system: {
          uptimeSeconds,
          memoryMb: memoryUsageMb,
          nodeVersion: process.version,
        },
      },
      responseTimeMs: totalDurationMs,
    },
    {
      status: statusCode,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Health-Status": status,
      },
    }
  );
}
