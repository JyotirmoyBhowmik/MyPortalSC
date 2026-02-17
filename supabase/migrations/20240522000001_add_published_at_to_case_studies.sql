-- Migration: Add published_at to case_studies
alter table case_studies 
add column if not exists published_at timestamp with time zone;

-- Update existing published case studies to have published_at = created_at or now()
update case_studies 
set published_at = created_at 
where is_published = true and published_at is null;
