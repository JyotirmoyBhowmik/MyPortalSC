-- ============================================================
-- 028_budget_approval_workflow.sql
-- Adds status column to financial_budgets for Approval Workflows
-- ============================================================

-- Add status column with check constraint
ALTER TABLE financial_budgets 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'Draft' 
CHECK (status IN ('Draft', 'Submitted', 'Approved', 'Closed'));

-- Set all existing historical budgets to 'Approved' so they don't break existing views
UPDATE financial_budgets 
SET status = 'Approved' 
WHERE status = 'Draft';

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
