/**
 * Clean API layer — all components call these functions, never raw Supabase.
 * When SUPABASE_CONFIGURED is false, functions return mock data so the app
 * works in demo mode without env vars.
 */

import { supabase, SUPABASE_CONFIGURED, type Profile, type DBEvent, type DBPassRequest, type DBJugaadSignal } from './supabase';


// ─── Auth ─────────────────────────────────────────────────────

export async function signUp(email: string, password: string, name: string): Promise<{ error: string | null; needsEmailConfirmation?: boolean }> {
  if (!SUPABASE_CONFIGURED || !supabase) return { error: null }; // demo: always succeed
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, role: 'buyer' } }
  });
  if (error) return { error: error.message };

  // If Supabase has email confirmation enabled and session is not yet active
  if (data.user && !data.session) {
    return { error: null, needsEmailConfirmation: true };
  }

  // Ensure profile is created/updated in profiles table
  if (data.user) {
    try {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: data.user.email,
        name,
        role: 'buyer'
      });
    } catch {
      // ignore if RLS or trigger handled it
    }
  }

  return { error: null };
}

export async function signIn(email: string, password: string): Promise<{ error: string | null }> {
  if (!SUPABASE_CONFIGURED || !supabase) return { error: null };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error?.message ?? null };
}

export async function signOut(): Promise<void> {
  if (!SUPABASE_CONFIGURED || !supabase) return;
  await supabase.auth.signOut();
}

export async function sendPasswordReset(email: string): Promise<{ error: string | null }> {
  if (!SUPABASE_CONFIGURED || !supabase) return { error: null };
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  return { error: error?.message ?? null };
}

export async function getCurrentProfile(): Promise<Profile | null> {
  if (!SUPABASE_CONFIGURED || !supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    if (data) return data;
  } catch {
    // If profiles table query fails, return a profile fallback from user metadata
  }

  // Fallback profile from auth session if table row is not ready yet
  return {
    id: user.id,
    email: user.email || '',
    role: ((user.user_metadata?.role as any) || 'buyer'),
    name: (user.user_metadata?.name as string) || null,
    phone: null,
    created_at: user.created_at || new Date().toISOString(),
  };
}

// ─── Events ───────────────────────────────────────────────────

export async function getApprovedEvents(): Promise<DBEvent[]> {
  if (!SUPABASE_CONFIGURED || !supabase) return [];
  const { data } = await supabase.from('events').select('*').eq('status', 'approved').order('date');
  return data ?? [];
}

export async function getEventById(id: string): Promise<DBEvent | null> {
  if (!SUPABASE_CONFIGURED || !supabase) return null;
  const { data } = await supabase.from('events').select('*').eq('id', id).single();
  return data ?? null;
}

export async function submitEvent(fields: {
  name: string; venue: string; date: string; time: string;
  price_min: number; price_max: number; type_tags: string[];
  artist: string; description: string; instagram_link: string; contact_email: string;
}): Promise<{ error: string | null }> {
  if (!SUPABASE_CONFIGURED || !supabase) return { error: null }; // demo: succeed silently
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in' };
  const { error } = await supabase.from('events').insert({
    ...fields,
    organiser_id: user.id,
    status: 'pending_review',
  });
  return { error: error?.message ?? null };
}

export async function approveEvent(id: string): Promise<{ error: string | null }> {
  if (!SUPABASE_CONFIGURED || !supabase) return { error: null };
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from('events').update({
    status: 'approved', reviewed_by: user?.id ?? null, reviewed_at: new Date().toISOString(),
  }).eq('id', id);
  return { error: error?.message ?? null };
}

export async function rejectEvent(id: string, reason: string): Promise<{ error: string | null }> {
  if (!SUPABASE_CONFIGURED || !supabase) return { error: null };
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from('events').update({
    status: 'rejected', rejection_reason: reason, reviewed_by: user?.id ?? null, reviewed_at: new Date().toISOString(),
  }).eq('id', id);
  return { error: error?.message ?? null };
}

export async function deleteEvent(id: string): Promise<{ error: string | null }> {
  if (!SUPABASE_CONFIGURED || !supabase) return { error: null };
  const { error } = await supabase.from('events').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export async function updateEvent(id: string, fields: Partial<DBEvent>): Promise<{ error: string | null }> {
  if (!SUPABASE_CONFIGURED || !supabase) return { error: null };
  const { error } = await supabase.from('events').update({
    ...fields, updated_at: new Date().toISOString(),
  }).eq('id', id);
  return { error: error?.message ?? null };
}

// Admin
export async function getAllEvents(): Promise<DBEvent[]> {
  if (!SUPABASE_CONFIGURED || !supabase) return [];
  const { data } = await supabase.from('events').select('*').order('created_at', { ascending: false });
  return data ?? [];
}

export async function getPendingEvents(): Promise<DBEvent[]> {
  if (!SUPABASE_CONFIGURED || !supabase) return [];
  const { data } = await supabase
    .from('events')
    .select('*, profiles(name, email, org_name)')
    .eq('status', 'pending_review')
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getMyEvents(): Promise<DBEvent[]> {
  if (!SUPABASE_CONFIGURED || !supabase) return [];
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase.from('events').select('*').eq('organiser_id', user.id).order('created_at', { ascending: false });
  return data ?? [];
}

// ─── Pass Requests ────────────────────────────────────────────

export async function submitPassRequest(data: {
  event_id: string; quantity: number;
  budget_min: number; budget_max: number;
  priority_note: string;
}): Promise<{ error: string | null }> {
  if (!SUPABASE_CONFIGURED || !supabase) return { error: null };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in' };
  const { error } = await supabase.from('pass_requests').insert({ ...data, buyer_id: user.id });
  return { error: error?.message ?? null };
}

export async function getMyPassRequests(): Promise<DBPassRequest[]> {
  if (!SUPABASE_CONFIGURED || !supabase) return [];
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from('pass_requests')
    .select('*, events(name)')
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false });
  return (data ?? []).map((r: any) => ({ ...r, event_name: r.events?.name }));
}

export async function getRequestsForMyEvents(): Promise<DBPassRequest[]> {
  if (!SUPABASE_CONFIGURED || !supabase) return [];
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from('pass_requests')
    .select('*, events!inner(name, organiser_id), profiles(name, email)')
    .eq('events.organiser_id', user.id)
    .order('created_at', { ascending: false });
  return (data ?? []).map((r: any) => ({
    ...r, event_name: r.events?.name, buyer_name: r.profiles?.name, buyer_email: r.profiles?.email,
  }));
}

export async function getAllPassRequests(): Promise<DBPassRequest[]> {
  if (!SUPABASE_CONFIGURED || !supabase) return [];
  const { data } = await supabase
    .from('pass_requests')
    .select('*, events(name), profiles(name, email)')
    .order('created_at', { ascending: false });
  return (data ?? []).map((r: any) => ({
    ...r, event_name: r.events?.name, buyer_name: r.profiles?.name, buyer_email: r.profiles?.email,
  }));
}

export async function updateRequestStatus(
  id: string,
  status: DBPassRequest['status'],
  offerDetails?: string,
): Promise<{ error: string | null }> {
  if (!SUPABASE_CONFIGURED || !supabase) return { error: null };
  const { error } = await supabase.from('pass_requests').update({
    status, offer_details: offerDetails ?? null, updated_at: new Date().toISOString(),
  }).eq('id', id);
  return { error: error?.message ?? null };
}

// ─── Jugaad Signals ───────────────────────────────────────────

export async function submitJugaadSignal(data: {
  preferred_dates: string[]; num_passes: number;
  budget_min: number; budget_max: number;
  event_types: string[]; artist_preference: string;
  specific_event: string; readiness: 'ready' | 'exploring' | 'maybe';
}): Promise<{ error: string | null }> {
  if (!SUPABASE_CONFIGURED || !supabase) return { error: null };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in' };
  const { error } = await supabase.from('jugaad_signals').insert({ ...data, buyer_id: user.id });
  return { error: error?.message ?? null };
}

export async function getMySignals(): Promise<DBJugaadSignal[]> {
  if (!SUPABASE_CONFIGURED || !supabase) return [];
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from('jugaad_signals')
    .select('*')
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getAllSignals(): Promise<DBJugaadSignal[]> {
  if (!SUPABASE_CONFIGURED || !supabase) return [];
  const { data } = await supabase
    .from('jugaad_signals')
    .select('*, profiles(name, email)')
    .order('created_at', { ascending: false });
  return (data ?? []).map((s: any) => ({
    ...s, buyer_name: s.profiles?.name, buyer_email: s.profiles?.email,
  }));
}

export async function getRadarAggregates(): Promise<{
  totalSeekers: number; avgGroup: number;
  byDate: { date: string; count: number; avg_budget_min: number; avg_budget_max: number }[];
  topTypes: { type: string; count: number }[];
}> {
  if (!SUPABASE_CONFIGURED || !supabase) {
    return { totalSeekers: 0, avgGroup: 0, byDate: [], topTypes: [] };
  }
  const { data: signals } = await supabase.from('jugaad_signals').select('*');
  const all = signals ?? [];
  const byDate: Record<string, { count: number; bMin: number[]; bMax: number[] }> = {};
  const byType: Record<string, number> = {};
  all.forEach((s: any) => {
    (s.preferred_dates ?? []).forEach((d: string) => {
      byDate[d] = byDate[d] ?? { count: 0, bMin: [], bMax: [] };
      byDate[d].count++;
      byDate[d].bMin.push(s.budget_min);
      byDate[d].bMax.push(s.budget_max);
    });
    (s.event_types ?? []).forEach((t: string) => { byType[t] = (byType[t] ?? 0) + 1; });
  });
  const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
  return {
    totalSeekers: all.length,
    avgGroup: all.length ? all.reduce((s: number, r: any) => s + (r.num_passes ?? 0), 0) / all.length : 0,
    byDate: Object.entries(byDate)
      .map(([date, v]) => ({ date, count: v.count, avg_budget_min: avg(v.bMin), avg_budget_max: avg(v.bMax) }))
      .sort((a, b) => b.count - a.count),
    topTypes: Object.entries(byType).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count),
  };
}

// ─── Admin ────────────────────────────────────────────────────

export async function getOrganisers() {
  if (!SUPABASE_CONFIGURED || !supabase) return [];
  const { data } = await supabase
    .from('profiles')
    .select('*, events(id, status)')
    .eq('role', 'organiser')
    .order('created_at', { ascending: false });
  return (data ?? []).map((p: any) => ({
    id: p.id, name: p.name, email: p.email, org: p.org_name ?? '—',
    event_count: p.events?.length ?? 0,
    approved_count: p.events?.filter((e: any) => e.status === 'approved').length ?? 0,
    joined_at: p.created_at,
  }));
}

export async function getAllUsers(): Promise<Profile[]> {
  if (!SUPABASE_CONFIGURED || !supabase) return [];
  const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  return data ?? [];
}


export async function updateUserRole(userId: string, role: 'buyer' | 'organiser' | 'super_admin'): Promise<{ error: string | null }> {
  if (!SUPABASE_CONFIGURED || !supabase) return { error: null };
  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
  return { error: error?.message ?? null };
}

export async function createEventByAdmin(eventData: Partial<DBEvent>): Promise<{ data: DBEvent | null; error: string | null }> {
  if (!SUPABASE_CONFIGURED || !supabase) return { data: null, error: null };
  const { data, error } = await supabase.from('events').insert({
    ...eventData,
    status: 'approved',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).select().single();
  return { data: data ?? null, error: error?.message ?? null };
}

export async function updateEventByAdmin(id: string, eventData: Partial<DBEvent>): Promise<{ error: string | null }> {
  if (!SUPABASE_CONFIGURED || !supabase) return { error: null };
  const { error } = await supabase.from('events').update({
    ...eventData,
    updated_at: new Date().toISOString(),
  }).eq('id', id);
  return { error: error?.message ?? null };
}

export async function updatePassRequestWithOffer(id: string, status: string, offer_details: string): Promise<{ error: string | null }> {
  if (!SUPABASE_CONFIGURED || !supabase) return { error: null };
  const { error } = await supabase.from('pass_requests').update({
    status,
    offer_details,
    updated_at: new Date().toISOString(),
  }).eq('id', id);
  return { error: error?.message ?? null };
}

