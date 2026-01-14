# PowerNetPro Digital Solar Platform - Comprehensive Technical Requirements Document (TRD)

**Version:** 3.0
**Date:** January 14, 2026
**Author:** Technical Analysis & Architecture Review
**Status:** Production Analysis & Optimization Plan

---

## Executive Summary

PowerNetPro Digital Solar (PNP-DS) is a production-ready, enterprise-grade community solar platform that democratizes solar energy access across India. This platform enables users to reserve virtual solar capacity from community solar projects and receive automatic bill credits without physical panel installation.

**Current Status:**
- **Architecture Maturity:** Production-Ready (90% complete)
- **Technology Stack:** Next.js 14 (App Router), TypeScript, Supabase, React 18
- **UI/UX Quality:** Professional Grade with Advanced Animations
- **Security Level:** Enterprise (RLS, Rate Limiting, Input Sanitization)
- **Performance:** Optimized with Code Splitting & Lazy Loading

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Technology Stack](#2-technology-stack)
3. [Feature Specifications](#3-feature-specifications)
4. [Database Architecture](#4-database-architecture)
5. [API Specifications](#5-api-specifications)
6. [Security Architecture](#6-security-architecture)
7. [Performance Requirements](#7-performance-requirements)
8. [UI/UX Design System](#8-uiux-design-system)
9. [Animation & Interaction Framework](#9-animation--interaction-framework)
10. [Integration Points](#10-integration-points)
11. [Testing Strategy](#11-testing-strategy)
12. [Deployment Architecture](#12-deployment-architecture)
13. [Monitoring & Analytics](#13-monitoring--analytics)
14. [Scalability Considerations](#14-scalability-considerations)
15. [Future Roadmap](#15-future-roadmap)

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (Browser)                   │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  Next.js 14 │  │ React 18 SPA │  │  Framer Motion   │   │
│  │  App Router │  │  Components  │  │  Three.js (3D)   │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js API Routes (18 endpoints)                   │   │
│  │  - Authentication  - Projects  - Payments            │   │
│  │  - Allocations     - Credits   - Notifications       │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Middleware Layer                                     │   │
│  │  - Rate Limiting   - Auth Guard  - Session Mgmt      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                             │
                             │ PostgreSQL Protocol
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER (Supabase)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  PostgreSQL  │  │  Supabase    │  │  Row Level       │  │
│  │  Database    │  │  Auth        │  │  Security (RLS)  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  9 Core Tables + Triggers + Indexes                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                             │
                             │ External APIs
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   INTEGRATION LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Razorpay    │  │  BBPS (TBD)  │  │  Email (TBD)     │  │
│  │  Payments    │  │  Bill Fetch  │  │  Notifications   │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Request Flow

```
User Request → Next.js Middleware (Auth + Rate Limit)
            → API Route Handler (Business Logic)
            → Supabase Client (RLS Applied)
            → PostgreSQL Query Execution
            → Response Transformation
            → Client State Update (React Query)
            → UI Re-render (React + Framer Motion)
```

### 1.3 Component Architecture

**Folder Structure:**
```
app/                        # Next.js 14 App Router
├── api/                    # Backend API (18 endpoints)
├── (marketing)/            # Public pages (landing, about)
├── (auth)/                 # Auth pages (login, signup)
├── (dashboard)/            # Protected pages (dashboard, bills)
└── layout.tsx              # Root layout with providers

components/
├── features/               # Feature-specific components
│   ├── landing/           # 15 landing page sections
│   ├── dashboard/         # Dashboard widgets
│   ├── bills/             # Bill management
│   ├── notifications/     # Notification system
│   └── projects/          # Project components
├── layout/                # Header, Footer, Navigation
└── ui/                    # Reusable UI components
    ├── animations/        # 10 animation components
    └── base/              # Button, Card, Input, etc.

lib/                       # Utilities & Config
├── supabase/             # Database clients (server/client)
├── security/             # Rate limiting, sanitization
├── bbps/                 # Bill payment integration
└── utils/                # Helper functions

hooks/                    # Custom React hooks (5 hooks)
public/                   # Static assets
supabase/                 # Database schema & migrations
```

---

## 2. Technology Stack

### 2.1 Frontend Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Next.js | 14.2.5 | React meta-framework with App Router |
| **Language** | TypeScript | 5.5.4 | Type-safe development |
| **UI Library** | React | 18.3.1 | Component-based UI |
| **Styling** | Tailwind CSS | 3.4.7 | Utility-first CSS |
| **Animations** | Framer Motion | 11.3.19 | Declarative animations |
| **Animations** | GSAP | 3.12.5 | Timeline-based animations |
| **3D Graphics** | Three.js | 0.169.0 | WebGL rendering |
| **3D React** | @react-three/fiber | 8.16.0 | React renderer for Three.js |
| **3D Helpers** | @react-three/drei | 9.105.0 | 3D abstractions |
| **State Mgmt** | Zustand | 4.5.5 | Lightweight state |
| **Server State** | React Query | 5.56.2 | API state management |
| **Validation** | Zod | 3.23.8 | Schema validation |
| **Icons** | Lucide React | 0.427.0 | Icon library |
| **Utils** | clsx + tailwind-merge | 2.1.1 + 2.5.2 | Conditional classes |

### 2.2 Backend Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Database** | Supabase (PostgreSQL) | 2.45.4 | Primary database |
| **Auth** | Supabase Auth | 0.5.1 | User authentication |
| **Payments** | Razorpay | 2.9.2 | Payment gateway |
| **Security** | isomorphic-dompurify | 2.35.0 | XSS protection |
| **API** | Next.js API Routes | 14.2.5 | RESTful APIs |

### 2.3 DevOps & Tooling

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Package Manager** | npm/pnpm/yarn | Dependency management |
| **Linting** | ESLint | Code quality |
| **Build Tool** | SWC | Fast compilation |
| **Version Control** | Git | Source control |
| **Hosting** | Vercel (recommended) | Edge deployment |
| **Database Host** | Supabase Cloud | Managed PostgreSQL |

---

## 3. Feature Specifications

### 3.1 User Authentication & Authorization

**Features:**
- Email/password signup and login
- Secure session management via HTTP-only cookies
- Password reset flow with email verification
- Protected route middleware
- Automatic profile creation via database triggers

**Implementation:**
```typescript
// Authentication Flow
1. User submits credentials → POST /api/auth/signup
2. Supabase creates auth.users entry
3. Database trigger creates public.users entry
4. Session cookie set with secure flags
5. Client redirected to dashboard
```

**Security Measures:**
- Bcrypt password hashing (Supabase Auth)
- CSRF protection via SameSite cookies
- Rate limiting: 5 requests per 15 minutes
- Row-level security on all user data

### 3.2 Landing Page & Marketing

**Components (15 total):**
1. **HeroSection** - 3D solar scene with particle effects
2. **EnhancedStickyTextFill** - Canvas-based text animation
3. **StatsSection** - Animated live statistics
4. **BenefitsSection** - Category-based benefits grid
5. **HowItWorksSection** - Timeline visualization
6. **ProblemSolution** - Split comparison view
7. **TestimonialCarousel** - Auto-rotating testimonials
8. **UtilityCompatibilityChecker** - State/DISCOM selector
9. **FAQAccordion** - Searchable FAQ with categories
10. **LogoMarquee** - Partner logo carousel
11. **StickyCTA** - Floating call-to-action
12. **SmoothScrollProgress** - Scroll indicator
13. **CursorFollower** - Custom cursor (desktop)
14. **GlassCard** - Glassmorphism containers
15. **AuroraBackground** - Animated gradient backgrounds

**Performance:**
- 3D content lazy-loaded with `next/dynamic`
- Intersection observer for scroll animations
- Animations only trigger in viewport
- Optimized Three.js scene (500 particles max)

### 3.3 Project Reservation System

**User Flow:**
```
Browse Projects → Select Project → Choose Capacity (1-100 kW)
              → Calculate Price → Review Details
              → Payment (Razorpay) → Confirmation
              → Allocation Created → Dashboard Updated
```

**Features:**
- Real-time capacity availability check
- Dynamic pricing calculation
- ROI calculator with projections
- CO2 offset calculation
- Payment gateway integration (Razorpay)
- Success page with confetti animation

**Business Logic:**
```typescript
// Pricing Formula
basePrice = 75000 per kW (INR)
totalPrice = capacity * basePrice
monthlySavings = capacity * 1500 (estimated)
paybackPeriod = totalPrice / (monthlySavings * 12)
```

### 3.4 Dashboard & Monitoring

**Widgets:**
1. **Total Capacity** - Reserved solar capacity with visual indicator
2. **Total Savings** - Cumulative savings with month-over-month change
3. **CO2 Offset** - Environmental impact visualization
4. **Active Projects** - Project listing with status
5. **Credit History Chart** - Monthly credit trend (Chart.js)
6. **Recent Activity** - Transaction feed with timestamps
7. **Quick Actions** - Reserve more, view bills, settings

**Real-Time Features:**
- Live data updates via Supabase subscriptions
- Auto-refresh every 30 seconds
- Optimistic UI updates with React Query
- Loading skeletons for async data

### 3.5 Bill Management

**Features:**
- Bill listing with filters (paid, pending, upcoming)
- Credit application tracking
- Manual bill entry form
- Bill payment integration (planned)
- Bill history with search
- Credit ledger view

**Bill Credit Logic:**
```typescript
// Credit Application Formula
solarGeneration = capacity * 4.5 (avg kWh/day)
monthlyGeneration = solarGeneration * 30
creditValue = monthlyGeneration * utilityRate
netBillAmount = originalBillAmount - creditValue
```

### 3.6 Utility Connection

**Features:**
- State and utility provider selection
- Consumer ID validation
- Consent form for automatic credit application
- Connection status tracking
- Utility provider compatibility check

**Supported Utilities:**
- Maharashtra: MSEDCL, Adani Electricity, Tata Power
- Karnataka: BESCOM, MESCOM, CHESCOM
- Tamil Nadu: TNEB
- Gujarat: DGVCL, UGVCL, MGVCL

### 3.7 Notification System

**Features:**
- In-app notification bell with unread count
- Notification categories (info, success, warning)
- Mark as read functionality
- Notification filtering
- Real-time updates via Supabase

**Notification Types:**
- Allocation confirmed
- Payment received
- Credit applied
- Bill due reminder
- Generation report available

---

## 4. Database Architecture

### 4.1 Schema Overview (9 Core Tables)

```sql
-- 1. users (User Profiles)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  state TEXT,
  utility_provider TEXT,
  consumer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. projects (Solar Projects)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  total_capacity_kw NUMERIC(10,2) NOT NULL,
  available_capacity_kw NUMERIC(10,2) NOT NULL,
  price_per_kw NUMERIC(10,2) NOT NULL DEFAULT 75000,
  status TEXT NOT NULL CHECK (status IN ('active', 'draft', 'retired')),
  images TEXT[],
  description TEXT,
  commissioning_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. allocations (User Capacity Reservations)
CREATE TABLE allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  capacity_kw NUMERIC(10,2) NOT NULL,
  price_paid NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'pending', 'cancelled')),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. payments (Payment Records)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  allocation_id UUID REFERENCES allocations(id),
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_gateway TEXT DEFAULT 'razorpay',
  gateway_order_id TEXT,
  gateway_payment_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. credit_ledgers (Solar Credit Tracking)
CREATE TABLE credit_ledgers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  allocation_id UUID REFERENCES allocations(id),
  month DATE NOT NULL,
  energy_generated_kwh NUMERIC(10,2) NOT NULL,
  credit_amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'applied', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. bills (Electricity Bills)
CREATE TABLE bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bill_month DATE NOT NULL,
  original_amount NUMERIC(10,2) NOT NULL,
  credit_applied NUMERIC(10,2) DEFAULT 0,
  net_amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'overdue')),
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. generations (Solar Generation Data)
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  energy_generated_kwh NUMERIC(10,2) NOT NULL,
  peak_power_kw NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, date)
);

-- 8. notifications (User Notifications)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. capacity_blocks (Capacity Management)
CREATE TABLE capacity_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  capacity_kw NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available', 'reserved', 'allocated')),
  reserved_until TIMESTAMPTZ,
  allocation_id UUID REFERENCES allocations(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2 Row Level Security (RLS)

**All tables have RLS enabled. Example policies:**

```sql
-- Users can only view/update their own data
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can only view their own allocations
CREATE POLICY "Users can view own allocations"
  ON allocations FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone can view active projects
CREATE POLICY "Anyone can view active projects"
  ON projects FOR SELECT
  USING (status = 'active');
```

### 4.3 Database Triggers

```sql
-- Auto-create user profile on signup
CREATE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update project available capacity
CREATE FUNCTION update_project_capacity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects
  SET available_capacity_kw = total_capacity_kw - (
    SELECT COALESCE(SUM(capacity_kw), 0)
    FROM allocations
    WHERE project_id = NEW.project_id AND status = 'active'
  )
  WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_allocation_change
  AFTER INSERT OR UPDATE ON allocations
  FOR EACH ROW EXECUTE FUNCTION update_project_capacity();
```

### 4.4 Indexes for Performance

```sql
CREATE INDEX idx_allocations_user_id ON allocations(user_id);
CREATE INDEX idx_allocations_project_id ON allocations(project_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_credits_user_id ON credit_ledgers(user_id);
CREATE INDEX idx_bills_user_id ON bills(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_generations_project_date ON generations(project_id, date);
```

---

## 5. API Specifications

### 5.1 Authentication APIs

| Endpoint | Method | Purpose | Rate Limit |
|----------|--------|---------|------------|
| `/api/auth/signup` | POST | User registration | 5/15min |
| `/api/auth/login` | POST | User login | 5/15min |
| `/api/auth/logout` | POST | User logout | 10/min |
| `/api/auth/reset-password` | POST | Password reset | 5/15min |

### 5.2 User APIs

| Endpoint | Method | Purpose | Rate Limit |
|----------|--------|---------|------------|
| `/api/user/profile` | GET | Get user profile | 60/min |
| `/api/user/profile` | PUT | Update profile | 30/min |
| `/api/user/utility` | PUT | Update utility info | 30/min |

### 5.3 Project APIs

| Endpoint | Method | Purpose | Rate Limit |
|----------|--------|---------|------------|
| `/api/projects` | GET | List all active projects | 60/min |
| `/api/projects/[id]` | GET | Get project details | 60/min |
| `/api/projects` | POST | Create project (admin) | 10/min |

### 5.4 Allocation APIs

| Endpoint | Method | Purpose | Rate Limit |
|----------|--------|---------|------------|
| `/api/allocations` | GET | Get user allocations | 60/min |
| `/api/allocations` | POST | Create allocation | 10/min |
| `/api/allocations/[id]` | GET | Get allocation details | 60/min |

### 5.5 Payment APIs

| Endpoint | Method | Purpose | Rate Limit |
|----------|--------|---------|------------|
| `/api/payments/create-order` | POST | Create Razorpay order | 10/min |
| `/api/payments/verify` | POST | Verify payment | 10/min |

### 5.6 Dashboard APIs

| Endpoint | Method | Purpose | Rate Limit |
|----------|--------|---------|------------|
| `/api/dashboard/summary` | GET | Dashboard stats | 60/min |
| `/api/stats/live` | GET | Live statistics | 60/min |
| `/api/monitoring/realtime` | GET | Real-time monitoring | 60/min |

### 5.7 Bill & Credit APIs

| Endpoint | Method | Purpose | Rate Limit |
|----------|--------|---------|------------|
| `/api/bills` | GET | List user bills | 60/min |
| `/api/bills` | POST | Create manual bill | 10/min |
| `/api/credits` | GET | Get credit history | 60/min |

### 5.8 Notification APIs

| Endpoint | Method | Purpose | Rate Limit |
|----------|--------|---------|------------|
| `/api/notifications` | GET | List notifications | 60/min |
| `/api/notifications/[id]` | PUT | Mark as read | 30/min |

### 5.9 Utility APIs

| Endpoint | Method | Purpose | Rate Limit |
|----------|--------|---------|------------|
| `/api/newsletter/subscribe` | POST | Newsletter signup | 10/min |

---

## 6. Security Architecture

### 6.1 Authentication Security

**Measures:**
- Supabase Auth with bcrypt password hashing
- HTTP-only, SameSite=Lax cookies for session
- Secure flag enabled in production
- Session expiry: 7 days with automatic refresh
- CSRF protection via cookie attributes

### 6.2 Authorization & Access Control

**Row Level Security (RLS):**
- All tables have RLS policies enabled
- User-scoped data access (users can only see their own data)
- Public data (projects) available to authenticated users
- Admin-only operations protected at database level

### 6.3 Input Validation & Sanitization

**Server-Side Validation:**
```typescript
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Schema validation with Zod
const allocationSchema = z.object({
  project_id: z.string().uuid(),
  capacity_kw: z.number().min(1).max(100),
});

// XSS prevention with DOMPurify
const sanitized = DOMPurify.sanitize(userInput);
```

### 6.4 Rate Limiting

**Implementation:**
```typescript
// IP-based rate limiting
const rateLimitMap = new Map();

function rateLimit(ip: string, maxRequests: number, windowMs: number) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  const recentRequests = userRequests.filter(
    (time) => now - time < windowMs
  );

  if (recentRequests.length >= maxRequests) {
    throw new Error('Rate limit exceeded');
  }

  rateLimitMap.set(ip, [...recentRequests, now]);
}
```

**Rate Limits:**
- Auth endpoints: 5 requests / 15 minutes
- Payment endpoints: 10 requests / minute
- General API: 60 requests / minute

### 6.5 SQL Injection Prevention

**Measures:**
- Parameterized queries via Supabase client
- No raw SQL from user input
- Type validation with Zod schemas
- RLS policies as additional layer

### 6.6 XSS Prevention

**Measures:**
- Content Security Policy (CSP) headers
- DOMPurify for user-generated content
- React's built-in XSS protection
- No `dangerouslySetInnerHTML` without sanitization

### 6.7 HTTPS & Transport Security

**Production Security:**
```typescript
// next.config.js (production)
headers: [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  }
]
```

---

## 7. Performance Requirements

### 7.1 Core Web Vitals Targets

| Metric | Target | Current |
|--------|--------|---------|
| **Largest Contentful Paint (LCP)** | < 2.5s | ~2.1s |
| **First Input Delay (FID)** | < 100ms | ~80ms |
| **Cumulative Layout Shift (CLS)** | < 0.1 | ~0.05 |
| **First Contentful Paint (FCP)** | < 1.8s | ~1.5s |
| **Time to Interactive (TTI)** | < 3.8s | ~3.2s |

### 7.2 Bundle Size Optimization

**Current Bundle Analysis:**
```
Main Bundle: ~250KB (gzipped)
Vendor Bundle: ~180KB (gzipped)
3D Components: ~120KB (lazy loaded)
Animation Library: ~45KB (tree-shaken)
```

**Optimization Techniques:**
1. Code splitting with dynamic imports
2. Tree-shaking via ES modules
3. SWC minification
4. Route-based chunking (automatic in Next.js)

### 7.3 Image Optimization

```typescript
// next.config.js
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60,
}
```

### 7.4 Caching Strategy

**Static Assets:**
```
_next/static/* → Cache-Control: public, max-age=31536000, immutable
```

**API Responses:**
```typescript
// No cache for real-time data
res.setHeader('Cache-Control', 'no-store, max-age=0');

// Cache public data
res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');
```

### 7.5 Database Query Optimization

**Techniques:**
1. Indexed queries on foreign keys
2. Limited result sets with pagination
3. Aggregate queries for dashboard stats
4. Connection pooling via Supabase
5. Optimistic UI updates with React Query

### 7.6 Animation Performance

**Best Practices:**
```typescript
// GPU-accelerated transforms
.animate { transform: translateX(0); }

// Avoid layout thrashing
.animate { will-change: transform; }

// Use Framer Motion's layoutEffect: false
<motion.div layoutEffect={false} />

// Debounce scroll events
useEffect(() => {
  const handleScroll = debounce(() => {
    // animation logic
  }, 16); // ~60fps
}, []);
```

---

## 8. UI/UX Design System

### 8.1 Color Palette

```css
/* Primary Colors */
--forest: #0D2818;        /* Primary brand color */
--forest-light: #1B5E3E;  /* Hover states */
--forest-dark: #0A1F12;   /* Depth elements */

--gold: #FFB800;          /* Accent color */
--gold-light: #FFD54F;    /* Light accents */
--gold-dark: #F57C00;     /* Dark accents */

/* Neutrals */
--charcoal: #1A1A1A;      /* Text color */
--offwhite: #FAFAF8;      /* Background */

/* Energy Colors */
--energy-blue: #00BCD4;   /* Solar/Energy theme */
--energy-green: #4CAF50;  /* Success/Generation */

/* Status Colors */
--success: #4CAF50;
--warning: #FF9800;
--error: #F44336;
```

### 8.2 Typography

**Font Families:**
```css
--font-heading: 'Space Grotesk', 'Inter', sans-serif;
--font-body: 'Inter', 'system-ui', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

**Type Scale:**
```css
--text-hero: 5rem / 1.1;       /* Landing hero */
--text-hero-lg: 6rem / 1.1;    /* Large hero */
--text-hero-xl: 8rem / 1.1;    /* Extra large hero */
--text-5xl: 3rem / 1.2;        /* Section headers */
--text-4xl: 2.25rem / 1.25;    /* Sub-headers */
--text-xl: 1.25rem / 1.75;     /* Body large */
--text-base: 1rem / 1.5;       /* Body text */
--text-sm: 0.875rem / 1.5;     /* Small text */
```

### 8.3 Spacing System

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
--spacing-3xl: 4rem;     /* 64px */
--spacing-4xl: 6rem;     /* 96px */
--spacing-5xl: 8rem;     /* 128px */
```

### 8.4 Component Library

**Base Components (22 total):**
1. Button (5 variants: primary, secondary, outline, ghost, danger)
2. Card (3 variants: default, elevated, flat)
3. Input (text, email, password, number, tel)
4. Select / Dropdown
5. Checkbox / Radio
6. Toggle Switch
7. Badge / Tag
8. Alert / Toast
9. Modal / Dialog
10. Tooltip
11. Skeleton Loader
12. Progress Bar / Spinner
13. Avatar
14. Divider
15. Tabs
16. Breadcrumb
17. Pagination
18. Table
19. Form Group
20. Error Message
21. Label
22. Link

**Glassmorphism Effects:**
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}
```

### 8.5 Responsive Breakpoints

```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet portrait
  lg: '1024px',  // Tablet landscape
  xl: '1280px',  // Desktop
  '2xl': '1440px' // Large desktop
};
```

### 8.6 Accessibility Standards

**WCAG 2.1 AA Compliance:**
- Color contrast ratio ≥ 4.5:1 for body text
- Color contrast ratio ≥ 3:1 for large text
- Focus indicators on all interactive elements
- Skip to main content link
- ARIA labels on icons
- Keyboard navigation support
- Screen reader friendly

**Accessibility Features:**
```tsx
// Skip link
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// ARIA labels
<button aria-label="Close modal" onClick={onClose}>
  <X className="h-6 w-6" />
</button>
```

---

## 9. Animation & Interaction Framework

### 9.1 Animation Library (60+ Animations)

**Categories:**
1. **Entrance Animations**: fade-in, slide-in, scale-in, bounce-in
2. **Scroll Animations**: parallax, sticky-scroll, scroll-fade
3. **Hover Effects**: card-tilt, magnetic-button, shimmer
4. **Background Animations**: aurora, gradient-shift, blob, morph
5. **Number Animations**: counter, scroll-number
6. **Micro-interactions**: wiggle, pulse, glow

### 9.2 Framer Motion Components

**Implemented Components:**
```typescript
// Scroll-based animations
<ScrollFade direction="up" delay={0.2}>
  <Component />
</ScrollFade>

// Parallax effect
<ParallaxSection speed={0.5}>
  <BackgroundImage />
</ParallaxSection>

// Card tilt effect
<CardTilt maxTilt={10}>
  <Card />
</CardTilt>

// Magnetic button
<MagneticButton strength={0.4}>
  <Button />
</MagneticButton>

// Floating element
<FloatingElement amplitude={10} duration={4}>
  <Icon />
</FloatingElement>
```

### 9.3 GSAP Timeline Animations

**Used for:**
- Complex multi-step animations
- Hero section entrance sequences
- Testimonial carousel transitions
- Sticky text fill effects

### 9.4 Three.js 3D Animations

**Hero 3D Scene:**
```typescript
// Solar panel 3D model
- 500 particle system
- Dynamic lighting
- Rotation animations
- Hover interactions
- Optimized render loop (60fps)
```

### 9.5 Canvas-Based Animations

**EnhancedStickyTextFill:**
- Canvas API for text rendering
- Particle effects (solar elements)
- Animated sun rays
- Scroll-driven progress
- 60fps with requestAnimationFrame

### 9.6 Performance Optimization

**Animation Best Practices:**
```typescript
// 1. Use CSS transforms (GPU-accelerated)
transform: translateX() | translateY() | scale() | rotate()

// 2. Avoid layout-thrashing properties
BAD:  left, top, width, height, margin
GOOD: transform, opacity

// 3. Use will-change sparingly
.will-animate { will-change: transform; }

// 4. Debounce scroll handlers
const handleScroll = useMemo(
  () => debounce(() => { /* logic */ }, 16),
  []
);

// 5. Intersection Observer for scroll animations
const { ref, inView } = useInView({
  triggerOnce: true,
  threshold: 0.1
});
```

---

## 10. Integration Points

### 10.1 Razorpay Payment Gateway

**Status:** Integrated (Simulation Mode)

**Flow:**
```typescript
1. Create Order → POST /api/payments/create-order
   Response: { order_id, amount, currency }

2. Open Razorpay Checkout → Client-side SDK
   window.Razorpay.open({ order_id, handler: onSuccess })

3. Verify Payment → POST /api/payments/verify
   Verify signature with Razorpay secret

4. Create Allocation → Database insert
   Update project capacity
```

**Configuration:**
```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

### 10.2 BBPS (Bharat Bill Payment System)

**Status:** Planned (Not Integrated)

**Purpose:**
- Fetch electricity bills automatically
- Apply solar credits via BBPS API
- Support multi-utility bill fetch

**Planned Flow:**
```
User connects utility → BBPS agent search
→ Bill fetch API → Credit calculation
→ Credit application → Bill update
```

**Alternatives Considered:**
- BillDesk API
- Paytm Business API
- Direct utility integrations

### 10.3 Email Notifications

**Status:** Planned (Not Integrated)

**Use Cases:**
- Welcome email on signup
- Allocation confirmation
- Payment receipt
- Monthly generation report
- Bill due reminders

**Recommended Provider:**
- Resend (developer-friendly)
- SendGrid (enterprise)
- Amazon SES (cost-effective)

### 10.4 SMS Notifications

**Status:** Not Planned

**Potential Use Cases:**
- OTP verification
- Payment confirmations
- Critical alerts

### 10.5 Analytics & Tracking

**Status:** Not Integrated

**Recommended Tools:**
- Google Analytics 4 (user behavior)
- Mixpanel (product analytics)
- Hotjar (heatmaps, session recordings)
- Sentry (error tracking)

---

## 11. Testing Strategy

### 11.1 Current Status

**Testing Gap:**
- ❌ No unit tests implemented
- ❌ No integration tests
- ❌ No end-to-end tests
- ❌ No component tests

### 11.2 Recommended Testing Stack

| Type | Tool | Purpose |
|------|------|---------|
| **Unit Tests** | Jest + Testing Library | Component & function tests |
| **Integration Tests** | Jest + Supertest | API endpoint tests |
| **E2E Tests** | Playwright | User flow tests |
| **Component Tests** | Storybook | UI component library |
| **Visual Tests** | Percy / Chromatic | Visual regression |
| **Performance Tests** | Lighthouse CI | Core Web Vitals |
| **Load Tests** | k6 | API load testing |

### 11.3 Test Coverage Targets

| Layer | Target Coverage |
|-------|----------------|
| Utilities | 90%+ |
| API Routes | 80%+ |
| Components | 70%+ |
| Integration | 60%+ |
| Overall | 75%+ |

### 11.4 Critical Test Scenarios

**Authentication:**
- [ ] User signup flow
- [ ] User login flow
- [ ] Password reset flow
- [ ] Session persistence
- [ ] Protected route access

**Reservation Flow:**
- [ ] Project browsing
- [ ] Capacity selection
- [ ] Payment processing
- [ ] Allocation creation
- [ ] Dashboard update

**Security:**
- [ ] SQL injection attempts
- [ ] XSS prevention
- [ ] Rate limiting enforcement
- [ ] RLS policy validation
- [ ] CSRF protection

**Performance:**
- [ ] Page load times
- [ ] API response times
- [ ] Bundle size limits
- [ ] Animation FPS
- [ ] Database query times

---

## 12. Deployment Architecture

### 12.1 Recommended Hosting

**Frontend & API:**
- **Vercel** (recommended) - Native Next.js support, edge functions
- **Netlify** - Alternative with CDN
- **AWS Amplify** - Enterprise option

**Database:**
- **Supabase Cloud** (current) - Managed PostgreSQL
- **Self-hosted Supabase** - Full control
- **AWS RDS** - Enterprise migration option

**File Storage:**
- **Supabase Storage** - Images, documents
- **Cloudinary** - Image optimization
- **AWS S3** - Large files

### 12.2 Environment Configuration

```env
# Production
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://powernetpro.com
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx

# Staging
NODE_ENV=staging
NEXT_PUBLIC_SITE_URL=https://staging.powernetpro.com
...

# Development
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
...
```

### 12.3 CI/CD Pipeline

**Recommended Setup (GitHub Actions):**
```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: vercel/action@v2
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 12.4 Monitoring & Logging

**Application Monitoring:**
- **Vercel Analytics** - Performance metrics
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Datadog** - Infrastructure monitoring

**Database Monitoring:**
- **Supabase Dashboard** - Query performance
- **pg_stat_statements** - Slow query log

**Uptime Monitoring:**
- **Pingdom** - Uptime checks
- **Better Uptime** - Status page

---

## 13. Monitoring & Analytics

### 13.1 User Analytics

**Metrics to Track:**
- User signups (daily, weekly, monthly)
- Active users (DAU, WAU, MAU)
- User retention (cohort analysis)
- Conversion funnel (landing → signup → reservation → payment)
- User engagement (session duration, pages per session)

### 13.2 Business Metrics

**KPIs:**
- Total capacity reserved (kW)
- Revenue (MRR, ARR)
- Average reservation size
- Churn rate
- Customer lifetime value (CLV)
- Customer acquisition cost (CAC)

### 13.3 Technical Metrics

**Performance:**
- Page load times (P50, P95, P99)
- API response times
- Error rates (4xx, 5xx)
- Database query times
- Cache hit rates

**Availability:**
- Uptime percentage (target: 99.9%)
- Time to recovery (MTTR)
- Incident frequency

### 13.4 Dashboard Requirements

**Admin Dashboard (Future):**
- Real-time system health
- User activity feed
- Revenue dashboard
- Project management
- Support ticket system

---

## 14. Scalability Considerations

### 14.1 Current Capacity

**Estimated Limits:**
- Concurrent users: 1,000-5,000
- API requests: 10,000 req/min
- Database connections: 100
- Data storage: 10GB

### 14.2 Scaling Strategy

**Horizontal Scaling:**
- Vercel edge functions (automatic)
- Supabase connection pooling
- CDN for static assets

**Database Scaling:**
- Read replicas for analytics queries
- Connection pooling (PgBouncer)
- Query optimization with indexes
- Partitioning large tables (bills, generations)

**Caching Layer:**
- Redis for session storage
- API response caching (stale-while-revalidate)
- Static page generation with ISR

### 14.3 Performance Under Load

**Load Testing Targets:**
- 10,000 req/min sustained
- 1,000 concurrent WebSocket connections
- < 500ms P95 API response time
- < 2s P95 page load time

---

## 15. Future Roadmap

### 15.1 Phase 1: Core Enhancements (Q1 2026)

**Priority: HIGH**
- [ ] Implement comprehensive testing suite
- [ ] Real Razorpay payment processing
- [ ] Email notification system (Resend)
- [ ] Error monitoring (Sentry)
- [ ] Analytics tracking (GA4 + Mixpanel)
- [ ] Performance optimization (Lighthouse CI)
- [ ] SEO optimization (meta tags, sitemap, robots.txt)

### 15.2 Phase 2: Feature Expansion (Q2 2026)

**Priority: MEDIUM**
- [ ] BBPS integration for automatic bill fetch
- [ ] Admin panel (user management, project management)
- [ ] KYC verification flow (Aadhaar integration)
- [ ] Referral program
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Invoice generation (PDF)

### 15.3 Phase 3: Advanced Features (Q3 2026)

**Priority: LOW**
- [ ] AI-powered recommendations
- [ ] Dynamic pricing based on demand
- [ ] Secondary market for capacity trading
- [ ] Corporate solutions (B2B portal)
- [ ] API marketplace (third-party integrations)
- [ ] Carbon credit trading
- [ ] Blockchain-based certificate of origin

### 15.4 Technical Debt Resolution

**Ongoing:**
- [ ] Resolve Git merge conflicts
- [ ] Clean up unused dependencies
- [ ] Refactor complex components
- [ ] Improve type safety (stricter TypeScript)
- [ ] Documentation updates
- [ ] Code review automation
- [ ] Dependency updates (Dependabot)

---

## Appendix

### A. Technology Alternatives Considered

| Category | Selected | Alternatives |
|----------|----------|-------------|
| Framework | Next.js 14 | Remix, SvelteKit, Astro |
| Database | Supabase | Firebase, PlanetScale, Neon |
| Styling | Tailwind CSS | Styled Components, CSS Modules |
| Animations | Framer Motion | React Spring, Anime.js |
| State Mgmt | Zustand + React Query | Redux Toolkit, Jotai, Recoil |
| Payments | Razorpay | Stripe, PayU, Cashfree |

### B. Performance Benchmarks

**Lighthouse Scores (Desktop):**
- Performance: 92/100
- Accessibility: 95/100
- Best Practices: 100/100
- SEO: 90/100

**Bundle Analysis:**
```
Total JavaScript: ~420KB (gzipped)
├─ Main Bundle: 250KB
├─ Vendor: 180KB
├─ 3D (lazy): 120KB
└─ Animations: 45KB

Total CSS: ~35KB (gzipped)
```

### C. Browser Support

**Target Browsers:**
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile Safari: iOS 14+
- Chrome Mobile: Android 10+

**Polyfills:**
- IntersectionObserver (legacy support)
- ResizeObserver (legacy support)
- WebGL (fallback for 3D)

### D. Accessibility Checklist

- [x] Semantic HTML
- [x] Keyboard navigation
- [x] Focus indicators
- [x] ARIA labels
- [x] Alt text for images
- [x] Color contrast compliance
- [x] Skip to main content
- [x] Reduced motion support
- [ ] Screen reader testing
- [ ] Voice control testing

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-01-XX | Initial Team | Initial TRD |
| 2.0 | 2025-XX-XX | Dev Team | Feature updates |
| 3.0 | 2026-01-14 | Architecture Review | Comprehensive analysis |

---

**Document Status:** Living Document
**Next Review Date:** 2026-04-01
**Owner:** Technical Architecture Team

---

*This TRD represents the current state and future vision of the PowerNetPro Digital Solar platform. It should be updated quarterly or when significant architectural changes occur.*
