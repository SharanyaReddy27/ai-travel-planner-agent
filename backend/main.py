from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from graph.travel_graph import travel_graph

app = FastAPI(title="AI Travel Planner")

# ✅ CORS goes here (outside any class)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TripRequest(BaseModel):
    destination: str
    days: int
    budget: int
    interests: str


@app.get("/")
def home():
    return {"message": "AI Travel Planner Backend Running"}


@app.post("/plan-trip")
def plan_trip(data: TripRequest):
    try:
        state = {
            "destination": data.destination,
            "days": data.days,
            "budget": data.budget,
            "interests": data.interests,
            "weather": "",
            "budget_plan": "",
            "hotels": "",
            "itinerary": "",
        }

        result = travel_graph.invoke(state)

        return result

    except Exception as e:
        import traceback
        traceback.print_exc()          # prints full error in terminal
        return {"error": str(e)}       # sends error to React