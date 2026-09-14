import { type NavProps } from '../data/events';

export default function Contact({ navigate: _navigate }: NavProps) {
  return (
    <div className="px-4 py-6 pb-24">
      <div className="font-display font-bold text-xs tracking-widest mb-2" style={{ color: '#FF5500' }}>GET IN TOUCH</div>
      <h1 className="font-display font-black leading-none mb-8" style={{ fontSize: 'clamp(44px, 12vw, 72px)', letterSpacing: '-0.02em' }}>
        TALK<br /><span style={{ color: '#FF5500' }}>TO US →</span>
      </h1>

      <div className="space-y-4 mb-8">
        <a
          href="https://instagram.com/pass_no_jugaad"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-lg p-4 transition-all hover:border-orange-500/30"
          style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)', display: 'flex' }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', boxShadow: '0 4px 15px rgba(253,29,29,0.3)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="white" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-display font-black text-white mb-0.5" style={{ fontSize: 18 }}>INSTAGRAM</div>
            <div className="text-white/40 text-sm">@pass_no_jugaad</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>

        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-lg p-4 transition-all hover:border-green-500/30"
          style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)', display: 'flex' }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#25D366', boxShadow: '0 4px 15px rgba(37,211,102,0.3)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.113.546 4.1 1.505 5.832L.057 23.25l5.563-1.457A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.883 0-3.643-.51-5.148-1.4l-.368-.22-3.303.866.882-3.222-.239-.373A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-display font-black text-white mb-0.5" style={{ fontSize: 18 }}>WHATSAPP</div>
            <div className="text-white/40 text-sm">+91 99999 99999</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>

        <a
          href="mailto:hello@passnojugaad.com"
          className="flex items-center gap-4 rounded-lg p-4 transition-all hover:border-white/20"
          style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)', display: 'flex' }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,85,0,0.15)', border: '1px solid rgba(255,85,0,0.3)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF5500" strokeWidth="1.8">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-display font-black text-white mb-0.5" style={{ fontSize: 18 }}>EMAIL</div>
            <div className="text-white/40 text-sm">hello@passnojugaad.com</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </a>
      </div>

      <div className="text-center text-white/20 text-xs" style={{ lineHeight: 1.6 }}>
        We usually respond within a few hours on WhatsApp.
      </div>
    </div>
  );
}
