import google.generativeai as genai
from config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-3.8-flash")


def budget_agent(destination, days, budget):
    prompt = f"""
    You are a travel budget planner.

    Destination: {destination}

    Days: {days}

    Total Budget: ₹{budget}

    Divide budget into:

    Accommodation

    Food

    Transport

    Attractions

    Emergency Fund

    Shopping

    Show amounts in Indian Rupees.

    Return in markdown table.
    """

    response = model.generate_content(prompt)

    return response.text