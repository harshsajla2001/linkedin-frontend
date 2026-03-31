import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout';
import { Edit2, Plus, X, Camera, Loader2 } from 'lucide-react';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const router = useRouter();
  const { id } = router.query;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', headline: '', location: '', about: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const { user: currentUser } = useAuth();
  
  useEffect(() => {
    if (!router.isReady || !id) return;

    let isSubscribed = true;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/users/${id}`);
        if (isSubscribed) {
          setProfile(res.data);
          setEditFormData({
            name: res.data.name || '',
            headline: res.data.headline || '',
            location: res.data.location || '',
            about: res.data.about || ''
          });
          setAvatarPreview(res.data.avatar || null);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (isSubscribed) setProfile(null);
      } finally {
        if (isSubscribed) setLoading(false);
      }
    };
    
    fetchProfile();

    return () => { isSubscribed = false; };
  }, [id, router.isReady]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const formData = new FormData();
    Object.keys(editFormData).forEach(key => formData.append(key, editFormData[key]));
    if (avatarFile) formData.append('avatar', avatarFile);

    try {
      const res = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(res.data);
      setIsEditModalOpen(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleConnect = async () => {
    if (!currentUser) return router.push('/login');
    try {
      await api.post(`/users/connect/${id}`);
      toast.success(isConnected ? 'Disconnected' : 'Connected!');
      fetchProfile();
    } catch (err) {
      toast.error('Connection failed');
    }
  };

  const handleCoverPhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('coverPhoto', file);
    
    try {
      const res = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile((prev) => ({ ...prev, coverPhoto: res.data.coverPhoto }));
      toast.success('Background picture updated!');
    } catch (err) {
      console.error('Error updating cover photo:', err);
      toast.error('Failed to update background picture');
    }
  };

  const isConnected = profile?.connections?.includes(currentUser?._id);
  const isOwnProfile = currentUser?._id === id;

  if (loading) return <Layout><div style={{padding: '40px', textAlign: 'center'}}>Loading profile...</div></Layout>;
  if (!profile) return <Layout><div style={{padding: '40px', textAlign: 'center'}}>User not found</div></Layout>;

  return (
    <Layout>
      <div className="profile-container">
        <div className="main-content">
          <div className="card profile-header">
            <div className="cover-photo" style={{ backgroundImage: profile.coverPhoto ? `url(${profile.coverPhoto})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              {currentUser?._id === id && (
                <>
                  <label htmlFor="cover-upload" className="icon-btn-circle edit-cover" style={{position: 'absolute', top: '16px', right: '16px', background: 'white', cursor: 'pointer', zIndex: 10}}>
                    <Camera size={20} />
                  </label>
                  <input id="cover-upload" type="file" style={{display: 'none'}} onChange={handleCoverPhotoChange} accept="image/*" />
                </>
              )}
            </div>
            <div className="profile-details">
              <div className="avatar-wrapper">
                {profile.avatar && !imageError ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.name} 
                    className="avatar-img" 
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="avatar">{profile.name?.charAt(0)}</div>
                )}
              </div>
              <div className="info">
                <div className="info-left">
                  <h1 style={{ wordWrap: 'break-word', whiteSpace: 'normal', overflowWrap: 'break-word', maxWidth: '100%' }}>{profile.name}</h1>
                  <p className="headline">{profile.headline || 'Professional at LinkedIn'}</p>
                  <p className="location">{profile.location || 'Location unknown'}</p>
                  <p className="connections">{profile.connections?.length || 0} connections</p>
                  
                  <div className="actions" style={{marginTop: '16px'}}>
                    {currentUser?._id === id ? (
                      <button className="btn-primary" onClick={() => setIsEditModalOpen(true)}>Edit Profile</button>
                    ) : (
                      <>
                        <button 
                          className={isConnected ? "btn-secondary" : "btn-primary"} 
                          onClick={handleConnect}
                        >
                          {isConnected ? 'Connected' : 'Connect'}
                        </button>
                        <button 
                          className="btn-secondary" 
                          onClick={() => router.push(`/messaging?userId=${profile._id}`)}
                        >
                          Message
                        </button>
                      </>
                    )}
                    <button className="btn-secondary">More</button>
                  </div>
                </div>
                <div className="info-right">
                  <ul>
                    <li>Education</li>
                    <li>Experience</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card about-section">
            <div className="section-header">
              <h2>About</h2>
              {isOwnProfile && <button onClick={() => setIsEditModalOpen(true)} className="icon-btn-circle"><Edit2 size={18} /></button>}
            </div>
            <p>{profile.about || 'No about information shared yet.'}</p>
          </div>
          
          <div className="card experience-section">
            <div className="section-header">
              <h2>Experience</h2>
              {isOwnProfile && (
                <div className="actions-right">
                  <button className="icon-btn"><Plus size={24} /></button>
                </div>
              )}
            </div>
            
            <div className="experience-item">
              <div className="company-logo">E</div>
              <div className="experience-details">
                <h3>Senior Role</h3>
                <h4>Company Name · Full-time</h4>
                <p className="date-range">Jan 2022 - Present</p>
                <p className="description">Add your professional experiences here.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="right-panel">
          <div className="card side-card">
            <h3>More Profiles for You</h3>
            <div style={{marginTop: '16px'}}>
              <p style={{fontSize: 14, color: 'var(--text-secondary)'}}>Explore similar professionals based on your network.</p>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content card animate-fade">
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="icon-btn"><X size={24} /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="avatar-edit">
                <div className="avatar-preview">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" />
                  ) : (
                    <div className="avatar-placeholder">{editFormData.name?.charAt(0)}</div>
                  )}
                  <label htmlFor="avatar-upload" className="avatar-upload-label">
                    <Camera size={20} />
                  </label>
                  <input id="avatar-upload" type="file" onChange={handleAvatarChange} style={{display: 'none'}} />
                </div>
                <span>Change Profile Photo</span>
              </div>

              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  value={editFormData.name} 
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div className="form-group">
                <label>Headline</label>
                <input 
                  type="text" 
                  value={editFormData.headline} 
                  onChange={(e) => setEditFormData({...editFormData, headline: e.target.value})}
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  value={editFormData.location} 
                  onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label>About</label>
                <textarea 
                  value={editFormData.about} 
                  onChange={(e) => setEditFormData({...editFormData, about: e.target.value})}
                  className="input-field"
                  rows="4"
                  style={{resize: 'none'}}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-secondary" disabled={updating}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={updating}>
                  {updating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" style={{marginRight: '8px'}} />
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .profile-container { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 24px; padding-bottom: 40px; margin-top: 24px; }
        .profile-header { padding: 0; overflow: hidden; margin-bottom: 12px; }
        .cover-photo { height: 200px; background: linear-gradient(to right, #a0b4b7, #dce4e5); position: relative; }
        .profile-details { padding: 0 24px 24px; position: relative; }
        .avatar-wrapper { position: relative; margin-top: -110px; width: 152px; height: 152px; border-radius: 50%; border: 4px solid var(--bg-card); background: #eee; padding: 0; overflow: hidden; margin-bottom: 16px; display: inline-block; }
        .avatar-img { width: 100%; height: 100%; object-fit: cover; }
        .avatar { width: 100%; height: 100%; border-radius: 50%; background: var(--accent-blue); display: flex; align-items: center; justify-content: center; font-size: 64px; font-weight: bold; color: white; }
        .info { display: flex; justify-content: space-between; align-items: flex-start; }
        .info-left { flex: 1; min-width: 0; padding-right: 16px; }
        .info-left h1 { font-size: 24px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; line-height: 1.2; word-wrap: break-word; }
        .headline { font-size: 16px; color: var(--text-primary); margin-bottom: 4px; word-wrap: break-word; }
        .location { font-size: 14px; color: var(--text-secondary); margin-bottom: 8px; word-wrap: break-word; }
        .connections { font-size: 14px; color: var(--accent-blue); font-weight: 600; cursor: pointer; display: inline-block; }
        .actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
        .info-right ul { list-style: none; display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; }
        .info-right li { font-size: 14px; font-weight: 600; color: var(--accent-blue); cursor: pointer; }
        
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .section-header h2 { font-size: 20px; font-weight: 600; color: var(--text-primary); }
        .icon-btn-circle { background: transparent; border: none; color: var(--text-secondary); cursor: pointer; padding: 8px; border-radius: 50%; transition: background 0.2s; display: inline-flex; align-items: center; justify-content: center; }
        .icon-btn-circle:hover { background: #f3f3f3; }
        
        .about-section p { font-size: 14px; line-height: 1.6; color: var(--text-primary); }
        
        .experience-item { display: flex; gap: 16px; padding-top: 16px; border-top: 1px solid var(--border-color); }
        .company-logo { width: 48px; height: 48px; background: #eee; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #666; flex-shrink: 0; }
        .experience-details { flex: 1; min-width: 0; }
        .experience-details h3 { font-size: 16px; font-weight: 600; color: var(--text-primary); margin: 0; }
        .experience-details h4 { font-size: 14px; color: var(--text-primary); margin: 2px 0; }
        .date-range { font-size: 14px; color: var(--text-secondary); }
        .description { font-size: 14px; margin-top: 8px; color: var(--text-primary); }
        
        /* Modal Styles */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; background: white !important; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid var(--border-color); }
        .edit-form { padding: 24px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-size: 14px; color: var(--text-secondary); }
        .avatar-edit { display: flex; flex-direction: column; align-items: center; gap: 12px; margin-bottom: 24px; }
        .avatar-preview { width: 120px; height: 120px; border-radius: 50%; border: 2px solid var(--border-color); position: relative; background: #eee; overflow: hidden; }
        .avatar-preview img { width: 100%; height: 100%; object-fit: cover; }
        .avatar-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 48px; font-weight: bold; background: var(--accent-blue); color: white; }
        .avatar-upload-label { position: absolute; bottom: 4px; right: 4px; background: white; color: var(--accent-blue); padding: 8px; border-radius: 50%; cursor: pointer; box-shadow: var(--shadow-sm); }
        .modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--border-color); }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 992px) {
          .profile-container { grid-template-columns: 1fr; margin: 24px 0; }
          .right-panel { display: none; }
        }

        @media (max-width: 768px) {
          .info { flex-direction: column; gap: 16px; }
          .avatar-wrapper { width: 120px; height: 120px; top: -80px; }
          .info { margin-top: 48px; }
        }
      `}</style>
    </Layout>
  );
};

export default Profile;
