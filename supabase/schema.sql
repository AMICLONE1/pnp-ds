-- ============================================
-- DIGITAL SOLAR DATABASE SCHEMA v2.0
-- Compatible with existing schema structure
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CREATE ENUM TYPES (if they don't exist)
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
-- USERS TABLE (update if needed)
-- ============================================
-- Table already exists, just ensure columns exist
DO $$ 
BEGIN
    -- Add columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_notifications') THEN
        ALTER TABLE public.users ADD COLUMN email_notifications BOOLEAN DEFAULT TRUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'sms_notifications') THEN
        ALTER TABLE public.users ADD COLUMN sms_notifications BOOLEAN DEFAULT TRUE;
    END IF;
END $$;

-- ============================================
-- PROJECTS TABLE (already exists)
-- ============================================
-- Table structure matches existing schema

-- ============================================
-- CAPACITY_BLOCKS TABLE (already exists)
-- ============================================
-- Table structure matches existing schema

-- ============================================
-- ALLOCATIONS TABLE (already exists)
-- ============================================
-- Table structure matches existing schema

-- ============================================
-- PAYMENTS TABLE (already exists)
-- ============================================
-- Table structure matches existing schema

-- ============================================
-- CREDIT_LEDGERS TABLE (already exists)
-- ============================================
-- Table structure matches existing schema

-- ============================================
-- GENERATIONS TABLE (already exists)
-- ============================================
-- Table structure matches existing schema

-- ============================================
-- BILLS TABLE (already exists)
-- ============================================
-- Table structure matches existing schema

-- ============================================
-- NOTIFICATIONS TABLE (create if doesn't exist)
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
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
ALTER TABLE public.capacity_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_ledgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users: Can only read/update own record
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Projects: Anyone can view active projects (using enum value)
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

-- Notifications: Users can only see their own
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
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
CREATE INDEX IF NOT EXISTS idx_capacity_blocks_project_id ON public.capacity_blocks(project_id);
CREATE INDEX IF NOT EXISTS idx_capacity_blocks_status ON public.capacity_blocks(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_credit_ledgers_user_id ON public.credit_ledgers(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_ledgers_period ON public.credit_ledgers(year, month);
CREATE INDEX IF NOT EXISTS idx_bills_user_id ON public.bills(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_status ON public.bills(status);
CREATE INDEX IF NOT EXISTS idx_generations_project_id ON public.generations(project_id);
CREATE INDEX IF NOT EXISTS idx_generations_period ON public.generations(year, month);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id) WHERE read = FALSE;

-- ============================================
-- SEED DATA (only if projects don't exist)
-- ============================================

-- Insert sample projects (using your schema structure)
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
