# HOST SOLAR ANALYTICS PLATFORM
## TECHNICAL REQUIREMENTS DOCUMENT (TRD)

**Document Version:** 1.0  
**Last Updated:** February 2026  
**Platform Version:** 1.0.0  
**Classification:** Internal Technical Documentation  
**Author:** PowerNetPro Engineering Team  
**Parent Project:** PowerNetPro Digital Solar Platform v2.0

---

# TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Codebase Analysis Summary](#2-codebase-analysis-summary)
3. [System Overview](#3-system-overview)
4. [Architecture & Technology Stack](#4-architecture--technology-stack)
5. [Database Design](#5-database-design)
6. [API Reference](#6-api-reference)
7. [Authentication & Host Roles](#7-authentication--host-roles)
8. [Core Features](#8-core-features)
9. [UI/UX Design Specifications](#9-uiux-design-specifications)
10. [Animation & Motion Effects](#10-animation--motion-effects)
11. [Charts & Data Visualization](#11-charts--data-visualization)
12. [Illustrations & Graphics](#12-illustrations--graphics)
13. [PPA Financial Module](#13-ppa-financial-module)
14. [Integration Points](#14-integration-points)
15. [Security Implementation](#15-security-implementation)
16. [Testing Strategy](#16-testing-strategy)
17. [Deployment Plan](#17-deployment-plan)
18. [Timeline & Milestones](#18-timeline--milestones)
19. [Future Enhancements](#19-future-enhancements)
20. [Appendix](#20-appendix)

---

# 1. EXECUTIVE SUMMARY

## 1.1 Project Overview

The **PowerNetPro Host Solar Analytics Platform** is a professional, minimalistic web dashboard designed for solar plant **Hosts** (plant owners who lease their land/rooftop for solar installations). This platform enables Hosts to:

1. Monitor real-time and historical solar plant performance
2. View dynamic, animated analytics charts
3. Track monthly payments due to PowerNetPro based on PPA (Power Purchase Agreement) rates
4. Access financial summaries, invoices, and payment history
5. Receive alerts for plant underperformance or maintenance needs

## 1.2 Business Context

```
┌───────────────────────────────────────────────────────────────────────────┐
│                    POWERNETPRO BUSINESS MODEL                              │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   SOLAR HOST                POWERNETPRO                   CONSUMER         │
│   (Plant Owner)             (Platform)                    (Bill Credits)   │
│   ────────────              ─────────────                 ─────────────    │
│                                                                            │
│   Provides Land ─────────►  Installs/Manages  ────────►  Reserves Capacity │
│   & Infrastructure          Solar Plant                   & Gets Credits   │
│                                                                            │
│   Monthly Payment ◄─────── Energy Revenue ◄────────────  ₹35,000/kW        │
│   (PPA Rate × kWh)          Split                        (one-time)        │
│                                                                            │
│   HOST ANALYTICS  ◄─────── Generation Data ◄───────────  Bill Credits     │
│   DASHBOARD                 & Monitoring                 (₹7/kWh)          │
│                                                                            │
└───────────────────────────────────────────────────────────────────────────┘
```

## 1.3 Key Value Propositions for Hosts

| Feature | Description |
|---------|-------------|
| **Real-time Monitoring** | Live plant generation data with animated charts |
| **Financial Transparency** | Clear breakdown of PPA-based payments |
| **Performance Analytics** | Efficiency metrics, trend analysis, and alerts |
| **Professional Interface** | Minimalistic, branded PowerNetPro experience |
| **Payment Tracking** | Monthly dues, payment history, invoice downloads |
| **Environmental Impact** | CO₂ offset and sustainability metrics |

## 1.4 Target Users

- **Primary:** Solar plant Hosts (landowners with installed solar capacity)
- **Capacity Range:** 100 kW - 10 MW per installation
- **Geographic Focus:** India (10+ major states)
- **Use Case:** Monthly performance review and payment reconciliation

---

# 2. CODEBASE ANALYSIS SUMMARY

## 2.1 Existing Platform Overview

The current PowerNetPro platform is **consumer-focused** with the following characteristics:

### Available Resources (Can Reuse)

| Category | Components | Reusability |
|----------|------------|-------------|
| **UI Components** | Cards, Buttons, Inputs, Modals, Toasts | ✅ Full reuse |
| **Animation System** | Framer Motion variants, GSAP presets | ✅ Full reuse |
| **Chart Components** | Chart.js integration, CreditHistoryChart | ✅ Extend for Host |
| **Design System** | Tailwind config, colors, typography | ✅ Full reuse |
| **Database Tables** | `projects`, `generations`, `users` | ✅ Extend with Host fields |
| **Authentication** | Supabase Auth, session management | ✅ Add HOST role |
| **Dashboard Patterns** | StatCard, WelcomeBanner, RealTimeMonitoring | ✅ Adapt for Host |
| **API Structure** | Route patterns, error handling | ✅ Full reuse |

### Missing Components (Need to Build)

| Category | Required Components | Priority |
|----------|---------------------|----------|
| **User Role** | `HOST` role type in database | Critical |
| **Database Tables** | `hosts`, `ppa_agreements`, `host_payments`, `host_invoices` | Critical |
| **Host Dashboard** | New dashboard layout and components | Critical |
| **PPA Module** | Payment calculation based on PPA rates | Critical |
| **API Routes** | Host-specific endpoints | Critical |
| **Charts** | Generation trends, revenue analysis, efficiency gauges | High |
| **Illustrations** | Solar-themed SVG illustrations | High |
| **Invoice System** | PDF generation and download | Medium |
| **Alert System** | Performance alerts and notifications | Medium |

## 2.2 Technology Stack Compatibility

```
EXISTING STACK (COMPATIBLE)                 HOST PLATFORM ADDITIONS
─────────────────────────────               ───────────────────────────
✅ Next.js 14 (App Router)                  + Host-specific pages
✅ React 18.3.1                             + Host dashboard components
✅ TypeScript 5.5.4                         + Host types/interfaces
✅ Tailwind CSS 3.4.7                       + Host-specific styles
✅ Framer Motion 11.3.19                    + Enhanced animations
✅ Chart.js + react-chartjs-2              + Advanced chart types
✅ Supabase (Auth + PostgreSQL)            + Host tables & RLS
✅ Razorpay (optional for Host)            + Host payment tracking
✅ Lucide Icons                             + More icons
✅ GSAP 3.14.2                              + Timeline animations
```

## 2.3 Gaps Identified

1. **No Host Entity:** Current system only tracks `users` (consumers) with roles `USER` and `ADMIN`
2. **No PPA Tracking:** No mechanism to record or calculate PPA-based payments
3. **No Reverse Payment Flow:** Platform collects from consumers; Host payments go the opposite direction
4. **Limited Project Ownership:** `projects` table lacks host ownership relationships
5. **No Host Notifications:** Alert system needed for performance issues
6. **No Invoice Generation:** PDF invoice system required

---

# 3. SYSTEM OVERVIEW

## 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         HOST ANALYTICS PLATFORM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        CLIENT LAYER                                  │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │  Host Web    │  │  Host Mobile │  │   Admin      │               │    │
│  │  │  Dashboard   │  │   (Future)   │  │   Panel      │               │    │
│  │  │  (Next.js)   │  │   (PWA/RN)   │  │  (Extended)  │               │    │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘               │    │
│  └─────────┼─────────────────┼─────────────────┼────────────────────────┘    │
│            │                 │                 │                             │
│            ▼                 ▼                 ▼                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      APPLICATION LAYER                               │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │                  NEXT.JS 14 (App Router)                     │    │    │
│  │  │  ┌────────────┐  ┌────────────┐  ┌────────────┐              │    │    │
│  │  │  │ Host Pages │  │ Host APIs  │  │ Middleware │              │    │    │
│  │  │  │/host/*     │  │/api/host/* │  │(Auth+RLS)  │              │    │    │
│  │  │  └────────────┘  └────────────┘  └────────────┘              │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│            │                 │                 │                             │
│            ▼                 ▼                 ▼                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        SERVICE LAYER                                 │    │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐    │    │
│  │  │ Supabase   │  │   PPA      │  │  Invoice   │  │   Alert    │    │    │
│  │  │   Auth     │  │ Calculator │  │ Generator  │  │  Service   │    │    │
│  │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘    │    │
│  └────────┼───────────────┼───────────────┼───────────────┼──────────────┘   │
│           │               │               │               │                  │
│           ▼               ▼               ▼               ▼                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                          DATA LAYER                                  │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │            SUPABASE (PostgreSQL + Row Level Security)        │    │    │
│  │  │  ┌───────┐ ┌────────┐ ┌────────────┐ ┌─────────────┐        │    │    │
│  │  │  │ hosts │ │projects│ │ppa_agreements│ │host_payments│       │    │    │
│  │  │  └───────┘ └────────┘ └────────────┘ └─────────────┘        │    │    │
│  │  │  ┌───────────┐ ┌──────────┐ ┌───────────┐ ┌───────────┐     │    │    │
│  │  │  │generations│ │host_alerts│ │host_invoices│ │audit_log │    │    │    │
│  │  │  └───────────┘ └──────────┘ └───────────┘ └───────────┘     │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 3.2 Project Structure (New Files)

```
d:\PowerNetPro\PNP-DSnew/
│
├── app/
│   ├── host/                              # HOST DASHBOARD (NEW)
│   │   ├── layout.tsx                     # Host-specific layout
│   │   ├── page.tsx                       # Host dashboard home
│   │   ├── analytics/
│   │   │   └── page.tsx                   # Detailed analytics
│   │   ├── financials/
│   │   │   └── page.tsx                   # PPA payments & invoices
│   │   ├── plants/
│   │   │   ├── page.tsx                   # All plants overview
│   │   │   └── [id]/
│   │   │       └── page.tsx               # Individual plant details
│   │   ├── alerts/
│   │   │   └── page.tsx                   # Performance alerts
│   │   └── settings/
│   │       └── page.tsx                   # Host settings
│   │
│   ├── api/
│   │   └── host/                          # HOST APIs (NEW)
│   │       ├── dashboard/
│   │       │   └── route.ts               # Dashboard summary
│   │       ├── plants/
│   │       │   ├── route.ts               # GET plants list
│   │       │   └── [id]/
│   │       │       ├── route.ts           # GET plant details
│   │       │       └── generation/
│   │       │           └── route.ts       # GET generation data
│   │       ├── financials/
│   │       │   ├── summary/route.ts       # Financial summary
│   │       │   ├── payments/route.ts      # Payment history
│   │       │   └── invoices/route.ts      # Invoice management
│   │       ├── alerts/
│   │       │   └── route.ts               # Host alerts
│   │       └── profile/
│   │           └── route.ts               # Host profile
│   │
│   └── (auth)/
│       └── host-login/                    # Host-specific login (optional)
│           └── page.tsx
│
├── components/
│   ├── host/                              # HOST COMPONENTS (NEW)
│   │   ├── layout/
│   │   │   ├── HostHeader.tsx
│   │   │   ├── HostSidebar.tsx
│   │   │   └── HostFooter.tsx
│   │   ├── dashboard/
│   │   │   ├── PlantOverviewCard.tsx
│   │   │   ├── GenerationGauge.tsx
│   │   │   ├── PaymentDueCard.tsx
│   │   │   ├── PerformanceChart.tsx
│   │   │   ├── RevenueChart.tsx
│   │   │   └── HostWelcomeBanner.tsx
│   │   ├── analytics/
│   │   │   ├── GenerationTrendChart.tsx
│   │   │   ├── EfficiencyComparison.tsx
│   │   │   ├── WeatherImpactChart.tsx
│   │   │   └── PeakHoursAnalysis.tsx
│   │   ├── financials/
│   │   │   ├── PPASummaryCard.tsx
│   │   │   ├── PaymentHistoryTable.tsx
│   │   │   ├── InvoiceList.tsx
│   │   │   └── PaymentCalculator.tsx
│   │   ├── plants/
│   │   │   ├── PlantCard.tsx
│   │   │   ├── PlantStatusBadge.tsx
│   │   │   └── PlantMetricsGrid.tsx
│   │   └── illustrations/
│   │       ├── SolarPanelIllustration.tsx
│   │       ├── SunriseAnimation.tsx
│   │       ├── EnergyFlowDiagram.tsx
│   │       └── EmptyStateIllustration.tsx
│   │
│   └── ui/
│       ├── charts/                        # ENHANCED CHARTS (NEW)
│       │   ├── AreaChart.tsx
│       │   ├── DonutChart.tsx
│       │   ├── BarChart.tsx
│       │   └── SparklineChart.tsx
│       └── gauges/
│           └── CircularGauge.tsx
│
├── lib/
│   ├── host/                              # HOST UTILITIES (NEW)
│   │   ├── ppa-calculator.ts              # PPA payment calculations
│   │   ├── generation-utils.ts            # Generation data helpers
│   │   └── invoice-generator.ts           # PDF invoice generation
│   └── types/
│       └── host.ts                        # Host TypeScript types
│
├── hooks/
│   ├── useHostDashboard.ts                # Host dashboard data (NEW)
│   ├── useGenerationData.ts               # Generation analytics (NEW)
│   └── usePPACalculation.ts               # PPA calculations (NEW)
│
└── supabase/
    └── migrations/
        └── 20260210_host_tables.sql       # Host schema migration (NEW)
```

---

# 4. ARCHITECTURE & TECHNOLOGY STACK

## 4.1 Frontend Technologies

| Technology | Version | Purpose | Notes |
|------------|---------|---------|-------|
| **Next.js** | 14.2.5 | React framework | ✅ Existing |
| **React** | 18.3.1 | UI library | ✅ Existing |
| **TypeScript** | 5.5.4 | Type safety | ✅ Existing |
| **Tailwind CSS** | 3.4.7 | Styling | ✅ Existing |
| **Framer Motion** | 11.3.19 | Animations | ✅ Existing |
| **GSAP** | 3.14.2 | Advanced animations | ✅ Existing |
| **Chart.js** | 4.5.1 | Charts | ✅ Existing + Enhanced |
| **react-chartjs-2** | 5.3.1 | React chart wrapper | ✅ Existing |
| **Lucide React** | 0.427.0 | Icons | ✅ Existing |
| **Zustand** | 4.5.5 | State management | ✅ Existing |
| **TanStack Query** | 5.56.2 | Data fetching | ✅ Existing |
| **@react-pdf/renderer** | 3.x | PDF invoices | 🆕 New |
| **date-fns** | 3.x | Date formatting | 🆕 New |

## 4.2 Backend Technologies

| Technology | Version | Purpose | Notes |
|------------|---------|---------|-------|
| **Next.js API Routes** | 14.2.5 | REST APIs | ✅ Existing |
| **Supabase** | 2.45.4 | BaaS | ✅ Existing |
| **PostgreSQL** | Latest | Database | ✅ Existing + New tables |
| **Zod** | 3.23.8 | Validation | ✅ Existing |
| **Resend** | 6.9.1 | Email | ✅ Existing |

## 4.3 New Dependencies Required

```json
{
  "dependencies": {
    "@react-pdf/renderer": "^3.4.0",
    "date-fns": "^3.6.0",
    "recharts": "^2.12.0"
  }
}
```

---

# 5. DATABASE DESIGN

## 5.1 Entity Relationship Diagram

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                        HOST ANALYTICS DATABASE SCHEMA                           │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────┐       ┌─────────────────┐       ┌─────────────────────┐       │
│  │  auth.users │───────│  public.hosts   │───────│   ppa_agreements    │       │
│  │  (Supabase) │  1:1  │                 │  1:N  │                     │       │
│  └─────────────┘       └────────┬────────┘       └──────────┬──────────┘       │
│                                 │                            │                  │
│                                 │ 1:N                        │ 1:1              │
│                                 ▼                            ▼                  │
│  ┌───────────────────────────────────────────────────────────────────┐         │
│  │                          projects                                  │         │
│  │    (Extended with host_id foreign key)                            │         │
│  └────────────────────────────────┬──────────────────────────────────┘         │
│                                   │                                             │
│              ┌────────────────────┼────────────────────┐                       │
│              │ 1:N                │ 1:N                │ 1:N                    │
│              ▼                    ▼                    ▼                        │
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐              │
│  │   generations   │   │  host_payments  │   │   host_alerts   │              │
│  │  (Existing)     │   │     (NEW)       │   │     (NEW)       │              │
│  └─────────────────┘   └────────┬────────┘   └─────────────────┘              │
│                                 │                                               │
│                                 │ 1:1                                           │
│                                 ▼                                               │
│                        ┌─────────────────┐                                     │
│                        │  host_invoices  │                                     │
│                        │     (NEW)       │                                     │
│                        └─────────────────┘                                     │
│                                                                                 │
└────────────────────────────────────────────────────────────────────────────────┘
```

## 5.2 New Enum Types

```sql
-- Host account status
CREATE TYPE host_status AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE');

-- PPA agreement status
CREATE TYPE ppa_status AS ENUM ('DRAFT', 'ACTIVE', 'EXPIRED', 'TERMINATED');

-- Host payment status
CREATE TYPE host_payment_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'DISPUTED');

-- Invoice status
CREATE TYPE invoice_status AS ENUM ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED');

-- Alert severity
CREATE TYPE alert_severity AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- Alert status
CREATE TYPE alert_status AS ENUM ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED');
```

## 5.3 New Table Definitions

### 5.3.1 Hosts Table

```sql
CREATE TABLE IF NOT EXISTS public.hosts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
    
    -- Business Information
    business_name TEXT NOT NULL,
    business_type TEXT,  -- Individual, Partnership, Company, etc.
    gst_number TEXT CHECK (gst_number ~* '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'),
    pan_number TEXT CHECK (pan_number ~* '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'),
    
    -- Contact Information
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    
    -- Address
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT CHECK (pincode ~* '^[1-9][0-9]{5}$'),
    
    -- Banking Details (for payments)
    bank_name TEXT,
    bank_account_number TEXT,
    bank_ifsc TEXT CHECK (bank_ifsc ~* '^[A-Z]{4}0[A-Z0-9]{6}$'),
    bank_beneficiary_name TEXT,
    
    -- Status
    status host_status DEFAULT 'PENDING'::host_status,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES public.users(id),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT hosts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX idx_hosts_user_id ON public.hosts(user_id);
CREATE INDEX idx_hosts_status ON public.hosts(status);
CREATE INDEX idx_hosts_business_name ON public.hosts(business_name);
```

### 5.3.2 PPA Agreements Table

```sql
CREATE TABLE IF NOT EXISTS public.ppa_agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID NOT NULL REFERENCES public.hosts(id),
    project_id UUID NOT NULL UNIQUE REFERENCES public.projects(id),
    
    -- Contract Details
    agreement_number TEXT NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_years NUMERIC NOT NULL CHECK (duration_years > 0),
    
    -- Pricing Terms
    rate_per_kwh NUMERIC NOT NULL CHECK (rate_per_kwh > 0), -- ₹ Host pays per kWh
    rate_escalation_percent NUMERIC DEFAULT 0, -- Annual escalation %
    minimum_guarantee_kwh NUMERIC, -- Minimum monthly guarantee
    
    -- Capacity
    contracted_capacity_kw NUMERIC NOT NULL CHECK (contracted_capacity_kw > 0),
    
    -- Payment Terms
    payment_due_day INTEGER DEFAULT 10 CHECK (payment_due_day >= 1 AND payment_due_day <= 28),
    payment_grace_days INTEGER DEFAULT 7,
    late_fee_percent NUMERIC DEFAULT 2.0,
    
    -- Status
    status ppa_status DEFAULT 'DRAFT'::ppa_status,
    signed_at TIMESTAMPTZ,
    
    -- Document Storage (Supabase Storage paths)
    agreement_document_path TEXT,
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- Indexes
CREATE INDEX idx_ppa_agreements_host_id ON public.ppa_agreements(host_id);
CREATE INDEX idx_ppa_agreements_project_id ON public.ppa_agreements(project_id);
CREATE INDEX idx_ppa_agreements_status ON public.ppa_agreements(status);
```

### 5.3.3 Host Payments Table

```sql
CREATE TABLE IF NOT EXISTS public.host_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID NOT NULL REFERENCES public.hosts(id),
    ppa_agreement_id UUID NOT NULL REFERENCES public.ppa_agreements(id),
    invoice_id UUID REFERENCES public.host_invoices(id),
    
    -- Period
    billing_month INTEGER NOT NULL CHECK (billing_month >= 1 AND billing_month <= 12),
    billing_year INTEGER NOT NULL CHECK (billing_year >= 2020 AND billing_year <= 2100),
    
    -- Generation Data
    generation_kwh NUMERIC NOT NULL CHECK (generation_kwh >= 0),
    
    -- Calculation
    rate_per_kwh NUMERIC NOT NULL,
    base_amount NUMERIC NOT NULL, -- generation_kwh × rate_per_kwh
    adjustments NUMERIC DEFAULT 0, -- Any adjustments (+/-)
    late_fee NUMERIC DEFAULT 0,
    total_amount NUMERIC NOT NULL, -- Final payable amount
    
    -- Payment Details
    status host_payment_status DEFAULT 'PENDING'::host_payment_status,
    due_date DATE NOT NULL,
    paid_at TIMESTAMPTZ,
    payment_method TEXT, -- Bank Transfer, Cheque, etc.
    payment_reference TEXT,
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_billing_period UNIQUE (host_id, billing_month, billing_year)
);

-- Indexes
CREATE INDEX idx_host_payments_host_id ON public.host_payments(host_id);
CREATE INDEX idx_host_payments_status ON public.host_payments(status);
CREATE INDEX idx_host_payments_period ON public.host_payments(billing_year, billing_month);
CREATE INDEX idx_host_payments_due_date ON public.host_payments(due_date);
```

### 5.3.4 Host Invoices Table

```sql
CREATE TABLE IF NOT EXISTS public.host_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID NOT NULL REFERENCES public.hosts(id),
    payment_id UUID UNIQUE REFERENCES public.host_payments(id),
    
    -- Invoice Details
    invoice_number TEXT NOT NULL UNIQUE,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    
    -- Amounts
    subtotal NUMERIC NOT NULL,
    tax_amount NUMERIC DEFAULT 0,
    total_amount NUMERIC NOT NULL,
    
    -- Status
    status invoice_status DEFAULT 'DRAFT'::invoice_status,
    sent_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    
    -- Document (PDF stored in Supabase Storage)
    pdf_path TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_host_invoices_host_id ON public.host_invoices(host_id);
CREATE INDEX idx_host_invoices_status ON public.host_invoices(status);
CREATE INDEX idx_host_invoices_invoice_number ON public.host_invoices(invoice_number);
```

### 5.3.5 Host Alerts Table

```sql
CREATE TABLE IF NOT EXISTS public.host_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID NOT NULL REFERENCES public.hosts(id),
    project_id UUID REFERENCES public.projects(id),
    
    -- Alert Details
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    severity alert_severity NOT NULL DEFAULT 'INFO'::alert_severity,
    status alert_status DEFAULT 'ACTIVE'::alert_status,
    
    -- Alert Type Categories
    category TEXT NOT NULL CHECK (category IN (
        'GENERATION', -- Low generation alerts
        'MAINTENANCE', -- Scheduled/unscheduled maintenance
        'PAYMENT', -- Payment related
        'SYSTEM', -- System notifications
        'WEATHER' -- Weather impact alerts
    )),
    
    -- Metadata
    metadata JSONB, -- Additional context data
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by UUID REFERENCES public.users(id),
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES public.users(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_host_alerts_host_id ON public.host_alerts(host_id);
CREATE INDEX idx_host_alerts_status ON public.host_alerts(status);
CREATE INDEX idx_host_alerts_severity ON public.host_alerts(severity);
CREATE INDEX idx_host_alerts_active ON public.host_alerts(host_id) WHERE status = 'ACTIVE';
```

### 5.3.6 Extend Projects Table

```sql
-- Add host_id to existing projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS host_id UUID REFERENCES public.hosts(id);

-- Add index
CREATE INDEX IF NOT EXISTS idx_projects_host_id ON public.projects(host_id);
```

## 5.4 Row Level Security (RLS) Policies

```sql
-- Enable RLS on new tables
ALTER TABLE public.hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ppa_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_alerts ENABLE ROW LEVEL SECURITY;

-- Hosts: Can only view/update own record
CREATE POLICY "Hosts can view own profile" ON public.hosts
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Hosts can update own profile" ON public.hosts
    FOR UPDATE USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- PPA Agreements: Hosts can view their own
CREATE POLICY "Hosts can view own PPAs" ON public.ppa_agreements
    FOR SELECT USING (
        host_id IN (SELECT id FROM public.hosts WHERE user_id = auth.uid())
    );

-- Host Payments: Hosts can view their own
CREATE POLICY "Hosts can view own payments" ON public.host_payments
    FOR SELECT USING (
        host_id IN (SELECT id FROM public.hosts WHERE user_id = auth.uid())
    );

-- Host Invoices: Hosts can view their own
CREATE POLICY "Hosts can view own invoices" ON public.host_invoices
    FOR SELECT USING (
        host_id IN (SELECT id FROM public.hosts WHERE user_id = auth.uid())
    );

-- Host Alerts: Hosts can view/update their own
CREATE POLICY "Hosts can view own alerts" ON public.host_alerts
    FOR SELECT USING (
        host_id IN (SELECT id FROM public.hosts WHERE user_id = auth.uid())
    );

CREATE POLICY "Hosts can acknowledge own alerts" ON public.host_alerts
    FOR UPDATE USING (
        host_id IN (SELECT id FROM public.hosts WHERE user_id = auth.uid())
    );

-- Projects: Hosts can view their own projects
DROP POLICY IF EXISTS "Anyone can view active projects" ON public.projects;
CREATE POLICY "View projects policy" ON public.projects
    FOR SELECT USING (
        status = 'ACTIVE'::project_status
        OR host_id IN (SELECT id FROM public.hosts WHERE user_id = auth.uid())
    );

-- Generations: Hosts can view generations for their projects
CREATE POLICY "Hosts can view own project generations" ON public.generations
    FOR SELECT USING (
        project_id IN (
            SELECT p.id FROM public.projects p
            JOIN public.hosts h ON p.host_id = h.id
            WHERE h.user_id = auth.uid()
        )
        OR true -- Keep existing public access
    );
```

---

# 6. API REFERENCE

## 6.1 API Overview

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/host/dashboard` | GET | Host | Dashboard summary metrics |
| `/api/host/plants` | GET | Host | List host's solar plants |
| `/api/host/plants/[id]` | GET | Host | Individual plant details |
| `/api/host/plants/[id]/generation` | GET | Host | Plant generation data |
| `/api/host/financials/summary` | GET | Host | Financial overview |
| `/api/host/financials/payments` | GET | Host | Payment history |
| `/api/host/financials/payments/[id]` | GET | Host | Payment details |
| `/api/host/financials/invoices` | GET | Host | Invoice list |
| `/api/host/financials/invoices/[id]/download` | GET | Host | Download invoice PDF |
| `/api/host/alerts` | GET | Host | Get active alerts |
| `/api/host/alerts/[id]/acknowledge` | POST | Host | Acknowledge alert |
| `/api/host/profile` | GET | Host | Get host profile |
| `/api/host/profile` | PUT | Host | Update host profile |

## 6.2 Detailed API Specifications

### 6.2.1 Dashboard API

**GET /api/host/dashboard**

Returns comprehensive dashboard summary.

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalPlants": 3,
      "totalCapacityKw": 1500,
      "activePlants": 3,
      "overallEfficiency": 92.5
    },
    "generation": {
      "todayKwh": 4250.5,
      "thisMonthKwh": 127515.0,
      "lastMonthKwh": 135000.0,
      "monthOverMonthChange": -5.5,
      "yearToDateKwh": 1458000.0
    },
    "financials": {
      "currentMonthDue": 254030.0,
      "pendingPayments": 0,
      "yearToDatePaid": 2789100.0,
      "nextPaymentDue": "2026-02-10"
    },
    "alerts": {
      "critical": 0,
      "warning": 1,
      "info": 3
    },
    "recentActivity": [
      {
        "type": "generation",
        "message": "Plant A generated 150.5 kWh today",
        "timestamp": "2026-02-10T18:00:00Z"
      }
    ]
  }
}
```

### 6.2.2 Plants API

**GET /api/host/plants**

Returns list of host's solar plants.

**Query Parameters:**
- `status` (optional): Filter by status ('ACTIVE', 'MAINTENANCE', etc.)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Vedvyas Solar Park",
      "location": "Cuttack, Odisha",
      "capacityKw": 500,
      "status": "ACTIVE",
      "todayGenerationKwh": 1875.5,
      "efficiency": 93.2,
      "ppaRate": 3.50,
      "monthlyDue": 93487.50
    }
  ]
}
```

**GET /api/host/plants/[id]/generation**

Returns detailed generation data for a plant.

**Query Parameters:**
- `period`: 'day' | 'week' | 'month' | 'year'
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalKwh": 127515.0,
      "avgDailyKwh": 4250.5,
      "peakKwh": 5100.0,
      "peakDate": "2026-02-05",
      "minKwh": 3200.0,
      "minDate": "2026-02-08"
    },
    "timeSeries": [
      {
        "date": "2026-02-01",
        "generationKwh": 4350.0,
        "efficiency": 94.5,
        "weather": "sunny"
      }
    ],
    "hourlyDistribution": [
      { "hour": 6, "avgKwh": 50.0 },
      { "hour": 7, "avgKwh": 150.0 },
      { "hour": 12, "avgKwh": 520.0 }
    ]
  }
}
```

### 6.2.3 Financials API

**GET /api/host/financials/summary**

Returns financial overview for the host.

**Response:**
```json
{
  "success": true,
  "data": {
    "currentBilling": {
      "month": 2,
      "year": 2026,
      "generationKwh": 127515.0,
      "ratePerKwh": 3.50,
      "baseAmount": 446302.50,
      "adjustments": 0,
      "totalDue": 446302.50,
      "dueDate": "2026-02-10",
      "status": "PENDING"
    },
    "yearToDate": {
      "totalGeneration": 1458000.0,
      "totalPaid": 5103000.0,
      "totalPending": 446302.50
    },
    "paymentTrend": [
      { "month": "Jan 2026", "amount": 485150.00 },
      { "month": "Dec 2025", "amount": 502000.00 }
    ],
    "ppaDetails": {
      "agreementNumber": "PPA-2024-001",
      "startDate": "2024-01-01",
      "endDate": "2036-12-31",
      "ratePerKwh": 3.50,
      "escalationPercent": 3.0,
      "contractedCapacityKw": 1500
    }
  }
}
```

**GET /api/host/financials/payments**

Returns payment history with pagination.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `status` (optional): Filter by payment status
- `year` (optional): Filter by year

**Response:**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "uuid",
        "month": 1,
        "year": 2026,
        "generationKwh": 138550.0,
        "ratePerKwh": 3.50,
        "baseAmount": 484925.00,
        "adjustments": 0,
        "lateFee": 0,
        "totalAmount": 484925.00,
        "status": "COMPLETED",
        "dueDate": "2026-01-10",
        "paidAt": "2026-01-08T10:30:00Z",
        "invoiceId": "uuid"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 24,
      "totalPages": 3
    }
  }
}
```

---

# 7. AUTHENTICATION & HOST ROLES

## 7.1 Role Extension

```typescript
// Extend existing user_role enum
type UserRole = 'USER' | 'ADMIN' | 'HOST';

// Host-specific permissions
interface HostPermissions {
  viewOwnPlants: boolean;
  viewOwnGeneration: boolean;
  viewOwnPayments: boolean;
  downloadInvoices: boolean;
  updateProfile: boolean;
  acknowledgeAlerts: boolean;
}
```

## 7.2 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    HOST AUTHENTICATION FLOW                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. HOST SIGNUP (Admin-initiated or Self-signup with verification)      │
│  ───────────────────────────────────────────────────────────────────    │
│  Admin ──► Create auth.user ──► Create hosts record ──► Send invite    │
│                                                                          │
│  2. HOST LOGIN                                                           │
│  ─────────────                                                           │
│  Host ──► /login ──► Supabase Auth ──► Check role ──► Redirect          │
│                                           │                              │
│                               ┌───────────┴───────────┐                 │
│                               │                       │                  │
│                         role = 'HOST'           role = 'USER'            │
│                               │                       │                  │
│                               ▼                       ▼                  │
│                        /host/dashboard          /dashboard               │
│                                                                          │
│  3. PROTECTED ROUTES                                                     │
│  ───────────────────                                                     │
│  /host/* ──► Middleware ──► Verify HOST role ──► Allow/Deny            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## 7.3 Middleware Implementation

```typescript
// middleware.ts extension
const hostRoutes = ['/host', '/api/host'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if host route
  const isHostRoute = hostRoutes.some(route => pathname.startsWith(route));
  
  if (isHostRoute) {
    const supabase = await createServerClient(request);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Verify HOST role
    const { data: host } = await supabase
      .from('hosts')
      .select('id, status')
      .eq('user_id', user.id)
      .single();
    
    if (!host || host.status !== 'ACTIVE') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
  
  return NextResponse.next();
}
```

---

# 8. CORE FEATURES

## 8.1 Dashboard Home

### Primary Metrics Display

| Metric | Description | Update Frequency |
|--------|-------------|------------------|
| **Total Capacity** | Sum of all plant capacities in kW | Static |
| **Today's Generation** | Real-time cumulative kWh today | 5 minutes |
| **This Month's Generation** | Month-to-date generation | Hourly |
| **Current Month Due** | Calculated payment amount | Daily |
| **Plant Efficiency** | Actual vs expected generation % | Hourly |
| **Active Alerts** | Count of unresolved alerts | Real-time |

### Quick Actions

1. View All Plants
2. Download Latest Invoice
3. View Payment History
4. Check Alerts

## 8.2 Plant Analytics

### Features

1. **Real-time Generation Gauge**
   - Current power output in kW
   - Animated needle/arc
   - Efficiency percentage

2. **Generation Trend Charts**
   - Daily/Weekly/Monthly/Yearly views
   - Area charts with gradient fills
   - Comparison with previous periods

3. **Peak Hours Analysis**
   - Hourly distribution bar chart
   - Identify optimal generation hours
   - Weather correlation

4. **Efficiency Comparison**
   - Compare across plants
   - Historical efficiency trends
   - Performance ranking

## 8.3 Financial Analytics

### Features

1. **PPA Summary Card**
   - Agreement details
   - Current rate
   - Contract duration remaining

2. **Monthly Payment Calculator**
   - Real-time calculation display
   - Formula breakdown
   - Adjustments visibility

3. **Payment History Table**
   - Sortable/filterable
   - Status badges
   - Quick invoice download

4. **Revenue Trend Chart**
   - Year-over-year comparison
   - Projected vs actual

## 8.4 Alert System

### Alert Categories

| Category | Triggers | Severity |
|----------|----------|----------|
| **Generation** | Output < 70% of expected | Warning/Critical |
| **Maintenance** | Scheduled maintenance due | Info/Warning |
| **Payment** | Payment due/overdue | Info/Warning |
| **Weather** | Expected weather impact | Info |
| **System** | Platform notifications | Info |

### Alert Actions

1. View details
2. Acknowledge
3. Mark resolved
4. Set reminder

---

# 9. UI/UX DESIGN SPECIFICATIONS

## 9.1 Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Professional** | Clean layouts, consistent spacing, business-appropriate colors |
| **Minimalistic** | Focused content, reduced visual clutter, white space |
| **Data-forward** | Prominent metrics, clear data hierarchy |
| **Responsive** | Mobile-first, adaptive layouts |
| **Accessible** | WCAG 2.1 AA compliance |

## 9.2 Color Palette

```css
/* Primary Brand Colors */
--primary-green: #0D2818;     /* Forest green - headers, accents */
--primary-green-light: #1B5E3E;
--primary-gold: #FFB800;      /* Gold - CTAs, highlights */

/* Semantic Colors */
--success: #22C55E;           /* Green - positive metrics */
--warning: #F59E0B;           /* Amber - warnings */
--error: #EF4444;             /* Red - critical alerts */
--info: #3B82F6;              /* Blue - informational */

/* Neutral Colors */
--background: #FAFAFA;        /* Light gray background */
--surface: #FFFFFF;           /* Card backgrounds */
--text-primary: #1A1A1A;      /* Primary text */
--text-secondary: #6B7280;    /* Secondary text */
--border: #E5E7EB;            /* Borders, dividers */

/* Chart Colors */
--chart-primary: #0D2818;
--chart-secondary: #FFB800;
--chart-tertiary: #22C55E;
--chart-gradient-start: rgba(13, 40, 24, 0.2);
--chart-gradient-end: rgba(13, 40, 24, 0);
```

## 9.3 Typography

```css
/* Font Families */
--font-heading: 'Space Grotesk', sans-serif;
--font-body: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Font Sizes */
--text-4xl: 2.25rem;    /* 36px - Page titles */
--text-3xl: 1.875rem;   /* 30px - Section headers */
--text-2xl: 1.5rem;     /* 24px - Card titles */
--text-xl: 1.25rem;     /* 20px - Large text */
--text-lg: 1.125rem;    /* 18px - Subheadings */
--text-base: 1rem;      /* 16px - Body text */
--text-sm: 0.875rem;    /* 14px - Small text */
--text-xs: 0.75rem;     /* 12px - Labels, captions */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## 9.4 Layout Grid

```
Desktop (1280px+):
┌──────────────────────────────────────────────────────────────────────┐
│  Sidebar (240px)  │              Main Content (flex-1)               │
│                   │                                                   │
│  - Logo           │  ┌─────────────────────────────────────────────┐ │
│  - Navigation     │  │  Welcome Banner / Page Header                │ │
│  - Quick Stats    │  └─────────────────────────────────────────────┘ │
│                   │                                                   │
│                   │  ┌──────────┬──────────┬──────────┬──────────┐  │
│                   │  │ Stat 1   │ Stat 2   │ Stat 3   │ Stat 4   │  │
│                   │  └──────────┴──────────┴──────────┴──────────┘  │
│                   │                                                   │
│                   │  ┌─────────────────────┬───────────────────────┐ │
│                   │  │   Primary Chart     │   Secondary Content   │ │
│                   │  │   (2/3 width)       │   (1/3 width)         │ │
│                   │  └─────────────────────┴───────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘

Tablet (768px - 1279px):
┌──────────────────────────────────────────────────────────────────────┐
│  Collapsible Sidebar          Main Content (full width)             │
└──────────────────────────────────────────────────────────────────────┘

Mobile (< 768px):
┌──────────────────────────────────────────────────────────────────────┐
│  Bottom Navigation / Hamburger Menu                                   │
│  Full-width stacked content                                          │
└──────────────────────────────────────────────────────────────────────┘
```

## 9.5 Component Specifications

### Stat Cards

```
┌────────────────────────────────┐
│  ┌───┐                         │
│  │ 🔆│  Today's Generation     │
│  └───┘                         │
│                                │
│  4,250.5 kWh                   │  <- Large metric value
│                                │
│  ↑ 12.5% vs yesterday          │  <- Trend indicator
└────────────────────────────────┘

Properties:
- Width: Responsive (25% on desktop, 50% on tablet, 100% on mobile)
- Padding: 24px
- Border Radius: 12px
- Shadow: sm
- Animation: Scale on hover, number count-up
```

### Chart Cards

```
┌──────────────────────────────────────────────────────────────┐
│  Generation Trend                        [Day] [Week] [Month]│  <- Title + Period selector
│                                                              │
│         ╭──────╮                                            │
│        ╱        ╲                                           │
│      ╱            ──────                                    │  <- Animated line/area chart
│    ╱                    ╲                                   │
│  ──                      ────                               │
│  Feb 1    Feb 5    Feb 10    Feb 15    Feb 20              │
│                                                              │
│  Legend: ● Current Period  ○ Previous Period                │
└──────────────────────────────────────────────────────────────┘

Properties:
- Min Height: 300px
- Padding: 24px
- Chart Animation: Draw on scroll, smooth transitions
```

---

# 10. ANIMATION & MOTION EFFECTS

## 10.1 Animation Philosophy

| Type | Duration | Easing | Use Case |
|------|----------|--------|----------|
| **Micro** | 150-200ms | ease-out | Buttons, toggles, hover states |
| **Standard** | 300-400ms | cubic-bezier(0.16, 1, 0.3, 1) | Cards, modals, navigation |
| **Elaborate** | 500-800ms | spring | Page transitions, data updates |
| **Continuous** | 2-4s | infinite | Loading states, live indicators |

## 10.2 Page Transitions

```typescript
// Page enter animation
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1
    }
  },
  exit: { opacity: 0, y: -20 }
};
```

## 10.3 Chart Animations

### Line/Area Charts

```typescript
const chartAnimation = {
  initial: { pathLength: 0, opacity: 0 },
  animate: { 
    pathLength: 1, 
    opacity: 1,
    transition: { 
      pathLength: { duration: 1.5, ease: "easeInOut" },
      opacity: { duration: 0.5 }
    }
  }
};
```

### Bar Charts

```typescript
const barAnimation = {
  initial: { scaleY: 0, originY: 1 },
  animate: (i: number) => ({
    scaleY: 1,
    transition: { delay: i * 0.05, duration: 0.5, ease: "easeOut" }
  })
};
```

### Gauge Animations

```typescript
const gaugeAnimation = {
  initial: { rotate: -90 },
  animate: (value: number) => ({
    rotate: -90 + (value / 100) * 180,
    transition: { duration: 1, ease: "easeOut" }
  })
};
```

## 10.4 Scroll Animations

```typescript
// Reveal on scroll
const scrollReveal = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Usage with Intersection Observer
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={scrollReveal}
>
  {/* Content */}
</motion.div>
```

## 10.5 Number Animations

```typescript
// Animated counter for metrics
const AnimatedNumber = ({ value, duration = 1 }) => {
  const [display, setDisplay] = useState(0);
  
  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      setDisplay(Math.floor(value * easeOutCubic(progress)));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);
  
  return <span>{display.toLocaleString('en-IN')}</span>;
};
```

## 10.6 Live Pulse Indicator

```typescript
// Pulsing dot for real-time data
const LivePulse = () => (
  <motion.div
    className="w-2 h-2 bg-green-500 rounded-full"
    animate={{
      scale: [1, 1.5, 1],
      opacity: [1, 0.5, 1]
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);
```

---

# 11. CHARTS & DATA VISUALIZATION

## 11.1 Chart Library Configuration

### Chart.js Global Config

```typescript
// lib/chart-config.ts
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// Global defaults
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = '#6B7280';
Chart.defaults.animation = {
  duration: 1000,
  easing: 'easeOutQuart'
};
Chart.defaults.plugins.legend.display = false;
Chart.defaults.plugins.tooltip.backgroundColor = '#1A1A1A';
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
```

## 11.2 Chart Components

### Generation Trend Chart (Area)

```typescript
interface GenerationChartProps {
  data: { date: string; value: number }[];
  period: 'day' | 'week' | 'month' | 'year';
  showComparison?: boolean;
}

const GenerationTrendChart: React.FC<GenerationChartProps> = ({
  data,
  period,
  showComparison
}) => {
  const chartData = {
    labels: data.map(d => formatDate(d.date, period)),
    datasets: [{
      label: 'Generation (kWh)',
      data: data.map(d => d.value),
      fill: true,
      backgroundColor: createGradient('#0D2818'),
      borderColor: '#0D2818',
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#FFB800'
    }]
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Line data={chartData} options={chartOptions} />
    </motion.div>
  );
};
```

### Efficiency Gauge (Donut)

```typescript
const EfficiencyGauge: React.FC<{ efficiency: number }> = ({ efficiency }) => {
  const data = {
    datasets: [{
      data: [efficiency, 100 - efficiency],
      backgroundColor: [
        efficiency >= 90 ? '#22C55E' : efficiency >= 70 ? '#F59E0B' : '#EF4444',
        '#E5E7EB'
      ],
      borderWidth: 0,
      cutout: '80%'
    }]
  };
  
  return (
    <div className="relative w-48 h-48">
      <Doughnut data={data} options={gaugeOptions} />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-3xl font-bold"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          {efficiency}%
        </motion.span>
      </div>
    </div>
  );
};
```

### Revenue Bar Chart

```typescript
const RevenueChart: React.FC<{ data: MonthlyRevenue[] }> = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.month),
    datasets: [{
      label: 'Revenue (₹)',
      data: data.map(d => d.amount),
      backgroundColor: '#0D2818',
      borderRadius: 8,
      barThickness: 20
    }]
  };
  
  return (
    <Bar 
      data={chartData} 
      options={{
        ...barChartOptions,
        scales: {
          y: {
            ticks: {
              callback: (value) => formatCurrency(value)
            }
          }
        }
      }} 
    />
  );
};
```

### Hourly Distribution Heatmap

```typescript
const HourlyHeatmap: React.FC<{ data: HourlyData[] }> = ({ data }) => {
  return (
    <div className="grid grid-cols-24 gap-1">
      {data.map((hour, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.02 }}
          className="aspect-square rounded"
          style={{
            backgroundColor: getHeatmapColor(hour.value, maxValue)
          }}
          title={`${hour.hour}:00 - ${hour.value} kWh`}
        />
      ))}
    </div>
  );
};
```

## 11.3 Sparkline Charts

```typescript
const Sparkline: React.FC<{ data: number[]; color?: string }> = ({ 
  data, 
  color = '#0D2818' 
}) => {
  const chartData = {
    labels: data.map((_, i) => i),
    datasets: [{
      data,
      borderColor: color,
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 0
    }]
  };
  
  return (
    <div className="h-10 w-24">
      <Line 
        data={chartData} 
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: { x: { display: false }, y: { display: false } },
          plugins: { legend: { display: false }, tooltip: { enabled: false } }
        }} 
      />
    </div>
  );
};
```

---

# 12. ILLUSTRATIONS & GRAPHICS

## 12.1 Illustration Style Guide

| Attribute | Specification |
|-----------|---------------|
| **Style** | Flat design with subtle gradients |
| **Colors** | Primary palette (forest green, gold, white) |
| **Complexity** | Simple, recognizable shapes |
| **Stroke** | 2px consistent stroke weight |
| **Corners** | Rounded (8-12px radius) |
| **Animation** | Subtle motion on hover/load |

## 12.2 Required Illustrations

### 1. Solar Panel Hero Illustration

```tsx
// components/host/illustrations/SolarPanelIllustration.tsx
const SolarPanelIllustration = () => (
  <motion.svg
    viewBox="0 0 400 300"
    initial="hidden"
    animate="visible"
  >
    {/* Sun with animated rays */}
    <motion.circle
      cx="320" cy="60" r="40"
      fill="#FFB800"
      variants={sunVariants}
    />
    
    {/* Solar panels with reflection effect */}
    <motion.rect
      x="50" y="120" width="120" height="80"
      fill="#0D2818"
      variants={panelVariants}
    />
    
    {/* Energy flow particles */}
    <motion.g variants={energyFlowVariants}>
      {/* Animated particles */}
    </motion.g>
  </motion.svg>
);
```

### 2. Empty State Illustrations

```tsx
// For no data / no plants
const NoDataIllustration = () => (
  <svg viewBox="0 0 200 200">
    {/* Minimalist solar panel outline */}
    {/* Subtle question mark or search icon */}
  </svg>
);

// For no alerts
const NoAlertsIllustration = () => (
  <svg viewBox="0 0 200 200">
    {/* Checkmark with sun rays */}
    {/* "All good" visual metaphor */}
  </svg>
);
```

### 3. Dashboard Background Elements

```tsx
// Subtle decorative elements
const DashboardDecoration = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Grid pattern */}
    <svg className="absolute top-0 right-0 w-1/3 h-1/3 opacity-5">
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0D2818" strokeWidth="0.5"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)"/>
    </svg>
    
    {/* Gradient blob */}
    <motion.div
      className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-radial from-gold/10 to-transparent rounded-full blur-3xl"
      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 8, repeat: Infinity }}
    />
  </div>
);
```

### 4. Status Icons (Animated)

```tsx
// Success / Active status
const ActiveStatusIcon = () => (
  <motion.div
    className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring" }}
  >
    <motion.svg viewBox="0 0 24 24" className="w-5 h-5 text-green-600">
      <motion.path
        d="M5 12l5 5L20 7"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
    </motion.svg>
  </motion.div>
);
```

## 12.3 Lottie Animations (Optional)

For more complex animations, consider using Lottie:

```typescript
// Animated energy flow
import Lottie from 'lottie-react';
import energyFlowAnimation from './animations/energy-flow.json';

const EnergyFlowAnimation = () => (
  <Lottie
    animationData={energyFlowAnimation}
    loop={true}
    className="w-64 h-64"
  />
);
```

---

# 13. PPA FINANCIAL MODULE

## 13.1 PPA Calculation Logic

### Constants

```typescript
// lib/host/ppa-calculator.ts

export interface PPAConfig {
  ratePerKwh: number;          // ₹ per kWh
  escalationPercent: number;   // Annual rate increase %
  contractStartDate: Date;
  paymentDueDay: number;       // Day of month
  gracePeriodDays: number;
  lateFeePercent: number;
}

export const DEFAULT_PPA_CONFIG: PPAConfig = {
  ratePerKwh: 3.50,
  escalationPercent: 3.0,
  contractStartDate: new Date('2024-01-01'),
  paymentDueDay: 10,
  gracePeriodDays: 7,
  lateFeePercent: 2.0
};
```

### Calculation Functions

```typescript
/**
 * Calculate monthly payment based on generation and PPA terms
 */
export function calculateMonthlyPayment(
  generationKwh: number,
  ppaConfig: PPAConfig,
  billingDate: Date
): PaymentCalculation {
  // Calculate escalated rate
  const yearsElapsed = differenceInYears(billingDate, ppaConfig.contractStartDate);
  const escalatedRate = ppaConfig.ratePerKwh * 
    Math.pow(1 + ppaConfig.escalationPercent / 100, yearsElapsed);
  
  // Base amount
  const baseAmount = generationKwh * escalatedRate;
  
  // Calculate due date
  const dueDate = setDate(billingDate, ppaConfig.paymentDueDay);
  
  return {
    generationKwh,
    ratePerKwh: Number(escalatedRate.toFixed(4)),
    baseAmount: Number(baseAmount.toFixed(2)),
    adjustments: 0,
    lateFee: 0,
    totalAmount: Number(baseAmount.toFixed(2)),
    dueDate,
    gracePeriodEndDate: addDays(dueDate, ppaConfig.gracePeriodDays)
  };
}

/**
 * Calculate late fee if payment is overdue
 */
export function calculateLateFee(
  amount: number,
  dueDate: Date,
  paymentDate: Date,
  lateFeePercent: number
): number {
  if (paymentDate <= dueDate) return 0;
  
  const daysLate = differenceInDays(paymentDate, dueDate);
  const monthsLate = Math.ceil(daysLate / 30);
  
  return Number((amount * (lateFeePercent / 100) * monthsLate).toFixed(2));
}

/**
 * Get current rate with escalation
 */
export function getCurrentRate(ppaConfig: PPAConfig): number {
  const yearsElapsed = differenceInYears(new Date(), ppaConfig.contractStartDate);
  return ppaConfig.ratePerKwh * 
    Math.pow(1 + ppaConfig.escalationPercent / 100, yearsElapsed);
}
```

### Payment Summary Types

```typescript
export interface PaymentCalculation {
  generationKwh: number;
  ratePerKwh: number;
  baseAmount: number;
  adjustments: number;
  lateFee: number;
  totalAmount: number;
  dueDate: Date;
  gracePeriodEndDate: Date;
}

export interface YearlyFinancialSummary {
  year: number;
  totalGeneration: number;
  totalAmountDue: number;
  totalPaid: number;
  totalPending: number;
  averageMonthlyGeneration: number;
  averageMonthlyPayment: number;
  months: MonthlyFinancialSummary[];
}

export interface MonthlyFinancialSummary {
  month: number;
  year: number;
  generation: number;
  amountDue: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  paidAt?: Date;
}
```

## 13.2 Invoice Generation

```typescript
// lib/host/invoice-generator.ts
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

export async function generateInvoicePDF(invoice: InvoiceData): Promise<Blob> {
  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with PowerNetPro Logo */}
        <View style={styles.header}>
          <Text style={styles.companyName}>PowerNetPro</Text>
          <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
        </View>
        
        {/* Invoice Details */}
        <View style={styles.invoiceInfo}>
          <View style={styles.row}>
            <Text>Invoice No: {invoice.invoiceNumber}</Text>
            <Text>Date: {formatDate(invoice.invoiceDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text>Due Date: {formatDate(invoice.dueDate)}</Text>
            <Text>Period: {invoice.billingPeriod}</Text>
          </View>
        </View>
        
        {/* Bill To */}
        <View style={styles.billTo}>
          <Text style={styles.sectionTitle}>Bill To:</Text>
          <Text>{invoice.hostName}</Text>
          <Text>{invoice.hostAddress}</Text>
          <Text>GSTIN: {invoice.hostGst}</Text>
        </View>
        
        {/* Line Items */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Description</Text>
            <Text style={styles.col2}>Quantity</Text>
            <Text style={styles.col3}>Rate</Text>
            <Text style={styles.col4}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.col1}>Solar Generation ({invoice.billingPeriod})</Text>
            <Text style={styles.col2}>{invoice.generationKwh} kWh</Text>
            <Text style={styles.col3}>₹{invoice.ratePerKwh}/kWh</Text>
            <Text style={styles.col4}>₹{formatNumber(invoice.baseAmount)}</Text>
          </View>
        </View>
        
        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Subtotal:</Text>
            <Text>₹{formatNumber(invoice.subtotal)}</Text>
          </View>
          {invoice.adjustments !== 0 && (
            <View style={styles.totalRow}>
              <Text>Adjustments:</Text>
              <Text>₹{formatNumber(invoice.adjustments)}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text>GST (18%):</Text>
            <Text>₹{formatNumber(invoice.taxAmount)}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text>Grand Total:</Text>
            <Text>₹{formatNumber(invoice.totalAmount)}</Text>
          </View>
        </View>
        
        {/* Payment Instructions */}
        <View style={styles.paymentInfo}>
          <Text style={styles.sectionTitle}>Payment Instructions:</Text>
          <Text>Bank: {invoice.bankDetails.bankName}</Text>
          <Text>Account: {invoice.bankDetails.accountNumber}</Text>
          <Text>IFSC: {invoice.bankDetails.ifsc}</Text>
          <Text>Beneficiary: PowerNetPro Energy Pvt. Ltd.</Text>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text>This is a computer-generated invoice.</Text>
          <Text>For queries: accounts@powernetpro.com | +91 8180861415</Text>
        </View>
      </Page>
    </Document>
  );
  
  return await pdf(doc).toBlob();
}
```

## 13.3 Payment Tracking UI

```typescript
// components/host/financials/PaymentDueCard.tsx
interface PaymentDueCardProps {
  payment: CurrentPaymentDue;
}

const PaymentDueCard: React.FC<PaymentDueCardProps> = ({ payment }) => {
  const daysUntilDue = differenceInDays(payment.dueDate, new Date());
  const isOverdue = daysUntilDue < 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-6 rounded-xl border-2",
        isOverdue ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Payment Due</h3>
        <span className={cn(
          "px-3 py-1 rounded-full text-sm font-medium",
          isOverdue ? "bg-red-500 text-white" : "bg-green-500 text-white"
        )}>
          {isOverdue ? 'Overdue' : `Due in ${daysUntilDue} days`}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Generation</span>
          <span className="font-medium">{formatNumber(payment.generationKwh)} kWh</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Rate</span>
          <span className="font-medium">₹{payment.ratePerKwh}/kWh</span>
        </div>
        <div className="border-t pt-3 flex justify-between">
          <span className="text-lg font-semibold">Total Due</span>
          <motion.span
            className="text-2xl font-bold text-forest"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            ₹{formatIndianNumber(payment.totalAmount)}
          </motion.span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <div className="text-sm text-gray-500">
          <p>Due Date: {formatDate(payment.dueDate)}</p>
          <p>For: {payment.billingPeriod}</p>
        </div>
      </div>
    </motion.div>
  );
};
```

---

# 14. INTEGRATION POINTS

## 14.1 With Existing PowerNetPro Platform

### Shared Resources

| Resource | Integration Type | Notes |
|----------|------------------|-------|
| Authentication | Shared Supabase | Single auth, role differentiation |
| Database | Extended schema | New tables for Host entities |
| UI Components | Reused | Buttons, Cards, Inputs, etc. |
| Design System | Shared | Colors, typography, animations |
| API Patterns | Consistent | Same error handling, validation |

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATA INTEGRATION FLOW                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  PROJECTS TABLE                                                          │
│  ─────────────                                                           │
│  ┌─────────────────┐                                                    │
│  │ id, name, ...   │                                                    │
│  │ host_id (NEW)   │───────────────────────────────────────┐           │
│  │ total_kw        │                                       │            │
│  └────────┬────────┘                                       │            │
│           │                                                 │            │
│           │ Project belongs to Host                         │            │
│           ▼                                                 ▼            │
│  ┌─────────────────┐                              ┌─────────────────┐   │
│  │ GENERATIONS     │         Shared Data          │ HOSTS           │   │
│  │ ─────────────── │◄─────────────────────────────│ ───────────────  │   │
│  │ project_id      │                              │ user_id         │   │
│  │ kwh             │                              │ business_name   │   │
│  │ month, year     │                              │ contact_info    │   │
│  └────────┬────────┘                              └────────┬────────┘   │
│           │                                                 │            │
│           │ Used by both                                    │            │
│           ▼                                                 ▼            │
│  ┌─────────────────────────┐              ┌─────────────────────────┐   │
│  │ CONSUMER DASHBOARD      │              │ HOST ANALYTICS          │   │
│  │ ───────────────────────  │              │ ─────────────────────── │   │
│  │ - Bill credits          │              │ - Generation analytics  │   │
│  │ - Savings calculations  │              │ - PPA payments          │   │
│  │ - Allocation tracking   │              │ - Invoices              │   │
│  └─────────────────────────┘              └─────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## 14.2 External Integrations

### Weather API (Future)

```typescript
interface WeatherIntegration {
  provider: 'OpenWeatherMap' | 'WeatherAPI';
  purpose: 'Generation correlation, forecasting';
  dataPoints: ['solar_radiation', 'cloud_cover', 'temperature'];
}
```

### Inverter/Meter API (Future)

```typescript
interface MeterIntegration {
  type: 'Real-time monitoring';
  protocols: ['Modbus', 'REST API'];
  frequency: '5-minute intervals';
  data: ['instantaneous_power', 'cumulative_energy', 'status'];
}
```

---

# 15. SECURITY IMPLEMENTATION

## 15.1 Host-Specific Security

### RLS Policies Summary

```sql
-- All Host data is strictly isolated by host_id
-- Only the authenticated host can access their own data
-- Admins have full access for support purposes

-- Example: Host can only see their payment data
CREATE POLICY "host_payments_access" ON host_payments
  FOR ALL
  USING (host_id IN (SELECT id FROM hosts WHERE user_id = auth.uid()))
  WITH CHECK (host_id IN (SELECT id FROM hosts WHERE user_id = auth.uid()));
```

### API Route Protection

```typescript
// lib/host/auth.ts
export async function requireHostAuth(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return { error: 'UNAUTHORIZED', status: 401 };
  }
  
  const { data: host } = await supabase
    .from('hosts')
    .select('id, status')
    .eq('user_id', user.id)
    .single();
  
  if (!host) {
    return { error: 'NOT_A_HOST', status: 403 };
  }
  
  if (host.status !== 'ACTIVE') {
    return { error: 'HOST_INACTIVE', status: 403 };
  }
  
  return { user, host };
}
```

### Sensitive Data Handling

| Data Type | Protection |
|-----------|------------|
| Bank Details | Encrypted at rest, masked in UI |
| GST/PAN | Validated format, hashed storage |
| Contact Info | Rate-limited access |
| Invoices | Signed URLs, time-limited access |

---

# 16. TESTING STRATEGY

## 16.1 Test Categories

### Unit Tests

```typescript
// __tests__/lib/ppa-calculator.test.ts
describe('PPA Calculator', () => {
  describe('calculateMonthlyPayment', () => {
    it('should calculate correct base amount', () => {
      const result = calculateMonthlyPayment(10000, DEFAULT_PPA_CONFIG, new Date());
      expect(result.baseAmount).toBe(35000); // 10000 * 3.50
    });
    
    it('should apply escalation correctly', () => {
      const futureDate = addYears(DEFAULT_PPA_CONFIG.contractStartDate, 2);
      const result = calculateMonthlyPayment(10000, DEFAULT_PPA_CONFIG, futureDate);
      // Rate after 2 years: 3.50 * (1.03)^2 = 3.7122
      expect(result.ratePerKwh).toBeCloseTo(3.7122, 4);
    });
    
    it('should calculate late fee correctly', () => {
      const dueDate = new Date('2026-01-10');
      const paymentDate = new Date('2026-02-15');
      const fee = calculateLateFee(35000, dueDate, paymentDate, 2);
      expect(fee).toBe(700); // 2% for ~1 month late
    });
  });
});
```

### Integration Tests

```typescript
// __tests__/api/host/dashboard.test.ts
describe('Host Dashboard API', () => {
  it('should return 401 for unauthenticated requests', async () => {
    const response = await fetch('/api/host/dashboard');
    expect(response.status).toBe(401);
  });
  
  it('should return dashboard data for authenticated host', async () => {
    const response = await authenticatedFetch('/api/host/dashboard', hostToken);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('overview');
    expect(data.data).toHaveProperty('generation');
    expect(data.data).toHaveProperty('financials');
  });
});
```

### E2E Tests (Playwright)

```typescript
// tests/host-dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Host Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsHost(page);
  });
  
  test('should display dashboard metrics', async ({ page }) => {
    await page.goto('/host');
    
    await expect(page.locator('[data-testid="total-generation"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-due"]')).toBeVisible();
    await expect(page.locator('[data-testid="efficiency-gauge"]')).toBeVisible();
  });
  
  test('should navigate to plant details', async ({ page }) => {
    await page.goto('/host');
    await page.click('[data-testid="plant-card"]:first-child');
    
    await expect(page).toHaveURL(/\/host\/plants\/[a-z0-9-]+/);
    await expect(page.locator('h1')).toContainText('Plant Details');
  });
  
  test('should download invoice', async ({ page }) => {
    await page.goto('/host/financials');
    
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="download-invoice"]:first-child');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toMatch(/invoice-.*\.pdf/);
  });
});
```

## 16.2 Test Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| PPA Calculations | 100% | Critical |
| API Routes | 90% | Critical |
| UI Components | 80% | High |
| E2E Critical Paths | 100% | Critical |

---

# 17. DEPLOYMENT PLAN

## 17.1 Deployment Phases

### Phase 1: Database Migration

```bash
# Apply new schema
supabase db push

# Verify RLS policies
supabase db test
```

### Phase 2: API Deployment

```bash
# Deploy API routes first (backward compatible)
vercel --prod

# Verify API health
curl https://powernetpro.com/api/host/health
```

### Phase 3: UI Deployment

```bash
# Deploy full application
vercel --prod

# Smoke tests
npm run test:e2e:prod
```

## 17.2 Feature Flags

```typescript
// lib/feature-flags.ts
export const HOST_FEATURES = {
  HOST_DASHBOARD_ENABLED: process.env.NEXT_PUBLIC_HOST_DASHBOARD === 'true',
  HOST_INVOICES_ENABLED: process.env.NEXT_PUBLIC_HOST_INVOICES === 'true',
  HOST_ALERTS_ENABLED: process.env.NEXT_PUBLIC_HOST_ALERTS === 'true',
};
```

## 17.3 Rollback Plan

1. Revert Vercel deployment to previous version
2. Database migrations use forward-compatible changes
3. Feature flags allow disabling Host features without redeploy

---

# 18. TIMELINE & MILESTONES

## 18.1 Development Phases

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Phase 1: Foundation** | 2 weeks | Database schema, Auth extension, Basic layout |
| **Phase 2: Dashboard** | 2 weeks | Host dashboard, Stat cards, Overview charts |
| **Phase 3: Analytics** | 2 weeks | Detailed charts, Generation analytics, Performance metrics |
| **Phase 4: Financials** | 2 weeks | PPA module, Payment tracking, Invoice generation |
| **Phase 5: Polish** | 1 week | Animations, Illustrations, Responsive design |
| **Phase 6: Testing** | 1 week | Unit tests, E2E tests, Security audit |
| **Phase 7: Deployment** | 1 week | Staging, Production, Monitoring |

## 18.2 Milestone Checklist

### Milestone 1: Core Infrastructure (Week 2)
- [ ] Database schema deployed
- [ ] Host authentication working
- [ ] Basic layout and navigation
- [ ] RLS policies verified

### Milestone 2: Dashboard MVP (Week 4)
- [ ] Dashboard home with key metrics
- [ ] Plant overview cards
- [ ] Basic generation chart
- [ ] API routes functional

### Milestone 3: Full Analytics (Week 6)
- [ ] Detailed generation analytics
- [ ] Efficiency comparisons
- [ ] Hourly distribution charts
- [ ] Trend analysis

### Milestone 4: Financial Module (Week 8)
- [ ] PPA calculation engine
- [ ] Payment tracking
- [ ] Invoice generation
- [ ] Payment history

### Milestone 5: Production Ready (Week 10)
- [ ] All animations implemented
- [ ] Responsive design complete
- [ ] 80%+ test coverage
- [ ] Performance optimized

### Milestone 6: Launch (Week 11)
- [ ] Production deployment
- [ ] Monitoring configured
- [ ] Documentation complete
- [ ] Support team trained

---

# 19. FUTURE ENHANCEMENTS

## 19.1 Phase 2 Features

| Feature | Description | Priority |
|---------|-------------|----------|
| **Mobile App** | React Native version | High |
| **Real-time Monitoring** | Live meter data integration | High |
| **Predictive Analytics** | ML-based generation forecasting | Medium |
| **Multi-plant Comparison** | Cross-plant analytics | Medium |
| **Automated Payments** | Scheduled payment processing | Medium |

## 19.2 Phase 3 Features

| Feature | Description | Priority |
|---------|-------------|----------|
| **Maintenance Scheduling** | Planned maintenance calendar | Medium |
| **Document Management** | Contracts, permits, documents | Medium |
| **Team Access** | Multiple users per Host | Low |
| **API Access** | Programmatic data access for Hosts | Low |
| **White-label Option** | Custom branding for large Hosts | Low |

---

# 20. APPENDIX

## 20.1 Glossary

| Term | Definition |
|------|------------|
| **Host** | Solar plant owner who partners with PowerNetPro |
| **PPA** | Power Purchase Agreement - contract defining energy rates |
| **kWh** | Kilowatt-hour - unit of energy generation |
| **Escalation** | Annual rate increase as per PPA terms |
| **Efficiency** | Ratio of actual vs expected generation |

## 20.2 Reference Links

- [PowerNetPro Main TRD](./COMPREHENSIVE_TRD.md)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [Framer Motion API](https://www.framer.com/motion/)
- [React PDF Renderer](https://react-pdf.org/)

## 20.3 Related Documents

- [COMPREHENSIVE_TRD.md](./COMPREHENSIVE_TRD.md) - Main platform documentation
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Project overview
- [INDEX.md](./INDEX.md) - Documentation index

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 2026 | Engineering Team | Initial document |

---

*This document is confidential and intended for internal use only.*

**© 2026 PowerNetPro. All rights reserved.**