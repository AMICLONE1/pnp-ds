-- Seed Data: Mock Solar Projects (Vedvyas 100kW and Parshuram 250kW)
-- Run this in Supabase SQL Editor to create sample projects
-- IMPORTANT: Copy and paste this entire file into Supabase SQL Editor and run it

-- First, delete all existing projects and their capacity blocks
-- This ensures we only have the 2 projects we want
DELETE FROM public.capacity_blocks;
DELETE FROM public.projects;

-- Insert Project 1: Vedvyas 100kW Solar Project
INSERT INTO public.projects (
  id,
  spv_id,
  name,
  total_kw,
  rate_per_kwh,
  location,
  state,
  status,
  description
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'SPV-PNP-001',
  'Vedvyas Solar Park',
  100.00,
  7.00,
  'Cuttack, Odisha',
  'Odisha',
  'ACTIVE'::project_status,
  'A 100kW community solar project located in Vedvyas, Cuttack. This project provides reliable solar energy generation with 75% secured generation guarantee. Perfect for residential users looking to offset their electricity bills.'
) ON CONFLICT (spv_id) DO UPDATE SET
  name = EXCLUDED.name,
  total_kw = EXCLUDED.total_kw,
  rate_per_kwh = EXCLUDED.rate_per_kwh,
  status = EXCLUDED.status;

-- Insert Project 2: Parshuram 250kW Solar Project
INSERT INTO public.projects (
  id,
  spv_id,
  name,
  total_kw,
  rate_per_kwh,
  location,
  state,
  status,
  description
) VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  'SPV-PNP-002',
  'Parshuram Solar Plant',
  250.00,
  7.00,
  'Mumbai, Maharashtra',
  'Maharashtra',
  'ACTIVE'::project_status,
  'A 250kW solar power plant in Mumbai offering higher capacity for urban energy needs. This project is ideal for users with larger electricity consumption. Features real-time monitoring and 75% guaranteed generation coverage.'
) ON CONFLICT (spv_id) DO UPDATE SET
  name = EXCLUDED.name,
  total_kw = EXCLUDED.total_kw,
  rate_per_kwh = EXCLUDED.rate_per_kwh,
  status = EXCLUDED.status;

-- Create capacity blocks for Project 1 (100kW) - Vedvyas
-- Split into blocks of 1kW each (100 blocks)
DO $$
DECLARE
  i INTEGER;
  block_id UUID;
  project_uuid UUID := '550e8400-e29b-41d4-a716-446655440001';
BEGIN
  -- Delete existing blocks for this project first (if re-running)
  DELETE FROM public.capacity_blocks WHERE project_id = project_uuid;
  
  -- Insert 100 blocks of 1kW each
  FOR i IN 1..100 LOOP
    block_id := gen_random_uuid();
    INSERT INTO public.capacity_blocks (
      id,
      project_id,
      kw,
      status
    ) VALUES (
      block_id,
      project_uuid,
      1.00,
      'AVAILABLE'
    );
  END LOOP;
END $$;

-- Create capacity blocks for Project 2 (250kW) - Parshuram
-- Split into blocks of 1kW each (250 blocks)
DO $$
DECLARE
  i INTEGER;
  block_id UUID;
  project_uuid UUID := '550e8400-e29b-41d4-a716-446655440002';
BEGIN
  -- Delete existing blocks for this project first (if re-running)
  DELETE FROM public.capacity_blocks WHERE project_id = project_uuid;
  
  -- Insert 250 blocks of 1kW each
  FOR i IN 1..250 LOOP
    block_id := gen_random_uuid();
    INSERT INTO public.capacity_blocks (
      id,
      project_id,
      kw,
      status
    ) VALUES (
      block_id,
      project_uuid,
      1.00,
      'AVAILABLE'
    );
  END LOOP;
END $$;

-- Note: available_capacity_kw column doesn't exist in the schema
-- Available capacity can be calculated on-the-fly using:
-- SELECT COALESCE(SUM(kw), 0) FROM public.capacity_blocks 
-- WHERE project_id = <project_id> AND status = 'AVAILABLE'

-- Verify the projects were created
SELECT 
  spv_id,
  name,
  total_kw,
  rate_per_kwh,
  status,
  location
FROM public.projects
WHERE spv_id IN ('SPV-PNP-001', 'SPV-PNP-002');
