import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout';
import { Users, UserPlus, Hash, FileText, MessageSquare } from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

const Network = () => {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [suggestions, setSuggestions] = useState([]);
  const [myConnections, setMyConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sugRes, connRes] = await Promise.all([
        api.get('/users/suggestions'),
        api.get('/users/my-connections')
      ]);
      setSuggestions(sugRes.data);
      setMyConnections(connRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const handleConnect = async (id) => {
    try {
      await api.post(`/users/connect/${id}`);
      toast.success('Connection updated!');
      fetchData(); // Refresh list to remove the connected user and show in connections
    } catch (err) {
      toast.error('Could not connect');
    }
  };

  return (
    <Layout>
      <div className="network-container">
        <div className="network-sidebar">
          <div className="card manage-card">
            <h3>Manage my network</h3>
            <ul className="manage-list">
              <li>
                <div className="item-left">
                  <Users size={20} />
                  <span>Connections</span>
                </div>
                <span className="count">{currentUser?.connections?.length || 0}</span>
              </li>
              <li>
                <div className="item-left">
                  <UserPlus size={20} />
                  <span>Following & followers</span>
                </div>
              </li>
              <li>
                <div className="item-left">
                  <Hash size={20} />
                  <span>Hashtags</span>
                </div>
              </li>
              <li>
                <div className="item-left">
                  <FileText size={20} />
                  <span>Pages</span>
                </div>
                <span className="count">12</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="network-main">
          {/* Mock invitations for demo but real suggestions below */}
          <div className="card invitations">
            <div className="invitation-header">
              <h2>My Connections ({myConnections.length})</h2>
              <button className="btn-secondary" style={{border: 'none'}}>Manage</button>
            </div>
            {myConnections.length === 0 ? (
              <p style={{padding: '16px', color: 'var(--text-muted)', fontSize: '14px'}}>You haven't connected with anyone yet.</p>
            ) : (
              <div className="grid" style={{padding: '16px'}}>
                {myConnections.map((conn) => (
                  <div key={conn._id} className="person-card">
                    <div className="cover-photo" onClick={() => router.push(`/profile/${conn._id}`)} style={{cursor: 'pointer'}}></div>
                    <div className="avatar-wrapper" onClick={() => router.push(`/profile/${conn._id}`)} style={{cursor: 'pointer'}}>
                      {conn.avatar ? (
                        <img src={conn.avatar} alt={conn.name} className="avatar" />
                      ) : (
                        <div className="avatar">{conn.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className="person-info">
                      <h4 onClick={() => router.push(`/profile/${conn._id}`)} style={{cursor: 'pointer'}}>{conn.name}</h4>
                      <p>{conn.headline || 'Professional at LinkedIn'}</p>
                      <span className="mutual">{conn.connections?.length || 0} connections</span>
                    </div>
                    <button 
                      className="btn-primary connect-btn" 
                      onClick={() => router.push(`/messaging?userId=${conn._id}`)}
                      style={{background: 'var(--accent-blue)', color: 'white'}}
                    >
                      <MessageSquare size={16} />
                      <span>Message</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="card recommendations">
            <div className="recommendation-header">
              <h3>People you may know based on your database</h3>
              <button className="btn-secondary" style={{border: 'none'}}>See all</button>
            </div>
            
            <div className="grid">
              {loading ? (
                <div style={{padding: '24px', textAlign: 'center', gridColumn: '1/-1'}}>Searching database...</div>
              ) : suggestions.map((p) => (
                <div key={p._id} className="person-card">
                  <div className="cover-photo" onClick={() => router.push(`/profile/${p._id}`)} style={{cursor: 'pointer'}}></div>
                  <div className="avatar-wrapper" onClick={() => router.push(`/profile/${p._id}`)} style={{cursor: 'pointer'}}>
                    {p.avatar ? (
                      <img src={p.avatar} alt={p.name} className="avatar" />
                    ) : (
                      <div className="avatar">{p.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="person-info">
                    <h4 onClick={() => router.push(`/profile/${p._id}`)} style={{cursor: 'pointer'}}>{p.name}</h4>
                    <p>{p.headline || 'Professional at LinkedIn'}</p>
                    <span className="mutual">{p.connections?.length || 0} connections</span>
                  </div>
                  <button 
                    className="btn-secondary connect-btn" 
                    onClick={() => handleConnect(p._id)}
                  >
                    <UserPlus size={16} />
                    <span>Connect</span>
                  </button>
                </div>
              ))}
              {!loading && suggestions.length === 0 && (
                <p style={{padding: '24px', textAlign: 'center', gridColumn: '1/-1', color: 'var(--text-muted)'}}>No new suggestions found.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .network-container { display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 24px; padding-bottom: 40px; }
        
        .manage-card { padding: 12px 0; }
        .manage-card h3 { padding: 8px 16px 12px; font-size: 16px; font-weight: 600; border-bottom: 1px solid var(--border-light); }
        .manage-list li { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; cursor: pointer; color: var(--text-secondary); transition: background 0.2s; }
        .manage-list li:hover { background: rgba(0,0,0,0.03); color: var(--text-primary); }
        .item-left { display: flex; align-items: center; gap: 16px; }
        .item-left span { font-size: 14px; font-weight: 500; }
        .count { font-size: 14px; }
        
        .invitations { margin-bottom: 16px; }
        .invitation-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid var(--border-light); }
        .invitation-header h2 { font-size: 16px; font-weight: 600; }
        .invitation-item { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; }
        .invitation-user { display: flex; gap: 12px; flex: 1; min-width: 0; }
        .avatar-mini { width: 72px; height: 72px; border-radius: 50%; background: #eee; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: #666; }
        .info { flex: 1; min-width: 0; }
        .info h4 { font-size: 16px; font-weight: 600; margin: 0; }
        .info p { font-size: 14px; color: var(--text-secondary); margin: 2px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .info span { font-size: 12px; color: var(--text-muted); }
        .invitation-actions { display: flex; gap: 8px; flex-shrink: 0; }
        
        .recommendation-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding: 16px 0 0; }
        .recommendation-header h3 { font-size: 16px; font-weight: 600; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .person-card { border: 1px solid var(--border-light); border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; align-items: center; padding-bottom: 16px; background: var(--bg-card); transition: box-shadow 0.2s; }
        .person-card:hover { box-shadow: var(--shadow-md); }
        .cover-photo { width: 100%; height: 60px; background: linear-gradient(to right, #70b5f9, #0a66c2); }
        .avatar-wrapper { width: 100%; display: flex; justify-content: center; margin-top: -36px; }
        .avatar { width: 72px; height: 72px; border-radius: 50%; background: #eee; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; border: 2px solid var(--bg-card); color: #666; }
        .person-info { text-align: center; padding: 12px 12px 0; flex: 1; margin-bottom: 12px; width: 100%; }
        .person-info h4 { font-size: 16px; font-weight: 600; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .person-info p { font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 34px; }
        .mutual { font-size: 12px; color: var(--text-muted); display: block; margin-top: 4px; }
        .connect-btn { display: flex; gap: 6px; padding: 6px 16px; width: calc(100% - 32px); margin: 0 16px; justify-content: center; border-radius: 24px; border: 1px solid var(--accent-blue) !important; color: var(--accent-blue) !important; font-weight: 600; transition: all 0.2s; }
        .connect-btn:hover { background: rgba(10, 102, 194, 0.1) !important; border-width: 2px !important; }
        
        @media (max-width: 1100px) {
          .network-container { grid-template-columns: 240px minmax(0, 1fr); }
        }

        @media (max-width: 992px) {
          .network-container { grid-template-columns: 1fr; }
          .manage-card { margin-bottom: 16px; border-bottom: 1px solid var(--border-light); }
        }

        @media (max-width: 768px) {
          .invitation-item { flex-direction: column; align-items: stretch; gap: 16px; }
          .invitation-actions { align-self: stretch; display: flex; }
          .invitation-actions button { flex: 1; }
        }
      `}</style>
    </Layout>
  );
};

export default Network;
