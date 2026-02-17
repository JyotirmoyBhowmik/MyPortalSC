-- ─── Fix contact_submissions: allow anonymous/public INSERT ───

-- Add the missing 'subject' column
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS subject text;

-- Allow anyone (including unauthenticated visitors) to INSERT into contact_submissions
CREATE POLICY "Public can submit contact forms"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
