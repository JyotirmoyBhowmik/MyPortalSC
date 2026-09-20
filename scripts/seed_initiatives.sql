
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
