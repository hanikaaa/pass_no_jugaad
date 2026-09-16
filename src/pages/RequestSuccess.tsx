import { useEffect, useState } from 'react';
import { type NavProps } from '../data/events';

export default function RequestSuccess({ navigate }: NavProps) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-24 text-center" style={{ color: '#1A1612' }}>
      <div style={{ opacity: show ? 1 : 0, transform: show ? 'none' : 'translateY(28px)', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(45,122,79,0.1)', border: '1px solid rgba(45,122,79,0.25)' }}>
          <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
            <polyline points="10,27 20,37 40,15" stroke="#2D7A4F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="check-stroke" />
          </svg>
        </div>

        <div className="eyebrow mb-3" style={{ color: '#2D7A4F' }}>Request submitted</div>
        <h1 className="font-serif leading-tight mb-4" style={{ fontSize: 'clamp(32px, 9vw, 48px)', fontWeight: 500 }}>
          {"We've got it."}
        </h1>
        <p style={{ fontSize: 14, color: '#6B5B52', lineHeight: 1.7, maxWidth: 300, margin: '0 auto 24px' }}>
          {"Your request is in. We'll review it and get back to you with options."}
        </p>

        <div className="card-light p-5 mb-6 text-left max-w-xs mx-auto">
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9A8B82', marginBottom: 12 }}>Next steps</div>
          {[
            'We review your request.',
            "If a match is found, we reach out to you.",
            'You confirm and get your pass.',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 mb-2.5">
              <span className="font-serif flex-shrink-0" style={{ fontSize: 16, fontWeight: 500, color: '#C1440E', minWidth: 20 }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: 14, color: '#6B5B52', lineHeight: 1.55 }}>{step}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3 max-w-xs mx-auto w-full">
          <button onClick={() => navigate('events')} className="btn-primary w-full py-3.5">Browse more events →</button>
          <a href="https://www.instagram.com/pass_no_jugaad_?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="btn-outline w-full py-3.5 flex items-center justify-center gap-2 text-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
            Follow on Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
