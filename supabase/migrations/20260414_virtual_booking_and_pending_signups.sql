-- ============================================================================
-- 20260414 — Virtual booking + pending signups
-- ============================================================================
-- 1. Drop the legacy "Allocated capacity exceeds block capacity" trigger and
--    any check constraint that ties allocation.capacity_kw to block.kw. From
--    now on, every allocation gets its OWN freshly-created capacity_block row
--    sized exactly to the user's request — no shared blocks, no rounding.
--
-- 2. Add project-level capacity guard: a trigger that prevents creating a new
--    capacity_block if SUM(blocks.kw) for that project would exceed
--    projects.total_kw.
--
-- 3. Create `pending_signups` table to hold signup data BEFORE the user has an
--    auth account. The auth.users row is only created after Razorpay payment
--    is verified, so unpaid users never exist on the platform.
-- ============================================================================

-- ─── 1. Drop legacy block-capacity guard ───────────────────────────────────
-- Drop every non-internal trigger on public.allocations. The legacy
-- "Allocated capacity exceeds block capacity" guard lives here; we'll
-- re-create only the updated_at trigger we actually want below.
DO $$
DECLARE
  trig_name TEXT;
BEGIN
  FOR trig_name IN
    SELECT t.tgname
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    WHERE c.relname = 'allocations'
      AND NOT t.tgisinternal
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.allocations', trig_name);
  END LOOP;
END $$;

-- Leaving any orphan "check block capacity" functions in place is harmless —
-- with no trigger referencing them they will never execute. They can be
-- dropped manually later by name if desired.

-- Re-create the updated_at trigger that the cleanup loop above removed.
DROP TRIGGER IF EXISTS update_allocations_updated_at ON public.allocations;
CREATE TRIGGER update_allocations_updated_at
  BEFORE UPDATE ON public.allocations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ─── 2. Project-level capacity guard ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.enforce_project_capacity()
RETURNS TRIGGER AS $$
DECLARE
  project_total NUMERIC;
  used NUMERIC;
BEGIN
  SELECT total_kw INTO project_total FROM public.projects WHERE id = NEW.project_id;
  IF project_total IS NULL THEN
    RAISE EXCEPTION 'Project % does not exist', NEW.project_id;
  END IF;

  -- Only ALLOCATED blocks count toward used capacity. Legacy AVAILABLE seed
  -- rows from the old shared-block model are ignored under the virtual
  -- booking model.
  SELECT COALESCE(SUM(kw), 0) INTO used
  FROM public.capacity_blocks
  WHERE project_id = NEW.project_id
    AND status = 'ALLOCATED'
    AND id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);

  IF used + NEW.kw > project_total THEN
    RAISE EXCEPTION 'Project capacity exceeded: % kW used + % kW requested > % kW total',
      used, NEW.kw, project_total;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_project_capacity_trigger ON public.capacity_blocks;
CREATE TRIGGER enforce_project_capacity_trigger
  BEFORE INSERT OR UPDATE OF kw, project_id ON public.capacity_blocks
  FOR EACH ROW EXECUTE FUNCTION public.enforce_project_capacity();

-- ─── 2b. Ensure payment_type enum has the values we need ─────────────────
-- Some environments were migrated with a different set of labels. Make the
-- canonical four values exist; existing labels are left alone.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_type') THEN
    CREATE TYPE payment_type AS ENUM ('ALLOCATION', 'MONTHLY', 'BILL');
  END IF;
END $$;

ALTER TYPE payment_type ADD VALUE IF NOT EXISTS 'ALLOCATION';
ALTER TYPE payment_type ADD VALUE IF NOT EXISTS 'MONTHLY';
ALTER TYPE payment_type ADD VALUE IF NOT EXISTS 'BILL';

-- ─── 3. pending_signups table ──────────────────────────────────────────────
-- Holds signup payload + bcrypt password hash + linked Razorpay order until
-- payment is verified. After verification, the row is deleted and a real
-- auth.users row is created.
CREATE TABLE IF NOT EXISTS public.pending_signups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  state TEXT,
  discom TEXT,
  utility_consumer_number TEXT,
  kyc_type TEXT,
  kyc_number TEXT,
  project_id UUID NOT NULL REFERENCES public.projects(id),
  capacity_kw NUMERIC NOT NULL CHECK (capacity_kw > 0),
  amount_inr NUMERIC NOT NULL CHECK (amount_inr > 0),
  razorpay_order_id TEXT UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 hour'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pending_signups_email ON public.pending_signups(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_pending_signups_order ON public.pending_signups(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_pending_signups_expires ON public.pending_signups(expires_at);

-- Service role only — no public RLS access.
ALTER TABLE public.pending_signups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service role only" ON public.pending_signups;
CREATE POLICY "service role only" ON public.pending_signups
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Cleanup helper: delete expired pending signups. Call from a cron or run
-- ad-hoc. Indexed on expires_at, so cheap.
CREATE OR REPLACE FUNCTION public.cleanup_expired_pending_signups()
RETURNS INTEGER AS $$
DECLARE
  deleted INTEGER;
BEGIN
  DELETE FROM public.pending_signups WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted = ROW_COUNT;
  RETURN deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
