// src/contexts/WorkContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { lightningService } from '../services/lightning';

// Create the context
const WorkContext = createContext();

// Export the useWork hook
export const useWork = () => useContext(WorkContext);

export const WorkProvider = ({ children }) => {
  const { user } = useAuth();
  const [isWorking, setIsWorking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Timer effect
  useEffect(() => {
    let timer;
    if (isWorking) {
      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isWorking]);

  const startWork = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await lightningService.startWorking();
      if (result.success) {
        setIsWorking(true);
        setElapsedSeconds(0);
      } else {
        throw new Error(result.error || 'Failed to start working');
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stopWork = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await lightningService.stopWorking();
      if (result.success) {
        setIsWorking(false);
        setElapsedSeconds(0);
      } else {
        throw new Error(result.error || 'Failed to stop working');
      }
    } catch (err) {
      setError(err.message);
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

  return (
    <WorkContext.Provider value={{
      isWorking,
      elapsedSeconds,
      loading,
      error,
      startWork,
      stopWork,
      getFormattedTime
    }}>
      {children}
    </WorkContext.Provider>
  );
};