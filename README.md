Bad Friends Morning Face Build
<p align="center"> <img src="https://via.placeholder.com/800x200?text=🍜+Bad+Friends+Morning+Face+Build+🍜" alt="Bad Friends Banner" width="800"> </p><p align="center"> <strong>A humor-first dating app where authenticity meets comedy.</strong> </p><p align="center"> <a href="#features">Features</a> • <a href="#tech-stack">Tech Stack</a> • <a href="#quick-start">Quick Start</a> • <a href="#documentation">Documentation</a> • <a href="#roadmap">Roadmap</a> </p>
🎯 The Core Concept
Morning faces. Bad jokes. Real matches.

Bad Friends is the world's first dating app that matches people based on authentic morning faces, generated humor, and psychological depth—while making women feel so safe and in control that they become the primary users.

The Three Pillars
Pillar	Description
Authenticity	Daily morning face uploads. No filters. No retakes. Everyone looks human together.
Humor Generation	Matching based on how funny you are, not what you like. CMI (Comedy Match Index) measures semantic similarity to genuinely funny answers.
Safety Through Trust	Graduated trust levels (1-5). Asymmetric verification. Women control location sharing. Men earn trust over time.
✨ What Makes Us Different (The WOW Factors)
#	Differentiator	Why It's Revolutionary
1	Morning Face Required Daily	No other app forces daily vulnerability. Levels the playing field.
2	CMI (Comedy Match Index)	Measures generated humor against community gold standard. Cannot be gamed.
3	Answers First, Faces Second	Card stack shows humor before photos. Reverses every dating app's priority.
4	Graduated Trust Levels (1-5)	Location sharing only at Level 4+. Trust is earned, not given.
5	Asymmetric Verification	Easier for women, stricter for men. Prevents catfishing.
6	Critical Moment Simulation	LLMs simulate conflict scenarios before matching. Predicts long-term compatibility.
7	Psychological Depth (7 Scales)	Big Five, Attachment, Love Languages, Values, Conflict Style, Humor Style, Sensation Seeking.
8	Multi-Agent ASI Matchmaking	AI companions mingle overnight, reveal only high-confidence matches.
9	Women's Verification Network ("The Sisterhood")	Anonymous vetting within verified women-only space.
10	Location Heat Maps, Not Pins	See crowd density, not individual locations. Privacy-first proximity.
🚀 Quick Start
Prerequisites
Node.js 18+

Python 3.10+

Supabase account (free tier)

Groq API key (free)

Netlify account (free)

Render account (free)

Clone & Install
bash
# Clone the repository
git clone https://github.com/DamainRamsajan/bad-friends-morning-face-build.git
cd bad-friends-morning-face-build

# Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys

# Frontend setup
cd ../frontend
npm install
cp .env.example .env
# Edit .env with your Supabase URL and keys
Run Locally
bash
# Terminal 1: Backend
cd backend
python3 -m uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev
Access
Frontend: http://localhost:5173

Backend API Docs: http://localhost:8000/docs

Health Check: http://localhost:8000/status

🛠️ Tech Stack
Layer	Technology	Purpose
Frontend	React 18 + Vite	UI Framework
Tailwind CSS	Styling
Axios	HTTP Client
Backend	FastAPI	API Framework
Uvicorn	ASGI Server
Pydantic	Data Validation
Database	Supabase (PostgreSQL)	Primary Database
pgvector	Vector Embeddings
Supabase Auth	Authentication
Supabase Storage	Image Storage
AI/ML	Groq (Llama 3.3 70B)	LLM for CMI & Matching
Hugging Face	Embeddings
AssemblyAI	Voice Transcription (v2)
Verification	Persona	ID + Selfie Match (v1.1)
Hosting	Netlify	Frontend
Render	Backend
Monitoring	UptimeRobot	Cold Start Prevention
📁 Project Structure
text
bad-friends-morning-face-build/
├── docs/
│   ├── architecture.md     # Complete system architecture with C4 diagrams
│   ├── context.md          # Master context document for AI assistance
│   ├── roadmap.md          # Phase-by-phase development plan
│   └── wireframe.md        # ASCII mockups of all 28 screens
├── backend/
│   ├── main.py             # FastAPI entry point
│   ├── requirements.txt    # Python dependencies
│   ├── Procfile            # Render deployment
│   ├── .env.example        # Environment variables template
│   ├── api/                # Route handlers
│   ├── core/               # Config, database, security
│   ├── services/           # Business logic
│   ├── models/             # Pydantic models
│   └── utils/              # Helpers
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── main.jsx        # Entry point
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── hooks/          # Custom hooks (useCamera, useDiscover, etc.)
│   │   ├── screens/        # Page components
│   │   └── utils/          # API client, helpers
│   ├── public/             # Static assets
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── netlify.toml
└── README.md
📚 Documentation
Document	Description
architecture.md	Complete system design with C4 diagrams, class diagrams, data flows, state machines, and API specifications
context.md	Master context document for AI-assisted development. Contains all decisions, features, and current state
roadmap.md	Phase-by-phase development plan from v1 prototype through v5 monetization
wireframe.md	ASCII mockups of all 28 screens with design system reference
🗺️ Roadmap
Phase	Focus	Timeline
Phase 1	Free Prototype (MVP)	5 days
Phase 1.1	Safety & Verification	Week 2
Phase 2	Trust + Location	Month 2
Phase 3	AI Features (CMI, ASI)	Month 3
Phase 4	Social Features	Month 4
Phase 5	Monetization (Fancy B Tier)	Month 5
See roadmap.md for detailed milestones.

🛡️ Safety & Trust
Bad Friends is built with women's safety as the top priority:

Asymmetric Verification: Women verify with email+phone (quick). Men verify with ID+liveness (stricter).

Graduated Trust Levels (1-5) : Location sharing only at Level 4+. Trust is earned through behavior.

"The Sisterhood" : Women-only anonymous vetting space. No screenshots.

"Bad Friend Backup" : Share date details + live location with trusted external contact.

Emergency Kill Switch: One-tap lockdown of all location sharing.

Real Woman Badge: Earned after 30-day streak + endorsements from verified women.

🤝 Contributing
This is a closed-source project for the Bad Friends podcast community. For bug reports or feature requests, please contact the development team.

📧 Contact
Email for verification service accounts: peterdramsajan@gmail.com

🙏 Acknowledgments
Bad Friends Podcast (Bobby Lee & Andrew Santino) for the chaotic, absurdist humor that inspired this app

Intellica AI for the MeetingMind architecture patterns

The research community for validated psychological scales and matching algorithms

📄 License
MIT License - see LICENSE file for details.

<p align="center"> Built with 🍜 by the Bad Friends community </p>