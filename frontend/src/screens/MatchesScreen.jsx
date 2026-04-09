// frontend/src/screens/MatchesScreen.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import BottomNav from '../components/BottomNav';

const MatchesScreen = () => {
  const [activeTab, setActiveTab] = useState('worst');
  const [worstFriends, setWorstFriends] = useState([]);
  const [badFriends, setBadFriends] = useState([]);
  const [pendingBad, setPendingBad] = useState([]);
  const [pendingMatches, setPendingMatches] = useState([]);
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
      
      const [worstRes, badRes, pendingBadRes, pendingMatchRes, summaryRes] = await Promise.all([
        fetch(`${API_URL}/worst-friends/list`, { headers }),
        fetch(`${API_URL}/bad-friends/list`, { headers }),
        fetch(`${API_URL}/bad-friends/pending`, { headers }),
        fetch(`${API_URL}/matches/pending`, { headers }),
        fetch(`${API_URL}/friends/summary`, { headers })
      ]);
      
      const worstData = await worstRes.json();
      const badData = await badRes.json();
      const pendingBadData = await pendingBadRes.json();
      const pendingMatchData = await pendingMatchRes.json();
      const summaryData = await summaryRes.json();
      
      if (worstData.success) setWorstFriends(worstData.worst_friends);
      if (badData.success) setBadFriends(badData.bad_friends);
      if (pendingBadData.success) setPendingBad(pendingBadData.pending);
      if (pendingMatchData.success) setPendingMatches(pendingMatchData.pending);
      if (summaryData.success) setSummary(summaryData.summary);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const acceptBadFriend = async (userId) => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      await fetch(`${API_URL}/bad-friends/accept/${userId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchAllData(); // Refresh
    } catch (error) {
      console.error('Error accepting bad friend:', error);
    }
  };
  
  const tabs = [
    { id: 'worst', label: '💀 Worst', count: worstFriends.length },
    { id: 'bad', label: '🍜 Bad', count: badFriends.length },
    { id: 'pending_bad', label: '⏳ Pending Bad', count: pendingBad.length },
    { id: 'pending_match', label: '❤️ Pending', count: pendingMatches.length }
  ];
  
  const renderContent = () => {
    if (activeTab === 'worst') {
      if (worstFriends.length === 0) {
        return (
          <div className="text-center py-12 bg-[#1a1f2e] rounded-xl border border-gray-800">
            <div className="text-4xl mb-2">💀</div>
            <p className="text-gray-400">No Worst Friends yet</p>
            <p className="text-gray-500 text-sm mt-1">Swipe right on Discover to find your match</p>
          </div>
        );
      }
      return worstFriends.map((match) => (
        <div key={match.user_id} className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-xl">💀</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">{match.user_id.slice(0, 8)}</p>
              <p className="text-gray-500 text-xs">Matched {new Date(match.matched_at).toLocaleDateString()}</p>
            </div>
            <button className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition">
              Chat
            </button>
          </div>
        </div>
      ));
    }
    
    if (activeTab === 'bad') {
      if (badFriends.length === 0) {
        return (
          <div className="text-center py-12 bg-[#1a1f2e] rounded-xl border border-gray-800">
            <div className="text-4xl mb-2">🍜</div>
            <p className="text-gray-400">No Bad Friends yet</p>
            <p className="text-gray-500 text-sm mt-1">Rate answers as 💀 to find your comedy soulmate</p>
          </div>
        );
      }
      return badFriends.map((friend) => (
        <div key={friend.user_id} className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <span className="text-xl">🍜</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">{friend.user_id.slice(0, 8)}</p>
              <p className="text-gray-500 text-xs">Bad Friends since {new Date(friend.accepted_at).toLocaleDateString()}</p>
            </div>
            <button className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition">
              Chat
            </button>
          </div>
        </div>
      ));
    }
    
    if (activeTab === 'pending_bad') {
      if (pendingBad.length === 0) {
        return (
          <div className="text-center py-12 bg-[#1a1f2e] rounded-xl border border-gray-800">
            <div className="text-4xl mb-2">⏳</div>
            <p className="text-gray-400">No pending Bad Friend requests</p>
          </div>
        );
      }
      return pendingBad.map((request) => (
        <div key={request.user_id} className="bg-[#1a1f2e] rounded-xl border border-yellow-500/30 p-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <span className="text-xl">🎭</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">{request.user_id.slice(0, 8)}</p>
              <p className="text-gray-500 text-xs">{request.detection_count} mutual 💀 reactions</p>
            </div>
            <button 
              onClick={() => acceptBadFriend(request.user_id)}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
            >
              Accept
            </button>
          </div>
        </div>
      ));
    }
    
    if (activeTab === 'pending_match') {
      if (pendingMatches.length === 0) {
        return (
          <div className="text-center py-12 bg-[#1a1f2e] rounded-xl border border-gray-800">
            <div className="text-4xl mb-2">❤️</div>
            <p className="text-gray-400">No pending matches</p>
          </div>
        );
      }
      return pendingMatches.map((match) => (
        <div key={match.user_id} className="bg-[#1a1f2e] rounded-xl border border-pink-500/30 p-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
              <span className="text-xl">❤️</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">{match.user_id.slice(0, 8)}</p>
              <p className="text-gray-500 text-xs">Liked you {new Date(match.matched_at).toLocaleDateString()}</p>
            </div>
            <button className="px-4 py-2 bg-pink-600 text-white text-sm rounded-lg hover:bg-pink-700 transition">
              Like Back
            </button>
          </div>
        </div>
      ));
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your connections...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0a0e1a] pb-20">
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold text-white mb-2">Your Connections</h1>
        <p className="text-gray-400 text-sm mb-6">Four layers of Bad Friends</p>
        
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-3 text-center">
              <p className="text-red-500 text-xl font-bold">{summary.following}</p>
              <p className="text-gray-500 text-xs">Following</p>
            </div>
            <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-3 text-center">
              <p className="text-red-500 text-xl font-bold">{summary.followers}</p>
              <p className="text-gray-500 text-xs">Followers</p>
            </div>
          </div>
        )}
        
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-red-500 text-white'
                  : 'bg-[#1a1f2e] text-gray-400'
              }`}
            >
              {tab.label} {tab.count > 0 && `(${tab.count})`}
            </button>
          ))}
        </div>
        
        {/* Content */}
        {renderContent()}
      </div>
      <BottomNav />
    </div>
  );
};

export default MatchesScreen;