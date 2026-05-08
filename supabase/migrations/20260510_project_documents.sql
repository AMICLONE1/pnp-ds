-- ============================================================================
-- 20260510 — Project documents (PPA + plant insurance)
-- ============================================================================
-- 1. Add `insurance_document_path` to public.projects (PPA path already lives
--    on ppa_agreements.agreement_document_path).
-- 2. Add timestamps so admin UI can show when each doc was uploaded.
-- 3. Create the `project-documents` storage bucket if it doesn't exist
--    (separate from `ppa-documents` so we don't conflict with legacy paths).
-- 4. Storage policies: public read (per product decision — full transparency
--    for prospective subscribers); admin-only write.
-- ============================================================================

-- ── 1. New columns ────────────────────────────────────────────────────────
ALTER TABLE public.projects
    ADD COLUMN IF NOT EXISTS insurance_document_path TEXT,
    ADD COLUMN IF NOT EXISTS insurance_uploaded_at  TIMESTAMPTZ;

ALTER TABLE public.ppa_agreements
    ADD COLUMN IF NOT EXISTS agreement_document_uploaded_at TIMESTAMPTZ;

-- ── 2. Storage buckets ───────────────────────────────────────────────────
-- Storage bucket creation is idempotent — Supabase ignores duplicate ids.
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-documents', 'project-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Make the legacy ppa-documents bucket public too, since per the new product
-- decision PPAs are visible to everyone (prospective subscribers included).
UPDATE storage.buckets SET public = true WHERE id = 'ppa-documents';

-- ── 3. Storage RLS — admin-only write, public read ───────────────────────
-- Drop any prior policies we may have created so this migration is rerunnable.
DROP POLICY IF EXISTS "project_documents_public_read"      ON storage.objects;
DROP POLICY IF EXISTS "project_documents_admin_insert"     ON storage.objects;
DROP POLICY IF EXISTS "project_documents_admin_update"     ON storage.objects;
DROP POLICY IF EXISTS "project_documents_admin_delete"     ON storage.objects;
DROP POLICY IF EXISTS "ppa_documents_public_read"          ON storage.objects;
DROP POLICY IF EXISTS "ppa_documents_admin_insert"         ON storage.objects;
DROP POLICY IF EXISTS "ppa_documents_admin_update"         ON storage.objects;
DROP POLICY IF EXISTS "ppa_documents_admin_delete"         ON storage.objects;

-- Public read on both buckets (PPA + plant insurance are public per product decision).
CREATE POLICY "project_documents_public_read"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'project-documents');

CREATE POLICY "ppa_documents_public_read"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'ppa-documents');

-- Admin-only writes (admin in our model = users.role = 'ADMIN'). The service
-- role bypasses RLS entirely so server-side admin uploads continue to work
-- regardless. These policies are defence-in-depth in case anyone tries to
-- write from an authenticated client.
CREATE POLICY "project_documents_admin_insert"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'project-documents'
        AND EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

CREATE POLICY "project_documents_admin_update"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'project-documents'
        AND EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

CREATE POLICY "project_documents_admin_delete"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'project-documents'
        AND EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

CREATE POLICY "ppa_documents_admin_insert"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'ppa-documents'
        AND EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

CREATE POLICY "ppa_documents_admin_update"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'ppa-documents'
        AND EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

CREATE POLICY "ppa_documents_admin_delete"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'ppa-documents'
        AND EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );
