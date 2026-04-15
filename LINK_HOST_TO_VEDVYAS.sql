-- Link Existing Host User to Vedvyas Solar Park Project
-- Use this if you already have a host user created in auth.users

-- STEP 1: Get the user ID from auth.users
-- Run this to find the user ID:
SELECT id, email FROM auth.users WHERE email = 'hostpnp@gmail.com';

-- NOTE: Copy the returned ID and use it in the steps below
-- Let's call this {USER_ID}

-- ============================================
-- STEP 2: Create user record in public.users with HOST role
-- Replace {USER_ID} with the ID from STEP 1
-- ============================================
INSERT INTO public.users (
  id,
  email,
  name,
  role,
  created_at,
  updated_at
) VALUES (
  '{USER_ID}',  -- REPLACE WITH ID FROM STEP 1
  'hostpnp@gmail.com',
  'Vedvyas Host',
  'HOST',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  role = 'HOST'
RETURNING id;

-- ============================================
-- STEP 3: Create host profile
-- Replace {USER_ID} with the ID from STEP 1
-- ============================================
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
  '{USER_ID}',  -- REPLACE WITH ID FROM STEP 1
  'Vedvyas Solar Energy',
  'Host Contact',
  'hostpnp@gmail.com',
  '9876543210',
  'ACTIVE',
  now(),
  now()
)
RETURNING id as host_id;

-- NOTE: Copy the returned host_id from above for STEP 4

-- ============================================
-- STEP 4: Link host to Vedvyas project
-- Replace {HOST_ID} with the ID returned from STEP 3
-- ============================================
UPDATE public.projects
SET host_id = '{HOST_ID}'  -- REPLACE WITH HOST_ID FROM STEP 3
WHERE spv_id = 'SPV-PNP-001';

-- ============================================
-- STEP 5: Verify the connection
-- ============================================
SELECT
  p.spv_id,
  p.name,
  p.total_kw,
  p.host_id,
  h.business_name,
  h.contact_email,
  u.email,
  u.role
FROM public.projects p
LEFT JOIN public.hosts h ON p.host_id = h.id
LEFT JOIN public.users u ON h.user_id = u.id
WHERE p.spv_id = 'SPV-PNP-001';

-- Expected Result:
-- spv_id: SPV-PNP-001
-- name: Vedvyas Solar Park
-- host_id: (should NOT be null)
-- business_name: Vedvyas Solar Energy
-- contact_email: hostpnp@gmail.com
-- email: hostpnp@gmail.com
-- role: HOST
