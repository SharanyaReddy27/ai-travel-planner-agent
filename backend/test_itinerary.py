from agents.itinerary_agent import itinerary_agent

weather = "Sunny weather. Temperature 30°C. Carry sunscreen."

budget = """
Accommodation: ₹9000
Food: ₹5000
Transport: ₹3000
Activities: ₹6000
"""

hotel = """
1. Vivanta Goa
2. Goa Marriott Resort
3. Cidade de Goa
"""

print(
    itinerary_agent(
        "Goa",
        5,
        "beaches, cafes, nightlife",
        weather,
        budget,
        hotel
    )
)