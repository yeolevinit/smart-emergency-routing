# app/utils/mock_data.py

from app.models.hospital import Hospital
from app.models.city_graph import CityGraph

def get_mock_hospitals() -> dict:
    """
    Generates a dictionary of realistic hospital data.
    Keys map to node names in the city graph.
    """
    return {
        "H1": Hospital(hospital_id="H1", name="Central Med", capacity=50, current_occupancy=45),
        "H2": Hospital(hospital_id="H2", name="City General", capacity=100, current_occupancy=20),
        "H3": Hospital(hospital_id="H3", name="Northside Care", capacity=30, current_occupancy=29),
        "H4": Hospital(hospital_id="H4", name="Southwest Clinic", capacity=40, current_occupancy=15)
    }

def get_mock_city_graph() -> CityGraph:
    """
    Builds the digital road network. 
    Nodes include standard intersections (A, B, C...) and Hospitals (H1, H2...).
    Weights represent travel time in minutes.
    """
    city = CityGraph()
    
    # Define Intersections and Hospital Nodes
    nodes = ["A", "B", "C", "D", "E", "F", "H1", "H2", "H3", "H4"]
    city.add_intersections(nodes)
    
    # Define Roads (Node1, Node2, Travel_Time_Mins)
    roads = [
        ("A", "B", 5.0),
        ("A", "C", 8.0),
        ("B", "D", 3.0),
        ("C", "D", 4.0),
        ("C", "E", 6.0),
        ("D", "F", 7.0),
        ("E", "F", 2.0),
        # Connect Intersections to Hospitals
        ("B", "H1", 2.0),
        ("E", "H2", 4.0),
        ("F", "H3", 3.0),
        ("A", "H4", 12.0)
    ]
    city.add_roads(roads)
    
    return city