-- ============================================================
-- 005_fix_rls.sql — Fix Row Level Security for Projects
-- ============================================================

--  1. Enable RLS on the projects table (if not already enabled)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON projects;

-- 3. Create a policy that allows anyone (anon, authenticated) to SELECT published projects
CREATE POLICY "Public projects are viewable by everyone"
ON projects FOR SELECT
USING (status = 'published');

-- 4. Create a policy for content_pages as well, just in case
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public content is viewable by everyone" ON content_pages;
CREATE POLICY "Public content is viewable by everyone"
ON content_pages FOR SELECT
USING (true);

-- 5. Create a policy for skills/achievements/certifications
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public skills are viewable by everyone" ON skills;
CREATE POLICY "Public skills are viewable by everyone" ON skills FOR SELECT USING (true);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public achievements are viewable by everyone" ON achievements;
CREATE POLICY "Public achievements are viewable by everyone" ON achievements FOR SELECT USING (true);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public certifications are viewable by everyone" ON certifications;
CREATE POLICY "Public certifications are viewable by everyone" ON certifications FOR SELECT USING (true);

-- 6. (Optional) Allow Service Role to do everything (usually default, but good to be explicit if needed, though service role bypasses RLS)
-- No need to add specific policies for service role as it bypasses RLS.
