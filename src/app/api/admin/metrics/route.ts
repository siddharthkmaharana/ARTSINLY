import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

/**
 * GET /api/admin/metrics
 * Super Administrator platform overview metrics & compliance telemetry
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.authorized) {
      return auth.response!;
    }

    const [
      totalSellers,
      verifiedSellers,
      pendingSellers,
      totalProducts,
      publishedProducts,
      archivedProducts,
      totalOrders,
      ordersByStatus,
      completedPayments,
      refundedPayments,
      auditLogsCount,
    ] = await Promise.all([
      prisma.sellerProfile.count(),
      prisma.sellerProfile.count({ where: { isVerified: true } }),
      prisma.sellerProfile.count({ where: { isVerified: false } }),
      prisma.product.count(),
      prisma.product.count({ where: { status: "PUBLISHED" } }),
      prisma.product.count({ where: { status: "ARCHIVED" } }),
      prisma.order.count(),
      prisma.order.groupBy({
        by: ["status"],
        _count: { id: true },
        _sum: { totalPaise: true },
      }),
      prisma.payment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amountPaise: true },
        _count: { id: true },
      }),
      prisma.payment.aggregate({
        where: { status: "REFUNDED" },
        _sum: { amountPaise: true },
        _count: { id: true },
      }),
      prisma.auditLog.count(),
    ]);

    const grossRevenuePaise = completedPayments._sum.amountPaise || 0;
    const totalRefundedPaise = refundedPayments._sum.amountPaise || 0;

    return NextResponse.json({
      success: true,
      metrics: {
        sellers: {
          total: totalSellers,
          verified: verifiedSellers,
          pendingReview: pendingSellers,
          complianceRate: totalSellers > 0 ? Math.round((verifiedSellers / totalSellers) * 100) : 100,
        },
        products: {
          total: totalProducts,
          published: publishedProducts,
          archived: archivedProducts,
        },
        orders: {
          total: totalOrders,
          breakdown: ordersByStatus.reduce((acc, curr) => {
            acc[curr.status] = {
              count: curr._count.id,
              totalPaise: curr._sum.totalPaise || 0,
            };
            return acc;
          }, {} as Record<string, { count: number; totalPaise: number }>),
        },
        financials: {
          grossRevenuePaise,
          totalRefundedPaise,
          netRevenuePaise: Math.max(0, grossRevenuePaise - totalRefundedPaise),
          completedTransactions: completedPayments._count.id,
          refundedTransactions: refundedPayments._count.id,
        },
        auditLogsCount,
      },
    });
  } catch (error: any) {
    console.error("Admin metrics GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load admin metrics" },
      { status: 500 }
    );
  }
}
