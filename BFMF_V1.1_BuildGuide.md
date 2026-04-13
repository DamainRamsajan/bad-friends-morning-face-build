BFMF V1.1 BUILD GUIDE - FIREBASE MIGRATION
Complete Step-by-Step Implementation Guide
Prepared: April 12, 2026
For use with: BFMF_v1.1_Implementation_Plan.md (contains all code files)
Estimated Time: 3-4 hours
Prerequisites: Python 3.10+, Node.js 18+, Git, Google Account (free)

HOW TO USE THIS GUIDE
You have two documents that work together:

Document	Purpose	When to Use
BFMF_V1.1_BuildGuide.md (this file)	Step-by-step commands	Follow these steps in order
BFMF_v1.1_Implementation_Plan.md	All code files to copy-paste	When a step says "create file X", find it in the Implementation Plan
Workflow:

Read the step in this Build Guide

When it says "Create file X with content from Implementation Plan", open the Implementation Plan

Search for the file name (e.g., "File: backend/main.py")

Copy the ENTIRE code block

Paste into your file

Run the verification commands shown here

Do NOT copy code from this Build Guide - it only contains commands and references. All code is in the Implementation Plan.

QUICK REFERENCE: WHERE TO FIND EACH FILE
File	Location in Implementation Plan
backend/requirements.txt	"PART 3: BACKEND FILES → File: backend/requirements.txt"
backend/__init__.py	"File: backend/init.py"
backend/core/__init__.py	"File: backend/core/init.py"
backend/core/config.py	"File: backend/core/config.py"
backend/core/auth.py	"File: backend/core/auth.py"
backend/core/exceptions.py	"File: backend/core/exceptions.py"
backend/core/middleware.py	"File: backend/core/middleware.py"
backend/core/rate_limit.py	"File: backend/core/rate_limit.py"
backend/core/monitoring.py	"File: backend/core/monitoring.py"
backend/services/__init__.py	"File: backend/services/init.py"
backend/services/firebase_client.py	"File: backend/services/firebase_client.py"
backend/services/friendship_service.py	"File: backend/services/friendship_service.py"
backend/utils/__init__.py	"File: backend/utils/init.py"
backend/utils/retry.py	"File: backend/utils/retry.py"
backend/api/__init__.py	"File: backend/api/init.py"
backend/api/health.py	"File: backend/api/health.py"
backend/models/onboarding.py	"File: backend/models/onboarding.py"
backend/main.py	"File: backend/main.py"
backend/.env.example	"File: backend/.env.example"
frontend/src/utils/firebaseClient.js	"File: frontend/src/utils/firebaseClient.js"
frontend/src/contexts/AuthContext.jsx	"File: frontend/src/contexts/AuthContext.jsx"
frontend/src/screens/LandingScreen.jsx	"File: frontend/src/screens/LandingScreen.jsx"
frontend/netlify.toml	"File: frontend/netlify.toml"
frontend/package.json	"File: frontend/package.json" (add firebase dependency)
infrastructure/firestore.rules	"PART 5: INFRASTRUCTURE FILES → File: infrastructure/firestore.rules"
infrastructure/storage.rules	"File: infrastructure/storage.rules"
infrastructure/firestore.indexes.json	"File: infrastructure/firestore.indexes.json"
⚠️ CRITICAL WARNINGS - READ FIRST
#	Warning	Consequence if Ignored
1	DO NOT skip Firebase project setup	Code won't work - no database or auth
2	DO NOT commit service-account-key.json	Security breach - add to .gitignore
3	DO NOT use Firestore test mode	Security rules won't be enforced
4	DO NOT skip index deployment	Queries will be slow or fail with errors
5	DO NOT forget gender claims	Sisterhood feature won't work
6	DO NOT skip token retrieval changes	API calls will return 401 errors
7	DO NOT keep token_blacklist.py	It's deleted - use Firebase revocation instead
8	DO NOT keep public/_headers	Use netlify.toml only (CSP already there)
TABLE OF CONTENTS
Pre-Migration Preparation

Firebase Project Setup

Infrastructure Deployment (Rules & Indexes)

Backend Migration

Frontend Migration

Environment Configuration for Deployment

Deployment to Production

Testing & Validation

Troubleshooting Guide

Post-Migration Checklist

Quick Reference Card

SECTION 1: PRE-MIGRATION PREPARATION (15 minutes)
1.1 Navigate to Project Directory
bash
cd ~/bad-friends-morning-face-build
1.2 Create Backup Branch (Optional - Recommended)
bash
# Create a backup branch before starting
git checkout -b backup/pre-migration
git add .
git commit -m "BACKUP: Before Firebase migration"
git push origin backup/pre-migration

# Return to main branch
git checkout main
1.3 Create Migration Workspace Branch
bash
# Create a new branch for the migration work
git checkout -b feature/firebase-migration

# Create a directory for migration notes (optional)
mkdir -p migration-notes
1.4 Verify Current State
bash
# Check that you're in the correct directory
pwd
# Should output: /home/username/bad-friends-morning-face-build

# List current files to confirm
ls -la
# Should show: backend/, frontend/, docs/, etc.

# Check current branch
git branch
# Should show: * feature/firebase-migration
SECTION 2: FIREBASE PROJECT SETUP (20 minutes)
2.1 Create Firebase Project
bash
# Step 1: Open browser to https://console.firebase.google.com
# Step 2: Sign in with your Google account (no credit card needed)
# Step 3: Click "Create project"
# Step 4: Project name: bad-friends-morning-face
# Step 5: Disable Google Analytics (uncheck)
# Step 6: Click "Create project" (wait 1-2 minutes)
# Step 7: Click "Continue" when ready
2.2 Enable Authentication
bash
# Step 1: In Firebase Console, click "Authentication" in left menu
# Step 2: Click "Get Started"
# Step 3: Click "Sign-in methods" tab
# Step 4: Enable "Email/Password" (click the pencil, then Enable, then Save)
# Step 5: (Optional) Enable "Google" if you want social login
# Step 6: Click Save
2.3 Create Firestore Database
bash
# Step 1: Click "Firestore Database" in left menu
# Step 2: Click "Create database"
# Step 3: Select "Start in production mode" (NOT test mode)
# Step 4: Location: us-central1 (recommended for global users)
# Step 5: Click "Create" (wait 1-2 minutes)
2.4 Create Storage Bucket
bash
# Step 1: Click "Storage" in left menu
# Step 2: Click "Get Started"
# Step 3: Select "Start in production mode"
# Step 4: Location: us-central1 (match Firestore)
# Step 5: Click "Create"
2.5 Get Service Account Key (For Backend)
bash
# Step 1: Click the gear icon (Settings) → "Project settings"
# Step 2: Click "Service accounts" tab
# Step 3: Click "Generate new private key"
# Step 4: Click "Generate key" (downloads a JSON file)
# Step 5: Rename the file to service-account-key.json
# Step 6: MOVE this file to ~/bad-friends-morning-face-build/backend/
# Step 7: IMPORTANT: Add to .gitignore (do NOT commit)
Add to .gitignore:

gitignore
# Add these lines to your .gitignore
backend/service-account-key.json
backend/.env
frontend/.env
2.6 Get Web App Configuration (For Frontend)
bash
# Step 1: In Project Settings → "General" tab
# Step 2: Scroll to "Your apps" section
# Step 3: Click the web icon (</>) to add a web app
# Step 4: Nickname: bad-friends-web
# Step 5: Click "Register app"
# Step 6: Copy the firebaseConfig object - it looks like this:
javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "bad-friends-morning-face.firebaseapp.com",
  projectId: "bad-friends-morning-face",
  storageBucket: "bad-friends-morning-face.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
bash
# Step 7: SAVE THIS CONFIG (you need it for frontend .env)
# Step 8: Click "Continue to console"
SECTION 3: INFRASTRUCTURE DEPLOYMENT (15 minutes)
3.1 Create Infrastructure Directory
bash
cd ~/bad-friends-morning-face-build
mkdir -p infrastructure
3.2 Deploy Firestore Security Rules
Find the rules in Implementation Plan: "PART 5: INFRASTRUCTURE FILES → File: infrastructure/firestore.rules"

bash
# Step 1: In Firebase Console → Firestore Database → Rules tab
# Step 2: Delete all existing rules
# Step 3: Copy the ENTIRE firestore.rules from Implementation Plan
# Step 4: Paste into the editor
# Step 5: Click "Publish"
What these rules enforce:

Users can only read/write their own data

Sisterhood: Women only (gender claim required)

Morning faces: No client deletion (backend only)

App config: Read only for authenticated users

3.3 Deploy Storage Security Rules
Find the rules in Implementation Plan: "File: infrastructure/storage.rules"

bash
# Step 1: In Firebase Console → Storage → Rules tab
# Step 2: Delete all existing rules
# Step 3: Copy the ENTIRE storage.rules from Implementation Plan
# Step 4: Paste into the editor
# Step 5: Click "Publish"
What these rules enforce:

Morning faces stored in user-specific folders: morning-faces/{userId}/{fileName}

Users can only write to their own folder

No client-side deletion (backend only)

3.4 Deploy Firestore Composite Indexes
Find the indexes in Implementation Plan: "File: infrastructure/firestore.indexes.json"

Option A: Using Firebase CLI (Recommended)

bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firestore in your project
firebase init firestore

# When prompted:
# - Select your project: bad-friends-morning-face
# - Select "Use existing files" for firestore.rules
# - Select "Use existing files" for firestore.indexes.json
# - When asked "What file should be used for Firestore indexes?" → firestore.indexes.json

# Deploy indexes
firebase deploy --only firestore:indexes
Option B: Manual (if CLI not working)

bash
# Step 1: In Firebase Console → Firestore → Indexes tab
# Step 2: Click "Create composite index" for each index in firestore.indexes.json
# Step 3: Wait 2-10 minutes for indexes to build (can proceed with other steps)
3.5 Seed App Config Document
bash
# Step 1: In Firebase Console → Firestore → Start collection
# Step 2: Collection ID: app_config
# Step 3: Document ID: global
# Step 4: Add the following fields:
Field	Type	Value
registered_user_count	number	0
user_hard_cap	number	50
app_read_ceiling	number	40000
mock_data_threshold	number	20
total_reads_today	number	0
reads_date	string	(today's date, e.g., "2026-04-12")
updated_at	string	(current ISO timestamp)
feature_flags	map	{ sisterhood_enabled: true, discover_enabled: true, chat_enabled: false }
bash
# Step 5: Click "Save"
3.6 Seed Baseline Questions
bash
# Step 1: In Firestore → Start collection
# Step 2: Collection ID: daily_questions
# Step 3: Document ID: baseline_1
# Step 4: Add fields:
Field	Value
question_text	"Would you suck Jamie Lee Curtis's big toe for a Klondike bar?"
is_baseline	true
date	"2026-04-12"
source_episode	"Bad Friends Ep 1"
gold_standard_answer_ids	[]
bash
# Step 5: Repeat for 4 more baseline questions:

# baseline_2: "Would you rather fight one Bobby-Lee-sized ant or 100 ant-sized Bobby Lees?"
# baseline_3: "Rate your current tiredness as a weather forecast."
# baseline_4: "What's something you're NOT going to feel guilty about today?"
# baseline_5: "How many ant traps belong on a fridge?"

# Step 6: For each, set is_baseline: true, gold_standard_answer_ids: []
# Step 7: Click "Save" after each
SECTION 4: BACKEND MIGRATION (60 minutes)
4.1 Remove Old Backend Files
bash
cd ~/bad-friends-morning-face-build/backend

# Delete old files
rm -f main.py
rm -f services/friendship_service.py
rm -f requirements.txt

# Remove old directories if they exist (clean slate)
rm -rf core/ services/ utils/ api/ models/ 2>/dev/null
4.2 Create New Directory Structure
bash
# Create new directories
mkdir -p core services utils api models

# Create __init__.py files in each directory
touch core/__init__.py
touch services/__init__.py
touch utils/__init__.py
touch api/__init__.py
touch models/__init__.py
4.3 Create All Backend Files
For each file below:

Open the Implementation Plan

Search for the file name (e.g., "File: backend/requirements.txt")

Copy the ENTIRE code block

Create the file in your backend directory

Paste the code

File Creation Order:

#	File	Location in Implementation Plan
1	requirements.txt	"PART 3: BACKEND FILES → File: backend/requirements.txt"
2	__init__.py	"File: backend/init.py"
3	core/__init__.py	"File: backend/core/init.py"
4	core/config.py	"File: backend/core/config.py"
5	core/auth.py	"File: backend/core/auth.py"
6	core/exceptions.py	"File: backend/core/exceptions.py"
7	core/middleware.py	"File: backend/core/middleware.py"
8	core/rate_limit.py	"File: backend/core/rate_limit.py"
9	core/monitoring.py	"File: backend/core/monitoring.py"
10	services/__init__.py	"File: backend/services/init.py"
11	services/firebase_client.py	"File: backend/services/firebase_client.py"
12	services/friendship_service.py	"File: backend/services/friendship_service.py"
13	utils/__init__.py	"File: backend/utils/init.py"
14	utils/retry.py	"File: backend/utils/retry.py"
15	api/__init__.py	"File: backend/api/init.py"
16	api/health.py	"File: backend/api/health.py"
17	models/__init__.py	Create empty file: touch models/__init__.py
18	models/onboarding.py	"File: backend/models/onboarding.py"
19	main.py	"File: backend/main.py"
20	.env.example	"File: backend/.env.example"
4.4 Files to SKIP (Do NOT create)
File	Reason
backend/core/token_blacklist.py	DELETED - using Firebase revocation instead
4.5 Install Python Dependencies
bash
cd ~/bad-friends-morning-face-build/backend

# Create virtual environment (if not exists)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Verify installations
pip list | grep -E "fastapi|firebase-admin|pydantic"
# Should show: fastapi, firebase-admin, pydantic, pydantic-settings
4.6 Configure Backend Environment
bash
# Create .env file from example
cp .env.example .env

# Edit .env with your Firebase credentials
nano .env
Replace the placeholder values with your actual Firebase credentials:

env
# Firebase Configuration
FIREBASE_PROJECT_ID=bad-friends-morning-face
FIREBASE_STORAGE_BUCKET=bad-friends-morning-face.firebasestorage.app
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"bad-friends-morning-face",...}'

# CORS Configuration
CORS_ORIGINS=["http://localhost:5173","https://bad-friends-morning-face.netlify.app"]

# App Configuration
APP_READ_CEILING=40000
USER_HARD_CAP=50
MOCK_DATA_THRESHOLD=20

# Logging
LOG_LEVEL=INFO
IMPORTANT: The FIREBASE_SERVICE_ACCOUNT_JSON must be a single line. Copy the ENTIRE JSON file content into this variable.

4.7 Test Backend Locally
bash
# Start the backend server
python -m uvicorn main:app --reload --port 8000
Open a new terminal and run verification:

bash
# Test health endpoint
curl http://localhost:8000/status
# Expected: {"status":"healthy","version":"1.0.0","timestamp":"..."}

# Test user count endpoint
curl http://localhost:8000/users/count
# Expected: {"success":true,"count":0}

# Visit Swagger UI
# Open browser to: http://localhost:8000/docs
# You should see all 36 endpoints documented
Keep the backend terminal running - do not close it.

SECTION 5: FRONTEND MIGRATION (45 minutes)
5.1 Install Firebase SDK
bash
cd ~/bad-friends-morning-face-build/frontend

# Install Firebase SDK
npm install firebase

# Verify installation
npm list firebase
# Should show: firebase@10.12.0
5.2 Delete Supabase Client
bash
# Remove the old Supabase client
rm -f src/utils/supabaseClient.js
5.3 Create New Frontend Files
For each file below:

Open the Implementation Plan

Search for the file name

Copy the ENTIRE code block

Create the file in your frontend directory

Paste the code

#	File	Location in Implementation Plan
1	src/utils/firebaseClient.js	"File: frontend/src/utils/firebaseClient.js"
2	src/contexts/AuthContext.jsx	"File: frontend/src/contexts/AuthContext.jsx"
3	src/screens/LandingScreen.jsx	"File: frontend/src/screens/LandingScreen.jsx"
4	netlify.toml	"File: frontend/netlify.toml"
5.4 Files to DELETE
bash
# Delete these files
rm -f public/_headers
5.5 Update package.json
Add firebase to dependencies:

bash
nano package.json
Find the "dependencies" section and ensure "firebase": "^10.12.0" is present:

json
{
  "dependencies": {
    "firebase": "^10.12.0",
    // ... existing dependencies (react, react-router-dom, etc.)
  }
}
5.6 Update App.jsx (Token Retrieval)
Find the checkOnboardingStatus function and change the token line:

bash
nano src/App.jsx
OLD code:

javascript
const token = (await supabase.auth.getSession()).data.session?.access_token
NEW code:

javascript
const token = await user.getIdToken()
Also remove the import:

javascript
// DELETE this line:
import { supabase } from './utils/supabaseClient'

// ADD this line (if needed for other imports):
import { auth } from './utils/firebaseClient'
5.7 Update MorningFaceCapture.jsx (Storage Upload)
Find the handleUpload function and replace the ENTIRE function:

bash
nano src/components/MorningFaceCapture.jsx
Find the code in Implementation Plan: "File: frontend/src/components/MorningFaceCapture.jsx (MODIFIED - Storage upload only)"

Replace the entire handleUpload function with the code from Implementation Plan.

5.8 Update All Screens (Token Retrieval - 1 line each)
For each file below, find the token line and replace it:

bash
# File 1
nano src/screens/HomeScreen.jsx

# File 2
nano src/screens/DiscoverScreen.jsx

# File 3
nano src/screens/MatchesScreen.jsx

# File 4
nano src/screens/ProfileScreen.jsx

# File 5
nano src/screens/SisterhoodScreen.jsx

# File 6
nano src/components/DailyQuestion.jsx
In each file, find:

javascript
const token = (await supabase.auth.getSession()).data.session?.access_token
Replace with:

javascript
const token = await user.getIdToken()
Note: In some files, user comes from useAuth() or props. If user is not available, you may need to get it from useAuth().

5.9 Update ProfileScreen Logout Function
bash
nano src/screens/ProfileScreen.jsx
Find the handleLogout function and replace it:

OLD code:

javascript
const handleLogout = async () => {
  localStorage.removeItem('bf_onboarding_complete');
  await supabase.auth.signOut();
  window.location.href = '/';
};
NEW code:

javascript
const handleLogout = async () => {
  const { serverLogout } = await import('../utils/firebaseClient');
  await serverLogout();
  window.location.href = '/';
};
5.10 Update Frontend Environment Variables
bash
# Edit .env file
nano .env
Replace with your Firebase config (from Step 2.6):

env
# Backend API URL (local development)
VITE_API_URL=http://localhost:8000

# Firebase Configuration (from Firebase Console)
VITE_FIREBASE_API_KEY=AIzaSy...  (your actual key)
VITE_FIREBASE_AUTH_DOMAIN=bad-friends-morning-face.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=bad-friends-morning-face
VITE_FIREBASE_STORAGE_BUCKET=bad-friends-morning-face.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789  (your actual sender ID)
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef  (your actual app ID)
5.11 Update .env.example for Production
bash
# Edit .env.example (for GitHub, no real values)
nano .env.example
env
# Backend API URL (replace with your Render URL)
VITE_API_URL=https://your-render-url.onrender.com

# Firebase Configuration (replace with your Firebase config)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
5.12 Test Frontend Locally
bash
# Make sure backend is running (from Section 4.7)
# In a new terminal, start frontend:
cd ~/bad-friends-morning-face-build/frontend
npm run dev

# Open browser to http://localhost:5173
# You should see the LandingScreen with active Register/Login buttons

# Test registration:
# - Click Register
# - Fill in form (name, email, phone, password, gender)
# - Submit
# - Check Firebase Console → Authentication → Users (should see new user)

# Test login:
# - Login with registered credentials
# - Should redirect to HomeScreen (/app)
SECTION 6: ENVIRONMENT CONFIGURATION FOR DEPLOYMENT (15 minutes)
6.1 Prepare Backend for Render
bash
cd ~/bad-friends-morning-face-build/backend

# Ensure requirements.txt is correct
cat requirements.txt
# Should contain: fastapi, uvicorn, firebase-admin, etc.

# Create Procfile (if not exists)
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile
6.2 Prepare Frontend for Netlify
bash
cd ~/bad-friends-morning-face-build/frontend

# Ensure build works
npm run build
# Should create dist/ directory with production build
6.3 Commit All Changes
bash
cd ~/bad-friends-morning-face-build

# Add all new and modified files
git add backend/
git add frontend/
git add infrastructure/
git add CHANGELOG.md

# Remove deleted file
git rm frontend/src/utils/supabaseClient.js

# Commit
git commit -m "Firebase migration: Complete rewrite with production-grade best practices

- Migrated from Supabase to Firebase (Auth, Firestore, Storage)
- Added 18 production-grade features (rate limiting, token revocation, etc.)
- Fixed all critical bugs from external audit
- Full production LandingScreen (no demo mode)
- Security rules with gender claim enforcement
- Complete implementation guide"

# Push to GitHub
git push origin feature/firebase-migration
SECTION 7: DEPLOYMENT TO PRODUCTION (30 minutes)
7.1 Deploy Backend to Render
bash
# Step 1: Log into Render (https://render.com)
# Step 2: Click "New +" → "Web Service"
# Step 3: Connect your GitHub repository
# Step 4: Select branch: feature/firebase-migration
# Step 5: Configure:
#   - Name: bad-friends-api
#   - Root Directory: backend
#   - Environment: Python
#   - Build Command: pip install -r requirements.txt
#   - Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
# Step 6: Add Environment Variables (from backend/.env):
Variable	Value
FIREBASE_PROJECT_ID	bad-friends-morning-face
FIREBASE_STORAGE_BUCKET	bad-friends-morning-face.firebasestorage.app
FIREBASE_SERVICE_ACCOUNT_JSON	(paste the entire JSON)
CORS_ORIGINS	["http://localhost:5173","https://bad-friends-morning-face.netlify.app"]
APP_READ_CEILING	40000
USER_HARD_CAP	50
MOCK_DATA_THRESHOLD	20
LOG_LEVEL	INFO
bash
# Step 7: Click "Create Web Service"
# Step 8: Wait for deployment (2-3 minutes)
# Step 9: Verify at https://bad-friends-api.onrender.com/status
7.2 Update Frontend Environment for Production
bash
cd ~/bad-friends-morning-face-build/frontend

# Create production .env file
echo "VITE_API_URL=https://bad-friends-api.onrender.com" > .env.production

# Append Firebase config (from Step 2.6)
echo "VITE_FIREBASE_API_KEY=AIzaSy..." >> .env.production
echo "VITE_FIREBASE_AUTH_DOMAIN=bad-friends-morning-face.firebaseapp.com" >> .env.production
echo "VITE_FIREBASE_PROJECT_ID=bad-friends-morning-face" >> .env.production
echo "VITE_FIREBASE_STORAGE_BUCKET=bad-friends-morning-face.firebasestorage.app" >> .env.production
echo "VITE_FIREBASE_MESSAGING_SENDER_ID=123456789" >> .env.production
echo "VITE_FIREBASE_APP_ID=1:123456789:web:abcdef" >> .env.production
7.3 Deploy Frontend to Netlify
Option A: Auto-deploy from GitHub (Recommended)

bash
# Step 1: Log into Netlify (https://netlify.com)
# Step 2: Click "Add new site" → "Import an existing project"
# Step 3: Connect to GitHub
# Step 4: Select repository: bad-friends-morning-face-build
# Step 5: Branch: feature/firebase-migration
# Step 6: Base directory: frontend
# Step 7: Build command: npm run build
# Step 8: Publish directory: dist
# Step 9: Click "Show advanced" → "New variable"
# Step 10: Add each variable from .env.production
# Step 11: Click "Deploy site"
# Step 12: Wait for deployment (2-3 minutes)
Option B: Manual deploy using Netlify CLI

bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod --dir=dist
7.4 Update CORS Origins on Render
bash
# After Netlify deployment, get your Netlify URL
# Example: https://bad-friends-morning-face.netlify.app

# Go to Render dashboard → your backend service → Environment
# Update CORS_ORIGINS to include your Netlify URL:
# ["http://localhost:5173","https://bad-friends-morning-face.netlify.app"]

# Click "Save Changes" → "Manual Deploy" → "Deploy latest commit"
SECTION 8: TESTING & VALIDATION (30 minutes)
8.1 Test Authentication Flow
Test	Action	Expected Result
1	Go to /register, fill form, submit	Redirect to login or success message
2	Check Firebase Console → Authentication → Users	New user appears
3	Go to /login, enter credentials	Redirect to HomeScreen (/app)
8.2 Test Core Features
Test	Action	Expected Result
4	Click camera button, take photo, upload	Success message, streak updates
5	Answer daily question (min 10 chars)	Success, question marked as answered
6	View Faces tab in feed	Shows morning faces (mock if <20 users)
7	Click reaction buttons (🍜🔥🐯💀)	Counts update
8	Tap Discover tab, rate 3 answers as 💀	Faces unlock after 3 ratings
9	Like a user	"Like sent" or "It's a match!"
10	Tap Matches tab	Shows matches or empty states
11	Tap Profile tab, view streak and history	Data displays correctly
12	Click Logout	Redirect to LandingScreen
8.3 Test Sisterhood (Women Only)
Test	Action	Expected Result
13	Login as woman user, go to Profile → Sisterhood link	Access to Sisterhood screen
14	Login as man user, try to access Sisterhood	Redirect or access denied
8.4 Test Rate Limiting & Gates
Test	Action	Expected Result
15	Make 61 requests in 60 seconds	HTTP 429 response
16	Register 51st user (or set count to 50)	HTTP 503 "At capacity" message
8.5 Test API Endpoints via Swagger
bash
# Go to https://bad-friends-api.onrender.com/docs
# Test each endpoint category:
# - Auth (register only - login is frontend only)
# - Profile
# - Morning Face
# - Questions
# - Reactions
# - Friendships
# - Matches
# - Sisterhood
# - System (status, users/count)
SECTION 9: TROUBLESHOOTING GUIDE
Common Issues and Solutions
Issue	Likely Cause	Solution
CORS error on API calls	CORS_ORIGINS missing Netlify URL	Update Render env vars, add your Netlify URL
"Invalid token" on API calls	Token expired or not refreshed	Frontend should call user.getIdToken() before each request
Sisterhood returns 403	Gender claim not set	Check Firebase Auth custom claims, re-register user
Morning face upload fails	Storage rules too restrictive	Check storage.rules has write permission
Mock data not showing	registered_user_count >= threshold	Check app_config document, lower threshold temporarily
Slow feed loading	Missing composite indexes	Verify indexes deployed, check Firestore Indexes tab
Registration fails with "already exists"	Partial registration	Delete Auth user manually from Firebase Console
Rate limiting too aggressive	Default 60/minute too low	Adjust requests_per_minute in rate_limit.py
Camera not working on Netlify	Permissions-Policy blocking camera	Check netlify.toml has camera NOT in policy
Token revocation not working	Missing check_revoked=True	Verify verify_id_token(token, check_revoked=True)
Debugging Commands
bash
# Check backend logs (Render)
# Render Dashboard → your service → Logs tab

# Check Firestore data
# Firebase Console → Firestore → browse collections

# Check Auth users
# Firebase Console → Authentication → Users tab

# Check Storage files
# Firebase Console → Storage → Files tab

# Test API endpoint with curl
curl -X GET https://bad-friends-api.onrender.com/users/count

# Test authenticated endpoint (get token from browser first)
curl -X GET https://bad-friends-api.onrender.com/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check Firebase token claims
# In browser console after login:
firebase.auth().currentUser.getIdTokenResult().then(r => console.log(r.claims))
SECTION 10: POST-MIGRATION CHECKLIST
Immediate Tasks (Day 1)
Verify all 36 API endpoints return expected responses

Test registration with real email (confirm Firebase Auth)

Test login with real credentials

Test morning face upload (confirm Firebase Storage)

Test all 4 reaction types (🍜🔥🐯💀)

Test daily question answer

Test discover flow (3 ratings → faces unlock → like)

Test follow/unfollow

Test Bad Friends detection (requires 3+ mutual 💀)

Test Sisterhood with woman and man accounts

Test logout (token should be revoked)

Monitor Firebase Console for read/write usage

Short-term Tasks (Week 1)
Set up UptimeRobot to ping /status every 10 minutes (prevent cold starts)

Add 5-10 test users manually

Monitor daily read usage (stay under 40,000)

Adjust mock_data_threshold in app_config when ready for real data

Document any issues encountered

Cleanup Tasks (After Confirming Firebase Works)
bash
# 1. Delete Supabase project (optional)
#    - Go to Supabase dashboard
#    - Delete project: bad-friends-morning-face-build

# 2. Remove old branches (optional)
git branch -d backup/pre-migration
git push origin --delete backup/pre-migration

# 3. Merge migration branch to main
git checkout main
git merge feature/firebase-migration
git push origin main

# 4. Update documentation
#    - Update ARCHITECTURE.md to reflect Firebase
#    - Update README.md with new setup instructions
SECTION 11: QUICK REFERENCE CARD
Key URLs After Migration
Service	URL
Firebase Console	https://console.firebase.google.com
Render (Backend)	https://bad-friends-api.onrender.com
Netlify (Frontend)	https://bad-friends-morning-face.netlify.app
API Documentation	https://bad-friends-api.onrender.com/docs
Health Check	https://bad-friends-api.onrender.com/status
Key Environment Variables
Variable	Where	Purpose
FIREBASE_SERVICE_ACCOUNT_JSON	Render	Backend Firebase Admin
VITE_FIREBASE_API_KEY	Netlify	Frontend Firebase Client
CORS_ORIGINS	Render	Allow frontend domain
USER_HARD_CAP	Render	Max users (default 50)
MOCK_DATA_THRESHOLD	Render/Firestore	Show mock data until X users
Key Firestore Collections
Collection	Purpose
users	User profiles
morning_faces	Daily photos
daily_questions	Questions (baseline + daily)
answers	User answers
reactions	🍜🔥🐯💀 reactions
matches	Romantic matches
follows	Friend connections
bad_friends	Mutual humor detection
sisterhood_posts	Women-only vetting
app_config	Runtime configuration
Emergency Commands
bash
# Reset user count (if stuck)
# In Firestore Console → app_config/global → edit registered_user_count

# Disable registration temporarily
# In Firestore Console → app_config/global → set feature_flags.registration_enabled = false

# Clear rate limiter (restart backend)
# Render Dashboard → your service → Manual Deploy

# Force cache clear (backend)
# Restart service in Render

# Clear local storage (frontend)
# Browser DevTools → Application → Local Storage → Clear
APPENDIX A: Files to Delete Summary
bash
# Run these commands to delete all obsolete files
cd ~/bad-friends-morning-face-build

# Backend - do NOT create these
# (token_blacklist.py is skipped, not created)

# Frontend
rm -f frontend/src/utils/supabaseClient.js
rm -f frontend/public/_headers

# Old environment files (replace with new ones)
rm -f backend/.env
rm -f frontend/.env
APPENDIX B: Files to Create Summary (with Implementation Plan References)
#	File	Found in Implementation Plan
1	backend/requirements.txt	"File: backend/requirements.txt"
2	backend/__init__.py	"File: backend/init.py"
3	backend/core/__init__.py	"File: backend/core/init.py"
4	backend/core/config.py	"File: backend/core/config.py"
5	backend/core/auth.py	"File: backend/core/auth.py"
6	backend/core/exceptions.py	"File: backend/core/exceptions.py"
7	backend/core/middleware.py	"File: backend/core/middleware.py"
8	backend/core/rate_limit.py	"File: backend/core/rate_limit.py"
9	backend/core/monitoring.py	"File: backend/core/monitoring.py"
10	backend/services/__init__.py	"File: backend/services/init.py"
11	backend/services/firebase_client.py	"File: backend/services/firebase_client.py"
12	backend/services/friendship_service.py	"File: backend/services/friendship_service.py"
13	backend/utils/__init__.py	"File: backend/utils/init.py"
14	backend/utils/retry.py	"File: backend/utils/retry.py"
15	backend/api/__init__.py	"File: backend/api/init.py"
16	backend/api/health.py	"File: backend/api/health.py"
17	backend/models/__init__.py	Create empty file
18	backend/models/onboarding.py	"File: backend/models/onboarding.py"
19	backend/main.py	"File: backend/main.py"
20	backend/.env.example	"File: backend/.env.example"
21	frontend/src/utils/firebaseClient.js	"File: frontend/src/utils/firebaseClient.js"
22	frontend/src/contexts/AuthContext.jsx	"File: frontend/src/contexts/AuthContext.jsx"
23	frontend/src/screens/LandingScreen.jsx	"File: frontend/src/screens/LandingScreen.jsx"
24	frontend/netlify.toml	"File: frontend/netlify.toml"
25	infrastructure/firestore.rules	"File: infrastructure/firestore.rules"
26	infrastructure/storage.rules	"File: infrastructure/storage.rules"
27	infrastructure/firestore.indexes.json	"File: infrastructure/firestore.indexes.json"
APPENDIX C: Files to Modify Summary
File	Change	Location in Implementation Plan
frontend/src/App.jsx	Token retrieval (1 line)	"File: frontend/src/App.jsx (MODIFIED)"
frontend/src/screens/HomeScreen.jsx	Token retrieval (1 line)	"File: frontend/src/screens/HomeScreen.jsx"
frontend/src/screens/DiscoverScreen.jsx	Token retrieval (1 line)	"File: frontend/src/screens/DiscoverScreen.jsx"
frontend/src/screens/MatchesScreen.jsx	Token retrieval (1 line)	"File: frontend/src/screens/MatchesScreen.jsx"
frontend/src/screens/ProfileScreen.jsx	Token retrieval + logout	"File: frontend/src/screens/ProfileScreen.jsx"
frontend/src/screens/SisterhoodScreen.jsx	Token retrieval (1 line)	"File: frontend/src/screens/SisterhoodScreen.jsx"
frontend/src/components/DailyQuestion.jsx	Token retrieval (1 line)	"File: frontend/src/components/DailyQuestion.jsx"
frontend/src/components/MorningFaceCapture.jsx	Replace upload function	"File: frontend/src/components/MorningFaceCapture.jsx"
frontend/package.json	Add firebase dependency	"File: frontend/package.json"
END OF BUILD GUIDE
Total estimated time: 3-4 hours
You are now ready to implement the Firebase migration. 🍜

# Checkpoint Confirmed - v1.1.0 Build and DB Switch Start
Three Core Documents Saved for Context
Document	Purpose	Status
BFMF_v1.1_Implementation_Plan.md	All code files (47 files)	✅ Ready
BFMF_V1.1_BuildGuide.md	Step-by-step implementation steps	✅ Ready
BFMF_ARCHITECTURE.md	Complete system architecture (2,400 lines)	✅ Ready

# Migration Strategy: Incremental Chunks
We will break the migration into small, mergeable chunks that can be tested live before proceeding.

Complete Incremental Chunk Breakdown - Entire Project
You're right. Let me map out the true incremental chunks for the entire v1.1.0 Build and DB Switch. Each chunk is:

Mergeable to main (won't break existing functionality where possible)

Testable live (can deploy and verify)

Versionable (can tag and roll back)

Version Structure
Version	Focus	Chunks	Breaking?	Merge to Main
v1.1.0	Firebase Project + Infrastructure	1-6	❌ No	✅ Yes
v1.1.1	Backend Core (no endpoint changes)	7-16	❌ No	✅ Yes
v1.1.2	Backend main.py Replacement	17-21	⚠️ YES	⚠️ Careful
v1.1.3	Frontend Firebase SDK + AuthContext	22-25	⚠️ YES	⚠️ Careful
v1.1.4	Frontend Screens (token retrieval)	26-32	❌ No	✅ Yes
v1.1.5	Frontend Storage + Security	33-35	❌ No	✅ Yes
v1.1.6	Deployment + GitHub Actions	36-43	❌ No	✅ Yes
v1.1.7	Final Testing + Merge	44-46	❌ No	✅ Yes
Total Chunks: 46
Total Estimated Time: ~12-14 hours

v1.1.0: Firebase Project + Infrastructure (6 chunks, 1.5 hours)
Chunk 1: Create Firebase Project
bash
# Goal: Firebase Spark plan active
# Actions:
# - Create project "bad-friends-morning-face"
# - Enable Email/Password auth
# - Create Firestore (production mode, us-central1)
# - Create Storage bucket (us-central1)
# Verification: Firebase Console shows project ready
# Merge to main: ✅ Yes (no code changes)
# Tag after: v1.1.0-chunk1
Chunk 2: Get Service Account & Web Config
bash
# Goal: Credentials saved locally
# Actions:
# - Generate service-account-key.json
# - Move to backend/ (gitignored)
# - Copy firebaseConfig object
# Verification: Files exist locally
# Merge to main: ✅ Yes (gitignored files not committed)
# Tag after: v1.1.0-chunk2
Chunk 3: Deploy Firestore Rules
bash
# Goal: Security rules active
# Actions:
# - Create infrastructure/firestore.rules
# - Paste rules from Implementation Plan
# - Deploy to Firebase Console
# Verification: Rules published
# Merge to main: ✅ Yes (infrastructure file added)
# Tag after: v1.1.0-chunk3
Chunk 4: Deploy Storage Rules
bash
# Goal: Storage rules active
# Actions:
# - Create infrastructure/storage.rules
# - Paste rules from Implementation Plan
# - Deploy to Firebase Console
# Verification: Rules published
# Merge to main: ✅ Yes (infrastructure file added)
# Tag after: v1.1.0-chunk4
Chunk 5: Deploy Firestore Indexes
bash
# Goal: Composite indexes active
# Actions:
# - Create infrastructure/firestore.indexes.json
# - Paste indexes from Implementation Plan
# - Deploy via Firebase CLI or manually
# Verification: Indexes building/active
# Merge to main: ✅ Yes (infrastructure file added)
# Tag after: v1.1.0-chunk5
Chunk 6: Seed App Config & Baseline Questions
bash
# Goal: Seed data in Firestore
# Actions:
# - Create app_config/global document
# - Create 5 baseline questions (daily_questions/baseline_1-5)
# Verification: Documents exist in Firestore
# Merge to main: ✅ Yes (no code changes)
# Tag after: v1.1.0
v1.1.1: Backend Core (10 chunks, 2.5 hours)
Chunk 7: Create Branch & Directory Structure
bash
# Goal: Branch ready for backend work
# Actions:
# - git checkout -b v1.1.1-backend-core
# - mkdir -p backend/core backend/services backend/utils backend/api backend/models
# - touch __init__.py in each directory
# Verification: Directories exist
# Merge to main: ✅ Yes (empty directories)
# Tag after: v1.1.1-chunk7
Chunk 8: Add config.py (Pydantic Settings)
bash
# Goal: Centralized configuration
# Actions:
# - Create backend/core/config.py from Implementation Plan
# - Add Settings class with environment variables
# Verification: Imports without errors
# Merge to main: ✅ Yes (no breaking changes)
# Tag after: v1.1.1-chunk8
Chunk 9: Add exceptions.py (AppException)
bash
# Goal: Structured error responses
# Actions:
# - Create backend/core/exceptions.py from Implementation Plan
# - Add AppException class and ErrorCodes
# Verification: Imports without errors
# Merge to main: ✅ Yes (no breaking changes)
# Tag after: v1.1.1-chunk9
Chunk 10: Add middleware.py
bash
# Goal: Request ID and logging middleware
# Actions:
# - Create backend/core/middleware.py from Implementation Plan
# - Add RequestIDMiddleware, LoggingMiddleware
# Verification: Imports without errors
# Merge to main: ✅ Yes (no breaking changes)
# Tag after: v1.1.1-chunk10
Chunk 11: Add rate_limit.py
bash
# Goal: Rate limiting infrastructure
# Actions:
# - Create backend/core/rate_limit.py from Implementation Plan
# - Add InMemoryRateLimiter, get_client_ip
# Verification: Imports without errors
# Merge to main: ✅ Yes (no breaking changes)
# Tag after: v1.1.1-chunk11
Chunk 12: Add monitoring.py
bash
# Goal: Performance monitoring decorators
# Actions:
# - Create backend/core/monitoring.py from Implementation Plan
# - Add monitor_query, monitor_endpoint decorators
# Verification: Imports without errors
# Merge to main: ✅ Yes (no breaking changes)
# Tag after: v1.1.1-chunk12
Chunk 13: Add auth.py (Firebase token verification)
bash
# Goal: Token verification (not yet used)
# Actions:
# - Create backend/core/auth.py from Implementation Plan
# - Add get_current_user dependency
# Verification: Imports without errors
# Merge to main: ✅ Yes (not yet integrated)
# Tag after: v1.1.1-chunk13
Chunk 14: Add retry.py (utils)
bash
# Goal: Retry with backoff decorator
# Actions:
# - Create backend/utils/retry.py from Implementation Plan
# - Add retry_with_backoff decorator
# Verification: Imports without errors
# Merge to main: ✅ Yes (no breaking changes)
# Tag after: v1.1.1-chunk14
Chunk 15: Add health.py (new endpoint)
bash
# Goal: Health check endpoint (doesn't break existing)
# Actions:
# - Create backend/api/health.py from Implementation Plan
# - Add /status endpoint
# - Register router in main.py (add one line)
# Verification: curl /status returns health
# Merge to main: ✅ Yes (adds new endpoint)
# Tag after: v1.1.1-chunk15
Chunk 16: Add firebase_client.py (empty shell)
bash
# Goal: Firebase client structure (not yet functional)
# Actions:
# - Create backend/services/firebase_client.py
# - Add FirebaseService class with stub methods
# Verification: Imports without errors
# Merge to main: ✅ Yes (no breaking changes)
# Tag after: v1.1.1
v1.1.2: Backend main.py Replacement (5 chunks, 2 hours) ⚠️ BREAKING
Chunk 17: Update requirements.txt
bash
# Goal: Dependencies updated
# Actions:
# - Remove supabase from requirements.txt
# - Add firebase-admin, pydantic-settings
# - Run pip install
# Verification: pip install succeeds
# Merge to main: ⚠️ CAREFUL (dependencies change)
# Tag after: v1.1.2-chunk17
Chunk 18: Add models/onboarding.py
bash
# Goal: Pydantic models for onboarding
# Actions:
# - Create backend/models/onboarding.py from Implementation Plan
# - Add PsychologicalProfileRequest, CalibrationRequest, DealbreakersRequest
# Verification: Imports without errors
# Merge to main: ✅ Yes (adds new files)
# Tag after: v1.1.2-chunk18
Chunk 19: Complete firebase_client.py
bash
# Goal: Full Firebase service implementation
# Actions:
# - Replace stub with full implementation from Implementation Plan
# - Add all CRUD methods, toggle_reaction, friendship_counts
# Verification: Imports without errors
# Merge to main: ✅ Yes (replaces stub)
# Tag after: v1.1.2-chunk19
Chunk 20: Add friendship_service.py
bash
# Goal: Friendship layers service
# Actions:
# - Create backend/services/friendship_service.py from Implementation Plan
# - Add all 4 layers methods
# Verification: Imports without errors
# Merge to main: ✅ Yes (adds new file)
# Tag after: v1.1.2-chunk20
Chunk 21: Replace main.py (THE BIG ONE)
bash
# Goal: Complete main.py with 36 Firebase endpoints
# Actions:
# - Replace backend/main.py with Implementation Plan version
# - Remove all Supabase imports and calls
# - Add all Firebase endpoints
# Verification: ALL 36 endpoints must work
# Merge to main: ⚠️ BREAKING (API changes)
# Tag after: v1.1.2
v1.1.3: Frontend Firebase SDK + AuthContext (4 chunks, 1.5 hours) ⚠️ BREAKING
Chunk 22: Install Firebase SDK
bash
# Goal: Firebase SDK in frontend
# Actions:
# - cd frontend && npm install firebase
# - Delete src/utils/supabaseClient.js
# - Create src/utils/firebaseClient.js (stub)
# Verification: npm install succeeds
# Merge to main: ⚠️ CAREFUL (new dependency)
# Tag after: v1.1.3-chunk22
Chunk 23: Complete firebaseClient.js
bash
# Goal: Full Firebase client implementation
# Actions:
# - Replace stub with full implementation from Implementation Plan
# - Add auth, db, storage exports
# - Add serverLogout helper
# Verification: Imports without errors
# Merge to main: ✅ Yes (replaces stub)
# Tag after: v1.1.3-chunk23
Chunk 24: Rewrite AuthContext.jsx
bash
# Goal: Firebase Auth provider
# Actions:
# - Replace src/contexts/AuthContext.jsx with Implementation Plan version
# - Remove all Supabase auth calls
# - Add Firebase auth (register, login, logout with serverLogout)
# Verification: AuthContext exports without errors
# Merge to main: ⚠️ BREAKING (auth changes)
# Tag after: v1.1.3-chunk24
Chunk 25: Update App.jsx token retrieval
bash
# Goal: One line change in App.jsx
# Actions:
# - Find token line: (await supabase.auth.getSession())...
# - Replace with: await user.getIdToken()
# - Remove supabase import
# Verification: App loads, token retrieved
# Merge to main: ⚠️ BREAKING (auth changes)
# Tag after: v1.1.3
v1.1.4: Frontend Screens (7 chunks, 1.5 hours) ✅ SAFE
Chunk 26: Replace LandingScreen
bash
# Goal: Full production LandingScreen (no demo mode)
# Actions:
# - Replace src/screens/LandingScreen.jsx with Implementation Plan version
# - Remove demo mode button, enable Register/Login
# Verification: Landing page shows active buttons
# Merge to main: ✅ Yes (UI only, no breaking changes)
# Tag after: v1.1.4-chunk26
Chunk 27: Update HomeScreen token retrieval
bash
# Goal: One line change
# Actions:
# - Find token line, replace with await user.getIdToken()
# Verification: HomeScreen loads, feed works
# Merge to main: ✅ Yes (one line change)
# Tag after: v1.1.4-chunk27
Chunk 28: Update DiscoverScreen token retrieval
bash
# Goal: One line change
# Actions:
# - Find token line, replace with await user.getIdToken()
# Verification: Discover loads, candidates appear
# Merge to main: ✅ Yes (one line change)
# Tag after: v1.1.4-chunk28
Chunk 29: Update MatchesScreen token retrieval
bash
# Goal: One line change
# Actions:
# - Find token line, replace with await user.getIdToken()
# Verification: Matches load
# Merge to main: ✅ Yes (one line change)
# Tag after: v1.1.4-chunk29
Chunk 30: Update ProfileScreen token retrieval + logout
bash
# Goal: Token change AND logout function
# Actions:
# - Replace token line
# - Replace handleLogout to use serverLogout()
# Verification: Profile loads, logout works
# Merge to main: ✅ Yes (logout improvement)
# Tag after: v1.1.4-chunk30
Chunk 31: Update SisterhoodScreen token retrieval
bash
# Goal: One line change
# Actions:
# - Find token line, replace with await user.getIdToken()
# Verification: Sisterhood loads (women only)
# Merge to main: ✅ Yes (one line change)
# Tag after: v1.1.4-chunk31
Chunk 32: Update DailyQuestion token retrieval
bash
# Goal: One line change
# Actions:
# - Find token line, replace with await user.getIdToken()
# Verification: Daily question loads
# Merge to main: ✅ Yes (one line change)
# Tag after: v1.1.4
v1.1.5: Frontend Storage + Security (3 chunks, 45 minutes) ✅ SAFE
Chunk 33: Update MorningFaceCapture storage upload
bash
# Goal: Firebase Storage upload
# Actions:
# - Replace handleUpload function with Implementation Plan version
# - Remove Supabase storage calls
# - Add Firebase storage upload with user folder
# Verification: Morning face uploads to Firebase Storage
# Merge to main: ✅ Yes (storage change only)
# Tag after: v1.1.5-chunk33
Chunk 34: Add netlify.toml with CSP headers
bash
# Goal: Security headers for Netlify
# Actions:
# - Create frontend/netlify.toml from Implementation Plan
# - Add CSP, X-Frame-Options, etc.
# Verification: netlify.toml exists
# Merge to main: ✅ Yes (config file)
# Tag after: v1.1.5-chunk34
Chunk 35: Delete public/_headers (duplicate)
bash
# Goal: Remove duplicate headers
# Actions:
# - rm frontend/public/_headers
# Verification: File deleted
# Merge to main: ✅ Yes (cleanup)
# Tag after: v1.1.5
v1.1.6: Deployment + GitHub Actions (8 chunks, 1.5 hours) ✅ SAFE
Chunk 36: Update Render environment variables
bash
# Goal: Firebase config on Render
# Actions:
# - Add FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET
# - Add FIREBASE_SERVICE_ACCOUNT_JSON
# - Remove SUPABASE_* variables
# Verification: Render dashboard shows new vars
# Merge to main: ✅ Yes (no code change)
# Tag after: v1.1.6-chunk36
Chunk 37: Update Netlify environment variables
bash
# Goal: Firebase config on Netlify
# Actions:
# - Add VITE_FIREBASE_* variables
# - Remove VITE_SUPABASE_* variables
# Verification: Netlify dashboard shows new vars
# Merge to main: ✅ Yes (no code change)
# Tag after: v1.1.6-chunk37
Chunk 38: Deploy backend to Render
bash
# Goal: Backend live with Firebase
# Actions:
# - Push code to GitHub
# - Render auto-deploys (or manual deploy)
# Verification: https://meetingmind-d7dx.onrender.com/status returns health
# Merge to main: ✅ Yes (deployment only)
# Tag after: v1.1.6-chunk38
Chunk 39: Deploy frontend to Netlify
bash
# Goal: Frontend live with Firebase
# Actions:
# - Push code to GitHub
# - Netlify auto-deploys
# Verification: https://bad-friends-morning-face.netlify.app loads
# Merge to main: ✅ Yes (deployment only)
# Tag after: v1.1.6-chunk39
Chunk 40: Create daily_question.yml workflow
bash
# Goal: GitHub Action for daily question
# Actions:
# - Create .github/workflows/daily_question.yml
# - Add cron schedule (6am UTC)
# Verification: Workflow appears in GitHub Actions tab
# Merge to main: ✅ Yes (adds workflow)
# Tag after: v1.1.6-chunk40
Chunk 41: Create cleanup_posts.yml workflow
bash
# Goal: GitHub Action for post cleanup
# Actions:
# - Create .github/workflows/cleanup_posts.yml
# - Add cron schedule (2am UTC)
# Verification: Workflow appears in GitHub Actions tab
# Merge to main: ✅ Yes (adds workflow)
# Tag after: v1.1.6-chunk41
Chunk 42: Create seed_daily_question.py script
bash
# Goal: Python script for seeding
# Actions:
# - Create scripts/seed_daily_question.py
# - Add question bank and Firestore write logic
# Verification: Script runs manually
# Merge to main: ✅ Yes (adds script)
# Tag after: v1.1.6-chunk42
Chunk 43: Create cleanup_expired_posts.py script
bash
# Goal: Python script for cleanup
# Actions:
# - Create scripts/cleanup_expired_posts.py
# - Add Firestore delete logic for expired posts
# Verification: Script runs manually
# Merge to main: ✅ Yes (adds script)
# Tag after: v1.1.6
v1.1.7: Final Testing + Merge (3 chunks, 1 hour) ✅ SAFE
Chunk 44: Full Integration Testing
bash
# Goal: All features working together
# Actions:
# - Register new user
# - Login
# - Upload morning face
# - Answer daily question
# - React to feed
# - Discover + rate 3 answers → unlock faces
# - Like user → match
# - Sisterhood (woman user)
# - Logout
# Verification: All tests pass
# Merge to main: ✅ Yes (testing only)
# Tag after: v1.1.7-chunk44
Chunk 45: Merge to main
bash
# Goal: All changes in main branch
# Actions:
# - git checkout main
# - git merge v1.1.6 (or latest)
# - git push origin main
# Verification: main branch has all changes
# Merge to main: N/A (this IS the merge)
# Tag after: v1.1.7-chunk45
Chunk 46: Tag v1.1.7 Release
bash
# Goal: Release tag created
# Actions:
# - git tag v1.1.7
# - git push origin v1.1.7
# Verification: Tag appears in GitHub
# Merge to main: ✅ Yes (tag only)
# Tag after: v1.1.7 (FINAL)
Summary Table
Version	Chunks	Time	Breaking?	Mergeable?
v1.1.0	1-6	1.5h	❌ No	✅ Yes
v1.1.1	7-16	2.5h	❌ No	✅ Yes
v1.1.2	17-21	2h	⚠️ YES	⚠️ Careful
v1.1.3	22-25	1.5h	⚠️ YES	⚠️ Careful
v1.1.4	26-32	1.5h	❌ No	✅ Yes
v1.1.5	33-35	45m	❌ No	✅ Yes
v1.1.6	36-43	1.5h	❌ No	✅ Yes
v1.1.7	44-46	1h	❌ No	✅ Yes
TOTAL	46	~12.5h		
Next Steps
We will start with Chunks 1-6 (v1.1.0) in detail:

Chunk 1: Create Firebase project

Chunk 2: Get service account & web config

Chunk 3: Deploy Firestore rules

Chunk 4: Deploy Storage rules

Chunk 5: Deploy Firestore indexes

Chunk 6: Seed app_config & baseline questions

Say "PROCEED WITH CHUNK 1" and I will give you the detailed step-by-step for the first chunk. 🍜

