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
  const [totalUserCount, setTotalUserCount] = useState(0);
  const [showMockData, setShowMockData] = useState(true);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const MOCK_THRESHOLD = 20; // Hide mock data when system has 20+ real users
  
  // Fetch total user count from system
  const fetchTotalUserCount = async () => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`${API_URL}/users/count`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setTotalUserCount(data.count);
        setShowMockData(data.count < MOCK_THRESHOLD);
      }
    } catch (error) {
      console.error('Error fetching user count:', error);
      // Default to showing mock data if we can't get count (new system)
      setShowMockData(true);
    }
  };
  
  // Helper: Combine real + mock ONLY if system has < 20 real users
  const combineWithMockDataIfNeeded = (realPosts, mockDataType, userName, targetCount = 20) => {
    // If system has enough real users (≥20), NEVER show mock data
    if (!showMockData) {
      return realPosts;
    }
    
    // Get mock data
    let mockData = [];
    if (mockDataType === 'faces') {
      mockData = getMockFeedData('faces', userName);
    } else if (mockDataType === 'answers') {
      mockData = getMockFeedData('answers', userName);
    }
    
    // If no real posts, return mock data only (up to targetCount)
    if (!realPosts || realPosts.length === 0) {
      return mockData.slice(0, targetCount);
    }
    
    // If real posts count is targetCount or more, return only real posts
    if (realPosts.length >= targetCount) {
      return realPosts;
    }
    
    // Real posts are less than targetCount: show all real + fill with mock
    const remainingNeeded = targetCount - realPosts.length;
    const mockFill = mockData.slice(0, remainingNeeded);
    
    return [...realPosts, ...mockFill];
  };
  
  useEffect(() => {
    fetchTotalUserCount();
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
      // Demo mode fallback
      const demoUser = localStorage.getItem('bf_demo_user');
      if (demoUser) {
        const user = JSON.parse(demoUser);
        setUserName(user.name || 'Demo Dan');
        setStreak(user.streak_days || 7);
        setCmiScore(user.cmi_score || 87);
      }
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
        
        let realFaces = [];
        if (data.success && data.faces && data.faces.length > 0) {
          realFaces = data.faces;
        }
        
        // Combine: show mock only if system user count < 20
        const combined = combineWithMockDataIfNeeded(realFaces, 'faces', userName, 20);
        setFeedItems(combined);
        
      } else if (activeTab === 'answers') {
        const response = await fetch(`${API_URL}/questions/feed`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        let realAnswers = [];
        if (data.success && data.answers && data.answers.length > 0) {
          realAnswers = data.answers;
        }
        
        // Combine: show mock only if system user count < 20
        const combined = combineWithMockDataIfNeeded(realAnswers, 'answers', userName, 20);
        setFeedItems(combined);
        
      } else if (activeTab === 'popular') {
        const facesRes = await fetch(`${API_URL}/morning-face/feed`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const answersRes = await fetch(`${API_URL}/questions/feed`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const facesData = await facesRes.json();
        const answersData = await answersRes.json();
        
        let realFaces = facesData.success && facesData.faces ? facesData.faces : [];
        let realAnswers = answersData.success && answersData.answers ? answersData.answers : [];
        
        let combined = [...realFaces, ...realAnswers];
        
        // Sort by dead reactions (💀) for popularity
        combined.sort((a, b) => (b.reaction_count_dead || 0) - (a.reaction_count_dead || 0));
        
        // If system has enough users (≥20) OR combined has 10+ items, no mock
        if (!showMockData || combined.length >= 10) {
          setFeedItems(combined.slice(0, 10));
        } else {
          // Fill with mock data
          const mockFaces = getMockFeedData('faces', userName);
          const mockAnswers = getMockFeedData('answers', userName);
          const allMock = [...mockFaces, ...mockAnswers];
          allMock.sort((a, b) => (b.reaction_count_dead || 0) - (a.reaction_count_dead || 0));
          
          const remainingNeeded = 10 - combined.length;
          const mockFill = allMock.slice(0, remainingNeeded);
          setFeedItems([...combined, ...mockFill].slice(0, 10));
        }
      }
    } catch (error) {
      console.error('Error fetching feed:', error);
      // Fallback to mock data only if system has < 20 users
      if (showMockData) {
        if (activeTab === 'faces') {
          setFeedItems(getMockFeedData('faces', userName));
        } else if (activeTab === 'answers') {
          setFeedItems(getMockFeedData('answers', userName));
        } else {
          const mockFaces = getMockFeedData('faces', userName);
          const mockAnswers = getMockFeedData('answers', userName);
          const combined = [...mockFaces, ...mockAnswers];
          combined.sort((a, b) => (b.reaction_count_dead || 0) - (a.reaction_count_dead || 0));
          setFeedItems(combined.slice(0, 10));
        }
      } else {
        setFeedItems([]);
      }
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
  
  // Streak display logic - NEVER shows "0 days"
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
        
        {/* Morning Face Section */}
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
        
        {/* Humor Rank Banner */}
        <div className="humor-rank-banner">
          <div className="humor-rank-icon">💀</div>
          <div className="humor-rank-content">
            <div className="humor-rank-label">HUMOR RANK</div>
            <div className="humor-rank-title">TOP {100 - cmiScore}% — WORST FRIEND MATERIAL</div>
            <div className="humor-rank-sub">{motivationalMessage}</div>
          </div>
          <div className="humor-rank-badge">CERTIFIED 💀</div>
        </div>
        
        {/* System Status Indicator (only visible in demo/dev) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-center mb-2">
            <span className="text-xs text-gray-600">
              System: {totalUserCount} users | Mock data: {showMockData ? 'ON' : 'OFF (≥20 users)'}
            </span>
          </div>
        )}
        
        {/* Section Divider */}
        <div className="home-section-divider"></div>
        
        {/* SECTION: Feed Label */}
        <div className="home-section-label">📰 THE FEED</div>
        
        {/* Feed Tabs */}
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
            <p className="bf-text-dim text-xs mt-1">Be the first to post a morning face!</p>
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
                
                {/* Photo with hover overlay */}
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
                
                {/* Reaction counts - ALWAYS VISIBLE */}
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