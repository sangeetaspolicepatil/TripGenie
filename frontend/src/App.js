import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import PlanTrip from './pages/PlanTrip';
import TripDetails from './pages/TripDetails';
import SavedTrips from './pages/SavedTrips';
import Auth from './pages/Auth';
import Explorer from './pages/Explorer';
import ExpenseTracker from './pages/ExpenseTracker';
import Community from './pages/Community'; 
import Dashboard from './pages/Dashboard';

// Components
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex">
      {user && <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />}
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${user && (sidebarOpen ? 'md:ml-[260px]' : 'md:ml-[80px]')}`}>
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plan" element={<PlanTrip />} />
            <Route path="/trip/:id" element={<TripDetails />} />
            <Route path="/saved" element={<ProtectedRoute><SavedTrips /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute><ExpenseTracker /></ProtectedRoute>} />
            <Route path="/community" element={<Community />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}