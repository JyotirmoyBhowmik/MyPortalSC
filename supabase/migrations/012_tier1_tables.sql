-- ============================================================
-- 012_tier1_tables.sql — Testimonials, Timeline, Executive KPIs
-- ============================================================

-- ─── Testimonials ───
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  organization text NOT NULL,
  quote_en text NOT NULL,
  quote_hi text,
  quote_bn text,
  avatar_url text,
  featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TRIGGER set_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published testimonials"
  ON testimonials FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage testimonials"
  ON testimonials FOR ALL USING (is_admin_user());

-- ─── Timeline Entries ───
CREATE TABLE IF NOT EXISTS timeline_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year_start integer NOT NULL,
  year_end integer, -- NULL = present
  title_en text NOT NULL,
  title_hi text,
  title_bn text,
  organization text NOT NULL,
  description_en text,
  description_hi text,
  description_bn text,
  logo_url text,
  entry_type text DEFAULT 'role' CHECK (entry_type IN ('role', 'milestone', 'education', 'award')),
  sort_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TRIGGER set_timeline_entries_updated_at
  BEFORE UPDATE ON timeline_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE timeline_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published timeline"
  ON timeline_entries FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage timeline"
  ON timeline_entries FOR ALL USING (is_admin_user());

-- ─── Executive KPIs ───
CREATE TABLE IF NOT EXISTS executive_kpis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  label_en text NOT NULL,
  label_hi text,
  label_bn text,
  icon text DEFAULT '📊',
  suffix text, -- e.g., '%', '+', 'M'
  sort_order integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TRIGGER set_executive_kpis_updated_at
  BEFORE UPDATE ON executive_kpis
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE executive_kpis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published kpis"
  ON executive_kpis FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage kpis"
  ON executive_kpis FOR ALL USING (is_admin_user());

-- ─── Seed KPIs ───
INSERT INTO executive_kpis (key, value, label_en, label_hi, label_bn, icon, suffix, sort_order) VALUES
  ('years_experience', '15', 'Years of Experience', 'अनुभव के वर्ष', 'অভিজ্ঞতার বছর', '📅', '+', 1),
  ('initiatives_delivered', '88', 'Initiatives Delivered', 'वितरित पहल', 'সম্পন্ন উদ্যোগ', '🚀', '+', 2),
  ('programs_managed', '12', 'Strategic Programs', 'रणनीतिक कार्यक्रम', 'কৌশলগত কর্মসূচি', '📋', '', 3),
  ('budget_managed', '25', 'Budget Managed', 'प्रबंधित बजट', 'পরিচালিত বাজেট', '💰', 'M+', 4),
  ('infrastructure_uptime', '99.9', 'Infrastructure Uptime', 'अवसंरचना अपटाइम', 'অবকাঠামো আপটাইম', '⚡', '%', 5),
  ('team_size', '150', 'Team Members Led', 'टीम सदस्य', 'দলের সদস্য', '👥', '+', 6)
ON CONFLICT (key) DO NOTHING;

-- ─── Seed Testimonials ───
INSERT INTO testimonials (name, role, organization, quote_en, quote_hi, quote_bn, featured, sort_order) VALUES
  ('Rajesh Kumar', 'VP Technology', 'TechCorp India', 'Jyotirmoy''s leadership in infrastructure transformation was instrumental in achieving 99.9% uptime across our South Asia operations.', 'ज्योतिर्मय का बुनियादी ढांचे के परिवर्तन में नेतृत्व हमारे दक्षिण एशिया संचालन में 99.9% अपटाइम प्राप्त करने में सहायक था।', 'জ্যোতির্ময়ের অবকাঠামো রূপান্তরে নেতৃত্ব আমাদের দক্ষিণ এশিয়া অপারেশনে ৯৯.৯% আপটাইম অর্জনে সহায়ক ছিল।', true, 1),
  ('Anita Sharma', 'CTO', 'Digital Nepal', 'His strategic approach to IT governance and project management set new benchmarks for our organization.', 'आईटी शासन और परियोजना प्रबंधन के प्रति उनका रणनीतिक दृष्टिकोण हमारे संगठन के लिए नए मानक स्थापित करता है।', 'আইটি গভর্ন্যান্স এবং প্রকল্প ব্যবস্থাপনায় তার কৌশলগত দৃষ্টিভঙ্গি আমাদের সংস্থার জন্য নতুন মানদণ্ড স্থাপন করে।', true, 2),
  ('Michael Chen', 'Director of Operations', 'CloudFirst Asia', 'Working with Jyotirmoy meant working with someone who understands both the technical depth and the business impact of every decision.', 'ज्योतिर्मय के साथ काम करने का मतलब किसी ऐसे व्यक्ति के साथ काम करना था जो हर निर्णय की तकनीकी गहराई और व्यावसायिक प्रभाव दोनों को समझता है।', 'জ্যোতির্ময়ের সাথে কাজ করার অর্থ এমন কারো সাথে কাজ করা যিনি প্রতিটি সিদ্ধান্তের প্রযুক্তিগত গভীরতা এবং ব্যবসায়িক প্রভাব উভয়ই বোঝেন।', true, 3),
  ('Priya Patel', 'Head of InfoSec', 'SecureNet', 'The security frameworks Jyotirmoy implemented are best-in-class. Our compliance posture improved dramatically under his guidance.', 'ज्योतिर्मय द्वारा लागू किए गए सुरक्षा ढांचे सर्वश्रेष्ठ हैं। उनके मार्गदर्शन में हमारी अनुपालन स्थिति में नाटकीय सुधार हुआ।', 'জ্যোতির্ময় যে নিরাপত্তা কাঠামো বাস্তবায়ন করেছেন তা সর্বোত্তম। তার নির্দেশনায় আমাদের কমপ্লায়েন্স অবস্থার নাটকীয় উন্নতি হয়েছে।', false, 4)
ON CONFLICT DO NOTHING;

-- ─── Seed Timeline ───
INSERT INTO timeline_entries (year_start, year_end, title_en, title_hi, title_bn, organization, description_en, description_hi, description_bn, entry_type, sort_order) VALUES
  (2022, NULL, 'Senior IT Infrastructure Manager', 'वरिष्ठ आईटी अवसंरचना प्रबंधक', 'সিনিয়র আইটি অবকাঠামো ম্যানেজার', 'Enterprise Solutions Nepal', 'Leading enterprise-wide infrastructure transformation and strategic program delivery across South Asia.', 'दक्षिण एशिया में संपूर्ण उद्यम अवसंरचना परिवर्तन और रणनीतिक कार्यक्रम वितरण का नेतृत्व।', 'দক্ষিণ এশিয়া জুড়ে সামগ্রিক এন্টারপ্রাইজ অবকাঠামো রূপান্তর এবং কৌশলগত কর্মসূচি সরবরাহে নেতৃত্ব।', 'role', 1),
  (2019, 2022, 'IT Project Manager', 'आईटी परियोजना प्रबंधक', 'আইটি প্রকল্প ম্যানেজার', 'TechCorp India', 'Managed multi-million dollar infrastructure projects, cloud migration, and security compliance programs.', 'बहु-मिलियन डॉलर अवसंरचना परियोजनाओं, क्लाउड माइग्रेशन और सुरक्षा अनुपालन कार्यक्रमों का प्रबंधन।', 'মাল্টি-মিলিয়ন ডলার অবকাঠামো প্রকল্প, ক্লাউড মাইগ্রেশন এবং নিরাপত্তা কমপ্লায়েন্স কর্মসূচি পরিচালনা।', 'role', 2),
  (2016, 2019, 'Systems Administrator Lead', 'सिस्टम एडमिनिस्ट्रेटर लीड', 'সিস্টেম অ্যাডমিনিস্ট্রেটর লিড', 'DataCenter Plus', 'Led a team of 25+ engineers managing mission-critical infrastructure and datacenter operations.', '25+ इंजीनियरों की एक टीम का नेतृत्व किया जो मिशन-क्रिटिकल अवसंरचना और डेटासेंटर संचालन का प्रबंधन करती थी।', '২৫+ ইঞ্জিনিয়ারদের একটি দল পরিচালনা করেছেন যারা মিশন-ক্রিটিক্যাল অবকাঠামো এবং ডেটাসেন্টার অপারেশন পরিচালনা করতেন।', 'role', 3),
  (2013, 2016, 'Network Engineer', 'नेटवर्क इंजीनियर', 'নেটওয়ার্ক ইঞ্জিনিয়ার', 'ConnectIT Solutions', 'Designed and implemented enterprise network architectures for Fortune 500 clients.', 'फॉर्चून 500 क्लाइंट्स के लिए एंटरप्राइज नेटवर्क आर्किटेक्चर का डिजाइन और कार्यान्वयन।', 'ফরচুন ৫০০ ক্লায়েন্টদের জন্য এন্টারপ্রাইজ নেটওয়ার্ক আর্কিটেকচার ডিজাইন এবং বাস্তবায়ন।', 'role', 4),
  (2010, 2013, 'IT Support Specialist', 'आईटी सपोर्ट विशेषज्ञ', 'আইটি সাপোর্ট বিশেষজ্ঞ', 'InfoTech Services', 'Started career in IT support, quickly advancing through technical problem-solving excellence.', 'आईटी सपोर्ट में करियर शुरू किया, तकनीकी समस्या-समाधान उत्कृष्टता के माध्यम से तेजी से आगे बढ़े।', 'আইটি সাপোর্টে কর্মজীবন শুরু করেছেন, প্রযুক্তিগত সমস্যা-সমাধান উৎকর্ষের মাধ্যমে দ্রুত এগিয়ে গেছেন।', 'role', 5),
  (2021, 2021, 'PMP Certification', 'PMP प्रमाणन', 'PMP সার্টিফিকেশন', 'Project Management Institute', 'Achieved Project Management Professional certification.', 'प्रोजेक्ट मैनेजमेंट प्रोफेशनल प्रमाणन प्राप्त किया।', 'প্রজেক্ট ম্যানেজমেন্ট প্রফেশনাল সার্টিফিকেশন অর্জন।', 'milestone', 6),
  (2010, 2013, 'B.Tech in Computer Science', 'कंप्यूटर विज्ञान में बी.टेक', 'কম্পিউটার সায়েন্সে বি.টেক', 'National Institute of Technology', 'Bachelor of Technology with focus on computer networks and systems.', 'कंप्यूटर नेटवर्क और सिस्टम पर ध्यान केंद्रित करते हुए प्रौद्योगिकी में स्नातक।', 'কম্পিউটার নেটওয়ার্ক এবং সিস্টেমের উপর ফোকাস সহ প্রযুক্তিতে স্নাতক।', 'education', 7)
ON CONFLICT DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials (featured) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_timeline_year ON timeline_entries (year_start DESC);
CREATE INDEX IF NOT EXISTS idx_executive_kpis_order ON executive_kpis (sort_order);
