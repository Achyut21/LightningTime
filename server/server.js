const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { lightningService } = require('./services/lightning');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Allow both localhost variations
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Rate limiting configuration
const walletLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per minute
  message: 'Too many wallet requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

const generalLimiter = rateLimit({
  windowMs: 15 * 1000, // 15 seconds
  max: 15, // limit each IP to 15 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting to specific routes
app.use('/api/wallet', walletLimiter);
app.use('/api/payments', generalLimiter);
app.use('/api/config', generalLimiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    hourlyRate: lightningService.getHourlyRate(),
    paymentInterval: '30 seconds'
  });
});

// Get wallet details
app.get('/api/wallet/:type', async (req, res) => {
  try {
    const isAdmin = req.params.type === 'admin';
    const details = await lightningService.getWalletDetails(isAdmin);
    res.json({
      ...details,
      hourlyRate: lightningService.getHourlyRate()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start periodic payments
app.post('/api/payments/start', (req, res) => {
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const result = lightningService.startPeriodicPayments(userId);
  res.json(result);
});

// Stop periodic payments
app.post('/api/payments/stop', (req, res) => {
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const result = lightningService.stopPeriodicPayments(userId);
  res.json(result);
});

// Get payment session status
app.get('/api/payments/status/:userId', (req, res) => {
  const { userId } = req.params;
  const status = lightningService.getPaymentSessionStatus(userId);
  res.json(status);
});

// Check payment status
app.get('/api/payments/:paymentHash', async (req, res) => {
  try {
    const { paymentHash } = req.params;
    const { type } = req.query;
    const status = await lightningService.checkPayment(paymentHash, type === 'admin');
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current configuration
app.get('/api/config', (req, res) => {
  res.json({
    hourlyRate: lightningService.getHourlyRate(),
    paymentInterval: '30 seconds',
    amountPerInterval: Math.max(1, Math.floor(lightningService.getHourlyRate() / 120)),
    unit: 'sats'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Payment interval: 30 seconds');
  console.log('Amount per payment: 1 sat');
});
