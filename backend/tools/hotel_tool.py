import requests

def get_hotels(city):
    url = "https://nominatim.openstreetmap.org/search"

    params = {
        "q": f"hotels in {city}",
        "format": "json",
        "limit": 5
    }

    headers = {
        "User-Agent": "AI-Travel-Planner/1.0"
    }

    response = requests.get(url, params=params, headers=headers)

    data = response.json()

    hotels = []

    for hotel in data:
        hotels.append({
            "name": hotel.get("display_name", "Unknown"),
            "latitude": hotel.get("lat"),
            "longitude": hotel.get("lon")
        })

    return hotels