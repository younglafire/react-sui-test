# React + Sui Move Voting DApp 🗳️

A complete decentralized voting application built on the Sui blockchain with React frontend.

## 🎯 What This Is

A full-stack DApp that demonstrates:
- **Smart contracts** written in Sui Move
- **React frontend** with wallet integration
- **Real-time voting** on blockchain proposals
- **Modern UI** with Tailwind CSS

![Voting DApp](https://github.com/user-attachments/assets/704d7cfd-98c7-485f-a71e-4144645d3384)

## 🚀 Quick Start

### 1. Deploy the Smart Contract

```bash
cd contracts/voting
sui move build
sui client publish --gas-budget 100000000
```

Save the Package ID from the output!

### 2. Run the Frontend

```bash
cd react-simple-template
npm install
# Update PACKAGE_ID in src/config/constants.ts
npm run dev
```

## 📚 Complete Guide

**See [GUIDE.md](./GUIDE.md) for a comprehensive walkthrough** including:
- How Sui Move smart contracts work
- How the React frontend integrates with Sui
- Step-by-step deployment instructions
- Troubleshooting tips
- Ideas for extending the project

## 🏗️ Project Structure

```
├── contracts/voting/        # Sui Move smart contract
│   ├── sources/
│   │   └── voting.move     # Voting logic
│   └── tests/
│       └── voting_tests.move
├── react-simple-template/   # React frontend
│   └── src/
│       ├── components/     # UI components
│       ├── config/         # Configuration
│       └── utils/          # Helper functions
└── GUIDE.md               # Complete documentation
```

## ✨ Features

- ✅ Create proposals with deadlines
- ✅ Vote Yes or No on proposals
- ✅ One vote per wallet address
- ✅ Real-time vote counting
- ✅ Automatic expiration checking
- ✅ Event-based proposal discovery
- ✅ Beautiful, responsive UI

## 🛠️ Technologies

**Backend:**
- Sui Move (smart contract language)
- Sui Blockchain (testnet)

**Frontend:**
- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- @mysten/dapp-kit (Sui integration)
- @tanstack/react-query (data fetching)

## 📖 Learn More

- [Sui Documentation](https://docs.sui.io/)
- [Move Book](https://move-book.com/)
- [Sui dApp Kit](https://sdk.mystenlabs.com/dapp-kit)
- [Complete Project Guide](./GUIDE.md)

## 🤝 Contributing

This is a learning project. Feel free to fork, experiment, and extend it!

## 📄 License

MIT
