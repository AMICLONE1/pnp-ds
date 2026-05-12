import type { Metadata } from "next";
import {
  buildMetadata,
  buildBreadcrumbJsonLd,
  SITE_URL,
  SITE_LEGAL_NAME,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Host a Solar Plant",
  description:
    "Turn your rooftop, factory shed, or warehouse into a commercial solar plant with PowerNetPro. Cut your power bill in half, no upfront capex.",
  path: "/host-landing",
  keywords: [
    "solar host India",
    "commercial solar plant",
    "rooftop solar for business",
    "industrial solar India",
    "factory rooftop solar",
    "PowerNetPro host",
  ],
});

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Commercial solar plant hosting",
  provider: {
    "@type": "Organization",
    name: SITE_LEGAL_NAME,
    url: SITE_URL,
  },
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  audience: {
    "@type": "BusinessAudience",
    audienceType:
      "Commercial property owners, factories, warehouses, housing societies",
  },
  description:
    "Install a managed commercial solar plant on your rooftop or land with zero capex. PowerNetPro funds, installs, and operates the plant; the host consumes generated electricity at a discounted rate.",
  url: `${SITE_URL}/host-landing`,
  offers: {
    "@type": "Offer",
    description: "Zero-capex commercial solar hosting",
    priceCurrency: "INR",
    price: "0",
    availability: "https://schema.org/InStock",
    areaServed: "IN",
  },
};

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Host a Solar Plant", path: "/host-landing" },
]);

export default function HostLandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
