import { useState } from 'react';
import { type NavProps, EVENTS } from '../data/events';

interface Props extends NavProps {
  eventId: string | null;
}

const AVAIL_COLOR: Record<string, string> = {
  'Available': '#2D7A4F',
  'Limited': '#C1440E',
  'Request Only': '#9A8B82',
};

const DEMAND_LABEL: Record<string, string> = {
  LOW: 'Low demand',
  MEDIUM: 'Moderate interest',
  HIGH: 'High demand',
  'VERY HIGH': 'Very high demand — act fast',
};

export default function EventDetail({ navigate, eventId }: Props) {
  const event = EVENTS.find((e) => e.id === eventId) || EVENTS[0];
  const [qty, setQty] = useState(2);
  const [bookmarked, setBookmarked] = useState(false);

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
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: 'rgba(250,247,242,0.9)', backdropFilter: 'blur(8px)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1612" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className="w-9 h-9 flex items-center justify-center rounded-full"
              style={{ background: 'rgba(250,247,242,0.9)', backdropFilter: 'blur(8px)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmarked ? '#C1440E' : 'none'} stroke={bookmarked ? '#C1440E' : '#1A1612'} strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Date badge */}
        <div className="absolute bottom-4 left-4">
          <div className="rounded font-sans font-bold text-white text-center px-3 py-2" style={{ background: '#C1440E' }}>
            <div style={{ fontSize: 26, lineHeight: 1 }}>{event.dateShort.split(' ')[0]}</div>
            <div style={{ fontSize: 11, letterSpacing: '0.08em' }}>{event.dateShort.split(' ')[1]}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-6">
        {/* Tags */}
        <div className="flex gap-2 flex-wrap mb-4">
          {event.type.map((t) => (
            <span key={t} className="chip" style={{ padding: '4px 10px', fontSize: 12 }}>{t}</span>
          ))}
          {event.artist && (
            <span className="chip active" style={{ padding: '4px 10px', fontSize: 12 }}>{event.artist}</span>
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

        {/* Price + Availability */}
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

        {/* Demand */}
        <div className="card-light p-4 mb-6" style={{ borderColor: 'rgba(193,68,14,0.2)', background: 'rgba(193,68,14,0.04)' }}>
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginBottom: 4 }}>Demand</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#C1440E' }}>{DEMAND_LABEL[event.demand] ?? event.demand}</div>
            </div>
            <div className="text-right">
              <div className="font-serif" style={{ fontSize: 32, fontWeight: 500, color: '#1A1612' }}>200+</div>
              <div style={{ fontSize: 10, color: '#9A8B82', textTransform: 'uppercase', letterSpacing: '0.08em' }}>interested</div>
            </div>
          </div>
          <p style={{ fontSize: 11, color: '#9A8B82', marginTop: 8 }}>* Demo data — community demand signal</p>
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
          <button onClick={() => navigate('request-pass', { eventId: event.id })} className="btn-primary w-full py-4" style={{ fontSize: 16 }}>
            Request Passes →
          </button>
          <button className="btn-outline w-full py-3.5 text-sm">Share event</button>
        </div>
      </div>
    </div>
  );
}
