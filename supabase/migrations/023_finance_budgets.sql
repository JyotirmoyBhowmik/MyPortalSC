-- ============================================================
-- 023_finance_budgets.sql — Finance & Budget Module
-- ============================================================

CREATE TABLE IF NOT EXISTS financial_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  fiscal_year text NOT NULL,
  investment_model text DEFAULT 'OpEx' CHECK (investment_model IN ('OpEx', 'CapEx')),
  planning_amount numeric DEFAULT 0,
  outlook_amount numeric DEFAULT 0,
  expense_amount numeric DEFAULT 0,
  carry_over_amount numeric DEFAULT 0,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  initiative_id uuid REFERENCES initiatives(id) ON DELETE SET NULL,
  skill_id uuid REFERENCES skills(id) ON DELETE SET NULL,
  currency text DEFAULT 'USD',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_financial_budgets_fiscal_year ON financial_budgets(fiscal_year);
CREATE INDEX IF NOT EXISTS idx_financial_budgets_investment_model ON financial_budgets(investment_model);
CREATE INDEX IF NOT EXISTS idx_financial_budgets_project ON financial_budgets(project_id);
CREATE INDEX IF NOT EXISTS idx_financial_budgets_initiative ON financial_budgets(initiative_id);
CREATE INDEX IF NOT EXISTS idx_financial_budgets_skill ON financial_budgets(skill_id);

-- ============================================================
-- RLS Policies
-- ============================================================
ALTER TABLE financial_budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Financial budgets viewable by everyone"
  ON financial_budgets FOR SELECT
  USING (true);

CREATE POLICY "Financial budgets fully accessible by admin"
  ON financial_budgets FOR ALL
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- ============================================================
-- Updated_at trigger
-- ============================================================
CREATE OR REPLACE TRIGGER financial_budgets_updated_at
  BEFORE UPDATE ON financial_budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
