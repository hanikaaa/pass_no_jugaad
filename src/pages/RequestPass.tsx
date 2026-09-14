import { useState } from 'react';
import { type NavProps, EVENTS } from '../data/events';

interface Props extends NavProps {
  eventId: string | null;
}

export default function RequestPass({ navigate, eventId }: Props) {
  const event = EVENTS.find((e) => e.id === eventId) || EVENTS[0];
  const [qty, setQty] = useState(2);
  const [budget, setBudget] = useState('');
  const [priority, setPriority] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [message, setMessage] = useState('');

  const BUDGETS = ['₹500–₹1,000', '₹1,000–₹1,500', '₹1,500–₹2,500', '₹2,500+'];
  const PRIORITIES = [
    { value: 'best-price', label: '💰 Best Price' },
    { value: 'premium', label: '👑 Premium / VIP' },
    { value: 'any', label: '✓ Any Pass' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('request-success');
  };

  return (
    <div className="px-4 py-6 pb-24 max-w-lg mx-auto">
      <button onClick={() => navigate('event-detail', { eventId: event.id })} className="flex items-center gap-2 text-white/40 text-sm mb-6 hover:text-white transition-colors">
        ← Back
      </button>

      <h1 className="font-display font-black leading-none mb-6" style={{ fontSize: 'clamp(36px, 10vw, 52px)', letterSpacing: '-0.02em' }}>
        REQUEST<br /><span style={{ color: '#FF5500' }}>PASSES</span>
      </h1>

      {/* Pre-filled event info */}
      <div className="rounded-lg p-4 mb-6" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="font-display font-bold text-xs tracking-widest text-white/30 mb-2">EVENT</div>
        <div className="font-display font-black text-white text-lg mb-1">{event.name}</div>
        <div className="flex gap-3 text-xs text-white/40">
          <span>📅 {event.dateShort}</span>
          <span>📍 {event.venue}</span>
          <span>💰 {event.priceRange}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Quantity */}
        <div>
          <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">NUMBER OF PASSES</label>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-md border border-white/10 text-white font-bold text-xl hover:border-orange-500 hover:text-orange-500 transition-all">−</button>
            <span className="font-display font-black text-3xl text-white w-8 text-center">{qty}</span>
            <button type="button" onClick={() => setQty(Math.min(20, qty + 1))} className="w-10 h-10 rounded-md border border-white/10 text-white font-bold text-xl hover:border-orange-500 hover:text-orange-500 transition-all">+</button>
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">YOUR BUDGET PER PERSON</label>
          <div className="flex flex-wrap gap-2">
            {BUDGETS.map((b) => (
              <button key={b} type="button" onClick={() => setBudget(b)} className={`chip ${budget === b ? 'active' : ''}`}>{b}</button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">PRIORITY</label>
          <div className="space-y-2">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className="w-full text-left px-4 py-3 rounded-md border transition-all"
                style={{
                  background: priority === p.value ? 'rgba(255,85,0,0.1)' : '#0f0f0f',
                  borderColor: priority === p.value ? '#FF5500' : 'rgba(255,255,255,0.1)',
                  color: priority === p.value ? '#FF5500' : 'rgba(255,255,255,0.7)',
                }}
              >
                <span className="font-semibold text-sm">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* WhatsApp */}
        <div>
          <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">WHATSAPP NUMBER</label>
          <input required type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+91 __________" />
        </div>

        {/* Message */}
        <div>
          <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">ADDITIONAL MESSAGE <span className="text-white/20 font-normal normal-case">Optional</span></label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Anything else?" rows={3} />
        </div>

        <button type="submit" className="btn-primary w-full py-4 text-lg">
          SUBMIT REQUEST →
        </button>
      </form>
    </div>
  );
}
