# app/controllers/routing_controller.py

from flask import Blueprint, request, jsonify
from app.services.routing_service import RoutingService
from app.utils.mock_data import get_mock_city_graph, get_mock_hospitals

# Initialize the Flask Blueprint
routing_bp = Blueprint('routing', __name__, url_prefix='/api/v1')

# Initialize data and service (In a real app, this would query a database)
city = get_mock_city_graph()
hospitals = get_mock_hospitals()
routing_service = RoutingService(city_graph=city, hospitals=hospitals)

@routing_bp.route('/optimize-route', methods=['POST'])
def optimize_route():
    """
    POST endpoint for React to request the optimal route.
    Expected JSON payload: {"ambulance_location": "A"}
    """
    try:
        data = request.get_json()
        
        if not data or 'ambulance_location' not in data:
            return jsonify({"status": "error", "message": "Missing 'ambulance_location' in request body."}), 400
            
        ambulance_location = data['ambulance_location'].upper()
        
        # Call the Decision Engine
        result = routing_service.find_optimal_hospital(ambulance_location)
        
        return jsonify({
            "status": "success",
            "data": result
        }), 200

    except ValueError as ve:
        return jsonify({"status": "error", "message": str(ve)}), 404
    except Exception as e:
        # Catch-all for unexpected server errors to prevent crashing
        return jsonify({"status": "error", "message": f"An internal server error occurred: {str(e)}"}), 500