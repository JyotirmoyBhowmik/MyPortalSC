-- Click events table for visitor heatmap analytics
CREATE TABLE IF NOT EXISTS public.click_events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    page_path text NOT NULL,
    x_percent numeric(5,2) NOT NULL,
    y_percent numeric(5,2) NOT NULL,
    element_selector text,
    created_at timestamptz DEFAULT now()
);

-- Index for efficient page-level queries
CREATE INDEX IF NOT EXISTS idx_click_events_page ON public.click_events(page_path);
CREATE INDEX IF NOT EXISTS idx_click_events_created ON public.click_events(created_at);

-- Enable RLS for security
ALTER TABLE public.click_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (tracking)
CREATE POLICY "Anyone can insert click events"
    ON public.click_events FOR INSERT
    TO anon WITH CHECK (true);

-- Only authenticated admins can read
CREATE POLICY "Admins can view click events"
    ON public.click_events FOR SELECT
    TO authenticated USING (true);

-- Auto-cleanup: remove events older than 30 days (run as cron or manual)
-- DELETE FROM public.click_events WHERE created_at < now() - interval '30 days';

-- Add integrity_hash column to contact_submissions for signed visitor logs
ALTER TABLE public.contact_submissions
ADD COLUMN IF NOT EXISTS integrity_hash text;

COMMENT ON COLUMN public.contact_submissions.integrity_hash IS 'SHA-256 hash of submission data for tamper detection';
