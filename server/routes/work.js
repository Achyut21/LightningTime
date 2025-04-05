import express from 'express';
const router = express.Router();
import { authenticate } from '../middleware/auth.js';

/**
 * @route   POST /api/work/check-in
 * @desc    User check-in to start work session
 * @access  Private
 */
router.post('/check-in', authenticate, (req, res) => {
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
 * @route   POST /api/work/check-out
 * @desc    User check-out to end work session
 * @access  Private
 */
router.post('/check-out', authenticate, (req, res) => {
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
 * @route   GET /api/work/status
 * @desc    Get current work status
 * @access  Private
 */
router.get('/status', authenticate, (req, res) => {
  res.status(200).json({
    status: 'ok',
    workStatus: {
      isCheckedIn: globalThis.appData.userStatus.isCheckedIn,
      checkInTime: globalThis.appData.userStatus.checkInTime,
      currentSessionDuration: globalThis.appData.userStatus.currentSessionDuration
    }
  });
});

export default router;