import React from 'react';
import { useWork } from '../contexts/WorkContext';

const Timer = () => {
  const { elapsedSeconds, getFormattedTime, earnedSats, HOURLY_RATE, isCheckedIn } = useWork();
  
  // Calculate next payout time
  const secondsUntilNextPayout = 30 - (elapsedSeconds % 30); // Using 30 seconds for testing
  const nextPayoutMinutes = Math.floor(secondsUntilNextPayout / 60);
  const nextPayoutSeconds = secondsUntilNextPayout % 60;
  
  // Calculate progress for the progress ring
  const payoutProgress = ((30 - secondsUntilNextPayout) / 30) * 100; // Using 30 seconds for testing
  
  // SVG circle properties for progress ring
  const radius = 85;
  const stroke = 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (payoutProgress / 100) * circumference;
  
  return (
    <div className="card bg-dark-card p-8 relative">
      {/* Background grid pattern */}
      <div className="absolute inset-0 grid-bg opacity-5"></div>
      
      {/* Glow spots */}
      <div className={`absolute top-1/4 left-1/4 w-32 h-32 rounded-full blur-[50px] transition-opacity duration-700 ${isCheckedIn ? 'opacity-50' : 'opacity-10'}`} 
           style={{backgroundColor: 'rgba(139, 92, 246, 0.2)'}}></div>
      <div className={`absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-[70px] transition-opacity duration-700 ${isCheckedIn ? 'opacity-50' : 'opacity-10'}`}
           style={{backgroundColor: 'rgba(139, 92, 246, 0.15)'}}></div>
      
      <div className="relative flex flex-col items-center z-10">
        <h2 className="text-xl font-semibold text-white mb-1">Time Tracker</h2>
        <p className="text-gray-400 text-sm mb-6">Track your work hours and earn Bitcoin</p>
        
        <div className="m-4 relative">
          {/* This wrapper div with additional margin gives space for the ring */}
          <div className="inline-block">
            {/* SVG Progress Ring */}
            <svg
              height={radius * 2}
              width={radius * 2}
              className={`transform -rotate-90 transition-all duration-700 ${isCheckedIn ? 'opacity-100' : 'opacity-40'}`}
            >
              {/* Outer glow */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="blur"></feGaussianBlur>
                <feMerge>
                  <feMergeNode in="blur"></feMergeNode>
                  <feMergeNode in="SourceGraphic"></feMergeNode>
                </feMerge>
              </filter>
              
              {/* Background circle */}
              <circle
                stroke="#374151"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="opacity-30"
              />
              
              {/* Pulsing circle for active state */}
              {isCheckedIn && (
                <circle
                  stroke="#8B5CF6"
                  fill="transparent"
                  strokeWidth={stroke + 4}
                  r={normalizedRadius + 10}
                  cx={radius}
                  cy={radius}
                  className="opacity-20"
                  filter="url(#glow)"
                >
                  <animate 
                    attributeName="stroke-width" 
                    values="1;8;1" 
                    dur="2s" 
                    repeatCount="indefinite" 
                  />
                  <animate 
                    attributeName="opacity" 
                    values="0.1;0.3;0.1" 
                    dur="2s" 
                    repeatCount="indefinite" 
                  />
                </circle>
              )}
              
              {/* Progress circle */}
              <circle
                stroke="#8B5CF6"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                filter={isCheckedIn ? "url(#glow)" : "none"}
                className="transition-all duration-700"
              />
            </svg>
            
            {/* Timer display in the center of the ring */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-4xl font-mono font-bold ${
                isCheckedIn 
                  ? 'text-white' 
                  : 'text-gray-400'
                } transition-colors duration-700`}
              >
                {getFormattedTime()}
              </div>
              <div className={`text-sm mt-1 ${
                isCheckedIn 
                  ? 'text-primary-light' 
                  : 'text-gray-500'
                }`}
              >
                {isCheckedIn ? (
                  <span className="inline-flex items-center">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                    TRACKING
                  </span>
                ) : 'INACTIVE'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-8">
          <div className="bg-dark-lighter/80 backdrop-blur-sm rounded-lg p-4 border border-dark-border hover:border-primary/30 transition-all duration-300 group">
            <div className="text-gray-400 text-xs uppercase mb-1 group-hover:text-gray-300 transition-colors">Earned</div>
            <div className="text-xl font-bold flex items-center">
              <span className="text-primary-light mr-1">₿</span>
              <span className="text-white">{earnedSats}</span>
              <span className="text-xs ml-1 text-gray-400 group-hover:text-gray-300 transition-colors">sats</span>
            </div>
          </div>
          
          <div className="bg-dark-lighter/80 backdrop-blur-sm rounded-lg p-4 border border-dark-border hover:border-primary/30 transition-all duration-300 group">
            <div className="text-gray-400 text-xs uppercase mb-1 group-hover:text-gray-300 transition-colors">Rate</div>
            <div className="text-xl font-bold flex items-center">
              <span className="text-primary-light mr-1">₿</span>
              <span className="text-white">{HOURLY_RATE}</span>
              <span className="text-xs ml-1 text-gray-400 group-hover:text-gray-300 transition-colors">sats/hr</span>
            </div>
          </div>
          
          <div className="bg-dark-lighter/80 backdrop-blur-sm rounded-lg p-4 border border-dark-border hover:border-primary/30 transition-all duration-300 group">
            <div className="text-gray-400 text-xs uppercase mb-1 group-hover:text-gray-300 transition-colors">Next Payout</div>
            <div className="text-xl font-bold">
              {isCheckedIn ? (
                <span className="text-white">
                  {nextPayoutMinutes}:{nextPayoutSeconds.toString().padStart(2, '0')}
                </span>
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