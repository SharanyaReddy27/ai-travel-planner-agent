# 🌿 ROAMLY — AI Travel Planner

### Your trip, thoughtfully planned.

ROAMLY is an AI-powered travel planning application that transforms a few trip preferences into a structured, personalized travel experience.

Enter your **destination, travel duration, budget, and interests**, and ROAMLY generates a complete travel plan with a day-wise itinerary, budget allocation, weather guidance, accommodation suggestions, map exploration, and a downloadable travel guide.

🔗 **Live Demo:** https://ai-travel-planner-agent-sigma.vercel.app/  
📦 **GitHub:** https://github.com/SharanyaReddy27/ai-travel-planner-agent  
⚡ **Backend API:** https://roamly-backend-odow.onrender.com/docs

---

## ✨ What ROAMLY Can Do

- 🧭 **Personalized Itineraries** — Generates day-wise plans based on destination, duration, budget, and interests.
- 💰 **Smart Budget Planning** — Breaks the total budget into accommodation, food, transport, activities, and other expenses.
- 🌦️ **Weather Guidance** — Provides destination-aware weather information, packing suggestions, and travel precautions.
- 🏨 **Stay Suggestions** — Generates accommodation recommendations with estimated pricing based on the trip budget.
- 🗺️ **Map Exploration** — Quickly explore recommended destinations and stays through Google Maps.
- 📄 **Travel Guide Export** — Converts the generated trip into a downloadable PDF travel guide.
- 📱 **Responsive Experience** — Designed to work across desktop and mobile devices.
- 🤖 **AI Fallback System** — Uses model fallback handling to improve reliability when a Gemini model is unavailable.

---

## 🧠 How It Works

```text
                    TRIP PREFERENCES
                           │
                           ▼
                  ┌─────────────────┐
                  │  React Frontend │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  FastAPI Backend│
                  └────────┬────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ AI Planning Workflow│
                │   + Gemini Models   │
                └──────────┬──────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
      Itinerary         Budget           Weather
          │                │                │
          └────────────────┼────────────────┘
                           ▼
                 ┌──────────────────┐
                 │ Structured Trip  │
                 │      Plan        │
                 └────────┬─────────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
           Dashboard     Maps        PDF
🛠️ Tech Stack
Frontend
React
Vite
JavaScript
React Router
Tailwind CSS
Lucide React
jsPDF
Backend
Python
FastAPI
Uvicorn
Pydantic
AI
Google Gemini
LangGraph-style planning workflow
Structured JSON generation
Model fallback handling
Integrations & Deployment
Google Maps
Vercel
Render
📁 Project Structure
ai-travel-planner-agent/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── agents/
│   ├── tools/
│   ├── main.py
│   ├── config.py
│   └── requirements.txt
│
├── docs/
├── render.yaml
└── README.md
🚀 Run Locally
1. Clone the repository
git clone https://github.com/SharanyaReddy27/ai-travel-planner-agent.git
cd ai-travel-planner-agent
2. Start the backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
3. Start the frontend

Open another terminal:

cd frontend
npm install
npm run dev

The application will be available at:

http://localhost:5173
🔐 Environment Variables
Backend .env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_gemini_model
FRONTEND_ORIGIN=http://localhost:5173
Frontend .env
VITE_API_URL=http://localhost:8000
🔌 API
POST /plan-trip

Generates a personalized travel plan using:

Destination
Number of days
Budget
Interests
GET /

Basic backend status endpoint.

API documentation:

https://roamly-backend-odow.onrender.com/docs

☁️ Deployment
Component	Platform
Frontend	Vercel
Backend	Render
AI	Google Gemini
Maps	Google Maps

The production application is deployed and accessible through the live demo above.

⚠️ Current Limitations

ROAMLY is designed as an AI travel-planning project rather than a booking platform.

Accommodation details and prices are AI-generated estimates.
Google Maps uses search/deep links instead of a full Maps API integration.
AI output depends on Gemini model availability and API quotas.
PDF generation happens on the client side.
🔮 Future Improvements
Live hotel availability and booking integration
Real-time weather and forecast APIs
User authentication and saved trips
Collaborative trip planning
Multi-currency support
Advanced multi-agent travel workflows
Flight and transportation recommendations
Expense tracking during the trip
👩‍💻 Author

Sharanya Reddy

B.Tech CSE — Data Science
VNR Vignana Jyothi Institute of Engineering and Technology

🔗 GitHub: https://github.com/SharanyaReddy27
🔗 LinkedIn: https://linkedin.com/in/guda-sharanya-reddy-55283433b/

📄 License

This project is licensed under the MIT License.
