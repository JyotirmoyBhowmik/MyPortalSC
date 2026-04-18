-- ============================================================
-- 026_seed_budgets.sql
-- TEMPLATE: Practical IT Budget Seeding
-- 
-- The following SQL provides a robust template to populate
-- your CapEx and OpEx budgets mapping directly with any
-- existing Initiatives or Projects. 
-- You can run this file directly to add these base entries, 
-- or copy the INSERT statement format at the bottom to add
-- your specific manual inputs.
-- ============================================================

-- Example 1: Global Cloud Hosting Platform (OpEx)
-- Simulates an average global enterprise AWS/Azure monthly runtime cost 
INSERT INTO financial_budgets (
    title, fiscal_year, investment_model, currency, exchange_rate_to_inr, 
    planning_amount, outlook_amount, expense_amount, carry_over_amount,
    cost_center, profit_center, account_head,
    initiative_id
) VALUES (
    'Enterprise Cloud Infrastructure Hosting (AWS/Azure)', 
    '2024-25', 
    'OpEx', 
    'USD', 
    83.5, 
    120000.00,  -- $120k planned
    120000.00,  
    85000.00,   -- $85k spent so far
    0.00,
    'IT-CloudOps', 
    'Global Operations', 
    'Cloud Services',
    (SELECT id FROM initiatives LIMIT 1) -- Automatically grabs your first Initiative
);

-- Example 2: Enterprise Network & SD-WAN Hardware Refresh (CapEx)
-- Simulates globally priced hardware purchases (Cisco/Palo Alto)
INSERT INTO financial_budgets (
    title, fiscal_year, investment_model, currency, exchange_rate_to_inr, 
    planning_amount, outlook_amount, expense_amount, carry_over_amount,
    cost_center, profit_center, account_head,
    project_id
) VALUES (
    'Global SD-WAN & Firewall Migration', 
    '2023-24', 
    'CapEx', 
    'USD', 
    82.9, 
    350000.00, 
    350000.00, 
    325000.00, 
    25000.00,
    'IT-NetworkSec', 
    'Global Operations', 
    'Hardware & Devices',
    (SELECT id FROM projects LIMIT 1) -- Maps to your first actual Project
);

-- Example 3: Annual Zscaler & Microsoft 365 Licensing (OpEx)
-- Euro based SaaS subscription pricing
INSERT INTO financial_budgets (
    title, fiscal_year, investment_model, currency, exchange_rate_to_inr, 
    planning_amount, outlook_amount, expense_amount, carry_over_amount,
    cost_center, profit_center, account_head
) VALUES (
    'SaaS Licensing (M365 E5 & ZIA/ZPA)', 
    '2024-25', 
    'OpEx', 
    'EUR', 
    90.5, 
    250000.00, 
    250000.00, 
    250000.00, 
    0.00,
    'IT-EndUserComputing', 
    'Corporate', 
    'Software Maintenance & Subs'
);


-- ============================================================
-- MANUAL TEMPLATE (COPY AND PASTE TO ADD YOUR OWN)
-- ============================================================
/*
INSERT INTO financial_budgets (
    title, 
    fiscal_year,            -- Must match a label in your `fiscal_years` table (e.g. '2024-25')
    investment_model,       -- 'OpEx' or 'CapEx'
    currency,               -- 'USD', 'EUR', 'INR', etc.
    exchange_rate_to_inr,   -- Actual conversion rate (1.0 if INR)
    planning_amount, 
    outlook_amount, 
    expense_amount, 
    carry_over_amount,
    cost_center, 
    profit_center, 
    account_head,
    project_id,             -- OPTIONAL: specify a UUID if you know it, e.g., '123e4567-e89b-12d3...'
    initiative_id           -- OPTIONAL: specify a UUID
) VALUES (
    'Your IT Cost Name here', 
    '2024-25', 
    'CapEx', 
    'INR', 
    1.0, 
    5000000.00, 
    5000000.00, 
    2000000.00, 
    3000000.00,
    'IT-DC', 
    'India Branch', 
    'Servers',
    NULL,
    NULL
);
*/
