import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_LEGAL_NAME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_LEGAL_NAME,
    short_name: SITE_NAME,
    description:
      "Reserve solar capacity from community projects. No installation required. Credits applied to your electricity bill.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0D2818",
    lang: "en-IN",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "32x32",
        type: "image/x-icon",
      },
    ],
  };
}
