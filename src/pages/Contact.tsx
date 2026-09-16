import { type NavProps } from '../data/events';

export default function Contact({ navigate: _navigate }: NavProps) {
  return (
    <div className="px-5 py-6 pb-28" style={{ color: '#1A1612' }}>
      <div className="eyebrow mb-3">Get in touch</div>
      <h1 className="font-serif leading-tight mb-8" style={{ fontSize: 'clamp(40px, 11vw, 60px)', fontWeight: 500 }}>
        Talk<br /><span style={{ color: '#C1440E', fontStyle: 'italic' }}>to us.</span>
      </h1>

      <div className="space-y-3 mb-8">
        <a href="https://www.instagram.com/pass_no_jugaad_?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer"
          className="card-light flex items-center gap-4 p-4" style={{ color: 'inherit', textDecoration: 'none' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
              <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="white" />
            </svg>
          </div>
          <div className="flex-1">
            <div style={{ fontSize: 16, fontWeight: 600 }}>Instagram</div>
            <div style={{ fontSize: 13, color: '#9A8B82' }}>@pass_no_jugaad</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A8B82" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        </a>

        <a href="mailto:passnojugaadd@gmail.com"
          className="card-light flex items-center gap-4 p-4" style={{ color: 'inherit', textDecoration: 'none' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(193,68,14,0.1)', border: '1px solid rgba(193,68,14,0.2)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C1440E" strokeWidth="1.8">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div className="flex-1">
            <div style={{ fontSize: 16, fontWeight: 600 }}>Email</div>
            <div style={{ fontSize: 13, color: '#9A8B82' }}>hello@passnojugaad.com</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A8B82" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        </a>
      </div>

      <p style={{ fontSize: 12, color: '#9A8B82', lineHeight: 1.6, textAlign: 'center' }}>
        Pass No Jugaad is an independent discovery platform, not an official ticketing partner unless explicitly stated.
      </p>
    </div>
  );
}
