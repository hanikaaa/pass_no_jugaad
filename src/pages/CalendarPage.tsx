import { useState, useEffect } from 'react';
import { type NavProps, EVENTS, NAVRATRI_DATES, type Event, normalizeDateShort, parseDateForSorting, isSameDate } from '../data/events';
import { getApprovedEvents } from '../lib/api';
import EventCard from '../components/EventCard';

export default function CalendarPage({ navigate }: NavProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventsList, setEventsList] = useState<Event[]>(EVENTS);
  const [calendarDates, setCalendarDates] = useState<string[]>(NAVRATRI_DATES);

  useEffect(() => {
    getApprovedEvents().then((dbEvents) => {
      if (dbEvents && dbEvents.length > 0) {
        const mapped: Event[] = dbEvents.map((e, idx) => {
          const pMin = e.price_min || 800;
          const pMax = e.price_max || pMin;
          const priceFormatted = pMin === pMax ? `₹${pMin.toLocaleString('en-IN')}` : `₹${pMin.toLocaleString('en-IN')}–₹${pMax.toLocaleString('en-IN')}`;
          const dateStr = e.date || '12 OCT 2026';
          const shortDate = normalizeDateShort(dateStr);

          return {
            id: e.id,
            name: e.name,
            date: dateStr,
            dateShort: shortDate,
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

        // Dynamically build sorted calendar dates containing standard Navratri dates + all event dates
        const customDates = mapped.map(ev => ev.dateShort).filter(Boolean);
        const combined = Array.from(new Set([...NAVRATRI_DATES, ...customDates]));
        combined.sort((a, b) => parseDateForSorting(a) - parseDateForSorting(b));
        setCalendarDates(combined);

        // Auto select first date that has events if none selected
        if (!selectedDate) {
          const firstWithEvent = combined.find(d => mapped.some(ev => isSameDate(ev.date, d) || isSameDate(ev.dateShort, d)));
          if (firstWithEvent) {
            setSelectedDate(firstWithEvent);
          } else {
            setSelectedDate(combined[0] || '10 OCT');
          }
        }
      }
    });

  }, []);

  const eventsForDate = selectedDate
    ? eventsList.filter((e) => isSameDate(e.date, selectedDate) || isSameDate(e.dateShort, selectedDate))
    : [];

  return (
    <div className="pb-24" style={{ color: '#1A1612' }}>
      <div className="px-5 py-7">
        <div className="eyebrow mb-2">Navratri 2026</div>
        <h1 className="font-serif leading-tight mb-1" style={{ fontSize: 'clamp(36px, 10vw, 56px)', fontWeight: 500 }}>
          Navratri<br />
          <span style={{ color: '#C1440E', fontStyle: 'italic' }}>Calendar.</span>
        </h1>
        <p style={{ fontSize: 14, color: '#6B5B52' }}>Explore events night by night.</p>
      </div>

      {/* Dates scroll */}
      <div className="scroll-x flex gap-2.5 px-5 pb-4 items-center">
        <button
          onClick={() => setSelectedDate(null)}
          className="snap-start flex-shrink-0 rounded-lg transition-all flex flex-col items-center justify-center"
          style={{
            padding: '12px 16px',
            background: selectedDate === null ? '#C1440E' : '#fff',
            border: `1.5px solid ${selectedDate === null ? '#C1440E' : 'rgba(26,22,18,0.15)'}`,
            minWidth: 70,
            height: 64,
          }}
        >
          <div className="font-serif text-center text-sm font-bold" style={{ color: selectedDate === null ? '#fff' : '#1A1612' }}>
            ALL
          </div>
          <div className="text-center" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: selectedDate === null ? 'rgba(255,255,255,0.85)' : '#9A8B82' }}>
            NIGHTS
          </div>
        </button>

        {calendarDates.map((d) => {
          const hasEvents = eventsList.some((e) => isSameDate(e.date, d) || isSameDate(e.dateShort, d));
          const active = selectedDate === d;
          const parts = d.split(' ');

          return (
            <button
              key={d}
              onClick={() => setSelectedDate(active ? null : d)}
              className="snap-start flex-shrink-0 rounded-lg transition-all relative"
              style={{
                padding: '10px 14px',
                background: active ? '#C1440E' : '#fff',
                border: `1.5px solid ${active ? '#C1440E' : hasEvents ? 'rgba(193,68,14,0.35)' : 'rgba(26,22,18,0.15)'}`,
                minWidth: 64,
                height: 64,
              }}
            >
              <div className="font-serif text-center leading-none" style={{ fontSize: 20, fontWeight: 600, color: active ? '#fff' : '#1A1612' }}>
                {parts[0]}
              </div>
              <div className="text-center mt-0.5" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: active ? 'rgba(255,255,255,0.85)' : '#9A8B82' }}>
                {parts.slice(1).join(' ') || 'OCT'}
              </div>
              {hasEvents && (
                <div className="flex justify-center mt-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: active ? '#fff' : '#C1440E' }} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Events for date */}
      <div className="px-5 py-4">
        {selectedDate === null ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82' }}>
                All Listed Events ({eventsList.length})
              </div>
              <span className="text-xs text-stone-500">Showing all dates</span>
            </div>
            {eventsList.length === 0 ? (
              <div className="card-light p-8 text-center">
                <div className="text-3xl mb-2">🎪</div>
                <h3 className="font-serif text-lg font-bold mb-1">No Events Listed Yet</h3>
                <p className="text-xs text-stone-500 mb-4">Be the first to list or request passes for Navratri 2026.</p>
                <button onClick={() => navigate('find-jugaad')} className="btn-primary py-2.5 px-5 text-xs font-bold">
                  Request a Pass →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {eventsList.map((event) => (
                  <EventCard key={event.id} event={event} navigate={navigate} currentPage="calendar" />
                ))}
              </div>
            )}
          </div>
        ) : eventsForDate.length === 0 ? (
          <div className="card-light p-6">
            <h3 className="font-serif mb-2" style={{ fontSize: 20, fontWeight: 500 }}>{"Can't find it?"}</h3>
            <p style={{ fontSize: 14, color: '#6B5B52', marginBottom: 16 }}>No events listed for {selectedDate} yet. Tell us what {"you're"} looking for.</p>
            <button onClick={() => navigate('find-jugaad')} className="btn-primary w-full py-3 text-sm">
              Request it →
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9A8B82', marginBottom: 16 }}>
              {eventsForDate.length} event{eventsForDate.length > 1 ? 's' : ''} on {selectedDate}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {eventsForDate.map((event) => (
                <EventCard key={event.id} event={event} navigate={navigate} currentPage="calendar" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
