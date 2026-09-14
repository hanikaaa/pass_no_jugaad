import { useState } from 'react';
import { type NavProps, EVENTS, NAVRATRI_DATES, DEMAND_COLOR, DEMAND_LABEL, AVAIL_COLOR } from '../data/events';

export default function CalendarPage({ navigate }: NavProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const eventsForDate = selectedDate
    ? EVENTS.filter((e) => e.dateShort === selectedDate)
    : [];

  return (
    <div className="pb-24">
      <div className="px-4 py-6">
        <div className="font-display font-bold text-xs tracking-widest mb-2" style={{ color: '#FF5500' }}>
          NAVRATRI 2026
        </div>
        <h1 className="font-display font-black leading-none mb-1" style={{ fontSize: 'clamp(40px, 11vw, 64px)', letterSpacing: '-0.02em' }}>
          NAVRATRI<br /><span style={{ color: '#FF5500' }}>CALENDAR</span>
        </h1>
        <p className="text-white/40 text-sm">Explore events night by night.</p>
      </div>

      {/* Dates scroll */}
      <div className="scroll-x flex gap-3 px-4 pb-4">
        {NAVRATRI_DATES.map((d) => {
          const hasEvents = EVENTS.some((e) => e.dateShort === d);
          const active = selectedDate === d;
          return (
            <button
              key={d}
              onClick={() => setSelectedDate(active ? null : d)}
              className="snap-start flex-shrink-0 rounded-lg transition-all"
              style={{
                padding: '12px 16px',
                background: active ? '#FF5500' : '#111',
                border: active ? '1px solid #FF5500' : '1px solid rgba(255,255,255,0.07)',
                minWidth: 72,
              }}
            >
              <div
                className="font-display font-black leading-none text-center"
                style={{ fontSize: 22, color: active ? 'white' : 'rgba(255,255,255,0.9)' }}
              >
                {d.split(' ')[0]}
              </div>
              <div
                className="font-display font-bold text-center"
                style={{ fontSize: 11, letterSpacing: '0.06em', color: active ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.35)' }}
              >
                {d.split(' ')[1]}
              </div>
              {hasEvents && (
                <div className="flex justify-center mt-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: active ? 'white' : '#FF5500' }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Events for selected date */}
      <div className="px-4">
        {!selectedDate && (
          <div
            className="rounded-lg p-6 text-center"
            style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <p className="text-white/30 text-sm">Select a date to see events</p>
          </div>
        )}

        {selectedDate && eventsForDate.length === 0 && (
          <div
            className="rounded-lg p-6"
            style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="font-display font-black text-white text-xl mb-2">{"CAN'T FIND IT?"}</div>
            <p className="text-white/50 text-sm mb-4">No events listed for {selectedDate} yet. Tell us what {"you're"} looking for.</p>
            <button
              onClick={() => navigate('find-jugaad')}
              className="btn-primary w-full py-3"
            >
              REQUEST IT →
            </button>
          </div>
        )}

        {selectedDate && eventsForDate.length > 0 && (
          <div className="space-y-4">
            <div className="font-display font-bold text-xs tracking-widest text-white/30 mb-2">
              {eventsForDate.length} EVENT{eventsForDate.length > 1 ? 'S' : ''} ON {selectedDate}
            </div>
            {eventsForDate.map((event) => (
              <div
                key={event.id}
                className="rounded-lg overflow-hidden card-glow cursor-pointer"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
                onClick={() => navigate('event-detail', { eventId: event.id })}
              >
                <div className="relative h-[160px] bg-zinc-900">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)' }} />
                  <div className="absolute bottom-3 left-3">
                    <div className="font-display font-black text-white text-lg leading-tight">{event.name}</div>
                  </div>
                </div>

                <div className="p-3">
                  <div className="flex items-center gap-2 text-white/40 text-xs mb-2">
                    <span>📍 {event.venue}</span>
                    <span>•</span>
                    <span>⏰ {event.time}</span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display font-bold" style={{ color: '#FF5500' }}>{event.priceRange}</span>
                    <span className="font-display font-bold text-xs" style={{ color: AVAIL_COLOR[event.availability] }}>
                      {event.availability}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xs" style={{ color: DEMAND_COLOR[event.demand] }}>
                      {DEMAND_LABEL[event.demand]}
                    </span>
                    <div className="flex gap-1">
                      {event.type.map((t) => (
                        <span key={t} className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    className="btn-primary w-full mt-3 py-2.5 text-sm"
                    onClick={(e) => { e.stopPropagation(); navigate('event-detail', { eventId: event.id }); }}
                  >
                    VIEW EVENT →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
