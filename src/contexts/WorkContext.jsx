import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

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
  const [walletInfo, setWalletInfo] = useState(null);
  const [stats, setStats] = useState({
    totalHoursPaid: 0,
    totalSatsPaid: 0,
    hourlyRate: 3 // Default value
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get hourly rate from backend
  const [HOURLY_RATE, setHourlyRate] = useState(3); // Default 3 sats
  
  // Load hourly rate when component mounts
  useEffect(() => {
    const loadHourlyRate = async () => {
      try {
        const response = await api.getHourlyRate();
        if (response?.hourlyRate) {
          setHourlyRate(response.hourlyRate);
          setStats(prev => ({ ...prev, hourlyRate: response.hourlyRate }));
        }
      } catch (err) {
        console.error('Failed to load hourly rate:', err);
      }
    };
    
    loadHourlyRate();
  }, []);

  // Calculate earned sats based on elapsed time
  const earnedSats = Math.floor((elapsedSeconds / 3600) * HOURLY_RATE);
  
  // Load stats when user changes
  useEffect(() => {
    if (user) {
      fetchStats();
      
      // Admin-only: fetch wallet info
      if (user.role === 'admin') {
        fetchWalletInfo();
      }
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
          // To make testing easier, we can lower this threshold
          // e.g., for every 5 minutes (300 seconds) in development
          const paymentThreshold = 30;
          
          if (newValue % paymentThreshold === 0) {
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
      const data = await api.getWorkStats();
      
      // Update state with the retrieved data
      setStats({
        totalHoursPaid: data.totalHoursPaid || 0,
        totalSatsPaid: data.totalSatsPaid || 0,
        hourlyRate: data.hourlyRate || HOURLY_RATE,
        userWalletBalance: data.userWalletBalance
      });
      
      setIsCheckedIn(data.isCheckedIn || false);
      
      if (data.checkInTime) {
        // Calculate elapsed time if checked in
        if (data.isCheckedIn) {
          const seconds = Math.floor((Date.now() - data.checkInTime) / 1000);
          setElapsedSeconds(seconds);
        }
      }
      
      setLastPaymentTime(data.lastPaymentTime);
      setPaymentHistory(data.payments || []);
      setError(null);
    } catch (err) {
      setError("Failed to load work stats");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [HOURLY_RATE]);

  const fetchWalletInfo = async () => {
    try {
      const data = await api.getWalletInfo();
      setWalletInfo(data);
    } catch (err) {
      console.error('Failed to fetch wallet info:', err);
    }
  };

  const checkIn = async () => {
    try {
      setLoading(true);
      await api.checkInUser();
      setIsCheckedIn(true);
      setElapsedSeconds(0);
      setError(null);
      
      // Refresh stats after check-in
      await fetchStats();
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
      await api.checkOutUser();
      setIsCheckedIn(false);
      setElapsedSeconds(0);
      setError(null);
      
      // Refresh stats after checkout
      await fetchStats();
    } catch (err) {
      setError("Failed to check out");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const processHourlyPayment = async () => {
    try {
      console.log('Processing hourly payment...');
      const response = await api.payHourly();
      
      if (response.status === 'ok') {
        setLastPaymentTime(Date.now());
        
        // Add to payment history
        const newPayment = {
          amount: HOURLY_RATE,
          timestamp: Date.now(),
          paymentHash: response.payment?.paymentHash || 'unknown',
          status: 'success'
        };
        
        setPaymentHistory(prev => [...prev, newPayment]);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalHoursPaid: prev.totalHoursPaid + 1,
          totalSatsPaid: prev.totalSatsPaid + HOURLY_RATE
        }));
        
        // If admin, refresh wallet info
        if (user?.role === 'admin') {
          fetchWalletInfo();
        }
        
        console.log('Payment successful!', response);
        return response;
      } else {
        throw new Error('Payment response was not OK');
      }
    } catch (err) {
      console.error("Payment failed:", err);
      setError("Payment failed: " + (err.message || 'Unknown error'));
      // Don't stop the timer on payment failure
    }
  };

  // For admin: force payment
  const triggerPayment = async () => {
    if (!isCheckedIn) return false;
    
    try {
      setLoading(true);
      const result = await api.manualPay();
      
      if (result.status === 'ok') {
        // Refresh stats after payment
        await fetchStats();
        
        // If admin, refresh wallet info
        if (user?.role === 'admin') {
          fetchWalletInfo();
        }
        
        setError(null);
        return true;
      } else {
        throw new Error('Manual payment response was not OK');
      }
    } catch (err) {
      setError("Manual payment failed: " + (err.message || 'Unknown error'));
      console.error(err);
      return false;
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
    walletInfo,
    lastPaymentTime,
    loading,
    error,
    checkIn,
    checkOut,
    triggerPayment,
    getFormattedTime,
    HOURLY_RATE,
    fetchStats,
    fetchWalletInfo
  };

  return (
    <WorkContext.Provider value={value}>
      {children}
    </WorkContext.Provider>
  );
};