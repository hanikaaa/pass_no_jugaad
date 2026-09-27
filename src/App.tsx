import { useState, useCallback, useRef, useEffect } from 'react';
import { type Page, type UserRole, createEventSlug } from './data/events';
import { supabase, SUPABASE_CONFIGURED, type Profile } from './lib/supabase';
import { getCurrentProfile, signOut, getEventById, submitPassRequest } from './lib/api';

import IntroAnimation from './components/IntroAnimation';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HamburgerMenu from './components/HamburgerMenu';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

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
import AdminDashboard from './pages/AdminDashboard';
import OrganiserDashboard from './pages/OrganiserDashboard';
import Login from './pages/Login';

const HIDE_FOOTER_ON: Page[] = [
  'find-jugaad', 'jugaad-success', 'request-pass', 'request-success',
  'organiser-form', 'organiser-success', 'event-detail', 'login',
];

const AUTH_GATED: Page[] = ['request-pass', 'my-requests', 'find-jugaad', 'organiser-form', 'organiser-dashboard', 'admin-dashboard'];

const KNOWN_PAGES: Page[] = [
  'home', 'find-jugaad', 'jugaad-success', 'radar', 'calendar',
  'events', 'event-detail', 'request-pass', 'request-success', 'drops', 'gallery',
  'organisers', 'organiser-form', 'organiser-success', 'my-requests',
  'about', 'contact', 'admin-dashboard', 'organiser-dashboard', 'login'
];

function getInitialRoute(): { page: Page; eventId: string | null } {
  try {
    const rawPath = window.location.pathname.replace(/^\/+|\/+$/g, '');
    const params = new URLSearchParams(window.location.search);

    const p = params.get('page') as Page | null;
    const evId = params.get('eventId') || params.get('e') || params.get('event');
    if (p) {
      return { page: p, eventId: evId || null };
    }
    if (evId) {
      return { page: 'event-detail', eventId: evId };
    }

    // Check pathname routing (e.g. e/efesto-na-garba or event/efesto-na-garba)
    if (rawPath) {
      if (rawPath.startsWith('e/') || rawPath.startsWith('event/')) {
        const slug = rawPath.split('/')[1];
        if (slug) {
          return { page: 'event-detail', eventId: slug };
        }
      }

      if (KNOWN_PAGES.includes(rawPath as Page)) {
        return { page: rawPath as Page, eventId: null };
      }

      // If it's a single clean slug (e.g. /efesto-na-garba), route to event-detail
      if (!rawPath.includes('/')) {
        return { page: 'event-detail', eventId: rawPath };
      }
    }
  } catch {
    // fallback
  }
  return { page: 'home', eventId: null };
}

export default function App() {
  const initialRoute = getInitialRoute();
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('pnj-seen') && initialRoute.page === 'home');
  const [page, setPage] = useState<Page>(initialRoute.page);
  const [eventId, setEventId] = useState<string | null>(initialRoute.eventId);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingNav, setPendingNav] = useState<{ page: Page; opts?: { eventId?: string } } | null>(null);
  const [demoRole, setDemoRole] = useState<UserRole>('buyer');
  const [profile, setProfile] = useState<Profile | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Popstate listener for browser back/forward and deep link navigation
  useEffect(() => {
    const handlePopState = () => {
      const route = getInitialRoute();
      setPage(route.page);
      setEventId(route.eventId);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Real auth session listener (only when Supabase is configured)
  useEffect(() => {
    if (!SUPABASE_CONFIGURED || !supabase) return;
    getCurrentProfile().then(setProfile);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const p = await getCurrentProfile();
        setProfile(p);
      } else {
        setProfile(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Derive active role: strictly from authenticated profile
  const activeRole: UserRole = profile?.role || 'buyer';
  const isLoggedIn = !!profile;

  const navigate = useCallback((p: Page, opts?: { eventId?: string }) => {
    if (AUTH_GATED.includes(p) && !isLoggedIn) {
      setPendingNav({ page: p, opts });
      setPage('login');
      setMenuOpen(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' }), 0);
      return;
    }

    // Role-based access control
    if (p === 'admin-dashboard' && activeRole !== 'super_admin') {
      setPage('my-requests');
      setMenuOpen(false);
      return;
    }

    if (p === 'organiser-dashboard' && activeRole !== 'organiser' && activeRole !== 'super_admin') {
      setPage('organisers');
      setMenuOpen(false);
      return;
    }

    setPage(p);
    const targetEvId = opts?.eventId !== undefined ? opts.eventId : (p === 'event-detail' || p === 'request-pass' ? eventId : null);
    if (opts?.eventId !== undefined) setEventId(opts.eventId);

    // Sync URL with clean slug format
    try {
      if (p === 'home') {
        window.history.pushState({ page: p, eventId: null }, '', '/');
      } else if (p === 'event-detail' && targetEvId) {
        const cleanSlug = targetEvId.includes(' ') ? createEventSlug(targetEvId) : targetEvId;
        window.history.pushState({ page: p, eventId: targetEvId }, '', `/e/${cleanSlug}`);
      } else {
        window.history.pushState({ page: p, eventId: targetEvId }, '', `/${p}`);
      }
    } catch {
      // ignore
    }

    setMenuOpen(false);
    setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' }), 0);
  }, [isLoggedIn, activeRole, eventId]);

  const handleAuthSuccess = async () => {
    setAuthOpen(false);

    // Check if there was a pending pass request from EventDetail
    try {
      const pendingRequest = sessionStorage.getItem('pending_pass_request');
      if (pendingRequest) {
        sessionStorage.removeItem('pending_pass_request');
        const parsed = JSON.parse(pendingRequest);
        if (parsed?.eventId) {
          const ev = await getEventById(parsed.eventId);
          const minPrice = ev?.jugaad_drop && ev?.drop_price ? ev.drop_price : (ev?.price_min || 800);
          const maxPrice = ev?.jugaad_drop && ev?.drop_price ? ev.drop_price : (ev?.price_max || ev?.price_min || 800);
          const note = ev?.jugaad_drop ? 'Jugaad Drop direct pass request' : 'Direct event pass request';

          await submitPassRequest({
            event_id: parsed.eventId,
            quantity: parsed.quantity || 2,
            budget_min: minPrice,
            budget_max: maxPrice,
            priority_note: note,
          });

          setPendingNav(null);
          navigate('request-success');
          return;
        }
      }
    } catch (e) {
      console.error('Error auto-submitting pending pass request on auth:', e);
    }

    if (pendingNav) {
      const { page: p, opts } = pendingNav;
      setPage(p);
      if (opts?.eventId) setEventId(opts.eventId);
      setMenuOpen(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' }), 0);
      setPendingNav(null);
    } else {
      navigate('home');
    }
  };

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
      case 'my-requests': return <MyRequests {...navProps} activeRole={activeRole} />;
      case 'admin-dashboard': return <AdminDashboard {...navProps} />;
      case 'organiser-dashboard': return <OrganiserDashboard {...navProps} />;
      case 'login': return <Login {...navProps} onAuthSuccess={handleAuthSuccess} />;
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
        style={{ background: '#FAF7F2' }}
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

      <BottomNav {...navProps} activeRole={activeRole} />

      {menuOpen && (
        <HamburgerMenu
          {...navProps}
          onClose={() => setMenuOpen(false)}
          profile={profile}
          onSignOut={async () => { await signOut(); setProfile(null); navigate('home'); }}
        />
      )}

      {authOpen && (
        <AuthModal
          onSuccess={handleAuthSuccess}
          onClose={() => { setAuthOpen(false); setPendingNav(null); }}
        />
      )}
    </>
  );
}
