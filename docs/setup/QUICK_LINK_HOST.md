# Quick: Link Existing Host to Vedvyas

## You Already Have:
- ✅ Auth user: `hostpnp@gmail.com` / `powernetpro@2026`
- ✅ Vedvyas project: SPV-PNP-001 (100 kW)
- ❌ Host not linked to project

---

## 3 Simple Steps (2 Minutes)

### Step 1: Get User ID
In Supabase SQL Editor, run:
```sql
SELECT id, email FROM auth.users WHERE email = 'hostpnp@gmail.com';
```

**Copy the returned `id`** - you'll need it next

Example result:
```
id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
email: hostpnp@gmail.com
```

---

### Step 2: Create Host Profile
In Supabase SQL Editor, run:

```sql
INSERT INTO public.users (
  id,
  email,
  name,
  role,
  created_at,
  updated_at
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',  -- PASTE ID FROM STEP 1
  'hostpnp@gmail.com',
  'Vedvyas Host',
  'HOST',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET role = 'HOST'
RETURNING id;
```

Then run:
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
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',  -- PASTE ID FROM STEP 1
  'Vedvyas Solar Energy',
  'Host Contact',
  'hostpnp@gmail.com',
  '9876543210',
  'ACTIVE',
  now(),
  now()
)
RETURNING id as host_id;
```

**Copy the returned `host_id`** - you'll need it next

Example result:
```
host_id: h1o2s3t4-i5d6-7890-abcd-ef1234567890
```

---

### Step 3: Link to Vedvyas
In Supabase SQL Editor, run:

```sql
UPDATE public.projects
SET host_id = 'h1o2s3t4-i5d6-7890-abcd-ef1234567890'  -- PASTE HOST_ID FROM STEP 2
WHERE spv_id = 'SPV-PNP-001';
```

**Done!** ✅ Host is now linked to Vedvyas

---

## Verify It Worked

Run this to check:
```sql
SELECT
  p.spv_id,
  p.name,
  h.business_name,
  u.email,
  u.role
FROM public.projects p
LEFT JOIN public.hosts h ON p.host_id = h.id
LEFT JOIN public.users u ON h.user_id = u.id
WHERE p.spv_id = 'SPV-PNP-001';
```

Should return:
```
spv_id: SPV-PNP-001
name: Vedvyas Solar Park
business_name: Vedvyas Solar Energy
email: hostpnp@gmail.com
role: HOST
```

---

## Test as Host

1. **Logout** from admin
2. Go to: `http://localhost:3000/host/login`
3. Login with:
   - Email: `hostpnp@gmail.com`
   - Password: `powernetpro@2026`
4. Should see **Vedvyas Solar Park** in dashboard

---

## ✅ What You Can Test Now

After linking:
- ✅ Host can login at `/host/login`
- ✅ Host can see Vedvyas in dashboard
- ✅ Host can view `/host/financials`
- ✅ Host can see generation data
- ✅ Host can view plant overview
- ✅ Admin can see host in projects list
- ✅ Complete host flow testing

---

## File Reference

If you want all SQL in one file:
- **LINK_HOST_TO_VEDVYAS.sql** - Has all 5 steps

---

**That's it! Just 3 SQL queries and you're done! 🚀**
