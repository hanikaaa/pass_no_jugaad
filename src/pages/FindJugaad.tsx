import { useState } from 'react';
import { type NavProps, NAVRATRI_DATES } from '../data/events';

interface Props extends NavProps {
  prefill?: Partial<FormData>;
}

interface FormData {
  name: string;
  whatsapp: string;
  dates: string[];
  quantity: number;
  budget: string;
  customBudget: string;
  location: string;
  eventTypes: string[];
  artist: string;
  specificEvent: string;
  readiness: string;
  message: string;
}

const EVENT_TYPES = ['Full Power', 'Pure Garba', 'Artist Night', 'Premium', 'Late Night', 'Family', 'College', 'Other'];
const LOCATIONS = ['SG Highway', 'Sindhu Bhavan', 'Bopal', 'GIFT City', 'Shilaj', 'SBR', 'Anywhere'];
const BUDGETS = ['₹500–₹1,000', '₹1,000–₹1,500', '₹1,500–₹2,500', '₹2,500+'];
const READINESS = [
  { value: 'ready', label: '🔥 Ready to book' },
  { value: 'exploring', label: '👀 Exploring' },
  { value: 'maybe', label: '💸 Take it if it\'s right' },
];

export default function FindJugaad({ navigate, prefill }: Props) {
  const [form, setForm] = useState<FormData>({
    name: '',
    whatsapp: '',
    dates: prefill?.dates || [],
    quantity: prefill?.quantity || 2,
    budget: prefill?.budget || '',
    customBudget: '',
    location: prefill?.location || '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('jugaad-success');
  };

  return (
    <div className="px-4 py-6 pb-24 max-w-lg mx-auto">
      <button onClick={() => navigate('home')} className="flex items-center gap-2 text-white/40 text-sm mb-6 hover:text-white transition-colors">
        ← Back
      </button>

      <h1 className="font-display font-black leading-none mb-2" style={{ fontSize: 'clamp(40px, 11vw, 60px)', letterSpacing: '-0.02em' }}>
        WHAT ARE YOU<br /><span style={{ color: '#FF5500' }}>LOOKING FOR?</span>
      </h1>
      <p className="text-white/50 text-sm mb-8">Tell us what your ideal Navratri looks like.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">NAME</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Type your name"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">WHATSAPP NUMBER</label>
          <input
            required
            type="tel"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="+91 __________"
          />
        </div>

        {/* Dates */}
        <div>
          <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">PREFERRED DATE</label>
          <div className="flex flex-wrap gap-2">
            {NAVRATRI_DATES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggle('dates', d)}
                className={`chip ${form.dates.includes(d) ? 'active' : ''}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">NUMBER OF PASSES</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setForm({ ...form, quantity: Math.max(1, form.quantity - 1) })}
              className="w-10 h-10 rounded-md border border-white/10 text-white font-bold text-xl hover:border-orange-500 hover:text-orange-500 transition-all"
            >
              −
            </button>
            <span className="font-display font-black text-3xl text-white w-8 text-center">{form.quantity}</span>
            <button
              type="button"
              onClick={() => setForm({ ...form, quantity: Math.min(20, form.quantity + 1) })}
              className="w-10 h-10 rounded-md border border-white/10 text-white font-bold text-xl hover:border-orange-500 hover:text-orange-500 transition-all"
            >
              +
            </button>
            <span className="text-white/40 text-sm">passes</span>
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">YOUR BUDGET PER PERSON</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {BUDGETS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setForm({ ...form, budget: b, customBudget: '' })}
                className={`chip ${form.budget === b ? 'active' : ''}`}
              >
                {b}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-sm">Custom ₹</span>
            <input
              value={form.customBudget}
              onChange={(e) => setForm({ ...form, customBudget: e.target.value, budget: '' })}
              placeholder="Type amount"
              style={{ width: '140px' }}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">LOCATION</label>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Where do you want to go?"
            className="mb-2"
          />
          <div className="flex flex-wrap gap-2">
            {LOCATIONS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setForm({ ...form, location: l })}
                className={`chip ${form.location === l ? 'active' : ''}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Event Type */}
        <div>
          <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">EVENT TYPE</label>
          <div className="flex flex-wrap gap-2">
            {EVENT_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggle('eventTypes', t)}
                className={`chip ${form.eventTypes.includes(t) ? 'active' : ''}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Artist */}
        <div>
          <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">ARTIST / DJ PREFERENCE</label>
          <input
            value={form.artist}
            onChange={(e) => setForm({ ...form, artist: e.target.value })}
            placeholder="Any artist or DJ?"
          />
        </div>

        {/* Specific Event */}
        <div>
          <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">
            SPECIFIC EVENT <span className="text-white/20 font-normal normal-case">Optional</span>
          </label>
          <input
            value={form.specificEvent}
            onChange={(e) => setForm({ ...form, specificEvent: e.target.value })}
            placeholder="Looking for something specific?"
          />
        </div>

        {/* Readiness */}
        <div>
          <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">HOW READY ARE YOU TO BUY?</label>
          <div className="space-y-2">
            {READINESS.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setForm({ ...form, readiness: r.value })}
                className="w-full text-left px-4 py-3 rounded-md border transition-all"
                style={{
                  background: form.readiness === r.value ? 'rgba(255,85,0,0.1)' : '#0f0f0f',
                  borderColor: form.readiness === r.value ? '#FF5500' : 'rgba(255,255,255,0.1)',
                  color: form.readiness === r.value ? '#FF5500' : 'rgba(255,255,255,0.7)',
                }}
              >
                <span className="font-semibold text-sm">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">
            ADDITIONAL MESSAGE <span className="text-white/20 font-normal normal-case">Optional</span>
          </label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Anything else we should know?"
            rows={3}
          />
        </div>

        <button type="submit" className="btn-primary w-full py-4 text-lg">
          ADD ME TO THE RADAR →
        </button>
      </form>
    </div>
  );
}
