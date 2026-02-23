# app/models/user.py

import datetime
import re

class User:
    def __init__(self, username: str, email: str, password_hash: str):
        """
        Industry-standard User model with data validation.
        """
        self.username = username.strip()
        self.email = email.strip().lower()
        self.password_hash = password_hash
        self.created_at = datetime.datetime.utcnow()
        
        self._validate()

    def _validate(self):
        """Ensures the data is clean before saving to the database."""
        if not self.username or len(self.username) < 3:
            raise ValueError("Username must be at least 3 characters long.")
            
        # Standard Regex for email validation
        email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        if not re.match(email_regex, self.email):
            raise ValueError("Invalid email format.")

    def to_db_dict(self) -> dict:
        """Serializes the object safely for MongoDB insertion."""
        return {
            "username": self.username,
            "email": self.email,
            "password": self.password_hash,
            "created_at": self.created_at
        }