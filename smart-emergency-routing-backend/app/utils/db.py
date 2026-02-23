# app/utils/db.py

import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

def get_db():
    """
    Establishes an industry-standard connection to MongoDB.
    Returns the database object.
    """
    uri = os.getenv("MONGO_URI", "mongodb+srv://ruleaiworld_db_user:WITqXWATKLi2k2WP@cluster0.qkqyzgj.mongodb.net/?appName=Cluster0")
    
    try:
        # connect=True forces immediate connection to catch errors early
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        client.admin.command('ping') # Verify connection
        return client.get_default_database()
    except ConnectionFailure:
        raise Exception("CRITICAL ERROR: Could not connect to MongoDB. Is your local server running?")