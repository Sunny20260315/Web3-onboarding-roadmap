# DeFi Mini Dashboard

A modern, responsive DeFi dashboard built for Web3 remote job applications. Features wallet connection, token balances, swap interface, and transaction history - all optimized for the Sepolia testnet.

## 🚀 Features

- **Wallet Connection**: Connect via MetaMask or WalletConnect using RainbowKit
- **Token Balances**: Display ETH and USDC balances with USD valuation
- **Swap Interface**: Intuitive swap panel with slippage settings and exchange rate display
- **Transaction History**: Local storage-based transaction history with Etherscan links
- **Dark Mode**: Beautiful dark-themed UI with glassmorphism effects
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Web3**: Wagmi + Viem + RainbowKit
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Network**: Sepolia Testnet

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm
- MetaMask or any WalletConnect-compatible wallet

### Steps

1. **Clone or navigate to the project**
   ```bash
   cd defi-mini-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env.local` file in the root directory:

   ```env
   VITE_WALLETCONNECT_PROJECT_ID=your-project-id-here
   ```

   To get a WalletConnect Project ID:
   - Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Sign up and create a new project
   - Copy your Project ID

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
defi-mini-dashboard/
├── src/
│   ├── components/
│   │   ├── BalanceCard.tsx       # Token balance display
│   │   ├── SwapPanel.tsx         # Swap interface
│   │   └── TransactionHistory.tsx # Transaction history
│   ├── hooks/
│   │   └── useLocalStorage.ts    # Local storage hook
│   ├── App.tsx                    # Main application
│   ├── main.tsx                   # Entry point with Wagmi config
│   ├── wagmi.ts                   # Wagmi configuration
│   ├── types.ts                   # TypeScript type definitions
│   ├── constants.ts               # Token constants
│   └── index.css                  # Global styles with Tailwind
├── .env.local                     # Environment variables
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

## 💡 Usage Guide

### Connecting Your Wallet

1. Click the "Connect Wallet" button in the top right corner
2. Select your preferred wallet (MetaMask, WalletConnect, etc.)
3. Approve the connection in your wallet
4. Make sure you're on the Sepolia testnet

### Viewing Balances

- ETH and USDC balances are automatically displayed
- USD valuation is calculated using mock prices (ETH = $3500, USDC = $1)
- Balances update in real-time when your wallet changes

### Swapping Tokens

1. Enter the amount you want to swap in the "From" field
2. The estimated amount will automatically appear in the "To" field
3. (Optional) Click the settings icon to adjust slippage tolerance
4. Click "Swap" to initiate the transaction (demo mode)
5. The transaction will appear in your history

### Transaction History

- All swaps are saved to local storage
- Click "View" to see the transaction on Etherscan Sepolia
- Status indicators show if a transaction succeeded, failed, or is pending

## 📝 Resume Project Description

**DeFi Mini Dashboard** - A production-ready Web3 frontend application demonstrating modern DeFi development practices.

- Built a fully responsive DeFi dashboard with wallet integration using React 18, TypeScript, and Tailwind CSS
- Implemented wallet connection via RainbowKit supporting MetaMask and WalletConnect
- Developed token balance display with real-time USD valuation using Wagmi and Viem
- Created an intuitive swap interface with slippage settings and exchange rate calculations
- Added local storage-based transaction history with Etherscan integration
- Designed a beautiful dark-themed UI with glassmorphism effects and smooth animations
- Optimized for Sepolia testnet with proper error handling and loading states

**Tech Stack**: React 18, TypeScript, Wagmi, Viem, RainbowKit, Tailwind CSS, Vite

## 🔧 Configuration

### Changing the Network

To use a different network, modify `src/wagmi.ts`:

```typescript
import { mainnet, sepolia, arbitrum } from 'wagmi/chains';

export const config = getDefaultConfig({
  // ...
  chains: [sepolia, mainnet, arbitrum],
  // ...
});
```

### Adding Tokens

Add new tokens to `src/constants.ts`:

```typescript
export const WETH_TOKEN: Token = {
  symbol: 'WETH',
  name: 'Wrapped Ether',
  address: '0x...',
  decimals: 18,
  logoURI: 'https://...',
};
```

## 🚀 Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Build for Production

```bash
npm run build
npm run preview
```

## 📄 License

MIT License - feel free to use this project for your portfolio or job applications!

## 🤝 Contributing

This is a demo project, but suggestions are welcome! Feel free to open issues or submit PRs.

---

Built with ❤️ for Web3 developers
