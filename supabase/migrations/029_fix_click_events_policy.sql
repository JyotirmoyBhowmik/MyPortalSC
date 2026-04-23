-- Fix for click_events 403 Forbidden error for authenticated users (admins)
-- Drop the existing anon-only policy
DROP POLICY IF EXISTS "Anyone can insert click events" ON public.click_events;

-- Recreate policy to allow BOTH anon and authenticated users to insert click events
CREATE POLICY "Anyone can insert click events"
    ON public.click_events FOR INSERT
    TO public
    WITH CHECK (true);
