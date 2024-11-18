// page.tsx
"use client"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import TokenCard from "./components/TokenCard";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import TopBar from "./components/TopBar";
import { clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useMemo, useState } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import MintCard from "./components/MintCard";

require('@solana/wallet-adapter-react-ui/styles.css');

export default function Home() {
  const [network, setNetwork] = useState<WalletAdapterNetwork>(WalletAdapterNetwork.Devnet);
  const [currentPage, setCurrentPage] = useState<'create' | 'mint'>('create');

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  const endpoint = useMemo(() => {
    if (network === WalletAdapterNetwork.Mainnet) {
      return clusterApiUrl(WalletAdapterNetwork.Mainnet);
    }
    return clusterApiUrl(WalletAdapterNetwork.Devnet);
  }, [network]);

  return (
    <div className="min-h-screen bg-custom-bg bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <div className="relative z-10">
            <TopBar 
              currentNetwork={network} 
              onNetworkChange={setNetwork}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
            <main className="container mx-auto px-4 pt-24 pb-12">
              {currentPage === 'create' ? <TokenCard /> : <MintCard />}
            </main>
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}