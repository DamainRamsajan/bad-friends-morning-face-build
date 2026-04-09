import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import BottomNav from '../components/BottomNav';

const SisterhoodScreen = () => {
  const [posts, setPosts] = useState([]);
  const [targetUsername, setTargetUsername] = useState('');
  const [content, setContent] = useState('');
  const [flagType, setFlagType] = useState('yellow');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isWoman, setIsWoman] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  useEffect(() => {
    checkUserGender();
    fetchPosts();
  }, []);
  
  const checkUserGender = async () => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`${API_URL}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success && data.profile) {
        setIsWoman(data.profile.gender === 'woman');
      }
    } catch (error) {
      console.error('Error checking gender:', error);
    } finally {
      setCheckingAuth(false);
    }
  };
  
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`${API_URL}/sisterhood/feed`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching sisterhood posts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const submitPost = async () => {
    if (!targetUsername.trim()) {
      alert('Please enter a username to vet');
      return;
    }
    if (!content.trim()) {
      alert('Please enter your question or concern');
      return;
    }
    
    setSubmitting(true);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`${API_URL}/sisterhood/post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          target_username: targetUsername,
          content: content,
          flag_type: flagType
        })
      });
      
      if (response.ok) {
        setTargetUsername('');
        setContent('');
        setFlagType('yellow');
        fetchPosts();
        alert('Post submitted anonymously');
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      alert('Network error');
    } finally {
      setSubmitting(false);
    }
  };
  
  const getFlagColor = (type) => {
    if (type === 'green') return 'border-green-500 bg-green-500/10';
    if (type === 'yellow') return 'border-yellow-500 bg-yellow-500/10';
    return 'border-red-500 bg-red-500/10';
  };
  
  const getFlagEmoji = (type) => {
    if (type === 'green') return '🟢';
    if (type === 'yellow') return '🟡';
    return '🔴';
  };
  
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
      </div>
    );
  }
  
  if (!isWoman) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-white text-xl mb-2">Access Denied</h2>
          <p className="text-gray-400 text-sm">The Sisterhood is a women-only safety space.</p>
          <button 
            onClick={() => window.location.href = '/app'}
            className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg"
          >
            Back to App
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0a0e1a] pb-20">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">👭 The Sisterhood</h1>
          <p className="text-gray-400 text-sm">
            Women-only verified space. Anonymized. No screenshots.
          </p>
          <div className="mt-2 px-3 py-1 bg-red-500/20 rounded-full inline-block">
            <span className="text-red-500 text-xs">🔒 End-to-end encrypted</span>
          </div>
        </div>
        
        {/* New Post Form */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">Ask anonymously:</h3>
          
          <input
            type="text"
            value={targetUsername}
            onChange={(e) => setTargetUsername(e.target.value)}
            placeholder="@username to vet"
            className="w-full bg-[#0a0e1a] border border-gray-700 rounded-lg p-2 text-white text-sm mb-3 focus:outline-none focus:border-red-500"
          />
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Has anyone dated @username? Any red flags?"
            className="w-full bg-[#0a0e1a] border border-gray-700 rounded-lg p-3 text-white text-sm mb-3 focus:outline-none focus:border-red-500"
            rows="3"
          />
          
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setFlagType('green')}
              className={`flex-1 py-1 rounded-lg text-xs transition ${
                flagType === 'green' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-[#0a0e1a] border border-green-500 text-gray-400'
              }`}
            >
              🟢 Green Flag
            </button>
            <button
              onClick={() => setFlagType('yellow')}
              className={`flex-1 py-1 rounded-lg text-xs transition ${
                flagType === 'yellow' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-[#0a0e1a] border border-yellow-500 text-gray-400'
              }`}
            >
              🟡 Yellow Flag
            </button>
            <button
              onClick={() => setFlagType('red')}
              className={`flex-1 py-1 rounded-lg text-xs transition ${
                flagType === 'red' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-[#0a0e1a] border border-red-500 text-gray-400'
              }`}
            >
              🔴 Red Flag
            </button>
          </div>
          
          <button
            onClick={submitPost}
            disabled={submitting}
            className="w-full py-2 bg-red-500 text-white font-semibold rounded-lg disabled:opacity-50"
          >
            {submitting ? 'Posting anonymously...' : 'Post Anonymously'}
          </button>
          
          <p className="text-center text-gray-600 text-xs mt-3">
            ⚠️ Abuse of The Sisterhood = permanent ban
          </p>
        </div>
        
        {/* Posts Feed */}
        <h3 className="text-white font-semibold mb-3">Recent Vetting Requests</h3>
        
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
          </div>
        )}
        
        {!loading && posts.length === 0 && (
          <div className="text-center py-12 bg-[#1a1f2e] rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm">No posts yet. Be the first to vet someone!</p>
          </div>
        )}
        
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className={`border-l-4 ${getFlagColor(post.flag_type)} bg-[#1a1f2e] rounded-r-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">{getFlagEmoji(post.flag_type)}</span>
                <span className="text-gray-400 text-xs">Anonymous Sister</span>
                <span className="text-gray-600 text-xs">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-white text-sm mb-2">About @{post.target_username}:</p>
              <p className="text-gray-300 text-sm">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default SisterhoodScreen;