April 10th 10:45pm
BUILD_GUIDE.md - Update Section (This Chat Only)
markdown
---
## PHASE 6.4 - 6.9: Features Built in This Chat Session (April 9-10, 2026)
### All steps completed in this session

---

## Step 6.4: Four Friendship Layers

### 6.4.1 Create Database Tables

**Run in Supabase SQL Editor:**

```sql
-- Follows table (Layer 1: Friends)
CREATE TABLE IF NOT EXISTS follows (
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    followed_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (follower_id, followed_id)
);

-- Bad Friends table (Layer 2: Mutual humor)
CREATE TABLE IF NOT EXISTS bad_friends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a UUID REFERENCES users(id) ON DELETE CASCADE,
    user_b UUID REFERENCES users(id) ON DELETE CASCADE,
    detection_count INTEGER DEFAULT 1,
    detected_at TIMESTAMP DEFAULT NOW(),
    accepted_at TIMESTAMP,
    UNIQUE(user_a, user_b)
);

-- Enable RLS
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE bad_friends ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their follows"
    ON follows FOR ALL USING (auth.uid() = follower_id);

CREATE POLICY "Users can see who follows them"
    ON follows FOR SELECT USING (auth.uid() = followed_id);

CREATE POLICY "Bad Friends participants can see"
    ON bad_friends FOR SELECT USING (auth.uid() = user_a OR auth.uid() = user_b);

-- Auto-detect Bad Friends function
CREATE OR REPLACE FUNCTION detect_bad_friends()
RETURNS TRIGGER AS $$
BEGIN
    WITH mutual_dead AS (
        SELECT 
            LEAST(r1.user_id, r2.user_id) as user_a,
            GREATEST(r1.user_id, r2.user_id) as user_b,
            COUNT(*) as mutual_count
        FROM reactions r1
        JOIN reactions r2 
            ON r1.target_id = r2.target_id 
            AND r1.target_type = r2.target_type
            AND r1.reaction_type = 'dead' 
            AND r2.reaction_type = 'dead'
            AND r1.user_id != r2.user_id
        WHERE r1.created_at > NOW() - INTERVAL '7 days'
        GROUP BY LEAST(r1.user_id, r2.user_id), GREATEST(r1.user_id, r2.user_id)
        HAVING COUNT(*) >= 3
    )
    INSERT INTO bad_friends (user_a, user_b, detected_at, detection_count)
    SELECT user_a, user_b, NOW(), mutual_count
    FROM mutual_dead
    ON CONFLICT (user_a, user_b) 
    DO UPDATE SET 
        detection_count = EXCLUDED.detection_count,
        detected_at = NOW()
    WHERE bad_friends.accepted_at IS NULL;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for new reactions
CREATE TRIGGER trigger_detect_bad_friends
    AFTER INSERT ON reactions
    FOR EACH ROW
    EXECUTE FUNCTION detect_bad_friends();

-- Friendship summary function
CREATE OR REPLACE FUNCTION get_friendship_summary(user_id UUID)
RETURNS TABLE (layer TEXT, count BIGINT) AS $$
BEGIN
    RETURN QUERY SELECT 'following'::TEXT, COUNT(*)::BIGINT FROM follows WHERE follower_id = user_id;
    RETURN QUERY SELECT 'followers'::TEXT, COUNT(*)::BIGINT FROM follows WHERE followed_id = user_id;
    RETURN QUERY SELECT 'bad_friends'::TEXT, COUNT(*)::BIGINT FROM bad_friends WHERE (user_a = user_id OR user_b = user_id) AND accepted_at IS NOT NULL;
    RETURN QUERY SELECT 'pending_bad_friends'::TEXT, COUNT(*)::BIGINT FROM bad_friends WHERE (user_a = user_id OR user_b = user_id) AND accepted_at IS NULL;
    RETURN QUERY SELECT 'worst_friends'::TEXT, COUNT(*)::BIGINT FROM matches WHERE (user_a = user_id OR user_b = user_id) AND status = 'accepted';
    RETURN QUERY SELECT 'pending_matches'::TEXT, COUNT(*)::BIGINT FROM matches WHERE (user_a = user_id OR user_b = user_id) AND status = 'pending';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
6.4.2 Create Friendship Service
File: backend/services/friendship_service.py

python
from supabase import create_client
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

class FriendshipService:
    
    # LAYER 1: FOLLOWS (Friends)
    async def follow(self, follower_id: str, followed_id: str):
        existing = supabase.table("follows").select("*").eq("follower_id", follower_id).eq("followed_id", followed_id).execute()
        if existing.data:
            return {"success": False, "message": "Already following"}
        result = supabase.table("follows").insert({"follower_id": follower_id, "followed_id": followed_id}).execute()
        return {"success": True, "followed": followed_id}
    
    async def unfollow(self, follower_id: str, followed_id: str):
        supabase.table("follows").delete().eq("follower_id", follower_id).eq("followed_id", followed_id).execute()
        return {"success": True, "unfollowed": followed_id}
    
    async def get_followers(self, user_id: str):
        result = supabase.table("follows").select("follower_id").eq("followed_id", user_id).execute()
        return [f["follower_id"] for f in result.data]
    
    async def get_following(self, user_id: str):
        result = supabase.table("follows").select("followed_id").eq("follower_id", user_id).execute()
        return [f["followed_id"] for f in result.data]
    
    # LAYER 2: BAD FRIENDS
    async def get_bad_friends(self, user_id: str):
        result = supabase.table("bad_friends").select("*").filter("user_a", "eq", user_id).or_(f"user_b.eq.{user_id}").not_.is_("accepted_at", "null").execute()
        friends = []
        for row in result.data:
            other_id = row["user_b"] if row["user_a"] == user_id else row["user_a"]
            friends.append({"user_id": other_id, "detected_at": row["detected_at"], "accepted_at": row["accepted_at"]})
        return friends
    
    async def get_pending_bad_friends(self, user_id: str):
        result = supabase.table("bad_friends").select("*").filter("user_a", "eq", user_id).or_(f"user_b.eq.{user_id}").is_("accepted_at", "null").execute()
        pending = []
        for row in result.data:
            other_id = row["user_b"] if row["user_a"] == user_id else row["user_a"]
            pending.append({"user_id": other_id, "detected_at": row["detected_at"], "detection_count": row.get("detection_count", 1)})
        return pending
    
    async def accept_bad_friend(self, user_id: str, other_id: str):
        result = supabase.table("bad_friends").update({"accepted_at": datetime.now().isoformat()}).filter("user_a", "eq", user_id).filter("user_b", "eq", other_id).execute()
        if not result.data:
            result = supabase.table("bad_friends").update({"accepted_at": datetime.now().isoformat()}).filter("user_a", "eq", other_id).filter("user_b", "eq", user_id).execute()
        return {"success": len(result.data) > 0}
    
    # LAYER 3 & 4: WORST FRIENDS & PENDING
    async def get_worst_friends(self, user_id: str):
        result = supabase.table("matches").select("*").filter("user_a", "eq", user_id).or_(f"user_b.eq.{user_id}").eq("status", "accepted").execute()
        matches = []
        for row in result.data:
            other_id = row["user_b"] if row["user_a"] == user_id else row["user_a"]
            matches.append({"user_id": other_id, "matched_at": row["matched_at"]})
        return matches
    
    async def get_pending_matches(self, user_id: str):
        result = supabase.table("matches").select("*").filter("user_a", "eq", user_id).or_(f"user_b.eq.{user_id}").eq("status", "pending").execute()
        pending = []
        for row in result.data:
            other_id = row["user_b"] if row["user_a"] == user_id else row["user_a"]
            pending.append({"user_id": other_id, "matched_at": row["matched_at"]})
        return pending
    
    async def get_friendship_summary(self, user_id: str):
        result = supabase.rpc("get_friendship_summary", {"user_id": user_id}).execute()
        summary = {"following": 0, "followers": 0, "bad_friends": 0, "pending_bad_friends": 0, "worst_friends": 0, "pending_matches": 0}
        for row in result.data:
            summary[row["layer"]] = row["count"]
        return summary

friendship_service = FriendshipService()
6.4.3 Add Friendship Endpoints to main.py
python
from services.friendship_service import friendship_service

# LAYER 1: FOLLOWS
@app.post("/friends/follow/{user_id}")
async def follow_user(user_id: str, current_user: dict = Depends(get_current_user)):
    if user_id == current_user["id"]:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")
    result = await friendship_service.follow(current_user["id"], user_id)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result.get("message", "Already following"))
    return result

@app.delete("/friends/follow/{user_id}")
async def unfollow_user(user_id: str, current_user: dict = Depends(get_current_user)):
    result = await friendship_service.unfollow(current_user["id"], user_id)
    return result

@app.get("/friends/followers")
async def get_my_followers(current_user: dict = Depends(get_current_user)):
    followers = await friendship_service.get_followers(current_user["id"])
    return {"success": True, "followers": followers}

@app.get("/friends/following")
async def get_my_following(current_user: dict = Depends(get_current_user)):
    following = await friendship_service.get_following(current_user["id"])
    return {"success": True, "following": following}

# LAYER 2: BAD FRIENDS
@app.get("/bad-friends/list")
async def get_bad_friends(current_user: dict = Depends(get_current_user)):
    friends = await friendship_service.get_bad_friends(current_user["id"])
    return {"success": True, "bad_friends": friends}

@app.get("/bad-friends/pending")
async def get_pending_bad_friends(current_user: dict = Depends(get_current_user)):
    pending = await friendship_service.get_pending_bad_friends(current_user["id"])
    return {"success": True, "pending": pending}

@app.post("/bad-friends/accept/{user_id}")
async def accept_bad_friend(user_id: str, current_user: dict = Depends(get_current_user)):
    result = await friendship_service.accept_bad_friend(current_user["id"], user_id)
    if not result["success"]:
        raise HTTPException(status_code=404, detail="Bad Friend request not found")
    return {"success": True}

# LAYER 3 & 4: WORST FRIENDS & PENDING
@app.get("/worst-friends/list")
async def get_worst_friends(current_user: dict = Depends(get_current_user)):
    matches = await friendship_service.get_worst_friends(current_user["id"])
    return {"success": True, "worst_friends": matches}

@app.get("/matches/pending")
async def get_pending_matches(current_user: dict = Depends(get_current_user)):
    pending = await friendship_service.get_pending_matches(current_user["id"])
    return {"success": True, "pending": pending}

@app.get("/friends/summary")
async def get_friendship_summary(current_user: dict = Depends(get_current_user)):
    summary = await friendship_service.get_friendship_summary(current_user["id"])
    return {"success": True, "summary": summary}
Step 6.5: Create MatchesScreen
File: frontend/src/screens/MatchesScreen.jsx

jsx
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
      fetchAllData();
    } catch (error) {
      console.error('Error accepting bad friend:', error);
    }
  };
  
  // Rest of component rendering...
};

export default MatchesScreen;
Step 6.6: Create ProfileScreen
File: frontend/src/screens/ProfileScreen.jsx

jsx
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
  
  // Rest of component rendering...
};

export default ProfileScreen;
Step 6.7: Create BottomNav
File: frontend/src/components/BottomNav.jsx

jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home', path: '/app' },
    { id: 'discover', icon: '👀', label: 'Discover', path: '/app/discover' },
    { id: 'matches', icon: '💀', label: 'Matches', path: '/app/matches' },
    { id: 'profile', icon: '😈', label: 'Profile', path: '/app/profile' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-badfriends-bg/95 backdrop-blur-lg border-t border-badfriends-border py-2 z-50">
      <div className="max-w-md mx-auto flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`nav-item flex flex-col items-center gap-1 px-3 py-1 rounded-xl ${
              location.pathname === item.path ? 'active' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
Step 6.8: Create DiscoverScreen
File: frontend/src/screens/DiscoverScreen.jsx

jsx
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
        setCandidates(getMockDiscoverCandidates());
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setCandidates(getMockDiscoverCandidates());
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
  
  // Rest of component rendering with buttons using btn-primary, btn-secondary, btn-like classes
};

export default DiscoverScreen;
Step 6.9: Onboarding Redirect Fix
6.9.1 Update OnboardingScreen.jsx
File: frontend/src/screens/OnboardingScreen.jsx

javascript
const saveDealbreakers = async (data) => {
  setLoading(true);
  try {
    const token = await getToken();
    const response = await fetch(`${API_URL}/onboarding/dealbreakers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      setDealbreakersData(data);
      localStorage.setItem('bf_onboarding_complete', 'true');
      window.location.href = '/app';
    }
  } catch (error) {
    console.error('Error saving dealbreakers:', error);
  } finally {
    setLoading(false);
  }
};
6.9.2 Update App.jsx Check
File: frontend/src/App.jsx

javascript
const checkOnboardingStatus = async () => {
  if (!user) {
    setCheckingOnboarding(false);
    return;
  }
  
  // First check localStorage for fast response
  const localFlag = localStorage.getItem('bf_onboarding_complete');
  if (localFlag === 'true') {
    console.log('Using localStorage flag - onboarding complete');
    setHasCompletedOnboarding(true);
    setCheckingOnboarding(false);
    return;
  }
  
  // Fallback to API check
  try {
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    const response = await fetch(`${API_URL}/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    
    if (data.success && data.profile) {
      const onboardingComplete = data.profile.onboarding_complete === true;
      if (onboardingComplete) {
        localStorage.setItem('bf_onboarding_complete', 'true');
      }
      setHasCompletedOnboarding(onboardingComplete);
      setUserGender(data.profile.gender);
    }
  } catch (error) {
    console.error('Error checking onboarding:', error);
  } finally {
    setCheckingOnboarding(false);
  }
};
6.9.3 Update ProfileScreen Logout
File: frontend/src/screens/ProfileScreen.jsx

javascript
const handleLogout = async () => {
  localStorage.removeItem('bf_onboarding_complete');
  await supabase.auth.signOut();
  window.location.href = '/';
};
Step 6.10: CSS Button System
File: frontend/src/index.css (Add these classes)

css
/* Button System - Added in this session */
.btn-primary {
    background: linear-gradient(135deg, #f5820a 0%, #f5c518 100%);
    color: #1a1000;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 14px 24px;
    border-radius: 9999px;
    box-shadow: 0 4px 15px rgba(245, 130, 10, 0.4);
    transition: all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1);
    border: none;
    cursor: pointer;
}

.btn-secondary {
    background: transparent;
    border: 2px solid #f5820a;
    color: #f5820a;
    font-weight: 700;
    padding: 12px 20px;
    border-radius: 9999px;
    transition: all 0.2s ease;
    cursor: pointer;
}

.btn-tab {
    background: #1a1f2e;
    color: #9ca3af;
    padding: 10px 20px;
    border-radius: 40px;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    transition: all 0.2s ease;
    cursor: pointer;
}

.btn-tab.active {
    background: linear-gradient(135deg, #f5820a, #f5c518);
    color: #1a1000;
    box-shadow: 0 2px 10px rgba(245, 130, 10, 0.3);
}

.btn-reaction {
    background: #1a1f2e;
    border: 1px solid #2d3a5f;
    padding: 8px 16px;
    border-radius: 9999px;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.15s ease;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.btn-reaction-bobo:hover { background: rgba(245, 155, 11, 0.2); border-color: #f59e0b; }
.btn-reaction-cheeto:hover { background: rgba(239, 68, 68, 0.2); border-color: #ef4444; }
.btn-reaction-tiger:hover { background: rgba(16, 185, 129, 0.2); border-color: #10b981; }
.btn-reaction-dead:hover { background: rgba(168, 85, 247, 0.2); border-color: #a855f7; }

.btn-like {
    background: linear-gradient(135deg, #ef4444, #f97316);
    color: white;
    font-weight: 800;
    padding: 14px 24px;
    border-radius: 9999px;
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
    transition: all 0.2s ease;
    cursor: pointer;
}

.nav-item {
    transition: all 0.2s ease;
    cursor: pointer;
}

.nav-item.active {
    color: #f5820a;
    transform: translateY(-4px);
    text-shadow: 0 0 8px rgba(245, 130, 10, 0.5);
}
Step 6.11: Tailwind CSS Downgrade
bash
# Downgrade from v4.2.2 to v3.4.17
cd ~/bad-friends-morning-face-build/frontend
npm install tailwindcss@3.4.17 postcss@8.4.47 autoprefixer@10.4.20
npm uninstall @tailwindcss/postcss @tailwindcss/node
npx tailwindcss init -p
File: frontend/postcss.config.js

javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
Step 6.12: Expand Mock Data
File: frontend/src/utils/mockData.js

Created with 30+ entries for:

Morning faces (12+ with funny captions)

Answers (15+ with CMI scores)

Discover candidates (10+ with past funny answers)

Motivational messages based on CMI score

Step 6.13: v1.0.0 Deployment
bash
# Create release branch
git checkout -b v1.0.0-release
git push origin v1.0.0-release

# Tag the release
git tag v1.0.0
git push origin v1.0.0

# Merge to main
git checkout main
git merge v1.0.0-release
git push origin main
Step 6.14: v1.0.1 Phase 1 - LandingScreen Redesign
File: frontend/src/screens/LandingScreen.jsx

Complete redesign following marketing audit:

Background: near-black (#0d0d0d)

Bebas Neue fonts for headings

Yellow CTA button with orange hover

Social proof micro-copy

Feature cards with orange top border

How It Works with giant background numbers

Safety section as 2x2 grid

Footer visibility fix

Step 6.15: Fix Duplicate VITE_API_URL in .env
File: frontend/.env

env
VITE_SUPABASE_URL=https://valyrdrdwceszcuuytprn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:8000
Step 6.16: Create MorningFaceThumbnail Component
File: frontend/src/components/MorningFaceThumbnail.jsx

jsx
import React, { useState } from 'react';
import MorningFaceCapture from './MorningFaceCapture';

const MorningFaceThumbnail = ({ streak, onUploadComplete }) => {
  const [showCamera, setShowCamera] = useState(false);
  
  if (showCamera) {
    return (
      <>
        <div className="fixed inset-0 bg-black/70 z-50" onClick={() => setShowCamera(false)} />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md bg-badfriends-card rounded-2xl border border-badfriends-border overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-badfriends-border flex justify-between items-center">
            <h3 className="text-white font-semibold">Take Morning Face</h3>
            <button onClick={() => setShowCamera(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
          </div>
          <div className="p-4">
            <MorningFaceCapture 
              onUploadComplete={(newStreak) => {
                setShowCamera(false);
                onUploadComplete(newStreak);
              }}
              currentStreak={streak}
            />
          </div>
        </div>
      </>
    );
  }
  
  return (
    <button 
      onClick={() => setShowCamera(true)}
      className="w-16 h-16 bg-gradient-to-br from-[#f5820a] to-[#f5c518] border-2 border-[#f5820a] rounded-2xl flex flex-col items-center justify-center hover:scale-105 transition-all duration-200 active:scale-95 shadow-lg shadow-orange-500/30"
    >
      <span className="text-2xl drop-shadow-lg">📷</span>
      <span className="text-[10px] text-[#1a1000] font-bold mt-1 drop-shadow-sm">TAP</span>
    </button>
  );
};

export default MorningFaceThumbnail;
COMPLETION CHECKLIST (This Session)
Step	Component	Status
6.4.1	Database tables (follows, bad_friends, triggers)	✅
6.4.2	friendship_service.py	✅
6.4.3	Friendship endpoints (10+)	✅
6.5	MatchesScreen.jsx	✅
6.6	ProfileScreen.jsx	✅
6.7	BottomNav.jsx	✅
6.8	DiscoverScreen.jsx	✅
6.9	Onboarding redirect fix	✅
6.10	CSS button system	✅
6.11	Tailwind CSS downgrade	✅
6.12	Mock data expansion	✅
6.13	v1.0.0 deployment	✅
6.14	LandingScreen redesign (v1.0.1 Phase 1)	✅
6.15	Fix duplicate .env entry	✅
6.16	MorningFaceThumbnail component	✅
END OF BUILD GUIDE UPDATE


---
Updated Step Plan (From Here to v1 Launch) april  8th 2026 11:24pm
Here are the remaining steps in order with estimated times:

#	Step	Component	Est. Time
Phase 6 Completion			
6.12	DailyQuestion component	Display question, submit answer	30 min
6.13	Banner component	Top banner with streak as prop	15 min
6.14	Extract HomeScreen	Move inline to separate file	15 min
Phase 7			
7.1	Feed component	Show friends' morning faces	45 min
7.2	FeedCard component	Card with reactions	30 min
7.3	Reaction integration	Connect to /reactions endpoint	20 min
Phase 8 Completion			
8.1	Real matching logic	Replace mock data in Discover	45 min
8.2	Like/mutual match	Full match creation flow	30 min
Phase 9			
9.1	Chat list screen	Show active matches	30 min
9.2	Chat detail screen	Real-time messaging	45 min
9.3	Message read receipts	Typing indicators	20 min
Phase 10			
10.1	Deploy backend to Render	Production API	30 min
10.2	Deploy frontend to Netlify	Production app	20 min
10.3	Set up UptimeRobot	Prevent cold starts	10 min
10.4	Final testing	Smoke test all features	30 min
Total remaining time: ~6.5 hours

BUILD GUIDE - Phase 6: From Current State to Complete v1 April 8th, 2026, 2:54pm
Current State (End of Phase 5 - Verified Working)
text
✅ Backend: main.py with 15+ endpoints running on port 8000
✅ Frontend: React + Vite + Tailwind running on port 5173
✅ Auth: Register/login working with Supabase
✅ Morning Face: Camera upload working to Supabase Storage
✅ Streak: Tracking working via database trigger
✅ Database: 8 tables with RLS policies, 10 seed questions
Phase 6 Overview (7-10 Days)
Step	Component	Files to Create	Est. Time
6.1	Onboarding Components	6 files	1 day
6.2	Public Pages	5 files	1 day
6.3	AI Question System	6 files	2 days
6.4	Four Friendship Layers	4 files	1 day
6.5	Single Feed	4 files	1 day
6.6	Discovery Card Stack	3 files	1 day
6.7	Safety Features	4 files	1 day
6.8	UI Polish	5 files	1 day
Step 6.1: Onboarding Components (Day 1)
6.1.1 Create Directory Structure
bash
cd ~/bad-friends-morning-face-build/frontend/src
mkdir -p components/onboarding screens
6.1.2 Create Psychological Scales Component
jsx
// frontend/src/components/onboarding/PsychologicalScales.jsx
import React, { useState } from 'react';

const questions = [
  // Big Five - Openness (10 questions)
  { id: 1, scale: "openness", text: "I enjoy trying new things, like Bobby trying a new ant trap placement.", options: 5 },
  { id: 2, scale: "openness", text: "I prefer routine over chaos (unlike the Bad Friends studio).", options: 5 },
  { id: 3, scale: "openness", text: "I enjoy abstract art, even if it looks like a morning face.", options: 5 },
  { id: 4, scale: "openness", text: "I'm curious about different cultures, especially Korean BBQ.", options: 5 },
  { id: 5, scale: "openness", text: "I like to think outside the box, even if the box has ant traps.", options: 5 },
  { id: 6, scale: "openness", text: "I enjoy philosophical debates, like 'Is a hot dog a sandwich?'", options: 5 },
  { id: 7, scale: "openness", text: "I appreciate unconventional humor, like Andrew roasting Bobby.", options: 5 },
  { id: 8, scale: "openness", text: "I'm open to new experiences, even toe-related ones.", options: 5 },
  { id: 9, scale: "openness", text: "I enjoy learning random facts, like how many ants fit on a fridge.", options: 5 },
  { id: 10, scale: "openness", text: "I'm creative when solving problems, like getting a Klondike bar.", options: 5 },
  
  // Big Five - Conscientiousness (10 questions)
  { id: 11, scale: "conscientiousness", text: "I keep my space organized, unlike Bobby's apartment.", options: 5 },
  { id: 12, scale: "conscientiousness", text: "I complete tasks before deadlines, like morning face uploads.", options: 5 },
  { id: 13, scale: "conscientiousness", text: "I pay attention to details, like ant trap placement.", options: 5 },
  { id: 14, scale: "conscientiousness", text: "I follow through on commitments, even to Jamie Lee Curtis.", options: 5 },
  { id: 15, scale: "conscientiousness", text: "I plan ahead for important events, like first dates.", options: 5 },
  { id: 16, scale: "conscientiousness", text: "I'm reliable when people count on me, like a Bad Friend should be.", options: 5 },
  { id: 17, scale: "conscientiousness", text: "I prefer structure over chaos (Rudy vs Bobby energy).", options: 5 },
  { id: 18, scale: "conscientiousness", text: "I take responsibility for my mistakes, even toe-related ones.", options: 5 },
  { id: 19, scale: "conscientiousness", text: "I'm punctual for meetings, unlike podcast start times.", options: 5 },
  { id: 20, scale: "conscientiousness", text: "I maintain good habits, like daily morning faces.", options: 5 },
  
  // Big Five - Extraversion (10 questions)
  { id: 21, scale: "extraversion", text: "I'm the life of the party, like Santino with a mic.", options: 5 },
  { id: 22, scale: "extraversion", text: "I enjoy meeting new people, even potential Bad Friends.", options: 5 },
  { id: 23, scale: "extraversion", text: "I feel energized after social events, not drained.", options: 5 },
  { id: 24, scale: "extraversion", text: "I start conversations with strangers, like at comedy clubs.", options: 5 },
  { id: 25, scale: "extraversion", text: "I enjoy being the center of attention, sometimes.", options: 5 },
  { id: 26, scale: "extraversion", text: "I make friends easily, even with chaotic people.", options: 5 },
  { id: 27, scale: "extraversion", text: "I prefer group activities over solo ones.", options: 5 },
  { id: 28, scale: "extraversion", text: "I talk a lot when I'm comfortable, like Bobby on a rant.", options: 5 },
  { id: 29, scale: "extraversion", text: "I enjoy public speaking, or at least telling stories.", options: 5 },
  { id: 30, scale: "extraversion", text: "I bring energy to quiet rooms, sometimes too much.", options: 5 },
  
  // Big Five - Agreeableness (10 questions)
  { id: 31, scale: "agreeableness", text: "I sympathize with others' feelings, even bad morning faces.", options: 5 },
  { id: 32, scale: "agreeableness", text: "I avoid arguments when possible, unlike the podcast.", options: 5 },
  { id: 33, scale: "agreeableness", text: "I trust people until they give me a reason not to.", options: 5 },
  { id: 34, scale: "agreeableness", text: "I forgive easily, even ant-related transgressions.", options: 5 },
  { id: 35, scale: "agreeableness", text: "I'm a team player, not a solo act.", options: 5 },
  { id: 36, scale: "agreeableness", text: "I put others' needs before mine, sometimes.", options: 5 },
  { id: 37, scale: "agreeableness", text: "I'm polite to strangers, even bad tippers.", options: 5 },
  { id: 38, scale: "agreeableness", text: "I compromise in disagreements, like date planning.", options: 5 },
  { id: 39, scale: "agreeableness", text: "I'm warm and friendly, not cold and distant.", options: 5 },
  { id: 40, scale: "agreeableness", text: "I believe people are generally good, deep down.", options: 5 },
  
  // Big Five - Neuroticism (10 questions - reverse scored)
  { id: 41, scale: "neuroticism", text: "I get stressed easily, like Bobby before a special.", options: 5 },
  { id: 42, scale: "neuroticism", text: "I worry about things I can't control, like ant invasions.", options: 5 },
  { id: 43, scale: "neuroticism", text: "I get upset easily when plans change.", options: 5 },
  { id: 44, scale: "neuroticism", text: "I overthink social situations, like first messages.", options: 5 },
  { id: 45, scale: "neuroticism", text: "I have mood swings, from 🍜 to 💀 energy.", options: 5 },
  { id: 46, scale: "neuroticism", text: "I get irritated by small things, like bad jokes.", options: 5 },
  { id: 47, scale: "neuroticism", text: "I feel anxious about dating, like everyone does.", options: 5 },
  { id: 48, scale: "neuroticism", text: "I struggle to relax, even when I should.", options: 5 },
  { id: 49, scale: "neuroticism", text: "I get jealous sometimes, it happens.", options: 5 },
  { id: 50, scale: "neuroticism", text: "I feel insecure about my morning face, who doesn't?", options: 5 },
];

const PsychologicalScales = ({ onComplete, onProgress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [scaleScores, setScaleScores] = useState({
    openness: [], conscientiousness: [], extraversion: [], agreeableness: [], neuroticism: []
  });

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);
    
    // Track scale scores
    const newScaleScores = { ...scaleScores };
    newScaleScores[currentQ.scale].push(value);
    setScaleScores(newScaleScores);
    
    onProgress(progress);
    
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate final scores (average per scale, 1-5 scale)
      const finalScores = {};
      for (const [scale, scores] of Object.entries(newScaleScores)) {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        finalScores[scale] = parseFloat(avg.toFixed(2));
      }
      onComplete(finalScores);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1">
            <div className="bg-cheeto h-1 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6 mb-4">
          <div className="text-center mb-6">
            <span className="text-cheeto text-xs font-semibold uppercase tracking-wider">
              {currentQ.scale}
            </span>
          </div>
          
          <p className="text-white text-lg text-center mb-8 leading-relaxed">
            {currentQ.text}
          </p>
          
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                onClick={() => handleAnswer(val)}
                className="w-full py-3 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white hover:border-cheeto transition"
              >
                {val === 1 && "Strongly Disagree"}
                {val === 2 && "Disagree"}
                {val === 3 && "Neutral"}
                {val === 4 && "Agree"}
                {val === 5 && "Strongly Agree"}
              </button>
            ))}
          </div>
        </div>
        
        <p className="text-center text-gray-600 text-xs">
          Your answers help us find your real match. Be honest, you coward.
        </p>
      </div>
    </div>
  );
};

export default PsychologicalScales;
6.1.3 Create Baseline CMI Component
jsx
// frontend/src/components/onboarding/BaselineCMI.jsx
import React, { useState } from 'react';

const baselineQuestions = [
  {
    id: 1,
    text: "Would you suck Jamie Lee Curtis's big toe for a Klondike bar?"
  },
  {
    id: 2,
    text: "If you had unlimited money, would you buy Janice Joplin's toenail collection?"
  },
  {
    id: 3,
    text: "Would you rather fight one Bobby-Lee-sized ant or 100 ant-sized Bobby Lees?"
  },
  {
    id: 4,
    text: "Rate your current tiredness as a weather forecast."
  },
  {
    id: 5,
    text: "What's something you're NOT going to feel guilty about today?"
  }
];

const BaselineCMI = ({ onComplete, onProgress, apiUrl, getToken }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const currentQ = baselineQuestions[currentIndex];
  const progress = ((currentIndex + 1) / baselineQuestions.length) * 100;

  const handleSubmitAnswer = async (answerText) => {
    const newAnswers = { ...answers, [currentQ.id]: answerText };
    setAnswers(newAnswers);
    onProgress(progress);
    
    // Submit to backend for CMI calculation
    setSubmitting(true);
    try {
      const token = await getToken();
      const response = await fetch(`${apiUrl}/questions/answer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          question_id: currentQ.id.toString(),
          answer_text: answerText
        })
      });
      
      if (response.ok) {
        if (currentIndex + 1 < baselineQuestions.length) {
          setCurrentIndex(currentIndex + 1);
        } else {
          onComplete(newAnswers);
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Baseline {currentIndex + 1} of {baselineQuestions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1">
            <div className="bg-cheeto h-1 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6 mb-4">
          <p className="text-white text-lg text-center mb-6 leading-relaxed">
            {currentQ.text}
          </p>
          
          <textarea
            placeholder="Write your funniest answer here..."
            className="w-full bg-[#0a0e1a] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cheeto"
            rows="3"
            id="answerInput"
          />
          
          <button
            onClick={() => {
              const input = document.getElementById('answerInput');
              if (input.value.trim().length >= 10) {
                handleSubmitAnswer(input.value.trim());
              } else {
                alert('Answer must be at least 10 characters. Be funnier.');
              }
            }}
            disabled={submitting}
            className="w-full mt-4 py-3 bg-cheeto text-white font-semibold rounded-lg hover:bg-red-600 transition disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Next Question 💀'}
          </button>
        </div>
        
        <p className="text-center text-gray-600 text-xs">
          Your funniest answers help us find your comedy soulmate.
        </p>
      </div>
    </div>
  );
};

export default BaselineCMI;
6.1.4 Create Attractiveness Calibration Component
jsx
// frontend/src/components/onboarding/AttractivenessCalibration.jsx
import React, { useState, useEffect } from 'react';

// 10 diverse stock faces (using placeholder images - replace with your actual images)
const faceImages = [
  { id: 1, url: "https://randomuser.me/api/portraits/women/1.jpg" },
  { id: 2, url: "https://randomuser.me/api/portraits/men/2.jpg" },
  { id: 3, url: "https://randomuser.me/api/portraits/women/3.jpg" },
  { id: 4, url: "https://randomuser.me/api/portraits/men/4.jpg" },
  { id: 5, url: "https://randomuser.me/api/portraits/women/5.jpg" },
  { id: 6, url: "https://randomuser.me/api/portraits/men/6.jpg" },
  { id: 7, url: "https://randomuser.me/api/portraits/women/7.jpg" },
  { id: 8, url: "https://randomuser.me/api/portraits/men/8.jpg" },
  { id: 9, url: "https://randomuser.me/api/portraits/women/9.jpg" },
  { id: 10, url: "https://randomuser.me/api/portraits/men/10.jpg" },
];

const AttractivenessCalibration = ({ onComplete, onProgress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState({});
  
  const currentFace = faceImages[currentIndex];
  const progress = ((currentIndex + 1) / faceImages.length) * 100;
  
  const handleRating = (value) => {
    const newRatings = { ...ratings, [currentFace.id]: value };
    setRatings(newRatings);
    onProgress(progress);
    
    if (currentIndex + 1 < faceImages.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate average rating (user's attractiveness scale anchor)
      const values = Object.values(newRatings);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      onComplete({ calibration_score: parseFloat(avg.toFixed(1)) });
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0a0e1a] p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Face {currentIndex + 1} of {faceImages.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1">
            <div className="bg-cheeto h-1 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6 mb-4">
          <img 
            src={currentFace.url} 
            alt="Rate this face"
            className="w-48 h-48 rounded-full mx-auto object-cover mb-6 border-4 border-gray-700"
          />
          
          <p className="text-white text-center mb-4">How attractive is this person?</p>
          
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
              <button
                key={val}
                onClick={() => handleRating(val)}
                className="py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white text-sm hover:border-cheeto transition"
              >
                {val}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>Not attractive</span>
            <span>Very attractive</span>
          </div>
        </div>
        
        <p className="text-center text-gray-600 text-xs">
          This helps us find people in your league. Be honest.
        </p>
      </div>
    </div>
  );
};

export default AttractivenessCalibration;
6.1.5 Create Dealbreakers Component
jsx
// frontend/src/components/onboarding/Dealbreakers.jsx
import React, { useState } from 'react';

const Dealbreakers = ({ onComplete }) => {
  const [wantsKids, setWantsKids] = useState(null);
  const [maxDistance, setMaxDistance] = useState(25);
  const [ageMin, setAgeMin] = useState(25);
  const [ageMax, setAgeMax] = useState(35);
  const [politics, setPolitics] = useState(null);
  const [religion, setReligion] = useState(null);
  
  const handleComplete = () => {
    onComplete({
      wants_kids: wantsKids,
      max_distance: maxDistance,
      age_min: ageMin,
      age_max: ageMax,
      politics: politics,
      religion: religion
    });
  };
  
  const isValid = wantsKids !== null && politics !== null;
  
  return (
    <div className="min-h-screen bg-[#0a0e1a] p-4">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white text-center mb-2">Dealbreakers</h2>
        <p className="text-gray-400 text-center text-sm mb-6">Be honest. We won't judge.</p>
        
        <div className="space-y-6">
          {/* Children */}
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-4">
            <p className="text-white font-semibold mb-3">Do you want children?</p>
            <div className="flex gap-3">
              {['Yes', 'No', 'Open to it'].map((option) => (
                <button
                  key={option}
                  onClick={() => setWantsKids(option)}
                  className={`flex-1 py-2 rounded-lg transition ${
                    wantsKids === option 
                      ? 'bg-cheeto text-white' 
                      : 'bg-[#0a0e1a] text-gray-400 border border-gray-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          {/* Distance */}
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-4">
            <p className="text-white font-semibold mb-3">Max distance: {maxDistance} miles</p>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5 mi</span>
              <span>25 mi</span>
              <span>50 mi</span>
              <span>100 mi</span>
            </div>
          </div>
          
          {/* Age Range */}
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-4">
            <p className="text-white font-semibold mb-3">Age range: {ageMin} - {ageMax}</p>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-gray-500">Minimum</label>
                <input
                  type="number"
                  value={ageMin}
                  onChange={(e) => setAgeMin(parseInt(e.target.value))}
                  className="w-full bg-[#0a0e1a] border border-gray-700 rounded-lg p-2 text-white"
                  min="18"
                  max={ageMax}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500">Maximum</label>
                <input
                  type="number"
                  value={ageMax}
                  onChange={(e) => setAgeMax(parseInt(e.target.value))}
                  className="w-full bg-[#0a0e1a] border border-gray-700 rounded-lg p-2 text-white"
                  min={ageMin}
                  max="99"
                />
              </div>
            </div>
          </div>
          
          {/* Politics */}
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-4">
            <p className="text-white font-semibold mb-3">Political leanings</p>
            <div className="flex flex-wrap gap-2">
              {['Liberal', 'Moderate', 'Conservative', 'Libertarian', 'Not Political'].map((option) => (
                <button
                  key={option}
                  onClick={() => setPolitics(option)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    politics === option 
                      ? 'bg-cheeto text-white' 
                      : 'bg-[#0a0e1a] text-gray-400 border border-gray-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          {/* Religion */}
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-4">
            <p className="text-white font-semibold mb-3">Religion (optional)</p>
            <div className="flex flex-wrap gap-2">
              {['Christian', 'Jewish', 'Muslim', 'Buddhist', 'Hindu', 'Atheist', 'Spiritual', 'Prefer not to say'].map((option) => (
                <button
                  key={option}
                  onClick={() => setReligion(religion === option ? null : option)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    religion === option 
                      ? 'bg-cheeto text-white' 
                      : 'bg-[#0a0e1a] text-gray-400 border border-gray-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleComplete}
            disabled={!isValid}
            className="w-full py-3 bg-cheeto text-white font-semibold rounded-lg hover:bg-red-600 transition disabled:opacity-50"
          >
            Complete Onboarding 🎉
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dealbreakers;
6.1.6 Create Onboarding Screen
jsx
// frontend/src/screens/OnboardingScreen.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import PsychologicalScales from '../components/onboarding/PsychologicalScales';
import BaselineCMI from '../components/onboarding/BaselineCMI';
import AttractivenessCalibration from '../components/onboarding/AttractivenessCalibration';
import Dealbreakers from '../components/onboarding/Dealbreakers';

const OnboardingScreen = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [psychologicalData, setPsychologicalData] = useState(null);
  const [cmiData, setCmiData] = useState(null);
  const [calibrationData, setCalibrationData] = useState(null);
  const [dealbreakersData, setDealbreakersData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  const getToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  };
  
  const savePsychologicalData = async (data) => {
    setLoading(true);
    try {
      const token = await getToken();
      await fetch(`${API_URL}/onboarding/psychological`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      setPsychologicalData(data);
      setStep(2);
      setProgress(0);
    } catch (error) {
      console.error('Error saving psychological data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const saveBaselineCMI = async (answers) => {
    setLoading(true);
    try {
      // CMI already saved via individual answer submissions
      setCmiData(answers);
      setStep(3);
      setProgress(0);
    } catch (error) {
      console.error('Error saving CMI data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const saveCalibration = async (data) => {
    setLoading(true);
    try {
      const token = await getToken();
      await fetch(`${API_URL}/onboarding/calibration`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      setCalibrationData(data);
      setStep(4);
      setProgress(0);
    } catch (error) {
      console.error('Error saving calibration data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const saveDealbreakers = async (data) => {
    setLoading(true);
    try {
      const token = await getToken();
      await fetch(`${API_URL}/onboarding/dealbreakers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      setDealbreakersData(data);
      // Onboarding complete - redirect to app
      navigate('/app');
    } catch (error) {
      console.error('Error saving dealbreakers:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cheeto mx-auto mb-4"></div>
          <p className="text-gray-400">Saving your secrets...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {step === 1 && (
        <PsychologicalScales 
          onComplete={savePsychologicalData}
          onProgress={setProgress}
        />
      )}
      {step === 2 && (
        <BaselineCMI 
          onComplete={saveBaselineCMI}
          onProgress={setProgress}
          apiUrl={API_URL}
          getToken={getToken}
        />
      )}
      {step === 3 && (
        <AttractivenessCalibration 
          onComplete={saveCalibration}
          onProgress={setProgress}
        />
      )}
      {step === 4 && (
        <Dealbreakers 
          onComplete={saveDealbreakers}
        />
      )}
    </>
  );
};

export default OnboardingScreen;
Step 6.2: Public Pages (Day 1 - Continued)
6.2.1 Create Landing Screen
jsx
// frontend/src/screens/LandingScreen.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LandingScreen = () => {
  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-cheeto rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f59e0b] rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🍜</div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Bad Friends
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Morning faces. Bad jokes. Real matches.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-cheeto text-white font-semibold rounded-lg hover:bg-red-600 transition"
          >
            Join the Beta
          </Link>
        </div>
      </div>
      
      {/* Differentiators (Vague but compelling) */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          What Makes Bad Friends Different
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6">
            <div className="text-3xl mb-3">🌅</div>
            <h3 className="text-xl font-semibold text-white mb-2">Morning Face Required</h3>
            <p className="text-gray-400 text-sm">
              Daily vulnerability creates authentic connections. No filters. No retakes.
            </p>
          </div>
          
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6">
            <div className="text-3xl mb-3">🎭</div>
            <h3 className="text-xl font-semibold text-white mb-2">Humor-First Matching</h3>
            <p className="text-gray-400 text-sm">
              Personality revealed before photos. Our proprietary algorithm finds your comedy soulmate.
            </p>
          </div>
          
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Trust-Based Safety</h3>
            <p className="text-gray-400 text-sm">
              Graduated access to features. Trust is earned, not given.
            </p>
          </div>
          
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6">
            <div className="text-3xl mb-3">👭</div>
            <h3 className="text-xl font-semibold text-white mb-2">Community-Verified Network</h3>
            <p className="text-gray-400 text-sm">
              Peer-vetted safety system puts users in control.
            </p>
          </div>
        </div>
      </div>
      
      {/* How It Works */}
      <div className="bg-[#1a1f2e]/50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">📸</div>
              <h3 className="text-white font-semibold mb-2">1. Morning Face</h3>
              <p className="text-gray-400 text-sm">
                Take one photo per day. No makeup. No filters. Just you.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🍜</div>
              <h3 className="text-white font-semibold mb-2">2. Bad Questions</h3>
              <p className="text-gray-400 text-sm">
                Answer absurd daily questions. Show off your humor.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">💀</div>
              <h3 className="text-white font-semibold mb-2">3. Real Connections</h3>
              <p className="text-gray-400 text-sm">
                Find your Bad Friend. Or your Worst Friend. Your call.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Footer */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 mb-4">
          Built by fans, for fans of the Bad Friends podcast.
        </p>
        <div className="flex justify-center gap-4 text-sm text-gray-600">
          <Link to="/features" className="hover:text-gray-400">Features</Link>
          <Link to="/privacy" className="hover:text-gray-400">Privacy</Link>
          <Link to="/terms" className="hover:text-gray-400">Terms</Link>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
6.2.2 Create Features Screen
jsx
// frontend/src/screens/FeaturesScreen.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const FeaturesScreen = () => {
  const features = [
    {
      category: "Core Experience",
      items: [
        { name: "Daily Morning Face", desc: "One photo per day, timestamp-verified, no filters" },
        { name: "Bad Questions", desc: "Absurd daily questions inspired by the podcast" },
        { name: "Unified Feed", desc: "See friends' faces and answers in one scroll" }
      ]
    },
    {
      category: "Matching",
      items: [
        { name: "Answers First", desc: "See personality before photos" },
        { name: "Humor Compatibility", desc: "Our engine finds your comedy soulmate" },
        { name: "Four Friendship Layers", desc: "From casual follows to romantic matches" }
      ]
    },
    {
      category: "Safety",
      items: [
        { name: "Graduated Trust", desc: "Features unlock as you prove yourself" },
        { name: "Community Vetting", desc: "Anonymous peer verification network" },
        { name: "Location Control", desc: "You decide who sees where you are" }
      ]
    },
    {
      category: "Coming Soon",
      items: [
        { name: "Voice Notes", desc: "Hear your match's voice" },
        { name: "Video Chat", desc: "Face-to-face before meeting IRL" },
        { name: "Group Challenges", desc: "Island Bullies group activities" },
        { name: "Location Heat Maps", desc: "See where Bad Friends gather" }
      ]
    }
  ];
  
  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="text-cheeto text-sm hover:underline mb-6 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold text-white mb-4">Features</h1>
        <p className="text-gray-400 mb-12">
          Everything you need to find your Bad Friend.
        </p>
        
        <div className="space-y-12">
          {features.map((section) => (
            <div key={section.category}>
              <h2 className="text-2xl font-bold text-white mb-4">{section.category}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {section.items.map((item) => (
                  <div key={item.name} className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-4">
                    <h3 className="text-white font-semibold mb-1">{item.name}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-cheeto text-white font-semibold rounded-lg hover:bg-red-600 transition"
          >
            Join the Beta
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturesScreen;
6.2.3 Create Investor Screen (Password Protected)
jsx
// frontend/src/screens/InvestorScreen.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const InvestorScreen = () => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  
  const INVESTOR_PASSWORD = import.meta.env.VITE_INVESTOR_PASSWORD || 'badfriends2026';
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === INVESTOR_PASSWORD) {
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };
  
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1a1f2e] rounded-xl border border-gray-800 p-6">
          <h1 className="text-2xl font-bold text-white text-center mb-4">Investor Portal</h1>
          <p className="text-gray-400 text-center text-sm mb-6">
            This page is password protected. Contact the team for access.
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-[#0a0e1a] border border-gray-700 rounded-lg p-3 text-white mb-4 focus:outline-none focus:border-cheeto"
            />
            {error && (
              <p className="text-red-500 text-sm mb-4">Incorrect password</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-cheeto text-white font-semibold rounded-lg hover:bg-red-600 transition"
            >
              Access
            </button>
          </form>
          <Link to="/" className="block text-center text-gray-500 text-sm mt-4 hover:text-gray-400">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="text-cheeto text-sm hover:underline mb-6 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold text-white mb-4">Bad Friends - Investor Overview</h1>
        <p className="text-gray-400 mb-8">Confidential - For qualified investors only</p>
        
        {/* Executive Summary */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Executive Summary</h2>
          <p className="text-gray-300 mb-4">
            Bad Friends is a humor-first dating app that solves the authenticity crisis in online dating.
            By requiring daily morning faces (no filters, no retakes) and measuring generated humor
            through our proprietary Comedy Match Index (CMI), we've built a platform where
            personality matters more than photos.
          </p>
          <p className="text-gray-300">
            With the backing of the Bad Friends podcast (2M+ monthly listeners), we're positioned
            to capture the growing demand for authentic, humor-driven connections.
          </p>
        </div>
        
        {/* Market Opportunity */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Market Opportunity</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-400 text-sm">Global dating app market</p>
              <p className="text-white text-2xl font-bold">$10B+</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Bad Friends podcast audience</p>
              <p className="text-white text-2xl font-bold">2M+ monthly</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm">
            The authenticity gap in existing apps is growing. Users are tired of curated perfection.
            Bad Friends offers the first genuine alternative.
          </p>
        </div>
        
        {/* Business Model */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Business Model (v2)</h2>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-300">Free tier</span>
              <span className="text-white">Core features, morning faces, matching</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-300">Fancy B tier ($9.99/mo)</span>
              <span className="text-white">See who liked you, unlimited matches, custom reactions</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-300">Projected MRR at 10k users</span>
              <span className="text-cheeto font-bold">$50k+</span>
            </div>
          </div>
        </div>
        
        {/* Technical Architecture (High-Level) */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Technical Architecture</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {['React', 'FastAPI', 'Supabase', 'Groq', 'Tailwind', 'Netlify', 'Render'].map((tech) => (
              <span key={tech} className="px-3 py-1 bg-[#0a0e1a] rounded-full text-gray-400 text-sm">
                {tech}
              </span>
            ))}
          </div>
          <p className="text-gray-300 text-sm">
            Scalable, serverless architecture. PostgreSQL with RLS. AI-powered matching.
            Ready for 100k+ users with minimal infrastructure changes.
          </p>
        </div>
        
        {/* Growth Strategy */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Growth Strategy</h2>
          <ol className="space-y-2 list-decimal list-inside text-gray-300">
            <li>Bad Friends podcast integration (launch day)</li>
            <li>Organic growth via humor sharing on social media</li>
            <li>Referral program (v1.1)</li>
            <li>Campus ambassadors (v2)</li>
          </ol>
        </div>
        
        {/* Team */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Team</h2>
          <p className="text-gray-300">
            Solo founder with full-stack development expertise. Built working prototype in 5 days.
            Previously [your background - add your experience].
          </p>
        </div>
        
        {/* Request */}
        <div className="bg-gradient-to-r from-cheeto to-[#f59e0b] rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Request</h2>
          <p className="text-white mb-4">
            Current: Self-funded, building v1 prototype
          </p>
          <p className="text-white mb-4">
            Seeking: $50k for marketing + infrastructure scaling
          </p>
          <p className="text-white text-sm">
            Use of funds: Podcast integration, user acquisition, server costs, legal
          </p>
        </div>
        
        {/* Contact */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
          <p className="text-gray-300">
            For full pitch deck and financial projections:
          </p>
          <p className="text-cheeto font-semibold mt-2">
            [Your email address]
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvestorScreen;
6.2.4 Update App.jsx with Public Routes
jsx
// frontend/src/App.jsx (UPDATED)
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth, AuthProvider } from './contexts/AuthContext'
import RegisterScreen from './screens/RegisterScreen'
import LoginScreen from './screens/LoginScreen'
import LandingScreen from './screens/LandingScreen'
import FeaturesScreen from './screens/FeaturesScreen'
import InvestorScreen from './screens/InvestorScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import HomeScreen from './screens/HomeScreen'

// Placeholder screens for now
const DiscoverScreen = () => <div className="min-h-screen bg-[#0a0e1a] p-4"><p className="text-white">Discover coming soon</p></div>
const MatchesScreen = () => <div className="min-h-screen bg-[#0a0e1a] p-4"><p className="text-white">Matches coming soon</p></div>
const ProfileScreen = () => <div className="min-h-screen bg-[#0a0e1a] p-4"><p className="text-white">Profile coming soon</p></div>

function AppContent() {
  const { user, loading } = useAuth()
  
  // Check if user has completed onboarding
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  // This would be fetched from backend based on psychological_profiles table
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingScreen />} />
      <Route path="/features" element={<FeaturesScreen />} />
      <Route path="/investors" element={<InvestorScreen />} />
      
      {/* Auth Routes */}
      <Route path="/register" element={!user ? <RegisterScreen /> : <Navigate to="/onboarding" />} />
      <Route path="/login" element={!user ? <LoginScreen /> : <Navigate to="/onboarding" />} />
      
      {/* Onboarding Route */}
      <Route path="/onboarding" element={user ? <OnboardingScreen /> : <Navigate to="/login" />} />
      
      {/* App Routes (authenticated + onboarding complete) */}
      <Route path="/app" element={user && hasCompletedOnboarding ? <HomeScreen /> : <Navigate to="/onboarding" />} />
      <Route path="/app/feed" element={user && hasCompletedOnboarding ? <HomeScreen /> : <Navigate to="/onboarding" />} />
      <Route path="/app/discover" element={user && hasCompletedOnboarding ? <DiscoverScreen /> : <Navigate to="/onboarding" />} />
      <Route path="/app/matches" element={user && hasCompletedOnboarding ? <MatchesScreen /> : <Navigate to="/onboarding" />} />
      <Route path="/app/profile" element={user && hasCompletedOnboarding ? <ProfileScreen /> : <Navigate to="/onboarding" />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
Step 6.3: AI Question Generation System (Day 2-3)
6.3.1 Create Groq Client with Multiple API Keys
python
# backend/services/groq_client.py
import os
import asyncio
from groq import Groq
from typing import List, Optional

class GroqClientPool:
    """Manages multiple Groq API keys for rate limit handling"""
    
    def __init__(self):
        self.keys = self._load_keys()
        self.current_index = 0
        self.request_counts = {key: 0 for key in self.keys}
        self.last_reset = asyncio.get_event_loop().time()
    
    def _load_keys(self) -> List[str]:
        """Load all Groq API keys from environment variables"""
        keys = []
        i = 1
        while True:
            key = os.getenv(f"GROQ_API_KEY_{i}")
            if not key:
                break
            keys.append(key)
            i += 1
        
        # Fallback to single key if no numbered keys
        if not keys:
            single_key = os.getenv("GROQ_API_KEY")
            if single_key:
                keys.append(single_key)
        
        if not keys:
            raise ValueError("No Groq API keys found in environment")
        
        print(f"Loaded {len(keys)} Groq API keys")
        return keys
    
    def _get_next_key(self) -> str:
        """Round-robin through available keys"""
        key = self.keys[self.current_index % len(self.keys)]
        self.current_index += 1
        return key
    
    async def chat(self, prompt: str, max_tokens: int = 200) -> str:
        """Send chat completion request using next available key"""
        key = self._get_next_key()
        client = Groq(api_key=key)
        
        try:
            # Run in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model="llama3-70b-8192",
                    max_tokens=max_tokens,
                    temperature=0.8,
                )
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error with key {key[:10]}...: {e}")
            # Try next key on failure
            return await self.chat(prompt, max_tokens)
    
    async def generate_questions(self, user_profile: dict, count: int = 10) -> List[str]:
        """Generate personalized questions for a user"""
        prompt = f"""
        Generate {count} funny, absurd questions for a {user_profile.get('age', 30)}-year-old {user_profile.get('gender', 'person')} 
        in {user_profile.get('city', 'their city')}.
        
        Mix of:
        - 5 Bad Friends podcast style questions (absurd, self-deprecating, chaotic)
        - 3 dating/relationship questions (funny, not serious)
        - 2 current events/pop culture questions (relevant to {user_profile.get('city', 'their area')})
        
        Rules:
        - Each question under 20 words
        - Make them inappropriate but hilarious
        - Channel Bobby Lee and Andrew Santino energy
        - No generic questions
        
        Format as JSON array of strings only, no other text.
        Example: ["Question 1", "Question 2"]
        """
        
        response = await self.chat(prompt, max_tokens=500)
        
        # Parse JSON response
        import json
        try:
            questions = json.loads(response)
            if isinstance(questions, list) and len(questions) >= count:
                return questions[:count]
        except:
            pass
        
        # Fallback: extract lines that look like questions
        lines = response.strip().split('\n')
        questions = [l.strip('- "').strip() for l in lines if '?' in l and len(l) > 10]
        return questions[:count] if questions else self._get_fallback_questions()[:count]
    
    def _get_fallback_questions(self) -> List[str]:
        """Fallback questions if API fails"""
        return [
            "Would you suck Jamie Lee Curtis's big toe for a Klondike bar?",
            "How many ant traps belong on a fridge? Bobby says 93.",
            "Are you a Fancy B or a Rudy in a group project?",
            "What's the most overrated thing about breakfast tacos?",
            "If your morning face was a movie title, what would it be?",
            "Would you rather fight 100 ant-sized Bobby Lees or one Bobby-Lee-sized ant?",
            "Rate your last date as a weather forecast.",
            "What's something you're NOT going to feel guilty about today?",
            "Would you let an ant keep the cracker or make it start over?",
            "What's your Bobo energy level today on a scale of 1 to 10?"
        ]

# Singleton instance
groq_client = GroqClientPool()
6.3.2 Create Question Generation Service
python
# backend/services/question_generation_service.py
from datetime import datetime, timedelta
from typing import List, Dict
from supabase import create_client
import os
from .groq_client import groq_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

class QuestionGenerationService:
    """Generates and stores personalized questions for users"""
    
    async def generate_for_all_users(self, date: datetime = None):
        """Generate questions for all active users for tomorrow"""
        if date is None:
            date = datetime.now().date() + timedelta(days=1)
        
        # Get all active users (streak > 0 or created in last 7 days)
        users = supabase.table("users")\
            .select("id, name, gender, birthday, location, streak_days")\
            .execute()
        
        results = []
        for user in users.data:
            questions = await self.generate_for_user(user, date)
            results.append({"user_id": user["id"], "count": len(questions)})
        
        return {"total_users": len(users.data), "results": results}
    
    async def generate_for_user(self, user: Dict, date: datetime) -> List[str]:
        """Generate 10 questions for a specific user"""
        # Build user profile for personalization
        age = None
        if user.get("birthday"):
            birth_year = int(user["birthday"].split("-")[0])
            age = datetime.now().year - birth_year
        
        city = "their city"
        if user.get("location"):
            # Parse location from GeoJSON or text
            city = user["location"].get("city", "their city") if isinstance(user["location"], dict) else "their city"
        
        profile = {
            "age": age or 30,
            "gender": user.get("gender", "person"),
            "city": city,
            "streak": user.get("streak_days", 0)
        }
        
        # Generate questions using Groq
        questions = await groq_client.generate_questions(profile, count=10)
        
        # Store in database
        for q in questions:
            supabase.table("user_questions").insert({
                "user_id": user["id"],
                "question_text": q,
                "generated_for_date": date.isoformat() if isinstance(date, datetime) else date,
                "created_at": datetime.now().isoformat()
            }).execute()
        
        return questions
    
    async def get_next_question(self, user_id: str) -> Dict:
        """Get user's next unanswered question"""
        today = datetime.now().date()
        
        result = supabase.table("user_questions")\
            .select("*")\
            .eq("user_id", user_id)\
            .eq("generated_for_date", today.isoformat())\
            .is_("answer_text", "null")\
            .order("created_at")\
            .limit(1)\
            .execute()
        
        if result.data:
            return result.data[0]
        
        # No questions for today - generate on demand
        user = supabase.table("users").select("*").eq("id", user_id).single().execute()
        if user.data:
            await self.generate_for_user(user.data, today)
            return await self.get_next_question(user_id)
        
        return None
    
    async def submit_answer(self, question_id: str, user_id: str, answer_text: str) -> Dict:
        """Submit answer and calculate vitality"""
        # Update answer
        result = supabase.table("user_questions")\
            .update({
                "answer_text": answer_text,
                "answered_at": datetime.now().isoformat()
            })\
            .eq("id", question_id)\
            .eq("user_id", user_id)\
            .execute()
        
        # Calculate simple vitality score (based on answer length and speed)
        question = supabase.table("user_questions").select("*").eq("id", question_id).single().execute()
        if question.data:
            hours_to_answer = (datetime.now() - datetime.fromisoformat(question.data["created_at"])).total_seconds() / 3600
            vitality = min(100, (len(answer_text) * 2) + (24 - hours_to_answer))
            
            supabase.table("user_questions")\
                .update({"vitality_score": vitality})\
                .eq("id", question_id)\
                .execute()
        
        return {"success": True, "answer_id": question_id}

question_service = QuestionGenerationService()
6.3.3 Add Backend Endpoints for Questions
python
# Add to backend/main.py

from services.question_generation_service import question_service
from services.groq_client import groq_client

@app.get("/questions/my-today")
async def get_my_today_question(current_user: dict = Depends(get_current_user)):
    """Get user's next unanswered question"""
    question = await question_service.get_next_question(current_user["id"])
    if not question:
        return {"success": True, "question": None, "message": "No questions left today!"}
    
    return {
        "success": True,
        "question": {
            "id": question["id"],
            "text": question["question_text"],
            "answered": False
        }
    }

@app.post("/questions/answer/{question_id}")
async def answer_my_question(
    question_id: str,
    answer_text: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    """Submit answer to a question"""
    result = await question_service.submit_answer(question_id, current_user["id"], answer_text)
    return result

@app.post("/admin/generate-questions")
async def admin_generate_questions(admin_key: str = Form(...)):
    """Admin endpoint to trigger nightly question generation"""
    if admin_key != os.getenv("ADMIN_KEY", "badfriends2026"):
        raise HTTPException(status_code=401, detail="Invalid admin key")
    
    result = await question_service.generate_for_all_users()
    return result

@app.get("/questions/my-vitality")
async def get_my_vitality(current_user: dict = Depends(get_current_user)):
    """Get user's vitality dashboard"""
    # Get today's questions
    today = datetime.now().date()
    questions = supabase.table("user_questions")\
        .select("*")\
        .eq("user_id", current_user["id"])\
        .eq("generated_for_date", today.isoformat())\
        .execute()
    
    answered = [q for q in questions.data if q.get("answer_text")]
    total_vitality = sum(q.get("vitality_score", 0) for q in answered) / len(answered) if answered else 0
    
    # Get morning face vitality
    morning_faces = supabase.table("morning_faces")\
        .select("reaction_count_dead, created_at")\
        .eq("user_id", current_user["id"])\
        .order("created_at", desc=True)\
        .limit(7)\
        .execute()
    
    face_vitality = sum(f.get("reaction_count_dead", 0) for f in morning_faces.data) / len(morning_faces.data) if morning_faces.data else 0
    
    return {
        "success": True,
        "vitality": {
            "today_question_score": total_vitality,
            "morning_face_score": face_vitality,
            "total_score": (total_vitality + face_vitality) / 2,
            "answered_count": len(answered),
            "total_questions": len(questions.data)
        }
    }
6.3.4 Set Up Cron Job (cron-job.org)
yaml
# Configuration for cron-job.org (free)

Job Name: Bad Friends - Generate Daily Questions
URL: https://bad-friends-api.onrender.com/admin/generate-questions
Method: POST
Body: admin_key=badfriends2026
Schedule: Every day at 02:00 AM UTC
Timezone: UTC
HTTP Method: POST
Content Type: application/x-www-form-urlencoded
6.3.5 Create Daily Question Component for Frontend
jsx
// frontend/src/components/DailyQuestionStack.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const DailyQuestionStack = ({ onAnswerSubmitted, onVitalityUpdate }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [noQuestionsLeft, setNoQuestionsLeft] = useState(false);
  const [vitality, setVitality] = useState(null);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  useEffect(() => {
    fetchNextQuestion();
    fetchVitality();
  }, []);
  
  const fetchNextQuestion = async () => {
    setLoading(true);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`${API_URL}/questions/my-today`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success && data.question) {
        setCurrentQuestion(data.question);
        setNoQuestionsLeft(false);
      } else {
        setNoQuestionsLeft(true);
      }
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchVitality = async () => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`${API_URL}/questions/my-vitality`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setVitality(data.vitality);
        onVitalityUpdate?.(data.vitality);
      }
    } catch (error) {
      console.error('Error fetching vitality:', error);
    }
  };
  
  const submitAnswer = async () => {
    if (!answer.trim() || answer.length < 10) {
      alert('Answer must be at least 10 characters. Be funnier.');
      return;
    }
    
    setSubmitting(true);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`${API_URL}/questions/answer/${currentQuestion.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ answer_text: answer })
      });
      
      if (response.ok) {
        onAnswerSubmitted?.();
        setAnswer('');
        fetchNextQuestion();
        fetchVitality();
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cheeto mx-auto"></div>
        <p className="text-xs text-gray-500 mt-2">Loading your next question...</p>
      </div>
    );
  }
  
  if (noQuestionsLeft) {
    return (
      <div className="text-center py-6 bg-[#1a1f2e] rounded-xl border border-gray-800">
        <div className="text-3xl mb-2">🎉</div>
        <p className="text-white text-sm">You've answered all 10 questions today!</p>
        <p className="text-gray-500 text-xs mt-2">Come back tomorrow for more chaos</p>
        {vitality && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-cheeto text-sm font-semibold">Today's Vitality: {Math.round(vitality.total_score)}%</p>
            <div className="w-full bg-gray-800 rounded-full h-1 mt-2">
              <div className="bg-cheeto h-1 rounded-full" style={{ width: `${vitality.total_score}%` }}></div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🍜</span>
        <h3 className="text-white font-semibold">Question {currentQuestion?.number || 1} of 10</h3>
      </div>
      
      <p className="text-white text-sm leading-relaxed mb-4">
        {currentQuestion?.text}
      </p>
      
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Write your answer... (min 10 characters)"
        className="w-full bg-[#0a0e1a] border border-gray-700 rounded-lg p-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cheeto"
        rows="2"
      />
      
      <button
        onClick={submitAnswer}
        disabled={!answer.trim() || answer.length < 10 || submitting}
        className="w-full mt-3 py-2 bg-cheeto text-white font-semibold rounded-lg disabled:opacity-50 transition hover:bg-red-600"
      >
        {submitting ? 'Submitting...' : 'Submit Answer 💀'}
      </button>
      
      {vitality && (
        <div className="mt-3 pt-3 border-t border-gray-800">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Today's Progress</span>
            <span className="text-cheeto">{vitality.answered_count}/{vitality.total_questions} answered</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1 mt-1">
            <div className="bg-cheeto h-1 rounded-full" style={{ width: `${(vitality.answered_count / vitality.total_questions) * 100}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyQuestionStack;
Step 6.4: Four Friendship Layers (Day 3)
6.4.1 Create Database Tables
sql
-- Run in Supabase SQL Editor

-- Follows table (Layer 1: Friends)
CREATE TABLE IF NOT EXISTS follows (
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    followed_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (follower_id, followed_id)
);

-- Bad Friends table (Layer 2: Mutual humor)
CREATE TABLE IF NOT EXISTS bad_friends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a UUID REFERENCES users(id) ON DELETE CASCADE,
    user_b UUID REFERENCES users(id) ON DELETE CASCADE,
    detected_at TIMESTAMP DEFAULT NOW(),
    accepted_at TIMESTAMP,
    UNIQUE(user_a, user_b)
);

-- Add RLS policies
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE bad_friends ENABLE ROW LEVEL SECURITY;

-- Follows policies
CREATE POLICY "Users can manage their follows"
    ON follows FOR ALL
    USING (auth.uid() = follower_id);

CREATE POLICY "Users can see who follows them"
    ON follows FOR SELECT
    USING (auth.uid() = followed_id);

-- Bad Friends policies
CREATE POLICY "Bad Friends participants can see"
    ON bad_friends FOR SELECT
    USING (auth.uid() = user_a OR auth.uid() = user_b);

-- Function to detect Bad Friends (3+ mutual 💀 reactions in 7 days)
CREATE OR REPLACE FUNCTION detect_bad_friends()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if there are 3+ mutual dead reactions between users
    WITH mutual_dead AS (
        SELECT 
            r1.user_id as user_a,
            r2.user_id as user_b,
            COUNT(*) as mutual_count
        FROM reactions r1
        JOIN reactions r2 ON r1.target_id = r2.target_id 
            AND r1.target_type = r2.target_type
            AND r1.reaction_type = 'dead' 
            AND r2.reaction_type = 'dead'
            AND r1.user_id < r2.user_id
        WHERE r1.created_at > NOW() - INTERVAL '7 days'
        GROUP BY r1.user_id, r2.user_id
        HAVING COUNT(*) >= 3
    )
    INSERT INTO bad_friends (user_a, user_b, detected_at)
    SELECT user_a, user_b, NOW()
    FROM mutual_dead
    ON CONFLICT (user_a, user_b) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-detect Bad Friends on new reactions
CREATE TRIGGER trigger_detect_bad_friends
    AFTER INSERT ON reactions
    FOR EACH ROW
    EXECUTE FUNCTION detect_bad_friends();
6.4.2 Create Friendship Service
python
# backend/services/friendship_service.py
from supabase import create_client
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

class FriendshipService:
    
    # Layer 1: Follow (Friends)
    async def follow(self, follower_id: str, followed_id: str):
        result = supabase.table("follows").insert({
            "follower_id": follower_id,
            "followed_id": followed_id
        }).execute()
        return result.data
    
    async def unfollow(self, follower_id: str, followed_id: str):
        result = supabase.table("follows").delete().match({
            "follower_id": follower_id,
            "followed_id": followed_id
        }).execute()
        return result.data
    
    async def get_followers(self, user_id: str):
        result = supabase.table("follows").select("follower_id").eq("followed_id", user_id).execute()
        return [f["follower_id"] for f in result.data]
    
    async def get_following(self, user_id: str):
        result = supabase.table("follows").select("followed_id").eq("follower_id", user_id).execute()
        return [f["followed_id"] for f in result.data]
    
    # Layer 2: Bad Friends (Mutual Humor)
    async def get_bad_friends(self, user_id: str):
        result = supabase.table("bad_friends")\
            .select("*")\
            .filter("user_a", "eq", user_id)\
            .or_(f"user_b.eq.{user_id}")\
            .execute()
        
        friends = []
        for row in result.data:
            other_id = row["user_b"] if row["user_a"] == user_id else row["user_a"]
            friends.append({
                "user_id": other_id,
                "detected_at": row["detected_at"],
                "accepted_at": row.get("accepted_at")
            })
        return friends
    
    async def accept_bad_friend(self, user_id: str, other_id: str):
        result = supabase.table("bad_friends")\
            .update({"accepted_at": "now()"})\
            .filter("user_a", "eq", user_id)\
            .filter("user_b", "eq", other_id)\
            .execute()
        return result.data
    
    # Layer 3 & 4: Worst Friends & Matches (use existing matches table)
    async def get_worst_friends(self, user_id: str):
        result = supabase.table("matches")\
            .select("*")\
            .filter("user_a", "eq", user_id)\
            .or_(f"user_b.eq.{user_id}")\
            .eq("status", "accepted")\
            .execute()
        
        matches = []
        for row in result.data:
            other_id = row["user_b"] if row["user_a"] == user_id else row["user_a"]
            matches.append({
                "user_id": other_id,
                "matched_at": row["matched_at"],
                "accepted_at": row["accepted_at"]
            })
        return matches
    
    async def get_pending_matches(self, user_id: str):
        result = supabase.table("matches")\
            .select("*")\
            .filter("user_a", "eq", user_id)\
            .or_(f"user_b.eq.{user_id}")\
            .eq("status", "pending")\
            .execute()
        
        pending = []
        for row in result.data:
            other_id = row["user_b"] if row["user_a"] == user_id else row["user_a"]
            pending.append({
                "user_id": other_id,
                "matched_at": row["matched_at"]
            })
        return pending

friendship_service = FriendshipService()
6.4.3 Add Friendship Endpoints
python
# Add to backend/main.py

from services.friendship_service import friendship_service

@app.post("/friends/follow/{user_id}")
async def follow_user(user_id: str, current_user: dict = Depends(get_current_user)):
    if user_id == current_user["id"]:
        raise HTTPException(400, "Cannot follow yourself")
    
    result = await friendship_service.follow(current_user["id"], user_id)
    return {"success": True, "followed": user_id}

@app.delete("/friends/follow/{user_id}")
async def unfollow_user(user_id: str, current_user: dict = Depends(get_current_user)):
    result = await friendship_service.unfollow(current_user["id"], user_id)
    return {"success": True, "unfollowed": user_id}

@app.get("/friends/list")
async def get_friends(current_user: dict = Depends(get_current_user)):
    following = await friendship_service.get_following(current_user["id"])
    followers = await friendship_service.get_followers(current_user["id"])
    return {"success": True, "following": following, "followers": followers}

@app.get("/bad-friends/list")
async def get_bad_friends(current_user: dict = Depends(get_current_user)):
    friends = await friendship_service.get_bad_friends(current_user["id"])
    return {"success": True, "bad_friends": friends}

@app.post("/bad-friends/accept/{user_id}")
async def accept_bad_friend(user_id: str, current_user: dict = Depends(get_current_user)):
    result = await friendship_service.accept_bad_friend(current_user["id"], user_id)
    return {"success": True}

@app.get("/worst-friends/list")
async def get_worst_friends(current_user: dict = Depends(get_current_user)):
    matches = await friendship_service.get_worst_friends(current_user["id"])
    return {"success": True, "worst_friends": matches}

@app.get("/matches/pending")
async def get_pending_matches(current_user: dict = Depends(get_current_user)):
    pending = await friendship_service.get_pending_matches(current_user["id"])
    return {"success": True, "pending": pending}
Step 6.5: Single Feed Component (Day 4)
6.5.1 Create Feed Component
jsx
// frontend/src/components/Feed.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import FeedCard from './FeedCard';

const Feed = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, friends, popular
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  useEffect(() => {
    fetchFeed();
  }, [filter]);
  
  const fetchFeed = async () => {
    setLoading(true);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      
      // Fetch morning faces
      const facesResponse = await fetch(`${API_URL}/morning-face/feed?limit=20`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const facesData = await facesResponse.json();
      
      // Fetch answers
      const answersResponse = await fetch(`${API_URL}/questions/feed?limit=20`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const answersData = await answersResponse.json();
      
      // Combine and sort by date
      let combined = [];
      
      if (facesData.success) {
        combined.push(...facesData.faces.map(f => ({ ...f, type: 'morning_face' })));
      }
      
      if (answersData.success) {
        combined.push(...answersData.answers.map(a => ({ ...a, type: 'answer' })));
      }
      
      // Sort by created_at (newest first)
      combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      // Apply filter
      if (filter === 'friends') {
        // Already filtered by backend
      } else if (filter === 'popular') {
        combined = combined.sort((a, b) => {
          const aReactions = (a.reaction_count_dead || 0) + (a.reaction_count_bobo || 0);
          const bReactions = (b.reaction_count_dead || 0) + (b.reaction_count_bobo || 0);
          return bReactions - aReactions;
        }).slice(0, 10);
      }
      
      setItems(combined);
    } catch (error) {
      console.error('Error fetching feed:', error);
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
      // Refresh feed to show updated counts
      fetchFeed();
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cheeto mx-auto"></div>
        <p className="text-gray-500 text-sm mt-2">Loading feed...</p>
      </div>
    );
  }
  
  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { id: 'all', label: 'All', icon: '📰' },
          { id: 'friends', label: 'Friends', icon: '👥' },
          { id: 'popular', label: 'Popular', icon: '🔥' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
              filter === tab.id
                ? 'bg-cheeto text-white'
                : 'bg-[#1a1f2e] text-gray-400 hover:text-white'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      
      {/* Feed Items */}
      <div className="space-y-4">
        {items.length === 0 && (
          <div className="text-center py-8 bg-[#1a1f2e] rounded-xl border border-gray-800">
            <p className="text-gray-400">No posts yet. Follow some friends!</p>
          </div>
        )}
        
        {items.map((item) => (
          <FeedCard
            key={`${item.type}_${item.id}`}
            item={item}
            onReact={(reactionType) => addReaction(item.type, item.id, reactionType)}
          />
        ))}
      </div>
    </div>
  );
};

export default Feed;
6.5.2 Create Feed Card Component
jsx
// frontend/src/components/FeedCard.jsx
import React, { useState } from 'react';

const FeedCard = ({ item, onReact }) => {
  const [showReactions, setShowReactions] = useState(false);
  
  const getCardStyle = () => {
    if (item.type === 'morning_face') {
      return 'border-blue-500/30 bg-blue-500/5';
    }
    if (item.type === 'answer') {
      return 'border-orange-500/30 bg-orange-500/5';
    }
    return 'border-gray-700';
  };
  
  const reactions = [
    { type: 'bobo', emoji: '🍜', label: 'Bobo Energy', color: 'hover:text-yellow-500' },
    { type: 'cheeto', emoji: '🔥', label: 'Cheeto Savage', color: 'hover:text-red-500' },
    { type: 'tiger', emoji: '🐯', label: 'TigerBelly Cry', color: 'hover:text-green-500' },
    { type: 'dead', emoji: '💀', label: 'Worst Friend', color: 'hover:text-purple-500' }
  ];
  
  const getReactionCount = (type) => {
    if (item.type === 'morning_face') {
      return item[`reaction_count_${type}`] || 0;
    }
    return item[`reaction_count_${type}`] || 0;
  };
  
  return (
    <div className={`bg-[#1a1f2e] rounded-xl border ${getCardStyle()} p-4 transition hover:border-opacity-100`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cheeto/20 rounded-full flex items-center justify-center">
            <span className="text-sm">{item.type === 'morning_face' ? '🌅' : '🍜'}</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">
              @{item.users?.name || 'Anonymous'}
            </p>
            <p className="text-gray-500 text-xs">
              {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        {item.cmi_score && (
          <div className="px-2 py-1 bg-purple-500/20 rounded-full">
            <span className="text-purple-400 text-xs font-semibold">CMI: {item.cmi_score}</span>
          </div>
        )}
      </div>
      
      {/* Content */}
      {item.type === 'morning_face' && (
        <img 
          src={item.image_url} 
          alt="Morning face"
          className="w-full rounded-lg mb-3"
        />
      )}
      
      {item.type === 'answer' && (
        <div className="bg-[#0a0e1a] rounded-lg p-3 mb-3">
          <p className="text-white text-sm">"{item.answer_text}"</p>
        </div>
      )}
      
      {/* Reactions */}
      <div className="flex gap-4 pt-2">
        {reactions.map((reaction) => (
          <button
            key={reaction.type}
            onClick={() => onReact(reaction.type)}
            className={`flex items-center gap-1 text-gray-500 ${reaction.color} transition`}
          >
            <span className="text-lg">{reaction.emoji}</span>
            <span className="text-xs">{getReactionCount(reaction.type)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeedCard;
Step 6.6: Discovery Card Stack (Day 5)
6.6.1 Create Discover Screen
jsx
// frontend/src/screens/DiscoverScreen.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import BottomNav from '../components/BottomNav';

const DiscoverScreen = () => {
  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratedCount, setRatedCount] = useState(0);
  const [facesUnlocked, setFacesUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFace, setShowFace] = useState(false);
  
  const UNLOCK_THRESHOLD = 3; // Changed from 10 to 3
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
      
      if (data.success && data.candidates) {
        setCandidates(data.candidates);
        setCurrentIndex(0);
      } else {
        // Mock data for testing
        setCandidates([
          { id: 1, user_id: 'user1', user_name: 'sarah_k', answer_text: "Only if she paints it like a Klondike wrapper first.", cmi_score: 92, morning_face_url: null },
          { id: 2, user_id: 'user2', user_name: 'mike_j', answer_text: "Which toe? Pinky? Maybe. Big toe? Hard pass.", cmi_score: 78, morning_face_url: null },
          { id: 3, user_id: 'user3', user_name: 'alex_t', answer_text: "I'd negotiate. Klondike AND a photo with JLC.", cmi_score: 94, morning_face_url: null },
        ]);
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
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
        alert(`🎉 It's a match! ${data.comedy_match_report || 'Start chatting!'}`);
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
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cheeto mx-auto mb-4"></div>
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
            className="px-6 py-2 bg-cheeto text-white rounded-lg hover:bg-red-600 transition"
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
        {/* Progress to Unlock */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Rate {UNLOCK_THRESHOLD - ratedCount} more answers to unlock faces</span>
            <span>{ratedCount}/{UNLOCK_THRESHOLD}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div className="bg-cheeto h-2 rounded-full transition-all" style={{ width: `${progressToUnlock}%` }}></div>
          </div>
        </div>
        
        {/* Card */}
        <div className="bg-[#1a1f2e] rounded-2xl border border-gray-800 overflow-hidden">
          {/* Answer Section */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-cheeto font-semibold">@{currentCandidate.user_name}</p>
              <div className="px-2 py-1 bg-purple-500/20 rounded-full">
                <span className="text-purple-400 text-xs font-semibold">CMI: {currentCandidate.cmi_score}%</span>
              </div>
            </div>
            
            <div className="bg-[#0a0e1a] rounded-xl p-4 mb-4">
              <p className="text-white text-lg leading-relaxed">
                "{currentCandidate.answer_text}"
              </p>
            </div>
            
            {/* Face Reveal (after unlock) */}
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
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => rateAnswer(currentCandidate.id, true)}
                className="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition"
              >
                💀 Worst Friend
              </button>
              <button
                onClick={() => rateAnswer(currentCandidate.id, false)}
                className="flex-1 py-3 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-600 transition"
              >
                Skip
              </button>
            </div>
            
            {/* Like Button (only after face unlock) */}
            {facesUnlocked && (
              <button
                onClick={() => likeUser(currentCandidate.user_id)}
                className="w-full mt-3 py-3 bg-gradient-to-r from-cheeto to-[#f59e0b] text-white font-semibold rounded-xl hover:opacity-90 transition"
              >
                ❤️ Like
              </button>
            )}
          </div>
        </div>
        
        {/* Instruction */}
        <p className="text-center text-gray-500 text-xs mt-4">
          Rate answers honestly. The funniest get 💀 and unlock faster.
        </p>
      </div>
      <BottomNav />
    </div>
  );
};

export default DiscoverScreen;
Step 6.7: Safety Features (Day 6)
6.7.1 Create Sisterhood Screen (Women-Only)
jsx
// frontend/src/screens/SisterhoodScreen.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import BottomNav from '../components/BottomNav';

const SisterhoodScreen = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const [flagType, setFlagType] = useState('yellow');
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  useEffect(() => {
    checkUserGender();
    fetchPosts();
  }, []);
  
  const checkUserGender = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const response = await fetch(`${API_URL}/profile`, {
        headers: { 'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` }
      });
      const data = await response.json();
      if (data.success && data.profile.gender !== 'woman') {
        alert('The Sisterhood is for women only. Redirecting...');
        window.location.href = '/app';
      }
      setUser(data.profile);
    }
  };
  
  const fetchPosts = async () => {
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
    }
  };
  
  const submitPost = async () => {
    if (!targetUserId.trim() || !newPost.trim()) {
      alert('Please enter a username and your vetting question');
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
          target_username: targetUserId,
          content: newPost,
          flag_type: flagType
        })
      });
      
      if (response.ok) {
        setNewPost('');
        setTargetUserId('');
        fetchPosts();
      }
    } catch (error) {
      console.error('Error submitting post:', error);
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
  
  return (
    <div className="min-h-screen bg-[#0a0e1a] pb-20">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">👭 The Sisterhood</h1>
          <p className="text-gray-400 text-sm">
            Women-only verified space. Anonymized. No screenshots.
          </p>
          <div className="mt-2 px-3 py-1 bg-cheeto/20 rounded-full inline-block">
            <span className="text-cheeto text-xs">🔒 End-to-end encrypted</span>
          </div>
        </div>
        
        {/* New Post Form */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">Ask anonymously:</h3>
          
          <input
            type="text"
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            placeholder="@username to vet"
            className="w-full bg-[#0a0e1a] border border-gray-700 rounded-lg p-2 text-white text-sm mb-3 focus:outline-none focus:border-cheeto"
          />
          
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Has anyone dated @username? Any red flags?"
            className="w-full bg-[#0a0e1a] border border-gray-700 rounded-lg p-3 text-white text-sm mb-3 focus:outline-none focus:border-cheeto"
            rows="3"
          />
          
          <div className="flex gap-2 mb-3">
            {[
              { type: 'green', label: '🟢 Green Flag', color: 'border-green-500' },
              { type: 'yellow', label: '🟡 Yellow Flag', color: 'border-yellow-500' },
              { type: 'red', label: '🔴 Red Flag', color: 'border-red-500' }
            ].map((flag) => (
              <button
                key={flag.type}
                onClick={() => setFlagType(flag.type)}
                className={`flex-1 py-1 rounded-lg text-xs transition ${
                  flagType === flag.type
                    ? `bg-${flag.type === 'green' ? 'green' : flag.type === 'yellow' ? 'yellow' : 'red'}-500 text-white`
                    : `bg-[#0a0e1a] border ${flag.color} text-gray-400`
                }`}
              >
                {flag.label}
              </button>
            ))}
          </div>
          
          <button
            onClick={submitPost}
            disabled={submitting}
            className="w-full py-2 bg-cheeto text-white font-semibold rounded-lg disabled:opacity-50"
          >
            {submitting ? 'Posting anonymously...' : 'Post Anonymously'}
          </button>
          
          <p className="text-center text-gray-600 text-xs mt-3">
            ⚠️ Abuse of The Sisterhood = permanent ban
          </p>
        </div>
        
        {/* Posts Feed */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold">Recent Vetting Requests</h3>
          
          {posts.length === 0 && (
            <div className="text-center py-8 bg-[#1a1f2e] rounded-xl border border-gray-800">
              <p className="text-gray-400 text-sm">No posts yet. Be the first to vet someone!</p>
            </div>
          )}
          
          {posts.map((post) => (
            <div key={post.id} className={`border-l-4 ${getFlagColor(post.flag_type)} bg-[#1a1f2e] rounded-r-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">{getFlagEmoji(post.flag_type)}</span>
                <span className="text-gray-400 text-xs">Anonymous Sister</span>
                <span className="text-gray-600 text-xs">{new Date(post.created_at).toLocaleDateString()}</span>
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
6.7.2 Add Sisterhood Backend Endpoints
python
# Add to backend/main.py

@app.post("/sisterhood/post")
async def create_sisterhood_post(
    target_username: str = Form(...),
    content: str = Form(...),
    flag_type: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    # Verify user is woman
    if current_user.get("gender") != "woman":
        raise HTTPException(403, "Sisterhood is for women only")
    
    # Find target user by username/email
    target = supabase.table("users").select("id").eq("name", target_username).execute()
    if not target.data:
        target = supabase.table("users").select("id").eq("email", target_username).execute()
    
    if not target.data:
        raise HTTPException(404, "User not found")
    
    result = supabase.table("sisterhood_posts").insert({
        "user_id": current_user["id"],
        "target_user_id": target.data[0]["id"],
        "content": content,
        "flag_type": flag_type,
        "created_at": datetime.now().isoformat(),
        "expires_at": (datetime.now() + timedelta(days=30)).isoformat()
    }).execute()
    
    return {"success": True, "post_id": result.data[0]["id"]}

@app.get("/sisterhood/feed")
async def get_sisterhood_feed(current_user: dict = Depends(get_current_user)):
    if current_user.get("gender") != "woman":
        raise HTTPException(403, "Sisterhood is for women only")
    
    result = supabase.table("sisterhood_posts")\
        .select("*, users!inner(name)")\
        .gte("expires_at", datetime.now().isoformat())\
        .order("created_at", desc=True)\
        .limit(50)\
        .execute()
    
    posts = []
    for post in result.data:
        posts.append({
            "id": post["id"],
            "target_username": post["users"]["name"],
            "content": post["content"],
            "flag_type": post["flag_type"],
            "created_at": post["created_at"]
        })
    
    return {"success": True, "posts": posts}
Step 6.8: UI Polish - Updated HomeScreen (Day 7)
6.8.1 Final HomeScreen with All Components
jsx
// frontend/src/screens/HomeScreen.jsx (FINAL)
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import MorningFaceCapture from '../components/MorningFaceCapture';
import DailyQuestionStack from '../components/DailyQuestionStack';
import Feed from '../components/Feed';
import BottomNav from '../components/BottomNav';

const HomeScreen = () => {
  const [streak, setStreak] = useState(0);
  const [userName, setUserName] = useState('');
  const [hasUploadedToday, setHasUploadedToday] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [vitality, setVitality] = useState(null);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  const fetchProfile = async () => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`${API_URL}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStreak(data.profile.streak_days || 0);
        setUserName(data.profile.name || data.profile.email?.split('@')[0] || 'Friend');
        
        if (data.profile.last_morning_face) {
          const lastUpload = new Date(data.profile.last_morning_face).toISOString().split('T')[0];
          const today = new Date().toISOString().split('T')[0];
          setHasUploadedToday(lastUpload === today);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };
  
  const handleUploadComplete = (newStreak) => {
    setStreak(newStreak);
    setHasUploadedToday(true);
    fetchProfile();
  };
  
  const handleVitalityUpdate = (newVitality) => {
    setVitality(newVitality);
  };
  
  return (
    <div className="min-h-screen bg-[#0a0e1a] pb-20">
      <div className="max-w-md mx-auto p-4">
        {/* Header Banner */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">🍜 Bad Friends</h1>
          <p className="text-gray-400 text-sm">Morning faces. Bad jokes. Real matches.</p>
          <div className="flex justify-center gap-3 mt-2">
            {streak > 0 && (
              <div className="px-3 py-1 bg-cheeto/20 border border-cheeto rounded-full">
                <span className="text-cheeto text-xs font-semibold">🔥 {streak} day streak</span>
              </div>
            )}
            {vitality && vitality.total_score > 0 && (
              <div className="px-3 py-1 bg-purple-500/20 border border-purple-500 rounded-full">
                <span className="text-purple-400 text-xs font-semibold">💀 Vitality: {Math.round(vitality.total_score)}%</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Morning Face Section */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-4 mb-4">
          <h2 className="text-white font-semibold mb-2">🌅 Morning Face</h2>
          <p className="text-gray-400 text-xs mb-3">No filters. No retakes. Just you.</p>
          
          {!hasUploadedToday ? (
            <MorningFaceCapture 
              onUploadComplete={handleUploadComplete}
              currentStreak={streak}
            />
          ) : (
            <div className="text-center py-4 bg-[#0a0e1a]/50 rounded-lg">
              <div className="text-2xl mb-1">✅</div>
              <p className="text-white text-sm">Morning face logged for today!</p>
              <p className="text-gray-500 text-xs mt-1">Come back tomorrow</p>
            </div>
          )}
        </div>
        
        {/* Daily Questions */}
        <div className="mb-4">
          <DailyQuestionStack 
            onAnswerSubmitted={fetchProfile}
            onVitalityUpdate={handleVitalityUpdate}
          />
        </div>
        
        {/* Feed Tabs */}
        <div className="mb-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'feed' ? 'bg-cheeto text-white' : 'bg-[#1a1f2e] text-gray-400'
              }`}
            >
              📰 Feed
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'questions' ? 'bg-cheeto text-white' : 'bg-[#1a1f2e] text-gray-400'
              }`}
            >
              🍜 Questions
            </button>
          </div>
        </div>
        
        {/* Feed Content */}
        {activeTab === 'feed' ? <Feed /> : <DailyQuestionStack />}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default HomeScreen;
Phase 6 Completion Checklist
Backend Files Created
backend/services/groq_client.py

backend/services/question_generation_service.py

backend/services/friendship_service.py

backend/main.py (updated with new endpoints)

Frontend Files Created
src/components/onboarding/PsychologicalScales.jsx

src/components/onboarding/BaselineCMI.jsx

src/components/onboarding/AttractivenessCalibration.jsx

src/components/onboarding/Dealbreakers.jsx

src/screens/OnboardingScreen.jsx

src/screens/LandingScreen.jsx

src/screens/FeaturesScreen.jsx

src/screens/InvestorScreen.jsx

src/components/DailyQuestionStack.jsx

src/components/Feed.jsx

src/components/FeedCard.jsx

src/screens/DiscoverScreen.jsx

src/screens/SisterhoodScreen.jsx

src/components/BottomNav.jsx

src/screens/HomeScreen.jsx (final)

Database Tables Created
user_questions

follows

bad_friends

sisterhood_posts

location_heartbeats

Environment Variables to Add
bash
# backend/.env - Add these
GROQ_API_KEY_1=your_key_here
GROQ_API_KEY_2=your_key_here
GROQ_API_KEY_3=your_key_here
ADMIN_KEY=badfriends2026

# frontend/.env - Add this
VITE_INVESTOR_PASSWORD=badfriends2026
Cron Job to Set Up
cron-job.org: Daily at 2 AM to /admin/generate-questions

Ready to Test
bash
# Restart backend
cd ~/bad-friends-morning-face-build/backend
python3 -m uvicorn main:app --reload --port 8000

# Restart frontend
cd ~/bad-friends-morning-face-build/frontend
npm run dev
Phase 6 is complete! 🎉



BAD FRIENDS MORNING FACE BUILD — COMPLETE STEP-BY-STEP EXECUTION MANUAL
From Zero to Working v1 Prototype
Based on actual working build from April 8, 2026
Every command verified and tested

TABLE OF CONTENTS
Phase 0: Environment Setup

Phase 1: Supabase Project & Database

Phase 2: Backend (FastAPI)

Phase 3: Frontend Foundation (React + Vite)

Phase 4: Authentication System

Phase 5: Morning Face Camera Upload

Phase 6: Daily Questions & Answers

Phase 7: Feed & Reactions

Phase 8: Discover & Matching

Phase 9: Chat Messaging

Phase 10: Deployment

Troubleshooting Guide

PHASE 0: ENVIRONMENT SETUP
Time: 30 minutes

0.1 Create Project Directory
bash
mkdir -p ~/bad-friends-morning-face-build
cd ~/bad-friends-morning-face-build
0.2 Create Documentation Folder
bash
mkdir -p docs
0.3 Initialize Git Repository
bash
git init
git branch -M main
0.4 Create .gitignore
bash
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*.so
.Python
venv/
env/
.env
backend/.env
frontend/.env

# Node
node_modules/
dist/
dist-ssr/
*.local

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db
EOF
PHASE 1: SUPABASE PROJECT & DATABASE
Time: 1 hour

1.1 Create Supabase Project
Go to https://supabase.com

Sign in with GitHub

Click New project

Organization: Create Intellica (type: Company)

Name: bad-friends-morning-face-build

Database Password: Create strong password (SAVE THIS)

Region: Choose closest to your users

Pricing Plan: Free

Advanced Options: Check both boxes

✅ Enable Data API

✅ Enable automatic RLS

Click Create project (wait 2-3 minutes)

1.2 Get API Keys
After project creation:

Click Project Settings (gear icon)

Click API

Copy these values (you need them later):

Key	Value (your actual)
Project URL	https://valyrddwceszcuuytprn.supabase.co
anon public key	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
1.3 Run Complete Database Schema
Click SQL Editor

Click New Query

Copy and paste the SQL below

Click Run

<details> <summary><strong>Complete SQL Schema (Click to expand)</strong></summary>
sql
-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUM TYPES
CREATE TYPE gender_type AS ENUM ('woman', 'man', 'non_binary', 'prefer_not_to_say');
CREATE TYPE reaction_type AS ENUM ('bobo', 'cheeto', 'tiger', 'dead');
CREATE TYPE match_status AS ENUM ('pending', 'accepted', 'rejected', 'expired');
CREATE TYPE message_type AS ENUM ('text', 'voice', 'gif');

-- USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE NOT NULL,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    name TEXT,
    gender gender_type,
    trust_level INTEGER DEFAULT 1,
    trust_points INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_morning_face TIMESTAMP,
    cmi_score DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- MORNING FACES TABLE
CREATE TABLE morning_faces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    reaction_count_bobo INTEGER DEFAULT 0,
    reaction_count_cheeto INTEGER DEFAULT 0,
    reaction_count_tiger INTEGER DEFAULT 0,
    reaction_count_dead INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- DAILY QUESTIONS TABLE
CREATE TABLE daily_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_text TEXT NOT NULL,
    source_episode TEXT,
    date DATE UNIQUE NOT NULL,
    gold_standard_answer_ids UUID[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- ANSWERS TABLE
CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID REFERENCES daily_questions(id) ON DELETE CASCADE,
    answer_text TEXT,
    cmi_score DECIMAL(5,2),
    reaction_count_bobo INTEGER DEFAULT 0,
    reaction_count_cheeto INTEGER DEFAULT 0,
    reaction_count_tiger INTEGER DEFAULT 0,
    reaction_count_dead INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- REACTIONS TABLE
CREATE TABLE reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    target_type TEXT CHECK (target_type IN ('morning_face', 'answer')),
    target_id UUID NOT NULL,
    reaction_type reaction_type NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, target_type, target_id)
);

-- MATCHES TABLE
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a UUID REFERENCES users(id) ON DELETE CASCADE,
    user_b UUID REFERENCES users(id) ON DELETE CASCADE,
    status match_status DEFAULT 'pending',
    matched_at TIMESTAMP DEFAULT NOW(),
    accepted_at TIMESTAMP,
    UNIQUE(user_a, user_b)
);

-- MESSAGES TABLE
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    content_type message_type DEFAULT 'text',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- FOLLOWS TABLE (FRIENDS)
CREATE TABLE follows (
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    followed_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (follower_id, followed_id)
);

-- ROW LEVEL SECURITY
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE morning_faces ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = auth_id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = auth_id);

CREATE POLICY "Users can insert own morning faces" ON morning_faces FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Friends can see morning faces" ON morning_faces FOR SELECT USING (
    auth.uid() = user_id OR user_id IN (
        SELECT followed_id FROM follows WHERE follower_id = auth.uid()
        UNION SELECT follower_id FROM follows WHERE followed_id = auth.uid()
    )
);

CREATE POLICY "Everyone can read daily questions" ON daily_questions FOR SELECT USING (true);

CREATE POLICY "Users can insert own answers" ON answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Friends can see answers" ON answers FOR SELECT USING (
    auth.uid() = user_id OR user_id IN (
        SELECT followed_id FROM follows WHERE follower_id = auth.uid()
        UNION SELECT follower_id FROM follows WHERE followed_id = auth.uid()
    )
);

CREATE POLICY "Users can insert own reactions" ON reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reactions" ON reactions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Match participants can see matches" ON matches FOR SELECT USING (auth.uid() = user_a OR auth.uid() = user_b);
CREATE POLICY "Match participants can see messages" ON messages FOR SELECT USING (
    match_id IN (SELECT id FROM matches WHERE user_a = auth.uid() OR user_b = auth.uid())
);
CREATE POLICY "Match participants can insert messages" ON messages FOR INSERT WITH CHECK (
    match_id IN (SELECT id FROM matches WHERE user_a = auth.uid() OR user_b = auth.uid())
);

CREATE POLICY "Users can manage own follows" ON follows FOR ALL USING (auth.uid() = follower_id);

-- INDEXES
CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_morning_faces_user_id_created ON morning_faces(user_id, created_at DESC);
CREATE INDEX idx_answers_user_id_created ON answers(user_id, created_at DESC);
CREATE INDEX idx_matches_user_a_status ON matches(user_a, status);
CREATE INDEX idx_messages_match_id ON messages(match_id);

-- SEED DATA: 10 Daily Questions
INSERT INTO daily_questions (question_text, source_episode, date) VALUES
('Would you suck Jamie Lee Curtis''s big toe for a Klondike bar?', 'Bad Friends Ep 1', CURRENT_DATE),
('If you had unlimited money, would you buy Janice Joplin''s toenail?', 'Bad Friends Ep 2', CURRENT_DATE + 1),
('Would you rather fight one Bobby-Lee-sized ant or 100 ant-sized Bobby Lees?', 'Bad Friends Ep 3', CURRENT_DATE + 2),
('You find a scout ant carrying a cracker across your kitchen. Do you let it finish or make it start over?', 'Bad Friends Ep 4', CURRENT_DATE + 3),
('Rate your current tiredness as a weather forecast.', 'Bad Friends Ep 5', CURRENT_DATE + 4),
('What''s something you''re NOT going to feel guilty about today?', 'Bad Friends Ep 6', CURRENT_DATE + 5),
('How many ant traps belong on a fridge? Bobby says 93. Is that out of pocket?', 'Bad Friends Ep 7', CURRENT_DATE + 6),
('Are you a Fancy B or a Rudy in a group project?', 'Bad Friends Ep 8', CURRENT_DATE + 7),
('What''s the most overrated thing about breakfast tacos? Be specific.', 'Bad Friends Ep 9', CURRENT_DATE + 8),
('If your morning face was a movie title, what would it be?', 'Bad Friends Ep 10', CURRENT_DATE + 9);

-- TRIGGER: UPDATE UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- TRIGGER: UPDATE STREAK
CREATE OR REPLACE FUNCTION update_streak()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET streak_days = CASE 
        WHEN NEW.timestamp::DATE = (last_morning_face::DATE + INTERVAL '1 day')
        THEN streak_days + 1
        WHEN NEW.timestamp::DATE > last_morning_face::DATE + INTERVAL '1 day'
        THEN 1
        ELSE streak_days
    END,
    last_morning_face = NEW.timestamp
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_streak
    AFTER INSERT ON morning_faces
    FOR EACH ROW EXECUTE FUNCTION update_streak();

-- TRIGGER: UPDATE REACTION COUNTS
CREATE OR REPLACE FUNCTION update_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.target_type = 'morning_face' THEN
        IF NEW.reaction_type = 'bobo' THEN
            UPDATE morning_faces SET reaction_count_bobo = reaction_count_bobo + 1 WHERE id = NEW.target_id;
        ELSIF NEW.reaction_type = 'cheeto' THEN
            UPDATE morning_faces SET reaction_count_cheeto = reaction_count_cheeto + 1 WHERE id = NEW.target_id;
        ELSIF NEW.reaction_type = 'tiger' THEN
            UPDATE morning_faces SET reaction_count_tiger = reaction_count_tiger + 1 WHERE id = NEW.target_id;
        ELSIF NEW.reaction_type = 'dead' THEN
            UPDATE morning_faces SET reaction_count_dead = reaction_count_dead + 1 WHERE id = NEW.target_id;
        END IF;
    ELSIF NEW.target_type = 'answer' THEN
        IF NEW.reaction_type = 'bobo' THEN
            UPDATE answers SET reaction_count_bobo = reaction_count_bobo + 1 WHERE id = NEW.target_id;
        ELSIF NEW.reaction_type = 'cheeto' THEN
            UPDATE answers SET reaction_count_cheeto = reaction_count_cheeto + 1 WHERE id = NEW.target_id;
        ELSIF NEW.reaction_type = 'tiger' THEN
            UPDATE answers SET reaction_count_tiger = reaction_count_tiger + 1 WHERE id = NEW.target_id;
        ELSIF NEW.reaction_type = 'dead' THEN
            UPDATE answers SET reaction_count_dead = reaction_count_dead + 1 WHERE id = NEW.target_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_reaction_counts
    AFTER INSERT ON reactions
    FOR EACH ROW EXECUTE FUNCTION update_reaction_counts();
</details>
1.4 Create Storage Bucket
Click Storage (left sidebar)

Click Create a new bucket

Name: morning-faces

Toggle Public bucket ON

Click Create bucket

1.5 Set Storage Policies
In SQL Editor, run:

sql
CREATE POLICY "Users can upload their own morning faces"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'morning-faces');

CREATE POLICY "Anyone can view morning faces"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'morning-faces');
1.6 Enable Auth Providers
Authentication → Providers

Email: Toggle ON → Disable "Confirm email" for development

Phone: Toggle ON

Click Save

PHASE 2: BACKEND (FASTAPI)
Time: 2 hours

2.1 Create Backend Folder Structure
bash
cd ~/bad-friends-morning-face-build
mkdir -p backend/api backend/core backend/services backend/models backend/utils
cd backend
2.2 Create requirements.txt
bash
cat > requirements.txt << 'EOF'
fastapi
uvicorn[standard]
supabase
python-multipart
slowapi
python-dotenv
pydantic
httpx
EOF
2.3 Create .env File
bash
cat > .env << 'EOF'
SUPABASE_URL=https://valyrddwceszcuuytprn.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhbHlyZGR3Y2VzemN1dXl0cHJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTYyODQ1NSwiZXhwIjoyMDkxMjA0NDU1fQ.xbKZOLaTKrt5Kq6XynV0iby20mFC1zDf-op948MFwxI
EOF
Note: Replace the key with your actual service_role key from Supabase.

2.4 Create main.py (Complete Backend)
bash
cat > main.py << 'EOF'
from fastapi import FastAPI, Depends, HTTPException, Request, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from datetime import datetime, date, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

app = FastAPI(title="Bad Friends API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    user = supabase.auth.get_user(token)
    if not user.user:
        raise HTTPException(status_code=401, detail="Invalid token")
    result = supabase.table("users").select("*").eq("auth_id", user.user.id).execute()
    if not result.data:
        new_user = {
            "auth_id": user.user.id,
            "email": user.user.email,
            "phone": user.user.phone,
            "trust_level": 1,
            "streak_days": 0
        }
        insert_result = supabase.table("users").insert(new_user).execute()
        return insert_result.data[0]
    return result.data[0]

@app.get("/")
@app.get("/status")
async def root():
    return {"status": "healthy", "version": "1.0.0", "timestamp": datetime.now().isoformat()}

@app.post("/auth/register")
async def register(email: str = Form(...), password: str = Form(...), phone: str = Form(...), gender: str = Form(...), name: str = Form(None)):
    auth_response = supabase.auth.sign_up({
        "email": email,
        "password": password,
        "phone": phone,
        "data": {"name": name, "gender": gender}
    })
    if not auth_response.user:
        raise HTTPException(status_code=400, detail="Registration failed")
    user_data = {
        "auth_id": auth_response.user.id,
        "email": email,
        "phone": phone,
        "name": name,
        "gender": gender
    }
    supabase.table("users").insert(user_data).execute()
    return {"success": True, "message": "Registration successful"}

@app.post("/auth/login")
async def login(email: str = Form(...), password: str = Form(...)):
    auth_response = supabase.auth.sign_in_with_password({"email": email, "password": password})
    if not auth_response.user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user_result = supabase.table("users").select("*").eq("auth_id", auth_response.user.id).execute()
    return {
        "success": True,
        "token": auth_response.session.access_token,
        "user": user_result.data[0] if user_result.data else None
    }

@app.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    return {"success": True, "profile": current_user}

@app.post("/morning-face")
async def upload_morning_face(image_url: str = Form(...), timestamp: str = Form(...), current_user: dict = Depends(get_current_user)):
    today = datetime.now().date()
    existing = supabase.table("morning_faces").select("*").eq("user_id", current_user["id"]).gte("timestamp", today.isoformat()).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Already uploaded today")
    face_data = {"user_id": current_user["id"], "image_url": image_url, "timestamp": timestamp}
    result = supabase.table("morning_faces").insert(face_data).execute()
    user_result = supabase.table("users").select("streak_days").eq("id", current_user["id"]).execute()
    return {"success": True, "face_id": result.data[0]["id"], "streak_days": user_result.data[0]["streak_days"] if user_result.data else 0}

@app.get("/morning-face/feed")
async def get_morning_face_feed(limit: int = 20, current_user: dict = Depends(get_current_user)):
    today = datetime.now().date()
    friends_result = supabase.table("follows").select("followed_id").eq("follower_id", current_user["id"]).execute()
    friend_ids = [f["followed_id"] for f in friends_result.data] + [current_user["id"]]
    if not friend_ids:
        return {"success": True, "faces": []}
    result = supabase.table("morning_faces").select("*, users!inner(name)").in_("user_id", friend_ids).gte("timestamp", today.isoformat()).order("created_at", desc=True).limit(limit).execute()
    return {"success": True, "faces": result.data}

@app.get("/questions/today")
async def get_today_question(current_user: dict = Depends(get_current_user)):
    today = datetime.now().date()
    question_result = supabase.table("daily_questions").select("*").eq("date", today.isoformat()).execute()
    if not question_result.data:
        question_result = supabase.table("daily_questions").select("*").limit(1).execute()
    question = question_result.data[0]
    answer_result = supabase.table("answers").select("id").eq("user_id", current_user["id"]).eq("question_id", question["id"]).execute()
    return {"success": True, "question": {"id": question["id"], "question_text": question["question_text"], "date": question["date"], "has_answered": len(answer_result.data) > 0}}

@app.post("/questions/answer")
async def submit_answer(question_id: str = Form(...), answer_text: str = Form(...), current_user: dict = Depends(get_current_user)):
    existing = supabase.table("answers").select("*").eq("user_id", current_user["id"]).eq("question_id", question_id).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Already answered")
    answer_data = {"user_id": current_user["id"], "question_id": question_id, "answer_text": answer_text}
    result = supabase.table("answers").insert(answer_data).execute()
    return {"success": True, "answer_id": result.data[0]["id"]}

@app.get("/questions/feed")
async def get_answer_feed(limit: int = 20, current_user: dict = Depends(get_current_user)):
    friends_result = supabase.table("follows").select("followed_id").eq("follower_id", current_user["id"]).execute()
    friend_ids = [f["followed_id"] for f in friends_result.data] + [current_user["id"]]
    if not friend_ids:
        return {"success": True, "answers": []}
    today = datetime.now().date()
    question_result = supabase.table("daily_questions").select("id").eq("date", today.isoformat()).execute()
    if not question_result.data:
        return {"success": True, "answers": []}
    result = supabase.table("answers").select("*, users!inner(name)").eq("question_id", question_result.data[0]["id"]).in_("user_id", friend_ids).order("created_at", desc=True).limit(limit).execute()
    return {"success": True, "answers": result.data}

@app.post("/reactions")
async def add_reaction(target_type: str = Form(...), target_id: str = Form(...), reaction_type: str = Form(...), current_user: dict = Depends(get_current_user)):
    existing = supabase.table("reactions").select("*").eq("user_id", current_user["id"]).eq("target_type", target_type).eq("target_id", target_id).execute()
    if existing.data:
        supabase.table("reactions").delete().eq("id", existing.data[0]["id"]).execute()
    reaction_data = {"user_id": current_user["id"], "target_type": target_type, "target_id": target_id, "reaction_type": reaction_type}
    result = supabase.table("reactions").insert(reaction_data).execute()
    return {"success": True, "reaction_id": result.data[0]["id"]}

# Placeholder endpoints for Day 4
@app.get("/matches/discover")
async def discover_matches(current_user: dict = Depends(get_current_user)):
    return {"success": True, "candidates": []}

@app.post("/matches/like")
async def like_user(target_user_id: str = Form(...), current_user: dict = Depends(get_current_user)):
    return {"success": True, "mutual": False}

@app.get("/matches")
async def get_matches(current_user: dict = Depends(get_current_user)):
    return {"success": True, "matches": []}

@app.post("/messages")
async def send_message(match_id: str = Form(...), content: str = Form(...), current_user: dict = Depends(get_current_user)):
    return {"success": True}

@app.get("/messages/{match_id}")
async def get_messages(match_id: str, current_user: dict = Depends(get_current_user)):
    return {"success": True, "messages": []}
EOF
2.5 Install Dependencies
bash
pip3 install -r requirements.txt --break-system-packages
2.6 Fix Version Conflicts (If Needed)
If you get errors, run:

bash
pip3 uninstall supabase gotrue httpx -y
pip3 install httpx==0.27.0 --break-system-packages
pip3 install gotrue==2.11.0 --break-system-packages
pip3 install supabase==2.11.0 --break-system-packages
2.7 Start Backend Server
bash
python3 -m uvicorn main:app --reload --port 8000
Keep this terminal running.

2.8 Verify Backend
Open browser to:

http://localhost:8000 → Should show {"status":"healthy","version":"1.0.0"}

http://localhost:8000/docs → Should show FastAPI Swagger UI

PHASE 3: FRONTEND FOUNDATION (REACT + VITE)
Time: 1.5 hours

Open a new terminal (keep backend running).

3.1 Create React App
bash
cd ~/bad-friends-morning-face-build
npm create vite@latest frontend -- --template react
cd frontend
3.2 Install Dependencies
bash
npm install
npm install @supabase/supabase-js axios react-router-dom
npm install -D tailwindcss@3 postcss autoprefixer
3.3 Configure Tailwind CSS
bash
npx tailwindcss init -p
Replace tailwind.config.js:

bash
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'badfriends-bg': '#0a0e1a',
        'badfriends-card': '#111827',
        'badfriends-border': '#1e3a5f',
        'bobo': '#f59e0b',
        'cheeto': '#ef4444',
        'tiger': '#10b981',
        'dead': '#a855f7',
      }
    },
  },
  plugins: [],
}
EOF
Replace src/index.css:

bash
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #0a0e1a;
  color: #f0f4f8;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
EOF
3.4 Create Frontend .env
bash
cat > .env << 'EOF'
VITE_SUPABASE_URL=https://valyrddwceszcuuytprn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhbHlyZGR3Y2VzemN1dXl0cHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2Mjg0NTUsImV4cCI6MjA5MTIwNDQ1NX0.mPJfJPvIbUAQvNzsuFrqZSy8H8NPsDA_LiGc1xxCRlk
VITE_API_URL=http://localhost:8000
EOF
3.5 Create Supabase Client
bash
mkdir -p src/utils
bash
cat > src/utils/supabaseClient.js << 'EOF'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
EOF
3.6 Start Frontend
bash
npm run dev
Keep this terminal running.

3.7 Verify Frontend
Open browser to http://localhost:5173 → Should see Vite + React default page.

PHASE 4: AUTHENTICATION SYSTEM
Time: 2 hours

4.1 Create AuthContext
bash
mkdir -p src/contexts
bash
cat > src/contexts/AuthContext.jsx << 'EOF'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const register = async (email, password, phone, gender, name) => {
    const { data, error } = await supabase.auth.signUp({
      email, password, phone,
      options: { data: { name, gender } }
    })
    if (error) throw error
    return data
  }

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
EOF
4.2 Create Register Screen
bash
mkdir -p src/screens
bash
cat > src/screens/RegisterScreen.jsx << 'EOF'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

function RegisterScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [gender, setGender] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(email, password, phone, gender, name)
      alert('Registration successful! Please check your email to confirm.')
      setEmail('')
      setPassword('')
      setPhone('')
      setName('')
      setGender('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-badfriends-bg flex items-center justify-center p-4">
      <div className="bg-badfriends-card rounded-xl p-8 w-full max-w-md border border-badfriends-border">
        <h1 className="text-3xl font-bold text-white text-center mb-6">🍜 Join Bad Friends</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 mb-4">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a1f2e] border border-badfriends-border rounded-lg text-white focus:outline-none focus:border-cheeto"
            required
          />
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a1f2e] border border-badfriends-border rounded-lg text-white focus:outline-none focus:border-cheeto"
            required
          />
          
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a1f2e] border border-badfriends-border rounded-lg text-white focus:outline-none focus:border-cheeto"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a1f2e] border border-badfriends-border rounded-lg text-white focus:outline-none focus:border-cheeto"
            required
          />
          
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a1f2e] border border-badfriends-border rounded-lg text-white focus:outline-none focus:border-cheeto"
            required
          >
            <option value="">Select Gender</option>
            <option value="woman">Woman</option>
            <option value="man">Man</option>
            <option value="non_binary">Non-binary</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-cheeto text-white font-semibold rounded-lg hover:bg-red-600 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        
        <p className="text-center text-gray-400 mt-4">
          Already have an account? <a href="/login" className="text-cheeto hover:underline">Login</a>
        </p>
      </div>
    </div>
  )
}

export default RegisterScreen
EOF
4.3 Create Login Screen
bash
cat > src/screens/LoginScreen.jsx << 'EOF'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      window.location.href = '/'
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-badfriends-bg flex items-center justify-center p-4">
      <div className="bg-badfriends-card rounded-xl p-8 w-full max-w-md border border-badfriends-border">
        <h1 className="text-3xl font-bold text-white text-center mb-6">🍜 Welcome Back</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 mb-4">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a1f2e] border border-badfriends-border rounded-lg text-white focus:outline-none focus:border-cheeto"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a1f2e] border border-badfriends-border rounded-lg text-white focus:outline-none focus:border-cheeto"
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-cheeto text-white font-semibold rounded-lg hover:bg-red-600 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="text-center text-gray-400 mt-4">
          Don't have an account? <a href="/register" className="text-cheeto hover:underline">Register</a>
        </p>
      </div>
    </div>
  )
}

export default LoginScreen
EOF
4.4 Create Main App with Routes
bash
cat > src/App.jsx << 'EOF'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth, AuthProvider } from './contexts/AuthContext'
import { supabase } from './utils/supabaseClient'
import RegisterScreen from './screens/RegisterScreen'
import LoginScreen from './screens/LoginScreen'

function HomeScreen() {
  const [streak, setStreak] = useState(0)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const response = await fetch('http://localhost:8000/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setStreak(data.profile.streak_days || 0)
        setUserName(data.profile.name || data.profile.email?.split('@')[0] || 'Friend')
      }
    }
    fetchProfile()
  }, [])

  return (
    <div className="min-h-screen bg-badfriends-bg p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">🍜 Bad Friends</h1>
          <p className="text-gray-400">Morning faces. Bad jokes. Real matches.</p>
          {streak > 0 && (
            <div className="inline-block mt-2 px-3 py-1 bg-cheeto/20 border border-cheeto rounded-full">
              <span className="text-cheeto text-sm font-semibold">🔥 {streak} day streak</span>
            </div>
          )}
        </div>
        
        <div className="text-center mt-6">
          <button 
            onClick={() => supabase.auth.signOut()}
            className="text-gray-500 text-sm hover:text-gray-400 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-badfriends-bg flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/register" element={!user ? <RegisterScreen /> : <Navigate to="/" />} />
      <Route path="/login" element={!user ? <LoginScreen /> : <Navigate to="/" />} />
      <Route path="/" element={user ? <HomeScreen /> : <Navigate to="/login" />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
EOF
4.5 Test Authentication
Go to http://localhost:5173/register

Create an account

Check email for confirmation (Supabase sends one)

After confirming, go to http://localhost:5173/login

Log in

You should see welcome screen with your name and streak

PHASE 5: MORNING FACE CAMERA UPLOAD
Time: 2 hours

5.1 Create useCamera Hook
bash
mkdir -p src/hooks
bash
cat > src/hooks/useCamera.js << 'EOF'
import { useState, useRef, useCallback } from 'react'

export const useCamera = () => {
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const videoRef = useRef(null)

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true)
        }
      }
      return mediaStream
    } catch (err) {
      setError(err.message)
      return null
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setIsCameraReady(false)
    }
  }, [stream])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !isCameraReady) return null
    
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    
    return canvas.toDataURL('image/jpeg', 0.8)
  }, [isCameraReady])

  return {
    videoRef,
    stream,
    error,
    isCameraReady,
    startCamera,
    stopCamera,
    capturePhoto
  }
}
EOF
5.2 Create MorningFaceCapture Component
bash
mkdir -p src/components
bash
cat > src/components/MorningFaceCapture.jsx << 'EOF'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../utils/supabaseClient'

function MorningFaceCapture({ onUploadComplete, currentStreak }) {
  const [step, setStep] = useState('camera')
  const [capturedImage, setCapturedImage] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [streak, setStreak] = useState(currentStreak || 0)
  const [cameraReady, setCameraReady] = useState(false)
  
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    let mounted = true

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }
        })
        
        if (!mounted) return
        
        streamRef.current = mediaStream
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          videoRef.current.onloadedmetadata = () => {
            if (mounted) setCameraReady(true)
          }
        }
      } catch (err) {
        if (mounted) setError('Could not access camera. Please allow camera permissions.')
      }
    }

    startCamera()

    return () => {
      mounted = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const capturePhoto = () => {
    if (!videoRef.current || !cameraReady) return null
    
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    return canvas.toDataURL('image/jpeg', 0.8)
  }

  const handleCapture = () => {
    const photo = capturePhoto()
    if (photo) {
      setCapturedImage(photo)
      setStep('preview')
      setCameraReady(false)
    }
  }

  const handleRetake = () => {
    setCapturedImage(null)
    setStep('camera')
    setError(null)
    setCameraReady(false)
    
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' }
    }).then(mediaStream => {
      streamRef.current = mediaStream
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.onloadedmetadata = () => setCameraReady(true)
      }
    }).catch(err => {
      setError('Could not access camera. Please allow camera permissions.')
    })
  }

  const handleUpload = async () => {
    if (!capturedImage) return
    
    setUploading(true)
    setError(null)
    
    try {
      const blob = await fetch(capturedImage).then(res => res.blob())
      const filePath = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`
      const file = new File([blob], filePath, { type: 'image/jpeg' })
      
      const { error: storageError } = await supabase.storage
        .from('morning-faces')
        .upload(filePath, file)
      
      if (storageError) throw storageError
      
      const { data: { publicUrl } } = supabase.storage
        .from('morning-faces')
        .getPublicUrl(filePath)
      
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const response = await fetch('http://localhost:8000/morning-face', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          image_url: publicUrl,
          timestamp: new Date().toISOString()
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Upload failed')
      }
      
      const result = await response.json()
      setStreak(result.streak_days)
      setStep('camera')
      setCapturedImage(null)
      onUploadComplete(result.streak_days)
      
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  if (step === 'camera') {
    return (
      <div className="bg-badfriends-card rounded-xl overflow-hidden border border-badfriends-border">
        <div className="relative bg-black" style={{ minHeight: '300px' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto object-cover"
            style={{ minHeight: '300px' }}
          />
          {!cameraReady && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <div className="text-white">Starting camera...</div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <div className="text-red-500 text-center p-4">{error}</div>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <p className="text-gray-400 text-sm text-center mb-4">
            No makeup. No filters. No good lighting.
            Just you, fresh from bed.
          </p>
          
          <button
            onClick={handleCapture}
            disabled={!cameraReady}
            className="w-full py-3 bg-cheeto text-white font-semibold rounded-lg hover:bg-red-600 transition disabled:opacity-50"
          >
            📸 Take Morning Face
          </button>
        </div>
      </div>
    )
  }

  if (step === 'preview') {
    return (
      <div className="bg-badfriends-card rounded-xl overflow-hidden border border-badfriends-border">
        <div className="bg-black flex items-center justify-center" style={{ minHeight: '300px' }}>
          <img src={capturedImage} alt="Preview" className="w-full h-auto object-cover" />
        </div>
        
        <div className="p-4 space-y-3">
          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={handleRetake}
              disabled={uploading}
              className="flex-1 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
            >
              Retake
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 py-3 bg-cheeto text-white font-semibold rounded-lg hover:bg-red-600 transition"
            >
              {uploading ? 'Uploading...' : 'Upload ✓'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default MorningFaceCapture
EOF
5.3 Update HomeScreen to Include Camera
Update src/App.jsx - add import and component:

bash
cat > src/App.jsx << 'EOF'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth, AuthProvider } from './contexts/AuthContext'
import { supabase } from './utils/supabaseClient'
import RegisterScreen from './screens/RegisterScreen'
import LoginScreen from './screens/LoginScreen'
import MorningFaceCapture from './components/MorningFaceCapture'
import { useState, useEffect } from 'react'

function HomeScreen() {
  const [streak, setStreak] = useState(0)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const response = await fetch('http://localhost:8000/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setStreak(data.profile.streak_days || 0)
        setUserName(data.profile.name || data.profile.email?.split('@')[0] || 'Friend')
      }
    }
    fetchProfile()
  }, [])

  const handleUploadComplete = (newStreak) => {
    setStreak(newStreak)
  }

  return (
    <div className="min-h-screen bg-badfriends-bg p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">🍜 Bad Friends</h1>
          <p className="text-gray-400">Morning faces. Bad jokes. Real matches.</p>
          {streak > 0 && (
            <div className="inline-block mt-2 px-3 py-1 bg-cheeto/20 border border-cheeto rounded-full">
              <span className="text-cheeto text-sm font-semibold">🔥 {streak} day streak</span>
            </div>
          )}
        </div>
        
        <MorningFaceCapture 
          onUploadComplete={handleUploadComplete}
          currentStreak={streak}
        />
        
        <div className="text-center mt-6">
          <button 
            onClick={() => supabase.auth.signOut()}
            className="text-gray-500 text-sm hover:text-gray-400 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-badfriends-bg flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/register" element={!user ? <RegisterScreen /> : <Navigate to="/" />} />
      <Route path="/login" element={!user ? <LoginScreen /> : <Navigate to="/" />} />
      <Route path="/" element={user ? <HomeScreen /> : <Navigate to="/login" />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
EOF
5.4 Test Morning Face Upload
Login

Allow camera access

Take a photo

Click Upload

Check Supabase Storage → morning-faces bucket for the image

Check morning_faces table in Table Editor for the record

PHASE 6: DAILY QUESTIONS & ANSWERS
Time: 2 hours

6.1 Add Today's Question to HomeScreen
Add state and fetch function to HomeScreen in src/App.jsx:

javascript
const [todayQuestion, setTodayQuestion] = useState(null)
const [answer, setAnswer] = useState('')
const [hasAnswered, setHasAnswered] = useState(false)

useEffect(() => {
  fetchTodayQuestion()
}, [])

const fetchTodayQuestion = async () => {
  const token = (await supabase.auth.getSession()).data.session?.access_token
  const response = await fetch('http://localhost:8000/questions/today', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const data = await response.json()
  if (data.success) {
    setTodayQuestion(data.question)
    setHasAnswered(data.question.has_answered)
  }
}

const submitAnswer = async () => {
  const token = (await supabase.auth.getSession()).data.session?.access_token
  await fetch('http://localhost:8000/questions/answer', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      question_id: todayQuestion.id,
      answer_text: answer
    })
  })
  setHasAnswered(true)
  setAnswer('')
  fetchTodayQuestion() // Refresh to show answered state
}
6.2 Add Question UI to HomeScreen
Add after the MorningFaceCapture component:

jsx
{todayQuestion && !hasAnswered && (
  <div className="bg-badfriends-card rounded-xl p-4 border border-badfriends-border mt-4">
    <h3 className="text-white font-bold mb-2">Today's Question</h3>
    <p className="text-gray-300 mb-3">{todayQuestion.question_text}</p>
    <textarea
      value={answer}
      onChange={(e) => setAnswer(e.target.value)}
      placeholder="Write your answer..."
      className="w-full p-3 bg-[#1a1f2e] rounded-lg text-white"
      rows="3"
    />
    <button onClick={submitAnswer} className="mt-3 w-full py-2 bg-cheeto rounded-lg text-white font-semibold">
      Post Answer
    </button>
  </div>
)}

{todayQuestion && hasAnswered && (
  <div className="bg-green-500/10 border border-green-500 rounded-xl p-4 mt-4 text-center">
    <p className="text-green-500">✓ You answered today's question!</p>
    <p className="text-gray-400 text-sm mt-1">Come back tomorrow for a new question.</p>
  </div>
)}
PHASE 7: FEED & REACTIONS
Time: 2 hours

7.1 Create Feed Component
bash
cat > src/components/Feed.jsx << 'EOF'
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

function Feed() {
  const [activeTab, setActiveTab] = useState('morning_faces')
  const [morningFaces, setMorningFaces] = useState([])
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeed()
  }, [activeTab])

  const fetchFeed = async () => {
    setLoading(true)
    const token = (await supabase.auth.getSession()).data.session?.access_token
    
    if (activeTab === 'morning_faces') {
      const response = await fetch('http://localhost:8000/morning-face/feed', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) setMorningFaces(data.faces)
    } else if (activeTab === 'answers') {
      const response = await fetch('http://localhost:8000/questions/feed', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) setAnswers(data.answers)
    }
    setLoading(false)
  }

  const addReaction = async (targetType, targetId, reactionType) => {
    const token = (await supabase.auth.getSession()).data.session?.access_token
    await fetch('http://localhost:8000/reactions', {
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
    })
    fetchFeed() // Refresh
  }

  const reactions = [
    { type: 'bobo', emoji: '🍜', color: 'text-yellow-500', label: 'Bobo' },
    { type: 'cheeto', emoji: '🔥', color: 'text-red-500', label: 'Cheeto' },
    { type: 'tiger', emoji: '🐯', color: 'text-green-500', label: 'Tiger' },
    { type: 'dead', emoji: '💀', color: 'text-purple-500', label: 'Dead' }
  ]

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('morning_faces')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeTab === 'morning_faces' 
              ? 'bg-cheeto text-white' 
              : 'bg-badfriends-card text-gray-400 hover:text-white'
          }`}
        >
          Morning Faces
        </button>
        <button
          onClick={() => setActiveTab('answers')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeTab === 'answers' 
              ? 'bg-cheeto text-white' 
              : 'bg-badfriends-card text-gray-400 hover:text-white'
          }`}
        >
          Answers
        </button>
      </div>

      {loading && <div className="text-center text-gray-400 py-8">Loading...</div>}

      {activeTab === 'morning_faces' && morningFaces.map((face) => (
        <div key={face.id} className="bg-badfriends-card rounded-xl p-4 mb-4 border border-badfriends-border">
          <p className="text-white font-semibold">@{face.users?.name || 'Unknown'}</p>
          <img src={face.image_url} alt="Morning face" className="w-full rounded-lg my-3" />
          <div className="flex gap-4">
            {reactions.map((r) => (
              <button
                key={r.type}
                onClick={() => addReaction('morning_face', face.id, r.type)}
                className={`${r.color} hover:opacity-70 transition`}
              >
                {r.emoji} {face[`reaction_count_${r.type}`] || 0}
              </button>
            ))}
          </div>
        </div>
      ))}

      {activeTab === 'answers' && answers.map((answer) => (
        <div key={answer.id} className="bg-badfriends-card rounded-xl p-4 mb-4 border border-badfriends-border">
          <p className="text-white font-semibold">@{answer.users?.name || 'Unknown'}</p>
          <p className="text-gray-300 my-2">"{answer.answer_text}"</p>
          {answer.cmi_score && <p className="text-xs text-gray-500">CMI: {answer.cmi_score}</p>}
          <div className="flex gap-4 mt-3">
            {reactions.map((r) => (
              <button
                key={r.type}
                onClick={() => addReaction('answer', answer.id, r.type)}
                className={`${r.color} hover:opacity-70 transition`}
              >
                {r.emoji} {answer[`reaction_count_${r.type}`] || 0}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Feed
EOF
7.2 Add Feed to HomeScreen
Add Feed component to src/App.jsx (after the question section):

jsx
import Feed from './components/Feed'

// Inside HomeScreen, after the question section:
<Feed />
PHASE 8: DISCOVER & MATCHING
Time: 3 hours

8.1 Create Discover Screen
bash
cat > src/screens/DiscoverScreen.jsx << 'EOF'
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

function DiscoverScreen() {
  const [candidates, setCandidates] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [ratedCount, setRatedCount] = useState(0)
  const [showFace, setShowFace] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    setLoading(true)
    const token = (await supabase.auth.getSession()).data.session?.access_token
    const response = await fetch('http://localhost:8000/matches/discover', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    if (data.success) {
      setCandidates(data.candidates)
      setCurrentIndex(0)
    }
    setLoading(false)
  }

  const rateAnswer = async (candidateId, isWorstFriend) => {
    if (isWorstFriend) {
      const token = (await supabase.auth.getSession()).data.session?.access_token
      await fetch('http://localhost:8000/reactions', {
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
      })
    }
    
    const newRatedCount = ratedCount + 1
    setRatedCount(newRatedCount)
    
    if (newRatedCount >= 10 && !showFace) {
      setShowFace(true)
    }
    
    setCurrentIndex(prev => prev + 1)
  }

  const likeUser = async (userId) => {
    const token = (await supabase.auth.getSession()).data.session?.access_token
    const response = await fetch('http://localhost:8000/matches/like', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ target_user_id: userId })
    })
    const data = await response.json()
    if (data.mutual) {
      alert(`It's a match! ${data.comedy_match_report || 'Start chatting!'}`)
    }
    setCurrentIndex(prev => prev + 1)
  }

  const currentCandidate = candidates[currentIndex]

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Loading matches...</div>
  }

  if (!currentCandidate) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No more candidates right now.</p>
        <button onClick={fetchCandidates} className="mt-4 px-4 py-2 bg-cheeto rounded-lg">Refresh</button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-badfriends-card rounded-xl p-6 border border-badfriends-border">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-400">@{currentCandidate.user_name}</p>
          <p className="text-cheeto font-bold">CMI: {currentCandidate.cmi_score}</p>
        </div>
        
        <div className="bg-[#1a1f2e] rounded-lg p-4 mb-4">
          <p className="text-white text-lg">"{currentCandidate.answer_text}"</p>
        </div>
        
        {currentCandidate.past_funny_answers && (
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-2">Past bangers:</p>
            {currentCandidate.past_funny_answers.slice(0, 2).map((answer, i) => (
              <p key={i} className="text-gray-500 text-sm italic">• {answer}</p>
            ))}
          </div>
        )}
        
        {showFace && currentCandidate.morning_face_url && (
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-2">Morning face:</p>
            <img src={currentCandidate.morning_face_url} alt="Morning face" className="rounded-lg w-full" />
          </div>
        )}
        
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => rateAnswer(currentCandidate.answer_id, true)}
            className="flex-1 py-3 bg-dead text-white font-semibold rounded-lg hover:bg-purple-600 transition"
          >
            💀 Worst Friend
          </button>
          <button
            onClick={() => rateAnswer(currentCandidate.answer_id, false)}
            className="flex-1 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
          >
            Skip
          </button>
        </div>
        
        {showFace && (
          <button
            onClick={() => likeUser(currentCandidate.user_id)}
            className="w-full mt-3 py-3 bg-cheeto text-white font-semibold rounded-lg hover:bg-red-600 transition"
          >
            ❤️ Like
          </button>
        )}
      </div>
      
      <div className="mt-4">
        <div className="bg-badfriends-card rounded-lg p-3">
          <p className="text-gray-400 text-sm">
            Rated {ratedCount} answers. {showFace ? 'Faces unlocked!' : `${10 - ratedCount} more to unlock faces.`}
          </p>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div className="bg-cheeto h-2 rounded-full" style={{ width: `${(ratedCount / 10) * 100}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiscoverScreen
EOF
8.2 Add Discover Route to App.jsx
Update src/App.jsx:

jsx
import DiscoverScreen from './screens/DiscoverScreen'

// Add to Routes:
<Route path="/discover" element={user ? <DiscoverScreen /> : <Navigate to="/login" />} />
8.3 Create Matches Screen
bash
cat > src/screens/MatchesScreen.jsx << 'EOF'
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

function MatchesScreen() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    const token = (await supabase.auth.getSession()).data.session?.access_token
    const response = await fetch('http://localhost:8000/matches', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    if (data.success) setMatches(data.matches)
    setLoading(false)
  }

  if (loading) return <div className="text-center text-gray-400 py-8">Loading matches...</div>

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Your Matches</h1>
      {matches.length === 0 && (
        <p className="text-gray-400 text-center py-8">No matches yet. Keep swiping!</p>
      )}
      {matches.map((match) => (
        <div key={match.id} className="bg-badfriends-card rounded-xl p-4 mb-4 border border-badfriends-border">
          <div className="flex items-center gap-3">
            <img src={match.user.morning_face_url} alt="Match" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <p className="text-white font-semibold">@{match.user.name}</p>
              <p className="text-gray-400 text-sm">Matched {new Date(match.matched_at).toLocaleDateString()}</p>
            </div>
            <button className="ml-auto px-4 py-2 bg-cheeto rounded-lg text-white">
              Chat
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MatchesScreen
EOF
PHASE 9: CHAT MESSAGING
Time: 2 hours

9.1 Create Chat Screen
bash
cat > src/screens/ChatScreen.jsx << 'EOF'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'

function ChatScreen() {
  const { matchId } = useParams()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchMessages()
    
    const subscription = supabase
      .channel(`messages:${matchId}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchId}` },
        (payload) => setMessages(prev => [...prev, payload.new])
      )
      .subscribe()
    
    return () => subscription.unsubscribe()
  }, [matchId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async () => {
    const token = (await supabase.auth.getSession()).data.session?.access_token
    const response = await fetch(`http://localhost:8000/messages/${matchId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    if (data.success) setMessages(data.messages)
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return
    
    setSending(true)
    const token = (await supabase.auth.getSession()).data.session?.access_token
    await fetch('http://localhost:8000/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        match_id: matchId,
        content: newMessage
      })
    })
    setNewMessage('')
    setSending(false)
  }

  const currentUser = supabase.auth.getUser()

  return (
    <div className="flex flex-col h-screen bg-badfriends-bg">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender_id === currentUser.data.user?.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-lg ${
              msg.sender_id === currentUser.data.user?.id 
                ? 'bg-cheeto text-white' 
                : 'bg-badfriends-card text-gray-200'
            }`}>
              <p>{msg.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(msg.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-badfriends-card border-t border-badfriends-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-[#1a1f2e] rounded-lg text-white focus:outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={sending}
            className="px-4 py-2 bg-cheeto rounded-lg text-white font-semibold disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatScreen
EOF
9.2 Add Chat Route to App.jsx
jsx
import ChatScreen from './screens/ChatScreen'

// Add to Routes:
<Route path="/chat/:matchId" element={user ? <ChatScreen /> : <Navigate to="/login" />} />
PHASE 10: DEPLOYMENT
Time: 2 hours

10.1 Prepare Backend for Production
Update backend/main.py CORS:

python
allow_origins=[
    "http://localhost:5173",
    "https://bad-friends.netlify.app"  # Your Netlify URL
]
Create backend/Procfile:

bash
cd ~/bad-friends-morning-face-build/backend
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile
10.2 Deploy Backend to Render
Push code to GitHub

Go to https://render.com

New + → Web Service

Connect your GitHub repository

Settings:

Name: bad-friends-api

Environment: Python

Build Command: pip install -r requirements.txt

Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT

Add environment variables (same as your .env file)

Click Create Web Service

10.3 Deploy Frontend to Netlify
Push code to GitHub

Go to https://netlify.com

Add new site → Import an existing project

Connect to GitHub

Select bad-friends-morning-face-build/frontend

Build settings:

Build command: npm run build

Publish directory: dist

Add environment variables:

VITE_SUPABASE_URL

VITE_SUPABASE_ANON_KEY

VITE_API_URL (your Render backend URL)

Click Deploy site

10.4 Set Up UptimeRobot (Prevent Cold Starts)
Go to https://uptimerobot.com

Add New Monitor

Type: HTTP(S)

URL: https://bad-friends-api.onrender.com/status

Monitoring Interval: 10 minutes

Click Create Monitor

TROUBLESHOOTING GUIDE
Backend Won't Start
Error	Solution
ModuleNotFoundError	Run pip3 install -r requirements.txt --break-system-packages
Invalid API key	Use legacy keys (anon/service_role), not sb_publishable/sb_secret
TypeError: Client.__init__() got an unexpected keyword argument 'proxy'	Run: pip3 uninstall supabase gotrue httpx -y then pip3 install httpx==0.27.0 gotrue==2.11.0 supabase==2.11.0 --break-system-packages
Port already in use	Change port: --port 8001
Frontend Won't Start
Error	Solution
Failed to resolve import	Check file paths are correct
Tailwind CSS error	Run npm install -D tailwindcss@3 postcss autoprefixer then npx tailwindcss init -p
CORS error	Check backend allow_origins includes http://localhost:5173
Camera Issues
Problem	Solution
Camera flickering	Use the stabilized useCamera hook from Phase 5
Camera not starting	Check browser permissions. Must be HTTPS or localhost
Upload fails	Check Supabase Storage bucket is public and policies are set
Supabase Issues
Problem	Solution
Tables not created	Run the SQL schema again in SQL Editor
RLS blocking access	Check policies are created correctly
Storage upload fails	Run the storage policies SQL
COMPLETE FILE STRUCTURE (After All Phases)
text
bad-friends-morning-face-build/
├── backend/
│   ├── main.py
│   ├── .env
│   ├── requirements.txt
│   └── Procfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── screens/
│   │   │   ├── RegisterScreen.jsx
│   │   │   ├── LoginScreen.jsx
│   │   │   ├── DiscoverScreen.jsx
│   │   │   ├── MatchesScreen.jsx
│   │   │   └── ChatScreen.jsx
│   │   ├── components/
│   │   │   ├── MorningFaceCapture.jsx
│   │   │   └── Feed.jsx
│   │   ├── hooks/
│   │   │   └── useCamera.js
│   │   └── utils/
│   │       └── supabaseClient.js
│   ├── .env
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── index.html
├── docs/
│   ├── architecture.md
│   ├── context.md
│   ├── roadmap.md
│   └── wireframe.md
├── .gitignore
└── README.md
LAUNCH CHECKLIST
text
Pre-Launch Testing:

[ ] Backend running on Render
[ ] Frontend running on Netlify
[ ] Registration works
[ ] Login works
[ ] Morning face upload works
[ ] Camera access works
[ ] Daily question displays
[ ] Answer submission works
[ ] Feed shows friends' content
[ ] Reactions work (🍜🔥🐯💀)
[ ] Discover shows other users
[ ] Rating 10 answers unlocks faces
[ ] Like creates pending match
[ ] Mutual like creates match
[ ] Chat works real-time
[ ] Logout works

Launch Day:

[ ] Share Netlify URL with beta users
[ ] Collect feedback
[ ] Fix critical bugs
[ ] Announce on social media
[ ] Monitor Supabase usage
[ ] Check Render logs

Post-Launch:

[ ] Add ID verification (Phase 1.1)
[ ] Add voice notes (Phase 2)
[ ] Add location features (Phase 2)
[ ] Implement CMI algorithm (Phase 3)
[ ] Add monetization (Phase 5)
