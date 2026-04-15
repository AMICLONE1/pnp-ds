# Vedvyas Solar Park - Mock Data Test Guide

## Overview

Vedvyas Solar Park is a 100kW ACTIVE solar project set up for testing all Phase 2 features across admin, host, and consumer roles.

---

## 📍 Vedvyas Project Details

```
Project ID:        550e8400-e29b-41d4-a716-446655440001
SPV ID:            SPV-PNP-001
Project Name:      Vedvyas Solar Park
Location:          Cuttack, Odisha
Capacity:          100 kW
Rate per kWh:      ₹7.00
Status:            ACTIVE
Logger Serial:     TLX-VEV-001
Description:       Community solar project for testing Phase 2 features
Capacity Blocks:   100 blocks of 1kW each (all AVAILABLE)
```

---

## 🎯 What You Can Test with Vedvyas

### 1. Admin Features
- ✅ View existing project in admin dashboard
- ✅ See project details (capacity, rate, status)
- ✅ View PPA document (if one exists)
- ✅ Toggle status between DRAFT/ACTIVE
- ✅ Create additional projects with new PPAs
- ✅ View in credits dashboard

### 2. Host Features
- ✅ Host can log in
- ✅ Host can see their assigned plant
- ✅ Host can view financials
- ✅ Host can see generation data
- ✅ Host can download their PPA

### 3. Consumer Features
- ✅ Consumer sees Vedvyas on `/reserve` (ACTIVE)
- ✅ Consumer can reserve capacity from it
- ✅ Consumer gets credits for generation
- ✅ Consumer can track allocations

---

## 🔍 Where to Find Vedvyas

### In Admin Dashboard
1. Go to `http://localhost:3000/admin/projects`
2. Look for "Vedvyas Solar Park" in the projects list
3. Should show:
   - Status: **ACTIVE** (green)
   - Capacity: **100 kW**
   - Rate: **₹7.00/kWh**
   - Host: Host name (if linked)

### In Public Reserve Page
1. Go to `http://localhost:3000/reserve`
2. Should see Vedvyas in the project cards
3. Shows available capacity and rate

### In Admin Credits
1. Go to `http://localhost:3000/admin/credits`
2. If consumer has credits from Vedvyas, they appear here

---

## 📋 Quick Test Checklist - Vedvyas Only

Use Vedvyas project to quickly verify Phase 2 features are working:

### Admin Tests
- [ ] Go to `/admin/projects`
- [ ] Find Vedvyas Solar Park
- [ ] Status shows "ACTIVE"
- [ ] Can see 100kW capacity
- [ ] Can see ₹7.00 rate
- [ ] Click project to see full details
- [ ] If PPA exists, can view it
- [ ] Can change status to DRAFT and back
- [ ] Appears/disappears from consumer view based on status

### Host Tests
- [ ] Login as: `host@vedvyas.test` / `HostTest123!@#`
- [ ] Dashboard shows Vedvyas plant
- [ ] Financials show generation data
- [ ] Can download PPA document
- [ ] Shows payment information

### Consumer Tests
- [ ] Go to `/reserve`
- [ ] See Vedvyas card
- [ ] Shows 100kW capacity
- [ ] Shows ₹7.00 rate
- [ ] Can click to view details
- [ ] Can reserve capacity

---

## 🚀 Testing Workflow

### Quick 5-Minute Test
```
1. Start: npm run dev
2. Admin Login: /admin/login → admin@powernetpro.test
3. View: /admin/projects → Find Vedvyas
4. Verify: Status = ACTIVE, Capacity = 100kW
5. Toggle: Change status to DRAFT
6. Verify: Disappears from /reserve
7. Toggle: Change back to ACTIVE
8. Verify: Reappears in /reserve
```

### Quick 10-Minute Test
```
1. Start dev server
2. Test Admin:
   - Login as admin
   - View Vedvyas in /admin/projects
   - View in /admin/credits
3. Test Host:
   - Logout, login as host
   - View in /host/financials
4. Test Consumer:
   - Logout, go to /reserve
   - See Vedvyas listed
```

### Full 30-Minute Test
```
1. Setup (10 min):
   - Create test user accounts in Supabase
   - Verify Vedvyas project exists
   - Link host to Vedvyas

2. Admin Testing (10 min):
   - Test all admin features with Vedvyas
   - Create new project with PPA
   - Toggle status

3. Host Testing (5 min):
   - Login as Vedvyas host
   - View dashboard and financials

4. Consumer Testing (5 min):
   - View Vedvyas on /reserve
   - Reserve capacity
```

---

## 📊 Vedvyas Data Structure

### Database Tables Involved

**projects**
```
id:                   550e8400-e29b-41d4-a716-446655440001
spv_id:               SPV-PNP-001
name:                 Vedvyas Solar Park
total_kw:             100
rate_per_kwh:         7.00
status:               ACTIVE
location:             Cuttack, Odisha
state:                Odisha
data_logger_serial_id: TLX-VEV-001
created_at:           (timestamp)
```

**capacity_blocks** (100 records)
```
100 blocks of 1kW each
status:               AVAILABLE (all)
project_id:           550e8400-e29b-41d4-a716-446655440001
```

**generations** (sample data)
```
project_id: 550e8400-e29b-41d4-a716-446655440001
April 2026: 12,150 kWh
March 2026: 11,890 kWh
Feb 2026:   11,760 kWh
Jan 2026:   11,500 kWh
```

**hosts** (if linked)
```
Contains host details for Vedvyas Solar
```

**ppa_agreements** (if created)
```
Links Vedvyas to its host via PPA
```

---

## 🔧 Setting Up Vedvyas for Testing

### Option 1: Use Existing Vedvyas (Already in DB)
The Vedvyas project should already exist. Just:
1. Start dev server: `npm run dev`
2. Go to `/admin/projects`
3. Find "Vedvyas Solar Park"
4. Use it for testing

### Option 2: Verify Vedvyas Exists
Run this SQL in Supabase to confirm:
```sql
SELECT id, spv_id, name, total_kw, status 
FROM public.projects 
WHERE spv_id = 'SPV-PNP-001';
```

Should return:
```
id:      550e8400-e29b-41d4-a716-446655440001
spv_id:  SPV-PNP-001
name:    Vedvyas Solar Park
total_kw: 100
status:  ACTIVE
```

### Option 3: Recreate Vedvyas (If Missing)
Run `supabase/seed_projects.sql` in Supabase SQL Editor.

---

## 👥 Test User Accounts

### For Testing with Vedvyas

#### Admin Account
```
Email:    admin@powernetpro.test
Password: AdminTest123!@#
Role:     ADMIN
View:     /admin/projects (see all projects)
```

#### Vedvyas Host Account
```
Email:    host@vedvyas.test
Password: HostTest123!@#
Role:     HOST
View:     /host/financials (see Vedvyas data)
```

#### Test Consumer Account
```
Email:    consumer@powernetpro.test
Password: ConsumerTest123!@#
Role:     USER
View:     /reserve (see Vedvyas if ACTIVE)
```

---

## ✨ Phase 2 Features You Can Test with Vedvyas

### 1. Project Status Visibility
**Test:** Toggle Vedvyas from ACTIVE to DRAFT
- [ ] When ACTIVE: Appears in `/reserve`
- [ ] When DRAFT: Disappears from `/reserve`
- [ ] Admin always sees it regardless of status

### 2. PPA Document Access
**Test:** View Vedvyas PPA (if document exists)
- [ ] Admin can download/view it
- [ ] Host can download/view it
- [ ] Consumer cannot access it directly

### 3. Generation Tracking
**Test:** View Vedvyas generation data
- [ ] Appears in admin dashboard
- [ ] Host sees it in financials
- [ ] Used for credit calculations

### 4. Credit Ledger
**Test:** View credits generated by Vedvyas
- [ ] Admin can see all user credits
- [ ] Can filter by status/type
- [ ] Credits match generation data

### 5. Project Search
**Test:** Search for "Vedvyas" or "Cuttack"
- [ ] Returns Vedvyas project
- [ ] Works from admin dashboard
- [ ] Returns correct details

---

## 🐛 Troubleshooting Vedvyas Testing

### Issue: Can't find Vedvyas in Admin
**Solution:**
```sql
SELECT COUNT(*) FROM public.projects WHERE spv_id = 'SPV-PNP-001';
```
If 0: Run `supabase/seed_projects.sql`

### Issue: Vedvyas shows in Admin but not in `/reserve`
**Solution:**
- Check status: Should be 'ACTIVE'
```sql
SELECT status FROM public.projects WHERE spv_id = 'SPV-PNP-001';
```
If DRAFT: Change to ACTIVE in admin or via SQL

### Issue: Host can't see Vedvyas
**Solution:**
- Verify host is linked to project:
```sql
SELECT host_id FROM public.projects WHERE spv_id = 'SPV-PNP-001';
```
If NULL: Link host to project in admin

### Issue: PPA doesn't show
**Solution:**
- Check if PPA agreement exists:
```sql
SELECT * FROM public.ppa_agreements WHERE project_id = '550e8400-e29b-41d4-a716-446655440001';
```
If empty: Create one via admin or manually

---

## 📌 Key URLs for Vedvyas Testing

| Page | URL | Role |
|------|-----|------|
| Admin Projects | `/admin/projects` | ADMIN |
| Admin Credits | `/admin/credits` | ADMIN |
| Host Dashboard | `/host` | HOST |
| Host Financials | `/host/financials` | HOST |
| Reserve Page | `/reserve` | PUBLIC |
| Consumer Login | `/login` | USER |

---

## 🎯 Success Indicators

You know Phase 2 is working when:

- ✅ Vedvyas appears in admin projects list
- ✅ Can toggle Vedvyas status from UI
- ✅ Vedvyas appears/disappears in `/reserve` based on status
- ✅ Can view PPA document
- ✅ Host can access Vedvyas in their dashboard
- ✅ Consumer can see Vedvyas when ACTIVE
- ✅ Credits show in admin ledger
- ✅ All filters work correctly

---

## 📝 Test Notes

Use this space to track your testing:

```
Date: ___________
Tester: ___________

ADMIN TESTS:
[ ] Created project with PPA
[ ] Toggled status
[ ] Viewed PPA
[ ] Searched projects
[ ] Viewed credits

HOST TESTS:
[ ] Logged in
[ ] Viewed dashboard
[ ] Downloaded PPA
[ ] Saw financials

CONSUMER TESTS:
[ ] Saw project in /reserve
[ ] Could reserve capacity
[ ] Saw credits

ISSUES FOUND:
- ___________
- ___________

FIXED:
- ___________
```

---

**Ready to test Vedvyas! Start with Quick 5-Minute Test above. 🚀**
