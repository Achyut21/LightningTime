import express from 'express';
const router = express.Router();
import lightningService from '../services/lightningService.js';

/**
 * @route   GET /api/stats
 * @desc    Get work and payment statistics
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    // Get current stats
    const stats = {
      ...globalThis.appData.stats,
      isCheckedIn: globalThis.appData.userStatus.isCheckedIn,
      checkInTime: globalThis.appData.userStatus.checkInTime,
      lastPaymentTime: globalThis.appData.userStatus.lastPaymentTime,
      currentSessionDuration: globalThis.appData.userStatus.currentSessionDuration,
      payments: globalThis.appData.payments,
      hourlyRate: lightningService.HOURLY_RATE_SATS
    };
    
    // Get user wallet balance
    try {
      const userWallet = await lightningService.getUserWalletDetails();
      stats.userWalletBalance = userWallet.balance;
    } catch (err) {
      console.error('Failed to get user wallet balance:', err);
      stats.userWalletBalance = null;
    }
    
    // If admin is requesting, add node status and more details
    if (req.headers['x-user-role'] === 'admin') {
      try {
        const nodeStatus = await lightningService.getNodeStatus();
        stats.nodeStatus = nodeStatus;
        
        const adminWallet = await lightningService.getAdminWalletDetails();
        stats.adminWalletBalance = adminWallet.balance;
      } catch (err) {
        console.error('Failed to get admin details:', err);
      }
    }
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch stats: ' + error.message 
    });
  }
});

/**
 * @route   POST /api/stats/check-in
 * @desc    User check-in to start tracking time
 * @access  Private
 */
router.post('/check-in', (req, res) => {
  // Update user status
  globalThis.appData.userStatus.isCheckedIn = true;
  globalThis.appData.userStatus.checkInTime = Date.now();
  globalThis.appData.userStatus.currentSessionDuration = 0;
  
  res.status(200).json({
    status: 'ok',
    message: 'Checked in successfully',
    checkInTime: globalThis.appData.userStatus.checkInTime
  });
});

/**
 * @route   POST /api/stats/check-out
 * @desc    User check-out to stop tracking time
 * @access  Private
 */
router.post('/check-out', (req, res) => {
  // Calculate session duration
  if (globalThis.appData.userStatus.isCheckedIn && globalThis.appData.userStatus.checkInTime) {
    const sessionDuration = Date.now() - globalThis.appData.userStatus.checkInTime;
    globalThis.appData.userStatus.currentSessionDuration = sessionDuration;
  }
  
  // Update user status
  globalThis.appData.userStatus.isCheckedIn = false;
  
  res.status(200).json({
    status: 'ok',
    message: 'Checked out successfully',
    sessionDuration: globalThis.appData.userStatus.currentSessionDuration
  });
});

/**
 * @route   GET /api/stats/hourly-rate
 * @desc    Get current hourly rate
 * @access  Public
 */
router.get('/hourly-rate', (req, res) => {
  res.status(200).json({
    status: 'ok',
    hourlyRate: lightningService.HOURLY_RATE_SATS
  });
});

export default router;