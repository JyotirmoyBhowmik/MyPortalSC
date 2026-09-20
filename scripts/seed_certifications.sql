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
