# AI Travel Planner — Architecture & Technical Specifications

This document outlines the end-to-end system architecture, data flow, agent design, and deployment configuration for the **AI Travel Planner**.

---

## 1. System Architecture

The AI Travel Planner follows a decoupled, client-server architecture designed for high responsiveness, offline export capabilities, and resilient AI execution.

```
┌────────────────────────────────────────────────────────────────────────┐
│                             CLIENT BROWSER                             │
│                                                                        │
│   ┌────────────────────┐            ┌──────────────────────────────┐   │
│   │   Home / Planner   │            │     Dashboard & Overview     │   │
│   │   Form Component   │            │   (Weather, Budget, Stays,   │   │
│   └─────────┬──────────┘            │    Itinerary, Maps, PDF)     │   │
│             │                       └──────────────▲───────────────┘   │
│             ▼                                      │                   │
│   ┌────────────────────┐            ┌──────────────┴───────────────┐   │
│   │   TripContext      ├───────────►│   External Actions:          │   │
│   │   (State Store)    │            │   - Google Maps Explorer     │   │
│   └─────────┬──────────┘            │   - Client jsPDF Guide Gen   │   │
│             │                       └──────────────────────────────┘   │
└─────────────┼──────────────────────────────────────────────────────────┘
              │ HTTP POST /plan-trip (JSON payload)
              │ CORS: FRONTEND_ORIGIN
              ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FASTAPI BACKEND SERVER                          │
│                                                                        │
│   ┌────────────────────┐            ┌──────────────────────────────┐   │
│   │  FastAPI Endpoints │            │     Pydantic Validation      │   │
│   │  GET /, POST /plan ├───────────►│     (TripRequest Model)      │   │
│   └─────────┬──────────┘            └──────────────┬───────────────┘   │
│             │                                      │                   │
│             ▼                                      ▼                   │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │              LANGGRAPH & MULTI-AGENT ORCHESTRATOR              │   │
│   │                                                                │   │
│   │   ┌──────────────────┐           ┌──────────────────┐          │   │
│   │   │  Weather Agent   │           │  Planner Agent   │          │   │
│   │   │  (Temp & Pack)   │           │  (Master Plan)   │          │   │
│   │   └────────┬─────────┘           └────────┬─────────┘          │   │
│   │            │                              │                    │   │
│   │            ▼                              ▼                    │   │
│   │   ┌──────────────────┐ ┌──────────────────┐ ┌────────────────┐ │   │
│   │   │   Budget Agent   │ │   Hotel Agent    │ │Itinerary Agent │ │   │
│   │   │ (5 Categories)   │ │  (Top 3 Stays)   │ │ (Timeline)     │ │   │
│   │   └──────────────────┘ └──────────────────┘ └────────────────┘ │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
│                                    │                                   │
│                                    ▼                                   │
│                     ┌──────────────────────────────┐                   │
│                     │      Google Gemini API       │                   │
│                     │   (gemini-3.8-flash + LLM    │                   │
│                     │     Fallback Pipeline)       │                   │
│                     └──────────────────────────────┘                   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Flow

1. **Landing & Input (`Home.jsx` & `PlannerForm.jsx`)**:
   - The user inputs `destination`, `days` (duration), `budget` (INR), and optional `interests`.
   - The form provides interactive tag chips (e.g., Beaches, Nightlife, Mountains, Food & Cafes) and destination presets (Goa, Manali, Jaipur, etc.) for quick customization.
   - Validation ensures destination is non-empty, days $\ge 1$, and budget $\ge 1000$.
2. **Asynchronous Request (`api.js`)**:
   - Sends a `POST` request to `${VITE_API_URL}/plan-trip`.
   - Triggers `LoadingScreen.jsx` with progressive status messages (*Planning your itinerary...*, *Checking travel conditions...*, *Balancing your budget...*, *Personalizing recommendations...*).
3. **Trip Context (`TripContext.jsx`)**:
   - On response receipt, normalizes and stores the structured JSON trip object.
   - Redirects to `/dashboard`.
4. **Dashboard (`Dashboard.jsx`)**:
   - Renders a responsive grid (`ml-0 lg:ml-72`) with mobile slide-out drawer sidebar.
   - Visualizes the full journey through specialized presentation components:
     - `DestinationBanner.jsx`: Hero visuals, duration badge, budget badge, and AI summary.
     - `WeatherCard.jsx`: Metric cards, seasonal advice, packing checklist, and safety precautions.
     - `BudgetCard.jsx`: Total budget, daily average, and proportional category progress bars.
     - `HotelCard.jsx`: Curated stays, star ratings, estimated rates, and Maps deep-links.
     - `ItineraryCard.jsx`: Vertical timeline spine across Morning, Lunch, Afternoon, Evening, and Night.
     - `MapsCard.jsx`: Google Maps Explorer for destination, daily highlights, and hotels.
     - `PdfExportCard.jsx`: Client-side formatted PDF generation and download.

---

## 3. Backend Flow

1. **FastAPI Application (`main.py`)**:
   - Initialized with metadata and dynamic CORS middleware configured via `get_allowed_origins()` in `config.py`.
   - Exposes `GET /` (health check) and `POST /plan-trip` (trip generation).
2. **Request Validation**:
   - Pydantic model `TripRequest` validates schema types (`destination: str`, `days: int`, `budget: int`, `interests: str`).
3. **Execution Pipeline**:
   - Step 1: Invokes `weather_agent(destination)` to gather forecast context, packing list, and travel precautions.
   - Step 2: Passes the destination, duration, budget, interests, and weather context into `planner_agent()`.
   - Step 3: Returns a clean, normalized JSON response adhering to the frontend API contract.

---

## 4. AI Planning Flow & Multi-Agent Architecture

The planning engine utilizes a coordinated multi-agent model powered by Google Gemini:

1. **Weather Agent (`agents/weather_agent.py`)**:
   - Analyzes regional climatic norms for the requested destination.
   - Returns structured temperature, weather conditions, packing essentials, and travel precautions.
2. **Planner Agent (`agents/planner_agent.py`)**:
   - Orchestrates the full journey, formulating a high-level summary and integrating specialized agents.
   - Enforces fallback models (`gemini-3.8-flash`, `gemini-flash-latest`, `gemini-3.5-flash`, `gemini-2.5-flash-lite`).
3. **Budget Agent (`agents/budget_agent.py`)**:
   - Divides the budget into 5 logical categories:
     - Accommodation (~35%)
     - Food & Dining (~25%)
     - Local Transportation (~15%)
     - Activities & Sightseeing (~15%)
     - Emergency / Miscellaneous (~10%)
   - Ensures sum of allocations equals 100% of the requested budget.
4. **Hotel Agent (`agents/hotel_agent.py`)**:
   - Recommends 3 real or prime-tier accommodations matched to the user's budget and interests.
   - Formats hotel name, prime area location, star rating, estimated nightly rate, and descriptive highlights.
5. **Itinerary Agent (`agents/itinerary_agent.py`)**:
   - Constructs a day-by-day plan strictly matching the requested duration.
   - Breaks each day into a cohesive 5-node timeline: Morning, Lunch, Afternoon, Evening, and Night.

---

## 5. Structured Response Contract

Every `POST /plan-trip` response conforms to the following JSON schema:

```json
{
  "destination": "Goa",
  "days": 3,
  "budget": 25000,
  "interests": "beaches, nightlife",
  "summary": "A curated 3-day journey to Goa customized for a total budget of ₹25,000...",
  "weather": {
    "temperature": "28°C",
    "condition": "Partly Cloudy",
    "best_time": "November to February is ideal for beach activities.",
    "pack": ["Cotton clothes", "Sunglasses", "Sunscreen", "Beachwear", "Sandals"],
    "precautions": ["Stay hydrated throughout the day", "Use sunscreen during afternoon sun"]
  },
  "budget_breakdown": [
    { "category": "Accommodation", "amount": 8750, "percent": "35%" },
    { "category": "Food & Dining", "amount": 6250, "percent": "25%" },
    { "category": "Local Transport", "amount": 3750, "percent": "15%" },
    { "category": "Activities & Sightseeing", "amount": 3750, "percent": "15%" },
    { "category": "Emergency & Misc", "amount": 2500, "percent": "10%" }
  ],
  "budget_plan": [ /* duplicate reference for backward compatibility */ ],
  "hotels": [
    {
      "name": "Santana Beach Resort",
      "location": "Candolim Beach, North Goa",
      "rating": "4.6",
      "price": "₹3,500/night",
      "description": "Beachfront resort with lush tropical gardens and two swimming pools."
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "North Goa Beach Vibes & Sunset at Fort Aguada",
      "cost": "₹2,500",
      "morning": "Arrive and check in at hotel. Relax at Candolim Beach...",
      "lunch": "Enjoy authentic Goan fish curry and prawn balchão at Fisherman's Wharf...",
      "afternoon": "Explore historic Fort Aguada and the scenic lighthouse...",
      "evening": "Sunset stroll along Sinquerim Beach...",
      "night": "Dinner and live music at a beach shack in Calangute..."
    }
  ]
}
```

---

## 6. Maps Flow

- **Zero-API-Key Design**: To eliminate external Google Cloud billing dependencies and API key exposure, Google Maps integration utilizes standard URL search endpoints:
  ```javascript
  https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}
  ```
- Queries automatically combine the location query with the target destination (e.g., `Fort Aguada, Goa`).
- All actions execute via `window.open(url, "_blank", "noopener,noreferrer")` to preserve user session and state.

---

## 7. PDF Generation Flow

- **Client-Side Generation**: Uses `jsPDF` entirely within the browser, avoiding server rendering bottlenecks and image transmission latency.
- **Font-Safe Currency Formatting**: Converts unicode currency symbols (`₹`) to standard ASCII (`Rs. `) to prevent character rendering artifacts in standard Helvetica.
- **Multi-Page Layout**:
  - Page 1: Dark header banner, trip parameters, live weather, packing checklist, and safety precautions.
  - Page 2+: 5-part budget breakdown table, hotel comparison cards, and full morning-to-night day timeline.
  - Automatic page height tracking (`checkNewPage()`) ensures headers and paragraphs never split awkwardly across page breaks.

---

## 8. Error & Fallback Strategy

1. **Model Fallback Pipeline**:
   - If the primary model `gemini-3.8-flash` hits quota limits or returns 429/503 status codes, the orchestrator automatically cascades down the fallback list: `gemini-flash-latest` $\rightarrow$ `gemini-3.5-flash` $\rightarrow$ `gemini-2.5-flash-lite`.
2. **Deterministic Offline Fallbacks**:
   - If the Gemini API is entirely unreachable or unconfigured, agents provide pre-verified, deterministic travel structures for top destinations so user workflows remain functional.
3. **Frontend Resilience**:
   - Catch blocks in `PlannerForm.jsx` provide inline error alerts with a single-click "Retry" action, without freezing or crashing the application.
   - Null-safe prop handling across cards ensures missing or partial attributes render clean placeholders rather than throwing runtime errors.

---

## 9. Environment & Security Model

- **Secret Isolation**:
  - `GEMINI_API_KEY` is loaded exclusively by the Python backend via `python-dotenv`.
  - Vite frontend bundle contains zero secrets and only consumes public variables (`VITE_API_URL`).
- **Production CORS**:
  - Backend restricts cross-origin resource sharing to trusted development origins (`localhost:5173`, `localhost:3000`) and the configured production frontend domain (`FRONTEND_ORIGIN`).
- **Repository Safety**:
  - `.gitignore` rigorously ignores `.env`, `.env.*`, `venv/`, and `dist/`.
  - Safe `.env.example` templates guide deployment configuration.
