import { type PassRequest, type JugaadSignal, type OrgAccount } from '../data/events';

// ─── Real Production Datasets (Initial Empty State) ───────────
export const MOCK_PASS_REQUESTS: PassRequest[] = [];
export const MY_PASS_REQUESTS: PassRequest[] = [];
export const MOCK_JUGAAD_SIGNALS: JugaadSignal[] = [];
export const MY_JUGAAD_SIGNALS: JugaadSignal[] = [];
export const MOCK_ORGANISERS: OrgAccount[] = [];
export const PENDING_EVENTS: any[] = [];

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
