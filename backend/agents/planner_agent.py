import json
import re
import os
import google.generativeai as genai
from config import GEMINI_API_KEY

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-3.8-flash")


def extract_json(text: str) -> dict:
    """Safely extracts and parses JSON dictionary from model response text."""
    if not text:
        return {}
    
    cleaned = text.strip()
    # Remove markdown code fences if present
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)
        cleaned = cleaned.strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Try finding the outer JSON object boundaries
        match = re.search(r"(\{[\s\S]*\})", cleaned)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                pass
    return {}


def planner_agent(destination: str, days: int, budget: int, interests: str, weather: str = "") -> dict:
    prompt = f"""
You are an expert AI Travel Planner.
Create a realistic and complete {days}-day travel plan for {destination}.
Total Budget: ₹{budget} INR.
User Interests: {interests}
Live Weather Context: {weather}

Return ONLY valid JSON matching this exact structure:
{{
  "summary": "2-3 sentence overview of the trip experience and highlights.",
  "weather": {{
    "temperature": "28°C",
    "condition": "Sunny",
    "best_time": "Great time to travel.",
    "pack": [
      "Cotton clothes",
      "Sunglasses",
      "Sunscreen"
    ],
    "precautions": [
      "Stay hydrated during daytime.",
      "Carry light cotton wear."
    ]
  }},
  "budget_breakdown": [
    {{"category": "Accommodation", "amount": {int(budget * 0.35)}, "percentage": 35}},
    {{"category": "Food & Dining", "amount": {int(budget * 0.25)}, "percentage": 25}},
    {{"category": "Local Transport", "amount": {int(budget * 0.15)}, "percentage": 15}},
    {{"category": "Activities & Entry Fees", "amount": {int(budget * 0.15)}, "percentage": 15}},
    {{"category": "Emergency & Misc", "amount": {int(budget * 0.10)}, "percentage": 10}}
  ],
  "hotels": [
    {{
      "name": "Grand Stay Resort",
      "location": "{destination} Central",
      "price": "₹3,500/night",
      "rating": 4.5,
      "description": "Comfortable stay with modern amenities and great access to attractions."
    }},
    {{
      "name": "Heritage Boutique Hotel",
      "location": "{destination} Old Town",
      "price": "₹2,800/night",
      "rating": 4.3,
      "description": "Charming ambiance close to local cafes and cultural sights."
    }},
    {{
      "name": "Scenic View Retreat",
      "location": "{destination} Riverside/Beachside",
      "price": "₹4,200/night",
      "rating": 4.7,
      "description": "Relaxing atmosphere with stunning views and pool."
    }}
  ],
  "itinerary": [
    {{
      "day": 1,
      "title": "Arrival & Initial Exploration",
      "morning": "Arrival, hotel check-in, and freshen up.",
      "lunch": "Enjoy authentic local cuisine at a recommended nearby restaurant.",
      "afternoon": "Visit key popular landmark or scenic spot.",
      "evening": "Stroll around local market or sunset point.",
      "night": "Dinner at a vibrant cafe or local food street.",
      "cost": "₹{int(budget / days)}"
    }}
  ]
}}

Rules:
1. Provide exactly {days} day entries in the "itinerary" array (day 1 to day {days}).
2. Ensure realistic hotel names and activities tailored specifically to {destination} and interests: {interests}.
3. The sum of budget breakdown amounts must roughly equal total budget ₹{budget}.
4. Return pure JSON only.
"""

    for model_name in ["gemini-3.8-flash", "gemini-2.5-pro"]:
        try:
            m = genai.GenerativeModel(model_name)
            response = m.generate_content(prompt)
            parsed = extract_json(response.text)
            if isinstance(parsed, dict) and parsed:
                return parsed
        except Exception as e:
            print(f"Error generating with {model_name}: {e}")

    # Fallback default structure to guarantee reliability
    return {
        "summary": f"A wonderful {days}-day trip to {destination} tailored to your budget of ₹{budget:,} and interests in {interests}.",
        "weather": {
            "temperature": "27°C",
            "condition": "Pleasant",
            "best_time": "Great time to travel.",
            "pack": ["Comfortable clothing", "Sunglasses", "Sunscreen", "Walking shoes"],
            "precautions": ["Stay hydrated", "Keep emergency contacts handy"]
        },
        "budget_breakdown": [
            {"category": "Accommodation", "amount": int(budget * 0.35), "percentage": 35},
            {"category": "Food & Dining", "amount": int(budget * 0.25), "percentage": 25},
            {"category": "Local Transport", "amount": int(budget * 0.15), "percentage": 15},
            {"category": "Activities & Entry", "amount": int(budget * 0.15), "percentage": 15},
            {"category": "Emergency Fund", "amount": int(budget * 0.10), "percentage": 10}
        ],
        "hotels": [
            {
                "name": f"{destination} Grand Hotel",
                "location": f"Central {destination}",
                "price": f"₹{int(budget * 0.35 / max(days, 1)):,}/night",
                "rating": 4.6,
                "description": f"Prime location in {destination} with great amenities and breakfast."
            },
            {
                "name": f"{destination} Boutique Stay",
                "location": f"Near main attractions in {destination}",
                "price": f"₹{int(budget * 0.25 / max(days, 1)):,}/night",
                "rating": 4.4,
                "description": "Cozy, charming stay with excellent hospitality and local vibes."
            }
        ],
        "itinerary": [
            {
                "day": i,
                "title": f"Exploring {destination} - Day {i}",
                "morning": f"Morning sightseeing around top spots in {destination}.",
                "lunch": f"Taste local specialties at a top-rated restaurant.",
                "afternoon": f"Engage in activities aligned with {interests}.",
                "evening": f"Evening leisure, shopping and sunset viewing.",
                "night": f"Dinner and relaxing evening experience.",
                "cost": f"₹{int(budget / days):,}"
            }
            for i in range(1, days + 1)
        ]
    }