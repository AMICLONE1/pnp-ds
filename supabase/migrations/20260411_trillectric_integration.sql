-- ============================================
-- TRILLECTRIC INTEGRATION MIGRATION
-- Created: 2026-04-11
-- Purpose: Add tables for real-time inverter
--          data sync, daily generation tracking,
--          and sync audit logging
-- ============================================

-- ============================================
-- 1. INVERTER READINGS TABLE
-- Stores every Trillectric data point per project
-- ============================================
CREATE TABLE IF NOT EXISTS public.inverter_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id),
    reading_timestamp TIMESTAMPTZ NOT NULL,

    -- Power & Energy
    ac_power NUMERIC,                -- Watts (instantaneous)
    energy_today NUMERIC,            -- kWh (cumulative for the day)
    energy_lifetime NUMERIC,         -- kWh (cumulative lifetime)
    frequency NUMERIC,               -- Hz
    power_factor NUMERIC,
    apparent_power NUMERIC,          -- VA
    reactive_power NUMERIC,          -- VAR

    -- Temperature
    inverter_temperature NUMERIC,    -- deg Celsius

    -- MPPT arrays (variable length per inverter model)
    mppt_currents JSONB,             -- number[]
    mppt_voltages JSONB,             -- number[]
    mppt_powers   JSONB,             -- number[]

    -- AC phase arrays (typically 3-phase)
    ac_currents JSONB,               -- number[]
    ac_voltages JSONB,               -- number[]

    -- String arrays (variable length)
    string_voltages JSONB,           -- number[]
    string_currents JSONB,           -- number[]
    string_powers   JSONB,           -- number[]

    -- Status & Fault
    inverter_status TEXT,
    fault TEXT,
    runtime_today NUMERIC,           -- hours
    runtime_lifetime NUMERIC,        -- hours

    -- Full original API response for this reading
    raw_payload JSONB,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Deduplication: one reading per project per timestamp
    CONSTRAINT unique_project_reading UNIQUE (project_id, reading_timestamp)
);

-- Fast lookups: latest readings per project
CREATE INDEX IF NOT EXISTS idx_inverter_readings_project_ts
    ON public.inverter_readings (project_id, reading_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_inverter_readings_created
    ON public.inverter_readings (created_at DESC);

-- ============================================
-- 2. DAILY GENERATIONS TABLE
-- Aggregated daily generation per project
-- Separate from monthly `generations` to avoid
-- breaking existing billing/credit queries
-- ============================================
CREATE TABLE IF NOT EXISTS public.daily_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id),
    date DATE NOT NULL,
    kwh NUMERIC NOT NULL DEFAULT 0,
    peak_power_w NUMERIC,            -- Max AC power observed that day
    avg_temperature NUMERIC,         -- Average inverter temperature
    reading_count INTEGER DEFAULT 0, -- Number of readings aggregated
    source TEXT DEFAULT 'TRILLECTRIC',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- One row per project per day
    CONSTRAINT unique_project_date UNIQUE (project_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_generations_project_date
    ON public.daily_generations (project_id, date DESC);

-- Auto-update updated_at
CREATE TRIGGER update_daily_generations_updated_at
    BEFORE UPDATE ON public.daily_generations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- 3. SYNC LOGS TABLE
-- Audit trail for every sync run
-- ============================================
CREATE TABLE IF NOT EXISTS public.sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id),
    sync_type TEXT NOT NULL,                    -- 'TRILLECTRIC_FETCH', 'CREDIT_DISTRIBUTE', 'MONTHLY_ROLLUP'
    status TEXT NOT NULL DEFAULT 'STARTED',     -- 'STARTED', 'SUCCESS', 'PARTIAL', 'FAILED'
    readings_fetched INTEGER DEFAULT 0,
    readings_inserted INTEGER DEFAULT 0,
    error_message TEXT,
    metadata JSONB,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sync_logs_project
    ON public.sync_logs (project_id, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_sync_logs_type_status
    ON public.sync_logs (sync_type, status);

-- ============================================
-- 4. ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all new tables
ALTER TABLE public.inverter_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

-- Admin: full access on all new tables
CREATE POLICY "Admins manage inverter_readings"
    ON public.inverter_readings FOR ALL
    USING (public.is_admin());

CREATE POLICY "Admins manage daily_generations"
    ON public.daily_generations FOR ALL
    USING (public.is_admin());

CREATE POLICY "Admins manage sync_logs"
    ON public.sync_logs FOR ALL
    USING (public.is_admin());

-- Hosts: can read their own project's inverter data
CREATE POLICY "Hosts view own inverter_readings"
    ON public.inverter_readings FOR SELECT
    USING (
        project_id IN (
            SELECT id FROM public.projects
            WHERE host_id = public.get_host_id()
        )
    );

CREATE POLICY "Hosts view own daily_generations"
    ON public.daily_generations FOR SELECT
    USING (
        project_id IN (
            SELECT id FROM public.projects
            WHERE host_id = public.get_host_id()
        )
    );

-- Users: can read inverter data for projects they have allocations in
CREATE POLICY "Users view allocated inverter_readings"
    ON public.inverter_readings FOR SELECT
    USING (
        project_id IN (
            SELECT cb.project_id
            FROM public.allocations a
            JOIN public.capacity_blocks cb ON cb.id = a.capacity_block_id
            WHERE a.user_id = auth.uid()
        )
    );

CREATE POLICY "Users view allocated daily_generations"
    ON public.daily_generations FOR SELECT
    USING (
        project_id IN (
            SELECT cb.project_id
            FROM public.allocations a
            JOIN public.capacity_blocks cb ON cb.id = a.capacity_block_id
            WHERE a.user_id = auth.uid()
        )
    );

-- ============================================
-- 5. ENSURE logger_api_key COLUMN EXISTS
-- ============================================
ALTER TABLE public.projects
    ADD COLUMN IF NOT EXISTS logger_api_key TEXT;
