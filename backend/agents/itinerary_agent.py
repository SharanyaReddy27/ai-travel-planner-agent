import google.generativeai as genai
from config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-3.8-flash")


def itinerary_agent(
    destination,
    days,
    interests,
    weather_info,
    budget_info,
    hotel_info
):

    prompt = f"""
    You are an AI itinerary expert.

    Destination: {destination}
    Days: {days}
    Interests: {interests}

    Weather Advice:
    {weather_info}

    Budget Plan:
    {budget_info}

    Hotel Recommendations:
    {hotel_info}

    Create a beautiful itinerary.

    For every day include:

    Morning activity

    Lunch place

    Afternoon activity

    Evening activity

    Estimated expense for that day

    Keep total expenses within budget.
    """

    response = model.generate_content(prompt)

    return response.text