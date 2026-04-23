# app/services/routing_service.py

from app.models.city_graph import CityGraph
from app.models.hospital import Hospital
from app.utils.db import get_db
from typing import Dict, Any, List

class RoutingService:
    def __init__(self):
        """Initializes the service and fetches ALL data live from MongoDB."""
        self.db = get_db()
        self._seed_if_empty() # Ensure data exists for the service
        self.hospitals = self._fetch_live_hospitals()
        self.city_graph = self._build_city_graph_from_db()

    def _seed_if_empty(self):
        """Auto-populates the database if it's currently empty (e.g. fresh Mock DB)."""
        if self.db.hospitals.count_documents({}) == 0:
            print("Database is empty. Seeding initial data...")
            
            # 1. Seed Hospitals
            self.db.hospitals.insert_many([
                {"hospital_id": "H1", "name": "Central Med", "capacity": 50, "current_occupancy": 45},
                {"hospital_id": "H2", "name": "City General", "capacity": 100, "current_occupancy": 20},
                {"hospital_id": "H3", "name": "Northside Care", "capacity": 30, "current_occupancy": 29},
                {"hospital_id": "H4", "name": "Southwest Clinic", "capacity": 40, "current_occupancy": 15}
            ])
            
            # 2. Seed Nodes
            self.db.map_nodes.insert_many([{"node_id": n} for n in ["A", "B", "C", "D", "E", "F", "H1", "H2", "H3", "H4"]])
            
            # 3. Seed Edges
            self.db.map_edges.insert_many([
                {"source": "A", "target": "B", "weight": 5.0}, {"source": "A", "target": "C", "weight": 8.0},
                {"source": "B", "target": "D", "weight": 3.0}, {"source": "C", "target": "D", "weight": 4.0},
                {"source": "C", "target": "E", "weight": 6.0}, {"source": "D", "target": "F", "weight": 7.0},
                {"source": "E", "target": "F", "weight": 2.0}, {"source": "B", "target": "H1", "weight": 2.0},
                {"source": "E", "target": "H2", "weight": 4.0}, {"source": "F", "target": "H3", "weight": 3.0},
                {"source": "A", "target": "H4", "weight": 12.0}
            ])

            # 4. Seed a Default Test User (admin@example.com / password123)
            from werkzeug.security import generate_password_hash
            self.db.users.insert_one({
                "username": "admin",
                "email": "admin@example.com",
                "password": generate_password_hash("password123")
            })

            print("Seeding complete. Test User: admin@example.com / password123")




    def _fetch_live_hospitals(self) -> Dict[str, Hospital]:
        hospital_objects = {}
        for data in self.db.hospitals.find():
            hospital = Hospital(
                hospital_id=data['hospital_id'],
                name=data['name'],
                capacity=data['capacity'],
                current_occupancy=data['current_occupancy']
            )
            hospital_objects[data['hospital_id']] = hospital
        return hospital_objects

    def _build_city_graph_from_db(self) -> CityGraph:
        city = CityGraph()
        # Fetch nodes
        nodes = [doc["node_id"] for doc in self.db.map_nodes.find()]
        city.add_intersections(nodes)
        
        # Fetch edges
        edges = [(doc["source"], doc["target"], doc["weight"]) for doc in self.db.map_edges.find()]
        city.add_roads(edges)
        
        return city

    def get_all_locations(self) -> List[str]:
        """Returns all valid intersections for the frontend dropdown."""
        return [doc["node_id"] for doc in self.db.map_nodes.find() if not doc["node_id"].startswith("H")]

    def update_hospital_occupancy(self, hospital_id: str, new_occupancy: int) -> bool:
        """Updates occupancy in DB to simulate real-time patient influx."""
        result = self.db.hospitals.update_one(
            {"hospital_id": hospital_id},
            {"$set": {"current_occupancy": new_occupancy}}
        )
        # Refresh the local cache so the next calculation uses the new data
        if result.modified_count > 0:
            self.hospitals = self._fetch_live_hospitals()
            return True
        return False

    def find_optimal_hospital(self, ambulance_location: str) -> Dict[str, Any]:
        best_hospital = None
        min_total_time = float('inf')
        best_route = []
        travel_time_to_best = 0
        wait_time_at_best = 0

        for node_id, hospital in self.hospitals.items():
            try:
                travel_time = self.city_graph.calculate_travel_time(ambulance_location, node_id)
                waiting_time = hospital.calculate_waiting_time()
                total_time = travel_time + waiting_time
                
                if total_time < min_total_time:
                    min_total_time = total_time
                    best_hospital = hospital
                    best_route = self.city_graph.get_shortest_path(ambulance_location, node_id)
                    travel_time_to_best = travel_time
                    wait_time_at_best = waiting_time
            except ValueError:
                continue

        if not best_hospital:
            raise ValueError(f"Could not find a valid route from '{ambulance_location}' to any hospital.")

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