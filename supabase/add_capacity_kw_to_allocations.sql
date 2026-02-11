-- Add capacity_kw column to allocations table if it doesn't exist
-- Run this in Supabase SQL Editor

-- Check if column exists, if not add it
DO $$ 
BEGIN
    -- Check if capacity_kw column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'allocations' 
        AND column_name = 'capacity_kw'
    ) THEN
        -- Add the column
        ALTER TABLE public.allocations 
        ADD COLUMN capacity_kw DECIMAL(10,2);
        
        -- Add NOT NULL constraint if there are no existing rows, or set default
        -- First, update any NULL values to 0 (if any exist)
        UPDATE public.allocations 
        SET capacity_kw = 0 
        WHERE capacity_kw IS NULL;
        
        -- Now add NOT NULL constraint
        ALTER TABLE public.allocations 
        ALTER COLUMN capacity_kw SET NOT NULL;
        
        RAISE NOTICE 'Added capacity_kw column to allocations table';
    ELSE
        RAISE NOTICE 'capacity_kw column already exists';
    END IF;
END $$;

-- Verify the column was added
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'allocations'
AND column_name = 'capacity_kw';

