const axios = require('axios');
const config = require('../config/lnbits');

class LightningService {
  constructor() {
    this.nodeUrl = config.nodeUrl;
    this.adminWallet = config.admin;
    this.userWallet = config.user;
    this.hourlyRate = process.env.HOURLY_RATE_SATS || 10;
    this.activePayments = new Map(); // Track active payment sessions
    this.paymentInterval = 30000; // 30 seconds in milliseconds
  }

  // Get wallet details
  async getWalletDetails(isAdmin = false) {
    try {
      const key = isAdmin ? this.adminWallet.invoiceKey : this.userWallet.invoiceKey;
      const response = await axios.get(`${this.nodeUrl}/api/v1/wallet`, {
        headers: {
          'X-Api-Key': key,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting wallet details:', error);
      throw error;
    }
  }

  // Create invoice for payment
  async createInvoice(amount, memo) {
    try {
      // Validate amount
      if (amount <= 0) {
        throw new Error('Payment amount must be greater than 0');
      }

      const response = await axios.post(
        `${this.nodeUrl}/api/v1/payments`,
        {
          out: false,
          amount: amount,
          memo: memo,
          unit: 'sat'
        },
        {
          headers: {
            'X-Api-Key': this.userWallet.invoiceKey,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  // Pay invoice (admin wallet pays user wallet)
  async payInvoice(bolt11) {
    try {
      const response = await axios.post(
        `${this.nodeUrl}/api/v1/payments`,
        {
          out: true,
          bolt11: bolt11
        },
        {
          headers: {
            'X-Api-Key': this.adminWallet.adminKey,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error paying invoice:', error);
      throw error;
    }
  }

  // Check payment status
  async checkPayment(paymentHash, isAdmin = false) {
    try {
      const key = isAdmin ? this.adminWallet.invoiceKey : this.userWallet.invoiceKey;
      const response = await axios.get(
        `${this.nodeUrl}/api/v1/payments/${paymentHash}`,
        {
          headers: {
            'X-Api-Key': key,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error checking payment:', error);
      throw error;
    }
  }

  // Start periodic payments for a user
  startPeriodicPayments(userId) {
    if (this.activePayments.has(userId)) {
      throw new Error('Payment session already active for this user');
    }

    // Calculate payment amount for 30-second interval
    // (hourlyRate / (3600/30)) = hourlyRate / 120
    const intervalAmount = Math.max(1, Math.floor(this.hourlyRate / 120));

    const interval = setInterval(async () => {
      try {
        await this.processIntervalPayment(userId, intervalAmount);
      } catch (error) {
        console.error(`Payment error for user ${userId}:`, error);
      }
    }, this.paymentInterval);

    this.activePayments.set(userId, interval);
    return {
      userId,
      status: 'started',
      paymentInterval: this.paymentInterval,
      amountPerInterval: intervalAmount
    };
  }

  // Stop periodic payments for a user
  stopPeriodicPayments(userId) {
    const interval = this.activePayments.get(userId);
    if (interval) {
      clearInterval(interval);
      this.activePayments.delete(userId);
      return { userId, status: 'stopped' };
    }
    throw new Error('No active payment session found for this user');
  }

  // Process interval payment
  async processIntervalPayment(userId, amount) {
    try {
      // Validate amount
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid payment amount');
      }

      // Create invoice from user wallet
      const invoice = await this.createInvoice(
        amount,
        `30-second payment of ${amount} sats for user ${userId}`
      );
      
      // Pay invoice from admin wallet
      const payment = await this.payInvoice(invoice.payment_request);
      
      // Check payment status
      const status = await this.checkPayment(payment.payment_hash);
      
      return {
        success: status.paid,
        paymentHash: payment.payment_hash,
        amount: amount,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error processing interval payment:', error);
      throw error;
    }
  }

  // Get payment session status
  getPaymentSessionStatus(userId) {
    return {
      active: this.activePayments.has(userId),
      paymentInterval: this.paymentInterval,
      amountPerInterval: Math.max(1, Math.floor(this.hourlyRate / 120))
    };
  }

  // Get hourly rate
  getHourlyRate() {
    return parseInt(this.hourlyRate);
  }
}

module.exports = new LightningService(); 