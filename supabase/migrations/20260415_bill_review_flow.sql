-- ============================================================================
-- 20260415 — Manual reviewed bill payment flow
-- ============================================================================
-- BBPS integration is deferred. Instead: the user uploads their DISCOM bill
-- (PDF/image), the row enters SUBMITTED state, an admin reviews it and either
-- APPROVES (bill becomes PAID, solar credits auto-applied) or REJECTS.
--
-- This migration:
--   1. Adds a `bill_review_status` enum + review columns on `bills`.
--   2. Creates the `bill-proofs` storage bucket (private, signed URLs only).
--   3. Adds RLS policies so users only see their own bills and only admins
--      can run the review action.
-- ============================================================================

-- ─── 1. review_status enum ─────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE bill_review_status AS ENUM ('SUBMITTED', 'APPROVED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ─── 2. columns on bills ───────────────────────────────────────────────────
ALTER TABLE public.bills
  ADD COLUMN IF NOT EXISTS proof_url TEXT,
  ADD COLUMN IF NOT EXISTS review_status bill_review_status,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS review_notes TEXT,
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_bills_review_status ON public.bills(review_status)
  WHERE review_status IS NOT NULL;

-- ─── 3. private storage bucket for bill proofs ─────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('bill-proofs', 'bill-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Users can upload proofs to their own folder: {user_id}/{bill_id}.{ext}
DROP POLICY IF EXISTS "users upload own bill proofs" ON storage.objects;
CREATE POLICY "users upload own bill proofs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'bill-proofs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "users read own bill proofs" ON storage.objects;
CREATE POLICY "users read own bill proofs" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'bill-proofs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admin reads everything. role check happens at the app layer via the service
-- role client, but we add a SELECT policy for authenticated admins too so the
-- admin UI can fetch signed URLs without needing the service-role key.
DROP POLICY IF EXISTS "admins read all bill proofs" ON storage.objects;
CREATE POLICY "admins read all bill proofs" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'bill-proofs'
    AND EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role = 'ADMIN'
    )
  );

-- ─── 4. RLS on bills: users see own rows, admins see all ───────────────────
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users read own bills" ON public.bills;
CREATE POLICY "users read own bills" ON public.bills
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "users insert own bills" ON public.bills;
CREATE POLICY "users insert own bills" ON public.bills
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admins read all bills" ON public.bills;
CREATE POLICY "admins read all bills" ON public.bills
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  );

-- Service role bypasses RLS automatically. Admin review endpoint uses the
-- admin client so no UPDATE policy is needed for admins here.
