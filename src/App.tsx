import { useState, useCallback, useRef, useEffect } from 'react';
import { type Page, type UserRole } from './data/events';
import { supabase, SUPABASE_CONFIGURED, type Profile } from './lib/supabase';
import { getCurrentProfile, signOut } from './lib/api';

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

function getInitialRoute(): { page: Page; eventId: string | null } {
  try {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('page') as Page | null;
    const evId = params.get('eventId');
    if (p) {
      return { page: p, eventId: evId || null };
    }
    if (evId) {
      return { page: 'event-detail', eventId: evId };
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

    // Sync URL for deep links and sharing
    try {
      const url = new URL(window.location.href);
      if (p === 'home') {
        url.searchParams.delete('page');
        url.searchParams.delete('eventId');
      } else {
        url.searchParams.set('page', p);
        if (targetEvId) {
          url.searchParams.set('eventId', targetEvId);
        } else {
          url.searchParams.delete('eventId');
        }
      }
      window.history.pushState({ page: p, eventId: targetEvId }, '', url.toString());
    } catch {
      // ignore
    }

    setMenuOpen(false);
    setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' }), 0);
  }, [isLoggedIn, activeRole, eventId]);

  const handleAuthSuccess = () => {
    setAuthOpen(false);
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
