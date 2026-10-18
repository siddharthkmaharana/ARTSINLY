import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getAuditLogs } from "@/lib/db/audit";

/**
 * GET /api/admin/audit-logs
 * Retrieves paginated audit trail of administrative and financial operations
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const action = searchParams.get("action") || undefined;
    const userId = searchParams.get("userId") || undefined;

    const data = await getAuditLogs({ limit, offset, action, userId });

    return NextResponse.json({
      success: true,
      logs: data.logs,
      total: data.total,
      limit: data.limit,
      offset: data.offset,
    });
  } catch (error: any) {
    console.error("Admin audit logs GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load audit logs" },
      { status: 500 }
    );
  }
}
