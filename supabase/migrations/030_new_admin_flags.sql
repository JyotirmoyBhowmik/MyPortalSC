-- Migration 030: Add new admin-controlled feature flags
-- Adds feature_available_for_opportunities and feature_retro_mode settings
-- Both are admin-only controls that were previously hardcoded or client-side

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
  )
ON CONFLICT (key) DO NOTHING;
