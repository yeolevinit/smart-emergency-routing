# app/utils/db.py

import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

_MOCK_DB = None

def get_db():
    """
    Establishes a connection to MongoDB with an automatic mock fallback.
    """
    global _MOCK_DB
    uri = os.getenv("MONGO_URI")
    
    # Check if URI is present
    if not uri:
        if _MOCK_DB is None:
            print("[!] No MONGO_URI found in .env. Falling back to PERSISTENT Mock Database.")
            import mongomock
            _MOCK_DB = mongomock.MongoClient().smart_emergency_db
        return _MOCK_DB

    try:
        from pymongo import MongoClient
        from pymongo.errors import ConnectionFailure, ConfigurationError
        
        client = MongoClient(uri, serverSelectionTimeoutMS=2000)
        # Verify connection
        client.admin.command('ping') 
        return client.get_default_database()
    
    except (ConnectionFailure, ConfigurationError, Exception) as e:
        if _MOCK_DB is None:
            print(f"Error: Could not connect to MongoDB Atlas: {e}")
            print("Fallback: Using PERSISTENT Local Mock Database (In-Memory).")
            import mongomock
            _MOCK_DB = mongomock.MongoClient().smart_emergency_db
        return _MOCK_DB

