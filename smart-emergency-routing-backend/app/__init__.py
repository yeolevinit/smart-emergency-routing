# app/__init__.py

from flask import Flask
from flask_cors import CORS

def create_app():
    """Application Factory Pattern for standard enterprise Flask apps."""
    app = Flask(__name__)
    
    # Enable CORS so React can communicate with this API safely
    CORS(app)
    
    # Register API Blueprints
    from app.controllers.routing_controller import routing_bp
    app.register_blueprint(routing_bp)
    
    # Basic health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        return {"status": "healthy", "service": "Smart Emergency Routing System API"}

    return app