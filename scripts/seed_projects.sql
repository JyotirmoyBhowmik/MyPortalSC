
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