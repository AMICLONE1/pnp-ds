-- Create ppa-documents bucket for PPA PDF storage
-- Run this in Supabase SQL Editor as the project owner/superuser
-- This creates a private bucket with 10MB limit for PDF files

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('ppa-documents', 'ppa-documents', false, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;
