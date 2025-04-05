// src/components/Stats.jsx
import React from 'react';
import { useWork } from '../contexts/WorkContext';

const Stats = () => {
  const { stats, isCheckedIn } = useWork();
  
  // Function to get formatted date
  const getFormattedDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Dashboard Overview</h2>
        <div className="text-xs text-gray-400">{getFormattedDate()}</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Time Worked Card */}
        <div className="bg-dark-lighter rounded-xl overflow-hidden border border-dark-border">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase">Total Hours</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stats.totalHoursPaid}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-900/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <div className="mt-4 flex items-center text-xs">
              <div className="flex items-center text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>+2 hours</span>
              </div>
              <span className="text-gray-500 ml-2">since last week</span>
            </div>
          </div>
          
          <div className="bg-blue-900/10 border-t border-dark-border px-6 py-3">
            <div className="flex items-center text-xs text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Average: 4.5 hours per session
            </div>
          </div>
        </div>
        
        {/* Total Sats Earned Card */}
        <div className="bg-dark-lighter rounded-xl overflow-hidden border border-dark-border">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase">Total Earnings</p>
                <div className="flex items-baseline mt-1">
                  <p className="text-2xl font-bold text-primary-light">
                    {stats.totalSatsPaid}
                  </p>
                  <p className="text-xs text-gray-400 ml-1">sats</p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <div className="mt-4 flex items-center text-xs">
              <div className="flex items-center text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>+{stats.hourlyRate} sats</span>
              </div>
              <span className="text-gray-500 ml-2">since last hour</span>
            </div>
          </div>
          
          <div className="bg-primary/5 border-t border-dark-border px-6 py-3">
            <div className="flex items-center text-xs text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Rate: {stats.hourlyRate} sats per hour
            </div>
          </div>
        </div>
        
        {/* Current Status Card */}
        <div className="bg-dark-lighter rounded-xl overflow-hidden border border-dark-border">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase">Current Status</p>
                <p className={`text-2xl font-bold mt-1 ${isCheckedIn ? 'text-green-400' : 'text-gray-400'}`}>
                  {isCheckedIn ? 'Working' : 'Not Working'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center
                ${isCheckedIn ? 'bg-green-900/30' : 'bg-gray-800'}`}>
                {isCheckedIn ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex items-center text-xs">
              {isCheckedIn ? (
                <div className="flex items-center text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Earning satoshis</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>No active session</span>
                </div>
              )}
            </div>
          </div>
          
          <div className={`border-t border-dark-border px-6 py-3 ${isCheckedIn ? 'bg-green-900/10' : 'bg-gray-800/30'}`}>
            <div className="flex items-center text-xs text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {isCheckedIn ? 'Started at ' + new Date().toLocaleTimeString() : 'Click "Check In" to start working'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;