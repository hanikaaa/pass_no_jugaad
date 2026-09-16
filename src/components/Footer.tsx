import { type NavProps, type Page } from '../data/events';
import logoSrc from '@/imports/garba_no_pass_taaro__6_-1.png';

const LINKS: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Radar', page: 'radar' },
  { label: 'Events', page: 'events' },
  { label: 'Calendar', page: 'calendar' },
  { label: 'Jugaad Drops', page: 'drops' },
  { label: 'Organisers', page: 'organisers' },
  { label: 'Contact', page: 'contact' },
];

export default function Footer({ navigate }: NavProps) {
  return (
    <footer style={{ background: '#F0E8DC', borderTop: '1px solid rgba(26,22,18,0.1)', padding: '40px 20px 32px' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 mb-8">
          <div>
            <img
              src={logoSrc}
              alt="Pass No Jugaad"
              style={{ width: 130, height: 'auto', mixBlendMode: 'multiply', display: 'block' }}
            />
            <p style={{ marginTop: 12, fontSize: 13, color: '#6B5B52', lineHeight: 1.6, maxWidth: 260 }}>
              {"Ahmedabad's Navratri event discovery and demand platform."}
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {LINKS.map(({ label, page }) => (
              <button
                key={page}
                onClick={() => navigate(page)}
                style={{ fontSize: 13, color: '#6B5B52', transition: 'color 0.15s', fontWeight: 500 }}
                className="hover:text-[#1A1612]"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ borderTop: '1px solid rgba(26,22,18,0.1)', paddingTop: 20 }}>
          <p style={{ fontSize: 11, color: '#9A8B82', lineHeight: 1.6, maxWidth: 480 }}>
            Pass No Jugaad is an independent discovery and community platform. Not an official ticketing partner unless explicitly stated.
          </p>
          <div className="flex gap-3">
            <a href="https://www.instagram.com/pass_no_jugaad_?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded"
              style={{ border: '1.5px solid rgba(26,22,18,0.18)', color: '#6B5B52', transition: 'all 0.15s' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </a>
            <a href="mailto:passnojugaadd@gmail.com"
              className="w-8 h-8 flex items-center justify-center rounded"
              style={{ border: '1.5px solid rgba(26,22,18,0.18)', color: '#6B5B52', transition: 'all 0.15s' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
          </div>
        </div>
        <p style={{ fontSize: 11, color: '#9A8B82', marginTop: 12 }}>© 2026 Pass No Jugaad · Ahmedabad</p>
      </div>
    </footer>
  );
}
