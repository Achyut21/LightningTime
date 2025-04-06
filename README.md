# ⚡ Lightning Time

A Bitcoin Lightning Network-powered time tracking web app that allows users to "check in" to track their work time and automatically receive Satoshi (SATs) payments for each hour worked. Built during the MIT BITCOIN EXPO 2025 Hackathon.

![Lightning Time App](https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/356/081/datas/small.png)

## Features

- **Real-time Time Tracking**: Track your work hours with a simple check-in/check-out system
- **Automatic Lightning Payments**: Get paid in Bitcoin (sats) automatically for each hour worked
- **Admin Dashboard**: Monitor work time and payment statistics
- **AI Analytics**: Intelligent insights about work patterns and productivity
- **Lightning Network Integration**: Uses LNbits to process real-time Bitcoin payments
- **Detailed Analytics**: Visualize earnings, work patterns, and payment history
- **Responsive Design**: Works on mobile, tablet, and desktop

## Tech Stack

- **Frontend**: React (with Vite), TailwindCSS, React Router
- **Backend**: Node.js, Express
- **Lightning Integration**: LNbits for processing Lightning Network payments
- **Future Authentication**: Soulbound Tokens (SBT) for secure admin access

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- LNbits wallet for testing payments

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/lightning-time.git
   cd lightning-time
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory based on the `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your own LNbits wallet details

### Development

1. Start the backend server:
   ```bash
   npm run server
   ```

2. In a new terminal, start the frontend development server:
   ```bash
   npm run dev
   ```

3. Access the application at http://localhost:5173

### Production Build

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Start the server which will serve the built frontend:
   ```bash
   npm start
   ```

## Usage

### User Flow

1. Log in as a User
2. Click the "Check In" button to start tracking your time
3. The timer will start counting and you'll earn sats based on your time
4. Every hour (or 30 seconds in the demo), a Lightning Network payment will be sent to your wallet
5. Click "Check Out" when you're done working
6. View Analytics to see insights about your work patterns

### Admin Flow

1. Log in as an Admin using one of two methods:
   - Standard login with password (`admin123`)
   - Authenticate using a blockchain wallet with an Admin SBT (planned for future)
2. View statistics about user work time and payments
3. Monitor Lightning Network connection status
4. Trigger manual payments if needed
5. Access detailed analytics about user productivity

## Soulbound Tokens (SBT) Integration

### What are Soulbound Tokens?

Soulbound Tokens (SBTs) are non-transferable NFTs proposed by Ethereum co-founder Vitalik Buterin. Unlike regular NFTs, SBTs cannot be sold or transferred to another wallet address, making them perfect for representing credentials, identity, or access rights.

### How Lightning Time Will Use SBTs

In our future implementation, Lightning Time will leverage SBTs to provide secure and decentralized admin authentication:

1. **Admin Authentication**: Instead of password-based login, admins will authenticate by proving ownership of an Admin SBT in their wallet
2. **Role-Based Access Control**: Different admin SBTs can grant different levels of permissions
3. **Immutable Audit Trail**: All admin actions are linked to their blockchain identity
4. **No Password Management**: Eliminates the need for password storage and management

### Technical Implementation Plan

1. **Smart Contract**: We have designed an ERC-721 based contract with transfer restrictions to implement the SBT
2. **Wallet Integration**: Future versions will integrate with MetaMask and other web3 wallets for authentication
3. **Cross-Chain Compatibility**: While initially targeting Ethereum, we plan to support multiple blockchains
4. **SBT Issuance Process**: Admins will receive their SBT through a secure issuance process

Here's a simplified example of how the SBT verification works:

```javascript
// Check if the connected wallet has the admin SBT
async function verifyAdminAccess(walletAddress) {
  const adminContract = new ethers.Contract(
    SBT_CONTRACT_ADDRESS,
    SBT_ABI,
    provider
  );
  
  // Check if the wallet has the Admin SBT
  const balance = await adminContract.balanceOf(walletAddress);
  
  // If balance > 0, the wallet holds an Admin SBT
  return balance.gt(0);
}
```

### Benefits of SBT Authentication

- **Enhanced Security**: No password vulnerabilities
- **Decentralized Access Control**: No central database of users or passwords
- **Immutable Identity**: Admin credentials cannot be transferred, shared, or sold
- **Ecosystem Integration**: Part of a broader Web3 identity ecosystem
- **Privacy-Preserving**: Administrators can prove their role without revealing personal information

## Real-World Applications

Lightning Time can be used in various scenarios:

1. **Freelance Work**: Automatically pay contractors, freelancers, or gig workers
2. **Remote Teams**: Track and compensate remote employee work hours
3. **Mining Operations**: Pay mining rig operators based on operational hours
4. **Content Creation**: Compensate content moderators or creators based on time
5. **Micro-consulting**: Enable pay-by-the-minute consulting sessions

## Future Enhancements

- **Enhanced Soulbound Token Integration**: Full implementation of SBT-based admin authentication
- **Multi-User Support**: Allow multiple users with individual payment tracking
- **Advanced Analytics**: More detailed work time reports and visualizations
- **Mobile App**: Native mobile applications for iOS and Android
- **Multiple Payment Schedules**: Support for different payment rates and schedules
- **Streaming Payments**: Implement true streaming money for continuous micropayments

## Contributors

- [Achyut Katiyar](https://github.com/Achyut21)
- [Nikhila Koneru]
- [Revan ](https://github.com/Revan1010)
- [Anand Pinnamaneni](https://github.com/Anand283)

## License

This project is released under the MIT License.

## Acknowledgments

- [LNbits](https://lnbits.com/) for providing the Lightning Network infrastructure
- [Bitcoin](https://bitcoin.org/) for enabling peer-to-peer electronic payments
- The MIT Bitcoin Club and Lighting team for their support and mentorship

