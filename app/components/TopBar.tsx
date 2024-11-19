import React from "react";
import { FC } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { Coins, Stamp, Menu } from "lucide-react";
import { useState } from "react";

interface TopBarProps {
  currentNetwork: WalletAdapterNetwork;
  onNetworkChange: (network: WalletAdapterNetwork) => void;
  onPageChange: (page: "create" | "mint") => void;
  currentPage: "create" | "mint";
}

const TopBar: FC<TopBarProps> = ({
  currentNetwork,
  onNetworkChange,
  onPageChange,
  currentPage,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="backdrop-blur-md bg-black/20 border-b border-white/10 shadow-2xl">
        <div className="px-4 md:px-8 lg:px-32 mx-auto">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="flex items-end">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent cursor-pointer">
                  LaunchPlex
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex bg-black/30 rounded-lg p-1 backdrop-blur-sm">
                <button
                  onClick={() => onPageChange("create")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 flex items-center space-x-2
                            ${
                              currentPage === "create"
                                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                                : "text-blue-100 hover:text-white hover:bg-white/10"
                            }`}
                >
                  <Coins size={16} />
                  <span>Create Token</span>
                </button>
                <button
                  onClick={() => onPageChange("mint")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 flex items-center space-x-2
                            ${
                              currentPage === "mint"
                                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                                : "text-blue-100 hover:text-white hover:bg-white/10"
                            }`}
                >
                  <Stamp size={16} />
                  <span>Mint Token</span>
                </button>
              </div>
              <div className="flex bg-black/30 rounded-lg p-1 backdrop-blur-sm">
                <button
                  onClick={() => onNetworkChange(WalletAdapterNetwork.Devnet)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300
                            ${
                              currentNetwork === WalletAdapterNetwork.Devnet
                                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                                : "text-blue-100 hover:text-white hover:bg-white/10"
                            }`}
                >
                  Devnet
                </button>
                <button
                  onClick={() => onNetworkChange(WalletAdapterNetwork.Mainnet)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300
                            ${
                              currentNetwork === WalletAdapterNetwork.Mainnet
                                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                                : "text-blue-100 hover:text-white hover:bg-white/10"
                            }`}
                >
                  Mainnet
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <WalletMultiButton
                  style={{
                    padding: "0.4rem 1rem",
                    borderRadius: "0.75rem",
                    color: "white",
                    fontWeight: "500",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease-out",
                    background: "linear-gradient(to right, #6b46c1, #3b82f6)",
                    transform: "scale(1)",
                    cursor: "pointer",
                  }}
                  //@ts-ignore
                  onMouseOver={(e: any) => {
                    e.target.style.backgroundColor = "#7c3aed";
                    e.target.style.boxShadow =
                      "0 4px 6px rgba(128, 0, 128, 0.25)";
                    e.target.style.transform = "translateY(-0.125rem)";
                    e.target.style.filter = "brightness(1.1)";
                  }}
                  onMouseOut={(e: any) => {
                    e.target.style.backgroundColor = "";
                    e.target.style.boxShadow = "";
                    e.target.style.transform = "";
                    e.target.style.filter = "";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden ${isMenuOpen ? "block" : "hidden"} pb-4`}>
            <div className="space-y-4">
              <div className="flex  space-x-2">
                <button
                  onClick={() => {
                    onPageChange("create");
                    setIsMenuOpen(false);
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center space-x-2
                            ${
                              currentPage === "create"
                                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                                : "text-blue-100 hover:text-white hover:bg-white/10"
                            }`}
                >
                  <Coins size={16} />
                  <span>Create Token</span>
                </button>
                <button
                  onClick={() => {
                    onPageChange("mint");
                    setIsMenuOpen(false);
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center space-x-2
                            ${
                              currentPage === "mint"
                                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                                : "text-blue-100 hover:text-white hover:bg-white/10"
                            }`}
                >
                  <Stamp size={16} />
                  <span>Mint Token</span>
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    onNetworkChange(WalletAdapterNetwork.Devnet);
                    setIsMenuOpen(false);
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300
                            ${
                              currentNetwork === WalletAdapterNetwork.Devnet
                                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                                : "text-blue-100 hover:text-white hover:bg-white/10"
                            }`}
                >
                  Devnet
                </button>
                <button
                  onClick={() => {
                    onNetworkChange(WalletAdapterNetwork.Mainnet);
                    setIsMenuOpen(false);
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300
                            ${
                              currentNetwork === WalletAdapterNetwork.Mainnet
                                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                                : "text-blue-100 hover:text-white hover:bg-white/10"
                            }`}
                >
                  Mainnet
                </button>
              </div>
              <div className="">
                <WalletMultiButton
                  style={{
                    width: "100%",
                    padding: "0.4rem 1rem",
                    borderRadius: "0.75rem",
                    color: "white",
                    fontWeight: "500",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease-out",
                    background: "linear-gradient(to right, #6b46c1, #3b82f6)",
                    transform: "scale(1)",
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
