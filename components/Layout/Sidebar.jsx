import React from 'react';
import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="sidebar">
      <div className="card profile-card">
        <div className="cover-photo"></div>
        <div className="profile-info">
          <Link href={user ? `/profile/${user._id}` : '/login'}>
            {user?.avatar ? (
              <img src={user.avatar} alt="Me" className="avatar-img" />
            ) : (
              <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
            )}
          </Link>
          <h2>{user?.name || 'Guest User'}</h2>
          <p>{user?.headline || 'Professional on LinkedIn'}</p>
        </div>
        <div className="stats">
          <div className="stat">
            <span>Profile viewers</span>
            <span className="stat-number">42</span>
          </div>
          <div className="stat">
            <span>Connections</span>
            <span className="stat-number">500+</span>
          </div>
        </div>
        <div className="items">
          <div className="item">
            <Bookmark size={16} />
            <span>My items</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sidebar { position: sticky; top: calc(var(--nav-height) + 24px); }
        .profile-card { padding: 0; overflow: hidden; background: var(--bg-card); border: 1px solid var(--border-color); }
        .cover-photo { height: 60px; background: linear-gradient(to right, #a0b4b7, #dce4e5); }
        .profile-info { padding: 0 16px 16px; text-align: center; border-bottom: 1px solid var(--border-color); }
        .avatar, .avatar-img { width: 72px; height: 72px; border-radius: 50%; border: 2px solid var(--bg-card); background: var(--accent-blue); margin: -36px auto 12px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; font-size: 24px; object-fit: cover; }
        .profile-info h2 { font-size: 16px; margin-bottom: 4px; color: var(--text-primary); }
        .profile-info p { font-size: 12px; color: var(--text-secondary); }
        .stats { padding: 12px 0; border-bottom: 1px solid var(--border-color); }
        .stat { display: flex; justify-content: space-between; padding: 4px 16px; font-size: 12px; font-weight: 600; color: var(--text-secondary); cursor: pointer; }
        .stat:hover { background: rgba(0,0,0,0.05); }
        .stat-number { color: var(--accent-blue); }
        .items { padding: 12px 0; }
        .item { display: flex; align-items: center; gap: 8px; padding: 8px 16px; font-size: 12px; font-weight: 600; color: var(--text-primary); cursor: pointer; }
        .item:hover { background: rgba(0,0,0,0.05); }
      `}</style>
    </div>
  );
};

export default Sidebar;
