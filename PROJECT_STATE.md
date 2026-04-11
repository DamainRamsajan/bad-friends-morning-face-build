
markdown

PROJECT_STATE.md - Complete Update (This Chat Session)
markdown
---
## UPDATE: April 9-10, 2026 - Complete Session Record
### All work completed in this chat session

---

## 1. NEWLY COMPLETED FEATURES

### 1.1 Friendship Layers (Phase 6.4)

| Component | Status | Details |
|-----------|--------|---------|
| `follows` table | ✅ Created | follower_id, followed_id, created_at |
| `bad_friends` table | ✅ Created | user_a, user_b, detection_count, detected_at, accepted_at |
| `detect_bad_friends()` trigger | ✅ Created | Auto-detects 3+ mutual 💀 reactions in 7 days |
| `get_friendship_summary()` function | ✅ Created | Returns counts for all 4 friendship layers |
| `friendship_service.py` | ✅ Created | 10+ methods for friendship management |
| Friendship endpoints (10+) | ✅ Added | Follow, unfollow, bad_friends, worst_friends, etc. |

### 1.2 Frontend Screens (Phase 6.5-6.9)

| Screen | Status | Features |
|--------|--------|----------|
| `MatchesScreen.jsx` | ✅ Created | 4 friendship layers with tabs, accept buttons, chat placeholders |
| `ProfileScreen.jsx` | ✅ Created | User profile, stats, morning face history, logout |
| `DiscoverScreen.jsx` | ✅ Created | Card stack, 3 ratings to unlock faces, 💀/skip/like buttons |
| `SisterhoodScreen.jsx` | ✅ Created | Placeholder for women-only safety space |
| `BottomNav.jsx` | ✅ Created | 4-tab navigation with active states |
| `Banner.jsx` | ✅ Created | Top banner with streak display |
| `MorningFaceThumbnail.jsx` | ✅ Created | Compact camera button (expands to modal) |

### 1.3 CSS & UI System

| Component | Status | Details |
|-----------|--------|---------|
| Tailwind CSS | ✅ Downgraded | v4.2.2 → v3.4.17 |
| Button classes | ✅ Created | `.btn-primary`, `.btn-secondary`, `.btn-tab`, `.btn-reaction`, `.btn-like`, `.nav-item` |
| Gradient background | ✅ Applied | Orange/yellow gradient on all screens |
| Mock data | ✅ Expanded | 3x larger dataset with funny Bad Friends content |

### 1.4 Onboarding Redirect Fix

| Solution | Status | Details |
|----------|--------|---------|
| localStorage flag | ✅ Implemented | `bf_onboarding_complete` stored on completion |
| App.jsx check | ✅ Updated | Checks localStorage first before API call |
| Logout handler | ✅ Updated | Clears localStorage on logout |

### 1.5 Deployment (v1.0.0)

| Service | URL | Status |
|---------|-----|--------|
| Netlify (Frontend) | https://bad-friends-morning-face.netlify.app | ✅ LIVE |
| Render (Backend) | https://bad-friends-morning-face-build.onrender.com | ✅ LIVE |
| Git tag | `v1.0.0` | ✅ Created |
| Branch | `v1.0.0-release` | ✅ Created |

### 1.6 Marketing Audit Implementation (v1.0.1 Phase 1)

| Element | Before | After |
|---------|--------|-------|
| Background | Orange gradient | Near-black (#0d0d0d) |
| Headings | Inter font | Bebas Neue (bold, uppercase) |
| Tagline | Small serif | Large, yellow "Faces" accent |
| CTA Button | Image | Yellow styled button with orange hover |
| Social Proof | None | "10,000+ bad friends already signed up" |
| Feature Cards | #111827 | #1a1a1a with orange top border, yellow titles |
| How It Works | Basic cards | Giant background numbers, dashed connector line |
| Safety Section | Bullet list | 2x2 grid with icons and orange borders |
| Footer | Low contrast | Proper visibility with hover states |

---

## 2. SUPABASE DNS ISSUE (Identified)

### Problem Description

| Test | Result |
|------|--------|
| `nslookup valyrdrdwceszcuuytprn.supabase.co` | NXDOMAIN |
| Dashboard status | Shows "Healthy" |
| Auth endpoint | ✅ Working |
| Storage endpoint | ✅ Working |
| Database connection | ❌ Failing |

### Known Issue References

- GitHub #38521: "Direct DB hostname does not resolve — NXDOMAIN"
- GitHub #35131: "Attempts to access project via the API fail with DNS error"
- GitHub #36900: "DNS resolution error - nslookup returns No answer"

### Decision Made

**Migrate from Supabase to Neon PostgreSQL in v1.1**

| Reason | Explanation |
|--------|-------------|
| DNS reliability | Neon has no known DNS issues |
| Free tier | 0.5 GB storage, 190 compute hours/month |
| PostgreSQL compatible | Existing schema works unchanged |
| No credit card | Free tier available |

---

## 3. NEW CSS CLASSES (All Screens)

```css
/* Primary CTA - Yellow/Orange Gradient */
.btn-primary {
    background: linear-gradient(135deg, #f5820a 0%, #f5c518 100%);
    color: #1a1000;
    padding: 14px 24px;
    border-radius: 9999px;
    box-shadow: 0 4px 15px rgba(245, 130, 10, 0.4);
}

/* Secondary - Orange Outline */
.btn-secondary {
    background: transparent;
    border: 2px solid #f5820a;
    color: #f5820a;
    padding: 12px 20px;
    border-radius: 9999px;
}

/* Tab Buttons */
.btn-tab {
    background: #1a1f2e;
    color: #9ca3af;
    padding: 10px 20px;
    border-radius: 40px;
    text-transform: uppercase;
}
.btn-tab.active {
    background: linear-gradient(135deg, #f5820a, #f5c518);
    color: #1a1000;
}

/* Reaction Buttons */
.btn-reaction {
    background: #1a1f2e;
    border: 1px solid #2d3a5f;
    padding: 8px 16px;
    border-radius: 9999px;
}
.btn-reaction-bobo:hover { background: rgba(245, 155, 11, 0.2); border-color: #f59e0b; }
.btn-reaction-cheeto:hover { background: rgba(239, 68, 68, 0.2); border-color: #ef4444; }
.btn-reaction-tiger:hover { background: rgba(16, 185, 129, 0.2); border-color: #10b981; }
.btn-reaction-dead:hover { background: rgba(168, 85, 247, 0.2); border-color: #a855f7; }

/* Like Button */
.btn-like {
    background: linear-gradient(135deg, #ef4444, #f97316);
    color: white;
    padding: 14px 24px;
    border-radius: 9999px;
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
}

/* Navigation Items */
.nav-item {
    transition: all 0.2s ease;
}
.nav-item.active {
    color: #f5820a;
    transform: translateY(-4px);
    text-shadow: 0 0 8px rgba(245, 130, 10, 0.5);
}
4. FILES CREATED IN THIS SESSION
Backend
text
backend/services/friendship_service.py     ✅ NEW
backend/Dockerfile                         ✅ NEW
Frontend - Screens
text
frontend/src/screens/MatchesScreen.jsx     ✅ NEW
frontend/src/screens/ProfileScreen.jsx     ✅ NEW
frontend/src/screens/DiscoverScreen.jsx    ✅ NEW
frontend/src/screens/SisterhoodScreen.jsx  ✅ NEW
frontend/src/screens/LandingScreen.jsx     ✅ REDESIGNED
Frontend - Components
text
frontend/src/components/BottomNav.jsx      ✅ NEW
frontend/src/components/Banner.jsx         ✅ NEW
frontend/src/components/MorningFaceThumbnail.jsx ✅ NEW
Frontend - Utils
text
frontend/src/utils/mockData.js             ✅ NEW (expanded)
5. FILES MODIFIED IN THIS SESSION
File	Changes
backend/main.py	Added friendship endpoints, CORS fix
frontend/src/App.jsx	Added routes, localStorage onboarding check
frontend/src/screens/HomeScreen.jsx	Updated tabs, reactions, mock data
frontend/src/screens/OnboardingScreen.jsx	Added localStorage flag
frontend/src/components/BottomNav.jsx	Updated to nav-item class
frontend/src/index.css	Added button classes, gradient background
frontend/tailwind.config.js	Updated for v3, brand colors
frontend/.env	Fixed duplicate VITE_API_URL
6. NEW ENDPOINTS AVAILABLE
Endpoint	Method	Purpose
/friends/follow/{user_id}	POST	Follow a user
/friends/follow/{user_id}	DELETE	Unfollow a user
/friends/followers	GET	Get my followers
/friends/following	GET	Get users I follow
/bad-friends/list	GET	Get accepted Bad Friends
/bad-friends/pending	GET	Get pending requests
/bad-friends/accept/{user_id}	POST	Accept Bad Friend
/worst-friends/list	GET	Get romantic matches
/matches/pending	GET	Get pending likes
/friends/summary	GET	Get all layer counts
7. DEPLOYMENT STATUS
Service	URL	Status
Frontend (Netlify)	https://bad-friends-morning-face.netlify.app	✅ LIVE
Backend (Render)	https://bad-friends-morning-face-build.onrender.com	✅ LIVE
v1.0.0 Tag	v1.0.0	✅ Created
v1.0.1 Branch	v1.0.1	✅ Created
8. KNOWN ISSUES (End of Session)
Issue	Status	Fix Version
Supabase DNS (NXDOMAIN)	❌ Unresolved	v1.1 (Neon migration)
Button image transparency on HomeScreen tabs	🟡 Needs image editing	v1.0.1
CTA button size on LandingScreen	🟡 Needs adjustment	v1.0.1
Onboarding redirect	✅ RESOLVED	v1.0.0
Netlify SPA routing	✅ RESOLVED	v1.0.0
9. WHAT'S LEFT FOR v1.0.1
Phase	Component	Status
2	index.css - Dark theme	⏳ Next
3	HomeScreen.jsx updates	⏳ Pending
4	OnboardingScreen.jsx styling	⏳ Pending
5	Demo Mode (disable auth)	⏳ Pending
6	Mock Data Expansion (30+ entries)	⏳ Pending
7	Button Size Improvements	⏳ Pending
8	Testing & Deployment	⏳ Pending
10. WHAT'S LEFT FOR v1.1
Feature	Description
Neon Database Migration	Replace Supabase PostgreSQL
Feed Component	Real friends' morning faces and answers
Real Matching Logic	Replace mock data in Discover
AI Question Generation	Groq API integration
Sisterhood Backend	Complete implementation
11. COMMANDS FROM THIS SESSION
bash
# Branch for v1.0.1
git checkout -b v1.0.1
git push origin v1.0.1

# Tag v1.0.0
git tag v1.0.0
git push origin v1.0.0

# Start backend
cd backend && python3 -m uvicorn main:app --reload --port 8000

# Start frontend
cd frontend && npm run dev
END OF UPDATE

---
## UPDATE: April 8, 2026 - 11:14 PM (Post-Phase 6.4 through 6.9)

### NEWLY COMPLETED (Since last PROJECT_STATE.md)

| Step | Component | Status | Timestamp |
|------|-----------|--------|-----------|
| 6.4.1 | Database tables (bad_friends, triggers, functions) | ✅ Complete | April 9, 2:00 PM |
| 6.4.2 | `backend/services/friendship_service.py` | ✅ Created | April 9, 2:15 PM |
| 6.4.3 | Friendship endpoints in `main.py` (10 new endpoints) | ✅ Added | April 9, 2:30 PM |
| 6.4.4 | `backend/services/__init__.py` | ✅ Created | April 9, 2:30 PM |
| 6.5 | `frontend/src/screens/MatchesScreen.jsx` | ✅ Created | April 9, 3:00 PM |
| 6.6 | `frontend/src/screens/ProfileScreen.jsx` | ✅ Created | April 9, 3:15 PM |
| 6.7 | `frontend/src/components/BottomNav.jsx` | ✅ Updated | April 9, 3:30 PM |
| 6.8 | `frontend/src/App.jsx` routes | ✅ Fixed | April 9, 3:45 PM |
| 6.9 | Testing and verification | ✅ Complete | April 9, 4:00 PM |

### NEW FILES THAT NOW EXIST
backend/services/init.py ✅ NEW
backend/services/friendship_service.py ✅ NEW
frontend/src/screens/MatchesScreen.jsx ✅ NEW
frontend/src/screens/ProfileScreen.jsx ✅ NEW

text

### UPDATED FILES
backend/main.py ✅ Added friendship endpoints
frontend/src/components/BottomNav.jsx ✅ Updated with all tabs
frontend/src/App.jsx ✅ Fixed (HomeScreen inline)

text

### NEW ENDPOINTS NOW AVAILABLE

| Endpoint | Method | Added |
|----------|--------|-------|
| `/friends/follow/{user_id}` | POST | April 9 |
| `/friends/follow/{user_id}` | DELETE | April 9 |
| `/friends/followers` | GET | April 9 |
| `/friends/following` | GET | April 9 |
| `/bad-friends/list` | GET | April 9 |
| `/bad-friends/pending` | GET | April 9 |
| `/bad-friends/accept/{user_id}` | POST | April 9 |
| `/worst-friends/list` | GET | April 9 |
| `/matches/pending` | GET | April 9 |
| `/friends/summary` | GET | April 9 |

### WHAT STILL DOES NOT EXIST (No change from previous state)
❌ frontend/src/screens/DiscoverScreen.jsx
❌ frontend/src/screens/SisterhoodScreen.jsx
❌ frontend/src/screens/HomeScreen.jsx (still inline in App.jsx)
❌ frontend/src/components/Banner.jsx
❌ frontend/src/components/DailyQuestion.jsx
❌ frontend/src/components/Feed.jsx
❌ frontend/src/components/FeedCard.jsx

text

### CURRENT STATUS AS OF April 8, 2026 - 11:15 PM

| Component | Status |
|-----------|--------|
| Backend | ✅ Running on port 8000 |
| Frontend | ✅ Running on port 5173 |
| Authentication | ✅ Working |
| Morning face upload | ✅ Working |
| Friendship backend | ✅ Complete |
| MatchesScreen UI | ✅ Complete |
| ProfileScreen UI | ✅ Complete |
| BottomNav | ✅ Complete |
| DiscoverScreen | ❌ Not started |
| Sisterhood | ❌ Not started |

### NEXT STEP (Pending confirmation)

**Step 6.10: Create DiscoverScreen** - Card stack for matching (answers first, 3 ratings to unlock faces)

---

April 8, 1004pm

bad-friends-morning-face-build/
├── backend/
│   ├── main.py                    ✅ Updated with friendship endpoints
│   ├── .env                       ✅ Keys (your existing)
│   ├── requirements.txt           ✅ Dependencies
│   └── services/
│       ├── __init__.py            ✅ Created
│       └── friendship_service.py  ✅ Created
├── frontend/
│   ├── src/
│   │   ├── App.jsx                ✅ Complete routes
│   │   ├── screens/
│   │   │   ├── LandingScreen.jsx  ✅
│   │   │   ├── FeaturesScreen.jsx ✅
│   │   │   ├── InvestorScreen.jsx ✅
│   │   │   ├── RegisterScreen.jsx ✅
│   │   │   ├── LoginScreen.jsx    ✅
│   │   │   ├── OnboardingScreen.jsx ✅
│   │   │   ├── HomeScreen.jsx     ⏳ Needs Feed
│   │   │   ├── MatchesScreen.jsx  ❌ Next
│   │   │   └── ProfileScreen.jsx  ❌ Next
│   │   └── components/
│   │       ├── BottomNav.jsx      ⏳ Needs update
│   │       └── MorningFaceCapture.jsx ✅
│   └── .env                       ✅ API URL
└── docs/
    ├── architecture.md
    ├── context.md
    ├── roadmap.md
    ├── wireframe.md
    └── PROJECT_STATE.md           ✅ Updated

Date: April 8, 2026, 12:39pm
Status: Backend + Frontend Running | Auth Working | Morning Face Upload Working

Files That Exist (Current State)
text
bad-friends-morning-face-build/
│
├── backend/
│   ├── main.py                    ✅ All endpoints working
│   ├── .env                       ✅ Supabase keys
│   └── requirements.txt           ✅ Dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                ✅ Routes + inline HomeScreen
│   │   ├── main.jsx               ✅ Entry point
│   │   ├── index.css              ✅ Tailwind + dark theme
│   │   │
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx    ✅ register, login, logout
│   │   │
│   │   ├── screens/
│   │   │   ├── RegisterScreen.jsx ✅
│   │   │   └── LoginScreen.jsx    ✅
│   │   │
│   │   ├── components/
│   │   │   └── MorningFaceCapture.jsx  ✅ Camera + upload
│   │   │
│   │   ├── hooks/
│   │   │   └── useCamera.js       ✅ Stabilized
│   │   │
│   │   └── utils/
│   │       └── supabaseClient.js  ✅ Configured
│   │
│   ├── public/
│   │   ├── BFMF_Banner..png       ✅
│   │   └── badfriends.jpeg        ✅
│   │
│   ├── .env                       ✅ API keys
│   ├── tailwind.config.js         ✅
│   ├── postcss.config.js          ✅
│   └── package.json               ✅
│
└── docs/
    ├── architecture.md            ✅
    ├── context.md                 ✅
    ├── roadmap.md                 ✅
    ├── wireframe.md               ✅
    └── BUILD_GUIDE.md             ✅
Files Changed in Last 24 Hours (from git log)
text
0ba4599 Completed Wireframe.md
├── frontend/public/BFMF_Banner..png
├── frontend/public/badfriends.jpeg
├── frontend/src/App.jsx
├── frontend/src/components/MorningFaceCapture.jsx
└── frontend/src/hooks/useCamera.js

ca4efa9 checkpoint test
├── .gitignore
└── CHANGELOG.md
What's Missing (Need to Create)
text
❌ src/components/Banner.jsx
❌ src/components/DailyQuestion.jsx
❌ src/components/BottomNav.jsx
❌ src/components/Feed.jsx
❌ src/screens/HomeScreen.jsx (currently inline in App.jsx)
❌ src/screens/DiscoverScreen.jsx
❌ src/screens/MatchesScreen.jsx
❌ src/screens/ProfileScreen.jsx
❌ src/screens/ChatScreen.jsx
Where We Are in BUILD_GUIDE.md
Phase	Status
Phase 0-5 (Setup → Morning Face)	✅ Complete
Phase 6 (Daily Questions)	🟡 40% (backend done, UI missing)
Phase 7 (Feed & Reactions)	⏳ Not Started
Phase 8 (Discover & Matching)	⏳ Not Started
Phase 9 (Chat)	⏳ Not Started
Phase 10 (Deployment)	⏳ Not Started
Next Steps (Recommended)
Phase 6 UI - Create DailyQuestion.jsx, add to HomeScreen

UI Polish - Extract Banner, add BottomNav, use VITE_API_URL

Phase 7 - Feed component with reactions

Phase 8-10 - Discover, matching, chat, deploy

---
# Bad Friends - Project State (As of April 8, 2026)

## LIVE AND WORKING 

### Backend (FastAPI - port 8000)
- ✅ `main.py` - Complete with all endpoints
- ✅ `/auth/register` - Email/phone registration
- ✅ `/auth/login` - JWT token login
- ✅ `/profile` - Returns user object with `streak_days`, `last_morning_face`, `name`, `email`
- ✅ `/morning-face` - POST with `image_url`, `timestamp` → returns `{face_id, streak_days}`
- ✅ `/morning-face/feed` - GET returns friends' faces only
- ✅ `/questions/today` - GET returns `{question: {id, question_text, date, has_answered}}`
- ✅ `/questions/answer` - POST with `question_id`, `answer_text` → returns `{success, answer_id}`
- ✅ `/reactions` - POST with `target_type`, `target_id`, `reaction_type`
- ❌ `/matches/discover` - Placeholder (not implemented)
- ❌ `/matches/like` - Placeholder
- ❌ `/matches` - Placeholder
- ❌ `/messages` - Placeholder

### Frontend (React - port 5173)

#### Core Files (WORKING - DO NOT REPLACE)
| File | Purpose | Status |
|------|---------|--------|
| `src/App.jsx` | Main routes, auth provider | ✅ Working |
| `src/contexts/AuthContext.jsx` | useAuth hook | ✅ Working |
| `src/screens/RegisterScreen.jsx` | Registration form | ✅ Working |
| `src/screens/LoginScreen.jsx` | Login form | ✅ Working |
| `src/components/MorningFaceCapture.jsx` | Camera, upload, streak update | ✅ Working |
| `src/hooks/useCamera.js` | Camera access hook | ✅ Working |
| `src/utils/supabaseClient.js` | Supabase client | ✅ Working |

#### UI Files (TO BE ADDED)
| File | Purpose | Status |
|------|---------|--------|
| `src/components/Banner.jsx` | Top banner with streak | ❌ Not created |
| `src/components/DailyQuestion.jsx` | Today's question component | ❌ Not created |
| `src/components/BottomNav.jsx` | Bottom navigation bar | ❌ Not created |
| `src/screens/HomeScreen.jsx` | Main screen (currently in App.jsx) | ❌ Needs extraction |
| `src/screens/DiscoverScreen.jsx` | Placeholder | ❌ Not created |
| `src/screens/MatchesScreen.jsx` | Placeholder | ❌ Not created |
| `src/screens/ProfileScreen.jsx` | Placeholder | ❌ Not created |

## KNOWN ISSUES

1. **Banner cannot read `user.streak_days`** - Auth user object doesn't have this. Must receive as prop from HomeScreen.

2. **Production fetch URLs hardcoded** - Must use `import.meta.env.VITE_API_URL` everywhere.

3. **`/morning-face/feed` returns friends' faces only** - Cannot be used to check user's own uploads. Use `profile.last_morning_face` instead.

## ENVIRONMENT VARIABLES (Already Set)

```env
# frontend/.env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://valyrddwceszcuuytprn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# backend/.env
SUPABASE_URL=https://valyrddwceszcuuytprn.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
WHAT TO BUILD NEXT (In Order)
✅ Banner component (with streak as prop)

✅ DailyQuestion component (no CMI)

✅ BottomNav component (with useLocation sync)

✅ Extract HomeScreen from App.jsx

✅ Add placeholders for Discover/Matches/Profile

⏳ Phase 7: Friends Feed with reactions

⏳ Phase 8: Discover card stack

⏳ Phase 9: Matching and chat

CRITICAL API PATTERNS (Copy These)
Fetch with token
jsx
const token = (await supabase.auth.getSession()).data.session?.access_token;
const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
Profile response structure
json
{
  "success": true,
  "profile": {
    "id": "...",
    "name": "Alex",
    "streak_days": 12,
    "last_morning_face": "2026-04-08T13:00:00Z",
    "trust_level": 2
  }
}
Today's question response
json
{
  "success": true,
  "question": {
    "id": "...",
    "question_text": "Would you suck Jamie Lee Curtis's big toe...",
    "date": "2026-04-08",
    "has_answered": false
  }
}
Answer submission
jsx
POST ${VITE_API_URL}/questions/answer
Body: question_id=...&answer_text=...
Response: { "success": true, "answer_id": "..." }
FILES THAT SHOULD NEVER BE OVERWRITTEN
src/components/MorningFaceCapture.jsx

src/hooks/useCamera.js

src/contexts/AuthContext.jsx

src/utils/supabaseClient.js

backend/main.py

backend/.env

frontend/.env

text

---

## HOW THIS DOCUMENT HELPS

| Problem | Solution in PROJECT_STATE.md |
|---------|------------------------------|
| New chat doesn't know what files exist | Lists every file with status |
| New chat assumes `user.streak_days` exists | Documents that Auth user doesn't have it |
| New chat hardcodes localhost | Shows correct pattern with env var |
| New chat doesn't know API response shapes | Documents exact JSON responses |
| New chat might overwrite working code | Lists protected files |

---

## FINAL ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| **Corrected the errors I pointed out** | 100% | They fixed CMI, upload check, BottomNav |
| **Read your documents thoroughly** | 70% | Missed the Auth user vs Profile distinction |
| **Understood your backend API** | 85% | Got endpoints right, missed `/profile` field nuances |
| **Can proceed safely** | 90% | With `PROJECT_STATE.md`, they'd be 100% |

---

## RECOMMENDATION

**Give the new chat `PROJECT_STATE.md` before they write any more code.**

Tell them:

> "Read PROJECT_STATE.md first. Pay special attention to:
> 1. The Banner component must receive `streak` as a prop - Auth user doesn't have it
> 2. Use `import.meta.env.VITE_API_URL` everywhere, not hardcoded localhost
> 3. The list of files you should NOT overwrite
> 
> After reading, confirm you understand these three points, then proceed."

---