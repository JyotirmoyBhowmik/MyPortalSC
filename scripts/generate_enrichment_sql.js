const fs = require('fs');
const path = require('path');

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + str.replace(/'/g, "''") + "'";
}

let sql = `-- Data Enrichment for Projects & Initiatives FY 2025-26
-- 1. Reset initiatives.image_url to NULL
UPDATE initiatives SET image_url = NULL;

-- 2. Enrich 10 Flagship Projects with delivery_focus, detailed_description, challenge, approach, architecture_notes, outcome, key_metrics
`;

const projectsToUpdate = [
  {
    slug: 'dms-sfa-transformation-25',
    delivery_focus: 'Multi-vendor cloud & hosting technical-commercial evaluation (Ncell, Everest, DataHub, SilverLining); Bill of Materials (BOM) design for Botree Software & Vxceed Technologies platforms; Formulate comprehensive 3-year Total Cost of Ownership (TCO) model; Secure formal CISO cybersecurity architecture review and compliance sign-off.',
    detailed_description: `Anchored the end-to-end enterprise IT architecture and multi-vendor infrastructure evaluation for Surya Nepal's national Distributor Management System (DMS) and Sales Force Automation (SFA) modernization programme.

Conducted exhaustive technical due diligence and commercial benchmarking across four tier-1 local and regional cloud service providers (Ncell Data Center, Everest Cloud, DataHub Nepal, and SilverLining). Authored detailed infrastructure Bill of Materials (BOMs) tailored specifically to the computational, storage IOPS, and low-latency database clustering demands of Botree Software and Vxceed Technologies enterprise distribution platforms.

Formulated the comprehensive 3-year Total Cost of Ownership (TCO) capital and operational model for executive leadership review, and orchestrated cross-functional cybersecurity governance to secure formal CISO approval across all public endpoints, API gateways, and backhaul connections to core SAP ERP.`,
    challenge: 'Fragmented secondary sales visibility across nationwide distribution tiers, complex multi-cloud hosting trade-offs, and stringent corporate cybersecurity governance mandates requiring zero risk to core ERP and consumer data.',
    approach: 'Built a 4-vendor quantitative technical-commercial evaluation matrix, modeled multi-tier infrastructure BOMs with high IOPS storage arrays, and embedded defense-in-depth API gateway security directly into the submission.',
    architecture_notes: 'Hybrid enterprise topology linking containerized distributor-facing SFA microservices and edge web applications with on-premise SAP ERP via encrypted IPSec VPN tunnels, reverse proxies, and Web Application Firewalls (WAF).',
    outcome: 'Successfully finalized the 3-year TCO model, secured CISO approval, and established a scalable, highly secure architecture supporting hundreds of distribution centers nationwide.',
    key_metrics: [
      { label: 'TCO Modeling Horizon', before: 'Unvetted Multi-Cloud', after: '3-Year CISO-Approved Model' },
      { label: 'Hosting Providers Evaluated', before: 'Single Vendor Reliance', after: '4-Tier Quantitative Matrix' },
      { label: 'Distributor SFA Scalability', before: 'Fragmented Legacy Manual', after: '100% Cloud-Ready Architecture' }
    ]
  },
  {
    slug: 'sap-azure-dr-migration-25',
    delivery_focus: 'Migration of enterprise SAP Disaster Recovery environment from legacy TATA Communications to Microsoft Azure; Hub-and-Spoke Azure Landing Zone architecture design; Redundant ExpressRoute & IPsec VPN failover routing; Execution of bi-annual corporate mock DR failover drills meeting strict RPO/RTO SLAs.',
    detailed_description: `Spearheaded the enterprise architectural transformation and migration of the mission-critical SAP ERP Disaster Recovery (DR) landscape from physical colocation at TATA Communications to Microsoft Azure Cloud infrastructure.

Architected a secure Azure Hub-and-Spoke Landing Zone adhering to enterprise cloud governance frameworks, incorporating network virtual appliances (NVAs), Azure ExpressRoute high-bandwidth interconnects, and dynamic BGP-routed failover IPsec tunnels. Configured continuous database replication for SAP HANA and NetWeaver instances with automated health telemetry and RPO tracking.

Conducted rigorous bi-annual mock DR failover drills with zero data loss, successfully validating disaster recovery procedures, database consistency checks, and application reconnection times well within board-mandated recovery windows.`,
    challenge: 'Legacy colocation physical infrastructure incurred escalating maintenance overheads, prolonged hardware procurement cycles, and limited elasticity during DR scaling exercises.',
    approach: 'Adopted an Azure Landing Zone framework with automated Infrastructure-as-Code principles, deploying zone-redundant storage, high-availability compute sets, and deterministic failover playbooks.',
    architecture_notes: 'Microsoft Azure (Central India / South India) Hub-and-Spoke VNet peering with on-premise Datacenter via Azure ExpressRoute 1Gbps with redundant Fortinet IPsec VPN failover; Azure Site Recovery & native SAP HANA System Replication.',
    outcome: 'Reduced DR failover RTO by over 80% (under 2 hours) and RPO to under 15 minutes, while cutting annual DR hosting and maintenance costs by 28%.',
    key_metrics: [
      { label: 'Recovery Time Objective (RTO)', before: '12 Hours (Legacy Colocation)', after: '< 2 Hours (Azure Cloud)' },
      { label: 'Recovery Point Objective (RPO)', before: '4 Hours', after: '< 15 Minutes' },
      { label: 'Replication Latency', before: '180ms Legacy Inter-DC', after: '< 35ms ExpressRoute' }
    ]
  },
  {
    slug: 'simara-secondary-ot-dc-25',
    delivery_focus: 'Physical commissioning of secondary OT Data Centre at Simara Factory; Deployment of Claroty Continuous Threat Detection (CTD) sensor architecture; Purdue Model Level 1-3 network segmentation and TAP aggregation; Automated asset discovery and ICS vulnerability management.',
    detailed_description: `Architected, designed, and oversaw the physical infrastructure commissioning of the Secondary Operational Technology (OT) Data Centre at the Simara manufacturing facility, establishing high-availability compute, switching, and storage clusters for factory automation.

Integrated Claroty Continuous Threat Detection (CTD) sensors across the manufacturing plant network, configuring passive network TAPs and SPAN mirroring ports to capture industrial Ethernet traffic across Purdue Model Levels 1, 2, and 3 without introducing packet jitter or disruption to Programmable Logic Controllers (PLCs) and Supervisory Control and Data Acquisition (SCADA) nodes.

Delivered real-time asset discovery, firmware baseline profiling, and automated industrial vulnerability alerting, directly strengthening corporate OT compliance against IEC 62443 cybersecurity standards.`,
    challenge: 'Lack of automated visibility into proprietary industrial protocols (Modbus, Profinet, Ethernet/IP), vulnerability blind spots in legacy PLC controllers, and factory single point of failure.',
    approach: 'Constructed an independent secondary OT datacenter for geo-redundant factory operations and implemented non-intrusive deep packet inspection (DPI) via Claroty CTD sensor aggregation.',
    architecture_notes: 'Purdue Model Zone & Conduit segmentation; Cisco Industrial Ethernet (IE) switches with hardware TAPs feeding Claroty CTD appliances; Syslog & SNMP integration with central IT SOC.',
    outcome: 'Achieved 100% real-time asset visibility across all factory production cells, eliminated OT datacenter single points of failure, and established proactive industrial threat mitigation.',
    key_metrics: [
      { label: 'OT Asset Inventory Visibility', before: '35% (Manual Periodic Audits)', after: '100% (Continuous Automated CTD)' },
      { label: 'Factory Datacenter Redundancy', before: 'Single Point of Failure', after: 'Dual Active-Passive Resiliency' },
      { label: 'Threat Telemetry & DPI', before: 'Zero Industrial Telemetry', after: 'Real-Time Anomaly & DPI Alerting' }
    ]
  },
  {
    slug: 'industrial-ems-utility-25',
    delivery_focus: 'Industrial smart energy meter integration across primary manufacturing plants; RS-485 Modbus to IP gateway telemetry architecture; Real-time energy, water, and fuel consumption telemetry; Integration with Power BI dashboards for corporate sustainability tracking.',
    detailed_description: `Designed and rolled out the enterprise Industrial Energy Monitoring System (EMS) across factory utilities and production lines to enable automated, high-granularity energy telemetry and ESG sustainability compliance.

Interfaced digital power meters, water flow transmitters, and diesel generator telemetry controllers across the Simara factory complex via RS-485 Modbus serial multidrop loops connected to hardened industrial Ethernet IoT gateways. Engineered automated data polling pipelines capturing kilowatt-hour (kWh), power factor, voltage sag/swell, and instantaneous load characteristics at 1-second intervals.

Integrated EMS telemetry with enterprise Power BI dashboards and central database repositories, delivering instantaneous anomaly alerts for power spikes, equipment idling, and phase imbalances to plant engineering and sustainability leaders.`,
    challenge: 'Manual daily meter readings resulted in data latency, retrospective reporting, and inability to correlate energy spikes with specific factory machine batches or power quality deviations.',
    approach: 'Implemented an automated industrial IoT telemetry backbone with RS-485 Modbus-to-IP gateways, edge data buffering, and centralized time-series data aggregation.',
    architecture_notes: 'Schneider Electric / Socomec digital meters connected via RS-485 shielded twisted pair to Moxa / Advantech Modbus TCP gateways; MQTT & REST ingest pipelines feeding SQL analytics tables.',
    outcome: 'Eliminated manual meter logging, automated 100% of factory utility tracking, and provided real-time visibility that enabled peak demand shaving and 7% energy efficiency gains.',
    key_metrics: [
      { label: 'Telemetry Polling Interval', before: 'Manual 24-Hour Logs', after: '1-Second Continuous Telemetry' },
      { label: 'Peak Demand Spike Detection', before: 'Undetected Until Utility Bill', after: 'Instant Threshold Alerting' },
      { label: 'ESG Sustainability Reporting', before: '14 Days Data Compilation', after: 'Real-Time Power BI Dashboard' }
    ]
  },
  {
    slug: 'enterprise-ai-copilot-manufacturing-25',
    delivery_focus: 'Enterprise AI strategy formulation and architecture roadmap; Microsoft Copilot Studio conversational AI agent deployment; Retrieval-Augmented Generation (RAG) indexing for internal HR policies and engineering SOP manuals; Azure AI enterprise data privacy and security guardrails.',
    detailed_description: `Formulated the enterprise Artificial Intelligence strategy and spearheaded the rapid prototyping, validation, and pilot deployment of custom Microsoft Copilot Studio generative AI agents for corporate and factory staff.

Engineered a secure Retrieval-Augmented Generation (RAG) architecture connecting internal SharePoint knowledge stores, standard operating procedures (SOPs), and company policies with Azure OpenAI foundation models. Established rigorous enterprise data boundary controls, preventing proprietary company information from leaking to public training sets and enforcing role-based prompt filtering.

Deployed conversational AI agents capable of answering complex employee policy questions, guiding factory technicians through maintenance troubleshooting trees, and accelerating documentation queries across thousands of operational files.`,
    challenge: 'Employees and factory engineers spent extensive time searching through disparate PDF manuals, while uncontrolled employee experimentation with public consumer LLMs posed data leakage risks.',
    approach: 'Deployed governed Microsoft Copilot Studio agents backed by Azure OpenAI with strict role-based access control (RBAC), tenant-isolated indexing, and semantic search.',
    architecture_notes: 'Microsoft Copilot Studio with Azure Cognitive Search; vector embeddings over enterprise SharePoint repositories; Azure Entra ID Single Sign-On and Data Loss Prevention (DLP) guardrails.',
    outcome: 'Reduced employee SOP query resolution time by 80%, deflected over 60% of routine internal IT/HR service desk questions, and secured 100% corporate data privacy compliance.',
    key_metrics: [
      { label: 'SOP Document Search Time', before: '20-45 Minutes per Query', after: '< 15 Seconds via Copilot' },
      { label: 'Routine Helpdesk Ticket Deflection', before: '0% (Manual Support)', after: '60% Deflected by AI Agent' },
      { label: 'Corporate Data Privacy', before: 'Risk of Public LLM Leakage', after: '100% Tenant-Isolated Azure Enclave' }
    ]
  },
  {
    slug: 'dc-physical-infrastructure-upgrade-25',
    delivery_focus: 'End-to-end physical infrastructure lifecycle assessment of primary Tier-III datacenter; Modular UPS battery bank upgrade and runtime calibration; Precision Air Conditioning (PAC) airflow optimization and thermal CFD validation; Smart rack PDU telemetry and environmental sensor rollout.',
    detailed_description: `Executed a comprehensive physical infrastructure modernization and lifecycle assessment of the primary enterprise Tier-III datacenter, ensuring continuous operational reliability for mission-critical ERP and factory workloads.

Oversaw the hot-swap replacement and runtime calibration of modular uninterruptible power supply (UPS) battery banks, configuring dual-feed N+1 redundancy across all server racks. Re-engineered datacenter Precision Air Conditioning (PAC) airflow distributions, sealing cold-aisle containment gaps and calibrating chilled water setpoints based on thermal computational fluid dynamics (CFD) assessments.

Installed intelligent networked power distribution units (iPDUs) and environmental temperature/humidity sensors across every cabinet, feeding real-time SNMP telemetry into centralized infrastructure monitoring dashboards.`,
    challenge: 'Aging UPS battery strings, localized thermal hot spots in high-density virtualization racks, and absence of per-rack power consumption telemetry created operational downtime risks.',
    approach: 'Formulated a comprehensive lifecycle assessment and executed phased, non-disruptive upgrades during off-peak windows with continuous dual-bus power bypass safeguards.',
    architecture_notes: 'Schneider Electric / Vertiv modular UPS systems with N+1 battery strings; in-row PAC units with smart variable speed EC fans; networked IPDUs with per-outlet metering.',
    outcome: 'Secured 99.99% physical facility uptime, stabilized datacenter cold aisle temperatures to < 21°C uniformly, and increased battery backup autonomy under full load by 45%.',
    key_metrics: [
      { label: 'UPS Battery Autonomy Under Load', before: '18 Minutes (Degraded)', after: '45+ Minutes (Calibrated)' },
      { label: 'Cold Aisle Thermal Variation', before: '±6.5°C Temperature Spikes', after: '< 1.2°C Uniform Cold Aisle' },
      { label: 'Facility Uptime Performance', before: '99.85%', after: '99.99% Tier-III Compliant' }
    ]
  },
  {
    slug: 'microsoft-vmware-mega-renewal-25',
    delivery_focus: 'Enterprise Microsoft Enterprise Agreement (EA) & VMware vSphere multi-year mega-renewal negotiations; Broadcom VMware per-core licensing restructuring assessment; Optimization and rightsizing of virtual core allocations; Long-term technology roadmap alignment.',
    detailed_description: `Led the complex commercial negotiations, technical capacity audit, and contract structuring for Surya Nepal's multi-year enterprise mega-renewal covering Microsoft 365 / Azure enterprise agreements and VMware vSphere virtualization licensing suites.

Conducted a thorough technical audit of the virtualization estate following Broadcom's acquisition and licensing model restructuring from per-socket to per-core subscriptions. Analyzed CPU core allocations, VM density ratios, and hardware cluster efficiency across all physical ESXi hosts, rightsizing processor assignments and retiring decommissioned nodes to contain software licensing costs.

Successfully benchmarked vendor proposals against global enterprise standards, securing multi-million rupee operational savings while ensuring continuous premier support, security patching, and product roadmap continuity.`,
    challenge: 'Broadcom licensing model restructuring posed a 45%+ potential software renewal cost increase alongside complex multi-year enterprise agreement transitions for Microsoft cloud services.',
    approach: 'Conducted rigorous processor core utilization benchmarking, consolidated underutilized VM workloads to maximize per-core licensing value, and negotiated bundled support tiers.',
    architecture_notes: 'Enterprise virtualization spanning VMware vSphere ESXi clusters, vCenter Server, and Microsoft Entra ID / Microsoft 365 E3/E5 tenant licensing with Azure hybrid benefits.',
    outcome: 'Contained licensing cost escalation, achieving an 18% net savings against projected renewal budget while maintaining 100% compliant software licensing across all enterprise clusters.',
    key_metrics: [
      { label: 'Licensing Renewal Cost Variance', before: '+45% Projected Spike', after: '18% Net Cost Reduction' },
      { label: 'Cluster Core Allocation Efficiency', before: '62% Core Utilization', after: '91% Rightsized Optimization' },
      { label: 'License Compliance Posture', before: 'Audit Exposure Risk', after: '100% Clean Certified Position' }
    ]
  },
  {
    slug: 'snpl-knowledge-bites-portal-25',
    delivery_focus: 'Centralized enterprise micro-learning and SOP repository portal (kb.snpl.com.np); High-performance, mobile-responsive web architecture; Single Sign-On (SSO) integration with Microsoft Entra ID; Video streaming and interactive knowledge validation modules.',
    detailed_description: `Envisioned, architected, and deployed the official SNPL Knowledge Bites digital platform (kb.snpl.com.np), creating a centralized, modern repository for employee micro-learning, technical standard operating procedures (SOPs), and company knowledge artifacts.

Designed a responsive, cloud-hosted web application engineered for high concurrency and low latency across corporate offices, factories, and remote sales personnel. Integrated seamless Single Sign-On (SSO) authentication via Microsoft Entra ID with granular role-based access control (RBAC) ensuring proprietary operational SOPs remain strictly protected.

Implemented adaptive video streaming pipelines, downloadable technical documentation, and interactive comprehension quizzes that enable department leads to track training completions and operational compliance.`,
    challenge: 'Operational knowledge and technical SOPs were locked in siloed intranet directories, outdated shared folders, and paper manuals with zero tracking of user comprehension.',
    approach: 'Built a responsive, cloud-native web portal with video delivery pipelines, full-text indexing, and automated Single Sign-On integration.',
    architecture_notes: 'Next.js / Node.js web architecture; Microsoft Entra ID OIDC / SAML SSO; secure cloud storage with CDN caching and role-based ACLs; PostgreSQL metadata database.',
    outcome: 'Successfully launched kb.snpl.com.np with 99.95% availability, accelerating employee onboarding times from 3 weeks to under 7 days and digitizing 150+ operational SOPs.',
    key_metrics: [
      { label: 'Employee Onboarding Ramp-up', before: '21 Days (Manual Shadowing)', after: '7 Days (Interactive Modules)' },
      { label: 'Digitized SOP Accessibility', before: 'Fragmented File Shares', after: '100% Searchable Digital Portal' },
      { label: 'Platform Availability SLA', before: 'N/A (Legacy System)', after: '99.95% Continuous Uptime' }
    ]
  },
  {
    slug: 'ansible-network-patching-25',
    delivery_focus: 'Automated network configuration management and firmware patching pipeline; Ansible Semaphore web orchestration interface; Automated pre-flight validation, running-config diff archiving, and post-flight connectivity verification; Zero-downtime rolling firmware updates across 100+ switches.',
    detailed_description: `Architected and implemented an enterprise-grade automated network configuration management and firmware patching pipeline utilizing Ansible and Ansible Semaphore web UI across Surya Nepal's campus and factory networks.

Authored modular Ansible playbooks targeting Cisco Catalyst and industrial switches to automate routine maintenance tasks: configuration backups, NTP synchronization, AAA security hardening, and OS firmware upgrades. Embedded rigorous pre-check assertions (interface status, BGP/OSPF peer validation, flash space verification) and post-check rollback playbooks that automatically abort and restore switch configs in the event of anomalies.

Eliminated manual CLI switch configurations, transforming quarterly maintenance windows from high-risk weekend outages into predictable, automated rolling deployments with full audit logging in Git.`,
    challenge: 'Manual switch-by-switch CLI configuration and firmware updates across 100+ access and distribution switches resulted in configuration drift, human error, and prolonged weekend downtime.',
    approach: 'Adopted Infrastructure-as-Code for enterprise networking using Ansible Semaphore, version-controlling all network configurations in Git with automated compliance assertions.',
    architecture_notes: 'Ansible Semaphore orchestration engine; Git version control for switch configurations; Python Netmiko/Paramiko libraries; SSH public-key authentication with TACACS+ audit logging.',
    outcome: 'Cut switch patching duration from 45 minutes per unit to under 4 minutes, reduced configuration drift incidents to zero, and established automated nightly configuration diff archiving.',
    key_metrics: [
      { label: 'Switch Patching Duration / Unit', before: '45 Minutes (Manual CLI)', after: '< 4 Minutes (Automated)' },
      { label: 'Configuration Drift & Human Errors', before: '8-12% Drift Incidents', after: '0% (Enforced Git Source of Truth)' },
      { label: 'Nightly Backup Automation', before: 'Manual Monthly TFTP Backups', after: '100% Automated Git Snapshots' }
    ]
  },
  {
    slug: 'enterprise-wan-cost-optimization-25',
    delivery_focus: 'Enterprise WAN and International Private Leased Circuit (IPLC) bandwidth rightsizing; Multi-vendor competitive renegotiation across Tier-1 telco providers; Dynamic SD-WAN path selection and QoS traffic prioritization; 22% recurring operational cost reduction.',
    detailed_description: `Spearheaded the enterprise WAN cost optimization, bandwidth rightsizing, and international connectivity modernization programme connecting headquarters, regional sales branches, and manufacturing plants across Nepal and India.

Conducted comprehensive NetFlow and DPI traffic analytics across enterprise circuits, identifying bandwidth bottlenecks, over-provisioned links, and latency anomalies. Led aggressive commercial and SLA renegotiations across primary telecom providers (Nepal Telecom, Ncell, and Tata Communications), leveraging multi-vendor competition to double link bandwidth capacities while achieving substantial tariff reductions.

Configured intelligent SD-WAN path-selection and Quality of Service (QoS) traffic prioritization policies, guaranteeing dedicated low-latency bandwidth for mission-critical SAP ERP transactions and enterprise VoIP while routing general web traffic over secondary commodity links.`,
    challenge: 'Legacy point-to-point leased lines and escalating IPLC cross-border bandwidth costs created high operational overhead with asymmetric circuit utilization and limited automated failover.',
    approach: 'Analyzed granular NetFlow traffic patterns, rationalized bandwidth allocations, and restructured telecommunication contracts with aggressive multi-carrier competitive bidding.',
    architecture_notes: 'Dual-carrier SD-WAN topology (Nepal Telecom fiber + Ncell high-capacity microwave); Fortinet / Cisco SD-WAN controllers with IPsec encryption; DSCP QoS tagging for SAP ERP and SIP.',
    outcome: 'Secured an annual recurring WAN operational expenditure reduction of 22% while doubling circuit bandwidth and achieving 99.95% WAN network availability.',
    key_metrics: [
      { label: 'Annual WAN Operating Expenditure', before: 'Baseline Budget Spend', after: '22% Recurring Net Reduction' },
      { label: 'Enterprise Bandwidth Capacity', before: '100 Mbps Shared Uplink', after: '250 Mbps Redundant Fiber' },
      { label: 'WAN Network Availability SLA', before: '99.5% with Outage Risks', after: '99.95% Dual Active-Active' }
    ]
  }
];

for (const p of projectsToUpdate) {
  sql += `
UPDATE projects
SET 
  delivery_focus = ${escapeSql(p.delivery_focus)},
  detailed_description = ${escapeSql(p.detailed_description)},
  challenge = ${escapeSql(p.challenge)},
  approach = ${escapeSql(p.approach)},
  architecture_notes = ${escapeSql(p.architecture_notes)},
  outcome = ${escapeSql(p.outcome)},
  key_metrics = ${escapeSql(JSON.stringify(p.key_metrics))}::jsonb,
  updated_at = NOW()
WHERE slug = ${escapeSql(p.slug)};
`;
}

sql += `
-- 3. Enrich 20 FY 2025-26 Initiatives with description and business_value
`;

const initiativesToUpdate = [
  {
    slug: '89-dms-sfa-transformation-programme',
    description: 'Anchored the full IT infrastructure architecture and multi-vendor hosting evaluation for the nationwide Distributor Management System (DMS) and Sales Force Automation (SFA) modernisation programme. Authored technical Bill of Materials (BOMs) for Botree and Vxceed platforms, modeled 3-year TCO projections, and established CISO-approved security architecture.',
    business_value: 'Delivered a transparent 3-year TCO roadmap that eliminated hosting vendor lock-in, accelerated sales order processing times across hundreds of distributors, and satisfied 100% of corporate cybersecurity standards.'
  },
  {
    slug: '90-sap-dr-migration-from-tata-to-microsoft-azure',
    description: 'Spearheaded the migration of the mission-critical SAP Disaster Recovery environment from legacy colocation at TATA Communications to Microsoft Azure Cloud. Designed an Azure Landing Zone with high-speed ExpressRoute interconnects, automated HANA replication, and regular non-disruptive DR drills.',
    business_value: 'Reduced disaster recovery RTO from 12 hours to under 2 hours and RPO to under 15 minutes, safeguarding business continuity for enterprise supply chain and manufacturing operations.'
  },
  {
    slug: '91-simara-factory-secondary-ot-dc-claroty-ctd-security',
    description: 'Commissioned the secondary Operational Technology (OT) Data Centre at Simara Factory, deploying Claroty Continuous Threat Detection (CTD) passive sensors across Purdue Model Levels 1-3 to detect industrial network anomalies and protect PLCs and SCADA nodes.',
    business_value: 'Established geo-redundant factory computing resilience, achieved 100% automated OT asset inventory visibility, and aligned manufacturing cybersecurity with global IEC 62443 standards.'
  },
  {
    slug: '92-industrial-energy-monitoring-system-ems-utility-management',
    description: 'Implemented an automated Industrial Energy Monitoring System (EMS) across factory utilities and production lines, interfacing smart energy meters via RS-485 Modbus to industrial IoT gateways for real-time telemetry streaming into Power BI.',
    business_value: 'Eliminated manual meter logging, enabled real-time detection of electrical power spikes and idling machinery, and provided data for 7% energy efficiency improvements and corporate ESG reporting.'
  },
  {
    slug: '93-microsoft-vmware-enterprise-mega-renewal-virtualization-strategy',
    description: 'Led technical capacity audits and commercial contract negotiations for the enterprise Microsoft 365 / Azure and VMware vSphere mega-renewals, rightsizing CPU core allocations and licensing tiers following Broadcom licensing changes.',
    business_value: 'Averted a 45%+ projected software licensing spike, delivering an 18% net cost reduction while securing full vendor premier support and 100% certified license compliance.'
  },
  {
    slug: '94-sap-erp-ehp-upgrade-production-rollout',
    description: 'Managed infrastructure readiness, compute sizing, and database maintenance windows for the SAP ERP Enhancement Package (EHP) upgrade across production, quality, and development landscapes.',
    business_value: 'Ensured zero unexpected business downtime during core ERP database maintenance, unlocking updated SAP functional modules for finance, supply chain, and manufacturing operations.'
  },
  {
    slug: '95-enterprise-ai-strategy-copilot-studio-deployment',
    description: 'Formulated the corporate Artificial Intelligence roadmap and engineered custom Microsoft Copilot Studio generative AI agents integrated with SharePoint SOP repositories using Retrieval-Augmented Generation (RAG) and Azure data protection guardrails.',
    business_value: 'Reduced internal technical and policy query times from 30 minutes to under 15 seconds, deflected 60% of routine helpdesk tickets, and guaranteed zero enterprise data leakage to public models.'
  },
  {
    slug: '96-datacenter-physical-infrastructure-upgrade-lifecycle-assessment',
    description: 'Executed an end-to-end physical infrastructure lifecycle audit of the primary enterprise Tier-III datacenter, upgrading modular UPS battery strings, balancing Precision Air Conditioning (PAC) airflow, and deploying networked rack PDUs.',
    business_value: 'Guaranteed 99.99% physical facility uptime, extended emergency battery backup autonomy to 45+ minutes under full load, and eliminated localized thermal hotspots.'
  },
  {
    slug: '97-snpl-knowledge-bites-digital-platform-kb-snpl-com-np',
    description: 'Architected and launched the official SNPL Knowledge Bites digital web platform (kb.snpl.com.np), providing mobile-responsive micro-learning, video streaming, interactive quizzes, and Microsoft Entra ID Single Sign-On for corporate and factory personnel.',
    business_value: 'Cut new employee onboarding cycles from 3 weeks to 7 days, digitized over 150 standard operating procedures, and achieved 99.95% web service availability.'
  },
  {
    slug: '98-executive-boardroom-av-modernization-horion-mirroring-redundancy',
    description: 'Modernized executive boardroom audiovisual systems with high-definition Horion interactive smart displays, redundant wireless screen casting, and high-fidelity video conferencing integration.',
    business_value: 'Eliminated AV setup delays for executive committee and board meetings, enabling seamless hybrid collaboration with international ITC and JTI leadership.'
  },
  {
    slug: '99-automated-network-patching-pipeline-ansible-semaphore',
    description: 'Built an automated network configuration management and firmware patching pipeline using Ansible Semaphore and Git version control across 100+ campus and factory access switches.',
    business_value: 'Accelerated switch patching times from 45 minutes per device to under 4 minutes, eliminated human configuration drift, and created automated nightly configuration diff backups.'
  },
  {
    slug: '100-core-storage-backup-infrastructure-critical-upgrades',
    description: 'Conducted storage controller firmware upgrades, SAN fabric zoning optimizations, and deduplication repository expansions on HPE StoreOnce and enterprise NAS backup systems.',
    business_value: 'Strengthened enterprise data protection against ransomware with immutable backup storage and reduced daily database backup windows by 35%.'
  },
  {
    slug: '101-it-policy-2-0-information-management-im-policy-2-0-adoption',
    description: 'Spearheaded corporate adoption and technical control mapping for IT Policy 2.0 and Information Management (IM) Policy 2.0, establishing data classification, encryption, and endpoint hygiene standards.',
    business_value: 'Unified compliance posture across multi-plant manufacturing and corporate headquarters, achieving 100% alignment with corporate ITC information management policies.'
  },
  {
    slug: '102-corporate-internal-audit-defense-74-artifacts-16-point-memo',
    description: 'Led the technical and governance defense for the annual Corporate Internal Audit, preparing 74 evidentiary artifacts and closing all 16 audit memo items across infrastructure, security, and DR controls.',
    business_value: 'Achieved a clean audit outcome with zero critical observations, validating robust internal controls and enterprise operational maturity.'
  },
  {
    slug: '103-enterprise-endpoint-modernization-windows-11-fleet-transition',
    description: 'Orchestrated the phased enterprise hardware assessment and migration of corporate desktop and laptop fleets to Windows 11 Enterprise with BitLocker encryption and Microsoft Intune endpoint management.',
    business_value: 'Modernized user productivity, reinforced device-level hardware security with TPM 2.0, and standardized endpoint compliance across all business departments.'
  },
  {
    slug: '104-enterprise-wan-cost-optimization-iplc-modernization',
    description: 'Renegotiated enterprise WAN and IPLC cross-border circuits across Tier-1 telcos, optimizing SD-WAN traffic prioritization and dual-link failover between factories and headquarters.',
    business_value: 'Delivered a recurring 22% annual cost reduction on WAN operations, doubled bandwidth capacity to 250 Mbps, and maintained 99.95% network availability.'
  },
  {
    slug: '105-ot-table-top-exercise-ttx-standalone-ics-support-governance',
    description: 'Organized and led OT cybersecurity Table-Top Exercises (TTX) simulating industrial control ransomware outbreaks, and established formalized support governance for standalone factory automation systems.',
    business_value: 'Trained factory engineering teams on rapid incident containment, established clear escalation SOPs, and reduced emergency response times for OT operational incidents.'
  },
  {
    slug: '106-snpl-shopify-enterprise-e-commerce-it-integration',
    description: 'Architected secure IT middleware integration between Surya Nepal e-commerce platforms hosted on Shopify and core back-office ERP systems for real-time inventory and invoice reconciliation.',
    business_value: 'Enabled automated omni-channel order fulfillment, eliminated manual order re-entry errors, and expanded digital sales reach.'
  },
  {
    slug: '107-server-health-monitoring-dashboard-automated-telemetry',
    description: 'Expanded Zabbix enterprise observability platform, instrumenting automated synthetic transactions, hardware IPMI sensors, and automated Slack/email incident notification bots.',
    business_value: 'Shifted infrastructure management from reactive trouble tickets to proactive telemetry, detecting 95% of performance anomalies prior to user impact.'
  },
  {
    slug: '108-simara-factory-digital-ehs-application-enablement',
    description: 'Deployed and integrated digital Environmental Health and Safety (EHS) inspection and incident reporting software across tablet terminals and kiosks throughout the Simara factory floor.',
    business_value: 'Digitized safety walk-throughs, enabled instantaneous hazard reporting, and supported factory compliance with national industrial safety standards.'
  }
];

for (const init of initiativesToUpdate) {
  sql += `
UPDATE initiatives
SET 
  description = ${escapeSql(init.description)},
  business_value = ${escapeSql(init.business_value)},
  image_url = NULL,
  updated_at = NOW()
WHERE slug = ${escapeSql(init.slug)};
`;
}

sql += `
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
`;

fs.writeFileSync(path.join(process.cwd(), 'scripts', 'enrich_fy25.sql'), sql, 'utf8');
console.log('✅ Successfully wrote scripts/enrich_fy25.sql');
