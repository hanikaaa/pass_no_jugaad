import { type NavProps } from '../data/events';

export default function About({ navigate }: NavProps) {
  return (
    <div className="px-4 py-6 pb-24">
      <div className="font-display font-bold text-xs tracking-widest mb-2" style={{ color: '#FF5500' }}>
        THE STORY
      </div>
      <h1 className="font-display font-black leading-none mb-8" style={{ fontSize: 'clamp(40px, 11vw, 64px)', letterSpacing: '-0.02em' }}>
        WHY<br /><span style={{ color: '#FF5500' }}>PASS NO JUGAAD?</span>
      </h1>

      <div
        className="rounded-lg p-6 mb-6"
        style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p className="text-white/70 mb-4" style={{ lineHeight: 1.8, fontSize: 16 }}>
          {"Ahmedabad doesn't just celebrate Navratri."}
        </p>
        <p className="text-white/70 mb-4" style={{ lineHeight: 1.8, fontSize: 16 }}>
          It lives it.
        </p>
        <p className="text-white/60" style={{ lineHeight: 1.8, fontSize: 15 }}>
          Pass No Jugaad exists to make finding the right night, the right crowd and the right pass a little easier. No jugaad, no stress.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {[
          { icon: '🎯', title: 'DEMAND-FIRST', desc: 'We start with what people want, not what organisers want to sell.' },
          { icon: '🤝', title: 'COMMUNITY-DRIVEN', desc: "Real Ahmedabad. Real people. Real demand. We're not a faceless platform." },
          { icon: '⚡', title: 'JUGAAD MINDSET', desc: "We find a way. That's the jugaad. That's always been Ahmedabad." },
        ].map((v) => (
          <div key={v.title} className="rounded-lg p-4 flex items-start gap-4" style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: 28 }}>{v.icon}</span>
            <div>
              <div className="font-display font-black text-white mb-1" style={{ fontSize: 16 }}>{v.title}</div>
              <div className="text-white/50 text-sm" style={{ lineHeight: 1.5 }}>{v.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-white/25 text-xs mb-4" style={{ lineHeight: 1.6 }}>
          Pass No Jugaad is an independent discovery and community platform. It is not an official ticketing partner unless explicitly stated for a specific event.
        </p>
        <button onClick={() => navigate('find-jugaad')} className="btn-primary px-8 py-3.5">
          FIND YOUR JUGAAD →
        </button>
      </div>
    </div>
  );
}
