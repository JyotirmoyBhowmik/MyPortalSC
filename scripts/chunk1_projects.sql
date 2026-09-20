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

UPDATE projects
SET 
  delivery_focus = 'End-to-end physical infrastructure lifecycle assessment of primary Tier-III datacenter; Modular UPS battery bank upgrade and runtime calibration; Precision Air Conditioning (PAC) airflow optimization and thermal CFD validation; Smart rack PDU telemetry and environmental sensor rollout.',
  detailed_description = 'Executed a comprehensive physical infrastructure modernization and lifecycle assessment of the primary enterprise Tier-III datacenter, ensuring continuous operational reliability for mission-critical ERP and factory workloads.

Oversaw the hot-swap replacement and runtime calibration of modular uninterruptible power supply (UPS) battery banks, configuring dual-feed N+1 redundancy across all server racks. Re-engineered datacenter Precision Air Conditioning (PAC) airflow distributions, sealing cold-aisle containment gaps and calibrating chilled water setpoints based on thermal computational fluid dynamics (CFD) assessments.

Installed intelligent networked power distribution units (iPDUs) and environmental temperature/humidity sensors across every cabinet, feeding real-time SNMP telemetry into centralized infrastructure monitoring dashboards.',
  challenge = 'Aging UPS battery strings, localized thermal hot spots in high-density virtualization racks, and absence of per-rack power consumption telemetry created operational downtime risks.',
  approach = 'Formulated a comprehensive lifecycle assessment and executed phased, non-disruptive upgrades during off-peak windows with continuous dual-bus power bypass safeguards.',
  architecture_notes = 'Schneider Electric / Vertiv modular UPS systems with N+1 battery strings; in-row PAC units with smart variable speed EC fans; networked IPDUs with per-outlet metering.',
  outcome = 'Secured 99.99% physical facility uptime, stabilized datacenter cold aisle temperatures to < 21°C uniformly, and increased battery backup autonomy under full load by 45%.',
  key_metrics = '[{"label":"UPS Battery Autonomy Under Load","before":"18 Minutes (Degraded)","after":"45+ Minutes (Calibrated)"},{"label":"Cold Aisle Thermal Variation","before":"±6.5°C Temperature Spikes","after":"< 1.2°C Uniform Cold Aisle"},{"label":"Facility Uptime Performance","before":"99.85%","after":"99.99% Tier-III Compliant"}]'::jsonb,
  updated_at = NOW()
WHERE slug = 'dc-physical-infrastructure-upgrade-25';

UPDATE projects
SET 
  delivery_focus = 'Enterprise Microsoft Enterprise Agreement (EA) & VMware vSphere multi-year mega-renewal negotiations; Broadcom VMware per-core licensing restructuring assessment; Optimization and rightsizing of virtual core allocations; Long-term technology roadmap alignment.',
  detailed_description = 'Led the complex commercial negotiations, technical capacity audit, and contract structuring for Surya Nepal''s multi-year enterprise mega-renewal covering Microsoft 365 / Azure enterprise agreements and VMware vSphere virtualization licensing suites.

Conducted a thorough technical audit of the virtualization estate following Broadcom''s acquisition and licensing model restructuring from per-socket to per-core subscriptions. Analyzed CPU core allocations, VM density ratios, and hardware cluster efficiency across all physical ESXi hosts, rightsizing processor assignments and retiring decommissioned nodes to contain software licensing costs.

Successfully benchmarked vendor proposals against global enterprise standards, securing multi-million rupee operational savings while ensuring continuous premier support, security patching, and product roadmap continuity.',
  challenge = 'Broadcom licensing model restructuring posed a 45%+ potential software renewal cost increase alongside complex multi-year enterprise agreement transitions for Microsoft cloud services.',
  approach = 'Conducted rigorous processor core utilization benchmarking, consolidated underutilized VM workloads to maximize per-core licensing value, and negotiated bundled support tiers.',
  architecture_notes = 'Enterprise virtualization spanning VMware vSphere ESXi clusters, vCenter Server, and Microsoft Entra ID / Microsoft 365 E3/E5 tenant licensing with Azure hybrid benefits.',
  outcome = 'Contained licensing cost escalation, achieving an 18% net savings against projected renewal budget while maintaining 100% compliant software licensing across all enterprise clusters.',
  key_metrics = '[{"label":"Licensing Renewal Cost Variance","before":"+45% Projected Spike","after":"18% Net Cost Reduction"},{"label":"Cluster Core Allocation Efficiency","before":"62% Core Utilization","after":"91% Rightsized Optimization"},{"label":"License Compliance Posture","before":"Audit Exposure Risk","after":"100% Clean Certified Position"}]'::jsonb,
  updated_at = NOW()
WHERE slug = 'microsoft-vmware-mega-renewal-25';

UPDATE projects
SET 
  delivery_focus = 'Centralized enterprise micro-learning and SOP repository portal (kb.snpl.com.np); High-performance, mobile-responsive web architecture; Single Sign-On (SSO) integration with Microsoft Entra ID; Video streaming and interactive knowledge validation modules.',
  detailed_description = 'Envisioned, architected, and deployed the official SNPL Knowledge Bites digital platform (kb.snpl.com.np), creating a centralized, modern repository for employee micro-learning, technical standard operating procedures (SOPs), and company knowledge artifacts.

Designed a responsive, cloud-hosted web application engineered for high concurrency and low latency across corporate offices, factories, and remote sales personnel. Integrated seamless Single Sign-On (SSO) authentication via Microsoft Entra ID with granular role-based access control (RBAC) ensuring proprietary operational SOPs remain strictly protected.

Implemented adaptive video streaming pipelines, downloadable technical documentation, and interactive comprehension quizzes that enable department leads to track training completions and operational compliance.',
  challenge = 'Operational knowledge and technical SOPs were locked in siloed intranet directories, outdated shared folders, and paper manuals with zero tracking of user comprehension.',
  approach = 'Built a responsive, cloud-native web portal with video delivery pipelines, full-text indexing, and automated Single Sign-On integration.',
  architecture_notes = 'Next.js / Node.js web architecture; Microsoft Entra ID OIDC / SAML SSO; secure cloud storage with CDN caching and role-based ACLs; PostgreSQL metadata database.',
  outcome = 'Successfully launched kb.snpl.com.np with 99.95% availability, accelerating employee onboarding times from 3 weeks to under 7 days and digitizing 150+ operational SOPs.',
  key_metrics = '[{"label":"Employee Onboarding Ramp-up","before":"21 Days (Manual Shadowing)","after":"7 Days (Interactive Modules)"},{"label":"Digitized SOP Accessibility","before":"Fragmented File Shares","after":"100% Searchable Digital Portal"},{"label":"Platform Availability SLA","before":"N/A (Legacy System)","after":"99.95% Continuous Uptime"}]'::jsonb,
  updated_at = NOW()
WHERE slug = 'snpl-knowledge-bites-portal-25';

UPDATE projects
SET 
  delivery_focus = 'Automated network configuration management and firmware patching pipeline; Ansible Semaphore web orchestration interface; Automated pre-flight validation, running-config diff archiving, and post-flight connectivity verification; Zero-downtime rolling firmware updates across 100+ switches.',
  detailed_description = 'Architected and implemented an enterprise-grade automated network configuration management and firmware patching pipeline utilizing Ansible and Ansible Semaphore web UI across Surya Nepal''s campus and factory networks.

Authored modular Ansible playbooks targeting Cisco Catalyst and industrial switches to automate routine maintenance tasks: configuration backups, NTP synchronization, AAA security hardening, and OS firmware upgrades. Embedded rigorous pre-check assertions (interface status, BGP/OSPF peer validation, flash space verification) and post-check rollback playbooks that automatically abort and restore switch configs in the event of anomalies.

Eliminated manual CLI switch configurations, transforming quarterly maintenance windows from high-risk weekend outages into predictable, automated rolling deployments with full audit logging in Git.',
  challenge = 'Manual switch-by-switch CLI configuration and firmware updates across 100+ access and distribution switches resulted in configuration drift, human error, and prolonged weekend downtime.',
  approach = 'Adopted Infrastructure-as-Code for enterprise networking using Ansible Semaphore, version-controlling all network configurations in Git with automated compliance assertions.',
  architecture_notes = 'Ansible Semaphore orchestration engine; Git version control for switch configurations; Python Netmiko/Paramiko libraries; SSH public-key authentication with TACACS+ audit logging.',
  outcome = 'Cut switch patching duration from 45 minutes per unit to under 4 minutes, reduced configuration drift incidents to zero, and established automated nightly configuration diff archiving.',
  key_metrics = '[{"label":"Switch Patching Duration / Unit","before":"45 Minutes (Manual CLI)","after":"< 4 Minutes (Automated)"},{"label":"Configuration Drift & Human Errors","before":"8-12% Drift Incidents","after":"0% (Enforced Git Source of Truth)"},{"label":"Nightly Backup Automation","before":"Manual Monthly TFTP Backups","after":"100% Automated Git Snapshots"}]'::jsonb,
  updated_at = NOW()
WHERE slug = 'ansible-network-patching-25';

UPDATE projects
SET 
  delivery_focus = 'Enterprise WAN and International Private Leased Circuit (IPLC) bandwidth rightsizing; Multi-vendor competitive renegotiation across Tier-1 telco providers; Dynamic SD-WAN path selection and QoS traffic prioritization; 22% recurring operational cost reduction.',
  detailed_description = 'Spearheaded the enterprise WAN cost optimization, bandwidth rightsizing, and international connectivity modernization programme connecting headquarters, regional sales branches, and manufacturing plants across Nepal and India.

Conducted comprehensive NetFlow and DPI traffic analytics across enterprise circuits, identifying bandwidth bottlenecks, over-provisioned links, and latency anomalies. Led aggressive commercial and SLA renegotiations across primary telecom providers (Nepal Telecom, Ncell, and Tata Communications), leveraging multi-vendor competition to double link bandwidth capacities while achieving substantial tariff reductions.

Configured intelligent SD-WAN path-selection and Quality of Service (QoS) traffic prioritization policies, guaranteeing dedicated low-latency bandwidth for mission-critical SAP ERP transactions and enterprise VoIP while routing general web traffic over secondary commodity links.',
  challenge = 'Legacy point-to-point leased lines and escalating IPLC cross-border bandwidth costs created high operational overhead with asymmetric circuit utilization and limited automated failover.',
  approach = 'Analyzed granular NetFlow traffic patterns, rationalized bandwidth allocations, and restructured telecommunication contracts with aggressive multi-carrier competitive bidding.',
  architecture_notes = 'Dual-carrier SD-WAN topology (Nepal Telecom fiber + Ncell high-capacity microwave); Fortinet / Cisco SD-WAN controllers with IPsec encryption; DSCP QoS tagging for SAP ERP and SIP.',
  outcome = 'Secured an annual recurring WAN operational expenditure reduction of 22% while doubling circuit bandwidth and achieving 99.95% WAN network availability.',
  key_metrics = '[{"label":"Annual WAN Operating Expenditure","before":"Baseline Budget Spend","after":"22% Recurring Net Reduction"},{"label":"Enterprise Bandwidth Capacity","before":"100 Mbps Shared Uplink","after":"250 Mbps Redundant Fiber"},{"label":"WAN Network Availability SLA","before":"99.5% with Outage Risks","after":"99.95% Dual Active-Active"}]'::jsonb,
  updated_at = NOW()
WHERE slug = 'enterprise-wan-cost-optimization-25';

