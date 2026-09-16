import { useState, useEffect } from 'react';
import { type NavProps } from '../data/events';
import { MY_PASS_REQUESTS, MY_JUGAAD_SIGNALS, REQUEST_STATUS_LABEL, REQUEST_STATUS_STYLE } from '../lib/mockData';
import { getMyPassRequests, getMySignals } from '../lib/api';
import type { DBPassRequest, DBJugaadSignal } from '../lib/supabase';
import { SUPABASE_CONFIGURED } from '../lib/supabase';

type MainTab = 'requests' | 'signals';
type ReqTab = 'active' | 'completed' | 'closed';

function StatusBadge({ status }: { status: string }) {
  const s = REQUEST_STATUS_STYLE[status] ?? { color: '#9A8B82', bg: 'rgba(154,139,130,0.08)', border: 'rgba(154,139,130,0.2)' };
  return (
    <span className="rounded-full px-2.5 py-1 flex-shrink-0" style={{ fontSize: 11, fontWeight: 600, color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
      {REQUEST_STATUS_LABEL[status] ?? status}
    </span>
  );
}

function fmt(v: number) { return v >= 1000 ? `₹${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}K` : `₹${v}`; }

const ACTIVE_STATUSES = ['request_received', 'looking_for_options', 'match_found', 'offer_available'];

// ─── My Requests section ──────────────────────────────────────
function MyRequestsSection({ navigate, requests }: { navigate: NavProps['navigate']; requests: DBPassRequest[] }) {
  const [reqTab, setReqTab] = useState<ReqTab>('active');

  const tabMap: Record<ReqTab, string[]> = {
    active:    ACTIVE_STATUSES,
    completed: ['completed'],
    closed:    ['closed'],
  };

  const filtered = requests.filter(r => tabMap[reqTab].includes(r.status));

  return (
    <div>
      {/* Inner tabs */}
      <div className="flex gap-1 rounded-lg p-1 mb-5" style={{ background: '#F0E8DC' }}>
        {(['active', 'completed', 'closed'] as ReqTab[]).map(t => (
          <button
            key={t}
            onClick={() => setReqTab(t)}
            className="flex-1 py-2 rounded-md text-sm transition-all capitalize"
            style={{
              background: reqTab === t ? '#fff' : 'transparent',
              color: reqTab === t ? '#1A1612' : '#9A8B82',
              fontWeight: reqTab === t ? 600 : 400,
              boxShadow: reqTab === t ? '0 1px 4px rgba(26,22,18,0.08)' : 'none',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 14, color: '#9A8B82' }}>No {reqTab} requests.</div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(req => (
            <div key={req.id} className="card-light p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="font-serif" style={{ fontSize: 17, fontWeight: 500, color: '#1A1612', lineHeight: 1.25 }}>
                  {req.event_name}
                </div>
                <StatusBadge status={req.status} />
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { l: 'Passes', v: `${req.quantity}` },
                  { l: 'Budget', v: `${fmt(req.budget_min ?? 0)}–${fmt(req.budget_max ?? 0)}` },
                  { l: 'Updated', v: new Date(req.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) },
                ].map(d => (
                  <div key={d.l}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginBottom: 2 }}>{d.l}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1A1612' }}>{d.v}</div>
                  </div>
                ))}
              </div>

              {req.status === 'offer_available' && (
                <button onClick={() => navigate('events')} className="btn-primary w-full py-2.5 text-sm">
                  View offer →
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <button onClick={() => navigate('find-jugaad')} className="btn-primary px-8 py-3 text-sm">
          + New Request
        </button>
      </div>
    </div>
  );
}

// ─── My Signals section ───────────────────────────────────────
function MySignalsSection({ navigate, signals }: { navigate: NavProps['navigate']; signals: DBJugaadSignal[] }) {

  return (
    <div>
      <p style={{ fontSize: 13, color: '#6B5B52', lineHeight: 1.65, marginBottom: 20 }}>
        Your "Find Your Jugaad" submissions. Each one feeds the Navratri Radar.
      </p>

      {signals.length === 0 ? (
        <div className="card-light p-8 text-center">
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1612', marginBottom: 6 }}>No signals yet</div>
          <div style={{ fontSize: 13, color: '#9A8B82', marginBottom: 16 }}>Tell us what {"you're"} looking for and {"we'll"} track it.</div>
          <button onClick={() => navigate('find-jugaad')} className="btn-primary px-6 py-3 text-sm">
            Find Your Jugaad →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {signals.map(sig => (
            <div key={sig.id} className="card-light p-5">
              <div className="flex items-center justify-between mb-3">
                <div style={{ fontSize: 12, color: '#9A8B82' }}>
                  Submitted {new Date(sig.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <span className="rounded-full px-2.5 py-1" style={{
                  fontSize: 11, fontWeight: 600,
                  color: sig.readiness === 'ready' ? '#2D7A4F' : sig.readiness === 'exploring' ? '#C1440E' : '#9A8B82',
                  background: sig.readiness === 'ready' ? 'rgba(45,122,79,0.08)' : sig.readiness === 'exploring' ? 'rgba(193,68,14,0.08)' : 'rgba(154,139,130,0.08)',
                }}>
                  {sig.readiness === 'ready' ? 'Ready to book' : sig.readiness === 'exploring' ? 'Exploring' : 'Open to it'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                {[
                  { l: 'Dates', v: sig.preferred_dates.join(', ') || '—' },
                  { l: 'Passes', v: `${sig.num_passes}` },
                  { l: 'Budget', v: `${fmt(sig.budget_min)}–${fmt(sig.budget_max)}` },
                  { l: 'Types', v: ((sig as any).event_types ?? (sig as any).event_type ?? []).join(', ') || '—' },
                ].map(d => (
                  <div key={d.l}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginBottom: 2 }}>{d.l}</div>
                    <div style={{ fontSize: 13, color: '#1A1612' }}>{d.v}</div>
                  </div>
                ))}
              </div>

              {sig.artist_preference && (
                <div style={{ fontSize: 12, color: '#6B5B52', marginBottom: 4 }}>Artist: <strong>{sig.artist_preference}</strong></div>
              )}
              {sig.specific_event && (
                <div style={{ fontSize: 12, color: '#6B5B52', marginBottom: 8 }}>Looking for: <strong>{sig.specific_event}</strong></div>
              )}

              <button
                onClick={() => navigate('find-jugaad')}
                className="btn-outline w-full py-2 text-xs mt-2"
              >
                + Add new response with different dates / budget
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 text-center">
        <button onClick={() => navigate('find-jugaad')} className="btn-primary px-8 py-3 text-sm">
          + Add Jugaad Signal
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────
export default function MyRequests({ navigate }: NavProps) {
  const [mainTab, setMainTab] = useState<MainTab>('requests');
  const [requests, setRequests] = useState<DBPassRequest[]>(MY_PASS_REQUESTS as unknown as DBPassRequest[]);
  const [signals, setSignals] = useState<DBJugaadSignal[]>(MY_JUGAAD_SIGNALS as unknown as DBJugaadSignal[]);

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;
    getMyPassRequests().then(setRequests);
    getMySignals().then(setSignals);
  }, []);

  const activeCount = requests.filter(r => ACTIVE_STATUSES.includes(r.status)).length;

  return (
    <div className="px-5 py-6 pb-28 max-w-lg mx-auto" style={{ color: '#1A1612' }}>
      <div className="eyebrow mb-2">Your panel</div>
      <h1 className="font-serif leading-tight mb-5" style={{ fontSize: 'clamp(30px, 8vw, 44px)', fontWeight: 500 }}>
        My Jugaad
      </h1>

      <div className="p-1 rounded-lg mb-6 flex" style={{ background: '#F0E8DC' }}>
        <button
          onClick={() => setMainTab('requests')}
          className="flex-1 py-2.5 rounded-md text-sm transition-all"
          style={{
            background: mainTab === 'requests' ? '#fff' : 'transparent',
            color: mainTab === 'requests' ? '#1A1612' : '#9A8B82',
            fontWeight: mainTab === 'requests' ? 600 : 400,
            boxShadow: mainTab === 'requests' ? '0 1px 4px rgba(26,22,18,0.08)' : 'none',
          }}
        >
          Pass Requests {activeCount > 0 && <span className="ml-1 rounded-full px-1.5 text-white text-[10px] font-bold" style={{ background: '#C1440E' }}>{activeCount}</span>}
        </button>
        <button
          onClick={() => setMainTab('signals')}
          className="flex-1 py-2.5 rounded-md text-sm transition-all"
          style={{
            background: mainTab === 'signals' ? '#fff' : 'transparent',
            color: mainTab === 'signals' ? '#1A1612' : '#9A8B82',
            fontWeight: mainTab === 'signals' ? 600 : 400,
            boxShadow: mainTab === 'signals' ? '0 1px 4px rgba(26,22,18,0.08)' : 'none',
          }}
        >
          My Signals
        </button>
      </div>

      {mainTab === 'requests' && <MyRequestsSection navigate={navigate} requests={requests} />}
      {mainTab === 'signals'  && <MySignalsSection navigate={navigate} signals={signals} />}
    </div>
  );
}
