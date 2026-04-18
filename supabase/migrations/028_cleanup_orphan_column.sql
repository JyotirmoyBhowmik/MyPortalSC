-- ============================================================
-- 028_cleanup_orphan_column.sql
-- Drop the stale 'exchange_rate' column added in 024 that 
-- was superseded by 'exchange_rate_to_inr' from 025.
-- ============================================================
ALTER TABLE financial_budgets DROP COLUMN IF EXISTS exchange_rate;
