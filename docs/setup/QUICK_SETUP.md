# Quick Setup: Add 2 Mock Projects (100kW and 150kW)

## ⚡ Fast Setup (2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Copy & Run SQL
1. Open `supabase/seed_projects.sql` file
2. **Copy ALL the contents** (Ctrl+A, Ctrl+C)
3. **Paste into Supabase SQL Editor** (Ctrl+V)
4. Click **Run** button (or press Ctrl+Enter)

### Step 3: Verify
After running, you should see a result showing 2 projects:
- **Solar Park Alpha**: 100kW (Bengaluru)
- **Solar Farm Beta**: 150kW (Mumbai)

### Step 4: Test in App
1. Go to `/reserve` page
2. You should see both projects listed
3. Users can now select and reserve capacity

---

## 📋 What Gets Created

### Project 1: Solar Park Alpha
- **100kW** total capacity
- **100 capacity blocks** (1kW each)
- Location: Bengaluru, Karnataka
- Rate: ₹6.05/kWh

### Project 2: Solar Farm Beta  
- **150kW** total capacity
- **150 capacity blocks** (1kW each)
- Location: Mumbai, Maharashtra
- Rate: ₹6.20/kWh

---

## ✅ Success Indicators

After running the SQL:
- ✅ No errors in Supabase SQL Editor
- ✅ Query returns 2 rows
- ✅ Projects appear on `/reserve` page
- ✅ Both show correct capacity (100kW and 150kW)

---

## 🔧 Troubleshooting

**If you see errors:**
- Check that `projects` table exists
- Check that `capacity_blocks` table exists
- Verify RLS policies allow INSERT operations
- Check Supabase logs for specific error messages

**If projects don't appear:**
- Refresh the `/reserve` page
- Check browser console for API errors
- Verify projects have status = 'ACTIVE'
- Check `/api/projects` endpoint returns data

---

**That's it! The projects are now ready for users to reserve.** 🎉

