import { useState, useMemo } from 'react';
import { type NavProps, EVENTS, DEMAND_COLOR, DEMAND_LABEL, AVAIL_COLOR } from '../data/events';

const DATE_FILTERS = ['10 OCT', '11 OCT', '12 OCT', '13 OCT', '14 OCT', '15 OCT', '16 OCT', '17 OCT', '18 OCT', '19 OCT'];
const BUDGET_FILTERS = ['Under ₹1K', '₹1K–₹1.5K', '₹1.5K–₹2.5K', '₹2.5K+'];
const LOCATION_FILTERS = ['SG Highway', 'Sindhu Bhavan', 'Bopal', 'GIFT City', 'Shilaj', 'SBR'];
const TYPE_FILTERS = ['Garba', 'Artist Night', 'Premium', 'Youth', 'Family', 'Late Night', 'College'];
const DEMAND_FILTERS = ['LOW', 'MEDIUM', 'HIGH', 'VERY HIGH'];
const AVAIL_FILTERS = ['Available', 'Limited', 'Request Only'];
const SORT_OPTIONS = ['Recommended', 'Lowest Price', 'Highest Demand', 'Latest Added'];

interface Filters {
  search: string;
  dates: string[];
  budgets: string[];
  locations: string[];
  types: string[];
  demands: string[];
  avails: string[];
  sort: string;
}

const DEMAND_ORDER = ['LOW', 'MEDIUM', 'HIGH', 'VERY HIGH'];

function budgetMatch(min: number, max: number, filter: string) {
  if (filter === 'Under ₹1K') return min < 1000;
  if (filter === '₹1K–₹1.5K') return min >= 1000 && max <= 1500;
  if (filter === '₹1.5K–₹2.5K') return min >= 1500 && max <= 2500;
  if (filter === '₹2.5K+') return max > 2500;
  return true;
}

export default function EventsPage({ navigate }: NavProps) {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    dates: [],
    budgets: [],
    locations: [],
    types: [],
    demands: [],
    avails: [],
    sort: 'Recommended',
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggle = <K extends keyof Filters>(key: K, val: string) => {
    const arr = filters[key] as string[];
    setFilters((f) => ({ ...f, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] }));
  };

  const filtered = useMemo(() => {
    let evts = EVENTS.filter((e) => {
      const q = filters.search.toLowerCase();
      if (q && !e.name.toLowerCase().includes(q) && !e.venue.toLowerCase().includes(q) && !(e.artist || '').toLowerCase().includes(q)) return false;
      if (filters.dates.length && !filters.dates.includes(e.dateShort)) return false;
      if (filters.budgets.length && !filters.budgets.some((b) => budgetMatch(e.priceMin, e.priceMax, b))) return false;
      if (filters.locations.length && !filters.locations.some((l) => e.location.includes(l))) return false;
      if (filters.types.length && !filters.types.some((t) => e.type.some((et) => et.toLowerCase().includes(t.toLowerCase())))) return false;
      if (filters.demands.length && !filters.demands.includes(e.demand)) return false;
      if (filters.avails.length && !filters.avails.includes(e.availability)) return false;
      return true;
    });

    if (filters.sort === 'Lowest Price') evts = [...evts].sort((a, b) => a.priceMin - b.priceMin);
    if (filters.sort === 'Highest Demand') evts = [...evts].sort((a, b) => DEMAND_ORDER.indexOf(b.demand) - DEMAND_ORDER.indexOf(a.demand));

    return evts;
  }, [filters]);

  const noResults = filtered.length === 0;
  const activeFilterCount = filters.dates.length + filters.budgets.length + filters.locations.length + filters.types.length + filters.demands.length + filters.avails.length;

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-4 py-6">
        <h1 className="font-display font-black leading-none mb-4" style={{ fontSize: 'clamp(40px, 11vw, 64px)', letterSpacing: '-0.02em' }}>
          FIND YOUR<br /><span style={{ color: '#FF5500' }}>EVENT</span>
        </h1>

        {/* Search */}
        <div className="relative mb-3">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search events, artists, venues..."
            style={{ paddingLeft: 36 }}
          />
        </div>

        {/* Sort + Filter */}
        <div className="flex gap-2">
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="flex-1"
            style={{ fontSize: 13 }}
          >
            {SORT_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button
            onClick={() => setDrawerOpen(true)}
            className="btn-outline flex items-center gap-2 px-4 py-2 relative"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            <span className="font-display font-bold text-sm">FILTER</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold" style={{ background: '#FF5500' }}>
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="px-4">
        <div className="font-display font-bold text-xs tracking-widest text-white/30 mb-4">
          {filtered.length} EVENT{filtered.length !== 1 ? 'S' : ''} FOUND
        </div>

        {noResults ? (
          <div className="rounded-lg p-6" style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="font-display font-black text-white text-2xl mb-2">{"CAN'T FIND IT?"}</div>
            <p className="text-white/50 text-sm mb-4">Tell us what {"you're"} looking for and {"we'll"} track it.</p>
            <div className="space-y-3">
              {[
                { ph: 'Event / Artist', id: 'req-event' },
                { ph: 'Date', id: 'req-date' },
                { ph: 'Number of passes', id: 'req-passes' },
                { ph: 'Budget', id: 'req-budget' },
              ].map((f) => (
                <input key={f.id} placeholder={f.ph} />
              ))}
              <button onClick={() => navigate('find-jugaad')} className="btn-primary w-full py-3">
                REQUEST IT →
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((event) => (
              <div
                key={event.id}
                className="rounded-lg overflow-hidden card-glow cursor-pointer"
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
                onClick={() => navigate('event-detail', { eventId: event.id })}
              >
                <div className="flex gap-0">
                  <div className="relative w-[110px] flex-shrink-0 bg-zinc-900">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.2)' }} />
                    <div
                      className="absolute top-2 left-2 font-display font-black text-white px-1.5 py-0.5 rounded text-[11px]"
                      style={{ background: '#FF5500' }}
                    >
                      {event.dateShort}
                    </div>
                    {event.jugaadDrop && (
                      <div className="absolute bottom-2 left-2">
                        <span className="text-[9px] font-bold px-1 py-0.5 rounded" style={{ background: '#FF5500', color: 'white' }}>⚡DROP</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-3 min-w-0">
                    <div className="font-display font-black text-white text-base leading-tight mb-1 truncate">{event.name}</div>
                    <div className="text-white/40 text-xs mb-1.5 truncate">📍 {event.venue}</div>

                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-display font-bold text-sm" style={{ color: '#FF5500' }}>{event.priceRange}</span>
                      <span className="font-display font-bold text-xs" style={{ color: AVAIL_COLOR[event.availability] }}>{event.availability}</span>
                    </div>

                    <div className="flex items-center gap-1 mb-2 flex-wrap">
                      {event.type.slice(0, 2).map((t) => (
                        <span key={t} className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-xs" style={{ color: DEMAND_COLOR[event.demand], fontSize: 11 }}>
                        {DEMAND_LABEL[event.demand]}
                      </span>
                      <button
                        className="font-display font-bold text-[11px] px-2 py-1 rounded"
                        style={{ background: '#FF5500', color: 'white', letterSpacing: '0.04em' }}
                        onClick={(e) => { e.stopPropagation(); navigate('event-detail', { eventId: event.id }); }}
                      >
                        REQUEST →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter drawer */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/70" onClick={() => setDrawerOpen(false)} />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl animate-slide-up overflow-y-auto"
            style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)', maxHeight: '80vh' }}
          >
            <div className="sticky top-0 flex items-center justify-between px-4 py-4" style={{ background: '#0d0d0d', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="font-display font-black text-white text-lg">FILTERS</span>
              <div className="flex gap-3">
                <button
                  onClick={() => setFilters({ ...filters, dates: [], budgets: [], locations: [], types: [], demands: [], avails: [] })}
                  className="text-xs text-white/40 hover:text-white transition-colors"
                >
                  CLEAR ALL
                </button>
                <button onClick={() => setDrawerOpen(false)} className="text-white/60 hover:text-white text-xl leading-none">✕</button>
              </div>
            </div>

            <div className="p-4 space-y-6 pb-8">
              {[
                { label: 'DATE', key: 'dates' as const, opts: DATE_FILTERS },
                { label: 'BUDGET', key: 'budgets' as const, opts: BUDGET_FILTERS },
                { label: 'LOCATION', key: 'locations' as const, opts: LOCATION_FILTERS },
                { label: 'EVENT TYPE', key: 'types' as const, opts: TYPE_FILTERS },
                { label: 'DEMAND', key: 'demands' as const, opts: DEMAND_FILTERS },
                { label: 'AVAILABILITY', key: 'avails' as const, opts: AVAIL_FILTERS },
              ].map(({ label, key, opts }) => (
                <div key={key}>
                  <div className="font-display font-bold text-xs tracking-widest text-white/30 mb-2">{label}</div>
                  <div className="flex flex-wrap gap-2">
                    {opts.map((o) => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => toggle(key, o)}
                        className={`chip ${(filters[key] as string[]).includes(o) ? 'active' : ''}`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button onClick={() => setDrawerOpen(false)} className="btn-primary w-full py-3.5">
                SHOW {filtered.length} RESULT{filtered.length !== 1 ? 'S' : ''}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
