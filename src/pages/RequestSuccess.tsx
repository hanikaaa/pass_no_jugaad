import { useEffect, useState } from 'react';
import { type NavProps } from '../data/events';

export default function RequestSuccess({ navigate }: NavProps) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-24 text-center">
      <div style={{ opacity: show ? 1 : 0, transform: show ? 'none' : 'translateY(30px)', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}>
          <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
            <polyline points="10,27 20,37 40,15" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="check-stroke" />
          </svg>
        </div>

        <div className="font-display font-bold text-xs tracking-widest mb-3" style={{ color: '#22c55e' }}>REQUEST SUBMITTED</div>
        <h1 className="font-display font-black leading-none mb-4" style={{ fontSize: 'clamp(36px, 10vw, 56px)', letterSpacing: '-0.02em' }}>
          {"WE'VE GOT IT. 👀"}
        </h1>
        <p className="text-white/50 text-sm mb-6 max-w-xs mx-auto" style={{ lineHeight: 1.6 }}>
          {"Your request is in. We'll review it and get back to you with options."}
        </p>

        <div
          className="rounded-lg p-4 mb-6 text-left max-w-xs mx-auto"
          style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="font-display font-bold text-xs tracking-widest text-white/30 mb-3">NEXT STEPS</div>
          {[
            "We review your request.",
            "If a match is found, we reach out on WhatsApp.",
            "You confirm and get your pass.",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 mb-2">
              <span className="font-display font-black text-orange-500 text-sm mt-0.5">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-white/60 text-sm">{step}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3 max-w-xs mx-auto w-full">
          <button onClick={() => navigate('events')} className="btn-primary w-full py-3.5">VIEW MORE EVENTS →</button>
          <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="btn-outline w-full py-3.5 flex items-center justify-center text-sm font-display font-bold tracking-wide">
            MESSAGE US ON WHATSAPP →
          </a>
        </div>
      </div>
    </div>
  );
}
