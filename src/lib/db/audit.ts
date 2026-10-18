import { prisma } from "@/lib/prisma";

export interface LogAuditParams {
  userId?: string;
  action: string;
  details?: Record<string, any>;
  ipAddress?: string;
}

/**
 * Creates an immutable audit log record in PostgreSQL.
 */
export async function logAuditEvent(params: LogAuditParams) {
  const { userId, action, details, ipAddress = "127.0.0.1" } = params;

  try {
    return await prisma.auditLog.create({
      data: {
        userId,
        action,
        details: details || {},
        ipAddress,
      },
    });
  } catch (err) {
    console.error("Failed to write audit log event:", err);
    return null;
  }
}

/**
 * Retrieves audit logs with user information and pagination.
 */
export async function getAuditLogs(params?: {
  limit?: number;
  offset?: number;
  action?: string;
  userId?: string;
}) {
  const limit = Math.min(params?.limit ?? 50, 100);
  const offset = params?.offset ?? 0;

  const where: any = {};
  if (params?.action) where.action = params.action;
  if (params?.userId) where.userId = params.userId;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { logs, total, limit, offset };
}
