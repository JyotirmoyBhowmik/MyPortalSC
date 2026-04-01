-- Ensure the site_settings table exists
-- Insert the feature flag for strict security headers
INSERT INTO public.site_settings (key, value, category, label, description)
VALUES (
    'feature_strict_security_headers',
    'true'::jsonb,
    'Security',
    'Strict Security Headers (CSP & HSTS)',
    'Enforces UpGuard-compliant Content-Security-Policy and X-Frame-Options across the site. Turn off if it breaks external embeds.'
)
ON CONFLICT (key) DO NOTHING;
