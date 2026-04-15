-- ============================================
-- TRILLECTRIC CLEANUP + SITE IDS
-- Created: 2026-04-15
-- Purpose:
--   1. Hard-delete MIT Solar (and any other fake/mock plants) along with
--      all dependent rows: allocations, capacity_blocks, host_payments,
--      host_alerts, pending_signups, credit_ledgers, generations,
--      inverter_readings, daily_generations, sync_logs, ppa_agreements.
--      Also hard-delete the associated host and host user row.
--   2. Add `trillectric_site_ids TEXT[]` to projects so admins can bind
--      one or more Trillectric site IDs per plant during creation.
-- ============================================

BEGIN;

-- ---------------------------------------------
-- 1. Resolve target project IDs (MIT Solar + mocks)
-- ---------------------------------------------
-- We target by name pattern to cover historic variants ("MIT Solar",
-- "MIT Solar Plant", "Test …", "Demo …", "Mock …", "Sample …").
-- If you need to preserve a real plant that matches these, update its
-- name BEFORE running this migration.
DO $$
DECLARE
    target_project_ids UUID[];
    target_host_ids    UUID[];
    orphaned_host_ids  UUID[];
    target_host_user_ids UUID[];
    target_ppa_agreement_ids UUID[];
BEGIN
    SELECT COALESCE(array_agg(id), '{}')
    INTO target_project_ids
    FROM public.projects
    WHERE name ILIKE '%MIT Solar%'
       OR name ILIKE 'Test %'
       OR name ILIKE 'Demo %'
       OR name ILIKE 'Mock %'
       OR name ILIKE 'Sample %';

    IF array_length(target_project_ids, 1) IS NULL THEN
        RAISE NOTICE 'No matching plants found — nothing to delete.';
        RETURN;
    END IF;

    RAISE NOTICE 'Deleting % plants and their dependencies', array_length(target_project_ids, 1);

    -- Capture host IDs before we null/delete project rows.
    SELECT COALESCE(array_agg(DISTINCT host_id), '{}')
    INTO target_host_ids
    FROM public.projects
    WHERE id = ANY(target_project_ids) AND host_id IS NOT NULL;

    -- ---------------------------------------------
    -- 2. Delete child rows in FK-safe order
    -- ---------------------------------------------

    -- Telemetry
    DELETE FROM public.inverter_readings WHERE project_id = ANY(target_project_ids);
    DELETE FROM public.daily_generations WHERE project_id = ANY(target_project_ids);
    DELETE FROM public.sync_logs         WHERE project_id = ANY(target_project_ids);
        DELETE FROM public.host_alerts        WHERE project_id = ANY(target_project_ids);
        DELETE FROM public.pending_signups    WHERE project_id = ANY(target_project_ids);

    -- Credits referencing generations in these plants
    DELETE FROM public.credit_ledgers
    WHERE ref_type = 'generation'
      AND ref_id IN (
          SELECT id FROM public.generations WHERE project_id = ANY(target_project_ids)
      );

    DELETE FROM public.generations WHERE project_id = ANY(target_project_ids);

    -- Allocations + payments + bills for users who only had MIT allocations:
    -- First delete allocations in these plants.
    DELETE FROM public.allocations
    WHERE capacity_block_id IN (
        SELECT id FROM public.capacity_blocks WHERE project_id = ANY(target_project_ids)
    );

    -- Free capacity blocks (no FK back from projects, so safe to drop now).
    DELETE FROM public.capacity_blocks WHERE project_id = ANY(target_project_ids);

    SELECT COALESCE(array_agg(id), '{}')
    INTO target_ppa_agreement_ids
    FROM public.ppa_agreements
    WHERE project_id = ANY(target_project_ids);

    DELETE FROM public.host_payments
    WHERE ppa_agreement_id = ANY(target_ppa_agreement_ids);

    -- PPA agreements tied to these plants.
    DELETE FROM public.ppa_agreements WHERE project_id = ANY(target_project_ids);

    -- ---------------------------------------------
    -- 3. Delete the plants themselves
    -- ---------------------------------------------
    DELETE FROM public.projects WHERE id = ANY(target_project_ids);

    -- ---------------------------------------------
    -- 4. Delete orphaned hosts + host user rows
    --    Only drop hosts that no longer have any plant.
    -- ---------------------------------------------
    IF array_length(target_host_ids, 1) IS NOT NULL THEN
        -- Keep only hosts that are no longer referenced by any remaining plant.
        SELECT COALESCE(array_agg(DISTINCT h.id), '{}')
        INTO orphaned_host_ids
        FROM public.hosts h
        WHERE h.id = ANY(target_host_ids)
          AND NOT EXISTS (
              SELECT 1 FROM public.projects p WHERE p.host_id = h.id
          );

        IF array_length(orphaned_host_ids, 1) IS NOT NULL THEN
            -- Remove any remaining host-owned rows before dropping the host.
            DELETE FROM public.host_payments WHERE host_id = ANY(orphaned_host_ids);
            DELETE FROM public.host_invoices WHERE host_id = ANY(orphaned_host_ids);
            DELETE FROM public.host_alerts   WHERE host_id = ANY(orphaned_host_ids);

            -- Find host user IDs before deleting the host rows.
            SELECT COALESCE(array_agg(DISTINCT h.user_id), '{}')
            INTO target_host_user_ids
            FROM public.hosts h
            WHERE h.id = ANY(orphaned_host_ids);

            DELETE FROM public.hosts
            WHERE id = ANY(orphaned_host_ids);

            -- Hard delete the backing user rows (public.users + auth.users).
            IF array_length(target_host_user_ids, 1) IS NOT NULL THEN
                DELETE FROM public.users    WHERE id = ANY(target_host_user_ids);
                DELETE FROM auth.users      WHERE id = ANY(target_host_user_ids);
            END IF;
        END IF;
    END IF;
END $$;

-- ---------------------------------------------
-- 5. Add trillectric_site_ids column to projects
-- ---------------------------------------------
ALTER TABLE public.projects
    ADD COLUMN IF NOT EXISTS trillectric_site_ids TEXT[] DEFAULT '{}'::TEXT[];

COMMENT ON COLUMN public.projects.trillectric_site_ids IS
    'One or more Trillectric site IDs bound to this plant. Used by /api/projects/[id]/live and the daily generation sync.';

CREATE INDEX IF NOT EXISTS idx_projects_trillectric_site_ids
    ON public.projects USING GIN (trillectric_site_ids);

COMMIT;
