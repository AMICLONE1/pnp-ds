import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://powernetpro.com'),
  title: {
    default: "PowerNetPro - Save ₹2,000/month on Electricity Bills | Digital Solar",
    template: "%s | PowerNetPro",
  },
  description: "Reserve solar capacity from community projects. No installation required. Credits automatically applied to your bills. Join 1,000+ homeowners saving ₹50,000+ annually.",
  keywords: [
    "digital solar",
    "community solar",
    "solar energy",
    "electricity savings",
    "renewable energy",
    "solar credits",
    "India solar",
    "virtual solar",
    "solar power",
    "clean energy",
    "MSEDCL solar",
    "BESCOM solar",
    "TNEB solar",
  ],
  authors: [{ name: "PowerNetPro" }],
  creator: "PowerNetPro",
  publisher: "PowerNetPro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://powernetpro.com',
    siteName: "PowerNetPro",
    title: "PowerNetPro - Save on Electricity Bills with Digital Solar",
    description: "No installation required. Start saving on your electricity bills today.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PowerNetPro - Digital Solar Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PowerNetPro - Digital Solar Platform",
    description: "Save ₹2,000/month on electricity bills. No installation required.",
    images: ["/twitter-image.jpg"],
    creator: "@powernetpro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code-here",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="smooth-scroll">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0D2818" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <GoogleAnalytics />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}

