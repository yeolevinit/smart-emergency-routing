# app/utils/auth_middleware.py

from functools import wraps
from flask import request, jsonify
import jwt
import os

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check if the Authorization header exists
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]

        if not token:
            return jsonify({"status": "error", "message": "Authentication token is missing."}), 401

        try:
            # Decode the token using our secret key
            secret = os.getenv('JWT_SECRET_KEY', 'fallback_secret')
            data = jwt.decode(token, secret, algorithms=["HS256"])
            current_user_id = data['user_id']
            
        except jwt.ExpiredSignatureError:
            return jsonify({"status": "error", "message": "Token has expired. Please log in again."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"status": "error", "message": "Invalid token. Authentication failed."}), 401

        # Pass the verified user ID to the protected route
        return f(current_user_id, *args, **kwargs)
    
    return decorated