import React from 'react';
import { AlertCircle } from 'lucide-react';
interface TokenErrorModalProps{
    errorMessage: string,
    onClose: () => void;
}
const TokenErrorModal = ({ 
  errorMessage, 
  onClose 
} : TokenErrorModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#1a1a2e] border border-red-900/30 rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300">
        <div className="flex flex-col items-center space-y-6">
          <AlertCircle 
            className="text-red-500 w-20 h-20 animate-pulse" 
            strokeWidth={1.5} 
          />
          
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              Token Creation Failed
            </h2>
            <p className="text-gray-300 mt-2 break-words">
              {errorMessage}
            </p>
          </div>

          <button 
            onClick={onClose}
            className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenErrorModal;