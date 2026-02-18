-- ============================================================
-- 018_fix_triggers_idempotent.sql — Make all triggers idempotent
-- Fixes: ERROR 42710 "trigger already exists"
-- ============================================================

-- Blog Posts
DROP TRIGGER IF EXISTS set_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER set_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Case Studies
DROP TRIGGER IF EXISTS set_case_studies_updated_at ON case_studies;
CREATE TRIGGER set_case_studies_updated_at
  BEFORE UPDATE ON case_studies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Speaking Events
DROP TRIGGER IF EXISTS set_speaking_events_updated_at ON speaking_events;
CREATE TRIGGER set_speaking_events_updated_at
  BEFORE UPDATE ON speaking_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Publications
DROP TRIGGER IF EXISTS set_publications_updated_at ON publications;
CREATE TRIGGER set_publications_updated_at
  BEFORE UPDATE ON publications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Downloads
DROP TRIGGER IF EXISTS set_downloads_updated_at ON downloads;
CREATE TRIGGER set_downloads_updated_at
  BEFORE UPDATE ON downloads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Contact Submissions
DROP TRIGGER IF EXISTS set_contact_submissions_updated_at ON contact_submissions;
CREATE TRIGGER set_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Make RLS policies idempotent (drop + create)
-- Blog
DROP POLICY IF EXISTS "Anyone can read published posts" ON blog_posts;
CREATE POLICY "Anyone can read published posts"
  ON blog_posts FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Admins can manage posts" ON blog_posts;
CREATE POLICY "Admins can manage posts"
  ON blog_posts FOR ALL USING (is_admin_user());

-- Case Studies
DROP POLICY IF EXISTS "Anyone can read published cases" ON case_studies;
CREATE POLICY "Anyone can read published cases"
  ON case_studies FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Admins can manage cases" ON case_studies;
CREATE POLICY "Admins can manage cases"
  ON case_studies FOR ALL USING (is_admin_user());

-- Speaking Events
DROP POLICY IF EXISTS "Anyone can read published events" ON speaking_events;
CREATE POLICY "Anyone can read published events"
  ON speaking_events FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Admins can manage events" ON speaking_events;
CREATE POLICY "Admins can manage events"
  ON speaking_events FOR ALL USING (is_admin_user());

-- Publications
DROP POLICY IF EXISTS "Anyone can read published publications" ON publications;
CREATE POLICY "Anyone can read published publications"
  ON publications FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Admins can manage publications" ON publications;
CREATE POLICY "Admins can manage publications"
  ON publications FOR ALL USING (is_admin_user());

-- Downloads
DROP POLICY IF EXISTS "Anyone can read published downloads" ON downloads;
CREATE POLICY "Anyone can read published downloads"
  ON downloads FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Admins can manage downloads" ON downloads;
CREATE POLICY "Admins can manage downloads"
  ON downloads FOR ALL USING (is_admin_user());

-- Newsletter
DROP POLICY IF EXISTS "Admins can manage subscribers" ON newsletter_subscribers;
CREATE POLICY "Admins can manage subscribers"
  ON newsletter_subscribers FOR ALL USING (is_admin_user());
DROP POLICY IF EXISTS "Anyone can subscribe" ON newsletter_subscribers;
CREATE POLICY "Anyone can subscribe"
  ON newsletter_subscribers FOR INSERT WITH CHECK (true);
