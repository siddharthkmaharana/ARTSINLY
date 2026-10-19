import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const metric = await req.json();

    // In production, these metrics can be shipped to Datadog, Google Analytics, or Prometheus.
    // For local and dev environments, we acknowledge receipt cleanly.
    return NextResponse.json({
      received: true,
      metric: metric.name,
      rating: metric.rating,
    });
  } catch {
    return NextResponse.json({ received: false }, { status: 400 });
  }
}
