import { useEffect, useState } from 'react';
import { type NavProps } from '../data/events';

interface Props extends NavProps {
  menuOpen: boolean;
  onMenuToggle: () => void;
}

export default function Header({ navigate, currentPage, menuOpen, onMenuToggle }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.getElementById('main-scroll');
    if (!el) return;
    const handler = () => setScrolled(el.scrollTop > 60);
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, []);

  const isHome = currentPage === 'home';

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 transition-all duration-300"
      style={{
        background: scrolled || !isHome
          ? 'rgba(8,8,8,0.95)'
          : 'transparent',
        backdropFilter: scrolled || !isHome ? 'blur(12px)' : 'none',
        borderBottom: scrolled || !isHome ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}
    >
      <button
        onClick={() => navigate('home')}
        className="font-display font-black text-white leading-none"
        style={{ fontSize: 20, letterSpacing: '-0.01em' }}
      >
        PASS NO<br />
        <span style={{ color: '#FF5500' }}>JUGAAD</span>
      </button>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('find-jugaad')}
          className="btn-primary hidden sm:flex items-center gap-1 px-4 py-2 text-sm"
        >
          FIND YOUR JUGAAD
        </button>

        <button
          onClick={onMenuToggle}
          className="w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-md border border-white/10 transition-all hover:border-white/30"
          aria-label="Menu"
        >
          <span
            className="block h-[1.5px] bg-white transition-all duration-300"
            style={{ width: menuOpen ? 18 : 18, transform: menuOpen ? 'rotate(45deg) translateY(6.5px)' : 'none' }}
          />
          <span
            className="block h-[1.5px] bg-white transition-all duration-300"
            style={{ width: menuOpen ? 0 : 14, opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block h-[1.5px] bg-white transition-all duration-300"
            style={{ width: menuOpen ? 18 : 18, transform: menuOpen ? 'rotate(-45deg) translateY(-6.5px)' : 'none' }}
          />
        </button>
      </div>
    </header>
  );
}
