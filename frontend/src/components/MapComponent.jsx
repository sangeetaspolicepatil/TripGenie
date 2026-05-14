import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapComponent({ itinerary, destinationCoords, selectedDay }) {
  const [nearbyLayer, setNearbyLayer] = React.useState(null); // 'hotels', 'food', 'emergency'

  // Filter activities based on selectedDay
  const filteredDays = selectedDay ? itinerary.filter(d => d.day === selectedDay) : itinerary;
  const allActivities = filteredDays?.flatMap(day => day.activities || []) || [];
  
  const coords = allActivities
    .filter(act => act.lat && act.lng)
    .map(act => [act.lat, act.lng]);

  const center = coords.length > 0 ? coords[0] : [destinationCoords?.lat || 0, destinationCoords?.lng || 0];

  // Helper for custom icons
  const getIcon = (type) => {
    let color = '#58a6ff';
    if (type === 'meal') color = '#fb923c';
    if (type === 'stay') color = '#bb86fc';
    
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });
  };

  return (
    <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-0">
      {/* Nearby Overlay Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button 
          onClick={() => setNearbyLayer(nearbyLayer === 'hotels' ? null : 'hotels')}
          className={`p-2 rounded-lg backdrop-blur-md border text-xs font-bold transition-all ${nearbyLayer === 'hotels' ? 'bg-accent/20 border-accent text-accent' : 'bg-black/40 border-white/10 text-white'}`}
        >
          🏨 Nearby Hotels
        </button>
        <button 
          onClick={() => setNearbyLayer(nearbyLayer === 'food' ? null : 'food')}
          className={`p-2 rounded-lg backdrop-blur-md border text-xs font-bold transition-all ${nearbyLayer === 'food' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-black/40 border-white/10 text-white'}`}
        >
          🍽️ Food Spots
        </button>
        <button 
          onClick={() => setNearbyLayer(nearbyLayer === 'emergency' ? null : 'emergency')}
          className={`p-2 rounded-lg backdrop-blur-md border text-xs font-bold transition-all ${nearbyLayer === 'emergency' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-black/40 border-white/10 text-white'}`}
        >
          🚑 SOS / ATM
        </button>
      </div>

      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {allActivities.map((act, idx) => (
          act.lat && act.lng && (
            <Marker key={idx} position={[act.lat, act.lng]} icon={getIcon(act.activity_type)}>
              <Popup>
                <div className="text-black p-2 min-w-[150px]">
                  <p className="font-bold text-sm mb-1">{act.place}</p>
                  <p className="text-[10px] text-gray-500 mb-2">{act.time_slot}</p>
                  <button className="w-full bg-accent text-white text-[10px] py-1 rounded">Start Navigation</button>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        {coords.length > 1 && (
          <Polyline positions={coords} color="#58a6ff" weight={3} opacity={0.8} dashArray="5, 10" />
        )}

        {/* Mock Nearby Markers based on Layer */}
        {nearbyLayer === 'food' && coords.length > 0 && (
          <Marker position={[coords[0][0] + 0.005, coords[0][1] + 0.005]} icon={getIcon('meal')}>
            <Popup><span className="text-black font-bold">Local Gem Restaurant (Top Rated)</span></Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
