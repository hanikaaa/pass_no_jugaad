import { useState } from 'react';
import { type NavProps } from '../data/events';
import { signIn, signUp, sendPasswordReset } from '../lib/api';
import { SUPABASE_CONFIGURED } from '../lib/supabase';
import logoSrc from '@/imports/garba_no_pass_taaro__6_-1.png';

type Mode = 'login' | 'signup' | 'reset';

interface Props extends NavProps {
  onAuthSuccess?: () => void;
}

export default function Login({ navigate, onAuthSuccess }: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup' && password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    if (mode === 'reset') {
      const { error: err } = await sendPasswordReset(email);
      setLoading(false);
      if (err) { setError(err); return; }
      setResetSent(true);
      return;
    }

    if (!SUPABASE_CONFIGURED) {
      setTimeout(() => {
        setLoading(false);
        if (onAuthSuccess) onAuthSuccess();
        else navigate('home');
      }, 700);
      return;
    }

    if (mode === 'signup') {
      const res = await signUp(email, password, name);
      setLoading(false);
      if (res.error) { setError(res.error); return; }
      if (res.needsEmailConfirmation) {
        setConfirmationSent(true);
        return;
      }
    } else {
      const { error: err } = await signIn(email, password);
      setLoading(false);
      if (err) { setError(err); return; }
    }

    if (onAuthSuccess) onAuthSuccess();
    else navigate('home');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAF7F2', color: '#1A1612' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(26,22,18,0.07)' }}>
        <button onClick={() => navigate('home')} style={{ lineHeight: 0 }}>
          <img src={logoSrc} alt="Pass No Jugaad" style={{ width: 100, height: 'auto', mixBlendMode: 'multiply' }} />
        </button>
        <button onClick={() => navigate('home')} style={{ fontSize: 13, color: '#9A8B82', fontWeight: 500 }}>
          ← Back to home
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm">

          {confirmationSent ? (
            <div className="text-center">
              <div style={{ fontSize: 40, marginBottom: 16 }}>✉️</div>
              <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>Verify your email</h1>
              <p style={{ fontSize: 14, color: '#6B5B52', lineHeight: 1.65, marginBottom: 24 }}>
                We sent a confirmation email to <strong>{email}</strong>. Please check your inbox and click the verification link to log in.
              </p>
              <button onClick={() => { setMode('login'); setConfirmationSent(false); }} className="btn-ghost text-sm">
                ← Back to login
              </button>
            </div>
          ) : resetSent ? (
            <div className="text-center">
              <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
              <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>Check your inbox</h1>
              <p style={{ fontSize: 14, color: '#6B5B52', lineHeight: 1.65, marginBottom: 24 }}>
                We sent a password reset link to <strong>{email}</strong>.
              </p>
              <button onClick={() => { setMode('login'); setResetSent(false); }} className="btn-ghost text-sm">
                ← Back to login
              </button>
            </div>
          ) : (
            <>
              {/* Mode tabs */}
              <div className="flex rounded-lg p-1 mb-8" style={{ background: '#F0E8DC' }}>
                {(['login', 'signup'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setError(null); }}
                    className="flex-1 py-2.5 rounded-md text-sm transition-all capitalize"
                    style={{
                      background: mode === m ? '#fff' : 'transparent',
                      color: mode === m ? '#1A1612' : '#9A8B82',
                      fontWeight: mode === m ? 600 : 400,
                      boxShadow: mode === m ? '0 1px 4px rgba(26,22,18,0.08)' : 'none',
                    }}
                  >
                    {m === 'login' ? 'Log in' : 'Sign up'}
                  </button>
                ))}
              </div>

              {mode !== 'reset' && (
                <div className="mb-6">
                  <h1 style={{ fontSize: 'clamp(26px, 7vw, 34px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 6 }}>
                    {mode === 'login' ? 'Welcome back.' : 'Create your account.'}
                  </h1>
                  <p style={{ fontSize: 14, color: '#6B5B52', lineHeight: 1.6 }}>
                    {mode === 'login'
                      ? 'Log in to track your requests and jugaad signals.'
                      : 'Sign up to save your jugaad requests and stay updated.'}
                  </p>
                </div>
              )}

              {mode === 'reset' && (
                <div className="mb-6">
                  <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>Forgot password?</h1>
                  <p style={{ fontSize: 14, color: '#6B5B52' }}>{"We'll send a reset link to your email."}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Your name</label>
                    <input
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="First name"
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Email address</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>

                {mode !== 'reset' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label style={{ fontSize: 13, fontWeight: 500 }}>Password</label>
                      {mode === 'login' && (
                        <button type="button" onClick={() => { setMode('reset'); setError(null); }} className="btn-ghost" style={{ fontSize: 12 }}>
                          Forgot?
                        </button>
                      )}
                    </div>
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                )}

                {mode === 'signup' && (
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Confirm password</label>
                    <input
                      required
                      type="password"
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                )}

                {error && (
                  <div className="rounded-md px-4 py-3" style={{ background: 'rgba(193,68,14,0.06)', border: '1px solid rgba(193,68,14,0.2)', fontSize: 13, color: '#C1440E' }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                  style={{ padding: '14px 0', fontSize: 15, marginTop: 4 }}
                >
                  {loading ? 'Just a moment…' :
                    mode === 'login' ? 'Log in →' :
                    mode === 'signup' ? 'Create account →' :
                    'Send reset link'}
                </button>

                {mode === 'reset' && (
                  <button type="button" onClick={() => { setMode('login'); setError(null); }} className="btn-ghost w-full text-sm text-center">
                    ← Back to login
                  </button>
                )}
              </form>

              {!SUPABASE_CONFIGURED && (
                <p style={{ marginTop: 16, fontSize: 11, color: '#9A8B82', textAlign: 'center', lineHeight: 1.5 }}>
                  Demo mode — add <code>VITE_SUPABASE_URL</code> &amp; <code>VITE_SUPABASE_ANON_KEY</code> to enable real auth.
                </p>
              )}

              <p style={{ marginTop: 20, fontSize: 13, color: '#9A8B82', textAlign: 'center' }}>
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
                  className="btn-ghost"
                  style={{ fontSize: 13, display: 'inline' }}
                >
                  {mode === 'login' ? 'Sign up' : 'Log in'}
                </button>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Bottom note */}
      <div className="px-5 py-4 text-center" style={{ borderTop: '1px solid rgba(26,22,18,0.07)' }}>
        <p style={{ fontSize: 11, color: '#9A8B82' }}>
          Not a ticketing platform · Ahmedabad Navratri 2026
        </p>
      </div>
    </div>
  );
}
