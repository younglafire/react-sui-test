import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { shortenAddress } from '../utils/proposalUtils';

export const WalletConnection = () => {
  const account = useCurrentAccount();

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-bold">🗳️ Voting DApp</h1>
        {account && (
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
            Connected: {shortenAddress(account.address)}
          </span>
        )}
      </div>
      <div>
        <ConnectButton />
      </div>
    </div>
  );
};
