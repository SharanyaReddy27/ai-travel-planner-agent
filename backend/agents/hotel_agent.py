import google.generativeai as genai
from config import GEMINI_API_KEY
from tools.hotel_tool import get_hotels

genai.configure(api_key=GEMINI_API_KEY)


model = genai.GenerativeModel("gemini-3.8-flash")

def hotel_agent(destination, budget):
    hotels = get_hotels(destination)

    hotel_list = "\n".join(
        [f"- {hotel['name']}" for hotel in hotels]
    )

    prompt = f"""
    You are a hotel recommendation assistant.

    Destination: {destination}

    Budget: ₹{budget}

    Available Hotels:
    {hotel_list}

    Recommend the best 3 hotels.

    Mention:

    Hotel name

    Why it's good

    Ideal budget category (Budget / Mid-range / Luxury).
    """

    response = model.generate_content(prompt)

    return response.text