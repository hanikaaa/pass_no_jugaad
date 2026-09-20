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

    // Notify Super Admin of new user registration
    sendNotification('user_signup', { name, email: data.user.email || email });
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

import { sendNotification } from './notifications';

export async function submitEvent(fields: {
  name: string;
  venue: string;
  date: string;
  time?: string;
  price?: number;
  price_min?: number;
  price_max?: number;
  image_url?: string;
  type_tags?: string[];
  artist?: string;
  description: string;
  instagram_link?: string;
  contact_email: string;
}): Promise<{ data?: DBEvent | null; error: string | null }> {
  if (!SUPABASE_CONFIGURED || !supabase) return { error: null };
  const { data: { user } } = await supabase.auth.getUser();

  let organiserId: string | null = user?.id ?? null;

  // If not logged in or missing organiserId, try to lookup existing profile by contact_email
  if (!organiserId && fields.contact_email) {
    try {
      const { data: matchedProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', fields.contact_email.trim().toLowerCase())
        .maybeSingle();
      if (matchedProfile?.id) {
        organiserId = matchedProfile.id;
      }
    } catch {
      // ignore lookup error
    }
  }

  const priceMin = fields.price_min ?? fields.price ?? 0;
  const priceMax = fields.price_max ?? fields.price ?? priceMin;

  const insertPayload: Record<string, any> = {
    name: fields.name,
    venue: fields.venue,
    date: fields.date,
    time: fields.time || '7:00 PM onwards',
    price_min: priceMin,
    price_max: priceMax,
    type_tags: fields.type_tags || ['Garba'],
    artist: fields.artist || null,
    description: fields.description || '',
    instagram_link: fields.instagram_link || null,
    contact_email: fields.contact_email || user?.email || '',
    status: 'pending_review',
  };

  if (organiserId) {
    insertPayload.organiser_id = organiserId;
  }

  if (fields.image_url) {
    insertPayload.image_url = fields.image_url;
  }

  // Attempt 1: Insert with image_url
  let { data, error } = await supabase
    .from('events')
    .insert(insertPayload)
    .select()
    .maybeSingle();

  // Attempt 2: If failed because of missing column (e.g. image_url), retry without image_url
  if (error && error.message && (error.message.includes('image_url') || error.message.includes('column'))) {
    console.warn('Retrying event insert without image_url due to schema:', error.message);
    delete insertPayload.image_url;
    const retry = await supabase.from('events').insert(insertPayload).select().maybeSingle();
    data = retry.data;
    error = retry.error;
  }

  if (!error) {
    // Auto-update role to organiser if signed in
    if (user?.id) {
      try {
        await supabase.from('profiles').update({ role: 'organiser' }).eq('id', user.id).neq('role', 'super_admin');
      } catch {
        // ignore
      }
    }

    // Send email notification to Super Admin
    sendNotification('event_submission', {
      name: fields.name,
      venue: fields.venue,
      date: fields.date,
      priceMin,
      priceMax,
      contactEmail: fields.contact_email || user?.email || '',
      instagramLink: fields.instagram_link,
    }).catch(console.error);

    return { data: data ?? null, error: null };
  }

  console.error('submitEvent error:', error);
  return { error: error?.message ?? 'Failed to submit event' };
}

export async function approveEvent(id: string): Promise<{ error: string | null }> {
  if (!SUPABASE_CONFIGURED || !supabase) return { error: null };
  const { data: { user } } = await supabase.auth.getUser();

  const { data: eventData } = await supabase.from('events').select('*').eq('id', id).maybeSingle();

  const { error } = await supabase.from('events').update({
    status: 'approved', reviewed_by: user?.id ?? null, reviewed_at: new Date().toISOString(),
  }).eq('id', id);

  if (!error && eventData) {
    let organiserEmail = eventData.contact_email;
    if (!organiserEmail && eventData.organiser_id) {
      const { data: prof } = await supabase.from('profiles').select('email').eq('id', eventData.organiser_id).maybeSingle();
      organiserEmail = prof?.email;
    }
    if (organiserEmail) {
      sendNotification('event_approved', {
        eventName: eventData.name,
        organiserEmail,
        date: eventData.date,
        venue: eventData.venue,
      }).catch(console.error);
    }
  }

  return { error: error?.message ?? null };
}

export async function rejectEvent(id: string, reason: string): Promise<{ error: string | null }> {
  if (!SUPABASE_CONFIGURED || !supabase) return { error: null };
  const { data: { user } } = await supabase.auth.getUser();

  const { data: eventData } = await supabase.from('events').select('*').eq('id', id).maybeSingle();

  const { error } = await supabase.from('events').update({
    status: 'rejected', rejection_reason: reason, reviewed_by: user?.id ?? null, reviewed_at: new Date().toISOString(),
  }).eq('id', id);

  if (!error && eventData) {
    let organiserEmail = eventData.contact_email;
    if (!organiserEmail && eventData.organiser_id) {
      const { data: prof } = await supabase.from('profiles').select('email').eq('id', eventData.organiser_id).maybeSingle();
      organiserEmail = prof?.email;
    }
    if (organiserEmail) {
      sendNotification('event_rejected', {
        eventName: eventData.name,
        organiserEmail,
        reason,
      }).catch(console.error);
    }
  }

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
  try {
    const [eventsRes, profilesRes] = await Promise.all([
      supabase.from('events').select('*').eq('status', 'pending_review').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, name, email, org_name'),
    ]);
    const profiles = profilesRes.data ?? [];
    return (eventsRes.data ?? []).map((e: any) => {
      const prof = profiles.find((p: any) => p.id === e.organiser_id);
      return {
        ...e,
        profiles: prof ? { name: prof.name, email: prof.email, org_name: prof.org_name } : undefined,
      };
    });
  } catch (err) {
    console.error('getPendingEvents error:', err);
    return [];
  }
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

  // Fetch event details and buyer profile for email notifications
  const [eventRes, profileRes] = await Promise.all([
    supabase.from('events').select('name, contact_email, organiser_id').eq('id', data.event_id).maybeSingle(),
    supabase.from('profiles').select('name, email').eq('id', user.id).maybeSingle(),
  ]);

  const { error } = await supabase.from('pass_requests').insert({ ...data, buyer_id: user.id });

  if (!error) {
    // Send email notification to Super Admin, Buyer, and Organiser
    sendNotification('pass_request', {
      eventName: eventRes.data?.name || 'Navratri Event',
      buyerName: profileRes.data?.name || user.email?.split('@')[0] || 'Pass Seeker',
      buyerEmail: profileRes.data?.email || user.email || '',
      quantity: data.quantity,
      budgetMin: data.budget_min,
      budgetMax: data.budget_max,
      priorityNote: data.priority_note,
      organiserEmail: eventRes.data?.contact_email,
    }).catch(console.error);
  }

  return { error: error?.message ?? null };
}

export async function getMyPassRequests(): Promise<DBPassRequest[]> {
  if (!SUPABASE_CONFIGURED || !supabase) return [];
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  try {
    const [reqsRes, eventsRes] = await Promise.all([
      supabase.from('pass_requests').select('*').eq('buyer_id', user.id).order('created_at', { ascending: false }),
      supabase.from('events').select('id, name'),
    ]);
    const eventsMap = new Map((eventsRes.data ?? []).map((e: any) => [e.id, e.name]));
    return (reqsRes.data ?? []).map((r: any) => ({
      ...r,
      event_name: eventsMap.get(r.event_id) || 'Navratri Event',
    }));
  } catch (err) {
    console.error('getMyPassRequests error:', err);
    return [];
  }
}

export async function getRequestsForMyEvents(): Promise<DBPassRequest[]> {
  if (!SUPABASE_CONFIGURED || !supabase) return [];
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  try {
    const [eventsRes, reqsRes, profilesRes] = await Promise.all([
      supabase.from('events').select('id, name, organiser_id').eq('organiser_id', user.id),
      supabase.from('pass_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, name, email'),
    ]);
    const myEventIds = new Set((eventsRes.data ?? []).map((e: any) => e.id));
    const myEventsMap = new Map((eventsRes.data ?? []).map((e: any) => [e.id, e.name]));
    const profilesMap = new Map((profilesRes.data ?? []).map((p: any) => [p.id, p]));

    return (reqsRes.data ?? [])
      .filter((r: any) => myEventIds.has(r.event_id))
      .map((r: any) => {
        const prof = profilesMap.get(r.buyer_id);
        return {
          ...r,
          event_name: myEventsMap.get(r.event_id) || 'Event',
          buyer_name: prof?.name,
          buyer_email: prof?.email,
        };
      });
  } catch (err) {
    console.error('getRequestsForMyEvents error:', err);
    return [];
  }
}

export async function getAllPassRequests(): Promise<DBPassRequest[]> {
  if (!SUPABASE_CONFIGURED || !supabase) return [];
  try {
    const [reqsRes, eventsRes, profilesRes] = await Promise.all([
      supabase.from('pass_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('events').select('id, name'),
      supabase.from('profiles').select('id, name, email'),
    ]);
    const eventsMap = new Map((eventsRes.data ?? []).map((e: any) => [e.id, e.name]));
    const profilesMap = new Map((profilesRes.data ?? []).map((p: any) => [p.id, p]));

    return (reqsRes.data ?? []).map((r: any) => {
      const prof = profilesMap.get(r.buyer_id);
      return {
        ...r,
        event_name: eventsMap.get(r.event_id) || 'Navratri Event',
        buyer_name: prof?.name,
        buyer_email: prof?.email,
      };
    });
  } catch (err) {
    console.error('getAllPassRequests error:', err);
    return [];
  }
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

  const profileRes = await supabase.from('profiles').select('name, email').eq('id', user.id).maybeSingle();

  const { error } = await supabase.from('jugaad_signals').insert({ ...data, buyer_id: user.id });

  if (!error) {
    sendNotification('jugaad_signal', {
      buyerName: profileRes.data?.name || user.email?.split('@')[0] || 'Pass Seeker',
      buyerEmail: profileRes.data?.email || user.email || '',
      preferredDates: data.preferred_dates,
      numPasses: data.num_passes,
      budgetMin: data.budget_min,
      budgetMax: data.budget_max,
      eventTypes: data.event_types,
      artistPreference: data.artist_preference,
      specificEvent: data.specific_event,
      readiness: data.readiness,
    }).catch(console.error);
  }

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
  try {
    const [profilesRes, eventsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('role', 'organiser').order('created_at', { ascending: false }),
      supabase.from('events').select('id, organiser_id, status'),
    ]);
    const profiles = profilesRes.data ?? [];
    const events = eventsRes.data ?? [];

    return profiles.map((p: any) => {
      const orgEvents = events.filter((e: any) => e.organiser_id === p.id);
      return {
        id: p.id,
        name: p.name,
        email: p.email,
        org: p.org_name ?? '—',
        event_count: orgEvents.length,
        approved_count: orgEvents.filter((e: any) => e.status === 'approved').length,
        joined_at: p.created_at,
      };
    });
  } catch (err) {
    console.error('getOrganisers error:', err);
    return [];
  }
}

export async function getAllUsers(): Promise<Profile[]> {
  if (!SUPABASE_CONFIGURED || !supabase) return [];
  const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  return data ?? [];
}


export async function updateUserRole(userId: string, role: 'buyer' | 'organiser' | 'super_admin'): Promise<{ error: string | null }> {
  if (!SUPABASE_CONFIGURED || !supabase) return { error: null };
  try {
    // 1. First attempt via Supabase RPC function (bypasses RLS if created in SQL editor)
    const { error: rpcError } = await supabase.rpc('update_user_role', {
      target_user_id: userId,
      new_role: role,
    });
    if (!rpcError) {
      return { error: null };
    }

    // 2. Fallback to direct table update with returned data check
    const { data, error } = await supabase.from('profiles').update({ role }).eq('id', userId).select();
    if (error) {
      return { error: error.message };
    }
    if (data && data.length === 0) {
      return { error: 'RLS policy prevented update. Please run the SQL migration in Supabase SQL editor.' };
    }
    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Failed to update user role' };
  }
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

