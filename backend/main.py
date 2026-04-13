from fastapi import FastAPI, Depends, HTTPException, Request, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from datetime import datetime
import os
from dotenv import load_dotenv
from services.friendship_service import friendship_service

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

app = FastAPI(title="Bad Friends API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://bad-friends-morning-face-build.netlify.app",
        "https://bad-friends-api.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# =====================================================
# AUTHENTICATION DEPENDENCY - SYNC VERSION
# =====================================================

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from Firebase token - SYNC version"""
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

# =====================================================
# HEALTH & SYSTEM ENDPOINTS
# =====================================================

@app.get("/")
@app.get("/status")
def root():
    return {"status": "healthy", "version": "1.0.0", "timestamp": datetime.now().isoformat()}

# =====================================================
# AUTHENTICATION ENDPOINTS
# =====================================================

@app.post("/auth/register")
def register(
    email: str = Form(...), 
    password: str = Form(...), 
    phone: str = Form(...), 
    gender: str = Form(...), 
    name: str = Form(None)
):
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
def login(email: str = Form(...), password: str = Form(...)):
    auth_response = supabase.auth.sign_in_with_password({"email": email, "password": password})
    if not auth_response.user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user_result = supabase.table("users").select("*").eq("auth_id", auth_response.user.id).execute()
    return {
        "success": True,
        "token": auth_response.session.access_token,
        "user": user_result.data[0] if user_result.data else None
    }

# =====================================================
# PROFILE ENDPOINTS
# =====================================================

@app.get("/profile")
def get_profile(current_user: dict = Depends(get_current_user)):
    return {"success": True, "profile": current_user}

# =====================================================
# MORNING FACE ENDPOINTS
# =====================================================

@app.post("/morning-face")
def upload_morning_face(
    image_url: str = Form(...), 
    timestamp: str = Form(...), 
    current_user: dict = Depends(get_current_user)
):
    today = datetime.now().date()
    existing = supabase.table("morning_faces").select("*").eq("user_id", current_user["id"]).gte("timestamp", today.isoformat()).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Already uploaded today")
    face_data = {"user_id": current_user["id"], "image_url": image_url, "timestamp": timestamp}
    result = supabase.table("morning_faces").insert(face_data).execute()
    user_result = supabase.table("users").select("streak_days").eq("id", current_user["id"]).execute()
    return {"success": True, "face_id": result.data[0]["id"], "streak_days": user_result.data[0]["streak_days"] if user_result.data else 0}

@app.get("/morning-face/feed")
def get_morning_face_feed(limit: int = 20, current_user: dict = Depends(get_current_user)):
    today = datetime.now().date()
    friends_result = supabase.table("follows").select("followed_id").eq("follower_id", current_user["id"]).execute()
    friend_ids = [f["followed_id"] for f in friends_result.data] + [current_user["id"]]
    if not friend_ids:
        return {"success": True, "faces": []}
    result = supabase.table("morning_faces").select("*, users!inner(name)").in_("user_id", friend_ids).gte("timestamp", today.isoformat()).order("created_at", desc=True).limit(limit).execute()
    return {"success": True, "faces": result.data}

# =====================================================
# QUESTION ENDPOINTS
# =====================================================

@app.get("/questions/today")
def get_today_question(current_user: dict = Depends(get_current_user)):
    today = datetime.now().date()
    question_result = supabase.table("daily_questions").select("*").eq("date", today.isoformat()).execute()
    if not question_result.data:
        question_result = supabase.table("daily_questions").select("*").limit(1).execute()
    question = question_result.data[0]
    answer_result = supabase.table("answers").select("id").eq("user_id", current_user["id"]).eq("question_id", question["id"]).execute()
    return {"success": True, "question": {"id": question["id"], "question_text": question["question_text"], "date": question["date"], "has_answered": len(answer_result.data) > 0}}

@app.post("/questions/answer")
def submit_answer(
    question_id: str = Form(...), 
    answer_text: str = Form(...), 
    current_user: dict = Depends(get_current_user)
):
    # Check if this is a baseline question
    question = supabase.table("daily_questions").select("is_baseline").eq("id", question_id).execute()
    is_baseline = question.data[0].get("is_baseline", False) if question.data else False
    
    if is_baseline:
        # For baseline questions, delete existing answer first
        supabase.table("answers").delete().eq("user_id", current_user["id"]).eq("question_id", question_id).execute()
    else:
        # For daily questions, check if already answered
        existing = supabase.table("answers").select("*").eq("user_id", current_user["id"]).eq("question_id", question_id).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Already answered")
    
    answer_data = {
        "user_id": current_user["id"], 
        "question_id": question_id, 
        "answer_text": answer_text
    }
    result = supabase.table("answers").insert(answer_data).execute()
    return {"success": True, "answer_id": result.data[0]["id"]}

@app.get("/questions/feed")
def get_answer_feed(limit: int = 20, current_user: dict = Depends(get_current_user)):
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

# =====================================================
# BASELINE QUESTIONS FOR ONBOARDING
# =====================================================

@app.get("/questions/baseline")
def get_baseline_questions():
    """Get baseline questions for onboarding CMI"""
    result = supabase.table("daily_questions").select("id, question_text").execute()
    
    if result.data and len(result.data) >= 5:
        return {
            "success": True,
            "questions": [{"id": q["id"], "text": q["question_text"]} for q in result.data[:10]]
        }
    
    # Fallback - only used if database has no questions
    fallback = [
        {"id": "1", "text": "Would you suck Jamie Lee Curtis's big toe for a Klondike bar?"},
        {"id": "2", "text": "Would you rather fight one Bobby-Lee-sized ant or 100 ant-sized Bobby Lees?"},
        {"id": "3", "text": "Rate your current tiredness as a weather forecast."},
        {"id": "4", "text": "What's something you're NOT going to feel guilty about today?"},
        {"id": "5", "text": "How many ant traps belong on a fridge?"},
        {"id": "6", "text": "Are you a Fancy B or a Rudy in a group project?"},
        {"id": "7", "text": "What's the most overrated thing about breakfast tacos?"},
        {"id": "8", "text": "If your morning face was a movie title, what would it be?"},
        {"id": "9", "text": "What's your Bobo energy level today?"},
        {"id": "10", "text": "Would you let an ant keep the cracker or make it start over?"}
    ]
    
    return {"success": True, "questions": fallback}

# =====================================================
# FRIENDSHIP ENDPOINTS (Layer 1-4) - FIXED: No await
# =====================================================

@app.post("/friends/follow/{user_id}")
def follow_user(user_id: str, current_user: dict = Depends(get_current_user)):
    if user_id == current_user["id"]:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")
    result = friendship_service.follow(current_user["id"], user_id)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result.get("message", "Already following"))
    return result

@app.delete("/friends/follow/{user_id}")
def unfollow_user(user_id: str, current_user: dict = Depends(get_current_user)):
    result = friendship_service.unfollow(current_user["id"], user_id)
    return result

@app.get("/friends/followers")
def get_my_followers(current_user: dict = Depends(get_current_user)):
    followers = friendship_service.get_followers(current_user["id"])
    return {"success": True, "followers": followers}

@app.get("/friends/following")
def get_my_following(current_user: dict = Depends(get_current_user)):
    following = friendship_service.get_following(current_user["id"])
    return {"success": True, "following": following}

@app.get("/bad-friends/list")
def get_bad_friends(current_user: dict = Depends(get_current_user)):
    friends = friendship_service.get_bad_friends(current_user["id"])
    return {"success": True, "bad_friends": friends}

@app.get("/bad-friends/pending")
def get_pending_bad_friends(current_user: dict = Depends(get_current_user)):
    pending = friendship_service.get_pending_bad_friends(current_user["id"])
    return {"success": True, "pending": pending}

@app.post("/bad-friends/accept/{user_id}")
def accept_bad_friend(user_id: str, current_user: dict = Depends(get_current_user)):
    result = friendship_service.accept_bad_friend(current_user["id"], user_id)
    if not result["success"]:
        raise HTTPException(status_code=404, detail="Bad Friend request not found")
    return {"success": True}

@app.get("/worst-friends/list")
def get_worst_friends(current_user: dict = Depends(get_current_user)):
    matches = friendship_service.get_worst_friends(current_user["id"])
    return {"success": True, "worst_friends": matches}

@app.get("/matches/pending")
def get_pending_matches(current_user: dict = Depends(get_current_user)):
    pending = friendship_service.get_pending_matches(current_user["id"])
    return {"success": True, "pending": pending}

@app.get("/friends/summary")
def get_friendship_summary(current_user: dict = Depends(get_current_user)):
    summary = friendship_service.get_friendship_summary(current_user["id"])
    return {"success": True, "summary": summary}

# =====================================================
# ONBOARDING ENDPOINTS
# =====================================================

@app.post("/onboarding/psychological")
def save_psychological_data(
    data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Save psychological profile answers (upsert to avoid duplicates)"""
    
    profile_data = {
        "user_id": current_user["id"],
        "big_five": data.get("big_five"),
        "attachment_style": data.get("attachment_style"),
        "love_languages": data.get("love_languages"),
        "core_values": data.get("core_values"),
        "conflict_style": data.get("conflict_style"),
        "humor_style": data.get("humor_style"),
        "sensation_seeking": data.get("sensation_seeking"),
        "updated_at": datetime.now().isoformat()
    }
    
    # Use PostgREST upsert with on_conflict
    result = supabase.table("psychological_profiles").upsert(
        profile_data,
        on_conflict="user_id"
    ).execute()
    
    return {"success": True}

@app.post("/onboarding/calibration")
def save_calibration_data(
    data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Save attractiveness calibration ratings"""
    result = supabase.table("users").update({
        "attractiveness_score": data.get("calibration_score")
    }).eq("id", current_user["id"]).execute()
    return {"success": True}

@app.post("/onboarding/dealbreakers")
def save_dealbreakers(
    data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Save user dealbreakers and mark onboarding complete"""
    # Save dealbreakers
    result = supabase.table("users").update({
        "dealbreakers": data,
        "onboarding_complete": True
    }).eq("id", current_user["id"]).execute()
    
    return {"success": True, "onboarding_complete": True}

# =====================================================
# SYSTEM INFO ENDPOINTS
# =====================================================

@app.get("/users/count")
def get_user_count(current_user: dict = Depends(get_current_user)):
    """Get total number of registered users in the system.
    Used by frontend to determine whether to show mock data.
    Mock data hides automatically when system reaches 20+ real users."""
    result = supabase.table("users").select("id", count="exact").execute()
    return {"success": True, "count": result.count}

# =====================================================
# REACTION ENDPOINTS
# =====================================================

@app.post("/reactions")
def add_reaction(
    target_type: str = Form(...), 
    target_id: str = Form(...), 
    reaction_type: str = Form(...), 
    current_user: dict = Depends(get_current_user)
):
    existing = supabase.table("reactions").select("*").eq("user_id", current_user["id"]).eq("target_type", target_type).eq("target_id", target_id).execute()
    if existing.data:
        supabase.table("reactions").delete().eq("id", existing.data[0]["id"]).execute()
    reaction_data = {"user_id": current_user["id"], "target_type": target_type, "target_id": target_id, "reaction_type": reaction_type}
    result = supabase.table("reactions").insert(reaction_data).execute()
    return {"success": True, "reaction_id": result.data[0]["id"]}

# =====================================================
# MATCHING ENDPOINTS (Placeholders for v1.1)
# =====================================================

@app.get("/matches/discover")
def discover_matches(current_user: dict = Depends(get_current_user)):
    return {"success": True, "candidates": []}

@app.post("/matches/like")
def like_user(target_user_id: str = Form(...), current_user: dict = Depends(get_current_user)):
    return {"success": True, "mutual": False}

@app.get("/matches")
def get_matches(current_user: dict = Depends(get_current_user)):
    return {"success": True, "matches": []}

# =====================================================
# MESSAGE ENDPOINTS (Placeholders for v1.1)
# =====================================================

@app.post("/messages")
def send_message(match_id: str = Form(...), content: str = Form(...), current_user: dict = Depends(get_current_user)):
    return {"success": True}

@app.get("/messages/{match_id}")
def get_messages(match_id: str, current_user: dict = Depends(get_current_user)):
    return {"success": True, "messages": []}