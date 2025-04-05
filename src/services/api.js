// src/services/api.js
// Mock API implementations for MVP

// Simulated delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
let mockPayments = [];
let mockStats = {
  totalHoursPaid: 0,
  totalSatsPaid: 0,
  isCheckedIn: false,
  checkInTime: null,
  lastPaymentTime: null,
  currentSessionDuration: 0,
  payments: []
};

// Auth endpoints
export const userLogin = async (username) => {
  await delay(500);
  return { status: 'success', user: { username, role: 'user' } };
};

export const adminLogin = async (password) => {
  await delay(500);
  if (password === 'admin123') {
    return { status: 'success', user: { username: 'admin', role: 'admin' } };
  } else {
    throw new Error('Invalid admin password');
  }
};

// Work tracking endpoints
export const checkInUser = async () => {
  await delay(500);
  mockStats.isCheckedIn = true;
  mockStats.checkInTime = Date.now();
  return { status: 'success' };
};

export const checkOutUser = async () => {
  await delay(500);
  mockStats.isCheckedIn = false;
  mockStats.currentSessionDuration = Date.now() - mockStats.checkInTime;
  return { status: 'success' };
};

export const getWorkStats = async () => {
  await delay(500);
  return { ...mockStats, payments: mockPayments };
};

// Payment endpoints
export const payHourly = async () => {
  await delay(500);
  const payment = {
    amount: 100,
    timestamp: Date.now(),
    paymentHash: Math.random().toString(36).substring(2, 15),
    status: 'success'
  };
  
  mockPayments.push(payment);
  mockStats.totalSatsPaid += payment.amount;
  mockStats.totalHoursPaid += 1;
  mockStats.lastPaymentTime = payment.timestamp;
  
  return { status: 'ok', payment };
};

export const getPaymentHistory = async () => {
  await delay(500);
  return { payments: mockPayments };
};

export const manualPay = async () => {
  return payHourly();
};

export default {
  userLogin,
  adminLogin,
  checkInUser,
  checkOutUser,
  getWorkStats,
  payHourly,
  getPaymentHistory,
  manualPay
};