"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { createMintToInstruction, getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID, getMint } from "@solana/spl-token";
import InputBox from "./InputBox";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const MintCard = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [tokenAddress, setTokenAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const mintToken = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      if (!tokenAddress || !mintAmount || parseFloat(mintAmount) <= 0) {
        throw new Error("Invalid token address or mint amount");
      }

      const mintPublicKey = new PublicKey(tokenAddress);
      const amount = parseFloat(mintAmount);
      const associatedTokenAccount = getAssociatedTokenAddressSync(
        mintPublicKey,
        wallet.publicKey!,
        false,
        TOKEN_2022_PROGRAM_ID
      );
      const accountInfo = await connection.getAccountInfo(associatedTokenAccount);
      if (!accountInfo) {
        throw new Error("Associated token account does not exist. Please create one before minting tokens.");
      }
      const mintInfo = await getMint(connection, mintPublicKey, "confirmed", TOKEN_2022_PROGRAM_ID);
      const decimal = mintInfo.decimals;
      const transaction = new Transaction().add(
        createMintToInstruction(
          mintPublicKey,
          associatedTokenAccount,
          wallet.publicKey!,
          amount * Math.pow(10, Number(decimal)),
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );

      transaction.feePayer = wallet.publicKey!;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      setSuccessMessage(`Minted ${amount} tokens to ${associatedTokenAccount.toBase58()}`);
    } catch (error) {
      setErrorMessage((error as Error).message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-start mt-6 justify-center p-4 sm:p-6 md:p-8 min-h-screen">
      <div className="w-full max-w-[90%] md:max-w-[70%] lg:max-w-[50%] transform transition-all duration-500 ease-in-out">
        <div className="bg-white/10 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="mb-6 md:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">
                Mint Your Sol Token
              </h2>
              <p className="mt-2 text-sm sm:text-base text-gray-200">
                Enter the token address and amount to mint your Solana tokens.
              </p>
            </div>
            <div className="space-y-4 sm:space-y-6">
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
              
              {/* Error and Success Messages */}
              <div className="space-y-2">
                {errorMessage && (
                  <div className="flex flex-col sm:flex-row mt-2 gap-1 sm:gap-x-1">
                    <span className="text-sm sm:text-md font-bold text-white">Error: </span>
                    <p className="text-white text-sm sm:text-md font-bold break-words">{errorMessage}</p>
                  </div>
                )}
                {successMessage && (
                  <div className="flex flex-col sm:flex-row mt-2 gap-1 sm:gap-x-2">
                    <span className="text-sm sm:text-md font-bold text-white">Success: </span>
                    <p className="text-white text-sm sm:text-md font-bold break-words">{successMessage}</p>
                  </div>
                )}
              </div>

              {/* Mint Button */}
              <div className="flex items-center">
                <button
                  onClick={mintToken}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-4 py-3 rounded-lg
                           bg-gradient-to-r from-purple-500 to-blue-500
                           text-white shadow-lg 
                           hover:shadow-purple-500/25 disabled:opacity-70
                           transform hover:-translate-y-0.5 transition-all 
                           duration-300 disabled:hover:transform-none
                           flex items-center justify-center font-semibold
                           text-sm sm:text-base
                           min-w-[120px] sm:min-w-[140px]"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
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