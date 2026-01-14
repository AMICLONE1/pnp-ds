/**
 * Google Analytics 4 utilities
 *
 * Setup Instructions:
 * 1. Get your GA4 Measurement ID from Google Analytics
 * 2. Add NEXT_PUBLIC_GA_MEASUREMENT_ID to .env.local
 * 3. The tracking script will be loaded automatically in production
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Check if GA is enabled
export const isGAEnabled = () => {
  return GA_MEASUREMENT_ID && process.env.NODE_ENV === 'production';
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (!isGAEnabled()) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

type GTagEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GTagEvent) => {
  if (!isGAEnabled()) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Custom events for the application
export const trackEvent = {
  // User Actions
  signup: (method: string) => {
    event({
      action: 'sign_up',
      category: 'User',
      label: method,
    });
  },

  login: (method: string) => {
    event({
      action: 'login',
      category: 'User',
      label: method,
    });
  },

  // Reservation Flow
  viewProject: (projectName: string) => {
    event({
      action: 'view_project',
      category: 'Reservation',
      label: projectName,
    });
  },

  selectCapacity: (capacity: number) => {
    event({
      action: 'select_capacity',
      category: 'Reservation',
      label: `${capacity} kW`,
      value: capacity,
    });
  },

  initiateCheckout: (projectName: string, capacity: number, amount: number) => {
    event({
      action: 'begin_checkout',
      category: 'Ecommerce',
      label: projectName,
      value: amount,
    });
  },

  completeReservation: (projectName: string, capacity: number, amount: number) => {
    event({
      action: 'purchase',
      category: 'Ecommerce',
      label: projectName,
      value: amount,
    });
  },

  // Utility Connection
  connectUtility: (provider: string) => {
    event({
      action: 'connect_utility',
      category: 'Utility',
      label: provider,
    });
  },

  // Engagement
  scrollToSection: (section: string) => {
    event({
      action: 'scroll',
      category: 'Engagement',
      label: section,
    });
  },

  clickCTA: (location: string, ctaText: string) => {
    event({
      action: 'click_cta',
      category: 'Engagement',
      label: `${location} - ${ctaText}`,
    });
  },

  shareContent: (method: string, contentType: string) => {
    event({
      action: 'share',
      category: 'Engagement',
      label: `${method} - ${contentType}`,
    });
  },

  // Help & Support
  searchFAQ: (query: string) => {
    event({
      action: 'search',
      category: 'Help',
      label: query,
    });
  },

  contactSupport: (method: string) => {
    event({
      action: 'contact_support',
      category: 'Help',
      label: method,
    });
  },

  // Navigation
  clickNavItem: (item: string) => {
    event({
      action: 'nav_click',
      category: 'Navigation',
      label: item,
    });
  },
};

// Type declaration for gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: {
        page_path?: string;
        event_category?: string;
        event_label?: string;
        value?: number;
      }
    ) => void;
  }
}
