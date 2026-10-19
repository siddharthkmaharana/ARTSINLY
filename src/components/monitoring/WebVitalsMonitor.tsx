"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitalsMonitor() {
  useReportWebVitals((metric) => {
    // Only log in non-production or send beacon if reporting endpoint configured
    if (process.env.NODE_ENV !== "production") {
      console.log(`⚡ [Web Vitals] ${metric.name}: ${Math.round(metric.value)}ms (${metric.rating})`);
    }

    // Optional beacon dispatch
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      try {
        const body = JSON.stringify({
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          id: metric.id,
          timestamp: Date.now(),
        });
        navigator.sendBeacon("/api/monitoring/vitals", body);
      } catch {
        // Silently swallow beacon failures
      }
    }
  });

  return null;
}
