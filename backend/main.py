from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging

from agents.weather_agent import weather_agent
from agents.planner_agent import planner_agent

# ---------------- FastAPI ----------------

app = FastAPI(title="AI Travel Planner")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
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
        # Weather context
        weather_text = weather_agent(request.destination)

        # AI Planner generating full structured itinerary
        trip = planner_agent(
            request.destination,
            request.days,
            request.budget,
            request.interests,
            weather_text,
        )

        if not isinstance(trip, dict):
            raise ValueError("Planner agent failed to return a structured trip dictionary.")

        # Structured response conforming to frontend expectations
        weather_data = trip.get("weather") or {
            "temperature": "28°C",
            "condition": "Pleasant",
            "best_time": "Good time to travel.",
            "pack": ["Cotton clothes", "Sunglasses", "Sunscreen"],
            "precautions": ["Stay hydrated throughout the day."]
        }

        budget_data = trip.get("budget_breakdown") or trip.get("budget_plan") or []

        return {
            "destination": request.destination,
            "days": request.days,
            "budget": request.budget,
            "interests": request.interests,
            "summary": trip.get("summary", f"A customized {request.days}-day trip to {request.destination}."),
            "weather": weather_data,
            "budget_breakdown": budget_data,
            "budget_plan": budget_data,
            "hotels": trip.get("hotels", []),
            "itinerary": trip.get("itinerary", []),
        }

    except Exception as e:
        logging.error(f"Error generating trip plan: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))