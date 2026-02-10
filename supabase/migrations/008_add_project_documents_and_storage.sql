-- ============================================================
-- 008_add_project_documents_and_storage.sql
-- ============================================================

-- 1. Add `documents` column to `projects` table
--    This will store an array of file objects: { name: string, url: string, size?: number }
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

-- 2. Create Storage Bucket for Project Assets
--    We need to ensure the `storage` schema and `buckets` table exist (Supabase standard)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-assets', 'project-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up RLS Policies for Storage
--    Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'project-assets' );

--    Allow authenticated users (admins) to upload files
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'project-assets' );

--    Allow authenticated users (admins) to update files
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'project-assets' );

--    Allow authenticated users (admins) to delete files
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'project-assets' );
