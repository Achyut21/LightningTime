/**
 * Lightning Network Integration Service - LNbits Implementation
 */
import axios from 'axios';

// Constants
const HOURLY_RATE_SATS = 3; // 3 satoshis per hour as requested
const LNBITS_URL = 'https://5a420985-0ee5-43c5-9cd0-3ae126938a46-00-1t10bn97iwr4o.kirk.replit.dev';

// Admin wallet for making payments
const ADMIN_WALLET = {
  id: '88a56335f416420e88ff407382b3bb50',
  adminKey: 'be6b5f7433f348fe8c4eedd5bd964b7c',
  readKey: '0957dc32740a4543b0e214360c330351'
};

// User wallet for receiving payments
const USER_WALLET = {
  id: '12167a02f43642c9a53132a2bf924fbf',
  adminKey: '476b77cda3d14c9ca8a3004c8dba8b74',
  readKey: 'e348b601a2324937a59a3884078eba9f'
};

/**
 * Test LNbits API connectivity
 */
const testLNbitsConnection = async () => {
    try {
      console.log('Testing connection to LNbits URL:', LNBITS_URL);
      const response = await axios.get(`${LNBITS_URL}/api/v1/wallet`, {
        headers: {
          'X-Api-Key': USER_WALLET.readKey,
          'Content-Type': 'application/json'
        },
        timeout: 5000 // 5 second timeout
      });
      console.log('LNbits connection successful:', response.status);
      return true;
    } catch (error) {
      console.error('LNbits connection failed:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      return false;
    }
  };
  
  // Call this test function before any other LNbits operations
  testLNbitsConnection().then(isConnected => {
    console.log('LNbits connectivity test result:', isConnected ? 'CONNECTED' : 'FAILED TO CONNECT');
  });

/**
 * Get admin wallet details
 * @returns {Promise<Object>} Wallet details including balance
 */
const getAdminWalletDetails = async () => {
  try {
    const response = await axios.get(`${LNBITS_URL}/api/v1/wallet`, {
      headers: {
        'X-Api-Key': ADMIN_WALLET.readKey,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching admin wallet details:', error.response?.data || error.message);
    throw new Error('Failed to get admin wallet details');
  }
};

/**
 * Get user wallet details
 * @returns {Promise<Object>} Wallet details including balance
 */
const getUserWalletDetails = async () => {
  try {
    const response = await axios.get(`${LNBITS_URL}/api/v1/wallet`, {
      headers: {
        'X-Api-Key': USER_WALLET.readKey,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching user wallet details:', error.response?.data || error.message);
    throw new Error('Failed to get user wallet details');
  }
};

const createUserInvoice = async (amount, memo = 'Lightning Time Payment') => {
    try {
      const response = await axios.post(
        `${LNBITS_URL}/api/v1/payments`,
        {
          out: false,
          amount,
          memo,
          expiry: 3600
        },
        {
          headers: {
            'X-Api-Key': USER_WALLET.readKey,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Debug log the response
      console.log('Invoice creation response:', JSON.stringify(response.data, null, 2));
      
      // Return the full response data
      return response.data;
    } catch (error) {
      console.error('Error creating invoice:', error.response?.data || error.message);
      throw new Error('Failed to create invoice');
    }
  };

/**
 * Pay an invoice from the admin wallet
 * @param {string} bolt11 - BOLT11 invoice to pay
 * @returns {Promise<Object>} Payment result
 */
const payInvoice = async (bolt11) => {
    try {
      console.log('Attempting to pay invoice:', bolt11);
      
      if (!bolt11) {
        throw new Error('Missing BOLT11 invoice string');
      }
      
      const response = await axios.post(
        `${LNBITS_URL}/api/v1/payments`,
        {
          out: true,
          bolt11: bolt11
        },
        {
          headers: {
            'X-Api-Key': ADMIN_WALLET.adminKey,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Payment response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error paying invoice:', error.response?.data || error.message);
      throw new Error('Failed to pay invoice');
    }
  };

/**
 * Check payment status
 * @param {string} paymentHash - Payment hash to check
 * @returns {Promise<Object>} Payment status
 */
const checkPayment = async (paymentHash) => {
  try {
    const response = await axios.get(`${LNBITS_URL}/api/v1/payments/${paymentHash}`, {
      headers: {
        'X-Api-Key': USER_WALLET.readKey,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error checking payment:', error.response?.data || error.message);
    throw new Error('Failed to check payment status');
  }
};

const sendPayment = async (amount = HOURLY_RATE_SATS, memo = 'Lightning Time Hourly Payment') => {
    try {
      console.log(`Creating invoice for ${amount} sats with memo: ${memo}`);
      
      // 1. Create an invoice from the user's wallet
      const invoiceResult = await createUserInvoice(amount, memo);
      
      // Print the raw object for debugging
      console.log('Invoice raw data type:', typeof invoiceResult);
      console.log('Invoice has bolt11?', 'bolt11' in invoiceResult);
      console.log('Invoice created:', invoiceResult);
      
      // Sometimes objects can have non-enumerable properties or be proxies
      // Let's make a clean copy to ensure we can access the property
      const invoice = JSON.parse(JSON.stringify(invoiceResult));
      
      // Explicitly check and extract the bolt11 string
      const bolt11String = invoice.bolt11;
      
      // Debug output to verify we have the bolt11 string
      console.log('BOLT11 string extracted from invoice:', bolt11String);
      
      if (!bolt11String) {
        console.error('ERROR: Missing bolt11 in invoice object with keys:', Object.keys(invoice));
        throw new Error('Invalid invoice: missing payment_request or bolt11');
      }
      
      // 2. Pay the invoice from the admin wallet with explicit value
      try {
        console.log('Making payment request with bolt11:', bolt11String);
        
        // Direct API call instead of using the helper function
        const paymentResponse = await axios.post(
          `${LNBITS_URL}/api/v1/payments`,
          {
            out: true,
            bolt11: bolt11String
          },
          {
            headers: {
              'X-Api-Key': ADMIN_WALLET.adminKey,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('Payment API response status:', paymentResponse.status);
        const payment = paymentResponse.data;
        console.log('Payment response received:', payment);
        
        // 3. Check if payment was successful
        const status = await checkPayment(payment.payment_hash || invoice.payment_hash);
        console.log('Payment status:', status);
        
        if (!status.paid) {
          throw new Error('Payment was not completed successfully');
        }
        
        // Return payment details
        return {
          status: 'success',
          paymentHash: payment.payment_hash || invoice.payment_hash,
          amount,
          memo,
          timestamp: Date.now()
        };
      } catch (payError) {
        console.error('Payment request failed:', payError.response?.data || payError.message);
        throw new Error('Payment failed: ' + (payError.response?.data?.detail || payError.message));
      }
    } catch (error) {
      console.error('Payment process error:', error);
      throw error;
    }
  };

/**
 * Get node connection status by checking if we can connect to LNbits
 * @returns {Promise<Object>} Node status
 */
const getNodeStatus = async () => {
  try {
    // Check admin wallet to see if connection is working
    const adminWallet = await getAdminWalletDetails();
    
    return {
      status: 'online',
      alias: 'Lightning Time LNbits Node',
      pubkey: 'LNbits', // LNbits doesn't expose a pubkey
      channelBalance: adminWallet.balance,
      network: 'testnet'
    };
  } catch (error) {
    return {
      status: 'offline',
      error: error.message
    };
  }
};

export default {
  sendPayment,
  getNodeStatus,
  getAdminWalletDetails,
  getUserWalletDetails,
  createUserInvoice,
  payInvoice,
  checkPayment,
  HOURLY_RATE_SATS
};