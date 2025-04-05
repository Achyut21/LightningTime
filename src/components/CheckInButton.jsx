// src/components/CheckInButton.jsx
import React from 'react';
import { useWork } from '../contexts/WorkContext';

const CheckInButton = () => {
  const { isCheckedIn, loading, checkIn, checkOut } = useWork();
  
  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={isCheckedIn ? checkOut : checkIn}
        disabled={loading}
        className={`
          relative overflow-hidden btn px-8 py-3 text-lg font-medium rounded-lg transition-all duration-300
          ${isCheckedIn 
            ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg' 
            : 'bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white shadow-lg'
          }
        `}
      >
        {/* Background pulse effect */}
        {isCheckedIn && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="h-full w-full bg-white rounded-full animate-ping opacity-10"></span>
          </span>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            {isCheckedIn ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
                Check Out
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Check In
              </>
            )}
          </div>
        )}
      </button>
    </div>
  );
};

export default CheckInButton;