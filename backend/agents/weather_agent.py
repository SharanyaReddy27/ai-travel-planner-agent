import google.generativeai as genai
from config import GEMINI_API_KEY, GEMINI_MODEL
from tools.weather_tool import get_weather

if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY, transport="rest")
    except Exception:
        pass


def _get_climate_pack_and_precautions(temp_val: float, condition: str):
    cond_lower = condition.lower()
    is_rain = any(w in cond_lower for w in ["rain", "drizzle", "shower", "thunder"])

    if is_rain:
        pack = ["Waterproof rain jacket", "Quick-dry clothes", "Compact umbrella", "Anti-skid shoes"]
        precautions = ["Keep electronics in waterproof pouches", "Check local road conditions", "Carry an umbrella"]
    elif temp_val < 18:
        pack = ["Thermal inners", "Warm fleece jacket", "Woolen socks & gloves", "Lip balm & moisturizer", "Sturdy walking shoes"]
        precautions = ["Layer up against cold evening winds", "Stay hydrated in dry mountain air", "Carry warm headwear"]
    elif temp_val > 30:
        pack = ["Lightweight cottons", "UV-protection sunglasses", "SPF 50+ Sunscreen", "Wide-brim hat", "Comfortable sandals"]
        precautions = ["Drink plenty of water and electrolytes", "Limit continuous outdoor exposure between 12-3 PM", "Use sunscreen regularly"]
    else:
        pack = ["Breathable cotton clothes", "Light evening layer/jacket", "Sunglasses & sunscreen", "Comfortable walking shoes"]
        precautions = ["Stay hydrated throughout the day", "Wear comfortable shoes for walking tours", "Keep emergency contacts handy"]

    suitability = "Good time to travel." if not is_rain else "Travel possible with rain gear."
    return pack, precautions, suitability


def weather_agent(destination: str) -> str:
    # 1. Fetch live weather
    weather = get_weather(destination)
    temp_str = str(weather.get("temperature", "28"))
    condition = str(weather.get("condition", "Pleasant"))

    try:
        temp_val = float(temp_str)
    except ValueError:
        temp_val = 25.0

    pack_items, precautions, suitability = _get_climate_pack_and_precautions(temp_val, condition)

    # 2. Try Gemini generation with prompt (bounded by 3s timeout to avoid quota wait)
    if GEMINI_API_KEY:
        try:
            import concurrent.futures
            model = genai.GenerativeModel(GEMINI_MODEL)
            prompt = f"""
You are an expert travel weather advisor.
Give destination-specific travel advice for {destination} based strictly on this live weather:
Temperature: {temp_str}°C
Condition: {condition}

Return the answer EXACTLY in this format:

Travel Weather Advice for {destination}

Temperature: {temp_str}°C
Condition: {condition}

✔ {suitability}

Pack:
{chr(10).join(f"• {item}" for item in pack_items)}

Precautions:
{chr(10).join(precautions)}
"""
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(model.generate_content, prompt)
                response = future.result(timeout=3.0)

            if response and response.text:
                return response.text.strip()
        except Exception:
            pass


    # 3. Dynamic Climate-Aware Fallback
    pack_formatted = "\n".join([f"• {item}" for item in pack_items])
    precautions_formatted = "\n".join(precautions)

    return (
        f"Travel Weather Advice for {destination}\n\n"
        f"Temperature: {temp_str}°C\n"
        f"Condition: {condition}\n\n"
        f"✔ {suitability}\n\n"
        f"Pack:\n{pack_formatted}\n\n"
        f"Precautions:\n{precautions_formatted}"
    )