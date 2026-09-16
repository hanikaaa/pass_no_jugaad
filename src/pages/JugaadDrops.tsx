import { type NavProps, EVENTS } from '../data/events';

export default function JugaadDrops({ navigate }: NavProps) {
  const drops = EVENTS.filter((e) => e.jugaadDrop);

  return (
    <div className="px-5 py-6 pb-28" style={{ color: '#1A1612' }}>
      <div className="eyebrow mb-3">Pass No Jugaad exclusive</div>
      <h1 className="font-serif leading-tight mb-2" style={{ fontSize: 'clamp(40px, 11vw, 60px)', fontWeight: 500 }}>
        Jugaad<br />
        <span style={{ color: '#C1440E', fontStyle: 'italic' }}>Drops.</span>
      </h1>
      <p style={{ fontSize: 14, color: '#6B5B52', lineHeight: 1.65, marginBottom: 28 }}>
        When something good lands, {"you'll"} know.
      </p>

      <div className="space-y-5 mb-8">
        {drops.map((event) => (
          <div key={event.id} className="card-light overflow-hidden">
            <div className="relative bg-stone-200" style={{ height: 200 }}>
              <img src={event.image} alt={event.name} className="w-full h-full object-cover" loading="lazy" style={{ opacity: 0.85 }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,22,18,0.7) 0%, transparent 55%)' }} />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="rounded font-sans font-semibold text-white text-xs px-2.5 py-1" style={{ background: '#C1440E', letterSpacing: '0.06em' }}>
                  ⚡ Drop #{String(event.dropNumber).padStart(2, '0')}
                </span>
                <span className="rounded text-xs px-2 py-1" style={{ background: 'rgba(250,247,242,0.9)', color: '#1A1612', fontWeight: 600 }}>
                  {event.dateShort}
                </span>
              </div>

              <div className="absolute bottom-3 left-4">
                <div className="font-serif text-white leading-tight" style={{ fontSize: 22, fontWeight: 500 }}>{event.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(250,247,242,0.75)' }}>📍 {event.venue}</div>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-end gap-4 mb-3">
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginBottom: 2 }}>Jugaad price</div>
                  <div className="font-serif" style={{ fontSize: 32, fontWeight: 500, color: '#C1440E', lineHeight: 1 }}>₹{event.dropPrice?.toLocaleString()}</div>
                </div>
                <div className="mb-0.5">
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginBottom: 2 }}>Original</div>
                  <div style={{ fontSize: 18, color: '#9A8B82', textDecoration: 'line-through' }}>₹{event.originalPrice?.toLocaleString()}</div>
                </div>
                <div className="ml-auto mb-1">
                  <div className="rounded-full px-3 py-1" style={{ background: 'rgba(45,122,79,0.1)', border: '1px solid rgba(45,122,79,0.25)', fontSize: 12, fontWeight: 700, color: '#2D7A4F' }}>
                    Save {Math.round(((event.originalPrice! - event.dropPrice!) / event.originalPrice!) * 100)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="chip active" style={{ padding: '3px 10px', fontSize: 11 }}>Limited</span>
                <span style={{ fontSize: 11, color: '#9A8B82', fontWeight: 500 }}>Pass No Jugaad exclusive</span>
              </div>

              <button onClick={() => navigate('event-detail', { eventId: event.id })} className="btn-primary w-full py-3.5 text-sm">
                Grab this Drop →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coming soon */}
      <div className="card-light p-6 text-center">
        <h3 className="font-serif mb-2" style={{ fontSize: 22, fontWeight: 500 }}>More drops coming soon.</h3>
        <p style={{ fontSize: 14, color: '#6B5B52', marginBottom: 16 }}>{"Don't"} miss the next one. Follow us to stay updated.</p>
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
