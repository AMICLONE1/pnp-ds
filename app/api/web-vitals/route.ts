import { NextRequest, NextResponse } from "next/server";

// Sink for client-reported Core Web Vitals. Right now this just logs to
// Vercel runtime logs — swap in your analytics provider (PostHog, Plausible
// custom event, Honeycomb, etc.) when one is wired up. Keep the route lean:
// the client uses navigator.sendBeacon, so there is no response to consume.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const { name, value, rating, id, path } = body as Record<string, unknown>;

    console.log("[web-vitals]", {
      name,
      value,
      rating,
      id,
      path,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
