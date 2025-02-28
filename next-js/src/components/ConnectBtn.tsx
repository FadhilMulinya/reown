'use client';

import { useConnect } from 'wagmi';

export default function ConnectButton() {
  const { connect, connectors, status } = useConnect();
  const connector = connectors[0]; // Use the first available connector (injected/MetaMask)

  if (!connector) return null;

  return (
    <button
      onClick={() => connect({ connector })}
      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200 text-sm font-medium"
      disabled={status === 'pending'}
    >
      {status === 'pending' ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}