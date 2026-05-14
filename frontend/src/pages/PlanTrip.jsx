import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Wallet, Compass, Plane, Sparkles, Activity } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config';

export default function PlanTrip() {
  const [form, setForm] = useState({
    fromLocation: "", destination: "", budget: "", startDate: "", endDate: "", 
    travelType: "Couple", interests: "Nature, Culture", transportPreference: "Public Transport", stay: "Mid-range"

  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const calculateDays = () => {
    if (!form.startDate || !form.endDate) return 3;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
    return diffDays > 0 ? diffDays : 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const days = calculateDays();
    try {
      const res = await axios.post(`${API_BASE_URL}/ai/plan`, { ...form, days });
      // Store current plan in session storage or state management to pass to Details page
      sessionStorage.setItem('currentPlan', JSON.stringify({ plan: res.data, form: { ...form, days } }));
      navigate('/trip/new');
    } catch (e) {
      alert("Error generating plan: " + e.message);
    }
    setLoading(false);
  };


  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Start Your Journey</h1>
        <p className="text-gray-400">Fill in the details below and let TripGenie work its magic.</p>
      </motion.div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="glass-panel p-8 space-y-8"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2 ml-1">
              <MapPin className="w-4 h-4" /> From
            </label>
            <input 
              required
              placeholder="e.g. New York, USA"
              className="input-field"
              value={form.fromLocation}
              onChange={e => setForm({...form, fromLocation: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2 ml-1 text-accent-purple">
              <MapPin className="w-4 h-4" /> To
            </label>
            <input 
              required
              placeholder="e.g. Paris, France"
              className="input-field"
              value={form.destination}
              onChange={e => setForm({...form, destination: e.target.value})}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2 ml-1">
              <Calendar className="w-4 h-4" /> Start Date
            </label>
            <input 
              type="date"
              required
              className="input-field"
              value={form.startDate}
              onChange={e => setForm({...form, startDate: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2 ml-1">
              <Calendar className="w-4 h-4" /> End Date
            </label>
            <input 
              type="date"
              required
              className="input-field"
              value={form.endDate}
              onChange={e => setForm({...form, endDate: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2 ml-1">
              <Wallet className="w-4 h-4" /> Budget (₹)
            </label>
            <input 
              type="number"
              required
              placeholder="50000"
              className="input-field"
              value={form.budget}
              onChange={e => setForm({...form, budget: e.target.value})}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2 ml-1">
              <Compass className="w-4 h-4" /> Travel Type
            </label>
            <div className="flex flex-wrap gap-3">
              {["Solo", "Couple", "Family", "Friends", "Luxury", "Student"].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({...form, travelType: t})}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${
                    form.travelType === t 
                    ? "bg-accent border-accent text-white" 
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2 ml-1 text-accent">
              <Plane className="w-4 h-4" /> Transport Preference
            </label>
            <div className="flex gap-3">
              {["Public Transport", "Private Vehicle"].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({...form, transportPreference: t})}
                  className={`flex-1 px-4 py-2 rounded-full border text-sm transition-all ${
                    form.transportPreference === t 
                    ? "bg-accent border-accent text-white" 
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>


        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-accent to-accent-purple text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-accent/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? <Activity className="w-6 h-6 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Generate Magic Trip</>}
        </button>
      </motion.form>
    </div>
  );
}
