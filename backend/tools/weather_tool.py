import requests

def get_weather(city):
    url = f"https://wttr.in/{city}?format=j1"

    response = requests.get(url)
    data = response.json()

    current = data["current_condition"][0]

    return {
        "temperature": current["temp_C"],
        "condition": current["weatherDesc"][0]["value"],
        "humidity": current["humidity"],
        "wind": current["windspeedKmph"],
    }