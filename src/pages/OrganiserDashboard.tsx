import { useState, useEffect } from 'react';
import { type NavProps, EVENTS } from '../data/events';
import {
  MOCK_PASS_REQUESTS, REQUEST_STATUS_LABEL, REQUEST_STATUS_STYLE, EVENT_STATUS_STYLE,
} from '../lib/mockData';
import { getMyEvents, getRequestsForMyEvents, updateRequestStatus, updateEvent } from '../lib/api';
import { SUPABASE_CONFIGURED } from '../lib/supabase';
import type { DBEvent, DBPassRequest } from '../lib/supabase';

type OrgTab = 'my-events' | 'requests';

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

function fmt(v: number) { return v >= 1000 ? `₹${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}K` : `₹${v}`; }
function relTime(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  return d === 0 ? 'Today' : d === 1 ? 'Yesterday' : `${d} days ago`;
}

// ─── My Events tab ────────────────────────────────────────────
function MyEventsTab({ navigate }: { navigate: NavProps['navigate'] }) {
  const [myEvents, setMyEvents] = useState<DBEvent[]>([]);
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => { getMyEvents().then(setMyEvents); }, []);

  const handleSave = async (id: string, fd: FormData) => {
    await updateEvent(id, { name: fd.get('name') as string, venue: fd.get('venue') as string, description: fd.get('description') as string });
    setMyEvents(prev => prev.map(e => e.id === id ? { ...e, name: fd.get('name') as string, venue: fd.get('venue') as string } : e));
    setEditing(null);
  };

  return (
    <div>
      <div className="eyebrow mb-1">Your events</div>
      <div className="font-serif mb-4" style={{ fontSize: 22, fontWeight: 500 }}>My Events</div>

      <div className="space-y-4">
        {myEvents.map(ev => {
          const evStyle = EVENT_STATUS_STYLE[ev.status];
          const mockMatch = EVENTS.find(e => e.id === ev.id);
          return (
            <div key={ev.id} className="card-light overflow-hidden">
              {mockMatch?.image && (
                <div className="relative h-[120px] bg-stone-100 overflow-hidden">
                  <img src={mockMatch.image} alt={ev.name} className="w-full h-full object-cover" style={{ opacity: 0.8 }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,22,18,0.65) 0%, transparent 55%)' }} />
                  <div className="absolute bottom-3 left-4">
                    <span className="rounded-full px-2.5 py-1 mr-2" style={{ fontSize: 11, fontWeight: 600, color: evStyle.color, background: evStyle.bg }}>
                      {ev.status === 'approved' ? 'Live' : ev.status === 'pending_review' ? 'Pending review' : 'Rejected'}
                    </span>
                    <span className="font-serif text-white" style={{ fontSize: 18, fontWeight: 500 }}>{ev.name}</span>
                  </div>
                </div>
              )}
              {!mockMatch?.image && (
                <div className="p-4 pb-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="rounded-full px-2.5 py-1" style={{ fontSize: 11, fontWeight: 600, color: evStyle.color, background: evStyle.bg }}>
                      {ev.status === 'approved' ? 'Live' : ev.status === 'pending_review' ? 'Pending review' : 'Rejected'}
                    </span>
                    <span className="font-serif" style={{ fontSize: 17, fontWeight: 500 }}>{ev.name}</span>
                  </div>
                </div>
              )}

              <div className="p-4">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { l: 'Date', v: ev.date ?? '—' },
                    { l: 'Venue', v: ev.venue ?? '—' },
                    { l: 'Price', v: ev.price_min ? `₹${ev.price_min}–₹${ev.price_max}` : '—' },
                  ].map(d => (
                    <div key={d.l}>
                      <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginBottom: 2 }}>{d.l}</div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#1A1612' }}>{d.v}</div>
                    </div>
                  ))}
                </div>

                {editing === ev.id ? (
                  <form className="space-y-3" onSubmit={async (e) => { e.preventDefault(); await handleSave(ev.id, new FormData(e.currentTarget)); }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 4, fontSize: 11 }}>Event name</label>
                      <input name="name" defaultValue={ev.name} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label style={{ display: 'block', marginBottom: 4, fontSize: 11 }}>Venue</label>
                        <input name="venue" defaultValue={ev.venue ?? ''} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: 4, fontSize: 11 }}>Date</label>
                        <input name="date" defaultValue={ev.date ?? ''} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 4, fontSize: 11 }}>Description</label>
                      <textarea name="description" rows={3} defaultValue={ev.description ?? ''} />
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setEditing(null)} className="btn-outline flex-1 py-2 text-sm">Cancel</button>
                      <button type="submit" className="btn-primary flex-1 py-2 text-sm">Save changes</button>
                    </div>
                    <p style={{ fontSize: 11, color: '#9A8B82', textAlign: 'center' }}>Edits may re-enter pending review.</p>
                  </form>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => navigate('event-detail', { eventId: ev.id })} className="btn-outline flex-1 py-2 text-xs">View public page</button>
                    <button onClick={() => setEditing(ev.id)} className="btn-primary flex-1 py-2 text-xs">Edit event</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 card-light p-5 text-center" style={{ borderStyle: 'dashed' }}>
        <div style={{ fontSize: 14, color: '#9A8B82', marginBottom: 12 }}>Want to add another event?</div>
        <button onClick={() => navigate('organiser-form')} className="btn-primary px-6 py-2.5 text-sm">
          Submit new event →
        </button>
      </div>
    </div>
  );
}

// ─── Pass Requests tab ────────────────────────────────────────
function RequestsTab() {
  const [requests, setRequests] = useState<DBPassRequest[]>(
    MOCK_PASS_REQUESTS.filter(r => ['e1', 'e5'].includes(r.event_id)) as unknown as DBPassRequest[]
  );

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;
    getRequestsForMyEvents().then(setRequests);
  }, []);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterEvent, setFilterEvent] = useState('all');

  const eventNames = ['all', ...Array.from(new Set(requests.map(r => r.event_name)))];
  const statuses = ['all', ...Object.keys(REQUEST_STATUS_LABEL)];

  const filtered = requests.filter(r =>
    (filterEvent === 'all' || r.event_name === filterEvent) &&
    (filterStatus === 'all' || r.status === filterStatus)
  );

  const updateStatus = async (id: string, status: string) => {
    await updateRequestStatus(id, status as DBPassRequest['status']);
    setRequests(p => p.map(r => r.id === id ? { ...r, status: status as typeof r.status } : r));
  };

  // Aggregate stats
  const active = requests.filter(r => !['completed', 'closed'].includes(r.status)).length;
  const completed = requests.filter(r => r.status === 'completed').length;
  const totalPasses = requests.filter(r => !['closed'].includes(r.status)).reduce((s, r) => s + r.quantity, 0);

  return (
    <div>
      <div className="eyebrow mb-1">Scoped to your events</div>
      <div className="font-serif mb-4" style={{ fontSize: 22, fontWeight: 500 }}>Pass Requests</div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { l: 'Active', v: active, color: '#C1440E' },
          { l: 'Completed', v: completed, color: '#2D7A4F' },
          { l: 'Passes sought', v: totalPasses, color: '#1A1612' },
        ].map(d => (
          <div key={d.l} className="card-light p-3 text-center">
            <div className="font-serif" style={{ fontSize: 24, fontWeight: 500, color: d.color }}>{d.v}</div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9A8B82', marginTop: 2 }}>{d.l}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <select value={filterEvent} onChange={e => setFilterEvent(e.target.value)} style={{ fontSize: 13 }}>
          {eventNames.map(n => <option key={n} value={n}>{n === 'all' ? 'All my events' : n}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ fontSize: 13 }}>
          {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All statuses' : REQUEST_STATUS_LABEL[s] ?? s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card-light p-8 text-center">
          <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
          <div style={{ fontSize: 14, color: '#9A8B82' }}>No requests match this filter.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(req => (
            <div key={req.id} className="card-light p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1612' }}>{req.buyer_name}</div>
                  <div style={{ fontSize: 12, color: '#9A8B82' }}>
                    {req.event_name} · {req.quantity} passes · {fmt(req.budget_min ?? 0)}–{fmt(req.budget_max ?? 0)}
                  </div>
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

              <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(26,22,18,0.05)' }}>
                <a href={`mailto:${req.buyer_email}`} style={{ fontSize: 12, color: '#C1440E' }}>
                  Email {(req.buyer_name ?? 'buyer').split(' ')[0]} →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────
export default function OrganiserDashboard({ navigate }: NavProps) {
  const [tab, setTab] = useState<OrgTab>('my-events');

  const pendingRequests = MOCK_PASS_REQUESTS.filter(
    r => ['e1', 'e5'].includes(r.event_id) && !['completed', 'closed'].includes(r.status)
  ).length;

  return (
    <div className="pb-28" style={{ color: '#1A1612' }}>
      {/* Header */}
      <div className="px-5 py-6" style={{ background: '#F0E8DC', borderBottom: '1px solid rgba(26,22,18,0.08)' }}>
        <div className="eyebrow mb-1" style={{ color: '#9A8B82' }}>Vikram Rawal · Organiser</div>
        <h1 className="font-serif leading-tight" style={{ fontSize: 'clamp(26px, 7vw, 38px)', fontWeight: 500 }}>
          My Event Dashboard
        </h1>
        <p style={{ fontSize: 13, color: '#6B5B52', marginTop: 4 }}>Manage your events and the pass requests tied to them.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ background: '#FAF7F2', borderColor: 'rgba(26,22,18,0.08)' }}>
        {([
          { key: 'my-events' as OrgTab, label: 'My Events' },
          { key: 'requests'  as OrgTab, label: 'Pass Requests' },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex-1 px-5 py-3.5 relative transition-colors"
            style={{
              fontSize: 13,
              fontWeight: tab === t.key ? 600 : 400,
              color: tab === t.key ? '#C1440E' : '#6B5B52',
              borderBottom: tab === t.key ? '2px solid #C1440E' : '2px solid transparent',
            }}
          >
            {t.label}
            {t.key === 'requests' && pendingRequests > 0 && (
              <span className="ml-1.5 rounded-full px-1.5 text-white" style={{ fontSize: 10, background: '#C1440E', fontWeight: 700 }}>
                {pendingRequests}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="px-5 py-6">
        {tab === 'my-events' && <MyEventsTab navigate={navigate} />}
        {tab === 'requests'  && <RequestsTab />}
      </div>
    </div>
  );
}
