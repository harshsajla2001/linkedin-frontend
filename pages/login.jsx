import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="auth-container">
      <nav className="auth-nav">
        <Link href="/">
          <div className="logo">Linked<span>in</span></div>
        </Link>
      </nav>
      
      <main className="auth-main">
        <div className="auth-card glass-panel">
          <h2>Sign in</h2>
          <p>Stay updated on your professional world</p>
          {error && <p style={{color: 'red', marginBottom: '10px'}}>{error}</p>}
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="email" placeholder="Email or Phone" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <input type="password" placeholder="Password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            
            <button type="submit" className="btn-primary submit-btn">Sign in</button>
            <Link href="#" className="forgot-password">Forgot password?</Link>
          </form>
          
          <div className="separator">
            <span>or</span>
          </div>
          
          <div className="register-link">
            New to LinkedIn? <Link href="/signup">Join now</Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        .auth-container { min-height: 100vh; display: flex; flex-direction: column; background: var(--bg-primary); }
        .auth-nav { padding: 24px 40px; }
        .logo { font-size: 24px; font-weight: bold; color: white; display:flex; align-items:center; }
        .logo span { background: var(--accent-blue); color: white; padding: 2px 4px; border-radius: 4px; margin-left: 2px; }
        .auth-main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .auth-card { width: 100%; max-width: 350px; padding: 32px 24px; }
        .auth-card h2 { font-size: 32px; margin-bottom: 4px; font-weight: 600; }
        .auth-card p { font-size: 14px; color: var(--text-secondary); margin-bottom: 24px; }
        .auth-form { display: flex; flex-direction: column; gap: 16px; }
        .submit-btn { width: 100%; padding: 14px; font-size: 16px; border-radius: 28px; margin-top: 8px; }
        .forgot-password { color: var(--accent-blue); font-size: 14px; font-weight: 600; text-align: center; margin-top: 16px; display: block; }
        .separator { display: flex; align-items: center; text-align: center; margin: 24px 0; color: var(--text-muted); font-size: 14px; }
        .separator::before, .separator::after { content: ''; flex: 1; border-bottom: 1px solid var(--border-light); }
        .separator span { padding: 0 16px; }
        .register-link { text-align: center; font-size: 14px; color: var(--text-secondary); }
        .register-link a { color: var(--accent-blue); font-weight: 600; margin-left: 4px; }
        .register-link a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
