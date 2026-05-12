import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Help & FAQ",
  description:
    "Answers to common PowerNetPro questions — how digital solar credits work, eligibility, supported utilities, billing, and refunds.",
  path: "/help",
  keywords: [
    "PowerNetPro help",
    "digital solar FAQ",
    "solar credits questions",
    "PowerNetPro support",
  ],
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([{ name: "Help", path: "/help" }]);

export default function HelpLayout({ children }: { children: React.ReactNode }) {
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
