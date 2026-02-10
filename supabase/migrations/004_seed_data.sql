-- ============================================================
-- 004_seed_data.sql — Initial Seed Data for Testing
-- ============================================================
-- NOTE: Before running this, create an admin user in Supabase Auth
-- (email: admin@jyotirmoy.dev, password: changeme123!) via the
-- Supabase dashboard or CLI. Then replace the user_id below
-- with the UUID of that auth user.
-- ============================================================

-- Seed Content Pages
INSERT INTO content_pages (page_key, title, content, meta_description) VALUES
(
  'home',
  'Home',
  '{"hero_title": "Jyotirmoy Bhowmik", "hero_subtitle": "Full-Stack Developer & Tech Enthusiast", "hero_description": "I build modern, scalable web applications with cutting-edge technologies. Passionate about clean code, elegant design, and impactful solutions."}'::jsonb,
  'Jyotirmoy Bhowmik — Full-Stack Developer portfolio showcasing projects, skills, and certifications.'
),
(
  'about',
  'About Me',
  '{"biography": "I am a passionate full-stack developer with expertise in modern web technologies. My journey in software development has been driven by a deep curiosity for building impactful digital solutions that solve real-world problems.", "professional_summary": "With hands-on experience across the full development lifecycle — from ideation to deployment — I specialize in building scalable, performant web applications using Next.js, React, TypeScript, and cloud-native architectures.", "location": "India", "email": "contact@jyotirmoy.dev"}'::jsonb,
  'Learn about Jyotirmoy Bhowmik — background, skills, and professional journey.'
),
(
  'contact',
  'Contact',
  '{"email": "contact@jyotirmoy.dev", "github": "https://github.com/jyotirmoy", "linkedin": "https://linkedin.com/in/jyotirmoy", "twitter": "https://twitter.com/jyotirmoy"}'::jsonb,
  'Get in touch with Jyotirmoy Bhowmik for collaborations, projects, and opportunities.'
);

-- Seed Skills
INSERT INTO skills (name, category, proficiency_level, years_of_experience, order_index) VALUES
('TypeScript', 'Languages', 5, 3.0, 1),
('JavaScript', 'Languages', 5, 4.0, 2),
('Python', 'Languages', 4, 3.0, 3),
('SQL', 'Languages', 4, 3.0, 4),
('Next.js', 'Frameworks', 5, 2.5, 5),
('React', 'Frameworks', 5, 3.0, 6),
('Node.js', 'Frameworks', 4, 3.0, 7),
('Tailwind CSS', 'Frameworks', 5, 2.0, 8),
('PostgreSQL', 'Databases', 4, 2.5, 9),
('Supabase', 'Databases', 4, 1.5, 10),
('MongoDB', 'Databases', 3, 2.0, 11),
('Git', 'Tools', 5, 4.0, 12),
('Docker', 'Tools', 3, 1.5, 13),
('VS Code', 'Tools', 5, 4.0, 14),
('Vercel', 'Cloud', 4, 2.0, 15),
('AWS', 'Cloud', 3, 1.0, 16);

-- Seed Projects
INSERT INTO projects (title, slug, short_description, detailed_description, status, domain, technologies, start_date, end_date, github_url, order_index) VALUES
(
  'Portfolio Website',
  'portfolio-website',
  'A modern, dynamic personal portfolio built with Next.js 14 and Supabase.',
  'This portfolio is a full-stack web application featuring server-side rendering, dynamic content management via a custom admin dashboard, Supabase authentication, and a beautiful responsive design. It uses Next.js 14 App Router, TypeScript, Tailwind CSS, and Supabase PostgreSQL with Row Level Security.',
  'published',
  ARRAY['Web Development', 'Full-Stack'],
  ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL'],
  '2026-01-15',
  '2026-02-10',
  'https://github.com/jyotirmoy/portfolio',
  1
),
(
  'Task Management App',
  'task-management-app',
  'A collaborative task management application with real-time updates.',
  'Built with React and Supabase, this application allows teams to create, assign, and track tasks in real-time. Features include drag-and-drop boards, real-time collaboration via Supabase Realtime, and user authentication.',
  'published',
  ARRAY['Web Development', 'SaaS'],
  ARRAY['React', 'Supabase', 'TypeScript', 'Tailwind CSS'],
  '2025-09-01',
  '2025-11-15',
  'https://github.com/jyotirmoy/taskmanager',
  2
),
(
  'E-Commerce Dashboard',
  'ecommerce-dashboard',
  'Analytics dashboard for monitoring e-commerce metrics and KPIs.',
  'A comprehensive analytics dashboard featuring interactive charts, real-time sales data, inventory management, and customer insights. Built with Next.js and integrated with multiple data sources.',
  'draft',
  ARRAY['Web Development', 'Analytics'],
  ARRAY['Next.js', 'Python', 'PostgreSQL', 'Chart.js'],
  '2025-12-01',
  NULL,
  NULL,
  3
);

-- Seed Certifications
INSERT INTO certifications (title, issuing_organization, issue_date, expiry_date, credential_id, credential_url, status) VALUES
('AWS Certified Cloud Practitioner', 'Amazon Web Services', '2025-06-15', '2028-06-15', 'AWS-CCP-12345', 'https://aws.amazon.com/verification', 'active'),
('Meta Front-End Developer', 'Meta (Coursera)', '2025-03-20', NULL, 'META-FE-67890', 'https://coursera.org/verify/67890', 'active'),
('Google IT Automation with Python', 'Google (Coursera)', '2024-11-10', NULL, 'GOOGLE-PY-54321', 'https://coursera.org/verify/54321', 'active');

-- Seed Achievements
INSERT INTO achievements (title, description, achievement_date, category, order_index) VALUES
('Hackathon Winner', 'First place at the Regional Tech Hackathon 2025 for building an AI-powered accessibility tool.', '2025-08-20', 'Competition', 1),
('Open Source Contributor', 'Contributed 50+ pull requests to popular open-source projects including Next.js and Supabase.', '2025-05-15', 'Open Source', 2),
('Dean''s List', 'Recognized on the Dean''s List for academic excellence in Computer Science.', '2025-01-10', 'Academic', 3);

-- Seed Page Analytics
INSERT INTO page_analytics (page_path, view_count, unique_visitors) VALUES
('/', 150, 120),
('/about', 80, 65),
('/projects', 95, 78),
('/contact', 45, 38);
