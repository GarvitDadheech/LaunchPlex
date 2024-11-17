"use client"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import TokenCard from "./components/TokenCard";
import { WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Home() {
  return (
    <div className="bg-custom-bg min-h-screen bg-cover bg-center">
      <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <WalletMultiButton/>
            <WalletDisconnectButton/>
        <div>
          LaunchPlex
          <TokenCard />
        </div>
        </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}
