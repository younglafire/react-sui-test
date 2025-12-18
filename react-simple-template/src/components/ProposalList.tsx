import { useState, useEffect } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import { ProposalCard } from './ProposalCard';
import type { Proposal } from '../types/proposal';
import { formatProposal } from '../utils/proposalUtils';
import { PACKAGE_ID, MODULE_NAME } from '../config/constants';

export const ProposalList = ({ refreshTrigger }: { refreshTrigger?: number }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const suiClient = useSuiClient();

  const fetchProposals = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const allObjectsResponse = await suiClient.queryEvents({
        query: {
          MoveEventType: `${PACKAGE_ID}::${MODULE_NAME}::ProposalCreated`,
        },
      });

      const proposalIds = allObjectsResponse.data.map((event: any) => event.parsedJson.proposal_id);
      
      const proposalPromises = proposalIds.map((id: string) =>
        suiClient.getObject({
          id,
          options: {
            showContent: true,
            showType: true,
          },
        })
      );

      const proposalObjects = await Promise.all(proposalPromises);
      
      const validProposals = proposalObjects
        .filter((obj) => obj.data && obj.data.content && obj.data.content.dataType === 'moveObject')
        .map((obj: any) => obj.data.content.fields);

      setProposals(validProposals);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Error fetching proposals:', err);
      setError(err.message || 'Failed to fetch proposals');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading proposals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error loading proposals</p>
        <p>{error}</p>
        <button
          onClick={fetchProposals}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600 text-lg">No proposals yet.</p>
        <p className="text-gray-500 mt-2">Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        All Proposals ({proposals.length})
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        {proposals.map((proposal) => (
          <ProposalCard
            key={proposal.id.id}
            proposal={formatProposal(proposal)}
            onVoteSuccess={fetchProposals}
          />
        ))}
      </div>
    </div>
  );
};
