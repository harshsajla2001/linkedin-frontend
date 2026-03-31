import React, { useState, useRef } from 'react';
import { Image, Video, Calendar, FileText, X, Loader2 } from 'lucide-react';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

const PostCreation = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();
  const { user } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && !image) return;
    if (!user || !user._id) {
      alert('You must be logged in to post');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('content', content);
    formData.append('userId', user._id);
    if (image) formData.append('image', image);

    try {
      const res = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setContent('');
      setImage(null);
      setPreview(null);
      if (onPostCreated) onPostCreated(res.data);
    } catch (err) {
      console.error('Error creating post:', err.response?.data || err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Something went wrong';
      alert(`Failed to create post: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card post-creation">
      <form onSubmit={handleSubmit}>
        <div className="input-row">
          {user?.avatar ? (
            <img src={user.avatar} alt="Me" className="avatar-mini-img" />
          ) : (
            <div className="avatar-mini">{user?.name?.charAt(0) || 'U'}</div>
          )}
          <textarea 
            placeholder="Start a post" 
            className="post-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        
        {preview && (
          <div className="image-preview-container">
            <img src={preview} alt="Preview" className="image-preview" />
            <button type="button" className="remove-img" onClick={() => { setImage(null); setPreview(null); }}>
              <X size={20} />
            </button>
          </div>
        )}

        <div className="actions">
          <button type="button" className="action-btn" onClick={() => fileInputRef.current.click()}>
            <Image size={24} color="#70b5f9" />
            <span style={{color: 'var(--text-secondary)'}}>Photo</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            style={{ display: 'none' }} 
            accept="image/*"
          />
          <button type="button" className="action-btn">
            <Video size={24} color="#5f9b41" />
            <span style={{color: 'var(--text-secondary)'}}>Video</span>
          </button>
          <button type="button" className="action-btn">
            <Calendar size={24} color="#c37d16" />
            <span style={{color: 'var(--text-secondary)'}}>Event</span>
          </button>
          <button type="submit" className="btn-primary" disabled={loading || (!content && !image)}>
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" style={{marginRight: '8px'}} />
                Posting...
              </>
            ) : 'Post'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .post-creation { padding: 12px 16px; margin-bottom: 12px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; }
        .input-row { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; }
        .avatar-mini, .avatar-mini-img { width: 48px; height: 48px; border-radius: 50%; background: var(--accent-blue); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; object-fit: cover; }
        .post-textarea { flex: 1; min-height: 48px; padding: 12px; border: 1px solid var(--border-color); border-radius: 24px; background: transparent; color: var(--text-primary); font-family: var(--font-family); resize: none; outline: none; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .post-textarea:hover { background: rgba(0,0,0,0.05); }
        .image-preview-container { position: relative; margin-bottom: 12px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color); }
        .image-preview { width: 100%; max-height: 400px; object-fit: cover; }
        .remove-img { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.6); color: white; border: none; border-radius: 50%; padding: 4px; cursor: pointer; }
        .actions { display: flex; justify-content: space-between; align-items: center; padding-top: 4px; }
        .action-btn { display: flex; align-items: center; gap: 8px; background: transparent; border: none; padding: 12px; border-radius: 4px; color: var(--text-secondary); cursor: pointer; font-weight: 600; transition: background 0.2s; font-size: 14px; }
        .action-btn:hover { background: rgba(0,0,0,0.05); }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 480px) { .action-btn span { display: none; } }
      `}</style>
    </div>
  );
};

export default PostCreation;
