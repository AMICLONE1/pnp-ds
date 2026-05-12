import { NextResponse } from "next/server";
import { SITE_URL, SITE_NAME, SITE_LEGAL_NAME } from "@/lib/seo";
import { blogData } from "@/lib/utils/data";
import { SUPPORT_EMAIL } from "@/lib/contact";

// Same defensive parser as app/sitemap.ts — blog dates are human strings.
function parseBlogDate(raw: unknown): Date {
  if (!raw || typeof raw !== "string") return new Date();
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  const monthYear = /^([A-Za-z]+)\s+(\d{4})$/.exec(raw.trim());
  if (monthYear) {
    const synthetic = new Date(`${monthYear[1]} 1, ${monthYear[2]}`);
    if (!Number.isNaN(synthetic.getTime())) return synthetic;
  }
  return new Date();
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const feedUrl = `${SITE_URL}/feed.xml`;
  const buildDate = new Date().toUTCString();

  const items = (blogData as any[])
    .slice()
    .sort(
      (a, b) =>
        parseBlogDate(b.date).getTime() - parseBlogDate(a.date).getTime()
    )
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const pubDate = parseBlogDate(post.date).toUTCString();
      const description = post.description || post.excerpt || "";
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(post.category || "")}</category>
      <description>${escapeXml(description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${SITE_NAME} Blog`)}</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>Practical solar stories, product updates, and savings guides from PowerNetPro.</description>
    <language>en-IN</language>
    <copyright>© ${new Date().getFullYear()} ${escapeXml(SITE_LEGAL_NAME)}</copyright>
    <managingEditor>${SUPPORT_EMAIL} (${escapeXml(SITE_NAME)})</managingEditor>
    <lastBuildDate>${buildDate}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

// Refresh the feed at most once an hour at the edge.
export const revalidate = 3600;
