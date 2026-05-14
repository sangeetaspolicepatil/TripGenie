import requests
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

geolocator = Nominatim(user_agent="tripgenie_ai_planner")

def get_coordinates(city_name):
    try:
        location = geolocator.geocode(city_name)
        if location:
            return {"lat": location.latitude, "lng": location.longitude}
    except GeocoderTimedOut:
        pass
    return None

def get_weather(lat, lng):
    if not lat or not lng:
        return None
    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current_weather=true"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data.get("current_weather")
    except Exception:
        pass
    return None
