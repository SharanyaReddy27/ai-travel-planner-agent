from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agents.weather_agent import weather_agent
from agents.planner_agent import planner_agent

# Create FastAPI app
app = FastAPI(title="AI Travel Planner")

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request model
class TripRequest(BaseModel):
    destination: str
    days: int
    budget: int
    interests: str


# Health check
@app.get("/")
def home():
    return {"message": "AI Travel Planner Backend Running 🚀"}


# Generate trip
@app.post("/plan-trip")
def plan_trip(request: TripRequest):
    try:
        weather = weather_agent(request.destination)

        itinerary = planner_agent(
            request.destination,
            request.days,
            request.budget,
            request.interests,
            weather
        )

        return {
    "destination": destination,
    "days": days,
    "budget": budget,
    "interests": interests,

    "summary": itinerary["summary"],

    "weather": itinerary["weather"],

    "budget_breakdown": itinerary["budget_breakdown"],

    "hotels": itinerary["hotels"],

    "itinerary": itinerary["itinerary"]
}

    except Exception as e:
        return {"error": str(e)}