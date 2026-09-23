import { useState, useMemo, useEffect } from 'react';
import { type NavProps, EVENTS, DEMAND_LABEL, type Event, normalizeDateShort } from '../data/events';
import { getApprovedEvents } from '../lib/api';
import EventCard from '../components/EventCard';

const DATE_FILTERS = ['10 OCT', '11 OCT', '12 OCT', '13 OCT', '14 OCT', '15 OCT', '16 OCT', '17 OCT', '18 OCT', '19 OCT'];
const BUDGET_FILTERS = ['Under ₹1K', '₹1K–₹1.5K', '₹1.5K–₹2.5K', '₹2.5K+'];
const TYPE_FILTERS = ['Garba', 'Dandiya', 'DJ Night', 'Live Music', 'Bollywood Night', 'Club Night', 'Cultural Event', 'Artist Night', 'Premium'];
const SORT_OPTIONS = ['Recommended', 'Lowest Price', 'Highest Demand', 'Latest Added'];

interface Filters {
  search: string;
  dates: string[];
  budgets: string[];
  types: string[];
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
  const [eventsList, setEventsList] = useState<Event[]>(EVENTS);
  const [filters, setFilters] = useState<Filters>({
    search: '', dates: [], budgets: [], types: [], sort: 'Recommended',
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    getApprovedEvents().then((dbEvents) => {
      if (dbEvents && dbEvents.length > 0) {
        const mapped: Event[] = dbEvents.map((e, idx) => {
          const pMin = e.price_min || 800;
          const pMax = e.price_max || pMin;
          const priceFormatted = pMin === pMax ? `₹${pMin.toLocaleString('en-IN')}` : `₹${pMin.toLocaleString('en-IN')}–₹${pMax.toLocaleString('en-IN')}`;
          const dateStr = e.date || '12 OCT 2026';

          return {
            id: e.id,
            name: e.name,
            date: dateStr,
            dateShort: normalizeDateShort(dateStr),
            venue: e.venue || 'Ahmedabad',
            location: e.venue || 'Ahmedabad',
            time: e.time || '7:00 PM onwards',
            priceRange: priceFormatted,
            priceMin: pMin,
            priceMax: pMax,
            type: e.type_tags && e.type_tags.length ? e.type_tags : ['Garba'],
            demand: idx % 3 === 0 ? 'VERY HIGH' : idx % 2 === 0 ? 'HIGH' : 'MEDIUM',
            availability: 'Available',
            image: e.image_url || e.image || 'https://images.unsplash.com/photo-1786452156548-9a60189a9876?w=800&h=500&fit=crop&auto=format',
            artist: e.artist || undefined,
            artistImage: e.artist_image_url || undefined,
            description: e.description || '',
            featured: idx < 3,
            jugaadDrop: !!e.jugaad_drop,
            originalPrice: e.original_price || undefined,
            dropPrice: e.drop_price || undefined,
            dropNumber: e.drop_number || undefined,
          };
        });
        setEventsList(mapped);
      }
    });

  }, []);

  const toggle = <K extends keyof Filters>(key: K, val: string) => {
    const arr = filters[key] as string[];
    setFilters((f) => ({ ...f, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] }));
  };

  const filtered = useMemo(() => {
    let evts = eventsList.filter((e: Event) => {
      const q = filters.search.toLowerCase();
      if (q && !e.name.toLowerCase().includes(q) && !e.venue.toLowerCase().includes(q) && !(e.artist || '').toLowerCase().includes(q)) return false;
      if (filters.dates.length && !filters.dates.includes(e.dateShort)) return false;
      if (filters.budgets.length && !filters.budgets.some((b) => budgetMatch(e.priceMin, e.priceMax, b))) return false;
      if (filters.types.length && !filters.types.some((t) => e.type.some((et) => et.toLowerCase().includes(t.toLowerCase())))) return false;
      return true;
    });

    if (filters.sort === 'Lowest Price') evts = [...evts].sort((a, b) => a.priceMin - b.priceMin);
    if (filters.sort === 'Highest Demand') evts = [...evts].sort((a, b) => DEMAND_ORDER.indexOf(b.demand) - DEMAND_ORDER.indexOf(a.demand));
    return evts;
  }, [filters, eventsList]);

  const activeFilterCount = filters.dates.length + filters.budgets.length + filters.types.length;

  return (
    <div className="pb-24" style={{ color: '#1A1612' }}>
      <div className="px-5 py-7">
        <div className="eyebrow mb-2">Browse events</div>
        <h1 className="font-serif leading-tight mb-5" style={{ fontSize: 'clamp(36px, 10vw, 56px)', fontWeight: 500 }}>
          Find your<br /><span style={{ color: '#C1440E', fontStyle: 'italic' }}>event.</span>
        </h1>

        <div className="relative mb-3">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A8B82" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search events, artists, venues..."
            style={{ paddingLeft: 40 }}
          />
        </div>

        <div className="flex gap-2">
          <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })} className="flex-1" style={{ fontSize: 14 }}>
            {SORT_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button
            onClick={() => setDrawerOpen(true)}
            className="btn-outline flex items-center gap-2 px-4 py-2 relative"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Filter</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white flex items-center justify-center font-bold" style={{ background: '#C1440E', fontSize: 9 }}>
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="px-5">
        <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginBottom: 16 }}>
          {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
        </div>

        {filtered.length === 0 ? (
          <div className="card-light p-6">
            <h3 className="font-serif mb-2" style={{ fontSize: 22, fontWeight: 500 }}>{"Can't find it?"}</h3>
            <p style={{ fontSize: 14, color: '#6B5B52', marginBottom: 16 }}>Tell us what {"you're"} looking for and {"we'll"} track it.</p>
            <button onClick={() => navigate('find-jugaad')} className="btn-primary w-full py-3 text-sm">
              Request it →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} navigate={navigate} currentPage="events" />
            ))}
          </div>
        )}
      </div>

      {/* Filter drawer */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 z-50" style={{ background: 'rgba(26,22,18,0.35)', backdropFilter: 'blur(4px)' }} onClick={() => setDrawerOpen(false)} />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl overflow-y-auto animate-slide-up"
            style={{ background: '#FAF7F2', borderTop: '1px solid rgba(26,22,18,0.1)', maxHeight: '80vh' }}
          >
            <div className="sticky top-0 flex items-center justify-between px-5 py-4" style={{ background: '#FAF7F2', borderBottom: '1px solid rgba(26,22,18,0.07)' }}>
              <span className="font-serif" style={{ fontSize: 20, fontWeight: 500 }}>Filters</span>
              <div className="flex gap-4 items-center">
                <button onClick={() => setFilters({ ...filters, dates: [], budgets: [], types: [] })} style={{ fontSize: 13, color: '#9A8B82' }}>Clear all</button>
                <button onClick={() => setDrawerOpen(false)} style={{ fontSize: 18, color: '#6B5B52', lineHeight: 1 }}>✕</button>
              </div>
            </div>
            <div className="p-5 space-y-6 pb-8">
              {[
                { label: 'Date', key: 'dates' as const, opts: DATE_FILTERS },
                { label: 'Budget', key: 'budgets' as const, opts: BUDGET_FILTERS },
                { label: 'Event type', key: 'types' as const, opts: TYPE_FILTERS },
              ].map(({ label, key, opts }) => (
                <div key={key}>
                  <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B5B52', marginBottom: 10 }}>{label}</div>
                  <div className="flex flex-wrap gap-2">
                    {opts.map((o) => (
                      <button key={o} type="button" onClick={() => toggle(key, o)} className={`chip ${(filters[key] as string[]).includes(o) ? 'active' : ''}`}>{o}</button>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={() => setDrawerOpen(false)} className="btn-primary w-full py-3.5">
                Show {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
