import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import BottomNav from '../components/BottomNav';
import { getMockDiscoverCandidates } from '../utils/mockData';

const DiscoverScreen = () => {
  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratedCount, setRatedCount] = useState(0);
  const [facesUnlocked, setFacesUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const UNLOCK_THRESHOLD = 3;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  useEffect(() => {
    fetchCandidates();
  }, []);
  
  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`${API_URL}/matches/discover`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success && data.candidates && data.candidates.length > 0) {
        setCandidates(data.candidates);
      } else {
        // Mock data for testing
       // Replace the existing mock data with:
setCandidates(getMockDiscoverCandidates());
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
      // Mock data on error
      setCandidates([
        { id: '1', user_id: 'user1', user_name: 'sarah_k', answer_text: "Only if she paints it like a Klondike wrapper first.", cmi_score: 92, morning_face_url: null },
        { id: '2', user_id: 'user2', user_name: 'mike_j', answer_text: "Which toe? Pinky? Maybe. Big toe? Hard pass.", cmi_score: 78, morning_face_url: null },
        { id: '3', user_id: 'user3', user_name: 'alex_t', answer_text: "I'd negotiate. Klondike AND a photo with JLC.", cmi_score: 94, morning_face_url: null },
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const rateAnswer = async (candidateId, isWorstFriend) => {
    if (isWorstFriend) {
      try {
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        await fetch(`${API_URL}/reactions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            target_type: 'answer',
            target_id: candidateId,
            reaction_type: 'dead'
          })
        });
      } catch (error) {
        console.error('Error rating answer:', error);
      }
    }
    
    const newRatedCount = ratedCount + 1;
    setRatedCount(newRatedCount);
    
    if (newRatedCount >= UNLOCK_THRESHOLD && !facesUnlocked) {
      setFacesUnlocked(true);
    }
    
    setCurrentIndex(prev => prev + 1);
  };
  
  const likeUser = async (userId) => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`${API_URL}/matches/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ target_user_id: userId })
      });
      const data = await response.json();
      
      if (data.mutual) {
        alert('🎉 It\'s a match! Start chatting!');
      } else {
        alert('❤️ Like sent! If they like you back, you\'ll match.');
      }
      
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error liking user:', error);
    }
  };
  
  const currentCandidate = candidates[currentIndex];
  const progressToUnlock = (ratedCount / UNLOCK_THRESHOLD) * 100;
  const remainingToUnlock = UNLOCK_THRESHOLD - ratedCount;
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Finding potential Bad Friends...</p>
        </div>
      </div>
    );
  }
  
  if (!currentCandidate) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] pb-20">
        <div className="max-w-md mx-auto p-4 text-center py-20">
          <div className="text-6xl mb-4">👀</div>
          <h2 className="text-white text-xl mb-2">No more candidates</h2>
          <p className="text-gray-400 text-sm mb-4">Check back later for more Bad Friends</p>
          <button
            onClick={fetchCandidates}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Refresh
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0a0e1a] pb-20">
      <div className="max-w-md mx-auto p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Rate {remainingToUnlock} more answer{remainingToUnlock !== 1 ? 's' : ''} to unlock faces</span>
            <span>{ratedCount}/{UNLOCK_THRESHOLD}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-[#f5820a] h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressToUnlock}%` }}
            ></div>
          </div>
        </div>
        
        {/* Card */}
        <div className="bg-[#1a1f2e] rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-red-500 font-semibold">@{currentCandidate.user_name}</p>
              <div className="px-2 py-1 bg-purple-500/20 rounded-full">
                <span className="text-purple-400 text-xs font-semibold">CMI: {currentCandidate.cmi_score}%</span>
              </div>
            </div>
            
            {/* Answer */}
            <div className="bg-[#0a0e1a] rounded-xl p-4 mb-4">
              <p className="text-white text-lg leading-relaxed">
                "{currentCandidate.answer_text}"
              </p>
            </div>
            
            {/* Face Reveal */}
            {facesUnlocked && currentCandidate.morning_face_url && (
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">Morning face revealed:</p>
                <img 
                  src={currentCandidate.morning_face_url} 
                  alt="Morning face"
                  className="w-full rounded-xl border border-gray-700"
                />
              </div>
            )}
            
            {!facesUnlocked && (
              <div className="mb-4 p-3 bg-gray-800/30 rounded-xl text-center">
                <p className="text-gray-500 text-xs">🔒 Face hidden. Rate {remainingToUnlock} more answer{remainingToUnlock !== 1 ? 's' : ''} to unlock.</p>
              </div>
            )}
            
            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => rateAnswer(currentCandidate.id, true)}
                className="flex-1 btn-primary"
              >
                💀 Worst Friend
              </button>
              <button
                onClick={() => rateAnswer(currentCandidate.id, false)}
                className="flex-1 btn-secondary"
              >
                Skip
              </button>
            </div>
            
            {/* Like Button */}
            {facesUnlocked && (
              <button
                onClick={() => likeUser(currentCandidate.user_id)}
                className="w-full mt-3 btn-like"
              >
                ❤️ Like
              </button>
            )}
          </div>
        </div>
        
        <p className="text-center text-gray-500 text-xs mt-4">
          Rate answers honestly. The funniest get 💀 and unlock faster.
        </p>
      </div>
      <BottomNav />
    </div>
  );
};

export default DiscoverScreen;