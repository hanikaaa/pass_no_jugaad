import { useState } from 'react';
import { type NavProps, NAVRATRI_DATES } from '../data/events';
import { submitJugaadSignal } from '../lib/api';

interface Props extends NavProps {
  prefill?: Partial<FormData>;
}

interface FormData {
  name: string;
  email: string;
  dates: string[];
  quantity: number;
  budgetMin: number;
  budgetMax: number;
  eventTypes: string[];
  artist: string;
  specificEvent: string;
  readiness: string;
  message: string;
}

const EVENT_TYPES = ['Garba', 'Dandiya', 'DJ Night', 'Live Music', 'Bollywood Night', 'Club Night', 'Cultural Event', 'Other'];
const READINESS = [
  { value: 'ready', label: 'Ready to book' },
  { value: 'exploring', label: 'Just exploring' },
  { value: 'maybe', label: "Take it if it's right" },
];

const BUDGET_MIN = 500;
const BUDGET_MAX = 15000;

function formatBudget(v: number) {
  if (v >= 1000) return `₹${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}K`;
  return `₹${v}`;
}

export default function FindJugaad({ navigate, prefill }: Props) {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    dates: prefill?.dates || [],
    quantity: prefill?.quantity || 2,
    budgetMin: 500,
    budgetMax: 5000,
    eventTypes: prefill?.eventTypes || [],
    artist: '',
    specificEvent: prefill?.specificEvent || '',
    readiness: '',
    message: '',
  });

  const toggle = <K extends 'dates' | 'eventTypes'>(key: K, val: string) => {
    setForm((f) => ({
      ...f,
      [key]: (f[key] as string[]).includes(val)
        ? (f[key] as string[]).filter((x) => x !== val)
        : [...(f[key] as string[]), val],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitJugaadSignal({
      preferred_dates: form.dates,
      num_passes: form.quantity,
      budget_min: form.budgetMin,
      budget_max: form.budgetMax,
      event_types: form.eventTypes,
      artist_preference: form.artist,
      specific_event: form.specificEvent,
      readiness: (form.readiness || 'maybe') as 'ready' | 'exploring' | 'maybe',
    });
    navigate('jugaad-success');
  };

  return (
    <div className="px-5 py-6 pb-28 max-w-lg mx-auto">
      <button onClick={() => navigate('home')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#9A8B82', marginBottom: 24 }}>
        ← Back
      </button>

      <div className="eyebrow mb-3">Find Your Jugaad</div>
      <h1 className="font-serif leading-tight mb-2" style={{ fontSize: 'clamp(36px, 10vw, 54px)', fontWeight: 500 }}>
        What are you<br />
        <span style={{ color: '#C1440E', fontStyle: 'italic' }}>looking for?</span>
      </h1>
      <p style={{ fontSize: 14, color: '#6B5B52', lineHeight: 1.65, marginBottom: 32 }}>
        Tell us what your ideal Navratri looks like.
      </p>

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Name */}
        <div>
          <label style={{ display: 'block', marginBottom: 6 }}>Your name</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="First name" />
        </div>

        {/* Email */}
        <div>
          <label style={{ display: 'block', marginBottom: 6 }}>Email address</label>
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        </div>

        {/* Dates */}
        <div>
          <label style={{ display: 'block', marginBottom: 8 }}>Preferred date(s)</label>
          <div className="flex flex-wrap gap-2">
            {NAVRATRI_DATES.map((d) => (
              <button key={d} type="button" onClick={() => toggle('dates', d)} className={`chip ${form.dates.includes(d) ? 'active' : ''}`}>{d}</button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label style={{ display: 'block', marginBottom: 8 }}>Number of passes</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setForm({ ...form, quantity: Math.max(1, form.quantity - 1) })}
              className="w-10 h-10 rounded flex items-center justify-center font-bold text-xl transition-colors"
              style={{ border: '1.5px solid rgba(26,22,18,0.18)', background: '#fff', color: '#1A1612' }}
            >−</button>
            <span className="font-serif" style={{ fontSize: 32, fontWeight: 500, minWidth: 32, textAlign: 'center' }}>{form.quantity}</span>
            <button
              type="button"
              onClick={() => setForm({ ...form, quantity: Math.min(20, form.quantity + 1) })}
              className="w-10 h-10 rounded flex items-center justify-center font-bold text-xl transition-colors"
              style={{ border: '1.5px solid rgba(26,22,18,0.18)', background: '#fff', color: '#1A1612' }}
            >+</button>
            <span style={{ fontSize: 14, color: '#9A8B82' }}>passes</span>
          </div>
        </div>

        {/* Budget slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label>Budget per person</label>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#C1440E' }}>
              {formatBudget(form.budgetMin)} – {formatBudget(form.budgetMax)}
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <div style={{ fontSize: 12, color: '#9A8B82', marginBottom: 6 }}>Minimum</div>
              <input
                type="range"
                min={BUDGET_MIN}
                max={BUDGET_MAX}
                step={500}
                value={form.budgetMin}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setForm({ ...form, budgetMin: Math.min(v, form.budgetMax - 500) });
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#9A8B82', marginBottom: 6 }}>Maximum</div>
              <input
                type="range"
                min={BUDGET_MIN}
                max={BUDGET_MAX}
                step={500}
                value={form.budgetMax}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setForm({ ...form, budgetMax: Math.max(v, form.budgetMin + 500) });
                }}
              />
            </div>
            <div className="flex justify-between" style={{ fontSize: 11, color: '#9A8B82' }}>
              <span>{formatBudget(BUDGET_MIN)}</span>
              <span>{formatBudget(BUDGET_MAX)}</span>
            </div>
          </div>
        </div>

        {/* Event Type */}
        <div>
          <label style={{ display: 'block', marginBottom: 8 }}>Event type</label>
          <div className="flex flex-wrap gap-2">
            {EVENT_TYPES.map((t) => (
              <button key={t} type="button" onClick={() => toggle('eventTypes', t)} className={`chip ${form.eventTypes.includes(t) ? 'active' : ''}`}>{t}</button>
            ))}
          </div>
        </div>

        {/* Artist */}
        <div>
          <label style={{ display: 'block', marginBottom: 6 }}>Artist / DJ preference <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#9A8B82' }}>— optional</span></label>
          <input value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} placeholder="Any artist or DJ?" />
        </div>

        {/* Specific Event */}
        <div>
          <label style={{ display: 'block', marginBottom: 6 }}>Specific event <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#9A8B82' }}>— optional</span></label>
          <input value={form.specificEvent} onChange={(e) => setForm({ ...form, specificEvent: e.target.value })} placeholder="Looking for something specific?" />
        </div>

        {/* Readiness */}
        <div>
          <label style={{ display: 'block', marginBottom: 8 }}>How ready are you to buy?</label>
          <div className="space-y-2">
            {READINESS.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setForm({ ...form, readiness: r.value })}
                className="w-full text-left px-4 py-3 rounded transition-all"
                style={{
                  border: `1.5px solid ${form.readiness === r.value ? '#C1440E' : 'rgba(26,22,18,0.18)'}`,
                  background: form.readiness === r.value ? 'rgba(193,68,14,0.06)' : '#fff',
                  color: form.readiness === r.value ? '#C1440E' : '#1A1612',
                  fontSize: 15,
                  fontWeight: form.readiness === r.value ? 600 : 400,
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label style={{ display: 'block', marginBottom: 6 }}>Anything else? <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#9A8B82' }}>— optional</span></label>
          <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us more..." rows={3} />
        </div>

        <button type="submit" className="btn-primary w-full py-4" style={{ fontSize: 16 }}>
          Add me to the Radar →
        </button>
      </form>
    </div>
  );
}
