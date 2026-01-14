# Quick Wins Implementation - Setup Guide

This guide will help you configure the 5 quick wins that have been implemented:

1. ✅ SEO Metadata & Structured Data
2. ✅ Sitemap & Robots.txt
3. ✅ Toast Notifications (Sonner)
4. ✅ Google Analytics (GA4)
5. ✅ Sentry Error Tracking

---

## 1. SEO Metadata & Structured Data ✅

### What was added:
- Enhanced metadata in [app/layout.tsx](../app/layout.tsx)
- Page-specific metadata utilities in [lib/metadata.ts](../lib/metadata.ts)
- Structured data component in [components/seo/StructuredData.tsx](../components/seo/StructuredData.tsx)
- Sitemap at [app/sitemap.ts](../app/sitemap.ts)
- Robots.txt at [app/robots.ts](../app/robots.ts)

### Setup Required:
1. **Update Google Site Verification**
   ```typescript
   // In app/layout.tsx line 89
   verification: {
     google: "your-google-site-verification-code-here",
   }
   ```

2. **Add Social Media URLs**
   ```typescript
   // In components/seo/StructuredData.tsx
   sameAs: [
     'https://twitter.com/powernetpro',      // Update with actual URLs
     'https://linkedin.com/company/powernetpro',
     'https://facebook.com/powernetpro',
   ],
   ```

3. **Create OG Images**
   - Create `/public/og-image.jpg` (1200x630px)
   - Create `/public/twitter-image.jpg` (1200x630px)
   - Create `/public/apple-touch-icon.png` (180x180px)

4. **Test Your SEO**
   - Test with [Google Rich Results Test](https://search.google.com/test/rich-results)
   - Test with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - Test with [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### Expected Results:
- Rich snippets in Google search results
- Proper social media previews
- Better search ranking
- Sitemap accessible at `/sitemap.xml`
- Robots.txt accessible at `/robots.txt`

---

## 2. Toast Notifications (Sonner) ✅

### What was added:
- Sonner toast library installed
- Toaster component in [app/layout.tsx](../app/layout.tsx)
- Toast utilities in [lib/toast.ts](../lib/toast.ts)

### Setup Required:
**No additional setup needed!** Just use it.

### Usage Examples:

```typescript
import { toast } from '@/lib/toast';

// Success message
toast.success('Capacity reserved successfully!');

// Error message
toast.error('Payment failed. Please try again.');

// With description
toast.success('Reservation Complete', 'You will receive a confirmation email shortly.');

// Loading toast
const loadingId = toast.loading('Processing payment...');
// Later dismiss it
toast.dismiss(loadingId);

// Promise-based (automatic state management)
toast.promise(
  createReservation(),
  {
    loading: 'Creating reservation...',
    success: 'Reservation created!',
    error: 'Failed to create reservation'
  }
);

// With action button
toast.custom('Profile updated', {
  description: 'Your changes have been saved',
  action: {
    label: 'View Profile',
    onClick: () => router.push('/profile')
  }
});
```

### Where to Add Toasts:
1. **Login/Signup Success** - [app/login/page.tsx](../app/login/page.tsx)
2. **Reservation Success** - [app/reserve/payment/page.tsx](../app/reserve/payment/page.tsx)
3. **Form Validations** - Any form submission
4. **API Errors** - API route handlers
5. **Copy to Clipboard** - Share buttons

### Example Implementation:
```typescript
// In app/login/page.tsx
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  // Show loading toast
  const loadingId = toast.loading('Signing in...');

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.dismiss(loadingId);
      toast.error('Login failed', error.message);
      return;
    }

    toast.dismiss(loadingId);
    toast.success('Welcome back!');
    router.push('/dashboard');
  } catch (error) {
    toast.dismiss(loadingId);
    toast.error('An unexpected error occurred');
  }
};
```

---

## 3. Google Analytics (GA4) ✅

### What was added:
- Google Analytics script component in [components/analytics/GoogleAnalytics.tsx](../components/analytics/GoogleAnalytics.tsx)
- Analytics utilities in [lib/analytics/gtag.ts](../lib/analytics/gtag.ts)
- Added to layout in [app/layout.tsx](../app/layout.tsx)

### Setup Required:

1. **Create GA4 Property**
   - Go to [Google Analytics](https://analytics.google.com)
   - Create a new GA4 property
   - Get your Measurement ID (format: G-XXXXXXXXXX)

2. **Add to Environment Variables**
   ```bash
   # .env.local
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **Deploy to Production**
   - Analytics only works in production (`NODE_ENV=production`)
   - Test locally with: `npm run build && npm start`

### Usage Examples:

```typescript
import { trackEvent } from '@/lib/analytics/gtag';

// Track user signup
trackEvent.signup('email');

// Track project view
trackEvent.viewProject('Mumbai Solar Farm');

// Track capacity selection
trackEvent.selectCapacity(5); // 5 kW

// Track checkout initiation
trackEvent.initiateCheckout('Mumbai Solar Farm', 5, 375000);

// Track successful reservation
trackEvent.completeReservation('Mumbai Solar Farm', 5, 375000);

// Track utility connection
trackEvent.connectUtility('MSEDCL');

// Track CTA clicks
trackEvent.clickCTA('hero', 'Get Started Free');

// Track FAQ search
trackEvent.searchFAQ('how much can I save');
```

### Where to Add Tracking:
1. **Signup/Login** - Authentication pages
2. **Project Selection** - Reserve page
3. **Payment Success** - Success page
4. **CTA Clicks** - All call-to-action buttons
5. **Form Submissions** - Contact, support forms

### Example Implementation:
```typescript
// In app/reserve/page.tsx
import { trackEvent } from '@/lib/analytics/gtag';

function ProjectCard({ project }: Props) {
  const handleViewProject = () => {
    trackEvent.viewProject(project.name);
    router.push(`/reserve/${project.id}`);
  };

  return (
    <button onClick={handleViewProject}>
      View Project
    </button>
  );
}
```

### Verify Setup:
1. Run `npm run build && npm start`
2. Open Chrome DevTools → Network tab
3. Look for requests to `google-analytics.com`
4. Check Real-time reports in GA dashboard

---

## 4. Sentry Error Tracking ✅

### What was added:
- Sentry SDK installed (`@sentry/nextjs`)
- Client config in [sentry.client.config.ts](../sentry.client.config.ts)
- Server config in [sentry.server.config.ts](../sentry.server.config.ts)
- Edge config in [sentry.edge.config.ts](../sentry.edge.config.ts)
- Sentry utilities in [lib/monitoring/sentry.ts](../lib/monitoring/sentry.ts)
- Updated Next.js config in [next.config.mjs](../next.config.mjs)

### Setup Required:

1. **Create Sentry Account**
   - Go to [sentry.io](https://sentry.io)
   - Create a free account
   - Create a new project (select Next.js)

2. **Get Your DSN**
   - Copy your DSN from project settings
   - Format: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`

3. **Add to Environment Variables**
   ```bash
   # .env.local
   NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
   SENTRY_ORG=your-org-slug
   SENTRY_PROJECT=powernetpro-ds
   SENTRY_AUTH_TOKEN=your-auth-token  # For source maps (optional)
   ```

4. **Deploy to Production**
   - Sentry only sends errors in production
   - Test locally with: `npm run build && npm start`

### Usage Examples:

```typescript
import { captureError, captureMessage, setUserContext } from '@/lib/monitoring/sentry';

// Capture errors with context
try {
  await createReservation(projectId, capacity);
} catch (error) {
  captureError(error, {
    userId: user.id,
    projectId,
    capacity,
    action: 'create_reservation',
  });
  toast.error('Failed to create reservation');
}

// Capture messages
captureMessage('User completed onboarding', 'info', { userId: user.id });

// Set user context (after login)
setUserContext({
  id: user.id,
  email: user.email,
  name: user.full_name,
});

// Clear user context (after logout)
clearUserContext();

// Add breadcrumbs for debugging
addBreadcrumb('User clicked reserve button', 'navigation', 'info', {
  projectId: project.id,
});
```

### Where to Add Error Tracking:
1. **API Routes** - Wrap all API handlers
2. **Form Submissions** - Catch validation/submission errors
3. **Payment Flows** - Track payment failures
4. **Authentication** - Track login/signup errors
5. **Data Fetching** - Track database query errors

### Example Implementation:
```typescript
// In app/api/allocations/route.ts
import { captureError } from '@/lib/monitoring/sentry';

export async function POST(request: Request) {
  try {
    const { projectId, capacity } = await request.json();

    // Create allocation
    const { data, error } = await supabase
      .from('allocations')
      .insert({ project_id: projectId, capacity_kw: capacity });

    if (error) throw error;

    return Response.json({ data });
  } catch (error) {
    // Capture error with context
    captureError(error, {
      endpoint: '/api/allocations',
      method: 'POST',
      projectId,
      capacity,
    });

    return Response.json(
      { error: 'Failed to create allocation' },
      { status: 500 }
    );
  }
}
```

### Verify Setup:
1. Run `npm run build && npm start`
2. Trigger an error intentionally
3. Check Sentry dashboard for the error
4. View error details, stack trace, and context

---

## 5. Overall Configuration ✅

### Environment Variables Setup

Create or update your `.env.local` file:

```bash
# Supabase Configuration (Already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay Payment Gateway (Already configured)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# Site Configuration (Already configured)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# NEW: Google Analytics (GA4)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# NEW: Sentry Error Tracking
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=powernetpro-ds
SENTRY_AUTH_TOKEN=your-auth-token
```

### Production Environment Variables

For Vercel deployment, add these environment variables:

1. Go to Vercel Project Settings → Environment Variables
2. Add all the above variables
3. Make sure `NODE_ENV=production` is set
4. Redeploy your app

---

## Testing Checklist

### Local Testing
- [ ] Run `npm run dev` - Everything should work
- [ ] Toast notifications appear when triggered
- [ ] Console shows no errors

### Build Testing
```bash
npm run build
npm start
```
- [ ] Build completes without errors
- [ ] GA tracking fires (check Network tab)
- [ ] Sentry captures errors (trigger one intentionally)
- [ ] Toast notifications work
- [ ] Sitemap accessible at http://localhost:3000/sitemap.xml
- [ ] Robots.txt accessible at http://localhost:3000/robots.txt

### Production Testing
After deployment:
- [ ] Check Google Search Console for sitemap
- [ ] Verify GA Real-time reports show traffic
- [ ] Test error tracking in Sentry dashboard
- [ ] Test social media previews
- [ ] Verify structured data with Rich Results Test

---

## Expected Impact

### Immediate Benefits:
1. **SEO** → Better search rankings, rich snippets
2. **User Experience** → Clear feedback with toasts
3. **Analytics** → Track user behavior and conversions
4. **Error Tracking** → Catch and fix bugs quickly
5. **Discoverability** → Proper sitemap and metadata

### Metrics to Track:
- Organic search traffic (Google Analytics)
- Conversion rate (signup → reservation)
- Error rate (Sentry)
- User engagement (session duration, pages per session)
- Search ranking (Google Search Console)

---

## Troubleshooting

### Toast Notifications Not Showing
- Check that Toaster is in layout.tsx
- Verify sonner is installed: `npm list sonner`
- Check browser console for errors

### Google Analytics Not Tracking
- Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
- Check that `NODE_ENV=production`
- Open Network tab and look for `gtag` requests
- Verify in GA Real-time reports (takes 1-2 minutes)

### Sentry Not Capturing Errors
- Verify `NEXT_PUBLIC_SENTRY_DSN` is set
- Check that `NODE_ENV=production`
- Trigger an error intentionally and check Sentry dashboard
- Check browser console for Sentry initialization

### Sitemap Not Accessible
- Run `npm run build` to regenerate
- Check `app/sitemap.ts` exists
- Verify Next.js version is 13+

---

## Next Steps

After completing these quick wins, consider implementing:

1. **Performance Optimizations** (Week 1-2)
   - Dynamic imports for heavy components
   - Image optimization
   - Bundle size reduction

2. **Testing Suite** (Week 3-4)
   - Jest setup
   - Component tests
   - E2E tests with Playwright

3. **UI/UX Enhancements** (Week 5-6)
   - Mobile navigation
   - Interactive charts
   - Better loading states

See [PERFORMANCE_UX_IMPROVEMENT_PLAN_2026.md](./PERFORMANCE_UX_IMPROVEMENT_PLAN_2026.md) for the complete roadmap.

---

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the official documentation:
   - [Sonner Docs](https://sonner.emilkowal.ski/)
   - [Google Analytics Docs](https://developers.google.com/analytics)
   - [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
3. Check the GitHub repository for issues
4. Contact the development team

---

**Last Updated:** January 14, 2026
**Status:** Ready for Implementation
**Estimated Setup Time:** 1-2 hours
