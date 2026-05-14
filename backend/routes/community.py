from flask import Blueprint, request, jsonify
from models import db
from bson.objectid import ObjectId
import datetime

community_bp = Blueprint('community', __name__)
shared_trips_collection = db.shared_trips

@community_bp.route('/share', methods=['POST'])
def share_trip():
    data = request.json
    shared_trip = {
        "user_id": data.get('user_id'),
        "user_name": data.get('user_name'),
        "destination": data.get('destination'),
        "plan": data.get('plan'),
        "likes": 0,
        "comments": [],
        "created_at": datetime.datetime.utcnow()
    }
    result = shared_trips_collection.insert_one(shared_trip)
    return jsonify({"message": "Trip shared with community!", "id": str(result.inserted_id)}), 201

@community_bp.route('/all', methods=['GET'])
def get_community_trips():
    trips = list(shared_trips_collection.find().sort("created_at", -1))
    for t in trips:
        t['_id'] = str(t['_id'])
    return jsonify(trips)

@community_bp.route('/like/<trip_id>', methods=['POST'])
def like_trip(trip_id):
    shared_trips_collection.update_one(
        {"_id": ObjectId(trip_id)},
        {"$inc": {"likes": 1}}
    )
    return jsonify({"message": "Liked!"})
