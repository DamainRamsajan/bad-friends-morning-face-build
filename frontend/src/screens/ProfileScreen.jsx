// frontend/src/screens/ProfileScreen.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import BottomNav from '../components/BottomNav';

const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [morningFaces, setMorningFaces] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  useEffect(() => {
    fetchAllData();
  }, []);
  
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [profileRes, facesRes, summaryRes] = await Promise.all([
        fetch(`${API_URL}/profile`, { headers }),
        fetch(`${API_URL}/morning-face/feed?limit=10`, { headers }),
        fetch(`${API_URL}/friends/summary`, { headers })
      ]);
      
      const profileData = await profileRes.json();
      const facesData = await facesRes.json();
      const summaryData = await summaryRes.json();
      
      if (profileData.success) setProfile(profileData.profile);
      if (facesData.success) setMorningFaces(facesData.faces);
      if (summaryData.success) setSummary(summaryData.summary);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    localStorage.removeItem('bf_onboarding_complete');
    await supabase.auth.signOut();
    window.location.href = '/';
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0a0e1a] pb-20">
      <div className="max-w-md mx-auto p-4">
        {/* Profile Header */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6 text-center mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-3xl">😈</span>
          </div>
          <h2 className="text-white text-xl font-semibold">{profile?.name || 'Bad Friend'}</h2>
          <p className="text-gray-400 text-sm mb-2">{profile?.email}</p>
          
          <div className="flex justify-center gap-4 mt-3">
            <div className="text-center">
              <p className="text-red-500 text-xl font-bold">{profile?.streak_days || 0}</p>
              <p className="text-gray-500 text-xs">Day Streak</p>
            </div>
            <div className="text-center">
              <p className="text-red-500 text-xl font-bold">{profile?.trust_level || 1}</p>
              <p className="text-gray-500 text-xs">Trust Level</p>
            </div>
          </div>
        </div>
        
        {/* Friendship Summary */}
        {summary && (
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-4 mb-4">
            <h3 className="text-white font-semibold mb-3">👥 Your Network</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-red-500 text-xl font-bold">{summary.following}</p>
                <p className="text-gray-500 text-xs">Following</p>
              </div>
              <div className="text-center">
                <p className="text-red-500 text-xl font-bold">{summary.followers}</p>
                <p className="text-gray-500 text-xs">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-purple-400 text-xl font-bold">{summary.bad_friends}</p>
                <p className="text-gray-500 text-xs">Bad Friends</p>
              </div>
              <div className="text-center">
                <p className="text-pink-400 text-xl font-bold">{summary.worst_friends}</p>
                <p className="text-gray-500 text-xs">Worst Friends</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Morning Face History */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-4 mb-4">
          <h3 className="text-white font-semibold mb-3">📸 Morning Face History</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {morningFaces.slice(0, 7).map((face, idx) => (
              <img 
                key={idx} 
                src={face.image_url} 
                alt="Morning face"
                className="w-16 h-16 rounded-lg object-cover border border-gray-700"
              />
            ))}
            {morningFaces.length === 0 && (
              <p className="text-gray-500 text-sm">No morning faces yet. Start your streak!</p>
            )}
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-600/20 text-red-500 font-semibold rounded-lg hover:bg-red-600/30 transition"
        >
          Logout
        </button>
        
        {/* Sisterhood Link (Women Only) */}
        {profile?.gender === 'woman' && (
          <a
            href="/app/sisterhood"
            className="block text-center mt-3 text-gray-500 text-sm hover:text-red-500 transition"
          >
            👭 The Sisterhood
          </a>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default ProfileScreen;