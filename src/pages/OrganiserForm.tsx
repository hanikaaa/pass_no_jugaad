import { useState } from 'react';
import { type NavProps } from '../data/events';

const EVENT_TYPES = ['Garba', 'Artist Night', 'Premium', 'College', 'Corporate', 'Other'];
const NEEDS = ['Audience', 'Promotion', 'Pass Distribution', 'Exclusive Offer', 'Referral Sales', 'Other'];

export default function OrganiserForm({ navigate }: NavProps) {
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [needs, setNeeds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (arr: string[], val: string, set: (a: string[]) => void) => {
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-24 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,85,0,0.12)', border: '1px solid rgba(255,85,0,0.3)' }}>
          <span style={{ fontSize: 36 }}>👀</span>
        </div>
        <h1 className="font-display font-black leading-none mb-3" style={{ fontSize: 'clamp(36px, 10vw, 56px)', letterSpacing: '-0.02em' }}>
          EVENT<br /><span style={{ color: '#FF5500' }}>RECEIVED 👀</span>
        </h1>
        <p className="text-white/50 text-sm mb-6 max-w-xs" style={{ lineHeight: 1.6 }}>
          {"We've got your details. We'll review your event and get back to you."}
        </p>
        <div className="space-y-3 max-w-xs w-full">
          <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="btn-primary w-full py-3.5 flex items-center justify-center text-sm font-display font-bold tracking-wide">
            MESSAGE US ON WHATSAPP →
          </a>
          <a href="https://instagram.com/pass_no_jugaad" target="_blank" rel="noopener noreferrer" className="btn-outline w-full py-3.5 flex items-center justify-center text-sm font-display font-bold tracking-wide">
            DM US ON INSTAGRAM →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-24 max-w-lg mx-auto">
      <button onClick={() => navigate('organisers')} className="flex items-center gap-2 text-white/40 text-sm mb-6 hover:text-white transition-colors">← Back</button>

      <h1 className="font-display font-black leading-none mb-2" style={{ fontSize: 'clamp(40px, 11vw, 60px)', letterSpacing: '-0.02em' }}>
        LIST YOUR<br /><span style={{ color: '#FF5500' }}>EVENT</span>
      </h1>
      <p className="text-white/50 text-sm mb-8">Tell us about your event and what you need.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          { label: 'ORGANISER NAME', placeholder: 'Type here', required: true },
          { label: 'BRAND / ORGANISATION', placeholder: 'Type here', required: true },
          { label: 'EMAIL', placeholder: 'your@email.com', type: 'email', required: true },
          { label: 'WHATSAPP NUMBER', placeholder: '+91 __________', type: 'tel', required: true },
        ].map((f) => (
          <div key={f.label}>
            <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">{f.label}</label>
            <input required={f.required} type={f.type || 'text'} placeholder={f.placeholder} />
          </div>
        ))}

        <div className="border-t border-white/5 pt-5">
          <div className="font-display font-bold text-xs tracking-widest text-white/20 mb-4 uppercase">Event Details</div>
          {[
            { label: 'EVENT NAME', placeholder: 'Type here', required: true },
            { label: 'VENUE', placeholder: 'Type here' },
          ].map((f) => (
            <div key={f.label} className="mb-5">
              <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">{f.label}</label>
              <input required={f.required} placeholder={f.placeholder} />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">EVENT DATE</label>
              <input type="date" />
            </div>
            <div>
              <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">CITY</label>
              <input placeholder="Ahmedabad" defaultValue="Ahmedabad" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'EXPECTED CROWD', placeholder: 'e.g. 5000' },
              { label: 'CAPACITY', placeholder: 'e.g. 8000' },
              { label: 'PASSES AVAIL.', placeholder: 'e.g. 500' },
            ].map((f) => (
              <div key={f.label}>
                <label className="font-display font-bold text-[10px] tracking-widest text-white/40 block mb-2">{f.label}</label>
                <input placeholder={f.placeholder} />
              </div>
            ))}
          </div>

          <div className="mb-5">
            <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">PASS PRICE</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">₹</span>
              <input placeholder="0" style={{ paddingLeft: 28 }} />
            </div>
          </div>
        </div>

        <div>
          <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">EVENT TYPE</label>
          <div className="flex flex-wrap gap-2">
            {EVENT_TYPES.map((t) => (
              <button key={t} type="button" onClick={() => toggle(eventTypes, t, setEventTypes)} className={`chip ${eventTypes.includes(t) ? 'active' : ''}`}>{t}</button>
            ))}
          </div>
        </div>

        {[
          { label: 'ARTIST / DJ', placeholder: 'Type here' },
          { label: 'INSTAGRAM LINK', placeholder: 'Paste link' },
          { label: 'OFFICIAL EVENT / BOOKING LINK', placeholder: 'Paste link' },
        ].map((f) => (
          <div key={f.label}>
            <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">{f.label}</label>
            <input placeholder={f.placeholder} />
          </div>
        ))}

        <div>
          <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">WHAT DO YOU NEED FROM US?</label>
          <div className="flex flex-wrap gap-2">
            {NEEDS.map((n) => (
              <button key={n} type="button" onClick={() => toggle(needs, n, setNeeds)} className={`chip ${needs.includes(n) ? 'active' : ''}`}>{n}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="font-display font-bold text-xs tracking-widest text-white/40 block mb-2">ADDITIONAL INFORMATION</label>
          <textarea rows={4} placeholder="Tell us anything else..." />
        </div>

        <button type="submit" className="btn-primary w-full py-4 text-lg">
          SUBMIT EVENT →
        </button>
      </form>
    </div>
  );
}
