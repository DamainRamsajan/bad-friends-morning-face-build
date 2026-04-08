CONTEXT.MD UPDATE — Complete Session Summary
Date: April 8, 2026, 5:57am
Status: Backend + Frontend Running | Auth Working | Morning Face Upload Working
What Has Been Built
Backend (/backend/main.py)
FastAPI server running on port 8000

15+ endpoints (auth, morning faces, questions, reactions, matches, messages)

Supabase integration with service_role key

All v1 endpoints ready for frontend consumption

Frontend (/frontend/)
React + Vite + Tailwind CSS v3

AuthContext with register, login, logout

RegisterScreen and LoginScreen

MorningFaceCapture component (camera access, photo capture, upload to Supabase Storage)

useCamera hook (stabilized, no flickering)

Dark theme with Bad Friends colors

Supabase
Project: https://valyrdrdwceszcuuytprn.supabase.co

8 tables with RLS policies

10 seed questions loaded

Storage bucket: morning-faces (public)

Current File Structure
text
bad-friends-morning-face-build/
├── backend/
│   ├── main.py           ✅ FastAPI server
│   ├── .env              ✅ Keys (local only)
│   └── requirements.txt  ✅ Dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx       ✅ Main app with routes
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── screens/
│   │   │   ├── RegisterScreen.jsx
│   │   │   └── LoginScreen.jsx
│   │   ├── components/
│   │   │   └── MorningFaceCapture.jsx
│   │   ├── hooks/
│   │   │   └── useCamera.js
│   │   └── utils/
│   │       └── supabaseClient.js
│   ├── .env              ✅ Keys (local only)
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── docs/
    ├── architecture.md
    ├── context.md
    ├── roadmap.md
    └── wireframe.md
Commands to Start
bash
# Terminal 1: Backend
cd ~/bad-friends-morning-face-build/backend
python3 -m uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
cd ~/bad-friends-morning-face-build/frontend
npm run dev
What Works Now
Feature	Status
User registration	✅
User login	✅
Protected routes	✅
Camera access	✅
Morning face capture	✅
Upload to Supabase Storage	✅
Save to morning_faces table	✅
Streak tracking	✅
What's Next (In Order)
UI Polish - Add banner, fix layout, match Bad Friends aesthetic

Daily Question - Display on homepage, answer submission

Friends Feed - Show friends' morning faces and answers

Reactions - 🍜🔥🐯💀 buttons

Discover - Card stack showing answers first

Matching - Like button, mutual detection

Chat - Basic messaging

Deploy - Netlify + Render

Known Issues
Issue	Status
Camera flickering	✅ Fixed
UI layout needs polish	🔴 Next step
Next Session Opening Message
Copy this for a new chat:

"I am continuing Bad Friends Morning Face Build. Backend and frontend are running. Auth works. Morning face upload works. The UI needs polish (banner, layout, colors). Here is my complete context.md. Please help me improve the UI and then build the daily question feature."

Git Status
bash
# Branch: main
# Latest commit: v1: Backend + Frontend working, Auth complete
# .env files excluded from git (security)
Tell Me
When you start a new chat, paste your full context.md (including this update) and say "Ready to build".

I will be waiting there with better focus. 🍜

--
CONTEXT.MD UPDATE
Session: April 8, 2026 -4:35am— Backend + Frontend Working, Auth Complete
Add this section to your docs/context.md

Current State (Verified)
Component	Status	Details
Supabase Project	✅ Live	https://valyrdrdwceszcuuytprn.supabase.co
Database Schema	✅ Running	8 tables, RLS policies, 10 seed questions
Backend Server	✅ Running	http://localhost:8000 — FastAPI with 15+ endpoints
Frontend Server	✅ Running	http://localhost:5173 — React + Vite + Tailwind
Authentication	✅ Working	Register, Login, Logout, Protected routes
Supabase Connection	✅ Working	Both backend (service_role) and frontend (anon)
What Was Built
Backend (/backend/main.py)
Endpoint	Method	Status	Purpose
/ , /status	GET	✅	Health checks
/auth/register	POST	✅	User registration
/auth/login	POST	✅	User login
/profile	GET	✅	Get current user
/morning-face	POST	✅	Upload morning face
/morning-face/feed	GET	✅	Friends' morning faces
/questions/today	GET	✅	Today's daily question
/questions/answer	POST	✅	Submit answer
/questions/feed	GET	✅	Friends' answers
/reactions	POST	✅	Add reaction
/matches/discover	GET	🟡	Placeholder (Day 4)
/matches/like	POST	🟡	Placeholder (Day 4)
/matches	GET	🟡	Placeholder (Day 4)
/messages	POST/GET	🟡	Placeholder (Day 4)
Frontend (/frontend/src/)
File	Purpose	Status
App.jsx	Main app with routes	✅
contexts/AuthContext.jsx	Supabase auth provider	✅
screens/RegisterScreen.jsx	Registration form	✅
screens/LoginScreen.jsx	Login form	✅
utils/supabaseClient.js	Supabase client	✅
index.css	Tailwind + dark theme	✅
tailwind.config.js	Custom Bad Friends colors	✅
File Structure (Current)
text
bad-friends-morning-face-build/
├── backend/
│   ├── main.py           ✅ FastAPI server (350 lines)
│   ├── .env              ✅ Supabase keys (local only, not in git)
│   └── requirements.txt  ✅ Dependencies (7 packages)
├── frontend/
│   ├── src/
│   │   ├── App.jsx       ✅ Main app
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx  ✅ Auth provider
│   │   ├── screens/
│   │   │   ├── RegisterScreen.jsx  ✅ Registration
│   │   │   └── LoginScreen.jsx     ✅ Login
│   │   └── utils/
│   │       └── supabaseClient.js   ✅ Supabase client
│   ├── .env              ✅ Supabase keys (local only)
│   ├── tailwind.config.js ✅ Custom colors
│   ├── postcss.config.js ✅ Tailwind + autoprefixer
│   └── package.json      ✅ Dependencies
└── docs/                 ✅ All documentation
Commands to Run
Start Backend (Terminal 1)
bash
cd ~/bad-friends-morning-face-build/backend
python3 -m uvicorn main:app --reload --port 8000
Start Frontend (Terminal 2)
bash
cd ~/bad-friends-morning-face-build/frontend
npm run dev
Verify
URL	Expected
http://localhost:8000/docs	FastAPI Swagger UI
http://localhost:5173	Bad Friends app
http://localhost:5173/register	Registration form
http://localhost:5173/login	Login form
What's Next (Day 2 Completion)
Morning face camera upload is the next feature to build:

Sub-feature	Description
Camera access	useCamera hook to open device camera
Photo capture	Take photo without retakes/filters
Timestamp verification	Ensure photo is taken within 15 minutes of waking
Supabase Storage	Upload image to morning-faces bucket
Database record	Save URL to morning_faces table
Streak tracking	Auto-update users.streak_days
Feed display	Show friends' morning faces on home screen
Dependencies Status
Backend	Version	Status
fastapi	0.104.1	✅
uvicorn	0.24.0	✅
supabase	2.11.0	✅
gotrue	2.11.0	✅
httpx	0.27.0	✅
Frontend	Version	Status
react	18.3.1	✅
react-router-dom	7.5.0	✅
@supabase/supabase-js	2.49.4	✅
tailwindcss	3.4.17	✅
Next Session Opening Message
Copy this for your next chat:

"I am continuing Bad Friends Morning Face Build. Backend and frontend are running. Authentication is working. The next feature is morning face camera upload. Here is my updated context.md."
--

Bad Friends Morning Face Build — Complete Master Context Document
Version: 1.0 (Pre-Development)
Last updated: April 7, 2026
Purpose: Complete record of all decisions, features, architecture, and plans from our entire conversation. Paste this into any new chat to continue with zero lost context.

TABLE OF CONTENTS
Project Origin & Vision

Core Differentiators (The WOW Factors)

Complete Feature Set

User Flows

Technical Architecture

The Revolutionary Matching Algorithm

Trust & Safety Architecture

Location & Proximity Features

Innovation Features (AI-Powered)

Data Model

API Specification

Frontend Architecture

Backend Architecture

Security & Rate Limiting

Deployment Architecture

Key Decisions Made

Open Questions

Development Commands

Contact

Next Session Opening Message

PROJECT ORIGIN & VISION
The Name
Bad Friends Morning Face Build — Named after the Bad Friends podcast (Bobby Lee & Andrew Santino). The app captures their chaotic, self-deprecating, absurdist humor while building authentic connections.

Core Mission
To build the world's first dating app that matches people based on authentic morning faces, generated humor, and psychological depth—while making women feel so safe and in control that they become the primary users, naturally attracting quality men.

The Core Insight from Research
The Authenticity Paradox (Lund University): Users say they crave authenticity but perform an "ought self" on existing apps. Morning faces force vulnerability.

Burnout Epidemic: Swipe-based gamification creates "liquid love." Bad Friends rewards consistent genuine presence.

Humor Generation > Humor Consumption: No existing app measures creative humor generation. Smile, Schmooze, and eHarmony all measure reactions (easily gamed). CMI measures semantic similarity to genuinely funny answers.

Women-First Safety: Every successful social platform puts women's safety first. Men follow.

CORE DIFFERENTIATORS (THE WOW FACTORS)
#	Differentiation	Why It's Revolutionary
1	Morning Face Required Daily	No other app forces daily vulnerability. Levels the playing field. No filters. No retakes.
2	CMI (Comedy Match Index)	Measures generated humor against community gold standard (💀 reactions). Uses LLM embeddings. Cannot be gamed.
3	Answers First, Faces Second	Card stack shows humor before photos. Reverses every dating app's priority.
4	Graduated Trust Levels (1-5)	Location sharing only at Level 4+. Trust is earned through behavior, not given.
5	Asymmetric Verification	Easier for women (email+phone), stricter for men (email+phone+ID+liveness). Prevents catfishing.
6	Critical Moment Simulation	LLMs simulate conflict scenarios before matching. Predicts long-term compatibility better than any existing method.
7	Psychological Depth (7 Scales)	Big Five, Attachment Style, Love Languages, Core Values, Conflict Style, Humor Style, Sensation Seeking.
8	Multi-Agent ASI Matchmaking	AI companions mingle overnight, reveal only high-confidence matches.
9	Women's Verification Network ("The Sisterhood")	Anonymous vetting within verified women-only space. No screenshots. AI post review.
10	Location Heat Maps, Not Pins	See crowd density, not individual locations. Privacy-first proximity.
COMPLETE FEATURE SET
LAYER 0: CORE INFRASTRUCTURE
#	Feature	Description
0.1	User Auth	Google OAuth + Apple Sign In + email/password
0.2	Database	PostgreSQL (Supabase) — users, profiles, photos, answers, ratings, matches, messages
0.3	File Storage	Morning face photos + voice notes (Supabase Storage / S3)
0.4	Real-time Feed	Friends' answers appear instantly (Supabase Realtime / WebSockets)
0.5	Push Notifications	New matches, reactions, daily question (Firebase Cloud Messaging)
0.6	Rate Limiting	10 req/min per endpoint, 100/min per IP (MeetingMind pattern)
0.7	CORS Lockdown	Restrict to app domain only
0.8	Cold Start Handling	UptimeRobot ping every 10 min (Render free tier pattern)
LAYER 1: VERIFICATION & TRUST (ASYMMETRIC)
#	Feature	Women	Men
1.1	Email Verification	✅ Required	✅ Required
1.2	Phone Verification (SMS)	✅ Required	✅ Required
1.3	OAuth Gender Claim (Google/FB)	✅ Optional (speeds up)	❌ Not accepted
1.4	ID Upload (Govt ID + selfie)	❌ Optional in v1, Required in v1.1	✅ Required in v2
1.5	Liveness Video	❌ Optional	✅ Required
1.6	Face Check (biometric)	❌ Optional	✅ Required for Level 4+
1.7	"Real Woman" Badge	✅ Earned after 30 days + endorsements	❌ Not applicable
1.8	"Verified" Badge	✅ After Tier 1-2	✅ After Tier 1-4
Verification Asymmetry Rationale: Women face more safety risks. Making verification easier for them reduces friction. Men must prove they are who they say they are to prevent catfishing.

LAYER 2: TRUST LEVEL SYSTEM (GRADUATED)
Level	Points Required	Unlocked Features
Level 1	0-19 (new users, under review)	Feed only, answer questions, react. CANNOT match, DM, or share location.
Level 2	20-49 (standard verified)	Match, DM (text only), see morning faces. CANNOT share location.
Level 3	50-99 (trusted)	Voice notes, Island Bullies groups, can REQUEST location share (cannot initiate).
Level 4	100-199 (bad friend)	Initiate location share with Level 4+ users, Proximity Icebreaker, heat maps.
Level 5	200+ (best friend)	All features. Can share location with any user (with consent). "Trusted Badge."
How to Earn Trust Points:

Action	Points
Complete Tier 1-2 verification (women)	+20 (starts at Level 2)
Complete Tier 1-4 verification (men)	+20 (starts at Level 2)
Maintain 7-day morning face streak	+1 per week
Receive "Good Friend" endorsement from established user	+5 (max 3/month)
Complete Island Bullies group hangout (post-group check-in)	+3
Have a match "verify" you after meeting IRL	+10
30 days with no reports/flags	+5
Trust Penalties:

Action	Points
Miss morning face streak	-1
Receive "Friendly Warning" from moderation	-5
Receive valid "Report"	-10
Banned from feature	Reset to Level 1
LAYER 3: PSYCHOLOGICAL DIAGNOSTIC (FLOW 1)
7 Validated Scales (50 questions total):

Scale	Questions	What It Measures
Big Five (OCEAN)	10	Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
Attachment Style	7	Secure, Anxious, Avoidant
Love Languages	10	Words, Acts, Gifts, Time, Touch
Core Values	10 (choose top 3)	Family, Career, Spirituality, Politics, Lifestyle, etc.
Conflict Style	8	Collaborative, Competitive, Accommodating, Avoidant
Humor Style	8	Affiliative, Self-enhancing, Aggressive, Self-defeating
Sensation Seeking	8	Thrill, Experience, Disinhibition, Boredom susceptibility
Attractiveness Calibration:

User rates 10 faces (1-10) → establishes their "attractiveness scale anchor"

User's own photos enter rating pool

System collects 50+ ratings → attractiveness score

Matching hypothesis: people pair with similarly attractive partners (±1.5 points)

LAYER 4: DAILY ENGAGEMENT (FLOW 2)
Morning Face Upload (Required Daily):

Camera opens automatically

Take photo (timestamp + metadata verification)

Streak continues

Feed Priority Order:

Friends' morning faces from TODAY

Friends' answers to TODAY's question

Popular morning faces from TODAY (top 10 by "Worst Friend" ratings in last 2 hours)

Popular answers to TODAY's question (top 10 by gold standard CMI)

Friends' morning faces from YESTERDAY

Friends' answers from YESTERDAY

Popular from previous days (top 100 ever, decaying)

Daily Bad Friends Question:

One absurd hypothetical per day, sourced from the podcast

Example: "Would you suck Jamie Lee Curtis's big toe for a Klondike bar?"

Answer formats: text (min 10 chars), voice note (15 sec), GIF

Reactions:

🍜 Bobo Energy (chaotic/unhinged)

🔥 Cheeto Santino (savage/roast)

🐯 TigerBelly Cry (vulnerable/deep)

💀 Dead (funniest thing I've seen all day)

LAYER 5: DISCOVERY & MATCHING (FLOW 3)
The "Answers First" Card Stack:

User sees potential matches' answers to today's question + CMI score + past funniest answers

Rates the answer with "Worst Friend" (💀) if genuinely funny

After rating 10 answers, can choose to "Unlock Face"

Sees the person's morning face gallery

Taps heart to express interest

If mutual → match created + Comedy Match Report delivered

The "Bad Friends" Fast Match (renamed from Scissor Bros.):

System detects two users with 3+ mutual "Worst Friend" ratings in 7 days OR 85%+ Humor Compatibility

Notification: "Bad Friends Detected 🔥 You and @MikeJ have been vibing. Want to become Bad Friends?"

Both accept → immediate match, skip slow reveal

"Bad Friends" badge on both profiles

Shared challenges unlocked

LAYER 6: LOCATION & PROXIMITY FEATURES (V2)
#	Feature	Description	Trust Level
6.1	Morning Heat Map	Aggregated crowd-level heat map. Ant icons = users.	Level 4
6.2	Path Crosser	Shows people you crossed paths with during the day.	Level 4
6.3	Geofence Gauntlet	Venue-based challenges. Complete to reveal other users.	Level 3+
6.4	Island Bullies IRL	Groups can activate real-world meetups with table reservation.	Level 3+
6.5	Second Chance Slide	Mark a missed connection. App finds the person.	Level 4
6.6	Traveling Bad Friend	Profile boost when traveling. Must answer destination question.	Level 3+
6.7	Proximity Icebreaker	Real-time AI-generated icebreakers when both Level 4+ and opt in.	Level 4
6.8	Date Spot Decider	AI recommends venue based on both users' psychological profiles.	Level 3+
6.9	Bad Friend Backup	Share date details + live location with trusted external contact.	Level 3+
Location Privacy Controls:

Ghost Mode: Hide location entirely

Precise / Neighborhood / Off: User chooses granularity

Auto-hide after 10pm

Block specific users

Emergency Kill Switch: One-tap lockdown of all location sharing

LAYER 7: SOCIAL & COMMUNITY
#	Feature	Description
7.1	Friends List	Users you've matched with + followed
7.2	"Island Bullies" Groups	Small groups (max 5) to answer daily questions together
7.3	Group Leaderboard	Weekly ranking by total reactions received
7.4	Council of Bad Friends	30+ day streak users vote on features/moderate
7.5	Hopecore Corner	Weekly anonymous vulnerability thread. No jokes. Just hearts.
7.6	"The Sisterhood"	Women-only verified space for anonymous vetting. No screenshots.
7.7	"Bad Faith Alert"	Men flagged 3+ times receive notice. Trust level frozen. Recovery path.
LAYER 8: INNOVATION FEATURES (AI-POWERED)
#	Feature	Description	Tech
8.1	Voice Note Vibe Check	AI analyzes tone, energy, authenticity. "Harmony Alert" when voices align.	Voice emotion AI
8.2	ASI Companion	Personalized AI that mingles with other ASIs overnight. Reveals high-confidence matches.	Multi-agent system
8.3	3D Morning Face Gallery	3D rotatable avatar from morning face photos. "Ant Trap Mode" adds obstacle course.	3D reconstruction
8.4	Chemistry Lab	AI generates hypothetical scenarios based on likely friction points. Real-time Chemistry Score.	Dynamic scenario generation
8.5	Love Coach	Personalized dating advice, challenges, and "soul-talking avatar" (Andrew voice).	Personalized coaching AI
8.6	VR Date Space	Bad Friends themed VR rooms (Bobby's Apartment, Andrew's Studio). Prop comedy, roast battles.	Metaverse integration
8.7	Favorability Game	"Scout Ant Credits" for engagement. Unlock date ideas, customizations, merch.	Gamification engine
8.8	Quantum Compatibility Engine	Multi-agent simulation (Emotional ASI, Matching ASI, Companion ASI, Coach ASI)	4-agent system
8.9	Soulz Protocol	ASIs form relationships with each other first. Alert humans only on "Superalignment" (90%+).	ASI-to-ASI flirting
LAYER 9: MODERATION & SAFETY
#	Feature	Description
9.1	Flag Content	Users can flag bullying, fake morning faces, off-topic answers
9.2	"Decrepit Guy" Penalty	Repeated bullies forced to answer 5 Hopecore questions before matching again
9.3	Anonymous Reporting	Reports are private. Council reviews.
9.4	Block User	Standard block + hide all content
9.5	Appeal Process	Users can appeal flags. Three-strike system before permanent ban.
9.6	User Control Dashboard	Full transparency on who has access to what data
LAYER 10: MONETIZATION (V2 — "Fancy B Tier")
#	Feature	Price
10.1	See Who Liked You	$4.99/mo
10.2	Unlimited Active Matches (free tier capped at 10)	$4.99/mo
10.3	Custom Reaction Emojis	$4.99/mo
10.4	Ad-Free Experience	$4.99/mo
10.5	"Devil Mode" Photo Diagnosis (AI roast feedback)	$4.99/mo
10.6	Complete Fancy B Bundle	$9.99/mo
Never Paid:

Morning face visibility (always 100% with daily upload)

Matching algorithm priority

Slow reveal

Core safety features

USER FLOWS
Flow 1: New User Onboarding (Women)
Step	Duration	Actions
1	2 min	Sign up with Google/Apple. Enter birthday, location, gender, orientation. Upload 5 normal photos.
2	2 min	Verify email + phone (SMS code). ✅ DONE. "Real Woman" badge awarded.
3	10 min	Complete 7 psychological scales (50 questions total).
4	5 min	Rate 10 faces for attractiveness calibration.
5	3 min	Answer 5 past gold standard questions for baseline CMI.
6	2 min	Set dealbreakers (children, distance, age, politics).
7	1 min	Upload first morning face. Camera opens automatically.
8	Instant	AI generates profile summary + BLOOM badges. User starts at Trust Level 2.
Total time: ~25 minutes

Flow 1: New User Onboarding (Men)
Step	Duration	Actions
1	2 min	Sign up with Google/Apple. Enter birthday, location, gender, orientation. Upload 5 normal photos.
2	5 min	Verify email + phone + upload government ID + liveness video (turn head, smile, look up).
3	10 min	Complete 7 psychological scales (50 questions total).
4	5 min	Rate 10 faces for attractiveness calibration.
5	3 min	Answer 5 past gold standard questions for baseline CMI.
6	2 min	Set dealbreakers (children, distance, age, politics).
7	1 min	Upload first morning face. Camera opens automatically.
8	Instant	AI generates profile summary + BLOOM badges. User starts at Trust Level 2.
Total time: ~28 minutes

Flow 2: Daily Engagement (All Users)
Step	Duration	Actions
1	30 sec	Open app → camera opens automatically. Take morning face photo. Streak continues.
2	1 min	Scroll feed (friends' faces → friends' answers → popular today → popular historical). React.
3	2 min	See today's Bad Friends question. Answer via text, voice note, or GIF.
4	Instant	Receive immediate CMI estimate: "Your answer is in top 30% so far today."
5	1 min	Check notifications: new matches, reactions, "Bad Friends" alerts.
6	Optional	Send messages to existing matches.
Total daily time: 5-10 minutes

Flow 3: Discovery & Matching
Step	User Action	System Response
1	Tap "Discover"	Shows card stack of potential matches' answers to today's question.
2	Read answer, view CMI score	—
3	Rate answer "Worst Friend" if funny	Records rating. Improves user's own CMI.
4	After 10 ratings, tap "Unlock Face"	Reveals person's morning face gallery.
5	Tap heart to express interest	System checks if mutual.
6	If other user also hearted → MATCH	Delivers Comedy Match Report. Unlocks DMs.
Flow 4: "Bad Friends" Fast Match
Step	User Action	System Response
1	(Background)	System detects 3+ mutual 💀 ratings in 7 days OR 85%+ Humor Compatibility.
2	Receives notification: "Bad Friends Detected"	Shows Comedy Match Report.
3	Taps "Become Bad Friends"	Sends request.
4	Other accepts	Immediate match. Badges + challenges unlocked.
Flow 5: Location Sharing & Real-World Meetup
Step	Trust Requirement
Both users reach Trust Level 4	Level 4
User A requests location share	Level 4+
User B approves (set duration: 1-6 hours)	Level 4+
Both tap "Proximity Icebreaker" → AI generates opener	Both opt in
User A proposes meetup time/place	Level 3+
User B accepts → system reserves table	Level 3+
Both activate "Bad Friend Backup" to trusted contacts	Level 3+
Flow 6: "The Sisterhood" (Women-Only Vetting)
Step	Action
1	Woman reaches Level 3 → automatically invited
2	Accepts → enters women-only space. No screenshots allowed.
3	Posts anonymously: "Has anyone dated @MikeJ?"
4	Other verified women respond: Green/Yellow/Red flag
5	User makes informed decision
TECHNICAL ARCHITECTURE
Complete Technology Stack
Layer	Technology	Version	Free Tier Limits
Frontend	React	18.2+	Unlimited
Vite	4.0+	Unlimited
Tailwind CSS	3.0+	Unlimited
Backend	FastAPI	0.100+	Unlimited
Uvicorn	0.20+	Unlimited
Database	Supabase (PostgreSQL)	15.0+	500MB, 2M req/mo
pgvector	Latest	Included
Auth	Supabase Auth	Latest	50K users
Storage	Supabase Storage	Latest	1GB
LLM	Groq (Llama 3.3 70B)	Latest	30 req/min
Embeddings	Hugging Face (sentence-transformers)	Latest	Free inference
Voice	AssemblyAI	Latest	100 hrs/mo
ID Verify	Persona (v1.1)	Latest	Pay-as-you-go
Hosting	Netlify	Latest	100GB bandwidth
Render	Latest	100GB bandwidth
Monitoring	UptimeRobot	Latest	50 monitors
System Boundaries Diagram
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
└─────────────────────────────────────────────────────────────────────────────┘
THE REVOLUTIONARY MATCHING ALGORITHM
The Match Score Formula
text
MatchScore(A,B) = w1*Humor_Compatibility + w2*Personality_Compatibility + w3*Value_Alignment + w4*Attractiveness_Proximity + w5*Social_Proof

Where weights are learned via RL over time (not hardcoded)
Component 1: Humor Compatibility (40% weight)
text
Humor_Compatibility = cosine_similarity(CMI_vector_A, CMI_vector_B)

Where CMI_vector = [affiliative_score, self_enhancing_score, surreal_score, wordplay_score, timing_score, originality_score]
Component 2: Personality Compatibility (25% weight)
text
Personality_Compatibility = 
    (1 - |BigFive_A - BigFive_B|) * 0.4 +
    attachment_compatibility * 0.3 +
    conflict_style_compatibility * 0.2 +
    sensation_seeking_compatibility * 0.1
Big Five similarity: Closer better for O, A, C; complementarity for E, N

Attachment compatibility: Secure+Secure > Secure+Anxious > Anxious+Anxious > Avoidant+anything

Conflict style: Collaborative+Collaborative > Collaborative+Accommodating > all others

Sensation seeking: Similar scores predict better long-term satisfaction

Component 3: Value Alignment (20% weight)
text
Value_Alignment = 
    (shared_core_values / total_core_values) * 0.5 +
    (dealbreakers_not_violated) * 0.3 +
    (life_goals_similarity) * 0.2
Component 4: Attractiveness Proximity (10% weight)
text
Attractiveness_Proximity = 1 - (|attractiveness_score_A - attractiveness_score_B| / 10)
Based on the matching hypothesis. Weight adjusts based on user's self-reported importance of looks.

Component 5: Social Proof (5% weight)
text
Social_Proof = 
    (mutual_friends_count / max_friends) * 0.5 +
    (shared_group_memberships) * 0.3 +
    (third_party_endorsements) * 0.2
The Critical Moment Simulation (Secret Sauce)
After initial MatchScore > 0.7 threshold:

Extract personas from both users' psychological profiles

Generate 3 conflict scenarios tailored to likely friction points

Simulate both responses using LLM

Rate interaction quality with second LLM ("Love Observer")

Adjust MatchScore up/down by up to 15%

Example scenario:

text
Scenario: "You're planning a first date. One wants a quiet coffee shop. 
The other wants a loud comedy club. How do you decide?"

[LLM simulates both responses based on their personas]
[Love Observer rates: "User A compromised effectively. User B pushed for their way. 
Predicted conflict resolution: POOR. Adjust MatchScore -12%."]
The Comedy Match Report (Shown on Match)
text
🔥 YOUR COMEDY MATCH REPORT 🔥

You and @SarahK have a 87% Comedy Match Index

What makes you compatible:
• Both excel at surreal humor (like Bobby's ant traps)
• Both use self-deprecation at the same frequency
• Your timing markers align (ellipses, line breaks)

Your funniest shared moment:
You both answered "Would you suck a toe for a Klondike bar?" with unexpected twists involving payment plans.

Suggested icebreaker based on your shared humor:
"Quick—ant on the counter. Do you let it keep the cracker or make it start over?"
TRUST & SAFETY ARCHITECTURE
The Core Insight from Research
Every existing app treats trust as binary. But real trust is graduated. You trust a casual match less than a friend of a friend.

No app has solved graduated trust for location sharing. That's our opportunity.

The "Real Woman" Badge (Earned, Not Given)
A man could fake Tier 1-2 verification. But to get the "Real Woman" badge, they'd need to:

Maintain a 30-day morning face streak

Receive 5+ "Good Friend" endorsements from verified women

Never receive a "Report" for suspicious behavior

Why this works: A catfisher can't sustain 30 days of daily morning faces, voice notes, and community interaction without getting caught.

Women's Verification Network ("The Sisterhood")
Women-only verified space (must be female-identified and Level 3+)

Anonymous vetting: "Has anyone dated @MikeJ?"

Community responses: Green/Yellow/Red flags

AI post review + end-to-end encryption

No screenshots allowed

The "Bad Friend Backup" (Trusted Contact)
Before any in-person meeting:

User selects trusted contact from phone or in-app "Trusted Circle"

App generates passcode-protected link with:

User's last known location (updated every 5 min)

Date's profile information

Session duration (user sets: 2-6 hours)

Link can be sent via text/WhatsApp—recipient doesn't need the app

Date receives notification that Backup is activated (transparency)

Emergency Kill Switch
One button: "Lock Down My Account"

Immediately stops all location sharing

Revokes all active session links

Hides profile from discovery

Notifies Trusted Circle contacts (optional)

Logs out of all devices

DATA MODEL (KEY TABLES)
sql
-- Core
users (id, auth_id, email, phone, name, birthday, location, gender, 
      trust_level, trust_points, streak_days, last_morning_face, 
      is_verified_woman, is_verified_man, cmi_score)

psychological_profiles (user_id, big_five, attachment_style, love_languages, 
                        core_values, conflict_style, humor_style, 
                        sensation_seeking, attractiveness_score, dealbreakers)

-- Daily Content
morning_faces (id, user_id, image_url, timestamp, metadata, 
               reaction_count_bobo, reaction_count_cheeto, 
               reaction_count_tiger, reaction_count_dead)

daily_questions (id, question_text, source_episode, date, gold_standard_answer_ids)

answers (id, user_id, question_id, answer_text, answer_voice_url, 
         cmi_score, embedding VECTOR(384), reaction_counts)

reactions (id, user_id, target_type, target_id, reaction_type)

-- Matching
matches (id, user_a, user_b, status, comedy_match_report, matched_at, accepted_at)

messages (id, match_id, sender_id, content, content_type, is_read, created_at)

-- Social
follows (follower_id, followed_id, created_at)

-- Trust
trust_events (id, user_id, event_type, points_change, reference_id)

endorsements (id, from_user, to_user, endorsement_type)

reports (id, reporter_id, reported_id, reason, status, moderator_notes)

-- Groups
groups (id, name, created_by)
group_members (group_id, user_id)
API SPECIFICATION (V1 PROTOTYPE)
Method	Endpoint	Purpose
POST	/auth/register	Email + phone registration
POST	/auth/login	Login
POST	/morning-face	Upload daily photo
GET	/morning-face/feed	Get friends' morning faces
GET	/questions/today	Get daily question
POST	/questions/answer	Submit answer (text only)
GET	/questions/feed	Get friends' answers
POST	/reactions	React to content
GET	/matches/discover	Get potential matches (answers first)
POST	/matches/like	Express interest
GET	/matches	Get active matches
GET/POST	/messages	Chat
GET	/profile	View profile
GET	/status	Health check
FRONTEND ARCHITECTURE
Component Hierarchy
text
App.jsx
├── AuthProvider (Supabase auth context)
├── Router
│   ├── /login
│   ├── /onboarding
│   │   ├── VerificationFlow
│   │   ├── PsychDiagnostic
│   │   └── FirstMorningFace
│   ├── /feed
│   │   ├── MorningFaceUpload (camera)
│   │   ├── FeedTabs
│   │   └── DailyQuestionCard
│   ├── /discover
│   │   ├── AnswerCardStack
│   │   ├── FaceReveal
│   │   └── LikeButton
│   ├── /matches
│   │   ├── MatchList
│   │   └── ChatView
│   └── /profile
│       ├── MorningFaceHistory
│       ├── TrustLevelDisplay
│       └── Settings
Custom Hooks
Hook	Purpose
useCamera	Camera access for morning face
useMorningFaceUpload	Upload with timestamp verification
useFeed	Infinite scroll for feed
useDiscover	Card stack logic
useCMI	Fetch user's CMI score
useTrust	Trust level calculations
BACKEND ARCHITECTURE
Directory Structure
text
backend/
├── main.py                 # FastAPI app, CORS, middleware
├── requirements.txt        # Dependencies
├── .env                    # API keys (never commit)
├── Procfile                # Render deployment
├── api/
│   ├── auth.py
│   ├── morning_face.py
│   ├── questions.py
│   ├── reactions.py
│   ├── matches.py
│   ├── messages.py
│   └── profile.py
├── core/
│   ├── config.py
│   ├── database.py
│   ├── security.py
│   └── dependencies.py
├── services/
│   ├── auth_service.py
│   ├── verification_service.py
│   ├── morning_face_service.py
│   ├── question_service.py
│   ├── cmi_service.py
│   ├── matching_service.py
│   ├── trust_service.py
│   └── groq_client.py
├── models/
│   ├── user.py
│   ├── morning_face.py
│   ├── question.py
│   ├── match.py
│   └── message.py
└── utils/
    ├── supabase_client.py
    └── helpers.py
SECURITY & RATE LIMITING
Security Layers
Layer	Protections
Network	HTTPS only, CORS locked to app domains, rate limiting (10 req/min per endpoint, 100/min per IP), 25MB request limit
Application	JWT tokens (24h expiry), refresh token rotation, Supabase RLS on every table, Pydantic validation
Data	Passwords hashed with bcrypt, E2E encryption for messages (Signal Protocol), ID images deleted after processing, no permanent geolocation storage
Operational	Environment variables for all secrets, .env never committed, API key rotation quarterly, audit logs
User Safety	Mandatory verification, graduated trust levels, Ghost Mode, block/report, Bad Friend Backup, emergency kill switch
Rate Limiting Configuration
python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address, default_limits=["100 per day"])

@router.post("/morning-face")
@limiter.limit("10 per minute")
async def upload_morning_face(...):
    pass
DEPLOYMENT ARCHITECTURE
Production URLs (After Deployment)
Service	URL
Frontend (Netlify)	https://bad-friends.netlify.app
Backend (Render)	https://bad-friends-api.onrender.com
Supabase Project	To be created
Cold Start Prevention
Render free tier spins down after 15 minutes of inactivity

UptimeRobot pings backend every 10 minutes

First request after sleep takes ~30 seconds to wake up

Environment Variables
bash
# backend/.env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GROQ_API_KEY=gsk_your_key
PERSONA_API_KEY=your_persona_key  # v1.1

# frontend/.env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://bad-friends-api.onrender.com
KEY DECISIONS MADE
Decision	Rationale
v1 = completely free	Validate product before monetizing
No ID verification in v1 prototype	Launch faster, add in v1.1
Email + phone verification for all in v1	Basic trust, prevents bots
Answers first, faces second	Humor is the primary signal
CMI based on gold standard (💀 reactions)	Cannot be gamed
Asymmetric verification in v1.1	Women verify with ID + selfie for safety
Graduated trust levels in v2	Too complex for prototype
Location features in v2	Requires trust levels
MeetingMind patterns for security	Proven: CORS, rate limiting, cold start handling
Women earn "Real Woman" badge, not given	Behavioral proof prevents catfishing
Sisterhood = women-only vetting space	Anonymous safety network
Bad Friend Backup = external trusted contact	PURE/Bumble pattern
Critical moment simulation using LLMs	Predicts long-term compatibility
OPEN QUESTIONS
Question	Status	Decision
ID verification service for v1.1?	🔍 Researching	Persona vs Sumsub
Groq embedding model? (Groq doesn't have embeddings)	✅ Resolved	Use Hugging Face
Demo mode for prototype?	✅ Resolved	Yes, hardcode demo user
How many daily questions for launch?	✅ Resolved	10, cycled daily
How to prove a user is a woman without being invasive?	✅ Resolved	Earned "Real Woman" badge (30 days + endorsements)
DEVELOPMENT COMMANDS
Clone and Setup
bash
git clone https://github.com/DamainRamsajan/bad-friends-morning-face-build.git
cd bad-friends-morning-face-build

# Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env

# Frontend setup
cd ../frontend
npm install
cp .env.example .env
Run Locally
bash
# Backend (Terminal 1)
cd backend
python3 -m uvicorn main:app --reload --port 8000

# Frontend (Terminal 2)
cd frontend
npm run dev
Access Locally
Frontend: http://localhost:5173

Backend API docs: http://localhost:8000/docs

Git Workflow
bash
git add .
git commit -m "your message"
git push origin main
Deployment
bash
# Netlify: Auto-deploys on push to main
# Render: Manual deploy from dashboard
V1 PROTOTYPE SCOPE (5 DAYS)
Day	Focus	Deliverable
1	Documentation + Setup	architecture.md, context.md, roadmap.md, wireframe.md, GitHub repo, Supabase project
2	Auth + Morning Face	Email/phone registration, camera upload, Supabase storage
3	Questions + Answers	Daily question, answer submission, feed
4	Matching + Chat	"Answers First" card stack, likes, matches, basic chat
5	Polish + Deploy	CSS, testing, Netlify + Render deployment
Not in v1:

ID verification (v1.1)

Voice notes (v2)

CMI algorithm (use simple reaction count for prototype)

Trust levels (v2)

Location features (v2)

Psychological diagnostic (v2)

CONTACT
Email for verification service accounts: carlosinthebooth@gmail.com

NEXT SESSION OPENING MESSAGE
Copy this for your next chat:

"I am continuing Bad Friends Morning Face Build. We have completed architecture.md, context.md, roadmap.md, and wireframe.md. The prototype is v1 and completely free. We are using MeetingMind patterns for security and deployment. Here is my complete context.md. Please help me start coding Day 1: Auth + Morning Face upload."

QUICK REFERENCE
Item	Status	Link/Value
GitHub Repo	✅ Created	https://github.com/DamainRamsajan/bad-friends-morning-face-build
Architecture.md	✅ Complete	In /docs
Context.md	✅ Complete	In /docs
Roadmap.md	✅ Complete	In /docs
Wireframe.md	✅ Complete	In /docs
Supabase Project	⏳ To create	-
Render Service	⏳ To create	-
Netlify Site	⏳ To create	-