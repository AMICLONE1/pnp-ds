# Fix: Capacity Reservation Issue

## Problem
Users were unable to reserve solar panel capacity because:
1. RLS (Row Level Security) policies blocked updates to `capacity_blocks` table
2. The server was using anon key which respects RLS policies

## Solution
Created an admin client using the service role key that bypasses RLS for server-side operations.

## Required Setup

### 1. Environment Variable
Add the Supabase service role key to your `.env.local` file:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Important:** 
- Get this key from Supabase Dashboard → Project Settings → API
- **NEVER** expose this key to the client side
- **NEVER** commit this key to version control

### 2. Install Package (if not already installed)
```bash
npm install @supabase/supabase-js
```

### 3. Run Database Migration (Optional)
If you want to add RLS policies instead of using service role, run:
```sql
-- See supabase/fix_capacity_blocks_rls.sql
```

## Files Changed

1. **lib/supabase/admin.ts** - New admin client using service role key
2. **app/api/allocations/route.ts** - Uses admin client to check capacity
3. **app/api/payments/verify/route.ts** - Uses admin client to allocate blocks

## How It Works Now

1. User selects project and capacity → Creates allocation (status: `pending`)
2. User completes payment → Payment verification:
   - Uses admin client to fetch available capacity blocks
   - Allocates blocks (updates status to `ALLOCATED`)
   - Activates allocation (status: `active`)

## Testing

1. Make sure `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
2. Restart your dev server
3. Try reserving capacity on `/reserve` page
4. Check that capacity blocks are updated in Supabase dashboard

