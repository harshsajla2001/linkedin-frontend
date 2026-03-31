import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(name, email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <nav className="auth-nav">
        <Link href="/">
          <div className="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 21" width="84" height="21">
              <path d="M12.5 2.75a1.75 1.75 0 10-3.5 0 1.75 1.75 0 003.5 0zM9 6.5h3v11H9v-11zM15 6.5h3v1.6c.8-1.1 2.2-1.9 3.5-1.9 3.3 0 4.5 2.2 4.5 5.2v6.1h-3v-5.5c0-1.8-.6-3-2.2-3-1.4 0-2.3 1-2.7 2-.1.3-.1.7-.1 1v5.5h-3V6.5zM0 6.5h3v11H0v-11zm1.5-3.75a1.75 1.75 0 100-3.5 1.75 1.75 0 000 3.5z" fill="#0a66c2"/>
              <path d="M30 6.5h3v1.7h.1c.5-.9 1.7-1.9 3.5-1.9 1.5 0 2.6.5 3.3 1.6.9-1 2.2-1.6 3.6-1.6 2.8 0 4.2 1.9 4.2 4.7v6.5h-3v-5.8c0-1.5-.5-2.7-2-2.7-1.2 0-2.1.9-2.4 1.8-.1.3-.1.6-.1 1v5.7h-3v-5.8c0-1.4-.5-2.7-1.9-2.7s-2.2.9-2.5 1.8c-.1.3-.1.6-.1 1v5.7h-3V6.5z" fill="#0a66c2"/>
            </svg>
          </div>
        </Link>
      </nav>
      
      <main className="auth-main">
        <div className="auth-hero">
          <h1>Make the most of your professional life</h1>
        </div>

        <div className="auth-card">
          {error && (
            <div className="error-banner">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 4.5h2v4H7v-4zm0 6h2v1.5H7V10.5z"/>
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                id="name"
                type="text" 
                className="auth-input" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                id="email"
                type="email" 
                className="auth-input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password (6 or more characters)</label>
              <input 
                id="password"
                type="password" 
                className="auth-input" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                minLength={6} 
              />
            </div>
            
            <p className="agreement">
              By clicking Agree & Join or Continue, you agree to the LinkedIn{' '}
              <a href="#">User Agreement</a>, <a href="#">Privacy Policy</a>, and{' '}
              <a href="#">Cookie Policy</a>.
            </p>
            
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  Joining...
                </span>
              ) : (
                'Agree & Join'
              )}
            </button>
          </form>
          
          <div className="divider">
            <span>or</span>
          </div>
          
          <p className="switch-link">
            Already on LinkedIn? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </main>

      <footer className="auth-footer">
        <span>LinkedIn Clone © 2026</span>
      </footer>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f3f2ef;
        }

        .auth-nav {
          padding: 20px 40px;
          flex-shrink: 0;
        }

        .logo {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .auth-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .auth-hero {
          text-align: center;
          margin-bottom: 24px;
          max-width: 420px;
        }

        .auth-hero h1 {
          font-size: 32px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.9);
          line-height: 1.25;
          letter-spacing: -0.2px;
        }

        .auth-card {
          width: 100%;
          max-width: 400px;
          background: #ffffff;
          border-radius: 8px;
          padding: 32px 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08),
                      0 0 0 1px rgba(0, 0, 0, 0.04);
          animation: slideUp 0.4s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          color: #b91c1c;
          font-size: 14px;
          margin-bottom: 16px;
          animation: shake 0.3s ease-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.75);
        }

        .auth-input {
          width: 100%;
          padding: 10px 12px;
          font-size: 15px;
          font-family: inherit;
          color: rgba(0, 0, 0, 0.9);
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .auth-input:hover {
          border-color: rgba(0, 0, 0, 0.5);
        }

        .auth-input:focus {
          border-color: #0a66c2;
          box-shadow: 0 0 0 2px rgba(10, 102, 194, 0.3);
        }

        .agreement {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.55);
          text-align: center;
          line-height: 1.5;
          margin: 4px 0 0;
        }

        .agreement a {
          color: #0a66c2;
          font-weight: 600;
        }

        .agreement a:hover {
          text-decoration: underline;
        }

        .auth-submit {
          width: 100%;
          padding: 13px 24px;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          background: #0a66c2;
          border: none;
          border-radius: 28px;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease;
          margin-top: 4px;
        }

        .auth-submit:hover:not(:disabled) {
          background: #004182;
        }

        .auth-submit:active:not(:disabled) {
          transform: scale(0.98);
        }

        .auth-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 24px 0;
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid rgba(0, 0, 0, 0.15);
        }

        .divider span {
          padding: 0 16px;
        }

        .switch-link {
          text-align: center;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.6);
        }

        .switch-link a {
          color: #0a66c2;
          font-weight: 600;
          margin-left: 4px;
          transition: color 0.15s ease;
        }

        .switch-link a:hover {
          text-decoration: underline;
          color: #004182;
        }

        .auth-footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.45);
        }

        @media (max-width: 480px) {
          .auth-nav {
            padding: 16px 20px;
          }

          .auth-hero h1 {
            font-size: 24px;
          }

          .auth-card {
            padding: 24px 20px;
            box-shadow: none;
            border-radius: 0;
          }
        }
      `}</style>
    </div>
  );
}
