import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWork } from '../contexts/WorkContext';
import Header from '../components/Header';
import Stats from '../components/Stats';
import PaymentLog from '../components/PaymentLog';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { 
    fetchStats, 
    triggerPayment, 
    isCheckedIn, 
    loading, 
    error, 
    stats,
    walletInfo 
  } = useWork();
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const navigate = useNavigate();
  
  // Auto refresh stats every 10 seconds
  useEffect(() => {
    // Redirect if not logged in as admin
    if (!user || !isAdmin()) {
      navigate('/');
      return;
    }
    
    // Initial fetch
    fetchStats();
    
    // Set up auto-refresh
    const interval = setInterval(() => {
      fetchStats();
      setRefreshCounter(prev => prev + 1);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [user, isAdmin, navigate, fetchStats]);
  
  const handleManualRefresh = () => {
    fetchStats();
    setRefreshCounter(prev => prev + 1);
    
    // Show success message
    setActionSuccess('Dashboard refreshed successfully');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  const handleManualPayment = async () => {
    await triggerPayment();
    fetchStats();
    
    // Show success message
    setActionSuccess('Manual payment sent successfully');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  return (
    <div className="min-h-screen bg-dark relative">
      {/* Background grid and glow effect */}
      <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none"></div>
      
      <Header />
      
      <div className="pt-20 pb-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Admin Header with Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Admin <span className="text-primary">Dashboard</span>
              </h1>
              <p className="text-gray-400 mb-4 md:mb-0">
                Monitor your Lightning worker activity and payments
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleManualRefresh}
                className="btn btn-secondary flex items-center"
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-1.5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              
              <button
                onClick={handleManualPayment}
                className="btn btn-primary flex items-center"
                disabled={loading || !isCheckedIn}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Force Payment
              </button>
              
              <div className="relative">
                <button
                  className="btn bg-dark-lighter text-primary border border-primary/20 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
              </div>
            </div>
          </div>
          
          {/* Success Message */}
          {showSuccess && (
            <div className="bg-green-900/30 border border-green-800 rounded-md px-4 py-3 text-sm text-green-300 mb-6 animate-fadeIn">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {actionSuccess}
              </div>
            </div>
          )}
          
          {/* Error Message */}
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
          
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-500">
              Last refreshed: {new Date().toLocaleTimeString()} <span className="text-xs">(auto-refreshes every 10 seconds)</span>
            </div>
            
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full ${isCheckedIn ? 'bg-green-500 animate-pulse' : 'bg-gray-600'} mr-2`}></div>
              <span className={`text-sm ${isCheckedIn ? 'text-green-500' : 'text-gray-500'}`}>
                User is {isCheckedIn ? 'working' : 'inactive'}
              </span>
            </div>
          </div>
          
          <div className="space-y-6">
            <Stats />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Info Card */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">User Information</h2>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-dark-lighter rounded-lg border border-dark-border">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-light" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-white">Default User</div>
                        <div className="text-xs text-gray-400">Regular worker</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${isCheckedIn ? 'bg-green-900 text-green-300' : 'bg-gray-800 text-gray-400'}`}>
                        {isCheckedIn ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-dark-lighter rounded-lg border border-dark-border">
                      <div className="text-xs text-gray-400 mb-1">Lightning Node</div>
                      <div className="font-mono text-xs text-white truncate">
                        034a...f8ec
                        <span className="ml-2 text-green-500 text-[10px]">(Connected)</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-dark-lighter rounded-lg border border-dark-border">
                      <div className="text-xs text-gray-400 mb-1">Network</div>
                      <div className="text-sm text-white flex items-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                        Testnet
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Lightning Node Status Card */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Lightning Node Status</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-dark-lighter rounded-lg border border-dark-border">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-lightning/20 rounded-lg flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lightning" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white font-medium">LNbits Node</div>
                        <div className="text-xs text-gray-400">Lightning Network via LNbits</div>
                      </div>
                    </div>
                    
                    <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                      {stats.nodeStatus?.status === 'online' ? 'Online' : 'Offline'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-dark-lighter rounded-lg border border-dark-border">
                      <div className="text-xs text-gray-400 mb-1">Admin Wallet Balance</div>
                      <div className="text-xl font-mono text-white flex items-center">
                        <span className="text-lightning mr-1">₿</span>
                        {stats.adminWalletBalance || 0}
                        <span className="text-xs ml-1 text-gray-400">sats</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-dark-lighter rounded-lg border border-dark-border">
                      <div className="text-xs text-gray-400 mb-1">User Wallet Balance</div>
                      <div className="text-xl font-mono text-white flex items-center">
                        <span className="text-lightning mr-1">₿</span>
                        {stats.userWalletBalance || 0}
                        <span className="text-xs ml-1 text-gray-400">sats</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-dark-lighter rounded-lg border border-dark-border">
                    <div className="text-xs text-gray-400 mb-2">Hourly Payment Rate</div>
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-mono text-white flex items-center">
                        <span className="text-lightning mr-1">₿</span>
                        {stats.hourlyRate || 3}
                        <span className="text-xs ml-1 text-gray-400">sats/hour</span>
                      </div>
                      
                      <button 
                        onClick={handleManualPayment}
                        disabled={loading || !isCheckedIn}
                        className="btn btn-primary btn-sm text-xs"
                      >
                        Force Payment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <PaymentLog />
            
            {/* Admin Tools */}
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-4">Admin Tools</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-dark-lighter rounded-lg border border-dark-border p-4">
                  <div className="flex items-start mb-4">
                    <div className="p-2 rounded-md bg-primary/10 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Soulbound Token (SBT) Authentication</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Admin access is secured by a non-transferable Ethereum token.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-dark p-3 rounded border border-dark-border mb-4">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-400">Status</div>
                      <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                        Active
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full btn btn-secondary text-sm">
                    Manage SBT Settings
                  </button>
                </div>
                
                <div className="bg-dark-lighter rounded-lg border border-dark-border p-4">
                  <div className="flex items-start mb-4">
                    <div className="p-2 rounded-md bg-blue-900/30 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Advanced Analytics</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        View detailed metrics about worker activity and payments.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-dark p-3 rounded border border-dark-border mb-4">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-400">Latest Report</div>
                      <div className="text-xs text-gray-400">3 hours ago</div>
                    </div>
                  </div>
                  
                  <button className="w-full btn btn-secondary text-sm">
                  <Link 
  to="/analytics" 
  className="btn btn-secondary text-sm"
>
  View Analytics Dashboard
</Link>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Hackathon Note */}
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
                    This admin dashboard is part of a hackathon demo showcasing Bitcoin Lightning Network integration for real-time work payments.
                  </p>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm">
                      In this demo, payments are processed via LNbits with real Lightning Network transactions. Each hour worked earns 3 sats, paid instantly to the worker's Lightning wallet.
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

export default AdminDashboard;