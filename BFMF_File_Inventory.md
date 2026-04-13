Complete File Inventory - BEFORE vs AFTER Migration
Current Structure (Before Migration) vs Proposed Structure (After Migration)
BACKEND COMPARISON
Current Backend Files (3 files)
text
backend/
├── main.py                          # 353 lines, Supabase everywhere
├── services/
│   ├── __init__.py                  # Empty init
│   └── friendship_service.py        # Supabase client
└── requirements.txt                 # supabase, fastapi, etc.
Proposed Backend Files (19 files)
text
backend/
├── main.py                          # COMPLETE REWRITE - Firebase/Firestore
├── requirements.txt                 # MODIFIED - removed supabase, added firebase-admin
├── .env.example                     # NEW - environment template
├── .env                             # User creates (gitignored)
├── Dockerfile                       # UNCHANGED - already exists
│
├── core/                            # NEW DIRECTORY
│   ├── __init__.py                  # NEW
│   ├── config.py                    # NEW - Pydantic Settings
│   ├── auth.py                      # NEW - Firebase token verification
│   ├── exceptions.py                # NEW - Structured error responses
│   ├── middleware.py                # NEW - Request ID, logging, GZip
│   ├── rate_limit.py                # NEW - In-memory rate limiting
│   ├── monitoring.py                # NEW - Query/endpoint monitoring
│   └── token_blacklist.py           # NEW - Logout token blacklist
│
├── services/                        # MODIFIED DIRECTORY
│   ├── __init__.py                  # UNCHANGED
│   └── friendship_service.py        # REWRITTEN - Firestore version
│
├── utils/                           # NEW DIRECTORY
│   ├── __init__.py                  # NEW
│   └── retry.py                     # NEW - Retry with backoff
│
├── api/                             # NEW DIRECTORY
│   ├── __init__.py                  # NEW
│   └── health.py                    # NEW - Health check endpoint
│
└── firebase_client.py               # NEW - Firebase Admin wrapper (moved to services/ in final)
Summary Backend Changes:

Files: 3 → 19 (+16 files)

Directories: 1 → 5 (+4 directories)

Lines of code: ~450 → ~1800

FRONTEND COMPARISON
Current Frontend Files (33 files)
text
frontend/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── package.json
├── .env
├── .env.example
│
├── public/
│   ├── BFMF_Banner..png
│   └── badfriends.jpeg
│
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── index.css
    │
    ├── contexts/
    │   └── AuthContext.jsx           # Supabase version
    │
    ├── hooks/
    │   └── useCamera.js
    │
    ├── utils/
    │   ├── mockData.js
    │   └── supabaseClient.js         # TO BE DELETED
    │
    ├── components/
    │   ├── Banner.jsx
    │   ├── BottomNav.jsx
    │   ├── DailyQuestion.jsx
    │   ├── MorningFaceCapture.jsx
    │   ├── MorningFaceThumbnail.jsx
    │   └── onboarding/
    │       ├── AttractivenessCalibration.jsx
    │       ├── BaselineCMI.jsx
    │       ├── Dealbreakers.jsx
    │       └── PsychologicalScales.jsx
    │
    └── screens/
        ├── DiscoverScreen.jsx
        ├── FeaturesScreen.jsx
        ├── HomeScreen.jsx
        ├── InvestorScreen.jsx
        ├── LandingScreen.jsx
        ├── LoginScreen.jsx
        ├── MatchesScreen.jsx
        ├── OnboardingScreen.jsx
        ├── ProfileScreen.jsx
        ├── RegisterScreen.jsx
        └── SisterhoodScreen.jsx
Proposed Frontend Files (34 files - net +1)
text
frontend/
├── index.html                       # UNCHANGED
├── vite.config.js                   # UNCHANGED
├── tailwind.config.js               # UNCHANGED
├── postcss.config.js                # UNCHANGED
├── eslint.config.js                 # UNCHANGED
├── package.json                     # MODIFIED - add firebase
├── .env                             # MODIFIED - Firebase vars replace Supabase vars
├── .env.example                     # MODIFIED - Firebase placeholders
├── netlify.toml                     # NEW - security headers + redirects
│
├── public/
│   ├── BFMF_Banner..png             # UNCHANGED
│   ├── badfriends.jpeg              # UNCHANGED
│   └── _headers                     # NEW - security headers
│
└── src/
    ├── main.jsx                     # UNCHANGED
    ├── App.jsx                      # MODIFIED - token retrieval (1 line)
    ├── App.css                      # UNCHANGED
    ├── index.css                    # UNCHANGED
    │
    ├── contexts/
    │   └── AuthContext.jsx          # REWRITTEN - Firebase version
    │
    ├── hooks/
    │   └── useCamera.js             # UNCHANGED
    │
    ├── utils/
    │   ├── mockData.js              # UNCHANGED
    │   ├── supabaseClient.js        # DELETED
    │   └── firebaseClient.js        # NEW - Firebase initialization
    │
    ├── components/
    │   ├── Banner.jsx               # UNCHANGED
    │   ├── BottomNav.jsx            # UNCHANGED
    │   ├── DailyQuestion.jsx        # MODIFIED - token retrieval (1 line)
    │   ├── MorningFaceCapture.jsx   # MODIFIED - Firebase Storage upload
    │   ├── MorningFaceThumbnail.jsx # UNCHANGED
    │   └── onboarding/              # ALL UNCHANGED (call backend APIs)
    │       ├── AttractivenessCalibration.jsx
    │       ├── BaselineCMI.jsx
    │       ├── Dealbreakers.jsx
    │       └── PsychologicalScales.jsx
    │
    └── screens/
        ├── DiscoverScreen.jsx       # MODIFIED - token retrieval (1 line)
        ├── FeaturesScreen.jsx       # UNCHANGED
        ├── HomeScreen.jsx           # MODIFIED - token retrieval + configurable threshold
        ├── InvestorScreen.jsx       # UNCHANGED
        ├── LandingScreen.jsx        # REWRITTEN - full production (no demo)
        ├── LoginScreen.jsx          # UNCHANGED (calls AuthContext)
        ├── MatchesScreen.jsx        # MODIFIED - token retrieval (1 line)
        ├── OnboardingScreen.jsx     # UNCHANGED (calls backend APIs)
        ├── ProfileScreen.jsx        # MODIFIED - token retrieval + Firebase logout
        ├── RegisterScreen.jsx       # UNCHANGED (calls AuthContext)
        └── SisterhoodScreen.jsx     # MODIFIED - token retrieval (1 line)
Summary Frontend Changes:

Files: 33 → 34 (net +1)

New files: firebaseClient.js, netlify.toml, _headers

Deleted files: supabaseClient.js

Rewritten files: AuthContext.jsx, LandingScreen.jsx

Modified files (1 line change): App.jsx, HomeScreen.jsx, DiscoverScreen.jsx, MatchesScreen.jsx, ProfileScreen.jsx, SisterhoodScreen.jsx, DailyQuestion.jsx

Modified files (major): MorningFaceCapture.jsx (Storage upload)

Unchanged files: 20+ files

INFRASTRUCTURE FILES (NEW - Not in Current Structure)
text
infrastructure/                      # NEW DIRECTORY
├── firestore.rules                  # NEW - Firestore security rules
├── storage.rules                    # NEW - Storage security rules
└── firestore.indexes.json           # NEW - Composite indexes
DOCUMENTATION FILES (NEW - Not in Current Structure)
text
docs/
├── CHANGELOG.md                     # NEW - Version history
└── IMPLEMENTATION_GUIDE.md          # NEW - Step-by-step migration guide
SUMMARY TABLE
Category	Current	After Migration	Change
Backend Files	3	19	+16
Backend Directories	1	5	+4
Frontend Files	33	34	+1
Frontend Directories	7	7	0
Infrastructure Files	0	3	+3
Documentation Files	4	6	+2
Total Files	40	62	+22
Files Deleted	-	1	supabaseClient.js
Files Rewritten	-	4	main.py, friendship_service.py, AuthContext.jsx, LandingScreen.jsx
Files Modified (minor)	-	9	Token retrieval changes
Files Unchanged	-	28	No changes needed
VISUAL DIRECTORY TREE - AFTER MIGRATION
text
bad-friends-morning-face-build/
│
├── backend/
│   ├── main.py                          # REWRITTEN
│   ├── requirements.txt                 # MODIFIED
│   ├── .env.example                     # NEW
│   ├── Dockerfile                       # UNCHANGED
│   │
│   ├── core/                            # NEW
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── auth.py
│   │   ├── exceptions.py
│   │   ├── middleware.py
│   │   ├── rate_limit.py
│   │   ├── monitoring.py
│   │   └── token_blacklist.py
│   │
│   ├── services/                        # MODIFIED
│   │   ├── __init__.py
│   │   └── friendship_service.py        # REWRITTEN
│   │
│   ├── utils/                           # NEW
│   │   ├── __init__.py
│   │   └── retry.py
│   │
│   └── api/                             # NEW
│       ├── __init__.py
│       └── health.py
│
├── frontend/
│   ├── index.html                       # UNCHANGED
│   ├── vite.config.js                   # UNCHANGED
│   ├── tailwind.config.js               # UNCHANGED
│   ├── postcss.config.js                # UNCHANGED
│   ├── eslint.config.js                 # UNCHANGED
│   ├── package.json                     # MODIFIED
│   ├── .env                             # MODIFIED
│   ├── .env.example                     # MODIFIED
│   ├── netlify.toml                     # NEW
│   │
│   ├── public/
│   │   ├── BFMF_Banner..png             # UNCHANGED
│   │   ├── badfriends.jpeg              # UNCHANGED
│   │   └── _headers                     # NEW
│   │
│   └── src/
│       ├── main.jsx                     # UNCHANGED
│       ├── App.jsx                      # MODIFIED
│       ├── App.css                      # UNCHANGED
│       ├── index.css                    # UNCHANGED
│       │
│       ├── contexts/
│       │   └── AuthContext.jsx          # REWRITTEN
│       │
│       ├── hooks/
│       │   └── useCamera.js             # UNCHANGED
│       │
│       ├── utils/
│       │   ├── mockData.js              # UNCHANGED
│       │   ├── supabaseClient.js        # DELETED
│       │   └── firebaseClient.js        # NEW
│       │
│       ├── components/
│       │   ├── Banner.jsx               # UNCHANGED
│       │   ├── BottomNav.jsx            # UNCHANGED
│       │   ├── DailyQuestion.jsx        # MODIFIED
│       │   ├── MorningFaceCapture.jsx   # MODIFIED
│       │   ├── MorningFaceThumbnail.jsx # UNCHANGED
│       │   └── onboarding/              # ALL UNCHANGED
│       │       ├── AttractivenessCalibration.jsx
│       │       ├── BaselineCMI.jsx
│       │       ├── Dealbreakers.jsx
│       │       └── PsychologicalScales.jsx
│       │
│       └── screens/
│           ├── DiscoverScreen.jsx       # MODIFIED
│           ├── FeaturesScreen.jsx       # UNCHANGED
│           ├── HomeScreen.jsx           # MODIFIED
│           ├── InvestorScreen.jsx       # UNCHANGED
│           ├── LandingScreen.jsx        # REWRITTEN
│           ├── LoginScreen.jsx          # UNCHANGED
│           ├── MatchesScreen.jsx        # MODIFIED
│           ├── OnboardingScreen.jsx     # UNCHANGED
│           ├── ProfileScreen.jsx        # MODIFIED
│           ├── RegisterScreen.jsx       # UNCHANGED
│           └── SisterhoodScreen.jsx     # MODIFIED
│
├── infrastructure/                      # NEW
│   ├── firestore.rules
│   ├── storage.rules
│   └── firestore.indexes.json
│
├── docs/
│   ├── architecture.md                  # UNCHANGED
│   ├── context.md                       # UNCHANGED
│   ├── roadmap.md                       # UNCHANGED
│   ├── wireframe.md                     # UNCHANGED
│   ├── CHANGELOG.md                     # NEW
│   └── IMPLEMENTATION_GUIDE.md          # NEW
│
└── .gitignore                           # UNCHANGED (add .env, service-account-key.json)
Files to Delete After Migration
File	Reason
frontend/src/utils/supabaseClient.js	Supabase removed
backend/.env (old)	Replace with new Firebase version
frontend/.env (old)	Replace with new Firebase version
Files to Add to .gitignore
gitignore
# Add these lines
backend/.env
backend/service-account-key.json
frontend/.env
Summary: What Changes Where
Type	Count	Examples
NEW directories	5	backend/core/, backend/utils/, backend/api/, infrastructure/
NEW files	22	All core/, utils/, api/, infrastructure/, documentation
REWRITTEN files	4	main.py, friendship_service.py, AuthContext.jsx, LandingScreen.jsx
MODIFIED files	9	Token retrieval in screens, MorningFaceCapture.jsx, package.json
UNCHANGED files	28	Most components, hooks, onboarding, mockData, CSS
DELETED files	1	supabaseClient.js
This is the complete before/after inventory.