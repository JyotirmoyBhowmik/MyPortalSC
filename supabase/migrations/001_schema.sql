-- ============================================================
-- 001_schema.sql — Core Database Schema
-- Dynamic Web Portfolio for Jyotirmoy Bhowmik
-- ============================================================

-- 1. Admin Users
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name text NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Projects
CREATE TABLE projects (
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
CREATE TABLE skills (
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
CREATE TABLE certifications (
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
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 5. Achievements
CREATE TABLE achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  achievement_date date NOT NULL,
  category text,
  icon_url text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 6. Content Pages
CREATE TABLE content_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL UNIQUE,
  title text NOT NULL,
  content jsonb,
  meta_description text,
  updated_at timestamptz DEFAULT now() NOT NULL,
  updated_by uuid REFERENCES auth.users(id)
);

-- 7. Page Analytics
CREATE TABLE page_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  view_count integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  last_viewed timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 8. Audit Log
CREATE TABLE audit_log (
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
-- Indexes for Performance
-- ============================================================

-- Projects
CREATE INDEX idx_projects_status ON projects(status) WHERE status = 'published';
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_technologies ON projects USING GIN(technologies);

-- Skills
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_order ON skills(order_index);

-- Certifications
CREATE INDEX idx_certifications_status ON certifications(status);
CREATE INDEX idx_certifications_issue_date ON certifications(issue_date DESC);

-- Analytics
CREATE INDEX idx_page_analytics_path ON page_analytics(page_path);
CREATE INDEX idx_audit_log_table ON audit_log(table_name, timestamp DESC);
