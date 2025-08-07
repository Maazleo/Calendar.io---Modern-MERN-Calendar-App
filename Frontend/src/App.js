import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user && <Navbar />}
        
        <div className="flex">
          {user && <Sidebar />}
          
          <main className={`flex-1 ${user ? 'ml-64' : ''}`}>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/calendar" 
                element={
                  <ProtectedRoute>
                    <Calendar />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Default redirect */}
              <Route 
                path="/" 
                element={
                  <Navigate to={user ? "/dashboard" : "/login"} replace />
                } 
              />
              
              {/* Catch all route */}
              <Route 
                path="*" 
                element={
                  <Navigate to={user ? "/dashboard" : "/login"} replace />
                } 
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App; 