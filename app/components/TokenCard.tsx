"use client";
import { useState } from "react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import axios from 'axios';
import {
  TOKEN_2022_PROGRAM_ID,
  getMintLen,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  TYPE_SIZE,
  LENGTH_SIZE,
  ExtensionType,
  AuthorityType,
  createSetAuthorityInstruction,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";
import { Loader2 } from "lucide-react";
import InputBox from "./InputBox";
import TokenSuccessModal from "./TokenSuccessModal";
import TokenErrorModal from "./TokenErrorModal";

const TokenCard = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [decimal, setDecimal] = useState("");
  const [initialSupply, setInitialSupply] = useState("");
  const [tokenImage, setTokenImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [revokeMintAuthority, setRevokeMintAuthority] = useState(false);
  const [revokeFreezeAuthority, setRevokeFreezeAuthority] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdTokenAddress, setCreatedTokenAddress] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const createToken = async () => {
    setIsLoading(true);
    try {
      if (!tokenName || !tokenSymbol || !decimal || !tokenImage || !tokenDescription) {
        throw new Error("Please fill in all required fields");
      }

      const metadataResponse = await axios.post('https://dummyjson.com/c/generate', {
        json: {
          name: tokenName.trim(),
          symbol: tokenSymbol.trim(),
          description: tokenDescription.trim(),
          image: tokenImage,
        },
        method: 'GET',
      });

      const metadataUrl = metadataResponse.data.url;
      console.log(metadataResponse.data.url);
      const mintKeypair = Keypair.generate();
      const metadata = {
        mint: mintKeypair.publicKey,
        name: tokenName.trim(),
        symbol: tokenSymbol.trim(),
        uri: metadataUrl,
        additionalMetadata: [],
      };

      const mintLen = getMintLen([ExtensionType.MetadataPointer]);
      const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

      const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

      // Transaction 1: Create Mint Account and Initialize Mint
      const transaction1 = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey!,
          newAccountPubkey: mintKeypair.publicKey,
          space: mintLen,
          lamports,
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMetadataPointerInstruction(
          mintKeypair.publicKey,
          wallet.publicKey,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          Number(decimal),
          wallet.publicKey!,
          revokeFreezeAuthority ? null : wallet.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          mint: mintKeypair.publicKey,
          metadata: mintKeypair.publicKey,
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadata.uri,
          mintAuthority: wallet.publicKey!,
          updateAuthority: wallet.publicKey!,
        })
      );

      transaction1.feePayer = wallet.publicKey!;
      transaction1.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      transaction1.partialSign(mintKeypair);

      const signature1 = await wallet.sendTransaction(transaction1, connection);
      await connection.confirmTransaction(signature1, "confirmed");
      console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);

      // Transaction 2: Create Associated Token Account
      const associatedToken = getAssociatedTokenAddressSync(
        mintKeypair.publicKey,
        wallet.publicKey!,
        false,
        TOKEN_2022_PROGRAM_ID
      );
      
      const transaction2 = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey!,
          associatedToken,
          wallet.publicKey!,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        )
      );

      const signature2 = await wallet.sendTransaction(transaction2, connection);
      await connection.confirmTransaction(signature2, "confirmed");

      // Transaction 3: Mint Initial Supply
      if (initialSupply && Number(initialSupply) > 0) {
        const transaction3 = new Transaction().add(
          createMintToInstruction(
            mintKeypair.publicKey,
            associatedToken,
            wallet.publicKey!,
            Number(initialSupply) * Math.pow(10, Number(decimal)),
            [],
            TOKEN_2022_PROGRAM_ID
          )
        );

        const signature3 = await wallet.sendTransaction(transaction3, connection);
        await connection.confirmTransaction(signature3, "confirmed");
      }

      // Transaction 4: Revoke Mint Authority
      if (revokeMintAuthority) {
        const transaction4 = new Transaction().add(
          createSetAuthorityInstruction(
            mintKeypair.publicKey,
            wallet.publicKey!,
            AuthorityType.MintTokens,
            null,
            [],
            TOKEN_2022_PROGRAM_ID
          )
        );

        const signature4 = await wallet.sendTransaction(transaction4, connection);
        await connection.confirmTransaction(signature4, "confirmed");
      }

      setCreatedTokenAddress(mintKeypair.publicKey.toBase58());
      setShowSuccessModal(true);
      setTokenName("");
      setTokenImage("");
      setTokenDescription("");
      setDecimal("");

    } catch (error) {
      console.error("Error creating token:", error);
      setErrorMessage((error as Error).message || "An unexpected error occurred");
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-center px-8 py-6 h-full">
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
              <div className="space-y-5">
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
                <InputBox
                  heading="Token Description"
                  placeholder="Enter a description for your token"
                  value={tokenDescription}
                  onChange={setTokenDescription}
                />
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
                      <h3 className="font-medium text-white">
                        Revoke Mint Authority
                      </h3>
                      <button
                        onClick={() => setRevokeMintAuthority(!revokeMintAuthority)}
                        className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          revokeMintAuthority ? "bg-purple-500" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            revokeMintAuthority ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-sm text-gray-200">
                      Prevent additional token supply
                    </p>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-4">
                      <h3 className="font-medium text-white">
                        Revoke Freeze Authority
                      </h3>
                      <button
                        onClick={() =>
                          setRevokeFreezeAuthority(!revokeFreezeAuthority)
                        }
                        className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          revokeFreezeAuthority ? "bg-purple-500" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            revokeFreezeAuthority ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-sm text-gray-200">
                      Prevent freezing of token accounts
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={createToken}
                    disabled={isLoading}
                    className="px-4 py-3 rounded-lg w-[30%] bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-purple-500/25 disabled:opacity-70 transform hover:-translate-y-0.5 transition-all duration-300 disabled:hover:transform-none flex items-center justify-center font-semibold"
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
      {showSuccessModal && (
        <TokenSuccessModal
          mintAddress={createdTokenAddress}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
      {showErrorModal && (
        <TokenErrorModal
          errorMessage={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
};

export default TokenCard;