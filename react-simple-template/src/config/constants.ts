/**
 * Configuration constants for the Voting DApp
 * Update PACKAGE_ID after deploying your contract to the network
 */

// The package ID from the deployed voting contract
// Replace this with your actual package ID after deployment
export const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID || '0xa9377edbf7a8a504fbe44e4eee02b32ffa4449c51bc76a81b99beab8a9f18c11';

// The module name in the package
export const MODULE_NAME = 'dashboard';

// Network configuration
export const NETWORK = import.meta.env.VITE_NETWORK || 'testnet';

// Explorer URL
export const getExplorerUrl = (id: string, type: 'object' | 'transaction' | 'address' = 'object') => {
  const baseUrl = NETWORK === 'mainnet' 
    ? 'https://suiscan.xyz/mainnet' 
    : 'https://suiscan.xyz/testnet';
  return `${baseUrl}/${type}/${id}`;
};
