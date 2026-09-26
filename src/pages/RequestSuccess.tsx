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

        <div className="eyebrow mb-2" style={{ color: '#2D7A4F' }}>✓ Request Confirmed</div>
        <h1 className="font-serif leading-tight mb-3" style={{ fontSize: 'clamp(32px, 8vw, 44px)', fontWeight: 600 }}>
          Your request is sent!
        </h1>
        <p className="text-sm text-stone-600 font-medium mb-6 max-w-sm mx-auto leading-relaxed">
          You will hear from us soon! Our team is actively matching your request with genuine organiser allocations.
        </p>

        <div className="card-light p-5 mb-6 text-left max-w-xs mx-auto">
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9A8B82', marginBottom: 12 }}>Next steps</div>
          {[
            'We review your request details.',
            'Once verified, you will receive pass confirmation & pick-up details.',
            'Track your live status in your Buyer Dashboard anytime.',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 mb-2.5">
              <span className="font-serif flex-shrink-0" style={{ fontSize: 16, fontWeight: 600, color: '#C1440E', minWidth: 20 }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: 13, color: '#6B5B52', lineHeight: 1.5 }}>{step}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3 max-w-xs mx-auto w-full">
          <button onClick={() => navigate('my-requests')} className="btn-primary w-full py-3.5 text-sm font-bold">
            View My Requests (Dashboard) →
          </button>
          <button onClick={() => navigate('events')} className="btn-outline w-full py-3.5 text-sm font-semibold">
            Browse More Events
          </button>
        </div>
      </div>
    </div>
  );
}
