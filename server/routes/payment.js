import express from 'express';
const router = express.Router();
import lightningService from '../services/lightningService.js';

// Define NODE_ENV based on Vite's import.meta.env
const NODE_ENV = 'development'; 

/**
 * @route   POST /api/payment/pay-hourly
 * @desc    Send hourly payment to user
 * @access  Private
 */
router.post('/pay-hourly', async (req, res) => {
  try {
    // Check if user is checked in
    if (!globalThis.appData.userStatus.isCheckedIn) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'User is not checked in' 
      });
    }
    
     // For MVP, we're simplifying the time validation
    // In production, we would ensure at least an hour has passed
    const now = Date.now();
    const lastPayment = globalThis.appData.userStatus.lastPaymentTime;
    
    // If we're in a real environment, enforce a minimum time
    // For testing purposes, you can adjust this to something shorter than 1 hour (3600000 ms)
    // e.g., 5 minutes (300000 ms) for testing
    const minTimeInterval = 30000; // 5 minutes for testing
    
    if (lastPayment && (now - lastPayment < minTimeInterval) && NODE_ENV === 'production') {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Too soon for another payment' 
      });
    }
    
    // Check admin wallet balance before attempting to pay
    const adminWallet = await lightningService.getAdminWalletDetails();
    
    if (adminWallet.balance < lightningService.HOURLY_RATE_SATS) {
      return res.status(400).json({
        status: 'error',
        message: 'Insufficient admin wallet balance for payment'
      });
    }
    
    // Send payment via Lightning Network
    const payment = await lightningService.sendPayment();
    
    // Update our in-memory app data
    globalThis.appData.userStatus.lastPaymentTime = Date.now();
    globalThis.appData.stats.totalSatsPaid += lightningService.HOURLY_RATE_SATS;
    globalThis.appData.stats.totalHoursPaid += 1;
    globalThis.appData.payments.push({
      amount: lightningService.HOURLY_RATE_SATS,
      timestamp: Date.now(),
      paymentHash: payment.paymentHash,
      status: 'success'
    });
    
    res.status(200).json({
      status: 'ok',
      message: 'Payment sent successfully',
      payment
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Payment failed: ' + error.message 
    });
  }
});

/**
 * @route   POST /api/payment/manual-pay
 * @desc    Manually trigger a payment (admin only)
 * @access  Private/Admin
 */
router.post('/manual-pay', async (req, res) => {
  try {
    // Check if request is from admin
    if (req.headers['x-user-role'] !== 'admin') {
      return res.status(403).json({ 
        status: 'error', 
        message: 'Admin access required' 
      });
    }
    
    // Check if user is checked in
    if (!globalThis.appData.userStatus.isCheckedIn) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'User is not checked in' 
      });
    }
    
    // Check admin wallet balance before attempting to pay
    const adminWallet = await lightningService.getAdminWalletDetails();
    
    if (adminWallet.balance < lightningService.HOURLY_RATE_SATS) {
      return res.status(400).json({
        status: 'error',
        message: 'Insufficient admin wallet balance for payment'
      });
    }
    
    // Send payment via Lightning Network - this bypasses time checks
    const payment = await lightningService.sendPayment();
    
    // Update our in-memory app data
    globalThis.appData.userStatus.lastPaymentTime = Date.now();
    globalThis.appData.stats.totalSatsPaid += lightningService.HOURLY_RATE_SATS;
    globalThis.appData.stats.totalHoursPaid += 1;
    globalThis.appData.payments.push({
      amount: lightningService.HOURLY_RATE_SATS,
      timestamp: Date.now(),
      paymentHash: payment.paymentHash,
      status: 'success'
    });
    
    res.status(200).json({
      status: 'ok',
      message: 'Manual payment sent successfully',
      payment
    });
  } catch (error) {
    console.error('Manual payment error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Manual payment failed: ' + error.message 
    });
  }
});

/**
 * @route   GET /api/payment/history
 * @desc    Get payment history
 * @access  Private
 */
router.get('/history', (req, res) => {
  res.status(200).json({
    status: 'ok',
    payments: globalThis.appData.payments
  });
});

/**
 * @route   GET /api/payment/wallet-info
 * @desc    Get wallet information
 * @access  Private/Admin
 */
router.get('/wallet-info', async (req, res) => {
  try {
    // Check if request is from admin
    if (req.headers['x-user-role'] !== 'admin') {
      return res.status(403).json({ 
        status: 'error', 
        message: 'Admin access required' 
      });
    }
    
    const adminWallet = await lightningService.getAdminWalletDetails();
    const userWallet = await lightningService.getUserWalletDetails();
    
    res.status(200).json({
      status: 'ok',
      adminWallet: {
        id: adminWallet.id,
        name: adminWallet.name,
        balance: adminWallet.balance
      },
      userWallet: {
        id: userWallet.id,
        name: userWallet.name,
        balance: userWallet.balance
      }
    });
  } catch (error) {
    console.error('Wallet info error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to get wallet information: ' + error.message 
    });
  }
});

export default router;