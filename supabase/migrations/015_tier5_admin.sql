-- ============================================================
-- 015_tier5_admin.sql — Admin Power Features Tables
-- ============================================================

-- ─── Content Versions ───
CREATE TABLE IF NOT EXISTS content_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  version_number integer DEFAULT 1,
  data jsonb NOT NULL,
  changed_by uuid REFERENCES auth.users(id),
  change_summary text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage versions"
  ON content_versions FOR ALL USING (is_admin_user());

CREATE INDEX IF NOT EXISTS idx_content_versions_record ON content_versions (table_name, record_id, version_number DESC);

-- ─── Media Library ───
CREATE TABLE IF NOT EXISTS media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_name text NOT NULL,
  file_size integer,
  mime_type text,
  storage_path text NOT NULL,
  public_url text,
  alt_text text,
  folder text DEFAULT 'general',
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view media"
  ON media_library FOR SELECT USING (true);
CREATE POLICY "Admins can manage media"
  ON media_library FOR ALL USING (is_admin_user());

CREATE INDEX IF NOT EXISTS idx_media_folder ON media_library (folder);
