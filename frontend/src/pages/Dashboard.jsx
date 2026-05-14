import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Map, Calendar, Wallet, Globe, 
  TrendingUp, Clock, ChevronRight, Star 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Dashboard() {
  const { user, token } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentTrips = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/trips/all", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrips(res.data.slice(0, 3));
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    if (token) fetchRecentTrips();
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}! ✈️</h1>
        <p className="text-gray-400">Your next adventure is just a few clicks away.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon={<Map className="text-accent" />} label="Trips Planned" value={trips.length} />
        <StatCard icon={<Globe className="text-accent-purple" />} label="Cities Explored" value="12" />
        <StatCard icon={<Wallet className="text-green-400" />} label="Budget Saved" value="₹15k" />
        <StatCard icon={<Star className="text-yellow-400" />} label="Experience Level" value="Pro" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Trips */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Recent Itineraries</h2>
            <Link to="/saved" className="text-accent text-sm font-medium hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {trips.length === 0 ? (
              <div className="glass-panel p-12 text-center">
                <p className="text-gray-500 mb-6">No trips planned yet.</p>
                <Link to="/plan" className="glass-btn-primary px-8">Create Your First Trip</Link>
              </div>
            ) : (
              trips.map((trip, idx) => (
                <motion.div 
                  key={trip._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-panel p-6 flex items-center justify-between group hover:border-accent/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                      <Calendar className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{trip.destination}</h3>
                      <p className="text-sm text-gray-400">{trip.form_details?.startDate} • {trip.form_details?.days} Days</p>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-accent transition-colors" />
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Smart Insights</h2>
          <div className="glass-panel p-8 bg-gradient-to-br from-accent/10 to-transparent">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" /> Trending Destinations
            </h3>
            <ul className="space-y-4">
              <TrendingItem name="Kyoto, Japan" growth="+120%" />
              <TrendingItem name="Bali, Indonesia" growth="+85%" />
              <TrendingItem name="Lisbon, Portugal" growth="+64%" />
            </ul>
          </div>

          <div className="glass-panel p-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent-purple" /> Next Planning Tip
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              "Booking your Paris flights 3 months in advance can save you up to 25% on peak season costs."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="glass-panel p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/5 rounded-xl">{icon}</div>
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function TrendingItem({ name, growth }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-300">{name}</span>
      <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded">{growth}</span>
    </div>
  );
}
