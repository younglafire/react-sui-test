import type { Proposal, ProposalDisplay } from '../types/proposal';

export const formatProposal = (proposal: Proposal): ProposalDisplay => {
  const votedYesCount = parseInt(proposal.voted_yes_count);
  const votedNoCount = parseInt(proposal.voted_no_count);
  const totalVotes = votedYesCount + votedNoCount;
  const expiration = parseInt(proposal.expiration);
  const isExpired = Date.now() > expiration;

  return {
    id: proposal.id.id,
    title: proposal.title,
    description: proposal.description,
    votedYesCount,
    votedNoCount,
    expiration,
    creator: proposal.creator,
    voterList: proposal.voter_list,
    isExpired,
    totalVotes,
    yesPercentage: totalVotes > 0 ? (votedYesCount / totalVotes) * 100 : 0,
    noPercentage: totalVotes > 0 ? (votedNoCount / totalVotes) * 100 : 0,
  };
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = timestamp - now;
  const absDiff = Math.abs(diff);

  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (diff < 0) {
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  } else {
    if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    return 'Soon';
  }
};

export const shortenAddress = (address: string, chars: number = 4): string => {
  if (!address) return '';
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};
