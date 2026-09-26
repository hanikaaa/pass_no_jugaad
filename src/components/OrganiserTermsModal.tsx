import { ORGANISER_TERMS_METADATA, ORGANISER_TERMS_SECTIONS } from '../data/organiserTerms';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export default function OrganiserTermsModal({ isOpen, onClose, onAccept }: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
      style={{ background: 'rgba(26,22,18,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl card-light flex flex-col max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl"
        style={{ background: '#FAF7F2', border: '1px solid rgba(26,22,18,0.15)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-100/70">
          <div>
            <div className="eyebrow text-[10px] text-amber-900">{ORGANISER_TERMS_METADATA.title}</div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-tight">
              {ORGANISER_TERMS_METADATA.subtitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 bg-white border border-stone-200 shadow-sm transition-colors text-base font-bold"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Terms Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-stone-800 leading-relaxed font-sans">
          {/* Preamble */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950 text-xs sm:text-xs leading-relaxed space-y-2">
            <div className="font-bold text-[11px] uppercase tracking-wider text-amber-900">Important Notice</div>
            <p className="whitespace-pre-line">{ORGANISER_TERMS_METADATA.intro}</p>
          </div>

          {/* All 17 Sections */}
          {ORGANISER_TERMS_SECTIONS.map((sec) => (
            <div key={sec.id} className="space-y-2 pt-2">
              <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 border-b border-stone-200/60 pb-1">
                {sec.title}
              </h3>
              {sec.paragraphs.map((p, idx) => (
                <p key={idx} className="whitespace-pre-line text-stone-700 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-stone-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-stone-500 text-center sm:text-left">
            By proceeding, you legally agree to adhere to these 17 clauses.
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1 sm:flex-initial py-2.5 px-4 text-xs font-semibold"
            >
              Close
            </button>
            {onAccept && (
              <button
                type="button"
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className="btn-primary flex-1 sm:flex-initial py-2.5 px-5 text-xs font-bold whitespace-nowrap"
              >
                ✓ I Understand & Agree
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
