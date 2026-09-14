import { type NavProps, type Page } from '../data/events';

interface Props extends NavProps {
  onClose: () => void;
}

const links: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Navratri Radar', page: 'radar' },
  { label: 'Events', page: 'events' },
  { label: 'Calendar', page: 'calendar' },
  { label: 'Jugaad Drops', page: 'drops' },
  { label: 'For Organisers', page: 'organisers' },
  { label: 'Gallery', page: 'gallery' },
  { label: 'About', page: 'about' },
  { label: 'Contact', page: 'contact' },
];

export default function HamburgerMenu({ navigate, currentPage, onClose }: Props) {
  const go = (page: Page) => {
    navigate(page);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/70"
        style={{ backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <div
        className="fixed top-0 right-0 bottom-0 z-50 w-[300px] flex flex-col animate-slide-right"
        style={{ background: '#0d0d0d', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="font-display font-black text-white leading-tight" style={{ fontSize: 18 }}>
            PASS NO<br /><span style={{ color: '#FF5500' }}>JUGAAD</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-5">
          {links.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => go(page)}
              className="w-full text-left py-3 border-b border-white/5 transition-all group"
            >
              <span
                className="font-display font-bold text-lg tracking-wide transition-colors group-hover:text-orange-500"
                style={{ color: currentPage === page ? '#FF5500' : 'rgba(255,255,255,0.8)' }}
              >
                {label}
              </span>
            </button>
          ))}
        </nav>

        <div className="p-5 border-t border-white/5 space-y-3">
          <div className="flex gap-3">
            <a
              href="https://instagram.com/pass_no_jugaad"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md border border-white/10 text-white/70 hover:border-white/30 hover:text-white transition-all text-sm font-semibold"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              Instagram
            </a>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md border border-white/10 text-white/70 hover:border-white/30 hover:text-white transition-all text-sm font-semibold"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.113.546 4.1 1.505 5.832L.057 23.25l5.563-1.457A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.883 0-3.643-.51-5.148-1.4l-.368-.22-3.303.866.882-3.222-.239-.373A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              WhatsApp
            </a>
          </div>

          <button
            onClick={() => go('find-jugaad')}
            className="btn-primary w-full py-3.5 text-base"
          >
            I WANT PASSES →
          </button>
        </div>
      </div>
    </>
  );
}
