import { useState } from 'react';
import { apiFetch } from './api';

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

    if (mode ==='register' && !passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
      );
      setLoading(false);
      return;
    }
    try {
      const data = await apiFetch(`/auth/${mode}`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (data.error) return setError(data.error);
      onLogin(data.user);
    } catch {
      setError('Something went wrong, try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // NO background here — index.html ka background dikhega
    }}>

      {/* LEFT SIDE — branding */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginRight: 80,
        maxWidth: 320,
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(124,106,255,0.65)',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{ width: 24, height: 1, background: 'rgba(124,106,255,0.5)' }}></div>
          Personal Finance
        </div>

        <h1 style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: 42,
          fontWeight: 700,
          lineHeight: 1.12,
          letterSpacing: '-1.5px',
          color: '#eef0f8',
          marginBottom: 18,
        }}>
          Manage your<br />
          finances<br />
          <span style={{
            background: 'linear-gradient(130deg, #7c6aff 0%, #a78bfa 50%, #34d399 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>freely.</span>
        </h1>

        <p style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: 13,
          color: 'rgba(139,145,167,0.7)',
          lineHeight: 1.7,
          marginBottom: 28,
        }}>
          Track every rupee, category by category.<br />
          No subscription. Just pure clarity.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { color: '#7c6aff', text: 'Category-wise breakdown' },
            { color: '#34d399', text: 'Monthly & yearly summary' },
            { color: '#fbbf24', text: 'Export to CSV anytime' },
          ].map(b => (
            <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: b.color, flexShrink: 0 }}></div>
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 12, color: 'rgba(139,145,167,0.65)' }}>
                {b.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE — form */}
      <div style={{
        width: 400,
        padding: '40px 36px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}>

        {/* Icon + Title */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>💸</div>
          <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>
            Expense <span style={{ color: '#7c6af7' }}>Lite</span>
          </h2>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 10,
          padding: 4,
          marginBottom: 24,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); }}
              style={{
                flex: 1, padding: '8px 0',
                background: mode === m
                  ? 'linear-gradient(135deg, #7c6af7, #5b4fcf)'
                  : 'transparent',
                color: mode === m ? '#fff' : 'rgba(255,255,255,0.35)',
                border: 'none', borderRadius: 8,
                cursor: 'pointer', fontSize: 13,
                fontWeight: mode === m ? 600 : 400,
                transition: 'all 0.2s',
                textTransform: 'capitalize',
                boxShadow: mode === m ? '0 2px 12px rgba(124,106,247,0.3)' : 'none',
              }}>
              {m === 'login' ? '🔐 Login' : '📝 Register'}
            </button>
          ))}
        </div>

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <label style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 6,
            display: 'block',
            fontFamily: 'JetBrains Mono, monospace',
          }}>Email</label>
          <input
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%', padding: '11px 14px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, color: '#fff',
              fontSize: 14, boxSizing: 'border-box',
              outline: 'none',
              fontFamily: 'Sora, sans-serif',
              transition: 'border 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(124,106,255,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 22 }}>
          <label style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 6,
            display: 'block',
            fontFamily: 'JetBrains Mono, monospace',
          }}>Password</label>
          <input
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{
              width: '100%', padding: '11px 14px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, color: '#fff',
              fontSize: 14, boxSizing: 'border-box',
              outline: 'none',
              fontFamily: 'Sora, sans-serif',
              transition: 'border 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(124,106,255,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
          <p style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: 11,
            marginTop: 6
          }}>
            Must contain 8+ chars, uppercase, lowercase, number & special character
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 8, padding: '10px 14px',
            color: '#f87171', fontSize: 13, marginBottom: 16,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '13px 0',
            background: loading
              ? 'rgba(124,106,247,0.4)'
              : 'linear-gradient(135deg, #7c6af7, #5b4fcf)',
            color: '#fff', border: 'none',
            borderRadius: 10,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 15, fontWeight: 600,
            boxShadow: loading ? 'none' : '0 4px 24px rgba(124,106,247,0.35)',
            transition: 'all 0.2s',
            fontFamily: 'Sora, sans-serif',
          }}>
          {loading ? '⏳ Please wait...' : mode === 'login' ? '🔐 Login' : '🚀 Create Account'}
        </button>

        <p style={{
          textAlign: 'center', marginTop: 18,
          color: 'rgba(255,255,255,0.2)',
          fontSize: 11,
          fontFamily: 'JetBrains Mono, monospace',
          letterSpacing: '0.05em',
        }}>
          🔒 Your data is private & secure
        </p>
      </div>
    </div>
  );
}