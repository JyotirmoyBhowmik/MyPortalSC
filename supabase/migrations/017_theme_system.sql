-- 017_theme_system.sql
-- Add theme/template settings

INSERT INTO site_settings (key, value, category, label, description) VALUES
  ('site_template', '"classic"', 'appearance', 'Site Template', 'Choose between Classic and Premium layouts'),
  ('navbar_style', '"glass"', 'appearance', 'Navbar Style', 'Glassmorphism or Solid style')
ON CONFLICT (key) DO NOTHING;
