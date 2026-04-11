ARCHITECTURE.md

UPDATE April 10th 10:19pm

ARCHITECTURE.md - Complete Update (This Chat Session)
markdown
---
## APPENDIX B: Architectural Decisions - April 9-10, 2026 Session
### All architectural changes and design standards established in this chat

---

## 1. NEW DESIGN STANDARD (Marketing Audit)

### 1.1 Core Principle

**The LandingScreen redesign (v1.0.1 Phase 1) is now the official design standard for ALL screens.**

All future UI work must follow these principles established in the marketing audit:

| Principle | Implementation |
|-----------|----------------|
| Background | Near-black (#0d0d0d) - never orange gradient |
| Headings | Bebas Neue font, uppercase, white or yellow |
| Cards | #1a1a1a background, orange top border (3px), rounded-xl |
| Primary CTAs | Yellow (#f5c518) with orange hover (#f5820a) |
| Secondary CTAs | Transparent with orange border |
| Accent color | Orange (#f5820a) for borders, icons, dividers |
| Highlight color | Yellow (#f5c518) for important text |
| Body text | DM Sans, #cccccc (secondary), #888888 (muted) |

### 1.2 Color Palette (Official)

```css
:root {
    /* Backgrounds */
    --bg-page: #0d0d0d;        /* Main background - near black */
    --bg-card: #1a1a1a;        /* Card background */
    --bg-input: #1a1a1a;        /* Input background */
    
    /* Brand Colors */
    --orange: #f5820a;          /* Accent - borders, icons, secondary CTAs */
    --orange-deep: #e86a00;     /* Darker orange for hover states */
    --yellow: #f5c518;          /* Primary CTA - yellow button */
    
    /* Text Colors */
    --text-primary: #ffffff;    /* White - headings, important text */
    --text-secondary: #cccccc;  /* Light gray - body text */
    --text-muted: #888888;      /* Dark gray - muted text */
    
    /* Card Styles */
    --card-bg: #1a1a1a;
    --card-border-top: 3px solid var(--orange);
    --card-border-radius: 1rem;
    
    /* Button Styles */
    --btn-primary-bg: var(--yellow);
    --btn-primary-hover: var(--orange);
    --btn-primary-text: #1a1000;
    --btn-secondary-border: 2px solid var(--orange);
    --btn-secondary-text: var(--orange);
}
1.3 Typography System
css
/* Headings - Bebas Neue (bold, uppercase) */
h1, h2, h3, h4, .font-display {
    font-family: 'Bebas Neue', Impact, sans-serif;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: var(--text-primary);
}

/* Body Text - DM Sans */
body, p, .font-body {
    font-family: 'DM Sans', system-ui, sans-serif;
    color: var(--text-secondary);
}

/* Heading Sizes */
h1 { font-size: clamp(48px, 8vw, 96px); }
h2 { font-size: clamp(32px, 5vw, 52px); }
h3 { font-size: clamp(22px, 3vw, 30px); }
1.4 Card Design Standard
css
/* Standard Card - Used on ALL screens */
.bf-card {
    background: var(--bg-card);
    border-top: 3px solid var(--orange);
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.bf-card:hover {
    box-shadow: 0 8px 20px rgba(245, 130, 10, 0.15);
    transform: translateY(-2px);
}
1.5 Button System
Class	Purpose	Styling
.btn-primary	Primary CTA	Yellow bg, dark text, orange hover
.btn-secondary	Secondary action	Transparent, orange border, orange text
.btn-tab	Tab navigation	Dark bg, gray text, gradient on active
.btn-reaction	Reaction buttons	Dark bg, colored border on hover
.btn-like	Like button	Red/orange gradient
.nav-item	Bottom nav	Gray, orange on active with lift
2. FOUR FRIENDSHIP LAYERS ARCHITECTURE
2.1 Layer Structure
text
LAYER 1: FRIENDS (Follow)
├── Action: Follow/Unfollow
├── Visibility: See morning faces + answers
├── Table: follows
└── Can DM: No

LAYER 2: BAD FRIENDS (Mutual Humor)
├── Trigger: 3+ mutual 💀 reactions in 7 days
├── Action: Automatic detection + opt-in
├── Table: bad_friends
├── Can DM: Yes (text only)
└── Special: "Bad Friends" badge

LAYER 3: WORST FRIENDS (Romantic Match)
├── Trigger: Mutual ❤️ in Discover
├── Table: matches (status='accepted')
├── Can DM: Yes (text, voice, media)
└── Special: "Worst Friends" badge

LAYER 4: MATCHES (Pending)
├── Trigger: One-way ❤️
├── Table: matches (status='pending')
└── Expires: 7 days without response
2.2 Auto-Detection Trigger
sql
-- Detects 3+ mutual 💀 reactions in 7 days
-- Runs automatically on each reaction insert
CREATE TRIGGER trigger_detect_bad_friends
    AFTER INSERT ON reactions
    FOR EACH ROW
    EXECUTE FUNCTION detect_bad_friends();
2.3 Friendship Service
python
class FriendshipService:
    """Complete friendship layer management"""
    
    # Layer 1
    async def follow(self, follower_id, followed_id)
    async def unfollow(self, follower_id, followed_id)
    async def get_followers(self, user_id)
    async def get_following(self, user_id)
    
    # Layer 2
    async def get_bad_friends(self, user_id)
    async def get_pending_bad_friends(self, user_id)
    async def accept_bad_friend(self, user_id, other_id)
    
    # Layer 3 & 4
    async def get_worst_friends(self, user_id)
    async def get_pending_matches(self, user_id)
    async def get_friendship_summary(self, user_id)
3. ONBOARDING REDIRECT ARCHITECTURE
3.1 LocalStorage Pattern (Official Solution)
javascript
// Why: Prevents race conditions between frontend state and backend persistence
// When: After dealbreakers completion

// Set flag immediately on completion
localStorage.setItem('bf_onboarding_complete', 'true');
window.location.href = '/app';

// Check flag before API call in App.jsx
const localFlag = localStorage.getItem('bf_onboarding_complete');
if (localFlag === 'true') {
    setHasCompletedOnboarding(true);
    return;
}

// Clear on logout
localStorage.removeItem('bf_onboarding_complete');
4. SUPABASE DNS FAILURE - MIGRATION ARCHITECTURE
4.1 Current State
Component	Status	Evidence
Database DNS	❌ Failing	NXDOMAIN
Auth	✅ Working	Separate infrastructure
Storage	✅ Working	Direct URLs accessible
4.2 Migration Decision
Migrate database to Neon PostgreSQL in v1.1

text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    POST-MIGRATION ARCHITECTURE                               │
│                                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                │
│  │   Netlify    │────▶│    Render    │────▶│    Neon      │                │
│  │  (Frontend)  │◀────│  (Backend)   │◀────│ (PostgreSQL) │                │
│  └──────────────┘     └──────────────┘     └──────────────┘                │
│         │                    │                    │                         │
│         ▼                    ▼                    ▼                         │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                │
│  │  Supabase    │     │  Supabase    │     │  Supabase    │                │
│  │  (Auth)      │     │  (Storage)   │     │  (Realtime)  │                │
│  └──────────────┘     └──────────────┘     └──────────────┘                │
│                                                                              │
│  Keep Supabase for Auth and Storage. Migrate only database to Neon.         │
└─────────────────────────────────────────────────────────────────────────────┘
4.3 Why Neon
Requirement	Neon	Supabase
DNS reliability	✅	❌
PostgreSQL compatible	✅	✅
Free tier	0.5 GB, 190 compute hrs	0.5 GB, pauses after 1 week
Always-on available	✅ ($19/mo Launch tier)	✅ ($25/mo Pro tier)
5. TAILWIND CSS DECISION
5.1 Version Lock
Decision: Lock to Tailwind CSS v3.4.17

Reason: v4 has compatibility issues with custom color classes and the @tailwind directive pattern we rely on.

bash
# Locked versions in package.json
"tailwindcss": "3.4.17",
"postcss": "8.4.47",
"autoprefixer": "10.4.20"
5.2 Configuration Pattern
js
// tailwind.config.js - Standard v3 format
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'badfriends': { ... },
        'primary': '#ef4444',
        'accent': '#f59e0b',
      },
    },
  },
  plugins: [],
}
css
/* index.css - Standard v3 format */
@tailwind base;
@tailwind components;
@tailwind utilities;
6. BUTTON CLASS SYSTEM (Official)
6.1 Class Reference
Class	When to Use
.btn-primary	Submit, Register, Login, Complete Onboarding, Next Question, Accept
.btn-secondary	Skip, Pass, Cancel, Refresh
.btn-tab	All tab navigation (add .active for current tab)
.btn-reaction	🍜 🔥 🐯 💀 reaction buttons (add hover class)
.btn-like	Like button in Discover screen
.nav-item	Bottom navigation items (add .active for current page)
6.2 Usage Examples
jsx
{/* Primary CTA */}
<button className="btn-primary">Submit Answer 💀</button>

{/* Secondary Action */}
<button className="btn-secondary">Skip</button>

{/* Tab with active state */}
<button className={`btn-tab ${activeTab === 'faces' ? 'active' : ''}`}>
    Morning Faces
</button>

{/* Reaction Button */}
<button className="btn-reaction btn-reaction-bobo">
    🍜 <span>12</span>
</button>

{/* Bottom Navigation */}
<button className={`nav-item ${location.pathname === '/app' ? 'active' : ''}`}>
    🏠 Home
</button>
7. DEPLOYMENT ARCHITECTURE
7.1 Frontend (Netlify)
bash
# Required for SPA routing
# File: public/_redirects
/* /index.html 200

# Environment variables
VITE_SUPABASE_URL=https://valyrdrdwceszcuuytprn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=https://bad-friends-morning-face-build.onrender.com
7.2 Backend (Render)
dockerfile
# Dockerfile
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y gcc g++
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]
7.3 CORS Configuration
python
# Production CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://bad-friends-morning-face.netlify.app",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
8. NEW API ENDPOINTS (Friendship Layer)
Endpoint	Method	Service
/friends/follow/{user_id}	POST	FriendshipService
/friends/follow/{user_id}	DELETE	FriendshipService
/friends/followers	GET	FriendshipService
/friends/following	GET	FriendshipService
/bad-friends/list	GET	FriendshipService
/bad-friends/pending	GET	FriendshipService
/bad-friends/accept/{user_id}	POST	FriendshipService
/worst-friends/list	GET	FriendshipService
/matches/pending	GET	FriendshipService
/friends/summary	GET	FriendshipService
9. KNOWN ARCHITECTURAL ISSUES
Issue	Status	Target Fix
Supabase DNS (NXDOMAIN)	❌ Open	v1.1 (Neon migration)
Button image transparency	🟡 In Progress	v1.0.1
Onboarding redirect	✅ Fixed	v1.0.0
Tailwind v4 incompatibility	✅ Fixed	Locked to v3
10. FUTURE ARCHITECTURAL DIRECTIONS (v1.1+)
Feature	Target Version	Description
Neon Database Migration	v1.1	Replace Supabase PostgreSQL
Feed Component	v1.1	Real friends' morning faces and answers
Real Matching Logic	v1.1	Replace mock data in Discover
AI Question Generation	v1.1	Groq API integration
Sisterhood Backend	v1.1	Complete implementation
Desktop Grid Layout	v1.2	Responsive multi-column feed
END OF ARCHITECTURE UPDATE

---

 ARCHITECTURE.md - FINAL v1.0
## Bad Friends Morning Face Build
### Last Updated: April 8, 2026

## TABLE OF CONTENTS

1. Core Differentiators (Protected)
2. Complete v1 Feature Set
3. Enhanced Onboarding Flow
4. AI Question Generation System
5. Four Friendship Layers
6. Single Feed Architecture
7. Discovery & Matching Engine
8. Safety Architecture (Sisterhood + Location)
9. Data Model (Updated)
10. API Specification (Updated)
11. Deployment Architecture
12. Protected Information Registry

---

## 1. CORE DIFFERENTIATORS (PROTECTED - Internal Only)

| # | Differentiator | Public Description | Internal Implementation |
|---|----------------|-------------------|------------------------|
| 1 | Morning Face Required | "Daily vulnerability requirement" | Mandatory photo upload before 11:59 AM local time, streak tracking |
| 2 | Humor Compatibility | "Proprietary humor analysis" | CMI based on gold standard reactions + LLM embeddings (v2) |
| 3 | Answers First | "Personality before photos" | Card stack shows answers, faces unlock after 3 ratings |
| 4 | Trust-Based Safety | "Graduated trust architecture" | 5 levels, 0-200+ points, location only at Level 4+ |
| 5 | Community Verification | "Peer-vetted safety network" | Sisterhood (women-only), Bad Faith Alerts |
| 6 | Authenticity Over Polish | "No filters. No retakes." | Camera timestamp verification, EXIF data check |

---

## 2. COMPLETE v1 FEATURE SET

### Phase 0: Foundation (✅ COMPLETE)
- Supabase project with 8 tables
- FastAPI backend (15+ endpoints)
- React + Vite + Tailwind frontend
- Email/phone authentication
- Morning face upload with camera
- Streak tracking

### Phase 1: Onboarding Enhancement (🆕 TO BUILD)
**Purpose:** Collect psychological and comedic data for matching

| Step | Component | Questions | Est. Time |
|------|-----------|-----------|-----------|
| 1 | Email/Phone Verify | - | 2 min |
| 2 | Basic Profile | Name, birthday, location, gender | 1 min |
| 3 | Psychological Scales (7) | 50 questions (funny, engaging format) | 8 min |
| 4 | Baseline CMI | 5 gold standard questions | 3 min |
| 5 | Attractiveness Calibration | Rate 10 faces | 2 min |
| 6 | Dealbreakers | Kids, distance, age, politics | 1 min |
| 7 | First Morning Face | Camera upload | 1 min |

**Total onboarding time:** ~18 minutes

**Psychological Scales Implementation:**
- Break into sections with progress bar
- Use card-based UI with emoji reactions
- Questions phrased humorously (Bad Friends style)
- Store results in `psychological_profiles` table

**Baseline CMI Questions (Gold Standard):**
"Would you suck Jamie Lee Curtis's big toe for a Klondike bar?"

"If you had unlimited money, would you buy Janice Joplin's toenail?"

"Would you rather fight one Bobby-Lee-sized ant or 100 ant-sized Bobby Lees?"

"Rate your current tiredness as a weather forecast."

"What's something you're NOT going to feel guilty about today?"

text

### Phase 2: AI Question System (🆕 TO BUILD)

**Question Generation (Nightly at 2 AM):**
```python
For each user (max 100 for v1):
    prompt = f"""
    Generate 10 funny, absurd questions for a {age}-year-old {gender} in {city}.
    Mix of:
    - 5 Bad Friends podcast style questions
    - 3 dating/relationship questions
    - 2 current events/pop culture questions
    Keep each under 20 words.
    Format as JSON array.
    """
    
    response = groq_client.chat(prompt)  # Uses multiple API keys if needed
    store in user_questions table with date = tomorrow
Question Delivery:

User opens app → next unanswered question appears

Track answer time to learn user habits

Schedule next question for typical open time + 2 hours

Max 10 questions per day

Unanswered questions roll over (with 20% daily decay)

Answer Storage:

sql
CREATE TABLE user_questions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    question_text TEXT,
    generated_for_date DATE,
    answer_text TEXT,
    answered_at TIMESTAMP,
    vitality_score DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT NOW()
);
Phase 3: Four Friendship Layers (🆕 TO BUILD)
Layer Structure:

text
FRIENDS (Follow)
├── Action: Follow/Unfollow
├── Visibility: See morning faces + answers
├── Feed priority: Normal
└── Can DM: No (unless also Bad Friends or Worst Friends)

BAD FRIENDS (Mutual Humor)
├── Trigger: 3+ mutual 💀 reactions in 7 days
├── Action: Automatic detection + opt-in
├── Visibility: Full profile access
├── Feed priority: High
├── Can DM: Yes (text only)
└── Special: "Bad Friends" badge, shared challenges

WORST FRIENDS (Romantic Match)
├── Trigger: Mutual ❤️ in Discover
├── Action: Both users tap heart
├── Visibility: Full profile + location (if Trust Level 4+)
├── Feed priority: Highest
├── Can DM: Yes (text, voice, media)
└── Special: "Worst Friends" badge, date planning tools

MATCHES (Pending)
├── Trigger: One-way ❤️
├── Action: Waiting for response
├── Visibility: Limited profile
├── Feed priority: Low
└── Expires: 7 days without response
Phase 4: Single Feed Architecture (🆕 TO BUILD)
Feed Components (Mixed Card Types):

Card Type	Border Color	Content	Priority Weight
Friend Morning Face	Blue	Photo + reactions	1.0
Friend Answer	Orange	Question + answer + CMI	1.0
Bad Friends Detection	Purple	"3 mutual 💀 detected"	1.5
Popular Morning Face	Gold	Top 10 by 💀 in last 24h	0.8
Popular Answer	Gold	Top 10 by CMI in last 24h	0.8
Sisterhood Alert (women only)	Pink	"New vetting request"	1.2
Vitality Score Calculation:

python
vitality_score = (
    (reaction_count * 0.3) +
    (unique_reactors * 0.3) +
    (cmi_score * 0.2) +
    (1 - days_since_posted * 0.1) +
    (streak_bonus * 0.1)  # +0.2 for 7+ day streak
) * 100
Feed Ordering:

Bad Friends Detection (priority 1.5)

Sisterhood Alerts (priority 1.2, women only)

Friend content (priority 1.0, chronologically)

Popular content (priority 0.8, by vitality)

Phase 5: Discovery & Matching (🆕 TO BUILD)
Answers First Card Stack:

text
1. User sees 3 cards with other users' answers to today's question
2. For each answer, user rates: 💀 (Worst Friend) or SKIP
3. After 3 ratings → UNLOCK FACES
4. User sees morning face gallery of rated users
5. User taps ❤️ or 👎
6. If mutual → WORST FRIENDS match created
7. If not mutual → PENDING MATCH
Matching Algorithm (v1 - Simplified):

python
match_score = (
    (humor_compatibility * 0.4) +  # Based on mutual 💀 reactions
    (personality_compatibility * 0.3) +  # Based on psychological profiles
    (value_alignment * 0.2) +  # Based on dealbreakers + core values
    (attractiveness_proximity * 0.1)  # Based on calibration scores
) * 100
Phase 6: Safety Architecture (🆕 TO BUILD)
Sisterhood (Women-Only Verification Network):

sql
CREATE TABLE sisterhood_posts (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),  -- Anonymous in UI
    target_user_id UUID REFERENCES users(id),
    content TEXT,
    flag_type TEXT,  -- 'green', 'yellow', 'red'
    created_at TIMESTAMP,
    expires_at TIMESTAMP  -- 30 days auto-delete
);

-- RLS: Only women can access
-- No screenshots allowed (technical + legal warning)
-- AI post-review for bullying/favoritism
Sisterhood Rules (Non-negotiable):

ONLY for safety vetting (no favoritism, no bullying)

All posts anonymous to other users

Posts auto-delete after 30 days

AI monitors for abuse of the system

Violations result in permanent ban

Location Safety (Heat Maps - v1):

sql
CREATE TABLE location_heartbeats (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    lat DECIMAL(10,8),
    lng DECIMAL(11,8),
    accuracy INTEGER,  -- meters
    created_at TIMESTAMP,
    expires_at TIMESTAMP  -- 24 hours auto-delete
);

-- Ghost mode: User can hide location entirely
-- Trust Level 4+ required to share precise location
-- Aggregated heat maps only (no individual pins)
Heat Map Implementation (Mapbox - Free Tier):

50,000 map loads per month free

Aggregate user locations into hex bins

Show density, not individuals

"Claim Spot" feature: user can post "I'm at X location"

Phase 7: Chat (v1.3 - Post-Launch)
Features for v1.3:

Real-time messaging (Supabase Realtime)

Read receipts

Typing indicators

Voice notes (AssemblyAI)

Media sharing (images/GIFs)

Block/report

Not in v1.3 (v2):

Audio calls (WebRTC)

Video calls (WebRTC)

Group chats

3. DATA MODEL (UPDATED)
New Tables for v1
sql
-- User questions (10 per user per day)
CREATE TABLE user_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    generated_for_date DATE NOT NULL,
    answer_text TEXT,
    answered_at TIMESTAMP,
    vitality_score DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sisterhood posts
CREATE TABLE sisterhood_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    flag_type TEXT CHECK (flag_type IN ('green', 'yellow', 'red')),
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 days'
);

-- Location heartbeats (temp data)
CREATE TABLE location_heartbeats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lat DECIMAL(10,8),
    lng DECIMAL(11,8),
    accuracy INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '24 hours'
);

-- Follows (friendship layer 1)
CREATE TABLE follows (
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    followed_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (follower_id, followed_id)
);

-- Bad Friends (layer 2 - automatic detection)
CREATE TABLE bad_friends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a UUID REFERENCES users(id) ON DELETE CASCADE,
    user_b UUID REFERENCES users(id) ON DELETE CASCADE,
    detected_at TIMESTAMP DEFAULT NOW(),
    accepted_at TIMESTAMP,
    UNIQUE(user_a, user_b)
);

-- Worst Friends (layer 3 - romantic matches)
-- Reuses existing matches table

-- Pending matches (layer 4)
-- Reuses existing matches table with status='pending'
Updated RLS Policies
sql
-- Sisterhood: Only women can access
CREATE POLICY "Women only can access sisterhood"
    ON sisterhood_posts
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT auth_id FROM users WHERE gender = 'woman'
        )
    );

-- Location heartbeats: Only user can see own, expires after 24h
CREATE POLICY "Users can manage own location"
    ON location_heartbeats
    FOR ALL
    USING (user_id = auth.uid());

-- Bad Friends: Only participants can see
CREATE POLICY "Bad Friends participants only"
    ON bad_friends
    FOR SELECT
    USING (user_a = auth.uid() OR user_b = auth.uid());
4. API SPECIFICATION (UPDATED)
New Endpoints for v1
python
# Onboarding
POST /onboarding/psychological  # Submit 50 answers
POST /onboarding/baseline-cmi   # Submit 5 gold standard answers
POST /onboarding/calibration    # Submit 10 face ratings
POST /onboarding/dealbreakers   # Submit preferences

# Questions
GET /questions/my-today          # Get user's next unanswered question
POST /questions/answer/{id}      # Answer a specific question
GET /questions/my-vitality       # Get user's vitality dashboard

# Social
POST /friends/follow/{user_id}
DELETE /friends/follow/{user_id}
GET /friends/list                # Get all friends (Layer 1)
GET /bad-friends/list            # Get all Bad Friends (Layer 2)
GET /worst-friends/list          # Get all Worst Friends (Layer 3)
GET /matches/pending             # Get pending matches (Layer 4)

# Feed
GET /feed                        # Mixed feed with all card types
GET /feed/vitality               # Get vitality scores for user's content

# Safety
POST /sisterhood/post            # Create anonymous vetting post
GET /sisterhood/feed             # Get sisterhood feed (women only)
POST /sisterhood/flag/{post_id}  # Flag abuse of sisterhood

POST /location/heartbeat         # Update location (Level 4+)
GET /location/heatmap            # Get aggregated heat map
POST /location/ghost-mode        # Toggle ghost mode

# Discovery
GET /discover/candidates         # Get card stack (answers first)
POST /discover/rate/{answer_id}  # Rate answer (💀 or SKIP)
POST /discover/like/{user_id}    # Like user after face unlock
5. PROTECTED INFORMATION REGISTRY
NEVER expose in public pages, documentation, or client-side code:

Information	Where it lives	Exposure Risk
CMI calculation formula	Backend service	High - protect
Trust level point thresholds	Backend + DB	Medium - vague public description OK
Sisterhood verification process	Backend + RLS	High - protect
Groq prompt engineering	Backend .env	High - protect
Matching algorithm weights	Backend service	High - protect
Location aggregation method	Backend service	Medium - vague description OK
Psychological scale scoring	Backend service	Medium
Attractiveness calibration formula	Backend service	Medium
Safe to expose publicly:

Feature list (without implementation details)

User flows (high-level)

Technology stack (Supabase, FastAPI, React)

Team information

Business projections (investor page)

Market analysis (investor page)

6. DEPLOYMENT ARCHITECTURE (UNCHANGED)
text
Frontend: Netlify (free tier, 100GB bandwidth)
Backend: Render (free tier, spins down after 15 min)
Database: Supabase (free tier, 500MB, 2M requests)
LLM: Groq (free tier, 30 req/min per key - use multiple keys)
Maps: Mapbox (free tier, 50k requests/mo)
Voice: AssemblyAI (free tier, 100 hrs/mo - v1.3)
Cron: cron-job.org (free, 50 monitors)
Uptime: UptimeRobot (free, 50 monitors)
7. COST LIMITS & BETA HANDLING
Monthly limits for free tier:

Service	Limit	Action when approaching
Supabase	500MB DB, 2M requests	Show "Bad Friends is growing. Help us scale!"
Render	100GB bandwidth	Same as above
Groq	30 req/min per key	Add more API keys
Mapbox	50k map loads	Reduce heat map refresh rate
Beta user handling:

javascript
if (userCount >= 100) {
    showMessage(`
        🍜 Bad Friends is in private beta.
        
        We're at capacity right now (100 active users).
        
        Want to help us scale? 
        - Donate to keep the servers running
        - Join the waitlist for v1.1
        
        Your support keeps the ant traps running.
    `)
}
---
Bad Friends Morning Face Build — Complete System Architecture
Version: 1.0 | April 2026
Status: Ready for Development
Stack: React + Vite + FastAPI + Supabase + Groq + Render + Netlify

TABLE OF CONTENTS
System Overview

C4 Architecture Diagrams

Tech Stack

Data Architecture

API Architecture

Frontend Architecture

Backend Architecture

Security Architecture

Deployment Architecture

Class Diagrams

Data Flow Diagrams

State Machines

Error Handling & Resilience

Monitoring & Analytics

SYSTEM OVERVIEW
Core Mission
Bad Friends is a humor-first dating app where users must upload a daily "morning face" photo (no makeup, no filters) to unlock visibility. Users answer daily absurd questions from the Bad Friends podcast, and matching is based on the Comedy Match Index (CMI) — a measure of how semantically similar their generated humor is to the community's "gold standard" funniest answers.

Key Differentiators
Differentiator	Description
Morning Face Required Daily	No filters. No retakes. Everyone looks human together.
CMI (Comedy Match Index)	Measures generated humor against community gold standard. Cannot be gamed.
Answers First, Faces Second	Card stack shows humor before photos. Reverses every dating app's priority.
Asymmetric Verification	Women: email + phone + ID + selfie (v1.1). Men: email + phone + ID (v2).
Graduated Trust Levels	Location sharing only at Level 4+. Trust is earned, not given.
System Boundaries
text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BAD FRIENDS SYSTEM                                 │
│                                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                │
│  │   CLIENT     │────▶│   BACKEND    │────▶│  SUPABASE    │                │
│  │   (React)    │◀────│  (FastAPI)   │◀────│ (PostgreSQL) │                │
│  └──────────────┘     └──────────────┘     └──────────────┘                │
│         │                    │                    │                         │
│         │                    ▼                    │                         │
│         │             ┌──────────────┐            │                         │
│         │             │  GROQ API    │            │                         │
│         │             │   (LLM)      │            │                         │
│         │             └──────────────┘            │                         │
│         │                    │                    │                         │
│         ▼                    ▼                    ▼                         │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                │
│  │  STORAGE     │     │   PERSONA    │     │  HUGGING     │                │
│  │  (Supabase)  │     │ (ID Verify)  │     │  FACE (AI)   │                │
│  └──────────────┘     └──────────────┘     └──────────────┘                │
│                                                                              │
│  External Actors: Users (Women, Men), Moderators (Council of Bad Friends)   │
└─────────────────────────────────────────────────────────────────────────────┘
C4 ARCHITECTURE DIAGRAMS
Level 1: System Context Diagram
text
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              BAD FRIENDS SYSTEM CONTEXT                              │
│                                                                                      │
│                                    ┌─────────────┐                                   │
│                                    │   WOMAN     │                                   │
│                                    │   USER      │                                   │
│                                    └──────┬──────┘                                   │
│                                           │                                          │
│                                           │ Uses                                     │
│                                           ▼                                          │
│  ┌─────────────┐                    ┌─────────────┐                    ┌───────────┐│
│  │   MAN       │                    │   BAD       │                    │ PERSONA   ││
│  │   USER      │◀──────────────────▶│   FRIENDS   │───────────────────▶│ (ID Verify)││
│  └─────────────┘                    │   APP       │                    └───────────┘│
│                                     └─────────────┘                                 │
│                                           │                                          │
│                                           │ Uses                                     │
│                                           ▼                                          │
│  ┌─────────────┐                    ┌─────────────┐                    ┌───────────┐│
│  │  GROQ API   │                    │  SUPABASE   │                    │ HUGGING   ││
│  │   (LLM)     │◀──────────────────▶│  (DB + Auth)│                    │  FACE     ││
│  └─────────────┘                    └─────────────┘                    │ (Embed)   ││
│                                                                        └───────────┘│
│                                                                                      │
│  ┌─────────────┐                                                                     │
│  │  MODERATOR  │────────────────────────────────────────────────────────────────────▶│
│  │  (Council)  │                                                                     │
│  └─────────────┘                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
Level 2: Container Diagram
text
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           BAD FRIENDS CONTAINER ARCHITECTURE                         │
│                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │                           SINGLE PAGE APPLICATION (React)                        ││
│  │                                                                                  ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        ││
│  │  │   Auth UI    │  │  Feed UI     │  │  Camera UI   │  │  Chat UI     │        ││
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘        ││
│  │                                                                                  ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        ││
│  │  │  Discover UI │  │  Profile UI  │  │  Settings UI │  │  Match UI    │        ││
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘        ││
│  │                                                                                  ││
│  │  [State: React Context + Hooks]  [HTTP Client: Axios]  [Auth: Supabase Client]  ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                              │                                       │
│                                              │ HTTPS (REST API)                      │
│                                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │                           WEB API (FastAPI)                                      ││
│  │                                                                                  ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        ││
│  │  │  Auth API    │  │  Morning     │  │  Question    │  │  Match API   │        ││
│  │  │  /auth/*     │  │  Face API    │  │  API         │  │  /matches/*  │        ││
│  │  │              │  │  /morning-   │  │  /questions/*│  │              │        ││
│  │  │              │  │  face/*      │  │              │  │              │        ││
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘        ││
│  │                                                                                  ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        ││
│  │  │  Message API │  │  Reaction    │  │  Profile API │  │  Health API  │        ││
│  │  │  /messages/* │  │  API         │  │  /profile/*  │  │  /status     │        ││
│  │  │              │  │  /reactions/*│  │              │  │              │        ││
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘        ││
│  │                                                                                  ││
│  │  [Middleware: CORS, Rate Limiting, Auth]  [Services: CMI, Matching, Trust]      ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                              │                                       │
│                                              │ SQL + Storage                         │
│                                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │                           DATABASE (Supabase)                                    ││
│  │                                                                                  ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        ││
│  │  │  PostgreSQL  │  │    Auth      │  │   Storage    │  │  Realtime    │        ││
│  │  │  (Tables)    │  │  (Users)     │  │  (Images)    │  │  (WebSockets)│        ││
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘        ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────┘
Level 3: Component Diagram (Backend)
text
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND COMPONENT ARCHITECTURE                             │
│                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │                              API LAYER (main.py)                                 ││
│  │                                                                                  ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            ││
│  │  │   Router    │  │  Middleware │  │   CORS      │  │  Rate       │            ││
│  │  │  (APIRouter)│  │  (Auth)     │  │  (CORSMiddleware)│  │  Limiter   │            ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                              │                                       │
│                                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │                           SERVICE LAYER (services/)                              ││
│  │                                                                                  ││
│  │  ┌─────────────────────────────────────────────────────────────────────────────┐││
│  │  │                         CORE SERVICES                                        │││
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │││
│  │  │  │   Auth      │  │   User      │  │   Trust     │  │   Streak    │        │││
│  │  │  │  Service    │  │  Service    │  │  Service    │  │  Service    │        │││
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │││
│  │  └─────────────────────────────────────────────────────────────────────────────┘││
│  │                                                                                  ││
│  │  ┌─────────────────────────────────────────────────────────────────────────────┐││
│  │  │                         DOMAIN SERVICES                                      │││
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │││
│  │  │  │  Morning    │  │  Question   │  │   CMI       │  │  Matching   │        │││
│  │  │  │  Face Srv   │  │  Service    │  │  Service    │  │  Service    │        │││
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │││
│  │  └─────────────────────────────────────────────────────────────────────────────┘││
│  │                                                                                  ││
│  │  ┌─────────────────────────────────────────────────────────────────────────────┐││
│  │  │                         INTEGRATION SERVICES                                 │││
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │││
│  │  │  │   Groq      │  │  Persona    │  │  Hugging    │  │  Storage    │        │││
│  │  │  │  Client     │  │  Client     │  │  Face       │  │  Service    │        │││
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │││
│  │  └─────────────────────────────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                              │                                       │
│                                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │                           DATA LAYER (models/)                                   ││
│  │                                                                                  ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            ││
│  │  │   User      │  │  Morning    │  │  Question   │  │   Answer    │            ││
│  │  │   Model     │  │  Face Model │  │  Model      │  │   Model     │            ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            ││
│  │                                                                                  ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            ││
│  │  │  Reaction   │  │   Match     │  │  Message    │  │   Trust     │            ││
│  │  │   Model     │  │   Model     │  │   Model     │  │   Event     │            ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                              │                                       │
│                                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │                      DATABASE CLIENTS (Supabase)                                 ││
│  │                                                                                  ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            ││
│  │  │  Supabase   │  │  Storage    │  │  Realtime   │  │  Edge       │            ││
│  │  │  Client     │  │  Client     │  │  Client     │  │  Functions  │            ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────┘
Level 4: Code Level (Class Diagram - See Section 10)
TECH STACK
Complete Technology Stack
Layer	Technology	Version	Purpose	Free Tier Limits
Frontend	React	18.2+	UI Framework	Unlimited
Vite	4.0+	Build Tool	Unlimited
Tailwind CSS	3.0+	Styling	Unlimited
Axios	1.0+	HTTP Client	Unlimited
Backend	FastAPI	0.100+	API Framework	Unlimited
Uvicorn	0.20+	ASGI Server	Unlimited
Pydantic	2.0+	Data Validation	Unlimited
Database	Supabase (PostgreSQL)	15.0+	Primary Database	500MB, 2M req/mo
pgvector	Latest	Vector Embeddings	Included
Auth	Supabase Auth	Latest	User Authentication	50K users
Storage	Supabase Storage	Latest	Image Storage	1GB
LLM	Groq	Llama 3.3 70B	Text Generation	30 req/min
Embeddings	Hugging Face	sentence-transformers	CMI Calculation	Free inference
Voice	AssemblyAI	Latest	Voice Transcription	100 hrs/mo
ID Verify	Persona (v1.1)	Latest	ID + Selfie Match	Pay-as-you-go
Hosting	Netlify	Latest	Frontend Hosting	100GB bandwidth
Render	Latest	Backend Hosting	100GB bandwidth
Monitoring	UptimeRobot	Latest	Cold Start Prevention	50 monitors
DATA ARCHITECTURE
Complete Database Schema (PostgreSQL + Supabase)
sql
-- =====================================================
-- EXTENSIONS
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ENUM TYPES
-- =====================================================

CREATE TYPE gender_type AS ENUM ('woman', 'man', 'non_binary', 'prefer_not_to_say');
CREATE TYPE reaction_type AS ENUM ('bobo', 'cheeto', 'tiger', 'dead');
CREATE TYPE match_status AS ENUM ('pending', 'accepted', 'rejected', 'expired');
CREATE TYPE message_type AS ENUM ('text', 'voice', 'gif');
CREATE TYPE endorsement_type AS ENUM ('good_friend', 'great_date', 'bad_friend');
CREATE TYPE report_status AS ENUM ('pending', 'dismissed', 'action_taken');
CREATE TYPE trust_event_type AS ENUM ('endorsement', 'report', 'streak_milestone', 'meet_verification', 'warning');

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users table (auth managed by Supabase Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE NOT NULL, -- References Supabase Auth
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    name TEXT,
    birthday DATE,
    location GEOGRAPHY(POINT),
    gender gender_type,
    orientation TEXT,
    is_verified_woman BOOLEAN DEFAULT FALSE,
    is_verified_man BOOLEAN DEFAULT FALSE,
    verification_id_url TEXT,
    verification_selfie_url TEXT,
    verification_status TEXT DEFAULT 'pending', -- pending, approved, rejected
    trust_level INTEGER DEFAULT 1,
    trust_points INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_morning_face TIMESTAMP,
    cmi_score DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Psychological profiles (captured during onboarding)
CREATE TABLE psychological_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    big_five JSONB, -- { openness, conscientiousness, extraversion, agreeableness, neuroticism }
    attachment_style TEXT, -- secure, anxious, avoidant
    love_languages JSONB, -- { words, acts, gifts, time, touch }
    core_values TEXT[], -- array of top 3 values
    conflict_style TEXT, -- collaborative, competitive, accommodating, avoidant
    humor_style JSONB, -- { affiliative, self_enhancing, aggressive, self_defeating }
    sensation_seeking INTEGER, -- 0-100
    attractiveness_score DECIMAL(3,1), -- 1.0-10.0
    dealbreakers JSONB, -- { wants_kids, max_distance, age_min, age_max, politics, religion }
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Morning faces (daily uploads)
CREATE TABLE morning_faces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    metadata JSONB, -- exif, device info, authenticity_score
    reaction_count_bobo INTEGER DEFAULT 0,
    reaction_count_cheeto INTEGER DEFAULT 0,
    reaction_count_tiger INTEGER DEFAULT 0,
    reaction_count_dead INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Daily questions (pre-loaded from podcast)
CREATE TABLE daily_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_text TEXT NOT NULL,
    source_episode TEXT,
    date DATE UNIQUE NOT NULL,
    gold_standard_answer_ids UUID[], -- populated daily at midnight
    created_at TIMESTAMP DEFAULT NOW()
);

-- User answers to daily questions
CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID REFERENCES daily_questions(id) ON DELETE CASCADE,
    answer_text TEXT,
    answer_voice_url TEXT,
    answer_gif_url TEXT,
    cmi_score DECIMAL(5,2), -- 0-100, calculated daily
    embedding VECTOR(384), -- for similarity search (pgvector)
    reaction_count_bobo INTEGER DEFAULT 0,
    reaction_count_cheeto INTEGER DEFAULT 0,
    reaction_count_tiger INTEGER DEFAULT 0,
    reaction_count_dead INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES daily_questions(id) ON DELETE CASCADE
);

-- Reactions to morning faces and answers
CREATE TABLE reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    target_type TEXT CHECK (target_type IN ('morning_face', 'answer')),
    target_id UUID NOT NULL,
    reaction_type reaction_type NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, target_type, target_id)
);

-- Matches (mutual likes)
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a UUID REFERENCES users(id) ON DELETE CASCADE,
    user_b UUID REFERENCES users(id) ON DELETE CASCADE,
    status match_status DEFAULT 'pending',
    comedy_match_report JSONB, -- stored report shown on match
    matched_at TIMESTAMP DEFAULT NOW(),
    accepted_at TIMESTAMP,
    
    CONSTRAINT fk_user_a FOREIGN KEY (user_a) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_b FOREIGN KEY (user_b) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_a, user_b)
);

-- Messages (E2E encrypted)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT,
    content_type message_type DEFAULT 'text',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT fk_match FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
    CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Follows (friend connections)
CREATE TABLE follows (
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    followed_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    
    PRIMARY KEY (follower_id, followed_id),
    CONSTRAINT fk_follower FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_followed FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- TRUST & SAFETY TABLES
-- =====================================================

-- Trust events (audit log for trust point changes)
CREATE TABLE trust_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_type trust_event_type NOT NULL,
    points_change INTEGER NOT NULL,
    reference_id UUID, -- endorsement_id, report_id, etc.
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Endorsements (Green flags - positive reputation)
CREATE TABLE endorsements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user UUID REFERENCES users(id) ON DELETE CASCADE,
    to_user UUID REFERENCES users(id) ON DELETE CASCADE,
    endorsement_type endorsement_type NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT fk_from FOREIGN KEY (from_user) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_to FOREIGN KEY (to_user) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(from_user, to_user)
);

-- Reports (Red flags - negative reputation)
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reported_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    description TEXT,
    status report_status DEFAULT 'pending',
    moderator_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP,
    
    CONSTRAINT fk_reporter FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_reported FOREIGN KEY (reported_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- SOCIAL TABLES
-- =====================================================

-- Island Bullies groups
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT fk_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Group members
CREATE TABLE group_members (
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT NOW(),
    
    PRIMARY KEY (group_id, user_id),
    CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_trust_level ON users(trust_level);
CREATE INDEX idx_users_gender ON users(gender);
CREATE INDEX idx_users_location ON users USING GIST (location);
CREATE INDEX idx_users_last_morning_face ON users(last_morning_face DESC);

-- Morning faces indexes
CREATE INDEX idx_morning_faces_user_id_created ON morning_faces(user_id, created_at DESC);
CREATE INDEX idx_morning_faces_timestamp ON morning_faces(timestamp DESC);
CREATE INDEX idx_morning_faces_reaction_dead ON morning_faces(reaction_count_dead DESC);

-- Answers indexes
CREATE INDEX idx_answers_user_id_created ON answers(user_id, created_at DESC);
CREATE INDEX idx_answers_question_id_cmi ON answers(question_id, cmi_score DESC);
CREATE INDEX idx_answers_reaction_dead ON answers(reaction_count_dead DESC);

-- pgvector similarity index (for CMI)
CREATE INDEX idx_answers_embedding ON answers USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Reactions indexes
CREATE INDEX idx_reactions_target ON reactions(target_type, target_id);
CREATE INDEX idx_reactions_user ON reactions(user_id);

-- Matches indexes
CREATE INDEX idx_matches_user_a_status ON matches(user_a, status);
CREATE INDEX idx_matches_user_b_status ON matches(user_b, status);
CREATE INDEX idx_matches_matched_at ON matches(matched_at DESC);

-- Messages indexes
CREATE INDEX idx_messages_match_id_created ON messages(match_id, created_at DESC);

-- Follows indexes
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_followed ON follows(followed_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychological_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE morning_faces ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Users: Can read own data, can read public data of others (limited)
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (auth.uid() = auth_id);
    
CREATE POLICY "Users can read public data of others" ON users
    FOR SELECT USING (
        auth.uid() != auth_id 
        AND trust_level >= 2
    );

-- Morning faces: Friends can see, user can manage own
CREATE POLICY "Users can manage own morning faces" ON morning_faces
    FOR ALL USING (user_id = auth.uid());
    
CREATE POLICY "Friends can see morning faces" ON morning_faces
    FOR SELECT USING (
        user_id IN (
            SELECT followed_id FROM follows WHERE follower_id = auth.uid()
            UNION
            SELECT follower_id FROM follows WHERE followed_id = auth.uid()
        )
    );

-- Answers: Friends can see, user can manage own
CREATE POLICY "Users can manage own answers" ON answers
    FOR ALL USING (user_id = auth.uid());
    
CREATE POLICY "Friends can see answers" ON answers
    FOR SELECT USING (
        user_id IN (
            SELECT followed_id FROM follows WHERE follower_id = auth.uid()
            UNION
            SELECT follower_id FROM follows WHERE followed_id = auth.uid()
        )
    );

-- Messages: Only match participants
CREATE POLICY "Match participants can read messages" ON messages
    FOR SELECT USING (
        match_id IN (
            SELECT id FROM matches 
            WHERE user_a = auth.uid() OR user_b = auth.uid()
        )
    );

-- =====================================================
-- TRIGGERS & FUNCTIONS
-- =====================================================

-- Update updated_at timestamp
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

CREATE TRIGGER update_psychological_profiles_updated_at
    BEFORE UPDATE ON psychological_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-update streak on morning face upload
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

-- Auto-update reaction counts
CREATE OR REPLACE FUNCTION update_reaction_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.target_type = 'morning_face' THEN
        UPDATE morning_faces
        SET reaction_count_${NEW.reaction_type} = reaction_count_${NEW.reaction_type} + 1
        WHERE id = NEW.target_id;
    ELSIF NEW.target_type = 'answer' THEN
        UPDATE answers
        SET reaction_count_${NEW.reaction_type} = reaction_count_${NEW.reaction_type} + 1
        WHERE id = NEW.target_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: The above uses dynamic SQL; implement with CASE statements
API ARCHITECTURE
Complete API Specification (FastAPI)
python
# main.py - Complete API Structure

from fastapi import FastAPI, File, UploadFile, Form, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime, date
import uuid

# =====================================================
# PYDANTIC MODELS (Request/Response Schemas)
# =====================================================

# Auth Models
class RegisterRequest(BaseModel):
    email: EmailStr
    phone: str
    password: str
    gender: str  # 'woman', 'man', 'non_binary', 'prefer_not_to_say'
    name: Optional[str] = None

class RegisterResponse(BaseModel):
    user_id: uuid.UUID
    token: str
    requires_verification: bool  # True for women (ID + selfie)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    user_id: uuid.UUID
    token: str
    trust_level: int

# Verification Models
class IDVerificationRequest(BaseModel):
    id_image: str  # base64 or URL after upload
    selfie_image: str  # base64 or URL

class IDVerificationResponse(BaseModel):
    status: str  # 'pending', 'approved', 'rejected'
    message: str

# Morning Face Models
class MorningFaceUploadRequest(BaseModel):
    image: str  # base64 or URL
    timestamp: datetime

class MorningFaceResponse(BaseModel):
    id: uuid.UUID
    image_url: str
    streak_days: int
    trust_points_earned: int

class MorningFaceFeedResponse(BaseModel):
    faces: List[Dict[str, Any]]
    next_cursor: Optional[str]

# Question Models
class DailyQuestionResponse(BaseModel):
    id: uuid.UUID
    question_text: str
    date: date
    has_answered: bool

class AnswerRequest(BaseModel):
    question_id: uuid.UUID
    answer_text: Optional[str] = None
    answer_voice_url: Optional[str] = None
    answer_gif_url: Optional[str] = None

class AnswerResponse(BaseModel):
    id: uuid.UUID
    estimated_cmi: float  # placeholder for prototype
    position_today: int  # e.g., "top 30%"

class AnswerFeedResponse(BaseModel):
    answers: List[Dict[str, Any]]
    next_cursor: Optional[str]

# Reaction Models
class ReactionRequest(BaseModel):
    target_type: str  # 'morning_face' or 'answer'
    target_id: uuid.UUID
    reaction_type: str  # 'bobo', 'cheeto', 'tiger', 'dead'

class ReactionResponse(BaseModel):
    success: bool
    new_count: int

# Match Models
class DiscoverCandidateResponse(BaseModel):
    user_id: uuid.UUID
    answer_text: str
    cmi_score: float
    past_funny_answers: List[str]
    requires_unlock: bool  # True until user rates 10 answers

class LikeRequest(BaseModel):
    target_user_id: uuid.UUID

class LikeResponse(BaseModel):
    mutual: bool
    match_id: Optional[uuid.UUID]
    comedy_match_report: Optional[Dict[str, Any]]

class MatchResponse(BaseModel):
    id: uuid.UUID
    user: Dict[str, Any]  # matched user's public profile
    matched_at: datetime
    comedy_match_report: Dict[str, Any]

# Message Models
class MessageRequest(BaseModel):
    match_id: uuid.UUID
    content: str
    content_type: str = 'text'

class MessageResponse(BaseModel):
    id: uuid.UUID
    sender_id: uuid.UUID
    content: str
    created_at: datetime

# Profile Models
class ProfileResponse(BaseModel):
    id: uuid.UUID
    name: str
    streak_days: int
    trust_level: int
    trust_points: int
    cmi_score: float
    morning_face_history: List[Dict[str, Any]]
    badges: List[str]
    stats: Dict[str, int]

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None

# =====================================================
# FASTAPI APPLICATION
# =====================================================

app = FastAPI(
    title="Bad Friends API",
    description="Humor-first dating app API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Security
security = HTTPBearer()

# Rate Limiting
limiter = Limiter(key_func=get_remote_address, default_limits=["100 per day"])
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://bad-friends.netlify.app",
        "https://bad-friends-prod.netlify.app",
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# =====================================================
# DEPENDENCIES
# =====================================================

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Extract and validate JWT token, return user_id"""
    # Implementation in auth service
    pass

async def require_trust_level(level: int):
    """Dependency factory for trust level requirements"""
    async def dependency(user_id: str = Depends(get_current_user)):
        # Check user's trust level from database
        pass
    return dependency

# =====================================================
# AUTH ROUTES
# =====================================================

@app.post("/auth/register", response_model=RegisterResponse)
@limiter.limit("10 per minute")
async def register(request: RegisterRequest):
    """
    Register new user with email + phone.
    Women immediately require ID verification.
    Men proceed to Level 1.
    """
    pass

@app.post("/auth/verify-email")
@limiter.limit("10 per minute")
async def verify_email(code: str, email: str):
    """Verify email with 6-digit code"""
    pass

@app.post("/auth/verify-phone")
@limiter.limit("10 per minute")
async def verify_phone(code: str, phone: str):
    """Verify phone with 6-digit code"""
    pass

@app.post("/auth/verify-woman", response_model=IDVerificationResponse)
@limiter.limit("5 per minute")
async def verify_woman(request: IDVerificationRequest, user_id: str = Depends(get_current_user)):
    """
    Women only: Upload ID + selfie for verification.
    Uses Persona API (v1.1).
    """
    pass

@app.post("/auth/login", response_model=LoginResponse)
@limiter.limit("20 per minute")
async def login(request: LoginRequest):
    """Login with email + password"""
    pass

# =====================================================
# MORNING FACE ROUTES
# =====================================================

@app.post("/morning-face", response_model=MorningFaceResponse)
@limiter.limit("10 per minute")
async def upload_morning_face(
    image: UploadFile = File(...),
    timestamp: datetime = Form(...),
    user_id: str = Depends(get_current_user)
):
    """
    Upload daily morning face photo.
    Timestamp must be within last 15 minutes.
    Updates streak and trust points.
    """
    pass

@app.get("/morning-face/feed", response_model=MorningFaceFeedResponse)
@limiter.limit("30 per minute")
async def get_morning_face_feed(
    limit: int = 20,
    cursor: Optional[str] = None,
    user_id: str = Depends(get_current_user)
):
    """
    Get feed of friends' morning faces.
    Priority: Friends today → Popular today → Friends yesterday → Historical.
    """
    pass

# =====================================================
# QUESTION ROUTES
# =====================================================

@app.get("/questions/today", response_model=DailyQuestionResponse)
@limiter.limit("30 per minute")
async def get_today_question(user_id: str = Depends(get_current_user)):
    """Get today's daily question"""
    pass

@app.post("/questions/answer", response_model=AnswerResponse)
@limiter.limit("10 per minute")
async def submit_answer(request: AnswerRequest, user_id: str = Depends(get_current_user)):
    """Submit answer to daily question"""
    pass

@app.get("/questions/feed", response_model=AnswerFeedResponse)
@limiter.limit("30 per minute")
async def get_answer_feed(
    limit: int = 20,
    cursor: Optional[str] = None,
    user_id: str = Depends(get_current_user)
):
    """Get feed of friends' answers"""
    pass

# =====================================================
# REACTION ROUTES
# =====================================================

@app.post("/reactions", response_model=ReactionResponse)
@limiter.limit("50 per minute")
async def add_reaction(request: ReactionRequest, user_id: str = Depends(get_current_user)):
    """Add reaction to morning face or answer"""
    pass

@app.delete("/reactions/{target_type}/{target_id}")
@limiter.limit("50 per minute")
async def remove_reaction(
    target_type: str,
    target_id: uuid.UUID,
    user_id: str = Depends(get_current_user)
):
    """Remove reaction"""
    pass

# =====================================================
# MATCHING ROUTES
# =====================================================

@app.get("/matches/discover", response_model=List[DiscoverCandidateResponse])
@limiter.limit("30 per minute")
async def discover_matches(
    limit: int = 20,
    user_id: str = Depends(get_current_user)
):
    """
    Get potential matches.
    Shows answers first.
    Requires Trust Level 2+.
    """
    pass

@app.post("/matches/like", response_model=LikeResponse)
@limiter.limit("20 per minute")
async def like_user(request: LikeRequest, user_id: str = Depends(get_current_user)):
    """
    Express interest in another user.
    If mutual, creates match and generates Comedy Match Report.
    """
    pass

@app.get("/matches", response_model=List[MatchResponse])
@limiter.limit("30 per minute")
async def get_matches(user_id: str = Depends(get_current_user)):
    """Get all active matches"""
    pass

# =====================================================
# MESSAGE ROUTES
# =====================================================

@app.post("/messages", response_model=MessageResponse)
@limiter.limit("60 per minute")
async def send_message(request: MessageRequest, user_id: str = Depends(get_current_user)):
    """Send message in a match"""
    pass

@app.get("/messages/{match_id}", response_model=List[MessageResponse])
@limiter.limit("60 per minute")
async def get_messages(
    match_id: uuid.UUID,
    limit: int = 50,
    user_id: str = Depends(get_current_user)
):
    """Get conversation history"""
    pass

# =====================================================
# PROFILE ROUTES
# =====================================================

@app.get("/profile", response_model=ProfileResponse)
@limiter.limit("30 per minute")
async def get_profile(user_id: str = Depends(get_current_user)):
    """Get user's own profile"""
    pass

@app.get("/profile/{user_id}", response_model=ProfileResponse)
@limiter.limit("30 per minute")
async def get_public_profile(user_id: uuid.UUID, current_user: str = Depends(get_current_user)):
    """Get another user's public profile (only if friends or matched)"""
    pass

@app.put("/profile", response_model=ProfileResponse)
@limiter.limit("10 per minute")
async def update_profile(request: ProfileUpdateRequest, user_id: str = Depends(get_current_user)):
    """Update user profile"""
    pass

# =====================================================
# HEALTH CHECK
# =====================================================

@app.get("/status")
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

# =====================================================
# ERROR HANDLERS
# =====================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return {
        "error": exc.detail,
        "status_code": exc.status_code
    }
FRONTEND ARCHITECTURE
Component Hierarchy (React)
jsx
// App.jsx - Main Application Component

import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FeedProvider } from './contexts/FeedContext';
import { MatchProvider } from './contexts/MatchContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Layout Components
import Layout from './components/Layout/Layout';
import Navigation from './components/Navigation/Navigation';
import BottomNav from './components/Navigation/BottomNav';

// Screen Components
import LoginScreen from './screens/LoginScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import VerificationScreen from './screens/VerificationScreen';
import MorningFaceScreen from './screens/MorningFaceScreen';
import FeedScreen from './screens/FeedScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import MatchScreen from './screens/MatchScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

// Protected Route Wrapper
const ProtectedRoute = ({ children, requiredTrustLevel = 1 }) => {
    const { user, trustLevel, loading } = useAuth();
    
    if (loading) return <LoadingSpinner />;
    if (!user) return <Navigate to="/login" />;
    if (trustLevel < requiredTrustLevel) return <Navigate to="/verify" />;
    
    return children;
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <FeedProvider>
                    <MatchProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/login" element={<LoginScreen />} />
                                <Route path="/onboarding" element={<OnboardingScreen />} />
                                <Route path="/verify" element={<VerificationScreen />} />
                                
                                <Route path="/" element={
                                    <ProtectedRoute requiredTrustLevel={1}>
                                        <Layout>
                                            <MorningFaceScreen />
                                        </Layout>
                                    </ProtectedRoute>
                                } />
                                
                                <Route path="/feed" element={
                                    <ProtectedRoute requiredTrustLevel={1}>
                                        <Layout>
                                            <FeedScreen />
                                        </Layout>
                                    </ProtectedRoute>
                                } />
                                
                                <Route path="/discover" element={
                                    <ProtectedRoute requiredTrustLevel={2}>
                                        <Layout>
                                            <DiscoverScreen />
                                        </Layout>
                                    </ProtectedRoute>
                                } />
                                
                                <Route path="/matches" element={
                                    <ProtectedRoute requiredTrustLevel={2}>
                                        <Layout>
                                            <MatchScreen />
                                        </Layout>
                                    </ProtectedRoute>
                                } />
                                
                                <Route path="/chat/:matchId" element={
                                    <ProtectedRoute requiredTrustLevel={2}>
                                        <Layout>
                                            <ChatScreen />
                                        </Layout>
                                    </ProtectedRoute>
                                } />
                                
                                <Route path="/profile" element={
                                    <ProtectedRoute requiredTrustLevel={1}>
                                        <Layout>
                                            <ProfileScreen />
                                        </Layout>
                                    </ProtectedRoute>
                                } />
                                
                                <Route path="/settings" element={
                                    <ProtectedRoute requiredTrustLevel={1}>
                                        <Layout>
                                            <SettingsScreen />
                                        </Layout>
                                    </ProtectedRoute>
                                } />
                            </Routes>
                        </BrowserRouter>
                    </MatchProvider>
                </FeedProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
Context Providers
jsx
// contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { api } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [trustLevel, setTrustLevel] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserProfile(session.user.id);
            }
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) {
                    await fetchUserProfile(session.user.id);
                }
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserProfile = async (userId) => {
        const { data, error } = await supabase
            .from('users')
            .select('trust_level')
            .eq('auth_id', userId)
            .single();
        
        if (data) setTrustLevel(data.trust_level);
    };

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    };

    const register = async (email, phone, password, gender, name) => {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { phone, gender, name }
            }
        });
        if (authError) throw authError;
        
        // Create user record in our users table
        const { error: userError } = await supabase
            .from('users')
            .insert({
                auth_id: authData.user.id,
                email,
                phone,
                gender,
                name,
                trust_level: 1,
                trust_points: 0
            });
        
        if (userError) throw userError;
        
        return authData;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
    };

    const value = {
        user,
        session,
        trustLevel,
        loading,
        login,
        register,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
Custom Hooks
jsx
// hooks/useCamera.js
import { useState, useRef, useCallback } from 'react';

export const useCamera = () => {
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);

    const startCamera = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            return mediaStream;
        } catch (err) {
            setError(err.message);
            return null;
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    const capturePhoto = useCallback(() => {
        if (!videoRef.current) return null;
        
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
        
        return canvas.toDataURL('image/jpeg', 0.8);
    }, []);

    return {
        videoRef,
        stream,
        error,
        startCamera,
        stopCamera,
        capturePhoto
    };
};

// hooks/useMorningFace.js
import { useState } from 'react';
import { api } from '../utils/api';

export const useMorningFace = () => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const uploadMorningFace = async (imageBase64, timestamp) => {
        setUploading(true);
        setError(null);
        
        try {
            const response = await api.post('/morning-face', {
                image: imageBase64,
                timestamp
            });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.error || 'Upload failed');
            return null;
        } finally {
            setUploading(false);
        }
    };

    return { uploadMorningFace, uploading, error };
};

// hooks/useDiscover.js
import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

export const useDiscover = () => {
    const [candidates, setCandidates] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [ratedCount, setRatedCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const loadCandidates = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/matches/discover', {
                params: { limit: 20 }
            });
            setCandidates(response.data);
            setCurrentIndex(0);
        } catch (err) {
            console.error('Failed to load candidates:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const rateAnswer = useCallback(async (candidateId, ratingType) => {
        // ratingType: 'worst_friend' (💀) or 'skip'
        if (ratingType === 'worst_friend') {
            await api.post('/reactions', {
                target_type: 'answer',
                target_id: candidateId,
                reaction_type: 'dead'
            });
        }
        
        setRatedCount(prev => prev + 1);
        setCurrentIndex(prev => prev + 1);
        
        // Load more if needed
        if (currentIndex + 1 >= candidates.length - 5) {
            await loadCandidates();
        }
    }, [candidates, currentIndex, loadCandidates]);

    const likeUser = useCallback(async (userId) => {
        const response = await api.post('/matches/like', {
            target_user_id: userId
        });
        return response.data;
    }, []);

    return {
        currentCandidate: candidates[currentIndex],
        ratedCount,
        loading,
        rateAnswer,
        likeUser,
        loadCandidates
    };
};
BACKEND ARCHITECTURE
Directory Structure
text
backend/
├── main.py                      # FastAPI app entry point
├── requirements.txt             # Python dependencies
├── Procfile                     # Render deployment
├── .env                         # Environment variables (never commit)
├── .env.example                 # Template for env vars
├── Dockerfile                   # Container config (optional)
├── api/
│   ├── __init__.py
│   ├── auth.py                  # /auth/* routes
│   ├── morning_face.py          # /morning-face/* routes
│   ├── questions.py             # /questions/* routes
│   ├── reactions.py             # /reactions/* routes
│   ├── matches.py               # /matches/* routes
│   ├── messages.py              # /messages/* routes
│   └── profile.py               # /profile/* routes
├── core/
│   ├── __init__.py
│   ├── config.py                # Environment config
│   ├── database.py              # Supabase client
│   ├── security.py              # JWT, rate limiting, CORS
│   └── dependencies.py          # FastAPI dependencies
├── services/
│   ├── __init__.py
│   ├── auth_service.py          # User registration, login
│   ├── verification_service.py  # ID + selfie (Persona)
│   ├── morning_face_service.py  # Upload, streak, feed
│   ├── question_service.py      # Daily questions, answers
│   ├── cmi_service.py           # Comedy Match Index calculation
│   ├── matching_service.py      # MatchScore algorithm
│   ├── trust_service.py         # Trust level, points, events
│   ├── reaction_service.py      # Reactions and counts
│   ├── message_service.py       # Chat messages
│   └── groq_client.py           # Groq LLM integration
├── models/
│   ├── __init__.py
│   ├── user.py                  # User Pydantic models
│   ├── morning_face.py          # Morning face models
│   ├── question.py              # Question/Answer models
│   ├── match.py                 # Match models
│   └── message.py               # Message models
├── utils/
│   ├── __init__.py
│   ├── supabase_client.py       # Supabase helper
│   ├── helpers.py               # Utility functions
│   └── validators.py            # Input validation
└── workers/
    ├── __init__.py
    ├── cmi_worker.py            # Daily CMI calculation (cron)
    └── streak_worker.py         # Streak maintenance
Core Service Implementation
python
# services/cmi_service.py

import numpy as np
from typing import List, Dict, Any
from datetime import datetime
import asyncio
from ..core.database import supabase
from ..utils.helpers import get_embedding

class CMIService:
    """
    Comedy Match Index Service
    Calculates CMI based on semantic similarity to gold standard answers.
    """
    
    async def calculate_daily_cmi(self, question_id: str) -> Dict[str, Any]:
        """
        Main entry point: Run daily at midnight.
        1. Fetch all answers for today's question
        2. Identify gold standard (top 10 by 💀 reactions)
        3. Generate embeddings for gold standard
        4. Generate embeddings for all answers
        5. Calculate similarity scores
        6. Update database
        """
        # Step 1: Fetch answers
        answers = await self._fetch_answers(question_id)
        if not answers:
            return {"status": "no_answers", "count": 0}
        
        # Step 2: Identify gold standard (top 10 by 💀 reactions)
        sorted_answers = sorted(answers, key=lambda x: x['reaction_count_dead'], reverse=True)
        gold_standard = sorted_answers[:10]
        gold_standard_ids = [a['id'] for a in gold_standard]
        
        # Step 3: Generate embeddings for gold standard
        gold_embeddings = []
        for answer in gold_standard:
            embedding = await get_embedding(answer['answer_text'])
            gold_embeddings.append(embedding)
        
        # Step 4 & 5: Calculate CMI for each answer
        updates = []
        for answer in answers:
            if answer['id'] in gold_standard_ids:
                cmi = 100.0  # Perfect score for gold standard
            else:
                embedding = await get_embedding(answer['answer_text'])
                similarities = [self._cosine_similarity(embedding, ge) for ge in gold_embeddings]
                best_similarity = max(similarities)
                cmi = best_similarity * 100
            
            updates.append({
                'answer_id': answer['id'],
                'cmi_score': cmi
            })
        
        # Step 6: Update database
        await self._update_cmi_scores(updates)
        
        # Update gold standard in daily_questions table
        await supabase.table('daily_questions').update({
            'gold_standard_answer_ids': gold_standard_ids
        }).eq('id', question_id).execute()
        
        return {
            "status": "success",
            "total_answers": len(answers),
            "gold_standard_count": len(gold_standard)
        }
    
    async def get_user_cmi_profile(self, user_id: str) -> Dict[str, Any]:
        """Get user's CMI vector (humor style profile)"""
        # Fetch user's last 30 answers
        response = await supabase.table('answers')\
            .select('cmi_score, answer_text, question_id')\
            .eq('user_id', user_id)\
            .order('created_at', desc=True)\
            .limit(30)\
            .execute()
        
        answers = response.data
        
        if not answers:
            return {
                'cmi_average': 0,
                'cmi_vector': [0] * 6,
                'answer_count': 0
            }
        
        # Calculate average CMI
        avg_cmi = sum(a['cmi_score'] for a in answers if a['cmi_score']) / len(answers)
        
        # TODO: Generate humor style vector from answers
        # This would analyze: affiliative, self_enhancing, surreal, wordplay, timing, originality
        humor_vector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]  # Placeholder
        
        return {
            'cmi_average': avg_cmi,
            'cmi_vector': humor_vector,
            'answer_count': len(answers)
        }
    
    def _cosine_similarity(self, a: List[float], b: List[float]) -> float:
        """Calculate cosine similarity between two vectors"""
        a_np = np.array(a)
        b_np = np.array(b)
        return np.dot(a_np, b_np) / (np.linalg.norm(a_np) * np.linalg.norm(b_np))
    
    async def _fetch_answers(self, question_id: str) -> List[Dict]:
        """Fetch all answers for a question with reaction counts"""
        response = await supabase.rpc('get_answers_with_reaction_counts', {
            'p_question_id': question_id
        }).execute()
        return response.data
    
    async def _update_cmi_scores(self, updates: List[Dict]) -> None:
        """Batch update CMI scores"""
        for update in updates:
            await supabase.table('answers')\
                .update({'cmi_score': update['cmi_score']})\
                .eq('id', update['answer_id'])\
                .execute()
python
# services/matching_service.py

import numpy as np
from typing import Dict, Any, List, Tuple
from ..core.database import supabase
from ..services.cmi_service import CMIService
from ..services.groq_client import GroqClient

class MatchingService:
    """
    Matching Engine
    Calculates MatchScore between users using multi-factor compatibility.
    """
    
    def __init__(self):
        self.cmi_service = CMIService()
        self.groq_client = GroqClient()
    
    async def calculate_match_score(self, user_a_id: str, user_b_id: str) -> Dict[str, Any]:
        """
        Calculate comprehensive match score between two users.
        Returns score and detailed breakdown.
        """
        # Fetch both users' data in parallel
        user_a_data, user_b_data = await asyncio.gather(
            self._get_user_match_data(user_a_id),
            self._get_user_match_data(user_b_id)
        )
        
        # Calculate components
        humor_score = await self._calculate_humor_compatibility(
            user_a_data['cmi_vector'],
            user_b_data['cmi_vector']
        )
        
        personality_score = self._calculate_personality_compatibility(
            user_a_data.get('big_five', {}),
            user_b_data.get('big_five', {}),
            user_a_data.get('attachment_style'),
            user_b_data.get('attachment_style')
        )
        
        values_score = self._calculate_values_alignment(
            user_a_data.get('core_values', []),
            user_b_data.get('core_values', []),
            user_a_data.get('dealbreakers', {}),
            user_b_data.get('dealbreakers', {})
        )
        
        attractiveness_score = self._calculate_attractiveness_proximity(
            user_a_data.get('attractiveness_score', 5.0),
            user_b_data.get('attractiveness_score', 5.0)
        )
        
        social_score = await self._calculate_social_proof(
            user_a_id, user_b_id
        )
        
        # Weighted final score (weights from RL training)
        weights = {
            'humor': 0.40,
            'personality': 0.25,
            'values': 0.20,
            'attractiveness': 0.10,
            'social': 0.05
        }
        
        final_score = (
            weights['humor'] * humor_score +
            weights['personality'] * personality_score +
            weights['values'] * values_score +
            weights['attractiveness'] * attractiveness_score +
            weights['social'] * social_score
        )
        
        # Critical moment simulation for high scores (>0.7)
        simulation_adjustment = 0
        if final_score > 0.7:
            simulation_adjustment = await self._critical_moment_simulation(
                user_a_data, user_b_data
            )
            final_score += simulation_adjustment
            final_score = max(0, min(100, final_score))  # Clamp to 0-100
        
        return {
            'final_score': final_score * 100,  # Convert to 0-100 scale
            'components': {
                'humor': humor_score * 100,
                'personality': personality_score * 100,
                'values': values_score * 100,
                'attractiveness': attractiveness_score * 100,
                'social': social_score * 100
            },
            'simulation_adjustment': simulation_adjustment * 100,
            'weights': weights
        }
    
    async def _calculate_humor_compatibility(self, vector_a: List[float], vector_b: List[float]) -> float:
        """Cosine similarity between CMI vectors"""
        if not vector_a or not vector_b:
            return 0.5
        
        a = np.array(vector_a)
        b = np.array(vector_b)
        similarity = np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
        return (similarity + 1) / 2  # Normalize to 0-1
    
    def _calculate_personality_compatibility(self, big_five_a: Dict, big_five_b: Dict, 
                                             attachment_a: str, attachment_b: str) -> float:
        """Calculate personality compatibility using established psychology research"""
        score = 0.0
        
        # Big Five similarity (closer better for O, A, C; complementarity for E, N)
        if big_five_a and big_five_b:
            o_sim = 1 - abs(big_five_a.get('openness', 0.5) - big_five_b.get('openness', 0.5))
            c_sim = 1 - abs(big_five_a.get('conscientiousness', 0.5) - big_five_b.get('conscientiousness', 0.5))
            a_sim = 1 - abs(big_five_a.get('agreeableness', 0.5) - big_five_b.get('agreeableness', 0.5))
            e_sim = 1 - abs(big_five_a.get('extraversion', 0.5) - big_five_b.get('extraversion', 0.5))
            n_sim = 1 - abs(big_five_a.get('neuroticism', 0.5) - big_five_b.get('neuroticism', 0.5))
            
            big_five_score = (o_sim + c_sim + a_sim + e_sim + n_sim) / 5
            score += big_five_score * 0.4
        
        # Attachment style compatibility (research-based)
        attachment_matrix = {
            ('secure', 'secure'): 1.0,
            ('secure', 'anxious'): 0.7,
            ('anxious', 'anxious'): 0.5,
            ('secure', 'avoidant'): 0.3,
            ('anxious', 'avoidant'): 0.2,
            ('avoidant', 'avoidant'): 0.1,
        }
        key = (attachment_a, attachment_b) if attachment_a <= attachment_b else (attachment_b, attachment_a)
        attachment_score = attachment_matrix.get(key, 0.5)
        score += attachment_score * 0.3
        
        # Conflict style compatibility
        conflict_matrix = {
            ('collaborative', 'collaborative'): 1.0,
            ('collaborative', 'accommodating'): 0.8,
            ('accommodating', 'accommodating'): 0.6,
            ('collaborative', 'competitive'): 0.4,
            ('accommodating', 'competitive'): 0.3,
            ('competitive', 'competitive'): 0.2,
        }
        conflict_key = (big_five_a.get('conflict_style', 'collaborative'), 
                       big_five_b.get('conflict_style', 'collaborative'))
        conflict_score = conflict_matrix.get(conflict_key, 0.5)
        score += conflict_score * 0.3
        
        return score
    
    def _calculate_values_alignment(self, values_a: List[str], values_b: List[str],
                                    dealbreakers_a: Dict, dealbreakers_b: Dict) -> float:
        """Calculate shared values and dealbreaker compatibility"""
        score = 0.0
        
        # Shared core values
        if values_a and values_b:
            shared = len(set(values_a) & set(values_b))
            total = max(len(values_a), len(values_b))
            values_score = shared / total if total > 0 else 0.5
            score += values_score * 0.5
        
        # Dealbreaker check
        dealbreaker_violations = 0
        for key in ['wants_kids', 'politics', 'religion']:
            if dealbreakers_a.get(key) and dealbreakers_b.get(key):
                if dealbreakers_a[key] != dealbreakers_b[key]:
                    dealbreaker_violations += 1
        
        dealbreaker_score = 1 - (dealbreaker_violations / 3)
        score += dealbreaker_score * 0.3
        
        # Life goals similarity (simplified)
        score += 0.7 * 0.2  # Placeholder
        
        return score
    
    def _calculate_attractiveness_proximity(self, score_a: float, score_b: float) -> float:
        """Matching hypothesis: people pair with similarly attractive partners"""
        difference = abs(score_a - score_b) / 10  # Normalize 0-10 to 0-1
        return 1 - difference
    
    async def _calculate_social_proof(self, user_a_id: str, user_b_id: str) -> float:
        """Calculate social proof from mutual friends and endorsements"""
        score = 0.0
        
        # Mutual friends
        mutual_friends = await self._get_mutual_friends_count(user_a_id, user_b_id)
        friends_score = min(mutual_friends / 10, 1.0)  # Cap at 10 mutual friends
        score += friends_score * 0.5
        
        # Shared group memberships
        shared_groups = await self._get_shared_groups_count(user_a_id, user_b_id)
        groups_score = min(shared_groups / 5, 1.0)
        score += groups_score * 0.3
        
        # Endorsements
        endorsements = await self._get_mutual_endorsements(user_a_id, user_b_id)
        endorsement_score = min(endorsements / 3, 1.0)
        score += endorsement_score * 0.2
        
        return score
    
    async def _critical_moment_simulation(self, user_a_data: Dict, user_b_data: Dict) -> float:
        """
        Use LLM to simulate conflict scenarios and adjust match score.
        Returns adjustment between -0.15 and +0.15.
        """
        # Build personas
        persona_a = self._build_persona(user_a_data)
        persona_b = self._build_persona(user_b_data)
        
        # Generate 3 scenarios based on likely friction points
        scenarios = self._generate_scenarios(user_a_data, user_b_data)
        
        # Simulate responses
        total_quality = 0
        for scenario in scenarios:
            prompt = f"""
            Persona A: {persona_a}
            Persona B: {persona_b}
            
            Scenario: {scenario}
            
            Simulate how Persona A and Persona B would respond to this situation.
            Then rate the interaction quality from 0 to 10.
            """
            
            response = await self.groq_client.chat(prompt)
            # Parse rating from response
            # Simplified: extract rating
            rating = self._extract_rating(response)
            total_quality += rating
        
        avg_quality = total_quality / len(scenarios)
        
        # Convert to adjustment (-0.15 to +0.15)
        adjustment = (avg_quality - 5) / 33.33
        return adjustment
    
    def _build_persona(self, user_data: Dict) -> str:
        """Build a text persona for LLM simulation"""
        big_five = user_data.get('big_five', {})
        return f"""
        Openness: {big_five.get('openness', 0.5):.0%}
        Conscientiousness: {big_five.get('conscientiousness', 0.5):.0%}
        Extraversion: {big_five.get('extraversion', 0.5):.0%}
        Agreeableness: {big_five.get('agreeableness', 0.5):.0%}
        Neuroticism: {big_five.get('neuroticism', 0.5):.0%}
        Attachment: {user_data.get('attachment_style', 'secure')}
        Conflict Style: {user_data.get('conflict_style', 'collaborative')}
        Humor Style: {user_data.get('humor_style', {}).get('affiliative', 0.5):.0%} affiliative
        Core Values: {', '.join(user_data.get('core_values', ['None']))}
        """
    
    def _generate_scenarios(self, user_a: Dict, user_b: Dict) -> List[str]:
        """Generate conflict scenarios based on user differences"""
        scenarios = []
        
        # Scenario 1: Planning a date (always relevant)
        scenarios.append("You're planning a first date. One wants a quiet coffee shop, the other wants a loud comedy club.")
        
        # Scenario 2: Based on attachment style differences
        if user_a.get('attachment_style') != user_b.get('attachment_style'):
            scenarios.append("One person wants to text daily. The other needs space. How do you navigate this?")
        
        # Scenario 3: Based on conflict style differences
        if user_a.get('conflict_style') != user_b.get('conflict_style'):
            scenarios.append("A disagreement about weekend plans arises. One wants to plan everything, the other wants spontaneity.")
        else:
            scenarios.append("You both disagree on something trivial (like ant traps on the fridge). How do you resolve it?")
        
        return scenarios
    
    async def _get_user_match_data(self, user_id: str) -> Dict:
        """Fetch all data needed for matching"""
        response = await supabase.table('users')\
            .select('*, psychological_profiles(*)')\
            .eq('id', user_id)\
            .single()\
            .execute()
        
        data = response.data
        
        # Get CMI vector
        cmi_profile = await self.cmi_service.get_user_cmi_profile(user_id)
        
        return {
            'cmi_vector': cmi_profile['cmi_vector'],
            **data.get('psychological_profiles', {}),
            **data
        }
    
    async def _get_mutual_friends_count(self, user_a: str, user_b: str) -> int:
        """Count mutual friends between two users"""
        response = await supabase.rpc('count_mutual_friends', {
            'user_a_id': user_a,
            'user_b_id': user_b
        }).execute()
        return response.data or 0
    
    async def _get_shared_groups_count(self, user_a: str, user_b: str) -> int:
        """Count shared Island Bullies groups"""
        response = await supabase.rpc('count_shared_groups', {
            'user_a_id': user_a,
            'user_b_id': user_b
        }).execute()
        return response.data or 0
    
    async def _get_mutual_endorsements(self, user_a: str, user_b: str) -> int:
        """Count mutual endorsements"""
        response = await supabase.table('endorsements')\
            .select('*')\
            .or_(
                f'and(from_user.eq.{user_a},to_user.eq.{user_b}),'
                f'and(from_user.eq.{user_b},to_user.eq.{user_a})'
            )\
            .execute()
        return len(response.data)
CLASS DIAGRAMS
Core Domain Models
text
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                  DOMAIN CLASS DIAGRAM                                │
│                                                                                      │
│  ┌─────────────────────────┐         ┌─────────────────────────┐                    │
│  │         User            │         │     MorningFace         │                    │
│  ├─────────────────────────┤         ├─────────────────────────┤                    │
│  │ +id: UUID               │ 1    *  │ +id: UUID               │                    │
│  │ +email: EmailStr        │───────▶ │ +userId: UUID           │                    │
│  │ +phone: str             │         │ +imageUrl: str          │                    │
│  │ +gender: Gender         │         │ +timestamp: datetime    │                    │
│  │ +trustLevel: int        │         │ +reactionCounts: JSON   │                    │
│  │ +trustPoints: int       │         │ +createdAt: datetime    │                    │
│  │ +streakDays: int        │         └─────────────────────────┘                    │
│  │ +cmiScore: float        │                    │                                   │
│  │ +lastMorningFace: date  │                    │ 1                                 │
│  │ +createdAt: datetime    │                    │                                   │
│  └─────────────────────────┘                    │                                   │
│              │ 1                                 ▼                                   │
│              │                          ┌─────────────────────────┐                 │
│              │ 1                        │       Reaction          │                 │
│              ▼                          ├─────────────────────────┤                 │
│  ┌─────────────────────────┐            │ +id: UUID               │                 │
│  │  PsychologicalProfile   │            │ +userId: UUID           │                 │
│  ├─────────────────────────┤            │ +targetType: str        │                 │
│  │ +userId: UUID           │            │ +targetId: UUID         │                 │
│  │ +bigFive: JSON          │            │ +reactionType: Reaction │                 │
│  │ +attachmentStyle: str   │            │ +createdAt: datetime    │                 │
│  │ +loveLanguages: JSON    │            └─────────────────────────┘                 │
│  │ +coreValues: str[]      │                                                       │
│  │ +conflictStyle: str     │                                                       │
│  │ +humorStyle: JSON       │                                                       │
│  │ +sensationSeeking: int  │                                                       │
│  │ +attractivenessScore: float                                                      │
│  └─────────────────────────┘                                                       │
│                                                                                      │
│  ┌─────────────────────────┐         ┌─────────────────────────┐                    │
│  │    DailyQuestion        │         │        Answer           │                    │
│  ├─────────────────────────┤         ├─────────────────────────┤                    │
│  │ +id: UUID               │ 1    *  │ +id: UUID               │                    │
│  │ +questionText: str      │───────▶ │ +userId: UUID           │                    │
│  │ +sourceEpisode: str     │         │ +questionId: UUID       │                    │
│  │ +date: date             │         │ +answerText: str        │                    │
│  │ +goldStandardAnswers:   │         │ +cmiScore: float        │                    │
│  │   UUID[]                │         │ +embedding: vector      │                    │
│  └─────────────────────────┘         │ +reactionCounts: JSON   │                    │
│                                      └─────────────────────────┘                    │
│                                                                                      │
│  ┌─────────────────────────┐         ┌─────────────────────────┐                    │
│  │         Match           │         │        Message          │                    │
│  ├─────────────────────────┤         ├─────────────────────────┤                    │
│  │ +id: UUID               │ 1    *  │ +id: UUID               │                    │
│  │ +userAId: UUID          │───────▶ │ +matchId: UUID          │                    │
│  │ +userBId: UUID          │         │ +senderId: UUID         │                    │
│  │ +status: MatchStatus    │         │ +content: str           │                    │
│  │ +comedyMatchReport: JSON│         │ +contentType: MessageType│                   │
│  │ +matchedAt: datetime    │         │ +isRead: bool           │                    │
│  │ +acceptedAt: datetime   │         │ +createdAt: datetime    │                    │
│  └─────────────────────────┘         └─────────────────────────┘                    │
│                                                                                      │
│  ┌─────────────────────────┐         ┌─────────────────────────┐                    │
│  │        Follow           │         │      Endorsement        │                    │
│  ├─────────────────────────┤         ├─────────────────────────┤                    │
│  │ +followerId: UUID       │         │ +id: UUID               │                    │
│  │ +followedId: UUID       │         │ +fromUserId: UUID       │                    │
│  │ +createdAt: datetime    │         │ +toUserId: UUID         │                    │
│  └─────────────────────────┘         │ +type: EndorsementType  │                    │
│                                      └─────────────────────────┘                    │
│                                                                                      │
│  ┌─────────────────────────┐         ┌─────────────────────────┐                    │
│  │         Group           │         │      GroupMember        │                    │
│  ├─────────────────────────┤         ├─────────────────────────┤                    │
│  │ +id: UUID               │ 1    *  │ +groupId: UUID          │                    │
│  │ +name: str              │───────▶ │ +userId: UUID           │                    │
│  │ +createdBy: UUID        │         │ +joinedAt: datetime     │                    │
│  │ +createdAt: datetime    │         └─────────────────────────┘                    │
│  └─────────────────────────┘                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
Service Layer Class Diagram
text
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              SERVICE LAYER CLASS DIAGRAM                             │
│                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │                            <<interface>>                                        ││
│  │                              IService                                           ││
│  │  ┌─────────────────────────────────────────────────────────────────────────┐   ││
│  │  │ +initialize(): void                                                      │   ││
│  │  │ +healthCheck(): bool                                                     │   ││
│  │  └─────────────────────────────────────────────────────────────────────────┘   ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
│                                              △                                       │
│                                              │                                       │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐        │
│  │  AuthService  │  │  TrustService │  │  CMIService   │  │ MatchService  │        │
│  ├───────────────┤  ├───────────────┤  ├───────────────┤  ├───────────────┤        │
│  │ -supabase     │  │ -supabase     │  │ -supabase     │  │ -cmiService   │        │
│  │ -jwtSecret    │  │               │  │ -groqClient   │  │ -groqClient   │        │
│  ├───────────────┤  ├───────────────┤  ├───────────────┤  ├───────────────┤        │
│  │ +register()   │  │ +addPoints()  │  │ +calcDailyCMI │  │ +calcScore()  │        │
│  │ +login()      │  │ +getLevel()   │  │ +getUserCMI() │  │ +like()       │        │
│  │ +verify()     │  │ +applyPenalty │  │ +getGoldStd() │  │ +getMatches() │        │
│  │ +logout()     │  │ +getHistory() │  │ +updateEmbed  │  │ +simulate()   │        │
│  └───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘        │
│                                                                                      │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐        │
│  │QuestionService│  │MorningFaceSvc │  │ ReactionSvc   │  │ MessageSvc    │        │
│  ├───────────────┤  ├───────────────┤  ├───────────────┤  ├───────────────┤        │
│  │ -supabase     │  │ -supabase     │  │ -supabase     │  │ -supabase     │        │
│  │ -groqClient   │  │ -storage      │  │               │  │ -encryptor    │        │
│  ├───────────────┤  ├───────────────┤  ├───────────────┤  ├───────────────┤        │
│  │ +getDaily()   │  │ +upload()     │  │ +addReaction()│  │ +send()       │        │
│  │ +submitAnswer │  │ +getFeed()    │  │ +removeReact()│  │ +getHistory() │        │
│  │ +getGoldStd() │  │ +updateStreak │  │ +getCounts()  │  │ +markRead()   │        │
│  │ +generateQ()  │  │ +verifyTime() │  │               │  │ +encrypt()    │        │
│  └───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘        │
│                                                                                      │
│  ┌───────────────┐  ┌───────────────┐                                               │
│  │ProfileService │  │VerificationSvc│                                               │
│  ├───────────────┤  ├───────────────┤                                               │
│  │ -supabase     │  │ -personaClient│                                               │
│  ├───────────────┤  ├───────────────┤                                               │
│  │ +getProfile() │  │ +submitID()   │                                               │
│  │ +update()     │  │ +checkStatus()│                                               │
│  │ +getHistory() │  │ +webhook()    │                                               │
│  │ +getBadges()  │  │ +verifySelfie │                                               │
│  └───────────────┘  └───────────────┘                                               │
│                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │                           INTEGRATION CLIENTS                                    ││
│  │                                                                                  ││
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐    ││
│  │  │  GroqClient   │  │PersonaClient  │  │ HuggingFace   │  │ AssemblyAIClient│   ││
│  │  ├───────────────┤  ├───────────────┤  ├───────────────┤  ├───────────────┤    ││
│  │  │ -apiKey       │  │ -apiKey       │  │ -apiKey       │  │ -apiKey       │    ││
│  │  │ -baseUrl      │  │ -webhookUrl   │  │ -modelName    │  │ -pollInterval │    ││
│  │  ├───────────────┤  ├───────────────┤  ├───────────────┤  ├───────────────┤    ││
│  │  │ +chat()       │  │ +createInq()  │  │ +embed()      │  │ +transcribe() │    ││
│  │  │ +embed()      │  │ +getStatus()  │  │ +similarity() │  │ +getStatus()  │    ││
│  │  │ +stream()     │  │ +webhook()    │  │               │  │               │    ││
│  │  └───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘    ││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────┘
DATA FLOW DIAGRAMS
Flow 1: Morning Face Upload & Feed
text
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW: MORNING FACE UPLOAD                               │
│                                                                                      │
│  ┌─────────┐    1. User opens app     ┌─────────┐                                   │
│  │  USER   │─────────────────────────▶│ Client  │                                   │
│  └─────────┘                          │ (React) │                                   │
│       │                                     │                                        │
│       │ 2. Camera captures photo           │                                        │
│       │◀────────────────────────────────────│                                        │
│       │                                     │                                        │
│       │ 3. User confirms & uploads         │                                        │
│       │────────────────────────────────────▶│                                        │
│       │                                     │                                        │
│       │                                     │ 4. POST /morning-face                  │
│       │                                     │    (image + timestamp)                │
│       │                                     │───────────────────────────────────────▶│
│       │                                     │                              ┌─────────┐│
│       │                                     │                              │ Backend ││
│       │                                     │                              │(FastAPI)││
│       │                                     │                              └────┬────┘│
│       │                                     │                                   │     │
│       │                                     │                                   │ 5.  │
│       │                                     │                                   │Save │
│       │                                     │                                   │ to  │
│       │                                     │                                   │ DB  │
│       │                                     │                                   ▼     │
│       │                                     │                              ┌─────────┐│
│       │                                     │                              │Supabase ││
│       │                                     │                              │(Storage)││
│       │                                     │                              └────┬────┘│
│       │                                     │                                   │     │
│       │                                     │                                   │ 6.  │
│       │                                     │                                   │Save │
│       │                                     │                                   │URL  │
│       │                                     │                                   │     │
│       │                                     │ 7. Response: {face_id, streak}    │     │
│       │                                     │◀──────────────────────────────────│     │
│       │                                     │                                   │     │
│       │ 8. Feed updates with new face       │                                   │     │
│       │◀────────────────────────────────────│                                   │     │
│       │                                     │                                   │     │
│  ┌─────────┐                               ┌─────────┐                           │     │
│  │FRIENDS  │◀──────────────────────────────│ Client  │───────────────────────────┘     │
│  │(Other   │    9. Friends see face in feed │ (React)│                                   │
│  │ Users)  │                                └────────┘                                   │
│  └─────────┘                                                                              │
│                                                                                           │
│  Feed Priority Order:                                                                     │
│  1. Friends' morning faces from TODAY                                                     │
│  2. Friends' answers to TODAY's question                                                  │
│  3. Popular morning faces from TODAY (top 10 by 💀)                                       │
│  4. Popular answers to TODAY's question (top 10 by gold standard)                         │
│  5. Friends' morning faces from YESTERDAY                                                 │
│  6. Friends' answers from YESTERDAY                                                       │
│  7. Popular from previous days (decaying)                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────┘
Flow 2: CMI Calculation (Daily at Midnight)
text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW: DAILY CMI CALCULATION                                 │
│                                                                                          │
│  ┌─────────┐                                                                             │
│  │  Cron   │ 1. Trigger at midnight                                                      │
│  │ (Worker)│─────────────────────────────────────────────────────────────────────────┐   │
│  └─────────┘                                                                          │   │
│                                                                                       │   │
│                                                                                       ▼   │
│  ┌─────────┐    2. Fetch all answers for today    ┌─────────┐                          │   │
│  │Supabase │◀─────────────────────────────────────│  CMI    │                          │   │
│  │(Answers)│                                      │Service  │                          │   │
│  └─────────┘─────────────────────────────────────▶│         │                          │   │
│            │    3. Answers with reaction counts   └────┬────┘                          │   │
│            │                                           │                               │   │
│            │                                           │ 4. Identify gold standard     │   │
│            │                                           │    (top 10 by 💀 reactions)   │   │
│            │                                           │                               │   │
│            │                                           │ 5. For gold standard answers │   │
│            │                                           │─────────────────────────────┐ │   │
│            │                                           │                              │ │   │
│            │                                           │ 6. Generate embeddings       │ │   │
│            │                                           │─────────────────────────────▶│   │
│            │                                           │                      ┌─────────┐│   │
│            │                                           │                      │Hugging  ││   │
│            │                                           │                      │Face API ││   │
│            │                                           │◀─────────────────────│         ││   │
│            │                                           │ 7. Embedding vectors └─────────┘│   │
│            │                                           │                               │   │
│            │                                           │ 8. For all other answers       │   │
│            │                                           │    calculate cosine similarity │   │
│            │                                           │    to nearest gold standard    │   │
│            │                                           │                               │   │
│            │                                           │ 9. CMI = similarity × 100      │   │
│            │                                           │                               │   │
│            │                                           │ 10. Batch update CMI scores    │   │
│            │                                           │─────────────────────────────┐   │   │
│            │                                           │                              │   │   │
│            │ 11. Updated answers with CMI scores       │                              │   │   │
│            │◀──────────────────────────────────────────│                              │   │   │
│            │                                           │                              │   │   │
│  ┌─────────┐                                           │                              │   │   │
│  │  User   │ 12. User sees CMI score in profile       │                              │   │   │
│  │ Profile │◀─────────────────────────────────────────│──────────────────────────────┘   │   │
│  └─────────┘                                                                              │   │
│                                                                                           │   │
│  Key Insight: Gold standard = community's 💀 reactions (can't be gamed)                   │   │
│  CMI = semantic similarity to genuinely funny answers                                     │   │
└───────────────────────────────────────────────────────────────────────────────────────────┘
Flow 3: Matching & Discovery
text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW: MATCHING & DISCOVERY                                  │
│                                                                                          │
│  ┌─────────┐                                                                             │
│  │  USER   │ 1. Opens Discover screen                                                    │
│  │  (A)    │─────────────────────────────────────────────────────────────────────────┐   │
│  └─────────┘                                                                          │   │
│                                                                                       │   │
│                                                                                       ▼   │
│  ┌─────────┐    2. GET /matches/discover    ┌─────────┐                               │   │
│  │ Client  │────────────────────────────────▶│Backend  │                               │   │
│  │ (React) │                                 │(FastAPI)│                               │   │
│  └─────────┘                                 └────┬────┘                               │   │
│            ◀─────────────────────────────────────│                                     │   │
│            3. Candidates (answers first)         │                                     │   │
│                                                   │                                     │   │
│                                                   │ 4. Fetch candidate data            │   │
│                                                   │─────────────────────────────────┐ │   │
│                                                   │                                 │ │   │
│                                                   │ 5. For each candidate:           │ │   │
│                                                   │    - Latest answer               │ │   │
│                                                   │    - CMI score                   │ │   │
│                                                   │    - Past funny answers          │ │   │
│                                                   │                                 │ │   │
│                                                   │ 6. Calculate MatchScore          │ │   │
│                                                   │    (if user has rated 10+ answers)│ │   │
│                                                   │                                 │ │   │
│                                                   │ 7. Rank by MatchScore            │ │   │
│                                                   │                                 │ │   │
│                                                   │ 8. Return ranked candidates      │ │   │
│                                                   │◀────────────────────────────────│   │
│                                                   │                                     │   │
│                                                   │                                     │   │
│  9. User rates answer as 💀 (Worst Friend)        │                                     │   │
│  ┌─────────┐    POST /reactions    ┌─────────┐    │                                     │   │
│  │ Client  │───────────────────────▶│Backend  │    │                                     │   │
│  └─────────┘                        │(FastAPI)│    │                                     │   │
│            ◀────────────────────────│         │    │                                     │   │
│            10. Reaction recorded     └────────┘    │                                     │   │
│                                                   │                                     │   │
│  11. After 10 ratings, unlock faces              │                                     │   │
│  ┌─────────┐                                      │                                     │   │
│  │ Client  │──────────────────────────────────────┘                                     │   │
│  └─────────┘                                                                             │   │
│                                                                                          │   │
│  12. User sees candidate's morning face gallery                                          │   │
│                                                                                          │   │
│  13. User taps ❤️ (Like)                          ┌─────────┐                           │   │
│  ┌─────────┐    POST /matches/like   ┌─────────┐  │ User B  │                           │   │
│  │ Client  │─────────────────────────▶│Backend  │  │ (Other) │                           │   │
│  └─────────┘                          │(FastAPI)│  └─────────┘                           │   │
│                                       └────┬────┘      │                                 │   │
│                                            │           │                                 │   │
│                                            │ 14. Check if User B already liked User A   │   │
│                                            │           │                                 │   │
│                                            │           │ 15. If mutual:                  │   │
│                                            │           │    - Create match               │   │
│                                            │           │    - Generate Comedy Match Report│   │
│                                            │           │    - Send notifications to both │   │
│                                            │           │                                 │   │
│                                            │ 16. Response: {mutual: true, match_id}      │   │
│                                            │◀────────────────────────────────────────────│   │
│                                            │                                             │   │
│  17. Both users see Comedy Match Report    │                                             │   │
│      "You and @SarahK have 91% CMI..."     │                                             │   │
│                                                                                          │   │
│  18. Users can start chatting              │                                             │   │
└──────────────────────────────────────────────────────────────────────────────────────────┘
STATE MACHINES
User Trust Level State Machine
text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                         TRUST LEVEL STATE MACHINE                                        │
│                                                                                          │
│                                    ┌─────────────────────────────────────────────────┐  │
│                                    │                                                 │  │
│                                    ▼                                                 │  │
│  ┌──────────────┐    Email + Phone    ┌──────────────┐    Complete 7-day streak      │  │
│  │   LEVEL 1    │────────────────────▶│   LEVEL 2    │    + 3 endorsements           │  │
│  │  (0-19 pts)  │                      │  (20-49 pts) │─────────────────────────────▶│  │
│  │              │                      │              │                               │  │
│  │ Features:    │                      │ Features:    │                               │  │
│  │ - Feed only  │                      │ - Match      │                               │  │
│  │ - Answer Q   │                      │ - DM (text)  │                               │  │
│  │ - React      │                      │ - See faces  │                               │  │
│  └──────────────┘                      └──────────────┘                               │  │
│         │                                     │                                        │  │
│         │                                     │                                        │  │
│         │ Get reported 3x                     │ Get reported 3x                        │  │
│         │ (Red flags)                         │ (Red flags)                            │  │
│         │                                     │                                        │  │
│         ▼                                     ▼                                        │  │
│  ┌──────────────┐                      ┌──────────────┐    ID Verify + Face Check      │  │
│  │   FROZEN     │                      │   LEVEL 3    │    + 100 points               │  │
│  │   (Penalty)  │                      │  (50-99 pts) │─────────────────────────────▶│  │
│  │              │                      │              │                               │  │
│  │ Must complete│                      │ Features:    │                               │  │
│  │ - 5 Hopecore │                      │ - Voice notes│                               │  │
│  │ - 7-day streak│                     │ - Groups     │                               │  │
│  │              │                      │ - Request    │                               │  │
│  │ to unfreeze  │                      │   location   │                               │  │
│  └──────────────┘                      └──────────────┘                               │  │
│         │                                     │                                        │  │
│         │ Complete recovery                    │                                        │  │
│         │                                     │ 30-day streak                         │  │
│         │                                     │ + 5 endorsements                       │  │
│         ▼                                     │ + 10 meet verifications                │  │
│  ┌──────────────┐                             │                                        │  │
│  │   LEVEL 1    │                             ▼                                        │  │
│  │  (reset)     │                      ┌──────────────┐                               │  │
│  └──────────────┘                      │   LEVEL 4    │                               │  │
│                                        │ (100-199 pts)│                               │  │
│                                        │              │                               │  │
│                                        │ Features:    │                               │  │
│                                        │ - Share loc  │                               │  │
│                                        │ - Heat map   │                               │  │
│                                        │ - Proximity  │                               │  │
│                                        │   icebreaker │                               │  │
│                                        └──────────────┘                               │  │
│                                               │                                        │  │
│                                               │ 200+ points                           │  │
│                                               │ + 90-day streak                       │  │
│                                               │ + Council nomination                  │  │
│                                               ▼                                        │  │
│                                        ┌──────────────┐                               │  │
│                                        │   LEVEL 5    │                               │  │
│                                        │  (200+ pts)  │                               │  │
│                                        │              │                               │  │
│                                        │ Features:    │                               │  │
│                                        │ - All        │                               │  │
│                                        │ - Trusted    │                               │  │
│                                        │   Badge      │                               │  │
│                                        │ - Council    │                               │  │
│                                        │   voting     │                               │  │
│                                        └──────────────┘                               │  │
└─────────────────────────────────────────────────────────────────────────────────────────┘
Match State Machine
text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                            MATCH STATE MACHINE                                          │
│                                                                                          │
│                                    ┌─────────────────────────────────────────────────┐  │
│                                    │                                                 │  │
│                                    ▼                                                 │  │
│  ┌──────────────┐    User A ❤️    ┌──────────────┐    User B ❤️    ┌──────────────┐  │  │
│  │    NONE      │────────────────▶│   PENDING    │────────────────▶│   ACCEPTED   │  │  │
│  │ (No match)   │    User B ?     │  (A liked)   │    Mutual!      │  (MATCHED)   │  │  │
│  └──────────────┘                 └──────────────┘                 └──────┬───────┘  │  │
│         │                                │                                │          │  │
│         │                                │                                │          │  │
│         │ User B ❤️ first               │ User B passes                  │ 48 hours  │  │
│         │ (asymmetric)                   │ (or ignores)                    │ no messages│  │
│         │                                │                                │          │  │
│         ▼                                ▼                                ▼          │  │
│  ┌──────────────┐                 ┌──────────────┐                 ┌──────────────┐  │  │
│  │   PENDING    │                 │   REJECTED   │                 │   EXPIRED    │  │  │
│  │  (B liked)   │                 │  (Passed)    │                 │  (Ghosted)   │  │  │
│  └──────┬───────┘                 └──────────────┘                 └──────────────┘  │  │
│         │                                                                             │  │
│         │ User A ❤️                                                                   │  │
│         │ (mutual)                                                                     │  │
│         │                                                                             │  │
│         ▼                                                                             │  │
│  ┌──────────────┐                                                                     │  │
│  │   ACCEPTED   │                                                                     │  │
│  │  (MATCHED)   │─────────────────────────────────────────────────────────────────────┘  │
│  └──────────────┘                                                                        │
│                                                                                          │
│  Comedy Match Report generated at ACCEPTED state                                         │
│  Both users can DM immediately                                                           │
│  Match expires after 7 days of no messages                                               │
└──────────────────────────────────────────────────────────────────────────────────────────┘
SECURITY ARCHITECTURE
Security Layers
text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           SECURITY ARCHITECTURE                                          │
│                                                                                          │
│  Layer 1: Network Security                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │ • HTTPS only (TLS 1.2+)                                                             ││
│  │ • CORS locked to Bad Friends domains only                                           ││
│  │ • Rate limiting: 10 req/min per endpoint, 100/min per IP                            ││
│  │ • Request size limit: 25MB                                                          ││
│  │ • DDoS protection via Cloudflare (optional)                                         ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                          │
│  Layer 2: Application Security                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │ • JWT tokens with 24-hour expiry                                                    ││
│  │ • Refresh token rotation                                                             ││
│  │ • Supabase RLS policies on every table                                               ││
│  │ • Input validation via Pydantic                                                      ││
│  │ • SQL injection prevention (Supabase parameterized queries)                          ││
│  │ • XSS protection (React escapes by default)                                          ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                          │
│  Layer 3: Data Security                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │ • Passwords hashed with bcrypt (Supabase Auth)                                       ││
│  │ • E2E encryption for messages (Signal Protocol)                                      ││
│  │ • ID verification images deleted after processing                                    ││
│  │ • Morning face images stored with random UUID filenames                              ││
│  │ • No geolocation stored permanently (deleted after 24h)                              ││
│  │ • PII encrypted at rest (Supabase)                                                   ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                          │
│  Layer 4: Operational Security                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │ • Environment variables for all secrets                                              ││
│  │ • .env never committed to Git                                                        ││
│  │ • API key rotation quarterly                                                         ││
│  │ • Automated security scans (GitHub Dependabot)                                       ││
│  │ • Audit logs for trust events                                                        ││
│  │ • Rate limit alerts on abuse                                                         ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                          │
│  Layer 5: User Safety                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │ • Mandatory verification (email + phone) for all                                     ││
│  │ • ID + selfie verification for women (v1.1)                                          ││
│  │ • Graduated trust levels for location sharing                                        ││
│  │ • "Ghost Mode" for location privacy                                                  ││
│  │ • Block user feature                                                                 ││
│  │ • Report user with moderation queue                                                  ││
│  │ • "Bad Friend Backup" for date safety                                                ││
│  │ • Emergency kill switch                                                              ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────────┘
DEPLOYMENT ARCHITECTURE
Production Deployment
text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           PRODUCTION DEPLOYMENT ARCHITECTURE                             │
│                                                                                          │
│                                    ┌─────────────────────────────────────────────────┐  │
│                                    │                    USER                           │  │
│                                    │           (Mobile/Desktop Browser)               │  │
│                                    └─────────────────────┬───────────────────────────┘  │
│                                                          │                               │
│                                                          │ HTTPS                         │
│                                                          ▼                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │                              NETLIFY (Frontend)                                      ││
│  │                                                                                      ││
│  │  ┌─────────────────────────────────────────────────────────────────────────────────┐││
│  │  │  • Static React build                                                           │││
│  │  │  • CDN distributed globally                                                     │││
│  │  │  • Automatic HTTPS                                                              │││
│  │  │  • Environment variables: VITE_SUPABASE_URL, VITE_API_URL                       │││
│  │  └─────────────────────────────────────────────────────────────────────────────────┘││
│  │                                                                                      ││
│  │  URL: https://bad-friends.netlify.app                                               ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                          │                               │
│                                                          │ HTTPS API Calls               │
│                                                          ▼                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │                              RENDER (Backend)                                        ││
│  │                                                                                      ││
│  │  ┌─────────────────────────────────────────────────────────────────────────────────┐││
│  │  │  • FastAPI application                                                          │││
│  │  │  • Uvicorn ASGI server                                                          │││
│  │  │  • Auto-scaling (free tier: spins down after 15 min)                            │││
│  │  │  • Health check: /status                                                        │││
│  │  └─────────────────────────────────────────────────────────────────────────────────┘││
│  │                                                                                      ││
│  │  URL: https://bad-friends-api.onrender.com                                          ││
│  │  Cold start prevention: UptimeRobot pings every 10 min                              ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                          │                               │
│                                    ┌─────────────────────┼─────────────────────────────┐│
│                                    │                     │                             ││
│                                    ▼                     ▼                             ││
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │                           SUPABASE (Database + Storage)                              ││
│  │                                                                                      ││
│  │  ┌─────────────────────────────┐    ┌─────────────────────────────┐                 ││
│  │  │        PostgreSQL           │    │          Storage            │                 ││
│  │  │  • Users                     │    │  • Morning face images      │                 ││
│  │  │  • Morning faces             │    │  • ID verification images   │                 ││
│  │  │  • Answers                   │    │    (temp, deleted)          │                 ││
│  │  │  • Matches                   │    │  • GIFs/voice notes (future)│                 ││
│  │  │  • Messages                  │    └─────────────────────────────┘                 ││
│  │  │  • pgvector for embeddings   │                                                     ││
│  │  └─────────────────────────────┘                                                     ││
│  │                                                                                      ││
│  │  • Row Level Security enabled                                                        ││
│  │  • Real-time subscriptions for feed                                                  ││
│  │  • Auth: Supabase Auth (JWT)                                                         ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
│                                                          │                               │
│                                    ┌─────────────────────┼─────────────────────────────┐│
│                                    │                     │                             ││
│                                    ▼                     ▼                             ││
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐  ┌─────────────────┐  │
│  │         GROQ API            │  │       HUGGING FACE API       │  │   PERSONA API   │  │
│  │  • Text generation (LLM)    │  │  • Embeddings for CMI        │  │  • ID + selfie  │  │
│  │  • 30 req/min free tier     │  │  • Free inference tier       │  │  • $2/verification│ │
│  └─────────────────────────────┘  └─────────────────────────────┘  └─────────────────┘  │
│                                                                                          │
│  Scheduled Jobs:                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐│
│  │  • CMI Calculation: Daily at midnight (cron job on Render or external)              ││
│  │  • Streak Maintenance: Daily at 2am                                                  ││
│  │  • UptimeRobot: Pings backend every 10 min to prevent cold starts                   ││
│  └─────────────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────────────┘
MONITORING & ANALYTICS
Key Metrics to Track
python
# metrics.py

class MetricsService:
    """Track key product metrics"""
    
    # Acquisition
    daily_signups = "bad_friends.daily_signups"
    verification_completion_rate = "bad_friends.verification_completion_rate"
    
    # Activation
    morning_face_completion_rate = "bad_friends.morning_face_completion_rate"
    daily_question_response_rate = "bad_friends.daily_question_response_rate"
    
    # Engagement
    daily_active_users = "bad_friends.daily_active_users"
    weekly_active_users = "bad_friends.weekly_active_users"
    streak_retention = "bad_friends.streak_retention"  # % of users with 7+ day streak
    avg_time_in_app = "bad_friends.avg_time_in_app"
    
    # Matching
    matches_per_user = "bad_friends.matches_per_user"
    likes_to_match_ratio = "bad_friends.likes_to_match_ratio"
    messages_per_match = "bad_friends.messages_per_match"
    
    # Safety
    reports_per_user = "bad_friends.reports_per_user"
    block_rate = "bad_friends.block_rate"
    
    # Business (v2)
    conversion_to_fancy_b = "bad_friends.conversion_to_fancy_b"
    mrr = "bad_friends.mrr"
Health Checks
python
# health.py

@app.get("/status")
async def health_check():
    checks = {
        "database": await check_database(),
        "storage": await check_storage(),
        "groq": await check_groq(),
        "persona": await check_persona(),
        "timestamp": datetime.now().isoformat()
    }
    
    status = "healthy" if all(checks.values()) else "degraded"
    return {"status": status, "checks": checks}

async def check_database():
    try:
        await supabase.table('users').select('count', count='exact').limit(1).execute()
        return True
    except:
        return False