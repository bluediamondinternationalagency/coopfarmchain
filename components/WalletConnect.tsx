
import React, { useState } from 'react';

interface WalletConnectProps {
  onConnect: (address: string) => void;
  connectedAddress?: string;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect, connectedAddress }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulating Pera Wallet connection logic
    setTimeout(() => {
      const mockAddress = "FARM_" + Math.random().toString(36).substring(2, 12).toUpperCase() + "_ALGO";
      onConnect(mockAddress);
      setIsConnecting(false);
    }, 1500);
  };

  if (connectedAddress) {
    return (
      <div className="flex items-center space-x-3 bg-pasture/10 px-4 py-2 rounded-2xl border border-pasture/20">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-[10px] font-mono font-bold text-pasture">
          {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-6)}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="flex items-center space-x-3 bg-black text-white px-8 py-4 rounded-2xl font-bold text-sm hover:scale-[1.02] transition-all shadow-xl shadow-black/10 disabled:opacity-50"
    >
      {isConnecting ? (
        <i className="fas fa-circle-notch animate-spin text-xs"></i>
      ) : (
        <i className="fas fa-wallet text-xs"></i>
      )}
      <span>{isConnecting ? 'Opening Pera...' : 'Connect Pera Wallet'}</span>
    </button>
  );
};

export default WalletConnect;
