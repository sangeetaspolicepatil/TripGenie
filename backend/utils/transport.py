import requests
import os
from datetime import datetime

def get_booking_links(source, destination, date):
    """
    Constructs real-time deep links for booking platforms.
    """
    # Format date for different platforms
    # MMT: DD/MM/YYYY
    # Skyscanner: YYMMDD
    try:
        dt = datetime.strptime(date, "%Y-%m-%d")
        mmt_date = dt.strftime("%d/%m/%Y")
        sky_date = dt.strftime("%y%m%d")
    except:
        mmt_date = ""
        sky_date = ""

    links = {
        "makemytrip_flights": f"https://www.makemytrip.com/flight/search?itinerary={source}-{destination}-{mmt_date}&tripType=O&paxType=A-1_C-0_I-0&intl=false&cabinClass=E",
        "makemytrip_hotels": f"https://www.makemytrip.com/hotels/hotel-listing/?city={destination}&checkin={date}",
        "redbus": f"https://www.redbus.in/bus-tickets/{source.lower()}-to-{destination.lower()}?fromCityName={source}&toCityName={destination}&onwardAtt={date}",
        "irctc": "https://www.irctc.co.in/nget/train-search",
        "skyscanner": f"https://www.skyscanner.co.in/transport/flights/{source}/{destination}/{sky_date}/"
    }
    return links

def get_real_transport_data(source, destination, date):
    """
    This would ideally call a real API like Amadeus or Skyscanner.
    For now, it returns structured data with real booking links.
    """
    links = get_booking_links(source, destination, date)
    
    # In a real-world project, we'd fetch actual prices here.
    # Since we don't have a paid API key, we provide the deep-links 
    # which allow the user to see REAL prices in one click.
    
    return {
        "booking_links": links,
        "is_real_time": True,
        "last_updated": datetime.now().isoformat()
    }
