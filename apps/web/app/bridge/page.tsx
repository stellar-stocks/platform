"use client";

import React, { useEffect } from "react";
import { AppKitButton } from "@reown/appkit/react";
import { ConnectButton } from "@/components/connect-button";
import {
  useAppKitAccount,
  useAppKitProvider,
  useAppKitNetworkCore,
  type Provider,
} from "@reown/appkit/react";
import { BrowserProvider, formatEther, formatUnits } from "ethers";
import { ERC20_ABI } from "@/utils/constants";

export default function Bridge() {
  const [USDCBalance, setUSDCBalance] = React.useState("0");
  const [ETHBalance, setETHBalance] = React.useState("0");
  const [loading, setLoading] = React.useState(false);

  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetworkCore();
  const { walletProvider } = useAppKitProvider<Provider>("eip155");

  const handleGetBalance = async () => {
    if (!address || !walletProvider || !chainId) {
      return;
    }

    try {
      const provider = new BrowserProvider(walletProvider);
      const balance = await provider.getBalance(address!);
      const eth = formatEther(balance);
      setETHBalance(eth);
    } catch (error) {
      setETHBalance("0");
    }
  };

  const handleSignMsg = async () => {
    if (!address || !walletProvider || !chainId) {
      return;
    }

    try {
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      await signer.signMessage("Hello Reown AppKit!");
    } catch (error) {
      // Handle error silently
    }
  };

  const getTokenBalance = async () => {
    if (!isConnected || !address || !walletProvider) {
      return;
    }

    if (chainId !== 11155111) {
      alert("Please switch to Sepolia testnet (chainId: 11155111)");
      return;
    }

    setLoading(true);

    try {
      const contractAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
      const ethersProvider = new BrowserProvider(walletProvider);

      // FIXED: Use proper static call interface
      const balanceCall = {
        to: contractAddress,
        data: "0x70a08231" + "000000000000000000000000" + address!.slice(2),
      };

      const decimalsCall = {
        to: contractAddress,
        data: "0x313ce567",
      };

      const [balanceResult, decimalsResult] = await Promise.all([
        ethersProvider.call(balanceCall),
        ethersProvider.call(decimalsCall),
      ]);

      // Parse ABI encoded results
      const balance = BigInt("0x" + balanceResult.slice(-64));
      const decimals = parseInt("0x" + decimalsResult.slice(-64));

      const finalBalance = formatUnits(balance, decimals);
      setUSDCBalance(finalBalance);
    } catch (error) {
      console.error("USDC error:", error);
      setUSDCBalance("0");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch balances when wallet connects
  useEffect(() => {
    if (isConnected && address && walletProvider) {
      handleGetBalance();
      if (chainId === 11155111) {
        getTokenBalance();
      }
    }
  }, [isConnected, address, walletProvider, chainId]);

  return (
    <div className="p-8 max-w-2xl mx-auto flex-1 flex flex-col items-center justify-center overflow-hidden">
      <h1 className="text-3xl font-bold mb-8 text-center">Bridge</h1>

      {!isConnected ? (
        <div className="flex flex-col items-center justify-center gap-4 p-12">
          <p className="text-gray-500">Connect your wallet to continue</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <AppKitButton />
            <ConnectButton />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-100 p-6 rounded-lg border">
            <p className="text-sm text-gray-600 mb-2">
              Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
            <p className="text-sm text-gray-600">
              Chain ID: {chainId || "Not connected"}{" "}
              {chainId !== 11155111 && "(Switch to Sepolia)"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleGetBalance}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 border border-blue-600"
              disabled={!address || !walletProvider}
            >
              Get ETH Balance
            </button>
            <button
              onClick={handleSignMsg}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 border border-green-600"
              disabled={!address || !walletProvider}
            >
              Sign Message
            </button>
            <button
              onClick={getTokenBalance}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 border border-purple-600"
              disabled={!address || !walletProvider || loading}
            >
              {loading ? "Loading..." : "Get USDC Balance"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">ETH Balance</h3>
              <p className="text-2xl font-bold">{ETHBalance || "0.00"}</p>
            </div>
            <div className="border p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                USDC Balance (Sepolia)
              </h3>
              <p className="text-2xl font-bold">{USDCBalance || "0.00"}</p>
            </div>

            <AppKitButton />
            <ConnectButton />
          </div>
        </div>
      )}
    </div>
  );
}
