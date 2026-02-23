# app/services/routing_service.py

from app.models.city_graph import CityGraph
from app.models.hospital import Hospital
from typing import Dict, Any

class RoutingService:
    def __init__(self, city_graph: CityGraph, hospitals: Dict[str, Hospital]):
        """
        Injects the data models into the service.
        This follows the Dependency Injection principle for easier testing.
        """
        self.city_graph = city_graph
        self.hospitals = hospitals

    def find_optimal_hospital(self, ambulance_location: str) -> Dict[str, Any]:
        """
        Executes the core algorithm: Total Time = Travel Time + Waiting Time.
        Returns the optimal route and hospital data.
        """
        best_hospital = None
        min_total_time = float('inf')
        best_route = []
        travel_time_to_best = 0
        wait_time_at_best = 0

        # Evaluate every hospital in the network
        for node_id, hospital in self.hospitals.items():
            try:
                # 1. Calculate Shortest Travel Time (Dijkstra)
                travel_time = self.city_graph.calculate_travel_time(ambulance_location, node_id)
                
                # 2. Calculate Expected Waiting Time (Capacity vs Occupancy)
                waiting_time = hospital.calculate_waiting_time()
                
                # 3. Decision Logic: Calculate Total Time
                total_time = travel_time + waiting_time
                
                # 4. Compare and update if this is the fastest option
                if total_time < min_total_time:
                    min_total_time = total_time
                    best_hospital = hospital
                    best_route = self.city_graph.get_shortest_path(ambulance_location, node_id)
                    travel_time_to_best = travel_time
                    wait_time_at_best = waiting_time

            except ValueError:
                # Skip if there's no path to this specific hospital
                continue

        if not best_hospital:
            raise ValueError(f"Could not find a valid route from '{ambulance_location}' to any hospital.")

        # Serialize the response for the React Frontend
        return {
            "ambulance_start_node": ambulance_location,
            "optimal_hospital": best_hospital.to_dict(),
            "route_nodes": best_route,
            "metrics": {
                "travel_time_mins": round(travel_time_to_best, 2),
                "waiting_time_mins": round(wait_time_at_best, 2),
                "total_response_time_mins": round(min_total_time, 2)
            }
        }