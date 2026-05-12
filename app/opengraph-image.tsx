import { ImageResponse } from "next/og";

// Default Open Graph image, generated at build time from the existing brand
// palette. Until we have a designed 1200×630 PNG, this gives every shared
// link a consistent, on-brand preview instead of a blank thumbnail. Drop a
// real PNG at /public/og-default.png and swap the metadata reference in
// lib/seo.ts to replace this.

export const runtime = "edge";
export const alt = "PowerNetPro — Digital Solar for India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0D2818 0%, #1a4d2e 55%, #0D2818 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background:
                "linear-gradient(135deg, #D4A03A 0%, #E8C468 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
            }}
          >
            ☀
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            PowerNetPro
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              maxWidth: 980,
            }}
          >
            Digital Solar for every Indian home.
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: "#E8C468",
              maxWidth: 900,
            }}
          >
            Reserve solar capacity. No installation. Credits on your bill.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <div>powernetpro.com</div>
          <div>Made in Bharat</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
