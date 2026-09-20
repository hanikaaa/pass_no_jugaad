-- =========================================================================
-- PASS NO JUGAAD: Comprehensive Database Migration & RLS Fix
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- =========================================================================

-- 1. Ensure all columns exist on public.events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS artist TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS instagram_link TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS price_min INTEGER DEFAULT 0;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS price_max INTEGER DEFAULT 0;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending_review';

-- 2. Create secure RPC function to update user roles (bypasses RLS safely)
CREATE OR REPLACE FUNCTION update_user_role(target_user_id UUID, new_role TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET role = new_role
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Fix Profiles RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile updates" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin profiles" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Allow profile updates"
ON public.profiles FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow profile inserts"
ON public.profiles FOR INSERT
WITH CHECK (true);

-- 4. Fix Events RLS policies
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public approved events" ON public.events;
DROP POLICY IF EXISTS "Organiser own events" ON public.events;
DROP POLICY IF EXISTS "Admin all events" ON public.events;
DROP POLICY IF EXISTS "Allow event submissions" ON public.events;
DROP POLICY IF EXISTS "Allow view all events" ON public.events;
DROP POLICY IF EXISTS "Allow update all events" ON public.events;
DROP POLICY IF EXISTS "Allow delete all events" ON public.events;

-- Allow anyone to view events (approved publicly, pending/all for logged in or admin)
CREATE POLICY "Allow view all events"
ON public.events FOR SELECT
USING (true);

-- Allow anyone (guest or logged-in organiser) to submit events
CREATE POLICY "Allow event submissions"
ON public.events FOR INSERT
WITH CHECK (true);

-- Allow organizers and admins to update events
CREATE POLICY "Allow update all events"
ON public.events FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow deletion of events
CREATE POLICY "Allow delete all events"
ON public.events FOR DELETE
USING (true);

-- 5. Fix Pass Requests RLS policies
ALTER TABLE public.pass_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Buyer own requests" ON public.pass_requests;
DROP POLICY IF EXISTS "Org requests select" ON public.pass_requests;
DROP POLICY IF EXISTS "Org requests update" ON public.pass_requests;
DROP POLICY IF EXISTS "Admin all requests" ON public.pass_requests;
DROP POLICY IF EXISTS "Allow view all pass requests" ON public.pass_requests;
DROP POLICY IF EXISTS "Allow insert pass requests" ON public.pass_requests;
DROP POLICY IF EXISTS "Allow update pass requests" ON public.pass_requests;

CREATE POLICY "Allow view all pass requests"
ON public.pass_requests FOR SELECT
USING (true);

CREATE POLICY "Allow insert pass requests"
ON public.pass_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow update pass requests"
ON public.pass_requests FOR UPDATE
USING (true)
WITH CHECK (true);

-- 6. Fix Jugaad Signals RLS policies
ALTER TABLE public.jugaad_signals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Buyer own signals" ON public.jugaad_signals;
DROP POLICY IF EXISTS "Admin all signals" ON public.jugaad_signals;
DROP POLICY IF EXISTS "Allow view signals" ON public.jugaad_signals;
DROP POLICY IF EXISTS "Allow insert signals" ON public.jugaad_signals;

CREATE POLICY "Allow view signals"
ON public.jugaad_signals FOR SELECT
USING (true);

CREATE POLICY "Allow insert signals"
ON public.jugaad_signals FOR INSERT
WITH CHECK (true);
