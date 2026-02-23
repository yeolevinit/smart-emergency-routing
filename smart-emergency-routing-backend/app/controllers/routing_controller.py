# app/controllers/routing_controller.py

from flask import Blueprint, request, jsonify
from app.services.routing_service import RoutingService


routing_bp = Blueprint('routing', __name__, url_prefix='/api/v1')

# Initialize the service (It now builds itself securely from MongoDB)
routing_service = RoutingService()

@routing_bp.route('/locations', methods=['GET'])
def get_locations():
    """Returns valid ambulance starting locations for the frontend."""
    try:
        locations = routing_service.get_all_locations()
        return jsonify({"status": "success", "data": locations}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@routing_bp.route('/hospital/update-occupancy', methods=['PATCH'])
def update_occupancy():
    """Allows simulating real-time capacity changes."""
    try:
        data = request.get_json(force=True, silent=True)
        if not data or 'hospital_id' not in data or 'new_occupancy' not in data:
            return jsonify({"status": "error", "message": "Missing required fields"}), 400
            
        success = routing_service.update_hospital_occupancy(data['hospital_id'], data['new_occupancy'])
        if success:
            return jsonify({"status": "success", "message": "Occupancy updated successfully."}), 200
        return jsonify({"status": "error", "message": "Hospital not found or data unchanged."}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@routing_bp.route('/optimize-route', methods=['POST'])
def optimize_route():
    try:
        data = request.get_json(force=True, silent=True)
        if data is None:
            data = request.form.to_dict()

        if not data or 'ambulance_location' not in data:
            return jsonify({"status": "error", "message": "Missing 'ambulance_location'."}), 400
            
        ambulance_location = str(data['ambulance_location']).strip().upper()
        
        result = routing_service.find_optimal_hospital(ambulance_location)
        return jsonify({"status": "success", "data": result}), 200

    except ValueError as ve:
        return jsonify({"status": "error", "message": str(ve)}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500