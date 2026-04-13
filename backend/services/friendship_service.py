# backend/services/friendship_service.py
# COMPLETE REWRITE - SYNC VERSION (no async)
# All Supabase calls are synchronous - no async/await confusion

from supabase import create_client
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Validate environment variables
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


class FriendshipService:
    """
    Complete friendship layer management - SYNC VERSION
    All methods are synchronous (no async/await)
    """
    
    # =====================================================
    # LAYER 1: FOLLOWS (Friends)
    # =====================================================
    
    def follow(self, follower_id: str, followed_id: str):
        """Follow a user"""
        # Check if already following
        existing = supabase.table("follows")\
            .select("*")\
            .eq("follower_id", follower_id)\
            .eq("followed_id", followed_id)\
            .execute()
        
        if existing.data:
            return {"success": False, "message": "Already following"}
        
        # Create follow relationship
        result = supabase.table("follows").insert({
            "follower_id": follower_id,
            "followed_id": followed_id
        }).execute()
        
        return {"success": True, "followed": followed_id}
    
    def unfollow(self, follower_id: str, followed_id: str):
        """Unfollow a user"""
        supabase.table("follows")\
            .delete()\
            .eq("follower_id", follower_id)\
            .eq("followed_id", followed_id)\
            .execute()
        
        return {"success": True, "unfollowed": followed_id}
    
    def get_followers(self, user_id: str):
        """Get list of users who follow this user"""
        result = supabase.table("follows")\
            .select("follower_id")\
            .eq("followed_id", user_id)\
            .execute()
        
        return [f["follower_id"] for f in result.data]
    
    def get_following(self, user_id: str):
        """Get list of users this user follows"""
        result = supabase.table("follows")\
            .select("followed_id")\
            .eq("follower_id", user_id)\
            .execute()
        
        return [f["followed_id"] for f in result.data]
    
    # =====================================================
    # LAYER 2: BAD FRIENDS (Mutual Humor Detection)
    # =====================================================
    
    def get_bad_friends(self, user_id: str):
        """Get accepted Bad Friends"""
        # Query where user is user_a
        result_a = supabase.table("bad_friends")\
            .select("*")\
            .eq("user_a", user_id)\
            .not_.is_("accepted_at", "null")\
            .execute()
        
        # Query where user is user_b
        result_b = supabase.table("bad_friends")\
            .select("*")\
            .eq("user_b", user_id)\
            .not_.is_("accepted_at", "null")\
            .execute()
        
        friends = []
        
        for row in result_a.data:
            friends.append({
                "user_id": row["user_b"],
                "detected_at": row["detected_at"],
                "accepted_at": row["accepted_at"]
            })
        
        for row in result_b.data:
            friends.append({
                "user_id": row["user_a"],
                "detected_at": row["detected_at"],
                "accepted_at": row["accepted_at"]
            })
        
        return friends
    
    def get_pending_bad_friends(self, user_id: str):
        """Get pending Bad Friend requests (not yet accepted)"""
        # Query where user is user_a
        result_a = supabase.table("bad_friends")\
            .select("*")\
            .eq("user_a", user_id)\
            .is_("accepted_at", "null")\
            .execute()
        
        # Query where user is user_b
        result_b = supabase.table("bad_friends")\
            .select("*")\
            .eq("user_b", user_id)\
            .is_("accepted_at", "null")\
            .execute()
        
        pending = []
        
        for row in result_a.data:
            pending.append({
                "user_id": row["user_b"],
                "detected_at": row["detected_at"],
                "detection_count": row.get("detection_count", 1)
            })
        
        for row in result_b.data:
            pending.append({
                "user_id": row["user_a"],
                "detected_at": row["detected_at"],
                "detection_count": row.get("detection_count", 1)
            })
        
        return pending
    
    def accept_bad_friend(self, user_id: str, other_id: str):
        """Accept a Bad Friend request"""
        # Try updating where user is user_a
        result = supabase.table("bad_friends")\
            .update({"accepted_at": datetime.now().isoformat()})\
            .eq("user_a", user_id)\
            .eq("user_b", other_id)\
            .execute()
        
        # If no rows updated, try where user is user_b
        if not result.data:
            result = supabase.table("bad_friends")\
                .update({"accepted_at": datetime.now().isoformat()})\
                .eq("user_a", other_id)\
                .eq("user_b", user_id)\
                .execute()
        
        return {"success": len(result.data) > 0}
    
    # =====================================================
    # LAYER 3: WORST FRIENDS (Romantic Matches)
    # =====================================================
    
    def get_worst_friends(self, user_id: str):
        """Get accepted romantic matches"""
        # Query where user is user_a
        result_a = supabase.table("matches")\
            .select("*")\
            .eq("user_a", user_id)\
            .eq("status", "accepted")\
            .execute()
        
        # Query where user is user_b
        result_b = supabase.table("matches")\
            .select("*")\
            .eq("user_b", user_id)\
            .eq("status", "accepted")\
            .execute()
        
        matches = []
        
        for row in result_a.data:
            matches.append({
                "user_id": row["user_b"],
                "matched_at": row["matched_at"]
            })
        
        for row in result_b.data:
            matches.append({
                "user_id": row["user_a"],
                "matched_at": row["matched_at"]
            })
        
        return matches
    
    # =====================================================
    # LAYER 4: PENDING MATCHES
    # =====================================================
    
    def get_pending_matches(self, user_id: str):
        """Get pending match requests (one-way likes)"""
        # Query where user is user_a
        result_a = supabase.table("matches")\
            .select("*")\
            .eq("user_a", user_id)\
            .eq("status", "pending")\
            .execute()
        
        # Query where user is user_b
        result_b = supabase.table("matches")\
            .select("*")\
            .eq("user_b", user_id)\
            .eq("status", "pending")\
            .execute()
        
        pending = []
        
        for row in result_a.data:
            pending.append({
                "user_id": row["user_b"],
                "matched_at": row["matched_at"]
            })
        
        for row in result_b.data:
            pending.append({
                "user_id": row["user_a"],
                "matched_at": row["matched_at"]
            })
        
        return pending
    
    # =====================================================
    # FRIENDSHIP SUMMARY (All Layers Combined)
    # =====================================================
    
    def get_friendship_summary(self, user_id: str):
        """Get counts for all friendship layers in one call"""
        result = supabase.rpc("get_friendship_summary", {"user_id": user_id}).execute()
        
        summary = {
            "following": 0,
            "followers": 0,
            "bad_friends": 0,
            "pending_bad_friends": 0,
            "worst_friends": 0,
            "pending_matches": 0
        }
        
        for row in result.data:
            summary[row["layer"]] = row["count"]
        
        return summary


# Singleton instance
friendship_service = FriendshipService()