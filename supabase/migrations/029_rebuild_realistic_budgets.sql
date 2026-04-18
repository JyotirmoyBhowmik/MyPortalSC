-- ============================================================
-- 029_rebuild_realistic_budgets.sql
-- IT Financial Controller: 10-Year Realistic Budget Rebuild
-- Wipes all auto-seeded placeholders and re-inserts with 
-- proper FY mapping and realistic INR costing.
-- ============================================================

-- Step 1: Clean slate — remove all auto-generated placeholders
DELETE FROM financial_budgets;

-- ============================================================
-- FY 2016-17
-- ============================================================
-- CAPEX Projects
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head,initiative_id) VALUES
('Multi-Site CCTV Implementation (Phase 1)','2016-17','CapEx','INR',1.0,1800000,1800000,1650000,150000,'IT-PhysicalSec','HQ','Surveillance Hardware',(SELECT id FROM initiatives WHERE slug='87-multi-site-cctv-implementation-phase-1'));
-- CAPEX Regular
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head) VALUES
('Base Hardware (Desktops & Laptops)','2016-17','CapEx','INR',1.0,800000,800000,720000,80000,'IT-Assets','HQ','End-User Hardware');
-- OPEX Projects
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head,initiative_id) VALUES
('Virtualization Technology POC','2016-17','OpEx','INR',1.0,350000,350000,310000,40000,'IT-Strategy','HQ','Technology Evaluation',(SELECT id FROM initiatives WHERE slug='88-virtualization-technology-poc'));
-- OPEX Regular
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head) VALUES
('Facility IT Maintenance & Support','2016-17','OpEx','INR',1.0,400000,400000,380000,20000,'IT-Ops','HQ','Repair & Maintenance'),
('ISP & Internet Services','2016-17','OpEx','INR',1.0,360000,360000,360000,0,'IT-Network','HQ','Connectivity'),
('Basic Software Licenses','2016-17','OpEx','INR',1.0,240000,240000,230000,10000,'IT-Licensing','HQ','Software Subscriptions');

-- ============================================================
-- FY 2017-18
-- ============================================================
-- CAPEX Projects
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head,initiative_id) VALUES
('High-Availability (N+1) Infrastructure Redesign','2017-18','CapEx','INR',1.0,4200000,4200000,3850000,350000,'IT-DC','HQ','Data Center Infrastructure',(SELECT id FROM initiatives WHERE slug='83-high-availability-n-1-infrastructure-redesign')),
('Centralized Surveillance Operations Center','2017-18','CapEx','INR',1.0,2200000,2200000,2050000,150000,'IT-PhysicalSec','HQ','Surveillance Hardware',(SELECT id FROM initiatives WHERE slug='86-centralized-surveillance-operations-center'));
-- CAPEX Regular
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head) VALUES
('Printers & Scanners','2017-18','CapEx','INR',1.0,350000,350000,320000,30000,'IT-Assets','HQ','Peripherals');
-- OPEX Projects
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head,initiative_id) VALUES
('Windows 10 & Office 2013 Migration','2017-18','OpEx','INR',1.0,850000,850000,780000,70000,'IT-EndUser','HQ','OS Migration Services',(SELECT id FROM initiatives WHERE slug='84-windows-10-office-2013-migration')),
('Active Directory Functional Level Upgrade','2017-18','OpEx','INR',1.0,500000,500000,480000,20000,'IT-Infra','HQ','Directory Services',(SELECT id FROM initiatives WHERE slug='85-active-directory-functional-level-upgrade')),
('Virtualization Procurement & Planning','2017-18','OpEx','INR',1.0,600000,600000,550000,50000,'IT-Strategy','HQ','Consulting & Planning',(SELECT id FROM initiatives WHERE slug='81-virtualization-procurement-planning')),
('Infrastructure Monitoring Tool Pilot','2017-18','OpEx','INR',1.0,450000,450000,420000,30000,'IT-Ops','HQ','Monitoring Tools',(SELECT id FROM initiatives WHERE slug='82-infrastructure-monitoring-tool-pilot'));
-- OPEX Regular
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head) VALUES
('Software Renewals & Licensing','2017-18','OpEx','INR',1.0,550000,550000,520000,30000,'IT-Licensing','HQ','Software Subscriptions'),
('AMC — Surveillance & AV Systems','2017-18','OpEx','INR',1.0,350000,350000,350000,0,'IT-AMC','HQ','Annual Maintenance Contracts');

-- ============================================================
-- FY 2018-19
-- ============================================================
-- CAPEX Projects
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head,initiative_id) VALUES
('Border Router & Internet Gateway Upgrade','2018-19','CapEx','INR',1.0,2800000,2800000,2650000,150000,'IT-Network','HQ','Network Hardware',(SELECT id FROM initiatives WHERE slug='74-border-router-internet-gateway-upgrade')),
('Factory IT Infrastructure Procurement','2018-19','CapEx','INR',1.0,3500000,3500000,3200000,300000,'IT-Factory','Factory','Site Infrastructure',(SELECT id FROM initiatives WHERE slug='75-factory-it-infrastructure-procurement')),
('Warehouse IT Infrastructure Setup (Redundant)','2018-19','CapEx','INR',1.0,2500000,2500000,2350000,150000,'IT-Warehouse','Warehouse','Site Infrastructure',(SELECT id FROM initiatives WHERE slug='76-warehouse-it-infrastructure-setup-redundant'));
-- CAPEX Regular
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head) VALUES
('General Office IT Hardware','2018-19','CapEx','INR',1.0,1200000,1200000,1100000,100000,'IT-Assets','HQ','End-User Hardware');
-- OPEX Projects
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head,initiative_id) VALUES
('3-Zone Security Virtualization Initiative','2018-19','OpEx','INR',1.0,1500000,1500000,1400000,100000,'IT-Security','HQ','Security Consulting',(SELECT id FROM initiatives WHERE slug='72-3-zone-security-virtualization-initiative')),
('DMZ Server Consolidation','2018-19','OpEx','INR',1.0,800000,800000,750000,50000,'IT-Security','HQ','Infrastructure Services',(SELECT id FROM initiatives WHERE slug='73-dmz-server-consolidation')),
('Microsoft RAP Security Assessment','2018-19','OpEx','USD',68.0,12000,12000,12000,0,'IT-Security','HQ','Security Assessment',(SELECT id FROM initiatives WHERE slug='78-microsoft-rap-security-assessment')),
('Active Directory Security Audit','2018-19','OpEx','INR',1.0,600000,600000,580000,20000,'IT-Security','HQ','Audit & Compliance',(SELECT id FROM initiatives WHERE slug='80-active-directory-security-audit')),
('Automated User Acceptance System (Lotus)','2018-19','OpEx','INR',1.0,250000,250000,230000,20000,'IT-Apps','HQ','Application Development',(SELECT id FROM initiatives WHERE slug='77-automated-user-acceptance-system-lotus')),
('Remote Assistance (MSRA) Deployment','2018-19','OpEx','INR',1.0,180000,180000,170000,10000,'IT-Support','HQ','Support Tools',(SELECT id FROM initiatives WHERE slug='79-remote-assistance-msra-deployment'));
-- OPEX Regular
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head) VALUES
('ISP & Internet Subscriptions','2018-19','OpEx','INR',1.0,480000,480000,480000,0,'IT-Network','HQ','Connectivity'),
('Lotus System Maintenance','2018-19','OpEx','INR',1.0,300000,300000,290000,10000,'IT-Apps','HQ','Legacy Maintenance'),
('On-site Support Services','2018-19','OpEx','INR',1.0,600000,600000,580000,20000,'IT-Support','HQ','Helpdesk & Support');

-- ============================================================
-- FY 2019-20
-- ============================================================
-- CAPEX Projects
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head,initiative_id) VALUES
('Legacy Storage Platform Replacement','2019-20','CapEx','INR',1.0,4500000,4500000,4200000,300000,'IT-DC','HQ','Storage Hardware',(SELECT id FROM initiatives WHERE slug='63-legacy-storage-platform-replacement')),
('Greenfield Factory IT Infrastructure Design','2019-20','CapEx','INR',1.0,5500000,5500000,5100000,400000,'IT-Factory','Factory-2','Site Infrastructure',(SELECT id FROM initiatives WHERE slug='71-greenfield-factory-it-infrastructure-design')),
('Network AAA Security Implementation','2019-20','CapEx','INR',1.0,1800000,1800000,1700000,100000,'IT-Security','HQ','Security Hardware',(SELECT id FROM initiatives WHERE slug='68-network-aaa-security-implementation'));
-- CAPEX Regular
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head) VALUES
('Network Cabling & Passive Infra','2019-20','CapEx','INR',1.0,1200000,1200000,1100000,100000,'IT-Network','HQ','Passive Infrastructure'),
('Laptop Procurement (Refresh Cycle)','2019-20','CapEx','INR',1.0,1500000,1500000,1400000,100000,'IT-Assets','HQ','End-User Hardware');
-- OPEX Projects
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head,initiative_id) VALUES
('Zero-Impact ERP OS Migration','2019-20','OpEx','INR',1.0,2200000,2200000,2050000,150000,'IT-Infra','HQ','Migration Services',(SELECT id FROM initiatives WHERE slug='62-zero-impact-erp-os-migration')),
('Backup Workflow Redesign & Tool Upgrade','2019-20','OpEx','INR',1.0,1200000,1200000,1100000,100000,'IT-DC','HQ','Backup Services',(SELECT id FROM initiatives WHERE slug='64-backup-workflow-redesign-tool-upgrade')),
('Remote Support Services Implementation','2019-20','OpEx','INR',1.0,350000,350000,320000,30000,'IT-Support','HQ','Support Tools',(SELECT id FROM initiatives WHERE slug='70-remote-support-services-implementation')),
('Backup Solution POC','2019-20','OpEx','INR',1.0,250000,250000,220000,30000,'IT-Strategy','HQ','Technology Evaluation',(SELECT id FROM initiatives WHERE slug='67-backup-solution-proof-of-concept-poc')),
('Windows Server OS Risk Remediation','2019-20','OpEx','INR',1.0,650000,650000,600000,50000,'IT-Infra','HQ','OS Remediation',(SELECT id FROM initiatives WHERE slug='65-windows-server-os-risk-remediation')),
('IT Asset Management Portal','2019-20','OpEx','INR',1.0,400000,400000,370000,30000,'IT-ITAM','HQ','ITSM Tools',(SELECT id FROM initiatives WHERE slug='66-it-asset-management-portal-implementation')),
('VSS Clone Endpoint Optimization','2019-20','OpEx','INR',1.0,280000,280000,260000,20000,'IT-Ops','HQ','Deployment Tools',(SELECT id FROM initiatives WHERE slug='69-vss-clone-endpoint-deployment-optimization'));
-- OPEX Regular
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head) VALUES
('Hardware AMC Contracts','2019-20','OpEx','INR',1.0,900000,900000,880000,20000,'IT-AMC','HQ','Annual Maintenance Contracts'),
('Legacy Support & Repair Services','2019-20','OpEx','INR',1.0,500000,500000,480000,20000,'IT-Support','HQ','Repair & Maintenance');

-- ============================================================
-- FY 2020-21
-- ============================================================
-- CAPEX Projects
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head,initiative_id) VALUES
('Disk-Based Backup Modernization','2020-21','CapEx','INR',1.0,3500000,3500000,3300000,200000,'IT-DC','HQ','Backup Hardware',(SELECT id FROM initiatives WHERE slug='51-disk-based-backup-modernization')),
('High-Performance Storage Migration (Flash)','2020-21','CapEx','INR',1.0,6500000,6500000,6200000,300000,'IT-DC','HQ','Storage Hardware',(SELECT id FROM initiatives WHERE slug='52-high-performance-storage-migration-flash')),
('Network Access Control (RADIUS/802.1x)','2020-21','CapEx','INR',1.0,2200000,2200000,2050000,150000,'IT-Security','HQ','NAC Hardware',(SELECT id FROM initiatives WHERE slug='53-network-access-control-radius-802-1x')),
('Interim Disaster Recovery Site Setup','2020-21','CapEx','INR',1.0,4000000,4000000,3750000,250000,'IT-DC','DR-Site','DR Infrastructure',(SELECT id FROM initiatives WHERE slug='60-interim-disaster-recovery-site-setup'));
-- CAPEX Regular
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head) VALUES
('Desktop Replacements','2020-21','CapEx','INR',1.0,1800000,1800000,1700000,100000,'IT-Assets','HQ','End-User Hardware'),
('Asset Tagging & Inventory Tools','2020-21','CapEx','INR',1.0,250000,250000,230000,20000,'IT-ITAM','HQ','ITAM Tools');
-- OPEX Projects
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head,initiative_id) VALUES
('Office 365 Initial Pilot & Deployment','2020-21','OpEx','USD',73.0,18000,18000,17500,500,'IT-Cloud','HQ','Cloud Licensing',(SELECT id FROM initiatives WHERE slug='54-office-365-initial-pilot-deployment')),
('Enterprise Digital Rights Management (DRM)','2020-21','OpEx','INR',1.0,1200000,1200000,1100000,100000,'IT-Security','HQ','Security Software',(SELECT id FROM initiatives WHERE slug='56-enterprise-digital-rights-management-drm')),
('DMZ Network Virtualization','2020-21','OpEx','INR',1.0,900000,900000,850000,50000,'IT-Security','HQ','Network Security',(SELECT id FROM initiatives WHERE slug='61-dmz-network-virtualization')),
('RPA: IT Service Desk & Finance Automation','2020-21','OpEx','INR',1.0,1500000,1500000,1350000,150000,'IT-Automation','HQ','RPA Licensing & Dev',(SELECT id FROM initiatives WHERE slug='57-rpa-it-service-desk-finance-automation')),
('Corporate Website Technology Upgrade','2020-21','OpEx','INR',1.0,500000,500000,450000,50000,'IT-Digital','HQ','Web Development',(SELECT id FROM initiatives WHERE slug='55-corporate-website-technology-upgrade')),
('MIS Portal','2020-21','OpEx','INR',1.0,600000,600000,550000,50000,'IT-Apps','HQ','Application Development',(SELECT id FROM initiatives WHERE slug='58-management-information-system-mis-portal')),
('E-Governance Policy Portal','2020-21','OpEx','INR',1.0,450000,450000,420000,30000,'IT-Apps','HQ','Application Development',(SELECT id FROM initiatives WHERE slug='59-e-governance-policy-portal'));
-- OPEX Regular
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head) VALUES
('Web Hosting & SSL Certificates','2020-21','OpEx','INR',1.0,350000,350000,340000,10000,'IT-Digital','HQ','Hosting & Certs'),
('Security Audit & Compliance Fees','2020-21','OpEx','INR',1.0,700000,700000,680000,20000,'IT-Security','HQ','Audit Fees');

-- ============================================================
-- FY 2021-22
-- ============================================================
-- CAPEX Projects
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head,initiative_id) VALUES
('Disaster Recovery Geo-Redundancy Migration','2021-22','CapEx','INR',1.0,7500000,7500000,7100000,400000,'IT-DC','DR-Site','DR Infrastructure',(SELECT id FROM initiatives WHERE slug='36-disaster-recovery-geo-redundancy-migration')),
('ERP Landscape Virtualization (Dev/QA/Prod)','2021-22','CapEx','INR',1.0,5500000,5500000,5200000,300000,'IT-DC','HQ','Virtualization Platform',(SELECT id FROM initiatives WHERE slug='38-erp-landscape-virtualization-dev-qa-prod')),
('Hybrid Cloud Connectivity (Azure ExpressRoute)','2021-22','CapEx','USD',75.0,45000,45000,42000,3000,'IT-Cloud','HQ','Cloud Connectivity',(SELECT id FROM initiatives WHERE slug='41-hybrid-cloud-connectivity-azure-expressroute')),
('Enterprise Backup & Storage Enhancement','2021-22','CapEx','INR',1.0,4800000,4800000,4500000,300000,'IT-DC','HQ','Storage & Backup',(SELECT id FROM initiatives WHERE slug='42-enterprise-backup-storage-enhancement'));
-- CAPEX Regular
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head) VALUES
('Workstation Upgrades','2021-22','CapEx','INR',1.0,2200000,2200000,2050000,150000,'IT-Assets','HQ','End-User Hardware'),
('Server Rack Components','2021-22','CapEx','INR',1.0,1500000,1500000,1400000,100000,'IT-DC','HQ','DC Hardware');
-- OPEX Projects
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head,initiative_id) VALUES
('Banking Interface Integration (NCHL/ERP)','2021-22','OpEx','INR',1.0,2500000,2500000,2350000,150000,'IT-FinTech','HQ','Integration Services',(SELECT id FROM initiatives WHERE slug='45-banking-interface-integration-nchl-erp')),
('Automated EFT Payment Gateway','2021-22','OpEx','INR',1.0,1800000,1800000,1700000,100000,'IT-FinTech','HQ','FinTech Integration',(SELECT id FROM initiatives WHERE slug='46-automated-eft-payment-gateway-integration')),
('Tableau BI Infrastructure Setup','2021-22','OpEx','USD',75.0,15000,15000,14500,500,'IT-Analytics','HQ','BI Licensing',(SELECT id FROM initiatives WHERE slug='49-tableau-bi-infrastructure-setup')),
('Microsoft 365 Enterprise Rollout','2021-22','OpEx','USD',75.0,35000,35000,34000,1000,'IT-Cloud','HQ','Cloud Licensing',(SELECT id FROM initiatives WHERE slug='40-microsoft-365-enterprise-rollout')),
('RPA Scale-out Phase','2021-22','OpEx','INR',1.0,1200000,1200000,1100000,100000,'IT-Automation','HQ','RPA Development',(SELECT id FROM initiatives WHERE slug='37-robotic-process-automation-scale-out-phase')),
('Internal PKI & CA Certificate Deployment','2021-22','OpEx','INR',1.0,800000,800000,750000,50000,'IT-Security','HQ','Security Services',(SELECT id FROM initiatives WHERE slug='50-internal-pki-ca-certificate-deployment')),
('Subsidiary IT Due Diligence','2021-22','OpEx','INR',1.0,1500000,1500000,1400000,100000,'IT-Strategy','HQ','M&A Assessment',(SELECT id FROM initiatives WHERE slug='39-subsidiary-it-infrastructure-due-diligence')),
('Corporate Governance Portal','2021-22','OpEx','INR',1.0,650000,650000,600000,50000,'IT-Apps','HQ','Application Development',(SELECT id FROM initiatives WHERE slug='43-corporate-governance-portal-go-live')),
('Financial Accounting Tool','2021-22','OpEx','INR',1.0,1100000,1100000,1000000,100000,'IT-Apps','HQ','Finance Applications',(SELECT id FROM initiatives WHERE slug='48-financial-accounting-tool-implementation')),
('Corporate Web Maintenance','2021-22','OpEx','INR',1.0,300000,300000,280000,20000,'IT-Digital','HQ','Web Operations',(SELECT id FROM initiatives WHERE slug='44-corporate-web-maintenance-security-patching')),
('IT Asset Disposal Governance','2021-22','OpEx','INR',1.0,200000,200000,180000,20000,'IT-ITAM','HQ','ITAM Compliance',(SELECT id FROM initiatives WHERE slug='47-it-asset-disposal-write-off-governance'));
-- OPEX Regular
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head) VALUES
('M365 Annual Subscription','2021-22','OpEx','USD',75.0,28000,28000,28000,0,'IT-Licensing','HQ','Cloud Subscriptions'),
('DR Site Rental & Hosting','2021-22','OpEx','INR',1.0,1800000,1800000,1800000,0,'IT-DC','DR-Site','Hosting & Colocation'),
('Helpdesk Outsourcing','2021-22','OpEx','INR',1.0,1200000,1200000,1150000,50000,'IT-Support','HQ','Managed Services');

-- ============================================================
-- FY 2022-23
-- ============================================================
-- CAPEX Projects
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head,initiative_id) VALUES
('Core Backbone Upgrade (1G to 10G)','2022-23','CapEx','INR',1.0,5500000,5500000,5200000,300000,'IT-Network','HQ','Network Hardware',(SELECT id FROM initiatives WHERE slug='21-core-backbone-upgrade-1g-to-10g-switching')),
('RPA Deployment (Attended & Unattended)','2022-23','CapEx','INR',1.0,2800000,2800000,2600000,200000,'IT-Automation','HQ','RPA Platform',(SELECT id FROM initiatives WHERE slug='25-rpa-deployment-attended-unattended-bots')),
('Edge Router Infrastructure Refresh','2022-23','CapEx','INR',1.0,3200000,3200000,3000000,200000,'IT-Network','HQ','Network Hardware',(SELECT id FROM initiatives WHERE slug='26-edge-router-infrastructure-refresh-cisco')),
('Hybrid Boardroom Conferencing (Polycom)','2022-23','CapEx','INR',1.0,1800000,1800000,1650000,150000,'IT-AV','HQ','AV Hardware',(SELECT id FROM initiatives WHERE slug='27-hybrid-boardroom-conferencing-solution-polycom')),
('PowerBI Analytics Platform Procurement','2022-23','CapEx','USD',79.0,8000,8000,7800,200,'IT-Analytics','HQ','BI Platform',(SELECT id FROM initiatives WHERE slug='32-powerbi-analytics-platform-procurement')),
('Microsoft 365 & Intune MDM Procurement','2022-23','CapEx','USD',79.0,42000,42000,40000,2000,'IT-Cloud','HQ','Cloud Platform',(SELECT id FROM initiatives WHERE slug='33-microsoft-365-intune-mdm-procurement')),
('Mission-Critical ERP Server Virtualization','2022-23','CapEx','INR',1.0,4500000,4500000,4200000,300000,'IT-DC','HQ','Virtualization',(SELECT id FROM initiatives WHERE slug='18-mission-critical-erp-server-virtualization'));
-- CAPEX Regular
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head) VALUES
('Scanner & Printer Refresh','2022-23','CapEx','INR',1.0,450000,450000,420000,30000,'IT-Assets','HQ','Peripherals'),
('Spare Parts Inventory','2022-23','CapEx','INR',1.0,350000,350000,330000,20000,'IT-Assets','HQ','Spares & Consumables');
-- OPEX Projects
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head,initiative_id) VALUES
('Financial MIS Analytics Dashboard','2022-23','OpEx','INR',1.0,800000,800000,750000,50000,'IT-Analytics','HQ','Dashboard Development',(SELECT id FROM initiatives WHERE slug='22-financial-mis-analytics-dashboard-development')),
('Cloud Storage Migration (OneDrive)','2022-23','OpEx','INR',1.0,650000,650000,600000,50000,'IT-Cloud','HQ','Migration Services',(SELECT id FROM initiatives WHERE slug='30-cloud-storage-migration-onedrive-sharepoint')),
('Managed Print Services Implementation','2022-23','OpEx','INR',1.0,400000,400000,370000,30000,'IT-Ops','HQ','Print Management',(SELECT id FROM initiatives WHERE slug='34-managed-print-services-implementation')),
('Centralized Patch Management (WSUS)','2022-23','OpEx','INR',1.0,500000,500000,470000,30000,'IT-Security','HQ','Patch Management',(SELECT id FROM initiatives WHERE slug='28-centralized-patch-management-wsus-rollout')),
('File Server to Cloud Migration','2022-23','OpEx','INR',1.0,550000,550000,520000,30000,'IT-Cloud','HQ','Data Migration',(SELECT id FROM initiatives WHERE slug='31-file-server-to-cloud-content-migration')),
('IT Asset Lifecycle Management System','2022-23','OpEx','INR',1.0,450000,450000,420000,30000,'IT-ITAM','HQ','ITSM Tools',(SELECT id FROM initiatives WHERE slug='35-it-asset-lifecycle-management-system')),
('Legacy DC Decommissioning','2022-23','OpEx','INR',1.0,600000,600000,550000,50000,'IT-DC','HQ','Decommission Services',(SELECT id FROM initiatives WHERE slug='29-legacy-data-center-decommissioning-floor-1')),
('Real-time Utility Monitoring (IoT)','2022-23','OpEx','INR',1.0,700000,700000,650000,50000,'IT-IoT','Factory','IoT Platform',(SELECT id FROM initiatives WHERE slug='20-real-time-utility-monitoring-system-iot')),
('EHS SaaS Evaluation','2022-23','OpEx','INR',1.0,300000,300000,280000,20000,'IT-Strategy','HQ','SaaS Evaluation',(SELECT id FROM initiatives WHERE slug='19-ehs-incident-management-saas-evaluation')),
('Branch Office Network Assessment','2022-23','OpEx','INR',1.0,350000,350000,330000,20000,'IT-Network','HQ','Assessment Services',(SELECT id FROM initiatives WHERE slug='24-branch-office-managed-network-services-assessment')),
('Enterprise Monitoring Visualization','2022-23','OpEx','INR',1.0,250000,250000,230000,20000,'IT-Ops','HQ','Monitoring Tools',(SELECT id FROM initiatives WHERE slug='23-enterprise-monitoring-visualization-deployment'));
-- OPEX Regular
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head) VALUES
('Internet Leased Lines','2022-23','OpEx','INR',1.0,720000,720000,720000,0,'IT-Network','HQ','Connectivity'),
('AMC — Polycom/AV Systems','2022-23','OpEx','INR',1.0,450000,450000,440000,10000,'IT-AMC','HQ','AV Maintenance'),
('Monthly SaaS Licenses','2022-23','OpEx','USD',79.0,36000,36000,35000,1000,'IT-Licensing','HQ','Cloud Subscriptions');

-- ============================================================
-- FY 2023-24
-- ============================================================
-- CAPEX Projects
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head,initiative_id) VALUES
('Dark Fiber WAN Capacity Expansion','2023-24','CapEx','INR',1.0,4500000,4500000,4200000,300000,'IT-Network','HQ','WAN Infrastructure',(SELECT id FROM initiatives WHERE slug='16-dark-fiber-wan-capacity-expansion')),
('Infrastructure Observability Suite (Zabbix)','2023-24','CapEx','INR',1.0,1500000,1500000,1400000,100000,'IT-Ops','HQ','Monitoring Platform',(SELECT id FROM initiatives WHERE slug='17-infrastructure-observability-suite-zabbix'));
-- CAPEX Regular
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head) VALUES
('Hardware Refresh (Laptops/Desktops)','2023-24','CapEx','INR',1.0,2500000,2500000,2350000,150000,'IT-Assets','HQ','End-User Hardware'),
('Mobile Devices (Smartphones/Tablets)','2023-24','CapEx','INR',1.0,800000,800000,750000,50000,'IT-Assets','HQ','Mobile Hardware');
-- OPEX Projects
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head,initiative_id) VALUES
('Corporate Web Asset Cloud Migration','2023-24','OpEx','USD',82.5,25000,25000,23000,2000,'IT-Cloud','HQ','Cloud Migration',(SELECT id FROM initiatives WHERE slug='10-corporate-web-asset-cloud-migration-aws-azure')),
('OT Network Security Roadmap Planning','2023-24','OpEx','INR',1.0,1200000,1200000,1100000,100000,'IT-OT','Factory','OT Security Consulting',(SELECT id FROM initiatives WHERE slug='11-ot-network-security-roadmap-planning')),
('Energy Compliance Blueprint','2023-24','OpEx','INR',1.0,800000,800000,750000,50000,'IT-Compliance','HQ','Compliance Consulting',(SELECT id FROM initiatives WHERE slug='12-energy-compliance-monitoring-blueprint')),
('Centralized Hosting Assessment','2023-24','OpEx','INR',1.0,600000,600000,550000,50000,'IT-Strategy','HQ','Assessment Services',(SELECT id FROM initiatives WHERE slug='13-centralized-infrastructure-hosting-assessment')),
('Enterprise Windows 11 Transition','2023-24','OpEx','INR',1.0,900000,900000,850000,50000,'IT-EndUser','HQ','OS Migration',(SELECT id FROM initiatives WHERE slug='14-enterprise-windows-11-os-transition')),
('Legacy Server OS Modernization (2012R2)','2023-24','OpEx','INR',1.0,1500000,1500000,1400000,100000,'IT-Infra','HQ','OS Modernization',(SELECT id FROM initiatives WHERE slug='15-legacy-server-os-modernization-2012r2'));
-- OPEX Regular
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head) VALUES
('Cloud Consumption Fees (AWS/Azure)','2023-24','OpEx','USD',82.5,30000,30000,28000,2000,'IT-Cloud','HQ','Cloud Hosting'),
('Security Licensing (Zscaler/Palo Alto)','2023-24','OpEx','USD',82.5,22000,22000,21000,1000,'IT-Security','HQ','Security Subscriptions'),
('Regular Maintenance & Repairs','2023-24','OpEx','INR',1.0,800000,800000,760000,40000,'IT-Ops','HQ','Repair & Maintenance');

-- ============================================================
-- FY 2024-25
-- ============================================================
-- CAPEX Projects
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head,initiative_id) VALUES
('Industrial OT Network Segmentation (IEC 62443)','2024-25','CapEx','INR',1.0,8500000,8500000,4200000,4300000,'IT-OT','Factory','OT Security Hardware',(SELECT id FROM initiatives WHERE slug='1-industrial-ot-network-segmentation-iec-62443')),
('Unified Enterprise Wi-Fi 6 Rollout','2024-25','CapEx','INR',1.0,5500000,5500000,2800000,2700000,'IT-Network','Multi-Site','Wireless Hardware',(SELECT id FROM initiatives WHERE slug='3-unified-enterprise-wi-fi-6-rollout-multi-site')),
('Centralized IP-Surveillance (Warehousing)','2024-25','CapEx','INR',1.0,3200000,3200000,1500000,1700000,'IT-PhysicalSec','Warehouse','Surveillance Hardware',(SELECT id FROM initiatives WHERE slug='6-centralized-ip-surveillance-warehousing')),
('High-Density Fiber Distribution Hub','2024-25','CapEx','INR',1.0,4500000,4500000,2000000,2500000,'IT-DC','HQ','DC Infrastructure',(SELECT id FROM initiatives WHERE slug='8-high-density-fiber-distribution-hub-design')),
('Core Network Switch Lifecycle Replacement','2024-25','CapEx','INR',1.0,6000000,6000000,3000000,3000000,'IT-Network','HQ','Network Hardware',(SELECT id FROM initiatives WHERE slug='9-core-network-switch-lifecycle-replacement-eol')),
('Remote Construction Site Surveillance','2024-25','CapEx','INR',1.0,1800000,1800000,900000,900000,'IT-PhysicalSec','Remote','Surveillance Hardware',(SELECT id FROM initiatives WHERE slug='7-remote-construction-site-surveillance-system'));
-- CAPEX Regular
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head) VALUES
('Laptops & Desktops (Annual Refresh)','2024-25','CapEx','INR',1.0,3000000,3000000,1500000,1500000,'IT-Assets','HQ','End-User Hardware'),
('Printers & Peripherals','2024-25','CapEx','INR',1.0,500000,500000,250000,250000,'IT-Assets','HQ','Peripherals'),
('UPS & Power Systems','2024-25','CapEx','INR',1.0,800000,800000,400000,400000,'IT-DC','HQ','Power Infrastructure');
-- OPEX Projects
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head,initiative_id) VALUES
('Cloud Landing Zone Architecture Design','2024-25','OpEx','USD',83.5,35000,35000,18000,17000,'IT-Cloud','HQ','Cloud Architecture',(SELECT id FROM initiatives WHERE slug='5-cloud-landing-zone-architecture-design')),
('SharePoint & OneDrive Implementation','2024-25','OpEx','USD',83.5,20000,20000,12000,8000,'IT-Cloud','HQ','Cloud Migration',(SELECT id FROM initiatives WHERE slug='4-sharepoint-onedrive-business-implementation')),
('AI-Driven Energy Analytics & Automation','2024-25','OpEx','INR',1.0,2500000,2500000,1200000,1300000,'IT-IoT','Factory','IoT Analytics',(SELECT id FROM initiatives WHERE slug='2-ai-driven-energy-analytics-automation'));
-- OPEX Regular
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head) VALUES
('Software Subscriptions (M365 E5)','2024-25','OpEx','USD',83.5,48000,48000,24000,24000,'IT-Licensing','HQ','Cloud Subscriptions'),
('AMC — Network & Security Gear','2024-25','OpEx','INR',1.0,1800000,1800000,900000,900000,'IT-AMC','HQ','Annual Maintenance'),
('Cloud Consumption (AWS/Azure)','2024-25','OpEx','USD',83.5,35000,35000,18000,17000,'IT-Cloud','HQ','Cloud Hosting'),
('Repair & Maintenance','2024-25','OpEx','INR',1.0,600000,600000,300000,300000,'IT-Ops','HQ','Repair & Maintenance'),
('Security Licensing (Zscaler/EDR)','2024-25','OpEx','USD',83.5,28000,28000,14000,14000,'IT-Security','HQ','Security Subscriptions');

-- ============================================================
-- FY 2025-26 (Projection Year)
-- ============================================================
-- CAPEX Regular (projected)
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head) VALUES
('Laptop & Desktop Refresh (Projected)','2025-26','CapEx','INR',1.0,3500000,3500000,0,3500000,'IT-Assets','HQ','End-User Hardware'),
('Network Hardware Lifecycle (Projected)','2025-26','CapEx','INR',1.0,4000000,4000000,0,4000000,'IT-Network','HQ','Network Hardware'),
('Server & Storage Refresh (Projected)','2025-26','CapEx','INR',1.0,6000000,6000000,0,6000000,'IT-DC','HQ','DC Hardware');
-- OPEX Regular (projected)
INSERT INTO financial_budgets (title,fiscal_year,investment_model,currency,exchange_rate_to_inr,planning_amount,outlook_amount,expense_amount,carry_over_amount,cost_center,profit_center,account_head) VALUES
('M365 & SaaS Licensing (Projected)','2025-26','OpEx','USD',84.0,55000,55000,0,55000,'IT-Licensing','HQ','Cloud Subscriptions'),
('Cloud Consumption (Projected)','2025-26','OpEx','USD',84.0,40000,40000,0,40000,'IT-Cloud','HQ','Cloud Hosting'),
('AMC & Maintenance (Projected)','2025-26','OpEx','INR',1.0,2200000,2200000,0,2200000,'IT-AMC','HQ','Annual Maintenance'),
('Security Subscriptions (Projected)','2025-26','OpEx','USD',84.0,32000,32000,0,32000,'IT-Security','HQ','Security Subscriptions');
