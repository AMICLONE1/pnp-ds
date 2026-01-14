import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://powernetpro.com';
const SITE_NAME = 'PowerNetPro';
const SITE_DESCRIPTION = 'Reserve solar capacity from community projects. No installation required. Credits automatically applied to your bills.';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Digital Solar for Everyone`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'digital solar',
    'community solar',
    'solar energy',
    'electricity savings',
    'renewable energy',
    'solar credits',
    'India solar',
    'virtual solar',
    'solar power',
    'clean energy',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Digital Solar for Everyone`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Save on Electricity Bills`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Digital Solar Platform`,
    description: SITE_DESCRIPTION,
    images: ['/twitter-image.jpg'],
    creator: '@powernetpro',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

// Page-specific metadata generators
export const pageMetadata = {
  home: (): Metadata => ({
    title: 'Save ₹2,000/month on Electricity Bills | Digital Solar',
    description:
      'Access clean solar energy without installing panels. Reserve capacity from community solar projects and save up to ₹2,000/month. Join 1,000+ homeowners saving ₹50,000+ annually.',
    openGraph: {
      title: 'PowerNetPro - Save on Electricity Bills with Digital Solar',
      description: 'No installation required. Start saving on your electricity bills today.',
      url: SITE_URL,
    },
  }),

  reserve: (): Metadata => ({
    title: 'Reserve Solar Capacity - Browse Projects',
    description:
      'Browse available community solar projects across India. Reserve capacity from 1-100 kW with transparent pricing. Start saving on your electricity bills today.',
    openGraph: {
      title: 'Reserve Solar Capacity - PowerNetPro',
      description: 'Browse solar projects and reserve your capacity. No installation required.',
      url: `${SITE_URL}/reserve`,
    },
  }),

  dashboard: (): Metadata => ({
    title: 'Dashboard - Your Solar Journey',
    description:
      'Track your solar capacity, savings, and environmental impact. View real-time generation data and credit history.',
    robots: {
      index: false, // Don't index user dashboard
      follow: false,
    },
  }),

  login: (): Metadata => ({
    title: 'Login - Access Your Account',
    description: 'Login to your PowerNetPro account to manage your solar capacity and view savings.',
    robots: {
      index: false, // Don't index login page
      follow: true,
    },
  }),

  signup: (): Metadata => ({
    title: 'Sign Up - Start Saving Today',
    description:
      'Create your free PowerNetPro account and start saving on electricity bills. No credit card required. 5-minute setup.',
    openGraph: {
      title: 'Sign Up for PowerNetPro - Start Saving Today',
      description: 'Join 1,000+ users saving on electricity bills. Free signup, no credit card required.',
      url: `${SITE_URL}/signup`,
    },
  }),

  bills: (): Metadata => ({
    title: 'Bills & Credits - Track Your Savings',
    description: 'View your electricity bills and applied solar credits. Track your monthly savings and credit history.',
    robots: {
      index: false,
      follow: false,
    },
  }),

  connect: (): Metadata => ({
    title: 'Connect Utility - Link Your Provider',
    description:
      'Connect your utility provider to automatically apply solar credits to your bills. Supports major utilities across India.',
    robots: {
      index: false,
      follow: true,
    },
  }),

  help: (): Metadata => ({
    title: 'Help Center - FAQs & Support',
    description:
      'Get answers to common questions about digital solar, billing, and credits. Contact our support team for assistance.',
    openGraph: {
      title: 'PowerNetPro Help Center',
      description: 'Find answers to your questions about digital solar and community solar projects.',
      url: `${SITE_URL}/help`,
    },
  }),

  contact: (): Metadata => ({
    title: 'Contact Us - Get in Touch',
    description:
      'Have questions? Contact the PowerNetPro team. We\'re here to help you with your digital solar journey.',
    openGraph: {
      title: 'Contact PowerNetPro',
      description: 'Get in touch with our team for support and inquiries.',
      url: `${SITE_URL}/contact`,
    },
  }),

  settings: (): Metadata => ({
    title: 'Settings - Manage Your Account',
    description: 'Manage your account settings, notification preferences, and privacy options.',
    robots: {
      index: false,
      follow: false,
    },
  }),

  refund: (): Metadata => ({
    title: 'Refund Policy - Cancellation & Refunds',
    description:
      'Learn about our refund policy, cancellation process, and terms for solar capacity reservations.',
    openGraph: {
      title: 'PowerNetPro Refund Policy',
      description: 'Transparent refund and cancellation policy for solar capacity reservations.',
      url: `${SITE_URL}/refund`,
    },
  }),
};
