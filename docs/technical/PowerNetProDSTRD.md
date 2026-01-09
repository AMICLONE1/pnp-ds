# Digital Solar - Technical Requirements Document (TRD) v2.0

> **Version**: 2.0  
> **Date**: January 7, 2026  
> **Status**: Ready for Development  
> **Target Launch**: Q1 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision](#2-product-vision)
3. [User Personas](#3-user-personas)
4. [User Journey & Flows](#4-user-journey--flows)
5. [Technical Architecture](#5-technical-architecture)
6. [Database Schema](#6-database-schema)
7. [Authentication System](#7-authentication-system)
8. [API Design](#8-api-design)
9. [Frontend Architecture](#9-frontend-architecture)
10. [Key Features](#10-key-features)
11. [Security Requirements](#11-security-requirements)
12. [Performance Requirements](#12-performance-requirements)
13. [Testing Strategy](#13-testing-strategy)
14. [Deployment Strategy](#14-deployment-strategy)
15. [Environment Variables](#15-environment-variables)
16. [Project Structure](#16-project-structure)
17. [Development Phases](#17-development-phases)

---

## 1. Executive Summary

### 1.1 What is Digital Solar?

Digital Solar is a **community solar platform** that enables users to participate in solar energy projects without installing panels on their property. Users can:

- **Reserve capacity** in solar projects
- **Connect their utility** to offset electricity bills
- **Earn credits** based on solar generation
- **Track environmental impact** and savings

### 1.2 Inspiration

The user experience is inspired by **[SundayGrids](https://www.sundaygrids.com/)** with their simple 3-step flow:
1. **Join Projects** → Reserve solar capacity
2. **Connect Utility** → Link your electricity provider
3. **Offset Bills** → Save money automatically

### 1.3 Business Model

- Users pay upfront for solar capacity allocation
- Monthly credits are applied to their utility bills
- Platform earns through transaction fees and project margins

---

## 2. Product Vision

### 2.1 Mission Statement

> "Make clean energy accessible to everyone, regardless of whether they own property or can install solar panels."

### 2.2 Core Value Propositions

| For Users | For the Platform |
|-----------|------------------|
| No installation required | Recurring revenue from capacity fees |
| Lower electricity bills | Transaction fees on payments |
| Track environmental impact | Data insights on energy consumption |
| Easy onboarding (<5 minutes) | Scalable customer acquisition |

### 2.3 Success Metrics

- **User Activation**: 80% of signups complete reservation within 7 days
- **Utility Connection**: 70% of users link utility within 14 days
- **Retention**: 90% monthly retention after first credit applied
- **NPS**: Target 50+ Net Promoter Score

---

## 3. User Personas

### 3.1 Primary Persona: Urban Professional

```
Name: Priya, 32
Location: Mumbai, apartment dweller
Income: ₹15-25 LPA
Pain Point: Wants clean energy but can't install solar in rented apartment
Goal: Reduce electricity bills while supporting sustainability
Tech Comfort: High - uses UPI, online banking daily
```

### 3.2 Secondary Persona: Small Business Owner

```
Name: Rahul, 45
Location: Bangalore, shop owner
Income: ₹8-12 LPA
Pain Point: High commercial electricity rates
Goal: Reduce operational costs
Tech Comfort: Medium - comfortable with smartphones
```

### 3.3 Tertiary Persona: Eco-Conscious Family

```
Name: Sharma Family
Location: Delhi NCR, house owners
Income: ₹20-30 LPA
Pain Point: Want solar but roof is unsuitable/shaded
Goal: Teach children about sustainability while saving money
Tech Comfort: Medium-High
```

---

## 4. User Journey & Flows

### 4.1 High-Level User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        LANDING PAGE                              │
│   "Join the solar revolution. No installation required."        │
│                                                                  │
│   [Join Projects] ←── Primary CTA                               │
│   [Login] ←── Returning users                                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     STEP 1: JOIN PROJECTS                        │
│                        /reserve                                  │
│                                                                  │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│   │  Project 1  │  │  Project 2  │  │  Project 3  │            │
│   │  Maharashtra │  │  Karnataka  │  │  Tamil Nadu │            │
│   │  ₹5/kW/mo   │  │  ₹4.5/kW/mo │  │  ₹4.8/kW/mo │            │
│   │  [Select]   │  │  [Select]   │  │  [Select]   │            │
│   └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                  │
│   Capacity Slider: [====|============] 5 kW                     │
│   Monthly Cost: ₹25 | Est. Savings: ₹45/month                   │
│                                                                  │
│   [Reserve Now] → Requires login/signup                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
    New User                        Existing User
         │                               │
         ▼                               ▼
┌─────────────────┐             ┌─────────────────┐
│     SIGNUP      │             │      LOGIN      │
│     /signup     │             │     /login      │
│                 │             │                 │
│ Email           │             │ Email           │
│ Password        │             │ Password        │
│ Name            │             │                 │
│                 │             │ [Login]         │
│ [Create Account]│             │                 │
└────────┬────────┘             └────────┬────────┘
         │                               │
         └───────────────┬───────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        PAYMENT                                   │
│                    /reserve/payment                              │
│                                                                  │
│   Order Summary:                                                 │
│   - Project: Maharashtra Solar Farm                              │
│   - Capacity: 5 kW                                               │
│   - Monthly Fee: ₹25                                             │
│   - First Payment: ₹25                                           │
│                                                                  │
│   [Pay with Razorpay]                                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  STEP 2: CONNECT UTILITY                         │
│                       /connect                                   │
│                                                                  │
│   "Link your electricity provider to start offsetting bills"    │
│                                                                  │
│   State: [Maharashtra ▼]                                         │
│   DISCOM: [MSEDCL ▼]                                            │
│   Consumer Number: [________________]                            │
│                                                                  │
│   [Connect Utility]                                              │
│                                                                  │
│   [Skip for now →] → Goes to Dashboard                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  STEP 3: DASHBOARD                               │
│                     /dashboard                                   │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │  Welcome back, Priya! 🌞                                 │  │
│   │                                                          │  │
│   │  Your Solar Summary                                      │  │
│   │  ┌────────────┐ ┌────────────┐ ┌────────────┐           │  │
│   │  │ 5 kW      │ │ ₹450      │ │ 2.4 tons   │           │  │
│   │  │ Capacity  │ │ Saved     │ │ CO₂ Offset │           │  │
│   │  └────────────┘ └────────────┘ └────────────┘           │  │
│   │                                                          │  │
│   │  [View Details] [Pay Bill] [Add Capacity]               │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│   Recent Activity                                                │
│   • Credit applied: ₹45 (Dec 2025)                              │
│   • Bill generated: ₹120 (Dec 2025)                             │
│   • Project update: 98% uptime this month                        │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Authentication Flow (Simplified)

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                           │
└─────────────────────────────────────────────────────────────────┘

SIGNUP:
1. User enters email, password, name
2. Supabase creates auth.users record
3. Database trigger creates public.users record
4. User logged in automatically (session created)
5. Redirect to /reserve (continue reservation) or /dashboard

LOGIN:
1. User enters email, password
2. Supabase validates credentials
3. Session cookie set in browser
4. Redirect to /reserve (new user) or /dashboard (returning)

LOGOUT:
1. Call supabase.auth.signOut()
2. Session cookie cleared
3. Redirect to /

SESSION CHECK (on page load):
1. Middleware calls supabase.auth.getUser()
2. If no user + protected route → redirect to /login
3. If user exists → allow access
```

### 4.3 Page-by-Page Flow

| Page | URL | Auth Required | Purpose |
|------|-----|---------------|---------|
| Landing | `/` | No | Marketing, value proposition |
| Reserve | `/reserve` | No | View projects, select capacity |
| Login | `/login` | No | Sign in existing users |
| Signup | `/signup` | No | Create new account |
| Payment | `/reserve/payment` | Yes | Complete reservation |
| Reserve Success | `/reserve/success` | Yes | Confirmation after payment |
| Connect | `/connect` | Yes | Link utility provider |
| Dashboard | `/dashboard` | Yes | Main user interface |
| Settings | `/settings` | Yes | Profile, preferences |
| Bills | `/bills` | Yes | View/pay electricity bills |

---

## 5. Technical Architecture

### 5.1 Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
├─────────────────────────────────────────────────────────────────┤
│  Next.js 14 (App Router)                                        │
│  React 18 with TypeScript                                       │
│  Tailwind CSS for styling                                       │
│  Framer Motion for animations                                   │
│  Zustand for client state                                       │
│  React Query for server state                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
├─────────────────────────────────────────────────────────────────┤
│  Next.js API Routes (Route Handlers)                            │
│  Supabase Auth (authentication)                                 │
│  Supabase Database (PostgreSQL)                                 │
│  Supabase Storage (file uploads)                                │
│  Supabase Realtime (live updates)                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
├─────────────────────────────────────────────────────────────────┤
│  Razorpay (payments)                                            │
│  BBPS API (bill fetching - future)                              │
│  Resend (transactional emails)                                  │
│  Vercel (hosting)                                               │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 System Architecture Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser    │────▶│   Vercel     │────▶│  Supabase    │
│   (Client)   │◀────│   (CDN/SSR)  │◀────│  (Database)  │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  Razorpay    │
                     │  (Payments)  │
                     └──────────────┘
```

### 5.3 Data Flow

```
User Action → Next.js Client → API Route → Supabase → Response → UI Update
     │                                          │
     │                                          ▼
     │                                   PostgreSQL
     │                                   (with RLS)
     │                                          │
     └──────────────────────────────────────────┘
                     Real-time subscriptions
```

---

## 6. Database Schema

### 6.1 Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     users       │     │    projects     │     │   allocations   │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK, UUID)   │     │ id (PK, UUID)   │     │ id (PK, UUID)   │
│ email           │     │ name            │     │ user_id (FK)    │──┐
│ name            │     │ location        │     │ project_id (FK) │──┼─┐
│ phone           │     │ total_capacity  │     │ capacity_kw     │  │ │
│ state           │     │ available_cap   │     │ monthly_fee     │  │ │
│ discom          │     │ price_per_kw    │     │ status          │  │ │
│ consumer_number │     │ status          │     │ start_date      │  │ │
│ kyc_status      │     │ commission_date │     │ created_at      │  │ │
│ created_at      │     │ created_at      │     └─────────────────┘  │ │
│ updated_at      │     └─────────────────┘                          │ │
└─────────────────┘              │                                   │ │
        │                        │                                   │ │
        │                        └───────────────────────────────────┘ │
        │                                                              │
        └──────────────────────────────────────────────────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    payments     │     │     credits     │     │      bills      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK, UUID)   │     │ id (PK, UUID)   │     │ id (PK, UUID)   │
│ user_id (FK)    │     │ user_id (FK)    │     │ user_id (FK)    │
│ allocation_id   │     │ allocation_id   │     │ amount          │
│ amount          │     │ amount          │     │ due_date        │
│ razorpay_id     │     │ generation_kwh  │     │ status          │
│ status          │     │ month           │     │ bill_month      │
│ created_at      │     │ year            │     │ credits_applied │
└─────────────────┘     │ created_at      │     │ created_at      │
                        └─────────────────┘     └─────────────────┘
```

### 6.2 Complete SQL Schema

```sql
-- ============================================
-- DIGITAL SOLAR DATABASE SCHEMA v2.0
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    phone TEXT,
    
    -- Utility Information
    state TEXT,
    discom TEXT,
    utility_consumer_number TEXT,
    
    -- KYC
    kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'submitted', 'verified', 'rejected')),
    aadhaar_verified BOOLEAN DEFAULT FALSE,
    pan_verified BOOLEAN DEFAULT FALSE,
    
    -- Preferences
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    state TEXT NOT NULL,
    
    -- Capacity
    total_capacity_kw DECIMAL(10,2) NOT NULL,
    available_capacity_kw DECIMAL(10,2) NOT NULL,
    min_allocation_kw DECIMAL(10,2) DEFAULT 1,
    max_allocation_kw DECIMAL(10,2) DEFAULT 100,
    
    -- Pricing
    price_per_kw DECIMAL(10,2) NOT NULL, -- Monthly fee per kW
    
    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('planning', 'active', 'full', 'maintenance', 'retired')),
    commission_date DATE,
    
    -- Media
    image_url TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ALLOCATIONS TABLE (User's solar capacity)
-- ============================================
CREATE TABLE public.allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id),
    
    -- Allocation Details
    capacity_kw DECIMAL(10,2) NOT NULL,
    monthly_fee DECIMAL(10,2) NOT NULL, -- Calculated at time of allocation
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'cancelled')),
    start_date DATE,
    end_date DATE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, project_id)
);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    allocation_id UUID REFERENCES public.allocations(id),
    
    -- Payment Details
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    
    -- Razorpay
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    payment_type TEXT CHECK (payment_type IN ('allocation', 'monthly', 'bill')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CREDITS TABLE (Monthly solar credits)
-- ============================================
CREATE TABLE public.credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    allocation_id UUID NOT NULL REFERENCES public.allocations(id),
    
    -- Credit Details
    amount DECIMAL(10,2) NOT NULL, -- Credit amount in INR
    generation_kwh DECIMAL(10,2), -- Energy generated
    
    -- Period
    credit_month INTEGER NOT NULL CHECK (credit_month BETWEEN 1 AND 12),
    credit_year INTEGER NOT NULL,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'expired')),
    applied_to_bill_id UUID,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(allocation_id, credit_month, credit_year)
);

-- ============================================
-- BILLS TABLE
-- ============================================
CREATE TABLE public.bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Bill Details
    bill_number TEXT,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE,
    bill_month INTEGER NOT NULL,
    bill_year INTEGER NOT NULL,
    
    -- Credits Applied
    credits_applied DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2), -- amount - credits_applied
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users: Can only read/update own record
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Projects: Anyone can view active projects
CREATE POLICY "Anyone can view active projects" ON public.projects
    FOR SELECT USING (status = 'active');

-- Allocations: Users can only see their own
CREATE POLICY "Users can view own allocations" ON public.allocations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own allocations" ON public.allocations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payments: Users can only see their own
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments" ON public.payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Credits: Users can only see their own
CREATE POLICY "Users can view own credits" ON public.credits
    FOR SELECT USING (auth.uid() = user_id);

-- Bills: Users can only see their own
CREATE POLICY "Users can view own bills" ON public.bills
    FOR SELECT USING (auth.uid() = user_id);

-- Notifications: Users can only see their own
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamps automatically
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_allocations_updated_at
    BEFORE UPDATE ON public.allocations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_allocations_user_id ON public.allocations(user_id);
CREATE INDEX idx_allocations_project_id ON public.allocations(project_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_credits_user_id ON public.credits(user_id);
CREATE INDEX idx_credits_period ON public.credits(credit_year, credit_month);
CREATE INDEX idx_bills_user_id ON public.bills(user_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id) WHERE read = FALSE;

-- ============================================
-- SEED DATA
-- ============================================

-- Insert sample projects
INSERT INTO public.projects (name, description, location, state, total_capacity_kw, available_capacity_kw, price_per_kw, status, commission_date, image_url)
VALUES
    ('Maharashtra Solar Farm', 'A 500 MW solar farm in the Vidarbha region, one of India''s largest community solar projects.', 'Nagpur, Maharashtra', 'Maharashtra', 500000, 450000, 5.00, 'active', '2024-06-01', '/images/projects/maharashtra.jpg'),
    ('Karnataka Green Energy', 'State-of-the-art solar installation in Karnataka with excellent solar irradiance.', 'Tumkur, Karnataka', 'Karnataka', 300000, 275000, 4.50, 'active', '2024-03-15', '/images/projects/karnataka.jpg'),
    ('Tamil Nadu Solar Park', 'Part of Tamil Nadu''s ambitious renewable energy program, located in Ramanathapuram.', 'Ramanathapuram, Tamil Nadu', 'Tamil Nadu', 400000, 350000, 4.80, 'active', '2024-09-01', '/images/projects/tamilnadu.jpg'),
    ('Gujarat Sun Project', 'Located in the sunny Kutch region with exceptional capacity factors.', 'Kutch, Gujarat', 'Gujarat', 600000, 550000, 4.20, 'active', '2023-12-01', '/images/projects/gujarat.jpg'),
    ('Rajasthan Desert Solar', 'Massive solar installation in Thar Desert with highest solar radiation in India.', 'Jodhpur, Rajasthan', 'Rajasthan', 800000, 700000, 3.80, 'active', '2024-01-15', '/images/projects/rajasthan.jpg');
```

---

## 7. Authentication System

### 7.1 Authentication Provider

**Supabase Auth** with email/password authentication.

### 7.2 Auth Flow Implementation

```typescript
// lib/supabase/client.ts - Browser client
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// lib/supabase/server.ts - Server client
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}
```

### 7.3 Middleware for Protected Routes

```typescript
// middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

// lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Public paths that don't require authentication
  const publicPaths = ["/", "/login", "/signup", "/reserve", "/forgot-password"];
  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path || 
              request.nextUrl.pathname.startsWith("/reserve") ||
              request.nextUrl.pathname.startsWith("/api")
  );

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

### 7.4 Login Component (Simplified)

```typescript
// app/login/page.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      // Wait for cookie to be set
      await new Promise((r) => setTimeout(r, 500));
      // Redirect
      window.location.href = "/dashboard";
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
```

---

## 8. API Design

### 8.1 API Routes Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/projects` | No | List all active projects |
| GET | `/api/projects/[id]` | No | Get project details |
| POST | `/api/reserve` | Yes | Create reservation |
| GET | `/api/allocations` | Yes | Get user's allocations |
| POST | `/api/payments/create-order` | Yes | Create Razorpay order |
| POST | `/api/payments/verify` | Yes | Verify payment |
| GET | `/api/user/profile` | Yes | Get user profile |
| PUT | `/api/user/profile` | Yes | Update user profile |
| PUT | `/api/user/utility` | Yes | Update utility info |
| GET | `/api/credits` | Yes | Get user's credits |
| GET | `/api/bills` | Yes | Get user's bills |
| GET | `/api/dashboard/summary` | Yes | Get dashboard data |

### 8.2 API Response Format

```typescript
// Success Response
{
  "success": true,
  "data": { ... }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "You must be logged in to perform this action"
  }
}
```

### 8.3 Example API Route

```typescript
// app/api/projects/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { success: false, error: { code: "DB_ERROR", message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data: projects });
}
```

### 8.4 Protected API Route

```typescript
// app/api/allocations/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  // Get user's allocations
  const { data: allocations, error } = await supabase
    .from("allocations")
    .select(`
      *,
      project:projects(*)
    `)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json(
      { success: false, error: { code: "DB_ERROR", message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data: allocations });
}
```

---

## 9. Frontend Architecture

### 9.1 Component Structure

```
components/
├── ui/                      # Base UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Skeleton.tsx
│   └── Toast.tsx
├── layout/                  # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Navigation.tsx
│   └── Sidebar.tsx
├── features/                # Feature-specific components
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── projects/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectList.tsx
│   │   └── CapacitySlider.tsx
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── CreditHistory.tsx
│   │   └── RecentActivity.tsx
│   └── billing/
│       ├── BillCard.tsx
│       └── PaymentHistory.tsx
└── providers/               # Context providers
    ├── AuthProvider.tsx
    └── QueryProvider.tsx
```

### 9.2 Design System

```typescript
// lib/design-system.ts
export const colors = {
  // Primary
  forest: "#1B4332",
  forestLight: "#2D6A4F",
  
  // Accent
  gold: "#D4A03A",
  goldLight: "#E8C468",
  
  // Neutrals
  charcoal: "#1A1A1A",
  offwhite: "#FAFAF8",
  
  // Semantic
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
};

export const typography = {
  fontFamily: {
    heading: "'Space Grotesk', sans-serif",
    body: "'Inter', sans-serif",
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },
};

export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  6: "1.5rem",
  8: "2rem",
  12: "3rem",
  16: "4rem",
  24: "6rem",
};
```

### 9.3 Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1B4332",
          light: "#2D6A4F",
          dark: "#0F2D1F",
        },
        gold: {
          DEFAULT: "#D4A03A",
          light: "#E8C468",
          dark: "#B8860B",
        },
        charcoal: "#1A1A1A",
        offwhite: "#FAFAF8",
      },
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 10. Key Features

### 10.1 Feature Priority Matrix

| Feature | Priority | Phase | Complexity |
|---------|----------|-------|------------|
| User Authentication | P0 | 1 | Medium |
| Project Listing | P0 | 1 | Low |
| Solar Reservation | P0 | 1 | Medium |
| Payment Integration | P0 | 1 | High |
| Utility Connection | P1 | 2 | Medium |
| Dashboard | P1 | 2 | Medium |
| Credit Tracking | P1 | 2 | Medium |
| Bill Management | P2 | 3 | High |
| Notifications | P2 | 3 | Low |
| Admin Panel | P2 | 3 | High |

### 10.2 Feature Specifications

#### 10.2.1 Solar Reservation

**User Story**: As a user, I want to reserve solar capacity so I can start saving on electricity.

**Acceptance Criteria**:
- [ ] User can view available projects
- [ ] User can select capacity (1-100 kW)
- [ ] User sees estimated monthly cost and savings
- [ ] User can complete payment via Razorpay
- [ ] Allocation is created after successful payment
- [ ] User receives confirmation email

**Technical Notes**:
- Capacity selection via slider component
- Real-time price calculation
- Optimistic UI updates
- Idempotent payment handling

#### 10.2.2 Utility Connection

**User Story**: As a user, I want to link my utility provider so credits can be applied to my bills.

**Acceptance Criteria**:
- [ ] User can select state and DISCOM
- [ ] User can enter consumer number
- [ ] System validates consumer number format
- [ ] User can skip and complete later

**Technical Notes**:
- State → DISCOM mapping
- Consumer number regex validation
- Future: BBPS API integration for auto-fetch

#### 10.2.3 Dashboard

**User Story**: As a user, I want to see my solar journey summary at a glance.

**Widgets**:
1. **Capacity Summary**: Total kW allocated
2. **Savings Summary**: Total savings to date
3. **Environmental Impact**: CO₂ offset
4. **Recent Activity**: Latest transactions
5. **Credit History**: Monthly credits chart
6. **Quick Actions**: Pay bill, add capacity

---

## 11. Security Requirements

### 11.1 Authentication Security

- [x] Passwords hashed with bcrypt (Supabase default)
- [x] Session tokens with secure, httpOnly cookies
- [x] CSRF protection via SameSite cookies
- [ ] Rate limiting on auth endpoints
- [ ] Account lockout after failed attempts

### 11.2 Data Security

- [x] Row Level Security (RLS) on all tables
- [x] Users can only access their own data
- [ ] Sensitive data encrypted at rest
- [ ] PII anonymization for analytics

### 11.3 API Security

- [x] Authentication required for protected endpoints
- [ ] Input validation with Zod
- [ ] SQL injection prevention (Supabase ORM)
- [ ] XSS prevention (React escaping)

### 11.4 Payment Security

- [ ] PCI DSS compliance (via Razorpay)
- [ ] No card data stored locally
- [ ] Webhook signature verification
- [ ] Idempotent payment processing

---

## 12. Performance Requirements

### 12.1 Core Web Vitals Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP (Largest Contentful Paint) | < 2.5s | 75th percentile |
| FID (First Input Delay) | < 100ms | 75th percentile |
| CLS (Cumulative Layout Shift) | < 0.1 | 75th percentile |
| TTFB (Time to First Byte) | < 600ms | 75th percentile |

### 12.2 Performance Optimizations

1. **Image Optimization**: Next.js Image component with WebP
2. **Code Splitting**: Dynamic imports for heavy components
3. **Caching**: ISR for static pages, SWR for client data
4. **Font Optimization**: next/font with font-display: swap
5. **Bundle Analysis**: Regular monitoring with @next/bundle-analyzer

### 12.3 Scalability

- Vercel Edge for global CDN
- Supabase auto-scaling for database
- Connection pooling with PgBouncer

---

## 13. Testing Strategy

### 13.1 Testing Pyramid

```
        /\
       /  \
      / E2E \        10% - Critical user flows
     /______\
    /        \
   / Integration\    30% - API routes, DB queries
  /______________\
 /                \
/     Unit Tests   \  60% - Components, utilities
/___________________\
```

### 13.2 Test Categories

#### Unit Tests
- Component rendering
- Utility functions
- Form validation

#### Integration Tests
- API route handlers
- Database operations
- Authentication flow

#### E2E Tests
- Complete user journey: signup → reserve → pay → dashboard
- Payment flow (with Razorpay test mode)
- Critical error scenarios

### 13.3 Testing Tools

- **Unit/Integration**: Vitest + React Testing Library
- **E2E**: Playwright or TestSprite
- **API Testing**: Supertest
- **Mocking**: MSW (Mock Service Worker)

---

## 14. Deployment Strategy

### 14.1 Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | localhost:3000 | Local development |
| Preview | pr-*.vercel.app | PR previews |
| Staging | staging.digitalsolar.in | Pre-production testing |
| Production | digitalsolar.in | Live users |

### 14.2 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 14.3 Release Process

1. Create feature branch from `main`
2. Develop and test locally
3. Push and create PR → Auto-deploy to preview
4. Code review + testing on preview
5. Merge to `main` → Auto-deploy to production
6. Monitor error rates and performance

---

## 15. Environment Variables

### 15.1 Required Variables

```bash
# .env.local

# ===========================================
# SUPABASE (KEEP THESE FROM CURRENT PROJECT)
# ===========================================
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# ===========================================
# RAZORPAY
# ===========================================
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# ===========================================
# EMAIL (Resend)
# ===========================================
RESEND_API_KEY=your_resend_api_key

# ===========================================
# APP CONFIG
# ===========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Digital Solar

# ===========================================
# OPTIONAL - Monitoring
# ===========================================
# SENTRY_DSN=your_sentry_dsn
# NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
```

### 15.2 Supabase Dashboard Settings

1. **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000` (dev) or `https://yourdomain.com` (prod)
   - Redirect URLs: Add all valid callback URLs

2. **Authentication → Email Templates**:
   - Customize confirmation and reset password emails

3. **Database → Extensions**:
   - Enable `uuid-ossp` for UUID generation

---

## 16. Project Structure

### 16.1 Recommended Folder Structure

```
digital-solar-v2/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth-related routes (grouped)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   ├── (marketing)/              # Public marketing pages
│   │   ├── page.tsx              # Landing page (/)
│   │   ├── about/
│   │   ├── contact/
│   │   └── pricing/
│   ├── (app)/                    # Protected app pages
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── reserve/
│   │   │   ├── page.tsx
│   │   │   ├── payment/
│   │   │   │   └── page.tsx
│   │   │   └── success/
│   │   │       └── page.tsx
│   │   ├── connect/
│   │   │   └── page.tsx
│   │   ├── bills/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/                      # API routes
│   │   ├── projects/
│   │   │   └── route.ts
│   │   ├── reserve/
│   │   │   └── route.ts
│   │   ├── payments/
│   │   │   ├── create-order/
│   │   │   │   └── route.ts
│   │   │   └── verify/
│   │   │       └── route.ts
│   │   └── user/
│   │       ├── profile/
│   │       │   └── route.ts
│   │       └── utility/
│   │           └── route.ts
│   ├── layout.tsx                # Root layout
│   ├── error.tsx                 # Error boundary
│   ├── loading.tsx               # Loading state
│   └── not-found.tsx             # 404 page
│
├── components/                   # React components
│   ├── ui/                       # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   ├── skeleton.tsx
│   │   ├── toast.tsx
│   │   └── index.ts
│   ├── layout/                   # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── navigation.tsx
│   │   └── sidebar.tsx
│   ├── features/                 # Feature components
│   │   ├── auth/
│   │   ├── projects/
│   │   ├── dashboard/
│   │   └── billing/
│   └── providers/                # Context providers
│       ├── auth-provider.tsx
│       └── query-provider.tsx
│
├── lib/                          # Utilities and config
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── middleware.ts         # Auth middleware
│   ├── utils.ts                  # General utilities
│   ├── validations.ts            # Zod schemas
│   └── constants.ts              # App constants
│
├── hooks/                        # Custom React hooks
│   ├── use-user.ts
│   ├── use-projects.ts
│   └── use-toast.ts
│
├── types/                        # TypeScript types
│   ├── database.ts               # Supabase generated types
│   └── api.ts                    # API types
│
├── public/                       # Static assets
│   ├── images/
│   └── icons/
│
├── styles/                       # Global styles
│   └── globals.css
│
├── middleware.ts                 # Next.js middleware
├── tailwind.config.ts
├── next.config.js
├── package.json
├── tsconfig.json
└── .env.local
```

---

## 17. Development Phases

### Phase 1: Foundation (Week 1-2)

**Goal**: Basic app with authentication and project viewing

**Tasks**:
- [ ] Project setup (Next.js, Tailwind, Supabase)
- [ ] Database schema creation
- [ ] Authentication (signup, login, logout)
- [ ] Landing page
- [ ] Projects listing page
- [ ] Basic UI components

**Deliverables**:
- Users can sign up and log in
- Users can view available projects
- Responsive landing page

---

### Phase 2: Core Flow (Week 3-4)

**Goal**: Complete reservation and payment flow

**Tasks**:
- [ ] Reserve page with capacity selection
- [ ] Razorpay integration
- [ ] Payment verification
- [ ] Allocation creation
- [ ] Success/confirmation page
- [ ] Email notifications

**Deliverables**:
- Users can reserve solar capacity
- Users can pay via Razorpay
- Allocations are created after payment

---

### Phase 3: User Dashboard (Week 5-6)

**Goal**: Functional user dashboard

**Tasks**:
- [ ] Dashboard layout
- [ ] Stats cards (capacity, savings, impact)
- [ ] Allocation details
- [ ] Credit history
- [ ] Activity feed

**Deliverables**:
- Users can see their solar summary
- Users can track credits and savings

---

### Phase 4: Utility & Bills (Week 7-8)

**Goal**: Utility connection and bill management

**Tasks**:
- [ ] Connect utility page
- [ ] State/DISCOM selection
- [ ] Bills listing page
- [ ] Credit application to bills
- [ ] Bill payment (optional)

**Deliverables**:
- Users can link utility provider
- Users can view and pay bills
- Credits are applied to bills

---

### Phase 5: Polish & Launch (Week 9-10)

**Goal**: Production-ready application

**Tasks**:
- [ ] Error handling
- [ ] Loading states
- [ ] Empty states
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Analytics integration
- [ ] Production deployment

**Deliverables**:
- Polished, production-ready app
- Deployed to production domain

---

## Appendix A: Quick Start Commands

```bash
# Create new project
npx create-next-app@latest digital-solar-v2 --typescript --tailwind --app --src-dir=false

# Install dependencies
cd digital-solar-v2
pnpm add @supabase/ssr @supabase/supabase-js
pnpm add framer-motion lucide-react
pnpm add zod @tanstack/react-query
pnpm add -D @types/node

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
pnpm dev
```

## Appendix B: Supabase CLI Commands

```bash
# Login to Supabase
npx supabase login

# Link to existing project
npx supabase link --project-ref your-project-ref

# Generate TypeScript types
npx supabase gen types typescript --linked > types/database.ts

# Run migrations
npx supabase db push

# Reset database (CAUTION: deletes all data)
npx supabase db reset
```

## Appendix C: Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Framer Motion](https://www.framer.com/motion/)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-01-01 | Team | Initial draft |
| 2.0 | 2026-01-07 | AI Assistant | Complete rewrite with simplified auth flow |

---

**End of Document**

