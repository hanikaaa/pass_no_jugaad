import { type NavProps, type Page } from '../data/events';
import LogoImage from './LogoImage';

interface Props extends NavProps {
  onClose: () => void;
  profile?: { name: string | null; email: string; role: string } | null;
  onSignOut?: () => void;
}

const links: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Navratri Radar', page: 'radar' },
  { label: 'Events', page: 'events' },
  { label: 'Calendar', page: 'calendar' },
  { label: 'Jugaad Drops', page: 'drops' },
  { label: 'For Organisers', page: 'organisers' },
  { label: 'About', page: 'about' },
  { label: 'Contact', page: 'contact' },
];

export default function HamburgerMenu({ navigate, currentPage, onClose, profile, onSignOut }: Props) {
  const go = (page: Page) => { navigate(page); onClose(); };

  const roleLabel = profile?.role === 'super_admin' ? 'Super Admin'
    : profile?.role === 'organiser' ? 'Organiser'
    : 'Buyer';

  return (
    <>
      <div className="fixed inset-0 z-50" style={{ background: 'rgba(26,22,18,0.35)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col w-[300px] animate-slide-right"
        style={{ background: '#FAF7F2', borderLeft: '1px solid rgba(26,22,18,0.08)' }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(26,22,18,0.07)' }}>
          <LogoImage width={100} />
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded"
            style={{ border: '1.5px solid rgba(26,22,18,0.15)', color: '#6B5B52', fontSize: 16 }}
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-4">
          {/* Admin / Organiser special shortcuts — strictly for authorized roles */}
          {profile?.role === 'super_admin' && (
            <div className="mb-3 space-y-1.5">
              <button
                onClick={() => go('admin-dashboard')}
                className="w-full text-left py-2.5 px-3 rounded-lg flex items-center justify-between transition-all"
                style={{
                  background: currentPage === 'admin-dashboard' ? 'rgba(122,31,46,0.15)' : 'rgba(122,31,46,0.06)',
                  border: '1px solid rgba(122,31,46,0.2)',
                  color: '#7A1F2E',
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                <span className="flex items-center gap-2">
                  <span>👑</span> Super Admin Dashboard
                </span>
                <span className="text-xs">→</span>
              </button>
            </div>
          )}

          {(profile?.role === 'organiser' || profile?.role === 'super_admin') && (
            <div className="mb-3 space-y-1.5">
              <button
                onClick={() => go('organiser-dashboard')}
                className="w-full text-left py-2.5 px-3 rounded-lg flex items-center justify-between transition-all"
                style={{
                  background: currentPage === 'organiser-dashboard' ? 'rgba(193,68,14,0.12)' : 'rgba(193,68,14,0.05)',
                  border: '1px solid rgba(193,68,14,0.15)',
                  color: '#C1440E',
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                <span className="flex items-center gap-2">
                  <span>🎪</span> Organiser Hub
                </span>
                <span className="text-xs">→</span>
              </button>
            </div>
          )}

          {(profile?.role === 'super_admin' || profile?.role === 'organiser') && (
            <div style={{ height: 1, background: 'rgba(26,22,18,0.07)', margin: '12px 0' }} />
          )}

          {links.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => go(page)}
              className="w-full text-left py-2.5 transition-colors"
              style={{
                borderBottom: '1px solid rgba(26,22,18,0.04)',
                fontSize: 16,
                fontWeight: currentPage === page ? 600 : 400,
                color: currentPage === page ? '#C1440E' : '#1A1612',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="p-5 space-y-3" style={{ borderTop: '1px solid rgba(26,22,18,0.07)' }}>
          {/* Account row */}
          {profile ? (
            <div className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: '#F0E8DC', border: '1px solid rgba(26,22,18,0.08)' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1612', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile.name ?? profile.email}
                </div>
                <div style={{ fontSize: 11, color: '#9A8B82', marginTop: 1 }}>{roleLabel}</div>
              </div>
              <button
                onClick={() => { onSignOut?.(); onClose(); }}
                style={{ marginLeft: 12, flexShrink: 0, fontSize: 12, fontWeight: 600, color: '#C1440E', background: 'none', border: '1px solid rgba(193,68,14,0.25)', borderRadius: 5, padding: '5px 10px', cursor: 'pointer' }}
              >
                Log out
              </button>
            </div>
          ) : (
            <button
              onClick={() => go('login')}
              className="w-full btn-outline py-2.5 text-sm flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              Log in / Sign up
            </button>
          )}

          <div className="flex gap-2">
            <a
              href="https://www.instagram.com/pass_no_jugaad_?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
              target="_blank" rel="noopener noreferrer"
              className="flex-1 btn-outline flex items-center justify-center gap-1.5 py-2.5 text-xs"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              Instagram
            </a>
            <a
              href="mailto:passnojugaadd@gmail.com"
              className="flex-1 btn-outline flex items-center justify-center gap-1.5 py-2.5 text-xs"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
              </svg>
              Email
            </a>
          </div>
          <button onClick={() => go('find-jugaad')} className="btn-primary w-full py-3 text-sm">
            Find Your Jugaad →
          </button>
        </div>
      </div>
    </>
  );
}
