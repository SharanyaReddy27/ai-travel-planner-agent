# 🌍 AI Travel Planner

> An intelligent, production-ready multi-agent travel architecture powered by FastAPI, LangGraph, Google Gemini, and React. Generates personalized multi-day travel itineraries with real-time weather advice, smart budget allocation, curated hotel recommendations, interactive Google Maps integration, and downloadable PDF travel guides.

---

## 📌 Overview

**AI Travel Planner** transforms the tedious, multi-tab experience of trip planning into a single, cohesive workflow. By combining specialized AI agents with domain-specific extraction, the platform takes user parameters—destination, duration, budget, and travel interests—and synthesizes a complete travel dossier in seconds.

---

## 🌟 Project Highlights & Portfolio

### Technical Highlights
- **Multi-Agent Orchestration**: Designed a decoupled agent pipeline using LangGraph and Google Gemini with dedicated agents for weather intelligence, budget allocation, accommodation curation, and itinerary generation.
- **Resilient AI Pipeline**: Engineered automated model fallback cascades (`gemini-3.8-flash` $\rightarrow$ `gemini-flash-latest` $\rightarrow$ `gemini-3.5-flash` $\rightarrow$ `gemini-2.5-flash-lite`) paired with deterministic fallbacks to guarantee uptime even during quota constraints.
- **Client-Side Document Synthesis**: Implemented high-performance, font-safe PDF generation using `jsPDF` directly in the browser, eliminating server rendering overhead.
- **Zero-API-Key Geo Integration**: Deep-linked query architecture providing interactive Google Maps navigation across daily stops and stays without exposing API keys or incurring map billing fees.
- **Production-Ready Full-Stack Security**: Environment-driven CORS configuration, decoupled public/secret variable isolation, and clean SPA routing.

### Resume-Ready Summary
- Built an AI-powered travel planning platform using **React 19**, **FastAPI**, **LangGraph**, and **Google Gemini** that generates personalized multi-day itineraries based on destination, duration, budget, and interests.
- Implemented structured budget planning, climate-aware packing recommendations, hotel suggestions, Google Maps navigation, and client-side multi-page PDF guide export.
- Architected automated LLM fallback cascades and rigorous Pydantic schema validation to ensure reliable frontend rendering and 100% budget math accuracy.

---

## ✨ Key Features

- **Personalized Day-by-Day Timeline**: Morning, lunch, afternoon, evening, and night schedules tailored to user interests with estimated daily costs.
- **Weather & Packing Checklist**: Live temperature, weather conditions, seasonal travel advice, an interactive packing checklist, and distinct safety advisories.
- **Smart Budget Allocation**: Category-wise cost splits (Accommodation, Food, Local Transport, Activities, Emergency) with visual progress bars and daily average spend.
- **Curated Accommodations**: Recommended stays with star ratings, prime area locations, estimated nightly rates, and direct Maps links (*pricing is estimated, not live booking*).
- **Google Maps Explorer**: One-click navigation to explore whole destinations, individual itinerary days, or hotel coordinates via safe URL search links (*no API key required*).
- **PDF Travel Guide Export**: High-resolution, multi-page travel guides ready for offline download and printing with formatted cost tables and daily plans.
- **Responsive Travel UI**: Built with a modern dark theme (Slate-950/900), mobile slide-out drawer, accessible input labels, and fluid desktop grids.
- **AI Fallback Handling**: Automated model cascade ensures graceful responses if primary AI models experience rate limiting.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Hooks, Context API)
- **Tooling & Bundler**: Vite 8
- **Styling**: Tailwind CSS v4, Vanilla CSS design tokens (`Plus Jakarta Sans` typography)
- **Icons**: Lucide React
- **Document Export**: jsPDF (client-side A4 generation)
- **Routing**: React Router DOM v7

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Server**: Uvicorn (ASGI)
- **AI Orchestration**: LangGraph, LangChain Core
- **LLM Provider**: Google Generative AI (`gemini-3.8-flash` with cascade fallbacks)
- **Data Validation**: Pydantic v2
- **Environment Management**: python-dotenv

---

## 🏛️ System Architecture

```
User (Browser)
      │
      ▼
React 19 Frontend (Vite + Tailwind CSS)
      │
      ▼  HTTP POST /plan-trip (JSON) [CORS Protected]
FastAPI REST API Server
      │
      ▼  Pydantic Validation (TripRequest)
LangGraph & Multi-Agent Orchestrator
      ├── Weather Agent (Climate & Packing Checklist)
      ├── Planner Agent (Master Plan & Summary)
      ├── Budget Agent (5-Category 100% Allocation)
      ├── Hotel Agent (Top 3 Accommodations)
      └── Itinerary Agent (Morning-to-Night Schedule)
      │
      ▼  Structured Schema Extraction
Google Gemini LLM (gemini-3.8-flash + Model Fallback Pipeline)
      │
      ▼  Structured JSON Response
Interactive Dashboard (Weather, Budget, Hotels, Itinerary)
      ├── Google Maps Explorer (Zero-API-key Search URLs)
      └── PDF Travel Guide Export (Client-side jsPDF Generation)
```

For complete architecture details and data schemas, see [docs/architecture.md](docs/architecture.md).

---

## 📁 Project Structure

```text
ai-travel-planner/
├── backend/
│   ├── agents/               # Specialized AI agents
│   │   ├── weather_agent.py   # Regional climate & packing logic
│   │   ├── budget_agent.py    # 5-part budget breakdown
│   │   ├── hotel_agent.py     # Hotel recommendations
│   │   ├── itinerary_agent.py # Daily timeline builder
│   │   └── planner_agent.py   # Multi-agent orchestrator & fallbacks
│   ├── graph/                # LangGraph workflow definitions
│   ├── tools/                # External tools & helper modules
│   ├── config.py             # Environment config & dynamic CORS
│   ├── main.py               # FastAPI application & endpoints
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Backend environment template
├── frontend/
│   ├── public/               # Favicon and static assets
│   ├── src/
│   │   ├── components/       # Specialized UI cards & layout elements
│   │   │   ├── BudgetCard.jsx
│   │   │   ├── DestinationBanner.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── HotelCard.jsx
│   │   │   ├── ItineraryCard.jsx
│   │   │   ├── LoadingScreen.jsx
│   │   │   ├── MapsCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PdfExportCard.jsx
│   │   │   ├── PlannerForm.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── WeatherCard.jsx
│   │   ├── context/          # TripContext global state store
│   │   ├── pages/            # Home and Dashboard views
│   │   ├── services/         # API client, Maps helper, PDF generator
│   │   ├── index.css         # Global design system tokens & scrollbars
│   │   └── App.jsx           # Application routes
│   ├── package.json          # Dependencies & scripts
│   ├── vite.config.js        # Vite & Tailwind configuration
│   ├── vercel.json           # Vercel SPA routing rewrite
│   └── .env.example          # Frontend environment template
├── docs/
│   └── architecture.md       # Comprehensive technical documentation
├── render.yaml               # Render Cloud deployment blueprint
├── .gitignore                # Comprehensive ignore rules
└── README.md                 # Project documentation
```

---

## ⚙️ Local Setup Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **Python**: v3.10 or higher ([Download Python](https://www.python.org/))
- **Google Gemini API Key**: Free API key from [Google AI Studio](https://aistudio.google.com/)

---

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and paste your GEMINI_API_KEY
```

Start the backend development server:
```bash
uvicorn main:app --reload --port 8000
```
- API Base URL: `http://127.0.0.1:8000`
- Interactive Swagger API Docs: `http://127.0.0.1:8000/docs`
- Health Check: `http://127.0.0.1:8000/`

---

### 3. Frontend Setup

In a new terminal window:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Open `http://localhost:5173/` in your browser.

---

## 🔐 Environment Variables

| Variable | Scope | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | **Backend (Secret)** | **Yes** | Google Gemini API key for AI agents | `your_api_key_here` |
| `GEMINI_MODEL` | **Backend** | No | Primary Gemini model (default: `gemini-3.8-flash`) | `gemini-3.8-flash` |
| `FRONTEND_ORIGIN` | **Backend** | No | Allowed production frontend origin(s) for CORS | `https://your-app.vercel.app` |
| `VITE_API_URL` | **Frontend (Public)** | No | Backend API endpoint URL (defaults to `http://127.0.0.1:8000`) | `https://api.onrender.com` |

> ⚠️ **Security Notice**: Never place `GEMINI_API_KEY` in frontend configuration or commit `.env` files to source control.

---

## 📡 API Reference

### Health Check
```http
GET /
```
**Response (`200 OK`)**:
```json
{
  "status": "healthy",
  "message": "AI Travel Planner Backend Running 🚀",
  "version": "1.0.0"
}
```

### Generate Travel Plan
```http
POST /plan-trip
Content-Type: application/json
```
**Request Body**:
```json
{
  "destination": "Goa",
  "days": 3,
  "budget": 25000,
  "interests": "beaches, nightlife, cafes"
}
```

**Response (`200 OK`)**:
Returns structured travel guide JSON containing `destination`, `days`, `budget`, `summary`, `weather`, `budget_breakdown`, `hotels`, and `itinerary`. Full schema is documented in [docs/architecture.md](docs/architecture.md).

---

## 🚀 Production Deployment Guide

The AI Travel Planner is optimized for modern cloud platforms:

### 1. Backend on Render ([render.com](https://render.com/))
1. Connect your GitHub repository to Render.
2. Render will automatically detect [`render.yaml`](render.yaml) as a Web Service blueprint:
   - **Environment**: Python 3.11+
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. In the Render Dashboard, add your Secret Environment Variable:
   - `GEMINI_API_KEY` = *your_gemini_api_key*
   - `FRONTEND_ORIGIN` = `https://your-frontend.vercel.app` (set after frontend deployment)
4. Copy your backend service URL (e.g. `https://ai-travel-planner-backend.onrender.com`).

### 2. Frontend on Vercel ([vercel.com](https://vercel.com/))
1. Import your GitHub repository into Vercel.
2. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. In Vercel Project Settings $\rightarrow$ **Environment Variables**, set:
   - `VITE_API_URL` = `https://ai-travel-planner-backend.onrender.com`
4. Click **Deploy**. Vercel will build the frontend and apply SPA rewrites via [`frontend/vercel.json`](frontend/vercel.json).

---

## 📸 Screenshots & Demo Preview

> *Visual demonstrations of the AI Travel Planner.*

| Trip Planner (Home) | Personalized Dashboard |
| :---: | :---: |
| *Intuitive form with quick-pick destinations and interactive travel style chips* | *Structured multi-day overview with weather, budget, hotels, and timeline* |

| Daily Timeline & Itinerary | Google Maps & PDF Export |
| :---: | :---: |
| *Morning-to-night vertical schedule with cost estimates and sights* | *One-click Google Maps navigation and offline-ready formatted PDF guide* |

*(Place screenshots or demo video in `docs/images/` and link here when capturing live platform demo recordings.)*

---

## ⚠️ Known Limitations & Scope

- **Estimated Pricing**: Hotel prices and daily expenses are intelligent seasonal estimates calculated by the AI model; live real-time booking rates are not fetched.
- **Maps Navigation**: Google Maps integration opens targeted search and coordinate queries directly in Google Maps in a new tab; embedded interactive map tiles requiring proprietary Google Cloud billing keys are intentionally omitted.
- **Quota & Fallbacks**: If free-tier Gemini API quotas are exceeded, the platform seamlessly falls back through alternative model tiers and deterministic data structures.
- **Client-Side PDF**: PDF export generates formatted vector guides via `jsPDF` directly on the client machine; export speed depends on the client browser.

---

## 🔮 Future Roadmap

- [ ] **Live Booking APIs**: Integration with Amadeus or Booking.com for live hotel availability and flight tracking.
- [ ] **Live Radar Weather**: Real-time Doppler radar integration via OpenWeatherMap.
- [ ] **User Accounts & Authentication**: OAuth login (Google/GitHub) with trip saving and cloud synchronization.
- [ ] **Collaborative Planning**: Multi-user trip boards with real-time voting on sights and hotels.
- [ ] **Multi-Currency Support**: Dynamic currency switching (USD, EUR, GBP, JPY, AUD) with real-time forex conversions.

---

## 📄 License

This project is licensed under the MIT License — see the repository for details.
