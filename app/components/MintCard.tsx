"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { createMintToInstruction, getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
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

      const transaction = new Transaction().add(
        createMintToInstruction(
          mintPublicKey,
          associatedTokenAccount,
          wallet.publicKey!,
          amount,
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
    <div className="flex items-center justify-center px-8 py-8 h-full">
      <div className="w-[50%] transform transition-all duration-500 ease-in-out">
        <div className="bg-white/10 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl">
          <div className="p-6 sm:p-8">
            <div className="mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">
                Mint Your Sol Token
              </h2>
              <p className="mt-2 text-gray-200">
                Enter the token address and amount to mint your Solana tokens.
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
              {errorMessage && (
                <div className="flex mt-2 gap-x-1">
                  <span className="text-md font-bold text-white">Error: </span>
                  <p className="text-white text-md font-bold">{errorMessage}</p>
                </div>
              )}
              {successMessage && (
                <div className="flex  mt-2 gap-x-2">
                  <span className="text-md font-bold text-white">Success: </span>
                  <p className="text-white text-md font-bold">{successMessage}</p>
                </div>
              )}
              <div className="flex items-center">
                <button
                  onClick={mintToken}
                  disabled={isLoading}
                  className="px-4 py-3 rounded-lg w-[30%]
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
