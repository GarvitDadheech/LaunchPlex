"use client";
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Loader2 } from "lucide-react";
import InputBox from "./InputBox";

const TokenCard = () => {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [decimal, setDecimal] = useState("");
  const [initialSupply, setInitialSupply] = useState("");
  const [tokenImage, setTokenImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [revokeMintAuthority, setRevokeMintAuthority] = useState(false);
  const [revokeFreezeAuthority, setRevokeFreezeAuthority] = useState(false);

  const createToken = async () => {
    setIsLoading(true);
    try {
      console.log("Creating token with current values:", {
        tokenName,
        tokenSymbol,
        decimal,
        initialSupply,
        tokenImage,
        revokeMintAuthority,
        revokeFreezeAuthority,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const previewToken = () => {
    console.log("Previewing token with current values:", {
      tokenName,
      tokenSymbol,
      decimal,
      initialSupply,
      tokenImage,
      revokeMintAuthority,
      revokeFreezeAuthority,
    });
  };

  return (
    <div className="flex items-center justify-center px-8 py-8 h-full">
      <div className="w-[50%] transform transition-all duration-500 ease-in-out">
        <div className="bg-white/10 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl">
          <div className="p-6 sm:p-8">
            <div className="mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">
                Create Your Sol Token
              </h2>
              <p className="mt-2 text-gray-200">
                Fill in the details below to launch your own Solana token
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <InputBox
                    heading="Token Name"
                    placeholder="Enter the name of your token"
                    value={tokenName}
                    onChange={setTokenName}
                  />
                </div>
                <div className="flex-1">
                  <InputBox
                    heading="Token Symbol"
                    placeholder="Enter the symbol of your token"
                    value={tokenSymbol}
                    onChange={setTokenSymbol}
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <InputBox
                    heading="Decimal"
                    placeholder="Enter the decimals you want in the token"
                    value={decimal}
                    onChange={setDecimal}
                    type="number"
                  />
                </div>
                <div className="flex-1">
                  <InputBox
                    heading="Initial Supply"
                    placeholder="Enter the initial supply of your token"
                    value={initialSupply}
                    onChange={setInitialSupply}
                    type="number"
                  />
                </div>
              </div>
              <InputBox
                heading="Token Image"
                placeholder="Enter the URI link of token image"
                value={tokenImage}
                onChange={setTokenImage}
              />
              <div className="flex space-x-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-medium text-white">Revoke Mint Authority</h3>
                    <button
                      onClick={() => setRevokeMintAuthority(!revokeMintAuthority)}
                      className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        revokeMintAuthority ? 'bg-purple-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          revokeMintAuthority ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    </div>
                    <p className="text-sm text-gray-300">Prevent additional token supply</p>
                  
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-medium text-white">Revoke Freeze Authority</h3>
                    <button
                      onClick={() => setRevokeFreezeAuthority(!revokeFreezeAuthority)}
                      className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        revokeFreezeAuthority ? 'bg-purple-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          revokeFreezeAuthority ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    </div>
                    <p className="text-sm text-gray-300">Prevent token freezing</p>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={previewToken}
                  className="flex-1 px-4 py-3 rounded-lg 
                            bg-gray-800 text-gray-300
                            transition-all duration-300
                            transform hover:-translate-y-0.5 border border-gray-700 font-semibold hover:shadow-purple-500/25"
                >
                  Preview Token
                </button>
                <button
                  onClick={createToken}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-lg
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
                    "Launch Token"
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

export default TokenCard;