import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import BottomNav from '../components/BottomNav';
import MorningFaceThumbnail from '../components/MorningFaceThumbnail';
import { getMockFeedData, getMotivationalMessage } from '../utils/mockData';

const HomeScreen = () => {
  const [streak, setStreak] = useState(0);
  const [userName, setUserName] = useState('Damian');
  const [activeTab, setActiveTab] = useState('faces');
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cmiScore, setCmiScore] = useState(87);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  useEffect(() => {
    fetchProfile();
    fetchFeed();
  }, [activeTab]);
  
  const fetchProfile = async () => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`${API_URL}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStreak(data.profile.streak_days || 0);
        if (data.profile.name) setUserName(data.profile.name);
        if (data.profile.cmi_score) setCmiScore(data.profile.cmi_score);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };
  
  const fetchFeed = async () => {
    setLoading(true);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      
      if (activeTab === 'faces') {
        const response = await fetch(`${API_URL}/morning-face/feed`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success && data.faces.length > 0) {
          setFeedItems(data.faces);
        } else {
          setFeedItems(getMockFeedData('faces', userName));
        }
      } else if (activeTab === 'answers') {
        const response = await fetch(`${API_URL}/questions/feed`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success && data.answers.length > 0) {
          setFeedItems(data.answers);
        } else {
          setFeedItems(getMockFeedData('answers', userName));
        }
      } else if (activeTab === 'popular') {
        const facesRes = await fetch(`${API_URL}/morning-face/feed`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const answersRes = await fetch(`${API_URL}/questions/feed`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const facesData = await facesRes.json();
        const answersData = await answersRes.json();
        
        let combined = [];
        if (facesData.success) combined.push(...facesData.faces);
        if (answersData.success) combined.push(...answersData.answers);
        
        if (combined.length > 0) {
          combined.sort((a, b) => (b.reaction_count_dead || 0) - (a.reaction_count_dead || 0));
          setFeedItems(combined.slice(0, 10));
        } else {
          setFeedItems([...getMockFeedData('faces'), ...getMockFeedData('answers')]
            .sort((a, b) => (b.reaction_count_dead || 0) - (a.reaction_count_dead || 0))
            .slice(0, 10));
        }
      }
    } catch (error) {
      console.error('Error fetching feed:', error);
      if (activeTab === 'faces') setFeedItems(getMockFeedData('faces'));
      else setFeedItems(getMockFeedData('answers'));
    } finally {
      setLoading(false);
    }
  };
  
  const addReaction = async (targetType, targetId, reactionType) => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      await fetch(`${API_URL}/reactions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          target_type: targetType,
          target_id: targetId,
          reaction_type: reactionType
        })
      });
      fetchFeed();
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };
  
  const handleUploadComplete = (newStreak) => {
    setStreak(newStreak);
    fetchFeed();
    fetchProfile();
  };
  
  const motivationalMessage = getMotivationalMessage(cmiScore);
  
  return (
    <div className="min-h-screen bg-badfriends-bg pb-20">
      <div className="max-w-md mx-auto p-4">
        
        {/* Banner Image */}
        <img 
          src="/BFMF_Banner..png" 
          alt="Bad Friends Morning Face" 
          className="w-full rounded-2xl mb-4"
        />
        
        {/* Morning Face Section - Compact */}
        <div className="bf-card mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="bf-header-sm text-white">🌅 Good Morning, {userName}!</h2>
              <p className="bf-text-dim text-xs mt-1">Streak: 🔥 {streak} days</p>
            </div>
            <MorningFaceThumbnail 
              streak={streak}
              onUploadComplete={handleUploadComplete}
            />
          </div>
        </div>
        
        {/* Motivational Message */}
        <div className="bf-card mb-4 bg-primary/5 border-primary/30">
          <p className="text-primary text-sm font-semibold text-center">
            {motivationalMessage}
          </p>
        </div>
        
        {/* Feed Tabs - Image Buttons for Faces and Answers */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('faces')}
            className="flex-1"
          >
            <img 
              src="/buttons/MorningFaces_Button.png" 
              alt="Morning Faces"
              className={`h-12 w-full object-contain transition-all ${activeTab === 'faces' ? 'opacity-100 scale-105' : 'opacity-60'}`}
            />
          </button>
          <button
            onClick={() => setActiveTab('answers')}
            className="flex-1"
          >
            <img 
              src="/buttons/RealAnws_Button.png" 
              alt="Answers"
              className={`h-12 w-full object-contain transition-all ${activeTab === 'answers' ? 'opacity-100 scale-105' : 'opacity-60'}`}
            />
          </button>
          <button
            onClick={() => setActiveTab('popular')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold uppercase tracking-wide transition ${
              activeTab === 'popular' 
                ? 'bg-primary text-white' 
                : 'bg-badfriends-card text-badfriends-text-muted'
            }`}
          >
            🔥 Popular
          </button>
        </div>
        
        {/* Feed Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="bf-spinner"></div>
          </div>
        ) : feedItems.length === 0 ? (
          <div className="bf-card text-center py-12">
            <div className="text-4xl mb-2">🌅</div>
            <p className="text-badfriends-text">No posts yet</p>
            <p className="bf-text-dim text-xs mt-1">Follow some friends to see their morning faces!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedItems.map((item) => (
              <div key={item.id} className="bf-card">
                {/* User Info */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">👤</span>
                  </div>
                  <div>
                    <p className="text-badfriends-text font-semibold text-sm">
                      @{item.users?.name || item.user_id?.slice(0, 8) || 'Bad Friend'}
                    </p>
                    <p className="bf-text-dim text-xs">
                      {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                
                {/* Content */}
                {activeTab === 'faces' && item.image_url && (
                  <img 
                    src={item.image_url} 
                    alt="Morning face"
                    className="w-full rounded-xl mb-3"
                  />
                )}
                {(activeTab === 'answers' || activeTab === 'popular') && item.answer_text && (
                  <div className="bg-badfriends-bg rounded-xl p-3 mb-3">
                    <p className="text-badfriends-text text-sm">"{item.answer_text}"</p>
                    {item.cmi_score && (
                      <p className="text-dead text-xs mt-2">💀 CMI: {item.cmi_score}%</p>
                    )}
                  </div>
                )}
                
                {/* Caption */}
                {activeTab === 'faces' && item.caption && (
                  <p className="bf-text-dim text-xs mb-2 italic">"{item.caption}"</p>
                )}
                
                {/* Reactions */}
                <div className="flex gap-4 pt-2">
                  <button 
                    onClick={() => addReaction(activeTab === 'faces' ? 'morning_face' : 'answer', item.id, 'bobo')}
                    className="bf-reaction bf-reaction-bobo"
                  >
                    <span className="text-lg">🍜</span>
                    <span className="text-xs">{item.reaction_count_bobo || 0}</span>
                  </button>
                  <button 
                    onClick={() => addReaction(activeTab === 'faces' ? 'morning_face' : 'answer', item.id, 'cheeto')}
                    className="bf-reaction bf-reaction-cheeto"
                  >
                    <span className="text-lg">🔥</span>
                    <span className="text-xs">{item.reaction_count_cheeto || 0}</span>
                  </button>
                  <button 
                    onClick={() => addReaction(activeTab === 'faces' ? 'morning_face' : 'answer', item.id, 'tiger')}
                    className="bf-reaction bf-reaction-tiger"
                  >
                    <span className="text-lg">🐯</span>
                    <span className="text-xs">{item.reaction_count_tiger || 0}</span>
                  </button>
                  <button 
                    onClick={() => addReaction(activeTab === 'faces' ? 'morning_face' : 'answer', item.id, 'dead')}
                    className="bf-reaction bf-reaction-dead"
                  >
                    <span className="text-lg">💀</span>
                    <span className="text-xs">{item.reaction_count_dead || 0}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
      </div>
      <BottomNav />
    </div>
  );
};

export default HomeScreen;