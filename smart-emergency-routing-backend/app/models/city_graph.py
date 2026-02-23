# app/models/city_graph.py

import networkx as nx
from typing import List, Dict, Tuple

class CityGraph:
    def __init__(self):
        """Initializes the NetworkX graph."""
        self.graph = nx.Graph()

    def add_intersections(self, nodes: List[str]):
        """Adds nodes (intersections/hospitals) to the city map."""
        self.graph.add_nodes_from(nodes)

    def add_roads(self, edges: List[Tuple[str, str, float]]):
        """
        Adds edges (roads) between nodes. 
        Format of tuple: (Node_A, Node_B, Travel_Time_In_Minutes)
        """
        self.graph.add_weighted_edges_from(edges)

    def calculate_travel_time(self, start_node: str, end_node: str) -> float:
        """
        Uses Dijkstra's algorithm to compute the shortest travel time.
        Raises an exception if no path exists.
        """
        try:
            return nx.dijkstra_path_length(self.graph, start_node, end_node, weight='weight')
        except nx.NetworkXNoPath:
            return float('inf')
        except nx.NodeNotFound as e:
            raise ValueError(f"Node not found in the city graph: {str(e)}")

    def get_shortest_path(self, start_node: str, end_node: str) -> List[str]:
        """
        Returns the actual sequence of nodes (the route) for the frontend to render.
        """
        try:
            return nx.dijkstra_path(self.graph, start_node, end_node, weight='weight')
        except (nx.NetworkXNoPath, nx.NodeNotFound):
            return []