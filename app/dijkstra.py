import heapq

def dijkstra(graph, source, destination):
    pq = []
    heapq.heappush(pq, (0, source))

    distances = {node: float('inf') for node in graph.graph}
    distances[source] = 0

    previous = {}

    while pq:
        current_distance, current_node = heapq.heappop(pq)

        if current_node == destination:
            break

        for neighbor, weight in graph.get_neighbors(current_node):
            new_distance = current_distance + weight

            if new_distance < distances[neighbor]:
                distances[neighbor] = new_distance
                previous[neighbor] = current_node
                heapq.heappush(pq, (new_distance, neighbor))

    path = []
    node = destination
    while node in previous:
        path.append(node)
        node = previous[node]

    path.append(source)
    path.reverse()

    return path, distances[destination]
