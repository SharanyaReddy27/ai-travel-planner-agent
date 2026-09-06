import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-3.5-flash")


def planner_agent(destination, days, budget, interests, weather):

    return f'''
You are an AI Travel Planner.
Return ONLY valid JSON.

Create a realistic {days}-day trip for {destination}.
Budget: ₹{budget}
Interests: {interests}

JSON format:
{{
  "summary":"2 sentence overview",

  "weather":{{
      "temperature":"26°C",
      "condition":"Light Rain",
      "bestTime":"Good time to travel",
      "packing":["Cotton clothes","Sunglasses","Sunscreen"],
      "precautions":[
          "Carry water.",
          "Avoid afternoon heat.",
          "Keep a light raincoat."
      ]
  }},

  "budget_breakdown":[
    {{"category":"Accommodation","amount":6000,"percentage":30}},
    {{"category":"Food","amount":5000,"percentage":25}},
    {{"category":"Transport","amount":3000,"percentage":15}},
    {{"category":"Activities","amount":2500,"percentage":12}},
    {{"category":"Shopping","amount":2000,"percentage":10}},
    {{"category":"Emergency","amount":1500,"percentage":8}}
  ],

  "hotels":[
    {{
      "name":"Santana Beach Resort",
      "location":"Candolim, Goa",
      "price":"₹3500/night",
      "rating":4.5,
      "description":"Beachfront stay with pool and breakfast included."
    }},
    {{
      "name":"Ginger Goa",
      "location":"Panjim",
      "price":"₹2800/night",
      "rating":4.2,
      "description":"Modern budget hotel near city attractions."
    }},
    {{
      "name":"The Flora Grand",
      "location":"Candolim",
      "price":"₹4200/night",
      "rating":4.6,
      "description":"Luxury stay close to nightlife."
    }}
  ],

  "itinerary":[
    {{
      "day":1,
      "title":"Arrival & Beach Sunset",
      "morning":"Check-in and explore Candolim Beach.",
      "lunch":"Pousada by the Beach.",
      "afternoon":"Fort Aguada sightseeing.",
      "evening":"Sunset at Baga Beach.",
      "night":"Tito's Lane nightlife.",
      "cost":"₹3200"
    }}
  ]
}}

Rules:
- Return EXACTLY {days} itinerary objects.
- Return ONLY JSON.
- No markdown.
- No tables.
- No explanations.
'''

    response = model.generate_content(prompt)

    return response.text