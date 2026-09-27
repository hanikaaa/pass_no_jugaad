import { useState, useEffect } from 'react';
import { type NavProps, NAVRATRI_DATES, isSameDate, normalizeDateShort, parseDateForSorting } from '../data/events';
import { getAllSignals, getApprovedEvents } from '../lib/api';

interface RadarPoint {
  date: string;
  demand: 'Very High' | 'High' | 'Medium' | 'Low';
  people: number;
  passRange: string;
  budget: string;
  vibes: string[];
  demandPct: number;
}

const DEMAND_COLOR: Record<string, string> = {
  'Very High': '#C1440E',
  'High': '#7A1F2E',
  'Medium': '#9A8B82',
  'Low': '#6B5B52',
};

export default function Radar({ navigate }: NavProps) {
  const [radarPoints, setRadarPoints] = useState<RadarPoint[]>([]);
  const [totalSeekers, setTotalSeekers] = useState(0);
  const [avgGroup, setAvgGroup] = useState(2.4);
  const [nightsHot, setNightsHot] = useState('14/14');
  const [sortBy, setSortBy] = useState<'date' | 'demand'>('date');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [signals, events] = await Promise.all([
          getAllSignals(),
          getApprovedEvents(),
        ]);

        const sigs = signals ?? [];
        const evts = events ?? [];

        const totalPeople = sigs.reduce((acc, s) => acc + (s.num_passes || 1), 0);
        setTotalSeekers(totalPeople);
        setAvgGroup(sigs.length > 0 ? parseFloat((totalPeople / sigs.length).toFixed(1)) : 2.4);

        // Group by all canonical Navratri dates
        const dateMap: Record<string, { count: number; passes: number[]; budgets: number[]; types: Set<string> }> = {};
        const allDates = [...NAVRATRI_DATES];

        allDates.forEach(d => {
          dateMap[d] = { count: 0, passes: [], budgets: [], types: new Set() };
        });

        // Add events vibes and dates across all spanned dates
        evts.forEach(e => {
          if (e.date) {
            const matchedDates = allDates.filter(d => isSameDate(e.date, d));
            if (matchedDates.length > 0) {
              matchedDates.forEach(key => {
                if (!dateMap[key]) {
                  dateMap[key] = { count: 0, passes: [], budgets: [], types: new Set() };
                  allDates.push(key);
                }
                if (e.price_min) dateMap[key].budgets.push(e.price_min);
                if (e.price_max) dateMap[key].budgets.push(e.price_max);
                (e.type_tags ?? []).forEach(t => dateMap[key].types.add(t));
              });
            } else {
              const key = normalizeDateShort(e.date);
              if (!dateMap[key]) {
                dateMap[key] = { count: 0, passes: [], budgets: [], types: new Set() };
                allDates.push(key);
              }
              if (e.price_min) dateMap[key].budgets.push(e.price_min);
              if (e.price_max) dateMap[key].budgets.push(e.price_max);
              (e.type_tags ?? []).forEach(t => dateMap[key].types.add(t));
            }
          }
        });

        // Add real user signals
        sigs.forEach(s => {
          (s.preferred_dates ?? []).forEach(pd => {
            const matchedDates = allDates.filter(d => isSameDate(pd, d));
            if (matchedDates.length > 0) {
              matchedDates.forEach(key => {
                if (!dateMap[key]) {
                  dateMap[key] = { count: 0, passes: [], budgets: [], types: new Set() };
                  allDates.push(key);
                }
                dateMap[key].count += s.num_passes || 1;
                dateMap[key].passes.push(s.num_passes || 1);
                if (s.budget_min) dateMap[key].budgets.push(s.budget_min);
                if (s.budget_max) dateMap[key].budgets.push(s.budget_max);
                (s.event_types ?? []).forEach(t => dateMap[key].types.add(t));
              });
            } else {
              const key = normalizeDateShort(pd);
              if (!dateMap[key]) {
                dateMap[key] = { count: 0, passes: [], budgets: [], types: new Set() };
                allDates.push(key);
              }
              dateMap[key].count += s.num_passes || 1;
              dateMap[key].passes.push(s.num_passes || 1);
              if (s.budget_min) dateMap[key].budgets.push(s.budget_min);
              if (s.budget_max) dateMap[key].budgets.push(s.budget_max);
              (s.event_types ?? []).forEach(t => dateMap[key].types.add(t));
            }
          });
        });

        const activeCount = Object.values(dateMap).filter(info => info.count > 0 || info.budgets.length > 0).length;
        setNightsHot(`${activeCount || allDates.length}/${allDates.length}`);

        const allPoints: RadarPoint[] = Object.entries(dateMap).map(([date, info]) => {
          const peopleCount = info.count;
          const minBudget = info.budgets.length ? Math.min(...info.budgets) : 0;
          const maxBudget = info.budgets.length ? Math.max(...info.budgets) : 0;
          const minPass = info.passes.length ? Math.min(...info.passes) : 1;
          const maxPass = info.passes.length ? Math.max(...info.passes) : Math.max(1, info.count);
          const demandLevel: 'Very High' | 'High' | 'Medium' | 'Low' =
            peopleCount >= 10 ? 'Very High' : peopleCount >= 5 ? 'High' : peopleCount >= 1 ? 'Medium' : 'Low';
          const demandPct = totalPeople > 0
            ? Math.min(100, Math.max(10, Math.round((peopleCount / totalPeople) * 100)))
            : (demandLevel === 'Low' ? 12 : 35);

          return {
            date,
            demand: demandLevel,
            people: peopleCount,
            passRange: `${minPass}–${maxPass} passes`,
            budget: minBudget && maxBudget ? `₹${minBudget.toLocaleString()}–₹${maxBudget.toLocaleString()}` : 'Flexible',
            vibes: info.types.size > 0 ? Array.from(info.types).slice(0, 3) : ['Garba', 'Raas'],
            demandPct,
          };
        });

        setRadarPoints(allPoints);
      } catch (err) {
        console.error('Failed to load radar signals:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const sortedPoints = [...radarPoints].sort((a, b) => {
    if (sortBy === 'demand') {
      return b.people - a.people;
    }
    return parseDateForSorting(a.date) - parseDateForSorting(b.date);
  });

  return (
    <div className="px-5 py-6 pb-28" style={{ color: '#1A1612' }}>
      <div className="eyebrow mb-3">Community demand signal</div>
      <h1 style={{ fontSize: 'clamp(32px, 9vw, 48px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 8 }}>
        Navratri Radar
      </h1>
      <p style={{ fontSize: 14, color: '#6B5B52', marginBottom: 24 }}>What Ahmedabad is looking for. Real demand, real people.</p>

      {/* Aggregate stats */}
      <div className="card-light p-5 mb-6" style={{ borderColor: 'rgba(193,68,14,0.2)', background: 'rgba(193,68,14,0.04)' }}>
        <div className="eyebrow mb-4">Total demand this season</div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#1A1612', letterSpacing: '-0.02em' }}>
              {totalSeekers.toLocaleString()}
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginTop: 2 }}>Seekers</div>
          </div>
          <div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#1A1612', letterSpacing: '-0.02em' }}>
              {avgGroup}×
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginTop: 2 }}>Avg group</div>
          </div>
          <div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#C1440E', letterSpacing: '-0.02em' }}>
              {nightsHot}
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginTop: 2 }}>Nights active</div>
          </div>
        </div>
        <p style={{ fontSize: 11, color: '#9A8B82', marginTop: 12, textAlign: 'center' }}>
          Live aggregated community demand signals across Navratri 2026
        </p>
      </div>

      {/* Sort / View controls */}
      <div className="flex items-center justify-between mb-4">
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82' }}>
          All Navratri Nights ({sortedPoints.length})
        </div>
        <div className="flex gap-1.5 p-1 rounded-md bg-stone-200/60 text-xs">
          <button
            onClick={() => setSortBy('date')}
            className={`px-3 py-1 rounded transition-all font-semibold ${sortBy === 'date' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500'}`}
          >
            By Date
          </button>
          <button
            onClick={() => setSortBy('demand')}
            className={`px-3 py-1 rounded transition-all font-semibold ${sortBy === 'demand' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500'}`}
          >
            Top Demand
          </button>
        </div>
      </div>

      {/* Demand cards */}
      {loading ? (
        <div className="py-16 text-center text-stone-500">
          <div className="w-8 h-8 mx-auto border-2 border-stone-300 border-t-amber-800 rounded-full animate-spin mb-3" />
          <p className="text-xs">Loading live community radar...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedPoints.map((d) => (
            <div key={d.date} className="card-light p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1612', letterSpacing: '-0.01em' }}>{d.date}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: DEMAND_COLOR[d.demand] ?? '#9A8B82', marginTop: 2 }}>{d.demand} demand</div>
                </div>
                <div className="text-right">
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#1A1612', lineHeight: 1, letterSpacing: '-0.03em' }}>{d.people}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9A8B82', marginTop: 2 }}>looking</div>
                </div>
              </div>

              {/* Bar */}
              <div className="mb-4">
                <div className="rounded-full" style={{ height: 3, background: '#E5D9CC' }}>
                  <div className="rounded-full" style={{ height: 3, width: `${d.demandPct}%`, background: '#C1440E', transition: 'width 0.6s ease' }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="rounded-md p-3" style={{ background: '#FAF7F2', border: '1px solid rgba(26,22,18,0.07)' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginBottom: 4 }}>Group size</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1A1612' }}>{d.passRange}</div>
                </div>
                <div className="rounded-md p-3" style={{ background: '#FAF7F2', border: '1px solid rgba(26,22,18,0.07)' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginBottom: 4 }}>Top budget</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1A1612' }}>{d.budget}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  {d.vibes.map((v) => (
                    <span key={v} className="chip" style={{ padding: '3px 10px', fontSize: 11 }}>{v}</span>
                  ))}
                </div>
                <button onClick={() => navigate('find-jugaad')} className="btn-primary" style={{ padding: '7px 16px', fontSize: 12 }}>
                  Join Radar →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 rounded text-center" style={{ background: '#F0E8DC', border: '1px solid rgba(26,22,18,0.08)' }}>
        <p style={{ fontSize: 12, color: '#9A8B82', lineHeight: 1.6 }}>
          These community demand signals are generated live from user requests and organiser submissions.
        </p>
      </div>
    </div>
  );
}
