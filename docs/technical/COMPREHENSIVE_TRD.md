# PowerNetPro - Comprehensive Technical Requirements Document (TRD)

**Version:** 2.0.0  
**Date:** 2025-01-27  
**Status:** Production Ready  
**Project:** Digital Solar Platform (Community Solar Energy Management System)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Architecture](#architecture)
4. [Technology Stack](#technology-stack)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Features and Functionality](#features-and-functionality)
8. [Security Implementation](#security-implementation)
9. [User Interface & Experience](#user-interface--experience)
10. [Testing Strategy](#testing-strategy)
11. [Deployment & Infrastructure](#deployment--infrastructure)
12. [Performance Optimizations](#performance-optimizations)
13. [Future Enhancements](#future-enhancements)
14. [Appendices](#appendices)

---

## Executive Summary

PowerNetPro is a modern, full-stack web application that enables users to participate in community solar energy projects without requiring physical installation of solar panels. The platform allows users to reserve solar capacity from verified projects across India, receive automatic credits on their electricity bills, and track their savings and environmental impact.

### Key Highlights

- **Platform Type:** Community Solar Energy Management System
- **Target Market:** Residential electricity consumers in India
- **Business Model:** One-time capacity reservation fee + monthly credit system
- **Technology:** Next.js 14 (App Router), TypeScript, Supabase, Tailwind CSS
- **Current Status:** Production-ready with core features implemented

### Core Value Propositions

1. **Zero Installation:** No rooftop panels or physical infrastructure required
2. **Automatic Credits:** Solar credits automatically applied to electricity bills
3. **Guaranteed Generation:** 75% secured generation guarantee
4. **Transparent Tracking:** Real-time dashboard for capacity, savings, and environmental impact
5. **BBPS Integration Ready:** Prepared for automatic bill fetching via BBPS API

---

## System Overview

### Application Purpose

PowerNetPro connects residential electricity consumers with community solar projects, enabling them to:
- Reserve solar capacity (1-100 kW) from verified projects
- Receive monthly solar generation credits applied to electricity bills
- Track savings, environmental impact (CO₂ offset), and bill history
- Manage utility connections and bill payments

### User Types

1. **End Users (Residential Consumers)**
   - Sign up and create accounts
   - Browse and reserve solar capacity
   - Connect utility providers
   - View bills and track savings
   - Monitor environmental impact

2. **Administrators** (Future Implementation)
   - Manage solar projects
   - Monitor capacity allocations
   - Process payments
   - Manage user accounts

### System Boundaries

**In Scope:**
- User authentication and authorization
- Project browsing and capacity reservation
- Payment processing (Razorpay integration ready)
- Utility connection management
- Bill management and credit application
- Dashboard and analytics
- Real-time monitoring

**Out of Scope (Future):**
- BBPS API integration (prepared but not implemented)
- Email/SMS notifications (infrastructure ready)
- Admin panel
- KYC verification flow
- Advanced analytics and reporting
- Mobile applications

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Next.js    │  │   React 18   │  │  Tailwind    │     │
│  │  App Router  │  │  Components  │  │     CSS      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Layer (Next.js API Routes)            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Projects │  │Allocations│ │ Payments │  │  Bills   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  User    │  │ Dashboard│  │ Credits  │  │  Stats   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Data Layer (Supabase PostgreSQL)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │ Projects │  │Capacity  │  │Allocations│   │
│  └──────────┘  └──────────┘  │  Blocks  │  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  └──────────┘  ┌──────────┐   │
│  │ Payments │  │  Bills   │  ┌──────────┐  │ Credits  │   │
│  └──────────┘  └──────────┘  │Generations│  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              External Services                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ Razorpay │  │  BBPS    │  │  Email   │                 │
│  │ (Ready)  │  │ (Future) │  │ (Future) │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Patterns

1. **Server-Side Rendering (SSR):** Next.js App Router with React Server Components
2. **API Routes:** RESTful API endpoints using Next.js API routes
3. **Database:** PostgreSQL via Supabase with Row Level Security (RLS)
4. **Authentication:** Supabase Auth with session management via cookies
5. **State Management:** React hooks + Zustand (for client state)
6. **Styling:** Tailwind CSS with custom design system

### Component Architecture

```
app/
├── api/                    # API routes (backend)
│   ├── allocations/
│   ├── bills/
│   ├── credits/
│   ├── dashboard/
│   ├── payments/
│   ├── projects/
│   └── user/
├── (pages)/               # Public pages
│   ├── page.tsx           # Landing page
│   ├── login/
│   ├── signup/
│   ├── reserve/
│   └── connect/
└── (protected)/          # Authenticated pages
    ├── dashboard/
    ├── bills/
    └── settings/

components/
├── features/              # Feature-specific components
│   ├── landing/
│   ├── dashboard/
│   ├── bills/
│   └── projects/
├── layout/               # Layout components
│   ├── header.tsx
│   ├── footer.tsx
│   └── LandingHeader.tsx
└── ui/                   # Reusable UI components
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    └── animations/
```

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.5 | React framework with App Router |
| React | 18.3.1 | UI library |
| TypeScript | 5.5.4 | Type-safe JavaScript |
| Tailwind CSS | 3.4.7 | Utility-first CSS framework |
| Framer Motion | 11.3.19 | Animation library |
| GSAP | 3.14.2 | Advanced animations |
| React Three Fiber | 8.16.0 | 3D graphics (for effects) |
| Lucide React | 0.427.0 | Icon library |
| Zustand | 4.5.5 | State management |
| React Query | 5.56.2 | Data fetching and caching |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | 14.2.5 | Server-side API endpoints |
| Supabase | 2.45.4 | Backend-as-a-Service (Auth + Database) |
| Supabase SSR | 0.5.1 | Server-side Supabase client |
| Razorpay | 2.9.2 | Payment gateway (ready for integration) |
| Zod | 3.23.8 | Schema validation |

### Database

| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | (via Supabase) | Primary database |
| Supabase Auth | - | Authentication service |
| Row Level Security | - | Database-level access control |

### Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| Playwright | 1.57.0 | End-to-end testing |
| Cypress | 15.9.0 | Component testing |
| ESLint | 8.57.0 | Code linting |
| TypeScript | 5.5.4 | Type checking |

### Build & Deployment

- **Build Tool:** Next.js built-in (SWC compiler)
- **Package Manager:** npm
- **Deployment:** Vercel/Next.js compatible platforms
- **Environment:** Node.js 18+

---

## Database Schema

### Entity Relationship Overview

```
users (1) ──┐
            │
            ├── (1:N) allocations
            ├── (1:N) payments
            ├── (1:N) bills
            ├── (1:N) credit_ledgers
            └── (1:N) notifications

projects (1) ──┐
               │
               ├── (1:N) capacity_blocks
               └── (1:N) generations

capacity_blocks (1) ── (1:1) allocations
allocations (1) ── (0:1) payments
bills (1) ── (0:N) payments
```

### Core Tables

#### 1. users
**Purpose:** User profiles and utility information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, FK → auth.users | User identifier |
| email | TEXT | Unique, Validated | User email |
| phone | TEXT | Unique, Validated | Phone number |
| name | TEXT | - | Full name |
| kyc_status | ENUM | Default: PENDING | KYC verification status |
| utility_consumer_number | TEXT | - | Electricity consumer number |
| state | TEXT | - | Indian state |
| discom | TEXT | - | Distribution company |
| role | ENUM | Default: USER | User role (USER/ADMIN) |
| email_notifications | BOOLEAN | Default: TRUE | Email notification preference |
| sms_notifications | BOOLEAN | Default: TRUE | SMS notification preference |
| created_at | TIMESTAMPTZ | Default: NOW() | Account creation timestamp |
| updated_at | TIMESTAMPTZ | Default: NOW() | Last update timestamp |
| deleted_at | TIMESTAMPTZ | - | Soft delete timestamp |

**RLS Policies:**
- Users can view/update their own profile only

#### 2. projects
**Purpose:** Solar energy projects available for reservation

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Project identifier |
| spv_id | TEXT | Unique, NOT NULL | Special Purpose Vehicle ID |
| name | TEXT | NOT NULL | Project name |
| total_kw | NUMERIC | NOT NULL | Total capacity in kW |
| rate_per_kwh | NUMERIC | NOT NULL | Credit rate per kWh (₹) |
| location | TEXT | NOT NULL | Project location |
| state | TEXT | NOT NULL | State where project is located |
| status | ENUM | Default: DRAFT | Project status (DRAFT/ACTIVE/MAINTENANCE/RETIRED) |
| description | TEXT | - | Project description |
| created_at | TIMESTAMPTZ | Default: NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | Default: NOW() | Last update timestamp |
| deleted_at | TIMESTAMPTZ | - | Soft delete timestamp |

**RLS Policies:**
- Anyone can view ACTIVE projects

#### 3. capacity_blocks
**Purpose:** Granular capacity units within projects

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Block identifier |
| project_id | UUID | FK → projects | Parent project |
| kw | NUMERIC | NOT NULL, > 0 | Capacity in kW |
| status | ENUM | Default: AVAILABLE | Block status (AVAILABLE/ALLOCATED/SUSPENDED) |
| allocated_at | TIMESTAMPTZ | - | Allocation timestamp |
| created_at | TIMESTAMPTZ | Default: NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | Default: NOW() | Last update timestamp |

**RLS Policies:**
- Anyone can view AVAILABLE blocks

#### 4. allocations
**Purpose:** User's reserved solar capacity

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Allocation identifier |
| user_id | UUID | FK → users, NOT NULL | User who reserved |
| capacity_block_id | UUID | FK → capacity_blocks, UNIQUE | Allocated block |
| payment_id | UUID | FK → payments | Associated payment |
| capacity_kw | NUMERIC | NOT NULL, > 0 | Reserved capacity |
| created_at | TIMESTAMPTZ | Default: NOW() | Reservation timestamp |
| updated_at | TIMESTAMPTZ | Default: NOW() | Last update timestamp |

**RLS Policies:**
- Users can view/insert/update their own allocations only

#### 5. payments
**Purpose:** Payment records for reservations and bills

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Payment identifier |
| user_id | UUID | FK → users, NOT NULL | Paying user |
| amount | NUMERIC | NOT NULL, > 0 | Payment amount (₹) |
| type | ENUM | NOT NULL | Payment type (ALLOCATION/MONTHLY/BILL) |
| status | ENUM | Default: PENDING | Payment status |
| transaction_id | TEXT | Unique | Gateway transaction ID |
| gateway | TEXT | - | Payment gateway name |
| gateway_order_id | TEXT | - | Gateway order ID |
| gateway_payment_id | TEXT | - | Gateway payment ID |
| metadata | JSONB | - | Additional payment data |
| refunded_at | TIMESTAMPTZ | - | Refund timestamp |
| refund_amount | NUMERIC | - | Refunded amount |
| bill_id | UUID | FK → bills | Associated bill (if applicable) |
| created_at | TIMESTAMPTZ | Default: NOW() | Payment timestamp |
| updated_at | TIMESTAMPTZ | Default: NOW() | Last update timestamp |

**RLS Policies:**
- Users can view/insert their own payments only

#### 6. credit_ledgers
**Purpose:** Solar credit transactions and applications

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Credit entry identifier |
| user_id | UUID | FK → users, NOT NULL | Credit recipient |
| amount | NUMERIC | NOT NULL | Credit amount (₹) |
| type | ENUM | NOT NULL | Credit type (GENERATION/ADJUSTMENT/REFUND) |
| status | ENUM | Default: PENDING | Credit status (PENDING/APPLIED/EXPIRED) |
| month | INTEGER | 1-12 | Credit month |
| year | INTEGER | 2000-2100 | Credit year |
| ref_id | UUID | - | Reference ID (bill, generation, etc.) |
| ref_type | TEXT | - | Reference type |
| description | TEXT | - | Credit description |
| created_at | TIMESTAMPTZ | Default: NOW() | Credit timestamp |
| updated_at | TIMESTAMPTZ | Default: NOW() | Last update timestamp |

**RLS Policies:**
- Users can view their own credits only

#### 7. generations
**Purpose:** Monthly solar generation data per project

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Generation record identifier |
| project_id | UUID | FK → projects, NOT NULL | Project |
| month | INTEGER | NOT NULL, 1-12 | Generation month |
| year | INTEGER | NOT NULL, 2000-2100 | Generation year |
| kwh | NUMERIC | NOT NULL, >= 0 | Energy generated (kWh) |
| validated | BOOLEAN | Default: FALSE | Validation status |
| source | TEXT | - | Data source |
| validated_by | UUID | FK → users | Validator user ID |
| validated_at | TIMESTAMPTZ | - | Validation timestamp |
| created_at | TIMESTAMPTZ | Default: NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | Default: NOW() | Last update timestamp |

**RLS Policies:**
- Anyone can view generations (for transparency)

#### 8. bills
**Purpose:** Electricity bills with applied credits

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Bill identifier |
| user_id | UUID | FK → users, NOT NULL | Bill owner |
| discom | TEXT | NOT NULL | Distribution company |
| bill_number | TEXT | - | Bill number |
| amount | NUMERIC | NOT NULL, >= 0 | Bill amount (₹) |
| credits_applied | NUMERIC | Default: 0, >= 0 | Applied solar credits (₹) |
| due_date | TIMESTAMPTZ | NOT NULL | Payment due date |
| status | ENUM | Default: PENDING | Bill status (PENDING/PAID/OVERDUE) |
| bbps_bill_id | TEXT | Unique | BBPS bill identifier |
| fetched_at | TIMESTAMPTZ | - | Bill fetch timestamp |
| paid_at | TIMESTAMPTZ | - | Payment timestamp |
| created_at | TIMESTAMPTZ | Default: NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | Default: NOW() | Last update timestamp |

**RLS Policies:**
- Users can view/insert/update their own bills only

#### 9. notifications
**Purpose:** User notifications

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Notification identifier |
| user_id | UUID | FK → users, NOT NULL | Recipient |
| title | TEXT | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Notification message |
| type | TEXT | Default: 'info' | Notification type (info/success/warning/error) |
| read | BOOLEAN | Default: FALSE | Read status |
| created_at | TIMESTAMPTZ | Default: NOW() | Creation timestamp |

**RLS Policies:**
- Users can view/update their own notifications only

#### 10. audit_log
**Purpose:** Audit trail for data changes

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Audit log entry identifier |
| table_name | TEXT | NOT NULL | Modified table |
| record_id | UUID | NOT NULL | Modified record ID |
| action | ENUM | NOT NULL | Action type (INSERT/UPDATE/DELETE) |
| old_data | JSONB | - | Previous data |
| new_data | JSONB | - | New data |
| user_id | UUID | FK → users | User who made the change |
| created_at | TIMESTAMPTZ | Default: NOW() | Change timestamp |

**RLS Policies:**
- Only admins can view audit logs

### Database Functions

1. **handle_new_user()**: Auto-creates user profile when auth user is created
2. **update_updated_at()**: Auto-updates `updated_at` timestamp on record updates
3. **get_project_from_block(block_id)**: Helper to get project from capacity block
4. **get_available_capacity(proj_id)**: Calculates available capacity for a project

### Indexes

- Email and phone lookups on users
- User ID indexes on allocations, payments, bills, credits
- Project ID indexes on capacity_blocks, generations
- Status indexes for filtering
- Composite indexes for period-based queries (year, month)

---

## API Endpoints

### Authentication
All API routes (except public ones) require authentication via Supabase session cookies.

### Response Format
```typescript
// Success
{
  success: true,
  data: <response_data>
}

// Error
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "Human-readable error message",
    details?: <additional_details>
  }
}
```

### Endpoints

#### 1. Projects

**GET /api/projects**
- **Description:** Fetch all active solar projects
- **Authentication:** Not required
- **Response:**
  ```typescript
  {
    success: true,
    data: Array<{
      id: string;
      name: string;
      description: string;
      location: string;
      state: string;
      price_per_kw: number;
      available_capacity_kw: number;
      rate_per_kwh: number;
      // ... other fields
    }>
  }
  ```

#### 2. Allocations

**GET /api/allocations**
- **Description:** Get user's solar capacity allocations
- **Authentication:** Required
- **Response:**
  ```typescript
  {
    success: true,
    data: Array<{
      id: string;
      capacity_kw: number;
      project: Project;
      block_kw: number;
      created_at: string;
    }>
  }
  ```

**POST /api/allocations**
- **Description:** Reserve solar capacity
- **Authentication:** Required
- **Request Body:**
  ```typescript
  {
    project_id: string;
    capacity_kw: number; // 1-100
  }
  ```
- **Response:**
  ```typescript
  {
    success: true,
    data: Allocation | Array<Allocation>
  }
  ```

#### 3. Payments

**POST /api/payments/create-order**
- **Description:** Create payment order (Razorpay or mock)
- **Authentication:** Required
- **Request Body:**
  ```typescript
  {
    amount: number;
    allocation_id?: string;
    payment_type: "ALLOCATION" | "MONTHLY" | "BILL";
  }
  ```
- **Response:**
  ```typescript
  {
    success: true,
    data: {
      order_id: string;
      amount: number;
      currency: "INR";
      payment_id: string;
      key: string; // Razorpay key
      mock: boolean; // true if Razorpay not configured
    }
  }
  ```

**POST /api/payments/verify**
- **Description:** Verify payment signature
- **Authentication:** Required
- **Request Body:**
  ```typescript
  {
    payment_id: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }
  ```

#### 4. Dashboard

**GET /api/dashboard/summary**
- **Description:** Get dashboard summary statistics
- **Authentication:** Required
- **Response:**
  ```typescript
  {
    success: true,
    data: {
      totalCapacity: number; // kW
      totalSavings: number; // ₹
      co2Offset: string; // tons
      recentActivity: Array<CreditLedger>;
    }
  }
  ```

#### 5. Bills

**GET /api/bills**
- **Description:** Get user's electricity bills
- **Authentication:** Required
- **Response:**
  ```typescript
  {
    success: true,
    data: Array<Bill>
  }
  ```

**POST /api/bills**
- **Description:** Create new bill (auto-applies credits)
- **Authentication:** Required
- **Request Body:**
  ```typescript
  {
    bill_number: string;
    amount: number;
    due_date: string; // ISO date
    discom: string;
  }
  ```

**POST /api/bills/fetch**
- **Description:** Fetch bill from BBPS (future implementation)
- **Authentication:** Required

**POST /api/bills/manual**
- **Description:** Add bill manually
- **Authentication:** Required

**POST /api/bills/pay**
- **Description:** Pay bill via payment gateway
- **Authentication:** Required

#### 6. User

**GET /api/user/profile**
- **Description:** Get user profile
- **Authentication:** Required

**PUT /api/user/profile**
- **Description:** Update user profile
- **Authentication:** Required

**PUT /api/user/utility**
- **Description:** Connect/update utility information
- **Authentication:** Required
- **Request Body:**
  ```typescript
  {
    state: string;
    discom: string;
    utility_consumer_number: string; // 8-20 chars, alphanumeric
  }
  ```

#### 7. Credits

**GET /api/credits**
- **Description:** Get user's credit ledger
- **Authentication:** Required

#### 8. Notifications

**GET /api/notifications**
- **Description:** Get user notifications
- **Authentication:** Required

**PUT /api/notifications/:id/read**
- **Description:** Mark notification as read
- **Authentication:** Required

#### 9. Stats

**GET /api/stats/live**
- **Description:** Get live platform statistics
- **Authentication:** Not required (public)

#### 10. Monitoring

**GET /api/monitoring/realtime**
- **Description:** Real-time monitoring data
- **Authentication:** Required

---

## Features and Functionality

### 1. User Authentication

#### Sign Up
- Email and password registration
- Password strength validation
- Automatic profile creation via database trigger
- Email verification (if enabled in Supabase)
- Redirect to reservation flow after signup

#### Login
- Email/password authentication
- Session management via secure cookies
- Automatic session refresh via middleware
- Redirect to dashboard after login

#### Password Reset
- Forgot password flow (UI ready)
- Email-based password reset
- Secure token validation

**Implementation:**
- Supabase Auth for authentication
- Server-side session management
- Protected routes via middleware

### 2. Project Browsing

#### Features
- View all active solar projects
- Filter by state/location
- View project details (capacity, rate, location)
- Real-time available capacity display
- Project descriptions and specifications

**UI Components:**
- Project cards with animations
- Capacity availability indicators
- Location and state badges
- Rate per kWh display

### 3. Capacity Reservation

#### Flow
1. User selects a project
2. Chooses capacity (1-100 kW) via slider or presets
3. Views cost breakdown:
   - One-time reservation fee (with bulk discounts)
   - Estimated monthly savings
   - Annual savings
   - ROI period
   - Environmental impact
4. Proceeds to payment
5. Completes payment
6. Allocation created and capacity block marked as ALLOCATED

#### Capacity Calculation
- **Base Cost:** ₹35,000 per kW
- **Bulk Discounts:**
  - 0-4.99 kW: No discount
  - 5-9.99 kW: 5% discount
  - 10-24.99 kW: 10% discount
  - 25-49.99 kW: 15% discount
  - 50+ kW: 20% discount

#### Savings Calculation
- **Generation:** 4.5 kWh per kW per day
- **Monthly Generation:** 135 kWh per kW per month
- **Credit Rate:** ₹7 per kWh
- **Monthly Savings:** Capacity × 135 × ₹7
- **Project Lifespan:** 12.3 years
- **Secured Generation:** 75% guarantee

**Implementation:**
- Shared calculation constants in `lib/solar-constants.ts`
- Real-time cost updates as capacity changes
- Bulk discount automatic application

### 4. Payment Processing

#### Current Implementation
- Mock payment flow (for development)
- Razorpay integration ready (requires API keys)
- Payment order creation
- Payment verification endpoint

#### Payment Types
1. **ALLOCATION:** One-time capacity reservation
2. **MONTHLY:** Monthly subscription (future)
3. **BILL:** Bill payment (future)

#### Payment Flow
1. Create payment record in database
2. Create Razorpay order (or mock order)
3. Redirect to payment gateway
4. Verify payment signature
5. Update payment status
6. Link payment to allocation/bill

**Security:**
- Payment signature verification
- Idempotent payment processing
- Refund support (structure ready)

### 5. Utility Connection

#### Features
- State selection (10+ Indian states)
- DISCOM selection (based on state)
- Consumer number input with validation
- Format validation (8-20 chars, alphanumeric)
- Connection confirmation

#### Supported States & DISCOMs
- Maharashtra: MSEDCL, Tata Power, Adani Electricity
- Karnataka: BESCOM, MESCOM, HESCOM, GESCOM, CESCOM
- Tamil Nadu: TANGEDCO
- Gujarat: GUVNL, DGVCL, MGVCL, PGVCL, UGVCL
- Rajasthan: RVPN, JVVNL, AVVNL
- Delhi: BSES, Tata Power DDL, NDPL
- And more...

**Validation:**
- Consumer number format: 8-20 characters
- Alphanumeric with hyphens/underscores allowed
- Cannot start/end with special characters

### 6. Bill Management

#### Features
- View all electricity bills
- Bill status tracking (PENDING/PAID/OVERDUE)
- Automatic credit application
- Manual bill entry
- BBPS integration ready (UI prepared)

#### Credit Application Logic
1. When bill is created, check for PENDING credits
2. Apply credits in FIFO order (oldest first)
3. Update bill with `credits_applied`
4. Calculate `final_amount = amount - credits_applied`
5. Mark credits as APPLIED

#### Bill Display
- Bill number and date
- Original amount
- Credits applied (highlighted)
- Final amount due
- Payment status
- Due date

### 7. Dashboard

#### Overview Statistics
- **Total Capacity:** Sum of all user allocations (kW)
- **Total Savings:** Lifetime savings from credits (₹)
- **CO₂ Offset:** Environmental impact (tons)
- **Recent Activity:** Latest credit applications

#### Components
1. **Welcome Banner:** Personalized greeting with status indicators
2. **Stat Cards:** Animated counters for key metrics
3. **Real-Time Monitoring:** Live generation data (component ready)
4. **Quick Actions:** Links to reserve, connect utility, view bills
5. **Allocations List:** User's active solar capacity
6. **Credit History Chart:** Visual representation of savings over time
7. **Recent Activity:** Latest credit applications

#### Real-Time Updates
- Dashboard data fetched on page load
- Auto-refresh capability (future)
- Loading states with skeletons

### 8. Landing Page

#### Sections
1. **Hero Section:** Main value proposition with CTA
2. **Calculator Section:** Interactive savings calculator
3. **Stats Section:** Platform statistics (users, savings, projects)
4. **Benefits Section:** Key advantages of digital solar
5. **How It Works:** Step-by-step process explanation
6. **Problem vs Solution:** Comparison view
7. **Testimonials:** User reviews and ratings
8. **Utility Compatibility:** DISCOM checker
9. **Trust Section:** Certifications and compliance
10. **FAQ:** Frequently asked questions
11. **Final CTA:** Signup encouragement

#### Interactive Elements
- Animated counters
- Scroll-triggered animations
- Interactive calculator
- Smooth scrolling
- Custom cursor (desktop)
- Scroll progress indicator

### 9. Notifications

#### Types
- **Info:** General information
- **Success:** Successful operations
- **Warning:** Important notices
- **Error:** Error messages

#### Features
- Unread count badge
- Mark as read functionality
- Notification history
- Toast notifications for real-time updates

### 10. Settings (Future)

- Profile management
- Notification preferences
- Payment methods
- Account deletion

---

## Security Implementation

### Authentication & Authorization

1. **Supabase Auth**
   - Secure password hashing (bcrypt)
   - Session management via HTTP-only cookies
   - JWT tokens for API authentication
   - Email verification support

2. **Row Level Security (RLS)**
   - Database-level access control
   - Users can only access their own data
   - Admins have elevated permissions
   - Public read access for projects only

3. **Middleware Protection**
   - Session validation on every request
   - Automatic session refresh
   - Protected route enforcement

### Rate Limiting

**Implementation:** In-memory rate limiter (production should use Redis)

**Limits:**
- Authentication endpoints: 5 attempts per 15 minutes
- Payment endpoints: 10 requests per minute
- Bill fetching: 5 requests per minute
- General API: 60 requests per minute

**Headers:**
- `X-RateLimit-Limit`: Maximum requests
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp
- `Retry-After`: Seconds until retry allowed

### Input Validation

1. **Zod Schemas**
   - Signup/login validation
   - Utility connection validation
   - Payment validation
   - Profile update validation

2. **Database Constraints**
   - Email format validation
   - Phone number validation
   - Numeric range checks
   - Unique constraints

3. **API Validation**
   - Request body validation
   - Parameter sanitization
   - SQL injection prevention (via Supabase)

### Data Protection

1. **Encryption**
   - HTTPS/TLS for all communications
   - Encrypted database connections
   - Secure cookie storage

2. **Sensitive Data**
   - Passwords never stored (hashed only)
   - Payment details not stored (gateway handles)
   - Consumer numbers encrypted at rest

3. **Audit Logging**
   - All data changes logged
   - User action tracking
   - Admin-only access to audit logs

### Error Handling

1. **Error Suppression**
   - Development vs production error levels
   - Supabase placeholder credential detection
   - Graceful degradation

2. **Error Messages**
   - User-friendly error messages
   - No sensitive data in errors
   - Detailed errors only in development

### Security Headers

- `X-Content-Type-Options: nosniff`
- `Cache-Control` for static assets
- CORS configuration (if needed)

---

## User Interface & Experience

### Design System

#### Color Palette
- **Primary:** Forest Green (#0D2818)
- **Accent:** Gold (#FFB800)
- **Background:** White/Off-white (#FAFAF8)
- **Text:** Charcoal (#1A1A1A)
- **Success:** Green (#4CAF50)
- **Warning:** Orange (#FF9800)
- **Error:** Red (#F44336)

#### Typography
- **Headings:** Space Grotesk
- **Body:** Inter
- **Mono:** JetBrains Mono

#### Spacing Scale
- xs: 0.25rem
- sm: 0.5rem
- md: 1rem
- lg: 1.5rem
- xl: 2rem
- 2xl: 3rem
- 3xl: 4rem
- 4xl: 6rem
- 5xl: 8rem

#### Components

**Buttons:**
- Primary: Gold gradient with hover effects
- Outline: Border with transparent background
- Ghost: Minimal styling
- Loading states with spinners

**Cards:**
- Rounded corners (rounded-2xl, rounded-3xl)
- Shadow elevation system
- Hover effects (scale, shadow)
- Gradient backgrounds for emphasis

**Inputs:**
- Rounded corners (rounded-xl)
- Focus states with ring
- Icon support
- Validation states (error/success)

**Animations:**
- Fade in/out
- Slide transitions
- Scale effects
- Rotate animations
- Gradient shifts
- Pulse effects

### Responsive Design

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Mobile Optimizations:**
- Touch-friendly button sizes
- Simplified navigation
- Stacked layouts
- Optimized images

### Accessibility

1. **Keyboard Navigation**
   - All interactive elements keyboard accessible
   - Focus indicators visible
   - Skip to main content link

2. **Screen Readers**
   - Semantic HTML
   - ARIA labels where needed
   - Alt text for images

3. **Color Contrast**
   - WCAG AA compliant
   - High contrast mode support

### Performance

1. **Loading States**
   - Skeleton loaders for content
   - Progressive loading
   - Optimistic UI updates

2. **Image Optimization**
   - Next.js Image component
   - WebP/AVIF formats
   - Lazy loading
   - Responsive sizes

3. **Code Splitting**
   - Route-based splitting
   - Dynamic imports for heavy components
   - Tree shaking

4. **Caching**
   - Static asset caching
   - API response caching (future)
   - Browser caching headers

---

## Testing Strategy

### Test Types

#### 1. End-to-End Tests (Playwright)
**Location:** `tests/`

**Coverage:**
- Home page navigation
- Login flow
- Signup flow
- Dashboard access
- Reservation flow

**Files:**
- `home.spec.ts`: Landing page tests
- `login.spec.ts`: Authentication tests
- `dashboard.spec.ts`: Dashboard functionality

#### 2. Component Tests (Cypress)
**Location:** `cypress/component/`

**Coverage:**
- UI component rendering
- User interactions
- State management

#### 3. Automated Tests (TestSprite)
**Location:** `testsprite_tests/`

**Coverage:**
- Comprehensive application testing
- Regression testing
- Performance testing

### Test Execution

```bash
# Playwright E2E tests
npm run test

# Playwright UI mode
npm run test:ui

# Playwright headed mode
npm run test:headed

# Playwright debug mode
npm run test:debug

# View test report
npm run test:report
```

### Test Coverage Goals

- **Critical Paths:** 100% coverage
- **API Endpoints:** 80%+ coverage
- **UI Components:** 70%+ coverage
- **Business Logic:** 90%+ coverage

---

## Deployment & Infrastructure

### Environment Variables

**Required:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Optional:**
```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Build Process

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

### Deployment Platforms

**Recommended:**
- **Vercel:** Optimal for Next.js (automatic deployments)
- **Netlify:** Alternative with good Next.js support
- **AWS Amplify:** Enterprise option
- **Self-hosted:** Node.js server with PM2

### Database Setup

1. Create Supabase project
2. Run `supabase/schema.sql` in SQL Editor
3. Configure RLS policies
4. Set up triggers
5. Seed initial data (projects)

### Monitoring & Logging

**Current:**
- Console logging (development)
- Error boundaries for React errors
- API error responses

**Future:**
- Application monitoring (Sentry, LogRocket)
- Performance monitoring (Vercel Analytics)
- Database monitoring (Supabase dashboard)

---

## Performance Optimizations

### Implemented

1. **Next.js Optimizations**
   - SWC compiler for fast builds
   - Automatic code splitting
   - Image optimization
   - Font optimization

2. **React Optimizations**
   - Server Components where possible
   - Client Components only when needed
   - Memoization for expensive calculations
   - Lazy loading for heavy components

3. **Database Optimizations**
   - Indexed columns for fast queries
   - Efficient RLS policies
   - Connection pooling (via Supabase)

4. **Asset Optimizations**
   - Compressed images
   - Minified CSS/JS
   - Tree shaking
   - CDN delivery (via Vercel)

### Future Optimizations

1. **Caching**
   - Redis for API response caching
   - CDN caching for static assets
   - Browser caching strategies

2. **Database**
   - Query optimization
   - Materialized views for analytics
   - Read replicas for scaling

3. **Code**
   - Bundle size reduction
   - Dynamic imports
   - Service workers for offline support

---

## Future Enhancements

### Phase 1: Core Integrations

1. **BBPS Integration**
   - Automatic bill fetching
   - Real-time bill updates
   - Payment processing via BBPS

2. **Razorpay Integration**
   - Real payment processing
   - Payment webhooks
   - Refund management

3. **Email/SMS Notifications**
   - Welcome emails
   - Credit application notifications
   - Bill due reminders
   - Payment confirmations

### Phase 2: Enhanced Features

1. **Admin Panel**
   - Project management
   - User management
   - Capacity monitoring
   - Financial reporting

2. **KYC Verification**
   - Document upload
   - Verification workflow
   - Status tracking

3. **Advanced Analytics**
   - Savings projections
   - Environmental impact reports
   - Usage patterns
   - ROI calculators

### Phase 3: Scale & Growth

1. **Mobile Applications**
   - iOS app
   - Android app
   - React Native implementation

2. **API for Partners**
   - Public API for integrations
   - Webhook support
   - Partner dashboard

3. **Multi-language Support**
   - Hindi
   - Regional languages
   - i18n implementation

4. **Advanced Features**
   - Referral program
   - Loyalty rewards
   - Group reservations
   - Corporate accounts

---

## Appendices

### A. File Structure

```
PNP-DSnew/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (pages)/          # Public pages
│   └── (protected)/      # Authenticated pages
├── components/           # React components
│   ├── features/        # Feature components
│   ├── layout/         # Layout components
│   └── ui/             # UI components
├── lib/                 # Utilities and config
│   ├── supabase/       # Supabase clients
│   ├── security/       # Security utilities
│   └── utils/          # Helper functions
├── supabase/           # Database schema
├── tests/              # Playwright tests
├── cypress/           # Cypress tests
└── docs/              # Documentation
```

### B. Key Constants

**Solar Calculations** (`lib/solar-constants.ts`):
- Credit rate: ₹7 per kWh
- Generation: 4.5 kWh per kW per day
- Base cost: ₹35,000 per kW
- Project lifespan: 12.3 years
- Secured generation: 75%

**States & DISCOMs** (`lib/constants.ts`):
- 10+ Indian states
- 30+ DISCOMs supported

### C. API Error Codes

- `UNAUTHORIZED`: Authentication required
- `VALIDATION_ERROR`: Invalid input data
- `NOT_FOUND`: Resource not found
- `DB_ERROR`: Database operation failed
- `PAYMENT_ERROR`: Payment processing failed
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `SERVER_ERROR`: Internal server error
- `INSUFFICIENT_CAPACITY`: Not enough capacity available
- `INVALID_STATUS`: Invalid resource status

### D. Database Enums

**project_status:** DRAFT, ACTIVE, MAINTENANCE, RETIRED  
**capacity_block_status:** AVAILABLE, ALLOCATED, SUSPENDED  
**payment_status:** PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED  
**credit_ledger_status:** PENDING, APPLIED, EXPIRED  
**credit_ledger_type:** GENERATION, ADJUSTMENT, REFUND  
**payment_type:** ALLOCATION, MONTHLY, BILL  
**bill_status:** PENDING, PAID, OVERDUE  
**kyc_status:** PENDING, SUBMITTED, VERIFIED, REJECTED  
**user_role:** USER, ADMIN

### E. Environment Setup Checklist

- [ ] Node.js 18+ installed
- [ ] npm/pnpm/yarn installed
- [ ] Supabase account created
- [ ] Database schema executed
- [ ] Environment variables configured
- [ ] Razorpay account (optional)
- [ ] Git repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Development server running (`npm run dev`)

### F. Troubleshooting

**Common Issues:**

1. **Supabase Connection Errors**
   - Verify environment variables
   - Check Supabase project status
   - Verify RLS policies are enabled

2. **Payment Errors**
   - Check Razorpay credentials (if using)
   - Verify payment gateway configuration
   - Check network connectivity

3. **Build Errors**
   - Clear `.next` directory
   - Delete `node_modules` and reinstall
   - Check TypeScript errors

4. **Database Errors**
   - Verify schema is up to date
   - Check RLS policies
   - Verify foreign key constraints

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-01-27 | System | Initial comprehensive TRD |

---

**End of Document**
