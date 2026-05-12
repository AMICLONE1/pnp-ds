import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Grievance Redressal Policy",
  description:
    "Raise a complaint with PowerNetPro. Grievance officer details, escalation matrix, and resolution timelines.",
  path: "/grievance",
});

export default function GrievanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
