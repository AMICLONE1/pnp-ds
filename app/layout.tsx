import type { Metadata } from "next";
import { Inter, Space_Grotesk, Oswald, Open_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import { ToastProvider } from "@/components/ui/toast";
import CookieConsentBanner from "@/components/layout/CookieConsentBanner";
import { WebVitalsReporter } from "@/components/WebVitalsReporter";
import { SITE_URL, SITE_NAME, SITE_LEGAL_NAME } from "@/lib/seo";
import {
  SUPPORT_EMAIL,
  SUPPORT_PHONE_TEL,
  COMPANY_ADDRESS_LINE1,
  COMPANY_ADDRESS_LINE2,
  COMPANY_ADDRESS_CITY,
  COMPANY_ADDRESS_PIN,
  COMPANY_ADDRESS_STATE,
  COMPANY_ADDRESS_COUNTRY,
} from "@/lib/contact";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// Hero headline + heading font. Preloaded by next/font so the LCP element
// (homepage H1) doesn't wait on a render-blocking Google Fonts <link>.
const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

// Body copy on the marketing site. Same reasoning — keep it off the
// render-blocking CSS @import chain.
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

// Used inline by several homepage sections via fontFamily: "Montserrat".
// Loading it through next/font keeps it self-hosted + preloaded.
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PowerNetPro — Digital Solar for Indian Households",
    template: "%s | PowerNetPro",
  },
  description:
    "Reserve solar capacity from community projects across India. No installation, no rooftop required — credits are applied directly to your electricity bill.",
  keywords: [
    "digital solar",
    "solar energy India",
    "solar credits",
    "community solar",
    "rooftop alternative",
    "electricity bill savings",
    "renewable energy India",
    "solar for renters",
    "solar for apartments",
    "PowerNetPro",
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_LEGAL_NAME, url: SITE_URL }],
  creator: SITE_LEGAL_NAME,
  publisher: SITE_LEGAL_NAME,
  category: "energy",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "PowerNetPro Blog" }],
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "PowerNetPro — Save on Electricity Bills with Digital Solar",
    description:
      "Reserve solar capacity from community projects. No installation required. Credits flow straight to your electricity bill.",
    // OG image is supplied by app/opengraph-image.tsx (Next.js file
    // convention) — do not duplicate the images array here.
  },
  twitter: {
    card: "summary_large_image",
    title: "PowerNetPro — Digital Solar Platform",
    description:
      "No installation required. Reserve solar capacity, save on electricity.",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // TODO(seo): paste the Google Search Console verification token here once
  // the property is added at https://search.google.com/search-console. Use
  // the "HTML tag" verification method — copy the content="..." value below.
  // Without this, we have no visibility into how Google indexes the site.
  // verification: {
  //   google: "REPLACE_WITH_SEARCH_CONSOLE_TOKEN",
  // },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_LEGAL_NAME,
  alternateName: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  email: SUPPORT_EMAIL,
  telephone: SUPPORT_PHONE_TEL,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${COMPANY_ADDRESS_LINE1}, ${COMPANY_ADDRESS_LINE2}`,
    addressLocality: COMPANY_ADDRESS_CITY,
    postalCode: COMPANY_ADDRESS_PIN,
    addressRegion: COMPANY_ADDRESS_STATE,
    addressCountry: COMPANY_ADDRESS_COUNTRY,
  },
  areaServed: "IN",
  sameAs: [] as string[],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "en-IN",
  publisher: {
    "@type": "Organization",
    name: SITE_LEGAL_NAME,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="smooth-scroll" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0D2818" />
        {/* Fonts are self-hosted via next/font — no Google Fonts preconnect needed. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${oswald.variable} ${openSans.variable} ${montserrat.variable}`}>
        <LoadingProvider>
          <ToastProvider>
            <ErrorBoundary>
              {children}
              <CookieConsentBanner />
              <WebVitalsReporter />
            </ErrorBoundary>
          </ToastProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}

