# Backend Schema Update Summary

## Overview
Updated the backend to match your actual Supabase schema structure. The key change is that `allocations` table now uses `capacity_block_id` instead of `project_id`, which provides better tracking of specific capacity blocks.

## Key Schema Changes

### Allocations Table Structure
**Before (Old Schema):**
- `project_id` (direct reference to project)
- `monthly_fee` field
- `status` field

**After (Your Actual Schema):**
- `capacity_block_id` (UNIQUE, FK to capacity_blocks) - **One allocation per block**
- `capacity_kw` (stores the block's capacity)
- `payment_id` (optional, links to payment)
- **No** `project_id` (get it through capacity_block → project)
- **No** `monthly_fee` (calculate from project rate)
- **No** `status` field

### Benefits of New Structure
1. **Granular Tracking**: Each allocation is tied to a specific capacity block
2. **Better Inventory Management**: Know exactly which blocks are allocated
3. **Accurate Capacity**: Block-level tracking prevents over-allocation
4. **Audit Trail**: Can track which specific panels/blocks belong to which user

## Updated Files

### 1. `supabase/schema.sql`
- ✅ Updated to match your actual schema
- ✅ Added `audit_log` table
- ✅ Added helper functions (`get_project_from_block`, `get_available_capacity`)
- ✅ Updated RLS policies
- ✅ Added proper indexes

### 2. `app/api/allocations/route.ts`
- ✅ **GET**: Now joins through `capacity_blocks` to get project info
- ✅ **POST**: 
  - Selects specific available capacity blocks
  - Marks blocks as `ALLOCATED`
  - Creates one allocation per block (since `capacity_block_id` is UNIQUE)
  - Handles multiple blocks if user requests more than 1kW

## How Allocation Works Now

### Step-by-Step Process:

1. **User Requests Capacity** (e.g., 5 kW)
   ```
   POST /api/allocations
   { project_id: "...", capacity_kw: 5 }
   ```

2. **Backend Finds Available Blocks**
   - Queries `capacity_blocks` where `status = 'AVAILABLE'`
   - Sorts by `created_at` (FIFO)
   - Selects blocks until capacity requirement is met

3. **Allocation Creation**
   - For each block:
     - Mark block as `ALLOCATED`
     - Create allocation record with `capacity_block_id`
     - Store `capacity_kw` from the block

4. **Result**
   - If blocks are 1kW each → 5 allocations created
   - If blocks are flexible sizes → Fewer allocations
   - Returns allocation(s) to frontend

## Important Notes

### Multiple Allocations
Since `capacity_block_id` is UNIQUE, if a user requests 5kW and blocks are 1kW each, you'll get **5 separate allocation records**. The frontend should:
- Group allocations by project for display
- Sum `capacity_kw` to show total allocated capacity
- Handle multiple allocations in the dashboard

### Getting Project Info
To get project information from an allocation:
```sql
SELECT a.*, cb.project_id, p.*
FROM allocations a
JOIN capacity_blocks cb ON a.capacity_block_id = cb.id
JOIN projects p ON cb.project_id = p.id
WHERE a.user_id = '...'
```

Or use the helper function:
```sql
SELECT get_project_from_block(a.capacity_block_id) as project_id
FROM allocations a
```

## Next Steps

### 1. Update Payment Verification
The payment verification route (`app/api/payments/verify/route.ts`) may need updates to work with the new allocation structure. Check if it references `project_id` directly.

### 2. Update Frontend
- Dashboard should handle multiple allocations per project
- Group allocations by project when displaying
- Sum capacity_kw for total capacity display

### 3. Credit Calculation
When calculating credits:
- Get all allocations for a user
- For each allocation, get the capacity_block
- Get the project from the capacity_block
- Calculate credits based on project's generation data

### 4. Testing
Test the following scenarios:
- ✅ Single block allocation (1kW)
- ✅ Multiple block allocation (5kW with 1kW blocks)
- ✅ Insufficient capacity error
- ✅ Allocation retrieval with project info
- ✅ Payment linking to allocation

## Database Migration

If you need to migrate existing data:

```sql
-- If you have old allocations with project_id, you'll need to:
-- 1. Find available blocks for each project
-- 2. Allocate those blocks
-- 3. Create new allocation records with capacity_block_id
-- 4. Update payment_id references if needed
```

## Questions?

If you need help with:
- Payment verification updates
- Frontend integration
- Credit calculation logic
- Migration scripts

Let me know!
