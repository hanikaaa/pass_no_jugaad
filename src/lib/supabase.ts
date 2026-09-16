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
  RUN THIS SQL IN SUPABASE SQL EDITOR ONCE
──────────────────────────────────────────────────────────────

CREATE TABLE profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT,
  role       TEXT NOT NULL DEFAULT 'buyer'
    CHECK (role IN ('buyer','organiser','super_admin')),
  name       TEXT,
  phone      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, role) VALUES (NEW.id, NEW.email, 'buyer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TABLE events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organiser_id     UUID REFERENCES profiles(id),
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
  reviewed_by      UUID REFERENCES profiles(id),
  reviewed_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pass_requests (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id       UUID REFERENCES events(id) ON DELETE CASCADE,
  buyer_id       UUID REFERENCES profiles(id),
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

CREATE TABLE jugaad_signals (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id          UUID REFERENCES profiles(id),
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

CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin');
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION my_event_ids()
RETURNS UUID[] AS $$
  SELECT ARRAY(SELECT id FROM events WHERE organiser_id = auth.uid());
$$ LANGUAGE SQL SECURITY DEFINER;

ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE events         ENABLE ROW LEVEL SECURITY;
ALTER TABLE pass_requests  ENABLE ROW LEVEL SECURITY;
ALTER TABLE jugaad_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own profile"             ON profiles       FOR ALL     USING (id = auth.uid());
CREATE POLICY "Admin profiles"          ON profiles       FOR SELECT  USING (is_super_admin());
CREATE POLICY "Public approved events"  ON events         FOR SELECT  USING (status = 'approved');
CREATE POLICY "Organiser own events"    ON events         FOR ALL     USING (organiser_id = auth.uid()) WITH CHECK (organiser_id = auth.uid());
CREATE POLICY "Admin all events"        ON events         FOR ALL     USING (is_super_admin());
CREATE POLICY "Buyer own requests"      ON pass_requests  FOR ALL     USING (buyer_id = auth.uid()) WITH CHECK (buyer_id = auth.uid());
CREATE POLICY "Org requests select"     ON pass_requests  FOR SELECT  USING (event_id = ANY(my_event_ids()));
CREATE POLICY "Org requests update"     ON pass_requests  FOR UPDATE  USING (event_id = ANY(my_event_ids()));
CREATE POLICY "Admin all requests"      ON pass_requests  FOR ALL     USING (is_super_admin());
CREATE POLICY "Buyer own signals"       ON jugaad_signals FOR ALL     USING (buyer_id = auth.uid()) WITH CHECK (buyer_id = auth.uid());
CREATE POLICY "Admin all signals"       ON jugaad_signals FOR ALL     USING (is_super_admin());

-- Set super admin once:
-- UPDATE profiles SET role = 'super_admin' WHERE email = 'hanika@passnojugaad.com';
*/
