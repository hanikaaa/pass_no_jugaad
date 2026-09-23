import React, { useState, useEffect } from 'react';
import { type NavProps } from '../data/events';
import {
  REQUEST_STATUS_LABEL, REQUEST_STATUS_STYLE, EVENT_STATUS_STYLE,
} from '../lib/mockData';
import {
  getPendingEvents, getAllEvents, getAllPassRequests, getAllSignals,
  getOrganisers, approveEvent, rejectEvent, updateRequestStatus, deleteEvent,
  getAllUsers, updateUserRole, createEventByAdmin, updateEventByAdmin,
  updatePassRequestWithOffer,
} from '../lib/api';
import { SUPABASE_CONFIGURED, type Profile, type DBEvent, type DBPassRequest, type DBJugaadSignal } from '../lib/supabase';


type AdminTab = 'overview' | 'pending' | 'events' | 'drops' | 'requests' | 'signals' | 'users' | 'organisers';

const TABS: { key: AdminTab; label: string; icon: string }[] = [
  { key: 'overview',   label: 'Overview', icon: '📊' },
  { key: 'pending',    label: 'Pending Review', icon: '⏳' },
  { key: 'events',     label: 'All Events', icon: '🎪' },
  { key: 'drops',      label: 'Jugaad Drops', icon: '⚡' },
  { key: 'requests',   label: 'Pass Requests', icon: '📋' },
  { key: 'signals',    label: 'Radar Signals', icon: '📡' },
  { key: 'users',      label: 'Users & Roles', icon: '👥' },
  { key: 'organisers', label: 'Organisers', icon: '🏢' },
];

const STATUS_NEXT: Record<string, string[]> = {
  request_received:    ['looking_for_options', 'closed'],
  looking_for_options: ['match_found', 'closed'],
  match_found:         ['offer_available', 'closed'],
  offer_available:     ['completed', 'closed'],
  completed:           [],
  closed:              [],
};

function StatusBadge({ status }: { status: string }) {
  const s = REQUEST_STATUS_STYLE[status] ?? { color: '#9A8B82', bg: 'rgba(154,139,130,0.08)', border: 'rgba(154,139,130,0.2)' };
  return (
    <span className="rounded-full px-2.5 py-1 flex-shrink-0" style={{ fontSize: 11, fontWeight: 600, color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
      {REQUEST_STATUS_LABEL[status] ?? status}
    </span>
  );
}

function EventStatusBadge({ status }: { status: string }) {
  const s = EVENT_STATUS_STYLE[status] ?? { color: '#9A8B82', bg: 'rgba(154,139,130,0.08)' };
  return (
    <span className="rounded-full px-2.5 py-1 flex-shrink-0" style={{ fontSize: 11, fontWeight: 600, color: s.color, background: s.bg }}>
      {status === 'pending_review' ? 'Pending review' : status === 'approved' ? 'Approved' : 'Rejected'}
    </span>
  );
}

function fmt(v: number | null | undefined) {
  if (!v) return '₹0';
  return v >= 1000 ? `₹${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}K` : `₹${v}`;
}

function relTime(iso: string | null | undefined) {
  if (!iso) return 'Recent';
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  return d <= 0 ? 'Today' : d === 1 ? 'Yesterday' : `${d}d ago`;
}

// ─── 1. Overview Tab ──────────────────────────────────────────
function OverviewTab({
  events, requests, signals, users, pendingCount, setTab, onSeedDatabase
}: {
  events: any[]; requests: any[]; signals: any[]; users: any[]; pendingCount: number;
  setTab: (t: AdminTab) => void; onSeedDatabase: () => void;
}) {
  const totalDemandPasses = signals.reduce((s, x) => s + (x.num_passes || 0), 0);
  const requestedPasses = requests.reduce((s, x) => s + (x.quantity || 0), 0);
  const estimatedRevenue = requests.reduce((s, x) => s + ((x.quantity || 1) * ((x.budget_min || 0) + (x.budget_max || 0)) / 2), 0);
  const completedRequests = requests.filter(r => r.status === 'completed').length;
  const activeRequests = requests.filter(r => !['completed', 'closed'].includes(r.status)).length;

  return (
    <div className="space-y-6">
      {/* Top Banner / System Health */}
      <div className="rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ background: '#F0E8DC', border: '1px solid rgba(26,22,18,0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1612' }}>
              System Status: {SUPABASE_CONFIGURED ? 'Live Database Connected' : 'Simulated Active Mode'}
            </div>
            <div style={{ fontSize: 12, color: '#6B5B52' }}>
              PostgreSQL DB • Realtime Pipeline Active • Live notifications active
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('pending')}
            className="btn-outline py-2 px-3 text-xs font-semibold"
            style={{ borderColor: 'rgba(193,68,14,0.3)', color: '#C1440E' }}
          >
            Review Pending ({pendingCount})
          </button>
        </div>
      </div>


      {/* Main KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="card-light p-4 cursor-pointer hover:shadow-md transition-all" onClick={() => setTab('users')}>
          <div className="flex items-center justify-between mb-1">
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#9A8B82' }}>Total Registered</span>
            <span>👥</span>
          </div>
          <div className="font-serif" style={{ fontSize: 26, fontWeight: 600, color: '#1A1612' }}>{users.length}</div>
          <div style={{ fontSize: 11, color: '#6B5B52', marginTop: 2 }}>
            {users.filter(u => u.role === 'buyer').length} buyers · {users.filter(u => u.role === 'organiser').length} orgs
          </div>
        </div>

        <div className="card-light p-4 cursor-pointer hover:shadow-md transition-all" onClick={() => setTab('events')}>
          <div className="flex items-center justify-between mb-1">
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#9A8B82' }}>Events In Registry</span>
            <span>🎪</span>
          </div>
          <div className="font-serif" style={{ fontSize: 26, fontWeight: 600, color: '#C1440E' }}>{events.length}</div>
          <div style={{ fontSize: 11, color: '#6B5B52', marginTop: 2 }}>
            {events.filter(e => e.status === 'approved').length} live approved · {pendingCount} pending
          </div>
        </div>

        <div className="card-light p-4 cursor-pointer hover:shadow-md transition-all" onClick={() => setTab('requests')}>
          <div className="flex items-center justify-between mb-1">
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#9A8B82' }}>Pass Pipeline</span>
            <span>📋</span>
          </div>
          <div className="font-serif" style={{ fontSize: 26, fontWeight: 600, color: '#1A1612' }}>{requests.length}</div>
          <div style={{ fontSize: 11, color: '#6B5B52', marginTop: 2 }}>
            {activeRequests} hunting/offer · {completedRequests} completed
          </div>
        </div>

        <div className="card-light p-4 cursor-pointer hover:shadow-md transition-all" onClick={() => setTab('signals')}>
          <div className="flex items-center justify-between mb-1">
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#9A8B82' }}>Pipeline GMV Potential</span>
            <span>💰</span>
          </div>
          <div className="font-serif" style={{ fontSize: 26, fontWeight: 600, color: '#2D7A4F' }}>
            {fmt(Math.round(estimatedRevenue))}
          </div>
          <div style={{ fontSize: 11, color: '#6B5B52', marginTop: 2 }}>
            {requestedPasses + totalDemandPasses} total passes sought
          </div>
        </div>
      </div>

      {/* Demand Hotspots & Quick Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pass Requests Status Funnel */}
        <div className="card-light p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="eyebrow mb-0.5">Pipeline Funnel</div>
              <div className="font-serif" style={{ fontSize: 18, fontWeight: 600 }}>Pass Request Stages</div>
            </div>
            <button onClick={() => setTab('requests')} className="btn-ghost text-xs font-semibold">View all →</button>
          </div>

          <div className="space-y-3">
            {[
              { key: 'request_received', label: 'Received & Queued', color: '#6B5B52' },
              { key: 'looking_for_options', label: 'Hunting / In Progress', color: '#C1440E' },
              { key: 'match_found', label: 'Match Found', color: '#7A1F2E' },
              { key: 'offer_available', label: 'Offer Sent to Buyer', color: '#2D7A4F' },
              { key: 'completed', label: 'Completed Deals', color: '#10643B' },
              { key: 'closed', label: 'Closed / Cancelled', color: '#9A8B82' },
            ].map(item => {
              const count = requests.filter(r => r.status === item.key).length;
              const pct = requests.length ? Math.round((count / requests.length) * 100) : 0;
              return (
                <div key={item.key}>
                  <div className="flex justify-between text-xs font-semibold mb-1" style={{ color: '#1A1612' }}>
                    <span>{item.label}</span>
                    <span>{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(26,22,18,0.06)' }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: item.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Signals & Seeker Radar Overview */}
        <div className="card-light p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="eyebrow mb-0.5">Radar Intelligence</div>
              <div className="font-serif" style={{ fontSize: 18, fontWeight: 600 }}>Recent Buyer Signals</div>
            </div>
            <button onClick={() => setTab('signals')} className="btn-ghost text-xs font-semibold">Explore Radar →</button>
          </div>

          <div className="space-y-3">
            {signals.slice(0, 4).map(sig => (
              <div key={sig.id} className="p-3 rounded-lg flex items-center justify-between"
                style={{ background: '#FAF7F2', border: '1px solid rgba(26,22,18,0.06)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1612' }}>{sig.buyer_name || sig.buyer_email || 'Pass Seeker'}</div>
                  <div style={{ fontSize: 11, color: '#9A8B82', marginTop: 1 }}>
                    {sig.preferred_dates?.join(', ') || 'Any date'} · {sig.num_passes} passes · {fmt(sig.budget_min)}–{fmt(sig.budget_max)}
                    {sig.buyer_phone && <span className="ml-2 text-emerald-800 font-semibold">📞 {sig.buyer_phone}</span>}
                  </div>
                </div>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{
                  color: sig.readiness === 'ready' ? '#2D7A4F' : '#C1440E',
                  background: sig.readiness === 'ready' ? 'rgba(45,122,79,0.1)' : 'rgba(193,68,14,0.1)',
                }}>
                  {sig.readiness ?? 'exploring'}
                </span>
              </div>
            ))}
            {signals.length === 0 && (
              <div className="text-center py-6 text-sm text-stone-500">No signals registered yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 2. Pending Review tab ────────────────────────────────────
function PendingTab({ onRefresh }: { onRefresh: () => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;
    getPendingEvents().then(data => setItems(data));
  }, []);


  const approve = async (id: string) => {
    setProcessing(id);
    await approveEvent(id);
    setItems(p => p.filter(e => e.id !== id));
    setProcessing(null);
    onRefresh();
  };

  const reject = async (id: string) => {
    setProcessing(id);
    await rejectEvent(id, reason);
    setItems(p => p.filter(e => e.id !== id));
    setRejecting(null);
    setReason('');
    setProcessing(null);
    onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="eyebrow mb-1">Awaiting your review</div>
          <div className="font-serif" style={{ fontSize: 22, fontWeight: 500 }}>Pending Event Submissions</div>
        </div>
        <div className="rounded-full px-3 py-1 font-bold" style={{ background: 'rgba(193,68,14,0.08)', fontSize: 13, color: '#C1440E' }}>
          {items.length} pending
        </div>
      </div>

      {items.length === 0 && (
        <div className="card-light p-10 text-center">
          <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1A1612', marginBottom: 4 }}>All clear</div>
          <div style={{ fontSize: 13, color: '#9A8B82' }}>No organiser events currently awaiting review.</div>
        </div>
      )}

      <div className="space-y-4">
        {items.map(ev => {
          const pMin = ev.price_min || 0;
          const pMax = ev.price_max || pMin;
          const priceStr = pMin === pMax && pMin > 0 ? `₹${pMin.toLocaleString('en-IN')}` : pMin > 0 ? `₹${pMin.toLocaleString('en-IN')}–₹${pMax.toLocaleString('en-IN')}` : (ev.price ? `₹${ev.price}` : 'TBA');
          const imgUrl = ev.image_url || ev.image;
          const artistImg = ev.artist_image_url;

          return (
            <div key={ev.id} className="card-light p-5">
              {imgUrl && (
                <div className="relative h-44 rounded-lg overflow-hidden mb-4 bg-stone-100">
                  <img src={imgUrl} alt={ev.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1612', marginBottom: 2 }}>{ev.name}</div>
                  <div style={{ fontSize: 13, color: '#9A8B82' }}>
                    {ev.organiser || ev.profiles?.name || 'Organiser'} · <a href={`mailto:${ev.email || ev.contact_email || ev.profiles?.email}`} style={{ color: '#C1440E' }}>{ev.email || ev.contact_email || ev.profiles?.email}</a>
                    {ev.contact_phone && (
                      <span className="ml-2 font-semibold text-emerald-800">· 📞 <a href={`tel:${ev.contact_phone}`}>{ev.contact_phone}</a></span>
                    )}
                  </div>
                </div>
                <EventStatusBadge status="pending_review" />
              </div>

              {/* Artist Card if provided */}
              {ev.artist && (
                <div className="p-3 rounded-lg mb-3 flex items-center gap-3 bg-amber-50/70 border border-amber-200">
                  {artistImg ? (
                    <img src={artistImg} alt={ev.artist} className="w-10 h-10 rounded-full object-cover border border-amber-900/30" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center font-bold text-amber-900">🎤</div>
                  )}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900">Featured Artist / DJ</div>
                    <div className="text-sm font-bold text-stone-900">{ev.artist}</div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  { l: 'Date', v: ev.date || 'TBA' },
                  { l: 'Venue', v: ev.venue || 'TBA' },
                  { l: 'Ticket Price', v: priceStr },
                  { l: 'Submitted', v: relTime(ev.submitted_at || ev.created_at) },
                ].map(d => (
                  <div key={d.l} className="rounded-md p-3" style={{ background: '#FAF7F2', border: '1px solid rgba(26,22,18,0.07)' }}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginBottom: 3 }}>{d.l}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1A1612' }}>{d.v}</div>
                  </div>
                ))}
              </div>

              {ev.type_tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {ev.type_tags.map((t: string) => <span key={t} className="chip" style={{ padding: '2px 10px', fontSize: 11 }}>{t}</span>)}
                </div>
              )}

              {ev.description && (
                <p style={{ fontSize: 13, color: '#6B5B52', marginBottom: 12, lineHeight: 1.5 }}>
                  {ev.description}
                </p>
              )}

            {rejecting === ev.id ? (
              <div className="space-y-2 mt-3 pt-3 border-t">
                <textarea
                  placeholder="Reason for rejection (feedback will be emailed to organiser)…"
                  rows={2}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full p-2.5 rounded text-xs"
                />
                <div className="flex gap-2">
                  <button onClick={() => { setRejecting(null); setReason(''); }} className="btn-outline flex-1 py-2 text-xs">Cancel</button>
                  <button onClick={() => reject(ev.id)} disabled={processing === ev.id} className="flex-1 py-2 text-xs rounded font-semibold text-white bg-red-800">
                    {processing === ev.id ? 'Rejecting...' : 'Confirm Reject'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => approve(ev.id)} disabled={processing === ev.id} className="btn-primary flex-1 py-2.5 text-xs font-semibold">
                  {processing === ev.id ? 'Approving...' : '✓ Approve & Publish Live'}
                </button>
                <button onClick={() => setRejecting(ev.id)} className="btn-outline flex-1 py-2.5 text-xs font-semibold">
                  Reject Submission
                </button>
              </div>
            )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 3. All Events Tab (with Add / Edit / Delete matching Organiser Form) ─
function AllEventsTab({ navigate, onRefresh }: { navigate: NavProps['navigate']; onRefresh: () => void }) {
  const [search, setSearch] = useState('');
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formVenue, setFormVenue] = useState('');
  const [formDate, setFormDate] = useState('12 OCT 2026');
  const [formTime, setFormTime] = useState('7:00 PM onwards');
  const [formPrice, setFormPrice] = useState('1000');
  const [formBannerUrl, setFormBannerUrl] = useState('');
  const [formArtistUrl, setFormArtistUrl] = useState('');
  const [formArtist, setFormArtist] = useState('');
  const [formTags, setFormTags] = useState('Garba, Artist Night');
  const [formDesc, setFormDesc] = useState('');
  const [formOrgName, setFormOrgName] = useState('');
  const [formContactEmail, setFormContactEmail] = useState('');
  const [formContactPhone, setFormContactPhone] = useState('');
  const [formInstagram, setFormInstagram] = useState('');
  const [formIsDrop, setFormIsDrop] = useState(false);
  const [formDropPrice, setFormDropPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');

  const bannerFileRef = React.useRef<HTMLInputElement>(null);
  const artistFileRef = React.useRef<HTMLInputElement>(null);

  const loadData = () => {
    if (!SUPABASE_CONFIGURED) return;
    getAllEvents().then(data => {
      setAllEvents((data ?? []).map((e: any) => {
        const pMin = e.price_min || 0;
        const pMax = e.price_max || pMin;
        const priceFormatted = pMin === pMax && pMin > 0 ? `₹${pMin.toLocaleString('en-IN')}` : pMin > 0 ? `₹${pMin.toLocaleString('en-IN')}–₹${pMax.toLocaleString('en-IN')}` : '—';

        return {
          id: e.id, name: e.name, dateShort: e.date, venue: e.venue,
          priceRange: priceFormatted,
          price_min: pMin, price_max: pMax,
          image_url: e.image_url || e.image || '',
          artist_image_url: e.artist_image_url || '',
          contact_email: e.contact_email || '',
          contact_phone: e.contact_phone || '',
          jugaad_drop: e.jugaad_drop,
          original_price: e.original_price,
          drop_price: e.drop_price,
          demand: 'MEDIUM', type_tags: e.type_tags ?? [], status: e.status, artist: e.artist, description: e.description
        };
      }));
    });
  };

  useEffect(() => { loadData(); }, []);

  const openAddModal = () => {
    setEditingEvent(null);
    setFormName(''); setFormVenue(''); setFormDate('12 OCT 2026'); setFormTime('7:00 PM onwards');
    setFormPrice('1000'); setFormBannerUrl(''); setFormArtistUrl(''); setFormArtist(''); setFormTags('Garba, Artist Night'); setFormDesc('');
    setFormOrgName(''); setFormContactEmail('passnojugaadd@gmail.com'); setFormContactPhone(''); setFormInstagram('');
    setFormIsDrop(false); setFormDropPrice(''); setFormOriginalPrice('1500');
    setModalOpen(true);
  };

  const openEditModal = (ev: any) => {
    setEditingEvent(ev);
    setFormName(ev.name); setFormVenue(ev.venue || ''); setFormDate(ev.dateShort || ''); setFormTime(ev.time || '7:00 PM onwards');
    setFormPrice(String(ev.price_min || 1000)); setFormBannerUrl(ev.image_url || ''); setFormArtistUrl(ev.artist_image_url || '');
    setFormArtist(ev.artist || ''); setFormTags(ev.type_tags?.join(', ') || ''); setFormDesc(ev.description || '');
    setFormOrgName(''); setFormContactEmail(ev.contact_email || ''); setFormContactPhone(ev.contact_phone || '');
    setFormInstagram(ev.instagram_link || '');
    setFormIsDrop(!!ev.jugaad_drop);
    setFormDropPrice(ev.drop_price ? String(ev.drop_price) : '');
    setFormOriginalPrice(ev.original_price ? String(ev.original_price) : String(ev.price_min || 1500));
    setModalOpen(true);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFormBannerUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleArtistUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFormArtistUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceVal = parseInt(formPrice) || 0;
    const dropPriceVal = parseInt(formDropPrice) || priceVal;
    const origPriceVal = parseInt(formOriginalPrice) || priceVal;

    const eventPayload: any = {
      name: formName,
      venue: formVenue,
      date: formDate,
      time: formTime,
      price_min: priceVal,
      price_max: priceVal,
      image_url: formBannerUrl || null,
      artist_image_url: formArtistUrl || null,
      artist: formArtist || null,
      type_tags: formTags.split(',').map(t => t.trim()).filter(Boolean),
      description: formDesc || null,
      contact_email: formContactEmail || null,
      contact_phone: formContactPhone || null,
      instagram_link: formInstagram || null,
      jugaad_drop: formIsDrop,
      drop_price: formIsDrop ? dropPriceVal : null,
      original_price: formIsDrop ? origPriceVal : null,
    };

    if (editingEvent) {
      await updateEventByAdmin(editingEvent.id, eventPayload);
    } else {
      await createEventByAdmin(eventPayload);
    }

    setModalOpen(false);
    loadData();
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    await deleteEvent(id);
    setAllEvents(p => p.filter(e => e.id !== id));
    onRefresh();
  };

  const filtered = allEvents.filter(e =>
    (!search || e.name.toLowerCase().includes(search.toLowerCase()) || (e.venue ?? '').toLowerCase().includes(search.toLowerCase())) &&
    (filterStatus === 'all' || e.status === filterStatus)
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="eyebrow mb-1">Catalog Management</div>
          <div className="font-serif" style={{ fontSize: 22, fontWeight: 500 }}>All Events Registry</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={openAddModal} className="btn-primary py-2 px-3 text-xs font-semibold">
            + Create New Event
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by event name, artist, venue…"
            className="w-full text-xs"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="text-xs p-2 rounded"
          style={{ width: 'auto' }}
        >
          <option value="all">All Statuses</option>
          <option value="approved">Approved Live</option>
          <option value="pending_review">Pending Review</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(ev => (
          <div key={ev.id} className="card-light p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              {ev.image_url ? (
                <img src={ev.image_url} alt={ev.name} className="w-14 h-14 rounded-md object-cover flex-shrink-0 bg-stone-200" />
              ) : (
                <div className="w-14 h-14 rounded-md bg-stone-200 flex items-center justify-center flex-shrink-0 text-lg">🎪</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#1A1612' }}>{ev.name}</span>
                  <EventStatusBadge status={ev.status} />
                  {ev.jugaad_drop && <span className="chip text-[10px] py-0.5 px-2 bg-red-100 text-red-900 font-bold">⚡ Jugaad Drop</span>}
                  {ev.artist && (
                    <span className="chip text-[10px] py-0.5 px-2 bg-amber-100 text-amber-900 font-semibold inline-flex items-center gap-1">
                      {ev.artist_image_url && <img src={ev.artist_image_url} alt="" className="w-3 h-3 rounded-full" />}
                      {ev.artist}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#9A8B82' }}>
                  {ev.dateShort} · {ev.venue} · {ev.priceRange}
                  {ev.contact_phone && <span> · 📞 {ev.contact_phone}</span>}
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {ev.type_tags?.slice(0, 3).map((t: string) => (
                    <span key={t} className="chip text-[10px] py-0.5 px-2">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => navigate('event-detail', { eventId: ev.id })} className="btn-outline px-2.5 py-1.5 text-xs font-semibold">View Page</button>
              <button onClick={() => openEditModal(ev)} className="btn-outline px-2.5 py-1.5 text-xs font-semibold">Edit</button>
              <button onClick={() => handleDelete(ev.id)} className="px-2.5 py-1.5 text-xs rounded font-semibold text-red-800 bg-red-50 hover:bg-red-100">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Event Modal (Matching Organiser Form UI) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,22,18,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-xl card-light p-6 max-h-[90vh] overflow-y-auto" style={{ background: '#FAF7F2' }}>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-stone-200">
              <div>
                <div className="eyebrow text-[10px]">Super Admin Event Publisher</div>
                <h2 className="font-serif text-xl font-bold">
                  {editingEvent ? 'Edit Event Listing' : 'Create New Event Listing'}
                </h2>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-700 text-xl font-bold">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Section 1: Organiser Details */}
              <div className="card-light p-3.5 space-y-3 bg-white">
                <div className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">1. Organiser / Contact Details</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-semibold block mb-1">Organiser Name / Brand</label>
                    <input value={formOrgName} onChange={e => setFormOrgName(e.target.value)} placeholder="e.g. Pass No Jugaad Curations" />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Contact Email *</label>
                    <input type="email" required value={formContactEmail} onChange={e => setFormContactEmail(e.target.value)} placeholder="organiser@email.com" />
                  </div>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Contact Phone Number *</label>
                  <input type="tel" value={formContactPhone} onChange={e => setFormContactPhone(e.target.value)} placeholder="+91 98765 43210" />
                </div>
              </div>

              {/* Section 2: Banner Image */}
              <div className="card-light p-3.5 space-y-2 bg-white">
                <div className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">2. Event Banner Image</div>
                <input ref={bannerFileRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
                {formBannerUrl ? (
                  <div className="relative rounded-lg overflow-hidden h-36 bg-stone-100">
                    <img src={formBannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setFormBannerUrl('')} className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <button type="button" onClick={() => bannerFileRef.current?.click()} className="btn-outline py-2 px-3 text-xs flex-1">
                      📁 Upload Banner Image (JPG/PNG)
                    </button>
                    <input value={formBannerUrl} onChange={e => setFormBannerUrl(e.target.value)} placeholder="Or paste image URL" className="flex-1" />
                  </div>
                )}
              </div>

              {/* Section 3: Artist Photo */}
              <div className="card-light p-3.5 space-y-2 bg-white">
                <div className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">3. Featured Artist / Performer Photo</div>
                <input ref={artistFileRef} type="file" accept="image/*" className="hidden" onChange={handleArtistUpload} />
                {formArtistUrl ? (
                  <div className="flex items-center gap-3 p-2 rounded bg-amber-50 border border-amber-200">
                    <img src={formArtistUrl} alt="Artist Preview" className="w-12 h-12 rounded-full object-cover border" />
                    <div className="flex-1">
                      <div className="font-bold text-stone-900">{formArtist || 'Artist Photo'}</div>
                      <div className="text-[10px] text-stone-500">Photo attached</div>
                    </div>
                    <button type="button" onClick={() => setFormArtistUrl('')} className="text-red-700 text-xs font-semibold px-2 py-1">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <button type="button" onClick={() => artistFileRef.current?.click()} className="btn-outline py-2 px-3 text-xs flex-1">
                      🎤 Upload Artist Photo (Avatar)
                    </button>
                    <input value={formArtistUrl} onChange={e => setFormArtistUrl(e.target.value)} placeholder="Or paste artist image URL" className="flex-1" />
                  </div>
                )}
              </div>

              {/* Section 4: Event Core Info */}
              <div className="card-light p-3.5 space-y-3 bg-white">
                <div className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">4. Event Information</div>
                <div>
                  <label className="font-semibold block mb-1">Event Name *</label>
                  <input required value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. SBR Grand Garba 2026" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Venue / Location *</label>
                  <input required value={formVenue} onChange={e => setFormVenue(e.target.value)} placeholder="Sindhu Bhavan Road, Ahmedabad" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold block mb-1">Date (Any custom date) *</label>
                    <input required value={formDate} onChange={e => setFormDate(e.target.value)} placeholder="e.g. 7th October 2026, 12 OCT" />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Time</label>
                    <input value={formTime} onChange={e => setFormTime(e.target.value)} placeholder="7:00 PM onwards" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold block mb-1">Ticket Price (₹) *</label>
                    <input type="number" required value={formPrice} onChange={e => setFormPrice(e.target.value)} placeholder="1000" />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Featured Artist Name</label>
                    <input value={formArtist} onChange={e => setFormArtist(e.target.value)} placeholder="DJ Chetas, Kinjal Dave" />
                  </div>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Tags (comma separated)</label>
                  <input value={formTags} onChange={e => setFormTags(e.target.value)} placeholder="Garba, Artist Night, Premium" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Description</label>
                  <textarea rows={3} value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Describe the vibe, passes, details…" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Instagram Link</label>
                  <input value={formInstagram} onChange={e => setFormInstagram(e.target.value)} placeholder="https://instagram.com/..." />
                </div>
              </div>

              {/* Section 5: Jugaad Drop Feature */}
              <div className="card-light p-3.5 space-y-3 bg-amber-50/50 border border-amber-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 uppercase tracking-wider text-[10px]">⚡ Jugaad Flash Drop Option</span>
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-amber-900">
                    <input type="checkbox" checked={formIsDrop} onChange={e => setFormIsDrop(e.target.checked)} className="rounded" />
                    <span>Enable as Jugaad Drop</span>
                  </label>
                </div>
                {formIsDrop && (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div>
                      <label className="font-semibold block mb-1 text-stone-700">Original Price (₹)</label>
                      <input type="number" value={formOriginalPrice} onChange={e => setFormOriginalPrice(e.target.value)} placeholder="1500" />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1 text-stone-700">Drop Price (Discounted ₹) *</label>
                      <input type="number" value={formDropPrice} onChange={e => setFormDropPrice(e.target.value)} placeholder="999" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3 border-t border-stone-200">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1 py-3">Cancel</button>
                <button type="submit" className="btn-primary flex-1 py-3 text-sm font-bold">
                  {editingEvent ? 'Save & Update Event' : '✓ Save & Publish Live'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 3.5 Dedicated Jugaad Drops Tab in Admin ──────────────────
function JugaadDropsTab({ onRefresh }: { onRefresh: () => void }) {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [origPrice, setOrigPrice] = useState('1500');
  const [dropPrice, setDropPrice] = useState('999');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadEvents = () => {
    if (!SUPABASE_CONFIGURED) return;
    getAllEvents().then(data => setEvents(data ?? []));
  };

  useEffect(() => { loadEvents(); }, []);

  const activeDrops = events.filter(e => e.jugaad_drop);

  const handleCreateDrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) return;
    setSaving(true);
    const orig = parseInt(origPrice) || 1500;
    const drop = parseInt(dropPrice) || 999;

    await updateEventByAdmin(selectedEventId, {
      jugaad_drop: true,
      original_price: orig,
      drop_price: drop,
      drop_number: activeDrops.length + 1,
    });

    setSaving(false);
    setModalOpen(false);
    loadEvents();
    onRefresh();
  };

  const handleRemoveDrop = async (id: string) => {
    if (!confirm('Remove Jugaad Drop status from this event?')) return;
    await updateEventByAdmin(id, {
      jugaad_drop: false,
      drop_price: null,
      original_price: null,
    });
    loadEvents();
    onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="eyebrow mb-1">⚡ Flash Allocations</div>
          <div className="font-serif" style={{ fontSize: 22, fontWeight: 500 }}>Jugaad Drops Manager</div>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary py-2 px-3 text-xs font-semibold">
          + Create New Jugaad Drop
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        <div className="card-light p-3 text-center">
          <div className="font-serif text-2xl font-bold text-amber-900">{activeDrops.length}</div>
          <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Active Drops Live</div>
        </div>
        <div className="card-light p-3 text-center">
          <div className="font-serif text-2xl font-bold text-emerald-800">
            {activeDrops.length ? `₹${Math.round(activeDrops.reduce((acc, d) => acc + (d.drop_price || 0), 0) / activeDrops.length)}` : '—'}
          </div>
          <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Avg Drop Price</div>
        </div>
        <div className="card-light p-3 text-center col-span-2 sm:col-span-1">
          <div className="font-serif text-2xl font-bold text-stone-900">{events.length}</div>
          <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Total Eligible Events</div>
        </div>
      </div>

      <div className="space-y-3">
        {activeDrops.map(ev => {
          const savings = ev.original_price && ev.drop_price && ev.original_price > ev.drop_price
            ? Math.round(((ev.original_price - ev.drop_price) / ev.original_price) * 100)
            : null;

          return (
            <div key={ev.id} className="card-light p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-2 border-amber-600/20 bg-amber-50/30">
              <div className="flex items-center gap-3">
                {ev.image_url ? (
                  <img src={ev.image_url} alt="" className="w-14 h-14 rounded-md object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-md bg-stone-200 flex items-center justify-center text-xl">⚡</div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-stone-900">{ev.name}</span>
                    <span className="chip text-[10px] py-0.5 px-2 bg-amber-100 text-amber-900 font-bold">⚡ Active Drop</span>
                    {savings && <span className="chip text-[10px] py-0.5 px-2 bg-emerald-100 text-emerald-900 font-bold">Save {savings}%</span>}
                  </div>
                  <div className="text-xs text-stone-600 mt-0.5">
                    {ev.date} · {ev.venue} · <strong>Drop Price: ₹{ev.drop_price}</strong> (Original: ₹{ev.original_price})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handleRemoveDrop(ev.id)} className="btn-outline px-3 py-1.5 text-xs text-red-800 hover:bg-red-50">
                  Deactivate Drop
                </button>
              </div>
            </div>
          );
        })}

        {activeDrops.length === 0 && (
          <div className="card-light p-8 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <div className="font-serif text-lg font-semibold text-stone-800">No Active Jugaad Drops</div>
            <p className="text-xs text-stone-500 mt-1 mb-4">Click "+ Create New Jugaad Drop" to discount an approved event and feature it on the Drops page.</p>
            <button onClick={() => setModalOpen(true)} className="btn-primary py-2 px-4 text-xs font-semibold">
              Create First Drop →
            </button>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,22,18,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md card-light p-6" style={{ background: '#FAF7F2' }}>
            <div className="flex justify-between items-center mb-3 pb-2 border-b">
              <h2 className="font-serif text-lg font-bold">⚡ Create a Jugaad Drop</h2>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 text-lg font-bold">✕</button>
            </div>
            <form onSubmit={handleCreateDrop} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold block mb-1 text-stone-700">Select Event to Discount *</label>
                <select required value={selectedEventId} onChange={e => {
                  setSelectedEventId(e.target.value);
                  const ev = events.find(x => x.id === e.target.value);
                  if (ev) {
                    setOrigPrice(String(ev.price_min || 1500));
                    setDropPrice(String(Math.round((ev.price_min || 1500) * 0.75)));
                  }
                }} className="w-full p-2.5 rounded border border-stone-300">
                  <option value="">-- Choose an event --</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name} ({ev.date} - ₹{ev.price_min || 1000})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1 text-stone-700">Original Price (₹) *</label>
                  <input type="number" required value={origPrice} onChange={e => setOrigPrice(e.target.value)} placeholder="1500" />
                </div>
                <div>
                  <label className="font-bold block mb-1 text-stone-700">Drop / Discount Price (₹) *</label>
                  <input type="number" required value={dropPrice} onChange={e => setDropPrice(e.target.value)} placeholder="999" />
                </div>
              </div>
              {parseInt(origPrice) > parseInt(dropPrice) && (
                <div className="p-2.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold">
                  ✓ Buyers save {Math.round(((parseInt(origPrice) - parseInt(dropPrice)) / parseInt(origPrice)) * 100)}% on this flash drop!
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1 py-2">Cancel</button>
                <button type="submit" disabled={saving || !selectedEventId} className="btn-primary flex-1 py-2 font-bold">
                  {saving ? 'Publishing...' : 'Publish Drop Live ⚡'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 4. Pass Requests CRM Tab ────────────────────────────────
function RequestsTab({ onRefresh }: { onRefresh: () => void }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [filterEvent, setFilterEvent] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [offerModalId, setOfferModalId] = useState<string | null>(null);
  const [offerText, setOfferText] = useState('');
  const [offerTargetStatus, setOfferTargetStatus] = useState('offer_available');

  const loadRequests = () => {
    if (!SUPABASE_CONFIGURED) return;
    getAllPassRequests().then(data => {
      setRequests(data ?? []);
    });
  };

  useEffect(() => { loadRequests(); }, []);

  const eventNames = ['all', ...Array.from(new Set(requests.map(r => r.event_name).filter(Boolean)))];
  const statuses = ['all', ...Object.keys(REQUEST_STATUS_LABEL)];

  const filtered = requests.filter(r =>
    (filterEvent === 'all' || r.event_name === filterEvent) &&
    (filterStatus === 'all' || r.status === filterStatus)
  );

  const updateStatus = async (id: string, status: string) => {
    await updateRequestStatus(id, status as any);
    setRequests(p => p.map(r => r.id === id ? { ...r, status: status as typeof r.status } : r));
    onRefresh();
  };

  const handleSendOffer = async () => {
    if (!offerModalId) return;
    await updatePassRequestWithOffer(offerModalId, offerTargetStatus, offerText);
    setRequests(p => p.map(r => r.id === offerModalId ? { ...r, status: offerTargetStatus as any, offer_details: offerText } : r));
    setOfferModalId(null);
    setOfferText('');
    onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="eyebrow mb-1">Pass Matchmaking & Requests</div>
          <div className="font-serif" style={{ fontSize: 22, fontWeight: 500 }}>Pass Requests CRM</div>
        </div>
        <div style={{ fontSize: 13, color: '#9A8B82', fontWeight: 600 }}>{filtered.length} active queries</div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <select value={filterEvent} onChange={e => setFilterEvent(e.target.value)} style={{ fontSize: 13 }}>
          {eventNames.map(n => <option key={n} value={n}>{n === 'all' ? 'All Events' : n}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ fontSize: 13 }}>
          {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : REQUEST_STATUS_LABEL[s] ?? s}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(req => (
          <div key={req.id} className="card-light p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1612' }}>{req.buyer_name || 'Buyer'}</div>
                <div style={{ fontSize: 12, color: '#6B5B52' }}>
                  {req.buyer_email && <span className="mr-2">📧 {req.buyer_email}</span>}
                  {req.buyer_phone && <span className="mr-2">📞 {req.buyer_phone}</span>}
                  <span>Event: <strong>{req.event_name || 'Event'}</strong></span>
                </div>
                <div style={{ fontSize: 12, color: '#9A8B82', marginTop: 2 }}>
                  {req.quantity} Passes · Budget: {fmt(req.budget_min)}–{fmt(req.budget_max)} · {relTime(req.created_at)}
                </div>
              </div>
              <StatusBadge status={req.status} />
            </div>

            {req.priority_note && (
              <div className="p-2.5 rounded bg-amber-50 text-amber-950 text-xs mt-2 border border-amber-200">
                <strong>Buyer Note:</strong> {req.priority_note}
              </div>
            )}

            {req.offer_details && (
              <div className="p-2.5 rounded bg-emerald-50 text-emerald-950 text-xs mt-2 border border-emerald-200">
                <strong>Current Offer:</strong> {req.offer_details}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid rgba(26,22,18,0.07)' }}>
              <button
                onClick={() => { setOfferModalId(req.id); setOfferText(req.offer_details || ''); }}
                className="btn-primary py-1.5 px-3 text-xs font-semibold"
              >
                ⚡ Set Pass Offer / Match
              </button>

              {STATUS_NEXT[req.status]?.map(next => (
                <button
                  key={next}
                  onClick={() => updateStatus(req.id, next)}
                  className="btn-outline px-3 py-1.5 text-xs font-semibold"
                  style={next === 'closed' ? { color: '#9A8B82', borderColor: 'rgba(154,139,130,0.3)' } : {}}
                >
                  → Mark {REQUEST_STATUS_LABEL[next]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Offer Modal */}
      {offerModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,22,18,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md card-light p-6" style={{ background: '#FAF7F2' }}>
            <h2 className="font-serif text-lg font-bold mb-3">Send Offer to Buyer</h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1 text-stone-700">Next Status</label>
                <select value={offerTargetStatus} onChange={e => setOfferTargetStatus(e.target.value)} className="w-full p-2">
                  <option value="match_found">Match Found</option>
                  <option value="offer_available">Offer Available (Ready to book)</option>
                  <option value="completed">Completed (Confirmed)</option>
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1 text-stone-700">Offer / Pricing / Pick-up Details</label>
                <textarea
                  rows={3}
                  value={offerText}
                  onChange={e => setOfferText(e.target.value)}
                  placeholder="e.g. 2 VIP passes secured at ₹1,200 each. Pick-up at Sindhu Bhavan counter #3 or digital QR."
                  className="w-full p-2"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setOfferModalId(null)} className="btn-outline flex-1 py-2">Cancel</button>
                <button onClick={handleSendOffer} className="btn-primary flex-1 py-2">Confirm & Send Offer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 5. Radar / Signals Tab ───────────────────────────────────
function SignalsTab() {
  const [signals, setSignals] = useState<any[]>([]);

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;
    getAllSignals().then(data => {
      setSignals(data ?? []);
    });
  }, []);

  const totalPasses = signals.reduce((s, x) => s + (x.num_passes || 0), 0);
  const avgBudget = signals.length ? Math.round(signals.reduce((s, x) => s + ((x.budget_min || 0) + (x.budget_max || 0)) / 2, 0) / signals.length) : 0;
  const ready = signals.filter(s => s.readiness === 'ready').length;

  const exportCSV = () => {
    const headers = 'ID,Buyer,Email,Phone,Dates,Passes,Min Budget,Max Budget,Readiness,Artist\n';
    const rows = signals.map(s => `"${s.id}","${s.buyer_name || ''}","${s.buyer_email || ''}","${s.buyer_phone || ''}","${(s.preferred_dates || []).join(';')}","${s.num_passes}","${s.budget_min}","${s.budget_max}","${s.readiness}","${s.artist_preference || ''}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jugaad_signals_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="eyebrow mb-1">Unmet Demand Intelligence</div>
          <div className="font-serif" style={{ fontSize: 22, fontWeight: 500 }}>Radar / Jugaad Signals</div>
        </div>
        <button onClick={exportCSV} className="btn-outline py-1.5 px-3 text-xs font-semibold flex items-center gap-1.5">
          <span>📥</span> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { l: 'Total Signals', v: signals.length },
          { l: 'Passes Demanded', v: totalPasses },
          { l: 'Ready To Book', v: `${ready} / ${signals.length || 0}` },
          { l: 'Avg Willing Budget', v: `₹${avgBudget}` },
        ].map(d => (
          <div key={d.l} className="card-light p-3 text-center">
            <div className="font-serif" style={{ fontSize: 22, fontWeight: 600, color: '#C1440E' }}>{d.v}</div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9A8B82', marginTop: 2 }}>{d.l}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {signals.map(sig => (
          <div key={sig.id} className="card-light p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1612' }}>{sig.buyer_name || 'Buyer'}</div>
                <div style={{ fontSize: 12, color: '#9A8B82' }}>
                  {sig.buyer_email || '—'} {sig.buyer_phone ? `· 📞 ${sig.buyer_phone}` : ''}
                </div>
              </div>
              <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{
                color: sig.readiness === 'ready' ? '#2D7A4F' : sig.readiness === 'exploring' ? '#C1440E' : '#9A8B82',
                background: sig.readiness === 'ready' ? 'rgba(45,122,79,0.08)' : sig.readiness === 'exploring' ? 'rgba(193,68,14,0.08)' : 'rgba(154,139,130,0.08)',
              }}>
                {sig.readiness === 'ready' ? 'Ready to book' : sig.readiness === 'exploring' ? 'Exploring' : 'Maybe'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              <div>
                <div style={{ fontSize: 10, color: '#9A8B82', fontWeight: 600, textTransform: 'uppercase' }}>Preferred Dates</div>
                <div style={{ fontSize: 12, color: '#1A1612' }}>{sig.preferred_dates?.join(', ') || 'Any'}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#9A8B82', fontWeight: 600, textTransform: 'uppercase' }}>Passes</div>
                <div style={{ fontSize: 12, color: '#1A1612' }}>{sig.num_passes}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#9A8B82', fontWeight: 600, textTransform: 'uppercase' }}>Budget</div>
                <div style={{ fontSize: 12, color: '#1A1612' }}>{fmt(sig.budget_min)}–{fmt(sig.budget_max)}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#9A8B82', fontWeight: 600, textTransform: 'uppercase' }}>Artist Pref</div>
                <div style={{ fontSize: 12, color: '#1A1612' }}>{sig.artist_preference || 'None'}</div>
              </div>
            </div>

            {sig.specific_event && (
              <div style={{ fontSize: 12, color: '#6B5B52', marginTop: 6 }}>Specific Event: <strong>{sig.specific_event}</strong></div>
            )}
            <div style={{ fontSize: 11, color: '#9A8B82', marginTop: 4 }}>Logged {relTime(sig.created_at)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 6. Users & Role Access Control Tab ───────────────────────
function UsersTab({ onRefresh }: { onRefresh: () => void }) {
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadUsers = () => {
    getAllUsers().then(data => setUsers(data));
  };

  useEffect(() => { loadUsers(); }, []);

  const handleRoleChange = async (userId: string, newRole: 'buyer' | 'organiser' | 'super_admin') => {
    setUpdatingId(userId);
    const { error } = await updateUserRole(userId, newRole);
    if (error) {
      alert(`Role update issue: ${error}`);
    } else {
      setUsers(p => p.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
    setUpdatingId(null);
    onRefresh();
  };

  const filtered = users.filter(u =>
    !search ||
    (u.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="eyebrow mb-1">Access Control & Accounts</div>
          <div className="font-serif" style={{ fontSize: 22, fontWeight: 500 }}>Users & Roles Directory</div>
        </div>
        <div style={{ fontSize: 13, color: '#9A8B82', fontWeight: 600 }}>{filtered.length} total users</div>
      </div>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search user by name or email…"
        className="w-full text-xs mb-4"
      />

      <div className="space-y-3">
        {filtered.map(u => (
          <div key={u.id} className="card-light p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 15, fontWeight: 600, color: '#1A1612' }}>{u.name || 'User'}</span>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{
                  color: u.role === 'super_admin' ? '#7A1F2E' : u.role === 'organiser' ? '#C1440E' : '#2D7A4F',
                  background: u.role === 'super_admin' ? 'rgba(122,31,46,0.1)' : u.role === 'organiser' ? 'rgba(193,68,14,0.1)' : 'rgba(45,122,79,0.1)',
                }}>
                  {u.role.replace('_', ' ')}
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#6B5B52', marginTop: 2 }}>
                📧 {u.email} {u.phone ? `· 📞 ${u.phone}` : ''}
              </div>
              <div style={{ fontSize: 11, color: '#9A8B82', marginTop: 1 }}>Joined {relTime(u.created_at)}</div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-500">Role:</span>
              <select
                disabled={updatingId === u.id}
                value={u.role}
                onChange={e => handleRoleChange(u.id, e.target.value as any)}
                className="text-xs font-semibold p-1.5 rounded border border-stone-300"
                style={{ background: '#FAF7F2' }}
              >
                <option value="buyer">Buyer (Default)</option>
                <option value="organiser">Organiser</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 7. Organisers Tab ────────────────────────────────────────
function OrganisersTab({ onRefresh, users, onPromote }: { onRefresh: () => void; users: Profile[]; onPromote: (userId: string) => Promise<void> }) {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [promoting, setPromoting] = useState(false);

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;
    getOrganisers().then(data => {
      setOrgs(data ?? []);
    });
  }, []);

  const handlePromote = async () => {
    if (!selectedUserId) return;
    setPromoting(true);
    await onPromote(selectedUserId);
    setPromoting(false);
    setModalOpen(false);
    if (SUPABASE_CONFIGURED) {
      const data = await getOrganisers();
      setOrgs(data);
    }
  };

  const eligibleBuyers = users.filter(u => u.role === 'buyer');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="eyebrow mb-1">Registered Partners</div>
          <div className="font-serif" style={{ fontSize: 22, fontWeight: 500 }}>Organisers Registry</div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary py-2 px-3 text-xs font-semibold"
        >
          + Make Someone Organiser
        </button>
      </div>

      <div className="space-y-3">
        {orgs.map(org => (
          <div key={org.id} className="card-light p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1612' }}>{org.name || 'Organiser Partner'}</div>
                <div style={{ fontSize: 12, color: '#6B5B52' }}>{org.org || 'Independent Organiser'}</div>
                <div style={{ fontSize: 12, color: '#9A8B82' }}>
                  <a href={`mailto:${org.email}`} style={{ color: '#C1440E' }}>{org.email}</a>
                </div>
              </div>
              <div className="text-right">
                <div className="font-serif" style={{ fontSize: 20, fontWeight: 600, color: '#1A1612' }}>
                  {org.approved_count ?? 0} / {org.event_count ?? 0}
                </div>
                <div style={{ fontSize: 10, color: '#9A8B82', textTransform: 'uppercase', letterSpacing: '0.08em' }}>events approved</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#9A8B82' }}>Partner since {relTime(org.joined_at)}</div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(26,22,18,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md card-light p-6" style={{ background: '#FAF7F2' }}>
            <h2 className="font-serif text-lg font-bold mb-2">Assign Organiser Role</h2>
            <p className="text-xs text-stone-600 mb-4">
              Select any registered user to give them Organiser privileges (event submissions & organiser hub dashboard).
            </p>

            <div className="space-y-3">
              <label className="font-bold text-xs block text-stone-700">Select User</label>
              <select
                value={selectedUserId}
                onChange={e => setSelectedUserId(e.target.value)}
                className="w-full p-2.5 text-xs rounded border border-stone-300"
              >
                <option value="">-- Choose a user --</option>
                {eligibleBuyers.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name ? `${u.name} (${u.email})` : u.email}
                  </option>
                ))}
              </select>

              <div className="flex gap-2 pt-3">
                <button onClick={() => setModalOpen(false)} className="btn-outline flex-1 py-2 text-xs">Cancel</button>
                <button onClick={handlePromote} disabled={!selectedUserId || promoting} className="btn-primary flex-1 py-2 text-xs">
                  {promoting ? 'Updating...' : 'Assign Organiser Role'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Dashboard Component ───────────────────────────
export default function AdminDashboard({ navigate }: NavProps) {
  const [tab, setTab] = useState<AdminTab>('overview');
  const [events, setEvents] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [signals, setSignals] = useState<any[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [pendingCount, setPendingCount] = useState(0);

  const fetchGlobalData = async () => {
    try {
      const [evData, reqData, sigData, usrData, penData] = await Promise.all([
        getAllEvents(),
        getAllPassRequests(),
        getAllSignals(),
        getAllUsers(),
        getPendingEvents(),
      ]);
      setEvents(evData ?? []);
      setRequests(reqData ?? []);
      setSignals(sigData ?? []);
      setUsers(usrData ?? []);
      setPendingCount(penData?.length ?? 0);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };


  useEffect(() => {
    fetchGlobalData();
  }, []);

  return (
    <div className="pb-28" style={{ color: '#1A1612' }}>
      {/* Header with Super Admin Status */}
      <div className="px-5 py-6" style={{ background: '#F0E8DC', borderBottom: '1px solid rgba(26,22,18,0.08)' }}>
        <div className="flex items-center justify-between mb-1">
          <div className="eyebrow" style={{ color: '#7A1F2E', fontWeight: 700 }}>
            👑 Super Admin Command Center
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(122,31,46,0.1)', color: '#7A1F2E' }}>
            Full Access
          </span>
        </div>
        <h1 className="font-serif leading-tight" style={{ fontSize: 'clamp(26px, 6vw, 36px)', fontWeight: 600 }}>
          Platform Dashboard
        </h1>
        <p style={{ fontSize: 13, color: '#6B5B52', marginTop: 4 }}>
          Full visibility into users, pass requests, live events, organisers, and demand radar.
        </p>
      </div>

      {/* Tab Strip with horizontal scrolling */}
      <div className="scroll-x flex border-b sticky top-[60px] z-30" style={{ background: '#FAF7F2', borderColor: 'rgba(26,22,18,0.08)' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex-shrink-0 px-4 py-3.5 relative transition-colors flex items-center gap-1.5"
            style={{
              fontSize: 13,
              fontWeight: tab === t.key ? 600 : 400,
              color: tab === t.key ? '#C1440E' : '#6B5B52',
              borderBottom: tab === t.key ? '2px solid #C1440E' : '2px solid transparent',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
            {t.key === 'pending' && pendingCount > 0 && (
              <span className="ml-1 rounded-full px-1.5 text-white" style={{ fontSize: 10, background: '#C1440E', fontWeight: 700 }}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
        {tab === 'overview'   && <OverviewTab events={events} requests={requests} signals={signals} users={users} pendingCount={pendingCount} setTab={setTab} onSeedDatabase={fetchGlobalData} />}
        {tab === 'pending'    && <PendingTab onRefresh={fetchGlobalData} />}
        {tab === 'events'     && <AllEventsTab navigate={navigate} onRefresh={fetchGlobalData} />}
        {tab === 'drops'      && <JugaadDropsTab onRefresh={fetchGlobalData} />}
        {tab === 'requests'   && <RequestsTab onRefresh={fetchGlobalData} />}
        {tab === 'signals'    && <SignalsTab />}
        {tab === 'users'      && <UsersTab onRefresh={fetchGlobalData} />}
        {tab === 'organisers' && <OrganisersTab onRefresh={fetchGlobalData} users={users} onPromote={async (userId) => { await updateUserRole(userId, 'organiser'); await fetchGlobalData(); }} />}
      </div>
    </div>
  );
}
