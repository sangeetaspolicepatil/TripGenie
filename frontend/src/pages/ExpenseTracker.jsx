import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, PieChart, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../config';

export default function ExpenseTracker() {
  const { user, token } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ category: 'Food', amount: '', description: '' });

  const categories = ['Food', 'Transport', 'Stay', 'Activities', 'Shopping', 'Other'];

  useEffect(() => {
    // Fetch expenses for current trip (simplified for now)
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/expenses/trip/latest`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExpenses(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchExpenses();
  }, [token]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/expenses/add`, {
        ...form,
        user_id: user.id,
        trip_id: 'latest' // Simplified
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses([...expenses, { ...form, _id: res.data.id, date: new Date().toISOString() }]);
      setShowAdd(false);
      setForm({ category: 'Food', amount: '', description: '' });
    } catch (e) {
      alert("Error adding expense");
    }
  };

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-white">Expense Tracker</h1>
          <p className="text-gray-400">Keep your trip budget under control with real-time tracking.</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="glass-btn-primary px-6 py-3 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Expense
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Stats Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-8 bg-gradient-to-br from-accent/20 to-transparent">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-accent/10 rounded-xl text-accent">
                <Wallet className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-gray-400 uppercase font-bold tracking-wider">Total Spent</p>
                <h2 className="text-4xl font-bold">₹{total.toLocaleString()}</h2>
              </div>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-accent" style={{ width: '65%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-4">65% of your ₹50,000 budget used</p>
          </div>

          <div className="glass-panel p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-accent-purple" /> Breakdown
            </h3>
            <div className="space-y-4">
              {categories.map(cat => {
                const catTotal = expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
                const perc = total > 0 ? (catTotal / total) * 100 : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{cat}</span>
                      <span className="text-white font-medium">₹{catTotal}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-purple" style={{ width: `${perc}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div className="lg:col-span-2 space-y-6">
          {showAdd && (
            <motion.form 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleAdd}
              className="glass-panel p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-accent/30"
            >
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                <select 
                  className="input-field py-2"
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Amount</label>
                <input 
                  required type="number" 
                  className="input-field py-2"
                  value={form.amount}
                  onChange={e => setForm({...form, amount: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                <input 
                  className="input-field py-2"
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                />
              </div>
              <button type="submit" className="glass-btn-primary py-2 px-4">Save</button>
            </motion.form>
          )}

          <div className="glass-panel overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center text-gray-500 italic">No expenses logged yet.</td>
                  </tr>
                ) : (
                  expenses.map(exp => (
                    <tr key={exp._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(exp.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-accent/10 text-accent text-[10px] font-bold rounded uppercase">
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{exp.description}</td>
                      <td className="px-6 py-4 text-sm font-bold text-white text-right">₹{exp.amount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
