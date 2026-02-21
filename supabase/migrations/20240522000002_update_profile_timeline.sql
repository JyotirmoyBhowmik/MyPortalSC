-- ============================================================
-- 020_update_profile_timeline.sql — Accurate Resume Sync
-- ============================================================

-- 1. Sync Content Pages (Home, About)
INSERT INTO content_pages (page_key, title, content, meta_description) VALUES
(
  'home',
  'Home',
  '{"hero_title": "Jyotirmoy Bhowmik", "hero_subtitle": "Project Manager – IT Infrastructure & Network | Security | Cloud", "hero_description": "IT Infrastructure & Project Management leader with 15+ years of experience delivering secure, resilient enterprise infrastructure and technology programs across India and Nepal with multi-country coordination exposure.", "hero_cta_primary": "View Projects", "hero_cta_secondary": "Contact Me"}'::jsonb,
  'Jyotirmoy Bhowmik — Project Manager – IT Infrastructure & Network | Security | Cloud'
),
(
  'about',
  'About Me',
  '{"biography": "IT Infrastructure & Project Management leader with 15+ years of experience delivering secure, resilient enterprise infrastructure and technology programs across India and Nepal with multi-country coordination exposure (Singapore, Malaysia, Bangladesh, Australia). Strong track record in data center operations, disaster recovery transformation, cloud strategy and migrations (AWS/Azure), Microsoft 365 modernization, and large-scale network & security upgrades.", "vision_statement": "Deep experience working with Industrial Control Systems (ICS) / SCADA environments—driving IT/OT connectivity, OT security roadmap planning, and segmentation initiatives aligned to IEC 62443 principles.", "professional_summary": "Skilled in evaluating current-state environments (infra, network, security, IT/OT)—performing gap/risk assessment, defining target architecture (Landing Zone / hybrid), and building practical roadmaps to improve resilience, compliance, and service quality. Proven people leader and stakeholder partner—leading teams (4–16 members), vendors, and cross-functional groups.", "location": "Kathmandu, Nepal", "email": "jyotirmoy.bhowmik@gmail.com", "phone": "+977-9801009825 / +91-9774135614", "experience": [{"company": "ITC Infotech India Ltd. (Seconded to Surya Nepal Pvt. Ltd.)", "role": "Project Manager & IT Infrastructure Team Lead", "period": "Sep 2016 – Present", "location": "Kathmandu, Nepal", "description": "Lead infrastructure operations and project delivery for enterprise Data Center, Disaster Recovery, ICS/SCADA and SAP ERP environments; manage vendors and coordinate global project teams to align technology outcomes with business objectives."}, {"company": "Payoda Technologies Pvt. Ltd.", "role": "Senior Engineer – IT Infrastructure & System Integration", "period": "May 2014 – Sep 2016", "location": "Aizawl, India", "description": "Primary networking and security engineer for a state government data center; led a 12-member team supporting LAN/WAN, switching and firewall security for e-governance applications."}, {"company": "Global Innov Source (Sify Technologies)", "role": "Assistant System Administrator Engineer", "period": "Jun 2012 – Apr 2014", "location": "Agartala, India", "description": "Supported Tier-III data center operations within a 16-member team; administered RHEL server farms and network devices; handled patching, configuration changes and capacity planning."}]}'::jsonb,
  'Experienced IT Infrastructure Manager specializing in Data Center, Cloud, and OT Security.'
)
ON CONFLICT (page_key) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, meta_description = EXCLUDED.meta_description;

-- 2. Clear old Timeline Entries and Insert True Data
DELETE FROM timeline_entries;

INSERT INTO timeline_entries (year_start, year_end, title_en, organization, description_en, entry_type, sort_order) VALUES
  (2016, NULL, 'Project Manager & IT Infrastructure Team Lead', 'ITC Infotech India Ltd. (Surya Nepal Pvt. Ltd.)', 'Lead infrastructure operations and project delivery for enterprise Data Center, Disaster Recovery, ICS/SCADA and SAP ERP environments.', 'role', 1),
  (2014, 2016, 'Senior Engineer – IT Infrastructure & System Integration', 'Payoda Technologies Pvt. Ltd.', 'Primary networking and security engineer for a state government data center; led a 12-member team.', 'role', 2),
  (2012, 2014, 'Assistant System Administrator Engineer', 'Global Innov Source (Sify Technologies)', 'Supported Tier-III data center operations within a 16-member team; administered RHEL server farms and network devices.', 'role', 3),
  (2013, 2013, 'Master of Computer Applications (MCA)', 'Tripura University', 'Post-graduate degree in Computer Applications.', 'education', 4),
  (2010, 2010, 'Bachelor of Computer Applications (BCA)', 'ICFAI University (Tripura)', 'Undergraduate degree in Computer Applications.', 'education', 5),
  (2007, 2007, 'Higher Secondary (12th, Science)', 'National Institute of Open Schooling (NIOS)', 'Higher secondary education with a focus on science.', 'education', 6);
