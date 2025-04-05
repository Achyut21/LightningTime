import axios from 'axios';

const API_URL = '/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.role) {
      config.headers['X-User-Role'] = user.role;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const userLogin = (username) => {
  return api.post('/auth/login', { username, role: 'user' });
};

export const adminLogin = (password) => {
  return api.post('/auth/admin-login', { password });
};

// Work tracking endpoints
export const checkInUser = () => {
  return api.post('/stats/check-in');
};

export const checkOutUser = () => {
  return api.post('/stats/check-out');
};

export const getWorkStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const getHourlyRate = async () => {
  const response = await api.get('/stats/hourly-rate');
  return response.data;
};

// Payment endpoints
export const payHourly = async () => {
  const response = await api.post('/payment/pay-hourly');
  return response.data;
};

export const getPaymentHistory = async () => {
  const response = await api.get('/payment/history');
  return response.data;
};

export const manualPay = async () => {
  const response = await api.post('/payment/manual-pay');
  return response.data;
};

// Lightning wallet info
export const getWalletInfo = async () => {
  const response = await api.get('/payment/wallet-info');
  return response.data;
};

export default {
  userLogin,
  adminLogin,
  checkInUser,
  checkOutUser,
  getWorkStats,
  getHourlyRate,
  payHourly,
  getPaymentHistory,
  manualPay,
  getWalletInfo
};