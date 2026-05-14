import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Layout, Map, Heart, Wallet, 
  Globe, Users, Settings, LogOut, ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  
  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Overview', path: '/' },
    { icon: <Layout className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Map className="w-5 h-5" />, label: 'Plan Trip', path: '/plan' },
    { icon: <Heart className="w-5 h-5" />, label: 'Saved Trips', path: '/saved' },
    { icon: <Wallet className="w-5 h-5" />, label: 'Expenses', path: '/expenses' },
    { icon: <Globe className="w-5 h-5" />, label: 'Community', path: '/community' },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isOpen ? 260 : 80 }}
      className="fixed left-0 top-0 bottom-0 bg-[#0d1117] border-r border-white/5 z-[60] hidden md:flex flex-col"
    >
      <div className="p-6 flex items-center justify-between">
        {isOpen && <span className="text-xl font-bold text-accent">TripGenie</span>}
        <button onClick={toggleSidebar} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <ChevronLeft className={`w-5 h-5 transition-transform ${!isOpen && 'rotate-180'}`} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path 
              ? 'bg-accent/10 text-accent' 
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {item.icon}
            {isOpen && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5">
        <Link to="/settings" className="flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white rounded-xl transition-colors">
          <Settings className="w-5 h-5" />
          {isOpen && <span className="font-medium">Settings</span>}
        </Link>
        <button className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors">
          <LogOut className="w-5 h-5" />
          {isOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
