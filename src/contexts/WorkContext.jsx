// src/contexts/WorkContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { checkInUser, checkOutUser, getWorkStats, payHourly } from '../services/api';

// Create the context
const WorkContext = createContext();

// Export the useWork hook
export const useWork = () => useContext(WorkContext);

export const WorkProvider = ({ children }) => {
  const { user } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [lastPaymentTime, setLastPaymentTime] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [stats, setStats] = useState({
    totalHoursPaid: 0,
    totalSatsPaid: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Hourly rate in sats
  const HOURLY_RATE = 100;

  // Calculate earned sats based on elapsed time
  const earnedSats = Math.floor((elapsedSeconds / 3600) * HOURLY_RATE);
  
  // Load stats when user changes
  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  // Timer effect
  useEffect(() => {
    let timer;
    
    if (isCheckedIn) {
      timer = setInterval(() => {
        setElapsedSeconds(prev => {
          const newValue = prev + 1;
          
          // Check if an hour has passed (3600 seconds)
          // In a real app, we might not reset the timer, but for simplicity we'll check each hour
          if (newValue % 3600 === 0) {
            processHourlyPayment();
          }
          
          return newValue;
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [isCheckedIn]);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getWorkStats();
      setStats(data);
      setPaymentHistory(data.payments || []);
      setError(null);
    } catch (err) {
      setError("Failed to load work stats");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkIn = async () => {
    try {
      setLoading(true);
      await checkInUser();
      setIsCheckedIn(true);
      setElapsedSeconds(0);
      setError(null);
    } catch (err) {
      setError("Failed to check in");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkOut = async () => {
    try {
      setLoading(true);
      await checkOutUser();
      setIsCheckedIn(false);
      setElapsedSeconds(0);
      await fetchStats(); // Refresh stats after checkout
      setError(null);
    } catch (err) {
      setError("Failed to check out");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const processHourlyPayment = async () => {
    try {
      const response = await payHourly();
      
      if (response.status === 'ok') {
        setLastPaymentTime(Date.now());
        
        // Add to payment history
        const newPayment = {
          amount: HOURLY_RATE,
          timestamp: Date.now()
        };
        
        setPaymentHistory(prev => [...prev, newPayment]);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalHoursPaid: prev.totalHoursPaid + 1,
          totalSatsPaid: prev.totalSatsPaid + HOURLY_RATE
        }));
      }
    } catch (err) {
      console.error("Payment failed:", err);
      // Don't stop the timer on payment failure
    }
  };

  // For admin: force payment
  const triggerPayment = async () => {
    if (!isCheckedIn) return;
    
    try {
      setLoading(true);
      await processHourlyPayment();
      setError(null);
    } catch (err) {
      setError("Manual payment failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getFormattedTime = () => {
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const value = {
    isCheckedIn,
    elapsedSeconds,
    earnedSats,
    paymentHistory,
    stats,
    lastPaymentTime,
    loading,
    error,
    checkIn,
    checkOut,
    triggerPayment,
    getFormattedTime,
    HOURLY_RATE,
    fetchStats
  };

  return (
    <WorkContext.Provider value={value}>
      {children}
    </WorkContext.Provider>
  );
};