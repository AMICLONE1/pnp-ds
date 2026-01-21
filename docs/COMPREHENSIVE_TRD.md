# POWERNETPRO DIGITAL SOLAR PLATFORM
## COMPREHENSIVE TECHNICAL REQUIREMENTS DOCUMENT (TRD)

**Document Version:** 3.0
**Last Updated:** January 2026
**Platform Version:** 2.0.0
**Classification:** Internal Technical Documentation
**Author:** PowerNetPro Engineering Team

---

# TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [System Overview](#2-system-overview)
3. [Architecture & Technology Stack](#3-architecture--technology-stack)
4. [Database Design](#4-database-design)
5. [API Reference](#5-api-reference)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Business Logic & Core Features](#7-business-logic--core-features)
8. [Third-Party Integrations](#8-third-party-integrations)
9. [Security Implementation](#9-security-implementation)
10. [Frontend Architecture](#10-frontend-architecture)
11. [Testing Strategy](#11-testing-strategy)
12. [Configuration Management](#12-configuration-management)
13. [Performance Optimizations](#13-performance-optimizations)
14. [Deployment & Infrastructure](#14-deployment--infrastructure)
15. [Security Audit Checklist](#15-security-audit-checklist)
16. [Production Launch Checklist](#16-production-launch-checklist)
17. [Todo List for Launch Readiness](#17-todo-list-for-launch-readiness)
18. [Known Limitations & Technical Debt](#18-known-limitations--technical-debt)
19. [Future Roadmap](#19-future-roadmap)
20. [Appendix](#20-appendix)

---

# 1. EXECUTIVE SUMMARY

## 1.1 Project Overview

**PowerNetPro** is India's first comprehensive Community Solar Platform that enables users to participate in solar energy generation without installing panels on their property. Users reserve capacity from verified solar projects and receive automatic electricity bill credits based on energy generation.

## 1.2 Business Model

```
┌─────────────────────────────────────────────────────────────────┐
│                    POWERNETPRO BUSINESS MODEL                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  USER                  POWERNETPRO               SOLAR PROJECT   │
│  ────                  ───────────               ─────────────   │
│                                                                  │
│  ₹35,000/kW ────────► Capacity Reservation ────► Energy Gen     │
│  (one-time)                                                      │
│                                                                  │
│  Solar Credits ◄────── Monthly Credits ◄─────── Generation Data │
│  (₹7/kWh)              Calculation              (4.5 kWh/kW/day)│
│                                                                  │
│  Bill Payment ────────► Auto Credit ───────────► DISCOM Bills   │
│                         Application                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 1.3 Key Value Propositions

| Feature | Value |
|---------|-------|
| **No Installation** | Reserve solar capacity without rooftop panels |
| **Bill Credits** | ₹7 per kWh generated applied to electricity bills |
| **Guaranteed Generation** | 75% secured generation guarantee |
| **ROI** | ~3.5-4 years payback period |
| **Environmental Impact** | 0.9 kg CO2 offset per kWh |
| **Lifespan** | 12.3 years project duration |

## 1.4 Target Market

- **Primary:** Urban residential consumers in India (10 major states)
- **Capacity Range:** 1-100 kW per user
- **Supported DISCOMs:** 50+ across Maharashtra, Karnataka, Tamil Nadu, Gujarat, Rajasthan, Delhi, UP, West Bengal, Punjab, Haryana

---

# 2. SYSTEM OVERVIEW

## 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                   │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐               │
│  │  Web Browser  │  │   Mobile PWA  │  │  Admin Panel  │               │
│  │  (React/Next) │  │   (Future)    │  │   (Future)    │               │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘               │
└──────────┼──────────────────┼──────────────────┼────────────────────────┘
           │                  │                  │
           ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                                 │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    NEXT.JS 14 (App Router)                       │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │   │
│  │  │   Pages     │  │ API Routes  │  │ Middleware  │              │   │
│  │  │ (React SSR) │  │ (REST API)  │  │ (Auth/Rate) │              │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
           │                  │                  │
           ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SERVICE LAYER                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │  Supabase   │  │  Razorpay   │  │    BBPS     │  │  Email/SMS  │   │
│  │   Auth      │  │  Payments   │  │   Bills     │  │  (Future)   │   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────────────┘   │
└─────────┼────────────────┼────────────────┼─────────────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                                      │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │              SUPABASE (PostgreSQL + Row Level Security)          │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │   │
│  │  │  users  │ │projects │ │payments │ │  bills  │ │ credits │   │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

## 2.2 Project Structure

```
d:\PowerNetPro\PNP-DSnew/
│
├── app/                              # Next.js App Router
│   ├── api/                          # REST API endpoints
│   │   ├── allocations/route.ts      # Capacity allocation API
│   │   ├── bills/                    # Bill management APIs
│   │   │   ├── route.ts              # GET/POST bills
│   │   │   ├── fetch/route.ts        # BBPS bill fetching
│   │   │   ├── manual/route.ts       # Manual bill entry
│   │   │   └── pay/route.ts          # Bill payment
│   │   ├── credits/route.ts          # Credit ledger API
│   │   ├── dashboard/summary/route.ts # Dashboard metrics
│   │   ├── monitoring/realtime/route.ts # Real-time data
│   │   ├── newsletter/subscribe/route.ts # Newsletter
│   │   ├── notifications/route.ts    # User notifications
│   │   ├── payments/                 # Payment processing
│   │   │   ├── create-order/route.ts # Razorpay order
│   │   │   └── verify/route.ts       # Payment verification
│   │   ├── projects/route.ts         # Solar projects API
│   │   ├── stats/live/route.ts       # Platform statistics
│   │   └── user/                     # User management
│   │       ├── profile/route.ts      # Profile CRUD
│   │       └── utility/route.ts      # Utility connection
│   │
│   ├── (pages)/                      # Application pages
│   │   ├── page.tsx                  # Landing page
│   │   ├── dashboard/page.tsx        # User dashboard
│   │   ├── reserve/                  # Reservation flow
│   │   │   ├── page.tsx              # Project selection
│   │   │   ├── payment/page.tsx      # Payment page
│   │   │   └── success/page.tsx      # Confirmation
│   │   ├── bills/page.tsx            # Bill management
│   │   ├── connect/page.tsx          # Utility connection
│   │   ├── settings/page.tsx         # User settings
│   │   ├── login/page.tsx            # Authentication
│   │   ├── signup/page.tsx           # Registration
│   │   └── (info)/                   # Static pages
│   │       ├── help/page.tsx
│   │       ├── contact/page.tsx
│   │       ├── privacy/page.tsx
│   │       ├── terms/page.tsx
│   │       └── refund/page.tsx
│   │
│   ├── layout.tsx                    # Root layout
│   ├── error.tsx                     # Error boundary
│   └── not-found.tsx                 # 404 page
│
├── components/                       # React components
│   ├── features/                     # Feature components
│   │   ├── bills/                    # Bill-related
│   │   ├── dashboard/                # Dashboard widgets
│   │   ├── landing/                  # Landing page sections
│   │   ├── notifications/            # Notification UI
│   │   └── projects/                 # Project components
│   ├── layout/                       # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── PageLoader.tsx
│   ├── ui/                           # UI primitives
│   │   ├── animations/               # Animation components
│   │   ├── skeletons/                # Loading skeletons
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── toast.tsx
│   └── providers/                    # Context providers
│
├── lib/                              # Utility libraries
│   ├── supabase/                     # Supabase clients
│   │   ├── client.ts                 # Browser client
│   │   ├── server.ts                 # Server client
│   │   ├── admin.ts                  # Admin client (bypasses RLS)
│   │   └── middleware.ts             # Session management
│   ├── security/                     # Security utilities
│   │   ├── rateLimiter.ts            # Rate limiting
│   │   ├── inputSanitizer.ts         # XSS prevention
│   │   └── securityHeaders.ts        # HTTP headers
│   ├── bbps/                         # BBPS integration
│   │   └── client.ts                 # BBPS API client
│   ├── validations.ts                # Zod schemas
│   ├── constants.ts                  # State/DISCOM data
│   ├── solar-constants.ts            # Solar calculations
│   └── utils.ts                      # General utilities
│
├── hooks/                            # Custom React hooks
│   ├── useScrollAnimation.ts
│   ├── useHeroAnimation.ts
│   ├── useStatsCounter.ts
│   └── useGesture.ts
│
├── supabase/                         # Database
│   ├── schema.sql                    # Complete DB schema
│   ├── seed_projects.sql             # Sample data
│   └── migrations/                   # Schema migrations
│
├── tests/                            # Playwright E2E tests
├── cypress/                          # Cypress component tests
├── testsprite_tests/                 # TestSprite suite
│
├── docs/                             # Documentation
├── public/                           # Static assets
│
├── middleware.ts                     # Next.js middleware
├── instrumentation.ts                # Error suppression
├── next.config.js                    # Next.js config
├── tailwind.config.ts                # Tailwind config
├── tsconfig.json                     # TypeScript config
├── package.json                      # Dependencies
└── .env.local                        # Environment variables
```

---

# 3. ARCHITECTURE & TECHNOLOGY STACK

## 3.1 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2.5 | React framework with App Router |
| **React** | 18.3.1 | UI component library |
| **TypeScript** | 5.5.4 | Type-safe JavaScript |
| **Tailwind CSS** | 3.4.7 | Utility-first CSS |
| **Framer Motion** | 11.3.19 | React animation library |
| **GSAP** | 3.14.2 | Advanced animation engine |
| **Three.js** | 0.169.0 | 3D graphics library |
| **@react-three/fiber** | 8.16.0 | React renderer for Three.js |
| **@react-three/drei** | 9.105.0 | Three.js helpers |
| **Zustand** | 4.5.5 | State management |
| **TanStack Query** | 5.56.2 | Data fetching & caching |
| **Lucide React** | 0.427.0 | Icon library |

## 3.2 Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 14.2.5 | REST API endpoints |
| **Supabase** | 2.45.4 | Backend-as-a-Service |
| **PostgreSQL** | Latest | Primary database (via Supabase) |
| **Razorpay** | 2.9.2 | Payment gateway |
| **Zod** | 3.23.8 | Schema validation |
| **DOMPurify** | 2.35.0 | XSS sanitization |

## 3.3 Infrastructure

| Service | Purpose |
|---------|---------|
| **Supabase** | Auth, Database, Realtime, Storage |
| **Vercel** (recommended) | Deployment & CDN |
| **Cloudflare Tunnel** | Development tunneling |

## 3.4 Development Tools

| Tool | Purpose |
|------|---------|
| **Playwright** | E2E testing |
| **Cypress** | Component testing |
| **ESLint** | Code linting |
| **PostCSS** | CSS processing |

---

# 4. DATABASE DESIGN

## 4.1 Entity Relationship Diagram

```
┌────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE SCHEMA                                   │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐       ┌─────────────────┐       ┌─────────────────┐       │
│  │  auth.users │───────│  public.users   │───────│  allocations    │       │
│  │  (Supabase) │  1:1  │                 │  1:N  │                 │       │
│  └─────────────┘       └────────┬────────┘       └────────┬────────┘       │
│                                 │                         │                 │
│                                 │ 1:N                     │ 1:1             │
│                                 ▼                         ▼                 │
│  ┌─────────────┐       ┌─────────────────┐       ┌─────────────────┐       │
│  │  projects   │───────│ capacity_blocks │───────│                 │       │
│  │             │  1:N  │                 │       │                 │       │
│  └──────┬──────┘       └─────────────────┘       │    payments     │       │
│         │                                         │                 │       │
│         │ 1:N                                     └────────┬────────┘       │
│         ▼                                                  │                │
│  ┌─────────────┐                                           │ 1:N            │
│  │ generations │                                           │                │
│  │             │       ┌─────────────────┐                 │                │
│  └─────────────┘       │  public.users   │◄────────────────┘                │
│                        │                 │                                   │
│                        └────────┬────────┘                                  │
│                                 │                                            │
│              ┌──────────────────┼──────────────────┐                        │
│              │ 1:N              │ 1:N              │ 1:N                     │
│              ▼                  ▼                  ▼                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ credit_ledgers  │  │     bills       │  │  notifications  │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │                        audit_log                             │           │
│  │  (Tracks all INSERT/UPDATE/DELETE across tables)             │           │
│  └─────────────────────────────────────────────────────────────┘           │
└────────────────────────────────────────────────────────────────────────────┘
```

## 4.2 Enum Types

```sql
-- Project lifecycle status
CREATE TYPE project_status AS ENUM ('DRAFT', 'ACTIVE', 'MAINTENANCE', 'RETIRED');

-- Capacity block availability
CREATE TYPE capacity_block_status AS ENUM ('AVAILABLE', 'ALLOCATED', 'SUSPENDED');

-- Payment processing status
CREATE TYPE payment_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- Credit lifecycle
CREATE TYPE credit_ledger_status AS ENUM ('PENDING', 'APPLIED', 'EXPIRED');
CREATE TYPE credit_ledger_type AS ENUM ('GENERATION', 'ADJUSTMENT', 'REFUND');

-- Payment categorization
CREATE TYPE payment_type AS ENUM ('ALLOCATION', 'MONTHLY', 'BILL');

-- Bill tracking
CREATE TYPE bill_status AS ENUM ('PENDING', 'PAID', 'OVERDUE');

-- User verification
CREATE TYPE kyc_status AS ENUM ('PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED');
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
```

## 4.3 Table Definitions

### 4.3.1 Users Table

```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    phone TEXT UNIQUE CHECK (phone ~* '^\+?[1-9]\d{9,14}$'),
    name TEXT,
    kyc_status kyc_status DEFAULT 'PENDING',
    aadhaar_number TEXT UNIQUE,
    pan_number TEXT,
    utility_consumer_number TEXT,
    state TEXT,
    discom TEXT,
    role user_role DEFAULT 'USER',
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
```

### 4.3.2 Projects Table

```sql
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    spv_id TEXT NOT NULL UNIQUE,  -- Special Purpose Vehicle ID
    name TEXT NOT NULL,
    total_kw NUMERIC NOT NULL,
    rate_per_kwh NUMERIC NOT NULL,
    location TEXT NOT NULL,
    state TEXT NOT NULL,
    status project_status DEFAULT 'DRAFT',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
```

### 4.3.3 Capacity Blocks Table

```sql
CREATE TABLE public.capacity_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id),
    kw NUMERIC NOT NULL CHECK (kw > 0),
    status capacity_block_status DEFAULT 'AVAILABLE',
    allocated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.3.4 Allocations Table

```sql
CREATE TABLE public.allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    capacity_block_id UUID NOT NULL UNIQUE REFERENCES capacity_blocks(id),
    payment_id UUID REFERENCES payments(id),
    capacity_kw NUMERIC NOT NULL CHECK (capacity_kw > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.3.5 Payments Table

```sql
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    amount NUMERIC NOT NULL CHECK (amount > 0),
    type payment_type NOT NULL,
    status payment_status DEFAULT 'PENDING',
    transaction_id TEXT UNIQUE,
    gateway TEXT,
    gateway_order_id TEXT,
    gateway_payment_id TEXT,
    metadata JSONB,
    bill_id UUID REFERENCES bills(id),
    refunded_at TIMESTAMPTZ,
    refund_amount NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.3.6 Credit Ledgers Table

```sql
CREATE TABLE public.credit_ledgers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    amount NUMERIC NOT NULL,
    type credit_ledger_type NOT NULL,
    status credit_ledger_status DEFAULT 'PENDING',
    month INTEGER CHECK (month >= 1 AND month <= 12),
    year INTEGER CHECK (year >= 2000 AND year <= 2100),
    ref_id UUID,
    ref_type TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.3.7 Bills Table

```sql
CREATE TABLE public.bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    discom TEXT NOT NULL,
    bill_number TEXT,
    amount NUMERIC NOT NULL CHECK (amount >= 0),
    credits_applied NUMERIC DEFAULT 0 CHECK (credits_applied >= 0),
    due_date TIMESTAMPTZ NOT NULL,
    status bill_status DEFAULT 'PENDING',
    bbps_bill_id TEXT UNIQUE,
    fetched_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.3.8 Generations Table

```sql
CREATE TABLE public.generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id),
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL CHECK (year >= 2000 AND year <= 2100),
    kwh NUMERIC NOT NULL CHECK (kwh >= 0),
    validated BOOLEAN DEFAULT FALSE,
    source TEXT,
    validated_by UUID REFERENCES users(id),
    validated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.3.9 Notifications Table

```sql
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.3.10 Audit Log Table

```sql
CREATE TABLE public.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 4.4 Database Indexes

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);

-- Allocations
CREATE INDEX idx_allocations_user_id ON allocations(user_id);
CREATE INDEX idx_allocations_capacity_block_id ON allocations(capacity_block_id);
CREATE INDEX idx_allocations_payment_id ON allocations(payment_id);

-- Capacity Blocks
CREATE INDEX idx_capacity_blocks_project_id ON capacity_blocks(project_id);
CREATE INDEX idx_capacity_blocks_status ON capacity_blocks(status);

-- Payments
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);

-- Credit Ledgers
CREATE INDEX idx_credit_ledgers_user_id ON credit_ledgers(user_id);
CREATE INDEX idx_credit_ledgers_period ON credit_ledgers(year, month);
CREATE INDEX idx_credit_ledgers_status ON credit_ledgers(status);

-- Bills
CREATE INDEX idx_bills_user_id ON bills(user_id);
CREATE INDEX idx_bills_status ON bills(status);
CREATE INDEX idx_bills_bbps_bill_id ON bills(bbps_bill_id);

-- Generations
CREATE INDEX idx_generations_project_id ON generations(project_id);
CREATE INDEX idx_generations_period ON generations(year, month);

-- Notifications (partial index for unread)
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read = FALSE;

-- Audit Log
CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
```

## 4.5 Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE capacity_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_ledgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Users: Only own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Projects: Public read for active
CREATE POLICY "Anyone can view active projects" ON projects FOR SELECT USING (status = 'ACTIVE');

-- Capacity Blocks: Public read for available
CREATE POLICY "Anyone can view available blocks" ON capacity_blocks FOR SELECT USING (status = 'AVAILABLE');

-- Allocations: Own data only
CREATE POLICY "Users can view own allocations" ON allocations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own allocations" ON allocations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own allocations" ON allocations FOR UPDATE USING (auth.uid() = user_id);

-- Payments: Own data only
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Credit Ledgers: Own data only
CREATE POLICY "Users can view own credits" ON credit_ledgers FOR SELECT USING (auth.uid() = user_id);

-- Generations: Public (transparency)
CREATE POLICY "Anyone can view generations" ON generations FOR SELECT USING (true);

-- Bills: Own data only
CREATE POLICY "Users can view own bills" ON bills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bills" ON bills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bills" ON bills FOR UPDATE USING (auth.uid() = user_id);

-- Notifications: Own data only
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Audit Log: Admin only
CREATE POLICY "Admins can view audit log" ON audit_log FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);
```

## 4.6 Database Triggers

```sql
-- Auto-create user profile on auth signup
CREATE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)))
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update timestamps
CREATE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_allocations_updated_at BEFORE UPDATE ON allocations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_capacity_blocks_updated_at BEFORE UPDATE ON capacity_blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_credit_ledgers_updated_at BEFORE UPDATE ON credit_ledgers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON bills FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

# 5. API REFERENCE

## 5.1 API Overview

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/projects` | GET | No | List active solar projects |
| `/api/allocations` | GET | Yes | Get user's allocations |
| `/api/allocations` | POST | Yes | Create new allocation |
| `/api/payments/create-order` | POST | Yes | Create Razorpay order |
| `/api/payments/verify` | POST | Yes | Verify payment |
| `/api/user/profile` | GET | Yes | Get user profile |
| `/api/user/profile` | PUT | Yes | Update user profile |
| `/api/user/utility` | PUT | Yes | Connect utility provider |
| `/api/bills` | GET | Yes | Get user's bills |
| `/api/bills` | POST | Yes | Create manual bill |
| `/api/bills/fetch` | POST | Yes | Fetch bill from BBPS |
| `/api/credits` | GET | Yes | Get credit ledger |
| `/api/dashboard/summary` | GET | Yes | Dashboard metrics |
| `/api/notifications` | GET | Yes | User notifications |
| `/api/stats/live` | GET | No | Platform statistics |
| `/api/newsletter/subscribe` | POST | No | Subscribe to newsletter |

## 5.2 Detailed API Specifications

### 5.2.1 Projects API

**GET /api/projects**

Returns all active solar projects with available capacity.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "spv_id": "MAH-SOLAR-001",
      "name": "Maharashtra Solar Farm",
      "total_kw": 500000,
      "rate_per_kwh": 5.00,
      "location": "Nagpur, Maharashtra",
      "state": "Maharashtra",
      "status": "ACTIVE",
      "description": "...",
      "available_capacity_kw": 450000
    }
  ]
}
```

### 5.2.2 Allocations API

**POST /api/allocations**

Create a new capacity allocation.

**Request:**
```json
{
  "project_id": "uuid",
  "capacity_kw": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "capacity_block_id": "uuid",
    "capacity_kw": 5,
    "created_at": "2026-01-21T00:00:00Z"
  }
}
```

**Validation:**
- `capacity_kw`: 1-100 kW
- Project must be ACTIVE
- Sufficient capacity must be available

### 5.2.3 Payments API

**POST /api/payments/create-order**

Initialize a Razorpay payment order.

**Request:**
```json
{
  "amount": 175000,
  "allocation_id": "uuid",
  "payment_type": "allocation"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order_id": "order_xxx",
    "amount": 17500000,
    "currency": "INR",
    "payment_id": "uuid",
    "key": "rzp_test_xxx",
    "mock": false
  }
}
```

**POST /api/payments/verify**

Verify completed payment with signature validation.

**Request:**
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_hash",
  "allocation_id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "COMPLETED",
    "gateway_payment_id": "pay_xxx"
  }
}
```

### 5.2.4 User Profile API

**PUT /api/user/profile**

**Request:**
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "email_notifications": true,
  "sms_notifications": false
}
```

**PUT /api/user/utility**

**Request:**
```json
{
  "state": "Maharashtra",
  "discom": "MSEDCL",
  "utility_consumer_number": "1234567890"
}
```

### 5.2.5 Bills API

**POST /api/bills/fetch**

Fetch bill from BBPS (or mock in development).

**Response:**
```json
{
  "success": true,
  "data": {
    "bill_number": "MSE-202601-12345",
    "amount": 2500.50,
    "due_date": "2026-02-05T00:00:00Z",
    "bill_month": 1,
    "bill_year": 2026,
    "discom": "MSEDCL",
    "consumer_number": "1234567890",
    "units_consumed": 350
  }
}
```

## 5.3 Error Response Format

All API errors follow this structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {} // Optional, only in development
  }
}
```

**Error Codes:**
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Not authorized |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `DB_ERROR` | 500 | Database error |
| `SERVER_ERROR` | 500 | Internal error |
| `INSUFFICIENT_CAPACITY` | 400 | Not enough capacity |
| `INVALID_SIGNATURE` | 400 | Payment signature invalid |

---

# 6. AUTHENTICATION & AUTHORIZATION

## 6.1 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION FLOW                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. SIGNUP                                                               │
│  ────────                                                                │
│  User ──► /signup ──► Supabase Auth ──► Email Verification (Cumpulsory)  │
│                              │                                           │
│                              ▼                                           │
│                     Create User Profile (trigger)                        │
│                                                                          │
│  2. LOGIN                                                                │
│  ───────                                                                 │
│  User ──► /login ──► Supabase Auth ──► JWT + Refresh Token              │
│                              │                                           │
│                              ▼                                           │
│                     Set HTTP-only Cookies                                │
│                                                                          │
│  3. SESSION MANAGEMENT                                                   │
│  ────────────────────                                                    │
│  Request ──► Middleware ──► Validate JWT ──► Refresh if needed          │
│                              │                                           │
│                              ▼                                           │
│                     Update Session Cookies                               │
│                                                                          │
│  4. LOGOUT                                                               │
│  ────────                                                                │
│  User ──► Supabase signOut() ──► Clear Cookies ──► Redirect to /login   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## 6.2 Route Protection

### Protected Routes (require authentication)
- `/dashboard` - User dashboard
- `/connect` - Utility connection
- `/reserve/payment` - Payment page
- `/bills` - Bill management
- `/settings` - User settings

### Public Routes
- `/` - Landing page
- `/login`, `/signup` - Authentication
- `/forgot-password`, `/reset-password` - Password recovery
- `/help`, `/contact`, `/privacy`, `/terms`, `/cookies`, `/refund` - Info pages

## 6.3 Middleware Implementation

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  // 1. Skip static files
  if (isStaticFile(pathname)) return NextResponse.next();

  // 2. Rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    const rateLimit = checkRateLimit(identifier, path);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }
  }

  // 3. Update Supabase session
  const response = await updateSession(request);

  // 4. Add rate limit headers
  response.headers.set("X-RateLimit-Remaining", remaining.toString());

  return response;
}
```

## 6.4 Session Management

- **JWT Tokens:** Supabase-issued, signed with secret
- **Token Expiry:** Configurable (default 1 hour)
- **Refresh Tokens:** Automatic renewal via middleware
- **Cookie Settings:**
  - `HttpOnly: true`
  - `Secure: true` (production)
  - `SameSite: Lax`
  - `Path: /`

---

# 7. BUSINESS LOGIC & CORE FEATURES

## 7.1 Solar Capacity Reservation

### Calculation Constants

```typescript
const SOLAR_CONSTANTS = {
  creditRatePerUnit: 7,           // ₹7 per kWh
  avgGenerationPerKwPerDay: 4.5,  // kWh per kW per day
  daysPerMonth: 30,
  baseCostPerKw: 35000,           // ₹35,000 per kW
  bulkDiscountTiers: [
    { minKw: 0, discount: 0 },    // No discount
    { minKw: 5, discount: 5 },    // 5% off
    { minKw: 10, discount: 10 },  // 10% off
    { minKw: 25, discount: 15 },  // 15% off
    { minKw: 50, discount: 20 },  // 20% off
  ],
  projectLifespan: 12.3,          // years
  securedGeneration: 0.75,        // 75% guarantee
  co2PerKwh: 0.9,                 // kg CO2 offset
  treesPerTonCO2: 45,
};
```

### Savings Calculation

```typescript
function calculateSolarSavings(capacityKw: number) {
  const dailyGenerationKwh = capacityKw * 4.5;
  const monthlyGenerationKwh = dailyGenerationKwh * 30;
  const monthlySavings = monthlyGenerationKwh * 7;  // ₹7/kWh
  const annualSavings = monthlySavings * 12;
  const lifetimeSavings = annualSavings * 12.3;

  return {
    monthlyGenerationKwh,  // e.g., 675 kWh for 5 kW
    monthlySavings,        // e.g., ₹4,725 for 5 kW
    annualSavings,         // e.g., ₹56,700 for 5 kW
    lifetimeSavings,       // e.g., ₹6,97,410 for 5 kW
    roiYears: setupCost / annualSavings,  // ~3.1 years
  };
}
```

### Capacity Allocation Algorithm

```typescript
// Greedy allocation algorithm
async function allocateCapacity(projectId: string, requestedKw: number) {
  // 1. Get available blocks sorted by creation date
  const blocks = await getAvailableBlocks(projectId);

  // 2. Check total available capacity
  const totalAvailable = blocks.reduce((sum, b) => sum + b.kw, 0);
  if (totalAvailable < requestedKw) throw new Error("Insufficient capacity");

  // 3. Allocate blocks greedily
  let remaining = requestedKw;
  const allocations = [];

  for (const block of blocks) {
    if (remaining <= 0) break;

    // Mark block as ALLOCATED
    await updateBlockStatus(block.id, 'ALLOCATED');

    // Create allocation record
    const allocation = await createAllocation(userId, block.id, block.kw);
    allocations.push(allocation);

    remaining -= block.kw;
  }

  return allocations;
}
```

## 7.2 Credit System

### Credit Generation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    CREDIT GENERATION FLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. MONTHLY GENERATION                                           │
│  ────────────────────                                            │
│  Solar Project ──► Meter Reading ──► kwh Recorded                │
│                                                                  │
│  2. USER CREDIT CALCULATION                                      │
│  ──────────────────────────                                      │
│  User Capacity (kW) × Generation Rate (kWh/kW) × Credit Rate (₹) │
│  e.g., 5 kW × 135 kWh × ₹7 = ₹4,725/month                       │
│                                                                  │
│  3. CREDIT LEDGER ENTRY                                          │
│  ───────────────────────                                         │
│  credit_ledgers: { user_id, amount, type: 'GENERATION',          │
│                    status: 'PENDING', month, year }              │
│                                                                  │
│  4. BILL APPLICATION                                             │
│  ───────────────────                                             │
│  When bill created: Apply PENDING credits → Update to 'APPLIED'  │
│  Reduce bill amount by credits_applied                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 7.3 Bill Management

### Bill Fetching Process

1. User connects utility (state, DISCOM, consumer number)
2. System fetches bill from BBPS API
3. Bill record created in database
4. Available credits auto-applied
5. Net amount displayed to user

### BBPS Integration

```typescript
// lib/bbps/client.ts
class BBPSClient {
  async fetchBill(request: BBPSBillRequest): Promise<BBPSBillResponse> {
    if (this.shouldUseMock()) {
      return this.generateMockBill(request);
    }

    const token = await this.getAuthToken();
    const response = await fetch(`${baseUrl}/bills/fetch`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        consumer_number: request.consumerNumber,
        discom: request.discom,
        bill_category: 'ELECTRICITY',
      }),
    });

    return transformResponse(response);
  }
}
```

---

# 8. THIRD-PARTY INTEGRATIONS

## 8.1 Razorpay Payment Gateway

### Configuration

```env
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
```

### Payment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    RAZORPAY PAYMENT FLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. CREATE ORDER                                                 │
│  User ──► /api/payments/create-order                            │
│           ──► Create PENDING payment record                      │
│           ──► Razorpay orders.create()                          │
│           ──► Return order_id, key, amount                       │
│                                                                  │
│  2. CHECKOUT                                                     │
│  Client ──► Razorpay.open({ order_id, handler: onSuccess })     │
│         ──► User completes payment                               │
│         ──► onSuccess callback with payment details              │
│                                                                  │
│  3. VERIFY PAYMENT                                               │
│  Client ──► /api/payments/verify                                │
│         ──► Verify HMAC-SHA256 signature                        │
│         ──► Update payment status to COMPLETED                   │
│         ──► Link allocation to payment                           │
│         ──► Mark capacity block as ALLOCATED                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Signature Verification

```typescript
function verifySignature(orderId: string, paymentId: string, signature: string): boolean {
  const text = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex');
  return expectedSignature === signature;
}
```

## 8.2 BBPS Integration

### Configuration

```env
BBPS_USE_MOCK=true  # Set to false for production
BBPS_API_KEY=xxx
BBPS_API_SECRET=xxx
BBPS_BASE_URL=https://api.bbps.com/v1
```

### Supported DISCOMs

| State | DISCOMs |
|-------|---------|
| Maharashtra | MSEDCL, Tata Power, Adani Electricity |
| Karnataka | BESCOM, MESCOM, HESCOM, GESCOM, CESCOM |
| Tamil Nadu | TANGEDCO |
| Gujarat | GUVNL, DGVCL, MGVCL, PGVCL, UGVCL |
| Rajasthan | RVPN, JVVNL, AVVNL |
| Delhi | BSES, Tata Power DDL, NDPL |
| Uttar Pradesh | UPPCL |
| West Bengal | WBSEDCL |
| Punjab | PSPCL |
| Haryana | DHBVN, UHBVN |

## 8.3 Supabase Services

### Authentication
- Email/password signup
- Session management
- Password recovery

### Database
- PostgreSQL with RLS
- Real-time subscriptions (optional)
- Automatic backups

### Storage (Future)
- User document uploads
- KYC document storage

---

# 9. SECURITY IMPLEMENTATION

## 9.1 Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       SECURITY LAYERS                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  LAYER 1: NETWORK                                                        │
│  ──────────────────                                                      │
│  • HTTPS everywhere (TLS 1.3)                                           │
│  • HSTS headers                                                          │
│  • Cloudflare DDoS protection (recommended)                              │
│                                                                          │
│  LAYER 2: APPLICATION                                                    │
│  ────────────────────                                                    │
│  • Rate limiting (per IP/path)                                          │
│  • Input validation (Zod schemas)                                        │
│  • XSS prevention (DOMPurify)                                           │
│  • CSRF protection (SameSite cookies)                                   │
│                                                                          │
│  LAYER 3: AUTHENTICATION                                                 │
│  ───────────────────────                                                 │
│  • JWT tokens with expiry                                                │
│  • Refresh token rotation                                                │
│  • HTTP-only secure cookies                                              │
│  • Session invalidation on logout                                        │
│                                                                          │
│  LAYER 4: DATABASE                                                       │
│  ─────────────────                                                       │
│  • Row Level Security (RLS)                                              │
│  • Prepared statements (SQL injection prevention)                        │
│  • Data encryption at rest                                               │
│  • Audit logging                                                         │
│                                                                          │
│  LAYER 5: PAYMENT                                                        │
│  ────────────────                                                        │
│  • PCI DSS compliance (via Razorpay)                                    │
│  • Signature verification                                                │
│  • No card data stored                                                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## 9.2 Rate Limiting

```typescript
// lib/security/rateLimiter.ts
const DEFAULT_LIMITS = {
  // Authentication - strict
  "/api/auth/login": { windowMs: 15 * 60 * 1000, maxRequests: 5 },
  "/api/auth/signup": { windowMs: 60 * 60 * 1000, maxRequests: 3 },
  "/api/auth/forgot-password": { windowMs: 60 * 60 * 1000, maxRequests: 3 },

  // Payments - very strict
  "/api/payments/create-order": { windowMs: 60 * 1000, maxRequests: 10 },
  "/api/payments/verify": { windowMs: 60 * 1000, maxRequests: 10 },

  // Bills - moderate
  "/api/bills/fetch": { windowMs: 60 * 1000, maxRequests: 5 },

  // Default - lenient
  default: { windowMs: 60 * 1000, maxRequests: 60 },
};
```

## 9.3 Input Sanitization

```typescript
// lib/security/inputSanitizer.ts
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty);
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim().replace(/[^a-z0-9@._-]/gi, "");
}

export function sanitizePhone(phone: string): string {
  return phone.replace(/[^0-9+]/g, "");
}

export function sanitizeConsumerNumber(num: string): string {
  return num.replace(/[^A-Z0-9]/gi, "").toUpperCase();
}
```

## 9.4 Security Headers

```typescript
// lib/security/securityHeaders.ts
export const securityHeaders = {
  "X-DNS-Prefetch-Control": "on",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://api.razorpay.com",
    "frame-src 'self' https://checkout.razorpay.com",
    "object-src 'none'",
  ].join("; "),
};
```

## 9.5 Validation Schemas

```typescript
// lib/validations.ts
import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const reservationSchema = z.object({
  project_id: z.string().uuid(),
  capacity_kw: z.number().min(1).max(100),
});

export const paymentSchema = z.object({
  amount: z.number().positive(),
  allocation_id: z.string().uuid().optional(),
  payment_type: z.enum(["allocation", "monthly", "bill"]),
});
```

---

# 10. FRONTEND ARCHITECTURE

## 10.1 Component Structure

```
components/
├── features/                    # Domain-specific components
│   ├── bills/
│   │   └── BillPayment.tsx     # Bill payment interface
│   ├── dashboard/
│   │   ├── CreditHistoryChart.tsx
│   │   └── RealTimeMonitoring.tsx
│   ├── landing/
│   │   ├── HeroSection.tsx
│   │   ├── SavingsCalculator.tsx
│   │   ├── BenefitsSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── Testimonials.tsx
│   │   └── Newsletter.tsx
│   └── projects/
│       └── ProjectComparison.tsx
│
├── layout/                      # Layout components
│   ├── header.tsx
│   ├── footer.tsx
│   └── PageLoader.tsx
│
├── ui/                          # Generic UI primitives
│   ├── animations/              # Animation wrappers
│   ├── skeletons/               # Loading states
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── toast.tsx
│
└── providers/
    └── LoadingProvider.tsx
```

## 10.2 State Management

### Zustand Stores
- `useAuthStore` - Authentication state
- `useUIStore` - UI state (modals, toasts)

### TanStack Query
- Server state caching
- Automatic background refetch
- Optimistic updates

## 10.3 Animation System

### Framer Motion
- Page transitions
- Component animations
- Gesture handling

### GSAP
- Complex timelines
- Scroll-triggered animations
- Performance-critical animations

### Three.js
- 3D hero graphics
- Interactive visualizations

## 10.4 Design System

### Colors
```css
--forest-green: #0D2818;
--forest-light: #1B5E3E;
--forest-dark: #0A1F12;
--gold: #FFB800;
--gold-light: #FFD54F;
--charcoal: #1A1A1A;
--off-white: #FAFAF8;
```

### Typography
- **Headings:** Space Grotesk
- **Body:** Inter
- **Mono:** JetBrains Mono

### Responsive Breakpoints
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

# 11. TESTING STRATEGY

## 11.1 Test Pyramid

```
          ┌─────────────┐
          │   E2E Tests │ (Playwright)
          │   (~10%)    │
         ╱ ╲            ╱ ╲
        ╱   ╲──────────╱   ╲
       ╱ Integration Tests  ╲
      ╱      (~30%)          ╲
     ╱───────────────────────╲
    ╱      Unit Tests         ╲
   ╱          (~60%)           ╲
  ╱─────────────────────────────╲
```

## 11.2 Playwright E2E Tests

```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';

test('successful login flow', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

### Test Commands
```bash
npm run test          # Run all tests
npm run test:ui       # Open UI mode
npm run test:headed   # Run with browser visible
npm run test:debug    # Debug mode
npm run test:report   # View HTML report
```

## 11.3 Cypress Component Tests

```typescript
// cypress/component/Button.cy.tsx
import Button from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    cy.mount(<Button>Click me</Button>);
    cy.get('button').should('contain', 'Click me');
  });
});
```

## 11.4 Test Coverage Goals

| Area | Target | Current |
|------|--------|---------|
| API Routes | 80% | TBD |
| UI Components | 70% | TBD |
| Business Logic | 90% | TBD |
| E2E Critical Paths | 100% | TBD |

---

# 12. CONFIGURATION MANAGEMENT

## 12.1 Environment Variables

### Required (Production)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx

# BBPS
BBPS_USE_MOCK=false
BBPS_API_KEY=xxx
BBPS_API_SECRET=xxx
BBPS_BASE_URL=https://api.bbps.com/v1
```

### Optional

```env
# Legacy compatibility
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://powernetpro.com
NEXTAUTH_SECRET=xxx
```

## 12.2 Next.js Configuration

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  images: {
    domains: ['kmwinrwqavqvclnevyxp.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
};
```

## 12.3 Tailwind Configuration

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#0D2818',
          light: '#1B5E3E',
          dark: '#0A1F12',
        },
        gold: {
          DEFAULT: '#FFB800',
          light: '#FFD54F',
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
};
```

---

# 13. PERFORMANCE OPTIMIZATIONS

## 13.1 Frontend Optimizations

| Optimization | Implementation |
|--------------|----------------|
| **Code Splitting** | Next.js automatic per-route |
| **Image Optimization** | Next/Image with WebP/AVIF |
| **Font Optimization** | next/font with preload |
| **CSS Optimization** | Tailwind tree-shaking |
| **Lazy Loading** | Dynamic imports for heavy components |
| **Prefetching** | Next.js Link prefetch |

## 13.2 Backend Optimizations

| Optimization | Implementation |
|--------------|----------------|
| **Database Indexes** | Strategic indexing on query columns |
| **Query Optimization** | Selective column fetching |
| **Connection Pooling** | Supabase built-in |
| **Response Caching** | HTTP cache headers |

## 13.3 Caching Strategy

```javascript
// next.config.js headers
{
  source: '/_next/static/:path*',
  headers: [
    {
      key: 'Cache-Control',
      value: 'public, max-age=31536000, immutable',
    },
  ],
}
```

---

# 14. DEPLOYMENT & INFRASTRUCTURE

## 14.1 Recommended Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     PRODUCTION INFRASTRUCTURE                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────┐     ┌────────────────┐     ┌────────────────┐       │
│  │   Cloudflare   │────▶│    Vercel      │────▶│   Supabase     │       │
│  │   (CDN/DDoS)   │     │  (Next.js)     │     │  (Database)    │       │
│  └────────────────┘     └────────────────┘     └────────────────┘       │
│                                │                        │                │
│                                ▼                        │                │
│                         ┌────────────────┐              │                │
│                         │   Razorpay     │              │                │
│                         │  (Payments)    │              │                │
│                         └────────────────┘              │                │
│                                                         │                │
│                                                         ▼                │
│                                                  ┌────────────────┐      │
│                                                  │    BBPS API    │      │
│                                                  │   (Bills)      │      │
│                                                  └────────────────┘      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## 14.2 Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Environment Variables in Vercel
1. Go to Project Settings → Environment Variables
2. Add all required variables
3. Ensure `SUPABASE_SERVICE_ROLE_KEY` is only in Production environment

## 14.3 Monitoring & Logging

### Recommended Tools
- **Vercel Analytics** - Performance monitoring
- **Sentry** - Error tracking (to be added)
- **Supabase Dashboard** - Database metrics

---

# 15. SECURITY AUDIT CHECKLIST

## 15.1 Authentication Security

- [x] JWT tokens with appropriate expiry
- [x] HTTP-only cookies for session storage
- [x] Secure flag on cookies in production
- [x] SameSite cookie attribute set
- [x] Password minimum length (6 characters)
- [ ] Password complexity requirements (uppercase, number, special)
- [ ] Account lockout after failed attempts
- [ ] Email verification on signup
- [ ] Two-factor authentication (2FA)
- [x] Refresh token rotation

## 15.2 API Security

- [x] Rate limiting implemented
- [x] Input validation with Zod schemas
- [x] XSS prevention with DOMPurify
- [x] SQL injection prevention (parameterized queries via Supabase)
- [x] CORS configuration
- [ ] API versioning
- [ ] Request logging
- [ ] Response sanitization for error messages

## 15.3 Database Security

- [x] Row Level Security (RLS) enabled on all tables
- [x] User data isolation policies
- [x] Admin-only audit log access
- [x] Check constraints on data values
- [x] Foreign key constraints
- [ ] Database encryption at rest verification
- [ ] Regular backup verification
- [ ] Connection SSL enforcement

## 15.4 Payment Security

- [x] HMAC signature verification for Razorpay
- [x] PCI compliance via Razorpay (no card data stored)
- [x] Payment status tracking
- [ ] Webhook signature verification
- [ ] Refund handling implementation
- [ ] Payment fraud detection

## 15.5 Infrastructure Security

- [x] Environment variables for secrets
- [x] .gitignore for sensitive files
- [x] HTTPS enforcement (via deployment)
- [x] Security headers configuration
- [ ] WAF configuration
- [ ] DDoS protection
- [ ] Regular security scans
- [ ] Penetration testing

## 15.6 Code Security

- [x] TypeScript for type safety
- [x] ESLint for code quality
- [ ] Dependency vulnerability scanning
- [ ] SAST (Static Application Security Testing)
- [ ] Code review requirements
- [ ] Secrets scanning in CI/CD

---

# 16. PRODUCTION LAUNCH CHECKLIST

## 16.1 Pre-Launch (Critical)

### Environment & Configuration
- [ ] All production environment variables set
- [ ] Supabase production project created
- [ ] Production database schema deployed
- [ ] RLS policies verified in production
- [ ] Razorpay live keys configured
- [ ] BBPS production credentials obtained
- [ ] Domain configured and SSL active

### Security
- [ ] Security headers enabled in production
- [ ] Rate limiting tested under load
- [ ] All sensitive data removed from code
- [ ] Error messages don't leak sensitive info
- [ ] Admin accounts secured

### Testing
- [ ] Full E2E test suite passing
- [ ] Payment flow tested with live credentials
- [ ] Bill fetching tested with real DISCOMs
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing completed
- [ ] Performance benchmarks met

### Compliance
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Cookie consent implemented
- [ ] Refund policy published
- [ ] Contact information visible

## 16.2 Pre-Launch (Important)

### Monitoring
- [ ] Error tracking (Sentry) configured
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring configured
- [ ] Database monitoring enabled
- [ ] Log aggregation setup

### Backup & Recovery
- [ ] Database backup schedule verified
- [ ] Backup restoration tested
- [ ] Disaster recovery plan documented
- [ ] Rollback procedure tested

### Documentation
- [ ] API documentation complete
- [ ] User documentation ready
- [ ] Support documentation prepared
- [ ] Incident response plan documented

## 16.3 Launch Day

- [ ] DNS propagation verified
- [ ] SSL certificate valid
- [ ] All services healthy
- [ ] Team on standby for issues
- [ ] Communication channels ready
- [ ] Rollback plan ready

## 16.4 Post-Launch

### Week 1
- [ ] Monitor error rates
- [ ] Monitor performance metrics
- [ ] Address critical bugs
- [ ] Collect user feedback
- [ ] Review security logs

### Month 1
- [ ] Security audit
- [ ] Performance optimization
- [ ] Feature prioritization based on feedback
- [ ] Scaling assessment

---

# 17. TODO LIST FOR LAUNCH READINESS

## 17.1 Critical (Must Have)

### Security
- [ ] **Implement password complexity rules** - Add uppercase, number, special character requirements
- [ ] **Add account lockout** - Lock accounts after 5 failed login attempts
- [ ] **Enable email verification** - Verify email on signup before allowing access
- [ ] **Implement webhook signature verification** - Secure Razorpay webhooks
- [ ] **Add dependency vulnerability scanning** - npm audit in CI/CD
- [ ] **Secrets scanning in repository** - GitHub secret scanning or similar

### Infrastructure
- [ ] **Migrate rate limiter to Redis** - Current in-memory store won't work across instances
- [ ] **Configure production Razorpay** - Obtain and configure live credentials
- [ ] **Configure production BBPS** - Obtain real BBPS API credentials
- [ ] **Set up error tracking** - Integrate Sentry or similar
- [ ] **Configure monitoring dashboard** - Vercel Analytics + custom metrics

### Features
- [ ] **Implement credit calculation cron job** - Monthly credit generation
- [ ] **Build admin dashboard** - Project management, user management
- [ ] **Add email notifications** - Integrate Resend or similar
- [ ] **Implement KYC verification** - Document upload and verification
- [ ] **Add payment refund handling** - Razorpay refund API integration

### Testing
- [ ] **Achieve 80% test coverage** - Add unit tests for business logic
- [ ] **Load testing** - Verify system handles expected traffic
- [ ] **Security penetration testing** - Professional security audit

## 17.2 Important (Should Have)

### Features
- [ ] **SMS notifications** - OTP and alerts
- [ ] **Bill payment via platform** - Direct BBPS payment
- [ ] **User referral system** - Track referrals and rewards
- [ ] **Multiple utility accounts** - Support multiple connections
- [ ] **Download credit statements** - PDF generation

### UX Improvements
- [ ] **Dark mode** - Full dark theme support
- [ ] **Accessibility audit** - WCAG 2.1 compliance
- [ ] **PWA support** - Install as app
- [ ] **Offline support** - Basic offline functionality

### Operations
- [ ] **Automated backups verification** - Regular restore tests
- [ ] **Incident response runbook** - Documented procedures
- [ ] **On-call rotation** - Team availability schedule

## 17.3 Nice to Have (Could Have)

### Features
- [ ] **Mobile app** - React Native version
- [ ] **Real-time generation dashboard** - Live meter data
- [ ] **Social sharing** - Share savings achievements
- [ ] **Gamification** - Badges and achievements
- [ ] **Carbon offset certificates** - Downloadable certificates

### Technical
- [ ] **API versioning** - v1/v2 structure
- [ ] **GraphQL API** - Alternative to REST
- [ ] **Microservices split** - Separate payment service
- [ ] **Multi-region deployment** - Global CDN

---

# 18. KNOWN LIMITATIONS & TECHNICAL DEBT

## 18.1 Current Limitations

| Limitation | Impact | Priority |
|------------|--------|----------|
| In-memory rate limiting | Won't work with multiple instances | Critical |
| BBPS mock mode only | No real bill fetching | Critical |
| No email notifications | Users not notified of events | High |
| No admin panel | Manual database operations | High |
| No KYC verification | Regulatory compliance risk | High |
| No credit calculation cron | Credits not auto-generated | High |
| No payment webhooks | Missing payment status updates | Medium |
| No mobile app | Limited mobile experience | Medium |
| No dark mode | UX limitation | Low |

## 18.2 Technical Debt

| Item | Description | Effort |
|------|-------------|--------|
| Test coverage | Below 50% coverage | Medium |
| Error handling | Inconsistent error responses | Low |
| Code duplication | Some API routes have similar patterns | Low |
| Documentation gaps | Some functions undocumented | Low |
| Legacy env vars | Unused NextAuth variables | Trivial |

## 18.3 Scalability Concerns

1. **Database** - Single Supabase instance; consider read replicas at scale
2. **Rate Limiting** - Requires Redis for horizontal scaling
3. **File Storage** - No current implementation; needed for KYC docs
4. **Caching** - No application-level caching implemented
5. **Background Jobs** - No job queue for async processing

---

# 19. FUTURE ROADMAP

## 19.1 Phase 1: Launch (Q1 2026)

- [ ] Production Razorpay integration
- [ ] Production BBPS integration
- [ ] Email notifications
- [ ] Basic admin panel
- [ ] Error tracking

## 19.2 Phase 2: Growth (Q2 2026)

- [ ] Mobile app (React Native)
- [ ] SMS notifications
- [ ] KYC verification
- [ ] Direct bill payment
- [ ] Referral system

## 19.3 Phase 3: Scale (Q3-Q4 2026)

- [ ] Real-time generation monitoring
- [ ] Advanced analytics dashboard
- [ ] API for third-party integrations
- [ ] Multi-language support
- [ ] Enterprise accounts

## 19.4 Phase 4: Expansion (2027)

- [ ] Additional states/DISCOMs
- [ ] Commercial solar projects
- [ ] Battery storage integration
- [ ] EV charging credits
- [ ] International expansion

---

# 20. APPENDIX

## 20.1 Glossary

| Term | Definition |
|------|------------|
| **BBPS** | Bharat Bill Payment System - India's bill payment infrastructure |
| **DISCOM** | Distribution Company - Electricity distribution utility |
| **RLS** | Row Level Security - PostgreSQL feature for data access control |
| **SPV** | Special Purpose Vehicle - Legal entity for solar project |
| **kW** | Kilowatt - Unit of power capacity |
| **kWh** | Kilowatt-hour - Unit of energy consumption |
| **KYC** | Know Your Customer - Identity verification process |

## 20.2 Reference Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Razorpay Documentation](https://razorpay.com/docs/)
- [BBPS Overview](https://www.npci.org.in/what-we-do/bbps/overview)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

## 20.3 Contact Information

- **Technical Support:** support@powernetpro.com
- **Business Inquiries:** hello@powernetpro.com
- **Phone:** +91 8180861415
- **Address:** Kothrud pune maharashtra ,Bharat

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 2025 | Engineering Team | Initial document |
| 2.0 | Jan 2026 | Engineering Team | Major update with security audit |
| 3.0 | Jan 2026 | Engineering Team | Comprehensive TRD with launch checklist |

---

*This document is confidential and intended for internal use only.*

**© 2026 PowerNetPro. All rights reserved.**
