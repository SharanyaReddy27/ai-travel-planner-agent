# 🌍 AI Travel Planner

An intelligent, multi-agent travel planning system built with FastAPI, LangGraph, Google Gemini, and React. Generates personalized multi-day travel itineraries with real-time weather advice, smart budget breakdowns, curated hotel recommendations, interactive Google Maps integration, and exportable PDF travel guides.

---

## 🚀 Features

- **Personalized Itineraries**: Day-by-day morning, lunch, afternoon, evening, and night schedules customized to trip duration and travel interests.
- **Weather & Packing Intelligence**: Real-time climate conditions, seasonal travel advice, packing checklists, and safety precautions.
- **Smart Budget Allocation**: Category-wise cost splits (Accommodation, Food, Transport, Activities, Contingency) with visual progress bars and daily average spending.
- **Curated Accommodations**: Handpicked stays with ratings, seasonal estimated prices, and direct location navigation.
- **Google Maps Explorer**: Deep-linked map queries for the entire destination, daily sightseeing highlights, and hotel coordinates (no API key required).
- **PDF Travel Guide Export**: High-resolution, multi-page travel guides ready for offline download and printing.

---

## 🏗️ Architecture & Tech Stack

- **Backend**:
  - [FastAPI](https://fastapi.tiangolo.com/) (RESTful API)
  - [LangGraph](https://github.com/langchain-ai/langgraph) & [LangChain](https://github.com/langchain-ai/langchain) (Multi-agent orchestration)
  - [Google Gemini API](https://ai.google.dev/) (LLM reasoning & extraction)
  - [Uvicorn](https://www.uvicorn.org/) (ASGI server)
- **Frontend**:
  - [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - [Lucide React](https://lucide.dev/) (Modern iconography)
  - [jsPDF](https://github.com/parallax/jsPDF) (Client-side PDF generation)

---

## 🛠️ Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- Google Gemini API key ([Google AI Studio](https://aistudio.google.com/))

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
# source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=your_key_here

uvicorn main:app --reload --port 8000
```
API Documentation will be accessible at: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173/` in your browser.

---

## 📁 Project Structure

```text
ai-travel-planner/
├── backend/
│   ├── agents/          # Weather, Budget, Hotel, Itinerary & Planner agents
│   ├── graph/           # LangGraph workflow definitions
│   ├── tools/           # Agent tools & external integrations
│   ├── config.py        # Environment & Gemini configuration
│   ├── main.py          # FastAPI application & endpoints
│   ├── requirements.txt # Python dependencies
│   └── .env.example     # Environment template
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI cards & layout modules
│   │   ├── context/     # Trip state management (TripContext)
│   │   ├── pages/       # Home and Dashboard views
│   │   ├── services/    # API client, Maps helper & PDF generator
│   │   ├── index.css    # Global design tokens & styling
│   │   └── App.jsx      # Router configuration
│   ├── package.json
│   └── vite.config.js
└── README.md
```
