import { useState } from 'react';
import { type NavProps, EVENTS } from '../data/events';
import { submitPassRequest } from '../lib/api';

interface Props extends NavProps {
  eventId: string | null;
}

export default function RequestPass({ navigate, eventId }: Props) {
  const event = EVENTS.find((e) => e.id === eventId) || EVENTS[0];
  const [qty, setQty] = useState(2);
  const [budgetMin, setBudgetMin] = useState(500);
  const [budgetMax, setBudgetMax] = useState(2500);
  const [priority, setPriority] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const PRIORITIES = [
    { value: 'best-price', label: 'Best price' },
    { value: 'premium', label: 'Premium / VIP' },
    { value: 'any', label: 'Any pass that fits' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitPassRequest({
      event_id: event.id,
      quantity: qty,
      budget_min: budgetMin,
      budget_max: budgetMax,
      priority_note: message ? `${priority} · Note: ${message}` : priority,
      buyer_phone: phone,
    });
    navigate('request-success');
  };

  const fmt = (v: number) => v >= 1000 ? `₹${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}K` : `₹${v}`;

  return (
    <div className="px-5 py-6 pb-28 max-w-lg mx-auto" style={{ color: '#1A1612' }}>
      <button onClick={() => navigate('event-detail', { eventId: event.id })} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#9A8B82', marginBottom: 24 }}>
        ← Back
      </button>

      <div className="eyebrow mb-3">Request passes</div>
      <h1 className="font-serif leading-tight mb-6" style={{ fontSize: 'clamp(32px, 9vw, 48px)', fontWeight: 500 }}>
        {event.name}
      </h1>

      {/* Event summary */}
      <div className="card-light p-4 mb-6">
        <div className="flex items-center gap-3 text-sm" style={{ color: '#6B5B52' }}>
          <span>📅 {event.dateShort}</span>
          <span>·</span>
          <span>📍 {event.venue}</span>
          <span>·</span>
          <span style={{ color: '#C1440E', fontWeight: 600 }}>{event.priceRange}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quantity */}
        <div>
          <label style={{ display: 'block', marginBottom: 10 }}>Number of passes</label>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded flex items-center justify-center font-bold text-xl" style={{ border: '1.5px solid rgba(26,22,18,0.18)', background: '#fff' }}>−</button>
            <span className="font-serif" style={{ fontSize: 36, fontWeight: 500, minWidth: 36, textAlign: 'center' }}>{qty}</span>
            <button type="button" onClick={() => setQty(Math.min(20, qty + 1))} className="w-10 h-10 rounded flex items-center justify-center font-bold text-xl" style={{ border: '1.5px solid rgba(26,22,18,0.18)', background: '#fff' }}>+</button>
          </div>
        </div>

        {/* Budget slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label>Budget per person</label>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#C1440E' }}>{fmt(budgetMin)} – {fmt(budgetMax)}</span>
          </div>
          <div className="space-y-3">
            <div>
              <div style={{ fontSize: 12, color: '#9A8B82', marginBottom: 6 }}>Min</div>
              <input type="range" min={500} max={15000} step={500} value={budgetMin} onChange={(e) => setBudgetMin(Math.min(Number(e.target.value), budgetMax - 500))} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#9A8B82', marginBottom: 6 }}>Max</div>
              <input type="range" min={500} max={15000} step={500} value={budgetMax} onChange={(e) => setBudgetMax(Math.max(Number(e.target.value), budgetMin + 500))} />
            </div>
          </div>
        </div>

        {/* Priority */}
        <div>
          <label style={{ display: 'block', marginBottom: 10 }}>Priority</label>
          <div className="space-y-2">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className="w-full text-left px-4 py-3 rounded transition-all"
                style={{
                  border: `1.5px solid ${priority === p.value ? '#C1440E' : 'rgba(26,22,18,0.18)'}`,
                  background: priority === p.value ? 'rgba(193,68,14,0.06)' : '#fff',
                  color: priority === p.value ? '#C1440E' : '#1A1612',
                  fontSize: 14,
                  fontWeight: priority === p.value ? 600 : 400,
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contact info: Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Email address *</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Phone Number *</label>
            <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
          </div>
        </div>

        {/* Message */}
        <div>
          <label style={{ display: 'block', marginBottom: 6 }}>Anything else? <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#9A8B82' }}>— optional</span></label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Any notes..." rows={3} />
        </div>

        <button type="submit" className="btn-primary w-full py-4" style={{ fontSize: 16 }}>
          Submit Request →
        </button>
      </form>
    </div>
  );
}
