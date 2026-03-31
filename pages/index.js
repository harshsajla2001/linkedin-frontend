import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout/Layout';
import Sidebar from '@/components/Layout/Sidebar';
import RightPanel from '@/components/Layout/RightPanel';
import PostCreation from '@/components/Feed/PostCreation';
import Post from '@/components/Feed/Post';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <Layout>
      <Sidebar />
      <div className="main-feed">
        {authLoading ? (
          <div className="card" style={{padding: '20px', textAlign: 'center', marginBottom: '24px'}}>Checking session...</div>
        ) : user ? (
          <PostCreation onPostCreated={handlePostCreated} />
        ) : (
          <div className="card" style={{padding: '20px', textAlign: 'center', marginBottom: '24px'}}>
            <p style={{marginBottom: '12px'}}>Sign in to share your professional updates</p>
            <button onClick={() => router.push('/login')} className="btn-primary">Sign In to Post</button>
          </div>
        )}
        
        {loading ? (
          <p style={{textAlign: 'center'}}>Loading posts...</p>
        ) : (
          <div className="posts-list">
            {posts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
            {posts.length === 0 && (
              <div className="card">
                <p style={{textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 0'}}>No posts yet. Be the first to post!</p>
              </div>
            )}
          </div>
        )}
      </div>
      <RightPanel />

      <style jsx>{`
        .main-feed {
          width: 100%;
        }
      `}</style>
    </Layout>
  );
}
