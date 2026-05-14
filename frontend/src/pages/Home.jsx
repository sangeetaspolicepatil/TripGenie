import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Map as MapIcon, Activity, Compass, Globe } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
      <div className="text-center mb-16 md:mb-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs md:text-sm font-medium mb-6"
        >
          <Sparkles className="w-4 h-4" />
          <span>Next-Gen AI Travel Planning</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold mb-6 md:mb-8 leading-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          Your Perfect Trip,<br className="hidden md:block" /> Orchestrated by AI.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
        >
          Experience the future of travel planning. Custom itineraries, budget optimization, and real-time AI assistance for your next adventure.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link to="/plan" className="px-8 py-4 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2">
            Start Planning <MapIcon className="w-5 h-5" />
          </Link>
          <Link to="/register" className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center">
            Join Now
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-24">
        <FeatureCard 
          icon={<Sparkles className="w-6 h-6 text-accent" />}
          title="AI Itineraries"
          desc="Custom, human-like travel plans generated in seconds using advanced LLMs."
        />
        <FeatureCard 
          icon={<Activity className="w-6 h-6 text-accent-purple" />}
          title="Smart Tracking"
          desc="Real-time expense monitoring and budget optimization for your journeys."
        />
        <FeatureCard 
          icon={<MapIcon className="w-6 h-6 text-blue-400" />}
          title="Expert Explorer"
          desc="Live weather, safety alerts, and hidden gems curated for every location."
        />
      </div>

      {/* Popular Destinations */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold mb-10 text-center">Popular Adventures</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DestCard name="Kyoto" country="Japan" img="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e" />
          <DestCard name="Bali" country="Indonesia" img="https://images.unsplash.com/photo-1537996194471-e657df975ab4" />
          <DestCard name="Paris" country="France" img="https://images.unsplash.com/photo-1502602898657-3e91760cbb34" />
          <DestCard name="Iceland" country="Nordic" img="https://images.unsplash.com/photo-1504109586057-7a2ae83d1338" />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-panel p-8 group hover:border-accent/30 transition-all"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function DestCard({ name, country, img }) {
  return (
    <div className="glass-panel p-0 overflow-hidden group cursor-pointer border-transparent hover:border-accent/20 transition-all">
      <div className="h-48 relative">
        <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h4 className="text-lg font-bold text-white">{name}</h4>
          <p className="text-xs text-gray-300">{country}</p>
        </div>
      </div>
    </div>
  );
}
