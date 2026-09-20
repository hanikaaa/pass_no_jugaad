import { useState, useRef } from 'react';
import { type NavProps } from '../data/events';
import { submitEvent } from '../lib/api';

const NEEDS = ['Audience', 'Promotion', 'Pass Distribution', 'Exclusive Offer', 'Referral Sales', 'Other'];

export default function OrganiserForm({ navigate }: NavProps) {
  const [needs, setNeeds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [submitting, setSubmitting] = useState(false);

  const toggle = (arr: string[], val: string, set: (a: string[]) => void) => {
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(formRef.current!);
    const ticketPrice = Number(fd.get('price') || fd.get('price_min') || 0);

    await submitEvent({
      name: fd.get('name') as string,
      venue: fd.get('venue') as string,
      date: fd.get('date') as string,
      time: fd.get('time') as string || '7:00 PM onwards',
      price: ticketPrice,
      price_min: ticketPrice,
      price_max: ticketPrice,
      image_url: imagePreview || undefined,
      type_tags: ['Garba'],
      artist: fd.get('artist') as string,
      description: fd.get('description') as string,
      instagram_link: fd.get('instagram_link') as string,
      contact_email: fd.get('contact_email') as string,
    });
    setSubmitting(false);
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-24 text-center" style={{ color: '#1A1612' }}>
        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(193,68,14,0.1)', border: '1px solid rgba(193,68,14,0.25)' }}>
          <span style={{ fontSize: 36 }}>👀</span>
        </div>
        <div className="eyebrow mb-3">Event received</div>
        <h1 style={{ fontSize: 'clamp(28px, 8vw, 42px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>
          {"We've got your event."}
        </h1>
        <p style={{ fontSize: 14, color: '#6B5B52', lineHeight: 1.7, maxWidth: 300, margin: '0 auto 24px' }}>
          {"We'll review your details and get back to you."}
        </p>
        <div className="space-y-3 max-w-xs w-full">
          <a href="https://www.instagram.com/pass_no_jugaad_?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
            DM us on Instagram →
          </a>
          <a href="mailto:passnojugaadd@gmail.com" className="btn-outline w-full py-3.5 flex items-center justify-center gap-2 text-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
            </svg>
            Email us
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 pb-28 max-w-lg mx-auto" style={{ color: '#1A1612' }}>
      <button onClick={() => navigate('organisers')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#9A8B82', marginBottom: 24 }}>← Back</button>

      <div className="eyebrow mb-3">List your event</div>
      <h1 style={{ fontSize: 'clamp(32px, 9vw, 46px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 6 }}>
        Tell us about your event.
      </h1>
      <p style={{ fontSize: 14, color: '#6B5B52', marginBottom: 28 }}>Fill in what you can. We'll follow up to learn more.</p>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">

        {/* ── Organiser info ─────────────────── */}
        <div className="card-light p-4 space-y-4">
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9A8B82' }}>Your details</div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Organiser name</label>
            <input name="organiser_name" required placeholder="Your name" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Brand / Organisation</label>
            <input name="org_name" required placeholder="Company or brand name" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Email</label>
            <input name="contact_email" required type="email" placeholder="your@email.com" />
          </div>
        </div>

        {/* ── Event image ────────────────────── */}
        <div>
          <label style={{ display: 'block', marginBottom: 6 }}>Event image</label>
          <p style={{ fontSize: 12, color: '#9A8B82', marginBottom: 10 }}>Recommended: 1200 × 675px (16:9), JPG or PNG, under 5 MB. This is the banner shown on the event listing.</p>

          <input
            ref={fileInputRef}
            type="file"
            name="event_image"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />

          {imagePreview ? (
            <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: '16/9', background: '#E5D9CC' }}>
              <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div className="absolute inset-0 flex items-end p-3" style={{ background: 'linear-gradient(to top, rgba(26,22,18,0.55) 0%, transparent 50%)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: 'rgba(250,247,242,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{imageName}</div>
                </div>
                <button
                  type="button"
                  onClick={() => { setImagePreview(null); setImageName(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  style={{ marginLeft: 8, fontSize: 11, color: 'rgba(250,247,242,0.7)', background: 'rgba(26,22,18,0.4)', border: 'none', borderRadius: 4, padding: '3px 8px', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-lg flex flex-col items-center justify-center gap-2 transition-colors"
              style={{ aspectRatio: '16/9', border: '1.5px dashed rgba(26,22,18,0.2)', background: '#FAF7F2', color: '#9A8B82', cursor: 'pointer' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span style={{ fontSize: 13, fontWeight: 500 }}>Upload event image</span>
              <span style={{ fontSize: 11 }}>JPG, PNG or WebP · max 5 MB</span>
            </button>
          )}
        </div>

        {/* ── Event details ──────────────────── */}
        <div className="card-light p-4 space-y-4">
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9A8B82' }}>Event details</div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Event name</label>
            <input name="name" required placeholder="Name of your event" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Venue</label>
            <input name="venue" required placeholder="Where is it happening?" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ display: 'block', marginBottom: 6 }}>Event date</label>
              <input name="date" required placeholder="e.g. 8th October, 15 OCT 2026" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6 }}>Time</label>
              <input name="time" placeholder="e.g. 7:00 PM onwards" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Ticket price (₹) *</label>
            <input name="price" type="number" required placeholder="e.g. 1200" />
            <p style={{ fontSize: 11, color: '#9A8B82', marginTop: 4 }}>Enter the pass/ticket price per person.</p>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Artist / DJ</label>
            <input name="artist" placeholder="Who is performing?" />
          </div>
        </div>

        {/* ── Description ────────────────────── */}
        <div>
          <label style={{ display: 'block', marginBottom: 6 }}>Event description</label>
          <p style={{ fontSize: 12, color: '#9A8B82', marginBottom: 8 }}>This appears on your event listing page. Tell people what makes this night special.</p>
          <textarea
            name="description"
            rows={5}
            required
            placeholder="Describe your event — the vibe, the lineup, what people can expect..."
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* ── Links ──────────────────────────── */}
        <div className="space-y-4">
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Instagram link</label>
            <input name="instagram_link" placeholder="https://instagram.com/yourevent" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Event / booking link</label>
            <input name="booking_link" placeholder="Paste link" />
          </div>
        </div>

        {/* ── What do you need ───────────────── */}
        <div>
          <label style={{ display: 'block', marginBottom: 8 }}>What do you need from us?</label>
          <div className="flex flex-wrap gap-2">
            {NEEDS.map((n) => (
              <button key={n} type="button" onClick={() => toggle(needs, n, setNeeds)} className={`chip ${needs.includes(n) ? 'active' : ''}`}>{n}</button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary w-full py-4 text-base">
          Submit Event →
        </button>

        <p style={{ fontSize: 11, color: '#9A8B82', textAlign: 'center', lineHeight: 1.6 }}>
          We review all submissions before they go live. You'll hear from us within 24 hours.
        </p>
      </form>
    </div>
  );
}
