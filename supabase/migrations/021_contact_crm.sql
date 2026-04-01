-- Drop the table since we just created it and it has no data yet (or alter it)
DROP TABLE IF EXISTS contact_submissions CASCADE;

CREATE TABLE IF NOT EXISTS contact_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    subject text,
    message text NOT NULL,
    integrity_hash text,
    status text NOT NULL DEFAULT 'unread',
    created_at timestamptz DEFAULT now() NOT NULL
);

-- RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact_submissions"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view contact_submissions"
  ON contact_submissions FOR SELECT
  USING (is_admin_user());

CREATE POLICY "Admins can update contact_submissions"
  ON contact_submissions FOR UPDATE
  USING (is_admin_user());

CREATE POLICY "Admins can delete contact_submissions"
  ON contact_submissions FOR DELETE
  USING (is_admin_user());

-- Create new settings for CRM & APIs
INSERT INTO site_settings (key, value, category, label, description) VALUES
    ('feature_contact_crm', 'true', 'tier7', 'Contact CRM & Email', 'Stores contact submissions via DB and sends to Resend API'),
    ('api_resend_key', '""', 'configs', 'Resend API Key', 'API key for emailing. Do not expose publicly.')
ON CONFLICT (key) DO NOTHING;
