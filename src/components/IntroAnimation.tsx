import { useEffect, useState } from 'react';
import logoSrc from '@/imports/garba_no_pass_taaro__6_.png';

interface Props {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: Props) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 100);
    const t2 = setTimeout(() => setPhase('out'), 1800);
    const t3 = setTimeout(() => onComplete(), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background: '#FAF7F2',
        opacity: phase === 'out' ? 0 : 1,
        transition: phase === 'out' ? 'opacity 0.5s ease' : 'none',
        pointerEvents: phase === 'out' ? 'none' : 'auto',
      }}
    >
      {/* Logo — multiply blend removes white canvas against ivory bg */}
      <div
        style={{
          opacity: phase === 'in' ? 0 : 1,
          transform: phase === 'in' ? 'translateY(12px) scale(0.95)' : 'translateY(0) scale(1)',
          transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <img
          src={logoSrc}
          alt="Pass No Jugaad"
          style={{
            width: 'clamp(220px, 60vw, 340px)',
            height: 'auto',
            mixBlendMode: 'multiply',
            display: 'block',
          }}
        />
      </div>

      <p
        style={{
          marginTop: 16,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#9A8B82',
          opacity: phase === 'in' ? 0 : 1,
          transition: 'opacity 0.5s ease 0.45s',
        }}
      >
        Ahmedabad · Navratri 2026
      </p>
    </div>
  );
}
