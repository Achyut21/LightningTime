const LNBITS_URL = 'https://5a420985-0ee5-43c5-9cd0-3ae126938a46-00-1t10bn97iwr4o.kirk.replit.dev';

// User wallet key (to receive payments)
const USER_API_KEY = 'e348b601a2324937a59a3884078eba9f';

// Admin wallet key (to send payments)
const ADMIN_API_KEY = 'be6b5f7433f348fe8c4eedd5bd964b7c';

// Store the payment interval
let paymentInterval = null;

export const lightningService = {
  // Start paying the user 1 sat every 30 seconds
  async startWorking() {
    try {
      // If already working, stop it first
      if (paymentInterval) {
        clearInterval(paymentInterval);
      }

      // Function to make one payment
      const makePayment = async () => {
        try {
          // 1. Create invoice for 1 sat
          const invoiceResponse = await fetch(`${LNBITS_URL}/api/v1/payments`, {
            method: 'POST',
            headers: {
              'X-Api-Key': USER_API_KEY,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              out: false,
              amount: 1,
              memo: 'Work payment'
            })
          });

          if (!invoiceResponse.ok) throw new Error('Failed to create invoice');
          const invoice = await invoiceResponse.json();

          // 2. Pay the invoice using admin wallet
          const paymentResponse = await fetch(`${LNBITS_URL}/api/v1/payments`, {
            method: 'POST',
            headers: {
              'X-Api-Key': ADMIN_API_KEY,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              out: true,
              bolt11: invoice.payment_request
            })
          });

          if (!paymentResponse.ok) throw new Error('Failed to pay invoice');
          console.log('Paid 1 sat successfully');

        } catch (error) {
          console.error('Payment failed:', error);
        }
      };

      // Make first payment immediately
      await makePayment();

      // Set up interval for future payments
      paymentInterval = setInterval(makePayment, 30000); // 30 seconds

      return { success: true, message: 'Started working and payments' };
    } catch (error) {
      console.error('Failed to start working:', error);
      return { success: false, error: error.message };
    }
  },

  // Stop the periodic payments
  stopWorking() {
    if (paymentInterval) {
      clearInterval(paymentInterval);
      paymentInterval = null;
      return { success: true, message: 'Stopped working and payments' };
    }
    return { success: false, message: 'Not currently working' };
  },

  // Check if currently working
  isWorking() {
    return paymentInterval !== null;
  }
}; 