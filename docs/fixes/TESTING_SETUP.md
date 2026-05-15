# PowerNetPro - Testing Setup & Mock Data Guide

## Overview

This guide helps you set up test data to test all admin, host, and consumer features.

---

## 🎯 Test Accounts to Create

### 1. Admin Account (For Admin Dashboard)
```
Email:    admin@powernetpro.test
Password: AdminTest123!@#
Role:     ADMIN
Access:   /admin/login → /admin/projects, /admin/credits, etc.
```

### 2. Host Account (For Host Dashboard)
```
Email:    host@vedvyas.test
Password: HostTest123!@#
Role:     HOST
Access:   /host/login → /host, /host/financials, etc.
```

### 3. Consumer Account (For Consumer Signup & Purchase)
```
Email:    consumer@powernetpro.test
Password: ConsumerTest123!@#
Role:     USER
Access:   /login → /reserve (view projects) → /signup
```

---

## 📝 Step 1: Create Test Accounts in Supabase

### Go to Supabase Dashboard
1. Navigate to: https://app.supabase.com/project/{your-project}/auth/users
2. Click **Add User** (or use SQL)

### Create Admin Account

**Option A: Via UI**
- Email: `admin@powernetpro.test`
- Password: `AdminTest123!@#`
- Click **Create User**

**Option B: Via SQL**
```sql
-- Create admin user
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
  'admin@powernetpro.test',
  now(),
  crypt('AdminTest123!@#', gen_salt('bf')),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now()
) RETURNING id;
```

### Create Host Account
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
  'host@vedvyas.test',
  now(),
  crypt('HostTest123!@#', gen_salt('bf')),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now()
) RETURNING id;
```

### Create Consumer Account
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
  'consumer@powernetpro.test',
  now(),
  crypt('ConsumerTest123!@#', gen_salt('bf')),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now()
) RETURNING id;
```

---

## 🗂️ Step 2: Set User Roles

After creating users, you need to set their roles in the `users` table:

### Create users table records with roles

```sql
-- Get the IDs from previous step and use them here

-- Admin user (replace {admin_id} with actual UUID from step 1)
INSERT INTO public.users (
  id,
  email,
  name,
  role,
  created_at,
  updated_at
) VALUES (
  '{admin_id}',
  'admin@powernetpro.test',
  'Admin User',
  'ADMIN',
  now(),
  now()
);

-- Host user (replace {host_id} with actual UUID from step 1)
INSERT INTO public.users (
  id,
  email,
  name,
  role,
  created_at,
  updated_at
) VALUES (
  '{host_id}',
  'host@vedvyas.test',
  'Vedvyas Host',
  'HOST',
  now(),
  now()
);

-- Consumer user (replace {consumer_id} with actual UUID from step 1)
INSERT INTO public.users (
  id,
  email,
  name,
  role,
  created_at,
  updated_at
) VALUES (
  '{consumer_id}',
  'consumer@powernetpro.test',
  'Consumer User',
  'USER',
  now(),
  now()
);
```

---

## 🏢 Step 3: Create Host Profile (For Host Dashboard)

Link the host user to a host profile:

```sql
-- Get the host user ID from step 2 (replace {host_id})
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
  '{host_id}',
  'Vedvyas Solar',
  'Host Contact',
  'host@vedvyas.test',
  '9876543210',
  'ACTIVE',
  now(),
  now()
);
```

---

## 🌞 Step 4: Link Project to Host

The Vedvyas project needs to be linked to the host:

```sql
-- Get the host ID from step 3 and project ID (550e8400-e29b-41d4-a716-446655440001)
UPDATE public.projects
SET host_id = '{host_id}'
WHERE spv_id = 'SPV-PNP-001';
```

---

## 📋 Step 5: Create PPA Agreement (For Host)

```sql
-- Create PPA agreement linking host to project
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
  '550e8400-e29b-41d4-a716-446655440001',
  '{host_id}',
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

## 💰 Step 6: Create Sample Credits for Consumer

For testing the credits ledger and consumer dashboard:

```sql
-- Create some sample credits for the consumer
-- Get consumer user ID from step 2 (replace {consumer_id})

INSERT INTO public.credit_ledgers (
  id,
  user_id,
  amount,
  type,
  status,
  month,
  year,
  description,
  created_at,
  updated_at
) VALUES
  (gen_random_uuid(), '{consumer_id}', 5000, 'GENERATION', 'PENDING', 4, 2026, 'April 2026 generation credit', now(), now()),
  (gen_random_uuid(), '{consumer_id}', 4800, 'GENERATION', 'APPLIED', 3, 2026, 'March 2026 generation credit', now(), now()),
  (gen_random_uuid(), '{consumer_id}', 500, 'ADJUSTMENT', 'APPLIED', 3, 2026, 'Maintenance adjustment', now(), now()),
  (gen_random_uuid(), '{consumer_id}', 4500, 'GENERATION', 'APPLIED', 2, 2026, 'February 2026 generation credit', now(), now());
```

---

## 📊 Step 7: Create Sample Generations Data

For testing generation tracking:

```sql
-- Insert generation data for Vedvyas project
-- Project ID: 550e8400-e29b-41d4-a716-446655440001

INSERT INTO public.generations (
  id,
  project_id,
  month,
  year,
  kwh,
  validated,
  created_at,
  updated_at
) VALUES
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001', 4, 2026, 12150, true, now(), now()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001', 3, 2026, 11890, true, now(), now()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001', 2, 2026, 11760, true, now(), now()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001', 1, 2026, 11500, true, now(), now()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001', 12, 2025, 11200, true, now(), now());
```

---

## 🔐 Step 8: Set Admin Email in .env.local

For admin authentication to work:

```
NEXT_PUBLIC_ADMIN_LOGIN_EMAIL=admin@powernetpro.test
```

---

## ✅ Testing Checklist

After setting up all the above, test each role:

### Admin Testing
- [ ] Go to http://localhost:3000/admin/login
- [ ] Login with: `admin@powernetpro.test` / `AdminTest123!@#`
- [ ] See admin dashboard
- [ ] Go to `/admin/projects`
  - [ ] See Vedvyas Solar Park project (ACTIVE status)
  - [ ] Click on project to view details
- [ ] Go to `/admin/credits`
  - [ ] See consumer credits
  - [ ] Search by name
  - [ ] Filter by status (PENDING/APPLIED)
- [ ] Go to `/admin/stats`
  - [ ] See dashboard statistics
- [ ] Go to `/admin/users`
  - [ ] See all users (admin, host, consumer)

### Host Testing
- [ ] Go to http://localhost:3000/host/login
- [ ] Login with: `host@vedvyas.test` / `HostTest123!@#`
- [ ] See host dashboard at `/host`
  - [ ] View plant overview
  - [ ] See generation data
- [ ] Go to `/host/financials`
  - [ ] See billing history
  - [ ] See payment status
  - [ ] View revenue charts
- [ ] Go to `/host/plants`
  - [ ] See plant details

### Consumer Testing
- [ ] Go to http://localhost:3000/login
- [ ] Login with: `consumer@powernetpro.test` / `ConsumerTest123!@#`
- [ ] See consumer dashboard
- [ ] Go to `/reserve`
  - [ ] See Vedvyas Solar Park (ACTIVE project)
  - [ ] Click to view project details
  - [ ] See available capacity
- [ ] Go to `/settings`
  - [ ] See user profile and credits

---

## 🧪 Testing the New Phase 2 Features

### Admin - Create Project with PPA
- [ ] Go to `/admin/projects`
- [ ] Click "Create Project" button
- [ ] Fill in project details:
  - SPV ID: `SPV-PNP-TEST-002`
  - Name: `Test Solar Project`
  - Capacity: `50 kW`
  - Rate: `7.5 ₹/kWh`
  - Location: `Mumbai`
  - State: `Maharashtra`
- [ ] Upload a PDF file as PPA
- [ ] Submit form
- [ ] Verify project appears in list with DRAFT status

### Admin - Toggle Project Status
- [ ] In projects list, click on newly created project
- [ ] Change status from DRAFT to ACTIVE
- [ ] Save changes
- [ ] Verify consumer can now see it in `/reserve`

### Admin - View PPA Document
- [ ] In projects list, click "View PPA" button
- [ ] See PDF opens in iframe modal
- [ ] Verify you can download the PDF

### Admin - Credits Ledger
- [ ] Go to `/admin/credits`
- [ ] Test search: type "Consumer"
- [ ] Test filter: select "PENDING" status
- [ ] Test pagination: go to next page if available

### Host - Access Their PPA
- [ ] Login as host
- [ ] Should be able to download their PPA
- [ ] See in financials dashboard

### Consumer - See Only ACTIVE Projects
- [ ] Login as consumer
- [ ] Go to `/reserve`
- [ ] Should only see Vedvyas (ACTIVE)
- [ ] Should NOT see test project if still DRAFT

---

## 🔧 Troubleshooting

### "Email already exists" Error
**Solution:** Change email addresses to unique values (add timestamp)

### "User not found" Error
**Solution:** Make sure users were created in auth.users AND public.users tables

### "Cannot login" Error
**Solution:** Check NEXT_PUBLIC_ADMIN_LOGIN_EMAIL in .env.local matches admin email

### "No projects showing" Error
**Solution:** Verify projects table has at least the Vedvyas project with ACTIVE status

### "Credits not showing" Error
**Solution:** Verify credit_ledgers table has entries for the consumer user ID

---

## 📌 SQL Setup Script (All-in-One)

If you want to run everything at once, here's a consolidated script:

```sql
-- WARNING: This will create test data
-- Make sure you're in a test/development environment!

-- Step 1: Create auth users (via Supabase UI is safer)
-- Step 2-6: Can be run in SQL Editor

-- Assume these UUIDs from step 1:
-- Admin: e1f2d3c4-a5b6-7c8d-9e0f-1a2b3c4d5e6f
-- Host:  f2e3d4c5-b6a7-8d9e-0f1a-2b3c4d5e6f7a
-- Consumer: a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d

-- Create users records with roles
INSERT INTO public.users (id, email, name, role, created_at, updated_at)
VALUES 
  ('e1f2d3c4-a5b6-7c8d-9e0f-1a2b3c4d5e6f', 'admin@powernetpro.test', 'Admin User', 'ADMIN', now(), now()),
  ('f2e3d4c5-b6a7-8d9e-0f1a-2b3c4d5e6f7a', 'host@vedvyas.test', 'Vedvyas Host', 'HOST', now(), now()),
  ('a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d', 'consumer@powernetpro.test', 'Consumer User', 'USER', now(), now());

-- Create host profile
INSERT INTO public.hosts (id, user_id, business_name, contact_name, contact_email, contact_phone, status, created_at, updated_at)
VALUES (gen_random_uuid(), 'f2e3d4c5-b6a7-8d9e-0f1a-2b3c4d5e6f7a', 'Vedvyas Solar', 'Host Contact', 'host@vedvyas.test', '9876543210', 'ACTIVE', now(), now());

-- Link project to host (get host_id from previous insert)
-- UPDATE public.projects SET host_id = {host_id} WHERE spv_id = 'SPV-PNP-001';

-- Create PPA (get host_id from above)
-- INSERT INTO public.ppa_agreements (...) VALUES (...);

-- Create credits for consumer
INSERT INTO public.credit_ledgers (id, user_id, amount, type, status, month, year, description, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d', 5000, 'GENERATION', 'PENDING', 4, 2026, 'April 2026', now(), now()),
  (gen_random_uuid(), 'a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d', 4800, 'GENERATION', 'APPLIED', 3, 2026, 'March 2026', now(), now());

-- Create generations
INSERT INTO public.generations (id, project_id, month, year, kwh, validated, created_at, updated_at)
VALUES
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001', 4, 2026, 12150, true, now(), now()),
  (gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001', 3, 2026, 11890, true, now(), now());
```

---

## 🎯 Quick Summary

| Account | Email | Password | Role |
|---------|-------|----------|------|
| Admin | admin@powernetpro.test | AdminTest123!@# | ADMIN |
| Host | host@vedvyas.test | HostTest123!@# | HOST |
| Consumer | consumer@powernetpro.test | ConsumerTest123!@# | USER |

**Next:** Go to Supabase SQL Editor and create the test accounts and data!
