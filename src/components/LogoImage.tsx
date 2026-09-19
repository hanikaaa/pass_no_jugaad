import logoSrc from '@/assets/logo.png';

interface Props {
  width?: number;
  className?: string;
}

/**
 * Logo image with white canvas removed.
 * On the light ivory background, mix-blend-mode: multiply makes the
 * white canvas invisible — only the dark plaque and coloured text show.
 */
export default function LogoImage({ width = 140, className = '' }: Props) {
  return (
    <img
      src={logoSrc || '/logo.png'}
      alt="Pass No Jugaad"

      draggable={false}
      className={className}
      style={{
        width,
        height: 'auto',
        mixBlendMode: 'multiply',
        display: 'block',
        userSelect: 'none',
        pointerEvents: 'none',
        flexShrink: 0,
      }}
    />
  );
}
