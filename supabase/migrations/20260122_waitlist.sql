-- ============================================
-- WAITLIST TABLE MIGRATION
-- Created: 2026-01-22
-- Purpose: Store early access waitlist signups
-- ============================================

-- Create waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text),
    name TEXT,
    phone TEXT CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{9,14}$'::text),
    source TEXT DEFAULT 'website', -- where they signed up from (website, referral, etc.)
    referral_code TEXT, -- if they were referred by someone
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'invited', 'converted')),
    notes TEXT, -- admin notes
    metadata JSONB DEFAULT '{}', -- additional data like UTM params
    invited_at TIMESTAMPTZ, -- when they were sent an invite
    converted_at TIMESTAMPTZ, -- when they created an account
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT waitlist_pkey PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert into waitlist (for signups)
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;
CREATE POLICY "Anyone can join waitlist" ON public.waitlist
    FOR INSERT WITH CHECK (true);

-- Only admins can view waitlist
DROP POLICY IF EXISTS "Admins can view waitlist" ON public.waitlist;
CREATE POLICY "Admins can view waitlist" ON public.waitlist
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'ADMIN'::user_role
        )
    );

-- Only admins can update waitlist
DROP POLICY IF EXISTS "Admins can update waitlist" ON public.waitlist;
CREATE POLICY "Admins can update waitlist" ON public.waitlist
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'ADMIN'::user_role
        )
    );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON public.waitlist(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist(created_at);

-- Auto-update updated_at trigger
DROP TRIGGER IF EXISTS update_waitlist_updated_at ON public.waitlist;
CREATE TRIGGER update_waitlist_updated_at
    BEFORE UPDATE ON public.waitlist
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Comment
COMMENT ON TABLE public.waitlist IS 'Stores early access waitlist signups before platform launch';
