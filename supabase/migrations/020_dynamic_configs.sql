INSERT INTO public.site_settings (key, value, category, label, description)
VALUES
    (
        'config_infra_cost',
        '[
            { "id": "1", "name": "Compute", "onPrem": 450, "cloud": 280, "hybrid": 340, "icon": "⚡" },
            { "id": "2", "name": "Storage", "onPrem": 120, "cloud": 85, "hybrid": 95, "icon": "💾" },
            { "id": "3", "name": "Networking", "onPrem": 80, "cloud": 45, "hybrid": 60, "icon": "🌐" },
            { "id": "4", "name": "Security", "onPrem": 200, "cloud": 150, "hybrid": 170, "icon": "🛡️" },
            { "id": "5", "name": "Personnel", "onPrem": 600, "cloud": 250, "hybrid": 400, "icon": "👨‍💻" },
            { "id": "6", "name": "Power & Cooling", "onPrem": 180, "cloud": 0, "hybrid": 90, "icon": "❄️" },
            { "id": "7", "name": "Licensing", "onPrem": 300, "cloud": 350, "hybrid": 320, "icon": "📜" },
            { "id": "8", "name": "DR / Backup", "onPrem": 250, "cloud": 120, "hybrid": 180, "icon": "🔄" }
        ]'::jsonb,
        'configs',
        'Infrastructure Cost Config',
        'Dynamic parameter configuration for the Infrastructure Cost Comparison component'
    )
ON CONFLICT (key) DO NOTHING;
