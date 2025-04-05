import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payment.js';
import statsRoutes from './routes/stats.js';
import workRoutes from './routes/work.js';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();
const PORT = 3001; // Hard-coded for MVP, use environment variable in production

// Middleware
app.use(cors());
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/work', workRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Production check - since we're in the browser, we don't have NODE_ENV
const isProduction = false; // Set to true for production

// Serve static files from the React app in production
if (isProduction) {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    status: 'error',
    message: err.message || 'An unexpected error occurred'
  });
});

// In-memory storage for our MVP
// In a production app, this would be replaced with a database
globalThis.appData = {
  // User work tracking
  userStatus: {
    isCheckedIn: false,
    checkInTime: null,
    lastPaymentTime: null,
    currentSessionDuration: 0
  },
  
  // Payment tracking
  stats: {
    totalHoursPaid: 0,
    totalSatsPaid: 0
  },
  
  // Payment history
  payments: []
};

// Start server
app.listen(PORT, () => {
  console.log(`⚡ Server running on port ${PORT}`);
  console.log(`Lightning Time App - Hackathon MVP`);
  console.log(`Hourly rate: 3 sats/hour`); // Hard-coded for MVP
});

// For demo purposes, connect to Lightning Network node
import lightningService from './services/lightningService.js';

// Check Lightning node connection on startup
(async () => {
  try {
    console.log('Connecting to Lightning Network via LNbits...');
    const nodeStatus = await lightningService.getNodeStatus();
    
    if (nodeStatus.status === 'online') {
      console.log('⚡ Lightning node connected! Ready to make payments.');
      
      // Get wallet balances
      const adminWallet = await lightningService.getAdminWalletDetails();
      const userWallet = await lightningService.getUserWalletDetails();
      
      console.log(`Admin wallet balance: ${adminWallet.balance} sats`);
      console.log(`User wallet balance: ${userWallet.balance} sats`);
    } else {
      console.error('Failed to connect to Lightning node:', nodeStatus.error);
    }
  } catch (error) {
    console.error('Lightning connection error:', error);
  }
})();

export default app;