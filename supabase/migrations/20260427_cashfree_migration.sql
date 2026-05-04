-- ============================================================================
-- 20260427 — Cashfree migration
-- ============================================================================
-- 1. Rename pending_signups.razorpay_order_id → gateway_order_id and update
--    its index to a gateway-neutral name. The host_payments table already
--    uses gateway_order_id / gateway_payment_id / gateway_signature, so no
--    rename is needed there.
-- 2. Add a unique index on payments.gateway_order_id so verify-by-order is
--    safe and idempotent (driver flow looked up by gateway_order_id).
-- 3. Extend payment status enum (or check) to allow REFUNDED if it is not
--    already supported.
-- ============================================================================

-- ─── 1. pending_signups.razorpay_order_id → gateway_order_id ──────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'pending_signups'
      AND column_name = 'razorpay_order_id'
  ) THEN
    -- If gateway_order_id already exists (re-run safety), drop the legacy
    -- column instead of renaming over it.
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'pending_signups'
        AND column_name = 'gateway_order_id'
    ) THEN
      ALTER TABLE public.pending_signups DROP COLUMN razorpay_order_id;
    ELSE
      ALTER TABLE public.pending_signups RENAME COLUMN razorpay_order_id TO gateway_order_id;
    END IF;
  END IF;
END $$;

-- Make sure column exists in any environment that never had the legacy name.
ALTER TABLE public.pending_signups
  ADD COLUMN IF NOT EXISTS gateway_order_id TEXT;

-- Drop the legacy razorpay-named index, recreate gateway-neutral one.
DROP INDEX IF EXISTS public.idx_pending_signups_order;

CREATE UNIQUE INDEX IF NOT EXISTS idx_pending_signups_gateway_order_id
  ON public.pending_signups(gateway_order_id)
  WHERE gateway_order_id IS NOT NULL;

-- ─── 2. payments.gateway_order_id uniqueness ──────────────────────────────
-- Driver verify route looks up payments by gateway_order_id. Make it unique
-- (where present) so we cannot end up with duplicate orders in flight.
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_gateway_order_id
  ON public.payments(gateway_order_id)
  WHERE gateway_order_id IS NOT NULL;

-- ─── 3. REFUNDED status support ──────────────────────────────────────────
-- payments.status is text-with-CHECK in some environments, payment_status enum
-- in others. Try the enum path first; fall back to a no-op if the type is not
-- an enum.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    BEGIN
      EXECUTE 'ALTER TYPE payment_status ADD VALUE IF NOT EXISTS ''REFUNDED''';
    EXCEPTION WHEN others THEN
      -- If the enum doesn't exist or already has the value, ignore.
      NULL;
    END;
  END IF;
END $$;

-- ─── 4. Drop legacy razorpay_* indexes on host_payments (gateway-neutral
--      indexes already exist; old razorpay_*-named ones, if any, can go) ──
DROP INDEX IF EXISTS public.idx_host_payments_razorpay_order_id;
DROP INDEX IF EXISTS public.idx_host_payments_razorpay_payment_id;

-- ─── 5. Optional: drop legacy razorpay_* columns from `payments` ──────────
-- Some environments had razorpay_order_id / razorpay_payment_id columns on
-- public.payments before the gateway_* columns were introduced. Drop them
-- only if present.
DO $$
DECLARE
  legacy_col TEXT;
BEGIN
  FOREACH legacy_col IN ARRAY ARRAY['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature'] LOOP
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'payments'
        AND column_name = legacy_col
    ) THEN
      EXECUTE format('ALTER TABLE public.payments DROP COLUMN %I', legacy_col);
    END IF;
  END LOOP;
END $$;
