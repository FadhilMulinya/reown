'use client'

import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import ConnectButton from "../components/ConnectBtn";
import { TodoApp } from "../todo";
import { useTodoContract } from "../hooks/useTodoContract";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const todoContract = useTodoContract();
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Todo dApp
          </h1>
          
          {/* Wallet Connection Section */}
          <div className="flex flex-col items-center gap-4">
            {!isConnected && <ConnectButton />}
            {isConnected && (
              <button 
                onClick={() => setShowDisconnectModal(true)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                Disconnect
              </button>
            )}
          </div>
        </header>

        {/* Connection Status Section */}
        <div className="mt-8 p-6 bg-gray-800 rounded-xl shadow-lg">
          {isConnected ? (
            <div>
              <div className="text-center mb-8">
                <div className="text-gray-400 mb-2">Connected Address:</div>
                <div className="font-mono bg-gray-700 p-3 rounded-lg break-all">
                  {address}
                </div>
              </div>
              
              {/* Todo App Section */}
              <div className="mt-8 bg-gray-900 rounded-xl p-6 text-gray-100">
                {todoContract ? (
                  <TodoApp contract={todoContract} />
                ) : (
                  <div className="text-center text-gray-400">
                    Loading contract...
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 p-4">
              Please connect your wallet to use the Todo App
            </div>
          )}
        </div>
      </div>

      {/* Disconnect Confirmation Modal */}
      {showDisconnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4 text-gray-100">Confirm Disconnect</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to disconnect your wallet?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDisconnectModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  disconnect();
                  setShowDisconnectModal(false);
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}