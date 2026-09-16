import { useState } from 'react';
import { type Event, DEMAND_LABEL, type NavProps } from '../data/events';

interface Props extends NavProps {
  event: Event;
}

const AVAIL_STYLE: Record<string, { color: string }> = {
  'Available':    { color: '#2D7A4F' },
  'Limited':      { color: '#C1440E' },
  'Request Only': { color: '#9A8B82' },
};

export default function EventCard({ event, navigate }: Props) {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div
      className="card-light overflow-hidden cursor-pointer"
      onClick={() => navigate('event-detail', { eventId: event.id })}
    >
      <div className="relative h-[200px] bg-stone-100 overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,22,18,0.55) 0%, transparent 55%)' }} />

        <div className="absolute top-3 left-3">
          <div
            className="font-sans font-bold leading-none px-2.5 py-1 rounded text-white"
            style={{ background: '#C1440E', fontSize: 11, letterSpacing: '0.08em' }}
          >
            {event.dateShort}
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); setBookmarked(!bookmarked); }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition-all"
          style={{ background: 'rgba(250,247,242,0.9)', backdropFilter: 'blur(8px)' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill={bookmarked ? '#C1440E' : 'none'} stroke={bookmarked ? '#C1440E' : '#1A1612'} strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
        </button>

        {event.jugaadDrop && (
          <div className="absolute bottom-3 left-3">
            <span className="font-sans font-semibold text-[10px] px-2 py-0.5 rounded text-white" style={{ background: '#C1440E', letterSpacing: '0.06em' }}>
              ⚡ Jugaad Drop
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex gap-1 mb-2 flex-wrap">
          {event.type.slice(0, 2).map((t) => (
            <span key={t} className="chip" style={{ padding: '2px 8px', fontSize: 11 }}>{t}</span>
          ))}
        </div>

        <div className="font-serif mb-1 leading-snug" style={{ fontSize: 18, fontWeight: 500, color: '#1A1612' }}>
          {event.name}
        </div>

        <div className="flex items-center gap-1 mb-3">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9A8B82" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span style={{ fontSize: 12, color: '#9A8B82' }}>{event.venue}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-sans font-semibold" style={{ color: '#C1440E', fontSize: 15 }}>
            {event.priceRange}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: AVAIL_STYLE[event.availability]?.color ?? '#9A8B82' }}>
            {event.availability}
          </span>
        </div>

        <div className="flex items-center justify-between mt-2.5 pt-2.5" style={{ borderTop: '1px solid rgba(26,22,18,0.07)' }}>
          <span style={{ fontSize: 12, color: '#9A8B82' }}>{DEMAND_LABEL[event.demand]}</span>
          <button
            className="btn-primary"
            style={{ padding: '6px 14px', fontSize: 12 }}
            onClick={(e) => { e.stopPropagation(); navigate('event-detail', { eventId: event.id }); }}
          >
            View →
          </button>
        </div>
      </div>
    </div>
  );
}
