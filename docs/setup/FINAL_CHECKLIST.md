# PowerNetPro Phase 2 - Final Setup Checklist

## ✅ What's Already Done (DO NOT REDO)

### Code Implementation ✅
- [x] All Phase 2 features implemented
- [x] All endpoints created and tested
- [x] Admin UI redesigned
- [x] Production build passing
- [x] No type errors
- [x] No console errors
- [x] 11/11 endpoint tests passing

### Documentation Created ✅
- [x] DATABASE_SETUP_GUIDE.md
- [x] TESTING_REPORT.md
- [x] PHASE2_IMPLEMENTATION_SUMMARY.md
- [x] QUICK_REFERENCE.md
- [x] test-endpoints.sh (test script)
- [x] Migration file created

---

## 🚀 What You Need to Do (3 Simple Steps)

### Step 1: Apply Database Migration ⏱️ (5 minutes)

**Location:** Supabase SQL Editor

**Action:**
1. Go to: https://app.supabase.com/project/{your-project}/sql
2. Click **New Query**
3. Open file: `supabase/migrations/20260409_complete_schema_fixes.sql`
4. Copy entire content
5. Paste into Supabase SQL Editor
6. Click the **Play** (▶️) button to execute
7. Wait for success message

**Expected Output:**
```
Query successful ✓
```

**If you see errors:**
- "Column already exists" → Safe, ignore it
- "Index already exists" → Safe, ignore it
- Other errors → Check the exact message and ask

---

### Step 2: Create Storage Policies ⏱️ (2 minutes)

**Location:** Supabase Storage

**Action:**

#### Part A: Navigate to Bucket
1. Go to: https://app.supabase.com/project/{your-project}/storage/buckets
2. Click on **ppa-documents** bucket
3. Click **Policies** tab

#### Part B: Create Policy 1 (Read)
1. Click **New Policy** → **Create a policy from scratch**
2. Name: `Authenticated users can read PPA documents`
3. Target roles: `authenticated` (dropdown)
4. Allowed operations: Check **SELECT** only
5. Policy definition: `bucket_id = 'ppa-documents'`
6. Click **Create policy**

#### Part C: Create Policy 2 (Write)
1. Click **New Policy** → **Create a policy from scratch**
2. Name: `Authenticated users can upload PPA documents`
3. Target roles: `authenticated` (dropdown)
4. Allowed operations: Check **INSERT** only
5. Policy definition: `bucket_id = 'ppa-documents'`
6. Click **Create policy**

**Expected Result:**
You should see 2 policies listed under the bucket.

---

### Step 3: Test Everything ⏱️ (5 minutes)

**Action:**

#### Test 1: Start Dev Server
```bash
cd d:\PowerNetPro\PNP-DSnew
npm run dev
```

#### Test 2: Run Endpoint Tests
```bash
bash test-endpoints.sh
# Should see: ✓ 11 Passed, 0 Failed
```

#### Test 3: Test in Browser
1. Go to http://localhost:3000/admin/login
2. Login with your admin email
3. You should see the admin dashboard (no errors)
4. Go to http://localhost:3000/admin/projects
5. Click on a project or try creating one
6. Go to http://localhost:3000/admin/credits
7. You should see the credit ledger

**Expected Result:**
Everything loads without errors!

---

## ✨ What Will Work After Completion

### For Admins
✅ Create projects with PPA upload  
✅ Toggle project status (DRAFT/ACTIVE)  
✅ View signed PPA documents  
✅ Track user credits with filtering  
✅ Search by user/project  
✅ Access data logger API key field  

### For Hosts
✅ Download their PPA agreement  
✅ View financial dashboard  
✅ See billing history with taxes  
✅ Track payment status  

### For Consumers
✅ Only see ACTIVE projects on /reserve  
✅ Select from available projects  
✅ Complete purchase flow  

---

## 🧪 Verification Checklist

After completing all 3 steps, verify:

- [ ] Database migration ran without errors
- [ ] Storage bucket has 2 policies
- [ ] Dev server starts without errors
- [ ] test-endpoints.sh shows 11/11 passed
- [ ] Admin dashboard loads (no 500 errors)
- [ ] /admin/projects page works
- [ ] /admin/credits page works
- [ ] Can navigate between admin pages
- [ ] Public /api/projects returns data
- [ ] Can login as admin

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Migration fails to run | Copy the entire file content again, check for syntax errors |
| "Bucket ppa-documents not found" | Run the migration again or create bucket manually |
| Can't create policies | Bucket might not exist. Run migration first. |
| Admin page shows 500 error | Restart dev server with `npm run dev` |
| test-endpoints.sh says "command not found" | Run: `chmod +x test-endpoints.sh` first |
| Policies aren't showing | Refresh the browser page (Ctrl+R) |
| Can't login as admin | Check your admin email in `.env.local` |

---

## 📞 Need Help?

### Check These Files
- `DATABASE_SETUP_GUIDE.md` - Detailed setup instructions
- `TESTING_REPORT.md` - What was tested
- `PHASE2_IMPLEMENTATION_SUMMARY.md` - Full implementation details
- `QUICK_REFERENCE.md` - Quick API reference

### Common Questions

**Q: Will this affect existing data?**
A: No. Migration uses `IF NOT EXISTS` and `ON CONFLICT DO NOTHING` to be safe.

**Q: Can I roll back?**
A: You can drop the new columns/indexes if needed. But you shouldn't need to.

**Q: How long does setup take?**
A: 10-15 minutes total (migration ~2 min, policies ~2 min, testing ~5 min).

**Q: What if I skip RLS policies?**
A: PDFs won't be downloadable. Policies are required.

---

## 🎉 Success Criteria

You'll know everything is working when:

1. ✅ Migration runs without errors
2. ✅ Storage shows 2 policies
3. ✅ All 11 endpoint tests pass
4. ✅ Admin dashboard loads
5. ✅ Can create/view projects
6. ✅ Can access credits page
7. ✅ No console errors in browser
8. ✅ No 500 errors in network tab

---

## 🚀 Next: Deploy to Production

After local testing is successful:

1. Push code to main branch (or your deployment branch)
2. Deploy to production
3. Run the same 3 steps in production Supabase
4. Monitor for errors in production logs
5. Test live features with real admin account

---

## 📊 Summary

| Task | Time | Status |
|------|------|--------|
| Run database migration | 5 min | ⏳ TODO |
| Create RLS policies | 2 min | ⏳ TODO |
| Test everything | 5 min | ⏳ TODO |
| **TOTAL** | **12 min** | ⏳ TODO |

---

**After completing these 3 simple steps, Phase 2 is LIVE! 🚀**

Questions? See DATABASE_SETUP_GUIDE.md for detailed instructions.
