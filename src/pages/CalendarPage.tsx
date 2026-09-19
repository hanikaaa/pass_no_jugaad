import { useState, useEffect } from 'react';
import { type NavProps, EVENTS, NAVRATRI_DATES, type Event } from '../data/events';
import { getApprovedEvents } from '../lib/api';
import EventCard from '../components/EventCard';

export default function CalendarPage({ navigate }: NavProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventsList, setEventsList] = useState<Event[]>(EVENTS);

  useEffect(() => {
    getApprovedEvents().then((dbEvents) => {
      if (dbEvents && dbEvents.length > 0) {
        const mapped: Event[] = dbEvents.map((e, idx) => ({
          id: e.id,
          name: e.name,
          date: e.date || '12 OCT 2026',
          dateShort: e.date ? e.date.replace(' 2026', '') : '12 OCT',
          venue: e.venue || 'Ahmedabad',
          location: e.venue || 'Ahmedabad',
          time: e.time || '7:00 PM onwards',
          priceRange: e.price_min ? `₹${e.price_min}–₹${e.price_max}` : '₹800–₹1,500',
          priceMin: e.price_min || 800,
          priceMax: e.price_max || 1500,
          type: e.type_tags || ['Garba'],
          demand: idx % 3 === 0 ? 'VERY HIGH' : idx % 2 === 0 ? 'HIGH' : 'MEDIUM',
          availability: 'Available',
          image: 'https://images.unsplash.com/photo-1786452156548-9a60189a9876?w=800&h=500&fit=crop&auto=format',
          artist: e.artist || undefined,
          description: e.description || '',
          featured: idx < 3,
        }));
        setEventsList(mapped);
      }
    });

  }, []);

  const eventsForDate = selectedDate
    ? eventsList.filter((e) => e.dateShort.toLowerCase().includes(selectedDate.toLowerCase()) || (e.date && e.date.toLowerCase().includes(selectedDate.toLowerCase())))
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
      <div className="scroll-x flex gap-3 px-5 pb-4">
        {NAVRATRI_DATES.map((d) => {
          const hasEvents = eventsList.some((e) => e.dateShort === d || (e.date && e.date.toLowerCase().includes(d.toLowerCase().split(' ')[0])));
          const active = selectedDate === d;

          return (
            <button
              key={d}
              onClick={() => setSelectedDate(active ? null : d)}
              className="snap-start flex-shrink-0 rounded-lg transition-all"
              style={{
                padding: '12px 16px',
                background: active ? '#C1440E' : '#fff',
                border: `1.5px solid ${active ? '#C1440E' : 'rgba(26,22,18,0.15)'}`,
                minWidth: 68,
              }}
            >
              <div className="font-serif text-center" style={{ fontSize: 22, fontWeight: 500, color: active ? '#fff' : '#1A1612' }}>
                {d.split(' ')[0]}
              </div>
              <div className="text-center" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: active ? 'rgba(255,255,255,0.75)' : '#9A8B82' }}>
                {d.split(' ')[1]}
              </div>
              {hasEvents && (
                <div className="flex justify-center mt-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: active ? 'rgba(255,255,255,0.7)' : '#C1440E' }} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Events for date */}
      <div className="px-5 py-4">
        {!selectedDate && (
          <div className="card-light p-6 text-center">
            <p style={{ fontSize: 14, color: '#9A8B82' }}>Select a date to see events</p>
          </div>
        )}

        {selectedDate && eventsForDate.length === 0 && (
          <div className="card-light p-6">
            <h3 className="font-serif mb-2" style={{ fontSize: 20, fontWeight: 500 }}>{"Can't find it?"}</h3>
            <p style={{ fontSize: 14, color: '#6B5B52', marginBottom: 16 }}>No events listed for {selectedDate} yet. Tell us what {"you're"} looking for.</p>
            <button onClick={() => navigate('find-jugaad')} className="btn-primary w-full py-3 text-sm">
              Request it →
            </button>
          </div>
        )}

        {selectedDate && eventsForDate.length > 0 && (
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
