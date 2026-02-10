-- ============================================================
-- 007_fix_infinite_recursion.sql
-- ============================================================

-- 1. Create a helper function to check admin status WITHOUT triggering RLS recursion
--    SECURITY DEFINER means this function runs with the privileges of the creator, bypassing RLS.
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public -- Secure search path
AS $$
BEGIN
  -- Check if the current user exists in the admin_users table
  RETURN EXISTS (
    SELECT 1
    FROM admin_users
    WHERE user_id = auth.uid()
  );
END;
$$;

-- 2. Update 'admin_users' policies to avoid self-referencing recursion
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admins can view all profiles" ON admin_users;
CREATE POLICY "Super admins can view all profiles"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    -- Use the function instead of direct query (or just allow if they are in the table)
    is_admin_user()
  );

-- 3. Update 'projects' policies to use the safe function
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all projects" ON projects;
CREATE POLICY "Admins can view all projects"
  ON projects FOR SELECT TO authenticated
  USING (is_admin_user());

DROP POLICY IF EXISTS "Admins can insert projects" ON projects;
CREATE POLICY "Admins can insert projects"
  ON projects FOR INSERT TO authenticated
  WITH CHECK (is_admin_user());

DROP POLICY IF EXISTS "Admins can update projects" ON projects;
CREATE POLICY "Admins can update projects"
  ON projects FOR UPDATE TO authenticated
  USING (is_admin_user());

DROP POLICY IF EXISTS "Admins can delete projects" ON projects;
CREATE POLICY "Admins can delete projects"
  ON projects FOR DELETE TO authenticated
  USING (is_admin_user());

-- 4. Update 'skills' policies
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can insert skills" ON skills;
CREATE POLICY "Admins can insert skills"
  ON skills FOR INSERT TO authenticated
  WITH CHECK (is_admin_user());

DROP POLICY IF EXISTS "Admins can update skills" ON skills;
CREATE POLICY "Admins can update skills"
  ON skills FOR UPDATE TO authenticated
  USING (is_admin_user());

DROP POLICY IF EXISTS "Admins can delete skills" ON skills;
CREATE POLICY "Admins can delete skills"
  ON skills FOR DELETE TO authenticated
  USING (is_admin_user());

-- 5. Update 'certifications' policies
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all certifications" ON certifications;
CREATE POLICY "Admins can view all certifications"
  ON certifications FOR SELECT TO authenticated
  USING (is_admin_user());

DROP POLICY IF EXISTS "Admins can insert certifications" ON certifications;
CREATE POLICY "Admins can insert certifications"
  ON certifications FOR INSERT TO authenticated
  WITH CHECK (is_admin_user());

DROP POLICY IF EXISTS "Admins can update certifications" ON certifications;
CREATE POLICY "Admins can update certifications"
  ON certifications FOR UPDATE TO authenticated
  USING (is_admin_user());

DROP POLICY IF EXISTS "Admins can delete certifications" ON certifications;
CREATE POLICY "Admins can delete certifications"
  ON certifications FOR DELETE TO authenticated
  USING (is_admin_user());

-- 6. Update 'achievements' policies
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can insert achievements" ON achievements;
CREATE POLICY "Admins can insert achievements"
  ON achievements FOR INSERT TO authenticated
  WITH CHECK (is_admin_user());

DROP POLICY IF EXISTS "Admins can update achievements" ON achievements;
CREATE POLICY "Admins can update achievements"
  ON achievements FOR UPDATE TO authenticated
  USING (is_admin_user());

DROP POLICY IF EXISTS "Admins can delete achievements" ON achievements;
CREATE POLICY "Admins can delete achievements"
  ON achievements FOR DELETE TO authenticated
  USING (is_admin_user());

-- 7. Update 'content_pages' policies
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can insert content pages" ON content_pages;
CREATE POLICY "Admins can insert content pages"
  ON content_pages FOR INSERT TO authenticated
  WITH CHECK (is_admin_user());

DROP POLICY IF EXISTS "Admins can update content pages" ON content_pages;
CREATE POLICY "Admins can update content pages"
  ON content_pages FOR UPDATE TO authenticated
  USING (is_admin_user());

DROP POLICY IF EXISTS "Admins can delete content pages" ON content_pages;
CREATE POLICY "Admins can delete content pages"
  ON content_pages FOR DELETE TO authenticated
  USING (is_admin_user());

-- 8. Update 'page_analytics' policies
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to analytics" ON page_analytics;
CREATE POLICY "Admin full access to analytics"
  ON page_analytics FOR DELETE TO authenticated
  USING (is_admin_user());

-- 9. Update 'audit_log' policies
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin read access for audit log" ON audit_log;
CREATE POLICY "Admin read access for audit log"
  ON audit_log FOR SELECT TO authenticated
  USING (is_admin_user());
