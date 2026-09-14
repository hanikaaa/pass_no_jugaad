import { useEffect, useState } from 'react';

interface Props {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: Props) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1400);
    const t2 = setTimeout(() => onComplete(), 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      style={{
        transition: 'opacity 0.5s ease',
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      <div className="text-center select-none">
        <div
          className="font-display font-black text-white animate-logo-reveal"
          style={{ fontSize: 'clamp(56px, 18vw, 120px)', lineHeight: 0.85, letterSpacing: '-0.02em' }}
        >
          PASS NO
        </div>
        <div
          className="font-display font-black animate-logo-reveal-2"
          style={{
            fontSize: 'clamp(56px, 18vw, 120px)',
            lineHeight: 0.85,
            letterSpacing: '-0.02em',
            color: '#FF5500',
          }}
        >
          JUGAAD
        </div>
        <div
          className="mt-4 font-display font-semibold text-white/40 tracking-widest text-sm animate-fade-in"
          style={{ animationDelay: '0.6s', opacity: 0 }}
        >
          AHMEDABAD · NAVRATRI 2026
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{ animation: 'fadeIn 0.5s ease 0.8s forwards', opacity: 0 }}
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-white/30"
              style={{ animation: `radarPulse 0.8s ease ${i * 0.15}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
