import { useState } from 'react';
import { type Event, DEMAND_COLOR, DEMAND_LABEL, AVAIL_COLOR, type NavProps } from '../data/events';

interface Props extends NavProps {
  event: Event;
}

export default function EventCard({ event, navigate }: Props) {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div
      className="card-glow rounded-lg overflow-hidden cursor-pointer transition-all"
      style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
      onClick={() => navigate('event-detail', { eventId: event.id })}
    >
      <div className="relative h-[180px] bg-zinc-900 overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)' }} />

        <div className="absolute top-3 left-3">
          <div
            className="font-display font-black leading-none px-2 py-1 rounded"
            style={{ background: '#FF5500', fontSize: 11, letterSpacing: '0.06em', color: 'white' }}
          >
            {event.dateShort}
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); setBookmarked(!bookmarked); }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition-all"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmarked ? '#FF5500' : 'none'} stroke={bookmarked ? '#FF5500' : 'white'} strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
        </button>

        {event.jugaadDrop && (
          <div className="absolute bottom-3 left-3">
            <span className="font-display font-bold text-[10px] px-2 py-0.5 rounded" style={{ background: '#FF5500', color: 'white', letterSpacing: '0.06em' }}>
              ⚡ JUGAAD DROP
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div
            className="font-display font-black leading-tight"
            style={{ fontSize: 16, letterSpacing: '-0.01em' }}
          >
            {event.name}
          </div>
        </div>

        <div className="flex items-center gap-1 mb-2">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{event.venue}</span>
        </div>

        <div className="flex items-center justify-between mb-2.5">
          <span className="font-display font-bold text-sm" style={{ color: '#FF5500' }}>
            {event.priceRange}
          </span>
          <span
            className="font-display font-bold text-xs"
            style={{ color: AVAIL_COLOR[event.availability] }}
          >
            {event.availability}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span
            className="font-display font-bold text-xs"
            style={{ color: DEMAND_COLOR[event.demand] }}
          >
            {DEMAND_LABEL[event.demand]}
          </span>

          <div className="flex gap-1">
            {event.type.slice(0, 1).map((t) => (
              <span
                key={t}
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
