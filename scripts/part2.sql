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