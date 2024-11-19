import React from "react";
import { AlertCircle } from "lucide-react";

interface TokenErrorModalProps {
  errorMessage: string;
  onClose: () => void;
}

const TokenErrorModal = ({ errorMessage, onClose }: TokenErrorModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="bg-[#1a1a2e] border border-red-900/30 rounded-2xl 
                    p-4 sm:p-6 md:p-8 
                    w-full max-w-[95%] sm:max-w-[80%] md:max-w-md 
                    shadow-2xl transform transition-all duration-300"
      >
        <div className="flex flex-col items-center space-y-4 sm:space-y-6">
          {/* Error Icon */}
          <AlertCircle
            className="text-red-500 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 animate-pulse"
            strokeWidth={1.5}
          />

          {/* Error Message Content */}
          <div className="text-center w-full">
            <h2
              className="text-2xl sm:text-2xl md:text-3xl font-bold 
                         bg-gradient-to-r from-red-400 to-pink-400 
                         bg-clip-text text-transparent"
            >
              Token Creation Failed
            </h2>
            <p
              className="text-gray-300 mt-2 text-sm sm:text-base 
                       break-words px-2 sm:px-4 
                       max-h-[150px] overflow-y-auto"
            >
              {errorMessage}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 sm:py-3 
                     text-sm sm:text-base
                     bg-gradient-to-r from-red-600 to-pink-600 
                     text-white rounded-lg 
                     hover:opacity-90 transition
                     font-medium sm:font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenErrorModal;
