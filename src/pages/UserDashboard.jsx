// src/pages/UserDashboard.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWork } from '../contexts/WorkContext';
import Header from '../components/Header';
import Timer from '../components/Timer';
import CheckInButton from '../components/CheckInButton';
import PaymentLog from '../components/PaymentLog';

const UserDashboard = () => {
  const { user, isUser } = useAuth();
  const { fetchStats, error, isCheckedIn } = useWork();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if not logged in as user
    if (!user || !isUser()) {
      navigate('/');
      return;
    }
    
    // Fetch latest stats
    fetchStats();
    
    // Set up interval to refresh stats periodically
    const interval = setInterval(() => {
      fetchStats();
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [user, isUser, navigate, fetchStats]);
  
  return (
    <div className="min-h-screen bg-dark relative">
      {/* Background grid pattern */}
      <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none"></div>
      
      <Header />
      
      <div className="pt-20 pb-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, <span className="text-primary">{user?.username}</span>
              </h1>
              <p className="text-gray-400">
                Track your time and get paid in Bitcoin
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-2">
              <div className={`rounded-full w-3 h-3 ${isCheckedIn ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
              <span className={`text-sm ${isCheckedIn ? 'text-green-500' : 'text-gray-500'}`}>
                {isCheckedIn ? 'Currently Working' : 'Not Working'}
              </span>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-900/30 border border-red-800 rounded-md px-4 py-3 text-sm text-red-300 mb-6">
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Timer />
              <CheckInButton />
            </div>
            
            <div className="flex flex-col space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Quick Stats</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-dark-lighter rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 rounded-md bg-blue-900/30 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-300">Last Session</span>
                    </div>
                    <span className="text-white font-medium">2h 15m</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-dark-lighter rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 rounded-md bg-primary/10 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-300">Last Payment</span>
                    </div>
                    <span className="text-primary-light font-medium">3 sats</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-dark-lighter rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 rounded-md bg-green-900/30 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-300">Completion Rate</span>
                    </div>
                    <span className="text-green-400 font-medium">98%</span>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Lightning Wallet
                </h2>
                <div className="bg-dark-lighter rounded-lg p-4 border border-dark-border">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-md flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 7H7v6h6V7z" />
                        <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Connected Wallet</div>
                      <div className="text-white font-medium">LNbits Node</div>
                    </div>
                  </div>
                  
                  <div className="bg-dark p-3 rounded border border-dark-border font-mono text-xs text-gray-400 break-all">
                    12167a02f43642c9a53132a2bf924fbf
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <PaymentLog />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-4">How It Works</h2>
              <ol className="space-y-3 text-gray-300">
                <li className="flex">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                  <span>Click the <strong className="text-white">Check In</strong> button to start tracking your work time.</span>
                </li>
                <li className="flex">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                  <span>The timer will track your working hours in real-time.</span>
                </li>
                <li className="flex">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                  <span>You'll earn <strong className="text-primary-light">3 sats</strong> per hour automatically.</span>
                </li>
                <li className="flex">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">4</span>
                  <span>Payments will be sent automatically every hour to your Lightning wallet.</span>
                </li>
                <li className="flex">
                  <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">5</span>
                  <span>Click <strong className="text-white">Check Out</strong> when you're done working.</span>
                </li>
              </ol>
            </div>
            
            <div className="card bg-gradient-to-br from-dark-card to-dark-lighter border-dark-border relative overflow-hidden">
              {/* Lightning bolt decorative element */}
              <div className="absolute -right-6 -bottom-6 text-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-xl font-semibold text-white mb-2">Hackathon Demo Notes</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    This application is a hackathon demo showcasing real-time Bitcoin payments for work using the Lightning Network.
                  </p>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm">
                      For this demo, hourly payments are happening on a faster timeline - you'll receive a payment every few minutes instead of hourly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;