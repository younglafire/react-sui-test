import { useState } from 'react';
import { useSignAndExecuteTransaction, useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID, MODULE_NAME, getExplorerUrl } from '../config/constants';
import type { ProposalDisplay } from '../types/proposal';
import { formatDate, formatRelativeTime, shortenAddress } from '../utils/proposalUtils';

interface ProposalCardProps {
  proposal: ProposalDisplay;
  onVoteSuccess?: () => void;
}

export const ProposalCard = ({ proposal, onVoteSuccess }: ProposalCardProps) => {
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const account = useCurrentAccount();

  const hasVoted = account ? proposal.voterList.includes(account.address) : false;

  const handleVote = async (voteYes: boolean) => {
    if (!account) {
      setError('Please connect your wallet to vote');
      return;
    }

    setError(null);
    setIsVoting(true);

    try {
      const tx = new Transaction();
      const clock = tx.object('0x6');
      
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::${voteYes ? 'vote_yes' : 'vote_no'}`,
        arguments: [tx.object(proposal.id), clock],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: async (result) => {
            await suiClient.waitForTransaction({ digest: result.digest });
            setIsVoting(false);
            if (onVoteSuccess) onVoteSuccess();
          },
          onError: (error) => {
            setError(error.message || 'Failed to vote');
            setIsVoting(false);
          },
        }
      );
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setIsVoting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{proposal.title}</h3>
          <p className="text-gray-600 mb-3">{proposal.description}</p>
        </div>
        <a
          href={getExplorerUrl(proposal.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 text-sm ml-4"
        >
          View →
        </a>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Creator:</span>
          <span className="font-mono text-gray-800">{shortenAddress(proposal.creator)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Expires:</span>
          <span className={`font-medium ${proposal.isExpired ? 'text-red-600' : 'text-green-600'}`}>
            {proposal.isExpired ? 'Expired' : formatRelativeTime(proposal.expiration)}
          </span>
        </div>
        <div className="text-xs text-gray-500">{formatDate(proposal.expiration)}</div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-700">Total Votes: {proposal.totalVotes}</span>
        </div>
        
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-green-600 font-medium">Yes</span>
              <span className="text-green-600 font-medium">
                {proposal.votedYesCount} ({proposal.yesPercentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${proposal.yesPercentage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-red-600 font-medium">No</span>
              <span className="text-red-600 font-medium">
                {proposal.votedNoCount} ({proposal.noPercentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${proposal.noPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}

      {!account ? (
        <div className="text-center py-2 text-gray-500 text-sm">
          Connect your wallet to vote
        </div>
      ) : hasVoted ? (
        <div className="text-center py-2 text-blue-600 font-medium">
          ✓ You have already voted
        </div>
      ) : proposal.isExpired ? (
        <div className="text-center py-2 text-red-600 font-medium">
          Voting has ended
        </div>
      ) : (
        <div className="flex space-x-3">
          <button
            onClick={() => handleVote(true)}
            disabled={isVoting}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 font-medium"
          >
            {isVoting ? 'Voting...' : '👍 Vote Yes'}
          </button>
          <button
            onClick={() => handleVote(false)}
            disabled={isVoting}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400 font-medium"
          >
            {isVoting ? 'Voting...' : '👎 Vote No'}
          </button>
        </div>
      )}
    </div>
  );
};
