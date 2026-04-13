BFMF_ARCHITECTURE.md
Bad Friends Morning Face Build
Complete System Architecture - v1.1 (Firebase Migration)
Last Updated: April 12, 2026
Status: Production Ready | Free Tier Compliant | No Credit Card Required
Stack: React + Vite + FastAPI + Firebase (Auth, Firestore, Storage) + Render + Netlify

TABLE OF CONTENTS
Executive Summary & Core Differentiators

Technology Stack (Free Tier)

C4 Architecture Diagrams (Levels 1-4)

Data Architecture (Firestore Schema)

API Architecture (36 Endpoints)

Frontend Architecture

6.1 Component Hierarchy

6.2 Custom Hooks

6.3 UI Design System

6.4 Button Inventory

6.5 Wireframe Reference (28 Screens)

Backend Architecture

7.1 Directory Structure

7.2 Core Services

7.3 Class Diagrams

Security Architecture

Authentication & Authorization

Friendship Layers Architecture

Discovery & Matching Engine

Safety Architecture (Sisterhood + Trust)

Deployment Architecture

Background Automation (GitHub Actions)

State Machines

15.1 Trust Level State Machine

15.2 Match State Machine

Data Flow Diagrams

16.1 Morning Face Upload

16.2 CMI Calculation (Future)

16.3 Matching & Discovery

Error Handling & Resilience

Monitoring & Analytics

Production Best Practices Implemented

Future Architectural Directions (v1.2+)

Protected Information Registry

Appendix: All 102 Architectural Decisions

1. EXECUTIVE SUMMARY & CORE DIFFERENTIATORS
1.1 Core Mission
Bad Friends is a humor-first dating app where users must upload a daily "morning face" photo (no makeup, no filters) to unlock visibility. Users answer absurd daily questions inspired by the Bad Friends podcast, and matching is based on humor compatibility measured by the Comedy Match Index (CMI).

1.2 Key Differentiators (Protected - Internal Only)
#	Differentiator	Public Description	Internal Implementation
1	Morning Face Required	"Daily vulnerability requirement"	Mandatory photo upload before 11:59 AM local time, streak tracking via upload_date field
2	Humor Compatibility	"Proprietary humor analysis"	CMI based on gold standard 💀 reactions + vector embeddings (v3)
3	Answers First	"Personality before photos"	Card stack shows answers, faces unlock after 3 ratings (UNLOCK_THRESHOLD = 3)
4	Trust-Based Safety	"Graduated trust architecture"	5 levels (1-5), trust points earned via behavior, location only at Level 4+
5	Community Verification	"Peer-vetted safety network"	Sisterhood (women-only, anonymous hashed posts), Bad Faith Alerts
6	Authenticity Over Polish	"No filters. No retakes."	Camera timestamp verification, EXIF data check (future)
7	Women-First Safety	"Built for women, by people who care"	Asymmetric verification, Sisterhood, Bad Friend Backup, Emergency Kill Switch
1.3 Current Status (v1.1)
Component	Status	Notes
Supabase	❌ FULLY REMOVED	DNS NXDOMAIN issues - complete migration
Firebase Auth	✅ IMPLEMENTED	Email/Password, custom gender claims
Firestore	✅ IMPLEMENTED	All 14 collections migrated
Firebase Storage	✅ IMPLEMENTED	User-specific folder structure
FastAPI Backend	✅ 36 ENDPOINTS	Production-grade with rate limiting
React Frontend	✅ 19/28 SCREENS	19 implemented, 1 stub, 8 future
Deployment	✅ RENDER + NETLIFY	Free tier, cold start mitigation
Sisterhood	✅ FULLY IMPLEMENTED	Anonymous hashed posts, women-only
Friendship Layers	✅ 4 LAYERS	Follows, Bad Friends, Worst Friends, Pending
Mock Data	✅ PRESERVED	20-user threshold, mock user IDs preserved
Chat	⏳ STUB (v1.1)	Returns empty array
ID Verification	⏳ FUTURE (v1.2)	Persona API integration
Trust Dashboard	⏳ FUTURE (v1.2)	Trust level progression UI
Location Features	⏳ FUTURE (v2)	Heat maps, path crosser
Settings Screen	⏳ FUTURE (v1.2)	Account, privacy, notifications
2. TECHNOLOGY STACK (FREE TIER)
2.1 Complete Stack
Layer	Technology	Version	Free Tier Limits
Frontend	React	18.2+	Unlimited
Vite	4.0+	Unlimited
Tailwind CSS	3.4.17	Unlimited
Firebase JS SDK	10.12+	Part of Firebase
Backend	FastAPI	0.104.1	Unlimited
Uvicorn	0.24.0	Unlimited
Pydantic	2.5.0	Unlimited
Database	Firestore (Firebase)	-	50K reads/day, 20K writes/day, 1GB storage
Auth	Firebase Auth	-	50K MAUs
Storage	Firebase Storage	-	5GB stored, 1GB/day download
Hosting	Netlify (Frontend)	-	100GB bandwidth
Render (Backend)	-	100GB bandwidth, spins down after 15 min
Automation	GitHub Actions	-	2,000 min/month free
Monitoring	UptimeRobot	-	50 monitors free
Future AI	Groq (v1.2)	-	30 req/min free
Hugging Face (v1.2)	-	Free inference tier
2.2 Operating Budget (50 Users)
Metric	Limit	Target (50%)	Actual at 50 users
Firestore reads/day	50,000	25,000	~22,500
Firestore writes/day	20,000	10,000	~5,000
Storage used	5GB	2.5GB	~500MB
Auth MAUs	50,000	25,000	50
User hard cap	50	-	CONFIGURABLE
3. C4 ARCHITECTURE DIAGRAMS (LEVELS 1-4)
3.1 Level 1: System Context Diagram
text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BAD FRIENDS SYSTEM CONTEXT                          │
│                                                                              │
│                              ┌─────────────┐                                │
│                              │   WOMAN     │                                │
│                              │   USER      │                                │
│                              └──────┬──────┘                                │
│                                     │                                       │
│                                     │ Uses                                  │
│                                     ▼                                       │
│ ┌─────────────┐                ┌─────────────┐                ┌───────────┐│
│ │   MAN       │                │   BAD       │                │  FUTURE   ││
│ │   USER      │◀──────────────▶│   FRIENDS   │───────────────▶│   APIs    ││
│ └─────────────┘                │   APP       │                │(Groq/HF)  ││
│                               └─────────────┘                └───────────┘│
│                                     │                                       │
│                                     │ Uses                                  │
│                                     ▼                                       │
│ ┌─────────────┐                ┌─────────────┐                ┌───────────┐│
│ │  FIREBASE   │                │  FASTAPI    │                │  RENDER   ││
│ │ (Auth+DB+   │◀──────────────▶│  BACKEND    │───────────────▶│ (Hosting) ││
│ │  Storage)   │                │             │                └───────────┘│
│ └─────────────┘                └─────────────┘                              │
│                                     │                                       │
│                                     │ Deploys to                            │
│                                     ▼                                       │
│                              ┌─────────────┐                               │
│                              │   NETLIFY   │                               │
│                              │ (Frontend)  │                               │
│                              └─────────────┘                               │
└─────────────────────────────────────────────────────────────────────────────┘
3.2 Level 2: Container Diagram
text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BAD FRIENDS CONTAINER ARCHITECTURE                     │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                      SINGLE PAGE APPLICATION (React)                    ││
│  │                                                                          ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     ││
│  │  │  Auth    │ │  Feed    │ │  Camera  │ │ Discover │ │  Chat    │     ││
│  │  │  UI      │ │  UI      │ │  UI      │ │  UI      │ │  UI (v2) │     ││
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘     ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     ││
│  │  │ Matches  │ │ Profile  │ │Sisterhood│ │Onboarding│ │ Settings │     ││
│  │  │  UI      │ │  UI      │ │  UI      │ │  UI      │ │  UI (v2) │     ││
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘     ││
│  │                                                                          ││
│  │  [State: React Context]  [HTTP Client: Fetch]  [Auth: Firebase SDK]    ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                    │                                        │
│                                    │ HTTPS (REST API)                       │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                         WEB API (FastAPI)                               ││
│  │                                                                          ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     ││
│  │  │  Auth    │ │ Morning  │ │ Question │ │ Reaction │ │  Match   │     ││
│  │  │  API     │ │  Face    │ │  API     │ │  API     │ │  API     │     ││
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘     ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     ││
│  │  │ Message  │ │Friendship│ │ Sister-  │ │Onboarding│ │  Health  │     ││
│  │  │  API     │ │  API     │ │  hood    │ │  API     │ │  API     │     ││
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘     ││
│  │                                                                          ││
│  │  [Middleware: CORS, Rate Limiting, Auth, Request ID, GZip, Logging]    ││
│  │  [Services: Firebase Client, Friendship, Retry, Monitoring]            ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                    │                                        │
│                                    │ Firebase Admin SDK                    │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                          FIREBASE (Google Cloud)                        ││
│  │                                                                          ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  ││
│  │  │  Firestore   │  │     Auth     │  │   Storage    │                  ││
│  │  │  (Database)  │  │  (Identity)  │  │   (Images)   │                  ││
│  │  └──────────────┘  └──────────────┘  └──────────────┘                  ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
3.3 Level 3: Component Diagram (Backend)
text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND COMPONENT ARCHITECTURE                       │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                           API LAYER (main.py)                           ││
│  │                                                                          ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    ││
│  │  │   Router    │  │  Middleware │  │   CORS      │  │  Rate       │    ││
│  │  │  (APIRouter)│  │  (Auth)     │  │  (CORSMiddleware)│  │  Limiter   │    ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                         SERVICE LAYER (services/)                        ││
│  │                                                                          ││
│  │  ┌─────────────────────────────────────────────────────────────────────┐││
│  │  │                         CORE SERVICES                                │││
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│││
│  │  │  │  Firebase   │  │  Friendship │  │   Retry     │  │  Monitoring ││││
│  │  │  │  Client     │  │  Service    │  │  (retry)    │  │  (metrics)  ││││
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘│││
│  │  └─────────────────────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                           CORE LAYER (core/)                            ││
│  │                                                                          ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    ││
│  │  │   Config    │  │    Auth     │  │ Exceptions  │  │  Rate Limit │    ││
│  │  │ (Pydantic)  │  │ (Firebase)  │  │ (AppError)  │  │  (in-mem)   │    ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    ││
│  │  ┌─────────────┐  ┌─────────────┐                                      ││
│  │  │ Middleware  │  │  Monitoring │                                      ││
│  │  │ (RequestID) │  │  (queries)  │                                      ││
│  │  └─────────────┘  └─────────────┘                                      ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                         DATA LAYER (Firestore)                           ││
│  │                                                                          ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    ││
│  │  │   Users     │  │ MorningFace │  │  Questions  │  │  Answers    │    ││
│  │  │  Collection │  │ Collection  │  │ Collection  │  │ Collection  │    ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    ││
│  │  │  Reactions  │  │   Matches   │  │  Messages   │  │   Follows   │    ││
│  │  │ Collection  │  │ Collection  │  │ Collection  │  │ Collection  │    ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
3.4 Level 4: Code Level (Key Class Relationships)
text
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CODE LEVEL DIAGRAM                                │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                         FRONTEND (React)                                 ││
│  │                                                                          ││
│  │  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐    ││
│  │  │   AuthContext   │────▶│  firebaseClient │────▶│  Firebase Auth  │    ││
│  │  │   (Provider)    │     │   (SDK wrapper) │     │   (External)    │    ││
│  │  └─────────────────┘     └─────────────────┘     └─────────────────┘    ││
│  │           │                                                             ││
│  │           ▼                                                             ││
│  │  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐    ││
│  │  │   useAuth()     │────▶│   Screens       │────▶│   API Calls     │    ││
│  │  │   (hook)        │     │   (Components)  │     │   (fetch)       │    ││
│  │  └─────────────────┘     └─────────────────┘     └────────┬────────┘    ││
│  │                                                           │             ││
│  └───────────────────────────────────────────────────────────┼─────────────┘│
│                                                              │             │
│                                                              │ HTTPS       │
│                                                              ▼             │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                         BACKEND (FastAPI)                               ││
│  │                                                                          ││
│  │  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐    ││
│  │  │   main.py       │────▶│   core/auth.py  │────▶│  Firebase Admin │    ││
│  │  │   (endpoints)   │     │ (get_current_user)    │     SDK         │    ││
│  │  └────────┬────────┘     └─────────────────┘     └─────────────────┘    ││
│  │           │                                                             ││
│  │           ▼                                                             ││
│  │  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐    ││
│  │  │ services/       │────▶│ core/           │────▶│ Firestore       │    ││
│  │  │ firebase_client │     │ config.py       │     │ (External)      │    ││
│  │  └─────────────────┘     └─────────────────┘     └─────────────────┘    ││
│  │           │                                                             ││
│  │           ▼                                                             ││
│  │  ┌─────────────────┐                                                    ││
│  │  │ services/       │                                                    ││
│  │  │ friendship_     │                                                    ││
│  │  │ service.py      │                                                    ││
│  │  └─────────────────┘                                                    ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  Key Relationships:                                                          │
│  • AuthContext provides user to all screens via useAuth()                   │
│  • Screens call API endpoints with user.getIdToken()                        │
│  • Backend verifies token via verify_id_token(check_revoked=True)          │
│  • FirebaseService handles all Firestore operations                        │
│  • FriendshipService uses FirebaseService and maintains cached counts      │
└─────────────────────────────────────────────────────────────────────────────┘
4. DATA ARCHITECTURE (FIRESTORE SCHEMA)
4.1 Collection Overview
Collection	Document ID	Purpose	Read/Write Rules
users	Firebase Auth UID	User profiles	Owner only
users/{uid}/meta/summary	"summary"	Cached friendship counts	Owner only
users/{uid}/psychological_profile	"data"	Onboarding psych data	Owner only
morning_faces	Auto-generated	Daily photos	Read: auth, Write: owner
daily_questions	Date string (YYYY-MM-DD)	Daily/baseline questions	Read: auth, Write: backend
answers	Auto-generated	User answers	Read: auth, Write: owner
reactions	Deterministic {uid}_{type}_{id}	Reaction toggles	Read: auth, Write: owner
matches	Auto-generated	Romantic matches	Read: participants, Write: auth
messages	{match_id}_{timestamp}	Chat messages (v1.1 stub)	Read: participants, Write: sender
follows	{follower}_{followed}	Friend connections	Read: auth, Write: follower
bad_friends	Sorted {uid_a}_{uid_b}	Mutual humor detection	Read: participants, Write: auth
sisterhood_posts	Auto-generated	Anonymous vetting	Read/write: women only
location_heartbeats	{uid}_{timestamp}	Temp location (v2)	Owner only
user_questions	Auto-generated	AI-generated questions (v2)	Owner only
app_config	"global"	Runtime configuration	Read: auth, Write: backend
rate_limits	reg:{email}	Registration rate limits	Admin SDK only
4.2 Collection: users
Document ID: Firebase Auth UID

javascript
{
  // Core Identity (synced from Firebase Auth)
  "email": "user@example.com",
  "phone": "+1234567890",
  "name": "John Doe",
  
  // Profile Data
  "gender": "man",                    // "man", "woman", "non_binary", "prefer_not_to_say"
  "trust_level": 1,                   // 1-5
  "trust_points": 0,
  "streak_days": 0,
  "last_morning_face": null,          // ISO timestamp
  "cmi_score": 0,                     // 0-100 (simple score in v1)
  
  // Onboarding Status
  "onboarding_complete": false,
  "attractiveness_score": null,       // 1-10
  "dealbreakers": null,               // { wants_kids, max_distance, age_min, age_max, politics, religion }
  
  // Cached Friendship Counts (REC 3)
  "friendship_counts": {
    "following": 0,
    "followers": 0,
    "bad_friends": 0,
    "pending_bad_friends": 0,
    "worst_friends": 0,
    "pending_matches": 0
  },
  
  // Metadata
  "created_at": "2026-04-12T00:00:00Z",
  "updated_at": "2026-04-12T00:00:00Z"
}
4.3 Collection: users/{uid}/meta/summary
Document ID: "summary"

javascript
{
  "following": 0,
  "followers": 0,
  "bad_friends": 0,
  "pending_bad_friends": 0,
  "worst_friends": 0,
  "pending_matches": 0,
  "updated_at": "2026-04-12T00:00:00Z"
}
4.4 Collection: users/{uid}/psychological_profile
Document ID: "data"

javascript
{
  "user_id": "firebase_uid",
  "big_five": {
    "openness": 4.2,
    "conscientiousness": 3.1,
    "extraversion": 3.8,
    "agreeableness": 4.0,
    "neuroticism": 2.5
  },
  "attachment_style": "secure",      // "secure", "anxious", "avoidant", "disorganized"
  "love_languages": {
    "words": 5,
    "acts": 3,
    "gifts": 2,
    "time": 4,
    "touch": 3
  },
  "core_values": ["family", "career", "humor"],
  "conflict_style": "collaborative",
  "humor_style": {
    "affiliative": 4,
    "self_enhancing": 3,
    "aggressive": 2,
    "self_defeating": 1
  },
  "sensation_seeking": 65,
  "updated_at": "2026-04-12T00:00:00Z"
}
4.5 Collection: morning_faces
Document ID: Auto-generated

javascript
{
  "user_id": "firebase_uid",
  "user_name": "John Doe",            // DENORMALIZED - no join needed
  "image_url": "https://firebasestorage.googleapis.com/...",
  "timestamp": "2026-04-12T08:30:00Z",
  "upload_date": "2026-04-12",        // For date-based queries
  "reaction_counts": {
    "bobo": 0,
    "cheeto": 0,
    "tiger": 0,
    "dead": 0
  },
  "created_at": "2026-04-12T08:30:00Z"
}
Indexes:

user_id ASC, created_at DESC

user_id ASC, upload_date ASC

4.6 Collection: daily_questions
Document ID: Date string (e.g., "2026-04-12")

javascript
{
  "question_text": "Would you suck Jamie Lee Curtis's big toe for a Klondike bar?",
  "source_episode": "Bad Friends Ep 1",
  "date": "2026-04-12",
  "is_baseline": false,               // true for onboarding questions (5 total)
  "gold_standard_answer_ids": [],     // Array of top 10 answer IDs (populated daily)
  "created_at": "2026-04-12T00:00:00Z"
}
4.7 Collection: answers
Document ID: Deterministic {user_id}_{question_id} for baseline, auto for daily

javascript
{
  "user_id": "firebase_uid",
  "user_name": "John Doe",            // DENORMALIZED
  "question_id": "2026-04-12",
  "answer_text": "Only if she paints it like a Klondike wrapper first.",
  "answer_type": "daily",             // "baseline" or "daily"
  "cmi_score": 0,                    // Updated by background job
  "reaction_counts": {
    "bobo": 0,
    "cheeto": 0,
    "tiger": 0,
    "dead": 0
  },
  "created_at": "2026-04-12T10:15:00Z"
}
Indexes:

question_id ASC, created_at DESC

user_id ASC, answer_type ASC, question_id ASC

4.8 Collection: reactions
Document ID: Deterministic {user_id}_{target_type}_{target_id}

javascript
{
  "user_id": "firebase_uid",
  "target_type": "morning_face",      // or "answer"
  "target_id": "morning_face_doc_id",
  "reaction_type": "dead",            // "bobo", "cheeto", "tiger", "dead"
  "created_at": "2026-04-12T10:20:00Z"
}
Toggle Logic: If document exists, delete it (un-reaction). If reaction_type differs, overwrite.

Indexes:

user_id ASC, target_type ASC, target_id ASC

reaction_type ASC, created_at DESC

4.9 Collection: matches
Document ID: Auto-generated

javascript
{
  "user_a": "firebase_uid_a",
  "user_b": "firebase_uid_b",
  "status": "pending",                // "pending", "accepted", "rejected", "expired"
  "matched_at": "2026-04-12T12:00:00Z",
  "accepted_at": null
}
Indexes:

user_a ASC, status ASC

user_b ASC, status ASC

4.10 Collection: messages (v1.1 Stub)
Document ID: {match_id}_{timestamp_ms}_{random}

javascript
{
  "match_id": "match_doc_id",
  "sender_id": "firebase_uid",
  "content": "Hey! Great answer on the toe question.",
  "is_read": false,
  "created_at": "2026-04-12T12:05:00Z"
}
Indexes:

match_id ASC, created_at ASC

4.11 Collection: follows
Document ID: Composite {follower_id}_{followed_id}

javascript
{
  "follower_id": "firebase_uid_a",
  "followed_id": "firebase_uid_b",
  "created_at": "2026-04-12T09:00:00Z"
}
Indexes:

follower_id ASC

followed_id ASC

4.12 Collection: bad_friends
Document ID: Sorted composite {user_a}_{user_b} (user_a < user_b)

javascript
{
  "user_a": "firebase_uid_a",
  "user_b": "firebase_uid_b",
  "detection_count": 3,
  "detected_at": "2026-04-12T08:00:00Z",
  "accepted_at": null
}
Indexes:

user_a ASC, accepted_at ASC

user_b ASC, accepted_at ASC

4.13 Collection: sisterhood_posts
Document ID: Auto-generated

javascript
{
  "poster_hash": "a1b2c3d4e5f6g7h8",   // Daily-salted hash (NOT raw UID)
  "target_user_id": "firebase_uid_target",
  "target_username": "john_doe",
  "content": "Has anyone dated @john_doe?",
  "flag_type": "yellow",              // "green", "yellow", "red"
  "created_at": "2026-04-12T14:00:00Z",
  "expires_at": "2026-05-12T14:00:00Z"
}
Security Rule: allow read, write: if isAuthenticated() && isWoman() && !('user_id' in request.resource.data)

Indexes:

expires_at ASC

4.14 Collection: location_heartbeats (v2)
Document ID: {user_id}_{timestamp_ms}

javascript
{
  "user_id": "firebase_uid",
  "lat": 40.7128,
  "lng": -74.0060,
  "accuracy": 15,                    // meters
  "created_at": "2026-04-12T15:00:00Z",
  "expires_at": "2026-04-12T15:15:00Z"
}
Indexes:

expires_at ASC

4.15 Collection: user_questions (v2)
Document ID: Auto-generated

javascript
{
  "user_id": "firebase_uid",
  "question_text": "What's your favorite ant trap brand?",
  "generated_for_date": "2026-04-12",
  "answer_text": null,
  "vitality_score": null,
  "created_at": "2026-04-12T02:00:00Z",
  "answered_at": null
}
Indexes:

user_id ASC, generated_for_date ASC, answer_text ASC

4.16 Collection: app_config
Document ID: "global"

javascript
{
  // Runtime State (auto-updated)
  "registered_user_count": 0,
  "total_reads_today": 0,
  "reads_date": "2026-04-12",
  
  // Configuration (change anytime, no redeploy)
  "user_hard_cap": 50,
  "app_read_ceiling": 40000,
  "mock_data_threshold": 20,
  
  // Feature Flags
  "feature_flags": {
    "sisterhood_enabled": true,
    "discover_enabled": true,
    "chat_enabled": false
  },
  
  // Metadata
  "updated_at": "2026-04-12T00:00:00Z"
}
4.17 Collection: rate_limits
Document ID: reg:{email}

javascript
{
  "attempts": ["2026-04-12T10:00:00Z", "2026-04-12T10:05:00Z"]
}
Security Rule: allow read, write: if false (Admin SDK only)

5. API ARCHITECTURE (36 ENDPOINTS)
5.1 Complete Endpoint Inventory
Category	Endpoint	Method	Auth Required	Status
System	/	GET	No	✅
/status	GET	No	✅
/users/count	GET	PUBLIC	✅
Auth	/auth/register	POST	No	✅
/auth/logout	POST	Yes	✅
/auth/login	-	-	❌ DELETED (use Firebase SDK)
Profile	/profile	GET	Yes	✅
Morning Face	/morning-face	POST	Yes	✅
/morning-face/feed	GET	Yes	✅
Questions	/questions/today	GET	Yes	✅
/questions/baseline	GET	No	✅
/questions/answer	POST	Yes	✅
/questions/feed	GET	Yes	✅
Reactions	/reactions	POST	Yes	✅
Friendships	/friends/follow/{user_id}	POST	Yes	✅
/friends/follow/{user_id}	DELETE	Yes	✅
/friends/followers	GET	Yes	✅
/friends/following	GET	Yes	✅
/friends/summary	GET	Yes	✅
Bad Friends	/bad-friends/list	GET	Yes	✅
/bad-friends/pending	GET	Yes	✅
/bad-friends/accept/{user_id}	POST	Yes	✅
Worst Friends	/worst-friends/list	GET	Yes	✅
Matches	/matches/discover	GET	Yes	✅
/matches/like	POST	Yes	✅
/matches	GET	Yes	✅
/matches/pending	GET	Yes	✅
Messages	/messages	POST	Yes	⏳ (v1.1 stub)
/messages/{match_id}	GET	Yes	⏳ (v1.1 stub)
Onboarding	/onboarding/psychological	POST	Yes	✅
/onboarding/calibration	POST	Yes	✅
/onboarding/dealbreakers	POST	Yes	✅
Sisterhood	/sisterhood/post	POST	Yes (women)	✅
/sisterhood/feed	GET	Yes (women)	✅
5.2 Key Endpoint Behaviors
/users/count - PUBLIC (No Auth)
python
# Returns total registered users for mock data threshold
# Frontend uses this to decide: show mock data if count < 20
# No authentication required - only returns a number
/auth/register - Creates Firebase User + Sets Gender Claim
python
# 1. Validates gender against enum
# 2. Checks registration rate limit (Firestore-backed, survives cold starts)
# 3. Checks user cap (default 50)
# 4. Creates user in Firebase Auth
# 5. Sets custom claim: {'gender': gender} (CRITICAL for Sisterhood)
# 6. Creates Firestore user document
# 7. Increments registered_user_count
# 8. Rolls back on any failure (deletes Auth user)
/auth/logout - Revokes All Tokens
python
# Uses Firebase Admin SDK: revoke_refresh_tokens(user_id)
# This invalidates all existing tokens for the user
# No in-memory blacklist needed - survives cold starts
/matches/like - Idempotent with Explicit Queries
python
# 1. Check A→B (explicit query)
# 2. Check B→A (explicit query)
# 3. If match exists, return
# 4. Check reverse for mutual like
# 5. If mutual, update to 'accepted'
# 6. If not, create new pending match
# 7. Update cached friendship_counts
/sisterhood/post - Anonymous with Hashed Poster ID
python
# Stores poster_hash = sha256(f"{user_id}:{daily_salt}")[:16]
# NEVER stores raw user_id in Firestore
# Women can see posts but cannot identify the poster
# Abuse detection still possible via hash (same user posting same day)
6. FRONTEND ARCHITECTURE
6.1 Component Hierarchy
text
App.jsx
├── AuthProvider (Firebase Auth)
│   ├── onAuthStateChanged → user object
│   └── user.getIdToken() for API calls
├── Router
│   ├── Public Routes
│   │   ├── / → LandingScreen (full production, no demo)
│   │   ├── /features → FeaturesScreen
│   │   └── /investors → InvestorScreen
│   ├── Auth Routes
│   │   ├── /register → RegisterScreen
│   │   └── /login → LoginScreen
│   ├── Onboarding
│   │   └── /onboarding → OnboardingScreen
│   │       ├── PsychologicalScales
│   │       ├── BaselineCMI
│   │       ├── AttractivenessCalibration
│   │       └── Dealbreakers
│   └── App Routes (Authenticated)
│       ├── /app → HomeScreen
│       │   ├── MorningFaceThumbnail
│       │   ├── DailyQuestion
│       │   └── Feed
│       ├── /app/discover → DiscoverScreen
│       ├── /app/matches → MatchesScreen
│       ├── /app/profile → ProfileScreen
│       └── /app/sisterhood → SisterhoodScreen (women only)
└── BottomNav (persistent across app routes)
6.2 Custom Hooks
useCamera.js
javascript
// Manages camera access for morning face capture
export const useCamera = () => {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  const startCamera = async () => { ... };
  const stopCamera = () => { ... };
  const capturePhoto = () => { ... };

  return { videoRef, stream, error, startCamera, stopCamera, capturePhoto };
};
useMorningFace.js (Future)
javascript
// Manages morning face upload logic
export const useMorningFace = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadMorningFace = async (imageBase64, timestamp) => { ... };

  return { uploadMorningFace, uploading, error };
};
useDiscover.js (Future)
javascript
// Manages discover card stack logic
export const useDiscover = () => {
  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratedCount, setRatedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadCandidates = async () => { ... };
  const rateAnswer = async (candidateId, isWorstFriend) => { ... };
  const likeUser = async (userId) => { ... };

  return { currentCandidate, ratedCount, loading, rateAnswer, likeUser };
};
6.3 UI Design System
Color Palette
Role	Hex	Usage
Background	#0d0d0d	Main app background
Card Background	#1a1a1a	All cards
Card Border Top	#f5820a	3px orange top border
Primary CTA	#f5c518	Yellow button
Primary CTA Hover	#f5820a	Orange hover
Secondary CTA	Transparent	Orange border
Text Primary	#ffffff	Headings, important text
Text Secondary	#cccccc	Body text
Text Muted	#888888	Muted text
Bobo (🍜)	#f59e0b	Yellow reaction
Cheeto (🔥)	#ef4444	Red reaction
Tiger (🐯)	#10b981	Green reaction
Dead (💀)	#a855f7	Purple reaction
Typography
Element	Font	Size	Weight
Headings (h1-h4)	Bebas Neue	clamp(22px-96px)	Bold, uppercase
Body text	DM Sans	16px	Regular
Buttons	DM Sans	14px	Bold, uppercase
Spacing & Shadows
Element	Value
Card border radius	1rem (rounded-xl)
Button border radius	9999px (rounded-full)
Card shadow	0 4px 6px -1px rgba(0,0,0,0.3)
Card hover shadow	0 8px 20px rgba(245,130,10,0.15)
Button primary shadow	0 4px 15px rgba(245,130,10,0.4)
Button like shadow	0 4px 15px rgba(239,68,68,0.4)
6.4 Button Inventory
Button Name	Location	Class	Size	Colors
Register	RegisterScreen	.btn-primary	44px tall, full width	Yellow bg, orange hover
Login	LoginScreen	.btn-primary	44px tall, full width	Yellow bg, orange hover
Submit Answer 💀	DailyQuestion	.btn-primary	44px tall, full width	Yellow bg, orange hover
💀 Worst Friend	DiscoverScreen	.btn-primary	44px tall, 50% width	Yellow bg, orange hover
❤️ Like	DiscoverScreen	.btn-like	44px tall, full width	Red/orange gradient
Accept	MatchesScreen	.btn-primary	40px tall, auto width	Yellow bg, orange hover
Skip	DiscoverScreen	.btn-secondary	44px tall, 50% width	Transparent, orange border
Refresh	DiscoverScreen	.btn-secondary	40px tall, auto width	Transparent, orange border
Chat	MatchesScreen	.btn-secondary	36px tall, auto width	Transparent, orange border
Logout	ProfileScreen	.btn-secondary	44px tall, full width	Transparent, red text
Morning Faces Tab	HomeScreen	.btn-tab	40px tall, 33% width	Dark bg, orange on active
Answers Tab	HomeScreen	.btn-tab	40px tall, 33% width	Dark bg, orange on active
Popular Tab	HomeScreen	.btn-tab	40px tall, 33% width	Dark bg, orange on active
Worst Tab	MatchesScreen	.btn-tab	40px tall, auto width	Dark bg, orange on active
Bad Tab	MatchesScreen	.btn-tab	40px tall, auto width	Dark bg, orange on active
Pending Bad Tab	MatchesScreen	.btn-tab	40px tall, auto width	Dark bg, orange on active
Pending Match Tab	MatchesScreen	.btn-tab	40px tall, auto width	Dark bg, orange on active
Reaction 🍜	FeedCard	.btn-reaction	36px tall, auto width	Dark bg, yellow on hover
Reaction 🔥	FeedCard	.btn-reaction	36px tall, auto width	Dark bg, red on hover
Reaction 🐯	FeedCard	.btn-reaction	36px tall, auto width	Dark bg, green on hover
Reaction 💀	FeedCard	.btn-reaction	36px tall, auto width	Dark bg, purple on hover
Camera	HomeScreen	.morning-face-cta	64×64px	Orange/yellow gradient
Nav Item	BottomNav	.nav-item	auto	Gray, orange on active with lift
6.5 Wireframe Reference (28 Screens)
#	Screen Name	Status	Key UI Elements	File Reference
1	Welcome/Landing	✅ IMPLEMENTED	Hero, CTA buttons (Register/Login), feature cards	LandingScreen.jsx
2	Registration Form	✅ IMPLEMENTED	Email, phone, password, name, gender, birthday	RegisterScreen.jsx
3	Email/Phone Verification	⏳ FUTURE (v1.2)	6-digit code input, verify button	(Future)
4	ID Verification (Women)	⏳ FUTURE (v1.2)	ID upload, selfie upload, submit	(Future)
5	Verification Pending	⏳ FUTURE (v1.2)	Status message, continue button	(Future)
6	Personality Intro	✅ IMPLEMENTED	Start quiz button	PsychologicalScales.jsx
7	Sample Question (Big Five)	✅ IMPLEMENTED	Question text, 5-point scale	PsychologicalScales.jsx
8	Attractiveness Calibration	✅ IMPLEMENTED	Face image, 1-10 slider	AttractivenessCalibration.jsx
9	Baseline CMI Questions	✅ IMPLEMENTED	Question, text input, GIF/voice options	BaselineCMI.jsx
10	Dealbreakers	✅ IMPLEMENTED	Kids, distance, age range, politics, religion	Dealbreakers.jsx
11	First Morning Face	✅ IMPLEMENTED	Camera capture, preview, upload	MorningFaceCapture.jsx
12	Daily Morning Face	✅ IMPLEMENTED	Streak display, camera button	HomeScreen.jsx
13	Main Feed (Faces Tab)	✅ IMPLEMENTED	Morning faces with reactions	HomeScreen.jsx
14	Popular Tab	✅ IMPLEMENTED	Trending content, top answers	HomeScreen.jsx
15	Daily Question Card	✅ IMPLEMENTED	Question, answer input, submit	DailyQuestion.jsx
16	Answers Feed	✅ IMPLEMENTED	User answers with reactions	HomeScreen.jsx
17	Discover (Answers First)	✅ IMPLEMENTED	Answer card, 💀/Skip buttons, progress bar	DiscoverScreen.jsx
18	Face Reveal	✅ IMPLEMENTED	Morning face photo, ❤️/👎 buttons	DiscoverScreen.jsx
19	Match Confirmation	✅ IMPLEMENTED	Comedy Match Report, send message	MatchesScreen.jsx
20	Chat Screen	⏳ STUB (v1.1)	Message list, input, send	(v1.1)
21	Bad Friends Notification	✅ IMPLEMENTED	Detection alert, accept/decline	MatchesScreen.jsx
22	User Profile	✅ IMPLEMENTED	Morning face history, streak, trust level, stats	ProfileScreen.jsx
23	Trust Level Dashboard	⏳ FUTURE (v1.2)	Progress bar, earning opportunities	(Future)
24	The Sisterhood	✅ IMPLEMENTED	Anonymous posts, flag types, vetting feed	SisterhoodScreen.jsx
25	Bad Friend Backup	⏳ FUTURE (v2)	Trusted contact, date details, activate	(Future)
26	Heat Map	⏳ FUTURE (v2)	Map interface, ghost mode toggle	(Future)
27	Path Crosser	⏳ FUTURE (v2)	Missed connections, second chance slide	(Future)
28	Settings	⏳ FUTURE (v1.2)	Account, privacy, notifications, support	(Future)
Implementation Status Summary:

✅ Implemented: 19 screens

⏳ Stub (v1.1): 1 screen (Chat)

⏳ Future (v1.2+): 8 screens

7. BACKEND ARCHITECTURE
7.1 Directory Structure
text
backend/
├── main.py                          # FastAPI app (36 endpoints)
├── requirements.txt                 # Dependencies
├── .env.example                     # Environment template
├── Procfile                         # Render deployment
│
├── core/                            # Core infrastructure
│   ├── __init__.py
│   ├── config.py                    # Pydantic Settings with app_config cache
│   ├── auth.py                      # Firebase token verification (with revocation check)
│   ├── exceptions.py                # Structured error responses (AppException)
│   ├── middleware.py                # Request ID, logging, GZip
│   ├── rate_limit.py                # In-memory + Firestore-backed rate limiting
│   └── monitoring.py                # Query/endpoint performance monitoring
│
├── services/                        # Business logic
│   ├── __init__.py
│   ├── firebase_client.py           # Firebase Admin SDK wrapper (SYNC)
│   └── friendship_service.py        # 4 friendship layers + cached counts
│
├── utils/                           # Helpers
│   ├── __init__.py
│   └── retry.py                     # Retry with backoff decorator
│
├── api/                             # Route handlers
│   ├── __init__.py
│   └── health.py                    # Health check endpoint
│
├── models/                          # Pydantic models
│   ├── __init__.py
│   └── onboarding.py                # Validation for onboarding endpoints
│
└── service-account-key.json         # Firebase Admin SDK (gitignored)
7.2 Core Services
FirebaseService (services/firebase_client.py)
python
class FirebaseService:
    """Complete Firebase wrapper - SYNC version (no async complexity)"""
    
    # User operations
    def get_user(user_id) -> Optional[Dict]
    def create_user(user_id, user_data) -> Dict
    def update_user(user_id, updates) -> None
    def revoke_user_tokens(user_id) -> None  # P0 FIX
    
    # Morning face operations
    def create_morning_face(face_data) -> str
    def get_morning_faces_by_users(user_ids, limit, cursor) -> Tuple[List, Optional[str]]
    def has_uploaded_today(user_id) -> bool
    
    # Question operations
    def get_today_question() -> Optional[Dict]
    def get_baseline_questions(limit) -> List[Dict]
    def create_answer(answer_data) -> str
    def has_answered(user_id, question_id, answer_type) -> bool
    def delete_baseline_answers(user_id, question_id) -> None
    
    # Reaction operations
    def toggle_reaction(user_id, target_type, target_id, reaction_type) -> Dict
    
    # Follow operations (with friendship_counts caching)
    def follow(follower_id, followed_id) -> None
    def unfollow(follower_id, followed_id) -> None
    def get_following(user_id) -> List[str]
    def get_followers(user_id) -> List[str]
    
    # Friendship counts caching (REC 3)
    def increment_friendship_count(user_id, field, delta) -> None
    def get_friendship_counts(user_id) -> Dict
    
    # Bad friends operations
    def get_bad_friends(user_id, accepted_only) -> List[Dict]
    def create_bad_friend(user_a, user_b, detection_count) -> None
    
    # Storage URL validation (REC 4)
    def validate_storage_url(image_url, user_id, storage_bucket) -> bool
FriendshipService (services/friendship_service.py)
python
class FriendshipService:
    """4 friendship layers - uses cached friendship_counts for summary"""
    
    # LAYER 1: FOLLOWS
    def follow(follower_id, followed_id) -> Dict
    def unfollow(follower_id, followed_id) -> Dict
    def get_followers(user_id) -> List[str]
    def get_following(user_id) -> List[str]
    
    # LAYER 2: BAD FRIENDS (Mutual Humor)
    def get_bad_friends(user_id) -> List[Dict]
    def get_pending_bad_friends(user_id) -> List[Dict]
    def accept_bad_friend(user_id, other_id) -> Dict
    
    # LAYER 3: WORST FRIENDS (Romantic Matches)
    def get_worst_friends(user_id) -> List[Dict]
    
    # LAYER 4: PENDING MATCHES
    def get_pending_matches(user_id) -> List[Dict]
    
    # SUMMARY - 1 read (cached friendship_counts)
    def get_friendship_summary(user_id) -> Dict
7.3 Class Diagrams
Domain Model Class Diagram
text
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DOMAIN CLASS DIAGRAM                            │
│                                                                              │
│  ┌─────────────────────────┐         ┌─────────────────────────┐            │
│  │         User            │         │     MorningFace         │            │
│  ├─────────────────────────┤         ├─────────────────────────┤            │
│  │ +id: str                │ 1    *  │ +id: str                │            │
│  │ +email: str             │───────▶ │ +userId: str            │            │
│  │ +phone: str             │         │ +userName: str          │            │
│  │ +name: str              │         │ +imageUrl: str          │            │
│  │ +gender: Gender         │         │ +timestamp: datetime    │            │
│  │ +trustLevel: int        │         │ +uploadDate: date       │            │
│  │ +streakDays: int        │         │ +reactionCounts: dict   │            │
│  │ +cmiScore: float        │         │ +createdAt: datetime    │            │
│  │ +friendshipCounts: dict │         └─────────────────────────┘            │
│  │ +onboardingComplete: bool│                   │                           │
│  │ +createdAt: datetime    │                   │ 1                         │
│  │ +updatedAt: datetime    │                   │                           │
│  └─────────────────────────┘                   ▼                           │
│              │ 1                      ┌─────────────────────────┐          │
│              │                         │       Reaction          │          │
│              │ 1                       ├─────────────────────────┤          │
│              ▼                         │ +id: str                │          │
│  ┌─────────────────────────┐           │ +userId: str            │          │
│  │  PsychologicalProfile   │           │ +targetType: str        │          │
│  ├─────────────────────────┤           │ +targetId: str          │          │
│  │ +bigFive: dict          │           │ +reactionType: Reaction │          │
│  │ +attachmentStyle: str   │           │ +createdAt: datetime    │          │
│  │ +loveLanguages: dict    │           └─────────────────────────┘          │
│  │ +coreValues: list       │                                                │
│  │ +conflictStyle: str     │                                                │
│  │ +humorStyle: dict       │                                                │
│  │ +sensationSeeking: int  │                                                │
│  │ +updatedAt: datetime    │                                                │
│  └─────────────────────────┘                                                │
│                                                                              │
│  ┌─────────────────────────┐         ┌─────────────────────────┐            │
│  │    DailyQuestion        │         │        Answer           │            │
│  ├─────────────────────────┤         ├─────────────────────────┤            │
│  │ +id: str                │ 1    *  │ +id: str                │            │
│  │ +questionText: str      │───────▶ │ +userId: str            │            │
│  │ +date: date             │         │ +userName: str          │            │
│  │ +isBaseline: bool       │         │ +questionId: str        │            │
│  │ +goldStandardAnswerIds: │         │ +answerText: str        │            │
│  │   list                  │         │ +answerType: str        │            │
│  │ +createdAt: datetime    │         │ +cmiScore: float        │            │
│  └─────────────────────────┘         │ +reactionCounts: dict   │            │
│                                      │ +createdAt: datetime    │            │
│                                      └─────────────────────────┘            │
│                                                                              │
│  ┌─────────────────────────┐         ┌─────────────────────────┐            │
│  │         Match           │         │        Message          │            │
│  ├─────────────────────────┤         ├─────────────────────────┤            │
│  │ +id: str                │ 1    *  │ +id: str                │            │
│  │ +userAId: str           │───────▶ │ +matchId: str           │            │
│  │ +userBId: str           │         │ +senderId: str          │            │
│  │ +status: str            │         │ +content: str           │            │
│  │ +matchedAt: datetime    │         │ +isRead: bool           │            │
│  │ +acceptedAt: datetime   │         │ +createdAt: datetime    │            │
│  └─────────────────────────┘         └─────────────────────────┘            │
│                                                                              │
│  ┌─────────────────────────┐         ┌─────────────────────────┐            │
│  │        Follow           │         │      BadFriend          │            │
│  ├─────────────────────────┤         ├─────────────────────────┤            │
│  │ +followerId: str        │         │ +userA: str             │            │
│  │ +followedId: str        │         │ +userB: str             │            │
│  │ +createdAt: datetime    │         │ +detectionCount: int    │            │
│  └─────────────────────────┘         │ +detectedAt: datetime   │            │
│                                      │ +acceptedAt: datetime   │            │
│                                      └─────────────────────────┘            │
│                                                                              │
│  ┌─────────────────────────┐                                                │
│  │    SisterhoodPost       │                                                │
│  ├─────────────────────────┤                                                │
│  │ +id: str                │                                                │
│  │ +posterHash: str        │  // NOT raw user_id!                          │
│  │ +targetUserId: str      │                                                │
│  │ +targetUsername: str    │                                                │
│  │ +content: str           │                                                │
│  │ +flagType: str          │  // "green", "yellow", "red"                  │
│  │ +createdAt: datetime    │                                                │
│  │ +expiresAt: datetime    │                                                │
│  └─────────────────────────┘                                                │
└─────────────────────────────────────────────────────────────────────────────┘
Service Layer Class Diagram
text
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SERVICE LAYER CLASS DIAGRAM                         │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                           FirebaseService                                ││
│  │  (services/firebase_client.py)                                          ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │  - db: Firestore client                                                 ││
│  │  - bucket: Storage client                                               ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │  + get_user(user_id) → Dict                                             ││
│  │  + create_user(user_id, user_data) → Dict                               ││
│  │  + update_user(user_id, updates) → None                                 ││
│  │  + revoke_user_tokens(user_id) → None                                   ││
│  │  + create_morning_face(face_data) → str                                 ││
│  │  + get_morning_faces_by_users(ids, limit, cursor) → Tuple               ││
│  │  + has_uploaded_today(user_id) → bool                                   ││
│  │  + get_today_question() → Optional[Dict]                                ││
│  │  + get_baseline_questions(limit) → List[Dict]                           ││
│  │  + create_answer(answer_data) → str                                     ││
│  │  + has_answered(user_id, question_id, answer_type) → bool               ││
│  │  + delete_baseline_answers(user_id, question_id) → None                 ││
│  │  + toggle_reaction(user_id, target_type, target_id, reaction_type)→ Dict││
│  │  + follow(follower_id, followed_id) → None                              ││
│  │  + unfollow(follower_id, followed_id) → None                            ││
│  │  + get_following(user_id) → List[str]                                   ││
│  │  + get_followers(user_id) → List[str]                                   ││
│  │  + increment_friendship_count(user_id, field, delta) → None             ││
│  │  + get_friendship_counts(user_id) → Dict                                ││
│  │  + get_bad_friends(user_id, accepted_only) → List[Dict]                 ││
│  │  + create_bad_friend(user_a, user_b, detection_count) → None            ││
│  │  + validate_storage_url(image_url, user_id, bucket) → bool              ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                      │                                       │
│                                      │ uses                                 │
│                                      ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                         FriendshipService                                ││
│  │  (services/friendship_service.py)                                       ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │  - (no direct dependencies - uses FirebaseService)                      ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │  + follow(follower_id, followed_id) → Dict                              ││
│  │  + unfollow(follower_id, followed_id) → Dict                            ││
│  │  + get_followers(user_id) → List[str]                                   ││
│  │  + get_following(user_id) → List[str]                                   ││
│  │  + get_bad_friends(user_id) → List[Dict]                                ││
│  │  + get_pending_bad_friends(user_id) → List[Dict]                        ││
│  │  + accept_bad_friend(user_id, other_id) → Dict                          ││
│  │  + get_worst_friends(user_id) → List[Dict]                              ││
│  │  + get_pending_matches(user_id) → List[Dict]                            ││
│  │  + get_friendship_summary(user_id) → Dict  // 1 read!                   ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                           RateLimiter                                    ││
│  │  (core/rate_limit.py)                                                   ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │  - requests: Dict[str, List[datetime]]                                  ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │  + check(key) → bool                                                    ││
│  │  + get_remaining(key) → int                                             ││
│  │  + get_client_ip(request) → str                                         ││
│  │  + check_registration_rate_limit(email) → None                          ││
│  │  + check_rate_limit(request) → bool                                     ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                           TokenBlacklist                                 ││
│  │  (core/token_blacklist.py) - DELETED                                    ││
│  │                                                                          ││
│  │  REPLACED BY: Firebase revoke_refresh_tokens()                          ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
8. SECURITY ARCHITECTURE
8.1 Security Layers
Layer	Protections
Network	HTTPS only, CORS locked to app domains, rate limiting, 25MB request limit
Application	Firebase token verification with revocation check, Pydantic validation, input sanitization
Data	Passwords hashed by Firebase Auth, E2E encryption for messages (v2), no permanent geolocation storage
Operational	Environment variables for all secrets, .env never committed, API keys in Render env
User Safety	Mandatory verification, graduated trust levels, Ghost Mode, block/report, Bad Friend Backup, Emergency Kill Switch
8.2 Firestore Security Rules (Critical Gates)
javascript
// Sisterhood - CRITICAL GATE
match /sisterhood_posts/{docId} {
  allow read: if isAuthenticated() && isWoman();
  allow create: if isAuthenticated() && isWoman() && !('user_id' in request.resource.data);
  allow delete: if false;
}

// Users - only owner can write
match /users/{userId} {
  allow read: if isAuthenticated();
  allow write: if isOwner(userId);
}

// Morning faces - no client deletion
match /morning_faces/{docId} {
  allow read: if isAuthenticated();
  allow create: if isAuthenticated() && isOwner(request.resource.data.user_id);
  allow delete: if false;  // Backend only via Admin SDK
}

// App config - read only
match /app_config/{docId} {
  allow read: if isAuthenticated();
  allow write: if false;
}

// Rate limits - Admin SDK only
match /rate_limits/{docId} {
  allow read, write: if false;
}
8.3 Storage Security Rules
javascript
// Morning faces - user-specific folder structure
match /morning-faces/{userId}/{fileName} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && request.auth.uid == userId;
  allow delete: if false;  // Backend only
}
8.4 Custom Auth Claims
python
# Set during registration (CRITICAL for Sisterhood)
firebase_auth.set_custom_user_claims(user.uid, {'gender': gender})

# Retrieved in security rules
function isWoman() {
  return request.auth.token.gender == 'woman';
}
9. AUTHENTICATION & AUTHORIZATION
9.1 Auth Flow Diagram
text
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │     │   Backend   │     │  Firebase   │     │  Firestore  │
│   (React)   │     │  (FastAPI)  │     │    Auth     │     │             │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │                   │
       │ 1. POST /auth/register                │                   │
       │    (email, password, gender, name)    │                   │
       │──────────────────▶│                   │                   │
       │                   │                   │                   │
       │                   │ 2. create_user()  │                   │
       │                   │──────────────────▶│                   │
       │                   │                   │                   │
       │                   │ 3. set_custom_    │                   │
       │                   │    user_claims    │                   │
       │                   │    (gender)       │                   │
       │                   │──────────────────▶│                   │
       │                   │                   │                   │
       │                   │ 4. create user    │                   │
       │                   │    document       │                   │
       │                   │──────────────────────────────────────▶│
       │                   │                   │                   │
       │ 5. Registration   │                   │                   │
       │    successful     │                   │                   │
       │◀──────────────────│                   │                   │
       │                   │                   │                   │
       │ 6. Login via      │                   │                   │
       │    Firebase SDK   │                   │                   │
       │    (client-side)  │                   │                   │
       │──────────────────────────────────────▶│                   │
       │                   │                   │                   │
       │ 7. ID token       │                   │                   │
       │◀──────────────────────────────────────│                   │
       │                   │                   │                   │
       │ 8. API call with  │                   │                   │
       │    Bearer token   │                   │                   │
       │──────────────────▶│                   │                   │
       │                   │                   │                   │
       │                   │ 9. verify_id_token│                   │
       │                   │    (check_revoked)│                   │
       │                   │──────────────────▶│                   │
       │                   │                   │                   │
       │                   │ 10. user data     │                   │
       │                   │◀──────────────────│                   │
       │                   │                   │                   │
       │ 11. API response  │                   │                   │
       │◀──────────────────│                   │                   │
9.2 Token Revocation (Logout)
python
# POST /auth/logout
def logout(current_user: dict = Depends(get_current_user)):
    firebase_auth.revoke_refresh_tokens(current_user['id'])
    return {"success": True}

# Token verification with revocation check
decoded_token = firebase_auth.verify_id_token(token, check_revoked=True)
9.3 Gender Claim (Critical for Sisterhood)
Location	Purpose	Set By
Firebase Auth custom claim	Security rules (Sisterhood access)	Backend during registration
Firestore users collection	Profile display, matching	Backend during registration
Frontend state	UI conditional rendering	Frontend after login
10. FRIENDSHIP LAYERS ARCHITECTURE
10.1 Layer Structure
text
LAYER 1: FRIENDS (Follow)
├── Action: Follow/Unfollow
├── Visibility: See morning faces + answers
├── Table: follows
├── Can DM: No (unless also Bad/Worst Friends)
└── Count cached in: friendship_counts.following/followers

LAYER 2: BAD FRIENDS (Mutual Humor)
├── Trigger: 3+ mutual 💀 reactions in 7 days
├── Action: Automatic detection (scheduled polling) + opt-in
├── Visibility: Full profile access
├── Can DM: Yes (text only)
├── Special: "Bad Friends" badge
└── Count cached in: friendship_counts.bad_friends/pending_bad_friends

LAYER 3: WORST FRIENDS (Romantic Match)
├── Trigger: Mutual ❤️ in Discover
├── Action: Both users tap heart
├── Visibility: Full profile + location (if Trust Level 4+)
├── Can DM: Yes (text, voice, media)
├── Special: "Worst Friends" badge
└── Count cached in: friendship_counts.worst_friends

LAYER 4: MATCHES (Pending)
├── Trigger: One-way ❤️
├── Action: Waiting for response
├── Visibility: Limited profile
├── Expires: 7 days without response
└── Count cached in: friendship_counts.pending_matches
10.2 Bad Friends Auto-Detection (Scheduled)
python
# Runs every 6 hours via GitHub Actions
def detect_bad_friends():
    # Get all dead reactions from last 7 days
    reactions = db.collection('reactions')\
        .where('reaction_type', '==', 'dead')\
        .where('created_at', '>=', seven_days_ago)\
        .get()
    
    # Group by target and count mutual reactions
    # Create bad_friends documents where count >= 3
10.3 Friendship Summary Optimization
python
# BEFORE: 6 sequential Firestore reads per profile view
# AFTER: 1 read from cached friendship_counts on user document

def get_friendship_summary(self, user_id: str) -> Dict:
    counts = FirebaseService.get_friendship_counts(user_id)
    return {
        "following": counts.get('following', 0),
        "followers": counts.get('followers', 0),
        "bad_friends": counts.get('bad_friends', 0),
        "pending_bad_friends": counts.get('pending_bad_friends', 0),
        "worst_friends": counts.get('worst_friends', 0),
        "pending_matches": counts.get('pending_matches', 0)
    }
11. DISCOVERY & MATCHING ENGINE
11.1 Answers First Card Stack
text
1. User sees cards with other users' answers to today's question
2. For each answer, user rates: 💀 (Worst Friend) or SKIP
3. After 3 ratings → UNLOCK FACES (UNLOCK_THRESHOLD = 3)
   NOTE: Wireframe said 10, but implemented as 3 for faster dopamine loop
4. User sees morning face gallery of rated users
5. User taps ❤️ or 👎
6. If mutual → WORST FRIENDS match created
7. If not mutual → PENDING MATCH
11.2 Discover Candidate Filtering
python
def discover_matches(user_id: str):
    # Exclude users already followed
    following = friendship_service.get_following(user_id)
    following.append(user_id)
    
    # Exclude users already matched
    matched_a = db.collection('matches').where('user_a', '==', user_id).get()
    matched_b = db.collection('matches').where('user_b', '==', user_id).get()
    already_matched = set()
    for doc in matched_a:
        already_matched.add(doc.to_dict()['user_b'])
    for doc in matched_b:
        already_matched.add(doc.to_dict()['user_a'])
    
    excluded = set(following) | already_matched
    
    # Get answers from users not in excluded list
    # Return candidates with total_candidates count
11.3 Match Creation (Idempotent)
python
def like_user(user_id, target_user_id):
    # Check A→B (explicit query)
    ab = db.collection('matches')\
        .where('user_a', '==', user_id)\
        .where('user_b', '==', target_user_id)\
        .get()
    
    # Check B→A (explicit query)
    ba = db.collection('matches')\
        .where('user_a', '==', target_user_id)\
        .where('user_b', '==', user_id)\
        .get()
    
    if ab or ba:
        return {"mutual": False, "message": "Match already exists"}
    
    # Check reverse for mutual like
    reverse = db.collection('matches')\
        .where('user_a', '==', target_user_id)\
        .where('user_b', '==', user_id)\
        .where('status', '==', 'pending')\
        .get()
    
    if reverse:
        # Mutual! Update to accepted
        match.update({'status': 'accepted'})
        return {"mutual": True, "match_id": match_id}
    
    # Create new pending match
    db.collection('matches').add(match_data)
    return {"mutual": False, "match_id": new_match_id}
12. SAFETY ARCHITECTURE
12.1 Sisterhood (Women-Only Verification Network)
Feature	Implementation
Access control	Firebase custom claim gender='woman' + Firestore security rules
Anonymity	poster_hash = SHA256(user_id + daily_salt)[:16] (not raw UID)
Expiration	30 days, cleaned by GitHub Actions daily
Abuse prevention	Hash allows detecting same user posting same day
No screenshots	Legal warning + technical prevention (future)
12.2 Trust Levels (1-5)
Level	Points Required	Unlocked Features
Level 1	0-19	Feed only, answer questions, react. CANNOT match, DM, or share location.
Level 2	20-49	Match, DM (text only), see morning faces. CANNOT share location.
Level 3	50-99	Voice notes, Island Bullies groups, can REQUEST location share.
Level 4	100-199	Initiate location share, Proximity Icebreaker, heat maps.
Level 5	200+	All features. "Trusted Badge." Council voting.
12.3 Trust Points Earning
Action	Points
Complete verification	+20
Maintain 7-day streak	+1 per week
Receive "Good Friend" endorsement	+5 (max 3/month)
Complete IRL meet verification	+10
30 days with no reports	+5
12.4 Safety Features Status
Feature	Description	Status
Bad Friend Backup	Share date details with trusted contact	⏳ FUTURE (v2)
Emergency Kill Switch	One-tap lockdown of location sharing	⏳ FUTURE (v2)
Ghost Mode	Hide location entirely	⏳ FUTURE (v2)
Block User	Hide all content from blocked user	⏳ FUTURE (v2)
Report User	Moderation queue	⏳ FUTURE (v2)
13. DEPLOYMENT ARCHITECTURE
13.1 Production Deployment Diagram
text
                                    ┌─────────────────────────────────┐
                                    │              USER                │
                                    │     (Mobile/Desktop Browser)     │
                                    └─────────────────┬───────────────┘
                                                      │
                                                      │ HTTPS
                                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              NETLIFY (Frontend)                             │
│                                                                              │
│  • Static React build (Vite)                                                │
│  • CDN distributed globally                                                 │
│  • Automatic HTTPS                                                          │
│  • Security headers (CSP, X-Frame-Options, etc.) in netlify.toml            │
│  • SPA redirects: /* → /index.html 200                                      │
│                                                                              │
│  URL: https://bad-friends-morning-face.netlify.app                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                                      │
                                                      │ HTTPS API Calls
                                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              RENDER (Backend)                               │
│                                                                              │
│  • FastAPI application (Uvicorn)                                           │
│  • Auto-scaling (free tier: spins down after 15 min)                        │
│  • Health check: /status                                                    │
│  • Cold start prevention: UptimeRobot pings every 10 min                    │
│                                                                              │
│  URL: https://meetingmind-d7dx.onrender.com                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                                      │
                                    ┌─────────────┼─────────────┐
                                    │             │             │
                                    ▼             ▼             ▼
                              ┌──────────┐  ┌──────────┐  ┌──────────┐
                              │Firestore │  │  Auth    │  │ Storage  │
                              │Database  │  │ Identity │  │ Images   │
                              └──────────┘  └──────────┘  └──────────┘
                                    │             │             │
                                    └─────────────┼─────────────┘
                                                  │
                                          ┌───────┴───────┐
                                          │ GitHub       │
                                          │ Actions      │
                                          │ (Cron jobs)  │
                                          └───────────────┘
13.2 Environment Variables
Backend (Render):

env
FIREBASE_PROJECT_ID=bad-friends-morning-face
FIREBASE_STORAGE_BUCKET=bad-friends-morning-face.firebasestorage.app
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'
CORS_ORIGINS=["http://localhost:5173","https://bad-friends-morning-face.netlify.app"]
APP_READ_CEILING=40000
USER_HARD_CAP=50
MOCK_DATA_THRESHOLD=20
LOG_LEVEL=INFO
Frontend (Netlify):

env
VITE_API_URL=https://meetingmind-d7dx.onrender.com
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=bad-friends-morning-face.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=bad-friends-morning-face
VITE_FIREBASE_STORAGE_BUCKET=bad-friends-morning-face.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
13.3 Netlify Security Headers (netlify.toml)
toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "microphone=(), geolocation=()"
    Content-Security-Policy = "default-src 'self'; img-src 'self' https://firebasestorage.googleapis.com data: blob:; connect-src 'self' https://*.firebaseio.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://meetingmind-d7dx.onrender.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; media-src 'self' blob:; camera 'self'"
14. BACKGROUND AUTOMATION (GITHUB ACTIONS)
14.1 Scheduled Jobs (Free Tier)
Job	Schedule	Purpose
Seed Daily Question	Daily at 6am UTC	Creates today's question from bank
Cleanup Expired Posts	Daily at 2am UTC	Deletes expired sisterhood_posts
Bad Friends Detection	Every 6 hours	Scans for 3+ mutual 💀 reactions
14.2 Daily Question Seeding Script
python
# scripts/seed_daily_question.py
QUESTION_BANK = [
    "Would you suck Jamie Lee Curtis's big toe for a Klondike bar?",
    "Would you rather fight one Bobby-Lee-sized ant or 100 ant-sized Bobby Lees?",
    # ... 15+ questions
]

today = datetime.utcnow().date().isoformat()
doc_ref = db.collection('daily_questions').document(today)

if not doc_ref.get().exists:
    question_text = random.choice(QUESTION_BANK)
    doc_ref.set({
        "question_text": question_text,
        "date": today,
        "is_baseline": False,
        "gold_standard_answer_ids": []
    })
14.3 Sisterhood Posts Cleanup Script
python
# scripts/cleanup_expired_posts.py
now = datetime.utcnow().isoformat()
expired = db.collection('sisterhood_posts')\
    .where('expires_at', '<', now)\
    .limit(100)\
    .get()

for doc in expired:
    doc.reference.delete()
15. STATE MACHINES
15.1 Trust Level State Machine
text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TRUST LEVEL STATE MACHINE                            │
│                                                                              │
│                                    ┌─────────────────────────────────────┐  │
│                                    │                                     │  │
│                                    ▼                                     │  │
│  ┌──────────────┐    Complete      ┌──────────────┐    Complete 7-day    │  │
│  │   LEVEL 1    │   Verification   │   LEVEL 2    │    streak +          │  │
│  │  (0-19 pts)  │─────────────────▶│  (20-49 pts) │    3 endorsements    │  │
│  │              │   (+20 pts)       │              │─────────────────────▶│  │
│  │ Features:    │                   │ Features:    │                      │  │
│  │ - Feed only  │                   │ - Match      │                      │  │
│  │ - Answer Q   │                   │ - DM (text)  │                      │  │
│  │ - React      │                   │ - See faces  │                      │  │
│  └──────────────┘                   └──────────────┘                      │  │
│         │                                  │                              │  │
│         │ Get reported 3x                  │ Get reported 3x              │  │
│         │ (Red flags)                      │ (Red flags)                  │  │
│         │                                  │                              │  │
│         ▼                                  ▼                              │  │
│  ┌──────────────┐                   ┌──────────────┐    ID Verify +       │  │
│  │   FROZEN     │                   │   LEVEL 3    │    Face Check        │  │
│  │   (Penalty)  │                   │  (50-99 pts) │    + 100 pts         │  │
│  │              │                   │              │─────────────────────▶│  │
│  │ Must complete│                   │ Features:    │                      │  │
│  │ - 5 Hopecore │                   │ - Voice notes│                      │  │
│  │ - 7-day streak│                  │ - Groups     │                      │  │
│  │              │                   │ - Request    │                      │  │
│  │ to unfreeze  │                   │   location   │                      │  │
│  └──────────────┘                   └──────────────┘                      │  │
│         │                                  │                              │  │
│         │ Complete recovery                │ 30-day streak                │  │
│         │                                  │ + 5 endorsements             │  │
│         │                                  │ + 10 meet verifications      │  │
│         ▼                                  │                              │  │
│  ┌──────────────┐                          ▼                              │  │
│  │   LEVEL 1    │                   ┌──────────────┐                      │  │
│  │  (reset)     │                   │   LEVEL 4    │                      │  │
│  └──────────────┘                   │ (100-199 pts)│                      │  │
│                                     │              │                      │  │
│                                     │ Features:    │                      │  │
│                                     │ - Share loc  │                      │  │
│                                     │ - Heat map   │                      │  │
│                                     │ - Proximity  │                      │  │
│                                     │   icebreaker │                      │  │
│                                     └──────────────┘                      │  │
│                                            │                              │  │
│                                            │ 200+ points                  │  │
│                                            │ + 90-day streak              │  │
│                                            │ + Council nomination         │  │
│                                            ▼                              │  │
│                                     ┌──────────────┐                      │  │
│                                     │   LEVEL 5    │                      │  │
│                                     │  (200+ pts)  │                      │  │
│                                     │              │                      │  │
│                                     │ Features:    │                      │  │
│                                     │ - All        │                      │  │
│                                     │ - Trusted    │                      │  │
│                                     │   Badge      │                      │  │
│                                     │ - Council    │                      │  │
│                                     │   voting     │                      │  │
│                                     └──────────────┘                      │  │
└─────────────────────────────────────────────────────────────────────────────┘
15.2 Match State Machine
text
┌─────────────────────────────────────────────────────────────────────────────┐
│                            MATCH STATE MACHINE                              │
│                                                                              │
│                                    ┌─────────────────────────────────────┐  │
│                                    │                                     │  │
│                                    ▼                                     │  │
│  ┌──────────────┐    User A ❤️    ┌──────────────┐    User B ❤️    ┌────┐  │  │
│  │    NONE      │────────────────▶│   PENDING    │────────────────▶│ACCEPTED│ │  │
│  │ (No match)   │    User B ?     │  (A liked)   │    Mutual!      │(MATCHED)│ │  │
│  └──────────────┘                 └──────────────┘                 └────┬───┘  │  │
│         │                                │                                │      │  │
│         │                                │                                │      │  │
│         │ User B ❤️ first               │ User B passes                  │48 hrs│  │
│         │ (asymmetric)                   │ (or ignores)                    │ no   │  │
│         │                                │                                │ msgs │  │
│         ▼                                ▼                                ▼      │  │
│  ┌──────────────┐                 ┌──────────────┐                 ┌────────────┐ │
│  │   PENDING    │                 │   REJECTED   │                 │  EXPIRED   │ │
│  │  (B liked)   │                 │  (Passed)    │                 │ (Ghosted)  │ │
│  └──────┬───────┘                 └──────────────┘                 └────────────┘ │
│         │                                                                         │
│         │ User A ❤️                                                               │
│         │ (mutual)                                                                 │
│         │                                                                         │
│         ▼                                                                         │
│  ┌──────────────┐                                                                 │
│  │   ACCEPTED   │                                                                 │
│  │  (MATCHED)   │─────────────────────────────────────────────────────────────────┘
│  └──────────────┘
│
│  • Comedy Match Report generated at ACCEPTED state
│  • Both users can DM immediately
│  • Match expires after 7 days of no messages (future)
└─────────────────────────────────────────────────────────────────────────────────┘
16. DATA FLOW DIAGRAMS
16.1 Morning Face Upload Flow
text
┌─────────┐                              ┌─────────┐      ┌─────────┐      ┌─────────┐
│  USER   │                              │ Client  │      │ Backend │      │Firestore│
└────┬────┘                              └────┬────┘      └────┬────┘      └────┬────┘
     │                                        │               │                │
     │ 1. Opens app                          │               │                │
     │───────────────────────────────────────▶│               │                │
     │                                        │               │                │
     │ 2. Camera captures photo              │               │                │
     │◀───────────────────────────────────────│               │                │
     │                                        │               │                │
     │ 3. User confirms & uploads            │               │                │
     │───────────────────────────────────────▶│               │                │
     │                                        │               │                │
     │                                        │ 4. Upload to  │                │
     │                                        │    Firebase   │                │
     │                                        │    Storage    │                │
     │                                        │──────────────▶│                │
     │                                        │               │                │
     │                                        │ 5. POST       │                │
     │                                        │    /morning-  │                │
     │                                        │    face       │                │
     │                                        │──────────────▶│                │
     │                                        │               │                │
     │                                        │               │ 6. Validate    │
     │                                        │               │    URL         │
     │                                        │               │                │
     │                                        │               │ 7. Create      │
     │                                        │               │    morning_face│
     │                                        │               │    document    │
     │                                        │               │───────────────▶│
     │                                        │               │                │
     │                                        │               │ 8. Update user │
     │                                        │               │    streak      │
     │                                        │               │───────────────▶│
     │                                        │               │                │
     │                                        │ 9. Response   │                │
     │                                        │    {face_id,   │                │
     │                                        │     streak}    │                │
     │                                        │◀──────────────│                │
     │                                        │               │                │
     │ 10. Feed updates with new face         │               │                │
     │◀───────────────────────────────────────│               │                │
     │                                        │               │                │
16.2 CMI Calculation Flow (Future v1.2)
text
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│  Cron   │      │ Backend │      │Firestore│      │Hugging │      │  Users  │
│(GitHub  │      │ (Worker)│      │         │      │ Face   │      │         │
│ Actions)│      │         │      │         │      │  API   │      │         │
└────┬────┘      └────┬────┘      └────┬────┘      └────┬────┘      └────┬────┘
     │                │                │                │                │
     │ 1. Trigger at  │                │                │                │
     │    midnight    │                │                │                │
     │───────────────▶│                │                │                │
     │                │                │                │                │
     │                │ 2. Fetch all   │                │                │
     │                │    answers for │                │                │
     │                │    today       │                │                │
     │                │───────────────▶│                │                │
     │                │                │                │                │
     │                │ 3. Answers +   │                │                │
     │                │    reaction    │                │                │
     │                │    counts      │                │                │
     │                │◀───────────────│                │                │
     │                │                │                │                │
     │                │ 4. Identify    │                │                │
     │                │    gold standard│               │                │
     │                │    (top 10 by   │               │                │
     │                │    💀 reactions)│               │                │
     │                │                │                │                │
     │                │ 5. Generate    │                │                │
     │                │    embeddings  │                │                │
     │                │    for gold    │                │                │
     │                │    standard    │                │                │
     │                │────────────────────────────────▶│                │
     │                │                │                │                │
     │                │ 6. Embedding   │                │                │
     │                │    vectors     │                │                │
     │                │◀────────────────────────────────│                │
     │                │                │                │                │
     │                │ 7. For all     │                │                │
     │                │    answers:    │                │                │
     │                │    generate    │                │                │
     │                │    embeddings  │                │                │
     │                │────────────────────────────────▶│                │
     │                │                │                │                │
     │                │ 8. Calculate   │                │                │
     │                │    cosine      │                │                │
     │                │    similarity  │                │                │
     │                │    to nearest  │                │                │
     │                │    gold        │                │                │
     │                │                │                │                │
     │                │ 9. CMI =       │                │                │
     │                │    similarity  │                │                │
     │                │    × 100       │                │                │
     │                │                │                │                │
     │                │ 10. Batch      │                │                │
     │                │     update     │                │                │
     │                │     CMI scores │                │                │
     │                │───────────────▶│                │                │
     │                │                │                │                │
     │                │ 11. Update     │                │                │
     │                │    gold_standard│               │                │
     │                │    answer_ids  │                │                │
     │                │───────────────▶│                │                │
     │                │                │                │                │
     │ 12. Complete   │                │                │                │
     │◀───────────────│                │                │                │
     │                │                │                │                │
     │                │                │                │ 13. User sees  │
     │                │                │                │    CMI score  │
     │                │                │                │    in profile │
     │                │                │                │◀───────────────│
16.3 Matching & Discovery Flow
text
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│ User A  │      │ Client  │      │ Backend │      │Firestore│      │ User B  │
└────┬────┘      └────┬────┘      └────┬────┘      └────┬────┘      └────┬────┘
     │                │                │                │                │
     │ 1. Opens       │                │                │                │
     │    Discover    │                │                │                │
     │───────────────▶│                │                │                │
     │                │                │                │                │
     │                │ 2. GET /matches│                │                │
     │                │    /discover   │                │                │
     │                │───────────────▶│                │                │
     │                │                │                │                │
     │                │                │ 3. Get         │                │
     │                │                │    following   │                │
     │                │                │    list        │                │
     │                │                │───────────────▶│                │
     │                │                │                │                │
     │                │                │ 4. Get already │                │
     │                │                │    matched IDs │                │
     │                │                │───────────────▶│                │
     │                │                │                │                │
     │                │                │ 5. Get answers │                │
     │                │                │    from users  │                │
     │                │                │    not excluded│                │
     │                │                │───────────────▶│                │
     │                │                │                │                │
     │                │ 6. Candidates  │                │                │
     │                │    (answers    │                │                │
     │                │     first)     │                │                │
     │                │◀───────────────│                │                │
     │                │                │                │                │
     │ 7. Rates       │                │                │                │
     │    answer as   │                │                │                │
     │    💀 or SKIP  │                │                │                │
     │───────────────▶│                │                │                │
     │                │                │                │                │
     │                │ 8. POST        │                │                │
     │                │    /reactions  │                │                │
     │                │───────────────▶│                │                │
     │                │                │                │                │
     │                │                │ 9. Toggle      │                │
     │                │                │    reaction    │                │
     │                │                │───────────────▶│                │
     │                │                │                │                │
     │ 10. After 3    │                │                │                │
     │     ratings,   │                │                │                │
     │     faces      │                │                │                │
     │     unlock     │                │                │                │
     │                │                │                │                │
     │ 11. Taps ❤️    │                │                │                │
     │───────────────▶│                │                │                │
     │                │                │                │                │
     │                │ 12. POST       │                │                │
     │                │    /matches/   │                │                │
     │                │    like        │                │                │
     │                │───────────────▶│                │                │
     │                │                │                │                │
     │                │                │ 13. Check      │                │
     │                │                │     A→B, B→A   │                │
     │                │                │───────────────▶│                │
     │                │                │                │                │
     │                │                │ 14. Check if   │                │
     │                │                │     B already  │                │
     │                │                │     liked A    │                │
     │                │                │───────────────▶│                │
     │                │                │                │                │
     │                │                │ 15. If mutual: │                │
     │                │                │     create     │                │
     │                │                │     match      │                │
     │                │                │───────────────▶│                │
     │                │                │                │                │
     │                │ 16. Response   │                │                │
     │                │    {mutual:    │                │                │
     │                │     true,      │                │                │
     │                │     match_id}  │                │                │
     │                │◀───────────────│                │                │
     │                │                │                │                │
     │ 17. "It's a    │                │                │                │
     │     match!"    │                │                │                │
     │◀───────────────│                │                │                │
     │                │                │                │                │
     │                │                │                │ 18. User B    │
     │                │                │                │    sees match │
     │                │                │                │    notification│
     │                │                │                │───────────────▶│
17. ERROR HANDLING & RESILIENCE
17.1 Error Response Structure
python
{
  "error": {
    "code": "AUTH_001",           // Error code (see ErrorCodes class)
    "message": "Invalid token",    // Human-readable message
    "timestamp": "2026-04-12T10:00:00Z",
    "request_id": "uuid-1234",     // For tracing
    "details": {}                  // Optional additional info
  }
}
17.2 Error Codes
Category	Code	Description
Auth	AUTH_001	Invalid token
AUTH_002	Token expired
AUTH_003	Token revoked
AUTH_004	Unauthorized
User	USER_001	User not found
USER_002	User already exists
USER_003	User cap reached
Content	CONTENT_001	Already uploaded today
CONTENT_002	Already answered
CONTENT_003	Already reacted
Rate Limit	RATE_001	Rate limit exceeded
RATE_002	Registration rate limit
RATE_003	Daily read limit
Validation	VALIDATION_001	Invalid gender
VALIDATION_002	Invalid reaction
VALIDATION_003	Invalid flag
VALIDATION_004	Invalid URL
Server	SERVER_001	Internal error
SERVER_002	Database error
SERVER_003	Storage error
17.3 Retry with Backoff
python
@retry_with_backoff(max_retries=3, base_delay=1.0, max_delay=10.0)
def firestore_operation():
    # Automatically retries on failure with exponential backoff
    return db.collection('users').document(user_id).get()
17.4 Graceful Degradation
Feature	Fallback Behavior
Firestore unavailable	Return HTTP 503, client retries
Firebase Auth unavailable	Login fails, show error message
Storage upload fails	Return error, client can retry
Rate limit exceeded	Return HTTP 429 with retry-after header
User cap reached	Return HTTP 503 with waitlist message
18. MONITORING & ANALYTICS
18.1 Key Metrics
Category	Metric	Collection Method
Acquisition	Daily signups	Firebase Auth logs
Activation	Morning face completion	Firestore query
Engagement	DAU/WAU	Firestore last_active field (future)
Matching	Matches per user	Firestore matches collection
Safety	Reports per user	Firestore reports collection (future)
Performance	API response times	monitoring.py decorator
Firestore	Read/write counts	Firebase Console
18.2 Health Check Endpoint
python
@app.get("/status")
def health_check():
    firestore_status = check_firestore()
    storage_status = check_storage()
    
    return {
        "status": "healthy" if all_checks else "degraded",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "checks": {
            "firestore": firestore_status,
            "storage": storage_status
        }
    }
18.3 Cold Start Prevention
bash
# UptimeRobot pings /status every 10 minutes
# Prevents Render from spinning down the backend
19. PRODUCTION BEST PRACTICES IMPLEMENTED
19.1 Backend
Practice	Implementation	Status
Pydantic Settings	Centralized config from env	✅
Health check with dependencies	/status checks Firestore + Storage	✅
Idempotent operations	Match creation, reaction toggles	✅
Type hints	All functions typed	✅
Configurable app_config	Firestore document for runtime config	✅
Structured error responses	AppException with error codes	✅
Request ID	UUID middleware, X-Request-ID header	✅
Retry with backoff	Firebase operation wrapper	✅
Cursor pagination	Feed and list endpoints	✅
Rate limiting	In-memory + Firestore-backed	✅
Structured logging	JSON format with request_id	✅
CORS strict	Whitelist from env	✅
Compression	GZip middleware	✅
Query logging	Log slow Firestore queries	✅
19.2 Frontend
Practice	Implementation	Status
Environment config	Vite env vars	✅
Token refresh	Firebase SDK automatic	✅
Error boundaries	React error boundaries	✅
Lazy loading	React.lazy() for routes	✅
Firestore offline persistence	Firebase SDK built-in	✅
Security headers	Netlify CSP	✅
19.3 Firestore
Practice	Implementation	Status
Security rules	Deployed before backend	✅
Composite indexes	firestore.indexes.json	✅
Data denormalization	user_name in answers	✅
Pagination	Cursor-based	✅
Batch writes	For atomic operations	✅
TTL policies	GitHub Actions cleanup	✅
20. FUTURE ARCHITECTURAL DIRECTIONS (v1.2+)
Feature	Target Version	Description	Free Tier Viability
True CMI (vector embeddings)	v1.2	Hugging Face embeddings + cosine similarity	✅ (HF free tier)
AI Question Generation	v1.2	Groq API for personalized questions	✅ (30 req/min)
Voice Notes	v1.2	AssemblyAI transcription	✅ (100 hrs/mo)
Real-time Chat	v1.2	Firestore listeners (already architected)	✅
ID Verification (Persona)	v1.2	ID + selfie for women	⚠️ (pay-per-use)
Location Heat Maps	v1.3	Mapbox for aggregated location	✅ (50k loads/mo)
Push Notifications	v1.3	Firebase Cloud Messaging	✅
Trust Level Dashboard	v1.2	Progress UI, earning opportunities	✅
Settings Screen	v1.2	Account, privacy, notifications	✅
In-app Purchases (Fancy B)	v2.0	Stripe integration	⚠️ (requires payment)
21. PROTECTED INFORMATION REGISTRY
21.1 NEVER Expose (Internal Only)
Information	Where it lives	Exposure Risk
CMI calculation formula	Backend service	High - protect
Trust level point thresholds	Backend + Firestore	Medium - vague public description OK
Sisterhood verification process	Backend + security rules	High - protect
Gender claim logic	Backend + Firebase Auth	High - protect
Matching algorithm weights	Backend service	High - protect
Location aggregation method	Backend service (v2)	Medium - vague description OK
Psychological scale scoring	Backend service	Medium
Attractiveness calibration formula	Backend service	Medium
Service account JSON	Render env vars	CRITICAL - never expose
21.2 Safe to Expose Publicly
Feature list (without implementation details)

User flows (high-level)

Technology stack (React, FastAPI, Firebase)

Team information

Business projections (investor page)

Market analysis (investor page)

22. APPENDIX: ALL 102 ARCHITECTURAL DECISIONS
22.1 Foundational Decisions (1-6)
#	Decision	Status
1	Auth ownership: Backend creates Firebase users via Admin SDK	✅
2	Existing users: Wipe test data, start clean	✅
3	Security posture: Lightweight for demo (50 invited users)	✅
4	Cloud Functions: Spark free tier, scheduled polling only	✅
5	CMI: Simplified algorithm, no vector DB in v1	✅
6	Usage gating: Backend enforces, frontend displays	✅
22.2 Spark Free Tier Limits (7-8)
#	Decision	Status
7	Target ceiling: 25,000 reads/day (50% of limit)	✅
8	User-level cap: REMOVED, App-level: 40,000 reads/day	✅
22.3 Architecture (9-11)
#	Decision	Status
9	One Google project, one backend, one frontend	✅
10	Frontend uses Firebase Client SDK only for token acquisition	✅
11	Backend uses Firebase Admin SDK for everything	✅
22.4 Schema Decisions (12-26)
#	Decision	Status
12	users collection with Firebase Auth UID as document ID	✅
13	users/{uid}/meta/summary for cached friendship counts	✅
14	morning_faces with denormalized user_name	✅
15	daily_questions with date as document ID	✅
16	answers with deterministic ID for baseline	✅
17	reactions with deterministic ID for idempotent toggle	✅
18	matches with status field	✅
19	messages with timestamp-based ID	✅
20	follows with composite ID	✅
21	bad_friends with sorted composite ID	✅
22	psychological_profiles as subcollection	✅
23	sisterhood_posts with poster_hash (not user_id)	✅
24	location_heartbeats with deterministic ID	✅
25	user_questions for AI-generated questions	✅
26	app_config for runtime configuration	✅
22.5 Usage Gating (27-31)
#	Decision	Status
27	Gate 1: Registration cap at 50 users (HTTP 503)	✅
28	Gate 2: App-level daily read limit at 40,000 (HTTP 429)	✅
29	Gate 3: Per-user daily read limit (REMOVED)	❌
30	Read tracking: In-memory with Firestore backup	✅
31	Gate 4: Waitlist/donation page (DEFERRED to v2)	⏳
22.6 CMI Implementation (32-33)
#	Decision	Status
32	Demo CMI formula: mutual_dead + answer_overlap + shared_bad + streak	✅
33	Production CMI upgrade path: vector embeddings in v3	📋
22.7 Background Automation (34-39)
#	Decision	Status
34	Bad Friends detection: Every 6 hours via GitHub Actions	✅
35	Sisterhood cleanup: Daily at 2am UTC	✅
36	Location heartbeats cleanup: Every 30 minutes	✅
37	App config reset: Daily at 00:01 UTC	✅
38	User read counter reset: Daily at 00:05 UTC	✅
39	Total scheduled daily reads: 2,000-3,000	✅
22.8 Firestore Security Rules (40-51)
#	Decision	Status
40	Sisterhood requires isWoman()	✅
41	Users: read if authenticated, write if owner	✅
42	Morning faces: read if authenticated, write if owner	✅
43	Daily questions: read if authenticated, write false	✅
44	Answers: read if authenticated, write if authenticated	✅
45	Reactions: read if authenticated, write if authenticated	✅
46	Matches: read if participant, write if authenticated	✅
47	Messages: read if participant, write if sender	✅
48	Follows, Bad Friends, etc.: read/write if authenticated	✅
49	Psychological profiles: owner only	✅
50	App config: read if authenticated, write false	✅
51	email_verified check: DEFERRED to v2	⏳
22.9 Composite Indexes (52-64)
#	Index	Status
52	messages: match_id + created_at	✅
53	morning_faces: user_id + created_at	✅
54	answers: question_id + reaction_counts.dead	✅
55	answers: user_id + answer_type + question_id	✅
56	reactions: user_id + target_type + target_id	✅
57	reactions: reaction_type + created_at	✅
58	matches: user_a + status	✅
59	matches: user_b + status	✅
60	bad_friends: user_a + accepted_at	✅
61	bad_friends: user_b + accepted_at	✅
62	sisterhood_posts: expires_at	✅
63	location_heartbeats: expires_at	✅
64	daily_questions: is_baseline	✅
22.10 Deployment Order (65-74)
#	Phase	Status
65	Phase 0: Mock Mode (REMOVED)	❌
66	Phase 1: Firebase Project Setup	✅
67	Phase 2: Rules and Indexes	✅
68	Phase 3: Backend Migration	✅
69	Phase 4: Frontend Migration	✅
70	Phase 5: Data Migration (seed data only)	✅
71	Phase 6: Cloud Functions (GitHub Actions)	✅
72	Phase 7: Testing	✅
73	Phase 8: Cutover	✅
74	Total estimated time: 8-10 hours	✅
22.11 Production Upgrade Path (75-77)
#	Decision	Status
75	What doesn't change: schema, endpoints, screens, rules	📋
76	What upgrades: Spark → Blaze, add Neon for vectors	📋
77	Decision deferred to v3: Primary database migration	📋
22.12 Gap Resolutions (78-102)
All 25 gaps from external audit resolved. See migration report for details.

END OF ARCHITECTURE DOCUMENT
Bad Friends Morning Face Build — v1.1 (Firebase Migration)

Last Updated: April 12, 2026
Status: Production Ready | Free Tier Compliant | No Credit Card Required

Total Lines: ~2,400
Screens Implemented: 19 of 28
API Endpoints: 36
Firestore Collections: 14
Architectural Decisions: 102

🍜