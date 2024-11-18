"use client";
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Loader2 } from "lucide-react";
import InputBox from "./InputBox";

const MintCard = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const mintToken = async () => {
    setIsLoading(true);
    try {
      console.log("Minting token with current values:", {
        tokenAddress,
        mintAmount,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const previewMint = () => {
    console.log("Previewing mint with current values:", {
      tokenAddress,
      mintAmount,
    });
  };

  return (
    <div className="flex items-center justify-center px-8 py-8 h-full">
      <div className="w-[50%] transform transition-all duration-500 ease-in-out">
        <div className="bg-white/10 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl">
          <div className="p-6 sm:p-8">
            <div className="mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">
                Mint Your Sol Token
              </h2>
              <p className="mt-2 text-gray-200">
                Enter the token address and amount to mint your Solana tokens
              </p>
            </div>
            <div className="space-y-6">
              <InputBox
                heading="Token Address"
                placeholder="Enter the address of your token"
                value={tokenAddress}
                onChange={setTokenAddress}
              />
              <InputBox
                heading="Mint Amount"
                placeholder="Enter the amount to mint"
                value={mintAmount}
                onChange={setMintAmount}
                type="number"
              />
              <div className="flex  items-center">
                <button
                  onClick={mintToken}
                  disabled={isLoading}
                  className=" px-4 py-3 rounded-lg w-32
                                             bg-gradient-to-r from-purple-500 to-blue-500
                                             text-white shadow-lg 
                                             hover:shadow-purple-500/25 disabled:opacity-70
                                             transform hover:-translate-y-0.5 transition-all 
                                             duration-300 disabled:hover:transform-none
                                             flex items-center justify-center font-semibold"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Mint Token"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintCard;