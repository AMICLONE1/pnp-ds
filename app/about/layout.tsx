import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About PowerNetPro",
  description:
    "PowerNetPro is building India's digital solar layer — bringing rooftop-scale savings to renters, apartment dwellers, and anyone without roof rights.",
  path: "/about",
  keywords: [
    "about PowerNetPro",
    "digital solar company India",
    "Indian solar startup",
    "community solar India",
  ],
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([{ name: "About", path: "/about" }]);

export default function AboutLayout({ children }: { children: React.ReactNode }) {
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
