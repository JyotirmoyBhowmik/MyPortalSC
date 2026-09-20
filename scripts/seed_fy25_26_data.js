const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cqtluudfmigefqphmfbb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxdGx1dWRmbWlnZWZxcGhtZmJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NDUyOTcsImV4cCI6MjA4NjMyMTI5N30.e2AgRwOI1rugtWIpm0uwTlbV2E7FCcLBeRyva8X3zJY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
    console.log('--- Starting FY 2025-26 Enterprise Data Seeding ---');

    // Fetch Program IDs map (code -> id)
    const { data: programs, error: progErr } = await supabase.from('programs').select('id, code');
    if (progErr) throw progErr;
    const progMap = {};
    programs.forEach(p => { progMap[p.code] = p.id; });
    console.log('Loaded program map:', progMap);

    // 1. INITIATIVES (20 initiatives)
    const initiatives = [
        {
            title: 'DMS SFA Transformation Programme',
            slug: '89-dms-sfa-transformation-programme',
            program_id: progMap['H'],
            fiscal_year: '2025-26',
            strategic_area: 'Business Applications & Cloud Platforms',
            criticality: 'Critical',
            delivery_focus: 'Anchored full 4-vendor evaluation across Ncell, Everest, DataHub, and SilverLining; Authored comprehensive Botree and Vxceed Bill of Materials (BOMs); Finalized 3-year Total Cost of Ownership (TCO) with CISO-ready security architecture submission',
            image_url: '/api/assets?path=projects%2Fimages%2Fecommerce-dashboard.jpg',
            status: 'published',
            order_index: 89
        },
        {
            title: 'SAP DR Migration from TATA to Microsoft Azure',
            slug: '90-sap-dr-migration-from-tata-to-microsoft-azure',
            program_id: progMap['C'],
            fiscal_year: '2025-26',
            strategic_area: 'Disaster Recovery & Cloud Architecture',
            criticality: 'Critical',
            delivery_focus: 'Drove complete vendor technical and commercial evaluation cycle with Cloud4C, MSR-IT, and ITSS; Formulated SNPL DR Migration Business Case PPT for SAP/HRMS DR-on-Azure; Validated Recovery Point Objective (RPO) and Recovery Time Objective (RTO) architectural models',
            image_url: '/api/assets?path=projects%2Fimages%2Fdr-geo-redundancy-21.jpg',
            status: 'published',
            order_index: 90
        },
        {
            title: 'Simara Factory Secondary OT DC & Claroty CTD Security',
            slug: '91-simara-factory-secondary-ot-dc-claroty-ctd-security',
            program_id: progMap['A'],
            fiscal_year: '2025-26',
            strategic_area: 'OT / Industrial Cybersecurity',
            criticality: 'Critical',
            delivery_focus: 'Architected Secondary OT Data Centre at Simara manufacturing plant; Formulated and issued comprehensive RFP covering NGTP Next-Gen Threat Prevention firewalls and Claroty Continuous Threat Detection (CTD); Coordinated alignment with ITC corporate cybersecurity framework',
            image_url: '/api/assets?path=projects%2Fimages%2Fot-security-roadmap-23.jpg',
            status: 'published',
            order_index: 91
        },
        {
            title: 'Industrial Energy Monitoring System (EMS) & Utility Management',
            slug: '92-industrial-energy-monitoring-system-ems-utility-management',
            program_id: progMap['A'],
            fiscal_year: '2025-26',
            strategic_area: 'OT & Sustainability Telemetry',
            criticality: 'High',
            delivery_focus: 'Formulated and issued enterprise RFP for Utility Management and Factory Energy Monitoring Solution; Established automated sensor data acquisition protocols with ITC central engineering; Enabled real-time telemetry for factory sustainability and energy compliance',
            image_url: '/api/assets?path=projects%2Fimages%2Fenergy-compliance-blueprint-23.jpg',
            status: 'published',
            order_index: 92
        },
        {
            title: 'Microsoft & VMware Enterprise Mega-Renewal & Virtualization Strategy',
            slug: '93-microsoft-vmware-enterprise-mega-renewal-virtualization-strategy',
            program_id: progMap['C'],
            fiscal_year: '2025-26',
            strategic_area: 'Enterprise Licensing & Infrastructure Resilience',
            criticality: 'High',
            delivery_focus: 'Executed enterprise mega-renewal covering 100 on-premise and hosted servers; Successfully closed Microsoft Unified Support to Sonata migration; Delivered comprehensive VMware-to-Nutanix HCI alternative study; Renewed M365 260 Business Standard + 72 BP licenses via CSP for SNPL and SNVPL',
            image_url: '/api/assets?path=projects%2Fimages%2Ferp-server-virt-22.jpg',
            status: 'published',
            order_index: 93
        },
        {
            title: 'SAP ERP EHP Upgrade & Production Rollout',
            slug: '94-sap-erp-ehp-upgrade-production-rollout',
            program_id: progMap['H'],
            fiscal_year: '2025-26',
            strategic_area: 'Core Enterprise ERP',
            criticality: 'Critical',
            delivery_focus: 'Initiated and provisioned isolated RP9 test server; Finalized technical migration architecture and project cutover plan; Approved go-ahead for SAP EHP development system upgrade; Successfully executed production system transition with zero business disruption',
            image_url: '/api/assets?path=projects%2Fimages%2Ferp-landscape-virt-21.jpg',
            status: 'published',
            order_index: 94
        },
        {
            title: 'Enterprise AI Strategy & Copilot Studio Deployment',
            slug: '95-enterprise-ai-strategy-copilot-studio-deployment',
            program_id: progMap['G'],
            fiscal_year: '2025-26',
            strategic_area: 'Artificial Intelligence & Cognitive Automation',
            criticality: 'High',
            delivery_focus: 'Authored Enterprise AI Implementation Strategy for Manufacturing; Formulated executive LLM proposal for Managing Director, VPs, and Senior Leadership; Introduced Microsoft Copilot; Drove Microsoft Sentinel SOC POC; Executed Enterprise Search PoC on Azure AI Copilot Studio',
            image_url: '/api/assets?path=projects%2Fimages%2Ftask-management-app.jpg',
            status: 'published',
            order_index: 95
        },
        {
            title: 'Datacenter Physical Infrastructure Upgrade & Lifecycle Assessment',
            slug: '96-datacenter-physical-infrastructure-upgrade-lifecycle-assessment',
            program_id: progMap['C'],
            fiscal_year: '2025-26',
            strategic_area: 'Data Center Architecture & Capacity Planning',
            criticality: 'High',
            delivery_focus: 'Closed DC Physical Infrastructure Upgrade consultancy validation; Delivered comprehensive SNPL DC Assessment covering server, storage, OS lifecycle, clustering, and High Availability (HA) architecture; Optimized power, cooling, and rack footprint',
            image_url: '/api/assets?path=projects%2Fimages%2Fhigh-density-fiber-hub-24.jpg',
            status: 'published',
            order_index: 96
        },
        {
            title: 'SNPL Knowledge Bites Digital Platform (kb.snpl.com.np)',
            slug: '97-snpl-knowledge-bites-digital-platform-kb-snpl-com-np',
            program_id: progMap['E'],
            fiscal_year: '2025-26',
            strategic_area: 'Digital Workplace & Knowledge Management',
            criticality: 'Medium',
            delivery_focus: 'Designed, built, and launched internal corporate knowledge portal at kb.snpl.com.np; Implemented dual public-view and administrative interfaces; Centralized IT SOPs, troubleshooting guides, and knowledge transfer artifacts',
            image_url: '/api/assets?path=projects%2Fimages%2Fweb-asset-cloud-migration-23.jpg',
            status: 'published',
            order_index: 97
        },
        {
            title: 'Executive Boardroom AV Modernization & Horion Mirroring Redundancy',
            slug: '98-executive-boardroom-av-modernization-horion-mirroring-redundancy',
            program_id: progMap['L'],
            fiscal_year: '2025-26',
            strategic_area: 'Executive Collaboration & AV Infrastructure',
            criticality: 'Medium',
            delivery_focus: 'Evaluated commercial proposals through Multisys; Replaced legacy display units with interactive Smart Board TV solutions; Engineered wireless Horion screen mirroring device redundancy across Old and New executive buildings',
            image_url: '/api/assets?path=projects%2Fimages%2Ftask-management-app.jpg',
            status: 'published',
            order_index: 98
        },
        {
            title: 'Automated Network Patching Pipeline (Ansible Semaphore)',
            slug: '99-automated-network-patching-pipeline-ansible-semaphore',
            program_id: progMap['B'],
            fiscal_year: '2025-26',
            strategic_area: 'Network Automation & DevOps',
            criticality: 'Medium',
            delivery_focus: 'Engineered centralized automated network configuration and firmware patching pipeline via Ansible Semaphore; Automated Change Requests (CR) for factory and warehouse switches and routers; Eliminated manual patching overhead and configuration drift',
            image_url: '/api/assets?path=projects%2Fimages%2Fcore-switch-replacement-24.jpg',
            status: 'published',
            order_index: 99
        },
        {
            title: 'Core Storage & Backup Infrastructure Critical Upgrades',
            slug: '100-core-storage-backup-infrastructure-critical-upgrades',
            program_id: progMap['C'],
            fiscal_year: '2025-26',
            strategic_area: 'SAN & Backup Resilience',
            criticality: 'High',
            delivery_focus: 'Upgraded 4 Cisco SAN switches to v9.x firmware non-disruptively with documented rollback; Applied critical HPE 3PAR Virtual Storage Processor (VSP) patch with zero downtime; Executed HPE StoreOnce backup appliance firmware upgrades within maintenance windows',
            image_url: '/api/assets?path=projects%2Fimages%2Fdr-geo-redundancy-21.jpg',
            status: 'published',
            order_index: 100
        },
        {
            title: 'IT Policy 2.0 & Information Management (IM) Policy 2.0 Adoption',
            slug: '101-it-policy-2-0-information-management-im-policy-2-0-adoption',
            program_id: progMap['F'],
            fiscal_year: '2025-26',
            strategic_area: 'Governance, Risk & Compliance (GRC)',
            criticality: 'High',
            delivery_focus: 'Anchored IT Policy 2.0 modernization aligned with ITC Hotels corporate template; Drove full Group adoption of Information Management Policy 2.0; Designed SOP portal on SharePoint with Information Rights Management (IRM) controls; Implemented mandatory shift logging discipline',
            image_url: '/api/assets?path=projects%2Fimages%2Fot-security-roadmap-23.jpg',
            status: 'published',
            order_index: 101
        },
        {
            title: 'Corporate Internal Audit Defense (74 Artifacts & 16-Point Memo)',
            slug: '102-corporate-internal-audit-defense-74-artifacts-16-point-memo',
            program_id: progMap['F'],
            fiscal_year: '2025-26',
            strategic_area: 'Audit Defense & IT Governance',
            criticality: 'Critical',
            delivery_focus: 'Coordinated 74 audit artifacts with ITC central audit team; Authored comprehensive technical memo covering 16 audit points (successfully defended 10 disagreed observations with rock-solid evidence, acknowledged/resolved 3); Closed Corporate Internal Audit DAP 07 and DAP 13 points',
            image_url: '/api/assets?path=projects%2Fimages%2Ffinancial-mis-dashboard.jpg',
            status: 'published',
            order_index: 102
        },
        {
            title: 'Enterprise Endpoint Modernization & Windows 11 Fleet Transition',
            slug: '103-enterprise-endpoint-modernization-windows-11-fleet-transition',
            program_id: progMap['J'],
            fiscal_year: '2025-26',
            strategic_area: 'End-User Computing & Lifecycle Management',
            criticality: 'Medium',
            delivery_focus: 'Optimized and upgraded 135 desktops and 42 laptops for Windows 11, extending device lifecycle; Negotiated 21-desktop commercial package (15 SNPL, 6 SNVL); Delivered 6-desktop CapEx safety replacement; Standardized Dell Pro Tower QCT1250 across business units; Authored MD MacBook Pro M5 CapEx note',
            image_url: '/api/assets?path=projects%2Fimages%2Ftask-management-app.jpg',
            status: 'published',
            order_index: 103
        },
        {
            title: 'Enterprise WAN Cost Optimization & IPLC Modernization',
            slug: '104-enterprise-wan-cost-optimization-iplc-modernization',
            program_id: progMap['B'],
            fiscal_year: '2025-26',
            strategic_area: 'Telecom & WAN Optimization',
            criticality: 'High',
            delivery_focus: 'Managed MPLS/IPLC Subisu renewal before contract expiry; Renegotiated Subisu TATA 4 Mbps GDE link (INR OTC USD 1,000, MRC USD 1,300) to Ncell (OTC NPR 84K / $550, MRC NPR 68K / $440); Secured substantial recurring monthly OpEx reductions while boosting bandwidth and uptime SLA',
            image_url: '/api/assets?path=projects%2Fimages%2Fcore-switch-replacement-24.jpg',
            status: 'published',
            order_index: 104
        },
        {
            title: 'OT Table-Top Exercise (TTX) & Standalone ICS Support Governance',
            slug: '105-ot-table-top-exercise-ttx-standalone-ics-support-governance',
            program_id: progMap['A'],
            fiscal_year: '2025-26',
            strategic_area: 'Industrial Control Systems Security',
            criticality: 'High',
            delivery_focus: 'Formulated and executed OT Incident Response Table-Top Exercise (TTX); Established secure remote vendor support governance framework for standalone Industrial Control Systems (ICS) with ITC corporate; Cleared long-standing OT vulnerability remediation items',
            image_url: '/api/assets?path=projects%2Fimages%2Fot-security-roadmap-23.jpg',
            status: 'published',
            order_index: 105
        },
        {
            title: 'SNPL × Shopify Enterprise E-Commerce IT Integration',
            slug: '106-snpl-shopify-enterprise-e-commerce-it-integration',
            program_id: progMap['H'],
            fiscal_year: '2025-26',
            strategic_area: 'E-Commerce & Digital Channels',
            criticality: 'High',
            delivery_focus: 'Delivered end-to-end IT architecture and secure middleware integration between SNPL corporate enterprise backends and Shopify e-commerce digital store; Configured secure payment gateway pipelines and inventory synchronization channels',
            image_url: '/api/assets?path=projects%2Fimages%2Fecommerce-dashboard.jpg',
            status: 'published',
            order_index: 106
        },
        {
            title: 'Server Health Monitoring Dashboard & Automated Telemetry',
            slug: '107-server-health-monitoring-dashboard-automated-telemetry',
            program_id: progMap['G'],
            fiscal_year: '2025-26',
            strategic_area: 'Observability & Automated Alerting',
            criticality: 'Medium',
            delivery_focus: 'Developed automated enterprise server health monitoring dashboard; Implemented daily automated threshold triggers for RAM utilization, disk capacity, and uptime alerts across Windows and Linux server fleets; Prevented resource saturation incidents',
            image_url: '/api/assets?path=projects%2Fimages%2Fzabbix-observability-23.jpg',
            status: 'published',
            order_index: 107
        },
        {
            title: 'Simara Factory Digital EHS Application Enablement',
            slug: '108-simara-factory-digital-ehs-application-enablement',
            program_id: progMap['H'],
            fiscal_year: '2025-26',
            strategic_area: 'Factory Digitization & Operational Excellence',
            criticality: 'Medium',
            delivery_focus: 'Provided complete IT infrastructure, network segmentation, and secure wireless endpoint provisioning for the digital Environment, Health & Safety (EHS) software rollout at Simara manufacturing factory; Automated factory safety reporting workflows',
            image_url: '/api/assets?path=projects%2Fimages%2Futility-iot-monitoring-22.jpg',
            status: 'published',
            order_index: 108
        }
    ];

    console.log(`Upserting ${initiatives.length} initiatives...`);
    for (const init of initiatives) {
        const { error } = await supabase.from('initiatives').upsert(init, { onConflict: 'slug' });
        if (error) {
            console.error(`Error upserting initiative ${init.slug}:`, error);
        } else {
            console.log(`✓ Initiative: ${init.title}`);
        }
    }

    // 2. FLAGSHIP PROJECTS (10 Projects)
    const projects = [
        {
            title: 'DMS SFA (Distributor Management & Sales Automation) Programme',
            slug: 'dms-sfa-transformation-25',
            short_description: 'End-to-end IT architecture and 4-vendor evaluation for distributor management and sales force automation.',
            detailed_description: 'Led and anchored the entire IT infrastructure and application architecture for the national Distributor Management System (DMS) and Sales Force Automation (SFA) programme. Drove rigorous evaluation across 4 top cloud/hosting providers (Ncell, Everest, DataHub, SilverLining), authored comprehensive BOMs for Botree and Vxceed platforms, and formulated the CISO-ready 3-year TCO submission.',
            status: 'published',
            is_published: true,
            domain: ['Enterprise Applications', 'Cloud Architecture', 'Supply Chain'],
            technologies: ['Botree DMS', 'Vxceed SFA', 'Private Cloud', 'CISO Framework', 'BOM Modeling'],
            start_date: '2025-04-01',
            end_date: '2026-03-31',
            featured_image_url: '/api/assets?path=projects%2Fimages%2Fecommerce-dashboard.jpg',
            order_index: 57,
            sort_order: 57,
            challenge: 'Fragmented secondary sales tracking, multi-vendor cloud hosting trade-offs, and stringent corporate cybersecurity governance requirements across external sales channels.',
            approach: 'Built a 4-vendor technical-commercial comparative matrix, modeled multi-tier infrastructure BOMs, and aligned security controls directly with CISO requirements.',
            architecture_notes: 'Hybrid enterprise architecture bridging on-premise ERP backends with secure distributor-facing cloud hosting and API gateways.',
            outcome: 'Successfully finalized 3-year TCO, secured CISO approval, and established scalable infrastructure for countrywide distributor sales operations.',
            key_metrics: {
                vendorsEvaluated: 4,
                tcoHorizon: '3 Years',
                governanceSignoff: 'CISO Approved',
                ecosystemReach: 'National Distribution'
            }
        },
        {
            title: 'SAP Disaster Recovery (DR) Migration to Microsoft Azure',
            slug: 'sap-azure-dr-migration-25',
            short_description: 'Strategic migration of mission-critical SAP and HRMS disaster recovery infrastructure from TATA to Microsoft Azure.',
            detailed_description: 'Drove the end-to-end technical evaluation and business case formulation for migrating Surya Nepal’s mission-critical SAP and HRMS Disaster Recovery (DR) landscape from TATA communications hosting to Microsoft Azure. Partnered with Cloud4C, MSR-IT, and ITSS to validate Azure Landing Zones, cost optimization models, and near-zero RPO/RTO resilience.',
            status: 'published',
            is_published: true,
            domain: ['Disaster Recovery', 'Cloud Infrastructure', 'Enterprise ERP'],
            technologies: ['SAP ERP', 'Microsoft Azure', 'Cloud4C', 'Azure Site Recovery', 'FinOps'],
            start_date: '2025-05-01',
            end_date: '2026-03-31',
            featured_image_url: '/api/assets?path=projects%2Fimages%2Fdr-geo-redundancy-21.jpg',
            order_index: 58,
            sort_order: 58,
            challenge: 'Legacy third-party DR hosting limitations, escalating operational expenditure, and the necessity for cloud-native elasticity for SAP HANA and HRMS workloads.',
            approach: 'Formulated a comprehensive business case presentation for senior leadership and board sign-off, conducted deep-dive partner workshops, and architected automated Azure DR replication.',
            architecture_notes: 'Azure Landing Zone for SAP with geo-redundant storage, automated failover runbooks, and encrypted ExpressRoute hybrid interconnects.',
            outcome: 'Approved business case for Azure DR rollout, establishing modernized geo-resilience and optimized cloud run-rate for enterprise systems.',
            key_metrics: {
                drPlatform: 'Microsoft Azure',
                rpoTarget: '< 15 Minutes',
                rtoTarget: '< 4 Hours',
                workloadsProtected: 'SAP & HRMS'
            }
        },
        {
            title: 'Simara Factory Secondary OT Data Centre & Claroty CTD Security',
            slug: 'simara-secondary-ot-dc-25',
            short_description: 'Secondary OT Data Centre design and Claroty Continuous Threat Detection (CTD) implementation for manufacturing resilience.',
            detailed_description: 'Architected and led the engineering of a Secondary OT Data Centre at the Simara manufacturing factory. Formulated and issued the comprehensive RFP covering Next-Gen Threat Prevention (NGTP) firewalls and Claroty Continuous Threat Detection (CTD) in direct coordination with ITC Corporate Cybersecurity.',
            status: 'published',
            is_published: true,
            domain: ['OT Security', 'SCADA / ICS', 'Data Center Infrastructure'],
            technologies: ['Claroty CTD', 'NGTP Firewalls', 'IEC 62443', 'OT Microsegmentation', 'Purdue Model'],
            start_date: '2025-06-01',
            end_date: '2026-03-31',
            featured_image_url: '/api/assets?path=projects%2Fimages%2Fot-security-roadmap-23.jpg',
            order_index: 59,
            sort_order: 59,
            challenge: 'Protecting continuous manufacturing operations from lateral cyber threats, ensuring hardware redundancy for industrial control systems, and complying with global IEC 62443 standards.',
            approach: 'Designed a physically separated and resilient secondary OT datacenter room, integrated passive network anomaly detection, and deployed zone-based firewalls.',
            architecture_notes: 'Purdue Level 2/3 industrial segmentation with dual-homed OT firewalls, redundant UPS/cooling, and Claroty passive sensor spans.',
            outcome: 'Issued turnkey RFP, validated commercial bids, and established high-availability OT operations for the primary manufacturing site.',
            key_metrics: {
                datacenterTier: 'Secondary OT DC',
                standardCompliance: 'IEC 62443',
                assetVisibility: '100% ICS Network',
                threatDetection: 'Claroty CTD'
            }
        },
        {
            title: 'Industrial Energy Monitoring System (EMS) & Utility Telemetry',
            slug: 'industrial-ems-utility-25',
            short_description: 'Factory-wide IoT telemetry and automated energy accounting infrastructure across manufacturing units.',
            detailed_description: 'Formulated and issued the enterprise RFP for a comprehensive Factory Energy Monitoring System (EMS) and Utility Management Solution in coordination with ITC central engineering teams. Designed IoT sensor networking, edge gateway integration, and automated utility analytics for plant power, steam, water, and fuel consumption.',
            status: 'published',
            is_published: true,
            domain: ['Industrial IoT', 'Sustainability', 'OT Modernization'],
            technologies: ['Industrial IoT Gateways', 'Modbus / OPC-UA', 'Telemetry Dashboards', 'Energy Analytics'],
            start_date: '2025-07-01',
            end_date: '2026-03-31',
            featured_image_url: '/api/assets?path=projects%2Fimages%2Fenergy-compliance-blueprint-23.jpg',
            order_index: 60,
            sort_order: 60,
            challenge: 'Manual energy meter logging, lack of sub-meter level granular consumption visibility, and corporate mandates for carbon footprint accounting.',
            approach: 'Architected an automated digital telemetry backbone connecting multi-function meters across production lines to an edge aggregation platform.',
            architecture_notes: 'Secure RS-485 to Ethernet IP gateways, segregated OT utility VLANs, and scheduled aggregation into central management dashboards.',
            outcome: 'Closed RFP cycle with approved technical vendors, establishing automated energy monitoring and real-time efficiency metrics.',
            key_metrics: {
                utilityCoverage: 'Power, Steam, Fuel',
                dataAcquisition: 'Automated Real-time',
                complianceLevel: 'ITC Corporate ESG',
                auditReadiness: '100% Digital Telemetry'
            }
        },
        {
            title: 'Enterprise AI Strategy & Copilot Studio Deployment',
            slug: 'enterprise-ai-copilot-manufacturing-25',
            short_description: 'Strategic generative AI blueprint, Microsoft Copilot introduction, and Azure AI Enterprise Search PoCs.',
            detailed_description: 'Authored the official Enterprise AI Implementation Strategy for Manufacturing and formulated an executive LLM deployment proposal for the Managing Director, Vice Presidents, and Senior Leadership. Drove hands-on innovation including Microsoft Copilot introduction, Microsoft Sentinel SOC AI capabilities, and an Enterprise Search PoC built on Azure AI Copilot Studio.',
            status: 'published',
            is_published: true,
            domain: ['Artificial Intelligence', 'Digital Workplace', 'Cognitive Automation'],
            technologies: ['Microsoft Copilot', 'Azure AI Foundry', 'Copilot Studio', 'Microsoft Sentinel', 'RAG Architecture'],
            start_date: '2025-06-01',
            end_date: '2026-03-31',
            featured_image_url: '/api/assets?path=projects%2Fimages%2Ftask-management-app.jpg',
            order_index: 61,
            sort_order: 61,
            challenge: 'Bridging executive expectations with responsible AI data governance, information rights security, and practical business productivity uplift.',
            approach: 'Conducted comparative evaluations of enterprise AI frameworks (NotebookLM, Claude, Microsoft AI), established data security boundaries, and built functional prototypes.',
            architecture_notes: 'Enterprise Search architecture with Retrieval-Augmented Generation (RAG) over corporate SharePoint knowledge bases using Azure AI Copilot Studio.',
            outcome: 'Presented executive AI roadmap, deployed Copilot licenses to leadership, and proved search acceleration across enterprise policies.',
            key_metrics: {
                executiveBriefing: 'MD & VPs Delivered',
                pocsExecuted: 2,
                searchAcceleration: '70% Faster Discovery',
                governanceModel: 'Responsible AI'
            }
        },
        {
            title: 'Datacenter Physical Infrastructure Upgrade & Lifecycle Assessment',
            slug: 'dc-physical-infrastructure-upgrade-25',
            short_description: 'Comprehensive physical DC modernization consultancy and complete compute, storage, and cluster HA lifecycle audit.',
            detailed_description: 'Successfully validated and closed the Datacenter Physical Infrastructure Upgrade consultancy for Surya Nepal Head Office and branch facilities. Delivered an exhaustive SNPL DC Assessment analyzing server, storage, and operating system lifecycles, power efficiency, cooling dynamics, and high-availability virtualization cluster health.',
            status: 'published',
            is_published: true,
            domain: ['Data Center Infrastructure', 'Capacity Planning', 'Hardware Lifecycle'],
            technologies: ['Server Clustering', 'Precision Air Cooling', 'Modular UPS', 'Storage Lifecycle', 'HA Design'],
            start_date: '2025-04-01',
            end_date: '2026-01-31',
            featured_image_url: '/api/assets?path=projects%2Fimages%2Fhigh-density-fiber-hub-24.jpg',
            order_index: 62,
            sort_order: 62,
            challenge: 'Aging datacenter physical components, escalating thermal densities, and the requirement to establish a 5-year hardware roadmap.',
            approach: 'Engaged specialized external DC consultants, coordinated site surveys, and synthesized technical data into a holistic executive modernization blueprint.',
            architecture_notes: 'High-availability N+1 UPS distribution, hot-aisle containment design, and consolidated multi-node virtualization hosts.',
            outcome: 'Delivered finalized DC Assessment report with prioritized investment phases, ensuring zero unbudgeted hardware obsolescence.',
            key_metrics: {
                serversAudited: '100+ Nodes',
                p1CapacityIncidents: 0,
                redundancyArchitecture: 'N+1 Resilient',
                planningHorizon: '5-Year Lifecycle'
            }
        },
        {
            title: 'Enterprise Microsoft & VMware Infrastructure Mega-Renewal',
            slug: 'microsoft-vmware-mega-renewal-25',
            short_description: 'Multi-year licensing mega-renewal covering 100 enterprise servers, Sonata support migration, and VMware-to-Nutanix HCI study.',
            detailed_description: 'Spearheaded the enterprise-scale software licensing mega-renewal spanning 100+ servers across SNPL and SNVPL. Successfully negotiated and closed the migration of Microsoft Unified Support to Sonata, conducted a comprehensive VMware-to-Nutanix Hyperconverged Infrastructure (HCI) alternative study, and closed M365 CSP renewal of 260 Business Standard + 72 BP licenses.',
            status: 'published',
            is_published: true,
            domain: ['IT Asset Management', 'Enterprise Licensing', 'Virtualization'],
            technologies: ['VMware vSphere', 'Nutanix HCI', 'Microsoft 365 CSP', 'Sonata Support', 'License Governance'],
            start_date: '2025-06-01',
            end_date: '2026-03-31',
            featured_image_url: '/api/assets?path=projects%2Fimages%2Ferp-server-virt-22.jpg',
            order_index: 63,
            sort_order: 63,
            challenge: 'Broadcom licensing cost escalations following the VMware acquisition, enterprise support transitions, and strict licensing renewal deadlines.',
            approach: 'Formulated a multi-vendor commercial alternative model comparing VMware renewals against Nutanix HCI migrations, and leveraged CSP channels for maximum discount.',
            architecture_notes: 'Optimized core-based compute licensing models across cluster hosts with unified enterprise support SLA.',
            outcome: 'Completed all contract renewals with zero days delay, achieved cost predictability through 2027, and secured tier-1 escalation pathways.',
            key_metrics: {
                serversLicensed: '100+ Servers',
                renewalDelay: '0 Days Delay',
                coverageTerm: 'Extended to March 2027',
                supportTier: 'Unified SLA'
            }
        },
        {
            title: 'SNPL Knowledge Bites Digital Platform (kb.snpl.com.np)',
            slug: 'snpl-knowledge-bites-portal-25',
            short_description: 'Internal knowledge engineering platform centralizing standard operating procedures, documentation, and technical playbooks.',
            detailed_description: 'Designed, engineered, and successfully launched the SNPL Knowledge Bites corporate platform at kb.snpl.com.np. The platform delivers structured technical knowledge bases, standard operating procedures (SOPs), onboarding guides, and runbooks with dedicated public-view and administrative governance URLs.',
            status: 'published',
            is_published: true,
            domain: ['Digital Workplace', 'Knowledge Management', 'DevOps'],
            technologies: ['Web Portal', 'Markdown Documentation', 'Role-Based Access', 'Search Indexing'],
            start_date: '2025-08-01',
            end_date: '2025-12-15',
            featured_image_url: '/api/assets?path=projects%2Fimages%2Fweb-asset-cloud-migration-23.jpg',
            order_index: 64,
            sort_order: 64,
            challenge: 'Siloed technical documentation, tribal knowledge risks during team member transitions, and lack of searchable operational runbooks.',
            approach: 'Built a lightweight, fast, and structured web portal with markdown authoring, category taxonomy, and role-based permissions.',
            architecture_notes: 'Secure web architecture deployed on enterprise hosting with SSL/TLS encryption and automated backup routines.',
            outcome: 'Launched kb.snpl.com.np across IT and business teams, significantly reducing resolution time for recurring IT service requests.',
            key_metrics: {
                platformUrl: 'kb.snpl.com.np',
                documentationCentralized: '50+ SOPs',
                teamAdoption: '100% IT Department',
                knowledgeTransferTime: 'Reduced by 60%'
            }
        },
        {
            title: 'Automated Factory Network Patching Pipeline (Ansible Semaphore)',
            slug: 'ansible-network-patching-25',
            short_description: 'Automated configuration and firmware patching pipeline for manufacturing factory and warehouse network devices.',
            detailed_description: 'Conceived and mentored the delivery of an automated network patching and configuration pipeline using Ansible Semaphore. The pipeline automates routine Change Requests (CR) for Cisco and Juniper switches and routers across factory floors and distribution warehouses, eliminating human error during maintenance windows.',
            status: 'published',
            is_published: true,
            domain: ['Network Automation', 'DevOps & NetOps', 'Infrastructure as Code'],
            technologies: ['Ansible Semaphore', 'Cisco IOS-XE', 'Juniper Junos', 'YAML Playbooks', 'CI/CD Pipelines'],
            start_date: '2025-09-01',
            end_date: '2026-02-28',
            featured_image_url: '/api/assets?path=projects%2Fimages%2Fcore-switch-replacement-24.jpg',
            order_index: 65,
            sort_order: 65,
            challenge: 'Manual, time-consuming network switch firmware updates during tight overnight maintenance windows, increasing the risk of configuration discrepancies.',
            approach: 'Mentored direct report engineer to author Ansible playbooks, implement Semaphore UI for scheduled execution, and enforce pre/post check verification.',
            architecture_notes: 'Centralized Semaphore orchestrator communicating via SSH and Netconf to distributed factory and warehouse network racks.',
            outcome: 'Successfully executed zero-downtime automated firmware patching across all branch network devices, setting a new operational benchmark.',
            key_metrics: {
                devicesAutomated: '40+ Network Nodes',
                maintenanceWindowSaved: '75% Time Reduction',
                humanConfigurationErrors: '0 Errors',
                auditLogging: '100% Automated Trailing'
            }
        },
        {
            title: 'Enterprise WAN Cost Optimization & IPLC Modernization',
            slug: 'enterprise-wan-cost-optimization-25',
            short_description: 'Strategic telecommunications renegotiation cutting international private leased circuit costs while increasing bandwidth.',
            detailed_description: 'Conducted a strategic telecommunications audit and competitive RFP cycle ahead of the Subisu IPLC contract expiration. Successfully transitioned the legacy Subisu TATA 4 Mbps GDE link to Ncell, slashing one-time charges (OTC) from $1,000 to NPR 84K (~$550) and monthly recurring charges (MRC) from $1,300 to NPR 68K (~$440), realizing major recurring OpEx savings with enhanced SLA.',
            status: 'published',
            is_published: true,
            domain: ['Telecommunications', 'WAN Architecture', 'IT Financial Management'],
            technologies: ['IPLC', 'MPLS WAN', 'BGP Routing', 'SLA Monitoring', 'Cost Optimization'],
            start_date: '2025-05-01',
            end_date: '2025-08-31',
            featured_image_url: '/api/assets?path=projects%2Fimages%2Fcore-switch-replacement-24.jpg',
            order_index: 66,
            sort_order: 66,
            challenge: 'High recurring telecommunications expenditure on low-bandwidth legacy leased lines nearing contract expiration.',
            approach: 'Ran a competitive commercial renegotiation leveraging alternative domestic and international telecom carriers with stringent uptime SLA requirements.',
            architecture_notes: 'Dual-carrier active/standby WAN interconnect with automated BGP failover and continuous jitter/latency telemetry.',
            outcome: 'Delivered significant annualized cost reduction while doubling link reliability and bandwidth capacity for corporate headquarters.',
            key_metrics: {
                mrcCostReduction: 'Over 65% Savings',
                otcCostReduction: '45% Savings',
                slaGuaranteed: '99.9% Uptime',
                paybackPeriod: 'Immediate'
            }
        }
    ];

    console.log(`Upserting ${projects.length} flagship projects...`);
    for (const proj of projects) {
        const { error } = await supabase.from('projects').upsert(proj, { onConflict: 'slug' });
        if (error) {
            console.error(`Error upserting project ${proj.slug}:`, error);
        } else {
            console.log(`✓ Project: ${proj.title}`);
        }
    }

    // 3. ACHIEVEMENTS (4 records)
    const achievements = [
        {
            title: 'Manager Evaluation: Outstanding (5.00/5.00) — FY 2025-26',
            description: 'Awarded highest overall rating of Outstanding by DMM Vinod Singh in the official Annual Performance Document. Commended for 9 years of building systems from scratch at SNPL, high-impact innovation, zero days delay on AMC/ATS renewals, zero P1 capacity incidents, and zero core team attrition.',
            category: 'Leadership & Evaluation',
            achievement_date: '2026-03-31',
            icon_url: 'trophy',
            order_index: 1
        },
        {
            title: 'Zero-Attrition Core Team Retention & Capability Mentorship',
            description: 'Built and led the core IT Infrastructure & Network team with 100% retention and zero attrition across FY 2025-26. Mentored direct reports across Ansible network automation, OT ICS support frameworks, and structured PACE appraisals.',
            category: 'Team Leadership',
            achievement_date: '2026-03-15',
            icon_url: 'users',
            order_index: 2
        },
        {
            title: 'Corporate Internal Audit Defense (74 Artifacts & 16-Point Memo)',
            description: 'Successfully defended IT estate across 74 audit artifacts in coordination with ITC central audit. Authored comprehensive 16-point technical defense memo clearing all high-priority audit observations (10 strongly substantiated, 3 resolved).',
            category: 'Governance & Audit',
            achievement_date: '2026-02-28',
            icon_url: 'shield-check',
            order_index: 3
        },
        {
            title: 'Analytics Accelerator Program (AAP) Graduate — Batch 1',
            description: 'Selected for and completed the prestigious enterprise Analytics Accelerator Program (AAP) Batch 1 with cross-functional leadership, directly applying data science and generative AI concepts to manufacturing IT.',
            category: 'Executive Education',
            achievement_date: '2025-06-30',
            icon_url: 'award',
            order_index: 4
        }
    ];

    console.log(`Upserting ${achievements.length} achievements...`);
    for (const ach of achievements) {
        const { error } = await supabase.from('achievements').upsert(ach, { onConflict: 'title' });
        if (error) {
            console.error(`Error upserting achievement ${ach.title}:`, error);
        } else {
            console.log(`✓ Achievement: ${ach.title}`);
        }
    }

    // 4. CERTIFICATIONS & EXECUTIVE EDUCATION (5 records)
    const certifications = [
        {
            title: 'Analytics Accelerator Program (AAP) - Batch 1',
            issuing_organization: 'ITC Infotech / Surya Nepal Pvt. Ltd.',
            issue_date: '2025-06-30',
            expiry_date: null,
            credential_id: 'AAP-2025-B1-024',
            status: 'active'
        },
        {
            title: 'Microsoft Sentinel Proactive Service Specialist',
            issuing_organization: 'Microsoft',
            issue_date: '2025-07-15',
            expiry_date: null,
            credential_id: 'MS-SENTINEL-PROACTIVE-25',
            status: 'active'
        },
        {
            title: 'AWS Generative AI Live Series',
            issuing_organization: 'Amazon Web Services (AWS)',
            issue_date: '2025-09-15',
            expiry_date: null,
            credential_id: 'AWS-GENAI-LIVE-2025',
            status: 'active'
        },
        {
            title: 'Microsoft AI Skills Fest 2025',
            issuing_organization: 'Microsoft',
            issue_date: '2025-05-15',
            expiry_date: null,
            credential_id: 'MS-AISKILLS-2025',
            status: 'active'
        },
        {
            title: 'Project Management Professional (PMP) Training',
            issuing_organization: 'Prominent Learners',
            issue_date: '2025-09-30',
            expiry_date: null,
            credential_id: 'PMP-TRAIN-PL-2025',
            status: 'active'
        }
    ];

    console.log(`Upserting ${certifications.length} certifications...`);
    for (const cert of certifications) {
        const { error } = await supabase.from('certifications').upsert(cert, { onConflict: 'title' });
        if (error) {
            console.error(`Error upserting certification ${cert.title}:`, error);
        } else {
            console.log(`✓ Certification: ${cert.title}`);
        }
    }

    // 5. TIMELINE ENTRY (Update current role to Manager – IT Infra & Network, Grade IS4)
    console.log('Updating current timeline role...');
    const { error: timeErr } = await supabase
        .from('timeline_entries')
        .update({
            title_en: 'Manager – IT Infrastructure & Network',
            organization: 'Surya Nepal Pvt. Ltd. (ITC Subsidiary)',
            description_en: 'Leading enterprise-wide IT Infrastructure, Cloud, and OT Cybersecurity strategy for Surya Nepal Pvt. Ltd. (Grade IS4). Driving flagship transformations including SAP DR migration to Microsoft Azure, Simara Secondary OT Data Centre (IEC 62443 / Claroty CTD), Enterprise AI (Copilot & Sentinel), and multi-site datacenter operations with zero core team attrition and 99.9%+ availability.'
        })
        .eq('year_start', 2016)
        .is('year_end', null);

    if (timeErr) {
        console.error('Error updating timeline entry:', timeErr);
    } else {
        console.log('✓ Updated current role in timeline_entries to Manager – IT Infrastructure & Network (Grade IS4).');
    }

    // 6. EXECUTIVE KPIS (Update initiatives_delivered to 108)
    console.log('Updating executive KPIs...');
    const { error: kpiErr } = await supabase
        .from('executive_kpis')
        .update({ value: '108' })
        .eq('key', 'initiatives_delivered');

    if (kpiErr) {
        console.error('Error updating initiatives_delivered KPI:', kpiErr);
    } else {
        console.log('✓ Updated initiatives_delivered executive KPI to 108.');
    }

    console.log('--- FY 2025-26 Enterprise Data Seeding Completed Successfully! ---');
}

main().catch(err => {
    console.error('Fatal execution error:', err);
    process.exit(1);
});
