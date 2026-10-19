import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { createDatabaseBackup, listDatabaseBackups } from "@/lib/backup";

/**
 * GET /api/admin/backups - List database backup snapshots
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const backups = listDatabaseBackups();
    return NextResponse.json({ success: true, backups });
  } catch (error: any) {
    console.error("Admin backups GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to list backups" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/backups - Trigger manual point-in-time database snapshot
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const backup = await createDatabaseBackup(auth.user?.id);
    return NextResponse.json({
      success: true,
      backup,
      message: `Database backup "${backup.filename}" created successfully (${backup.totalRecords} total records).`,
    });
  } catch (error: any) {
    console.error("Admin backup trigger error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate database backup" },
      { status: 500 }
    );
  }
}
