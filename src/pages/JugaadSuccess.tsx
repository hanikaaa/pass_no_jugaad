import { useEffect, useState } from 'react';
import { type NavProps } from '../data/events';

export default function JugaadSuccess({ navigate }: NavProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-24 text-center" style={{ color: '#1A1612' }}>
      <div
        style={{
          opacity: show ? 1 : 0,
          transform: show ? 'none' : 'translateY(28px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Check circle */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(193,68,14,0.1)', border: '1px solid rgba(193,68,14,0.25)' }}>
          <svg width="40" height="40" viewBox="0 0 50 50" fill="none">
            <polyline points="10,27 20,37 40,15" stroke="#C1440E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="check-stroke" />
          </svg>
        </div>

        <div className="eyebrow mb-3">Request submitted</div>
        <h1 className="font-serif leading-tight mb-4" style={{ fontSize: 'clamp(36px, 10vw, 56px)', fontWeight: 500 }}>
          {"You're on"}<br />
          <span style={{ color: '#C1440E', fontStyle: 'italic' }}>the Radar.</span>
        </h1>

        {/* Request summary */}
        <div className="card-light my-6 p-5 text-left max-w-xs mx-auto">
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9A8B82', marginBottom: 12 }}>Your request</div>
          <div className="space-y-2.5">
            {[
              { label: 'Date', value: '12 Oct' },
              { label: 'Passes', value: '2 passes' },
              { label: 'Budget', value: '₹1,000–₹1,500' },
              { label: 'Vibe', value: 'Artist Night' },
            ].map((r) => (
              <div key={r.label} className="flex justify-between">
                <span style={{ fontSize: 13, color: '#9A8B82' }}>{r.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1612' }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 14, color: '#6B5B52', lineHeight: 1.7, maxWidth: 300, margin: '0 auto 28px' }}>
          {"We've got your request. If something relevant becomes available, we'll get in touch."}
        </p>

        <div className="space-y-3 max-w-xs mx-auto w-full">
          <button onClick={() => navigate('events')} className="btn-primary w-full py-3.5">
            Browse events →
          </button>
          <a
            href="https://www.instagram.com/pass_no_jugaad_?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline w-full py-3.5 flex items-center justify-center gap-2 text-sm"
          >
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
