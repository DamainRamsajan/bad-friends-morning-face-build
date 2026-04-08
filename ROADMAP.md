ROADMAP.md
Bad Friends Morning Face Build — Product Roadmap
Version: 1.0 | April 2026
Status: Documentation Complete → Ready for Development

TABLE OF CONTENTS
Phase 1: Free Prototype (5 Days)

Phase 1.1: Safety & Verification (Week 2)

Phase 2: Trust + Location (Month 2)

Phase 3: AI Features (Month 3)

Phase 4: Social Features (Month 4)

Phase 5: Monetization (Month 5)

Future (Beyond Month 6)

Success Metrics

Risk Assessment

Launch Checklist

PHASE 1: FREE PROTOTYPE (5 Days)
Goal: Launch a working, shareable prototype that demonstrates the core loop: morning face → daily question → matching based on humor.

Success Metric: 100 users, 50% day-7 retention, 10 matches.

Cost: $0 (all free tiers)

Day-by-Day Breakdown
Day	Focus	Tasks	Deliverables
Day 1	Documentation & Setup	Create GitHub repo, Supabase project, write docs (architecture.md, context.md, roadmap.md, wireframe.md), set up local dev environment	Repo live, docs complete, Supabase project created
Day 2	Auth + Morning Face	Supabase auth (email/phone), registration flow, camera upload with timestamp, store in Supabase Storage, basic profile page	Users can register, upload morning face, view profile
Day 3	Questions + Answers	Daily question system (10 pre-loaded questions), answer submission (text only), feed showing friends' morning faces and answers, reaction buttons (🍜/🔥/🐯/💀)	Users can answer daily questions, see feed, react
Day 4	Matching + Chat	"Answers First" discover card stack, like/heart button, mutual match detection, basic text chat	Users can discover matches, like, match, chat
Day 5	Polish + Deploy	CSS polish, mobile responsive, deploy backend to Render, deploy frontend to Netlify, test with 5 beta users, fix critical bugs	Live app at bad-friends.netlify.app
What's NOT in v1 Prototype
Feature	Why Excluded
ID verification	Add in v1.1 (week 2)
Voice notes	Phase 2
CMI algorithm (use simple reaction count)	Phase 3
Trust levels (binary verified/unverified only)	Phase 2
Location features	Phase 2
Psychological diagnostic (hardcode demo user)	Phase 3
ASI companions	Phase 3
Sisterhood vetting	Phase 4
Technical Implementation Details
Component	Implementation
Auth	Supabase Auth (email + phone)
Database	Supabase PostgreSQL (users, morning_faces, daily_questions, answers, reactions, matches, messages)
Storage	Supabase Storage (morning face images)
Feed	Simple Supabase query with joins
Matching	Simple: show all users of opposite gender, sort by reaction count
Chat	Supabase Realtime subscriptions
Deployment	Netlify (frontend) + Render (backend)
PHASE 1.1: SAFETY & VERIFICATION (Week 2)
Goal: Add ID verification for women to build trust and differentiate from other apps.

Success Metric: 80% of women users complete ID verification.

Task	Effort	Dependencies	Priority
Research Persona vs Sumsub pricing/UX	2 hours	None	High
Integrate ID + selfie capture in frontend	4 hours	Phase 1	High
Integrate verification API (webhook)	4 hours	Phase 1	High
Add "Real Woman" badge (earned after verification)	2 hours	Phase 1	High
Add "Verified Woman" filter for matching	2 hours	Phase 1	Medium
Create verification status dashboard	3 hours	Phase 1	Medium
Cost: ~$2 per woman who verifies (Persona/Sumsub)

PHASE 2: TRUST + LOCATION (Month 2)
Goal: Add graduated trust levels and privacy-first location features.

Success Metric: 50% of active users reach Level 3, 20% use location sharing.

Feature Breakdown
#	Feature	Effort	Priority	Trust Level Required
2.1	Trust points system (earn via streak, endorsements, meet verifications)	1 week	High	All
2.2	Trust levels 1-5 with feature gating	3 days	High	All
2.3	Men ID verification (required for Level 3+)	3 days	High	Level 3
2.4	"Good Friend" endorsements (green flags)	2 days	High	Level 2+
2.5	"Bad Friend Backup" (share date with trusted contact)	2 days	High	Level 3+
2.6	Heat map (aggregated location, ant icons)	3 days	Medium	Level 4
2.7	Path Crosser (missed connections)	3 days	Medium	Level 4
2.8	Date Spot Decider (AI venue recommendations)	3 days	Medium	Level 3+
2.9	Geofence Gauntlet (venue challenges)	5 days	Low	Level 3+
2.10	Proximity Icebreaker (AI-generated, requires both Level 4+)	5 days	Low	Level 4
Trust Level Feature Map
Level	Points	Unlocked Features
Level 1	0-19	Feed only, answer questions, react. CANNOT match, DM, or share location.
Level 2	20-49	Match, DM (text only), see morning faces. CANNOT share location.
Level 3	50-99	Voice notes, Island Bullies groups, can REQUEST location share.
Level 4	100-199	Initiate location share, Proximity Icebreaker, heat maps, Path Crosser.
Level 5	200+	All features. "Trusted Badge." Council voting.
PHASE 3: AI FEATURES (Month 3)
Goal: Add the revolutionary CMI algorithm and ASI companions.

Success Metric: 90% of users have CMI score, 30% use ASI companion.

#	Feature	Effort	Priority	Description
3.1	CMI Algorithm	1 week	High	LLM embeddings, gold standard (💀 reactions), daily calculation
3.2	Comedy Match Report	3 days	High	Shown on match: compatibility breakdown, shared humor style, icebreaker
3.3	Critical Moment Simulation	1 week	High	LLM simulates conflict scenarios, adjusts match score ±15%
3.4	Voice Note Answers	3 days	Medium	AssemblyAI transcription + storage
3.5	Voice Note Vibe Check	3 days	Medium	AI analyzes tone, energy, authenticity. "Harmony Alert"
3.6	Psychological Diagnostic (7 scales)	1 week	High	Big Five, Attachment, Love Languages, Values, Conflict Style, Humor Style, Sensation Seeking
3.7	ASI Companion (basic)	2 weeks	Low	Personalized AI that mingles with other ASIs overnight
3.8	Love Coach	1 week	Low	Personalized dating advice, challenges (Andrew voice)
CMI Algorithm Details
text
Daily at midnight:
1. Fetch all answers for today's question
2. Identify gold standard (top 10 by 💀 reactions)
3. Generate embeddings for gold standard (Hugging Face)
4. Generate embeddings for all answers
5. Calculate cosine similarity to nearest gold standard
6. CMI = similarity × 100
7. Update database
8. Store gold standard IDs in daily_questions table
PHASE 4: SOCIAL FEATURES (Month 4)
Goal: Build community and retention features.

Success Metric: 40% of users in Island Bullies groups, 10% in Sisterhood.

#	Feature	Effort	Priority
4.1	Island Bullies groups (max 5 people)	1 week	High
4.2	Group leaderboard (weekly ranking by 💀 reactions)	2 days	Medium
4.3	Hopecore Corner (weekly vulnerability thread, anonymous, no jokes)	2 days	High
4.4	The Sisterhood (women-only vetting space, no screenshots, AI review)	1 week	High
4.5	Endorsements (Green Flags: Good Friend, Great Date, Bad Friend)	2 days	High
4.6	Council of Bad Friends (30+ day streak users vote on features/moderate)	3 days	Medium
4.7	"Bad Faith Alert" (men flagged 3+ times receive notice, trust freeze)	2 days	High
PHASE 5: MONETIZATION (Month 5 — After 10K Users)
Goal: Add Fancy B Tier without breaking the free experience.

Success Metric: 5% conversion to Fancy B Tier, $500 MRR.

Fancy B Tier ($4.99/mo or $9.99/mo bundle)
Feature	Price
See who liked you	$4.99/mo
Unlimited active matches (free tier capped at 10)	$4.99/mo
Custom reaction emojis	$4.99/mo
Ad-free experience	$4.99/mo
"Devil Mode" AI roast feedback	$4.99/mo
Fancy B Bundle (all above)	$9.99/mo
Never Paid (Always Free)
Morning face visibility (100% with daily upload)

Matching algorithm priority

Slow reveal (answers first, faces second)

Core safety features (Trust levels, Sisterhood, Bad Friend Backup)

Basic messaging

FUTURE (Beyond Month 6)
Feature	Notes	Estimated Effort
3D Morning Face Gallery	AR/VR, 3D reconstruction from morning face photos	1 month
"Ant Trap Mode" (obstacle course on 3D avatar)	Gamification	2 weeks
VR Date Space (VRChat integration)	Partnership needed	2 months
ASI-to-ASI flirting (Soulz protocol)	Experimental, requires multi-agent system	2 months
Federated learning for privacy	Research phase	3 months
Decentralized social graph (Nostr)	Post-MVP	2 months
Real-world events (Bad Friends meetups)	Partnership with venues	Ongoing
SUCCESS METRICS BY PHASE
Phase	Primary Metric	Target	Secondary Metric	Target
Phase 1	Users	100	Day-7 retention	50%
Phase 1.1	Women ID verification completion	80%	Catfishing reports	0
Phase 2	Active users reaching Level 3	50%	Location sharing usage	20%
Phase 3	Users with CMI score	90%	ASI companion usage	30%
Phase 4	Users in Island Bullies groups	40%	Users in Sisterhood	10%
Phase 5	Fancy B Tier conversion	5%	Monthly recurring revenue	$500
RISK ASSESSMENT
Risk	Probability	Impact	Mitigation
Render cold starts	High	Medium	UptimeRobot ping every 10 min
Supabase free tier limits	Medium	High	Monitor usage, upgrade to Pro at 2M requests
ID verification cost	High	Low (v1.1)	Persona pay-as-you-go, ~$2/user
Groq rate limits	Medium	Medium	Implement queueing, caching
Low user adoption	Medium	High	Launch in Bad Friends communities first
Catfishing despite verification	Low	High	Sisterhood + reporting + trust penalties
Women don't feel safe	Low	Critical	Asymmetric verification, graduated trust, Sisterhood, Backup
CMI gaming	Low	Medium	Gold standard based on community 💀 reactions, not individual
LAUNCH CHECKLIST
Phase 1 Launch (Day 5)
Netlify URL: https://bad-friends.netlify.app

Render URL: https://bad-friends-api.onrender.com

Supabase project live with tables and RLS

5 beta users can:

Register with email + phone

Upload morning face (camera)

Answer daily question

See feed of friends' faces and answers

React with 🍜/🔥/🐯/💀

Discover other users (answers first)

Like and match

Chat

README.md with setup instructions

No critical bugs

Phase 1.1 Launch (Week 2)
ID verification integrated (Persona/Sumsub)

"Real Woman" badge working

80% of women users verified

Verification status dashboard

Phase 2 Launch (Month 2)
Trust points system live

Levels 1-5 with feature gating

Men ID verification required for Level 3+

"Bad Friend Backup" tested

Heat map live

Path Crosser live

Phase 3 Launch (Month 3)
CMI algorithm calculating daily

Comedy Match Report showing on matches

Critical moment simulation running

Voice notes working

Psychological diagnostic integrated

COMMANDS FOR DEVELOPMENT
Daily Workflow
bash
# Pull latest
cd ~/bad-friends-morning-face-build
git pull origin main

# Start backend
cd backend
python3 -m uvicorn main:app --reload --port 8000

# Start frontend (new terminal)
cd frontend
npm run dev
Deployment
bash
# Push to GitHub (auto-deploys Netlify)
git add .
git commit -m "your message"
git push origin main

# Render: Manual deploy from dashboard
Tagging Releases
bash
git tag -a v1.0 -m "Phase 1: Free Prototype"
git push origin v1.0
NEXT STEPS
After this document is committed:

Day 1 (Today) : Set up Supabase project, run SQL schema, test auth

Day 2: Build registration + morning face upload

Day 3: Build daily question + feed + reactions

Day 4: Build discover + matching + chat

Day 5: Deploy to Netlify + Render, test with beta users

<p align="center"> <strong>Let's build this. 🍜🔥</strong> </p>