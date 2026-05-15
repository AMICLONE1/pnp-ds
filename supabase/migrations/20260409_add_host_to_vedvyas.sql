-- Add Host to Vedvyas Solar Park Project
-- Run this in Supabase SQL Editor to link a host to the Vedvyas project

-- Step 1: Get or create an auth user for the host (if not exists)
-- First, check if the host user exists in auth.users
-- You may need to create this via Supabase UI: hostpnp@gmail.com

-- Step 2: Create user record in public.users table
INSERT INTO public.users (
  id,
  email,
  name,
  role,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'hostpnp@gmail.com',
  'Vedvyas Host',
  'HOST',
  now(),
  now()
)
ON CONFLICT (email) DO UPDATE SET
  role = 'HOST'
RETURNING id;

-- NOTE: Copy the returned ID from above and use it in the next steps

-- Step 3: Create host profile record (replace {host_user_id} with ID from step 2)
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
  '{host_user_id}',  -- REPLACE WITH ID FROM STEP 2
  'Vedvyas Solar Energy',
  'Host Contact',
  'hostpnp@gmail.com',
  '9876543210',
  'ACTIVE',
  now(),
  now()
)
RETURNING id;

-- NOTE: Copy the returned host ID from above for step 4

-- Step 4: Link host to Vedvyas project (replace {host_id} with ID from step 3)
UPDATE public.projects
SET host_id = '{host_id}'  -- REPLACE WITH HOST ID FROM STEP 3
WHERE spv_id = 'SPV-PNP-001';

-- Step 5: Verify the connection
SELECT
  p.id,
  p.spv_id,
  p.name,
  p.host_id,
  h.business_name,
  h.contact_email
FROM public.projects p
LEFT JOIN public.hosts h ON p.host_id = h.id
WHERE p.spv_id = 'SPV-PNP-001';

-- Expected Result:
-- Should show Vedvyas project with host details populated
