# Complete Guide: React + Sui Move Voting DApp

Welcome! This guide will walk you through everything you need to know about this decentralized voting application built on the Sui blockchain.

## 📋 Table of Contents

1. [What is This Project?](#what-is-this-project)
2. [Project Structure](#project-structure)
3. [Understanding Sui Move Smart Contracts](#understanding-sui-move-smart-contracts)
4. [Understanding the React Frontend](#understanding-the-react-frontend)
5. [Setting Up Your Development Environment](#setting-up-your-development-environment)
6. [Deploying the Smart Contract](#deploying-the-smart-contract)
7. [Running the Frontend](#running-the-frontend)
8. [How to Use the DApp](#how-to-use-the-dapp)
9. [Common Issues and Solutions](#common-issues-and-solutions)

---

## What is This Project?

This is a **decentralized voting application (DApp)** that runs on the Sui blockchain. It allows users to:

- ✅ Create proposals with titles, descriptions, and expiration dates
- ✅ Vote "Yes" or "No" on proposals
- ✅ Ensure one vote per wallet address
- ✅ View real-time voting results
- ✅ Have all data stored transparently on the blockchain

**Key Technologies:**
- **Backend:** Sui Move (smart contract language for Sui blockchain)
- **Frontend:** React + TypeScript + Vite
- **Blockchain:** Sui Blockchain (testnet)
- **Styling:** Tailwind CSS
- **Wallet Integration:** Sui dApp Kit

---

## Project Structure

```
react-sui-test/
├── contracts/                    # Sui Move smart contracts
│   └── voting/
│       ├── sources/
│       │   └── voting.move      # Main smart contract
│       ├── tests/
│       │   └── voting_tests.move # Contract tests
│       └── Move.toml            # Package configuration
├── react-simple-template/        # React frontend
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── WalletConnection.tsx
│   │   │   ├── CreateProposal.tsx
│   │   │   ├── ProposalCard.tsx
│   │   │   └── ProposalList.tsx
│   │   ├── config/
│   │   │   └── constants.ts     # Configuration
│   │   ├── types/
│   │   │   └── proposal.ts      # TypeScript types
│   │   ├── utils/
│   │   │   └── proposalUtils.ts # Helper functions
│   │   ├── App.tsx              # Main app component
│   │   └── main.tsx             # Entry point
│   └── package.json
└── GUIDE.md                      # This guide
```

---

## Understanding Sui Move Smart Contracts

### What is Sui Move?

Sui Move is a programming language for writing smart contracts on the Sui blockchain. It's based on Move, which was originally developed for the Diem blockchain.

### Our Voting Contract (`voting.move`)

The contract has one main module: `dashboard`

#### Key Structures

**1. Proposal Struct**
```move
public struct Proposal has key {
    id: UID,                      // Unique identifier
    title: String,                // Proposal title
    description: String,          // Detailed description
    voted_yes_count: u64,        // Number of "Yes" votes
    voted_no_count: u64,         // Number of "No" votes
    expiration: u64,             // Expiration timestamp (milliseconds)
    creator: address,            // Who created it
    voter_list: vector<address>, // List of addresses that voted
}
```

**Why `has key`?** This means the Proposal is an "object" that can be stored on-chain and shared.

#### Main Functions

**1. create_proposal**
```move
public fun create_proposal(
    title: String,
    description: String,
    expiration: u64,
    ctx: &mut TxContext,
)
```
- Creates a new proposal
- Makes it a "shared object" so anyone can interact with it
- Emits a `ProposalCreated` event

**2. vote_yes / vote_no**
```move
public fun vote_yes(
    proposal: &mut Proposal,
    clock: &Clock,
    ctx: &mut TxContext,
)
```
- Allows voting on a proposal
- Checks if the proposal has expired
- Prevents double voting
- Emits a `VoteCast` event

#### Safety Features

1. **Double Vote Prevention:** Each address can only vote once
2. **Expiration Check:** Can't vote on expired proposals
3. **Transparency:** All votes are recorded on-chain
4. **Events:** Emit events for easy tracking

---

## Understanding the React Frontend

### Architecture Overview

The frontend is built with modern React patterns:

**1. Providers (main.tsx)**
- `QueryClientProvider`: Manages data fetching
- `SuiClientProvider`: Connects to Sui network
- `WalletProvider`: Manages wallet connections

**2. Components**

- **WalletConnection:** Header with wallet connect button
- **CreateProposal:** Form to create new proposals
- **ProposalList:** Displays all proposals from the blockchain
- **ProposalCard:** Individual proposal with voting buttons

**3. Configuration (src/config/constants.ts)**
```typescript
export const PACKAGE_ID = '0x...'; // Your deployed contract address
export const MODULE_NAME = 'dashboard';
export const NETWORK = 'testnet';
```

### How Transactions Work

**Creating a Proposal:**
```typescript
const tx = new Transaction();
tx.moveCall({
  target: `${PACKAGE_ID}::${MODULE_NAME}::create_proposal`,
  arguments: [
    tx.pure.string(title),
    tx.pure.string(description),
    tx.pure.u64(expirationMs),
  ],
});
signAndExecute({ transaction: tx });
```

**Voting:**
```typescript
const tx = new Transaction();
const clock = tx.object('0x6'); // Sui's shared clock object
tx.moveCall({
  target: `${PACKAGE_ID}::${MODULE_NAME}::vote_yes`,
  arguments: [
    tx.object(proposalId),
    clock,
  ],
});
signAndExecute({ transaction: tx });
```

### Fetching Data

We query proposals by:
1. Listening for `ProposalCreated` events
2. Fetching each proposal object by ID
3. Parsing the on-chain data
4. Displaying in the UI

---

## Setting Up Your Development Environment

### Prerequisites

1. **Node.js and npm** (v18 or later)
   ```bash
   node --version
   npm --version
   ```

2. **Sui CLI** (for deploying contracts)
   ```bash
   cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
   ```

3. **Sui Wallet** (browser extension)
   - Install from Chrome Web Store or Firefox Add-ons
   - Create a new wallet or import existing
   - Switch to Testnet
   - Get test SUI from the faucet: https://faucet.testnet.sui.io/

### Clone and Install

```bash
# Clone the repository
git clone https://github.com/younglafire/react-sui-test.git
cd react-sui-test

# Install frontend dependencies
cd react-simple-template
npm install
```

---

## Deploying the Smart Contract

### Step 1: Build the Contract

```bash
cd contracts/voting
sui move build
```

This compiles your Move code and checks for errors.

### Step 2: Deploy to Testnet

```bash
sui client publish --gas-budget 100000000
```

**What happens:**
- Sui CLI packages your contract
- Deploys it to the blockchain
- Returns a Package ID (e.g., `0xabc123...`)

**Save the Package ID!** You'll need it for the frontend.

### Step 3: Test the Contract (Optional)

```bash
sui move test
```

This runs all the tests in `tests/voting_tests.move`.

### Example: Create a Proposal via CLI

```bash
sui client call \
  --package YOUR_PACKAGE_ID \
  --module dashboard \
  --function create_proposal \
  --args "My First Proposal" "Vote yes if you agree" 1735000000000 \
  --gas-budget 10000000
```

---

## Running the Frontend

### Step 1: Configure the Package ID

Edit `react-simple-template/src/config/constants.ts`:

```typescript
export const PACKAGE_ID = 'YOUR_PACKAGE_ID_HERE';
```

Or create a `.env` file:
```bash
cd react-simple-template
cp .env.example .env
# Edit .env and set VITE_PACKAGE_ID
```

### Step 2: Start the Development Server

```bash
cd react-simple-template
npm run dev
```

Open http://localhost:5173 in your browser.

### Step 3: Build for Production

```bash
npm run build
```

The production files will be in the `dist/` directory.

---

## How to Use the DApp

### 1. Connect Your Wallet

- Click "Connect Wallet" in the top right
- Select your Sui wallet
- Approve the connection

### 2. Create a Proposal

1. Click "+ Create Proposal"
2. Fill in:
   - **Title:** Short, descriptive title
   - **Description:** Details about what you're proposing
   - **Duration:** How many days voting should last
3. Click "Create Proposal"
4. Approve the transaction in your wallet
5. Wait for confirmation

### 3. Vote on a Proposal

1. Browse the list of proposals
2. Click "👍 Vote Yes" or "👎 Vote No"
3. Approve the transaction in your wallet
4. Your vote is recorded on-chain!

### 4. View Results

- **Vote counts:** See yes/no votes in real-time
- **Progress bars:** Visual representation of voting
- **Expiration:** Check when voting ends
- **Explorer link:** Click "View on Explorer" to see on-chain data

---

## Common Issues and Solutions

### Issue: "Package not found" error

**Solution:** Make sure you've updated `PACKAGE_ID` in `src/config/constants.ts` with your deployed contract address.

### Issue: Wallet connection fails

**Solution:**
1. Make sure Sui Wallet extension is installed
2. Switch to Testnet in your wallet
3. Refresh the page

### Issue: "Insufficient gas" error

**Solution:** Get more test SUI from the faucet:
```bash
sui client faucet
```
Or visit https://faucet.testnet.sui.io/

### Issue: Proposals not loading

**Solution:**
1. Check browser console for errors
2. Verify your PACKAGE_ID is correct
3. Ensure you've created at least one proposal
4. Try clicking "Retry" if there's an error message

### Issue: "Cannot read properties of undefined"

**Solution:** 
1. Make sure the contract is deployed to testnet
2. Check that events are being emitted correctly
3. Verify the contract structure matches the frontend types

---

## Key Concepts Explained

### What is a Transaction?

A transaction is a request to modify the blockchain state. Every action (creating a proposal, voting) requires a transaction that must be:
1. Signed by your wallet
2. Paid for with gas (SUI tokens)
3. Validated by the network
4. Recorded on the blockchain

### What are Shared Objects?

Proposals are "shared objects," meaning:
- Multiple users can interact with them
- They persist on-chain
- Anyone can read their data
- Modifications require transactions

### What is the Clock Object?

`0x6` is Sui's shared clock object. It provides the current timestamp for checking proposal expiration.

### What are Events?

Events are emitted by the smart contract when actions occur:
- `ProposalCreated`: When a new proposal is created
- `VoteCast`: When someone votes

The frontend listens for these events to discover proposals.

---

## Next Steps

### Extend the DApp

Ideas for improvements:
1. **Add comments:** Let users discuss proposals
2. **Weighted voting:** Vote with token amounts
3. **Delegation:** Allow vote delegation
4. **Quadratic voting:** Implement quadratic voting
5. **Proposal categories:** Add tags/categories
6. **NFT gating:** Require NFT ownership to vote
7. **Execution:** Automatically execute passed proposals

### Deploy to Mainnet

When ready for production:
1. Deploy to Sui mainnet
2. Update NETWORK in constants.ts
3. Test thoroughly
4. Use a proper domain
5. Consider security audits

### Learn More

- **Sui Documentation:** https://docs.sui.io/
- **Move Book:** https://move-book.com/
- **Sui dApp Kit:** https://sdk.mystenlabs.com/dapp-kit
- **Sui Examples:** https://github.com/MystenLabs/sui/tree/main/examples

---

## Glossary

- **DApp:** Decentralized Application
- **Move:** Smart contract programming language
- **Sui:** Layer 1 blockchain
- **Transaction:** Blockchain state modification
- **Gas:** Fee for executing transactions
- **Object:** On-chain data structure
- **Shared Object:** Object multiple users can access
- **Event:** Notification emitted by smart contracts
- **Package ID:** Address of deployed smart contract

---

## Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review the code comments
3. Check Sui Discord: https://discord.gg/sui
4. Open an issue on GitHub

---

**Happy Building! 🚀**

This is your starting point for building decentralized applications on Sui. Experiment, learn, and create amazing things!
