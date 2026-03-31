import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout';
import { Search, Edit, MoreHorizontal, Image as ImageIcon, Paperclip, Smile, Send, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { io } from 'socket.io-client';
import api from '@/utils/api';
import { toast } from 'react-hot-toast';

const Messaging = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { userId: queryUserId } = router.query;
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [conversationsFetched, setConversationsFetched] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [otherTyping, setOtherTyping] = useState(false);
  const socket = useRef();
  const fileInputRef = useRef();

  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001');
    
    if (user) {
      socket.current.emit('join_chat', user._id);
    }

    socket.current.on('online_status', (users) => {
      setOnlineUsers(users);
    });

    socket.current.on('receive_message', (data) => {
      if (activeChat && (data.senderId === activeChat._id || data.senderId === user._id)) {
        setMessages((prev) => [...prev, data]);
      }
      fetchConversations();
    });

    socket.current.on('typing', (data) => {
      if (activeChat && data.senderId === activeChat._id) {
        setOtherTyping(data.isTyping);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [user, activeChat]);

  // Handle Query User (start messaging from profile)
  useEffect(() => {
    if (queryUserId && user && conversationsFetched) {
      const existingConv = conversations.find(c => 
        c.participants.some(p => p._id === queryUserId)
      );
      if (existingConv) {
        selectChat(existingConv);
      } else {
        api.get(`/users/${queryUserId}`).then(res => {
          setActiveChat(res.data);
          setMessages([]);
        });
      }
    }
  }, [queryUserId, user, conversationsFetched, conversations]);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      setConversations(res.data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setConversationsFetched(true);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchMessages = async (receiverId) => {
    try {
      const res = await api.get(`/messages/${receiverId}`);
      setMessages(res.data.map(m => ({
        id: m._id,
        text: m.text,
        file: m.file,
        senderId: m.sender,
        createdAt: m.createdAt,
        time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })));
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if ((message.trim() || lastFile) && user && activeChat) {
      socket.current.emit('send_message', {
        senderId: user._id,
        receiverId: activeChat._id,
        text: message,
        file: lastFile
      });
      setMessage('');
      setLastFile(null);
    }
  };

  const [lastFile, setLastFile] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/messages/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLastFile(res.data);
      toast.success('File ready to send!');
    } catch (err) {
      toast.error('File upload failed');
    }
  };

  const selectChat = (conv) => {
    const otherMember = conv.participants.find(p => p._id !== user._id);
    setActiveChat(otherMember);
    fetchMessages(otherMember._id);
  };

  return (
    <Layout>
      <div className="card messaging-container">
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{display: 'none'}} 
          onChange={handleFileUpload} 
        />
        
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h2>Messaging</h2>
            <div className="header-actions">
              <button className="icon-btn"><Edit size={18} /></button>
              <button className="icon-btn"><MoreHorizontal size={18} /></button>
            </div>
          </div>
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search messages" />
          </div>
          
          <ul className="chat-list">
            {conversations.map(conv => {
              const other = conv.participants.find(p => p._id !== user._id);
              const isOnline = onlineUsers.includes(other._id);
              return (
                <li 
                  key={conv._id} 
                  className={`chat-item ${activeChat?._id === other._id ? 'active' : ''}`}
                  onClick={() => selectChat(conv)}
                >
                  <div className="avatar-wrapper">
                    {other.avatar ? (
                      <img src={other.avatar} alt={other.name} className="avatar-mini" />
                    ) : (
                      <div className="avatar-mini">{other.name?.charAt(0)}</div>
                    )}
                    {isOnline && <div className="online-indicator"></div>}
                  </div>
                  <div className="chat-preview">
                    <div className="chat-preview-header">
                      <h4>{other.name}</h4>
                      <span>{new Date(conv.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <p>{conv.lastMessage?.text || 'Sent an attachment'}</p>
                  </div>
                </li>
              );
            })}
            {conversations.length === 0 && (
              <p style={{textAlign: 'center', padding: '20px', fontSize: '14px', color: 'var(--text-muted)'}}>No conversations yet.</p>
            )}
          </ul>
        </div>
        
        {activeChat ? (
          <div className="chat-area">
            <div className="chat-header">
              <div className="chat-user-info">
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <h3>{activeChat.name}</h3>
                  {onlineUsers.includes(activeChat._id) && <span className="online-text">Online</span>}
                </div>
                <p>{activeChat.headline}</p>
              </div>
              <div className="header-actions">
                <button className="icon-btn"><MoreHorizontal size={20} /></button>
              </div>
            </div>
            
            <div className="chat-history">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message-bubble ${msg.senderId === user._id ? 'me' : 'other'}`}>
                  <div className="message-content">
                    {msg.text && <p>{msg.text}</p>}
                    {msg.file && (
                      <div className="file-attachment" style={{marginTop: msg.text ? '8px' : '0'}}>
                        {msg.file.fileType?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(msg.file.name) ? (
                          <img 
                            src={msg.file.url} 
                            alt="attachment" 
                            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', cursor: 'pointer', display: 'block' }}
                            onClick={() => window.open(msg.file.url, '_blank')}
                          />
                        ) : (
                          <>
                            <Paperclip size={14} />
                            <a href={msg.file.url} target="_blank" rel="noreferrer">{msg.file.name}</a>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="time">{msg.time || new Date(msg.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                </div>
              ))}
              {otherTyping && (
                <div className="message-bubble other">
                  <div className="typing-indicator">Typing...</div>
                </div>
              )}
            </div>
            
            <div className="chat-input-area">
              <form onSubmit={handleSendMessage}>
                {lastFile && (
                  <div className="file-preview-strip">
                    <span>{lastFile.name}</span>
                    <X size={14} onClick={() => setLastFile(null)} style={{cursor: 'pointer'}} />
                  </div>
                )}
                <textarea 
                  placeholder="Write a message..."
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    socket.current.emit('typing', { senderId: user._id, receiverId: activeChat._id, isTyping: e.target.value.length > 0 });
                  }}
                  onKeyDown={(e) => {
                    if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }
                  }}
                />
                <div className="input-actions">
                  <div className="actions-left">
                    <button type="button" className="icon-btn" onClick={() => fileInputRef.current.click()}><ImageIcon size={20} /></button>
                    <button type="button" className="icon-btn" onClick={() => fileInputRef.current.click()}><Paperclip size={20} /></button>
                    <button type="button" className="icon-btn"><Smile size={20} /></button>
                  </div>
                  <button type="submit" className="btn-primary send-btn" disabled={!message.trim() && !lastFile}>
                    <Send size={16} /> Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="chat-area empty-chat">
            <div className="empty-chat-content">
              <h3>Direct Messaging</h3>
              <p>Pick a colleague from your list and start a professional conversation.</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .messaging-container { display: flex; padding: 0; height: calc(100vh - 120px); overflow: hidden; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 24px; }
        .chat-sidebar { width: 320px; border-right: 1px solid var(--border-light); display: flex; flex-direction: column; background: var(--bg-card); }
        .sidebar-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--border-light); }
        .sidebar-header h2 { font-size: 16px; }
        .header-actions { display: flex; gap: 8px; }
        .icon-btn { background: transparent; border: none; color: var(--text-secondary); cursor: pointer; padding: 6px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .icon-btn:hover { background: rgba(255,255,255,0.1); color: white; }
        .search-box { display: flex; align-items: center; background: rgba(255,255,255,0.05); padding: 0 12px; margin: 12px 16px; border-radius: 4px; border: 1px solid var(--border-light); }
        .search-box input { background: transparent; border: none; color: var(--text-primary); margin-left: 8px; width: 100%; padding: 8px 0; outline: none; }
        
        .chat-list { overflow-y: auto; flex: 1; }
        .chat-item { display: flex; gap: 12px; padding: 16px; cursor: pointer; border-left: 3px solid transparent; transition: background 0.2s; }
        .chat-item:hover { background: rgba(0,0,0,0.03); }
        .chat-item.active { background: rgba(10, 102, 194, 0.05); border-left-color: var(--accent-blue); }
        .avatar-wrapper { position: relative; flex-shrink: 0; }
        .avatar-mini { width: 44px; height: 44px; border-radius: 50%; background: #eee; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #666; object-fit: cover; }
        .online-indicator { position: absolute; bottom: 0; right: 0; width: 12px; height: 12px; background: #057642; border: 2px solid white; border-radius: 50%; }
        
        .chat-preview { flex: 1; overflow: hidden; }
        .chat-preview-header { display: flex; justify-content: space-between; align-items: baseline; }
        .chat-preview-header h4 { font-size: 14px; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-primary); }
        .chat-preview-header span { font-size: 11px; color: var(--text-muted); }
        .chat-preview p { font-size: 12px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .chat-area { flex: 1; display: flex; flex-direction: column; background: var(--bg-primary); }
        .empty-chat { justify-content: center; align-items: center; text-align: center; color: var(--text-secondary); }
        .chat-header { padding: 12px 24px; border-bottom: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center; }
        .chat-user-info h3 { font-size: 16px; }
        .chat-user-info p { font-size: 12px; color: var(--text-secondary); }
        .online-text { font-size: 10px; color: #057642; font-weight: 600; text-transform: uppercase; }
        
        .chat-history { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
        .message-bubble { display: flex; flex-direction: column; max-width: 70%; }
        .message-bubble.me { align-self: flex-end; align-items: flex-end; }
        .message-bubble.other { align-self: flex-start; align-items: flex-start; }
        .message-content { padding: 8px 12px; border-radius: 8px; font-size: 14px; line-height: 1.5; }
        .message-bubble.other .message-content { background: #f3f3f3; color: var(--text-primary); border-top-left-radius: 0; }
        .message-bubble.me .message-content { background: var(--accent-blue); color: white; border-top-right-radius: 0; }
        .file-attachment { display: flex; align-items: center; gap: 8px; margin-top: 4px; padding: 6px; background: rgba(0,0,0,0.05); border-radius: 4px; }
        .file-attachment a { color: inherit; text-decoration: underline; font-size: 12px; }
        .typing-indicator { font-size: 12px; color: var(--text-muted); font-style: italic; }
        
        .time { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
        
        .chat-input-area { padding: 16px 24px; border-top: 1px solid var(--border-light); }
        .file-preview-strip { display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #edf3f8; border-radius: 4px; margin-bottom: 8px; font-size: 12px; }
        .chat-input-area textarea { width: 100%; background: #f3f3f3; border: 1px solid transparent; border-radius: 8px; padding: 12px; color: var(--text-primary); font-family: var(--font-family); resize: none; min-height: 40px; outline: none; transition: all 0.2s; }
        .chat-input-area textarea:focus { background: white; border-color: var(--accent-blue); }
        
        .input-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
        .actions-left { display: flex; gap: 4px; }
        .send-btn { padding: 6px 16px; font-size: 14px; display: flex; gap: 6px; border-radius: 20px; }
        .send-btn:disabled { opacity: 0.5; background: #ccc; border-color: #ccc; }
        
        @media (max-width: 768px) {
          .chat-sidebar { display: none; }
        }
      `}</style>
    </Layout>
  );
};

export default Messaging;
