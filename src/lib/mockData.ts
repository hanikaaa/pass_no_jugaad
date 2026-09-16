import { type PassRequest, type JugaadSignal, type OrgAccount } from '../data/events';

// ─── Mock pass requests (all events) ─────────────────────────
export const MOCK_PASS_REQUESTS: PassRequest[] = [
  {
    id: 'pr1', event_id: 'e1', event_name: 'Raas Rang 2026',
    buyer_id: 'b1', buyer_name: 'Mira Desai', buyer_email: 'mira@example.com',
    quantity: 2, budget_min: 800, budget_max: 1500,
    status: 'looking_for_options', created_at: '2026-09-10T10:00:00Z', updated_at: '2026-09-11T09:00:00Z',
  },
  {
    id: 'pr2', event_id: 'e1', event_name: 'Raas Rang 2026',
    buyer_id: 'b2', buyer_name: 'Rohan Shah', buyer_email: 'rohan@example.com',
    quantity: 4, budget_min: 1000, budget_max: 2000,
    status: 'offer_available', created_at: '2026-09-09T14:30:00Z', updated_at: '2026-09-12T11:00:00Z',
  },
  {
    id: 'pr3', event_id: 'e2', event_name: 'United Garba Festival',
    buyer_id: 'b3', buyer_name: 'Priya Mehta', buyer_email: 'priya@example.com',
    quantity: 3, budget_min: 1500, budget_max: 2500,
    status: 'request_received', created_at: '2026-09-13T08:00:00Z', updated_at: '2026-09-13T08:00:00Z',
  },
  {
    id: 'pr4', event_id: 'e5', event_name: 'SBR Mega Garba',
    buyer_id: 'b4', buyer_name: 'Arav Patel', buyer_email: 'arav@example.com',
    quantity: 2, budget_min: 1200, budget_max: 2500,
    status: 'completed', created_at: '2026-08-28T12:00:00Z', updated_at: '2026-09-01T16:00:00Z',
  },
  {
    id: 'pr5', event_id: 'e5', event_name: 'SBR Mega Garba',
    buyer_id: 'b5', buyer_name: 'Diya Joshi', buyer_email: 'diya@example.com',
    quantity: 6, budget_min: 1000, budget_max: 1500,
    status: 'closed', created_at: '2026-08-30T09:00:00Z', updated_at: '2026-09-05T10:00:00Z',
  },
  {
    id: 'pr6', event_id: 'e8', event_name: 'Grand Finale Night',
    buyer_id: 'b6', buyer_name: 'Samir Kapoor', buyer_email: 'samir@example.com',
    quantity: 2, budget_min: 2000, budget_max: 3000,
    status: 'match_found', created_at: '2026-09-08T17:00:00Z', updated_at: '2026-09-10T13:00:00Z',
  },
];

// ─── Buyer's own pass requests (subset) ──────────────────────
export const MY_PASS_REQUESTS: PassRequest[] = [
  MOCK_PASS_REQUESTS[0],
  MOCK_PASS_REQUESTS[1],
  { ...MOCK_PASS_REQUESTS[3], status: 'completed' },
  { ...MOCK_PASS_REQUESTS[4], status: 'closed' },
];

// ─── Mock jugaad signals (Find Your Jugaad submissions) ──────
export const MOCK_JUGAAD_SIGNALS: JugaadSignal[] = [
  {
    id: 'js1', buyer_id: 'b1', buyer_name: 'Mira Desai', buyer_email: 'mira@example.com',
    preferred_dates: ['12 OCT', '15 OCT'], num_passes: 2,
    budget_min: 800, budget_max: 1500, event_type: ['Garba', 'Live Music'],
    artist_preference: 'Falguni Pathak', specific_event: '',
    readiness: 'ready', created_at: '2026-09-10T10:00:00Z',
  },
  {
    id: 'js2', buyer_id: 'b2', buyer_name: 'Rohan Shah', buyer_email: 'rohan@example.com',
    preferred_dates: ['11 OCT'], num_passes: 4,
    budget_min: 1000, budget_max: 2000, event_type: ['Garba', 'DJ Night'],
    artist_preference: '', specific_event: 'United Garba Festival',
    readiness: 'exploring', created_at: '2026-09-09T14:30:00Z',
  },
  {
    id: 'js3', buyer_id: 'b3', buyer_name: 'Priya Mehta', buyer_email: 'priya@example.com',
    preferred_dates: ['19 OCT'], num_passes: 3,
    budget_min: 2000, budget_max: 4000, event_type: ['Live Music', 'Bollywood Night'],
    artist_preference: 'DJ Chetas', specific_event: '',
    readiness: 'ready', created_at: '2026-09-13T08:00:00Z',
  },
  {
    id: 'js4', buyer_id: 'b4', buyer_name: 'Arav Patel', buyer_email: 'arav@example.com',
    preferred_dates: ['13 OCT', '14 OCT', '15 OCT'], num_passes: 5,
    budget_min: 500, budget_max: 1000, event_type: ['Garba', 'Dandiya'],
    artist_preference: '', specific_event: '',
    readiness: 'maybe', created_at: '2026-09-08T16:00:00Z',
  },
  {
    id: 'js5', buyer_id: 'b5', buyer_name: 'Diya Joshi', buyer_email: 'diya@example.com',
    preferred_dates: ['17 OCT', '18 OCT'], num_passes: 2,
    budget_min: 1500, budget_max: 3000, event_type: ['Club Night', 'DJ Night'],
    artist_preference: 'DJ Snake', specific_event: '',
    readiness: 'ready', created_at: '2026-09-12T11:00:00Z',
  },
  {
    id: 'js6', buyer_id: 'b6', buyer_name: 'Samir Kapoor', buyer_email: 'samir@example.com',
    preferred_dates: ['12 OCT'], num_passes: 2,
    budget_min: 2000, budget_max: 5000, event_type: ['Live Music', 'Bollywood Night'],
    artist_preference: '', specific_event: 'Raas Rang 2026',
    readiness: 'ready', created_at: '2026-09-11T09:30:00Z',
  },
  {
    id: 'js7', buyer_id: 'b7', buyer_name: 'Kavya Nair', buyer_email: 'kavya@example.com',
    preferred_dates: ['10 OCT', '11 OCT'], num_passes: 4,
    budget_min: 800, budget_max: 2000, event_type: ['Garba', 'Cultural Event'],
    artist_preference: 'Kinjal Dave', specific_event: '',
    readiness: 'exploring', created_at: '2026-09-07T15:00:00Z',
  },
];

// ─── Buyer's own signals (for My Panel) ──────────────────────
export const MY_JUGAAD_SIGNALS: JugaadSignal[] = [
  MOCK_JUGAAD_SIGNALS[0],
];

// ─── Organiser accounts ───────────────────────────────────────
export const MOCK_ORGANISERS: OrgAccount[] = [
  { id: 'o1', name: 'Vikram Rawal', email: 'vikram@raasrang.com', org: 'Raas Rang Productions', event_count: 1, approved_count: 1, joined_at: '2026-08-15T00:00:00Z' },
  { id: 'o2', name: 'Neha Trivedi', email: 'neha@ugf.in', org: 'United Events Co.', event_count: 2, approved_count: 2, joined_at: '2026-08-10T00:00:00Z' },
  { id: 'o3', name: 'Arjun Bhatt', email: 'arjun@sbrmegagarba.com', org: 'SBR Events', event_count: 1, approved_count: 1, joined_at: '2026-08-20T00:00:00Z' },
  { id: 'o4', name: 'Sonal Parmar', email: 'sonal@newevents.com', org: 'Sonal Events', event_count: 1, approved_count: 0, joined_at: '2026-09-12T00:00:00Z' },
];

// ─── Pending review events (organiser submissions) ────────────
export const PENDING_EVENTS = [
  {
    id: 'pe1', name: 'Navratri Neon Utsav', organiser: 'Sonal Parmar', org: 'Sonal Events',
    email: 'sonal@newevents.com', date: '18 OCT 2026', venue: 'Prahlad Nagar', city: 'Ahmedabad',
    price: '₹900', type: ['DJ Night', 'Club Night'], submitted_at: '2026-09-12T11:00:00Z',
    instagram: 'https://instagram.com/neonutsav',
  },
  {
    id: 'pe2', name: 'Garba Utsav Classic', organiser: 'Ravi Modi', org: 'Modi Events',
    email: 'ravi@modievents.com', date: '16 OCT 2026', venue: 'Science City Road', city: 'Ahmedabad',
    price: '₹600', type: ['Garba', 'Cultural Event'], submitted_at: '2026-09-14T09:00:00Z',
    instagram: '',
  },
];

// ─── Status labels / styles ───────────────────────────────────
export const REQUEST_STATUS_LABEL: Record<string, string> = {
  request_received:    'Request received',
  looking_for_options: 'Looking for options',
  match_found:         'Match found',
  offer_available:     'Offer available',
  completed:           'Completed',
  closed:              'Closed',
};

export const REQUEST_STATUS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  request_received:    { color: '#6B5B52', bg: 'rgba(107,91,82,0.08)',  border: 'rgba(107,91,82,0.2)' },
  looking_for_options: { color: '#C1440E', bg: 'rgba(193,68,14,0.07)', border: 'rgba(193,68,14,0.2)' },
  match_found:         { color: '#7A1F2E', bg: 'rgba(122,31,46,0.07)', border: 'rgba(122,31,46,0.2)' },
  offer_available:     { color: '#2D7A4F', bg: 'rgba(45,122,79,0.07)', border: 'rgba(45,122,79,0.2)' },
  completed:           { color: '#2D7A4F', bg: 'rgba(45,122,79,0.07)', border: 'rgba(45,122,79,0.2)' },
  closed:              { color: '#9A8B82', bg: 'rgba(154,139,130,0.07)', border: 'rgba(154,139,130,0.15)' },
};

export const EVENT_STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  approved:       { color: '#2D7A4F', bg: 'rgba(45,122,79,0.1)'  },
  pending_review: { color: '#C1440E', bg: 'rgba(193,68,14,0.08)' },
  rejected:       { color: '#9A8B82', bg: 'rgba(154,139,130,0.1)' },
};
