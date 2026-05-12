// Server Component (no "use client") that emits homepage-scoped JSON-LD.
// Imported by the Client Component homepage (app/page.tsx). Because this
// is a Server Component, the <script> markup is serialized once on the
// server and reused on the client without re-rendering — no hydration
// mismatch with neighbouring Framer Motion components.

import { faqData } from "@/lib/utils/data";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqData.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

// Subscriber-facing reservation. Pricing source of truth lives in
// lib/contact.ts (RESERVATION_RATE_PER_KW) — keep in sync if it changes.
const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Digital Solar Reservation",
  description:
    "Reserve solar capacity from a community solar project. Credits are applied directly to your electricity bill. No installation, no rooftop required.",
  brand: {
    "@type": "Brand",
    name: "PowerNetPro",
  },
  category: "Renewable Energy / Solar",
  offers: {
    "@type": "Offer",
    priceCurrency: "INR",
    price: "50000",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      priceCurrency: "INR",
      price: "50000",
      unitText: "kW reserved capacity",
    },
    availability: "https://schema.org/PreOrder",
    areaServed: "IN",
  },
};

export function HomeJsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
    </>
  );
}
