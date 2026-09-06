import google.generativeai as genai
from config import GEMINI_API_KEY
from tools.weather_tool import get_weather

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-3.5-flash-lite")


def weather_agent(destination):
    # Get live weather
    weather = get_weather(destination)

    # Extract weather information
    temperature = weather["temperature"]
    condition = weather["condition"]

    prompt = f"""
You are a travel weather advisor.

Give travel advice for {destination} based ONLY on the weather data provided below.

Weather data:
Temperature: {temperature}°C
Condition: {condition}

Return the answer EXACTLY in this format:

Travel Weather Advice for {destination}

Temperature: {temperature}°C
Condition: {condition}

✔ Good time to travel.

Pack:
• Cotton clothes
• Sunglasses
• Sunscreen

Precautions:
Carry water and avoid afternoon heat.

IMPORTANT RULES:
- Do not add any extra introduction.
- Do not add numbered sections.
- Do not use Markdown bold.
- Do not change the temperature.
- Do not change the weather condition.
- Do not invent weather information.
- Keep the headings exactly as shown.
- Use "✔ Good time to travel." when the weather is suitable.
- If the weather is not suitable, use "✘ Not a good time to travel." instead.
"""

    response = model.generate_content(prompt)

    return response.text