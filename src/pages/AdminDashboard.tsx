import { useState, useEffect } from 'react';
import { type NavProps, EVENTS } from '../data/events';
import {
  MOCK_PASS_REQUESTS, MOCK_JUGAAD_SIGNALS, MOCK_ORGANISERS, PENDING_EVENTS,
  REQUEST_STATUS_LABEL, REQUEST_STATUS_STYLE, EVENT_STATUS_STYLE,
} from '../lib/mockData';
import {
  getPendingEvents, getAllEvents, getAllPassRequests, getAllSignals,
  getOrganisers, approveEvent, rejectEvent, updateRequestStatus, deleteEvent,
} from '../lib/api';
import { SUPABASE_CONFIGURED } from '../lib/supabase';

type AdminTab = 'pending' | 'events' | 'requests' | 'signals' | 'organisers';

const TABS: { key: AdminTab; label: string }[] = [
  { key: 'pending',    label: 'Pending Review' },
  { key: 'events',     label: 'All Events' },
  { key: 'requests',   label: 'All Requests' },
  { key: 'signals',    label: 'Radar / Signals' },
  { key: 'organisers', label: 'Organisers' },
];

const STATUS_NEXT: Record<string, string[]> = {
  request_received:    ['looking_for_options', 'closed'],
  looking_for_options: ['match_found', 'closed'],
  match_found:         ['offer_available', 'closed'],
  offer_available:     ['completed', 'closed'],
  completed:           [],
  closed:              [],
};

function StatusBadge({ status }: { status: string }) {
  const s = REQUEST_STATUS_STYLE[status] ?? { color: '#9A8B82', bg: 'rgba(154,139,130,0.08)', border: 'rgba(154,139,130,0.2)' };
  return (
    <span className="rounded-full px-2.5 py-1 flex-shrink-0" style={{ fontSize: 11, fontWeight: 600, color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
      {REQUEST_STATUS_LABEL[status] ?? status}
    </span>
  );
}

function EventStatusBadge({ status }: { status: string }) {
  const s = EVENT_STATUS_STYLE[status] ?? { color: '#9A8B82', bg: 'rgba(154,139,130,0.08)' };
  return (
    <span className="rounded-full px-2.5 py-1 flex-shrink-0" style={{ fontSize: 11, fontWeight: 600, color: s.color, background: s.bg }}>
      {status === 'pending_review' ? 'Pending review' : status === 'approved' ? 'Approved' : 'Rejected'}
    </span>
  );
}

function fmt(v: number) { return v >= 1000 ? `₹${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}K` : `₹${v}`; }
function relTime(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  return d === 0 ? 'Today' : d === 1 ? 'Yesterday' : `${d} days ago`;
}

// ─── Pending Review tab ───────────────────────────────────────
function PendingTab() {
  const [items, setItems] = useState<typeof PENDING_EVENTS>(PENDING_EVENTS);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;
    getPendingEvents().then((data: any[]) => setItems(data));
  }, []);

  const approve = async (id: string) => {
    await approveEvent(id);
    setItems(p => p.filter(e => e.id !== id));
  };
  const reject = async (id: string) => {
    await rejectEvent(id, reason);
    setItems(p => p.filter(e => e.id !== id));
    setRejecting(null); setReason('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="eyebrow mb-1">Awaiting your decision</div>
          <div className="font-serif" style={{ fontSize: 22, fontWeight: 500 }}>Pending Review</div>
        </div>
        <div className="rounded-full px-3 py-1" style={{ background: 'rgba(193,68,14,0.08)', fontSize: 14, fontWeight: 700, color: '#C1440E' }}>
          {items.length}
        </div>
      </div>

      {items.length === 0 && (
        <div className="card-light p-8 text-center">
          <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1612', marginBottom: 4 }}>All clear</div>
          <div style={{ fontSize: 13, color: '#9A8B82' }}>No events waiting for review.</div>
        </div>
      )}

      <div className="space-y-4">
        {items.map(ev => (
          <div key={ev.id} className="card-light p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div style={{ fontSize: 17, fontWeight: 600, color: '#1A1612', marginBottom: 2 }}>{ev.name}</div>
                <div style={{ fontSize: 13, color: '#9A8B82' }}>
                  {ev.organiser} · {ev.org} · <a href={`mailto:${ev.email}`} style={{ color: '#C1440E' }}>{ev.email}</a>
                </div>
              </div>
              <EventStatusBadge status="pending_review" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { l: 'Date', v: ev.date },
                { l: 'Venue', v: ev.venue },
                { l: 'Price', v: ev.price },
                { l: 'Submitted', v: relTime(ev.submitted_at) },
              ].map(d => (
                <div key={d.l} className="rounded-md p-3" style={{ background: '#FAF7F2', border: '1px solid rgba(26,22,18,0.07)' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginBottom: 3 }}>{d.l}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1A1612' }}>{d.v}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {ev.type.map(t => <span key={t} className="chip" style={{ padding: '2px 10px', fontSize: 11 }}>{t}</span>)}
            </div>

            {ev.instagram && (
              <div style={{ fontSize: 12, color: '#9A8B82', marginBottom: 12 }}>
                Instagram: <a href={ev.instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#C1440E' }}>{ev.instagram}</a>
              </div>
            )}

            {rejecting === ev.id ? (
              <div className="space-y-2">
                <textarea
                  placeholder="Rejection reason (optional — sent to organiser)"
                  rows={2}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                />
                <div className="flex gap-2">
                  <button onClick={() => { setRejecting(null); setReason(''); }} className="btn-outline flex-1 py-2 text-sm">Cancel</button>
                  <button onClick={() => reject(ev.id)} className="flex-1 py-2 text-sm rounded font-semibold" style={{ background: '#7A1F2E', color: '#fff' }}>Confirm Reject</button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => approve(ev.id)} className="btn-primary flex-1 py-2.5 text-sm">Approve →</button>
                <button onClick={() => setRejecting(ev.id)} className="btn-outline flex-1 py-2.5 text-sm">Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── All Events tab ───────────────────────────────────────────
function AllEventsTab({ navigate }: { navigate: NavProps['navigate'] }) {
  const [search, setSearch] = useState('');
  const [allEvents, setAllEvents] = useState([
    ...EVENTS.map(e => ({ id: e.id, name: e.name, dateShort: e.dateShort, venue: e.venue, priceRange: e.priceRange, demand: e.demand, type: e.type, status: 'approved', organiser: 'Verified Organiser' })),
    ...PENDING_EVENTS.map(e => ({ id: e.id, name: e.name, dateShort: e.date.replace(' 2026',''), venue: e.venue, priceRange: e.price, demand: 'MEDIUM', type: e.type, status: 'pending_review', organiser: e.organiser })),
  ]);

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;
    getAllEvents().then(data => setAllEvents(data.map((e: any) => ({
      id: e.id, name: e.name, dateShort: e.date, venue: e.venue,
      priceRange: e.price_min ? `₹${e.price_min}–₹${e.price_max}` : '—',
      demand: 'MEDIUM', type: e.type_tags ?? [], status: e.status, organiser: '—',
    }))));
  }, []);

  const handleDelete = async (id: string) => {
    await deleteEvent(id);
    setAllEvents(p => p.filter(e => e.id !== id));
  };

  const filtered = allEvents.filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()) || (e.venue ?? '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="eyebrow mb-1">Full event registry</div>
          <div className="font-serif" style={{ fontSize: 22, fontWeight: 500 }}>All Events</div>
        </div>
        <div style={{ fontSize: 14, color: '#9A8B82', fontWeight: 600 }}>{filtered.length} events</div>
      </div>

      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9A8B82" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events…" style={{ paddingLeft: 38 }} />
      </div>

      <div className="space-y-3">
        {filtered.map(ev => (
          <div key={ev.id} className="card-light p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span style={{ fontSize: 15, fontWeight: 600, color: '#1A1612' }}>{ev.name}</span>
                <EventStatusBadge status={ev.status} />
              </div>
              <div style={{ fontSize: 12, color: '#9A8B82' }}>{ev.dateShort} · {ev.venue} · {ev.priceRange}</div>
              {ev.type.slice(0, 2).map((t: string) => (
                <span key={t} className="chip mr-1 mt-1" style={{ padding: '2px 8px', fontSize: 11 }}>{t}</span>
              ))}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => navigate('event-detail', { eventId: ev.id })} className="btn-outline px-3 py-2 text-xs">View</button>
              <button onClick={() => handleDelete(ev.id)} className="px-3 py-2 text-xs rounded font-semibold transition-colors" style={{ background: 'rgba(122,31,46,0.08)', color: '#7A1F2E', border: '1px solid rgba(122,31,46,0.2)' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── All Requests tab ─────────────────────────────────────────
function AllRequestsTab() {
  const [requests, setRequests] = useState<typeof MOCK_PASS_REQUESTS>(MOCK_PASS_REQUESTS);
  const [filterEvent, setFilterEvent] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;
    getAllPassRequests().then(data => setRequests(data as any));
  }, []);

  const eventNames = ['all', ...Array.from(new Set(requests.map(r => r.event_name)))];
  const statuses = ['all', ...Object.keys(REQUEST_STATUS_LABEL)];

  const filtered = requests.filter(r =>
    (filterEvent === 'all' || r.event_name === filterEvent) &&
    (filterStatus === 'all' || r.status === filterStatus)
  );

  const updateStatus = async (id: string, status: string) => {
    await updateRequestStatus(id, status as any);
    setRequests(p => p.map(r => r.id === id ? { ...r, status: status as typeof r.status } : r));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="eyebrow mb-1">Every pass request</div>
          <div className="font-serif" style={{ fontSize: 22, fontWeight: 500 }}>All Requests</div>
        </div>
        <div style={{ fontSize: 14, color: '#9A8B82', fontWeight: 600 }}>{filtered.length} requests</div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <select value={filterEvent} onChange={e => setFilterEvent(e.target.value)} style={{ fontSize: 13 }}>
          {eventNames.map(n => <option key={n} value={n}>{n === 'all' ? 'All events' : n}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ fontSize: 13 }}>
          {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All statuses' : REQUEST_STATUS_LABEL[s] ?? s}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(req => (
          <div key={req.id} className="card-light p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1612' }}>{req.buyer_name}</div>
                <div style={{ fontSize: 12, color: '#9A8B82' }}>{req.event_name} · {req.quantity} passes · {fmt(req.budget_min)}–{fmt(req.budget_max)}</div>
                <div style={{ fontSize: 11, color: '#9A8B82', marginTop: 2 }}>{relTime(req.created_at)}</div>
              </div>
              <StatusBadge status={req.status} />
            </div>

            {STATUS_NEXT[req.status]?.length > 0 && (
              <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: '1px solid rgba(26,22,18,0.07)' }}>
                {STATUS_NEXT[req.status].map(next => (
                  <button
                    key={next}
                    onClick={() => updateStatus(req.id, next)}
                    className="btn-outline px-3 py-1.5 text-xs flex-1"
                    style={next === 'closed' ? { color: '#9A8B82', borderColor: 'rgba(154,139,130,0.3)' } : {}}
                  >
                    → {REQUEST_STATUS_LABEL[next]}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Radar / Signals tab ──────────────────────────────────────
function SignalsTab() {
  const [signals, setSignals] = useState(MOCK_JUGAAD_SIGNALS);

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;
    getAllSignals().then(data => setSignals(data as any));
  }, []);

  const totalPasses = signals.reduce((s, x) => s + x.num_passes, 0);
  const avgBudget = Math.round(signals.reduce((s, x) => s + (x.budget_min + x.budget_max) / 2, 0) / signals.length);
  const ready = signals.filter(s => s.readiness === 'ready').length;

  return (
    <div>
      <div className="eyebrow mb-1">Raw demand intelligence</div>
      <div className="font-serif mb-4" style={{ fontSize: 22, fontWeight: 500 }}>Radar / Jugaad Signals</div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { l: 'Total signals', v: signals.length },
          { l: 'Total passes sought', v: totalPasses },
          { l: 'Ready to book', v: `${ready}/${signals.length}` },
          { l: 'Avg budget', v: `₹${avgBudget}` },
          { l: 'Unique buyers', v: signals.length },
          { l: 'Avg group size', v: (totalPasses / signals.length).toFixed(1) },
        ].map(d => (
          <div key={d.l} className="card-light p-3 text-center">
            <div className="font-serif" style={{ fontSize: 22, fontWeight: 500, color: '#C1440E' }}>{d.v}</div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9A8B82', marginTop: 2 }}>{d.l}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {signals.map(sig => (
          <div key={sig.id} className="card-light p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1612' }}>{sig.buyer_name}</div>
                <div style={{ fontSize: 12, color: '#9A8B82' }}>{sig.buyer_email}</div>
              </div>
              <span className="rounded-full px-2.5 py-1" style={{
                fontSize: 11, fontWeight: 600,
                color: sig.readiness === 'ready' ? '#2D7A4F' : sig.readiness === 'exploring' ? '#C1440E' : '#9A8B82',
                background: sig.readiness === 'ready' ? 'rgba(45,122,79,0.08)' : sig.readiness === 'exploring' ? 'rgba(193,68,14,0.08)' : 'rgba(154,139,130,0.08)',
              }}>
                {sig.readiness === 'ready' ? 'Ready to book' : sig.readiness === 'exploring' ? 'Exploring' : 'Maybe'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              <div>
                <div style={{ fontSize: 10, color: '#9A8B82', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Dates</div>
                <div style={{ fontSize: 12, color: '#1A1612' }}>{sig.preferred_dates.join(', ')}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#9A8B82', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Passes</div>
                <div style={{ fontSize: 12, color: '#1A1612' }}>{sig.num_passes}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#9A8B82', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Budget</div>
                <div style={{ fontSize: 12, color: '#1A1612' }}>{fmt(sig.budget_min)}–{fmt(sig.budget_max)}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#9A8B82', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Type</div>
                <div style={{ fontSize: 12, color: '#1A1612' }}>{sig.event_type.slice(0, 2).join(', ')}</div>
              </div>
            </div>

            {sig.artist_preference && (
              <div style={{ fontSize: 12, color: '#6B5B52', marginTop: 8 }}>Artist: <strong>{sig.artist_preference}</strong></div>
            )}
            {sig.specific_event && (
              <div style={{ fontSize: 12, color: '#6B5B52' }}>Event: <strong>{sig.specific_event}</strong></div>
            )}
            <div style={{ fontSize: 11, color: '#9A8B82', marginTop: 6 }}>{relTime(sig.created_at)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Organisers tab ───────────────────────────────────────────
function OrganisersTab() {
  const [orgs, setOrgs] = useState(MOCK_ORGANISERS);

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;
    getOrganisers().then(data => setOrgs(data as any));
  }, []);

  return (
    <div>
      <div className="eyebrow mb-1">Platform organisers</div>
      <div className="font-serif mb-4" style={{ fontSize: 22, fontWeight: 500 }}>Organisers</div>

      <div className="space-y-3">
        {orgs.map(org => (
          <div key={org.id} className="card-light p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1612' }}>{org.name}</div>
                <div style={{ fontSize: 12, color: '#6B5B52' }}>{org.org}</div>
                <div style={{ fontSize: 12, color: '#9A8B82' }}><a href={`mailto:${org.email}`} style={{ color: '#C1440E' }}>{org.email}</a></div>
              </div>
              <div className="text-right">
                <div style={{ fontSize: 20, fontWeight: 600, color: '#1A1612', fontFamily: "'Fraunces', serif" }}>{org.approved_count}/{org.event_count}</div>
                <div style={{ fontSize: 10, color: '#9A8B82', textTransform: 'uppercase', letterSpacing: '0.08em' }}>events live</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#9A8B82' }}>Joined {relTime(org.joined_at)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────
export default function AdminDashboard({ navigate }: NavProps) {
  const [tab, setTab] = useState<AdminTab>('pending');
  const [pendingCount, setPendingCount] = useState(PENDING_EVENTS.length);

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;
    getPendingEvents().then(data => setPendingCount(data.length));
  }, []);

  return (
    <div className="pb-28" style={{ color: '#1A1612' }}>
      {/* Header */}
      <div className="px-5 py-6" style={{ background: '#F0E8DC', borderBottom: '1px solid rgba(26,22,18,0.08)' }}>
        <div className="eyebrow mb-1" style={{ color: '#9A8B82' }}>Hanika · Super Admin</div>
        <h1 className="font-serif leading-tight" style={{ fontSize: 'clamp(28px, 7vw, 40px)', fontWeight: 500 }}>
          Admin Dashboard
        </h1>
        <p style={{ fontSize: 13, color: '#6B5B52', marginTop: 4 }}>Full platform visibility. All events, requests, and signals.</p>
      </div>

      {/* Tab strip — horizontal scroll */}
      <div className="scroll-x flex border-b" style={{ background: '#FAF7F2', borderColor: 'rgba(26,22,18,0.08)' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex-shrink-0 px-5 py-3.5 relative transition-colors"
            style={{
              fontSize: 13,
              fontWeight: tab === t.key ? 600 : 400,
              color: tab === t.key ? '#C1440E' : '#6B5B52',
              borderBottom: tab === t.key ? '2px solid #C1440E' : '2px solid transparent',
              whiteSpace: 'nowrap',
            }}
          >
            {t.label}
            {t.key === 'pending' && pendingCount > 0 && (
              <span className="ml-1.5 rounded-full px-1.5 text-white" style={{ fontSize: 10, background: '#C1440E', fontWeight: 700 }}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="px-5 py-6">
        {tab === 'pending'    && <PendingTab />}
        {tab === 'events'     && <AllEventsTab navigate={navigate} />}
        {tab === 'requests'   && <AllRequestsTab />}
        {tab === 'signals'    && <SignalsTab />}
        {tab === 'organisers' && <OrganisersTab />}
      </div>
    </div>
  );
}
