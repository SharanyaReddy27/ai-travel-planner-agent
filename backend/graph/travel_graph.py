from typing import TypedDict

from langgraph.graph import StateGraph, END

from agents.weather_agent import weather_agent
from agents.budget_agent import budget_agent
from agents.hotel_agent import hotel_agent
from agents.itinerary_agent import itinerary_agent


class TravelState(TypedDict):
    destination: str
    days: int
    budget: int
    interests: str

    weather: str
    budget_plan: str
    hotels: str
    itinerary: str


def weather_node(state):
    state["weather"] = weather_agent(state["destination"])
    return state


def budget_node(state):
    state["budget_plan"] = budget_agent(
        state["destination"],
        state["days"],
        state["budget"]
    )
    return state


def hotel_node(state):
    state["hotels"] = hotel_agent(
        state["destination"],
        state["budget"]
    )
    return state


def itinerary_node(state):
    state["itinerary"] = itinerary_agent(
        state["destination"],
        state["days"],
        state["interests"],
        state["weather"],
        state["budget_plan"],
        state["hotels"]
    )
    return state


graph = StateGraph(TravelState)

graph.add_node("weather", weather_node)
graph.add_node("budget", budget_node)
graph.add_node("hotel", hotel_node)
graph.add_node("itinerary", itinerary_node)

graph.set_entry_point("weather")

graph.add_edge("weather", "budget")
graph.add_edge("budget", "hotel")
graph.add_edge("hotel", "itinerary")
graph.add_edge("itinerary", END)

travel_graph = graph.compile()