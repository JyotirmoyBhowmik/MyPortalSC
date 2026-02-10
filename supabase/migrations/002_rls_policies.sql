-- ============================================================
-- 002_rls_policies.sql — Row Level Security Policies
-- ============================================================

-- -----------------------------------------------
-- Admin Users
-- -----------------------------------------------
ALTER TABLE IF EXISTS admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view own profile" ON admin_users;
CREATE POLICY "Admins can view own profile"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Super admins can view all profiles" ON admin_users;
CREATE POLICY "Super admins can view all profiles"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- -----------------------------------------------
-- Projects
-- -----------------------------------------------
ALTER TABLE IF EXISTS projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for published projects" ON projects;
CREATE POLICY "Public read access for published projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "Admins can view all projects" ON projects;
CREATE POLICY "Admins can view all projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can insert projects" ON projects;
CREATE POLICY "Admins can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can update projects" ON projects;
CREATE POLICY "Admins can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can delete projects" ON projects;
CREATE POLICY "Admins can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- -----------------------------------------------
-- Skills
-- -----------------------------------------------
ALTER TABLE IF EXISTS skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for skills" ON skills;
CREATE POLICY "Public read access for skills"
  ON skills FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can insert skills" ON skills;
CREATE POLICY "Admins can insert skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can update skills" ON skills;
CREATE POLICY "Admins can update skills"
  ON skills FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can delete skills" ON skills;
CREATE POLICY "Admins can delete skills"
  ON skills FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- -----------------------------------------------
-- Certifications
-- -----------------------------------------------
ALTER TABLE IF EXISTS certifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for active certifications" ON certifications;
CREATE POLICY "Public read access for active certifications"
  ON certifications FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

DROP POLICY IF EXISTS "Admins can view all certifications" ON certifications;
CREATE POLICY "Admins can view all certifications"
  ON certifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can insert certifications" ON certifications;
CREATE POLICY "Admins can insert certifications"
  ON certifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can update certifications" ON certifications;
CREATE POLICY "Admins can update certifications"
  ON certifications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can delete certifications" ON certifications;
CREATE POLICY "Admins can delete certifications"
  ON certifications FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- -----------------------------------------------
-- Achievements
-- -----------------------------------------------
ALTER TABLE IF EXISTS achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for achievements" ON achievements;
CREATE POLICY "Public read access for achievements"
  ON achievements FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can insert achievements" ON achievements;
CREATE POLICY "Admins can insert achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can update achievements" ON achievements;
CREATE POLICY "Admins can update achievements"
  ON achievements FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can delete achievements" ON achievements;
CREATE POLICY "Admins can delete achievements"
  ON achievements FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- -----------------------------------------------
-- Content Pages
-- -----------------------------------------------
ALTER TABLE IF EXISTS content_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for content pages" ON content_pages;
CREATE POLICY "Public read access for content pages"
  ON content_pages FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can insert content pages" ON content_pages;
CREATE POLICY "Admins can insert content pages"
  ON content_pages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can update content pages" ON content_pages;
CREATE POLICY "Admins can update content pages"
  ON content_pages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can delete content pages" ON content_pages;
CREATE POLICY "Admins can delete content pages"
  ON content_pages FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- -----------------------------------------------
-- Page Analytics
-- -----------------------------------------------
ALTER TABLE IF EXISTS page_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read analytics" ON page_analytics;
CREATE POLICY "Public can read analytics"
  ON page_analytics FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can insert analytics" ON page_analytics;
CREATE POLICY "Public can insert analytics"
  ON page_analytics FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update analytics" ON page_analytics;
CREATE POLICY "Public can update analytics"
  ON page_analytics FOR UPDATE
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin full access to analytics" ON page_analytics;
CREATE POLICY "Admin full access to analytics"
  ON page_analytics FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- -----------------------------------------------
-- Audit Log
-- -----------------------------------------------
ALTER TABLE IF EXISTS audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin read access for audit log" ON audit_log;
CREATE POLICY "Admin read access for audit log"
  ON audit_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );
