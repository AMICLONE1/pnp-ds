import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";

// Refresh /blog and /blog/[slug] every hour. Blog content lives in source
// so this won't pick up new posts without a deploy, but it does refresh
// the rendered HTML cache, which matters for ETag/Last-Modified-based
// recrawl signals.
export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Stories, guides, and product updates from PowerNetPro — how digital solar works, how credits are applied, and how to save more on every electricity bill.",
  path: "/blog",
  keywords: [
    "digital solar blog",
    "solar energy guide India",
    "PowerNetPro updates",
    "rooftop solar alternative",
    "solar savings guide",
  ],
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([{ name: "Blog", path: "/blog" }]);

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
