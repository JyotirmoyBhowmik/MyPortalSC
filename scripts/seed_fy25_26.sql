
INSERT INTO initiatives (title, slug, program_id, fiscal_year, strategic_area, criticality, delivery_focus, image_url, status, order_index)
VALUES ('DMS SFA Transformation Programme', '89-dms-sfa-transformation-programme', '27adc24d-33c1-44b6-8f30-0c665c578ecb', '2025-26', 'Business Applications & Cloud Platforms', 'Critical', 'Anchored full 4-vendor evaluation across Ncell, Everest, DataHub, and SilverLining; Authored comprehensive Botree and Vxceed Bill of Materials (BOMs); Finalized 3-year Total Cost of Ownership (TCO) with CISO-ready security architecture submission', '/api/assets?path=projects%2Fimages%2Fecommerce-dashboard.jpg', 'published', 89)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    program_id = EXCLUDED.program_id,
    fiscal_year = EXCLUDED.fiscal_year,
    strategic_area = EXCLUDED.strategic_area,
    criticality = EXCLUDED.criticality,
    delivery_focus = EXCLUDED.delivery_focus,
    image_url = EXCLUDED.image_url,
    status = EXCLUDED.status,
    order_index = EXCLUDED.order_index;


INSERT INTO initiatives (title, slug, program_id, fiscal_year, strategic_area, criticality, delivery_focus, image_url, status, order_index)
VALUES ('SAP DR Migration from TATA to Microsoft Azure', '90-sap-dr-migration-from-tata-to-microsoft-azure', 'acfbd8cd-0ac2-452c-933e-a35f3ed6c679', '2025-26', 'Disaster Recovery & Cloud Architecture', 'Critical', 'Drove complete vendor technical and commercial evaluation cycle with Cloud4C, MSR-IT, and ITSS; Formulated SNPL DR Migration Business Case PPT for SAP/HRMS DR-on-Azure; Validated Recovery Point Objective (RPO) and Recovery Time Objective (RTO) architectural models', '/api/assets?path=projects%2Fimages%2Fdr-geo-redundancy-21.jpg', 'published', 90)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    program_id = EXCLUDED.program_id,
    fiscal_year = EXCLUDED.fiscal_year,
    strategic_area = EXCLUDED.strategic_area,
    criticality = EXCLUDED.criticality,
    delivery_focus = EXCLUDED.delivery_focus,
    image_url = EXCLUDED.image_url,
    status = EXCLUDED.status,
    order_index = EXCLUDED.order_index;


INSERT INTO initiatives (title, slug, program_id, fiscal_year, strategic_area, criticality, delivery_focus, image_url, status, order_index)
VALUES ('Simara Factory Secondary OT DC & Claroty CTD Security', '91-simara-factory-secondary-ot-dc-claroty-ctd-security', 'b2e29630-772d-4c94-a6de-c78c403dd297', '2025-26', 'OT / Industrial Cybersecurity', 'Critical', 'Architected Secondary OT Data Centre at Simara manufacturing plant; Formulated and issued comprehensive RFP covering NGTP Next-Gen Threat Prevention firewalls and Claroty Continuous Threat Detection (CTD); Coordinated alignment with ITC corporate cybersecurity framework', '/api/assets?path=projects%2Fimages%2Fot-security-roadmap-23.jpg', 'published', 91)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    program_id = EXCLUDED.program_id,
    fiscal_year = EXCLUDED.fiscal_year,
    strategic_area = EXCLUDED.strategic_area,
    criticality = EXCLUDED.criticality,
    delivery_focus = EXCLUDED.delivery_focus,
    image_url = EXCLUDED.image_url,
    status = EXCLUDED.status,
    order_index = EXCLUDED.order_index;


INSERT INTO initiatives (title, slug, program_id, fiscal_year, strategic_area, criticality, delivery_focus, image_url, status, order_index)
VALUES ('Industrial Energy Monitoring System (EMS) & Utility Management', '92-industrial-energy-monitoring-system-ems-utility-management', 'b2e29630-772d-4c94-a6de-c78c403dd297', '2025-26', 'OT & Sustainability Telemetry', 'High', 'Formulated and issued enterprise RFP for Utility Management and Factory Energy Monitoring Solution; Established automated sensor data acquisition protocols with ITC central engineering; Enabled real-time telemetry for factory sustainability and energy compliance', '/api/assets?path=projects%2Fimages%2Fenergy-compliance-blueprint-23.jpg', 'published', 92)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    program_id = EXCLUDED.program_id,
    fiscal_year = EXCLUDED.fiscal_year,
    strategic_area = EXCLUDED.strategic_area,
    criticality = EXCLUDED.criticality,
    delivery_focus = EXCLUDED.delivery_focus,
    image_url = EXCLUDED.image_url,
    status = EXCLUDED.status,
    order_index = EXCLUDED.order_index;


INSERT INTO initiatives (title, slug, program_id, fiscal_year, strategic_area, criticality, delivery_focus, image_url, status, order_index)
VALUES ('Microsoft & VMware Enterprise Mega-Renewal & Virtualization Strategy', '93-microsoft-vmware-enterprise-mega-renewal-virtualization-strategy', 'acfbd8cd-0ac2-452c-933e-a35f3ed6c679', '2025-26', 'Enterprise Licensing & Infrastructure Resilience', 'High', 'Executed enterprise mega-renewal covering 100 on-premise and hosted servers; Successfully closed Microsoft Unified Support to Sonata migration; Delivered comprehensive VMware-to-Nutanix HCI alternative study; Renewed M365 260 Business Standard + 72 BP licenses via CSP for SNPL and SNVPL', '/api/assets?path=projects%2Fimages%2Ferp-server-virt-22.jpg', 'published', 93)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    program_id = EXCLUDED.program_id,
    fiscal_year = EXCLUDED.fiscal_year,
    strategic_area = EXCLUDED.strategic_area,
    criticality = EXCLUDED.criticality,
    delivery_focus = EXCLUDED.delivery_focus,
    image_url = EXCLUDED.image_url,
    status = EXCLUDED.status,
    order_index = EXCLUDED.order_index;


INSERT INTO initiatives (title, slug, program_id, fiscal_year, strategic_area, criticality, delivery_focus, image_url, status, order_index)
VALUES ('SAP ERP EHP Upgrade & Production Rollout', '94-sap-erp-ehp-upgrade-production-rollout', '27adc24d-33c1-44b6-8f30-0c665c578ecb', '2025-26', 'Core Enterprise ERP', 'Critical', 'Initiated and provisioned isolated RP9 test server; Finalized technical migration architecture and project cutover plan; Approved go-ahead for SAP EHP development system upgrade; Successfully executed production system transition with zero business disruption', '/api/assets?path=projects%2Fimages%2Ferp-landscape-virt-21.jpg', 'published', 94)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    program_id = EXCLUDED.program_id,
    fiscal_year = EXCLUDED.fiscal_year,
    strategic_area = EXCLUDED.strategic_area,
    criticality = EXCLUDED.criticality,
    delivery_focus = EXCLUDED.delivery_focus,
    image_url = EXCLUDED.image_url,
    status = EXCLUDED.status,
    order_index = EXCLUDED.order_index;


INSERT INTO initiatives (title, slug, program_id, fiscal_year, strategic_area, criticality, delivery_focus, image_url, status, order_index)
VALUES ('Enterprise AI Strategy & Copilot Studio Deployment', '95-enterprise-ai-strategy-copilot-studio-deployment', '1a0da8bb-a556-4fed-a68c-19d34000d4f2', '2025-26', 'Artificial Intelligence & Cognitive Automation', 'High', 'Authored Enterprise AI Implementation Strategy for Manufacturing; Formulated executive LLM proposal for Managing Director, VPs, and Senior Leadership; Introduced Microsoft Copilot; Drove Microsoft Sentinel SOC POC; Executed Enterprise Search PoC on Azure AI Copilot Studio', '/api/assets?path=projects%2Fimages%2Ftask-management-app.jpg', 'published', 95)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    program_id = EXCLUDED.program_id,
    fiscal_year = EXCLUDED.fiscal_year,
    strategic_area = EXCLUDED.strategic_area,
    criticality = EXCLUDED.criticality,
    delivery_focus = EXCLUDED.delivery_focus,
    image_url = EXCLUDED.image_url,
    status = EXCLUDED.status,
    order_index = EXCLUDED.order_index;


INSERT INTO initiatives (title, slug, program_id, fiscal_year, strategic_area, criticality, delivery_focus, image_url, status, order_index)
VALUES ('Datacenter Physical Infrastructure Upgrade & Lifecycle Assessment', '96-datacenter-physical-infrastructure-upgrade-lifecycle-assessment', 'acfbd8cd-0ac2-452c-933e-a35f3ed6c679', '2025-26', 'Data Center Architecture & Capacity Planning', 'High', 'Closed DC Physical Infrastructure Upgrade consultancy validation; Delivered comprehensive SNPL DC Assessment covering server, storage, OS lifecycle, clustering, and High Availability (HA) architecture; Optimized power, cooling, and rack footprint', '/api/assets?path=projects%2Fimages%2Fhigh-density-fiber-hub-24.jpg', 'published', 96)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    program_id = EXCLUDED.program_id,
    fiscal_year = EXCLUDED.fiscal_year,
    strategic_area = EXCLUDED.strategic_area,
    criticality = EXCLUDED.criticality,
    delivery_focus = EXCLUDED.delivery_focus,
    image_url = EXCLUDED.image_url,
    status = EXCLUDED.status,
    order_index = EXCLUDED.order_index;


INSERT INTO initiatives (title, slug, program_id, fiscal_year, strategic_area, criticality, delivery_focus, image_url, status, order_index)
VALUES ('SNPL Knowledge Bites Digital Platform (kb.snpl.com.np)', '97-snpl-knowledge-bites-digital-platform-kb-snpl-com-np', '795d3ac9-7a09-4ac8-bfba-6524af4a7675', '2025-26', 'Digital Workplace & Knowledge Management', 'Medium', 'Designed, built, and launched internal corporate knowledge portal at kb.snpl.com.np; Implemented dual public-view and administrative interfaces; Centralized IT SOPs, troubleshooting guides, and knowledge transfer artifacts', '/api/assets?path=projects%2Fimages%2Fweb-asset-cloud-migration-23.jpg', 'published', 97)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    program_id = EXCLUDED.program_id,
    fiscal_year = EXCLUDED.fiscal_year,
    strategic_area = EXCLUDED.strategic_area,
    criticality = EXCLUDED.criticality,
    delivery_focus = EXCLUDED.delivery_focus,
    image_url = EXCLUDED.image_url,
    status = EXCLUDED.status,
    order_index = EXCLUDED.order_index;


INSERT INTO initiatives (title, slug, program_id, fiscal_year, strategic_area, criticality, delivery_focus, image_url, status, order_index)
VALUES ('Executive Boardroom AV Modernization & Horion Mirroring Redundancy', '98-executive-boardroom-av-modernization-horion-mirroring-redundancy', '91e7597a-4cf2-4ead-96ed-a9aae0594135', '2025-26', 'Executive Collaboration & AV Infrastructure', 'Medium', 'Evaluated commercial proposals through Multisys; Replaced legacy display units with interactive Smart Board TV solutions; Engineered wireless Horion screen mirroring device redundancy across Old and New executive buildings', '/api/assets?path=projects%2Fimages%2Ftask-management-app.jpg', 'published', 98)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    program_id = EXCLUDED.program_id,
    fiscal_year = EXCLUDED.fiscal_year,
    strategic_area = EXCLUDED.strategic_area,
    criticality = EXCLUDED.criticality,
    delivery_focus = EXCLUDED.delivery_focus,
    image_url = EXCLUDED.image_url,
    status = EXCLUDED.status,
    order_index = EXCLUDED.order_index;


INSERT INTO initiatives (title, slug, program_id, fiscal_year, strategic_area, criticality, delivery_focus, image_url, status, order_index)
VALUES ('Automated Network Patching Pipeline (Ansible Semaphore)', '99-automated-network-patching-pipeline-ansible-semaphore', 'cef5ce7c-28de-4dc8-a0bf-14c13f81050b', '2025-26', 'Network Automation & DevOps', 'Medium', 'Engineered centralized automated network configuration and firmware patching pipeline via Ansible Semaphore; Automated Change Requests (CR) for factory and warehouse switches and routers; Eliminated manual patching overhead and configuration drift', '/api/assets?path=projects%2Fimages%2Fcore-switch-replacement-24.jpg', 'published', 99)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    program_id = EXCLUDED.program_id,
    fiscal_year = EXCLUDED.fiscal_year,
    strategic_area = EXCLUDED.strategic_area,
    criticality = EXCLUDED.criticality,
    delivery_focus = EXCLUDED.delivery_focus,
    image_url = EXCLUDED.image_url,
    status = EXCLUDED.status,
    order_index = EXCLUDED.order_index;


INSERT INTO initiatives (title, slug, program_id, fiscal_year, strategic_area, criticality, delivery_focus, image_url, status, order_index)
VALUES ('Core Storage & Backup Infrastructure Critical Upgrades', '100-core-storage-backup-infrastructure-critical-upgrades', 'acfbd8cd-0ac2-452c-933e-a35f3ed6c679', '2025-26', 'SAN & Backup Resilience', 'High', 'Upgraded 4 Cisco SAN switches to v9.x firmware non-disruptively with documented rollback; Applied critical HPE 3PAR Virtual Storage Processor (VSP) patch with zero downtime; Executed HPE StoreOnce backup appliance firmware upgrades within maintenance windows', '/api/assets?path=projects%2Fimages%2Fdr-geo-redundancy-21.jpg', 'published', 100)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    program_id = EXCLUDED.program_id,
    fiscal_year = EXCLUDED.fiscal_year,
    strategic_area = EXCLUDED.strategic_area,
    criticality = EXCLUDED.criticality,
    delivery_focus = EXCLUDED.delivery_focus,
    image_url = EXCLUDED.image_url,
    status = EXCLUDED.status,
    order_index = EXCLUDED.order_index;


INSERT INTO initiatives (title, slug, program_id, fiscal_year, strategic_area, criticality, delivery_focus, image_url, status, order_index)
VALUES ('IT Policy 2.0 & Information Management (IM) Policy 2.0 Adoption', '101-it-policy-2-0-information-management-im-policy-2-0-adoption', '6eeb5116-29f3-4353-ae38-89296fa321a9', '2025-26', 'Governance, Risk & Compliance (GRC)', 'High', 'Anchored IT Policy 2.0 modernization aligned with ITC Hotels corporate template; Drove full Group adoption of Information Management Policy 2.0; Designed SOP portal on SharePoint with Information Rights Management (IRM) controls; Implemented mandatory shift logging discipline', '/api/assets?path=projects%2Fimages%2Fot-security-roadmap-23.jpg', 'published', 101)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    program_id = EXCLUDED.program_id,
    fiscal_year = EXCLUDED.fiscal_year,
    strategic_area = EXCLUDED.strategic_area,
    criticality = EXCLUDED.criticality,
    delivery_focus = EXCLUDED.delivery_focus,
    image_url = EXCLUDED.image_url,
    status = EXCLUDED.status,
    order_index = EXCLUDED.order_index;


INSERT INTO initiatives (title, slug, program_id, fiscal_year, strategic_area, criticality, delivery_focus, image_url, status, order_index)
VALUES ('Corporate Internal Audit Defense (74 Artifacts & 16-Point Memo)', '102-corporate-internal-audit-defense-74-artifacts-16-point-memo', '6eeb5116-29f3-4353-ae38-89296fa321a9', '2025-26', 'Audit Defense & IT Governance', 'Critical', 'Coordinated 74 audit artifacts with ITC central audit team; Authored comprehensive technical memo covering 16 audit points (successfully defended 10 disagreed observations with rock-solid evidence, acknowledged/resolved 3); Closed Corporate Internal Audit DAP 07 and DAP 13 points', '/api/assets?path=projects%2Fimages%2Ffinancial-mis-dashboard.jpg', 'published', 102)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    program_id = EXCLUDED.program_id,
    fiscal_year = EXCLUDED.fiscal_year,
    strategic_area = EXCLUDED.strategic_area,
    criticality = EXCLUDED.criticality,
    delivery_focus = EXCLUDED.delivery_focus,
    image_url = EXCLUDED.image_url,
    status = EXCLUDED.status,
    order_index = EXCLUDED.order_index;


INSERT INTO initiatives (title, slug, program_id, fiscal_year, strategic_area, criticality, delivery_focus, image_url, status, order_index)
VALUES ('Enterprise Endpoint Modernization & Windows 11 Fleet Transition', '103-enterprise-endpoint-modernization-windows-11-fleet-transition', 'ffbce338-a150-482e-a652-8fb679e72378', '2025-26', 'End-User Computing & Lifecycle Management', 'Medium', 'Optimized and upgraded 135 desktops and 42 laptops for Windows 11, extending device lifecycle; Negotiated 21-desktop commercial package (15 SNPL, 6 SNVL); Delivered 6-desktop CapEx safety replacement; Standardized Dell Pro Tower QCT1250 across business units; Authored MD MacBook Pro M5 CapEx note', '/api/assets?path=projects%2Fimages%2Ftask-management-app.jpg', 'published', 103)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    program_id = EXCLUDED.program_id,
    fiscal_year = EXCLUDED.fiscal_year,
    strategic_area = EXCLUDED.strategic_area,
    criticality = EXCLUDED.criticality,
    delivery_focus = EXCLUDED.delivery_focus,
    image_url = EXCLUDED.image_url,
    status = EXCLUDED.status,
    order_index = EXCLUDED.order_index;


INSERT INTO initiatives (title, slug, program_id, fiscal_year, strategic_area, criticality, delivery_focus, image_url, status, order_index)
VALUES ('Enterprise WAN Cost Optimization & IPLC Modernization', '104-enterprise-wan-cost-optimization-iplc-modernization', 'cef5ce7c-28de-4dc8-a0bf-14c13f81050b', '2025-26', 'Telecom & WAN Optimization', 'High', 'Managed MPLS/IPLC Subisu renewal before contract expiry; Renegotiated Subisu TATA 4 Mbps GDE link (INR OTC USD 1,000, MRC USD 1,300) to Ncell (OTC NPR 84K / $550, MRC NPR 68K / $440); Secured substantial recurring monthly OpEx reductions while boosting bandwidth and uptime SLA', '/api/assets?path=projects%2Fimages%2Fcore-switch-replacement-24.jpg', 'published', 104)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    program_id = EXCLUDED.program_id,
    fiscal_year = EXCLUDED.fiscal_year,
    strategic_area = EXCLUDED.strategic_area,
    criticality = EXCLUDED.criticality,
    delivery_focus = EXCLUDED.delivery_focus,
    image_url = EXCLUDED.image_url,
    status = EXCLUDED.status,
    order_index = EXCLUDED.order_index;


INSERT INTO initiatives (title, slug, program_id, fiscal_year, strategic_area, criticality, delivery_focus, image_url, status, order_index)
VALUES ('OT Table-Top Exercise (TTX) & Standalone ICS Support Governance', '105-ot-table-top-exercise-ttx-standalone-ics-support-governance', 'b2e29630-772d-4c94-a6de-c78c403dd297', '2025-26', 'Industrial Control Systems Security', 'High', 'Formulated and executed OT Incident Response Table-Top Exercise (TTX); Established secure remote vendor support governance framework for standalone Industrial Control Systems (ICS) with ITC corporate; Cleared long-standing OT vulnerability remediation items', '/api/assets?path=projects%2Fimages%2Fot-security-roadmap-23.jpg', 'published', 105)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    program_id = EXCLUDED.program_id,
    fiscal_year = EXCLUDED.fiscal_year,
    strategic_area = EXCLUDED.strategic_area,
    criticality = EXCLUDED.criticality,
    delivery_focus = EXCLUDED.delivery_focus,
    image_url = EXCLUDED.image_url,
    status = EXCLUDED.status,
    order_index = EXCLUDED.order_index;


INSERT INTO initiatives (title, slug, program_id, fiscal_year, strategic_area, criticality, delivery_focus, image_url, status, order_index)
VALUES ('SNPL × Shopify Enterprise E-Commerce IT Integration', '106-snpl-shopify-enterprise-e-commerce-it-integration', '27adc24d-33c1-44b6-8f30-0c665c578ecb', '2025-26', 'E-Commerce & Digital Channels', 'High', 'Delivered end-to-end IT architecture and secure middleware integration between SNPL corporate enterprise backends and Shopify e-commerce digital store; Configured secure payment gateway pipelines and inventory synchronization channels', '/api/assets?path=projects%2Fimages%2Fecommerce-dashboard.jpg', 'published', 106)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    program_id = EXCLUDED.program_id,
    fiscal_year = EXCLUDED.fiscal_year,
    strategic_area = EXCLUDED.strategic_area,
    criticality = EXCLUDED.criticality,
    delivery_focus = EXCLUDED.delivery_focus,
    image_url = EXCLUDED.image_url,
    status = EXCLUDED.status,
    order_index = EXCLUDED.order_index;


INSERT INTO initiatives (title, slug, program_id, fiscal_year, strategic_area, criticality, delivery_focus, image_url, status, order_index)
VALUES ('Server Health Monitoring Dashboard & Automated Telemetry', '107-server-health-monitoring-dashboard-automated-telemetry', '1a0da8bb-a556-4fed-a68c-19d34000d4f2', '2025-26', 'Observability & Automated Alerting', 'Medium', 'Developed automated enterprise server health monitoring dashboard; Implemented daily automated threshold triggers for RAM utilization, disk capacity, and uptime alerts across Windows and Linux server fleets; Prevented resource saturation incidents', '/api/assets?path=projects%2Fimages%2Fzabbix-observability-23.jpg', 'published', 107)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    program_id = EXCLUDED.program_id,
    fiscal_year = EXCLUDED.fiscal_year,
    strategic_area = EXCLUDED.strategic_area,
    criticality = EXCLUDED.criticality,
    delivery_focus = EXCLUDED.delivery_focus,
    image_url = EXCLUDED.image_url,
    status = EXCLUDED.status,
    order_index = EXCLUDED.order_index;


INSERT INTO initiatives (title, slug, program_id, fiscal_year, strategic_area, criticality, delivery_focus, image_url, status, order_index)
VALUES ('Simara Factory Digital EHS Application Enablement', '108-simara-factory-digital-ehs-application-enablement', '27adc24d-33c1-44b6-8f30-0c665c578ecb', '2025-26', 'Factory Digitization & Operational Excellence', 'Medium', 'Provided complete IT infrastructure, network segmentation, and secure wireless endpoint provisioning for the digital Environment, Health & Safety (EHS) software rollout at Simara manufacturing factory; Automated factory safety reporting workflows', '/api/assets?path=projects%2Fimages%2Futility-iot-monitoring-22.jpg', 'published', 108)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    program_id = EXCLUDED.program_id,
    fiscal_year = EXCLUDED.fiscal_year,
    strategic_area = EXCLUDED.strategic_area,
    criticality = EXCLUDED.criticality,
    delivery_focus = EXCLUDED.delivery_focus,
    image_url = EXCLUDED.image_url,
    status = EXCLUDED.status,
    order_index = EXCLUDED.order_index;


INSERT INTO projects (title, slug, short_description, detailed_description, status, domain, technologies, start_date, end_date, featured_image_url, order_index, challenge, approach, architecture_notes, outcome, key_metrics)
VALUES (
    'DMS SFA (Distributor Management & Sales Automation) Programme',
    'dms-sfa-transformation-25',
    'End-to-end IT architecture and 4-vendor evaluation for distributor management and sales force automation.',
    'Led and anchored the entire IT infrastructure and application architecture for the national Distributor Management System (DMS) and Sales Force Automation (SFA) programme. Drove rigorous evaluation across 4 top cloud/hosting providers (Ncell, Everest, DataHub, SilverLining), authored comprehensive BOMs for Botree and Vxceed platforms, and formulated the CISO-ready 3-year TCO submission.',
    'published',
    ARRAY['Enterprise Applications','Cloud Architecture','Supply Chain'],
    ARRAY['Botree DMS','Vxceed SFA','Private Cloud','CISO Framework','BOM Modeling'],
    '2025-04-01'::date,
    '2026-03-31'::date,
    '/api/assets?path=projects%2Fimages%2Fecommerce-dashboard.jpg',
    57,
    'Fragmented secondary sales tracking, multi-vendor cloud hosting trade-offs, and stringent corporate cybersecurity governance requirements across external sales channels.',
    'Built a 4-vendor technical-commercial comparative matrix, modeled multi-tier infrastructure BOMs, and aligned security controls directly with CISO requirements.',
    'Hybrid enterprise architecture bridging on-premise ERP backends with secure distributor-facing cloud hosting and API gateways.',
    'Successfully finalized 3-year TCO, secured CISO approval, and established scalable infrastructure for countrywide distributor sales operations.',
    '{"vendorsEvaluated":4,"tcoHorizon":"3 Years","governanceSignoff":"CISO Approved","ecosystemReach":"National Distribution"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    detailed_description = EXCLUDED.detailed_description,
    status = EXCLUDED.status,
    domain = EXCLUDED.domain,
    technologies = EXCLUDED.technologies,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    featured_image_url = EXCLUDED.featured_image_url,
    order_index = EXCLUDED.order_index,
    challenge = EXCLUDED.challenge,
    approach = EXCLUDED.approach,
    architecture_notes = EXCLUDED.architecture_notes,
    outcome = EXCLUDED.outcome,
    key_metrics = EXCLUDED.key_metrics;


INSERT INTO projects (title, slug, short_description, detailed_description, status, domain, technologies, start_date, end_date, featured_image_url, order_index, challenge, approach, architecture_notes, outcome, key_metrics)
VALUES (
    'SAP Disaster Recovery (DR) Migration to Microsoft Azure',
    'sap-azure-dr-migration-25',
    'Strategic migration of mission-critical SAP and HRMS disaster recovery infrastructure from TATA to Microsoft Azure.',
    'Drove the end-to-end technical evaluation and business case formulation for migrating Surya Nepal’s mission-critical SAP and HRMS Disaster Recovery (DR) landscape from TATA communications hosting to Microsoft Azure. Partnered with Cloud4C, MSR-IT, and ITSS to validate Azure Landing Zones, cost optimization models, and near-zero RPO/RTO resilience.',
    'published',
    ARRAY['Disaster Recovery','Cloud Infrastructure','Enterprise ERP'],
    ARRAY['SAP ERP','Microsoft Azure','Cloud4C','Azure Site Recovery','FinOps'],
    '2025-05-01'::date,
    '2026-03-31'::date,
    '/api/assets?path=projects%2Fimages%2Fdr-geo-redundancy-21.jpg',
    58,
    'Legacy third-party DR hosting limitations, escalating operational expenditure, and the necessity for cloud-native elasticity for SAP HANA and HRMS workloads.',
    'Formulated a comprehensive business case presentation for senior leadership and board sign-off, conducted deep-dive partner workshops, and architected automated Azure DR replication.',
    'Azure Landing Zone for SAP with geo-redundant storage, automated failover runbooks, and encrypted ExpressRoute hybrid interconnects.',
    'Approved business case for Azure DR rollout, establishing modernized geo-resilience and optimized cloud run-rate for enterprise systems.',
    '{"drPlatform":"Microsoft Azure","rpoTarget":"< 15 Minutes","rtoTarget":"< 4 Hours","workloadsProtected":"SAP & HRMS"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    detailed_description = EXCLUDED.detailed_description,
    status = EXCLUDED.status,
    domain = EXCLUDED.domain,
    technologies = EXCLUDED.technologies,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    featured_image_url = EXCLUDED.featured_image_url,
    order_index = EXCLUDED.order_index,
    challenge = EXCLUDED.challenge,
    approach = EXCLUDED.approach,
    architecture_notes = EXCLUDED.architecture_notes,
    outcome = EXCLUDED.outcome,
    key_metrics = EXCLUDED.key_metrics;


INSERT INTO projects (title, slug, short_description, detailed_description, status, domain, technologies, start_date, end_date, featured_image_url, order_index, challenge, approach, architecture_notes, outcome, key_metrics)
VALUES (
    'Simara Factory Secondary OT Data Centre & Claroty CTD Security',
    'simara-secondary-ot-dc-25',
    'Secondary OT Data Centre design and Claroty Continuous Threat Detection (CTD) implementation for manufacturing resilience.',
    'Architected and led the engineering of a Secondary OT Data Centre at the Simara manufacturing factory. Formulated and issued the comprehensive RFP covering Next-Gen Threat Prevention (NGTP) firewalls and Claroty Continuous Threat Detection (CTD) in direct coordination with ITC Corporate Cybersecurity.',
    'published',
    ARRAY['OT Security','SCADA / ICS','Data Center Infrastructure'],
    ARRAY['Claroty CTD','NGTP Firewalls','IEC 62443','OT Microsegmentation','Purdue Model'],
    '2025-06-01'::date,
    '2026-03-31'::date,
    '/api/assets?path=projects%2Fimages%2Fot-security-roadmap-23.jpg',
    59,
    'Protecting continuous manufacturing operations from lateral cyber threats, ensuring hardware redundancy for industrial control systems, and complying with global IEC 62443 standards.',
    'Designed a physically separated and resilient secondary OT datacenter room, integrated passive network anomaly detection, and deployed zone-based firewalls.',
    'Purdue Level 2/3 industrial segmentation with dual-homed OT firewalls, redundant UPS/cooling, and Claroty passive sensor spans.',
    'Issued turnkey RFP, validated commercial bids, and established high-availability OT operations for the primary manufacturing site.',
    '{"datacenterTier":"Secondary OT DC","standardCompliance":"IEC 62443","assetVisibility":"100% ICS Network","threatDetection":"Claroty CTD"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    detailed_description = EXCLUDED.detailed_description,
    status = EXCLUDED.status,
    domain = EXCLUDED.domain,
    technologies = EXCLUDED.technologies,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    featured_image_url = EXCLUDED.featured_image_url,
    order_index = EXCLUDED.order_index,
    challenge = EXCLUDED.challenge,
    approach = EXCLUDED.approach,
    architecture_notes = EXCLUDED.architecture_notes,
    outcome = EXCLUDED.outcome,
    key_metrics = EXCLUDED.key_metrics;


INSERT INTO projects (title, slug, short_description, detailed_description, status, domain, technologies, start_date, end_date, featured_image_url, order_index, challenge, approach, architecture_notes, outcome, key_metrics)
VALUES (
    'Industrial Energy Monitoring System (EMS) & Utility Telemetry',
    'industrial-ems-utility-25',
    'Factory-wide IoT telemetry and automated energy accounting infrastructure across manufacturing units.',
    'Formulated and issued the enterprise RFP for a comprehensive Factory Energy Monitoring System (EMS) and Utility Management Solution in coordination with ITC central engineering teams. Designed IoT sensor networking, edge gateway integration, and automated utility analytics for plant power, steam, water, and fuel consumption.',
    'published',
    ARRAY['Industrial IoT','Sustainability','OT Modernization'],
    ARRAY['Industrial IoT Gateways','Modbus / OPC-UA','Telemetry Dashboards','Energy Analytics'],
    '2025-07-01'::date,
    '2026-03-31'::date,
    '/api/assets?path=projects%2Fimages%2Fenergy-compliance-blueprint-23.jpg',
    60,
    'Manual energy meter logging, lack of sub-meter level granular consumption visibility, and corporate mandates for carbon footprint accounting.',
    'Architected an automated digital telemetry backbone connecting multi-function meters across production lines to an edge aggregation platform.',
    'Secure RS-485 to Ethernet IP gateways, segregated OT utility VLANs, and scheduled aggregation into central management dashboards.',
    'Closed RFP cycle with approved technical vendors, establishing automated energy monitoring and real-time efficiency metrics.',
    '{"utilityCoverage":"Power, Steam, Fuel","dataAcquisition":"Automated Real-time","complianceLevel":"ITC Corporate ESG","auditReadiness":"100% Digital Telemetry"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    detailed_description = EXCLUDED.detailed_description,
    status = EXCLUDED.status,
    domain = EXCLUDED.domain,
    technologies = EXCLUDED.technologies,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    featured_image_url = EXCLUDED.featured_image_url,
    order_index = EXCLUDED.order_index,
    challenge = EXCLUDED.challenge,
    approach = EXCLUDED.approach,
    architecture_notes = EXCLUDED.architecture_notes,
    outcome = EXCLUDED.outcome,
    key_metrics = EXCLUDED.key_metrics;


INSERT INTO projects (title, slug, short_description, detailed_description, status, domain, technologies, start_date, end_date, featured_image_url, order_index, challenge, approach, architecture_notes, outcome, key_metrics)
VALUES (
    'Enterprise AI Strategy & Copilot Studio Deployment',
    'enterprise-ai-copilot-manufacturing-25',
    'Strategic generative AI blueprint, Microsoft Copilot introduction, and Azure AI Enterprise Search PoCs.',
    'Authored the official Enterprise AI Implementation Strategy for Manufacturing and formulated an executive LLM deployment proposal for the Managing Director, Vice Presidents, and Senior Leadership. Drove hands-on innovation including Microsoft Copilot introduction, Microsoft Sentinel SOC AI capabilities, and an Enterprise Search PoC built on Azure AI Copilot Studio.',
    'published',
    ARRAY['Artificial Intelligence','Digital Workplace','Cognitive Automation'],
    ARRAY['Microsoft Copilot','Azure AI Foundry','Copilot Studio','Microsoft Sentinel','RAG Architecture'],
    '2025-06-01'::date,
    '2026-03-31'::date,
    '/api/assets?path=projects%2Fimages%2Ftask-management-app.jpg',
    61,
    'Bridging executive expectations with responsible AI data governance, information rights security, and practical business productivity uplift.',
    'Conducted comparative evaluations of enterprise AI frameworks (NotebookLM, Claude, Microsoft AI), established data security boundaries, and built functional prototypes.',
    'Enterprise Search architecture with Retrieval-Augmented Generation (RAG) over corporate SharePoint knowledge bases using Azure AI Copilot Studio.',
    'Presented executive AI roadmap, deployed Copilot licenses to leadership, and proved search acceleration across enterprise policies.',
    '{"executiveBriefing":"MD & VPs Delivered","pocsExecuted":2,"searchAcceleration":"70% Faster Discovery","governanceModel":"Responsible AI"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    detailed_description = EXCLUDED.detailed_description,
    status = EXCLUDED.status,
    domain = EXCLUDED.domain,
    technologies = EXCLUDED.technologies,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    featured_image_url = EXCLUDED.featured_image_url,
    order_index = EXCLUDED.order_index,
    challenge = EXCLUDED.challenge,
    approach = EXCLUDED.approach,
    architecture_notes = EXCLUDED.architecture_notes,
    outcome = EXCLUDED.outcome,
    key_metrics = EXCLUDED.key_metrics;


INSERT INTO projects (title, slug, short_description, detailed_description, status, domain, technologies, start_date, end_date, featured_image_url, order_index, challenge, approach, architecture_notes, outcome, key_metrics)
VALUES (
    'Datacenter Physical Infrastructure Upgrade & Lifecycle Assessment',
    'dc-physical-infrastructure-upgrade-25',
    'Comprehensive physical DC modernization consultancy and complete compute, storage, and cluster HA lifecycle audit.',
    'Successfully validated and closed the Datacenter Physical Infrastructure Upgrade consultancy for Surya Nepal Head Office and branch facilities. Delivered an exhaustive SNPL DC Assessment analyzing server, storage, and operating system lifecycles, power efficiency, cooling dynamics, and high-availability virtualization cluster health.',
    'published',
    ARRAY['Data Center Infrastructure','Capacity Planning','Hardware Lifecycle'],
    ARRAY['Server Clustering','Precision Air Cooling','Modular UPS','Storage Lifecycle','HA Design'],
    '2025-04-01'::date,
    '2026-01-31'::date,
    '/api/assets?path=projects%2Fimages%2Fhigh-density-fiber-hub-24.jpg',
    62,
    'Aging datacenter physical components, escalating thermal densities, and the requirement to establish a 5-year hardware roadmap.',
    'Engaged specialized external DC consultants, coordinated site surveys, and synthesized technical data into a holistic executive modernization blueprint.',
    'High-availability N+1 UPS distribution, hot-aisle containment design, and consolidated multi-node virtualization hosts.',
    'Delivered finalized DC Assessment report with prioritized investment phases, ensuring zero unbudgeted hardware obsolescence.',
    '{"serversAudited":"100+ Nodes","p1CapacityIncidents":0,"redundancyArchitecture":"N+1 Resilient","planningHorizon":"5-Year Lifecycle"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    detailed_description = EXCLUDED.detailed_description,
    status = EXCLUDED.status,
    domain = EXCLUDED.domain,
    technologies = EXCLUDED.technologies,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    featured_image_url = EXCLUDED.featured_image_url,
    order_index = EXCLUDED.order_index,
    challenge = EXCLUDED.challenge,
    approach = EXCLUDED.approach,
    architecture_notes = EXCLUDED.architecture_notes,
    outcome = EXCLUDED.outcome,
    key_metrics = EXCLUDED.key_metrics;


INSERT INTO projects (title, slug, short_description, detailed_description, status, domain, technologies, start_date, end_date, featured_image_url, order_index, challenge, approach, architecture_notes, outcome, key_metrics)
VALUES (
    'Enterprise Microsoft & VMware Infrastructure Mega-Renewal',
    'microsoft-vmware-mega-renewal-25',
    'Multi-year licensing mega-renewal covering 100 enterprise servers, Sonata support migration, and VMware-to-Nutanix HCI study.',
    'Spearheaded the enterprise-scale software licensing mega-renewal spanning 100+ servers across SNPL and SNVPL. Successfully negotiated and closed the migration of Microsoft Unified Support to Sonata, conducted a comprehensive VMware-to-Nutanix Hyperconverged Infrastructure (HCI) alternative study, and closed M365 CSP renewal of 260 Business Standard + 72 BP licenses.',
    'published',
    ARRAY['IT Asset Management','Enterprise Licensing','Virtualization'],
    ARRAY['VMware vSphere','Nutanix HCI','Microsoft 365 CSP','Sonata Support','License Governance'],
    '2025-06-01'::date,
    '2026-03-31'::date,
    '/api/assets?path=projects%2Fimages%2Ferp-server-virt-22.jpg',
    63,
    'Broadcom licensing cost escalations following the VMware acquisition, enterprise support transitions, and strict licensing renewal deadlines.',
    'Formulated a multi-vendor commercial alternative model comparing VMware renewals against Nutanix HCI migrations, and leveraged CSP channels for maximum discount.',
    'Optimized core-based compute licensing models across cluster hosts with unified enterprise support SLA.',
    'Completed all contract renewals with zero days delay, achieved cost predictability through 2027, and secured tier-1 escalation pathways.',
    '{"serversLicensed":"100+ Servers","renewalDelay":"0 Days Delay","coverageTerm":"Extended to March 2027","supportTier":"Unified SLA"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    detailed_description = EXCLUDED.detailed_description,
    status = EXCLUDED.status,
    domain = EXCLUDED.domain,
    technologies = EXCLUDED.technologies,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    featured_image_url = EXCLUDED.featured_image_url,
    order_index = EXCLUDED.order_index,
    challenge = EXCLUDED.challenge,
    approach = EXCLUDED.approach,
    architecture_notes = EXCLUDED.architecture_notes,
    outcome = EXCLUDED.outcome,
    key_metrics = EXCLUDED.key_metrics;


INSERT INTO projects (title, slug, short_description, detailed_description, status, domain, technologies, start_date, end_date, featured_image_url, order_index, challenge, approach, architecture_notes, outcome, key_metrics)
VALUES (
    'SNPL Knowledge Bites Digital Platform (kb.snpl.com.np)',
    'snpl-knowledge-bites-portal-25',
    'Internal knowledge engineering platform centralizing standard operating procedures, documentation, and technical playbooks.',
    'Designed, engineered, and successfully launched the SNPL Knowledge Bites corporate platform at kb.snpl.com.np. The platform delivers structured technical knowledge bases, standard operating procedures (SOPs), onboarding guides, and runbooks with dedicated public-view and administrative governance URLs.',
    'published',
    ARRAY['Digital Workplace','Knowledge Management','DevOps'],
    ARRAY['Web Portal','Markdown Documentation','Role-Based Access','Search Indexing'],
    '2025-08-01'::date,
    '2025-12-15'::date,
    '/api/assets?path=projects%2Fimages%2Fweb-asset-cloud-migration-23.jpg',
    64,
    'Siloed technical documentation, tribal knowledge risks during team member transitions, and lack of searchable operational runbooks.',
    'Built a lightweight, fast, and structured web portal with markdown authoring, category taxonomy, and role-based permissions.',
    'Secure web architecture deployed on enterprise hosting with SSL/TLS encryption and automated backup routines.',
    'Launched kb.snpl.com.np across IT and business teams, significantly reducing resolution time for recurring IT service requests.',
    '{"platformUrl":"kb.snpl.com.np","documentationCentralized":"50+ SOPs","teamAdoption":"100% IT Department","knowledgeTransferTime":"Reduced by 60%"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    detailed_description = EXCLUDED.detailed_description,
    status = EXCLUDED.status,
    domain = EXCLUDED.domain,
    technologies = EXCLUDED.technologies,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    featured_image_url = EXCLUDED.featured_image_url,
    order_index = EXCLUDED.order_index,
    challenge = EXCLUDED.challenge,
    approach = EXCLUDED.approach,
    architecture_notes = EXCLUDED.architecture_notes,
    outcome = EXCLUDED.outcome,
    key_metrics = EXCLUDED.key_metrics;


INSERT INTO projects (title, slug, short_description, detailed_description, status, domain, technologies, start_date, end_date, featured_image_url, order_index, challenge, approach, architecture_notes, outcome, key_metrics)
VALUES (
    'Automated Factory Network Patching Pipeline (Ansible Semaphore)',
    'ansible-network-patching-25',
    'Automated configuration and firmware patching pipeline for manufacturing factory and warehouse network devices.',
    'Conceived and mentored the delivery of an automated network patching and configuration pipeline using Ansible Semaphore. The pipeline automates routine Change Requests (CR) for Cisco and Juniper switches and routers across factory floors and distribution warehouses, eliminating human error during maintenance windows.',
    'published',
    ARRAY['Network Automation','DevOps & NetOps','Infrastructure as Code'],
    ARRAY['Ansible Semaphore','Cisco IOS-XE','Juniper Junos','YAML Playbooks','CI/CD Pipelines'],
    '2025-09-01'::date,
    '2026-02-28'::date,
    '/api/assets?path=projects%2Fimages%2Fcore-switch-replacement-24.jpg',
    65,
    'Manual, time-consuming network switch firmware updates during tight overnight maintenance windows, increasing the risk of configuration discrepancies.',
    'Mentored direct report engineer to author Ansible playbooks, implement Semaphore UI for scheduled execution, and enforce pre/post check verification.',
    'Centralized Semaphore orchestrator communicating via SSH and Netconf to distributed factory and warehouse network racks.',
    'Successfully executed zero-downtime automated firmware patching across all branch network devices, setting a new operational benchmark.',
    '{"devicesAutomated":"40+ Network Nodes","maintenanceWindowSaved":"75% Time Reduction","humanConfigurationErrors":"0 Errors","auditLogging":"100% Automated Trailing"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    detailed_description = EXCLUDED.detailed_description,
    status = EXCLUDED.status,
    domain = EXCLUDED.domain,
    technologies = EXCLUDED.technologies,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    featured_image_url = EXCLUDED.featured_image_url,
    order_index = EXCLUDED.order_index,
    challenge = EXCLUDED.challenge,
    approach = EXCLUDED.approach,
    architecture_notes = EXCLUDED.architecture_notes,
    outcome = EXCLUDED.outcome,
    key_metrics = EXCLUDED.key_metrics;


INSERT INTO projects (title, slug, short_description, detailed_description, status, domain, technologies, start_date, end_date, featured_image_url, order_index, challenge, approach, architecture_notes, outcome, key_metrics)
VALUES (
    'Enterprise WAN Cost Optimization & IPLC Modernization',
    'enterprise-wan-cost-optimization-25',
    'Strategic telecommunications renegotiation cutting international private leased circuit costs while increasing bandwidth.',
    'Conducted a strategic telecommunications audit and competitive RFP cycle ahead of the Subisu IPLC contract expiration. Successfully transitioned the legacy Subisu TATA 4 Mbps GDE link to Ncell, slashing one-time charges (OTC) from $1,000 to NPR 84K (~$550) and monthly recurring charges (MRC) from $1,300 to NPR 68K (~$440), realizing major recurring OpEx savings with enhanced SLA.',
    'published',
    ARRAY['Telecommunications','WAN Architecture','IT Financial Management'],
    ARRAY['IPLC','MPLS WAN','BGP Routing','SLA Monitoring','Cost Optimization'],
    '2025-05-01'::date,
    '2025-08-31'::date,
    '/api/assets?path=projects%2Fimages%2Fcore-switch-replacement-24.jpg',
    66,
    'High recurring telecommunications expenditure on low-bandwidth legacy leased lines nearing contract expiration.',
    'Ran a competitive commercial renegotiation leveraging alternative domestic and international telecom carriers with stringent uptime SLA requirements.',
    'Dual-carrier active/standby WAN interconnect with automated BGP failover and continuous jitter/latency telemetry.',
    'Delivered significant annualized cost reduction while doubling link reliability and bandwidth capacity for corporate headquarters.',
    '{"mrcCostReduction":"Over 65% Savings","otcCostReduction":"45% Savings","slaGuaranteed":"99.9% Uptime","paybackPeriod":"Immediate"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    detailed_description = EXCLUDED.detailed_description,
    status = EXCLUDED.status,
    domain = EXCLUDED.domain,
    technologies = EXCLUDED.technologies,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    featured_image_url = EXCLUDED.featured_image_url,
    order_index = EXCLUDED.order_index,
    challenge = EXCLUDED.challenge,
    approach = EXCLUDED.approach,
    architecture_notes = EXCLUDED.architecture_notes,
    outcome = EXCLUDED.outcome,
    key_metrics = EXCLUDED.key_metrics;


DELETE FROM achievements WHERE title = 'Manager Evaluation: Outstanding (5.00/5.00) — FY 2025-26';
INSERT INTO achievements (title, description, category, achievement_date, icon_url, order_index)
VALUES ('Manager Evaluation: Outstanding (5.00/5.00) — FY 2025-26', 'Awarded highest overall rating of Outstanding by DMM Vinod Singh in the official Annual Performance Document. Commended for 9 years of building systems from scratch at SNPL, high-impact innovation, zero days delay on AMC/ATS renewals, zero P1 capacity incidents, and zero core team attrition.', 'Leadership & Evaluation', '2026-03-31'::date, 'trophy', 1);


DELETE FROM achievements WHERE title = 'Zero-Attrition Core Team Retention & Capability Mentorship';
INSERT INTO achievements (title, description, category, achievement_date, icon_url, order_index)
VALUES ('Zero-Attrition Core Team Retention & Capability Mentorship', 'Built and led the core IT Infrastructure & Network team with 100% retention and zero attrition across FY 2025-26. Mentored direct reports across Ansible network automation, OT ICS support frameworks, and structured PACE appraisals.', 'Team Leadership', '2026-03-15'::date, 'users', 2);


DELETE FROM achievements WHERE title = 'Corporate Internal Audit Defense (74 Artifacts & 16-Point Memo)';
INSERT INTO achievements (title, description, category, achievement_date, icon_url, order_index)
VALUES ('Corporate Internal Audit Defense (74 Artifacts & 16-Point Memo)', 'Successfully defended IT estate across 74 audit artifacts in coordination with ITC central audit. Authored comprehensive 16-point technical defense memo clearing all high-priority audit observations (10 strongly substantiated, 3 resolved).', 'Governance & Audit', '2026-02-28'::date, 'shield-check', 3);


DELETE FROM achievements WHERE title = 'Analytics Accelerator Program (AAP) Graduate — Batch 1';
INSERT INTO achievements (title, description, category, achievement_date, icon_url, order_index)
VALUES ('Analytics Accelerator Program (AAP) Graduate — Batch 1', 'Selected for and completed the prestigious enterprise Analytics Accelerator Program (AAP) Batch 1 with cross-functional leadership, directly applying data science and generative AI concepts to manufacturing IT.', 'Executive Education', '2025-06-30'::date, 'award', 4);


DELETE FROM certifications WHERE title = 'Analytics Accelerator Program (AAP) - Batch 1';
INSERT INTO certifications (title, issuing_organization, issue_date, credential_id, status)
VALUES ('Analytics Accelerator Program (AAP) - Batch 1', 'ITC Infotech / Surya Nepal Pvt. Ltd.', '2025-06-30'::date, 'AAP-2025-B1-024', 'active');


DELETE FROM certifications WHERE title = 'Microsoft Sentinel Proactive Service Specialist';
INSERT INTO certifications (title, issuing_organization, issue_date, credential_id, status)
VALUES ('Microsoft Sentinel Proactive Service Specialist', 'Microsoft', '2025-07-15'::date, 'MS-SENTINEL-PROACTIVE-25', 'active');


DELETE FROM certifications WHERE title = 'AWS Generative AI Live Series';
INSERT INTO certifications (title, issuing_organization, issue_date, credential_id, status)
VALUES ('AWS Generative AI Live Series', 'Amazon Web Services (AWS)', '2025-09-15'::date, 'AWS-GENAI-LIVE-2025', 'active');


DELETE FROM certifications WHERE title = 'Microsoft AI Skills Fest 2025';
INSERT INTO certifications (title, issuing_organization, issue_date, credential_id, status)
VALUES ('Microsoft AI Skills Fest 2025', 'Microsoft', '2025-05-15'::date, 'MS-AISKILLS-2025', 'active');


DELETE FROM certifications WHERE title = 'Project Management Professional (PMP) Training';
INSERT INTO certifications (title, issuing_organization, issue_date, credential_id, status)
VALUES ('Project Management Professional (PMP) Training', 'Prominent Learners', '2025-09-30'::date, 'PMP-TRAIN-PL-2025', 'active');
