import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');

  React.useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await axios.post(`http://127.0.0.1:5000${endpoint}`, form);
      
      if (isLogin) {
        login(res.data.user, res.data.token);
        navigate(location.state?.from || '/');
      } else {
        alert("Registration successful! Please login.");
        setIsLogin(true);
      }
    } catch (e) {
      alert(e.response?.data?.error || "Authentication failed");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex p-3 bg-accent/10 rounded-2xl text-accent mb-6">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
        <p className="text-gray-400">Join the future of travel planning.</p>
      </motion.div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="glass-panel p-8 space-y-6"
      >
        {!isLogin && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2 ml-1">
              <User className="w-4 h-4" /> Full Name
            </label>
            <input 
              required
              placeholder="John Doe"
              className="input-field"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400 flex items-center gap-2 ml-1">
            <Mail className="w-4 h-4" /> Email Address
          </label>
          <input 
            type="email"
            required
            placeholder="john@example.com"
            className="input-field"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400 flex items-center gap-2 ml-1">
            <Lock className="w-4 h-4" /> Password
          </label>
          <input 
            type="password"
            required
            placeholder="••••••••"
            className="input-field"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>
              {isLogin ? 'Login' : 'Sign Up'} <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="text-center text-sm">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-400 hover:text-accent transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
