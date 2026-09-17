import { useState } from 'react';
import { signIn, signUp, sendPasswordReset } from '../lib/api';
import { SUPABASE_CONFIGURED } from '../lib/supabase';

interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

type Mode = 'login' | 'signup' | 'reset';

export default function AuthModal({ onSuccess, onClose }: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);

    if (mode === 'reset') {
      const { error } = await sendPasswordReset(email);
      setLoading(false);
      if (error) { setAuthError(error); return; }
      setResetSent(true);
      return;
    }

    if (!SUPABASE_CONFIGURED) {
      // Demo mode: pass through immediately
      setTimeout(() => { setLoading(false); onSuccess(); }, 600);
      return;
    }

    if (mode === 'signup') {
      const res = await signUp(email, password, name);
      setLoading(false);
      if (res.error) { setAuthError(res.error); return; }
      if (res.needsEmailConfirmation) {
        setConfirmationSent(true);
        return;
      }
    } else {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) { setAuthError(error); return; }
    }

    onSuccess();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[60]"
        style={{ background: 'rgba(26,22,18,0.4)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      />
      <div
        className="fixed z-[61] w-full max-w-md"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#FAF7F2',
          border: '1px solid rgba(26,22,18,0.1)',
          borderRadius: 8,
          padding: '32px 28px',
          boxShadow: '0 24px 64px rgba(26,22,18,0.12)',
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, fontSize: 18, color: '#9A8B82', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
        >
          ✕
        </button>

        {confirmationSent ? (
          <div className="text-center py-4">
            <div style={{ fontSize: 32, marginBottom: 12 }}>✉️</div>
            <h2 className="font-serif" style={{ fontSize: 22, fontWeight: 500, marginBottom: 8 }}>Verify your email</h2>
            <p style={{ fontSize: 14, color: '#6B5B52', lineHeight: 1.6, marginBottom: 20 }}>
              {"We've sent a verification link to"} <strong>{email}</strong>. Please confirm your email to log in.
            </p>
            <button onClick={() => { setMode('login'); setConfirmationSent(false); }} className="btn-ghost text-sm">
              Back to login
            </button>
          </div>
        ) : resetSent ? (
          <div className="text-center py-4">
            <div style={{ fontSize: 32, marginBottom: 12 }}>📬</div>
            <h2 className="font-serif" style={{ fontSize: 22, fontWeight: 500, marginBottom: 8 }}>Check your inbox</h2>
            <p style={{ fontSize: 14, color: '#6B5B52', lineHeight: 1.6, marginBottom: 20 }}>
              {"We've sent a password reset link to"} <strong>{email}</strong>.
            </p>
            <button onClick={() => { setMode('login'); setResetSent(false); }} className="btn-ghost text-sm">
              Back to login
            </button>
          </div>
        ) : (
          <>
            <div className="eyebrow mb-2">{mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create account' : 'Reset password'}</div>
            <h2 className="font-serif" style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.2, marginBottom: 6 }}>
              {mode === 'reset' ? 'Forgot your password?' : 'Before we find your jugaad…'}
            </h2>
            {mode !== 'reset' && (
              <p style={{ fontSize: 13, color: '#6B5B52', lineHeight: 1.6, marginBottom: 24 }}>
                {mode === 'login'
                  ? 'Log in to save your request and stay updated.'
                  : 'Create an account so we can save your request and keep you updated.'}
              </p>
            )}

            <form onSubmit={handleSubmit} style={{ marginTop: mode === 'reset' ? 24 : 0 }}>
              <div className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label style={{ display: 'block', marginBottom: 6 }}>Your name</label>
                    <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="First name" />
                  </div>
                )}
                <div>
                  <label style={{ display: 'block', marginBottom: 6 }}>Email address</label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                {mode !== 'reset' && (
                  <div>
                    <label style={{ display: 'block', marginBottom: 6 }}>Password</label>
                    <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                  </div>
                )}
              </div>

              {mode === 'login' && (
                <button type="button" onClick={() => setMode('reset')} className="btn-ghost" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
                  Forgot password?
                </button>
              )}

              <button
                type="submit"
                className="btn-primary w-full"
                style={{ marginTop: 20, padding: '13px 0', fontSize: 15 }}
                disabled={loading}
              >
                {loading ? 'Just a moment…' :
                  mode === 'login' ? 'Log in & continue →' :
                  mode === 'signup' ? 'Create account & continue →' :
                  'Send reset link'}
              </button>

              {authError && (
                <p style={{ marginTop: 10, fontSize: 13, color: '#C1440E', textAlign: 'center' }}>{authError}</p>
              )}
            </form>

            <div style={{ marginTop: 20, textAlign: 'center' }}>
              {mode === 'reset' ? (
                <button onClick={() => setMode('login')} className="btn-ghost" style={{ fontSize: 13 }}>Back to login</button>
              ) : (
                <span style={{ fontSize: 13, color: '#6B5B52' }}>
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    className="btn-ghost"
                    style={{ fontSize: 13, display: 'inline', textDecoration: 'underline' }}
                  >
                    {mode === 'login' ? 'Sign up' : 'Log in'}
                  </button>
                </span>
              )}
            </div>

            {!SUPABASE_CONFIGURED && (
              <p style={{ marginTop: 16, fontSize: 11, color: '#9A8B82', textAlign: 'center', lineHeight: 1.5 }}>
                Demo mode — add <code>VITE_SUPABASE_URL</code> &amp; <code>VITE_SUPABASE_ANON_KEY</code> to enable real auth.
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
}
