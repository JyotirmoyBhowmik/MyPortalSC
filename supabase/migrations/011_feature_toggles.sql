-- ============================================================
-- 011_feature_toggles.sql — Site Settings & Feature Flags
-- ============================================================

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT 'false'::jsonb,
  category text NOT NULL DEFAULT 'general',
  label text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Trigger: auto-update updated_at
CREATE TRIGGER set_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site_settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage site_settings"
  ON site_settings FOR ALL
  USING (is_admin_user());

-- ─── Seed: Feature Flags (all OFF by default) ───

INSERT INTO site_settings (key, value, category, label, description) VALUES
  -- Tier 1: Executive Presence
  ('feature_executive_summary', 'false', 'tier1', 'Executive Summary Page', 'KPI counters and board-ready metrics'),
  ('feature_testimonials', 'false', 'tier1', 'Testimonials Page', 'Stakeholder endorsements carousel'),
  ('feature_timeline', 'false', 'tier1', 'Career Timeline Page', 'Interactive vertical career timeline'),
  ('feature_video_intro', 'false', 'tier1', 'Video Introduction', 'Professional video intro section'),
  ('feature_pdf_export', 'false', 'tier1', 'PDF Export', 'One-click executive summary PDF download'),
  ('feature_i18n', 'false', 'tier1', 'Multi-Language (EN/HI/BN)', 'Enable language switcher and translations'),

  -- Tier 2: Security
  ('feature_2fa', 'false', 'tier2', 'Two-Factor Authentication', 'TOTP-based 2FA for admin login'),
  ('feature_session_management', 'false', 'tier2', 'Session Management', 'View and manage active sessions'),
  ('feature_rbac', 'false', 'tier2', 'Role-Based Access Control', 'Super Admin / Editor / Viewer roles'),
  ('feature_enhanced_audit', 'false', 'tier2', 'Enhanced Audit Log', 'Filterable audit log with CSV export'),
  ('feature_captcha', 'false', 'tier2', 'CAPTCHA on Contact Form', 'Bot protection on public contact form'),
  ('feature_csp_headers', 'true', 'tier2', 'Security Headers', 'CSP, HSTS, X-Frame-Options headers'),

  -- Tier 3: Visual Excellence
  ('feature_page_transitions', 'false', 'tier3', 'Page Transitions', 'Smooth animated page transitions'),
  ('feature_scroll_animations', 'false', 'tier3', 'Scroll Animations', 'Scroll-triggered reveal animations'),
  ('feature_particle_bg', 'false', 'tier3', 'Particle Background', 'Animated particle network on hero'),
  ('feature_3d_globe', 'false', 'tier3', 'Delivery Globe', '3D interactive project globe'),
  ('feature_light_theme', 'false', 'tier3', 'Light Theme', 'Light mode theme option'),
  ('feature_magnetic_buttons', 'false', 'tier3', 'Magnetic Buttons', 'Premium hover micro-interactions'),

  -- Tier 4: Analytics
  ('feature_analytics_dashboard', 'false', 'tier4', 'Analytics Dashboard', 'Charts and visitor insights'),
  ('feature_initiative_heatmap', 'false', 'tier4', 'Initiative Heatmap', 'Visual criticality heatmap'),
  ('feature_contact_analytics', 'false', 'tier4', 'Contact Analytics', 'Contact form submission analytics'),

  -- Tier 5: Admin Power
  ('feature_rich_editor', 'false', 'tier5', 'Rich Text Editor', 'TipTap WYSIWYG editor'),
  ('feature_drag_drop', 'false', 'tier5', 'Drag & Drop Ordering', 'Reorder items via drag-and-drop'),
  ('feature_bulk_actions', 'false', 'tier5', 'Bulk Operations', 'Multi-select and bulk actions'),
  ('feature_media_library', 'false', 'tier5', 'Media Library', 'Image upload and media management'),
  ('feature_content_versioning', 'false', 'tier5', 'Content Versioning', 'Track changes and rollback'),
  ('feature_scheduled_publish', 'false', 'tier5', 'Scheduled Publishing', 'Publish content at future date'),
  ('feature_admin_search', 'false', 'tier5', 'Global Admin Search', 'Search across all admin content'),
  ('feature_activity_feed', 'false', 'tier5', 'Activity Feed', 'Real-time admin activity feed'),

  -- Tier 6: SEO & Performance
  ('feature_og_images', 'false', 'tier6', 'Dynamic OG Images', 'Auto-generated social share cards'),
  ('feature_jsonld', 'false', 'tier6', 'Structured Data (JSON-LD)', 'Schema.org markup'),
  ('feature_pwa', 'false', 'tier6', 'PWA Support', 'Installable progressive web app'),

  -- Tier 7: Enterprise
  ('feature_blog', 'false', 'tier7', 'Blog / Thought Leadership', 'Markdown blog with categories'),
  ('feature_case_studies', 'false', 'tier7', 'Case Studies', 'Deep-dive project case studies'),
  ('feature_speaking', 'false', 'tier7', 'Speaking & Events', 'Conferences and panels'),
  ('feature_publications', 'false', 'tier7', 'Publications & Awards', 'Papers and recognitions'),
  ('feature_downloads', 'false', 'tier7', 'Download Center', 'Downloadable resources'),
  ('feature_newsletter', 'false', 'tier7', 'Newsletter Signup', 'Email collection'),
  ('feature_contact_crm', 'false', 'tier7', 'Contact CRM', 'Contact submission management')
ON CONFLICT (key) DO NOTHING;
