import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Block auth-gated and transactional routes from search engines. There is no
// SEO value in indexing /dashboard or /admin, and indexing /payment/return
// risks crawlers landing on payment-callback URLs.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/admin/",
          "/host",
          "/host/",
          "/dashboard",
          "/bills",
          "/settings",
          "/login",
          "/forgot-password",
          "/reset-password",
          "/payment/",
          "/reserve/payment",
          "/reserve/success",
          "/connect",
          "/connect/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
