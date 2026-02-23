# app/controllers/auth_controller.py

from flask import Blueprint, request, jsonify
from app.services.auth_service import AuthService

auth_bp = Blueprint('auth', __name__, url_prefix='/api/v1/auth')
auth_service = AuthService()

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json(force=True, silent=True)
        if not data or not all(k in data for k in ('username', 'email', 'password')):
            return jsonify({"status": "error", "message": "Missing required fields: username, email, password"}), 400

        auth_service.register_user(data['username'], data['email'], data['password'])
        
        return jsonify({"status": "success", "message": "User registered successfully."}), 201
        
    except ValueError as ve:
        return jsonify({"status": "error", "message": str(ve)}), 409 # 409 Conflict
    except Exception as e:
        return jsonify({"status": "error", "message": "Internal server error"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json(force=True, silent=True)
        if not data or not all(k in data for k in ('email', 'password')):
            return jsonify({"status": "error", "message": "Missing email or password."}), 400

        result = auth_service.login_user(data['email'], data['password'])
        
        return jsonify({"status": "success", "data": result}), 200
        
    except ValueError as ve:
        return jsonify({"status": "error", "message": str(ve)}), 401 # 401 Unauthorized
    except Exception as e:
        return jsonify({"status": "error", "message": "Internal server error"}), 500