import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, Users, Briefcase, MessageSquare, Bell, Search, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <nav className="navbar glass-panel">
      <div className="nav-container">
        <div className="nav-left">
          <Link href="/" className="logo-link">
            <div className="logo">in</div>
          </Link>
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search" />
          </div>
        </div>
        
        <ul className="nav-right">
          <li className="nav-item">
            <Link href="/">
              <Home size={24} />
              <span>Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/network">
              <Users size={24} />
              <span>My Network</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/messaging">
              <MessageSquare size={24} />
              <span>Messaging</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/notifications">
              <Bell size={24} />
              <span>Notifications</span>
            </Link>
          </li>
          <li className="nav-item user-profile">
            {user ? (
              <Link href={`/profile/${user._id}`}>
                {user.avatar ? (
                  <img src={user.avatar} alt="Me" className="avatar-img-nav" />
                ) : (
                  <div className="avatar-placeholder">{user.name.charAt(0)}</div>
                )}
                <span>Me</span>
              </Link>
            ) : (
              <button 
                onClick={() => router.push('/login')} 
                style={{background: 'transparent', border: '1px solid var(--accent-blue)', color: 'var(--accent-blue)', padding: '4px 12px', borderRadius: '16px', fontWeight: '600', cursor: 'pointer'}}
              >
                Sign In
              </button>
            )}
          </li>
          {user && (
            <li className="nav-item">
              <button onClick={logout} className="logout-btn">
                <LogOut size={24} />
                <span>Logout</span>
              </button>
            </li>
          )}
        </ul>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--nav-height);
          z-index: 100;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
        }
        
        .nav-container {
          max-width: var(--max-width);
          margin: 0 auto;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
        }

        .nav-left { display: flex; align-items: center; gap: 12px; }

        .logo {
          background: var(--accent-blue);
          color: white;
          font-weight: bold;
          font-size: 24px;
          height: 34px;
          width: 34px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 4px;
        }

        .search-box {
          display: flex;
          align-items: center;
          background: #edf3f8;
          padding: 0 12px;
          border-radius: 4px;
          height: 34px;
        }
        
        .search-box input {
          background: transparent;
          border: none;
          color: var(--text-primary);
          margin-left: 8px;
          width: 240px;
          outline: none;
          font-size: 14px;
        }
        
        .search-icon { color: var(--text-secondary); }

        .nav-right { display: flex; align-items: center; gap: 24px; height: 100%; }

        .nav-item :global(a) {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 12px;
          gap: 2px;
        }

        .nav-item:hover :global(a) { color: var(--text-primary); }
        .nav-item.active :global(a) { color: var(--text-primary); border-bottom: 2px solid var(--text-primary); padding-bottom: 0px; }

        .avatar-placeholder, .avatar-img-nav {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: bold;
          color: #666;
          object-fit: cover;
        }

        .logout-btn {
          background: transparent;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 12px;
          gap: 2px;
          padding: 0;
        }

        .logout-btn:hover { color: var(--text-primary); }
        
        @media (max-width: 768px) {
          .search-box input { display: none; }
          .nav-item span { display: none; }
          .nav-right { gap: 16px; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
