from flask import Blueprint, request, jsonify
import jwt
import os
from functools import wraps
from models import trips_collection, save_trip, get_trips_by_user, delete_trip
from bson.objectid import ObjectId

trips_bp = Blueprint('trips', __name__)

JWT_SECRET = os.getenv("JWT_SECRET", "fallback-secret")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            if token.startswith('Bearer '):
                token = token.split(' ')[1]
            data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            current_user_id = data['user_id']
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
        return f(current_user_id, *args, **kwargs)
    return decorated

@trips_bp.route('/save', methods=['POST'])
@token_required
def save(user_id):
    data = request.json
    trip_data = {
        "user_id": user_id,
        "destination": data.get('destination'),
        "plan": data.get('plan'),
        "form_details": data.get('form_details'),
        "created_at": ObjectId().generation_time
    }
    result = save_trip(trip_data)
    return jsonify({"message": "Trip saved successfully", "id": str(result.inserted_id)}), 201

@trips_bp.route('/all', methods=['GET'])
@token_required
def get_all(user_id):
    trips = get_trips_by_user(user_id)
    # Convert ObjectId to string for JSON serialization
    for trip in trips:
        trip['_id'] = str(trip['_id'])
    return jsonify(trips)

@trips_bp.route('/<trip_id>', methods=['DELETE'])
@token_required
def delete(user_id, trip_id):
    result = delete_trip(trip_id, user_id)
    if result.deleted_count:
        return jsonify({"message": "Trip deleted successfully"})
    return jsonify({"error": "Trip not found or unauthorized"}), 404
