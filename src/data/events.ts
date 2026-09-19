export interface Event {
  id: string;
  name: string;
  date: string;
  dateShort: string;
  venue: string;
  location: string;
  time: string;
  priceRange: string;
  priceMin: number;
  priceMax: number;
  type: string[];
  demand: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY HIGH';
  availability: 'Available' | 'Limited' | 'Request Only';
  image: string;
  artist?: string;
  description: string;
  featured?: boolean;
  jugaadDrop?: boolean;
  dropPrice?: number;
  originalPrice?: number;
  dropNumber?: number;
}

export const EVENTS: Event[] = [];

export const DEMAND_COLOR: Record<string, string> = {
  'LOW': '#6B5B52',
  'MEDIUM': '#9A8B82',
  'HIGH': '#7A1F2E',
  'VERY HIGH': '#C1440E',
};

export const DEMAND_LABEL: Record<string, string> = {
  'LOW': 'Low Demand',
  'MEDIUM': 'Filling Fast',
  'HIGH': 'High Demand',
  'VERY HIGH': 'Extremely Rare',
};

export const NAVRATRI_DATES = [
  '10 OCT', '11 OCT', '12 OCT', '13 OCT', '14 OCT',
  '15 OCT', '16 OCT', '17 OCT', '18 OCT', '19 OCT',
];

export const AVAIL_COLOR: Record<string, string> = {

  'Available': '#22c55e',
  'Limited': '#f5b800',
  'Request Only': '#FF5500',
};

export type Page =
  | 'home'
  | 'find-jugaad'
  | 'jugaad-success'
  | 'radar'
  | 'calendar'
  | 'events'
  | 'event-detail'
  | 'request-pass'
  | 'request-success'
  | 'drops'
  | 'gallery'
  | 'organisers'
  | 'organiser-form'
  | 'organiser-success'
  | 'my-requests'
  | 'about'
  | 'contact'
  | 'admin-dashboard'
  | 'organiser-dashboard'
  | 'login';

export interface NavProps {
  navigate: (page: Page, opts?: { eventId?: string }) => void;
  currentPage: Page;
}

// ─── Role & Auth types ────────────────────────────────────────
export type UserRole = 'buyer' | 'organiser' | 'super_admin';

// ─── Event status (from DB) ───────────────────────────────────
export type EventStatus = 'pending_review' | 'approved' | 'rejected';

// ─── Pass request status lifecycle ───────────────────────────
export type PassRequestStatus =
  | 'request_received'
  | 'looking_for_options'
  | 'match_found'
  | 'offer_available'
  | 'completed'
  | 'closed';

// ─── DB-shaped types ──────────────────────────────────────────
export interface PassRequest {
  id: string;
  event_id: string;
  event_name: string;
  buyer_id: string;
  buyer_name: string;
  buyer_email: string;
  quantity: number;
  budget_min: number;
  budget_max: number;
  status: PassRequestStatus;
  created_at: string;
  updated_at: string;
}

export interface JugaadSignal {
  id: string;
  buyer_id: string;
  buyer_name: string;
  buyer_email: string;
  preferred_dates: string[];
  num_passes: number;
  budget_min: number;
  budget_max: number;
  event_type: string[];
  artist_preference: string;
  specific_event: string;
  readiness: 'ready' | 'exploring' | 'maybe';
  created_at: string;
}

export interface OrgAccount {
  id: string;
  name: string;
  email: string;
  org: string;
  event_count: number;
  approved_count: number;
  joined_at: string;
}
