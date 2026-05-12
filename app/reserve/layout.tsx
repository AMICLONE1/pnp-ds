import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Reserve Capacity",
  description: "Reserve solar capacity from a PowerNetPro community project.",
  path: "/reserve",
  noindex: true,
});

export default function ReserveLayout({ children }: { children: React.ReactNode }) {
  return children;
}
