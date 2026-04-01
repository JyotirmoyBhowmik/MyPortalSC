-- Add case study deep-dive fields to existing projects table
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS challenge text,
ADD COLUMN IF NOT EXISTS approach text,
ADD COLUMN IF NOT EXISTS architecture_notes text,
ADD COLUMN IF NOT EXISTS outcome text,
ADD COLUMN IF NOT EXISTS key_metrics jsonb DEFAULT '[]'::jsonb;

-- key_metrics example: [{"label":"DR Recovery Time","before":"8 hrs","after":"45 min"},{"label":"Uptime","before":"99.5%","after":"99.99%"}]

COMMENT ON COLUMN public.projects.challenge IS 'Case Study: Problem statement that was faced';
COMMENT ON COLUMN public.projects.approach IS 'Case Study: Solution approach taken';
COMMENT ON COLUMN public.projects.architecture_notes IS 'Case Study: Technical architecture and implementation details';
COMMENT ON COLUMN public.projects.outcome IS 'Case Study: Results and business impact';
COMMENT ON COLUMN public.projects.key_metrics IS 'Case Study: Before/after metrics as JSON array';
