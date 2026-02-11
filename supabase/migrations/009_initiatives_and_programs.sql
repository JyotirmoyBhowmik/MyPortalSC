-- ============================================================
-- 009_initiatives_and_programs.sql
-- Programs & Initiatives tables for portfolio V3
-- ============================================================

-- 1. Programs Table
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  icon text DEFAULT '📋',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Initiatives Table
CREATE TABLE IF NOT EXISTS initiatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  program_id uuid REFERENCES programs(id) ON DELETE SET NULL,
  fiscal_year text NOT NULL,
  strategic_area text NOT NULL,
  criticality text DEFAULT 'Medium' CHECK (criticality IN ('Critical', 'High', 'Medium', 'Low')),
  delivery_focus text,
  status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_initiatives_slug ON initiatives(slug);
CREATE INDEX IF NOT EXISTS idx_initiatives_status ON initiatives(status) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_initiatives_fiscal_year ON initiatives(fiscal_year);
CREATE INDEX IF NOT EXISTS idx_initiatives_program ON initiatives(program_id);
CREATE INDEX IF NOT EXISTS idx_initiatives_criticality ON initiatives(criticality);
CREATE INDEX IF NOT EXISTS idx_programs_code ON programs(code);

-- ============================================================
-- RLS Policies
-- ============================================================

-- Programs
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Programs are viewable by everyone"
  ON programs FOR SELECT
  USING (true);

CREATE POLICY "Programs are editable by admin"
  ON programs FOR ALL
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- Initiatives
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published initiatives are viewable by everyone"
  ON initiatives FOR SELECT
  USING (status = 'published');

CREATE POLICY "Initiatives are fully accessible by admin"
  ON initiatives FOR ALL
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- ============================================================
-- Updated_at trigger (reuse existing function if available)
-- ============================================================
DO $$
BEGIN
  -- Create the trigger function if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $fn$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $fn$ LANGUAGE plpgsql;
  END IF;
END $$;

CREATE OR REPLACE TRIGGER programs_updated_at
  BEFORE UPDATE ON programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER initiatives_updated_at
  BEFORE UPDATE ON initiatives
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
