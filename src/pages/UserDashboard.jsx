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
  const { 
    isCheckedIn, 
    walletDetails, 
    loadWalletDetails,
    startWork,
    stopWork,
    paymentHistory,
    stats,
    loading,
    error 
  } = useWork();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if not logged in as user
    if (!user || !isUser()) {
      navigate('/');
      return;
    }
    
    // Load wallet details
    if (user) {
      loadWalletDetails();
    }
  }, [user, isUser, navigate, loadWalletDetails]);
  
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
              <div className="mt-4">
                {isCheckedIn ? (
                  <button
                    onClick={stopWork}
                    className="w-full btn btn-danger"
                    disabled={loading}
                  >
                    {loading ? 'Stopping...' : 'Stop Working'}
                  </button>
                ) : (
                  <button
                    onClick={startWork}
                    className="w-full btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Starting...' : 'Start Working'}
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex flex-col space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Wallet Details</h2>
                {walletDetails ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-dark-lighter rounded-lg">
                      <span className="text-gray-300">Balance</span>
                      <span className="text-white font-medium">{walletDetails.balance} sats</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400">Loading wallet details...</div>
                )}
              </div>
              
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Payment Stats</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-dark-lighter rounded-lg">
                    <span className="text-gray-300">Total Earned</span>
                    <span className="text-white font-medium">{stats.totalSatsPaid} sats</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-dark-lighter rounded-lg">
                    <span className="text-gray-300">Total Hours</span>
                    <span className="text-white font-medium">{stats.totalHoursPaid}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <PaymentLog payments={paymentHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;