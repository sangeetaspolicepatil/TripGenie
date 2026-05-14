import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../config';

export default function SavedTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchTrips = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/trips/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrips(res.data);
      } catch (e) {
        console.error("Error fetching trips:", e);
      }
      setLoading(false);
    };

    fetchTrips();
  }, [token, navigate]);

  const deleteTrip = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/trips/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrips(trips.filter(t => t._id !== id));
    } catch (e) {
      alert("Error deleting trip: " + e.message);
    }
  };

  const viewTrip = (trip) => {
    sessionStorage.setItem('currentPlan', JSON.stringify({ plan: trip.plan, form: trip.form_details }));
    navigate(`/trip/${trip._id}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
        <p className="text-gray-400">Loading your adventures...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Saved Adventures</h1>
        <p className="text-gray-400">Explore your past and future journeys.</p>
      </div>

      {trips.length === 0 ? (
        <div className="glass-panel p-20 text-center">
          <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4 text-gray-300">No trips saved yet</h2>
          <p className="text-gray-500 mb-8">Start planning your first dream vacation today!</p>
          <button onClick={() => navigate('/plan')} className="glass-btn-primary px-8">Plan a Trip</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, idx) => (
            <motion.div 
              key={trip._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-panel p-6 group hover:border-accent/30 transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-accent/10 rounded-xl text-accent">
                  <MapPin className="w-6 h-6" />
                </div>
                <button 
                  onClick={() => deleteTrip(trip._id)}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-xl font-bold mb-2">{trip.destination}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <Calendar className="w-4 h-4" />
                {trip.form_details?.startDate} to {trip.form_details?.endDate}
              </div>

              <div className="flex gap-3 mt-auto">
                <button 
                  onClick={() => viewTrip(trip)}
                  className="flex-1 glass-btn-primary py-2.5 text-sm gap-2"
                >
                  View Details <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
