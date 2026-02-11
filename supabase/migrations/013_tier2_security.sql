-- ============================================================
-- 013_tier2_security.sql — Security & Trust Tables
-- ============================================================

-- ─── Enhanced audit_log view (the table already exists from 001_schema) ───
-- Add user_id column if not exists for RBAC tracking
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_log' AND column_name='user_id') THEN
    ALTER TABLE audit_log ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- ─── Add role column to admin_users ───
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_users' AND column_name='role') THEN
    ALTER TABLE admin_users ADD COLUMN role text DEFAULT 'editor' CHECK (role IN ('super_admin', 'editor', 'viewer'));
  END IF;
END $$;

-- ─── User Sessions tracking ───
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_info text,
  ip_address text,
  user_agent text,
  last_active timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now() NOT NULL,
  is_active boolean DEFAULT true
);

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sessions"
  ON user_sessions FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage sessions"
  ON user_sessions FOR ALL
  USING (is_admin_user());

-- ─── Rate limiting table ───
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  endpoint text NOT NULL,
  attempt_count integer DEFAULT 1,
  window_start timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_ip ON rate_limits (ip_address, endpoint, window_start);

-- ─── Contact form submissions (for CAPTCHA + CRM) ───
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  notes text,
  ip_address text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TRIGGER set_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage contacts"
  ON contact_submissions FOR ALL
  USING (is_admin_user());

CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions (status);
