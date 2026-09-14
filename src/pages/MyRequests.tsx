import { useState } from 'react';
import { type NavProps } from '../data/events';

const REQUESTS = [
  {
    id: 'r1',
    event: 'RAAS RANG 2026',
    date: '12 OCT',
    passes: 2,
    budget: '₹1,000–₹1,500',
    status: 'UNDER REVIEW',
    statusColor: '#f5b800',
    statusBg: 'rgba(245,184,0,0.1)',
    message: "We'll get back to you soon.",
    tab: 'active',
  },
  {
    id: 'r2',
    event: 'UNITED GARBA FESTIVAL',
    date: '11 OCT',
    passes: 4,
    budget: '₹1,500–₹2,000',
    status: 'OPTIONS SENT',
    statusColor: '#22c55e',
    statusBg: 'rgba(34,197,94,0.1)',
    message: 'Check your WhatsApp for options.',
    tab: 'active',
    hasAction: true,
  },
  {
    id: 'r3',
    event: 'SBR MEGA GARBA',
    date: '15 OCT',
    passes: 2,
    budget: '₹1,200–₹2,500',
    status: 'CONFIRMED',
    statusColor: '#22c55e',
    statusBg: 'rgba(34,197,94,0.1)',
    message: 'Your passes have been confirmed.',
    tab: 'confirmed',
  },
  {
    id: 'r4',
    event: 'NEON GARBA NIGHT',
    date: '13 OCT',
    passes: 3,
    budget: '₹1,000–₹1,500',
    status: 'EXPIRED',
    statusColor: 'rgba(255,255,255,0.25)',
    statusBg: 'rgba(255,255,255,0.04)',
    message: 'This request has expired.',
    tab: 'past',
  },
];

const TABS = ['ACTIVE', 'CONFIRMED', 'PAST'];

export default function MyRequests({ navigate }: NavProps) {
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const tabKey = activeTab.toLowerCase();

  const filtered = REQUESTS.filter((r) =>
    tabKey === 'active' ? r.tab === 'active' :
    tabKey === 'confirmed' ? r.tab === 'confirmed' :
    r.tab === 'past'
  );

  return (
    <div className="px-4 py-6 pb-24">
      <div className="font-display font-bold text-xs tracking-widest mb-2" style={{ color: '#FF5500' }}>TRACK YOUR JUGAAD</div>
      <h1 className="font-display font-black leading-none mb-6" style={{ fontSize: 'clamp(36px, 10vw, 56px)', letterSpacing: '-0.02em' }}>
        MY<br /><span style={{ color: '#FF5500' }}>REQUESTS</span>
      </h1>

      <div
        className="font-display font-bold text-xs text-white/30 text-center mb-6 p-3 rounded"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        MVP — showing demo request states
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg p-1 mb-6" style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)' }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-2.5 rounded-md font-display font-bold text-xs tracking-wider transition-all"
            style={{
              background: activeTab === tab ? '#FF5500' : 'transparent',
              color: activeTab === tab ? 'white' : 'rgba(255,255,255,0.35)',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Request cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-white/20 text-4xl mb-3">📭</div>
          <div className="font-display font-bold text-white/30 text-sm">No {activeTab.toLowerCase()} requests</div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => (
            <div
              key={req.id}
              className="rounded-lg p-4"
              style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="font-display font-black text-white leading-tight" style={{ fontSize: 18 }}>
                  {req.event}
                </div>
                <span
                  className="font-display font-bold text-[10px] px-2 py-1 rounded ml-2 flex-shrink-0"
                  style={{ background: req.statusBg, color: req.statusColor, border: `1px solid ${req.statusColor}33` }}
                >
                  {req.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { label: 'DATE', value: req.date },
                  { label: 'PASSES', value: `${req.passes} PASSES` },
                  { label: 'BUDGET', value: req.budget },
                ].map((d) => (
                  <div key={d.label}>
                    <div className="font-display font-bold text-[9px] tracking-widest text-white/25 mb-0.5">{d.label}</div>
                    <div className="font-display font-bold text-white text-xs">{d.value}</div>
                  </div>
                ))}
              </div>

              <p className="text-white/40 text-xs mb-3">{req.message}</p>

              {req.hasAction && (
                <button
                  onClick={() => navigate('events')}
                  className="btn-primary w-full py-2.5 text-sm"
                >
                  VIEW OPTIONS →
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <button onClick={() => navigate('find-jugaad')} className="btn-primary px-6 py-3">
          + NEW REQUEST
        </button>
      </div>
    </div>
  );
}
