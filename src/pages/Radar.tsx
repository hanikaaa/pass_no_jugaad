import { type NavProps } from '../data/events';

const RADAR_DATA = [
  {
    date: '12 OCT',
    demand: 'VERY HIGH',
    people: 212,
    passRange: '2–6 PASSES',
    budget: '₹1,500–₹2,500',
    vibes: ['Premium', 'Artist Night'],
    demandPct: 92,
  },
  {
    date: '15 OCT',
    demand: 'VERY HIGH',
    people: 318,
    passRange: '2–4 PASSES',
    budget: '₹1,200–₹2,500',
    vibes: ['Artist Night', 'Late Night'],
    demandPct: 96,
  },
  {
    date: '11 OCT',
    demand: 'HIGH',
    people: 156,
    passRange: '4–8 PASSES',
    budget: '₹1,000–₹2,000',
    vibes: ['Pure Garba', 'Family'],
    demandPct: 72,
  },
  {
    date: '19 OCT',
    demand: 'VERY HIGH',
    people: 445,
    passRange: '2–4 PASSES',
    budget: '₹2,000–₹3,000',
    vibes: ['Premium', 'Finale'],
    demandPct: 98,
  },
  {
    date: '13 OCT',
    demand: 'HIGH',
    people: 189,
    passRange: '2–6 PASSES',
    budget: '₹800–₹1,500',
    vibes: ['Youth', 'Late Night'],
    demandPct: 78,
  },
  {
    date: '16 OCT',
    demand: 'HIGH',
    people: 134,
    passRange: '2–4 PASSES',
    budget: '₹800–₹1,200',
    vibes: ['Artist Night'],
    demandPct: 68,
  },
];

const DEMAND_COLORS: Record<string, string> = {
  'VERY HIGH': '#ff3b3b',
  'HIGH': '#ff7b00',
  'MEDIUM': '#f5b800',
  'LOW': '#22d3ee',
};

export default function Radar({ navigate }: NavProps) {
  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-8">
        <div className="font-display font-bold text-xs tracking-widest mb-2" style={{ color: '#FF5500' }}>
          COMMUNITY DEMAND SIGNAL
        </div>
        <h1 className="font-display font-black leading-none mb-2" style={{ fontSize: 'clamp(44px, 12vw, 72px)', letterSpacing: '-0.02em' }}>
          NAVRATRI<br /><span style={{ color: '#FF5500' }}>RADAR</span>
        </h1>
        <p className="font-display font-bold text-sm text-white/50 uppercase tracking-wider mb-1">
          WHAT AHMEDABAD IS LOOKING FOR.
        </p>
        <p className="text-white/35 text-xs">Real demand. Real people. Real Ahmedabad.</p>
      </div>

      {/* Aggregate stats */}
      <div
        className="rounded-lg p-5 mb-6"
        style={{ background: 'rgba(255,85,0,0.06)', border: '1px solid rgba(255,85,0,0.15)' }}
      >
        <div className="font-display font-bold text-xs tracking-widest mb-3" style={{ color: '#FF5500' }}>
          TOTAL DEMAND THIS SEASON
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="font-display font-black text-white" style={{ fontSize: 32 }}>1,454</div>
            <div className="font-display font-bold text-white/30 text-[10px] tracking-widest">SEEKERS</div>
          </div>
          <div>
            <div className="font-display font-black text-white" style={{ fontSize: 32 }}>2.4x</div>
            <div className="font-display font-bold text-white/30 text-[10px] tracking-widest">AVG GROUP</div>
          </div>
          <div>
            <div className="font-display font-black" style={{ fontSize: 32, color: '#FF5500' }}>9/10</div>
            <div className="font-display font-bold text-white/30 text-[10px] tracking-widest">NIGHTS HOT</div>
          </div>
        </div>
        <p className="text-white/25 text-[10px] mt-3 text-center">* Demo data — community demand signals</p>
      </div>

      {/* Demand cards */}
      <div className="space-y-4">
        {RADAR_DATA.map((d) => (
          <div
            key={d.date}
            className="rounded-lg p-5"
            style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-display font-black text-white" style={{ fontSize: 28 }}>{d.date}</div>
                <div
                  className="font-display font-bold text-xs tracking-wide"
                  style={{ color: DEMAND_COLORS[d.demand] }}
                >
                  🔥 {d.demand} DEMAND
                </div>
              </div>
              <div className="text-right">
                <div className="font-display font-black text-white" style={{ fontSize: 36 }}>{d.people}</div>
                <div className="font-display font-semibold text-white/30 text-[10px] tracking-widest">PEOPLE LOOKING</div>
              </div>
            </div>

            {/* Demand bar */}
            <div className="mb-3">
              <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: `${d.demandPct}%`,
                    background: `linear-gradient(90deg, #FF5500, ${DEMAND_COLORS[d.demand]})`,
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div
                className="rounded-md p-3"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="font-display font-bold text-white/30 text-[10px] tracking-widest mb-1">GROUP SIZE</div>
                <div className="font-display font-bold text-white text-sm">{d.passRange}</div>
              </div>
              <div
                className="rounded-md p-3"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="font-display font-bold text-white/30 text-[10px] tracking-widest mb-1">TOP BUDGET</div>
                <div className="font-display font-bold text-white text-sm">{d.budget}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-1 flex-wrap">
                {d.vibes.map((v) => (
                  <span
                    key={v}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded"
                    style={{ background: 'rgba(255,85,0,0.1)', color: '#FF5500', border: '1px solid rgba(255,85,0,0.2)' }}
                  >
                    {v}
                  </span>
                ))}
              </div>
              <button
                onClick={() => navigate('find-jugaad')}
                className="font-display font-bold text-xs tracking-wide px-3 py-1.5 rounded"
                style={{ background: '#FF5500', color: 'white' }}
              >
                JOIN →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-6 rounded-lg p-4 text-center"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <p className="text-white/30 text-xs">
          These are community demand signals. Numbers are illustrative and updated manually.
        </p>
      </div>
    </div>
  );
}
