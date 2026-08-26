import google.generativeai as genai
from config import GEMINI_API_KEY

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Load model
model = genai.GenerativeModel("gemini-3.6-flash")


def planner_agent(destination, days, budget, interests):
    prompt = f"""
    You are an expert AI Travel Planner.

    Plan a trip with the following details:

    Destination: {destination}
    Number of Days: {days}
    Budget: ₹{budget}
    Interests: {interests}

    Return the response in this format:

    ## Trip Summary

    ## Estimated Budget Breakdown

    ## Best Time to Visit

    ## Top Places to Visit

    ## Suggested Foods

    ## Day-wise Itinerary
    Day 1:
    Day 2:
    Day 3:

    Keep the response practical and within budget.
    """

    response = model.generate_content(prompt)

    return response.text