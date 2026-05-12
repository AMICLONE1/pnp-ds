import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Service Delivery Policy",
  description:
    "How PowerNetPro delivers digital solar services to subscribers and hosts — onboarding, generation, and billing timelines.",
  path: "/service-delivery",
});

export default function ServiceDeliveryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
