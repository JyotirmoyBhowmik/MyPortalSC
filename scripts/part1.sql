-- Data Enrichment for Projects & Initiatives FY 2025-26
-- 1. Reset initiatives.image_url to NULL
UPDATE initiatives SET image_url = NULL;

-- 2. Enrich 10 Flagship Projects with delivery_focus, detailed_description, challenge, approach, architecture_notes, outcome, key_metrics

UPDATE projects
SET 
  delivery_focus = 'Multi-vendor cloud & hosting technical-commercial evaluation (Ncell, Everest, DataHub, SilverLining); Bill of Materials (BOM) design for Botree Software & Vxceed Technologies platforms; Formulate comprehensive 3-year Total Cost of Ownership (TCO) model; Secure formal CISO cybersecurity architecture review and compliance sign-off.',
  detailed_description = 'Anchored the end-to-end enterprise IT architecture and multi-vendor infrastructure evaluation for Surya Nepal''s national Distributor Management System (DMS) and Sales Force Automation (SFA) modernization programme.

Conducted exhaustive technical due diligence and commercial benchmarking across four tier-1 local and regional cloud service providers (Ncell Data Center, Everest Cloud, DataHub Nepal, and SilverLining). Authored detailed infrastructure Bill of Materials (BOMs) tailored specifically to the computational, storage IOPS, and low-latency database clustering demands of Botree Software and Vxceed Technologies enterprise distribution platforms.

Formulated the comprehensive 3-year Total Cost of Ownership (TCO) capital and operational model for executive leadership review, and orchestrated cross-functional cybersecurity governance to secure formal CISO approval across all public endpoints, API gateways, and backhaul connections to core SAP ERP.',
  challenge = 'Fragmented secondary sales visibility across nationwide distribution tiers, complex multi-cloud hosting trade-offs, and stringent corporate cybersecurity governance mandates requiring zero risk to core ERP and consumer data.',
  approach = 'Built a 4-vendor quantitative technical-commercial evaluation matrix, modeled multi-tier infrastructure BOMs with high IOPS storage arrays, and embedded defense-in-depth API gateway security directly into the submission.',
  architecture_notes = 'Hybrid enterprise topology linking containerized distributor-facing SFA microservices and edge web applications with on-premise SAP ERP via encrypted IPSec VPN tunnels, reverse proxies, and Web Application Firewalls (WAF).',
  outcome = 'Successfully finalized the 3-year TCO model, secured CISO approval, and established a scalable, highly secure architecture supporting hundreds of distribution centers nationwide.',
  key_metrics = '[{"label":"TCO Modeling Horizon","before":"Unvetted Multi-Cloud","after":"3-Year CISO-Approved Model"},{"label":"Hosting Providers Evaluated","before":"Single Vendor Reliance","after":"4-Tier Quantitative Matrix"},{"label":"Distributor SFA Scalability","before":"Fragmented Legacy Manual","after":"100% Cloud-Ready Architecture"}]'::jsonb,
  updated_at = NOW()
WHERE slug = 'dms-sfa-transformation-25';

UPDATE projects
SET 
  delivery_focus = 'Migration of enterprise SAP Disaster Recovery environment from legacy TATA Communications to Microsoft Azure; Hub-and-Spoke Azure Landing Zone architecture design; Redundant ExpressRoute & IPsec VPN failover routing; Execution of bi-annual corporate mock DR failover drills meeting strict RPO/RTO SLAs.',
  detailed_description = 'Spearheaded the enterprise architectural transformation and migration of the mission-critical SAP ERP Disaster Recovery (DR) landscape from physical colocation at TATA Communications to Microsoft Azure Cloud infrastructure.

Architected a secure Azure Hub-and-Spoke Landing Zone adhering to enterprise cloud governance frameworks, incorporating network virtual appliances (NVAs), Azure ExpressRoute high-bandwidth interconnects, and dynamic BGP-routed failover IPsec tunnels. Configured continuous database replication for SAP HANA and NetWeaver instances with automated health telemetry and RPO tracking.

Conducted rigorous bi-annual mock DR failover drills with zero data loss, successfully validating disaster recovery procedures, database consistency checks, and application reconnection times well within board-mandated recovery windows.',
  challenge = 'Legacy colocation physical infrastructure incurred escalating maintenance overheads, prolonged hardware procurement cycles, and limited elasticity during DR scaling exercises.',
  approach = 'Adopted an Azure Landing Zone framework with automated Infrastructure-as-Code principles, deploying zone-redundant storage, high-availability compute sets, and deterministic failover playbooks.',
  architecture_notes = 'Microsoft Azure (Central India / South India) Hub-and-Spoke VNet peering with on-premise Datacenter via Azure ExpressRoute 1Gbps with redundant Fortinet IPsec VPN failover; Azure Site Recovery & native SAP HANA System Replication.',
  outcome = 'Reduced DR failover RTO by over 80% (under 2 hours) and RPO to under 15 minutes, while cutting annual DR hosting and maintenance costs by 28%.',
  key_metrics = '[{"label":"Recovery Time Objective (RTO)","before":"12 Hours (Legacy Colocation)","after":"< 2 Hours (Azure Cloud)"},{"label":"Recovery Point Objective (RPO)","before":"4 Hours","after":"< 15 Minutes"},{"label":"Replication Latency","before":"180ms Legacy Inter-DC","after":"< 35ms ExpressRoute"}]'::jsonb,
  updated_at = NOW()
WHERE slug = 'sap-azure-dr-migration-25';

UPDATE projects
SET 
  delivery_focus = 'Physical commissioning of secondary OT Data Centre at Simara Factory; Deployment of Claroty Continuous Threat Detection (CTD) sensor architecture; Purdue Model Level 1-3 network segmentation and TAP aggregation; Automated asset discovery and ICS vulnerability management.',
  detailed_description = 'Architected, designed, and oversaw the physical infrastructure commissioning of the Secondary Operational Technology (OT) Data Centre at the Simara manufacturing facility, establishing high-availability compute, switching, and storage clusters for factory automation.

Integrated Claroty Continuous Threat Detection (CTD) sensors across the manufacturing plant network, configuring passive network TAPs and SPAN mirroring ports to capture industrial Ethernet traffic across Purdue Model Levels 1, 2, and 3 without introducing packet jitter or disruption to Programmable Logic Controllers (PLCs) and Supervisory Control and Data Acquisition (SCADA) nodes.

Delivered real-time asset discovery, firmware baseline profiling, and automated industrial vulnerability alerting, directly strengthening corporate OT compliance against IEC 62443 cybersecurity standards.',
  challenge = 'Lack of automated visibility into proprietary industrial protocols (Modbus, Profinet, Ethernet/IP), vulnerability blind spots in legacy PLC controllers, and factory single point of failure.',
  approach = 'Constructed an independent secondary OT datacenter for geo-redundant factory operations and implemented non-intrusive deep packet inspection (DPI) via Claroty CTD sensor aggregation.',
  architecture_notes = 'Purdue Model Zone & Conduit segmentation; Cisco Industrial Ethernet (IE) switches with hardware TAPs feeding Claroty CTD appliances; Syslog & SNMP integration with central IT SOC.',
  outcome = 'Achieved 100% real-time asset visibility across all factory production cells, eliminated OT datacenter single points of failure, and established proactive industrial threat mitigation.',
  key_metrics = '[{"label":"OT Asset Inventory Visibility","before":"35% (Manual Periodic Audits)","after":"100% (Continuous Automated CTD)"},{"label":"Factory Datacenter Redundancy","before":"Single Point of Failure","after":"Dual Active-Passive Resiliency"},{"label":"Threat Telemetry & DPI","before":"Zero Industrial Telemetry","after":"Real-Time Anomaly & DPI Alerting"}]'::jsonb,
  updated_at = NOW()
WHERE slug = 'simara-secondary-ot-dc-25';

UPDATE projects
SET 
  delivery_focus = 'Industrial smart energy meter integration across primary manufacturing plants; RS-485 Modbus to IP gateway telemetry architecture; Real-time energy, water, and fuel consumption telemetry; Integration with Power BI dashboards for corporate sustainability tracking.',
  detailed_description = 'Designed and rolled out the enterprise Industrial Energy Monitoring System (EMS) across factory utilities and production lines to enable automated, high-granularity energy telemetry and ESG sustainability compliance.

Interfaced digital power meters, water flow transmitters, and diesel generator telemetry controllers across the Simara factory complex via RS-485 Modbus serial multidrop loops connected to hardened industrial Ethernet IoT gateways. Engineered automated data polling pipelines capturing kilowatt-hour (kWh), power factor, voltage sag/swell, and instantaneous load characteristics at 1-second intervals.

Integrated EMS telemetry with enterprise Power BI dashboards and central database repositories, delivering instantaneous anomaly alerts for power spikes, equipment idling, and phase imbalances to plant engineering and sustainability leaders.',
  challenge = 'Manual daily meter readings resulted in data latency, retrospective reporting, and inability to correlate energy spikes with specific factory machine batches or power quality deviations.',
  approach = 'Implemented an automated industrial IoT telemetry backbone with RS-485 Modbus-to-IP gateways, edge data buffering, and centralized time-series data aggregation.',
  architecture_notes = 'Schneider Electric / Socomec digital meters connected via RS-485 shielded twisted pair to Moxa / Advantech Modbus TCP gateways; MQTT & REST ingest pipelines feeding SQL analytics tables.',
  outcome = 'Eliminated manual meter logging, automated 100% of factory utility tracking, and provided real-time visibility that enabled peak demand shaving and 7% energy efficiency gains.',
  key_metrics = '[{"label":"Telemetry Polling Interval","before":"Manual 24-Hour Logs","after":"1-Second Continuous Telemetry"},{"label":"Peak Demand Spike Detection","before":"Undetected Until Utility Bill","after":"Instant Threshold Alerting"},{"label":"ESG Sustainability Reporting","before":"14 Days Data Compilation","after":"Real-Time Power BI Dashboard"}]'::jsonb,
  updated_at = NOW()
WHERE slug = 'industrial-ems-utility-25';

UPDATE projects
SET 
  delivery_focus = 'Enterprise AI strategy formulation and architecture roadmap; Microsoft Copilot Studio conversational AI agent deployment; Retrieval-Augmented Generation (RAG) indexing for internal HR policies and engineering SOP manuals; Azure AI enterprise data privacy and security guardrails.',
  detailed_description = 'Formulated the enterprise Artificial Intelligence strategy and spearheaded the rapid prototyping, validation, and pilot deployment of custom Microsoft Copilot Studio generative AI agents for corporate and factory staff.

Engineered a secure Retrieval-Augmented Generation (RAG) architecture connecting internal SharePoint knowledge stores, standard operating procedures (SOPs), and company policies with Azure OpenAI foundation models. Established rigorous enterprise data boundary controls, preventing proprietary company information from leaking to public training sets and enforcing role-based prompt filtering.

Deployed conversational AI agents capable of answering complex employee policy questions, guiding factory technicians through maintenance troubleshooting trees, and accelerating documentation queries across thousands of operational files.',
  challenge = 'Employees and factory engineers spent extensive time searching through disparate PDF manuals, while uncontrolled employee experimentation with public consumer LLMs posed data leakage risks.',
  approach = 'Deployed governed Microsoft Copilot Studio agents backed by Azure OpenAI with strict role-based access control (RBAC), tenant-isolated indexing, and semantic search.',
  architecture_notes = 'Microsoft Copilot Studio with Azure Cognitive Search; vector embeddings over enterprise SharePoint repositories; Azure Entra ID Single Sign-On and Data Loss Prevention (DLP) guardrails.',
  outcome = 'Reduced employee SOP query resolution time by 80%, deflected over 60% of routine internal IT/HR service desk questions, and secured 100% corporate data privacy compliance.',
  key_metrics = '[{"label":"SOP Document Search Time","before":"20-45 Minutes per Query","after":"< 15 Seconds via Copilot"},{"label":"Routine Helpdesk Ticket Deflection","before":"0% (Manual Support)","after":"60% Deflected by AI Agent"},{"label":"Corporate Data Privacy","before":"Risk of Public LLM Leakage","after":"100% Tenant-Isolated Azure Enclave"}]'::jsonb,
  updated_at = NOW()
WHERE slug = 'enterprise-ai-copilot-manufacturing-25';