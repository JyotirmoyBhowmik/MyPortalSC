INSERT INTO public.site_settings (key, value, type, description)
VALUES
    ('feature_network_topology', 'true', 'boolean', 'Show interactive network topology visualizer on about page'),
    ('feature_cost_comparison', 'true', 'boolean', 'Show interactive infrastructure cost model on about page'),
    ('feature_ping_dashboard', 'true', 'boolean', 'Show live ping dashboard widget on contact page'),
    ('feature_security_scorecard', 'true', 'boolean', 'Enable public security scorecard page')
ON CONFLICT (key) DO NOTHING;
