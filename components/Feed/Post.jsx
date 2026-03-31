import React, { useState } from 'react';
import Link from 'next/link';
import { ThumbsUp, MessageSquare, Share2, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';

const Post = ({ post }) => {
  const { user: currentUser } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [liked, setLiked] = useState(post.likes?.includes(currentUser?._id));
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [submitting, setSubmitting] = useState(false);
  
  const data = post;
  const avatarText = data.user?.name?.charAt(0) || 'U';

  const handleLike = async () => {
    if (!currentUser) return alert('Please sign in to like posts');
    
    try {
      const res = await api.put(`/posts/${data._id}/like`);
      setLikes(res.data);
      setLiked(res.data.includes(currentUser._id));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert('Please sign in to comment');
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.post(`/posts/${data._id}/comment`, { text: commentText });
      setComments(res.data);
      setCommentText('');
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card post animate-fade">
      <div className="post-header">
        <Link href={data.user?._id ? `/profile/${data.user._id}` : '#'}>
          <div className="avatar" style={{cursor: 'pointer'}}>{avatarText}</div>
        </Link>
        <div className="user-info">
          <Link href={data.user?._id ? `/profile/${data.user._id}` : '#'}>
            <h3 style={{cursor: 'pointer'}}>{data.user?.name}</h3>
          </Link>
          <p>{data.user?.headline || 'Professional at LinkedIn'}</p>
          <span>{new Date(data.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="post-content">
        <p>{data.content}</p>
        {data.image && <img src={data.image} alt="Post content" className="post-image" />}
      </div>
      
      <div className="post-stats">
        <span>{likes.length} likes</span>
        <span>{comments?.length || 0} comments</span>
      </div>
      
      <div className="post-actions">
        <button 
          className={`action-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <ThumbsUp size={20} />
          <span>Like</span>
        </button>
        <button className="action-btn" onClick={() => setShowComments(!showComments)}>
          <MessageSquare size={20} />
          <span>Comment</span>
        </button>
        <button className="action-btn">
          <Share2 size={20} />
          <span>Share</span>
        </button>
        <button className="action-btn">
          <Send size={20} />
          <span>Send</span>
        </button>
      </div>
      
      {showComments && (
        <div className="comments-section">
          {comments.length > 0 && (
            <div className="comments-list">
              {comments.map((comment, idx) => (
                <div key={idx} className="comment-item">
                  <div className="comment-avatar">{comment.user?.name?.charAt(0) || 'U'}</div>
                  <div className="comment-body">
                    <div className="comment-header">
                      <h4>{comment.user?.name || 'Unknown User'}</h4>
                      <span>{new Date(comment.date).toLocaleDateString()}</span>
                    </div>
                    <p>{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <form className="comment-input-row" onSubmit={handleCommentSubmit}>
            <div className="avatar-mini">{currentUser?.name?.charAt(0) || 'U'}</div>
            <input 
              type="text" 
              placeholder="Add a comment..." 
              className="input-field" 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={submitting}
            />
            <button 
              type="submit" 
              className="btn-primary" 
              style={{padding: '8px 16px', borderRadius: '4px'}}
              disabled={!commentText.trim() || submitting}
            >
              Post
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        .post { padding: 0; background: var(--bg-card); border: 1px solid var(--border-color); }
        .post-header { display: flex; gap: 12px; padding: 12px 16px; }
        .avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--accent-blue); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 20px; color: white; }
        .user-info h3 { font-size: 14px; margin-bottom: 2px; color: var(--text-primary); }
        .user-info h3:hover { color: var(--accent-blue); text-decoration: underline; }
        .user-info p { font-size: 12px; color: var(--text-secondary); margin-bottom: 2px; }
        .user-info span { font-size: 12px; color: var(--text-muted); }
        .post-content { padding: 0 16px 8px; }
        .post-content p { font-size: 14px; margin-bottom: 12px; white-space: pre-wrap; color: var(--text-primary); }
        .post-image { width: 100%; max-height: 500px; object-fit: contain; background: #f3f2ef; display: block; border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light); }
        .post-stats { padding: 8px 16px; border-bottom: 1px solid var(--border-light); display: flex; justify-content: space-between; font-size: 12px; color: var(--text-secondary); }
        .post-actions { display: flex; padding: 4px 12px; justify-content: space-between; }
        .action-btn { display: flex; align-items: center; gap: 8px; justify-content: center; background: transparent; border: none; padding: 12px; border-radius: 4px; color: var(--text-secondary); cursor: pointer; font-weight: 600; flex: 1; transition: background 0.2s; font-size: 14px; }
        .action-btn:hover { background: rgba(0,0,0,0.05); color: var(--text-primary); }
        .action-btn.liked { color: var(--accent-blue); }
        .comments-section { padding: 16px; border-top: 1px solid var(--border-light); background: #f9fafb; }
        .comments-list { margin-bottom: 16px; display: flex; flex-direction: column; gap: 12px; }
        .comment-item { display: flex; gap: 8px; }
        .comment-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--accent-blue); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; flex-shrink: 0; }
        .comment-body { background: white; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-light); flex: 1; }
        .comment-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
        .comment-header h4 { font-size: 13px; font-weight: 600; color: var(--text-primary); }
        .comment-header span { font-size: 11px; color: var(--text-muted); }
        .comment-body p { font-size: 13px; color: var(--text-primary); }
        .comment-input-row { display: flex; gap: 8px; }
        .avatar-mini { width: 32px; height: 32px; border-radius: 50%; background: var(--secondary-dark); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; flex-shrink: 0; }
        @media (max-width: 480px) { .action-btn span { display: none; } }
      `}</style>
    </div>
  );
};

export default Post;
