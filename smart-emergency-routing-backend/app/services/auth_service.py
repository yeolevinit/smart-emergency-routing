# app/services/auth_service.py

import jwt
import datetime
import os
from werkzeug.security import generate_password_hash, check_password_hash
from app.utils.db import get_db
from app.models.user import User  # <--- Importing our new model

class AuthService:
    def __init__(self):
        self.db = get_db()
        self.secret = os.getenv('JWT_SECRET_KEY', 'fallback_secret')

    def register_user(self, username: str, email: str, password: str) -> str:
        """Hashes the password, creates a User model, and saves to MongoDB."""
        
        if self.db.users.find_one({"email": email.strip().lower()}):
            raise ValueError("A user with this email already exists.")

        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters long.")

        # Hash the password securely
        hashed_password = generate_password_hash(password)
        
        # Create the User object (This triggers the validation in the model)
        new_user = User(username=username, email=email, password_hash=hashed_password)
        
        # Save to database using the model's clean dictionary
        result = self.db.users.insert_one(new_user.to_db_dict())
        return str(result.inserted_id)

    def login_user(self, email: str, password: str) -> dict:
        """Verifies credentials and generates a 24-hour JWT."""
        user_record = self.db.users.find_one({"email": email.strip().lower()})
        
        if not user_record or not check_password_hash(user_record['password'], password):
            raise ValueError("Invalid email or password.")

        token_payload = {
            'user_id': str(user_record['_id']),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        token = jwt.encode(token_payload, self.secret, algorithm="HS256")

        return {
            "token": token,
            "user": {
                "username": user_record['username'], 
                "email": user_record['email']
            }
        }