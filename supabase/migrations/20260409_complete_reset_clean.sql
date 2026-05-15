-- ============================================================
-- COMPLETE RESET & CREATE NEW 100kW PLANT
-- Auth user ID: 1de1f0c3-3d6e-4b12-909c-537d259b854a (hostpnp@gmail.com)
-- ============================================================

-- ============================================================
-- STEP 1: DELETE OLD DATA (Vedvyas project)
-- ============================================================
DELETE FROM public.capacity_blocks
WHERE project_id = '550e8400-e29b-41d4-a716-446655440001';

DELETE FROM public.generations
WHERE project_id = '550e8400-e29b-41d4-a716-446655440001';

DELETE FROM public.ppa_agreements
WHERE project_id = '550e8400-e29b-41d4-a716-446655440001';

DELETE FROM public.projects
WHERE spv_id = 'SPV-PNP-001';

-- ============================================================
-- STEP 2: GET EXISTING HOST ID (or create new host)
-- ============================================================
-- First, check if host already exists for this user
SELECT id as host_id, user_id, business_name
FROM public.hosts
WHERE user_id = '1de1f0c3-3d6e-4b12-909c-537d259b854a';

-- If no host exists, run this to create one:
-- (Skip if host already exists from above query)
INSERT INTO public.hosts (
  id,
  user_id,
  business_name,
  contact_name,
  contact_email,
  contact_phone,
  status,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '1de1f0c3-3d6e-4b12-909c-537d259b854a',
  'PowerNet Solar Solutions',
  'Rajesh Kumar',
  'hostpnp@gmail.com',
  '9876543210',
  'ACTIVE',
  now(),
  now()
)
ON CONFLICT (user_id) DO UPDATE SET
  business_name = 'PowerNet Solar Solutions',
  status = 'ACTIVE',
  updated_at = now()
RETURNING id as host_id;

-- ============================================================
-- STEP 3: CREATE 100 kW SOLAR PLANT
-- Copy the host_id from STEP 2 and paste below:
-- ============================================================
INSERT INTO public.projects (
  id,
  spv_id,
  name,
  total_kw,
  rate_per_kwh,
  location,
  state,
  status,
  description,
  host_id,
  data_logger_serial_id,
  logger_api_key,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'SPV-PWR-2024-001',
  'PowerNet Solar Farm - Delhi',
  100.00,
  7.50,
  'New Delhi, Delhi',
  'Delhi',
  'ACTIVE',
  'A 100kW commercial solar plant providing clean energy and credits. Modern infrastructure with real-time monitoring.',
  (SELECT id FROM public.hosts WHERE user_id = '1de1f0c3-3d6e-4b12-909c-537d259b854a' LIMIT 1),
  'DLS-PWRNET-2024',
  'api_key_pwrnet_2024_secret',
  now(),
  now()
)
RETURNING id as project_id;

-- ============================================================
-- STEP 4: CREATE 100 CAPACITY BLOCKS (1 kW each)
-- Copy the project_id from STEP 3 and paste below:
-- ============================================================
DO $$
DECLARE
  i INTEGER;
  project_uuid UUID := (SELECT id FROM public.projects WHERE spv_id = 'SPV-PWR-2024-001' LIMIT 1);
BEGIN
  FOR i IN 1..100 LOOP
    INSERT INTO public.capacity_blocks (
      id,
      project_id,
      kw,
      status,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      project_uuid,
      1.00,
      'AVAILABLE',
      now(),
      now()
    );
  END LOOP;
END $$;

-- ============================================================
-- STEP 5: CREATE 12 MONTHS OF GENERATION DATA
-- ============================================================
INSERT INTO public.generations (
  id,
  project_id,
  month,
  year,
  kwh,
  validated,
  source,
  created_at,
  updated_at
) VALUES
  (gen_random_uuid(), (SELECT id FROM public.projects WHERE spv_id = 'SPV-PWR-2024-001' LIMIT 1), 4, 2026, 13500, true, 'Solar Logger', now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.projects WHERE spv_id = 'SPV-PWR-2024-001' LIMIT 1), 3, 2026, 12800, true, 'Solar Logger', now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.projects WHERE spv_id = 'SPV-PWR-2024-001' LIMIT 1), 2, 2026, 11200, true, 'Solar Logger', now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.projects WHERE spv_id = 'SPV-PWR-2024-001' LIMIT 1), 1, 2026, 10800, true, 'Solar Logger', now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.projects WHERE spv_id = 'SPV-PWR-2024-001' LIMIT 1), 12, 2025, 11500, true, 'Solar Logger', now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.projects WHERE spv_id = 'SPV-PWR-2024-001' LIMIT 1), 11, 2025, 12200, true, 'Solar Logger', now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.projects WHERE spv_id = 'SPV-PWR-2024-001' LIMIT 1), 10, 2025, 13100, true, 'Solar Logger', now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.projects WHERE spv_id = 'SPV-PWR-2024-001' LIMIT 1), 9, 2025, 12900, true, 'Solar Logger', now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.projects WHERE spv_id = 'SPV-PWR-2024-001' LIMIT 1), 8, 2025, 13400, true, 'Solar Logger', now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.projects WHERE spv_id = 'SPV-PWR-2024-001' LIMIT 1), 7, 2025, 13800, true, 'Solar Logger', now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.projects WHERE spv_id = 'SPV-PWR-2024-001' LIMIT 1), 6, 2025, 12500, true, 'Solar Logger', now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.projects WHERE spv_id = 'SPV-PWR-2024-001' LIMIT 1), 5, 2025, 11800, true, 'Solar Logger', now(), now());

-- ============================================================
-- STEP 6: CREATE PPA AGREEMENT
-- ============================================================
INSERT INTO public.ppa_agreements (
  id,
  project_id,
  host_id,
  agreement_number,
  start_date,
  end_date,
  duration_years,
  rate_per_kwh,
  rate_escalation_percent,
  contracted_capacity_kw,
  payment_due_day,
  status,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM public.projects WHERE spv_id = 'SPV-PWR-2024-001' LIMIT 1),
  (SELECT id FROM public.hosts WHERE user_id = '1de1f0c3-3d6e-4b12-909c-537d259b854a' LIMIT 1),
  'PPA-PWRNET-2024-001',
  '2024-01-01',
  '2034-12-31',
  10,
  7.50,
  3.0,
  100,
  10,
  'ACTIVE',
  now(),
  now()
);

-- ============================================================
-- STEP 7: CREATE HOST PAYMENTS (Fake Billing Data)
-- ============================================================
INSERT INTO public.host_payments (
  id,
  host_id,
  ppa_agreement_id,
  billing_month,
  billing_year,
  generation_kwh,
  rate_per_kwh,
  base_amount,
  adjustments,
  total_amount,
  status,
  due_date,
  created_at,
  updated_at
) VALUES
  (gen_random_uuid(), (SELECT id FROM public.hosts WHERE user_id = '1de1f0c3-3d6e-4b12-909c-537d259b854a' LIMIT 1), (SELECT id FROM public.ppa_agreements WHERE agreement_number = 'PPA-PWRNET-2024-001' LIMIT 1), 4, 2026, 13500, 7.50, 101250, 500, 101750, 'PENDING', '2026-05-10', now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.hosts WHERE user_id = '1de1f0c3-3d6e-4b12-909c-537d259b854a' LIMIT 1), (SELECT id FROM public.ppa_agreements WHERE agreement_number = 'PPA-PWRNET-2024-001' LIMIT 1), 3, 2026, 12800, 7.50, 96000, 300, 96300, 'PAID', '2026-04-10', now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.hosts WHERE user_id = '1de1f0c3-3d6e-4b12-909c-537d259b854a' LIMIT 1), (SELECT id FROM public.ppa_agreements WHERE agreement_number = 'PPA-PWRNET-2024-001' LIMIT 1), 2, 2026, 11200, 7.50, 84000, 200, 84200, 'PAID', '2026-03-10', now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.hosts WHERE user_id = '1de1f0c3-3d6e-4b12-909c-537d259b854a' LIMIT 1), (SELECT id FROM public.ppa_agreements WHERE agreement_number = 'PPA-PWRNET-2024-001' LIMIT 1), 1, 2026, 10800, 7.50, 81000, 150, 81150, 'PAID', '2026-02-10', now(), now());

-- ============================================================
-- STEP 8: VERIFY EVERYTHING IS CREATED CORRECTLY
-- ============================================================
SELECT
  p.id as project_id,
  p.spv_id,
  p.name,
  p.total_kw,
  p.rate_per_kwh,
  p.status,
  h.id as host_id,
  h.business_name,
  u.id as user_id,
  u.email,
  u.role,
  (SELECT COUNT(*) FROM public.capacity_blocks WHERE project_id = p.id) as total_blocks,
  (SELECT COUNT(*) FROM public.generations WHERE project_id = p.id) as generation_records,
  (SELECT COUNT(*) FROM public.host_payments WHERE host_id = h.id) as payment_records
FROM public.projects p
LEFT JOIN public.hosts h ON p.host_id = h.id
LEFT JOIN public.users u ON h.user_id = u.id
WHERE p.spv_id = 'SPV-PWR-2024-001';

-- Expected result:
-- spv_id: SPV-PWR-2024-001
-- name: PowerNet Solar Farm - Delhi
-- total_kw: 100
-- rate_per_kwh: 7.5
-- status: ACTIVE
-- business_name: PowerNet Solar Solutions
-- email: hostpnp@gmail.com
-- role: HOST
-- total_blocks: 100
-- generation_records: 12
-- payment_records: 4
