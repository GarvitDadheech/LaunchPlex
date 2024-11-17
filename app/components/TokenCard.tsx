"use client"
import { useState } from "react";
import InputBox from "./InputBox";
import { Connection, Keypair, SystemProgram, Transaction, clusterApiUrl } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ExtensionType, LENGTH_SIZE, TOKEN_2022_PROGRAM_ID, TYPE_SIZE, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, getMintLen } from "@solana/spl-token";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";

const TokenCard = () => {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [tokenName, setTokenName] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");
    const [decimal, setDecimal] = useState("");
    const [tokenImage, setTokenImage] = useState("");
    
    const createToken = async () => {

        // generate account for token
        const mintKeypair = Keypair.generate();

        //define metadata
        const metadata = {
            mint: mintKeypair.publicKey,
            name: 'KIRA',
            symbol: 'KIR    ',
            uri: 'https://cdn.100xdevs.com/metadata.json',
            additionalMetadata: [],
        };

        // we need to calculate space of metadata and the mintAccount to be stored on bc
        const mintLen = getMintLen([ExtensionType.MetadataPointer]);
        const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

        // calculating lamports
        const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

        //now add the transaction and get it signed by the user
        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey!,
                newAccountPubkey:mintKeypair.publicKey,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeMetadataPointerInstruction(mintKeypair.publicKey,wallet.publicKey,mintKeypair.publicKey,TOKEN_2022_PROGRAM_ID),
            createInitializeMintInstruction(mintKeypair.publicKey,9,wallet.publicKey!,null,TOKEN_2022_PROGRAM_ID),
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
        )

        transaction.feePayer = wallet.publicKey!;

        // add the recent blockhash so that miners will accept this transactions otherwise older txns are not accepted in solana unlike ethereum
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        //partially sign as user will fully sign the transaction.
        transaction.partialSign(mintKeypair);

        await wallet.sendTransaction(transaction, connection);
        
    }

    const previewToken = () => {
        console.log("Previewing token with current values:", {
          tokenName,
          tokenSymbol,
          decimal,
          tokenImage
        });
    };

    return (
        <div className="flex flex-col gap-y-6 p-4">
            <div className="flex flex-col gap-y-4">
            <InputBox
                heading="Token Name"
                placeholder="Enter the name of your token"
                value={tokenName}
                onChange={setTokenName}
            />
            <InputBox
                heading="Token Symbol"
                placeholder="Enter the symbol of your token"
                value={tokenSymbol}
                onChange={setTokenSymbol}
            />
            <InputBox
                heading="Decimal"
                placeholder="Enter the decimals you want in the token"
                value={decimal}
                onChange={setDecimal}
            />
            <InputBox
                heading="Token Image"
                placeholder="Enter the uri link of token image"
                value={tokenImage}
                onChange={setTokenImage}
            />
            </div>
            <div className="flex gap-3">
            <button
                onClick={previewToken}
                className="rounded-md bg-gray-100 px-4 py-2 hover:bg-gray-200"
            >
                Preview Token
            </button>
            <button
                onClick={createToken}
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
                Launch Token
            </button>
            </div>
        </div>
    );
};
    
export default TokenCard;