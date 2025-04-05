// src/components/Timer.jsx
import React from 'react';
import { useWork } from '../contexts/WorkContext';

const Timer = () => {
  const { elapsedSeconds, getFormattedTime, earnedSats, HOURLY_RATE, isCheckedIn } = useWork();
  
  // Calculate next payout time
  const secondsUntilNextPayout = 30 - (elapsedSeconds % 30);
  const nextPayoutMinutes = Math.floor(secondsUntilNextPayout / 60);
  const nextPayoutSeconds = secondsUntilNextPayout % 60;
  
  // Calculate progress for the progress ring
  const payoutProgress = ((30 - secondsUntilNextPayout) / 30) * 100;
  
  // SVG circle properties for progress ring
  const radius = 70;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (payoutProgress / 100) * circumference;
  
  return (
    <div className="card relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 grid-bg opacity-5"></div>
      
      <div className="relative flex flex-col items-center">
        <h2 className="text-xl font-semibold text-white mb-1">Time Tracker</h2>
        <p className="text-gray-400 text-sm mb-6">Track your work hours and earn Bitcoin</p>
        
        <div className="relative">
          {/* SVG Progress Ring */}
          <svg
            height={radius * 2}
            width={radius * 2}
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              stroke="#374151"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Progress circle */}
            <circle
              stroke="url(#gradient)"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#A78BFA" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Timer display in the center of the ring */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-4xl font-mono font-bold ${isCheckedIn ? 'text-white' : 'text-gray-400'} transition-colors duration-300`}>
              {getFormattedTime()}
            </div>
            <div className={`text-sm mt-1 ${isCheckedIn ? 'text-primary-light' : 'text-gray-500'}`}>
              {isCheckedIn ? 'TRACKING' : 'INACTIVE'}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-8">
          <div className="bg-dark-lighter rounded-lg p-4 border border-dark-border flex flex-col items-center">
            <div className="text-gray-400 text-xs uppercase mb-1">Earned</div>
            <div className="text-xl font-bold text-white flex items-center">
              <span className="text-primary-light mr-1">₿</span>
              {earnedSats} <span className="text-xs ml-1 text-gray-400">sats</span>
            </div>
          </div>
          
          <div className="bg-dark-lighter rounded-lg p-4 border border-dark-border flex flex-col items-center">
            <div className="text-gray-400 text-xs uppercase mb-1">Rate</div>
            <div className="text-xl font-bold text-white flex items-center">
              <span className="text-primary-light mr-1">₿</span>
              {HOURLY_RATE} <span className="text-xs ml-1 text-gray-400">sats/hr</span>
            </div>
          </div>
          
          <div className="bg-dark-lighter rounded-lg p-4 border border-dark-border flex flex-col items-center">
            <div className="text-gray-400 text-xs uppercase mb-1">Next Payout</div>
            <div className="text-xl font-bold text-white">
              {isCheckedIn ? (
                `${nextPayoutMinutes}:${nextPayoutSeconds.toString().padStart(2, '0')}`
              ) : (
                <span className="text-gray-500">--:--</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;