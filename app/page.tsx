"use client";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import TokenCard from "./components/TokenCard";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import TopBar from "./components/TopBar";
import { clusterApiUrl } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { useMemo, useState } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import MintCard from "./components/MintCard";
import BottomBar from "./components/BottomBar";
import "@solana/wallet-adapter-react-ui/styles.css";

export default function Home() {
  const [network, setNetwork] = useState<WalletAdapterNetwork>(
    WalletAdapterNetwork.Devnet
  );
  const [currentPage, setCurrentPage] = useState<"create" | "mint">("create");

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  const endpoint = useMemo(() => {
    if (network === WalletAdapterNetwork.Mainnet) {
      return clusterApiUrl(WalletAdapterNetwork.Mainnet);
    }
    return clusterApiUrl(WalletAdapterNetwork.Devnet);
  }, [network]);

  return (
    <div className="relative min-h-screen w-full bg-custom-bg bg-cover bg-center bg-fixed">
    <div className="relative w-full min-h-screen flex flex-col">
      <div className="absolute inset-0 w-full h-full bg-black/10 backdrop-blur-[2px] supports-[backdrop-filter]:backdrop-blur-[2px]" />
      
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <div className="relative z-10 flex flex-col min-h-screen">
              <TopBar
                currentNetwork={network}
                onNetworkChange={setNetwork}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
              <main className="flex-grow container mx-auto px-4 pt-24">
                {currentPage === "create" ? <TokenCard /> : <MintCard />}
              </main>
              <BottomBar/>
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  </div>
  );
}
