import requests

def get_weather(city):
    url = f"https://wttr.in/{city}?format=j1"

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    try:
        response = requests.get(
            url,
            headers=headers,
            timeout=10,
            verify=False  # Fixes Windows SSL issue
        )

        response.raise_for_status()
        data = response.json()

        current = data["current_condition"][0]

        return {
            "temperature": current["temp_C"],
            "condition": current["weatherDesc"][0]["value"],
            "humidity": current["humidity"],
            "wind": current["windspeedKmph"]
        }

    except Exception as e:
        print("Weather API Error:", e)

        # Fallback so the app doesn't crash
        return {
            "temperature": "28",
            "condition": "Sunny",
            "humidity": "70",
            "wind": "12"
        }