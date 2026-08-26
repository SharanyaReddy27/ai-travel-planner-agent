from graph.travel_graph import travel_graph

result = travel_graph.invoke({
    "destination": "Goa",
    "weather": ""
})

print(result)