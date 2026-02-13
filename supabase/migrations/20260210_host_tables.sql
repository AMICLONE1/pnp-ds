-- ============================================
-- HOST ANALYTICS PLATFORM MIGRATION
-- Created: 2026-02-10
-- Purpose: Add HOST role, create host tables,
--          PPA agreements, payments, invoices, alerts
-- ============================================

-- ============================================
-- 1. EXTEND USER ROLE ENUM WITH 'HOST'
-- ============================================
-- Add HOST to existing user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'HOST';

-- ============================================
-- 2. NEW ENUM TYPES
-- ============================================
DO $$ BEGIN
    CREATE TYPE host_status AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ppa_status AS ENUM ('DRAFT', 'ACTIVE', 'EXPIRED', 'TERMINATED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE host_payment_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'DISPUTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE invoice_status AS ENUM ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE alert_severity AS ENUM ('INFO', 'WARNING', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE alert_status AS ENUM ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 3. HOSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.hosts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),

    -- Business Information
    business_name TEXT NOT NULL,
    business_type TEXT,
    gst_number TEXT CHECK (gst_number IS NULL OR gst_number ~* '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'),
    pan_number TEXT CHECK (pan_number IS NULL OR pan_number ~* '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'),

    -- Contact Information
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,

    -- Address
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT CHECK (pincode IS NULL OR pincode ~* '^[1-9][0-9]{5}$'),

    -- Banking Details
    bank_name TEXT,
    bank_account_number TEXT,
    bank_ifsc TEXT CHECK (bank_ifsc IS NULL OR bank_ifsc ~* '^[A-Z]{4}0[A-Z0-9]{6}$'),
    bank_beneficiary_name TEXT,

    -- Status
    status host_status DEFAULT 'PENDING'::host_status,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES public.users(id),

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_hosts_user_id ON public.hosts(user_id);
CREATE INDEX IF NOT EXISTS idx_hosts_status ON public.hosts(status);

-- ============================================
-- 4. EXTEND PROJECTS TABLE WITH host_id
-- ============================================
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS host_id UUID REFERENCES public.hosts(id);

CREATE INDEX IF NOT EXISTS idx_projects_host_id ON public.projects(host_id);

-- ============================================
-- 5. PPA AGREEMENTS TABLE
-- ============================================
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
    rate_per_kwh NUMERIC NOT NULL CHECK (rate_per_kwh > 0),
    rate_escalation_percent NUMERIC DEFAULT 0,
    minimum_guarantee_kwh NUMERIC,

    -- Capacity
    contracted_capacity_kw NUMERIC NOT NULL CHECK (contracted_capacity_kw > 0),

    -- Payment Terms
    payment_due_day INTEGER DEFAULT 10 CHECK (payment_due_day >= 1 AND payment_due_day <= 28),
    payment_grace_days INTEGER DEFAULT 7,
    late_fee_percent NUMERIC DEFAULT 2.0,

    -- Status
    status ppa_status DEFAULT 'DRAFT'::ppa_status,
    signed_at TIMESTAMPTZ,

    -- Document Storage
    agreement_document_path TEXT,

    -- Metadata
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_dates CHECK (end_date > start_date)
);

CREATE INDEX IF NOT EXISTS idx_ppa_agreements_host_id ON public.ppa_agreements(host_id);
CREATE INDEX IF NOT EXISTS idx_ppa_agreements_project_id ON public.ppa_agreements(project_id);
CREATE INDEX IF NOT EXISTS idx_ppa_agreements_status ON public.ppa_agreements(status);

-- ============================================
-- 6. HOST INVOICES TABLE (created before payments due to FK)
-- ============================================
CREATE TABLE IF NOT EXISTS public.host_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID NOT NULL REFERENCES public.hosts(id),

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

    -- Document
    pdf_path TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_host_invoices_host_id ON public.host_invoices(host_id);
CREATE INDEX IF NOT EXISTS idx_host_invoices_status ON public.host_invoices(status);

-- ============================================
-- 7. HOST PAYMENTS TABLE
-- ============================================
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
    base_amount NUMERIC NOT NULL,
    adjustments NUMERIC DEFAULT 0,
    late_fee NUMERIC DEFAULT 0,
    total_amount NUMERIC NOT NULL,

    -- Payment Details
    status host_payment_status DEFAULT 'PENDING'::host_payment_status,
    due_date DATE NOT NULL,
    paid_at TIMESTAMPTZ,
    payment_method TEXT,
    payment_reference TEXT,

    -- Metadata
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT unique_billing_period UNIQUE (host_id, billing_month, billing_year)
);

CREATE INDEX IF NOT EXISTS idx_host_payments_host_id ON public.host_payments(host_id);
CREATE INDEX IF NOT EXISTS idx_host_payments_status ON public.host_payments(status);
CREATE INDEX IF NOT EXISTS idx_host_payments_period ON public.host_payments(billing_year, billing_month);

-- ============================================
-- 8. HOST ALERTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.host_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID NOT NULL REFERENCES public.hosts(id),
    project_id UUID REFERENCES public.projects(id),

    -- Alert Details
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    severity alert_severity NOT NULL DEFAULT 'INFO'::alert_severity,
    status alert_status DEFAULT 'ACTIVE'::alert_status,

    -- Category
    category TEXT NOT NULL CHECK (category IN (
        'GENERATION', 'MAINTENANCE', 'PAYMENT', 'SYSTEM', 'WEATHER'
    )),

    -- Metadata
    metadata JSONB,
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by UUID REFERENCES public.users(id),
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES public.users(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_host_alerts_host_id ON public.host_alerts(host_id);
CREATE INDEX IF NOT EXISTS idx_host_alerts_status ON public.host_alerts(status);
CREATE INDEX IF NOT EXISTS idx_host_alerts_active ON public.host_alerts(host_id) WHERE status = 'ACTIVE';

-- ============================================
-- 9. SECURITY DEFINER HELPER FUNCTIONS
-- These bypass RLS to avoid infinite recursion
-- when policies reference public.users table
-- ============================================

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT public.get_user_role() = 'ADMIN'::user_role;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_host()
RETURNS boolean AS $$
  SELECT public.get_user_role() = 'HOST'::user_role;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_host_id()
RETURNS UUID AS $$
  SELECT id FROM public.hosts WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- 10. ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE public.hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ppa_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_alerts ENABLE ROW LEVEL SECURITY;

-- Hosts: own profile access
CREATE POLICY "Hosts can view own profile" ON public.hosts
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Hosts can update own profile" ON public.hosts
    FOR UPDATE USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage hosts" ON public.hosts
    FOR ALL USING (public.is_admin());

-- PPA Agreements: host can view own
CREATE POLICY "Hosts can view own PPAs" ON public.ppa_agreements
    FOR SELECT USING (host_id = public.get_host_id());

CREATE POLICY "Admins can manage PPAs" ON public.ppa_agreements
    FOR ALL USING (public.is_admin());

-- Host Payments: host can view own
CREATE POLICY "Hosts can view own payments" ON public.host_payments
    FOR SELECT USING (host_id = public.get_host_id());

CREATE POLICY "Admins can manage host payments" ON public.host_payments
    FOR ALL USING (public.is_admin());

-- Host Invoices: host can view own
CREATE POLICY "Hosts can view own invoices" ON public.host_invoices
    FOR SELECT USING (host_id = public.get_host_id());

CREATE POLICY "Admins can manage host invoices" ON public.host_invoices
    FOR ALL USING (public.is_admin());

-- Host Alerts: host can view & acknowledge own
CREATE POLICY "Hosts can view own alerts" ON public.host_alerts
    FOR SELECT USING (host_id = public.get_host_id());

CREATE POLICY "Hosts can acknowledge own alerts" ON public.host_alerts
    FOR UPDATE USING (host_id = public.get_host_id());

CREATE POLICY "Admins can manage host alerts" ON public.host_alerts
    FOR ALL USING (public.is_admin());

-- Extend projects policy so hosts can view their own
CREATE POLICY "Hosts can view own projects" ON public.projects
    FOR SELECT USING (host_id = public.get_host_id());

-- ============================================
-- 10. AUTO-UPDATE TRIGGERS
-- ============================================
CREATE TRIGGER update_hosts_updated_at
    BEFORE UPDATE ON public.hosts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_ppa_agreements_updated_at
    BEFORE UPDATE ON public.ppa_agreements
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_host_payments_updated_at
    BEFORE UPDATE ON public.host_payments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_host_invoices_updated_at
    BEFORE UPDATE ON public.host_invoices
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_host_alerts_updated_at
    BEFORE UPDATE ON public.host_alerts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
