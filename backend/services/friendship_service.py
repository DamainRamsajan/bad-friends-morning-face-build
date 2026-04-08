# backend/services/friendship_service.py
# CORRECTED - With load_dotenv
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