import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Create and export the hook
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user on load
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function for regular users
  const login = (role, username) => {
    const userData = { role, username };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  };

  // Admin login with password check
  const adminLogin = (password) => {
    if (password === 'admin123') {
      login('admin', 'admin');
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Helper functions
  const isAdmin = () => user?.role === 'admin';
  const isUser = () => user?.role === 'user';

  // Value to provide through context
  const value = {
    user,
    loading,
    login,
    adminLogin,
    logout,
    isAdmin,
    isUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};