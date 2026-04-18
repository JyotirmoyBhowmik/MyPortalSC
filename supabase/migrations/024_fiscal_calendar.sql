-- ============================================================
-- 024_fiscal_calendar.sql — Master Data Calendar
-- ============================================================

CREATE TABLE IF NOT EXISTS fiscal_years (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL UNIQUE,  -- e.g. "2024-25"
  start_date date NOT NULL,    -- e.g. "2024-04-01"
  end_date date NOT NULL,      -- e.g. "2025-03-31"
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- RLS Policies
ALTER TABLE fiscal_years ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fiscal years viewable by everyone"
  ON fiscal_years FOR SELECT USING (true);

CREATE POLICY "Fiscal years administrable by admin"
  ON fiscal_years FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE OR REPLACE TRIGGER fiscal_years_updated_at
  BEFORE UPDATE ON fiscal_years
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Modify existing financial budgets to relate to fiscal_years
-- First add standard currencies
ALTER TABLE financial_budgets ADD COLUMN IF NOT EXISTS exchange_rate numeric DEFAULT 1.0;

-- Optional: Link previously text-based `fiscal_year` to `fiscal_years.label`
-- Because we just created it, there's unlikely to be rigid old data breaking it, but we can enforce FK.
-- ALTER TABLE financial_budgets ADD CONSTRAINT fk_fiscal_year_label
--   FOREIGN KEY (fiscal_year) REFERENCES fiscal_years(label) ON UPDATE CASCADE ON DELETE RESTRICT;

-- Pre-seed typical 9-10 years (from 2021 to 2030)
INSERT INTO fiscal_years (label, start_date, end_date) VALUES 
('2021-22', '2021-04-01', '2022-03-31'),
('2022-23', '2022-04-01', '2023-03-31'),
('2023-24', '2023-04-01', '2024-03-31'),
('2024-25', '2024-04-01', '2025-03-31'),
('2025-26', '2025-04-01', '2026-03-31'),
('2026-27', '2026-04-01', '2027-03-31'),
('2027-28', '2027-04-01', '2028-03-31'),
('2028-29', '2028-04-01', '2029-03-31'),
('2029-30', '2029-04-01', '2030-03-31'),
('2030-31', '2030-04-01', '2031-03-31')
ON CONFLICT (label) DO NOTHING;
