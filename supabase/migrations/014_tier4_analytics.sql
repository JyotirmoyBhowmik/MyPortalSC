-- ============================================================
-- 014_tier4_analytics.sql — Analytics & Tracking Tables
-- ============================================================

-- ─── Visitor Events ───
CREATE TABLE IF NOT EXISTS visitor_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  event_type text DEFAULT 'pageview' CHECK (event_type IN ('pageview', 'click', 'scroll', 'download')),
  referrer text,
  user_agent text,
  ip_hash text, -- hashed for privacy
  country text,
  device_type text,
  session_id text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE visitor_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view visitor events"
  ON visitor_events FOR SELECT USING (is_admin_user());
CREATE POLICY "Anyone can insert events"
  ON visitor_events FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_visitor_events_page ON visitor_events (page_path, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_events_date ON visitor_events (created_at DESC);
