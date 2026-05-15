# PowerNetPro Phase 2 - Database Setup Guide

## Overview
Your code is ready! You just need to apply the database migration and set up storage policies.

---

## ✅ Step 1: Apply Database Migration

### Where to Run It
1. Go to **Supabase Dashboard** → Your Project
2. Click **SQL Editor** (top left menu)
3. Click **New Query**

### What to Paste
Copy and paste the entire content from:
```
supabase/migrations/20260409_complete_schema_fixes.sql
```

The migration will:
- Add `data_logger_serial_id` column to `projects` table
- Add `logger_api_key` column to `projects` table
- Create 15 performance indexes
- Create `ppa-documents` storage bucket

### How to Run
1. Paste the SQL code
2. Click the **Play** button (▶️) to execute
3. Wait for success message
4. You should see: `Query successful`

**If you get errors:**
- Columns might already exist (safe - uses `IF NOT EXISTS`)
- Indexes might already exist (safe - uses `IF NOT EXISTS`)
- Copy the error message and check schema.sql

---

## ✅ Step 2: Set Up Storage Policies

### Navigate to Storage
1. In **Supabase Dashboard**, go to **Storage** (left sidebar)
2. You should see **ppa-documents** bucket (created by migration)
3. Click on **ppa-documents**
4. Click the **Policies** tab

### Create Policy 1: Read Access

**Click "New Policy" → "Create a policy from scratch"**

Configure as follows:
```
Name:                "Authenticated users can read PPA documents"
Target roles:        authenticated
Allowed operations:  ✓ SELECT
Policy expression:   bucket_id = 'ppa-documents'
```

Click **Create policy**

### Create Policy 2: Write Access

**Click "New Policy" → "Create a policy from scratch"**

Configure as follows:
```
Name:                "Authenticated users can upload PPA documents"  
Target roles:        authenticated
Allowed operations:  ✓ INSERT
Policy expression:   bucket_id = 'ppa-documents'
```

Click **Create policy**

### Result
You should now see 2 policies under the bucket:
- ✅ Authenticated users can read PPA documents
- ✅ Authenticated users can upload PPA documents

---

## ✅ Step 3: Verify Setup

### Check Database Columns
1. Go to **SQL Editor**
2. Run this query:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY ordinal_position;
```

You should see:
- ✅ `data_logger_serial_id` (TEXT)
- ✅ `logger_api_key` (TEXT)

### Check Storage Bucket
1. Go to **Storage**
2. You should see **ppa-documents** bucket
3. Click on it
4. Click **Policies** tab
5. You should see 2 policies listed

### Check Indexes
1. Go to **SQL Editor**
2. Run this query:
```sql
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename IN ('projects', 'ppa_agreements', 'capacity_blocks', 'credit_ledgers')
ORDER BY tablename;
```

You should see 15+ indexes including:
- ✅ idx_projects_status
- ✅ idx_projects_host_id
- ✅ idx_ppa_agreements_status
- ✅ idx_credit_ledgers_user_id

---

## 🧪 Test After Setup

### Test 1: Public Projects Endpoint
```bash
curl -s http://localhost:3004/api/projects | jq .
```

**Expected:** Returns array of ACTIVE projects (200 OK)

### Test 2: Admin Projects (Protected)
```bash
curl -s http://localhost:3004/api/admin/projects?page=1&limit=20 | jq .
```

**Expected:** Returns `{"success":false,"error":"Authentication required"}` (401 Unauthorized)

This is correct! Admin endpoints require login.

### Test 3: Verify in Browser
1. Start the dev server: `npm run dev`
2. Go to `http://localhost:3000/admin/projects`
3. You'll see login page (admin login required)
4. After login, you should see projects table with NO errors

---

## 📋 Troubleshooting

### "Column already exists" Error
**This is SAFE!** The migration uses `IF NOT EXISTS` so it won't fail if columns exist.

**Solution:** Just ignore it and continue.

### "bucket_id = 'ppa-documents' does not exist" Error  
The bucket might not have been created. 

**Solution:**
1. Run the migration again
2. Or manually create the bucket:
   - Go to **Storage** → **New bucket**
   - Name: `ppa-documents`
   - Make it Private (not Public)
   - File size limit: 10MB
   - Allowed MIME types: `application/pdf`

### "Policy creation failed" Error
Policy might already exist.

**Solution:**
1. Go to **Storage** → **ppa-documents** → **Policies**
2. Check if policies already exist
3. If they do, you're done!
4. If not, create them again

### Admin endpoints still return 401
This is **CORRECT BEHAVIOR**! They require authentication.

**To test as admin:**
1. Login via `/admin/login` using your admin email
2. Then the endpoints will work
3. Your session will be in the auth cookie

---

## 🎯 After Setup Complete

Your system will have:

✅ **Secure PPA Storage**
- Private bucket: `ppa-documents`
- Admin can upload signed PPAs during project creation
- Hosts can download their PPA via signed URL (1-hour expiry)

✅ **Project Management**
- DRAFT projects hidden from consumers
- ACTIVE projects visible on `/reserve` page
- Status toggle in admin panel

✅ **Credit Tracking**
- Admin credits page at `/admin/credits`
- Search + filter functionality
- User credit ledger with monthly breakdown

✅ **Data Logger Integration Ready**
- `logger_api_key` field per project
- Will be used when Triellectics integration is added
- Accessible via admin projects page

✅ **Performance Optimized**
- 15 strategic indexes
- Fast queries for admin dashboard
- Efficient filtering and pagination

---

## 📞 Questions?

If you encounter issues:
1. Check that migration ran without errors
2. Verify bucket exists and has 2 policies
3. Check that columns were added to projects table
4. Verify indexes were created
5. Restart dev server: `npm run dev`

**Everything should work after database setup! 🚀**
