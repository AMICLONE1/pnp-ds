import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact PowerNetPro",
  description:
    "Reach the PowerNetPro team for support, partnerships, hosting enquiries, and grievance redressal. Based in Pune, India.",
  path: "/contact",
  keywords: [
    "contact PowerNetPro",
    "solar support India",
    "PowerNetPro grievance officer",
  ],
});

const breadcrumbJsonLd = buildBreadcrumbJsonLd([{ name: "Contact", path: "/contact" }]);

export default function ContactLayout({ children }: { children: React.ReactNode }) {
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
