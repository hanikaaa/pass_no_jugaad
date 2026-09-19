import { useState, useEffect } from 'react';
import { type NavProps, EVENTS, type Event } from '../data/events';
import { getApprovedEvents, getAllSignals } from '../lib/api';
import EventCard from '../components/EventCard';
import heroSrc from '@/assets/hero.png';

export default function Home({ navigate }: NavProps) {
  const [visible, setVisible] = useState(false);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [radarStats, setRadarStats] = useState<{ label: string; value: number }[]>([
    { label: '12 Oct', value: 0 },
    { label: '15 Oct', value: 0 },
    { label: '19 Oct', value: 0 },
  ]);
  const [stats, setStats] = useState({ nights: '10', events: '0', seekers: '0' });

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);

    Promise.all([getApprovedEvents(), getAllSignals()]).then(([dbEvents, dbSignals]) => {
      const evts = dbEvents || [];
      const sigs = dbSignals || [];

      if (evts.length > 0) {
        const mapped: Event[] = evts.slice(0, 3).map((e, idx) => ({
          id: e.id,
          name: e.name,
          date: e.date || '12 OCT 2026',
          dateShort: e.date ? e.date.replace(' 2026', '') : '12 OCT',
          venue: e.venue || 'Ahmedabad',
          location: e.venue || 'Ahmedabad',
          time: e.time || '7:00 PM onwards',
          priceRange: e.price_min ? `₹${e.price_min}–₹${e.price_max}` : '₹800–₹1,500',
          priceMin: e.price_min || 800,
          priceMax: e.price_max || 1500,
          type: e.type_tags || ['Garba'],
          demand: idx === 0 ? 'VERY HIGH' : 'HIGH',
          availability: 'Available',
          image: 'https://images.unsplash.com/photo-1786452156548-9a60189a9876?w=800&h=500&fit=crop&auto=format',
          artist: e.artist || undefined,
          description: e.description || '',
          featured: true,
        }));
        setFeaturedEvents(mapped);
      }

      // Calculate real total seekers
      const totalSeekers = sigs.reduce((acc, s) => acc + (s.num_passes || 1), 0);
      setStats({
        nights: '10',
        events: evts.length > 0 ? `${evts.length}+` : '0',
        seekers: totalSeekers > 0 ? (totalSeekers >= 1000 ? `${(totalSeekers / 1000).toFixed(1)}k` : `${totalSeekers}`) : '0',
      });

      // Calculate real date counts for radar
      const dateMap: Record<string, number> = {
        '12 Oct': 0,
        '15 Oct': 0,
        '19 Oct': 0,
      };

      sigs.forEach((s) => {
        (s.preferred_dates || []).forEach((pd) => {
          Object.keys(dateMap).forEach((k) => {
            if (pd.toLowerCase().includes(k.toLowerCase().split(' ')[0])) {
              dateMap[k] += s.num_passes || 1;
            }
          });
        });
      });

      setRadarStats([
        { label: '12 Oct', value: dateMap['12 Oct'] },
        { label: '15 Oct', value: dateMap['15 Oct'] },
        { label: '19 Oct', value: dateMap['19 Oct'] },
      ]);
    });

    return () => clearTimeout(t);
  }, []);


  return (
    <div style={{ color: '#1A1612' }}>
      {/* HERO */}
      <div className="relative overflow-hidden -mt-[60px]" style={{ minHeight: '92vh' }}>
        <div className="absolute inset-0 bg-stone-950">
          <img
            src={heroSrc || '/hero.png'}
            alt="Ahmedabad Navratri celebration"
            className="w-full h-full object-cover"
            style={{ opacity: 0.9 }}
          />
        </div>
        <div className="hero-overlay absolute inset-0" />


        <div
          className="relative z-10 flex flex-col justify-end px-5 pb-10 pt-[120px]"
          style={{
            minHeight: '92vh',
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(24px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="eyebrow mb-4" style={{ color: 'rgba(250,247,242,0.75)' }}>
            Ahmedabad's Event & Jugaad Radar
          </div>

          <h1
            className="font-serif leading-[1.05] mb-5"
            style={{ fontSize: 'clamp(42px, 11vw, 80px)', fontWeight: 500, color: '#FAF7F2', fontStyle: 'italic' }}
          >
            Looking for a night<br />worth showing up for?
          </h1>

          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(250,247,242,0.7)', maxWidth: 380, marginBottom: 28 }}>
            Discover Navratri events, tell us what {"you're"} looking for, and find the right jugaad.
          </p>

          <div className="flex flex-col gap-3 max-w-sm">
            <button onClick={() => navigate('find-jugaad')} className="btn-primary py-4" style={{ fontSize: 16 }}>
              Find Your Jugaad →
            </button>
            <button onClick={() => navigate('organisers')} className="py-3.5" style={{ color: '#FAF7F2', borderColor: 'rgba(250,247,242,0.75)', border: '1.5px solid rgba(250,247,242,0.75)', borderRadius: 6, fontWeight: 600, fontSize: 15, background: 'rgba(250,247,242,0.12)', backdropFilter: 'blur(4px)', cursor: 'pointer', transition: 'all 0.2s' }}>
              {"I'm an Organiser →"}
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div
          className="relative z-10 flex"
          style={{ background: 'rgba(26,22,18,0.75)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(250,247,242,0.08)' }}
        >
          {[
            { value: stats.nights, label: 'Nights' },
            { value: stats.events, label: 'Events' },
            { value: stats.seekers, label: 'Jugaad seekers' }
          ].map((s, i, arr) => (
            <div
              key={s.label}
              className="flex-1 text-center py-4"
              style={{ borderRight: i < arr.length - 1 ? '1px solid rgba(250,247,242,0.08)' : 'none' }}
            >
              <div className="font-serif" style={{ fontSize: 26, fontWeight: 500, color: '#FAF7F2' }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(250,247,242,0.45)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* WHAT IS PASS NO JUGAAD */}
      <div className="px-5 py-12" style={{ background: '#FAF7F2' }}>
        <div className="eyebrow mb-3">What is Pass No Jugaad?</div>
        <h2 className="font-serif mb-3 leading-tight" style={{ fontSize: 'clamp(32px, 9vw, 52px)', fontWeight: 500 }}>
          Not a ticketing site.<br />
          <span style={{ color: '#C1440E', fontStyle: 'italic' }}>A demand platform.</span>
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#6B5B52', maxWidth: 480, marginBottom: 32 }}>
          {"Can't"} find the right pass? Tell us what you want and {"we'll"} find it. {"You're"} not browsing — {"you're"} being found.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* For people */}
          <div className="card-light p-5">
            <div className="eyebrow mb-3">For people</div>
            <h3 className="font-serif mb-2" style={{ fontSize: 20, fontWeight: 500, color: '#1A1612' }}>
              {"Can't find the pass you want?"}
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: '#6B5B52', marginBottom: 16 }}>
              Tell us your date, budget, vibe and quantity. {"We'll"} track demand and connect you when something relevant comes up.
            </p>
            <button onClick={() => navigate('find-jugaad')} className="btn-primary w-full py-3 text-sm">
              Find Your Jugaad →
            </button>
          </div>

          {/* For organisers */}
          <div className="card-light p-5" style={{ borderColor: 'rgba(193,68,14,0.2)' }}>
            <div className="eyebrow mb-3">For organisers</div>
            <h3 className="font-serif mb-2" style={{ fontSize: 20, fontWeight: 500, color: '#1A1612' }}>
              Have an event?
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: '#6B5B52', marginBottom: 16 }}>
              Get your event in front of people already looking. We help you understand demand and reach the right audience.
            </p>
            <button onClick={() => navigate('organisers')} className="btn-outline w-full py-3 text-sm">
              List Your Event →
            </button>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="px-5 py-10" style={{ background: '#F0E8DC' }}>
        <div className="eyebrow mb-3">The Jugaad is simple</div>
        <h2 className="font-serif mb-8 leading-tight" style={{ fontSize: 'clamp(28px, 8vw, 40px)', fontWeight: 500 }}>
          Three steps.
        </h2>
        <div className="space-y-6">
          {[
            { n: '01', t: 'You tell us', d: 'Your date, budget, vibe and how many passes you need.' },
            { n: '02', t: 'We track demand', d: "We aggregate what people are looking for across Ahmedabad's Navratri." },
            { n: '03', t: 'We connect you', d: 'When something relevant is available, you hear it first.' },
          ].map((s) => (
            <div key={s.n} className="flex items-start gap-5">
              <div className="font-serif flex-shrink-0" style={{ fontSize: 32, fontWeight: 300, color: '#C1440E', lineHeight: 1, minWidth: 40 }}>{s.n}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#1A1612', marginBottom: 4 }}>{s.t}</div>
                <div style={{ fontSize: 14, lineHeight: 1.65, color: '#6B5B52' }}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED EVENTS */}
      <div className="px-5 py-12" style={{ background: '#FAF7F2' }}>
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="eyebrow mb-2">Featured this Navratri</div>
            <h2 className="font-serif leading-tight" style={{ fontSize: 'clamp(26px, 7vw, 38px)', fontWeight: 500 }}>
              Events worth seeing.
            </h2>
          </div>
          <button onClick={() => navigate('events')} className="btn-ghost text-sm flex-shrink-0">
            View all →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredEvents.map((e) => (
            <EventCard key={e.id} event={e} navigate={navigate} currentPage="home" />
          ))}
          {featuredEvents.length === 0 && (
            <div className="col-span-full card-light p-8 text-center">
              <div className="text-3xl mb-2">🎪</div>
              <div className="font-serif text-lg font-semibold text-stone-800 mb-1">New Events Launching Soon</div>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
                Organisers are submitting passes for Navratri 2026. Submit what you need on Radar to get notified first!
              </p>
              <button onClick={() => navigate('find-jugaad')} className="btn-primary py-2 px-5 text-xs font-semibold">
                Submit Your Jugaad Request →
              </button>
            </div>
          )}
        </div>

      </div>

      {/* RADAR TEASER */}
      <div className="px-5 py-10" style={{ background: '#F0E8DC' }}>
        <div className="eyebrow mb-3">Navratri Radar</div>
        <h2 className="font-serif mb-2 leading-tight" style={{ fontSize: 'clamp(26px, 7vw, 38px)', fontWeight: 500 }}>
          What Ahmedabad is looking for.
        </h2>
        <p style={{ fontSize: 14, color: '#6B5B52', lineHeight: 1.65, marginBottom: 20 }}>
          Real demand. Real people. Real Ahmedabad.
        </p>

        <div className="flex gap-3 mb-5">
          {radarStats.map((d) => (
            <div
              key={d.label}
              className="flex-1 text-center rounded-lg py-4 card-light"
            >
              <div style={{ fontSize: 12, color: '#9A8B82', fontWeight: 500, marginBottom: 4 }}>{d.label}</div>
              <div className="font-serif" style={{ fontSize: 28, fontWeight: 500, color: '#1A1612' }}>{d.value}</div>
              <div style={{ fontSize: 10, color: '#9A8B82', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>looking</div>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('radar')} className="btn-primary w-full py-3.5">
          View Navratri Radar →
        </button>
      </div>

      {/* JUGAAD DROPS TEASER */}
      <div className="px-5 py-10" style={{ background: '#FAF7F2' }}>
        <div className="card-light overflow-hidden">
          <div className="relative h-[200px] bg-stone-200 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1504680177321-2e6a879aac86?w=800&h=400&fit=crop&auto=format"
              alt="Jugaad Drops"
              className="w-full h-full object-cover"
              style={{ opacity: 0.75 }}
            />
            <div className="absolute inset-0 flex items-end p-5" style={{ background: 'linear-gradient(to top, rgba(26,22,18,0.7) 0%, transparent 60%)' }}>
              <div>
                <div className="eyebrow mb-1" style={{ color: 'rgba(250,247,242,0.8)' }}>Jugaad Drops</div>
                <div className="font-serif" style={{ fontSize: 24, fontWeight: 500, color: '#FAF7F2' }}>
                  When something good lands, {"you'll"} know.
                </div>
              </div>
            </div>
          </div>
          <div className="p-5">
            <p style={{ fontSize: 14, lineHeight: 1.65, color: '#6B5B52', marginBottom: 16 }}>
              Organiser-approved deals, allocations and exclusive offers. Pass No Jugaad exclusive.
            </p>
            <button onClick={() => navigate('drops')} className="btn-primary w-full py-3">
              See Jugaad Drops →
            </button>
          </div>
        </div>
      </div>

      {/* SOCIAL CTA */}
      <div className="px-5 pb-24 py-10" style={{ background: '#F0E8DC', borderTop: '1px solid rgba(26,22,18,0.07)' }}>
        <div className="text-center">
          <div className="eyebrow mb-3">Stay in the loop</div>
          <h2 className="font-serif mb-4" style={{ fontSize: 24, fontWeight: 500 }}>Follow for updates.</h2>
          <div className="flex gap-3 justify-center">
            <a
              href="https://www.instagram.com/pass_no_jugaad_?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2 px-6 py-3 text-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              Instagram
            </a>
            <a
              href="mailto:passnojugaadd@gmail.com"
              className="btn-outline flex items-center gap-2 px-6 py-3 text-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
              </svg>
              Email us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
