import React, { useState } from "react";
import { CheckCircle2, ExternalLink, ClipboardCopy } from "lucide-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

interface TokenSuccessModalProps {
  mintAddress: string;
  network?: WalletAdapterNetwork;
  onClose: () => void;
}

const TokenSuccessModal = ({
  mintAddress,
  network = WalletAdapterNetwork.Devnet,
  onClose,
}: TokenSuccessModalProps) => {
  const [copied, setCopied] = useState(false);

  const explorerBaseUrls: Partial<Record<WalletAdapterNetwork, string>> = {
    [WalletAdapterNetwork.Devnet]: "https://explorer.solana.com/address/",
    [WalletAdapterNetwork.Mainnet]: "https://explorer.solana.com/address/",
  };

  const explorerUrl = `${explorerBaseUrls[network]}${mintAddress}?cluster=${
    network === WalletAdapterNetwork.Devnet ? "devnet" : "mainnet"
  }`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(mintAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="bg-[#1a1a2e] border border-purple-900/30 rounded-2xl p-4 sm:p-6 md:p-8 
                    w-full max-w-[95%] sm:max-w-[80%] md:max-w-md 
                    shadow-2xl transform transition-all duration-300"
      >
        <div className="flex flex-col items-center space-y-4 sm:space-y-6">
          {/* Success Icon */}
          <CheckCircle2
            className="text-purple-500 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 animate-pulse"
            strokeWidth={1.5}
          />

          {/* Title and Network Info */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Token Created Successfully!
            </h2>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Your token is now live on the{" "}
              {network === WalletAdapterNetwork.Devnet ? "Devnet" : "Mainnet"}
            </p>
          </div>

          {/* Address Display and Actions */}
          <div
            className="w-full bg-purple-900/20 rounded-lg p-2 sm:p-3 md:p-4 
                        flex flex-col sm:flex-row items-start sm:items-center 
                        space-y-2 sm:space-y-0 sm:justify-between"
          >
            <span className="text-gray-300 text-sm sm:text-base truncate w-full sm:w-auto sm:mr-2 break-all sm:break-normal">
              {mintAddress}
            </span>
            <div className="flex space-x-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleCopyAddress}
                className="text-white hover:text-purple-400 transition p-1"
                title="Copy Address"
              >
                {copied ? (
                  <CheckCircle2 className="w-5 h-5 text-purple-400" />
                ) : (
                  <ClipboardCopy className="w-5 h-5" />
                )}
              </button>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-purple-400 transition p-1"
                title="View on Explorer"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 sm:py-3 text-sm sm:text-base
                     bg-gradient-to-r from-purple-600 to-blue-600 
                     text-white rounded-lg hover:opacity-90 transition
                     font-medium sm:font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenSuccessModal;
