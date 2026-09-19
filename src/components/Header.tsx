import { useEffect, useState } from 'react';
import { type NavProps } from '../data/events';
import logoSrc from '@/assets/logo.png';

interface Props extends NavProps {
  menuOpen: boolean;
  onMenuToggle: () => void;
}

export default function Header({ navigate, menuOpen, onMenuToggle }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.getElementById('main-scroll');
    if (!el) return;
    const handler = () => setScrolled(el.scrollTop > 50);
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 transition-all duration-300"
      style={{
        height: 60,
        background: scrolled ? 'rgba(250,247,242,0.95)' : 'rgba(250,247,242,0.98)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(26,22,18,0.10)' : 'rgba(26,22,18,0.07)'}`,
      }}
    >
      {/* Logo — mix-blend-mode:multiply makes the white canvas corners invisible on ivory */}
      <button onClick={() => navigate('home')} style={{ lineHeight: 0, flexShrink: 0 }}>
        <img
          src={logoSrc || '/logo.png'}
          alt="Pass No Jugaad"
          style={{ width: 120, height: 'auto', mixBlendMode: 'multiply', display: 'block' }}
        />
      </button>


      {/* Hamburger only — always visible */}
      <button
        onClick={onMenuToggle}
        className="w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded"
        style={{ border: '1.5px solid rgba(26,22,18,0.15)' }}
        aria-label="Menu"
      >
        <span style={{ display: 'block', width: 16, height: 1.5, background: '#1A1612', transition: 'all 0.25s', transform: menuOpen ? 'rotate(45deg) translateY(6.5px)' : 'none' }} />
        <span style={{ display: 'block', width: 12, height: 1.5, background: '#1A1612', transition: 'all 0.25s', opacity: menuOpen ? 0 : 1 }} />
        <span style={{ display: 'block', width: 16, height: 1.5, background: '#1A1612', transition: 'all 0.25s', transform: menuOpen ? 'rotate(-45deg) translateY(-6.5px)' : 'none' }} />
      </button>
    </header>
  );
}
