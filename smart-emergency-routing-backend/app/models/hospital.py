# app/models/hospital.py

class Hospital:
    def __init__(self, hospital_id: str, name: str, capacity: int, current_occupancy: int):
        """
        Industry-standard representation of a Hospital entity.
        Validates data on instantiation to prevent runtime crashes.
        """
        if capacity <= 0:
            raise ValueError(f"Hospital capacity must be greater than 0. Received: {capacity}")
        if current_occupancy < 0:
            raise ValueError("Occupancy cannot be negative.")
            
        self.hospital_id = hospital_id
        self.name = name
        self.capacity = capacity
        self.current_occupancy = current_occupancy

    @property
    def occupancy_ratio(self) -> float:
        """Calculates the Oh (Occupancy Ratio)."""
        return self.current_occupancy / self.capacity

    def calculate_waiting_time(self, alpha: float = 10.0) -> float:
        """
        Calculates the estimated waiting time based on current occupancy.
        This represents the alpha * Oh portion of the mathematical model.
        Returns waiting time in minutes.
        """
        # If the hospital is overflowing, the wait time spikes exponentially
        if self.current_occupancy >= self.capacity:
            return float('inf') 
            
        return alpha * self.occupancy_ratio

    def to_dict(self) -> dict:
        """Serializes the object for the Flask JSON response."""
        return {
            "id": self.hospital_id,
            "name": self.name,
            "capacity": self.capacity,
            "current_occupancy": self.current_occupancy,
            "waiting_time_mins": round(self.calculate_waiting_time(), 2)
        }