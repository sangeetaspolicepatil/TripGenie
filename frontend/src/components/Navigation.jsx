import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Heart, LogOut, User, Map, Menu, X, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0d1117]/80 backdrop-blur-lg border-b border-white/5">
      <div className="flex items-center justify-between px-6 py-5 md:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-accent" onClick={() => setIsOpen(false)}>
          <Sparkles className="w-6 h-6" />
          <span>TripGenie</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/plan" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 font-medium">
            <Map className="w-4 h-4" /> Plan
          </Link>
          {user ? (
            <>
              <Link to="/saved" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 font-medium">
                <Heart className="w-4 h-4" /> Saved
              </Link>
              <div className="flex items-center gap-3 ml-4 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <User className="w-4 h-4 text-accent-purple" />
                <span className="text-sm font-semibold">{user.name}</span>
                <button onClick={handleLogout} className="ml-2 text-gray-400 hover:text-red-400 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="glass-btn px-6 font-medium">Login</Link>
              <Link to="/register" className="glass-btn-primary px-6 font-medium">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-gray-400 hover:text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-[#0d1117] border-b border-white/10 px-6 py-8 md:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-6">
              <Link 
                to="/plan" 
                className="text-lg font-medium text-gray-300 flex items-center gap-3"
                onClick={() => setIsOpen(false)}
              >
                <Map className="w-5 h-5 text-accent" /> Plan a Trip
              </Link>
              
              <Link 
                to="/explorer" 
                className="text-lg font-medium text-gray-300 flex items-center gap-3"
                onClick={() => setIsOpen(false)}
              >
                <Sparkles className="w-5 h-5 text-accent-purple" /> Explorer
              </Link>

              <Link 
                to="/community" 
                className="text-lg font-medium text-gray-300 flex items-center gap-3"
                onClick={() => setIsOpen(false)}
              >
                <Users className="w-5 h-5 text-blue-400" /> Community
              </Link>

              {user ? (
                <>
                  <Link 
                    to="/saved" 
                    className="text-lg font-medium text-gray-300 flex items-center gap-3"
                    onClick={() => setIsOpen(false)}
                  >
                    <Heart className="w-5 h-5 text-pink-400" /> My Saved Trips
                  </Link>

                  <Link 
                    to="/expenses" 
                    className="text-lg font-medium text-gray-300 flex items-center gap-3"
                    onClick={() => setIsOpen(false)}
                  >
                    <Map className="w-5 h-5 text-green-400" /> Expenses
                  </Link>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent-purple/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-accent-purple" />
                      </div>
                      <span className="font-bold">{user.name}</span>
                    </div>
                    <button onClick={handleLogout} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                  <Link to="/login" className="glass-btn py-4 text-lg" onClick={() => setIsOpen(false)}>Login</Link>
                  <Link to="/register" className="glass-btn-primary py-4 text-lg" onClick={() => setIsOpen(false)}>Create Account</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
