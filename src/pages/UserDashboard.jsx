import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWork } from '../contexts/WorkContext';
import Header from '../components/Header';
import Timer from '../components/Timer';
import CheckInButton from '../components/CheckInButton';
import PaymentLog from '../components/PaymentLog';
import AIAnalytics from '../components/AIAnalytics';

const UserDashboard = () => {
  const { user, isUser } = useAuth();
  const { fetchStats, error, isCheckedIn, stats, getFormattedTime } = useWork();
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
    <div className="min-h-screen bg-dark relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Background grid */}
        <div className="absolute inset-0 grid-bg opacity-5"></div>
        
        {/* Glow spots */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-primary/10 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-[100px]"></div>
        <div className="absolute top-2/3 right-1/3 w-48 h-48 bg-primary/10 rounded-full filter blur-[100px]"></div>
      </div>
      
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
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-2 p-2 bg-dark-lighter/50 backdrop-blur-sm rounded-lg border border-dark-border/50 shadow-lg">
              <div className={`rounded-full w-3 h-3 ${isCheckedIn ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
              <span className={`text-sm ${isCheckedIn ? 'text-green-400' : 'text-gray-500'}`}>
                {isCheckedIn ? 'Currently Working' : 'Not Working'}
              </span>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-900/30 border border-red-800 rounded-md px-4 py-3 text-sm text-red-300 mb-6 animate-fadeIn">
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
              
              <div className="mt-6 p-4 rounded-lg bg-dark-lighter/50 border border-dark-border/50 backdrop-blur-sm">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-300">
                    For this demo, payments are processed every 30 seconds instead of hourly.
                    {stats.userWalletBalance ? ` Your current wallet balance is ${stats.userWalletBalance} sats.` : ''}
                  </p>
                </div>
              </div>
              
              {/* AI Analytics Component */}
              <div className="mt-6">
                <AIAnalytics />
              </div>
            </div>
            
            <div className="flex flex-col space-y-6">
              {/* Quick Stats Card */}
              <div className="card bg-dark-card border border-dark-border/50 hover:shadow-lg transition-all duration-300">
                <h2 className="text-xl font-semibold text-white mb-4">Quick Stats</h2>
                
                <div className="space-y-4">
                  {/* Session Stat */}
                  <div className="p-3 bg-dark-lighter/60 rounded-lg border border-dark-border/50 hover:border-primary/20 transition-colors flex justify-between items-center group">
                    <div className="flex items-center">
                      <div className="p-2 rounded-md bg-blue-900/30 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-300">Current Session</span>
                    </div>
                    <span className="text-white font-medium">{getFormattedTime()}</span>
                  </div>
                  
                  {/* Payment Stat */}
                  <div className="p-3 bg-dark-lighter/60 rounded-lg border border-dark-border/50 hover:border-primary/20 transition-colors flex justify-between items-center group">
                    <div className="flex items-center">
                      <div className="p-2 rounded-md bg-primary/10 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-300">Total Earned</span>
                    </div>
                    <span className="text-white font-medium">{stats.totalSatsPaid} sats</span>
                  </div>
                  
                  {/* Hourly Rate */}
                  <div className="p-3 bg-dark-lighter/60 rounded-lg border border-dark-border/50 hover:border-primary/20 transition-colors flex justify-between items-center group">
                    <div className="flex items-center">
                      <div className="p-2 rounded-md bg-pink-900/20 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <span className="text-gray-300">Hourly Rate</span>
                    </div>
                    <span className="text-white font-medium">{stats.hourlyRate} sats/hr</span>
                  </div>
                </div>
              </div>
              
              {/* Lightning Wallet Card */}
              <div className="card bg-dark-card border border-dark-border/50 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-white">Lightning Wallet</h2>
                  
                  <div className="px-2 py-1 rounded-full text-xs bg-green-900/30 text-green-400 flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 mr-1.5"></span>
                    Connected
                  </div>
                </div>
                
                <div className="bg-dark-lighter/60 backdrop-blur-sm rounded-lg p-4 border border-dark-border/50 transition-all duration-300 hover:border-primary/20">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-md flex items-center justify-center mr-3 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 7H7v6h6V7z" />
                        <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Connected Wallet</div>
                      <div className="text-white font-medium">LNbits Node</div>
                    </div>
                  </div>
                  
                  <div className="bg-dark p-3 rounded border border-dark-border/70 font-mono text-xs text-gray-400 break-all transition-all duration-300 hover:bg-dark-lighter/20 hover:border-primary/20">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary-light/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      12167a02f43642c9a53132a2bf924fbf
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-400">Current Balance:</span>
                    <span className="text-sm text-primary-light font-medium">
                      {stats.userWalletBalance !== undefined ? `${stats.userWalletBalance} sats` : 'Loading...'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-end">
                  <Link 
                    to="/analytics" 
                    className="text-xs flex items-center text-primary hover:text-primary-light transition-colors"
                  >
                    <span>View Detailed Analytics</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <PaymentLog />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="card bg-dark-card border border-dark-border/50 relative overflow-hidden group hover:shadow-lg transition-all duration-500">              
              <div className="relative">
                <h2 className="text-xl font-semibold text-white mb-4">How It Works</h2>
                <ol className="space-y-3 text-gray-300">
                  <li className="flex group/item">
                    <span className="bg-primary/20 text-primary-light rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 group-hover/item:bg-primary/30 transition-colors">1</span>
                    <span>Click the <strong className="text-white">Check In</strong> button to start tracking your work time.</span>
                  </li>
                  <li className="flex group/item">
                    <span className="bg-primary/20 text-primary-light rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 group-hover/item:bg-primary/30 transition-colors">2</span>
                    <span>The timer will track your working hours in real-time.</span>
                  </li>
                  <li className="flex group/item">
                    <span className="bg-primary/20 text-primary-light rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 group-hover/item:bg-primary/30 transition-colors">3</span>
                    <span>You'll earn <strong className="text-primary">{stats.hourlyRate} sats</strong> per hour automatically.</span>
                  </li>
                  <li className="flex group/item">
                    <span className="bg-primary/20 text-primary-light rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 group-hover/item:bg-primary/30 transition-colors">4</span>
                    <span>Payments will be sent automatically every hour to your Lightning wallet.</span>
                  </li>
                  <li className="flex group/item">
                    <span className="bg-primary/20 text-primary-light rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 group-hover/item:bg-primary/30 transition-colors">5</span>
                    <span>Click <strong className="text-white">Check Out</strong> when you're done working.</span>
                  </li>
                </ol>
              </div>
            </div>
            
            <div className="card bg-dark-card border border-dark-border/50 relative overflow-hidden">
              {/* Lightning bolt decorative element */}
              <div className="absolute -right-6 -bottom-6 text-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 rotate-12" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-xl font-semibold text-white mb-2">Hackathon Demo</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    This application is a hackathon demo showcasing real-time Bitcoin payments for work using the Lightning Network.
                  </p>
                  <div className="flex items-start bg-dark-lighter/50 p-3 rounded-lg border border-dark-border/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm">
                      For this demo, hourly payments are happening on a faster timeline - you'll receive a payment every 30 seconds instead of hourly.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-dark-lighter/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Total Payments:</span>
                    <span className="text-sm px-2 py-0.5 rounded-full bg-primary/20 text-primary-light">{stats.totalHoursPaid}</span>
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