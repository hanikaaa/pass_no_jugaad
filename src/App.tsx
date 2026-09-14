import { useState, useEffect, useCallback, useRef } from 'react';
import { type Page } from './data/events';

import IntroAnimation from './components/IntroAnimation';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HamburgerMenu from './components/HamburgerMenu';
import Footer from './components/Footer';

import Home from './pages/Home';
import FindJugaad from './pages/FindJugaad';
import JugaadSuccess from './pages/JugaadSuccess';
import Radar from './pages/Radar';
import CalendarPage from './pages/CalendarPage';
import EventsPage from './pages/EventsPage';
import EventDetail from './pages/EventDetail';
import RequestPass from './pages/RequestPass';
import RequestSuccess from './pages/RequestSuccess';
import JugaadDrops from './pages/JugaadDrops';
import Gallery from './pages/Gallery';
import Organisers from './pages/Organisers';
import OrganiserForm from './pages/OrganiserForm';
import MyRequests from './pages/MyRequests';
import About from './pages/About';
import Contact from './pages/Contact';

const HIDE_FOOTER_ON: Page[] = [
  'find-jugaad', 'jugaad-success', 'request-pass', 'request-success',
  'organiser-form', 'organiser-success', 'event-detail',
];

export default function App() {
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('pnj-seen'));
  const [page, setPage] = useState<Page>('home');
  const [eventId, setEventId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const navigate = useCallback((p: Page, opts?: { eventId?: string }) => {
    setPage(p);
    if (opts?.eventId) setEventId(opts.eventId);
    setMenuOpen(false);
    setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' }), 0);
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('pnj-seen', '1');
    setShowIntro(false);
  };

  const navProps = { navigate, currentPage: page };

  const renderPage = () => {
    switch (page) {
      case 'home': return <Home {...navProps} />;
      case 'find-jugaad': return <FindJugaad {...navProps} />;
      case 'jugaad-success': return <JugaadSuccess {...navProps} />;
      case 'radar': return <Radar {...navProps} />;
      case 'calendar': return <CalendarPage {...navProps} />;
      case 'events': return <EventsPage {...navProps} />;
      case 'event-detail': return <EventDetail {...navProps} eventId={eventId} />;
      case 'request-pass': return <RequestPass {...navProps} eventId={eventId} />;
      case 'request-success': return <RequestSuccess {...navProps} />;
      case 'drops': return <JugaadDrops {...navProps} />;
      case 'gallery': return <Gallery />;
      case 'organisers': return <Organisers {...navProps} />;
      case 'organiser-form': return <OrganiserForm {...navProps} />;
      case 'organiser-success': return <JugaadSuccess {...navProps} />;
      case 'my-requests': return <MyRequests {...navProps} />;
      case 'about': return <About {...navProps} />;
      case 'contact': return <Contact {...navProps} />;
      default: return <Home {...navProps} />;
    }
  };

  const showFooter = !HIDE_FOOTER_ON.includes(page);

  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}

      <div
        id="main-scroll"
        ref={scrollRef}
        className="h-screen overflow-y-auto"
        style={{ background: '#080808' }}
      >
        <Header
          {...navProps}
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen((o) => !o)}
        />

        <main style={{ minHeight: 'calc(100vh - 56px - 64px)' }}>
          {renderPage()}
        </main>

        {showFooter && <Footer {...navProps} />}
      </div>

      <BottomNav {...navProps} />

      {menuOpen && (
        <HamburgerMenu {...navProps} onClose={() => setMenuOpen(false)} />
      )}
    </>
  );
}
