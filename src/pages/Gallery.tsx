import { useState } from 'react';

const GALLERY_IMAGES = [
  { id: 1, url: 'https://images.unsplash.com/photo-1667831617890-458ca443d799?w=600&h=800&fit=crop&auto=format', alt: 'Garba crowd dancing', cat: 'Garba' },
  { id: 2, url: 'https://images.unsplash.com/photo-1786452156548-9a60189a9876?w=600&h=400&fit=crop&auto=format', alt: 'Stage performance', cat: 'Artists' },
  { id: 3, url: 'https://images.unsplash.com/photo-1712192682756-ae5b3a8e7508?w=600&h=900&fit=crop&auto=format', alt: 'Dancer in traditional outfit', cat: 'Outfits' },
  { id: 4, url: 'https://images.unsplash.com/photo-1728272356720-4e0bd55a6e09?w=600&h=400&fit=crop&auto=format', alt: 'Night crowd', cat: 'Nightlife' },
  { id: 5, url: 'https://images.unsplash.com/photo-1645264090488-a019de493023?w=600&h=900&fit=crop&auto=format', alt: 'Two women in traditional garb', cat: 'Outfits' },
  { id: 6, url: 'https://images.unsplash.com/photo-1617184003170-1f266c325ff3?w=600&h=800&fit=crop&auto=format', alt: 'Stage performers', cat: 'Artists' },
  { id: 7, url: 'https://images.unsplash.com/photo-1767278608250-e87182850006?w=600&h=400&fit=crop&auto=format', alt: 'Festival crowd', cat: 'Crowd' },
  { id: 8, url: 'https://images.unsplash.com/photo-1783255333879-6974e32a2356?w=600&h=900&fit=crop&auto=format', alt: 'Performer in vibrant costume', cat: 'Outfits' },
  { id: 9, url: 'https://images.unsplash.com/photo-1616787671779-eed71117a65e?w=600&h=400&fit=crop&auto=format', alt: 'Crowd hands raised', cat: 'Crowd' },
  { id: 10, url: 'https://images.unsplash.com/photo-1684049348966-e947c61152cd?w=600&h=800&fit=crop&auto=format', alt: 'Large garba gathering', cat: 'Garba' },
  { id: 11, url: 'https://images.unsplash.com/photo-1714055735665-2d901fc9c196?w=600&h=400&fit=crop&auto=format', alt: 'Festival by river', cat: 'Venues' },
];

const CATS = ['All', 'Garba', 'Crowd', 'Artists', 'Venues', 'Outfits', 'Nightlife'];

export default function Gallery() {
  const [activeCat, setActiveCat] = useState('All');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = activeCat === 'All' ? GALLERY_IMAGES : GALLERY_IMAGES.filter((i) => i.cat === activeCat);

  return (
    <div className="pb-24">
      <div className="px-4 py-6">
        <h1 className="font-display font-black leading-none mb-1" style={{ fontSize: 'clamp(40px, 11vw, 64px)', letterSpacing: '-0.02em' }}>
          AHMEDABAD<br /><span style={{ color: '#FF5500' }}>AFTER DARK</span>
        </h1>
        <p className="text-white/40 text-sm mb-5">The Jugaad Gallery.</p>

        {/* Category scroll */}
        <div className="scroll-x flex gap-2 pb-2">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`chip flex-shrink-0 ${activeCat === c ? 'active' : ''}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry grid */}
      <div className="px-4 columns-2 gap-2 sm:columns-3">
        {filtered.map((img) => (
          <div
            key={img.id}
            className="mb-2 break-inside-avoid rounded-lg overflow-hidden cursor-pointer relative group"
            onClick={() => setLightbox(img.id)}
          >
            <img
              src={img.url}
              alt={img.alt}
              className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
            <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: '#FF5500', color: 'white' }}>
                {img.cat}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Instagram CTA */}
      <div className="px-4 mt-6 text-center">
        <p className="text-white/30 text-sm mb-3">
          Tag <span className="text-white/60 font-semibold">@pass_no_jugaad</span> to get featured.
        </p>
        <a
          href="https://instagram.com/pass_no_jugaad"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline inline-flex items-center gap-2 px-5 py-3 text-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
          </svg>
          @PASS_NO_JUGAAD
        </a>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.95)' }}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white/60 hover:text-white"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          <img
            src={GALLERY_IMAGES.find((i) => i.id === lightbox)!.url.replace('w=600', 'w=1200')}
            alt=""
            className="max-w-full max-h-full object-contain rounded-lg"
            style={{ maxHeight: '85vh', maxWidth: '90vw' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
