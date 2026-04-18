-- ============================================================
-- 027_seed_all_initiatives_budgets.sql
-- ============================================================
-- Automatically parses all existing Projects and Initiatives 
-- safely allocating them to the IT Budget ecosystem.
-- ============================================================

-- 1. Insert ALL unmapped projects as CapEx (Hardward/Implementations/One-Time)
INSERT INTO financial_budgets (
    title, fiscal_year, investment_model, currency, exchange_rate_to_inr, 
    planning_amount, outlook_amount, expense_amount, carry_over_amount,
    cost_center, profit_center, account_head, project_id
)
SELECT 
    p.title, 
    '2024-25',      -- Primary mapped fiscal year default map
    'CapEx',        -- Projects default to Capital Expenditure
    'INR', 
    1.0, 
    100000.00,      -- Placeholder plan cost
    100000.00,
    100000.00,      -- Placeholder expense cost
    0.00,
    'IT-Projects', 
    'HQ', 
    'Enterprise Expansion',
    p.id
FROM projects p
WHERE NOT EXISTS (
    SELECT 1 FROM financial_budgets fb WHERE fb.project_id = p.id
);


-- 2. Insert ALL unmapped initiatives as OpEx (Operations/Continual Support)
INSERT INTO financial_budgets (
    title, fiscal_year, investment_model, currency, exchange_rate_to_inr, 
    planning_amount, outlook_amount, expense_amount, carry_over_amount,
    cost_center, profit_center, account_head, initiative_id
)
SELECT 
    i.title, 
    '2024-25',      -- Primary mapped fiscal year default map
    'OpEx',         -- Initiatives default to Operational Expenditure
    'INR', 
    1.0, 
    50000.00,      -- Placeholder plan cost
    50000.00,
    50000.00,      -- Placeholder expense cost
    0.00,
    'IT-Operations', 
    'HQ', 
    'SaaS & Subscriptions',
    i.id
FROM initiatives i
WHERE NOT EXISTS (
    SELECT 1 FROM financial_budgets fb WHERE fb.initiative_id = i.id
);
