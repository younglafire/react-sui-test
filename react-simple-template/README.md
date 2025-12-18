# Voting DApp - React Frontend

A decentralized voting application built with React, TypeScript, and Sui blockchain.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Sui Wallet browser extension
- Test SUI tokens (get from faucet)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

### Configuration

Before running, update the package ID in `src/config/constants.ts` or create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and set your deployed contract's package ID:
```
VITE_PACKAGE_ID=0xYOUR_PACKAGE_ID_HERE
VITE_NETWORK=testnet
```

## 📦 Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── WalletConnection.tsx
│   ├── CreateProposal.tsx
│   ├── ProposalCard.tsx
│   └── ProposalList.tsx
├── config/
│   └── constants.ts     # Configuration
├── types/
│   └── proposal.ts      # TypeScript types
├── utils/
│   └── proposalUtils.ts # Helper functions
├── App.tsx              # Main app
└── main.tsx            # Entry point
```

## 🎯 Features

- ✅ Connect Sui Wallet
- ✅ Create proposals with expiration dates
- ✅ Vote Yes/No on proposals
- ✅ Real-time vote counting
- ✅ View proposal details on explorer
- ✅ Responsive UI with Tailwind CSS

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📚 Learn More

See the main [GUIDE.md](../GUIDE.md) in the root directory for a complete walkthrough of the entire project.

## 🛠️ Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **@mysten/dapp-kit** - Sui wallet integration
- **@mysten/sui** - Sui SDK
- **@tanstack/react-query** - Data fetching

## 🐛 Troubleshooting

**Wallet not connecting?**
- Make sure Sui Wallet extension is installed
- Switch to Testnet in your wallet settings

**Proposals not loading?**
- Verify PACKAGE_ID in config is correct
- Check browser console for errors
- Ensure at least one proposal exists

**Transaction failing?**
- Get test SUI from faucet: `sui client faucet`
- Check gas budget is sufficient

## 📄 License

MIT
