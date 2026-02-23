# app/__init__.py

from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # 1. Register the original Routing Blueprint
    from app.controllers.routing_controller import routing_bp
    app.register_blueprint(routing_bp)
    
    # 2. Register the NEW Auth Blueprint
    from app.controllers.auth_controller import auth_bp
    app.register_blueprint(auth_bp)
    
    @app.route('/health', methods=['GET'])
    def health_check():
        return {"status": "healthy", "service": "Smart Emergency Routing System API"}

    return app