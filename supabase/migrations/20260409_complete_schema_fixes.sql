-- Migration: Complete Schema Fixes for Phase 2
-- Step 1: Add missing columns to projects table if they don't exist
-- These are critical for the admin projects API to work correctly

BEGIN;

-- Add columns one at a time to avoid conflicts
DO $$ BEGIN
    ALTER TABLE public.projects ADD COLUMN data_logger_serial_id TEXT;
EXCEPTION
    WHEN duplicate_column THEN
        RAISE NOTICE 'Column data_logger_serial_id already exists';
END $$;

DO $$ BEGIN
    ALTER TABLE public.projects ADD COLUMN logger_api_key TEXT;
EXCEPTION
    WHEN duplicate_column THEN
        RAISE NOTICE 'Column logger_api_key already exists';
END $$;

-- Step 2: Create unique index on data_logger_serial_id (allow NULLs)
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_data_logger_serial_id
ON public.projects(data_logger_serial_id)
WHERE data_logger_serial_id IS NOT NULL;

-- Step 3: Create essential indexes for query performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_host_id ON public.projects(host_id);
CREATE INDEX IF NOT EXISTS idx_projects_spv_id ON public.projects(spv_id);
CREATE INDEX IF NOT EXISTS idx_ppa_agreements_project_id ON public.ppa_agreements(project_id);
CREATE INDEX IF NOT EXISTS idx_ppa_agreements_host_id ON public.ppa_agreements(host_id);
CREATE INDEX IF NOT EXISTS idx_ppa_agreements_status ON public.ppa_agreements(status);
CREATE INDEX IF NOT EXISTS idx_capacity_blocks_project_id ON public.capacity_blocks(project_id);
CREATE INDEX IF NOT EXISTS idx_capacity_blocks_status ON public.capacity_blocks(status);
CREATE INDEX IF NOT EXISTS idx_credit_ledgers_user_id ON public.credit_ledgers(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_ledgers_status ON public.credit_ledgers(status);
CREATE INDEX IF NOT EXISTS idx_generations_project_id ON public.generations(project_id);
CREATE INDEX IF NOT EXISTS idx_generations_year_month ON public.generations(year, month);
CREATE INDEX IF NOT EXISTS idx_host_payments_host_id ON public.host_payments(host_id);
CREATE INDEX IF NOT EXISTS idx_host_payments_status ON public.host_payments(status);
CREATE INDEX IF NOT EXISTS idx_bills_user_id ON public.bills(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_status ON public.bills(status);

-- Step 4: Create storage bucket for PPA documents (if it doesn't exist)
-- This is safe to run multiple times
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('ppa-documents', 'ppa-documents', false, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- MANUAL STEP: Create RLS policies via Supabase dashboard if needed
-- The bucket was created by this migration. For RLS policies:
-- 1. Go to Supabase Dashboard > Storage > ppa-documents bucket
-- 2. Click "Policies" tab
-- 3. Add policy for authenticated users to read:
--    - SELECT: auth.role() = 'authenticated'
--    - Paths: ppa-documents/**
-- 4. Add policy for authenticated users to upload (admin only in practice):
--    - INSERT: auth.role() = 'authenticated'
--    - Paths: ppa-documents/**
