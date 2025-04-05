import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  const { user, loading, isAdmin, isUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Redirect based on auth status
    if (!loading) {
      if (!user && location.pathname !== '/') {
        navigate('/');
      } else if (user && location.pathname === '/') {
        if (isAdmin()) {
          navigate('/admin');
        } else if (isUser()) {
          navigate('/user');
        }
      }
    }
  }, [loading, user, isAdmin, isUser, navigate, location.pathname]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-dark">
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-primary animate-pulse" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl -z-10"></div>
          </div>
          <div className="mt-4 text-white text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }
  
  return (
    <Routes>
      <Route path="/" element={user ? (isAdmin() ? <Navigate to="/admin" /> : <Navigate to="/user" />) : <Login />} />
      <Route path="/user" element={isUser() ? <UserDashboard /> : <Navigate to="/" />} />
      <Route path="/admin" element={isAdmin() ? <AdminDashboard /> : <Navigate to="/" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// 404 Not Found Page
const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-primary" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl -z-10"></div>
          </div>
        </div>
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-8">Page not found</p>
        <button 
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default App;