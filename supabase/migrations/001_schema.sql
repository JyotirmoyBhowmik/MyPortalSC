-- ============================================================
-- 001_schema.sql — Core Database Schema
-- Dynamic Web Portfolio for Jyotirmoy Bhowmik
-- ============================================================

-- 1. Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name text NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  short_description text,
  detailed_description text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  domain text[],
  technologies text[],
  start_date date,
  end_date date,
  featured_image_url text,
  github_url text,
  live_url text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  created_by uuid REFERENCES auth.users(id)
);

-- 3. Skills
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text NOT NULL,
  proficiency_level integer CHECK (proficiency_level BETWEEN 1 AND 5),
  years_of_experience numeric(3,1),
  icon_url text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 4. Certifications
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuing_organization text NOT NULL,
  issue_date date NOT NULL,
  expiry_date date,
  credential_id text,
  credential_url text,
  badge_image_url text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'archived')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(title, issuing_organization)
);

-- 5. Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  achievement_date date NOT NULL,
  category text,
  icon_url text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(title, achievement_date)
);

-- 6. Content Pages
CREATE TABLE IF NOT EXISTS content_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL UNIQUE,
  title text NOT NULL,
  content jsonb,
  meta_description text,
  updated_at timestamptz DEFAULT now() NOT NULL,
  updated_by uuid REFERENCES auth.users(id)
);

-- 7. Page Analytics
CREATE TABLE IF NOT EXISTS page_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL UNIQUE,
  view_count integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  last_viewed timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 8. Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  operation text NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  record_id uuid NOT NULL,
  old_data jsonb,
  new_data jsonb,
  user_id uuid REFERENCES auth.users(id),
  timestamp timestamptz DEFAULT now() NOT NULL
);

-- ============================================================
-- Constraints Enforcement (for idempotent updates)
-- ============================================================

DO $$ 
BEGIN 
    -- 1. Ensure page_analytics has UNIQUE page_path
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'page_analytics_page_path_key') THEN
        ALTER TABLE page_analytics ADD CONSTRAINT page_analytics_page_path_key UNIQUE (page_path);
    END IF;

    -- 2. Ensure certifications has UNIQUE title + organization
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'certifications_title_org_key') THEN
        ALTER TABLE certifications ADD CONSTRAINT certifications_title_org_key UNIQUE (title, issuing_organization);
    END IF;

    -- 3. Ensure achievements has UNIQUE title + date
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'achievements_title_date_key') THEN
        ALTER TABLE achievements ADD CONSTRAINT achievements_title_date_key UNIQUE (title, achievement_date);
    END IF;
END $$;

-- ============================================================
-- Indexes for Performance
-- ============================================================

-- Projects
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_technologies ON projects USING GIN(technologies);

-- Skills
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_order ON skills(order_index);

-- Certifications
CREATE INDEX IF NOT EXISTS idx_certifications_status ON certifications(status);
CREATE INDEX IF NOT EXISTS idx_certifications_issue_date ON certifications(issue_date DESC);

-- Analytics
CREATE INDEX IF NOT EXISTS idx_page_analytics_path ON page_analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_audit_log_table ON audit_log(table_name, timestamp DESC);
