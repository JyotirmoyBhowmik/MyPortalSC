-- ============================================================
-- 016_tier7_enterprise.sql — Enterprise Feature Tables
-- ============================================================

-- ─── Blog Posts ───
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  content text NOT NULL,
  cover_image_url text,
  category text DEFAULT 'general',
  tags text[] DEFAULT '{}',
  reading_time integer DEFAULT 5,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  author_name text DEFAULT 'Jyotirmoy Bhowmik',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TRIGGER set_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published posts"
  ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage posts"
  ON blog_posts FOR ALL USING (is_admin_user());

CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts (published_at DESC) WHERE is_published = true;

-- ─── Case Studies ───
CREATE TABLE IF NOT EXISTS case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  client text,
  industry text,
  challenge text,
  solution text,
  outcome text,
  metrics jsonb DEFAULT '{}',
  cover_image_url text,
  technologies text[] DEFAULT '{}',
  duration text,
  team_size integer,
  budget_range text,
  is_published boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TRIGGER set_case_studies_updated_at
  BEFORE UPDATE ON case_studies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published cases"
  ON case_studies FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage cases"
  ON case_studies FOR ALL USING (is_admin_user());

-- ─── Speaking Events ───
CREATE TABLE IF NOT EXISTS speaking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  event_name text NOT NULL,
  event_date date,
  location text,
  event_type text DEFAULT 'conference' CHECK (event_type IN ('conference', 'webinar', 'panel', 'workshop', 'keynote')),
  description text,
  slides_url text,
  video_url text,
  is_published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TRIGGER set_speaking_events_updated_at
  BEFORE UPDATE ON speaking_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE speaking_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published events"
  ON speaking_events FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage events"
  ON speaking_events FOR ALL USING (is_admin_user());

-- ─── Publications & Awards ───
CREATE TABLE IF NOT EXISTS publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  publication_type text DEFAULT 'paper' CHECK (publication_type IN ('paper', 'award', 'recognition', 'certification', 'article')),
  publisher text,
  published_date date,
  url text,
  description text,
  is_published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TRIGGER set_publications_updated_at
  BEFORE UPDATE ON publications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published publications"
  ON publications FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage publications"
  ON publications FOR ALL USING (is_admin_user());

-- ─── Downloads ───
CREATE TABLE IF NOT EXISTS downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_size text,
  file_type text DEFAULT 'pdf',
  category text DEFAULT 'general',
  download_count integer DEFAULT 0,
  is_published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TRIGGER set_downloads_updated_at
  BEFORE UPDATE ON downloads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published downloads"
  ON downloads FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage downloads"
  ON downloads FOR ALL USING (is_admin_user());

-- ─── Newsletter Subscribers ───
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  is_active boolean DEFAULT true,
  subscribed_at timestamptz DEFAULT now() NOT NULL,
  unsubscribed_at timestamptz
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage subscribers"
  ON newsletter_subscribers FOR ALL USING (is_admin_user());
CREATE POLICY "Anyone can subscribe"
  ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies (slug);
CREATE INDEX IF NOT EXISTS idx_speaking_date ON speaking_events (event_date DESC);
CREATE INDEX IF NOT EXISTS idx_publications_type ON publications (publication_type);
CREATE INDEX IF NOT EXISTS idx_downloads_category ON downloads (category);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers (email);
