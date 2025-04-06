import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsPage from './pages/AnalyticsPage';

const App = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // If auth is not available yet, show loading
  if (!auth) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-dark">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
  
  const { user, loading, isAdmin, isUser } = auth;
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-dark">
        <div className="flex flex-col items-center">
          <div className="relative">
            {/* Loading animation */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-primary animate-pulse" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="mt-4 text-white text-lg font-medium">
            Loading...
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-dark relative">
      {/* Background elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Background grid */}
        <div className="absolute inset-0 grid-bg opacity-5"></div>
        
        {/* Glow spots */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-primary/10 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-[100px]"></div>
        <div className="absolute top-2/3 right-1/3 w-48 h-48 bg-primary/10 rounded-full filter blur-[100px]"></div>
      </div>
      
      <Routes>
        <Route path="/" element={user ? (isAdmin() ? <Navigate to="/admin" /> : <Navigate to="/user" />) : <Login />} />
        <Route path="/user" element={user ? <UserDashboard /> : <Navigate to="/" />} />
        <Route path="/admin" element={user && isAdmin() ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/analytics" element={user ? <AnalyticsPage /> : <Navigate to="/" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

// 404 Not Found Page
const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 relative">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full filter blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-[100px] -z-10"></div>
      
      <div className="text-center relative z-10">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-20 w-20 text-primary" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-8">Page not found</p>
        <button 
          onClick={() => navigate('/')}
          className="btn bg-primary text-white px-8 py-3 rounded-lg shadow-lg hover:bg-primary-dark transition-colors"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default App;