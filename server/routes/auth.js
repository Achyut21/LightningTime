import express from 'express';
const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    User login
 * @access  Public
 */
router.post('/login', (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ status: 'error', message: 'Username is required' });
  }
  
  // For MVP, we just accept any username
  res.status(200).json({
    status: 'success',
    message: 'User logged in successfully',
    user: {
      username,
      role: 'user'
    }
  });
});

/**
 * @route   POST /api/auth/admin-login
 * @desc    Admin login
 * @access  Public
 */
router.post('/admin-login', (req, res) => {
  const { password } = req.body;
  
  // Hard-coded admin password check for MVP
  // In production, this would use proper authentication
  if (password !== 'admin123') {
    return res.status(401).json({ status: 'error', message: 'Invalid admin credentials' });
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Admin logged in successfully',
    user: {
      username: 'admin',
      role: 'admin'
    }
  });
});

export default router;