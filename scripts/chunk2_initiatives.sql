-- 3. Enrich 20 FY 2025-26 Initiatives with description and business_value

UPDATE initiatives
SET 
  description = 'Anchored the full IT infrastructure architecture and multi-vendor hosting evaluation for the nationwide Distributor Management System (DMS) and Sales Force Automation (SFA) modernisation programme. Authored technical Bill of Materials (BOMs) for Botree and Vxceed platforms, modeled 3-year TCO projections, and established CISO-approved security architecture.',
  business_value = 'Delivered a transparent 3-year TCO roadmap that eliminated hosting vendor lock-in, accelerated sales order processing times across hundreds of distributors, and satisfied 100% of corporate cybersecurity standards.',
  image_url = NULL,
  updated_at = NOW()
WHERE slug = '89-dms-sfa-transformation-programme';

UPDATE initiatives
SET 
  description = 'Spearheaded the migration of the mission-critical SAP Disaster Recovery environment from legacy colocation at TATA Communications to Microsoft Azure Cloud. Designed an Azure Landing Zone with high-speed ExpressRoute interconnects, automated HANA replication, and regular non-disruptive DR drills.',
  business_value = 'Reduced disaster recovery RTO from 12 hours to under 2 hours and RPO to under 15 minutes, safeguarding business continuity for enterprise supply chain and manufacturing operations.',
  image_url = NULL,
  updated_at = NOW()
WHERE slug = '90-sap-dr-migration-from-tata-to-microsoft-azure';

UPDATE initiatives
SET 
  description = 'Commissioned the secondary Operational Technology (OT) Data Centre at Simara Factory, deploying Claroty Continuous Threat Detection (CTD) passive sensors across Purdue Model Levels 1-3 to detect industrial network anomalies and protect PLCs and SCADA nodes.',
  business_value = 'Established geo-redundant factory computing resilience, achieved 100% automated OT asset inventory visibility, and aligned manufacturing cybersecurity with global IEC 62443 standards.',
  image_url = NULL,
  updated_at = NOW()
WHERE slug = '91-simara-factory-secondary-ot-dc-claroty-ctd-security';

UPDATE initiatives
SET 
  description = 'Implemented an automated Industrial Energy Monitoring System (EMS) across factory utilities and production lines, interfacing smart energy meters via RS-485 Modbus to industrial IoT gateways for real-time telemetry streaming into Power BI.',
  business_value = 'Eliminated manual meter logging, enabled real-time detection of electrical power spikes and idling machinery, and provided data for 7% energy efficiency improvements and corporate ESG reporting.',
  image_url = NULL,
  updated_at = NOW()
WHERE slug = '92-industrial-energy-monitoring-system-ems-utility-management';

UPDATE initiatives
SET 
  description = 'Led technical capacity audits and commercial contract negotiations for the enterprise Microsoft 365 / Azure and VMware vSphere mega-renewals, rightsizing CPU core allocations and licensing tiers following Broadcom licensing changes.',
  business_value = 'Averted a 45%+ projected software licensing spike, delivering an 18% net cost reduction while securing full vendor premier support and 100% certified license compliance.',
  image_url = NULL,
  updated_at = NOW()
WHERE slug = '93-microsoft-vmware-enterprise-mega-renewal-virtualization-strategy';

UPDATE initiatives
SET 
  description = 'Managed infrastructure readiness, compute sizing, and database maintenance windows for the SAP ERP Enhancement Package (EHP) upgrade across production, quality, and development landscapes.',
  business_value = 'Ensured zero unexpected business downtime during core ERP database maintenance, unlocking updated SAP functional modules for finance, supply chain, and manufacturing operations.',
  image_url = NULL,
  updated_at = NOW()
WHERE slug = '94-sap-erp-ehp-upgrade-production-rollout';

UPDATE initiatives
SET 
  description = 'Formulated the corporate Artificial Intelligence roadmap and engineered custom Microsoft Copilot Studio generative AI agents integrated with SharePoint SOP repositories using Retrieval-Augmented Generation (RAG) and Azure data protection guardrails.',
  business_value = 'Reduced internal technical and policy query times from 30 minutes to under 15 seconds, deflected 60% of routine helpdesk tickets, and guaranteed zero enterprise data leakage to public models.',
  image_url = NULL,
  updated_at = NOW()
WHERE slug = '95-enterprise-ai-strategy-copilot-studio-deployment';

UPDATE initiatives
SET 
  description = 'Executed an end-to-end physical infrastructure lifecycle audit of the primary enterprise Tier-III datacenter, upgrading modular UPS battery strings, balancing Precision Air Conditioning (PAC) airflow, and deploying networked rack PDUs.',
  business_value = 'Guaranteed 99.99% physical facility uptime, extended emergency battery backup autonomy to 45+ minutes under full load, and eliminated localized thermal hotspots.',
  image_url = NULL,
  updated_at = NOW()
WHERE slug = '96-datacenter-physical-infrastructure-upgrade-lifecycle-assessment';

UPDATE initiatives
SET 
  description = 'Architected and launched the official SNPL Knowledge Bites digital web platform (kb.snpl.com.np), providing mobile-responsive micro-learning, video streaming, interactive quizzes, and Microsoft Entra ID Single Sign-On for corporate and factory personnel.',
  business_value = 'Cut new employee onboarding cycles from 3 weeks to 7 days, digitized over 150 standard operating procedures, and achieved 99.95% web service availability.',
  image_url = NULL,
  updated_at = NOW()
WHERE slug = '97-snpl-knowledge-bites-digital-platform-kb-snpl-com-np';

UPDATE initiatives
SET 
  description = 'Modernized executive boardroom audiovisual systems with high-definition Horion interactive smart displays, redundant wireless screen casting, and high-fidelity video conferencing integration.',
  business_value = 'Eliminated AV setup delays for executive committee and board meetings, enabling seamless hybrid collaboration with international ITC and JTI leadership.',
  image_url = NULL,
  updated_at = NOW()
WHERE slug = '98-executive-boardroom-av-modernization-horion-mirroring-redundancy';

UPDATE initiatives
SET 
  description = 'Built an automated network configuration management and firmware patching pipeline using Ansible Semaphore and Git version control across 100+ campus and factory access switches.',
  business_value = 'Accelerated switch patching times from 45 minutes per device to under 4 minutes, eliminated human configuration drift, and created automated nightly configuration diff backups.',
  image_url = NULL,
  updated_at = NOW()
WHERE slug = '99-automated-network-patching-pipeline-ansible-semaphore';

UPDATE initiatives
SET 
  description = 'Conducted storage controller firmware upgrades, SAN fabric zoning optimizations, and deduplication repository expansions on HPE StoreOnce and enterprise NAS backup systems.',
  business_value = 'Strengthened enterprise data protection against ransomware with immutable backup storage and reduced daily database backup windows by 35%.',
  image_url = NULL,
  updated_at = NOW()
WHERE slug = '100-core-storage-backup-infrastructure-critical-upgrades';

UPDATE initiatives
SET 
  description = 'Spearheaded corporate adoption and technical control mapping for IT Policy 2.0 and Information Management (IM) Policy 2.0, establishing data classification, encryption, and endpoint hygiene standards.',
  business_value = 'Unified compliance posture across multi-plant manufacturing and corporate headquarters, achieving 100% alignment with corporate ITC information management policies.',
  image_url = NULL,
  updated_at = NOW()
WHERE slug = '101-it-policy-2-0-information-management-im-policy-2-0-adoption';

UPDATE initiatives
SET 
  description = 'Led the technical and governance defense for the annual Corporate Internal Audit, preparing 74 evidentiary artifacts and closing all 16 audit memo items across infrastructure, security, and DR controls.',
  business_value = 'Achieved a clean audit outcome with zero critical observations, validating robust internal controls and enterprise operational maturity.',
  image_url = NULL,
  updated_at = NOW()
WHERE slug = '102-corporate-internal-audit-defense-74-artifacts-16-point-memo';

UPDATE initiatives
SET 
  description = 'Orchestrated the phased enterprise hardware assessment and migration of corporate desktop and laptop fleets to Windows 11 Enterprise with BitLocker encryption and Microsoft Intune endpoint management.',
  business_value = 'Modernized user productivity, reinforced device-level hardware security with TPM 2.0, and standardized endpoint compliance across all business departments.',
  image_url = NULL,
  updated_at = NOW()
WHERE slug = '103-enterprise-endpoint-modernization-windows-11-fleet-transition';

UPDATE initiatives
SET 
  description = 'Renegotiated enterprise WAN and IPLC cross-border circuits across Tier-1 telcos, optimizing SD-WAN traffic prioritization and dual-link failover between factories and headquarters.',
  business_value = 'Delivered a recurring 22% annual cost reduction on WAN operations, doubled bandwidth capacity to 250 Mbps, and maintained 99.95% network availability.',
  image_url = NULL,
  updated_at = NOW()
WHERE slug = '104-enterprise-wan-cost-optimization-iplc-modernization';

UPDATE initiatives
SET 
  description = 'Organized and led OT cybersecurity Table-Top Exercises (TTX) simulating industrial control ransomware outbreaks, and established formalized support governance for standalone factory automation systems.',
  business_value = 'Trained factory engineering teams on rapid incident containment, established clear escalation SOPs, and reduced emergency response times for OT operational incidents.',
  image_url = NULL,
  updated_at = NOW()
WHERE slug = '105-ot-table-top-exercise-ttx-standalone-ics-support-governance';

UPDATE initiatives
SET 
  description = 'Architected secure IT middleware integration between Surya Nepal e-commerce platforms hosted on Shopify and core back-office ERP systems for real-time inventory and invoice reconciliation.',
  business_value = 'Enabled automated omni-channel order fulfillment, eliminated manual order re-entry errors, and expanded digital sales reach.',
  image_url = NULL,
  updated_at = NOW()
WHERE slug = '106-snpl-shopify-enterprise-e-commerce-it-integration';

UPDATE initiatives
SET 
  description = 'Expanded Zabbix enterprise observability platform, instrumenting automated synthetic transactions, hardware IPMI sensors, and automated Slack/email incident notification bots.',
  business_value = 'Shifted infrastructure management from reactive trouble tickets to proactive telemetry, detecting 95% of performance anomalies prior to user impact.',
  image_url = NULL,
  updated_at = NOW()
WHERE slug = '107-server-health-monitoring-dashboard-automated-telemetry';

UPDATE initiatives
SET 
  description = 'Deployed and integrated digital Environmental Health and Safety (EHS) inspection and incident reporting software across tablet terminals and kiosks throughout the Simara factory floor.',
  business_value = 'Digitized safety walk-throughs, enabled instantaneous hazard reporting, and supported factory compliance with national industrial safety standards.',
  image_url = NULL,
  updated_at = NOW()
WHERE slug = '108-simara-factory-digital-ehs-application-enablement';

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
