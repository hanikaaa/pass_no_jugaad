import logoSrc from '@/imports/garba_no_pass_taaro__6_.png';

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
      src={logoSrc}
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
