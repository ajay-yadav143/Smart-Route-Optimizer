from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.graph import Graph
from app.dijkstra import dijkstra
from app.traffic import TrafficManager

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

graph = Graph()

edges = [
    ("A", "B", 5),
    ("A", "C", 2),
    ("B", "D", 1),
    ("C", "D", 3),
    ("D", "E", 2),
    ("B", "E", 4)
]

for u, v, w in edges:
    graph.add_edge(u, v, w)

@app.get("/route")
def get_route(source: str, destination: str, traffic: str = "low"):
    temp_graph = Graph()

    for u in graph.graph:
        for v, w in graph.get_neighbors(u):
            new_weight = TrafficManager.apply_traffic(w, traffic)
            temp_graph.add_edge(u, v, new_weight)

    path, distance = dijkstra(temp_graph, source, destination)

    return {
        "route": path,
        "time": distance,
        "traffic": traffic
    }


@app.get("/")
def read_root():
    return {
        "message": "Smart Route Optimizer API",
        "endpoints": ["/route"],
        "docs": "/docs"
    }
