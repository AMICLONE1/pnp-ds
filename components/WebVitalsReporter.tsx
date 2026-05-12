"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Reports Core Web Vitals to the browser console in development and to
 * `/api/web-vitals` in production. Mount this once near the root of the
 * tree. Reports include FCP, LCP, INP, CLS, TTFB, and FID.
 *
 * Why this exists: Search Console only shows field data after weeks of
 * traffic. Reporting from the client gives a same-day signal on whether
 * a perf change actually moved the needle.
 */
export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("[web-vitals]", metric.name, Math.round(metric.value), metric);
      return;
    }

    // Use sendBeacon so the request doesn't block page unload. Fall back to
    // fetch with keepalive for browsers without sendBeacon.
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      navigationType: metric.navigationType,
      path:
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "",
    });

    try {
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon("/api/web-vitals", body);
      } else {
        fetch("/api/web-vitals", {
          body,
          method: "POST",
          keepalive: true,
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch {
      // Telemetry failures must never affect the page.
    }
  });

  return null;
}
