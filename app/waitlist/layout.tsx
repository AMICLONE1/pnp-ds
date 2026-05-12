import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Join the Waitlist",
  description:
    "Be the first to know when PowerNetPro opens reservations in your city. Join the waitlist for India's digital solar platform.",
  path: "/waitlist",
  keywords: ["solar waitlist India", "digital solar early access", "PowerNetPro waitlist"],
});

export default function WaitlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
