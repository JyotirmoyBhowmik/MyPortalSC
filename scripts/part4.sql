-- 4. Contextual defaults for earlier initiatives (1-88) where description or business_value is null
UPDATE initiatives
SET 
  description = COALESCE(description, 'Delivered under the ' || strategic_area || ' strategic domain, this initiative focused on ' || lower(title) || ' to elevate enterprise IT maturity, service reliability, and operational standardization across corporate and manufacturing sites.'),
  business_value = COALESCE(business_value, 'Strengthened organizational service availability, mitigated infrastructure downtime risks, and ensured full adherence to corporate IT governance standards.'),
  image_url = NULL,
  updated_at = NOW()
WHERE description IS NULL OR business_value IS NULL OR image_url IS NOT NULL;

-- 5. Update timeline and executive KPIs
UPDATE executive_kpis SET value = '108', updated_at = NOW() WHERE key = 'initiatives_delivered';