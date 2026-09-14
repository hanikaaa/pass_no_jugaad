import { type NavProps, EVENTS } from '../data/events';

export default function JugaadDrops({ navigate }: NavProps) {
  const drops = EVENTS.filter((e) => e.jugaadDrop);

  return (
    <div className="px-4 py-6 pb-24">
      <div className="font-display font-bold text-xs tracking-widest mb-2 text-yellow-400">PASS NO JUGAAD EXCLUSIVE</div>
      <h1 className="font-display font-black leading-none mb-2" style={{ fontSize: 'clamp(44px, 12vw, 72px)', letterSpacing: '-0.02em' }}>
        JUGAAD<br /><span style={{ color: '#FF5500' }}>DROPS ⚡</span>
      </h1>
      <p className="text-white/50 text-sm mb-8" style={{ lineHeight: 1.6 }}>
        When something good lands,<br />{"you'll"} know.
      </p>

      {/* Drop cards */}
      <div className="space-y-4 mb-8">
        {drops.map((event) => (
          <div
            key={event.id}
            className="rounded-lg overflow-hidden"
            style={{ background: '#0d0d0d', border: '1px solid rgba(255,85,0,0.2)' }}
          >
            <div className="relative h-[180px] bg-zinc-900">
              <img src={event.image} alt={event.name} className="w-full h-full object-cover opacity-70" loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)' }} />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="font-display font-black text-xs px-2 py-1 rounded" style={{ background: '#FF5500', color: 'white' }}>
                  ⚡ DROP #{String(event.dropNumber).padStart(2, '0')}
                </span>
                <span className="font-display font-bold text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,0,0,0.6)', color: 'white', backdropFilter: 'blur(4px)' }}>
                  {event.dateShort}
                </span>
              </div>

              <div className="absolute bottom-3 left-3">
                <div className="font-display font-black text-white leading-tight" style={{ fontSize: 20 }}>{event.name}</div>
                <div className="text-white/60 text-xs">📍 {event.venue}</div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-end gap-3 mb-3">
                <div>
                  <div className="font-display font-bold text-xs tracking-widest text-white/30 mb-0.5">PASS NO JUGAAD PRICE</div>
                  <div className="font-display font-black" style={{ fontSize: 28, color: '#FF5500' }}>₹{event.dropPrice?.toLocaleString()}</div>
                </div>
                <div className="mb-1">
                  <div className="font-display font-bold text-xs tracking-widest text-white/30 mb-0.5">ORIGINAL</div>
                  <div className="font-display font-bold text-white/30 text-lg line-through">₹{event.originalPrice?.toLocaleString()}</div>
                </div>
                <div className="ml-auto mb-1">
                  <div
                    className="font-display font-black text-xs px-3 py-1.5 rounded"
                    style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' }}
                  >
                    SAVE {Math.round(((event.originalPrice! - event.dropPrice!) / event.originalPrice!) * 100)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span
                  className="font-display font-bold text-xs px-2 py-1 rounded"
                  style={{ background: 'rgba(255,180,0,0.1)', color: '#f5b800', border: '1px solid rgba(255,180,0,0.2)' }}
                >
                  ⚡ LIMITED
                </span>
                <span className="font-display font-bold text-xs text-white/30">PASS NO JUGAAD EXCLUSIVE</span>
              </div>

              <button
                onClick={() => navigate('event-detail', { eventId: event.id })}
                className="btn-primary w-full py-3.5 text-base"
              >
                GRAB THIS DROP →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coming soon */}
      <div
        className="rounded-lg p-6 text-center"
        style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="font-display font-black text-white text-2xl mb-2">MORE DROPS<br />COMING SOON.</div>
        <p className="text-white/40 text-sm mb-4">{"Don't miss the next one."}</p>
        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2 px-6 py-3"
        >
          NOTIFY ME →
        </a>
      </div>
    </div>
  );
}
