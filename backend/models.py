from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

import certifi

try:
    ca = certifi.where()
    client = MongoClient(os.getenv("MONGODB_URI"), tlsCAFile=ca, serverSelectionTimeoutMS=5000)
    # Verify connection
    client.admin.command('ismaster')
    db = client.get_database() 
    print(f"SUCCESS: Connected to MongoDB Atlas - Database: {db.name}")
except Exception as e:
    print(f"CRITICAL ERROR: Could not connect to MongoDB Atlas: {e}")
    # Fallback to local MongoDB if available, otherwise fail
    try:
        client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=2000)
        client.admin.command('ismaster')
        db = client.get_database("TripGenie")
        print("WARNING: Using LOCAL MongoDB instead of Atlas.")
    except:
        import mongomock
        client = mongomock.MongoClient()
        db = client.get_database("TripGenie")
        print("WARNING: Using IN-MEMORY Database (mongomock). Data will NOT be persisted!")

# Collections
users_collection = db.users
trips_collection = db.trips
saved_trips_collection = db.saved_trips

def get_user_by_email(email):
    return users_collection.find_one({"email": email})

def create_user(user_data):
    return users_collection.insert_one(user_data)

def save_trip(trip_data):
    return trips_collection.insert_one(trip_data)

def get_trips_by_user(user_id):
    return list(trips_collection.find({"user_id": user_id}))

def delete_trip(trip_id, user_id):
    from bson.objectid import ObjectId
    return trips_collection.delete_one({"_id": ObjectId(trip_id), "user_id": user_id})
