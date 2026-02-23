# seed_db.py

from app.utils.db import get_db

def seed_database():
    db = get_db()
    
    # 1. Clear existing data to prevent duplicates during testing
    db.hospitals.drop()
    
    # 2. Define the exact hospital data from our model
    hospitals_data = [
        {"hospital_id": "H1", "name": "Central Med", "capacity": 50, "current_occupancy": 45},
        {"hospital_id": "H2", "name": "City General", "capacity": 100, "current_occupancy": 20},
        {"hospital_id": "H3", "name": "Northside Care", "capacity": 30, "current_occupancy": 29},
        {"hospital_id": "H4", "name": "Southwest Clinic", "capacity": 40, "current_occupancy": 15}
    ]
    
    # 3. Insert into MongoDB
    db.hospitals.insert_many(hospitals_data)
    print("Database successfully seeded with hospital data! Jai Siya Ram.")

if __name__ == "__main__":
    seed_database()