from fastapi import FastAPI, Depends, HTTPException, Request, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from datetime import datetime
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
