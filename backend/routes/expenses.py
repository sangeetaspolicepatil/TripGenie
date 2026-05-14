from flask import Blueprint, request, jsonify
from models import db
from bson.objectid import ObjectId
import datetime

expenses_bp = Blueprint('expenses', __name__)
expenses_collection = db.expenses

@expenses_bp.route('/add', methods=['POST'])
def add_expense():
    data = request.json
    expense = {
        "user_id": data.get('user_id'),
        "trip_id": data.get('trip_id'),
        "category": data.get('category'),
        "amount": float(data.get('amount')),
        "description": data.get('description'),
        "date": datetime.datetime.utcnow()
    }
    result = expenses_collection.insert_one(expense)
    return jsonify({"message": "Expense added", "id": str(result.inserted_id)}), 201

@expenses_bp.route('/trip/<trip_id>', methods=['GET'])
def get_trip_expenses(trip_id):
    expenses = list(expenses_collection.find({"trip_id": trip_id}))
    for exp in expenses:
        exp['_id'] = str(exp['_id'])
    return jsonify(expenses)
