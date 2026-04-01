INSERT INTO public.site_settings (key, value, category, label, description)
VALUES
    ('feature_network_topology', 'true', 'tier3', 'Network Topology', 'Show interactive network topology visualizer on about page'),
    ('feature_cost_comparison', 'true', 'tier3', 'Cost Comparison', 'Show interactive infrastructure cost model on about page'),
    ('feature_ping_dashboard', 'true', 'tier4', 'Ping Dashboard', 'Show live ping dashboard widget on contact page'),
    ('feature_security_scorecard', 'true', 'tier4', 'Security Scorecard', 'Enable public security scorecard page')
ON CONFLICT (key) DO NOTHING;
