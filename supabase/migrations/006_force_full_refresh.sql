-- ============================================================
-- 006_force_full_refresh.sql — (Consolidated Script)
-- ============================================================
-- 1. FIX VISIBILITY / RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON projects;
CREATE POLICY "Public projects are viewable by everyone" ON projects FOR SELECT USING (status = 'published');

ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public content is viewable by everyone" ON content_pages;
CREATE POLICY "Public content is viewable by everyone" ON content_pages FOR SELECT USING (true);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public skills are viewable by everyone" ON skills;
CREATE POLICY "Public skills are viewable by everyone" ON skills FOR SELECT USING (true);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public achievements are viewable by everyone" ON achievements;
CREATE POLICY "Public achievements are viewable by everyone" ON achievements FOR SELECT USING (true);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public certifications are viewable by everyone" ON certifications;
CREATE POLICY "Public certifications are viewable by everyone" ON certifications FOR SELECT USING (true);


-- 2. INTERACTIVE CONTENT (About / Home / Contact) WITH RESUME DATA
INSERT INTO content_pages (page_key, title, content, meta_description) VALUES
(
  'home',
  'Home',
  '{"hero_title": "Jyotirmoy Bhowmik", "hero_subtitle": "Project Manager – IT Infrastructure & Network | Security | Cloud", "hero_description": "IT Infrastructure & Project Management leader with 15+ years of experience delivering secure, resilient enterprise infrastructure and technology programs across India and Nepal.", "hero_cta_primary": "View Projects", "hero_cta_secondary": "Get in Touch"}'::jsonb,
  'Jyotirmoy Bhowmik — Project Manager – IT Infrastructure & Network | Security | Cloud'
),
(
  'about',
  'About Me',
  '{
    "biography": "As an IT Infrastructure & Project Management leader with over 15 years of experience, I specialize in delivering secure, resilient enterprise infrastructure and technology programs. My journey spans multi-country coordination (Singapore, Malaysia, Bangladesh, Australia) and hands-on leadership in data center operations, disaster recovery transformation, cloud strategy, and large-scale network upgrades.\n\nI have deep experience working with Industrial Control Systems (ICS) / SCADA environments, driving IT/OT connectivity and security aligned to IEC 62443 principles. I am skilled in evaluating current-state environments (infra, network, security, IT/OT)—performing gap/risk assessment, defining target architecture (Landing Zone / hybrid), and building practical roadmaps to improve resilience, compliance, and service quality.",
    "vision_statement": "To drive digital transformation and operational excellence by bridging the gap between legacy infrastructure and modern, secure, and automated technology landscapes.",
    "professional_summary": "Skilled in evaluating current-state environments (infra, network, security, IT/OT)—performing gap/risk assessment, defining target architecture (Landing Zone / hybrid), and building practical roadmaps to improve resilience, compliance, and service quality. Proven people leader and stakeholder partner—leading teams (4–16 members), vendors, and cross-functional groups; delivering outcomes through structured governance, documentation, SOPs, and audit readiness.",
    "location": "Kathmandu, Nepal / India",
    "email": "jyotirmoy.bhowmik@gmail.com",
    "phone": "+977-9801009825 / +91-9774135614",
    "languages": "Hindi, English, Bengali (Fluent)",
    "education": [
        {"degree": "Master of Computer Applications (MCA)", "institution": "Tripura University", "year": "2013"},
        {"degree": "Bachelor of Computer Applications (BCA)", "institution": "ICFAI University (Tripura)", "year": "2010"},
        {"degree": "Higher Secondary (12th, Science)", "institution": "National Institute of Open Schooling (NIOS)", "year": "2007"}
    ],
    "experience": [
        {
            "company": "ITC Infotech India Ltd. (Seconded to Surya Nepal Pvt. Ltd.)",
            "role": "Project Manager & IT Infrastructure Team Lead",
            "period": "Sep 2016 – Present",
            "location": "Kathmandu, Nepal",
            "description": "Lead infrastructure operations and project delivery for enterprise Data Center, Disaster Recovery, ICS/SCADA and SAP ERP environments; manage vendors and coordinate global project teams to align technology outcomes with business objectives.\n\nKey Responsibilities & Achievements:\n• Own end-to-end infrastructure delivery and operations across data center, DR, server platforms, and network/security services; ensure 24x7 service continuity.\n• Drive cloud modernization: migrated enterprise productivity and core services to Microsoft 365 (E3/E5) with SharePoint/OneDrive integration.\n• Modernized security posture by introducing Zscaler SASE to replace legacy proxy/VPN approach.\n• Led evaluation and migration of Disaster Recovery from traditional architecture to hybrid virtual design with landing-zone approach.\n• Administer enterprise backup and resilience using Commvault with geo-replication on HPE StoreOnce.\n• Delivered automation at scale: deployed 30+ RPA bots across IT service desk and finance/reporting processes.\n• Built analytics and reporting capability: delivered Tableau/Power BI dashboards for sales, inventory, and performance reporting.\n• Delivered IT/OT connectivity improvements for industrial environments supporting Utility Management (SCADA) and EHS sustainability initiatives."
        },
        {
            "company": "Payoda Technologies Pvt. Ltd.",
            "role": "Senior Engineer – IT Infrastructure & System Integration",
            "period": "May 2014 – Sep 2016",
            "location": "Aizawl, India",
            "description": "Client: Mizoram State Data Centre, Mizoram State e-Governance Society (Govt. of Mizoram)\n• Primary networking and security engineer for a state government data center; led a 12-member team supporting LAN/WAN, switching and firewall security for e-governance applications.\n• Technical lead for RHEL Linux and SQL Server environments—installation, configuration, performance tuning, patching and availability management.\n• Conducted requirement analysis and contributed to infrastructure upgrade design; coordinated vendors and procurement to optimize cost and timelines."
        },
        {
            "company": "Global Innov Source (Sify Technologies)",
            "role": "Assistant System Administrator Engineer",
            "period": "Jun 2012 – Apr 2014",
            "location": "Agartala, India",
            "description": "Client: Tripura State Data Center, Tripura State e-Governance Society (Govt. of Tripura)\n• Supported Tier-III data center operations within a 16-member team; administered RHEL server farms and network devices.\n• Assisted implementation of virtualization and backup systems; supported incident resolution and performance improvements.\n• Created documentation and trained junior team members to standardize operational processes."
        }
    ]
  }'::jsonb,
  'Experienced IT Infrastructure Manager specializing in Data Center, Cloud, and OT Security.'
),
(
  'contact',
  'Contact',
  '{"email": "jyotirmoy.bhowmik@gmail.com", "phone": "+977-9801009825 / +91-9774135614", "linkedin": "https://linkedin.com/in/jyotirmoy-bhowmik", "location": "Kathmandu, Nepal"}'::jsonb,
  'Contact Jyotirmoy Bhowmik for IT Infrastructure and Project Management opportunities.'
)
ON CONFLICT (page_key) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, meta_description = EXCLUDED.meta_description;


-- 3. INSERT SKILLS
INSERT INTO skills (name, category, proficiency_level, years_of_experience, order_index) VALUES
('Data Center Ops (Win Srv/RHEL)', 'Infrastructure', 5, 15.0, 1),
('Disaster Recovery / BCP', 'Infrastructure', 5, 10.0, 2),
('VMware vSphere/ESXi / Hyper-V', 'Infrastructure', 4, 8.0, 3),
('AWS / Azure Core Services', 'Cloud', 4, 6.0, 4),
('Microsoft 365 (Exch/SharePoint)', 'Collaboration', 5, 8.0, 5),
('Cisco/Juniper Routing/Switching', 'Network', 4, 12.0, 6),
('Palo Alto / Fortinet / Check Point', 'Security', 4, 8.0, 7),
('Zscaler (SASE) / VPN', 'Security', 4, 4.0, 8),
('Commvault w/ HPE StoreOnce', 'Tools', 4, 6.0, 9),
('Tableau / Power BI', 'Analytics', 3, 3.0, 10),
('RPA (UiPath/AutoEdge)', 'Automation', 3, 3.0, 11),
('Project Mgmt & Vendor Governance', 'Methodology', 5, 15.0, 12),
('IT/OT Security (IEC 62443)', 'Security', 4, 5.0, 13)
ON CONFLICT (name) DO NOTHING;


-- 4. INSERT ALL PROJECTS (Retention of 88 Initiatives)
INSERT INTO projects (title, slug, short_description, detailed_description, status, domain, technologies, start_date, end_date, github_url, order_index) VALUES
-- FY 2024-25
(
  'Industrial OT Network Segmentation (IEC 62443)',
  'industrial-ot-network-segmentation-24',
  'Establish secure OT foundations to protect ICS/SCADA.',
  'Strategic Area: OT Security. Criticality: Critical. Delivery focus: Define requirements and target controls; Coordinate design/implementation and validation; Drive governance and operational handover.',
  'published',
  ARRAY['OT Security', 'Critical'],
  ARRAY['IEC 62443', 'SCADA', 'Network Segmentation'],
  '2024-04-01', '2025-03-31', NULL, 1
),
(
  'AI-Driven Energy Analytics & Automation',
  'ai-energy-analytics-24',
  'Enable safe OT–IT data exchange for sustainability.',
  'Strategic Area: IoT / Sustainability. Criticality: High. Delivery focus: Requirements and stakeholder alignment; Delivery coordination and governance; Operational handover and improvement.',
  'published',
  ARRAY['IoT', 'Sustainability', 'High'],
  ARRAY['IoT', 'Analytics', 'Automation'],
  '2024-04-01', '2025-03-31', NULL, 2
),
(
  'Unified Enterprise Wi-Fi 6 Rollout',
  'unified-wifi-6-rollout-24',
  'Modernize wireless to deliver secure connectivity.',
  'Strategic Area: Network Infra. Criticality: High. Delivery focus: Assess capacity and performance gaps; Plan/design upgrade and coordinate implementation; Stabilize operations and document standards.',
  'published',
  ARRAY['Network Infra', 'High'],
  ARRAY['Wi-Fi 6', 'Cisco'],
  '2024-04-01', '2025-03-31', NULL, 3
),
(
  'SharePoint & OneDrive Business Implementation',
  'sharepoint-onedrive-impl-24',
  'Adopt modern productivity/collaboration platforms.',
  'Strategic Area: Cloud Collab. Criticality: High. Delivery focus: Define migration/adoption approach; Govern permissions/governance and rollout; Improve collaboration and reduce legacy dependency.',
  'published',
  ARRAY['Cloud Collab', 'High'],
  ARRAY['SharePoint', 'OneDrive'],
  '2024-04-01', '2025-03-31', NULL, 4
),
(
  'Cloud Landing Zone Architecture Design',
  'cloud-landing-zone-design-24',
  'Define scalable cloud foundations (AWS/Azure).',
  'Strategic Area: Cloud Strategy. Criticality: Critical. Delivery focus: Define cloud target architecture and governance; Coordinate connectivity/migration and security baseline; Enable operations and cost oversight.',
  'published',
  ARRAY['Cloud Strategy', 'Critical'],
  ARRAY['AWS', 'Azure', 'Landing Zone'],
  '2024-04-01', '2025-03-31', NULL, 5
),
(
  'Centralized IP-Surveillance (Warehousing)',
  'centralized-ip-surveillance-24',
  'Extend surveillance coverage to warehouses.',
  'Strategic Area: Physical Security. Criticality: High. Delivery focus: Define requirements and target controls; Coordinate design/implementation and validation; Drive governance and operational handover.',
  'published',
  ARRAY['Physical Security', 'High'],
  ARRAY['IP Cameras', 'NVR'],
  '2024-04-01', '2025-03-31', NULL, 6
),
(
  'Remote Construction Site Surveillance System',
  'remote-site-surveillance-24',
  'Surveillance for remote sites for asset protection.',
  'Strategic Area: Physical Security. Criticality: Medium. Delivery focus: Define requirements and target controls; Coordinate design/implementation and validation; Drive governance and operational handover.',
  'published',
  ARRAY['Physical Security', 'Medium'],
  ARRAY['Remote Monitoring'],
  '2024-04-01', '2025-03-31', NULL, 7
),
(
  'High-Density Fiber Distribution Hub Design',
  'high-density-fiber-hub-24',
  'Rationalize and redesign infrastructure for higher availability.',
  'Strategic Area: Data Center Infra. Criticality: Critical. Delivery focus: Assess current state and risks; Coordinate modernization/migration and testing; Operationalize with SOPs and monitoring.',
  'published',
  ARRAY['Data Center Infra', 'Critical'],
  ARRAY['Fiber Optics', 'Data Center'],
  '2024-04-01', '2025-03-31', NULL, 8
),
(
  'Core Network Switch Lifecycle Replacement',
  'core-switch-replacement-24',
  'Upgrade switching to keep EOL remediation.',
  'Strategic Area: Network Infra. Criticality: Critical. Delivery focus: Assess capacity and performance gaps; Plan/design upgrade and coordinate implementation; Stabilize operations and document standards.',
  'published',
  ARRAY['Network Infra', 'Critical'],
  ARRAY['Switches', 'Core Networking'],
  '2024-04-01', '2025-03-31', NULL, 9
),

-- FY 2023-24
(
  'Corporate Web Asset Cloud Migration (AWS/Azure)',
  'web-asset-cloud-migration-23',
  'Migrate web assets to cloud platforms.',
  'Strategic Area: Cloud / Digital. Criticality: High. Delivery focus: Define cloud target architecture and governance; Coordinate connectivity/migration and security baseline; Enable operations and cost oversight.',
  'published',
  ARRAY['Cloud', 'Digital', 'High'],
  ARRAY['AWS', 'Azure', 'Web Hosting'],
  '2023-04-01', '2024-03-31', NULL, 10
),
(
  'OT Network Security Roadmap Planning',
  'ot-security-roadmap-23',
  'Strengthen governance through roadmaps and assessments.',
  'Strategic Area: OT Security. Criticality: Critical. Delivery focus: Define requirements and target controls; Coordinate design/implementation and validation; Drive governance and operational handover.',
  'published',
  ARRAY['OT Security', 'Critical'],
  ARRAY['IEC 62443', 'Strategy'],
  '2023-04-01', '2024-03-31', NULL, 11
),
(
  'Energy Compliance & Monitoring Blueprint',
  'energy-compliance-blueprint-23',
  'Create blueprints to guide compliance.',
  'Strategic Area: Compliance. Criticality: High. Delivery focus: Requirements and stakeholder alignment; Delivery coordination and governance; Operational handover and improvement.',
  'published',
  ARRAY['Compliance', 'High'],
  ARRAY['Monitoring', 'Sustainability'],
  '2023-04-01', '2024-03-31', NULL, 12
),
(
  'Centralized Infrastructure Hosting Assessment',
  'hosting-assessment-23',
  'Assess hosting options to optimize cost/risk.',
  'Strategic Area: Strategy. Criticality: Critical. Delivery focus: Requirements and stakeholder alignment; Delivery coordination and governance; Operational handover and improvement.',
  'published',
  ARRAY['Strategy', 'Critical'],
  ARRAY['Infrastructure Assessment'],
  '2023-04-01', '2024-03-31', NULL, 13
),
(
  'Enterprise Windows 11 OS Transition',
  'win11-transition-23',
  'Modernize OS baselines (Windows 11).',
  'Strategic Area: End-User Compute. Criticality: Medium. Delivery focus: Requirements and stakeholder alignment; Delivery coordination and governance; Operational handover and improvement.',
  'published',
  ARRAY['End-User Compute', 'Medium'],
  ARRAY['Windows 11'],
  '2023-04-01', '2024-03-31', NULL, 14
),
(
  'Legacy Server OS Modernization (2012R2)',
  'legacy-server-modernization-23',
  'Modernize legacy server OS (2012R2).',
  'Strategic Area: Infrastructure. Criticality: High. Delivery focus: Assess current state and risks; Coordinate modernization/migration and testing; Operationalize with SOPs and monitoring.',
  'published',
  ARRAY['Infrastructure', 'High'],
  ARRAY['Windows Server 2012 R2'],
  '2023-04-01', '2024-03-31', NULL, 15
),
(
  'Dark Fiber WAN Capacity Expansion',
  'dark-fiber-wan-23',
  'Expand WAN capacity and strengthen reliability.',
  'Strategic Area: Network Infra. Criticality: High. Delivery focus: Assess capacity and performance gaps; Plan/design upgrade and coordinate implementation; Stabilize operations and document standards.',
  'published',
  ARRAY['Network Infra', 'High'],
  ARRAY['Dark Fiber', 'WAN'],
  '2023-04-01', '2024-03-31', NULL, 16
),
(
  'Infrastructure Observability Suite (Zabbix)',
  'zabbix-observability-23',
  'Implement Zabbix and standardize monitoring visualization.',
  'Strategic Area: ITOps / Monitoring. Criticality: High. Delivery focus: Identify high-value use cases and requirements; Implement tooling/dashboards/bots and validate; Embed operations and continuous improvement.',
  'published',
  ARRAY['ITOps', 'Monitoring', 'High'],
  ARRAY['Zabbix', 'Observability'],
  '2023-04-01', '2024-03-31', NULL, 17
),

-- FY 2022-23
(
  'Mission-Critical ERP Server Virtualization',
  'erp-server-virt-22',
  'Virtualize mission-critical ERP servers.',
  'Strategic Area: Infrastructure. Criticality: Critical. Delivery focus: Assess current state and risks; Coordinate modernization/migration and testing; Operationalize with SOPs and monitoring.',
  'published',
  ARRAY['Infrastructure', 'Critical'],
  ARRAY['VMware', 'ERP'],
  '2022-04-01', '2023-03-31', NULL, 18
),
(
  'EHS Incident Management SaaS Evaluation',
  'ehs-saas-eval-22',
  'Evaluate SaaS for incident management.',
  'Strategic Area: Compliance. Criticality: Medium. Delivery focus: Requirements and stakeholder alignment; Delivery coordination and governance; Operational handover and improvement.',
  'published',
  ARRAY['Compliance', 'Medium'],
  ARRAY['SaaS', 'EHS'],
  '2022-04-01', '2023-03-31', NULL, 19
),
(
  'Real-time Utility Monitoring System (IoT)',
  'utility-iot-monitoring-22',
  'Enable safe OT–IT data exchange (IoT).',
  'Strategic Area: Sustainability. Criticality: Medium. Delivery focus: Requirements and stakeholder alignment; Delivery coordination and governance; Operational handover and improvement.',
  'published',
  ARRAY['Sustainability', 'Medium'],
  ARRAY['IoT', 'Utility Monitoring'],
  '2022-04-01', '2023-03-31', NULL, 20
),
(
  'Core Backbone Upgrade (1G to 10G)',
  'core-backbone-upgrade-22',
  'Upgrade backbone, switching and routing (1G -> 10G).',
  'Strategic Area: Network Infra. Criticality: Critical. Delivery focus: Assess capacity and performance gaps; Plan/design upgrade and coordinate implementation; Stabilize operations and document standards.',
  'published',
  ARRAY['Network Infra', 'Critical'],
  ARRAY['10G Ethernet', 'Switching'],
  '2022-04-01', '2023-03-31', NULL, 21
),
(
  'Financial MIS Analytics Dashboard',
  'financial-mis-dashboard-22',
  'Financial MIS Analytics Dashboard Development.',
  'Strategic Area: Data Analytics. Criticality: High. Delivery focus: Identify high-value use cases and requirements; Implement tooling/dashboards/bots and validate; Embed operations and continuous improvement.',
  'published',
  ARRAY['Data Analytics', 'High'],
  ARRAY['Tableau', 'Power BI'],
  '2022-04-01', '2023-03-31', NULL, 22
),
(
  'RPA Deployment (Bots)',
  'rpa-deployment-22',
  'RPA Deployment (Attended/Unattended Bots).',
  'Strategic Area: Automation. Criticality: High. Delivery focus: Identify high-value use cases and requirements; Implement tooling/dashboards/bots and validate; Embed operations and continuous improvement.',
  'published',
  ARRAY['Automation', 'High'],
  ARRAY['RPA', 'UiPath'],
  '2022-04-01', '2023-03-31', NULL, 25
),
(
  'Centralized Patch Management (WSUS)',
  'wsus-patch-mgmt-22',
  'Reduce attack surface with patch discipline.',
  'Strategic Area: Security Ops. Criticality: Critical. Delivery focus: Define requirements and target controls; Coordinate design/implementation and validation; Drive governance and operational handover.',
  'published',
  ARRAY['Security Ops', 'Critical'],
  ARRAY['WSUS', 'Patch Management'],
  '2022-04-01', '2023-03-31', NULL, 28
),
(
  'Legacy Data Center Decommissioning (Floor 1)',
  'legacy-dc-decom-22',
  'Decommission legacy data center floor.',
  'Strategic Area: Infrastructure. Criticality: Medium. Delivery focus: Assess current state and risks; Coordinate modernization/migration and testing; Operationalize with SOPs and monitoring.',
  'published',
  ARRAY['Infrastructure', 'Medium'],
  ARRAY['Decommissioning', 'Data Center'],
  '2022-04-01', '2023-03-31', NULL, 29
),
(
  'Cloud Storage Migration (OneDrive/SharePoint)',
  'cloud-storage-mig-22',
  'Migrate content to OneDrive/SharePoint.',
  'Strategic Area: Cloud Storage. Criticality: High. Delivery focus: Define migration/adoption approach; Govern permissions/governance and rollout; Improve collaboration and reduce legacy dependency.',
  'published',
  ARRAY['Cloud Storage', 'High'],
  ARRAY['OneDrive', 'SharePoint'],
  '2022-04-01', '2023-03-31', NULL, 30
),
(
  'Microsoft 365 & Intune MDM Procurement',
  'm365-intune-procure-22',
  'Establish governance for identity/device management.',
  'Strategic Area: Cloud / Security. Criticality: Critical. Delivery focus: Define requirements and target controls; Coordinate design/implementation and validation; Drive governance and operational handover.',
  'published',
  ARRAY['Cloud', 'Security', 'Critical'],
  ARRAY['Intune', 'MDM', 'Office 365'],
  '2022-04-01', '2023-03-31', NULL, 33
),
(
  'Managed Print Services Implementation',
  'managed-print-services-22',
  'Managed Print Services Implementation.',
  'Strategic Area: Ops Efficiency. Criticality: Low. Delivery focus: Requirements and stakeholder alignment; Delivery coordination and governance; Operational handover and improvement.',
  'published',
  ARRAY['Ops Efficiency', 'Low'],
  ARRAY['Managed Print'],
  '2022-04-01', '2023-03-31', NULL, 34
),
-- FY 2021-22
(
  'Disaster Recovery Geo-Redundancy Migration',
  'dr-geo-redundancy-21',
  'Improve business continuity with DR readiness and geo-redundancy.',
  'Strategic Area: BCP / DR. Criticality: Critical. Delivery focus: Assess current state and risks; Coordinate modernization/migration and testing; Operationalize with SOPs and monitoring.',
  'published',
  ARRAY['BCP', 'DR', 'Critical'],
  ARRAY['Geo-Redundancy', 'VMware', 'StoreOnce'],
  '2021-04-01', '2022-03-31', NULL, 36
),
(
  'Robotic Process Automation (Scale-out)',
  'rpa-scale-out-21',
  'Robotic Process Automation (Scale-out Phase).',
  'Strategic Area: Automation. Criticality: High. Delivery focus: Identify high-value use cases and requirements; Implement tooling/dashboards/bots and validate; Embed operations and continuous improvement.',
  'published',
  ARRAY['Automation', 'High'],
  ARRAY['RPA', 'UiPath'],
  '2021-04-01', '2022-03-31', NULL, 37
),
(
  'ERP Landscape Virtualization (Dev/QA/Prod)',
  'erp-landscape-virt-21',
  'Virtualize ERP environment.',
  'Strategic Area: Infrastructure. Criticality: Critical. Delivery focus: Assess current state and risks; Coordinate modernization/migration and testing; Operationalize with SOPs and monitoring.',
  'published',
  ARRAY['Infrastructure', 'Critical'],
  ARRAY['VMware', 'ERP'],
  '2021-04-01', '2022-03-31', NULL, 38
),
(
  'Microsoft 365 Enterprise Rollout',
  'm365-enterprise-rollout-21',
  'Improve user productivity with standardized tools (M365).',
  'Strategic Area: Cloud Productivity. Criticality: High. Delivery focus: Define migration/adoption approach; Govern permissions/governance and rollout; Improve collaboration and reduce legacy dependency.',
  'published',
  ARRAY['Cloud Productivity', 'High'],
  ARRAY['M365', 'Teams'],
  '2021-04-01', '2022-03-31', NULL, 40
),
(
  'Hybrid Cloud Connectivity (Azure ExpressRoute)',
  'hybrid-cloud-connectivity-21',
  'Define scalable cloud foundations (ExpressRoute).',
  'Strategic Area: Cloud Network. Criticality: Critical. Delivery focus: Assess capacity and performance gaps; Plan/design upgrade and coordinate implementation; Stabilize operations and document standards.',
  'published',
  ARRAY['Cloud Network', 'Critical'],
  ARRAY['Azure ExpressRoute'],
  '2021-04-01', '2022-03-31', NULL, 41
),
(
  'Enterprise Backup & Storage Enhancement',
  'backup-storage-enhancement-21',
  'Modernize storage and backup platforms.',
  'Strategic Area: Data Protection. Criticality: Critical. Delivery focus: Assess current state and risks; Coordinate modernization/migration and testing; Operationalize with SOPs and monitoring.',
  'published',
  ARRAY['Data Protection', 'Critical'],
  ARRAY['Backup', 'Storage'],
  '2021-04-01', '2022-03-31', NULL, 42
),
(
  'Internal PKI & CA Certificate Deployment',
  'internal-pki-ca-21',
  'Enable audit readiness through assessments and certificate governance.',
  'Strategic Area: Cybersecurity. Criticality: High. Delivery focus: Define requirements and target controls; Coordinate design/implementation and validation; Drive governance and operational handover.',
  'published',
  ARRAY['Cybersecurity', 'High'],
  ARRAY['PKI', 'CA'],
  '2021-04-01', '2022-03-31', NULL, 50
),

-- FY 2020-21
(
  'Disk-Based Backup Modernization',
  'disk-backup-modernization-20',
  'Modernize backup to improve recoverability (Disk-based).',
  'Strategic Area: Data Protection. Criticality: Critical. Delivery focus: Assess current state and risks; Coordinate modernization/migration and testing; Operationalize with SOPs and monitoring.',
  'published',
  ARRAY['Data Protection', 'Critical'],
  ARRAY['Disk Backup', 'StoreOnce'],
  '2020-04-01', '2021-03-31', NULL, 51
),
(
  'Network Access Control (RADIUS/802.1x)',
  'nac-radius-8021x-20',
  'Reduce attack surface with access controls (RADIUS/802.1x).',
  'Strategic Area: Cybersecurity. Criticality: Critical. Delivery focus: Define requirements and target controls; Coordinate design/implementation and validation; Drive governance and operational handover.',
  'published',
  ARRAY['Cybersecurity', 'Critical'],
  ARRAY['NAC', 'RADIUS', '802.1x'],
  '2020-04-01', '2021-03-31', NULL, 53
),
(
  'Enterprise Digital Rights Management (DRM)',
  'enterprise-drm-20',
  'Enable audit readiness with DRM.',
  'Strategic Area: Data Security. Criticality: Critical. Delivery focus: Define requirements and target controls; Coordinate design/implementation and validation; Drive governance and operational handover.',
  'published',
  ARRAY['Data Security', 'Critical'],
  ARRAY['DRM', 'Information Protection'],
  '2020-04-01', '2021-03-31', NULL, 56
),
(
  'RPA: IT Service Desk & Finance Automation',
  'rpa-service-desk-20',
  'RPA for IT Service Desk & Finance Automation.',
  'Strategic Area: Automation. Criticality: High. Delivery focus: Identify high-value use cases and requirements; Implement tooling/dashboards/bots and validate; Embed operations and continuous improvement.',
  'published',
  ARRAY['Automation', 'High'],
  ARRAY['RPA', 'UiPath'],
  '2020-04-01', '2021-03-31', NULL, 57
),
(
  'Interim Disaster Recovery Site Setup',
  'interim-dr-site-20',
  'Setup Interim DR Site.',
  'Strategic Area: BCP / DR. Criticality: Critical. Delivery focus: Assess current state and risks; Coordinate modernization/migration and testing; Operationalize with SOPs and monitoring.',
  'published',
  ARRAY['BCP', 'DR', 'Critical'],
  ARRAY['DR Site'],
  '2020-04-01', '2021-03-31', NULL, 60
),
(
  'DMZ Network Virtualization',
  'dmz-net-viol-20',
  'Strengthen boundary protections (DMZ/security zones).',
  'Strategic Area: Network Security. Criticality: High. Delivery focus: Define requirements and target controls; Coordinate design/implementation and validation; Drive governance and operational handover.',
  'published',
  ARRAY['Network Security', 'High'],
  ARRAY['DMZ', 'Virtualization'],
  '2020-04-01', '2021-03-31', NULL, 61
),

-- FY 2019-20
(
  'Zero-Impact ERP OS Migration',
  'erp-os-migration-19',
  'Migrated ERP OS with zero impact.',
  'Strategic Area: Infrastructure. Criticality: Critical. Delivery focus: Assess current state and risks; Coordinate modernization/migration and testing; Operationalize with SOPs and monitoring.',
  'published',
  ARRAY['Infrastructure', 'Critical'],
  ARRAY['ERP', 'OS Migration'],
  '2019-04-01', '2020-03-31', NULL, 62
),
(
  'Legacy Storage Platform Replacement',
  'legacy-storage-replacement-19',
  'Replacement of legacy storage platforms.',
  'Strategic Area: Infrastructure. Criticality: Critical. Delivery focus: Assess current state and risks; Coordinate modernization/migration and testing; Operationalize with SOPs and monitoring.',
  'published',
  ARRAY['Infrastructure', 'Critical'],
  ARRAY['Storage'],
  '2019-04-01', '2020-03-31', NULL, 63
),
(
  'Backup Workflow Redesign & Tool Upgrade',
  'backup-workflow-redesign-19',
  'Redesign backup workflow and upgrade tools.',
  'Strategic Area: Data Protection. Criticality: High. Delivery focus: Assess current state and risks; Coordinate modernization/migration and testing; Operationalize with SOPs and monitoring.',
  'published',
  ARRAY['Data Protection', 'High'],
  ARRAY['Backup', 'Tools'],
  '2019-04-01', '2020-03-31', NULL, 64
),
(
  'Network AAA Security Implementation',
  'network-aaa-security-19',
  'Reduce attack surface with AAA security.',
  'Strategic Area: Cybersecurity. Criticality: Critical. Delivery focus: Define requirements and target controls; Coordinate design/implementation and validation; Drive governance and operational handover.',
  'published',
  ARRAY['Cybersecurity', 'Critical'],
  ARRAY['AAA', 'Security'],
  '2019-04-01', '2020-03-31', NULL, 68
),
(
  'Greenfield Factory IT Infrastructure Design',
  'greenfield-factory-infra-19',
  'Design IT infrastructure for Greenfield Factory.',
  'Strategic Area: Infrastructure. Criticality: High. Delivery focus: Assess current state and risks; Coordinate modernization/migration and testing; Operationalize with SOPs and monitoring.',
  'published',
  ARRAY['Infrastructure', 'High'],
  ARRAY['Factory IT'],
  '2019-04-01', '2020-03-31', NULL, 71
),

-- FY 2018-19
(
  '3-Zone Security Virtualization Initiative',
  '3-zone-security-virt-18',
  'Run structured assessments/POCs to select fit-for-purpose technologies.',
  'Strategic Area: Infrastructure. Criticality: Critical. Delivery focus: Assess current state and risks; Coordinate modernization/migration and testing; Operationalize with SOPs and monitoring.',
  'published',
  ARRAY['Infrastructure', 'Critical'],
  ARRAY['Security', 'Virtualization'],
  '2018-04-01', '2019-03-31', NULL, 72
),
(
  'Border Router & Internet Gateway Upgrade',
  'border-router-upgrade-18',
  'Upgrade backbone, switching and routing.',
  'Strategic Area: Network Infra. Criticality: Critical. Delivery focus: Assess capacity and performance gaps; Plan/design upgrade and coordinate implementation; Stabilize operations and document standards.',
  'published',
  ARRAY['Network Infra', 'Critical'],
  ARRAY['Cisco', 'Routing'],
  '2018-04-01', '2019-03-31', NULL, 74
),
(
  'Microsoft RAP Security Assessment',
  'microsoft-rap-security-18',
  'Microsoft RAP Security Assessment.',
  'Strategic Area: Cybersecurity. Criticality: High. Delivery focus: Define requirements and target controls; Coordinate design/implementation and validation; Drive governance and operational handover.',
  'published',
  ARRAY['Cybersecurity', 'High'],
  ARRAY['Assessment', 'Security'],
  '2018-04-01', '2019-03-31', NULL, 78
),
(
  'Active Directory Security Audit',
  'ad-security-audit-18',
  'Active Directory Security Audit.',
  'Strategic Area: Cybersecurity. Criticality: High. Delivery focus: Define requirements and target controls; Coordinate design/implementation and validation; Drive governance and operational handover.',
  'published',
  ARRAY['Cybersecurity', 'High'],
  ARRAY['AD', 'Audit'],
  '2018-04-01', '2019-03-31', NULL, 80
),

-- FY 2017-18
(
  'High-Availability (N+1) Infrastructure Redesign',
  'ha-infra-redesign-17',
  'Rationalize and redesign infrastructure for higher availability.',
  'Strategic Area: Infrastructure. Criticality: Critical. Delivery focus: Assess current state and risks; Coordinate modernization/migration and testing; Operationalize with SOPs and monitoring.',
  'published',
  ARRAY['Infrastructure', 'Critical'],
  ARRAY['HA', 'Redesign'],
  '2017-04-01', '2018-03-31', NULL, 83
),
(
  'Active Directory Functional Level Upgrade',
  'ad-functional-upgrade-17',
  'Active Directory Functional Level Upgrade.',
  'Strategic Area: Infrastructure. Criticality: Critical. Delivery focus: Assess current state and risks; Coordinate modernization/migration and testing; Operationalize with SOPs and monitoring.',
  'published',
  ARRAY['Infrastructure', 'Critical'],
  ARRAY['AD', 'Upgrade'],
  '2017-04-01', '2018-03-31', NULL, 85
),
(
  'Centralized Surveillance Operations Center',
  'centralized-surveillance-17',
  'Centralize surveillance operations.',
  'Strategic Area: Physical Security. Criticality: High. Delivery focus: Define requirements and target controls; Coordinate design/implementation and validation; Drive governance and operational handover.',
  'published',
  ARRAY['Physical Security', 'High'],
  ARRAY['CCTV', 'Surveillance'],
  '2017-04-01', '2018-03-31', NULL, 86
)

ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, short_description = EXCLUDED.short_description, detailed_description = EXCLUDED.detailed_description, technologies = EXCLUDED.technologies, start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date, domain = EXCLUDED.domain;


-- 5. CERTIFICATIONS & ACHIEVEMENTS
INSERT INTO certifications (title, issuing_organization, issue_date, expiry_date, credential_id, credential_url, status) VALUES
('Master of Computer Applications (MCA)', 'Tripura University', '2013-06-01', NULL, NULL, NULL, 'active'),
('Bachelor of Computer Applications (BCA)', 'ICFAI University (Tripura)', '2010-06-01', NULL, NULL, NULL, 'active')
ON CONFLICT (title, issuing_organization) DO NOTHING;

INSERT INTO achievements (title, description, achievement_date, category, order_index) VALUES
('30+ RPA Bots Deployed', 'Delivered automation at scale across IT service desk and finance/reporting processes.', '2023-01-01', 'Automation', 1),
('Tableau/Power BI Implementation', 'Built analytics capability for sales, inventory, and performance reporting.', '2022-01-01', 'Analytics', 2),
('Zero-Impact ERP OS Migration', 'Successfully migrated mission-critical ERP OS with zero business impact.', '2020-01-01', 'Infrastructure', 3)
ON CONFLICT (title, achievement_date) DO NOTHING;
