# Execute Reset & Create New Plant — Step-by-Step

## Prerequisites
- ✅ Auth user exists: `hostpnp@gmail.com` / `powernetpro@2026`
- ✅ Access to Supabase SQL Editor
- ⏱️ Time: ~5 minutes

---

## Execution Steps (Run in Order in Supabase SQL Editor)

### STEP 1️⃣: Get Auth User ID

Copy and run this query:

```sql
SELECT id, email FROM auth.users WHERE email = 'hostpnp@gmail.com';
```

**Copy the returned `id` value** — this is your `{AUTH_USER_ID}`

Example result:
```
id: 1de1f0c3-3d6e-4b12-909c-537d259b854a
email: hostpnp@gmail.com
```

---

### STEP 2️⃣: Delete Old Data

Copy and run this:

```sql
DELETE FROM public.capacity_blocks
WHERE project_id = '550e8400-e29b-41d4-a716-446655440001';

DELETE FROM public.generations
WHERE project_id = '550e8400-e29b-41d4-a716-446655440001';

DELETE FROM public.ppa_agreements
WHERE project_id = '550e8400-e29b-41d4-a716-446655440001';

DELETE FROM public.projects
WHERE spv_id = 'SPV-PNP-001';
```

**Result:** Old Vedvyas data is completely removed.

---

### STEP 3️⃣: Create User Record with HOST Role

Replace `a1b2c3d4-e5f6-7890-abcd-ef1234567890` with your `{AUTH_USER_ID}` from STEP 1, then run:

```sql
INSERT INTO public.users (
  id,
  email,
  name,
  role,
  created_at,
  updated_at
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'hostpnp@gmail.com',
  'PowerNet Host',
  'HOST',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET role = 'HOST'
RETURNING id as user_id;
```

**Result:** User record created or updated.

---

### STEP 4️⃣: Create Host Profile

Replace `a1b2c3d4-e5f6-7890-abcd-ef1234567890` with your `{AUTH_USER_ID}`, then run:

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
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'PowerNet Solar Solutions',
  'Rajesh Kumar',
  'hostpnp@gmail.com',
  '9876543210',
  'ACTIVE',
  now(),
  now()
)
RETURNING id as host_id;
```

**Copy the returned `host_id`** — you'll need this for the next step.

Example result:
```
host_id: h1o2s3t4-i5d6-7890-abcd-ef1234567890
```

---

### STEP 5️⃣: Create 100 kW Solar Plant

Replace `h1o2s3t4-i5d6-7890-abcd-ef1234567890` with your `{HOST_ID}` from STEP 4, then run:

```sql
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
  'h1o2s3t4-i5d6-7890-abcd-ef1234567890',
  'DLS-PWRNET-2024',
  'api_key_pwrnet_2024_secret',
  now(),
  now()
)
RETURNING id as project_id;
```

**Copy the returned `project_id`** — you'll need this for the remaining steps.

Example result:
```
project_id: p1r2o3j4-i5d6-7890-abcd-ef1234567890
```

---

### STEP 6️⃣: Create 100 Capacity Blocks (1 kW each)

Replace `p1r2o3j4-i5d6-7890-abcd-ef1234567890` with your `{PROJECT_ID}` from STEP 5, then run:

```sql
DO $$
DECLARE
  i INTEGER;
  project_uuid UUID := 'p1r2o3j4-i5d6-7890-abcd-ef1234567890';
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
```

**Result:** 100 capacity blocks created (1 kW each, all AVAILABLE).

---

### STEP 7️⃣: Create 12 Months of Generation Data

Replace `p1r2o3j4-i5d6-7890-abcd-ef1234567890` with your `{PROJECT_ID}` from STEP 5, then run:

```sql
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
  (gen_random_uuid(), 'p1r2o3j4-i5d6-7890-abcd-ef1234567890', 4, 2026, 13500, true, 'Solar Logger', now(), now()),
  (gen_random_uuid(), 'p1r2o3j4-i5d6-7890-abcd-ef1234567890', 3, 2026, 12800, true, 'Solar Logger', now(), now()),
  (gen_random_uuid(), 'p1r2o3j4-i5d6-7890-abcd-ef1234567890', 2, 2026, 11200, true, 'Solar Logger', now(), now()),
  (gen_random_uuid(), 'p1r2o3j4-i5d6-7890-abcd-ef1234567890', 1, 2026, 10800, true, 'Solar Logger', now(), now()),
  (gen_random_uuid(), 'p1r2o3j4-i5d6-7890-abcd-ef1234567890', 12, 2025, 11500, true, 'Solar Logger', now(), now()),
  (gen_random_uuid(), 'p1r2o3j4-i5d6-7890-abcd-ef1234567890', 11, 2025, 12200, true, 'Solar Logger', now(), now()),
  (gen_random_uuid(), 'p1r2o3j4-i5d6-7890-abcd-ef1234567890', 10, 2025, 13100, true, 'Solar Logger', now(), now()),
  (gen_random_uuid(), 'p1r2o3j4-i5d6-7890-abcd-ef1234567890', 9, 2025, 12900, true, 'Solar Logger', now(), now()),
  (gen_random_uuid(), 'p1r2o3j4-i5d6-7890-abcd-ef1234567890', 8, 2025, 13400, true, 'Solar Logger', now(), now()),
  (gen_random_uuid(), 'p1r2o3j4-i5d6-7890-abcd-ef1234567890', 7, 2025, 13800, true, 'Solar Logger', now(), now()),
  (gen_random_uuid(), 'p1r2o3j4-i5d6-7890-abcd-ef1234567890', 6, 2025, 12500, true, 'Solar Logger', now(), now()),
  (gen_random_uuid(), 'p1r2o3j4-i5d6-7890-abcd-ef1234567890', 5, 2025, 11800, true, 'Solar Logger', now(), now());
```

**Result:** 12 months of generation data created (10.8 - 13.8 MWh per month).

---

### STEP 8️⃣: Create PPA Agreement

Replace both placeholders:
- `p1r2o3j4-i5d6-7890-abcd-ef1234567890` = `{PROJECT_ID}` from STEP 5
- `h1o2s3t4-i5d6-7890-abcd-ef1234567890` = `{HOST_ID}` from STEP 4

Then run:

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
  rate_escalation_percent,
  contracted_capacity_kw,
  payment_due_day,
  status,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'p1r2o3j4-i5d6-7890-abcd-ef1234567890',
  'h1o2s3t4-i5d6-7890-abcd-ef1234567890',
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
```

**Result:** PPA agreement created (10-year contract at ₹7.50/kWh, 3% annual escalation).

---

### STEP 9️⃣: Create Host Payments (Fake Billing Data)

Replace both placeholders:
- `p1r2o3j4-i5d6-7890-abcd-ef1234567890` = `{PROJECT_ID}` from STEP 5
- `h1o2s3t4-i5d6-7890-abcd-ef1234567890` = `{HOST_ID}` from STEP 4

Then run:

```sql
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
  (gen_random_uuid(), 'h1o2s3t4-i5d6-7890-abcd-ef1234567890', (SELECT id FROM public.ppa_agreements WHERE agreement_number = 'PPA-PWRNET-2024-001' LIMIT 1), 4, 2026, 13500, 7.50, 101250, 500, 101750, 'PENDING', '2026-05-10', now(), now()),
  (gen_random_uuid(), 'h1o2s3t4-i5d6-7890-abcd-ef1234567890', (SELECT id FROM public.ppa_agreements WHERE agreement_number = 'PPA-PWRNET-2024-001' LIMIT 1), 3, 2026, 12800, 7.50, 96000, 300, 96300, 'PAID', '2026-04-10', now(), now()),
  (gen_random_uuid(), 'h1o2s3t4-i5d6-7890-abcd-ef1234567890', (SELECT id FROM public.ppa_agreements WHERE agreement_number = 'PPA-PWRNET-2024-001' LIMIT 1), 2, 2026, 11200, 7.50, 84000, 200, 84200, 'PAID', '2026-03-10', now(), now()),
  (gen_random_uuid(), 'h1o2s3t4-i5d6-7890-abcd-ef1234567890', (SELECT id FROM public.ppa_agreements WHERE agreement_number = 'PPA-PWRNET-2024-001' LIMIT 1), 1, 2026, 10800, 7.50, 81000, 150, 81150, 'PAID', '2026-02-10', now(), now());
```

**Result:** 4 billing records created (1 PENDING, 3 PAID).

---

### STEP 🔟: Verify Everything

Run this to confirm all data is correct:

```sql
SELECT
  p.id as project_id,
  p.spv_id,
  p.name,
  p.total_kw,
  p.rate_per_kwh,
  p.status,
  h.business_name,
  u.email,
  u.role,
  (SELECT COUNT(*) FROM public.capacity_blocks WHERE project_id = p.id) as total_blocks,
  (SELECT COUNT(*) FROM public.generations WHERE project_id = p.id) as generation_records,
  (SELECT COUNT(*) FROM public.host_payments WHERE host_id = h.id) as payment_records
FROM public.projects p
LEFT JOIN public.hosts h ON p.host_id = h.id
LEFT JOIN public.users u ON h.user_id = u.id
WHERE p.spv_id = 'SPV-PWR-2024-001';
```

**Expected result:**
```
project_id: (UUID)
spv_id: SPV-PWR-2024-001
name: PowerNet Solar Farm - Delhi
total_kw: 100
rate_per_kwh: 7.5
status: ACTIVE
business_name: PowerNet Solar Solutions
email: hostpnp@gmail.com
role: HOST
total_blocks: 100
generation_records: 12
payment_records: 4
```

✅ If all values match → **Setup is complete!**

---

## Test It

### As Host
1. Logout from admin
2. Go to: `http://localhost:3000/host/login`
3. Login: `hostpnp@gmail.com` / `powernetpro@2026`
4. Should see: **PowerNet Solar Farm - Delhi** (100 kW)
5. View `/host/financials` → Should see 4 payment records
6. View generation data → Should see 12 months of data

### As Consumer
1. Go to: `http://localhost:3000/reserve`
2. Should see: **PowerNet Solar Farm - Delhi** in the list
3. Click to reserve capacity

### As Admin
1. Go to: `/admin/projects`
2. Should see: **PowerNet Solar Farm - Delhi** with host name
3. Should see: 100 kW, ₹7.50/kWh rate, ACTIVE status
4. Click into project → See all capacity blocks, generations, payments

---

## ✅ Done!

Your test environment is now ready with:
- ✅ 100 kW solar plant
- ✅ Host linked and active
- ✅ 100 capacity blocks (1 kW each)
- ✅ 12 months of generation data
- ✅ 10-year PPA agreement
- ✅ 4 fake payment records (1 pending, 3 paid)
