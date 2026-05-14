import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, MessageCircle, Share2, Globe, TrendingUp } from 'lucide-react';
import axios from 'axios';

export default function Community() {
  const [activeTab, setActiveTab] = useState('itineraries');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/community/all");
        setTrips(res.data);
      } catch (e) {
        console.error("Error fetching community:", e);
      }
      setLoading(false);
    };
    fetchCommunity();
  }, []);

  const handleLike = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:5000/community/like/${id}`);
      setTrips(trips.map(t => t._id === id ? { ...t, likes: (t.likes || 0) + 1 } : t));
    } catch (e) {
      console.error(e);
    }
  };

  const communityTrips = trips.length > 0 ? trips : [
    { _id: '1', user_name: "Elena", destination: "Kyoto, Japan", likes: 245, comments: 18, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e" },
    { _id: '2', user_name: "Marcus", destination: "Iceland Roadtrip", likes: 512, comments: 42, image: "https://images.unsplash.com/photo-1504109586057-7a2ae83d1338" },
    { _id: '3', user_name: "Sarah", destination: "Bali Retreat", likes: 189, comments: 12, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Travel Community</h1>
          <p className="text-gray-400">Connect with fellow travelers and discover inspired journeys.</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button 
            onClick={() => setActiveTab('itineraries')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'itineraries' ? 'bg-accent text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Itineraries
          </button>
          <button 
            onClick={() => setActiveTab('memories')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'memories' ? 'bg-accent text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Memories
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Trending */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" /> Trending Now
            </h3>
            <div className="space-y-4">
              {['#Japan2024', '#IcelandAdventure', '#DigitalNomad', '#BaliLife'].map(tag => (
                <div key={tag} className="flex justify-between items-center group cursor-pointer">
                  <span className="text-gray-400 group-hover:text-accent transition-colors">{tag}</span>
                  <span className="text-[10px] font-bold text-gray-600">2.4k posts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 bg-accent/5 border-accent/20">
            <h3 className="text-lg font-bold mb-4">New to Community?</h3>
            <p className="text-sm text-gray-400 mb-6">Share your first itinerary and get inspired by others.</p>
            <button className="w-full glass-btn-primary py-3 text-sm">Join the Discussion</button>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-3">
          <div className="grid md:grid-cols-2 gap-6">
            {communityTrips.map((trip, idx) => (
              <motion.div 
                key={trip._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel overflow-hidden group"
              >
                <div className="h-48 relative overflow-hidden">
                  <img src={trip.image || "https://images.unsplash.com/photo-1504109586057-7a2ae83d1338"} alt={trip.destination} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <Globe className="w-3 h-3 text-accent" /> {trip.destination}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs uppercase">
                      {(trip.user_name || trip.user || "?")[0]}
                    </div>
                    <span className="font-bold text-sm">{trip.user_name || trip.user}</span>
                  </div>
                  <h4 className="text-xl font-bold mb-4">{(trip.user_name || trip.user)}'s {trip.destination.split(',')[0]} Itinerary</h4>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleLike(trip._id)}
                        className="flex items-center gap-1 text-gray-500 hover:text-pink-500 transition-colors"
                      >
                        <Heart className="w-4 h-4" /> <span className="text-xs font-bold">{trip.likes || 0}</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-accent transition-colors">
                        <MessageCircle className="w-4 h-4" /> <span className="text-xs font-bold">{(trip.comments || []).length || trip.comments || 0}</span>
                      </button>
                    </div>
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
