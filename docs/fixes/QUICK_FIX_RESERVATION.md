# Quick Fix: Capacity Reservation Not Working

## The Problem
Capacity blocks cannot be allocated because RLS (Row Level Security) blocks updates to the `capacity_blocks` table.

## The Solution
We've created an admin client that uses the service role key to bypass RLS. **You need to add the service role key to your environment variables.**

## Steps to Fix (2 minutes)

### 1. Get Your Service Role Key
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **PowerNetProDS**
3. Go to **Settings** → **API**
4. Find the **service_role** key (NOT the anon key)
5. Copy it

### 2. Add to `.env.local`
Open your `.env.local` file and add:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Important:** 
- Replace `your_service_role_key_here` with the actual key you copied
- This key starts with `eyJ...` (it's a JWT token)
- **NEVER** commit this file to git (it should already be in `.gitignore`)

### 3. Restart Your Dev Server
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### 4. Test
1. Go to `/reserve`
2. Select a project
3. Choose capacity (e.g., 5 kW)
4. Click "Reserve Now"
5. Complete payment
6. Check that it works!

## How to Verify It's Working

After adding the key and restarting, check the browser console or server logs. You should **NOT** see:
- ❌ "SUPABASE_SERVICE_ROLE_KEY is missing"
- ❌ "Server configuration error"

If you still see errors, double-check:
1. The key is correct (no extra spaces)
2. The server was restarted
3. The `.env.local` file is in the project root

## What Changed

- ✅ Created `lib/supabase/admin.ts` - Admin client using service role key
- ✅ Updated `app/api/allocations/route.ts` - Uses admin client to check capacity
- ✅ Updated `app/api/payments/verify/route.ts` - Uses admin client to allocate blocks

The admin client bypasses RLS, allowing the server to update capacity blocks when payments are completed.

