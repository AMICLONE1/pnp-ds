-- ============================================
-- DIGITAL SOLAR DATABASE SCHEMA v3.0
-- Matches actual Supabase schema structure
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CREATE ENUM TYPES
-- ============================================
DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('DRAFT', 'ACTIVE', 'MAINTENANCE', 'RETIRED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE capacity_block_status AS ENUM ('AVAILABLE', 'ALLOCATED', 'SUSPENDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE credit_ledger_status AS ENUM ('PENDING', 'APPLIED', 'EXPIRED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE credit_ledger_type AS ENUM ('GENERATION', 'ADJUSTMENT', 'REFUND');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_type AS ENUM ('ALLOCATION', 'MONTHLY', 'BILL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE bill_status AS ENUM ('PENDING', 'PAID', 'OVERDUE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE kyc_status AS ENUM ('PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID NOT NULL,
    email TEXT CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text),
    phone TEXT UNIQUE CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{9,14}$'::text),
    name TEXT,
    kyc_status kyc_status DEFAULT 'PENDING'::kyc_status,
    aadhaar_number TEXT UNIQUE,
    pan_number TEXT,
    utility_consumer_number TEXT,
    state TEXT,
    discom TEXT,
    role user_role DEFAULT 'USER'::user_role,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT TRUE,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    spv_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    total_kw NUMERIC NOT NULL,
    rate_per_kwh NUMERIC NOT NULL,
    location TEXT NOT NULL,
    state TEXT NOT NULL,
    status project_status DEFAULT 'DRAFT'::project_status,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT projects_pkey PRIMARY KEY (id)
);

-- ============================================
-- CAPACITY_BLOCKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.capacity_blocks (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL,
    kw NUMERIC NOT NULL CHECK (kw > 0::numeric),
    status capacity_block_status DEFAULT 'AVAILABLE'::capacity_block_status,
    allocated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT capacity_blocks_pkey PRIMARY KEY (id),
    CONSTRAINT capacity_blocks_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);

-- ============================================
-- ALLOCATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.allocations (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    capacity_block_id UUID NOT NULL UNIQUE,
    payment_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    capacity_kw NUMERIC NOT NULL CHECK (capacity_kw > 0::numeric),
    CONSTRAINT allocations_pkey PRIMARY KEY (id),
    CONSTRAINT allocations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
    CONSTRAINT allocations_capacity_block_id_fkey FOREIGN KEY (capacity_block_id) REFERENCES public.capacity_blocks(id),
    CONSTRAINT allocations_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id)
);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    amount NUMERIC NOT NULL CHECK (amount > 0::numeric),
    type payment_type NOT NULL,
    status payment_status DEFAULT 'PENDING'::payment_status,
    transaction_id TEXT UNIQUE,
    gateway TEXT,
    gateway_order_id TEXT,
    gateway_payment_id TEXT,
    metadata JSONB,
    refunded_at TIMESTAMPTZ,
    refund_amount NUMERIC,
    bill_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT payments_pkey PRIMARY KEY (id),
    CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
    CONSTRAINT payments_bill_id_fkey FOREIGN KEY (bill_id) REFERENCES public.bills(id)
);

-- ============================================
-- CREDIT_LEDGERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.credit_ledgers (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    amount NUMERIC NOT NULL,
    type credit_ledger_type NOT NULL,
    status credit_ledger_status DEFAULT 'PENDING'::credit_ledger_status,
    month INTEGER CHECK (month >= 1 AND month <= 12),
    year INTEGER CHECK (year IS NULL OR year >= 2000 AND year <= 2100),
    ref_id UUID,
    ref_type TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT credit_ledgers_pkey PRIMARY KEY (id),
    CONSTRAINT credit_ledgers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- ============================================
-- GENERATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.generations (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL CHECK (year >= 2000 AND year <= 2100),
    kwh NUMERIC NOT NULL CHECK (kwh >= 0::numeric),
    validated BOOLEAN DEFAULT FALSE,
    source TEXT,
    validated_by UUID,
    validated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT generations_pkey PRIMARY KEY (id),
    CONSTRAINT generations_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id),
    CONSTRAINT generations_validated_by_fkey FOREIGN KEY (validated_by) REFERENCES public.users(id)
);

-- ============================================
-- BILLS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.bills (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    discom TEXT NOT NULL,
    bill_number TEXT,
    amount NUMERIC NOT NULL CHECK (amount >= 0::numeric),
    credits_applied NUMERIC DEFAULT 0 CHECK (credits_applied >= 0::numeric),
    due_date TIMESTAMPTZ NOT NULL,
    status bill_status DEFAULT 'PENDING'::bill_status,
    bbps_bill_id TEXT UNIQUE,
    fetched_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT bills_pkey PRIMARY KEY (id),
    CONSTRAINT bills_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info'::text CHECK (type = ANY (ARRAY['info'::text, 'success'::text, 'warning'::text, 'error'::text])),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT notifications_pkey PRIMARY KEY (id),
    CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- ============================================
-- AUDIT_LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action = ANY (ARRAY['INSERT'::text, 'UPDATE'::text, 'DELETE'::text])),
    old_data JSONB,
    new_data JSONB,
    user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT audit_log_pkey PRIMARY KEY (id),
    CONSTRAINT audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capacity_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_ledgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Users: Can only read/update own record
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Projects: Anyone can view active projects
DROP POLICY IF EXISTS "Anyone can view active projects" ON public.projects;
CREATE POLICY "Anyone can view active projects" ON public.projects
    FOR SELECT USING (status = 'ACTIVE'::project_status);

-- Capacity Blocks: Users can view available blocks
DROP POLICY IF EXISTS "Anyone can view available capacity blocks" ON public.capacity_blocks;
CREATE POLICY "Anyone can view available capacity blocks" ON public.capacity_blocks
    FOR SELECT USING (status = 'AVAILABLE'::capacity_block_status);

-- Allocations: Users can only see their own
DROP POLICY IF EXISTS "Users can view own allocations" ON public.allocations;
CREATE POLICY "Users can view own allocations" ON public.allocations
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own allocations" ON public.allocations;
CREATE POLICY "Users can insert own allocations" ON public.allocations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own allocations" ON public.allocations;
CREATE POLICY "Users can update own allocations" ON public.allocations
    FOR UPDATE USING (auth.uid() = user_id);

-- Payments: Users can only see their own
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own payments" ON public.payments;
CREATE POLICY "Users can insert own payments" ON public.payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Credit Ledgers: Users can only see their own
DROP POLICY IF EXISTS "Users can view own credit ledgers" ON public.credit_ledgers;
CREATE POLICY "Users can view own credit ledgers" ON public.credit_ledgers
    FOR SELECT USING (auth.uid() = user_id);

-- Generations: Anyone can view (for transparency)
DROP POLICY IF EXISTS "Anyone can view generations" ON public.generations;
CREATE POLICY "Anyone can view generations" ON public.generations
    FOR SELECT USING (true);

-- Bills: Users can only see their own
DROP POLICY IF EXISTS "Users can view own bills" ON public.bills;
CREATE POLICY "Users can view own bills" ON public.bills
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own bills" ON public.bills;
CREATE POLICY "Users can insert own bills" ON public.bills
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own bills" ON public.bills;
CREATE POLICY "Users can update own bills" ON public.bills
    FOR UPDATE USING (auth.uid() = user_id);

-- Notifications: Users can only see their own
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Audit Log: Only admins can view (or no one, depending on your needs)
DROP POLICY IF EXISTS "Admins can view audit log" ON public.audit_log;
CREATE POLICY "Admins can view audit log" ON public.audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'ADMIN'::user_role
        )
    );

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
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
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

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_allocations_updated_at ON public.allocations;
CREATE TRIGGER update_allocations_updated_at
    BEFORE UPDATE ON public.allocations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_capacity_blocks_updated_at ON public.capacity_blocks;
CREATE TRIGGER update_capacity_blocks_updated_at
    BEFORE UPDATE ON public.capacity_blocks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_credit_ledgers_updated_at ON public.credit_ledgers;
CREATE TRIGGER update_credit_ledgers_updated_at
    BEFORE UPDATE ON public.credit_ledgers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_bills_updated_at ON public.bills;
CREATE TRIGGER update_bills_updated_at
    BEFORE UPDATE ON public.bills
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_allocations_user_id ON public.allocations(user_id);
CREATE INDEX IF NOT EXISTS idx_allocations_capacity_block_id ON public.allocations(capacity_block_id);
CREATE INDEX IF NOT EXISTS idx_allocations_payment_id ON public.allocations(payment_id);
CREATE INDEX IF NOT EXISTS idx_capacity_blocks_project_id ON public.capacity_blocks(project_id);
CREATE INDEX IF NOT EXISTS idx_capacity_blocks_status ON public.capacity_blocks(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON public.payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_credit_ledgers_user_id ON public.credit_ledgers(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_ledgers_period ON public.credit_ledgers(year, month);
CREATE INDEX IF NOT EXISTS idx_credit_ledgers_status ON public.credit_ledgers(status);
CREATE INDEX IF NOT EXISTS idx_bills_user_id ON public.bills(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_status ON public.bills(status);
CREATE INDEX IF NOT EXISTS idx_bills_bbps_bill_id ON public.bills(bbps_bill_id);
CREATE INDEX IF NOT EXISTS idx_generations_project_id ON public.generations(project_id);
CREATE INDEX IF NOT EXISTS idx_generations_period ON public.generations(year, month);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id) WHERE read = FALSE;
CREATE INDEX IF NOT EXISTS idx_audit_log_table_record ON public.audit_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log(created_at);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get project_id from capacity_block_id
CREATE OR REPLACE FUNCTION public.get_project_from_block(block_id UUID)
RETURNS UUID AS $$
BEGIN
    RETURN (SELECT project_id FROM public.capacity_blocks WHERE id = block_id);
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to calculate available capacity for a project
CREATE OR REPLACE FUNCTION public.get_available_capacity(proj_id UUID)
RETURNS NUMERIC AS $$
BEGIN
    RETURN COALESCE(
        (SELECT SUM(kw) FROM public.capacity_blocks 
         WHERE project_id = proj_id AND status = 'AVAILABLE'::capacity_block_status),
        0
    );
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- SEED DATA (only if projects don't exist)
-- ============================================

-- Insert sample projects
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.projects WHERE spv_id = 'MAH-SOLAR-001') THEN
        INSERT INTO public.projects (spv_id, name, total_kw, rate_per_kwh, location, state, status, description)
        VALUES ('MAH-SOLAR-001', 'Maharashtra Solar Farm', 500000, 5.00, 'Nagpur, Maharashtra', 'Maharashtra', 'ACTIVE'::project_status, 'A 500 MW solar farm in the Vidarbha region, one of India''s largest community solar projects.');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.projects WHERE spv_id = 'KAR-SOLAR-001') THEN
        INSERT INTO public.projects (spv_id, name, total_kw, rate_per_kwh, location, state, status, description)
        VALUES ('KAR-SOLAR-001', 'Karnataka Green Energy', 300000, 4.50, 'Tumkur, Karnataka', 'Karnataka', 'ACTIVE'::project_status, 'State-of-the-art solar installation in Karnataka with excellent solar irradiance.');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.projects WHERE spv_id = 'TN-SOLAR-001') THEN
        INSERT INTO public.projects (spv_id, name, total_kw, rate_per_kwh, location, state, status, description)
        VALUES ('TN-SOLAR-001', 'Tamil Nadu Solar Park', 400000, 4.80, 'Ramanathapuram, Tamil Nadu', 'Tamil Nadu', 'ACTIVE'::project_status, 'Part of Tamil Nadu''s ambitious renewable energy program, located in Ramanathapuram.');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.projects WHERE spv_id = 'GUJ-SOLAR-001') THEN
        INSERT INTO public.projects (spv_id, name, total_kw, rate_per_kwh, location, state, status, description)
        VALUES ('GUJ-SOLAR-001', 'Gujarat Sun Project', 600000, 4.20, 'Kutch, Gujarat', 'Gujarat', 'ACTIVE'::project_status, 'Located in the sunny Kutch region with exceptional capacity factors.');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.projects WHERE spv_id = 'RAJ-SOLAR-001') THEN
        INSERT INTO public.projects (spv_id, name, total_kw, rate_per_kwh, location, state, status, description)
        VALUES ('RAJ-SOLAR-001', 'Rajasthan Desert Solar', 800000, 3.80, 'Jodhpur, Rajasthan', 'Rajasthan', 'ACTIVE'::project_status, 'Massive solar installation in Thar Desert with highest solar radiation in India.');
    END IF;
END $$;
