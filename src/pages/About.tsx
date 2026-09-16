import { type NavProps } from '../data/events';

export default function About({ navigate }: NavProps) {
  return (
    <div className="px-5 py-6 pb-28" style={{ color: '#1A1612' }}>
      <div className="eyebrow mb-3">The story</div>
      <h1 className="font-serif leading-tight mb-8" style={{ fontSize: 'clamp(36px, 10vw, 56px)', fontWeight: 500 }}>
        Why<br /><span style={{ color: '#C1440E', fontStyle: 'italic' }}>Pass No Jugaad?</span>
      </h1>

      <div className="card-light p-6 mb-6">
        <p style={{ fontSize: 16, lineHeight: 1.85, color: '#1A1612', marginBottom: 16 }}>{"Ahmedabad doesn't just celebrate Navratri."}</p>
        <p style={{ fontSize: 16, lineHeight: 1.85, color: '#1A1612', marginBottom: 16 }}>{"It lives it."}</p>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#6B5B52' }}>
          Pass No Jugaad exists to make finding the right night, the right crowd and the right pass a little easier. No jugaad, no stress.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {[
          { icon: '🎯', title: 'Demand-first', desc: 'We start with what people want, not what organisers want to sell.' },
          { icon: '🤝', title: 'Community-driven', desc: "Real Ahmedabad. Real people. Real demand. We're not a faceless platform." },
          { icon: '⚡', title: 'Jugaad mindset', desc: "We find a way. That's the jugaad. That's always been Ahmedabad." },
        ].map((v) => (
          <div key={v.title} className="card-light p-4 flex items-start gap-4">
            <span style={{ fontSize: 28, flexShrink: 0 }}>{v.icon}</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#1A1612', marginBottom: 4 }}>{v.title}</div>
              <div style={{ fontSize: 14, color: '#6B5B52', lineHeight: 1.6 }}>{v.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p style={{ fontSize: 12, color: '#9A8B82', lineHeight: 1.6, marginBottom: 20 }}>
          Pass No Jugaad is an independent discovery and community platform. It is not an official ticketing partner unless explicitly stated for a specific event.
        </p>
        <button onClick={() => navigate('find-jugaad')} className="btn-primary px-8 py-3.5">Find Your Jugaad →</button>
      </div>
    </div>
  );
}
