import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
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
        <div className="auth-header">
          <h2>Make the most of your professional life</h2>
        </div>
        <div className="auth-card glass-panel">
          {error && <p style={{color: 'red', marginBottom: '10px'}}>{error}</p>}
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password (6 or more characters)</label>
              <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            
            <p className="agreement">
              By clicking Agree & Join, you agree to the LinkedIn User Agreement, Privacy Policy, and Cookie Policy.
            </p>
            
            <button type="submit" className="btn-primary submit-btn">Agree & Join</button>
          </form>
          
          <div className="separator">
            <span>or</span>
          </div>
          
          <div className="register-link">
            Already on LinkedIn? <Link href="/login">Sign in</Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        .auth-container { min-height: 100vh; display: flex; flex-direction: column; background: var(--bg-primary); }
        .auth-nav { padding: 24px 40px; }
        .logo { font-size: 24px; font-weight: bold; color: white; display:flex; align-items:center; }
        .logo span { background: var(--accent-blue); color: white; padding: 2px 4px; border-radius: 4px; margin-left: 2px; }
        .auth-main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; }
        .auth-header { text-align: center; margin-bottom: 24px; max-width: 400px; }
        .auth-header h2 { font-size: 32px; font-weight: 400; color: white; line-height: 1.2; }
        .auth-card { width: 100%; max-width: 400px; padding: 32px 24px; }
        .auth-form { display: flex; flex-direction: column; gap: 16px; }
        .form-group label { display: block; font-size: 14px; color: var(--text-secondary); margin-bottom: 4px; }
        .agreement { font-size: 12px; color: var(--text-muted); text-align: center; margin: 8px 0; }
        .submit-btn { width: 100%; padding: 14px; font-size: 16px; border-radius: 28px; margin-top: 8px; }
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
