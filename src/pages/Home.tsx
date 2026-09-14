import { useState, useEffect } from 'react';
import { type NavProps, EVENTS } from '../data/events';
import EventCard from '../components/EventCard';

export default function Home({ navigate }: NavProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const featuredEvents = EVENTS.filter((e) => e.featured).slice(0, 3);

  const stats = [
    { value: '10', label: 'NIGHTS' },
    { value: '50+', label: 'EVENTS' },
    { value: '10K+', label: 'JUGAAD SEEKERS' },
  ];

  const steps = [
    { num: '01', label: 'YOU TELL US', desc: 'Tell us your date, budget, location and vibe.' },
    { num: '02', label: 'WE TRACK', desc: 'We aggregate demand and monitor what people want.' },
    { num: '03', label: 'WE CONNECT', desc: 'When something relevant becomes available, we find you.' },
  ];

  return (
    <div>
      {/* HERO */}
      <div className="relative min-h-[90vh] flex flex-col justify-end overflow-hidden -mt-[56px]">
        <div className="absolute inset-0 bg-zinc-900">
          <img
            src="https://images.unsplash.com/photo-1667831617890-458ca443d799?w=1200&h=1000&fit=crop&auto=format"
            alt="Ahmedabad Navratri crowd"
            className="w-full h-full object-cover"
            style={{ opacity: 0.6 }}
          />
        </div>
        <div className="hero-overlay absolute inset-0" />

        <div
          className="relative z-10 px-4 pb-8 pt-24"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(20px)',
            transition: 'all 0.6s ease',
          }}
        >
          <div
            className="font-display font-black text-white leading-none mb-4"
            style={{ fontSize: 'clamp(52px, 14vw, 88px)', letterSpacing: '-0.02em' }}
          >
            AHMEDABAD&apos;S<br />
            NAVRATRI<br />
            <span style={{ color: '#FF5500' }}>STARTS HERE.</span>
          </div>

          <p className="text-white/60 mb-6 max-w-xs" style={{ fontSize: 16, lineHeight: 1.5 }}>
            You tell us what you want.<br />We find the scene.
          </p>

          <div className="flex flex-col gap-3 max-w-xs">
            <button
              onClick={() => navigate('find-jugaad')}
              className="btn-primary py-4 text-lg w-full"
            >
              FIND YOUR JUGAAD →
            </button>
            <button
              onClick={() => navigate('organisers')}
              className="btn-outline py-3.5 text-base w-full"
            >
              {"I'M AN ORGANISER →"}
            </button>
          </div>

          <p className="mt-5 text-white/35 text-xs tracking-wide">
            {"Ahmedabad's Navratri demand & event discovery board."}
          </p>
        </div>

        {/* STATS */}
        <div
          className="relative z-10 flex border-t border-white/10"
          style={{ background: 'rgba(8,8,8,0.8)', backdropFilter: 'blur(12px)' }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="flex-1 text-center py-4"
              style={{ borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}
            >
              <div className="font-display font-black text-white" style={{ fontSize: 28 }}>
                {s.value}
              </div>
              <div className="font-display font-semibold text-white/40 tracking-widest" style={{ fontSize: 10 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WHAT IS PASS NO JUGAAD */}
      <div className="px-4 py-10">
        <h2 className="font-display font-black leading-none mb-6" style={{ fontSize: 'clamp(36px, 10vw, 56px)', letterSpacing: '-0.02em' }}>
          WHAT IS<br /><span style={{ color: '#FF5500' }}>PASS NO JUGAAD?</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* For People */}
          <div
            className="rounded-lg p-5"
            style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="font-display font-bold text-xs tracking-widest text-white/40 mb-3">FOR PEOPLE</div>
            <div className="font-display font-black text-lg mb-3" style={{ color: '#FF5500' }}>
              {"Can't find the pass you want?"}
            </div>
            <p className="text-white/60 text-sm mb-4" style={{ lineHeight: 1.6 }}>
              Tell us your date, budget, location, vibe, artist preference and quantity. {"We'll"} track the demand and connect you with relevant options when available.
            </p>
            <button onClick={() => navigate('find-jugaad')} className="btn-primary py-2.5 px-4 text-sm w-full">
              FIND YOUR JUGAAD →
            </button>
          </div>

          {/* For Organisers */}
          <div
            className="rounded-lg p-5"
            style={{ background: '#111', border: '1px solid rgba(255,85,0,0.15)' }}
          >
            <div className="font-display font-bold text-xs tracking-widest text-white/40 mb-3">FOR ORGANISERS</div>
            <div className="font-display font-black text-lg mb-3 text-white">
              Have an event?
            </div>
            <p className="text-white/60 text-sm mb-4" style={{ lineHeight: 1.6 }}>
              Tell us what {"you're"} hosting and what you need. We help you understand demand and connect your event with the right audience.
            </p>
            <button onClick={() => navigate('organisers')} className="btn-outline py-2.5 px-4 text-sm w-full">
              LIST YOUR EVENT →
            </button>
          </div>
        </div>

        {/* Steps */}
        <div
          className="rounded-lg p-5"
          style={{ background: 'rgba(255,85,0,0.06)', border: '1px solid rgba(255,85,0,0.15)' }}
        >
          <div className="font-display font-black text-center mb-5" style={{ fontSize: 20, letterSpacing: '0.02em' }}>
            THE JUGAAD IS SIMPLE.
          </div>
          <div className="space-y-4">
            {steps.map((s) => (
              <div key={s.num} className="flex items-start gap-4">
                <div className="font-display font-black text-2xl leading-none" style={{ color: '#FF5500', minWidth: 36 }}>
                  {s.num}
                </div>
                <div>
                  <div className="font-display font-bold tracking-wide text-white text-sm">{s.label}</div>
                  <div className="text-white/50 text-xs mt-0.5">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURED EVENTS */}
      <div className="px-4 pb-10">
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display font-black leading-none" style={{ fontSize: 'clamp(28px, 8vw, 44px)', letterSpacing: '-0.02em' }}>
            FEATURED<br />EVENTS
          </h2>
          <button onClick={() => navigate('events')} className="text-xs font-display font-bold tracking-wide" style={{ color: '#FF5500' }}>
            VIEW ALL →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredEvents.map((e) => (
            <EventCard key={e.id} event={e} navigate={navigate} currentPage="home" />
          ))}
        </div>
      </div>

      {/* RADAR TEASER */}
      <div className="px-4 pb-10">
        <div
          className="rounded-lg p-6 relative overflow-hidden"
          style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="absolute -right-8 -top-8 opacity-5">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#FF5500" strokeWidth="1" />
              <circle cx="100" cy="100" r="55" fill="none" stroke="#FF5500" strokeWidth="1" />
              <circle cx="100" cy="100" r="30" fill="none" stroke="#FF5500" strokeWidth="1" />
            </svg>
          </div>

          <div className="font-display font-bold text-xs tracking-widest mb-2" style={{ color: '#FF5500' }}>
            NAVRATRI RADAR
          </div>
          <h3 className="font-display font-black leading-tight mb-2" style={{ fontSize: 28 }}>
            WHAT AHMEDABAD<br />IS LOOKING FOR.
          </h3>
          <p className="text-white/50 text-sm mb-4">Real demand. Real people. Real Ahmedabad.</p>

          <div className="flex gap-3 mb-5">
            {[
              { label: '12 OCT', value: '212', sub: 'PEOPLE LOOKING' },
              { label: '15 OCT', value: '318', sub: 'PEOPLE LOOKING' },
              { label: '19 OCT', value: '445', sub: 'PEOPLE LOOKING' },
            ].map((d) => (
              <div
                key={d.label}
                className="flex-1 text-center rounded-md py-3"
                style={{ background: 'rgba(255,85,0,0.08)', border: '1px solid rgba(255,85,0,0.15)' }}
              >
                <div className="font-display font-bold text-white/50 text-xs">{d.label}</div>
                <div className="font-display font-black text-white text-2xl">{d.value}</div>
                <div className="font-display font-semibold text-white/30 text-[9px] tracking-widest">{d.sub}</div>
              </div>
            ))}
          </div>

          <button onClick={() => navigate('radar')} className="btn-primary w-full py-3">
            VIEW NAVRATRI RADAR →
          </button>
        </div>
      </div>

      {/* JUGAAD DROPS TEASER */}
      <div className="px-4 pb-10">
        <div
          className="rounded-lg overflow-hidden relative"
          style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="p-5">
            <div className="font-display font-bold text-xs tracking-widest mb-2 text-yellow-400">⚡ JUGAAD DROPS</div>
            <h3 className="font-display font-black leading-tight mb-1" style={{ fontSize: 28 }}>
              WHEN SOMETHING<br />GOOD LANDS,
            </h3>
            <h3 className="font-display font-black leading-tight mb-3" style={{ fontSize: 28, color: '#FF5500' }}>
              {"YOU'LL KNOW."}
            </h3>
            <p className="text-white/50 text-sm mb-4">
              Organiser-approved deals, allocations and exclusive offers. Pass No Jugaad exclusive.
            </p>
            <button onClick={() => navigate('drops')} className="btn-primary w-full py-3">
              SEE JUGAAD DROPS ⚡
            </button>
          </div>
        </div>
      </div>

      {/* SOCIAL CTA */}
      <div className="px-4 pb-20">
        <div className="text-center">
          <div className="font-display font-black text-white/20 text-sm tracking-widest mb-4">STAY IN THE LOOP</div>
          <div className="flex gap-3 justify-center">
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2 px-5 py-3 text-sm"
            >
              JOIN WHATSAPP UPDATES
            </a>
            <a
              href="https://instagram.com/pass_no_jugaad"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline flex items-center gap-2 px-5 py-3 text-sm"
            >
              INSTAGRAM
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
