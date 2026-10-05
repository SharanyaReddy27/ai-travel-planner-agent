import json
import re
import os
import logging
from typing import Dict, Any, List
import google.generativeai as genai
from config import GEMINI_API_KEY, GEMINI_MODEL, FALLBACK_MODELS

# Configure Gemini API if key is available
if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY, transport="rest")
    except Exception as e:
        logging.warning(f"Could not configure genai with rest transport: {e}")

# ==============================================================================
# Curated Destination Knowledge Base
# Provides realistic, destination-specific itinerary activities, iconic food spots,
# and budget-scaled stays for top travel destinations.
# ==============================================================================

DESTINATION_KNOWLEDGE = {
    "goa": {
        "title": "Goa Coastal & Heritage Getaway",
        "description": "A vibrant blend of sun-kissed Arabian Sea beaches, Portuguese colonial architecture, fresh seafood, and lively night markets.",
        "best_time": "November to February is the peak season with pleasant coastal breezes.",
        "food_highlights": ["Goan Fish Curry Thali", "Prawn Balchao with Poi", "Bebinca", "Chicken Xacuti", "Cashew Feni / Kokum Juice"],
        "hotels": {
            "budget": [
                {"name": "Zostel Goa (Calangute / Morjim)", "location": "North Goa", "rating": 4.6, "description": "Lively backpacker stay close to the beach with social community vibes."},
                {"name": "Old Quarter Heritage Hostel", "location": "Fontainhas, Panjim", "rating": 4.5, "description": "Charming heritage guesthouse nestled in colorful Portuguese alleys."},
                {"name": "Sea Breeze Village", "location": "Candolim Beach Road", "rating": 4.3, "description": "Cozy value resort with pool, walking distance to Candolim shore."}
            ],
            "mid": [
                {"name": "Santana Beach Resort", "location": "Candolim Beach", "rating": 4.6, "description": "Beachfront resort amidst lush tropical gardens with direct beach access."},
                {"name": "Heritage Village Resort & Spa", "location": "Arossim, South Goa", "rating": 4.7, "description": "Colonial-style architecture with serene beach walks and spa facilities."},
                {"name": "Fairfield by Marriott Goa", "location": "Benaulim / Calangute", "rating": 4.5, "description": "Modern comfortable stay with reliable amenities near top coastal hubs."}
            ]
        },
        "days": [
            {
                "title": "North Goa Beach Vibes & Sunset at Aguada",
                "morning": "Arrive and check in. Stroll along Calangute or Candolim Beach enjoying refreshing coconut water.",
                "lunch": "Enjoy an authentic Goan fish curry thali with fried kingfish at Souza Lobo or a seaside shack.",
                "afternoon": "Explore historic Fort Aguada and its 17th-century Portuguese lighthouse with panoramic sea views.",
                "evening": "Witness a golden sunset at Baga Beach, followed by an evening walk along the bustling beach shacks.",
                "night": "Dinner and vibrant coastal nightlife along Tito's Lane or relaxing acoustic beach shack vibes."
            },
            {
                "title": "Fontainhas Latin Quarter & Chapora Fort Sunset",
                "morning": "Heritage walk through Fontainhas (Panjim), photographing pastel Portuguese villas and azulejos tiles.",
                "lunch": "Savor traditional Goan delicacies like Chicken Xacuti and Bebinca at Viva Panjim or Mum's Kitchen.",
                "afternoon": "Hike up to Chapora Fort (the iconic 'Dil Chahta Hai' viewpoint) overlooking the sweeping Vagator coastline.",
                "evening": "Sunset at Vagator Beach or cliffside views from Ozran (Little Vagator).",
                "night": "Dinner at a vibrant garden cafe in Anjuna/Vagator with live acoustic music and seafood grills."
            },
            {
                "title": "South Goa Tranquility, Palolem & Departure",
                "morning": "Journey to scenic South Goa. Relax on the crescent-shaped shores of Palolem or Colva Beach.",
                "lunch": "Feast on butter garlic prawns and Goan crab curry at the famous Martin's Corner in Betalbatim.",
                "afternoon": "Shop for Goan cashews, homemade chocolates, and spices at Margao Municipal Market.",
                "evening": "Peaceful sunset stroll at Miramar Beach or Dona Paula viewpoint before heading to the airport/station.",
                "night": "Farewell dinner tasting local Goan desserts (Dodol/Bebinca) before departure."
            },
            {
                "title": "Divar Island Heritage & Spice Plantation Excursion",
                "morning": "Scenic ferry ride to Divar Island. Cycle through scenic paddy fields and ancient church ruins.",
                "lunch": "Traditional Goan feast served on banana leaves at Sahakari Spice Farm.",
                "afternoon": "Guided walk through spice plantations learning about cardamom, vanilla, and peri-peri chilies.",
                "evening": "Sunset Mandovi River cruise with traditional Goan folk performances.",
                "night": "Relaxed dinner at a waterfront riverside bistro in Panjim."
            }
        ]
    },
    "hyderabad": {
        "title": "Hyderabad Nizam Heritage & Culinary Journey",
        "description": "The City of Pearls, where grand Qutb Shahi and Asaf Jahi monuments meet world-famous Hyderabadi Dum Biryani and historic bazaars.",
        "best_time": "October to March is ideal with comfortable, cool sightseeing weather.",
        "food_highlights": ["Hyderabadi Mutton Dum Biryani", "Irani Chai with Osmania Biscuits", "Pathar ka Gosht", "Mirchi ka Salan", "Double ka Meetha"],
        "hotels": {
            "budget": [
                {"name": "Hotel Rainbow International", "location": "Near Charminar, Old City", "rating": 4.4, "description": "Convenient budget hotel within walking distance of historic monuments and street food."},
                {"name": "Bunkingdos City Hostel", "location": "Banjara Hills", "rating": 4.6, "description": "Vibrant, clean backpacker hub close to top cafes and dining streets."},
                {"name": "Treebo Trend Hyderabad Central", "location": "Lakdikapul", "rating": 4.3, "description": "Centrally located with easy metro access to both Old City and HITEC City."}
            ],
            "mid": [
                {"name": "Mercure Hyderabad KCP", "location": "Somajiguda", "rating": 4.6, "description": "Contemporary upscale comfort overlooking Hussain Sagar Lake with great dining."},
                {"name": "Lemon Tree Premier", "location": "HITEC City", "rating": 4.5, "description": "Modern amenities, spacious rooms, and central to the city's lively restaurant hubs."},
                {"name": "The Park Hyderabad", "location": "Somajiguda", "rating": 4.4, "description": "Design-focused luxury hotel with stunning lake views and iconic Hyderabadi restaurants."}
            ]
        },
        "days": [
            {
                "title": "Historic Old City, Charminar & Iconic Nizam Cuisine",
                "morning": "Arrive and check in. Visit the iconic 16th-century Charminar and the monumental Mecca Masjid.",
                "lunch": "Savor world-famous Hyderabadi Dum Biryani with mirchi ka salan at Hotel Shadab or Grand Hotel.",
                "afternoon": "Tour the vast Salar Jung Museum, marveling at the Veiled Rebecca and the 19th-century musical clock.",
                "evening": "Browse shimmering lacquer bangles and pearls in the historic lanes of Laad Bazaar.",
                "night": "Enjoy freshly brewed Irani Chai paired with Osmania biscuits at iconic Nimrah Cafe overlooking Charminar."
            },
            {
                "title": "Golconda Fortress Whispers & Hussain Sagar Sunset",
                "morning": "Guided morning exploration of the formidable Golconda Fort, testing its legendary acoustic whispering arches.",
                "lunch": "Authentic regional lunch featuring Guntur idlis and South Indian thali at Chutneys or Paradise Biryani.",
                "afternoon": "Visit the majestic domed Qutb Shahi Tombs and the hilltop white marble Birla Mandir.",
                "evening": "Sunset boat ride across Hussain Sagar Lake to the monolithic Buddha statue in the middle of the lake.",
                "night": "Stroll down scenic Necklace Road followed by dinner featuring aromatic kebabs and Double Ka Meetha."
            },
            {
                "title": "Chowmahalla Palace Splendor & Shilparamam Crafts",
                "morning": "Walk through the royal courtyards, Belgian crystal chandeliers, and vintage car collection of Chowmahalla Palace.",
                "lunch": "Taste authentic Hyderabadi Haleem and Pathar ka Gosht at a heritage Mughlai restaurant.",
                "afternoon": "Explore Shilparamam Arts & Crafts Village, discovering handmade textiles, pottery, and brassware.",
                "evening": "Sunset coffee and bakery shopping for famous Karachi Bakery fruit biscuits and dilkhush.",
                "night": "Farewell dinner in Jubilee Hills savoring Telangana regional curries before departure."
            }
        ]
    },
    "manali": {
        "title": "Manali Alpine Escape & Mountain Adventure",
        "description": "A picturesque Himalayan valley surrounded by snow-dusted peaks, cedar forests, bubbling rivers, and high-altitude mountain passes.",
        "best_time": "October to June (summer for mountain trails & winters for snow activities).",
        "food_highlights": ["Himachali Siddu with Ghee", "Fresh Himalayan River Trout", "Tibetan Thukpa & Momos", "Pahadi Rajma Chawal", "Spiced Apple Cider"],
        "hotels": {
            "budget": [
                {"name": "The Hosteller Old Manali", "location": "Old Manali Village", "rating": 4.6, "description": "Backpacker paradise set amid apple orchards with lively social common rooms."},
                {"name": "Apple View Riverside Guesthouse", "location": "Near Clubhouse, Old Manali", "rating": 4.4, "description": "Cozy wooden mountain stay with sweeping valley views and home-cooked food."},
                {"name": "Zostel Manali (Burwa / Old Manali)", "location": "Old Manali", "rating": 4.7, "description": "High-rated mountain hostel with bonfire nights and views of the Pir Panjal range."}
            ],
            "mid": [
                {"name": "Snow Valley Resorts", "location": "Log Huts Area", "rating": 4.6, "description": "Charming pine-clad mountain resort with snow peak balconies and buffet dining."},
                {"name": "The Himalayan Resort & Spa", "location": "Hadimba Road", "rating": 4.8, "description": "Victorian gothic castle-style stay with heated outdoor pool and mountain vistas."},
                {"name": "Larisa Resort", "location": "Haripur, Kullu-Manali", "rating": 4.7, "description": "Lush boutique cottages with private orchards and organic farm-to-table cuisine."}
            ]
        },
        "days": [
            {
                "title": "Old Manali Vibe, Cedar Forests & Hadimba Temple",
                "morning": "Arrive via mountain highway. Check in and take an acclimatization walk through Old Manali's pine woods.",
                "lunch": "Dine beside the roaring Manalsu river at Cafe 1947, enjoying wood-fired pizza and fresh mountain trout.",
                "afternoon": "Visit the 16th-century wooden Hadimba Devi Temple surrounded by giant deodars, followed by Vashisht Hot Springs.",
                "evening": "Leisurely stroll down Mall Road; browse Tibetan handicrafts, woolen pashmina shawls, and fresh apple cider.",
                "night": "Warm up with steamed Himachali Siddu with pure ghee and hot thukpa at Dylan's Toasted & Roasted cafe."
            },
            {
                "title": "Solang Valley Thrills & High-Altitude Adventure",
                "morning": "Drive to Solang Valley. Enjoy adrenaline adventures like paragliding, zorbing, or scenic ropeway cable car rides.",
                "lunch": "Savor piping hot Maggi and Pahadi Rajma Chawal at an alpine mountain shack with snow views.",
                "afternoon": "Scenic trek up to the sacred Anjani Mahadev waterfall viewpoint.",
                "evening": "Return to Manali. Cozy up beside a campfire with acoustic Himachali folk tunes.",
                "night": "Hearty Tibetan dinner with steamed momos and spicy tingmo bread at Chopsticks Restaurant."
            },
            {
                "title": "Jogini Waterfalls Hike & Naggar Castle Heritage",
                "morning": "Invigorating scenic hike through apple orchards and terraced fields to the multi-tiered Jogini Waterfalls.",
                "lunch": "Riverside picnic lunch with breathtaking panoramic views of the Pir Panjal range.",
                "afternoon": "Excursion to 15th-century wood-and-stone Naggar Castle and the historic Nicholas Roerich Art Gallery.",
                "evening": "Browse local village markets for authentic Kullu shawls, apricot oil, and wild mountain honey.",
                "night": "Dinner at Johnson's Bar & Restaurant with outdoor bonfire seating."
            },
            {
                "title": "Beas River Rafting, Van Vihar & Mountain Farewell",
                "morning": "Exciting white-water river rafting session in the crisp rapids of Beas river near Kullu.",
                "lunch": "Traditional Himachali Dhaba lunch on the riverside tasting local spiced lentils and rotis.",
                "afternoon": "Relaxing walk through Van Vihar riverside cedar park and last-minute souvenir shopping.",
                "evening": "Enjoy hot ginger-lemon-honey tea at an Old Manali cafe overlooking the mountains before departure.",
                "night": "Board return evening mountain bus with unforgettable Himalayan memories."
            }
        ]
    }
}

# ==============================================================================
# Helper: Extract Clean JSON
# ==============================================================================

def extract_json(text: str) -> dict:
    """Safely extracts and parses JSON dictionary from model response text."""
    if not text:
        return {}
    
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)
        cleaned = cleaned.strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"(\{[\s\S]*\})", cleaned)
        if match:
            candidate = match.group(1)
            try:
                return json.loads(candidate)
            except json.JSONDecodeError:
                # Clean trailing commas inside JSON objects/arrays
                fixed = re.sub(r",\s*([\]}])", r"\1", candidate)
                try:
                    return json.loads(fixed)
                except json.JSONDecodeError:
                    pass
    return {}

# ==============================================================================
# Helper: Exact Budget Calculation
# ==============================================================================

def calculate_budget_breakdown(budget: int) -> List[Dict[str, Any]]:
    """
    Ensures mathematical consistency:
    - Percentages sum to 100% exactly
    - Amounts sum to budget exactly
    - Standard realistic travel allocation
    """
    acc = round(budget * 0.35)
    food = round(budget * 0.25)
    transport = round(budget * 0.15)
    activities = round(budget * 0.15)
    misc = budget - (acc + food + transport + activities)

    return [
        {"category": "Accommodation", "amount": acc, "percentage": 35},
        {"category": "Food & Dining", "amount": food, "percentage": 25},
        {"category": "Local Transport", "amount": transport, "percentage": 15},
        {"category": "Activities & Entry Fees", "amount": activities, "percentage": 15},
        {"category": "Emergency & Miscellaneous", "amount": misc, "percentage": 10},
    ]

# ==============================================================================
# Helper: Parse Live Weather Advice
# ==============================================================================

def parse_weather_context(destination: str, weather_text: str = "") -> Dict[str, Any]:
    """Extracts temperature, condition, packing, and precautions from weather context."""
    temp = "28°C"
    condition = "Pleasant & Clear"
    best_time = f"Good time to explore {destination}."

    if weather_text:
        t_match = re.search(r"Temperature:\s*([^\n]+)", weather_text, re.IGNORECASE)
        if t_match:
            temp = t_match.group(1).strip()
            if not temp.endswith("°C") and "c" not in temp.lower():
                temp += "°C"
        c_match = re.search(r"Condition:\s*([^\n]+)", weather_text, re.IGNORECASE)
        if c_match:
            condition = c_match.group(1).strip()

    # Parse numerical temperature for climate-aware packing
    try:
        t_val = float(re.search(r"[-+]?\d+", temp).group())
    except Exception:
        t_val = 26.0

    cond_lower = condition.lower()
    if any(w in cond_lower for w in ["rain", "drizzle", "storm", "wet"]):
        pack = ["Waterproof rain jacket", "Quick-dry clothing", "Compact umbrella", "Water-resistant footwear", "Waterproof device pouch"]
        precautions = ["Check road conditions before transit", "Avoid waterlogged low-lying areas", "Keep travel documents in dry bags"]
        best_time = "Travel is possible with appropriate rain gear."
    elif t_val < 18:
        pack = ["Thermal inner wear", "Fleece / Puffer jacket", "Woolen socks & gloves", "Moisturizing cream & lip balm", "Sturdy walking boots"]
        precautions = ["Layer clothing to adjust to temperature drops", "Stay well-hydrated in crisp mountain air", "Carry warm evening headwear"]
        best_time = "Invigorating cool climate, great for sightseeing and scenic vistas."
    elif t_val > 30:
        pack = ["Breathable cotton / linen clothes", "UV-protective sunglasses", "SPF 50+ Sunscreen", "Wide-brim hat / cap", "Comfortable open sandals"]
        precautions = ["Drink plenty of water and electrolytes", "Limit continuous outdoor exposure between 12:00 PM and 3:00 PM", "Reapply sunscreen frequently"]
        best_time = "Best to schedule outdoor excursions in early mornings and late afternoons."
    else:
        pack = ["Light cotton clothing", "Comfortable walking sneakers", "Sunglasses & sunscreen", "Light evening cardigan / jacket", "Reusable water bottle"]
        precautions = ["Keep hydrated during walking tours", "Wear broken-in shoes for sightseeing", "Keep emergency local contact numbers handy"]
        best_time = "Ideal weather conditions for comfortable full-day sightseeing."

    return {
        "temperature": temp,
        "condition": condition,
        "best_time": best_time,
        "pack": pack,
        "precautions": precautions
    }

# ==============================================================================
# Procedural Generator for Arbitrary Destinations
# ==============================================================================

def generate_procedural_itinerary(destination: str, days: int, budget: int, interests: str) -> List[Dict[str, Any]]:
    """Builds a rich, destination-and-interest specific itinerary for any city."""
    interest_list = [i.strip().lower() for i in interests.split(",") if i.strip()]
    daily_cost_int = int(budget / max(days, 1))
    daily_cost_str = f"₹{daily_cost_int:,}"

    has_beach = any("beach" in i or "coast" in i for i in interest_list)
    has_food = any("food" in i or "culinary" in i or "eat" in i for i in interest_list)
    has_history = any("hist" in i or "monument" in i or "fort" in i or "palace" in i for i in interest_list)
    has_nature = any("nat" in i or "mountain" in i or "valley" in i or "hill" in i or "lake" in i for i in interest_list)
    has_adventure = any("advent" in i or "trek" in i or "raft" in i or "sport" in i for i in interest_list)
    has_night = any("night" in i or "party" in i or "club" in i for i in interest_list)
    has_shop = any("shop" in i or "market" in i or "bazaar" in i for i in interest_list)

    itinerary = []

    for d in range(1, days + 1):
        if d == 1:
            title = f"Arrival, Orientation & First Impressions of {destination}"
            morning = f"Arrive in {destination}, complete hotel check-in, freshen up, and take a relaxed orientation stroll around the central area."
            lunch = f"Enjoy a welcoming meal tasting authentic regional specialties and local street flavors at a top-rated traditional eatery."
            if has_beach:
                afternoon = f"Visit the nearest prominent beach or coastal promenade; feel the sea breeze and scenic ocean view."
                evening = f"Golden hour sunset walk along the shoreline, watching local fishing boats and coastal life."
            elif has_history:
                afternoon = f"Explore the city's foremost historic landmark or heritage square, getting an introduction to {destination}'s history."
                evening = f"Stroll through the old quarter streets as the heritage buildings illuminate in the evening light."
            elif has_nature:
                afternoon = f"Take a tranquil walk through the central botanical gardens or scenic lakeside promenade."
                evening = f"Catch the sunset from a popular local viewpoint overlooking {destination} valley."
            else:
                afternoon = f"Explore the vibrant cultural district, visiting landmark plazas and artisan craft shops."
                evening = f"Sunset stroll through the bustling town square with street performers and ambient cafes."

            if has_night:
                night = f"Experience {destination}'s evening nightlife hub; dinner with upbeat music, signature drinks, and vibrant nightlife."
            elif has_food:
                night = f"Embark on a dinner food-crawl tasting famous evening street delicacies and signature desserts."
            else:
                night = f"Relaxing dinner at a popular local restaurant featuring regional delicacies, unwinding after your journey."

        elif d == days:
            title = f"Artisan Markets, Scenic Farewell & Departure from {destination}"
            if has_nature or has_beach:
                morning = f"Early morning scenic walk to capture golden-hour photos of {destination}'s iconic natural vistas before crowds arrive."
            else:
                morning = f"Morning visit to a quiet cultural landmark or heritage temple for a peaceful start to the day."

            lunch = f"Farewell lunch at a classic landmark restaurant, indulging in your favorite regional dishes one last time."
            afternoon = f"Visit the traditional bazaars and handicraft emporiums in {destination}; shop for authentic souvenirs, spices, and handmade goods."
            evening = f"Final relaxing tea/coffee stop at an atmospheric cafe, packing bags and preparing travel documents."
            night = f"Head to the airport/station for departure, carrying memorable moments and photographs from {destination}."

        else:
            # Intermediate thematic days
            theme_cycle = (d - 2) % 4
            if theme_cycle == 0 and (has_history or not has_beach):
                title = f"Historical Monuments & Architectural Marvels of {destination}"
                morning = f"Guided morning tour of {destination}'s grandest fort, palace, or heritage museum during the cooler morning hours."
                lunch = f"Sample royal heritage cuisine and traditional thali at a historic heritage dining hall."
                afternoon = f"Visit ancient stepwells, architectural ruins, or regional art galleries showcasing {destination}'s rich culture."
                evening = f"Sunset view from a historic terrace or fortress battlement overlooking the panoramic skyline."
                night = f"Evening sound & light show or dinner in a restored heritage courtyard with traditional music."

            elif theme_cycle == 1 and (has_nature or has_adventure):
                title = f"Nature Trails, Scenic Vistas & Outdoor Exploration"
                morning = f"Morning excursion to natural waterfalls, mountain viewpoints, or nature sanctuaries near {destination}."
                lunch = f"Scenic picnic lunch or dining at a hilltop cafe with sweeping mountain and valley views."
                afternoon = f"Engage in thrilling outdoor activities — scenic trekking trails, river activities, or ropeway rides."
                evening = f"Unwind by a peaceful lake, riverfront, or forest viewpoint watching the changing sky colors."
                night = f"Hearty dinner tasting rustic local mountain/countryside dishes around an ambient evening setting."

            elif theme_cycle == 2 and (has_food or has_shop):
                title = f"Culinary Secrets & Vibrant Local Bazaars of {destination}"
                morning = f"Morning guided food and market walk, observing bustling wholesale spice and fresh produce trading."
                lunch = f"Gourmet culinary tasting at a renowned local eatery celebrated for multi-generational regional recipes."
                afternoon = f"Explore specialty craft streets and textile bazaars, meeting local artisans and weavers."
                evening = f"Sunset snacks, regional chaat, and local sweets from iconic street vendors in the bustling heart of town."
                night = f"Dinner at an upscale regional restaurant followed by tasting {destination}'s signature desserts."

            else:
                title = f"Immersive Cultural Sights & Leisure in {destination}"
                morning = f"Visit signature cultural landmarks, spiritual sites, or contemporary art centers in {destination}."
                lunch = f"Relaxed lunch at a picturesque garden bistro with artisanal regional dishes."
                afternoon = f"Leisure time exploring hidden alleys, photo-walks, or specialized museums matching your interests."
                evening = f"Golden-hour promenade along {destination}'s scenic riverfront, lake, or coastline."
                night = f"Dinner at a vibrant rooftop restaurant enjoying city lights and live acoustic performances."

        itinerary.append({
            "day": d,
            "title": title,
            "morning": morning,
            "lunch": lunch,
            "afternoon": afternoon,
            "evening": evening,
            "night": night,
            "cost": daily_cost_str
        })

    return itinerary

# ==============================================================================
# Helper: Hotel Price Scaler
# ==============================================================================

def generate_scaled_hotels(destination: str, days: int, budget: int) -> List[Dict[str, Any]]:
    """Generates 3 estimated hotels matching the user's specific budget tier."""
    daily_acc_budget = max(int((budget * 0.35) / max(days, 1)), 600)

    p_budget = int(daily_acc_budget * 0.75)
    p_mid = int(daily_acc_budget * 1.0)
    p_comfort = int(daily_acc_budget * 1.30)

    # Check curated knowledge first
    dest_key = destination.strip().lower()
    for k in DESTINATION_KNOWLEDGE:
        if k in dest_key or dest_key in k:
            curated_hotels = DESTINATION_KNOWLEDGE[k]["hotels"]
            pool = curated_hotels["budget"] if budget < 15000 else curated_hotels["mid"]
            return [
                {
                    "name": pool[0]["name"],
                    "location": pool[0]["location"],
                    "price": f"₹{p_budget:,}/night (Estimated)",
                    "rating": pool[0]["rating"],
                    "description": pool[0]["description"]
                },
                {
                    "name": pool[1]["name"],
                    "location": pool[1]["location"],
                    "price": f"₹{p_mid:,}/night (Estimated)",
                    "rating": pool[1]["rating"],
                    "description": pool[1]["description"]
                },
                {
                    "name": pool[2]["name"],
                    "location": pool[2]["location"],
                    "price": f"₹{p_comfort:,}/night (Estimated)",
                    "rating": pool[2]["rating"],
                    "description": pool[2]["description"]
                },
            ]

    # Procedural hotel generator for arbitrary destinations
    return [
        {
            "name": f"{destination} Heritage Backpacker Stay",
            "location": f"Central Old Quarter, {destination}",
            "price": f"₹{p_budget:,}/night (Estimated)",
            "rating": 4.5,
            "description": f"Affordable, clean, and highly rated stay close to {destination}'s top transit and sight points."
        },
        {
            "name": f"{destination} Boutique City Hotel",
            "location": f"Prime Tourist District, {destination}",
            "price": f"₹{p_mid:,}/night (Estimated)",
            "rating": 4.6,
            "description": f"Comfortable modern rooms with breakfast included, within easy reach of top dining and markets."
        },
        {
            "name": f"{destination} Scenic View Retreat",
            "location": f"Panoramic District, {destination}",
            "price": f"₹{p_comfort:,}/night (Estimated)",
            "rating": 4.8,
            "description": f"Charming stay offering scenic balconies, peaceful ambiance, and personalized hospitality."
        }
    ]

# ==============================================================================
# Smart Fallback Trip Generator
# ==============================================================================

def generate_smart_fallback_trip(destination: str, days: int, budget: int, interests: str, weather_context: str = "") -> dict:
    """
    Generates a top-tier, destination-specific, mathematically exact travel plan
    when Gemini API hits quota limits or returns an error.
    """
    dest_clean = destination.strip()
    dest_key = dest_clean.lower()
    weather_info = parse_weather_context(dest_clean, weather_context)
    budget_breakdown = calculate_budget_breakdown(budget)
    hotels = generate_scaled_hotels(dest_clean, days, budget)

    # Check for curated destination
    matched_knowledge = None
    for k, v in DESTINATION_KNOWLEDGE.items():
        if k in dest_key or dest_key in k:
            matched_knowledge = v
            break

    daily_cost_int = int(budget / max(days, 1))
    daily_cost_str = f"₹{daily_cost_int:,}"

    if matched_knowledge:
        curated_days = matched_knowledge["days"]
        itinerary = []
        for i in range(1, days + 1):
            source_day = curated_days[(i - 1) % len(curated_days)]
            itinerary.append({
                "day": i,
                "title": f"Day {i}: {source_day['title']}",
                "morning": source_day["morning"],
                "lunch": source_day["lunch"],
                "afternoon": source_day["afternoon"],
                "evening": source_day["evening"],
                "night": source_day["night"],
                "cost": daily_cost_str
            })

        food_sample = ", ".join(matched_knowledge["food_highlights"][:3])
        summary = (
            f"A curated {days}-day journey to {dest_clean} customized for a total budget of ₹{budget:,}. "
            f"Tailored specifically around your interests in {interests}, this plan balances iconic highlights, "
            f"culinary treats like {food_sample}, and memorable local experiences."
        )
    else:
        itinerary = generate_procedural_itinerary(dest_clean, days, budget, interests)
        summary = (
            f"A well-paced {days}-day travel itinerary for {dest_clean} optimized for ₹{budget:,} total expenditure. "
            f"Thoughtfully crafted around your interests in {interests}, combining signature local attractions, "
            f"regional cuisine, and practical day-by-day pacing."
        )

    return {
        "destination": dest_clean,
        "days": days,
        "budget": budget,
        "interests": interests,
        "summary": summary,
        "weather": weather_info,
        "budget_breakdown": budget_breakdown,
        "budget_plan": budget_breakdown,
        "hotels": hotels,
        "itinerary": itinerary
    }

# ==============================================================================
# Response Validation & Sanitization Pass
# ==============================================================================

def validate_and_sanitize_trip(trip: Any, destination: str, days: int, budget: int, interests: str, weather_text: str = "") -> dict:
    """
    Validates every required field, corrects mathematical inconsistencies,
    ensures correct number of days, and guarantees frontend safety.
    """
    if not isinstance(trip, dict):
        return generate_smart_fallback_trip(destination, days, budget, interests, weather_text)

    # 1. Basic Fields
    clean_dest = str(trip.get("destination") or destination)
    try:
        clean_days = int(trip.get("days") or days)
    except (ValueError, TypeError):
        clean_days = days

    try:
        clean_budget = int(trip.get("budget") or budget)
    except (ValueError, TypeError):
        clean_budget = budget

    clean_interests = str(trip.get("interests") or interests)

    summary = trip.get("summary")
    if not isinstance(summary, str) or len(summary.strip()) < 15:
        summary = f"A customized {clean_days}-day travel plan for {clean_dest} with a total budget of ₹{clean_budget:,}, tailored to your interests in {clean_interests}."

    # 2. Weather
    weather = trip.get("weather")
    if not isinstance(weather, dict) or not weather.get("temperature") or not weather.get("pack"):
        weather = parse_weather_context(clean_dest, weather_text)
    else:
        # Guarantee list types for pack & precautions
        if not isinstance(weather.get("pack"), list):
            weather["pack"] = ["Comfortable clothing", "Sunglasses", "Sunscreen", "Walking shoes"]
        if not isinstance(weather.get("precautions"), list):
            weather["precautions"] = ["Stay hydrated throughout the day", "Carry a copy of IDs and emergency contacts"]
        if not weather.get("best_time"):
            weather["best_time"] = f"Good time to explore {clean_dest}."

    # 3. Budget Breakdown
    budget_breakdown = trip.get("budget_breakdown")
    if not isinstance(budget_breakdown, list) or len(budget_breakdown) < 4:
        budget_breakdown = calculate_budget_breakdown(clean_budget)
    else:
        # Validate internal mathematical consistency
        total_amt = sum(item.get("amount", 0) for item in budget_breakdown if isinstance(item, dict))
        if abs(total_amt - clean_budget) > 100:
            budget_breakdown = calculate_budget_breakdown(clean_budget)

    # 4. Hotels
    hotels = trip.get("hotels")
    if not isinstance(hotels, list) or len(hotels) < 2:
        hotels = generate_scaled_hotels(clean_dest, clean_days, clean_budget)
    else:
        sanitized_hotels = []
        for i, h in enumerate(hotels[:3]):
            if isinstance(h, dict):
                sanitized_hotels.append({
                    "name": str(h.get("name") or f"{clean_dest} Hotel Option {i+1}"),
                    "location": str(h.get("location") or f"Central {clean_dest}"),
                    "price": str(h.get("price") or f"₹{int((clean_budget * 0.35) / max(clean_days, 1)):,}/night"),
                    "rating": float(h.get("rating") or 4.5),
                    "description": str(h.get("description") or f"Top recommended stay in {clean_dest}.")
                })
        if len(sanitized_hotels) < 3:
            sanitized_hotels = generate_scaled_hotels(clean_dest, clean_days, clean_budget)
        hotels = sanitized_hotels

    # 5. Itinerary
    itinerary = trip.get("itinerary")
    daily_cost_str = f"₹{int(clean_budget / max(clean_days, 1)):,}"

    if not isinstance(itinerary, list) or len(itinerary) == 0:
        itinerary = generate_procedural_itinerary(clean_dest, clean_days, clean_budget, clean_interests)
    else:
        sanitized_itinerary = []
        for idx, day_item in enumerate(itinerary):
            if not isinstance(day_item, dict):
                continue
            d_num = idx + 1
            sanitized_itinerary.append({
                "day": d_num,
                "title": str(day_item.get("title") or f"Day {d_num}: Exploring {clean_dest}"),
                "morning": str(day_item.get("morning") or "Morning sightseeing and local breakfast."),
                "lunch": str(day_item.get("lunch") or "Lunch tasting authentic regional cuisine."),
                "afternoon": str(day_item.get("afternoon") or "Afternoon cultural and scenic visit."),
                "evening": str(day_item.get("evening") or "Evening walk around local markets and viewpoints."),
                "night": str(day_item.get("night") or "Dinner and relaxed evening leisure."),
                "cost": str(day_item.get("cost") or daily_cost_str)
            })

        # Ensure exact count matches clean_days
        if len(sanitized_itinerary) < clean_days:
            additional = generate_procedural_itinerary(clean_dest, clean_days, clean_budget, clean_interests)
            while len(sanitized_itinerary) < clean_days:
                next_idx = len(sanitized_itinerary)
                sanitized_itinerary.append(additional[next_idx])
        elif len(sanitized_itinerary) > clean_days:
            sanitized_itinerary = sanitized_itinerary[:clean_days]

        itinerary = sanitized_itinerary

    return {
        "destination": clean_dest,
        "days": clean_days,
        "budget": clean_budget,
        "interests": clean_interests,
        "summary": summary,
        "weather": weather,
        "budget_breakdown": budget_breakdown,
        "budget_plan": budget_breakdown,
        "hotels": hotels,
        "itinerary": itinerary
    }

# ==============================================================================
# Main Planner Agent
# ==============================================================================

def planner_agent(destination: str, days: int, budget: int, interests: str, weather: str = "") -> dict:
    """
    Main entry point for trip planning.
    Tries Google Gemini generation with deep destination and interest requirements.
    Gracefully falls back to high-fidelity, destination-aware trip generation on API/quota limits.
    """
    # Calculate realistic estimates for prompt guidance
    daily_budget = int(budget / max(days, 1))
    nightly_hotel = int((budget * 0.35) / max(days, 1))

    prompt = f"""
You are a world-class AI travel planner and local travel guide.
Create a highly detailed, realistic, and destination-specific {days}-day travel plan for {destination}.

TRIP PARAMETERS:
- Destination: {destination}
- Duration: {days} Days (provide EXACTLY {days} day-by-day entries)
- Total Budget: ₹{budget:,} INR (Daily approx: ₹{daily_budget:,} INR)
- Realistic Hotel Budget: ~₹{nightly_hotel:,} INR / night
- User Interests: {interests}
- Live Weather: {weather}

CRITICAL QUALITY RULES:
1. DESTINATION-SPECIFIC: DO NOT use generic phrases such as "Visit a famous beach", "Explore local attractions", or "Have dinner at a nice cafe".
   - Name SPECIFIC famous places, beaches, viewpoints, historical monuments, bazaars, and neighborhoods in {destination}.
   - Name SPECIFIC regional delicacies (e.g., if Goa: Goan Fish Curry Thali, Poi, Bebinca; if Hyderabad: Hyderabadi Dum Biryani, Irani Chai, Osmania Biscuits; if Manali: Siddu, Trout Fish, Thukpa).
2. LOGICAL PACING & GEOGRAPHY:
   - Day 1 must be an Arrival & Orientation day.
   - Intermediate days must group geographically close activities to avoid impossible cross-city transit.
   - Final Day (Day {days}) must allow time for souvenir shopping and departure logistics.
3. INTEREST INTEGRATION:
   - Deeply integrate the user's stated interests ({interests}) across morning, afternoon, evening, and night slots.
4. BUDGET DISCIPLINE:
   - Recommend hotels appropriate for ₹{nightly_hotel:,}/night, not unaffordable luxury resorts.
   - Categories in budget_breakdown must sum exactly to ₹{budget:,} and percentages to 100%.

Return ONLY valid JSON matching this exact structure:
{{
  "summary": "2-3 concise sentences highlighting the travel style, key interests ({interests}), and signature experiences in {destination}.",
  "weather": {{
    "temperature": "28°C",
    "condition": "Sunny & Pleasant",
    "best_time": "Recommended season for travel.",
    "pack": ["Specific item 1", "Specific item 2", "Specific item 3", "Specific item 4"],
    "precautions": ["Practical precaution 1", "Practical precaution 2"]
  }},
  "budget_breakdown": [
    {{"category": "Accommodation", "amount": {int(budget * 0.35)}, "percentage": 35}},
    {{"category": "Food & Dining", "amount": {int(budget * 0.25)}, "percentage": 25}},
    {{"category": "Local Transport", "amount": {int(budget * 0.15)}, "percentage": 15}},
    {{"category": "Activities & Entry Fees", "amount": {int(budget * 0.15)}, "percentage": 15}},
    {{"category": "Emergency & Miscellaneous", "amount": {int(budget * 0.10)}, "percentage": 10}}
  ],
  "hotels": [
    {{
      "name": "Specific Hotel Name in {destination}",
      "location": "Specific Area / Neighborhood",
      "price": "₹{nightly_hotel:,}/night (Estimated)",
      "rating": 4.5,
      "description": "Specific reason why this hotel fits the itinerary and budget."
    }},
    {{
      "name": "Second Specific Hotel in {destination}",
      "location": "Specific Area / Neighborhood",
      "price": "₹{int(nightly_hotel * 0.85):,}/night (Estimated)",
      "rating": 4.4,
      "description": "Great value stay close to local attractions."
    }},
    {{
      "name": "Third Specific Hotel in {destination}",
      "location": "Specific Area / Neighborhood",
      "price": "₹{int(nightly_hotel * 1.2):,}/night (Estimated)",
      "rating": 4.7,
      "description": "Comfortable stay with scenic views or superior amenities."
    }}
  ],
  "itinerary": [
    {{
      "day": 1,
      "title": "Specific Title for Day 1",
      "morning": "Specific morning activities in {destination}",
      "lunch": "Specific lunch venue / regional dish",
      "afternoon": "Specific afternoon sightseeing",
      "evening": "Specific evening sunset / market walk",
      "night": "Specific nightlife / relaxed dinner experience",
      "cost": "₹{daily_budget:,}"
    }}
  ]
}}
"""

    # Try configured Gemini models (bounded by 4s timeout to prevent long quota sleeps)
    if GEMINI_API_KEY:
        import concurrent.futures
        for model_name in FALLBACK_MODELS[:2]:
            try:
                m = genai.GenerativeModel(model_name)
                with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                    future = executor.submit(m.generate_content, prompt)
                    response = future.result(timeout=4.0)

                if response and response.text:
                    parsed = extract_json(response.text)
                    if isinstance(parsed, dict) and "itinerary" in parsed:
                        sanitized = validate_and_sanitize_trip(
                            parsed, destination, days, budget, interests, weather
                        )
                        return sanitized
            except Exception as e:
                err_str = str(e).lower()
                logging.info(f"Gemini generation with {model_name} skipped/failed: {e}")
                if "quota" in err_str or "resource_exhausted" in err_str or "429" in err_str:
                    break



    # Fallback to intelligent, destination-aware trip generation
    fallback_trip = generate_smart_fallback_trip(destination, days, budget, interests, weather)
    return validate_and_sanitize_trip(fallback_trip, destination, days, budget, interests, weather)