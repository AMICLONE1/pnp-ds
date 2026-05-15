# How to Add Host to Vedvyas Solar Park

## Overview

The Vedvyas project currently has no host associated with it. This guide will walk you through adding a host account and linking it to the project.

---

## 🎯 What We'll Do

1. Create auth user in Supabase Auth
2. Create user record with HOST role
3. Create host profile
4. Link host to Vedvyas project
5. Verify everything is connected

---

## Step 1: Create Auth User in Supabase

### Option A: Via Supabase UI (Recommended)

1. Go to: https://app.supabase.com/project/{your-project}/auth/users
2. Click **Add User**
3. Fill in:
   ```
   Email: hostpnp@gmail.com
   Password: HostPNP123!@#
   ```
4. Click **Create User**
5. **Copy the User ID** (you'll need it next)

### Option B: Via SQL (If you prefer)

Run in Supabase SQL Editor:
```sql
INSERT INTO auth.users (
  id,
  email,
  email_confirmed_at,
  encrypted_password,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'hostpnp@gmail.com',
  now(),
  crypt('HostPNP123!@#', gen_salt('bf')),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now()
) RETURNING id;
```

**Copy the returned ID**

---

## Step 2: Create User Record with HOST Role

Run in Supabase SQL Editor:

```sql
INSERT INTO public.users (
  id,
  email,
  name,
  role,
  created_at,
  updated_at
) VALUES (
  '{PASTE_AUTH_USER_ID_HERE}',  -- From Step 1
  'hostpnp@gmail.com',
  'Vedvyas Host',
  'HOST',
  now(),
  now()
);
```

**Replace `{PASTE_AUTH_USER_ID_HERE}` with the ID from Step 1**

Example:
```sql
INSERT INTO public.users (
  id,
  email,
  name,
  role,
  created_at,
  updated_at
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',  -- Example ID
  'hostpnp@gmail.com',
  'Vedvyas Host',
  'HOST',
  now(),
  now()
);
```

---

## Step 3: Create Host Profile

Run in Supabase SQL Editor:

```sql
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
  '{PASTE_AUTH_USER_ID_HERE}',  -- Same ID from Step 1
  'Vedvyas Solar Energy',
  'Host Contact Person',
  'hostpnp@gmail.com',
  '9876543210',
  'ACTIVE',
  now(),
  now()
) RETURNING id;
```

**Replace `{PASTE_AUTH_USER_ID_HERE}` with the ID from Step 1**

**Copy the returned host ID** - you'll need it for Step 4

---

## Step 4: Link Host to Vedvyas Project

Run in Supabase SQL Editor:

```sql
UPDATE public.projects
SET host_id = '{PASTE_HOST_ID_HERE}'  -- From Step 3 return value
WHERE spv_id = 'SPV-PNP-001';
```

**Replace `{PASTE_HOST_ID_HERE}` with the host ID from Step 3**

Example:
```sql
UPDATE public.projects
SET host_id = 'h1o2s3t4-i5d6-7890-abcd-ef1234567890'
WHERE spv_id = 'SPV-PNP-001';
```

---

## Step 5: Verify the Connection

Run in Supabase SQL Editor:

```sql
SELECT
  p.spv_id,
  p.name,
  p.total_kw,
  p.host_id,
  h.business_name,
  h.contact_email,
  h.status
FROM public.projects p
LEFT JOIN public.hosts h ON p.host_id = h.id
WHERE p.spv_id = 'SPV-PNP-001';
```

**Expected Result:**
```
spv_id        | SPV-PNP-001
name          | Vedvyas Solar Park
total_kw      | 100
host_id       | h1o2s3t4-... (not null)
business_name | Vedvyas Solar Energy
contact_email | hostpnp@gmail.com
status        | ACTIVE
```

---

## Step 6: Create PPA Agreement (Optional but Recommended)

To fully test host features, create a PPA agreement:

```sql
INSERT INTO public.ppa_agreements (
  id,
  project_id,
  host_id,
  agreement_number,
  start_date,
  end_date,
  duration_years,
  rate_per_kwh,
  contracted_capacity_kw,
  status,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440001',  -- Vedvyas project ID
  '{PASTE_HOST_ID_HERE}',  -- From Step 3
  'PPA-VEV-2024-001',
  '2024-01-01',
  '2034-12-31',
  10,
  7.00,
  100,
  'ACTIVE',
  now(),
  now()
);
```

---

## Quick Copy-Paste Version

If you want all-in-one SQL (easier):

```sql
-- Step 1: Create user with HOST role (replace {USER_ID} with auth user ID from Step 1)
INSERT INTO public.users (
  id,
  email,
  name,
  role,
  created_at,
  updated_at
) VALUES (
  '{AUTH_USER_ID}',
  'hostpnp@gmail.com',
  'Vedvyas Host',
  'HOST',
  now(),
  now()
);

-- Step 2: Create host profile and link to user
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
  '{AUTH_USER_ID}',
  'Vedvyas Solar Energy',
  'Host Contact',
  'hostpnp@gmail.com',
  '9876543210',
  'ACTIVE',
  now(),
  now()
);

-- Step 3: Link host to project
-- Run this separately after getting the host ID from step 2
-- UPDATE public.projects
-- SET host_id = '{HOST_ID}'  -- Get this from step 2 return value
-- WHERE spv_id = 'SPV-PNP-001';
```

---

## Testing After Adding Host

### 1. Host Can Login
- Go to: http://localhost:3000/host/login
- Email: `hostpnp@gmail.com`
- Password: `HostPNP123!@#`
- Should see host dashboard

### 2. Host Sees Vedvyas Project
- Login as host
- Go to: http://localhost:3000/host/financials
- Should see Vedvyas plant data
- Should see generation data
- Should be able to download PPA

### 3. Admin Sees Host-Project Link
- Login as admin
- Go to: http://localhost:3000/admin/projects
- Find Vedvyas Solar Park
- Host column should show: "Vedvyas Solar Energy"
- Click to expand and see host email

---

## Troubleshooting

### Issue: "Duplicate key value violates unique constraint"
**Solution:** User already exists. Just use the existing ID.

### Issue: "Foreign key violation"
**Solution:** Make sure the auth user ID is valid and exists in auth.users

### Issue: "Host not showing in admin projects"
**Solution:** Restart dev server: `npm run dev`

### Issue: Host can't login
**Solution:** 
1. Check email is correct: `hostpnp@gmail.com`
2. Check auth user was created
3. Check public.users has HOST role

---

## Summary

| Step | What | Tool |
|------|------|------|
| 1 | Create auth user | Supabase UI or SQL |
| 2 | Create user record | SQL Editor |
| 3 | Create host profile | SQL Editor |
| 4 | Link to project | SQL Editor |
| 5 | Verify | SQL Editor |
| 6 | Optional: Create PPA | SQL Editor |

---

## ✅ Success Criteria

After completing all steps:
- ✅ Vedvyas project shows host in admin dashboard
- ✅ Host can login at /host/login
- ✅ Host sees Vedvyas in their dashboard
- ✅ Host can view financials
- ✅ Admin sees host-project link

---

**Done! Vedvyas now has a host associated with it! 🎉**
