import { type NavProps, type Page } from '../data/events';

interface Props extends NavProps {}

const LINKS: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Radar', page: 'radar' },
  { label: 'Events', page: 'events' },
  { label: 'Calendar', page: 'calendar' },
  { label: 'Jugaad Drops', page: 'drops' },
  { label: 'Organisers', page: 'organisers' },
  { label: 'Gallery', page: 'gallery' },
  { label: 'Contact', page: 'contact' },
];

export default function Footer({ navigate }: Props) {
  return (
    <footer className="px-4 py-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)', background: '#050505' }}>
      <div className="font-display font-black leading-none mb-6" style={{ fontSize: 32, letterSpacing: '-0.02em' }}>
        PASS NO<br /><span style={{ color: '#FF5500' }}>JUGAAD</span>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
        {LINKS.map(({ label, page }) => (
          <button
            key={page}
            onClick={() => navigate(page)}
            className="text-white/40 text-sm hover:text-white transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm mb-6"
      >
        JOIN OUR WHATSAPP UPDATES
      </a>

      <div className="flex gap-3 mb-6">
        <a href="https://instagram.com/pass_no_jugaad" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-md border border-white/10 text-white/50 hover:border-white/30 hover:text-white transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
          </svg>
        </a>
        <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-md border border-white/10 text-white/50 hover:border-white/30 hover:text-white transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.113.546 4.1 1.505 5.832L.057 23.25l5.563-1.457A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.894 16.494c-.252.71-1.472 1.356-2.043 1.43-.52.067-1.183.094-1.908-.12-.44-.128-1.006-.298-1.727-.584-3.037-1.313-5.02-4.393-5.171-4.6-.149-.207-1.213-1.612-1.213-3.074 0-1.463.769-2.182 1.04-2.479.272-.298.594-.372.792-.372.198 0 .397.002.57.01.182.01.427-.069.669.51.247.595.841 2.058.916 2.207.075.149.124.322.025.52-.1.199-.149.323-.298.497-.149.173-.313.387-.446.52-.148.148-.303.309-.13.606.173.298.77 1.271 1.653 2.059 1.135 1.012 2.093 1.325 2.39 1.475.297.148.471.124.644-.075.173-.198.743-.867.94-1.164.199-.298.397-.249.67-.15.272.1 1.733.818 2.03.967.298.149.496.223.57.347.075.124.075.719-.173 1.413z" />
          </svg>
        </a>
      </div>

      <p className="text-white/20 text-xs" style={{ lineHeight: 1.6 }}>
        Pass No Jugaad is an independent discovery and community platform. It is not an official ticketing partner unless explicitly stated for a specific event.
      </p>

      <p className="text-white/10 text-xs mt-3">
        © 2026 Pass No Jugaad · Ahmedabad
      </p>
    </footer>
  );
}
