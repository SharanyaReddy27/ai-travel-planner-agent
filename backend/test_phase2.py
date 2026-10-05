import sys
import json
from pathlib import Path

# Force UTF-8 stdout for Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


# Add backend to path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from main import plan_trip, TripRequest

def test_case(name, dest, days, budget, interests):
    print(f"\n==================================================")
    print(f"TESTING {name}: {dest} ({days} days, ₹{budget}, '{interests}')")
    print(f"==================================================")
    
    req = TripRequest(
        destination=dest,
        days=days,
        budget=budget,
        interests=interests
    )
    
    res = plan_trip(req)
    
    # 1. Verification of keys
    required_keys = [
        "destination", "days", "budget", "interests", "summary",
        "weather", "budget_breakdown", "budget_plan", "hotels", "itinerary"
    ]
    for key in required_keys:
        assert key in res, f"Missing key: {key}"
    
    # 2. Itinerary count
    assert len(res["itinerary"]) == days, f"Expected {days} days, got {len(res['itinerary'])}"
    for idx, day_item in enumerate(res["itinerary"]):
        assert day_item["day"] == idx + 1, f"Day number mismatch: {day_item['day']} vs {idx+1}"
        assert day_item["title"], "Missing day title"
        assert day_item["morning"], "Missing morning activity"
        assert day_item["lunch"], "Missing lunch activity"
        assert day_item["afternoon"], "Missing afternoon activity"
        assert day_item["evening"], "Missing evening activity"
        assert day_item["night"], "Missing night activity"
        assert "₹" in day_item["cost"], f"Cost format missing ₹: {day_item['cost']}"

    # 3. Budget breakdown consistency
    b_list = res["budget_breakdown"]
    total_amount = sum(item["amount"] for item in b_list)
    total_pct = sum(item["percentage"] for item in b_list)
    assert total_amount == budget, f"Budget sum {total_amount} != expected {budget}"
    assert total_pct == 100, f"Percentage sum {total_pct} != 100"

    # 4. Hotels verification
    hotels = res["hotels"]
    assert len(hotels) >= 3, f"Expected at least 3 hotels, got {len(hotels)}"
    for h in hotels:
        assert h.get("name"), "Hotel missing name"
        assert h.get("location"), "Hotel missing location"
        assert "₹" in h.get("price", ""), f"Hotel price missing ₹: {h.get('price')}"
        assert isinstance(h.get("rating"), (int, float)), f"Invalid rating: {h.get('rating')}"

    # 5. Weather verification
    w = res["weather"]
    assert isinstance(w, dict), "Weather must be dict"
    assert "temperature" in w, "Weather missing temperature"
    assert "condition" in w, "Weather missing condition"
    assert len(w.get("pack", [])) > 0, "Weather missing packing items"
    assert len(w.get("precautions", [])) > 0, "Weather missing precautions"

    print("✔ Validation passed successfully!")
    print(f"Summary: {res['summary']}")
    print(f"Weather: {w['temperature']} | {w['condition']} | Pack: {w['pack'][:3]}")
    print(f"Budget: {total_amount} (100%) | Categories: {[b['category'] + ': ₹' + str(b['amount']) for b in b_list]}")
    print(f"Hotels: {[h['name'] + ' (' + h['price'] + ')' for h in hotels]}")
    for d in res["itinerary"]:
        print(f"  Day {d['day']}: {d['title']} ({d['cost']})")
        print(f"    Morning: {d['morning'][:60]}...")
        print(f"    Lunch: {d['lunch'][:60]}...")
        print(f"    Night: {d['night'][:60]}...")
    return res

if __name__ == "__main__":
    c1 = test_case("CASE 1", "Goa", 3, 10000, "beaches,nights")
    c2 = test_case("CASE 2", "Hyderabad", 2, 5000, "food,history")
    c3 = test_case("CASE 3", "Manali", 4, 12000, "nature,adventure")
    print("\nALL 3 TEST CASES PASSED WITH 100% SPEC COMPLIANCE!")
