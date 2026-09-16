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

export default function App() {
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('pnj-seen'));
  const [page, setPage] = useState<Page>('home');
  const [eventId, setEventId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingNav, setPendingNav] = useState<{ page: Page; opts?: { eventId?: string } } | null>(null);
  const [demoRole, setDemoRole] = useState<UserRole>('buyer');
  const [profile, setProfile] = useState<Profile | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  // Derive active role: real profile role when configured, else demo switcher
  const activeRole: UserRole = SUPABASE_CONFIGURED && profile
    ? profile.role
    : demoRole;

  const isLoggedIn = SUPABASE_CONFIGURED ? !!profile : true; // demo: always "logged in"

  const navigate = useCallback((p: Page, opts?: { eventId?: string }) => {
    if (AUTH_GATED.includes(p) && !isLoggedIn) {
      setPendingNav({ page: p, opts });
      setPage('login');
      setMenuOpen(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' }), 0);
      return;
    }
    setPage(p);
    if (opts?.eventId) setEventId(opts.eventId);
    setMenuOpen(false);
    setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' }), 0);
  }, []);

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
      case 'my-requests': return <MyRequests {...navProps} />;
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

      <BottomNav {...navProps} />

      {menuOpen && (
        <HamburgerMenu
          {...navProps}
          onClose={() => setMenuOpen(false)}
          profile={profile}
          onSignOut={async () => { await signOut(); setProfile(null); navigate('home'); }}
        />
      )}

      {/* Demo role switcher — only shown when Supabase is not yet configured */}
      {!SUPABASE_CONFIGURED && (
        <div style={{
          position: 'fixed', bottom: 76, left: '50%', transform: 'translateX(-50%)',
          zIndex: 40, display: 'flex', gap: 4, padding: '4px 6px',
          background: 'rgba(26,22,18,0.88)', backdropFilter: 'blur(12px)',
          borderRadius: 999, boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}>
          {(['buyer', 'organiser', 'super_admin'] as UserRole[]).map(r => (
            <button
              key={r}
              onClick={() => {
                setDemoRole(r);
                if (r === 'super_admin') { setPage('admin-dashboard'); setMenuOpen(false); }
                else if (r === 'organiser') { setPage('organiser-dashboard'); setMenuOpen(false); }
                else { setPage('my-requests'); setMenuOpen(false); }
              }}
              style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '4px 10px', borderRadius: 999, border: 'none', cursor: 'pointer',
                background: demoRole === r ? '#C1440E' : 'transparent',
                color: demoRole === r ? '#fff' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.15s',
              }}
            >
              {r === 'super_admin' ? 'Admin' : r === 'organiser' ? 'Organiser' : 'Buyer'}
            </button>
          ))}
        </div>
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
