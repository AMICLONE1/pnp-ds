-- Fix RLS policies for capacity_blocks to allow updates
-- Run this in Supabase SQL Editor

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can view available capacity blocks" ON public.capacity_blocks;

-- Allow anyone to view available blocks
CREATE POLICY "Anyone can view available capacity blocks" ON public.capacity_blocks
    FOR SELECT USING (status = 'AVAILABLE'::capacity_block_status);

-- Allow authenticated users to update capacity blocks when they have an allocation
-- This is needed for the payment verification process
DROP POLICY IF EXISTS "Users can update capacity blocks for their allocations" ON public.capacity_blocks;
CREATE POLICY "Users can update capacity blocks for their allocations" ON public.capacity_blocks
    FOR UPDATE 
    USING (
        -- Allow update if user has a pending or active allocation for this project
        EXISTS (
            SELECT 1 FROM public.allocations
            WHERE allocations.project_id = capacity_blocks.project_id
            AND allocations.user_id = auth.uid()
            AND allocations.status IN ('pending', 'active')
        )
    )
    WITH CHECK (
        -- Only allow changing status from AVAILABLE to ALLOCATED
        (OLD.status = 'AVAILABLE'::capacity_block_status AND NEW.status = 'ALLOCATED'::capacity_block_status)
        OR
        -- Or allow reverting from ALLOCATED to AVAILABLE (for refunds/cancellations)
        (OLD.status = 'ALLOCATED'::capacity_block_status AND NEW.status = 'AVAILABLE'::capacity_block_status)
    );

-- Alternative: Allow service role to bypass RLS (if using service role key)
-- This is more permissive but needed for server-side operations
-- Note: This requires using SUPABASE_SERVICE_ROLE_KEY in server.ts instead of anon key

