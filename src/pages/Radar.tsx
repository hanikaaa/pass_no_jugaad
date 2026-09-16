import { type NavProps } from '../data/events';

const RADAR_DATA = [
  { date: '12 Oct', demand: 'Very High', people: 212, passRange: '2–6 passes', budget: '₹1,500–₹2,500', vibes: ['Premium', 'Artist Night'], demandPct: 92 },
  { date: '15 Oct', demand: 'Very High', people: 318, passRange: '2–4 passes', budget: '₹1,200–₹2,500', vibes: ['Artist Night', 'Late Night'], demandPct: 96 },
  { date: '11 Oct', demand: 'High', people: 156, passRange: '4–8 passes', budget: '₹1,000–₹2,000', vibes: ['Garba', 'Family'], demandPct: 72 },
  { date: '19 Oct', demand: 'Very High', people: 445, passRange: '2–4 passes', budget: '₹2,000–₹3,000', vibes: ['Premium', 'Finale'], demandPct: 98 },
  { date: '13 Oct', demand: 'High', people: 189, passRange: '2–6 passes', budget: '₹800–₹1,500', vibes: ['DJ Night', 'Late Night'], demandPct: 78 },
  { date: '16 Oct', demand: 'High', people: 134, passRange: '2–4 passes', budget: '₹800–₹1,200', vibes: ['Dandiya'], demandPct: 68 },
];

const DEMAND_COLOR: Record<string, string> = {
  'Very High': '#C1440E',
  'High': '#7A1F2E',
  'Medium': '#9A8B82',
  'Low': '#6B5B52',
};

export default function Radar({ navigate }: NavProps) {
  return (
    <div className="px-5 py-6 pb-28" style={{ color: '#1A1612' }}>
      <div className="eyebrow mb-3">Community demand signal</div>
      <h1 style={{ fontSize: 'clamp(32px, 9vw, 48px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 8 }}>
        Navratri Radar
      </h1>
      <p style={{ fontSize: 14, color: '#6B5B52', marginBottom: 28 }}>What Ahmedabad is looking for. Real demand, real people.</p>

      {/* Aggregate stats */}
      <div className="card-light p-5 mb-6" style={{ borderColor: 'rgba(193,68,14,0.2)', background: 'rgba(193,68,14,0.04)' }}>
        <div className="eyebrow mb-4">Total demand this season</div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#1A1612', letterSpacing: '-0.02em' }}>1,454</div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginTop: 2 }}>Seekers</div>
          </div>
          <div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#1A1612', letterSpacing: '-0.02em' }}>2.4×</div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginTop: 2 }}>Avg group</div>
          </div>
          <div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#C1440E', letterSpacing: '-0.02em' }}>9/10</div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginTop: 2 }}>Nights hot</div>
          </div>
        </div>
        <p style={{ fontSize: 11, color: '#9A8B82', marginTop: 12, textAlign: 'center' }}>Demo data — community demand signals</p>
      </div>

      {/* Demand cards */}
      <div className="space-y-3">
        {RADAR_DATA.map((d) => (
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
              <button onClick={() => navigate('find-jugaad')} className="btn-primary" style={{ padding: '6px 14px', fontSize: 12 }}>
                Join →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded text-center" style={{ background: '#F0E8DC', border: '1px solid rgba(26,22,18,0.08)' }}>
        <p style={{ fontSize: 12, color: '#9A8B82', lineHeight: 1.6 }}>
          These are community demand signals. Numbers are illustrative and updated manually.
        </p>
      </div>
    </div>
  );
}
