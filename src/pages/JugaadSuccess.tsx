import { useEffect, useState } from 'react';
import { type NavProps } from '../data/events';

export default function JugaadSuccess({ navigate }: NavProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-24 text-center">
      <div
        style={{
          opacity: show ? 1 : 0,
          transform: show ? 'none' : 'translateY(30px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Check animation */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,85,0,0.12)', border: '1px solid rgba(255,85,0,0.3)' }}>
          <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
            <polyline
              points="10,27 20,37 40,15"
              stroke="#FF5500"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="check-stroke"
            />
          </svg>
        </div>

        <h1 className="font-display font-black leading-none mb-2" style={{ fontSize: 'clamp(44px, 12vw, 72px)', letterSpacing: '-0.02em' }}>
          {"YOU'RE ON"}<br /><span style={{ color: '#FF5500' }}>THE RADAR. 🔥</span>
        </h1>

        {/* Summary */}
        <div
          className="my-6 rounded-lg p-4 text-left max-w-xs mx-auto"
          style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="font-display font-bold text-xs tracking-widest text-white/30 mb-3">YOUR REQUEST</div>
          <div className="space-y-2">
            {[
              { label: 'DATE', value: '12 OCT' },
              { label: 'PASSES', value: '2 PASSES' },
              { label: 'BUDGET', value: '₹1,000–₹1,500' },
              { label: 'VIBE', value: 'Artist Night' },
            ].map((r) => (
              <div key={r.label} className="flex justify-between">
                <span className="font-display font-bold text-xs tracking-wide text-white/30">{r.label}</span>
                <span className="font-display font-bold text-sm text-white">{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/50 text-sm mb-8 max-w-xs mx-auto" style={{ lineHeight: 1.6 }}>
          {"We've got your request. If something relevant becomes available, we'll get in touch."}
        </p>

        <div className="space-y-3 max-w-xs mx-auto w-full">
          <button onClick={() => navigate('events')} className="btn-primary w-full py-3.5">
            VIEW EVENTS →
          </button>
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline w-full py-3.5 flex items-center justify-center gap-2 text-sm font-display font-bold tracking-wide"
          >
            JOIN WHATSAPP UPDATES →
          </a>
          <a
            href="https://instagram.com/pass_no_jugaad"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline w-full py-3.5 flex items-center justify-center gap-2 text-sm font-display font-bold tracking-wide"
          >
            FOLLOW INSTAGRAM →
          </a>
        </div>
      </div>
    </div>
  );
}
