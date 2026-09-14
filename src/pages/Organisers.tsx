import { type NavProps } from '../data/events';

const BENEFITS = [
  { num: '01', title: 'REAL DEMAND', desc: 'Understand what people are actively looking for across dates, budgets and vibes.' },
  { num: '02', title: 'RIGHT AUDIENCE', desc: 'Reach people based on date, budget, location and vibe preference.' },
  { num: '03', title: 'EVENT DISTRIBUTION', desc: 'Get your event discovered by relevant audiences who are ready to buy.' },
  { num: '04', title: 'DEAL OPPORTUNITIES', desc: 'Explore authorised offers, referral arrangements and special drops.' },
];

const DEMO_METRICS = [
  { label: '12 OCT', value: '212', sub: 'REQUESTS' },
  { label: 'TOP BUDGET', value: '₹1K–₹2.5K', sub: 'PER PERSON' },
  { label: 'GROUP SIZE', value: '2–4', sub: 'PASSES' },
  { label: 'TOP VIBE', value: 'Artist Night', sub: 'CATEGORY' },
];

export default function Organisers({ navigate }: NavProps) {
  return (
    <div className="pb-24">
      {/* Hero */}
      <div
        className="relative min-h-[50vh] flex flex-col justify-end px-4 pt-16 pb-8"
        style={{
          background: 'linear-gradient(160deg, #0f0808 0%, #180a00 50%, #080808 100%)',
        }}
      >
        <div className="absolute inset-0 overflow-hidden opacity-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border"
              style={{
                width: 300 + i * 150,
                height: 300 + i * 150,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                borderColor: '#FF5500',
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="font-display font-bold text-xs tracking-widest mb-3" style={{ color: '#FF5500' }}>FOR ORGANISERS</div>
          <h1 className="font-display font-black leading-none mb-3" style={{ fontSize: 'clamp(44px, 12vw, 80px)', letterSpacing: '-0.02em' }}>
            YOU BRING<br />THE BEATS.
          </h1>
          <h1 className="font-display font-black leading-none mb-5 text-white/30" style={{ fontSize: 'clamp(44px, 12vw, 80px)', letterSpacing: '-0.02em' }}>
            WE BRING<br />THE PEOPLE.
          </h1>
          <p className="text-white/50 text-sm max-w-sm" style={{ lineHeight: 1.6 }}>
            Tell us about your event and {"we'll"} explore how Pass No Jugaad can help you reach the right audience.
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="px-4 py-8">
        <div className="space-y-4 mb-8">
          {BENEFITS.map((b) => (
            <div
              key={b.num}
              className="rounded-lg p-5 flex items-start gap-4"
              style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="font-display font-black text-3xl leading-none" style={{ color: '#FF5500', minWidth: 40 }}>{b.num}</div>
              <div>
                <div className="font-display font-black text-white mb-1" style={{ fontSize: 16, letterSpacing: '0.01em' }}>{b.title}</div>
                <div className="text-white/50 text-sm" style={{ lineHeight: 1.5 }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="space-y-3 mb-10">
          <button onClick={() => navigate('organiser-form')} className="btn-primary w-full py-4 text-lg">
            LIST YOUR EVENT →
          </button>
          <a
            href="https://instagram.com/pass_no_jugaad"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline w-full py-3.5 flex items-center justify-center gap-2 text-sm font-display font-bold tracking-wide"
          >
            TALK TO US ON INSTAGRAM →
          </a>
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline w-full py-3.5 flex items-center justify-center gap-2 text-sm font-display font-bold tracking-wide"
          >
            WHATSAPP US →
          </a>
        </div>
      </div>

      {/* Demand intelligence */}
      <div className="px-4 pb-8">
        <div className="rounded-lg p-5" style={{ background: '#0d0d0d', border: '1px solid rgba(255,85,0,0.15)' }}>
          <div className="font-display font-bold text-xs tracking-widest mb-1" style={{ color: '#FF5500' }}>COMMUNITY DEMAND SIGNALS</div>
          <h2 className="font-display font-black mb-4 leading-tight" style={{ fontSize: 24 }}>
            NAVRATRI DEMAND<br />INTELLIGENCE
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-3">
            {DEMO_METRICS.map((m) => (
              <div
                key={m.label}
                className="rounded-md p-3"
                style={{ background: 'rgba(255,85,0,0.06)', border: '1px solid rgba(255,85,0,0.12)' }}
              >
                <div className="font-display font-bold text-white/30 text-[10px] tracking-widest mb-1">{m.label}</div>
                <div className="font-display font-black text-white" style={{ fontSize: 18 }}>{m.value}</div>
                <div className="font-display font-semibold text-white/25 text-[9px] tracking-widest">{m.sub}</div>
              </div>
            ))}
          </div>

          <p className="text-white/20 text-[10px]">* Demo data. Real insights for listed organisers.</p>
        </div>
      </div>
    </div>
  );
}
