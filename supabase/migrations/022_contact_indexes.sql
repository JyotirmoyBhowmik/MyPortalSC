-- 022_contact_indexes.sql
-- Optimizes the descending sort query running on the Analytics Dashboard for recent contacts

CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contact_submissions (created_at DESC);
