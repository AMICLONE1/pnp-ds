import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { blogData } from "@/lib/utils/data";

// Blog dates are stored as human strings like "March 2026" or "March 5, 2026".
// Parse defensively; fall back to today so search engines don't see invalid
// lastmod values (which they silently ignore, killing recrawl signals).
function parseBlogDate(raw: unknown): Date {
  if (!raw || typeof raw !== "string") return new Date();
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  // "March 2026" → parse as 1st of that month
  const monthYear = /^([A-Za-z]+)\s+(\d{4})$/.exec(raw.trim());
  if (monthYear) {
    const synthetic = new Date(`${monthYear[1]} 1, ${monthYear[2]}`);
    if (!Number.isNaN(synthetic.getTime())) return synthetic;
  }
  return new Date();
}

// Static, indexable public routes. Auth-gated routes (/dashboard, /host/**,
// /admin/**, /signup, /reserve while waitlist mode is on, /login, /settings,
// /bills, /payment/return) are deliberately excluded — they have no SEO
// value and we don't want crawlers landing on auth walls or payment flows.
const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/host-landing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/help", changeFrequency: "monthly", priority: 0.6 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/waitlist", changeFrequency: "monthly", priority: 0.6 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.3 },
  { path: "/refund", changeFrequency: "yearly", priority: 0.3 },
  { path: "/grievance", changeFrequency: "yearly", priority: 0.3 },
  { path: "/service-delivery", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path === "/" ? "" : route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const blogEntries: MetadataRoute.Sitemap = (blogData as any[]).map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: parseBlogDate(post.updatedAt || post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}
