/**
 * Type definitions for Proposal objects from the Sui blockchain
 * These match the structure defined in the Move contract
 */

export interface Proposal {
  id: {
    id: string;
  };
  title: string;
  description: string;
  voted_yes_count: string;
  voted_no_count: string;
  expiration: string;
  creator: string;
  voter_list: string[];
}

export interface ProposalDisplay {
  id: string;
  title: string;
  description: string;
  votedYesCount: number;
  votedNoCount: number;
  expiration: number;
  creator: string;
  voterList: string[];
  isExpired: boolean;
  totalVotes: number;
  yesPercentage: number;
  noPercentage: number;
}
