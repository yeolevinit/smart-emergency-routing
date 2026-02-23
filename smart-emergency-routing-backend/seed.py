# seed_db.py

from app.utils.db import get_db

def seed_database():
    db = get_db()
    
    # 1. Clear existing data to prevent duplicates
    db.hospitals.drop()
    db.map_nodes.drop()
    db.map_edges.drop()
    
    # 2. Seed Hospitals
    hospitals_data = [
        {"hospital_id": "H1", "name": "Central Med", "capacity": 50, "current_occupancy": 45},
        {"hospital_id": "H2", "name": "City General", "capacity": 100, "current_occupancy": 20},
        {"hospital_id": "H3", "name": "Northside Care", "capacity": 30, "current_occupancy": 29},
        {"hospital_id": "H4", "name": "Southwest Clinic", "capacity": 40, "current_occupancy": 15}
    ]
    db.hospitals.insert_many(hospitals_data)
    
    # 3. Seed City Map (Intersections/Nodes)
    nodes_data = [{"node_id": node} for node in ["A", "B", "C", "D", "E", "F", "H1", "H2", "H3", "H4"]]
    db.map_nodes.insert_many(nodes_data)
    
    # 4. Seed Road Network (Edges & Travel Times)
    edges_data = [
        {"source": "A", "target": "B", "weight": 5.0},
        {"source": "A", "target": "C", "weight": 8.0},
        {"source": "B", "target": "D", "weight": 3.0},
        {"source": "C", "target": "D", "weight": 4.0},
        {"source": "C", "target": "E", "weight": 6.0},
        {"source": "D", "target": "F", "weight": 7.0},
        {"source": "E", "target": "F", "weight": 2.0},
        {"source": "B", "target": "H1", "weight": 2.0},
        {"source": "E", "target": "H2", "weight": 4.0},
        {"source": "F", "target": "H3", "weight": 3.0},
        {"source": "A", "target": "H4", "weight": 12.0}
    ]
    db.map_edges.insert_many(edges_data)
    
    print("Database successfully seeded with Hospitals AND the City Map! Jai Siya Ram.")

if __name__ == "__main__":
    seed_database()