-- Migration 030: Add new admin-controlled feature flags and settings
-- Adds:
--   feature_available_for_opportunities  - show/hide the hero availability badge
--   feature_retro_mode                  - admin-controlled retro CRT mode
--   profile_photo_url                   - URL for the profile photo on About page
-- Uses ON CONFLICT DO UPDATE for safe re-runs

INSERT INTO site_settings (key, value, label, description, category)
VALUES
  (
    'feature_available_for_opportunities',
    'true',
    'Available for Opportunities',
    'Show the "Available for opportunities" green badge on the public homepage hero section.',
    'content'
  ),
  (
    'feature_retro_mode',
    'false',
    'Retro CRT Mode',
    'Enable the retro CRT green-screen visual mode site-wide. Previously a public toggle, now admin-controlled.',
    'system'
  ),
  (
    'profile_photo_url',
    '',
    'Profile Photo URL',
    'URL of the professional photo displayed on the About Me page. Leave blank to show initials fallback.',
    'content'
  )
ON CONFLICT (key) DO UPDATE
  SET label = EXCLUDED.label,
      description = EXCLUDED.description,
      category = EXCLUDED.category;

-- Make full_name nullable so existing admin_users rows (created before full_name existed) don't break
-- New invites always supply full_name derived from email or user input
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'full_name' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE admin_users ALTER COLUMN full_name DROP NOT NULL;
  END IF;
END $$;
