import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, adminLogin } = useAuth();
  const navigate = useNavigate();

  // Background animation state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isAdmin) {
        // Admin login requires password
        if (adminLogin(password)) {
          navigate('/admin');
        } else {
          setError('Invalid admin password');
        }
      } else {
        // Simple user login
        if (username.trim()) {
          login('user', username);
          navigate('/user');
        } else {
          setError('Username is required');
        }
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Simple Debug Login Modal
  const handleDebugLogin = (role) => {
    if (role === 'admin') {
      adminLogin('admin123');
      navigate('/admin');
    } else {
      login('user', 'debug-user');
      navigate('/user');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark relative overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background grid and glow effect */}
      <div className="absolute inset-0 grid-bg opacity-10"></div>
      <div 
        className="absolute bg-primary/5 blur-[100px] rounded-full w-[500px] h-[500px] -z-10"
        style={{
          left: `${mousePosition.x - 250}px`,
          top: `${mousePosition.y - 250}px`,
          transition: 'left 1s ease-out, top 1s ease-out',
        }}
      ></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="relative">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-16 w-16 text-primary animate-bolt" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl -z-10"></div>
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-extrabold text-white">
            Lightning<span className="text-primary">Time</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Track your work time and get paid instantly in Bitcoin
          </p>
        </div>
        
        <div className="mt-8 card relative backdrop-blur-sm">
          {/* Shimmering border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary-light/30 rounded-xl blur-sm"></div>
          <div className="relative card border-dark-border">
            {/* Login type selection tabs */}
            <div className="flex mb-6 bg-dark-lighter rounded-lg p-1">
              <button
                type="button"
                onClick={() => setIsAdmin(false)}
                className={`flex-1 py-2 px-3 rounded-md transition-colors duration-200 text-sm font-medium ${
                  !isAdmin ? 'bg-primary text-white shadow-md' : 'bg-transparent text-gray-400 hover:text-white'
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setIsAdmin(true)}
                className={`flex-1 py-2 px-3 rounded-md transition-colors duration-200 text-sm font-medium ${
                  isAdmin ? 'bg-primary text-white shadow-md' : 'bg-transparent text-gray-400 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {!isAdmin && (
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                    Username
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                      required
                      className="input pr-10"
                      placeholder="Enter your username"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              
              {isAdmin && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Admin Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                      className="input pr-10"
                      placeholder="Enter admin password"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="bg-red-900/30 border border-red-800 rounded-md px-4 py-3 text-sm text-red-300">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white py-3 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-300"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    <>
                      {isAdmin ? 'Admin Login' : 'Start Working'}
                    </>
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="h-px bg-dark-border flex-grow"></div>
              <span className="px-4 text-xs text-gray-500">Hackathon Demo</span>
              <div className="h-px bg-dark-border flex-grow"></div>
            </div>
            
            <div className="mt-4 text-center text-xs text-gray-500">
              <p>For admin login, use <span className="text-primary-light font-mono">admin123</span></p>
            </div>
            
            {/* Debug Mode Quick Login */}
            <div className="mt-6 pt-4 border-t border-dark-border">
              <p className="text-center text-xs text-gray-500 mb-3">Debug Mode</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDebugLogin('user')}
                  className="flex-1 px-3 py-2 bg-dark-lighter text-gray-300 rounded hover:bg-dark-border text-xs transition-colors"
                >
                  Quick User Login
                </button>
                <button 
                  onClick={() => handleDebugLogin('admin')}
                  className="flex-1 px-3 py-2 bg-dark-lighter text-gray-300 rounded hover:bg-dark-border text-xs transition-colors"
                >
                  Quick Admin Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;