import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, CloudRain, Wind, AlertTriangle, ShieldAlert, Navigation, Briefcase, Camera } from 'lucide-react';

export default function Explorer() {
  const [destination, setDestination] = useState("Paris");

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Smart Explorer</h1>
        <p className="text-gray-400">Intelligent insights for your next destination.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Weather Intelligence */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel p-8 bg-gradient-to-br from-blue-500/10 to-transparent">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-1">{destination}</h3>
                <p className="text-gray-400">Current Weather Conditions</p>
              </div>
              <Sun className="w-12 h-12 text-yellow-400" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <WeatherStat icon={<Sun className="w-4 h-4" />} label="Temp" value="24°C" />
              <WeatherStat icon={<CloudRain className="w-4 h-4" />} label="Rain" value="5%" />
              <WeatherStat icon={<Wind className="w-4 h-4" />} label="Wind" value="12 km/h" />
              <WeatherStat icon={<Navigation className="w-4 h-4" />} label="Visibility" value="10 km" />
            </div>

            <div className="mt-8 p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-xl flex items-center gap-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
              <p className="text-sm text-yellow-200 font-medium">Strong UV levels today. Don't forget your sunscreen!</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-accent" /> Packing Assistant
              </h3>
              <ul className="space-y-3">
                {['Light cotton clothes', 'Sunglasses', 'Power bank', 'Walking shoes', 'International adapter'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-panel p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Camera className="w-5 h-5 text-accent-purple" /> Photo Spots
              </h3>
              <ul className="space-y-3">
                {['Eiffel Tower (Sunrise)', 'Louvre Pyramid', 'Montmartre Steps', 'Seine River Banks'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-purple" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Safety & SOS */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-8 border-red-500/30 bg-red-500/5">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-400">
              <ShieldAlert className="w-6 h-6" /> Safety & SOS
            </h3>
            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
              Quick access to local emergency services in {destination}.
            </p>
            <div className="space-y-4 mb-10">
              <EmergencyContact label="Police" number="112" />
              <EmergencyContact label="Ambulance" number="15" />
              <EmergencyContact label="Fire" number="18" />
            </div>
            <button className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-3">
               SEND SOS ALERT
            </button>
          </div>

          <div className="glass-panel p-8">
            <h3 className="text-lg font-bold mb-4">Local Timing</h3>
            <div className="flex justify-between items-center text-gray-400 text-sm">
              <span>Current Time</span>
              <span className="font-bold text-white">02:45 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WeatherStat({ icon, label, value }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 text-gray-500 mb-1">
        {icon} <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function EmergencyContact({ label, number }) {
  return (
    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
      <span className="text-sm font-medium text-gray-300">{label}</span>
      <span className="text-lg font-bold text-red-400">{number}</span>
    </div>
  );
}
