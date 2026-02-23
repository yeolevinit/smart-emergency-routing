from flask import Blueprint, request, jsonify
from app.services.routing_service import RoutingService
from app.utils.mock_data import get_mock_city_graph, get_mock_hospitals

# 1. Initialize the Flask Blueprint
routing_bp = Blueprint('routing', __name__, url_prefix='/api/v1')

# 2. Initialize data and service
city = get_mock_city_graph()
hospitals = get_mock_hospitals()
routing_service = RoutingService(city_graph=city, hospitals=hospitals)

# 3. Define the API Endpoint
@routing_bp.route('/optimize-route', methods=['POST'])
def optimize_route():
    try:
        # force=True forces Flask to parse JSON even if the Content-Type header is missing
        # silent=True prevents it from crashing if the JSON is completely broken
        data = request.get_json()
        print("Incoming Data:", data)
        
        # Fallback: If Postman sent it as Form Data instead of Raw JSON
        if data is None:
            data = request.form.to_dict()

        # If it is STILL empty, the user literally sent nothing.
        if not data:
            return jsonify({
                "status": "error", 
                "message": "No data received. Please send RAW JSON exactly like this: {\"ambulance_location\": \"A\"}"
            }), 400
            
        if 'ambulance_location' not in data:
            return jsonify({
                "status": "error", 
                "message": "Missing 'ambulance_location'. Payload must be exactly: {\"ambulance_location\": \"A\"}"
            }), 400
            
        # Clean the input (remove spaces, make uppercase)
        ambulance_location = str(data['ambulance_location']).strip().upper()
        
        # Call the Decision Engine
        result = routing_service.find_optimal_hospital(ambulance_location)
        
        return jsonify({
            "status": "success",
            "data": result
        }), 200

    except ValueError as ve:
        return jsonify({"status": "error", "message": str(ve)}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": f"An internal server error occurred: {str(e)}"}), 500