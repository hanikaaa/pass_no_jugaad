import { useState, useEffect } from 'react';
import { type NavProps, EVENTS, type Event, normalizeDateShort } from '../data/events';
import { getEventById } from '../lib/api';

interface Props extends NavProps {
  eventId: string | null;
}

const AVAIL_COLOR: Record<string, string> = {
  'Available': '#2D7A4F',
  'Limited': '#C1440E',
  'Request Only': '#9A8B82',
};

const DEMAND_LABEL: Record<string, string> = {
  LOW: 'Verified Event',
  MEDIUM: 'Moderate interest',
  HIGH: 'High demand',
  'VERY HIGH': 'Very high demand — act fast',
};

export default function EventDetail({ navigate, eventId }: Props) {
  const [event, setEvent] = useState<Event | null>(() => {
    return EVENTS.find((e) => e.id === eventId) || null;
  });
  const [loading, setLoading] = useState(!event);
  const [qty, setQty] = useState(2);

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
        const priceFormatted = priceMin === priceMax ? `₹${priceMin.toLocaleString('en-IN')}` : `₹${priceMin.toLocaleString('en-IN')}–₹${priceMax.toLocaleString('en-IN')}`;
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
          image: dbEv.image_url || dbEv.image || 'https://images.unsplash.com/photo-1786452156548-9a60189a9876?w=800&h=500&fit=crop&auto=format',
          artist: dbEv.artist || undefined,
          artistImage: dbEv.artist_image_url || undefined,
          description: dbEv.description || 'Join the vibrant Navratri celebration with traditional music, dance, and festive energy in Ahmedabad.',
          contactEmail: dbEv.contact_email || undefined,
          contactPhone: dbEv.contact_phone || undefined,
          jugaadDrop: !!dbEv.jugaad_drop,
          originalPrice: dbEv.original_price || undefined,
          dropPrice: dbEv.drop_price || undefined,
          dropNumber: dbEv.drop_number || undefined,
        });
      } else {
        const staticMatch = EVENTS.find((e) => e.id === eventId);
        if (staticMatch) setEvent(staticMatch);
      }
      setLoading(false);
    }).catch(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center py-20 text-stone-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-stone-300 border-t-amber-800 rounded-full animate-spin" />
          <span className="text-sm">Loading event details...</span>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="px-5 py-12 text-center">
        <h2 className="font-serif text-2xl mb-2">Event Not Found</h2>
        <p className="text-stone-500 text-sm mb-6">The requested event could not be found or has ended.</p>
        <button onClick={() => navigate('events')} className="btn-primary py-2.5 px-6 text-sm">
          Browse All Events →
        </button>
      </div>
    );
  }

  const dateParts = event.dateShort ? event.dateShort.split(' ') : ['12', 'OCT'];

  return (
    <div className="pb-24" style={{ color: '#1A1612' }}>
      {/* Hero image */}
      <div className="relative bg-stone-200 -mt-[60px]" style={{ height: 'min(60vw, 380px)' }}>
        <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(26,22,18,0.25) 0%, transparent 50%, rgba(26,22,18,0.65) 100%)' }} />

        {/* Top controls */}
        <div className="absolute flex items-center justify-between px-4 left-0 right-0" style={{ top: 'calc(60px + 12px)' }}>
          <button
            onClick={() => navigate('events')}
            className="w-9 h-9 flex items-center justify-center rounded-full shadow-md"
            style={{ background: 'rgba(250,247,242,0.95)', backdropFilter: 'blur(8px)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1612" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={() => {
              const url = `${window.location.origin}/?page=event-detail&eventId=${event.id}`;
              if (navigator.share) {
                navigator.share({ title: `${event.name} | Pass No Jugaad`, text: `Check out ${event.name} on Pass No Jugaad!`, url }).catch(() => {});
              } else {
                navigator.clipboard.writeText(url);
                alert('Direct event link copied to clipboard!');
              }
            }}
            className="w-9 h-9 flex items-center justify-center rounded-full shadow-md"
            style={{ background: 'rgba(250,247,242,0.95)', backdropFilter: 'blur(8px)' }}
            title="Share event"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A1612" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>

        {/* Date badge & Drop banner */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div className="rounded font-sans font-bold text-white text-center px-3 py-2 shadow" style={{ background: '#C1440E' }}>
            <div style={{ fontSize: 22, lineHeight: 1 }}>{dateParts[0] || '12'}</div>
            <div style={{ fontSize: 11, letterSpacing: '0.08em' }}>{dateParts.slice(1).join(' ') || 'OCT'}</div>
          </div>
          {event.jugaadDrop && (
            <div className="rounded font-sans font-bold text-white text-xs px-3 py-2 shadow bg-amber-600 flex items-center gap-1.5">
              <span>⚡ JUGAAD DROP LIVE</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-6">
        {/* Tags & Artist Avatar */}
        <div className="flex gap-2 flex-wrap items-center mb-4">
          {event.type.map((t) => (
            <span key={t} className="chip" style={{ padding: '4px 10px', fontSize: 12 }}>{t}</span>
          ))}
          {event.artist && (
            <span className="inline-flex items-center gap-1.5 chip active" style={{ padding: '4px 12px', fontSize: 12 }}>
              {event.artistImage ? (
                <img src={event.artistImage} alt={event.artist} className="w-5 h-5 rounded-full object-cover border border-amber-900/30" />
              ) : (
                <span>🎤</span>
              )}
              <span>{event.artist}</span>
            </span>
          )}
        </div>

        <h1 className="font-serif leading-tight mb-2" style={{ fontSize: 'clamp(28px, 8vw, 48px)', fontWeight: 500 }}>
          {event.name}
        </h1>

        <div className="space-y-1 mb-5" style={{ fontSize: 14, color: '#6B5B52' }}>
          <div className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {event.location}
          </div>
          <div className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {event.time}
          </div>
        </div>

        {/* About */}
        <div className="mb-6">
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9A8B82', marginBottom: 8 }}>About</div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#6B5B52' }}>{event.description}</p>
        </div>

        {/* Featured Artist Banner if image present */}
        {event.artist && event.artistImage && (
          <div className="card-light p-4 mb-5 flex items-center gap-4 border border-amber-200/60 bg-amber-50/40">
            <img src={event.artistImage} alt={event.artist} className="w-14 h-14 rounded-full object-cover shadow-sm border-2 border-white" />
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C1440E' }}>Featured Headliner</div>
              <div className="font-serif text-lg font-medium text-stone-900">{event.artist}</div>
              <div style={{ fontSize: 12, color: '#6B5B52' }}>Live performance at {event.venue}</div>
            </div>
          </div>
        )}

        {/* Price + Availability / Jugaad Drop Price */}
        {event.jugaadDrop && event.dropPrice ? (
          <div className="card-light p-4 mb-5 border-2 border-amber-600/30 bg-amber-50/50">
            <div className="flex items-center justify-between mb-1">
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C1440E' }}>⚡ Exclusive Jugaad Drop</div>
              {event.originalPrice && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-700 text-white">
                  Save {Math.round(((event.originalPrice - event.dropPrice) / event.originalPrice) * 100)}%
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-3">
              <div className="font-serif text-3xl font-bold text-amber-900">₹{event.dropPrice.toLocaleString('en-IN')}</div>
              {event.originalPrice && (
                <div className="text-stone-400 text-lg line-through">₹{event.originalPrice.toLocaleString('en-IN')}</div>
              )}
              <span className="ml-auto text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                Verified Deal
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="card-light p-4">
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginBottom: 4 }}>Price</div>
              <div className="font-serif" style={{ fontSize: 20, fontWeight: 500, color: '#C1440E' }}>{event.priceRange}</div>
            </div>
            <div className="card-light p-4">
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginBottom: 4 }}>Availability</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: AVAIL_COLOR[event.availability] ?? '#9A8B82' }}>{event.availability}</div>
            </div>
          </div>
        )}

        {/* Clean Event Status Banner */}
        <div className="card-light p-4 mb-6 flex items-center justify-between" style={{ borderColor: 'rgba(193,68,14,0.2)', background: 'rgba(193,68,14,0.04)' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginBottom: 2 }}>Platform Status</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#C1440E' }}>Direct Organiser Matchmaking</div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-stone-200 text-stone-700">
            ✓ Verified Pass Source
          </span>
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginBottom: 12 }}>How many passes?</div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-11 h-11 rounded flex items-center justify-center font-bold text-xl transition-colors"
              style={{ border: '1.5px solid rgba(26,22,18,0.18)', background: '#fff', color: '#1A1612' }}
            >−</button>
            <span className="font-serif" style={{ fontSize: 38, fontWeight: 500, minWidth: 36, textAlign: 'center' }}>{qty}</span>
            <button
              onClick={() => setQty(Math.min(20, qty + 1))}
              className="w-11 h-11 rounded flex items-center justify-center font-bold text-xl transition-colors"
              style={{ border: '1.5px solid rgba(26,22,18,0.18)', background: '#fff', color: '#1A1612' }}
            >+</button>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <button onClick={() => navigate('request-pass', { eventId: event.id })} className="btn-primary w-full py-4 text-base font-bold">
            {event.jugaadDrop ? 'Grab This Drop Passes →' : 'Request Passes →'}
          </button>
          <button
            onClick={() => {
              const url = `${window.location.origin}/?page=event-detail&eventId=${event.id}`;
              if (navigator.share) {
                navigator.share({
                  title: `${event.name} | Pass No Jugaad`,
                  text: `Check out ${event.name} on Pass No Jugaad — Navratri 2026!`,
                  url,
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(url);
                alert('Direct event link copied to clipboard!');
              }
            }}
            className="btn-outline w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <span>🔗</span> Share Event Link
          </button>
        </div>
      </div>
    </div>
  );
}
