from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agents.weather_agent import weather_agent
from agents.planner_agent import planner_agent

# ---------------- FastAPI ----------------

app = FastAPI(title="AI Travel Planner")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Request Model ----------------

class TripRequest(BaseModel):
    destination: str
    days: int
    budget: int
    interests: str


# ---------------- Health Check ----------------

@app.get("/")
def home():
    return {"message": "AI Travel Planner Backend Running 🚀"}


# ---------------- Generate Trip ----------------

@app.post("/plan-trip")
def plan_trip(request: TripRequest):
    try:
        # Weather
        weather = weather_agent(request.destination)

        # AI Planner
        trip = planner_agent(
            request.destination,
            request.days,
            request.budget,
            request.interests,
            weather,
        )

        # Send complete trip object to frontend
        return {
            "destination": request.destination,
            "days": request.days,
            "budget": request.budget,
            "interests": request.interests,
            "weather": weather,
            "summary": trip.get("summary", ""),
            "budget_breakdown": trip.get("budget_breakdown", []),
            "hotels": trip.get("hotels", []),
            "itinerary": trip.get("itinerary", []),
        }

    except Exception as e:
        return {"error": str(e)}