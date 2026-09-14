import { useState } from 'react';
import { type NavProps, EVENTS, DEMAND_COLOR, DEMAND_LABEL, AVAIL_COLOR } from '../data/events';

interface Props extends NavProps {
  eventId: string | null;
}

export default function EventDetail({ navigate, eventId }: Props) {
  const event = EVENTS.find((e) => e.id === eventId) || EVENTS[0];
  const [qty, setQty] = useState(2);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="pb-24">
      {/* Hero image */}
      <div className="relative h-[60vw] max-h-[360px] bg-zinc-900 -mt-[56px]">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(8,8,8,0) 50%, rgba(8,8,8,0.9) 100%)' }} />

        {/* Top controls */}
        <div className="absolute top-[calc(56px+12px)] left-0 right-0 flex items-center justify-between px-4">
          <button
            onClick={() => navigate('events')}
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className="w-9 h-9 flex items-center justify-center rounded-full"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmarked ? '#FF5500' : 'none'} stroke={bookmarked ? '#FF5500' : 'white'} strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-full"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          </div>
        </div>

        {/* Date badge */}
        <div className="absolute bottom-4 left-4">
          <div
            className="font-display font-black leading-none text-center px-3 py-2 rounded"
            style={{ background: '#FF5500', color: 'white' }}
          >
            <div style={{ fontSize: 28 }}>{event.dateShort.split(' ')[0]}</div>
            <div style={{ fontSize: 12, letterSpacing: '0.06em' }}>{event.dateShort.split(' ')[1]}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-5">
        <h1 className="font-display font-black leading-none mb-2" style={{ fontSize: 'clamp(32px, 9vw, 56px)', letterSpacing: '-0.02em' }}>
          {event.name}
        </h1>

        <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {event.location}
        </div>
        <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {event.time}
        </div>

        {/* Type tags */}
        <div className="flex gap-2 flex-wrap mb-5">
          {event.type.map((t) => (
            <span key={t} className="font-display font-bold text-xs px-3 py-1 rounded" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {t}
            </span>
          ))}
          {event.artist && (
            <span className="font-display font-bold text-xs px-3 py-1 rounded" style={{ background: 'rgba(255,85,0,0.1)', color: '#FF5500', border: '1px solid rgba(255,85,0,0.2)' }}>
              {event.artist}
            </span>
          )}
        </div>

        {/* About */}
        <div className="mb-5">
          <div className="font-display font-bold text-xs tracking-widest text-white/30 mb-2">ABOUT</div>
          <p className="text-white/60 text-sm" style={{ lineHeight: 1.65 }}>{event.description}</p>
        </div>

        {/* Price + Demand */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-lg p-4" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="font-display font-bold text-xs tracking-widest text-white/30 mb-1">PRICE RANGE</div>
            <div className="font-display font-black text-white" style={{ fontSize: 18 }}>{event.priceRange}</div>
          </div>
          <div className="rounded-lg p-4" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="font-display font-bold text-xs tracking-widest text-white/30 mb-1">AVAILABILITY</div>
            <div className="font-display font-black text-sm" style={{ color: AVAIL_COLOR[event.availability] }}>{event.availability}</div>
          </div>
        </div>

        {/* Demand */}
        <div className="rounded-lg p-4 mb-5" style={{ background: 'rgba(255,85,0,0.06)', border: '1px solid rgba(255,85,0,0.15)' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display font-bold text-xs tracking-widest text-white/30 mb-1">DEMAND</div>
              <div className="font-display font-black" style={{ color: DEMAND_COLOR[event.demand], fontSize: 16 }}>
                {DEMAND_LABEL[event.demand]}
              </div>
            </div>
            <div className="text-right">
              <div className="font-display font-black text-white" style={{ fontSize: 28 }}>200+</div>
              <div className="font-display font-semibold text-white/30 text-[10px] tracking-widest">PEOPLE INTERESTED</div>
            </div>
          </div>
          <p className="text-white/25 text-[10px] mt-2">* Demo data — community demand signal</p>
        </div>

        {/* Quantity */}
        <div className="mb-5">
          <div className="font-display font-bold text-xs tracking-widest text-white/30 mb-3">HOW MANY PASSES?</div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-11 h-11 rounded-md border border-white/10 text-white font-bold text-xl hover:border-orange-500 hover:text-orange-500 transition-all"
            >
              −
            </button>
            <span className="font-display font-black text-4xl text-white w-10 text-center">{qty}</span>
            <button
              onClick={() => setQty(Math.min(20, qty + 1))}
              className="w-11 h-11 rounded-md border border-white/10 text-white font-bold text-xl hover:border-orange-500 hover:text-orange-500 transition-all"
            >
              +
            </button>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('request-pass', { eventId: event.id })}
            className="btn-primary w-full py-4 text-lg"
          >
            REQUEST PASSES →
          </button>
          <button className="btn-outline w-full py-3.5 text-sm">
            SHARE EVENT
          </button>
        </div>
      </div>
    </div>
  );
}
