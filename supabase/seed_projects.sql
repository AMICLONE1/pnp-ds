-- Seed Data: Vedvyas Solar Project Only
-- Run this in Supabase SQL Editor to create sample projects
-- IMPORTANT: Copy and paste this entire file into Supabase SQL Editor and run it

-- First, delete all existing projects and their capacity blocks
-- This ensures we only have the Vedvyas project we want
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
  description,
  data_logger_serial_id
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'SPV-PNP-001',
  'Vedvyas Solar Park',
  100.00,
  7.00,
  'Cuttack, Odisha',
  'Odisha',
  'ACTIVE'::project_status,
  'A 100kW community solar project located in Vedvyas, Cuttack. This project provides reliable solar generation and a clean billing reference for the current host.',
  'TLX-VEV-001'
) ON CONFLICT (spv_id) DO UPDATE SET
  name = EXCLUDED.name,
  total_kw = EXCLUDED.total_kw,
  rate_per_kwh = EXCLUDED.rate_per_kwh,
  status = EXCLUDED.status,
  data_logger_serial_id = EXCLUDED.data_logger_serial_id;

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
WHERE spv_id = 'SPV-PNP-001';
