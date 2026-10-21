import { NextRequest, NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/db/audit";
import { logger } from "@/lib/monitoring/logger";
import { generateGrievanceTicketId } from "@/lib/id";

/**
 * POST /api/grievance
 * Statutory Grievance Redressal Endpoint under Consumer Protection (E-Commerce) Rules, 2020
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      orderNumber,
      category = "ORDER_ISSUE",
      description,
    } = body;

    if (!fullName?.trim() || !email?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: "Full name, email address, and grievance description are required." },
        { status: 400 }
      );
    }

    // Generate statutory grievance ticket reference ID using cryptographically secure entropy
    const ticketId = generateGrievanceTicketId("GRV");

    await logAuditEvent({
      action: "CONSUMER_GRIEVANCE_REGISTERED",
      details: {
        ticketId,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone?.trim() || "Not provided",
        orderNumber: orderNumber?.trim() || "N/A",
        category,
        description: description.trim(),
        statutoryAcknowledgedWithinHours: 48,
        statutoryResolutionWindowDays: 30,
        registeredAt: new Date().toISOString(),
      },
    });

    logger.info("Statutory grievance registered", { ticketId, category, email });

    return NextResponse.json({
      success: true,
      ticketId,
      message: `Your grievance has been formally registered with ticket ID ${ticketId}. Our Nodal Grievance Officer will acknowledge this submission within 48 hours and resolve it within 30 days as mandated by Consumer Protection (E-Commerce) Rules, 2020.`,
      sla: {
        acknowledgementWithinHours: 48,
        resolutionDays: 30,
        officer: "Siddharth K. Maharana",
        designation: "Nodal Grievance Redressal Officer",
        email: "grievance@artsinly.com",
      },
    });
  } catch (error: any) {
    logger.error("Grievance submission error", { error: error.message });
    return NextResponse.json(
      { error: error.message || "Failed to register grievance" },
      { status: 500 }
    );
  }
}
