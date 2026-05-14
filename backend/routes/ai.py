from flask import Blueprint, request, jsonify
from groq import Groq
import os
import json
import concurrent.futures
from models import db, trips_collection
from utils.image_fetcher import get_place_image, get_unsplash_image
from utils.geo_weather import get_coordinates, get_weather
from utils.transport import get_real_transport_data

ai_bp = Blueprint('ai', __name__)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@ai_bp.route('/plan', methods=['POST'])
def plan_trip():
    data = request.json
    destination = data.get('destination')
    
    # Get Coordinates, Weather
    coords = get_coordinates(destination)
    weather_info = get_weather(coords["lat"], coords["lng"]) if coords else None
    image_url = get_unsplash_image(destination)
    
    # Get Real-time Transport Links
    transport_data = get_real_transport_data(data.get('fromLocation'), data.get('destination'), data.get('startDate'))
    
    prompt = f"""
    You are an intelligent AI Travel Agent and Real-Time Trip Planner.
    Generate a realistic, day-wise travel itinerary for the destination: {data.get('destination')}.
    
    The itinerary must feel like a real human-planned trip with proper timing, travel duration, food breaks, nearby attractions, and practical scheduling.

    ━━━━━━━━━━━━━━━
    🎯 CORE RULES
    ━━━━━━━━━━━━━━━
    1. Generate itinerary from 08:00 AM to 09:00 PM only.
    2. Include ONLY 3 to 4 places per day.
    3. Avoid overcrowding the schedule.
    4. Include: Breakfast, Lunch, Snacks, Dinner.
    5. Mention: Travel time between places, Suggested transport, Estimated budget, Entry fees.
    6. Prioritize: Nearby attractions together, Less travel time, Budget-friendly options, Realistic timing.
    7. Activities must match the place timing:
       - Morning → historical/nature spots
       - Afternoon → indoor/activity spots
       - Evening → sunset/night markets/beaches/cafes
    8. Do NOT randomly add places far away.
    9. If direct transport is available (flight/train/bus), show exact details in the travel_plan section.
    10. Use real place names only.

    ━━━━━━━━━━━━━━━
    ⏰ STRICT DAILY TIME STRUCTURE
    ━━━━━━━━━━━━━━━
    - 08:00 AM – 09:00 AM: Breakfast
    - 09:00 AM – 11:30 AM: Place 1 (Main attraction)
    - 11:30 AM – 01:00 PM: Place 2
    - 01:00 PM – 02:00 PM: Lunch
    - 02:00 PM – 04:30 PM: Place 3 (Activity / experience)
    - 04:30 PM – 05:00 PM: Snacks break
    - 05:00 PM – 07:30 PM: Place 4 (Evening / sunset / shopping / beach)
    - 07:30 PM – 09:00 PM: Dinner + Return to hotel

    ━━━━━━━━━━━━━━━
    💰 BUDGET FORMAT
    ━━━━━━━━━━━━━━━
    Classify the trip into: Budget, Mid-range, or Luxury based on user preference: {data.get('budget')}.
    For each day include: Food cost, Transport cost, Entry tickets, Activity cost, Total estimated daily budget.

    ━━━━━━━━━━━━━━━
    🚗 TRANSPORT & 🍽 FOOD RULES
    ━━━━━━━━━━━━━━━
    - Mention travel duration between places and best mode (Walk, Metro, Cab, Auto, Bus, Ferry).
    - Suggest famous local foods and budget-friendly restaurants nearby.

    TRIP CONTEXT:
    - Source: {data.get('fromLocation')}
    - Days: {data.get('days')}
    - Traveler Type: {data.get('travelType')}
    - Interests: {data.get('interests')}

    STRICT JSON OUTPUT FORMAT (Matches Frontend):
    {{
        "destination_info": "2-sentence summary",
        "stay_plan": {{
            "best_area_to_stay": "string",
            "budget_hostel": {{"name": "string", "price_range": "string", "booking_hint": "string"}},
            "mid_range_hotel": {{"name": "string", "price_range": "string", "booking_hint": "string"}},
            "luxury_hotel": {{"name": "string", "price_range": "string", "booking_hint": "string"}}
        }},
        "travel_plan": {{
            "flight": {{"available": bool, "details": "string", "cost": "string"}},
            "train": {{"available": bool, "details": "string", "cost": "string"}},
            "bus": {{"available": bool, "details": "string", "cost": "string"}}
        }},
        "food_plan": {{
            "must_try_dishes": ["string"],
            "famous_restaurants": ["string"]
        }},
        "itinerary": [
            {{
                "day": 1,
                "title": "Day Theme",
                "activities": [
                    {{
                        "time_slot": "08:00 AM – 09:00 AM",
                        "activity_type": "meal", 
                        "place": "Breakfast at [Restaurant Name]",
                        "description": "Famous for... Approx cost...",
                        "travel_time": "N/A",
                        "estimated_cost": "₹...",
                        "lat": 0.0,
                        "lng": 0.0,
                        "image_url": ""
                    }},
                    {{
                        "time_slot": "09:00 AM – 11:30 AM",
                        "activity_type": "attraction", 
                        "place": "[Place Name]",
                        "description": "Highlights... Entry fee...",
                        "travel_time": "...",
                        "estimated_cost": "₹...",
                        "lat": 0.0,
                        "lng": 0.0,
                        "image_url": ""
                    }}
                ],
                "daily_budget": {{"food": "₹...", "transport": "₹...", "tickets": "₹...", "total": "₹..."}}
            }}
        ],
        "travel_tips": ["string"],
        "packing_list": ["string"]
    }}
    Return ONLY valid JSON.
    """

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "system", "content": "You are a travel assistant that returns ONLY valid JSON and follows strict human-like planning rules."}, 
                      {"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        plan_json = json.loads(response.choices[0].message.content)
        
        plan_json["weather"] = weather_info
        plan_json["image_url"] = image_url
        plan_json["destination_coords"] = coords
        plan_json["real_time_transport"] = transport_data
        
        def fetch_image_for_activity(activity):
            # Extract clean place name (remove "Breakfast at " or descriptions)
            place_name = activity.get("place", destination).split(' at ')[-1]
            activity["image_url"] = get_unsplash_image(place_name + " " + destination)
            return activity
            
        activities_list = []
        if "itinerary" in plan_json:
            for day in plan_json["itinerary"]:
                if "activities" in day:
                    activities_list.extend(day["activities"])
                    
        if activities_list:
            with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
                executor.map(fetch_image_for_activity, activities_list)

        return jsonify(plan_json)
    except Exception as e:
        print("Error generating plan:", e)
        return jsonify({"error": "Failed to generate plan."}), 500
