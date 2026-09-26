import { useState, useEffect } from 'react';
import { type NavProps, EVENTS, type Event, normalizeDateShort } from '../data/events';
import { submitPassRequest, getEventById } from '../lib/api';

interface Props extends NavProps {
  eventId: string | null;
}

const PRIORITIES = [
  { value: 'best-price', label: 'Best price' },
  { value: 'premium', label: 'Premium / VIP' },
  { value: 'any', label: 'Any pass that fits' },
];

export default function RequestPass({ navigate, eventId }: Props) {
  const [event, setEvent] = useState<Event | null>(() => {
    return EVENTS.find((e) => e.id === eventId) || null;
  });
  const [loading, setLoading] = useState(!event);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [qty, setQty] = useState(2);
  const [budgetMin, setBudgetMin] = useState(500);
  const [budgetMax, setBudgetMax] = useState(2500);
  const [priority, setPriority] = useState('best-price');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!eventId) {
      if (EVENTS.length > 0) setEvent(EVENTS[0]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    getEventById(eventId).then((dbEv) => {
      if (!isMounted) return;
      if (dbEv) {
        const priceMin = dbEv.price_min || 800;
        const priceMax = dbEv.price_max || priceMin;
        const priceFormatted =
          priceMin === priceMax
            ? `₹${priceMin.toLocaleString('en-IN')}`
            : `₹${priceMin.toLocaleString('en-IN')}–₹${priceMax.toLocaleString('en-IN')}`;
        const dateStr = dbEv.date || '12 OCT 2026';

        setEvent({
          id: dbEv.id,
          name: dbEv.name,
          date: dateStr,
          dateShort: normalizeDateShort(dateStr),
          venue: dbEv.venue || 'Ahmedabad',
          location: dbEv.venue || 'Ahmedabad',
          time: dbEv.time || '7:00 PM onwards',
          priceRange: priceFormatted,
          priceMin,
          priceMax,
          type: dbEv.type_tags && dbEv.type_tags.length ? dbEv.type_tags : ['Garba'],
          demand: 'HIGH',
          availability: 'Available',
          image:
            dbEv.image_url ||
            dbEv.image ||
            'https://images.unsplash.com/photo-1786452156548-9a60189a9876?w=800&h=500&fit=crop&auto=format',
          artist: dbEv.artist || undefined,
          artistImage: dbEv.artist_image_url || undefined,
          description: dbEv.description || '',
          featured: false,
          jugaadDrop: !!dbEv.jugaad_drop,
          dropPrice: dbEv.drop_price || undefined,
          originalPrice: dbEv.original_price || undefined,
          contactEmail: dbEv.contact_email || undefined,
        });

        if (priceMin) setBudgetMin(priceMin);
        if (priceMax) setBudgetMax(Math.max(priceMax, priceMin + 500));
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    setSubmitting(true);
    setErrorMsg(null);

    const res = await submitPassRequest({
      event_id: event.id,
      quantity: qty,
      budget_min: budgetMin,
      budget_max: budgetMax,
      priority_note: message ? `${priority} · Name: ${name || 'Buyer'} · Note: ${message}` : `${priority} · Name: ${name || 'Buyer'}`,
      buyer_phone: phone,
    });

    setSubmitting(false);
    if (res.error) {
      setErrorMsg(res.error);
      return;
    }

    navigate('request-success');
  };

  const fmt = (v: number) => (v >= 1000 ? `₹${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}K` : `₹${v}`);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-10 h-10 border-3 border-amber-800 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-stone-500 font-semibold tracking-wider uppercase">Loading event request form…</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="px-5 py-12 max-w-lg mx-auto text-center" style={{ color: '#1A1612' }}>
        <h2 className="font-serif text-2xl font-bold mb-2">Event Not Found</h2>
        <p className="text-xs text-stone-500 mb-6">The event you are looking to request passes for is unavailable.</p>
        <button onClick={() => navigate('events')} className="btn-primary py-3 px-6 text-xs font-bold">
          Browse All Events →
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 pb-28 max-w-lg mx-auto" style={{ color: '#1A1612' }}>
      <button
        onClick={() => navigate('event-detail', { eventId: event.id })}
        style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#9A8B82', marginBottom: 24 }}
      >
        ← Back to Event
      </button>

      <div className="eyebrow mb-2">Request passes</div>
      <h1 className="font-serif leading-tight mb-4" style={{ fontSize: 'clamp(28px, 8vw, 42px)', fontWeight: 600 }}>
        {event.name}
      </h1>

      {/* Event summary card */}
      <div className="card-light p-4 mb-6 flex items-center gap-3">
        {event.image && (
          <img src={event.image} alt={event.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-stone-200" />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-xs text-stone-700 font-medium truncate">{event.venue}</div>
          <div className="flex items-center gap-2 text-xs mt-0.5" style={{ color: '#6B5B52' }}>
            <span className="font-semibold text-stone-900">📅 {event.dateShort}</span>
            <span>·</span>
            <span style={{ color: '#C1440E', fontWeight: 700 }}>{event.priceRange}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quantity */}
        <div>
          <label style={{ display: 'block', marginBottom: 10 }}>Number of passes</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-10 h-10 rounded flex items-center justify-center font-bold text-xl"
              style={{ border: '1.5px solid rgba(26,22,18,0.18)', background: '#fff' }}
            >
              −
            </button>
            <span className="font-serif" style={{ fontSize: 36, fontWeight: 500, minWidth: 36, textAlign: 'center' }}>
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty(Math.min(20, qty + 1))}
              className="w-10 h-10 rounded flex items-center justify-center font-bold text-xl"
              style={{ border: '1.5px solid rgba(26,22,18,0.18)', background: '#fff' }}
            >
              +
            </button>
          </div>
        </div>

        {/* Budget slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label>Budget per person</label>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#C1440E' }}>
              {fmt(budgetMin)} – {fmt(budgetMax)}
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <div style={{ fontSize: 12, color: '#9A8B82', marginBottom: 6 }}>Min</div>
              <input
                type="range"
                min={500}
                max={15000}
                step={500}
                value={budgetMin}
                onChange={(e) => setBudgetMin(Math.min(Number(e.target.value), budgetMax - 500))}
              />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#9A8B82', marginBottom: 6 }}>Max</div>
              <input
                type="range"
                min={500}
                max={15000}
                step={500}
                value={budgetMax}
                onChange={(e) => setBudgetMax(Math.max(Number(e.target.value), budgetMin + 500))}
              />
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

        {/* Name, Email & Phone */}
        <div className="space-y-4">
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Your Name *</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={{ display: 'block', marginBottom: 6 }}>Email address *</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6 }}>Phone / WhatsApp Number *</label>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
        </div>

        {/* Message */}
        <div>
          <label style={{ display: 'block', marginBottom: 6 }}>
            Special notes / requests{' '}
            <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#9A8B82' }}>— optional</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Need couple passes together, prefer ground floor..."
            rows={3}
          />
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg text-xs" style={{ background: 'rgba(193,68,14,0.1)', border: '1px solid rgba(193,68,14,0.3)', color: '#C1440E' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full py-4 text-base font-bold">
          {submitting ? 'Submitting Request...' : 'Submit Request →'}
        </button>
      </form>
    </div>
  );
}
