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
  artistImage?: string;
  description: string;
  contactEmail?: string;
  contactPhone?: string;
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
  'LOW': 'Verified Event',
  'MEDIUM': 'Filling Fast',
  'HIGH': 'High Demand',
  'VERY HIGH': 'Extremely Rare',
};

export const NAVRATRI_DATES = [
  '7 OCT', '8 OCT', '9 OCT', '10 OCT', '11 OCT', '12 OCT', '13 OCT', '14 OCT',
  '15 OCT', '16 OCT', '17 OCT', '18 OCT', '19 OCT', '20 OCT',
];

const MONTH_NAMES: Record<string, string> = {
  '1': 'JAN', '01': 'JAN', 'JAN': 'JAN', 'JANUARY': 'JAN',
  '2': 'FEB', '02': 'FEB', 'FEB': 'FEB', 'FEBRUARY': 'FEB',
  '3': 'MAR', '03': 'MAR', 'MAR': 'MAR', 'MARCH': 'MAR',
  '4': 'APR', '04': 'APR', 'APR': 'APR', 'APRIL': 'APR',
  '5': 'MAY', '05': 'MAY', 'MAY': 'MAY',
  '6': 'JUN', '06': 'JUN', 'JUN': 'JUN', 'JUNE': 'JUN',
  '7': 'JUL', '07': 'JUL', 'JUL': 'JUL', 'JULY': 'JUL',
  '8': 'AUG', '08': 'AUG', 'AUG': 'AUG', 'AUGUST': 'AUG',
  '9': 'SEP', '09': 'SEP', 'SEP': 'SEP', 'SEPTEMBER': 'SEP',
  '10': 'OCT', 'OCT': 'OCT', 'OCTOBER': 'OCT',
  '11': 'NOV', 'NOV': 'NOV', 'NOVEMBER': 'NOV',
  '12': 'DEC', 'DEC': 'DEC', 'DECEMBER': 'DEC',
};

export function normalizeDateShort(rawDate: string | null | undefined): string {
  if (!rawDate) return '12 OCT';
  const clean = rawDate.trim();

  // 1. Format: YYYY-MM-DD or YYYY/MM/DD (e.g. 2026-10-07)
  const ymdMatch = clean.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (ymdMatch) {
    const day = parseInt(ymdMatch[3], 10);
    const mStr = ymdMatch[2];
    const month = MONTH_NAMES[mStr] || 'OCT';
    return `${day} ${month}`;
  }

  // 2. Format: DD-MM-YYYY or DD/MM/YYYY (e.g. 07-10-2026 or 7/10/2026)
  const dmyMatch = clean.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const mStr = dmyMatch[2];
    const month = MONTH_NAMES[mStr] || 'OCT';
    return `${day} ${month}`;
  }

  // 3. Format: "7th October 2026" or "7 OCT" or "7 Oct" or "7th Oct"
  const dayFirstMatch = clean.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)/i);
  if (dayFirstMatch) {
    const day = parseInt(dayFirstMatch[1], 10);
    const month = MONTH_NAMES[dayFirstMatch[2].toUpperCase()] || dayFirstMatch[2].toUpperCase().slice(0, 3);
    return `${day} ${month}`;
  }

  // 4. Format: "October 7th, 2026" or "Oct 7" or "Oct 7th"
  const monthFirstMatch = clean.match(/^([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?/i);
  if (monthFirstMatch) {
    const day = parseInt(monthFirstMatch[2], 10);
    const month = MONTH_NAMES[monthFirstMatch[1].toUpperCase()] || monthFirstMatch[1].toUpperCase().slice(0, 3);
    return `${day} ${month}`;
  }

  // 5. Fallback: extract any digits and words
  const digits = clean.match(/\d{1,2}/);
  const words = clean.match(/[A-Za-z]{3,}/);
  if (digits && words) {
    const day = parseInt(digits[0], 10);
    const month = MONTH_NAMES[words[0].toUpperCase()] || words[0].toUpperCase().slice(0, 3);
    return `${day} ${month}`;
  }

  return clean.split(' ').slice(0, 2).join(' ').toUpperCase();
}

export function parseDateForSorting(dStr: string): number {
  const norm = normalizeDateShort(dStr);
  const parts = norm.split(' ');
  const day = parseInt(parts[0], 10) || 1;
  const monthMap: Record<string, number> = {
    JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
    JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12,
  };
  const month = monthMap[parts[1]] || 10;
  return month * 100 + day;
}

export function isSameDate(eventDate: string | undefined | null, targetDate: string): boolean {
  if (!eventDate || !targetDate) return false;
  const norm1 = normalizeDateShort(eventDate).toUpperCase();
  const norm2 = normalizeDateShort(targetDate).toUpperCase();
  if (norm1 === norm2) return true;

  const parts1 = norm1.split(' ');
  const parts2 = norm2.split(' ');
  const day1 = parseInt(parts1[0], 10);
  const day2 = parseInt(parts2[0], 10);
  const m1 = parts1[1] || 'OCT';
  const m2 = parts2[1] || 'OCT';

  return day1 === day2 && m1 === m2;
}

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
  buyer_phone?: string;
  quantity: number;
  budget_min: number;
  budget_max: number;
  status: PassRequestStatus;
  priority_note?: string;
  created_at: string;
  updated_at: string;
}

export interface JugaadSignal {
  id: string;
  buyer_id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone?: string;
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
