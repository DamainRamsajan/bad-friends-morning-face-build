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
  
  // Streak display logic - NEVER shows "0 days" (Task 8)
  const getStreakDisplay = () => {
    if (streak === 0) {
      return { text: "Start your streak today", subtext: "Upload your morning face to begin", className: "streak-zero" };
    } else if (streak < 7) {
      return { text: `${streak} day streak`, subtext: "Keep it going — don't break the chain", className: "streak-active" };
    } else if (streak < 30) {
      return { text: `${streak} day streak 🔥`, subtext: "Bobby would be proud. Allegedly.", className: "streak-hot" };
    } else {
      return { text: `${streak} day streak 💀`, subtext: "Worst Friend energy. Certified.", className: "streak-legendary" };
    }
  };
  
  const streakDisplay = getStreakDisplay();
  const motivationalMessage = getMotivationalMessage(cmiScore);
  
  return (
    <div className="home-scroll-container">
      <div className="max-w-md mx-auto">
        
        {/* Banner Image */}
        <img 
          src="/BFMF_Banner..png" 
          alt="Bad Friends Morning Face" 
          className="w-full rounded-2xl mb-4"
        />
        
        {/* SECTION: Daily Actions Label */}
        <div className="home-section-label">⚡ DAILY ACTIONS</div>
        
        {/* Morning Face Section - Redesigned (Task 2) */}
        <div className="morning-face-card">
          <div className="morning-face-info">
            <div className="morning-face-title">TODAY'S MORNING FACE</div>
            <div className="morning-face-subtitle">No filters. No retakes. Just you.</div>
            <div className={`morning-face-streak ${streakDisplay.className}`}>
              {streakDisplay.text}
            </div>
            <div className="morning-face-urgency">⏰ Today's window closes at midnight</div>
          </div>
          <MorningFaceThumbnail 
            streak={streak}
            onUploadComplete={handleUploadComplete}
          />
        </div>
        
        {/* Motivational / Humor Rank Banner (Task 3 - partial) */}
        <div className="humor-rank-banner">
          <div className="humor-rank-icon">💀</div>
          <div className="humor-rank-content">
            <div className="humor-rank-label">HUMOR RANK</div>
            <div className="humor-rank-title">TOP {100 - cmiScore}% — WORST FRIEND MATERIAL</div>
            <div className="humor-rank-sub">{motivationalMessage}</div>
          </div>
          <div className="humor-rank-badge">CERTIFIED 💀</div>
        </div>
        
        {/* Section Divider */}
        <div className="home-section-divider"></div>
        
        {/* SECTION: Feed Label */}
        <div className="home-section-label">📰 THE FEED</div>
        
        {/* Feed Tabs - Remove broken images (Task 4) */}
        <div className="feed-header">
          <div className="feed-title">Morning Faces</div>
          <div className="feed-filters">
            <button
              onClick={() => setActiveTab('faces')}
              className={`feed-filter-btn ${activeTab === 'faces' ? 'active' : ''}`}
            >
              Faces
            </button>
            <button
              onClick={() => setActiveTab('answers')}
              className={`feed-filter-btn ${activeTab === 'answers' ? 'active' : ''}`}
            >
              Answers
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              className={`feed-filter-btn ${activeTab === 'popular' ? 'active' : ''}`}
            >
              🔥 Popular
            </button>
          </div>
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
              <div key={item.id} className="feed-card">
                {/* User Info */}
                <div className="feed-card-header">
                  <div className="feed-card-avatar">
                    <img 
                      src={item.users?.avatar_url || `https://randomuser.me/api/portraits/thumb/men/${Math.floor(Math.random() * 50)}.jpg`} 
                      alt="avatar"
                      onError={(e) => e.target.src = 'https://randomuser.me/api/portraits/thumb/men/1.jpg'}
                    />
                  </div>
                  <div>
                    <div className="feed-card-user">
                      @{item.users?.name || item.user_id?.slice(0, 8) || 'Bad Friend'}
                    </div>
                    <div className="feed-card-time">
                      {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                
                {/* Photo with hover overlay (Task 5) */}
                {activeTab === 'faces' && item.image_url && (
                  <div className="feed-card-photo">
                    <img src={item.image_url} alt="Morning face" />
                    <div className="feed-card-react-overlay">
                      <button 
                        onClick={() => addReaction('morning_face', item.id, 'bobo')}
                        className="react-btn"
                      >
                        🍜
                      </button>
                      <button 
                        onClick={() => addReaction('morning_face', item.id, 'cheeto')}
                        className="react-btn"
                      >
                        🔥
                      </button>
                      <button 
                        onClick={() => addReaction('morning_face', item.id, 'tiger')}
                        className="react-btn"
                      >
                        🐯
                      </button>
                      <button 
                        onClick={() => addReaction('morning_face', item.id, 'dead')}
                        className="react-btn"
                      >
                        💀
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Quote for answers */}
                {(activeTab === 'answers' || activeTab === 'popular') && item.answer_text && (
                  <div className="feed-card-quote">
                    "{item.answer_text}"
                  </div>
                )}
                
                {/* Reaction counts - ALWAYS VISIBLE (Task 5) */}
                <div className="feed-card-reactions">
                  <div className="reaction-count" onClick={() => addReaction(activeTab === 'faces' ? 'morning_face' : 'answer', item.id, 'bobo')}>
                    <span className="reaction-emoji">🍜</span>
                    <span className="reaction-num">{item.reaction_count_bobo || 0}</span>
                  </div>
                  <div className="reaction-count" onClick={() => addReaction(activeTab === 'faces' ? 'morning_face' : 'answer', item.id, 'cheeto')}>
                    <span className="reaction-emoji">🔥</span>
                    <span className="reaction-num">{item.reaction_count_cheeto || 0}</span>
                  </div>
                  <div className="reaction-count" onClick={() => addReaction(activeTab === 'faces' ? 'morning_face' : 'answer', item.id, 'tiger')}>
                    <span className="reaction-emoji">🐯</span>
                    <span className="reaction-num">{item.reaction_count_tiger || 0}</span>
                  </div>
                  <div className="reaction-count" onClick={() => addReaction(activeTab === 'faces' ? 'morning_face' : 'answer', item.id, 'dead')}>
                    <span className="reaction-emoji">💀</span>
                    <span className="reaction-num">{item.reaction_count_dead || 0}</span>
                  </div>
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