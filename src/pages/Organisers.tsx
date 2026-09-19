import { useState, useEffect } from 'react';
import { type NavProps } from '../data/events';
import { getAllSignals } from '../lib/api';

const BENEFITS = [
  { n: '01', t: 'Real demand signals', d: 'Understand what people are actively looking for — across dates, budgets, and vibes — before you even list.' },
  { n: '02', t: 'Right audience', d: 'Reach people already searching for events like yours. Not cold reach. Warm intent.' },
  { n: '03', t: 'Event discovery', d: 'Get your event in front of people who are ready. Discovery that actually converts.' },
  { n: '04', t: 'Jugaad Drops', d: 'Exclusive deals and approved allocations. Organiser-controlled and audience-trusted.' },
  { n: '05', t: 'Demand intelligence', d: 'Access aggregated demand data — dates, budgets, group size, vibe preferences — to plan smarter.' },
  { n: '06', t: 'Community trust', d: "Pass No Jugaad is Ahmedabad's word-of-mouth for Navratri. Your event belongs here." },
];

export default function Organisers({ navigate }: NavProps) {
  const [metrics, setMetrics] = useState([
    { label: 'Demand', value: 'Live', sub: 'Tracking 2026' },
    { label: 'Avg budget', value: 'Flexible', sub: 'Per person' },
    { label: 'Group size', value: '2–4', sub: 'Passes avg' },
    { label: 'Top vibe', value: 'Garba', sub: 'Category' },
  ]);

  useEffect(() => {
    getAllSignals().then((signals) => {
      const sigs = signals || [];
      if (sigs.length === 0) return;

      const totalPeople = sigs.reduce((acc, s) => acc + (s.num_passes || 1), 0);
      const avgGroup = (totalPeople / sigs.length).toFixed(1);

      // Budgets
      const minBudgets = sigs.map((s) => s.budget_min).filter((b): b is number => !!b);
      const maxBudgets = sigs.map((s) => s.budget_max).filter((b): b is number => !!b);
      const minB = minBudgets.length ? Math.min(...minBudgets) : 500;
      const maxB = maxBudgets.length ? Math.max(...maxBudgets) : 2500;

      // Top vibe
      const vibesCount: Record<string, number> = {};
      sigs.forEach((s) => {
        (s.event_types || []).forEach((t) => {
          vibesCount[t] = (vibesCount[t] || 0) + 1;
        });
      });
      const topVibe = Object.entries(vibesCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Garba';

      setMetrics([
        { label: 'Total Seekers', value: `${totalPeople}`, sub: 'Community requests' },
        { label: 'Budget range', value: `₹${minB}–₹${maxB}`, sub: 'Per person' },
        { label: 'Group size', value: `${avgGroup}`, sub: 'Passes avg' },
        { label: 'Top vibe', value: topVibe, sub: 'Category' },
      ]);
    });
  }, []);

  return (
    <div className="pb-24" style={{ color: '#1A1612' }}>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: '#F0E8DC', padding: '60px 20px 48px' }}>
        <div className="max-w-2xl mx-auto">
          <div className="eyebrow mb-4">For Organisers</div>
          <h1 className="font-serif leading-tight mb-4" style={{ fontSize: 'clamp(36px, 10vw, 64px)', fontWeight: 500 }}>
            Your event deserves<br />
            <span style={{ color: '#C1440E', fontStyle: 'italic' }}>to be seen by people<br />already looking.</span>
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: '#6B5B52', maxWidth: 440, marginBottom: 28 }}>
            Tell us about your event and {"we'll"} explore how Pass No Jugaad can help you reach the right audience at the right time.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('organiser-form')} className="btn-primary px-6 py-3.5 text-sm">
              List Your Event →
            </button>
            <a href="https://www.instagram.com/pass_no_jugaad_?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="btn-outline px-6 py-3.5 text-sm flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              Talk to us on Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="px-5 py-12" style={{ background: '#FAF7F2' }}>
        <div className="max-w-2xl mx-auto">
          <div className="eyebrow mb-3">What you get</div>
          <h2 className="font-serif mb-8 leading-tight" style={{ fontSize: 'clamp(26px, 7vw, 40px)', fontWeight: 500 }}>
            Built for organisers who care.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BENEFITS.map((b) => (
              <div key={b.n} className="card-light p-5">
                <div className="font-serif mb-2" style={{ fontSize: 13, color: '#C1440E', fontStyle: 'italic' }}>{b.n}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#1A1612', marginBottom: 6 }}>{b.t}</div>
                <div style={{ fontSize: 14, lineHeight: 1.65, color: '#6B5B52' }}>{b.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demand intelligence */}
      <div className="px-5 py-10" style={{ background: '#F0E8DC' }}>
        <div className="max-w-2xl mx-auto">
          <div className="eyebrow mb-3">Community demand signals</div>
          <h2 className="font-serif mb-2 leading-tight" style={{ fontSize: 'clamp(24px, 6vw, 36px)', fontWeight: 500 }}>
            Navratri demand intelligence.
          </h2>
          <p style={{ fontSize: 14, color: '#6B5B52', lineHeight: 1.65, marginBottom: 20 }}>
            Understand what Ahmedabad is looking for — before you go live.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {metrics.map((m) => (
              <div key={m.label} className="card-light p-4">
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginBottom: 6 }}>{m.label}</div>
                <div className="font-serif" style={{ fontSize: 22, fontWeight: 500, color: '#1A1612' }}>{m.value}</div>
                <div style={{ fontSize: 11, color: '#9A8B82', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{m.sub}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, color: '#9A8B82' }}>* Real-time insights from live community requests.</p>
        </div>
      </div>

      {/* CTA bottom */}
      <div className="px-5 py-10" style={{ background: '#FAF7F2' }}>
        <div className="max-w-2xl mx-auto space-y-3">
          <button onClick={() => navigate('organiser-form')} className="btn-primary w-full py-4 text-base">
            List Your Event →
          </button>
          <a
            href="mailto:passnojugaadd@gmail.com"
            className="btn-outline w-full py-3.5 flex items-center justify-center gap-2 text-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
            </svg>
            Email us
          </a>
        </div>
      </div>
    </div>
  );
}
