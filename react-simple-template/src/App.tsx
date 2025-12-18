import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { WalletConnection } from './components/WalletConnection';
import { CreateProposal } from './components/CreateProposal';
import { ProposalList } from './components/ProposalList';

function App() {
  const account = useCurrentAccount();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleProposalCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <WalletConnection />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {!account ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-lg shadow-lg p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🗳️</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome to Voting DApp
              </h2>
              <p className="text-gray-600 mb-6">
                A decentralized voting platform built on Sui blockchain.
                Connect your wallet to create proposals and vote!
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <p className="text-sm text-gray-700 font-medium mb-2">Features:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✅ Create proposals with deadlines</li>
                  <li>✅ Vote Yes or No on proposals</li>
                  <li>✅ One vote per wallet</li>
                  <li>✅ Real-time vote counting</li>
                  <li>✅ Transparent and immutable</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Proposals</h2>
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium"
                >
                  {showCreateForm ? '← Back to Proposals' : '+ Create Proposal'}
                </button>
              </div>

              {showCreateForm && (
                <div className="mt-4">
                  <CreateProposal onSuccess={handleProposalCreated} />
                </div>
              )}
            </div>

            {!showCreateForm && <ProposalList refreshTrigger={refreshTrigger} />}
          </div>
        )}
      </div>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Built with React + Sui Move | Powered by Sui Blockchain
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Open source voting platform for decentralized governance
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
