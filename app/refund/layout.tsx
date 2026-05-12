import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Refund & Cancellation Policy",
  description:
    "PowerNetPro's refund and cancellation policy for reservations, host onboarding, and platform charges.",
  path: "/refund",
});

export default function RefundLayout({ children }: { children: React.ReactNode }) {
  return children;
}
