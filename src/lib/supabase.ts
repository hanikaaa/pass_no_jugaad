import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const SUPABASE_CONFIGURED = !!(supabaseUrl && supabaseAnonKey);

export const supabase = SUPABASE_CONFIGURED
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null as ReturnType<typeof createClient> | null;

// ─── DB types ─────────────────────────────────────────────────

export interface Profile {
  id: string;
  email: string;
  role: 'buyer' | 'organiser' | 'super_admin';
  name: string | null;
  phone: string | null;
  created_at: string;
}

export interface DBEvent {
  id: string;
  organiser_id: string | null;
  name: string;
  venue: string | null;
  date: string | null;
  time: string | null;
  price_min: number | null;
  price_max: number | null;
  image_url?: string | null;
  image?: string | null;
  type_tags: string[] | null;
  artist: string | null;
  description: string | null;
  instagram_link: string | null;
  contact_email: string | null;
  status: 'pending_review' | 'approved' | 'rejected';
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBPassRequest {
  id: string;
  event_id: string;
  buyer_id: string;
  quantity: number;
  budget_min: number | null;
  budget_max: number | null;
  priority_note: string | null;
  status: 'request_received' | 'looking_for_options' | 'match_found' | 'offer_available' | 'completed' | 'closed';
  offer_details: string | null;
  created_at: string;
  updated_at: string;
  event_name?: string;
  buyer_name?: string;
  buyer_email?: string;
}

export interface DBJugaadSignal {
  id: string;
  buyer_id: string;
  preferred_dates: string[];
  num_passes: number;
  budget_min: number;
  budget_max: number;
  event_types: string[];
  artist_preference: string | null;
  specific_event: string | null;
  readiness: 'ready' | 'exploring' | 'maybe';
  created_at: string;
  buyer_name?: string;
  buyer_email?: string;
}

/*
──────────────────────────────────────────────────────────────
  RUN THIS SQL IN YOUR SUPABASE SQL EDITOR TO FIX SIGNUP & SCHEMA
──────────────────────────────────────────────────────────────

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT,
  role       TEXT NOT NULL DEFAULT 'buyer'
    CHECK (role IN ('buyer','organiser','super_admin')),
  name       TEXT,
  phone      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Trigger Function to Auto-Create Profile on User Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, name)
  VALUES (
    NEW.id,
    NEW.email,
    'buyer',
    COALESCE(NEW.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      name = COALESCE(EXCLUDED.name, public.profiles.name);
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$;

-- 3. Drop existing trigger if any and create new trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Create Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organiser_id     UUID REFERENCES public.profiles(id),
  name             TEXT NOT NULL,
  venue            TEXT,
  date             TEXT,
  time             TEXT,
  price_min        INTEGER,
  price_max        INTEGER,
  type_tags        TEXT[],
  artist           TEXT,
  description      TEXT,
  instagram_link   TEXT,
  contact_email    TEXT,
  status           TEXT NOT NULL DEFAULT 'pending_review'
    CHECK (status IN ('pending_review','approved','rejected')),
  rejection_reason TEXT,
  reviewed_by      UUID REFERENCES public.profiles(id),
  reviewed_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Pass Requests Table
CREATE TABLE IF NOT EXISTS public.pass_requests (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id       UUID REFERENCES public.events(id) ON DELETE CASCADE,
  buyer_id       UUID REFERENCES public.profiles(id),
  quantity       INTEGER NOT NULL,
  budget_min     INTEGER,
  budget_max     INTEGER,
  priority_note  TEXT,
  status         TEXT NOT NULL DEFAULT 'request_received'
    CHECK (status IN ('request_received','looking_for_options','match_found','offer_available','completed','closed')),
  offer_details  TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Jugaad Signals Table
CREATE TABLE IF NOT EXISTS public.jugaad_signals (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id          UUID REFERENCES public.profiles(id),
  preferred_dates   TEXT[],
  num_passes        INTEGER,
  budget_min        INTEGER,
  budget_max        INTEGER,
  event_types       TEXT[],
  artist_preference TEXT,
  specific_event    TEXT,
  readiness         TEXT CHECK (readiness IN ('ready','exploring','maybe')),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Helper Functions for RLS
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin');
$$;

CREATE OR REPLACE FUNCTION public.my_event_ids()
RETURNS UUID[]
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  SELECT ARRAY(SELECT id FROM public.events WHERE organiser_id = auth.uid());
$$;

-- 8. Enable RLS
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pass_requests  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jugaad_signals ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies
DROP POLICY IF EXISTS "Own profile"             ON public.profiles;
DROP POLICY IF EXISTS "Admin profiles"          ON public.profiles;
DROP POLICY IF EXISTS "Public approved events"  ON public.events;
DROP POLICY IF EXISTS "Organiser own events"    ON public.events;
DROP POLICY IF EXISTS "Admin all events"        ON public.events;
DROP POLICY IF EXISTS "Buyer own requests"      ON public.pass_requests;
DROP POLICY IF EXISTS "Org requests select"     ON public.pass_requests;
DROP POLICY IF EXISTS "Org requests update"     ON public.pass_requests;
DROP POLICY IF EXISTS "Admin all requests"      ON public.pass_requests;
DROP POLICY IF EXISTS "Buyer own signals"       ON public.jugaad_signals;
DROP POLICY IF EXISTS "Admin all signals"       ON public.jugaad_signals;

CREATE POLICY "Own profile"             ON public.profiles       FOR ALL     USING (id = auth.uid());
CREATE POLICY "Admin profiles"          ON public.profiles       FOR SELECT  USING (public.is_super_admin());
CREATE POLICY "Public approved events"  ON public.events         FOR SELECT  USING (status = 'approved');
CREATE POLICY "Organiser own events"    ON public.events         FOR ALL     USING (organiser_id = auth.uid()) WITH CHECK (organiser_id = auth.uid());
CREATE POLICY "Admin all events"        ON public.events         FOR ALL     USING (public.is_super_admin());
CREATE POLICY "Buyer own requests"      ON public.pass_requests  FOR ALL     USING (buyer_id = auth.uid()) WITH CHECK (buyer_id = auth.uid());
CREATE POLICY "Org requests select"     ON public.pass_requests  FOR SELECT  USING (event_id = ANY(public.my_event_ids()));
CREATE POLICY "Org requests update"     ON public.pass_requests  FOR UPDATE  USING (event_id = ANY(public.my_event_ids()));
CREATE POLICY "Admin all requests"      ON public.pass_requests  FOR ALL     USING (public.is_super_admin());
CREATE POLICY "Buyer own signals"       ON public.jugaad_signals FOR ALL     USING (buyer_id = auth.uid()) WITH CHECK (buyer_id = auth.uid());
CREATE POLICY "Admin all signals"       ON public.jugaad_signals FOR ALL     USING (public.is_super_admin());

-- Optional: Promote initial user to super_admin:
-- UPDATE public.profiles SET role = 'super_admin' WHERE email = 'hanika@passnojugaad.com';
*/
