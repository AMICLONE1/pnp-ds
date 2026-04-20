import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import { ToastProvider } from "@/components/ui/toast";
import CookieConsentBanner from "@/components/layout/CookieConsentBanner";

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
  title: "PowerNetPro - Digital Solar Platform for Indian Households",
  description: "Reserve solar capacity from community projects. No installation required. Credits automatically applied to your electricity bills.",
  keywords: ["solar energy", "digital solar", "electricity savings", "renewable energy", "solar credits", "community solar"],
  authors: [{ name: "PowerNetPro" }],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "PowerNetPro - Save on Electricity Bills with Digital Solar",
    description: "No installation required. Start saving on your electricity bills today.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PowerNetPro - Digital Solar Platform",
    description: "Start saving on your electricity bills today. No installation required.",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <LoadingProvider>
          <ToastProvider>
            <ErrorBoundary>
              {children}
              <CookieConsentBanner />
            </ErrorBoundary>
          </ToastProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}

