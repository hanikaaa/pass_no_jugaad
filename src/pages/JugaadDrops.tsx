import { useState, useEffect } from 'react';
import { type NavProps, EVENTS, type Event, normalizeDateShort } from '../data/events';
import { getApprovedEvents } from '../lib/api';

export default function JugaadDrops({ navigate }: NavProps) {
  const [drops, setDrops] = useState<Event[]>(EVENTS.filter((e) => e.jugaadDrop));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApprovedEvents().then((dbEvents) => {
      if (dbEvents && dbEvents.length > 0) {
        const mapped: Event[] = dbEvents
          .filter((e) => e.jugaad_drop)
          .map((e, idx) => {
            const pMin = e.price_min || 800;
            const pMax = e.price_max || pMin;
            const dateStr = e.date || '12 OCT 2026';

            return {
              id: e.id,
              name: e.name,
              date: dateStr,
              dateShort: normalizeDateShort(dateStr),
              venue: e.venue || 'Ahmedabad',
              location: e.venue || 'Ahmedabad',
              time: e.time || '7:00 PM onwards',
              priceRange: `₹${pMin}`,
              priceMin: pMin,
              priceMax: pMax,
              type: e.type_tags && e.type_tags.length ? e.type_tags : ['Garba'],
              demand: 'VERY HIGH',
              availability: 'Limited',
              image: e.image_url || e.image || 'https://images.unsplash.com/photo-1786452156548-9a60189a9876?w=800&h=500&fit=crop&auto=format',
              artist: e.artist || undefined,
              artistImage: e.artist_image_url || undefined,
              description: e.description || '',
              jugaadDrop: true,
              originalPrice: e.original_price || pMax || 1500,
              dropPrice: e.drop_price || pMin || 999,
              dropNumber: e.drop_number || idx + 1,
            };
          });
        setDrops(mapped);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="px-5 py-6 pb-28" style={{ color: '#1A1612' }}>
      <div className="eyebrow mb-3">Pass No Jugaad exclusive</div>
      <h1 className="font-serif leading-tight mb-2" style={{ fontSize: 'clamp(40px, 11vw, 60px)', fontWeight: 500 }}>
        Jugaad<br />
        <span style={{ color: '#C1440E', fontStyle: 'italic' }}>Drops.</span>
      </h1>
      <p style={{ fontSize: 14, color: '#6B5B52', lineHeight: 1.65, marginBottom: 28 }}>
        Exclusive organiser-discounted allocations and flash pass drops.
      </p>

      {loading ? (
        <div className="py-12 text-center text-stone-500">
          <div className="w-8 h-8 mx-auto border-2 border-stone-300 border-t-amber-800 rounded-full animate-spin mb-3" />
          <p className="text-xs">Checking live drops...</p>
        </div>
      ) : drops.length > 0 ? (
        <div className="space-y-5 mb-8">
          {drops.map((event) => {
            const savings = event.originalPrice && event.dropPrice && event.originalPrice > event.dropPrice
              ? Math.round(((event.originalPrice - event.dropPrice) / event.originalPrice) * 100)
              : null;

            return (
              <div key={event.id} className="card-light overflow-hidden shadow-sm">
                <div className="relative bg-stone-200" style={{ height: 210 }}>
                  <img src={event.image} alt={event.name} className="w-full h-full object-cover" loading="lazy" style={{ opacity: 0.9 }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,22,18,0.85) 0%, transparent 60%)' }} />

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="rounded font-sans font-semibold text-white text-xs px-2.5 py-1 shadow" style={{ background: '#C1440E', letterSpacing: '0.06em' }}>
                      ⚡ Drop #{String(event.dropNumber || 1).padStart(2, '0')}
                    </span>
                    <span className="rounded text-xs px-2.5 py-1 shadow" style={{ background: 'rgba(250,247,242,0.95)', color: '#1A1612', fontWeight: 700 }}>
                      {event.dateShort}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div>
                      <div className="font-serif text-white leading-tight" style={{ fontSize: 22, fontWeight: 500 }}>{event.name}</div>
                      <div style={{ fontSize: 12, color: 'rgba(250,247,242,0.85)', marginTop: 2 }}>📍 {event.venue}</div>
                    </div>
                    {event.artist && (
                      <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                        {event.artistImage ? (
                          <img src={event.artistImage} alt={event.artist} className="w-5 h-5 rounded-full object-cover" />
                        ) : (
                          <span className="text-xs">🎤</span>
                        )}
                        <span className="text-white text-xs font-semibold">{event.artist}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-end gap-4 mb-3">
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginBottom: 2 }}>Jugaad price</div>
                      <div className="font-serif" style={{ fontSize: 32, fontWeight: 600, color: '#C1440E', lineHeight: 1 }}>₹{event.dropPrice?.toLocaleString('en-IN')}</div>
                    </div>
                    {event.originalPrice && (
                      <div className="mb-0.5">
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginBottom: 2 }}>Original</div>
                        <div style={{ fontSize: 18, color: '#9A8B82', textDecoration: 'line-through' }}>₹{event.originalPrice?.toLocaleString('en-IN')}</div>
                      </div>
                    )}
                    {savings && (
                      <div className="ml-auto mb-1">
                        <div className="rounded-full px-3 py-1" style={{ background: 'rgba(45,122,79,0.1)', border: '1px solid rgba(45,122,79,0.25)', fontSize: 12, fontWeight: 700, color: '#2D7A4F' }}>
                          Save {savings}%
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="chip active" style={{ padding: '3px 10px', fontSize: 11 }}>Limited Passes</span>
                    <span style={{ fontSize: 11, color: '#9A8B82', fontWeight: 500 }}>Pass No Jugaad verified deal</span>
                  </div>

                  <button onClick={() => navigate('event-detail', { eventId: event.id })} className="btn-primary w-full py-3.5 text-sm">
                    Grab this Drop →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card-light p-8 text-center mb-8">
          <div className="text-3xl mb-2">⚡</div>
          <h3 className="font-serif text-xl font-medium mb-1">No active flash drops right now</h3>
          <p className="text-stone-500 text-xs max-w-xs mx-auto mb-4">
            New limited-capacity discounted drops are added directly by organisers during Navratri.
          </p>
          <button onClick={() => navigate('find-jugaad')} className="btn-primary py-2.5 px-5 text-xs font-semibold">
            Post Your Requirement on Radar →
          </button>
        </div>
      )}

      {/* Social Banner */}
      <div className="card-light p-6 text-center">
        <h3 className="font-serif mb-2" style={{ fontSize: 22, fontWeight: 500 }}>Stay tuned for new drops</h3>
        <p style={{ fontSize: 14, color: '#6B5B52', marginBottom: 16 }}>Follow our updates to never miss an exclusive drop.</p>
        <a href="https://www.instagram.com/pass_no_jugaad_?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
          </svg>
          Follow on Instagram →
        </a>
      </div>
    </div>
  );
}
