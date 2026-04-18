-- ============================================================
-- 025_it_budget_details.sql
-- ============================================================

-- Add advanced tracking fields for IT Department practicality
ALTER TABLE financial_budgets ADD COLUMN IF NOT EXISTS exchange_rate_to_inr numeric DEFAULT 1.0;
ALTER TABLE financial_budgets ADD COLUMN IF NOT EXISTS cost_center text;
ALTER TABLE financial_budgets ADD COLUMN IF NOT EXISTS profit_center text;
ALTER TABLE financial_budgets ADD COLUMN IF NOT EXISTS account_head text;

-- Backfill Historical Fiscal Years from 2016
INSERT INTO fiscal_years (label, start_date, end_date) VALUES 
('2016-17', '2016-04-01', '2017-03-31'),
('2017-18', '2017-04-01', '2018-03-31'),
('2018-19', '2018-04-01', '2019-03-31'),
('2019-20', '2019-04-01', '2020-03-31'),
('2020-21', '2020-04-01', '2021-03-31')
ON CONFLICT (label) DO NOTHING;
