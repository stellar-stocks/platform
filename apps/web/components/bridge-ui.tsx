// components/bridge-ui.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AppKitButton } from "@reown/appkit/react";
import { ConnectButton } from "@/components/connect-button";
import {
  useAppKitAccount,
  useAppKitProvider,
  useAppKitNetworkCore,
  type Provider,
} from "@reown/appkit/react";
import { BrowserProvider, formatEther, formatUnits } from "ethers";

export enum Network {
  ETHEREUM_SEPOLIA = "Ethereum Sepolia",
  STACKS_L2 = "Stacks L2",
}

export interface Token {
  symbol: string;
  name: string;
  icon: string;
  network: Network;
  balance: number;
  decimals: number;
}

export interface BridgeState {
  fromNetwork: Network;
  toNetwork: Network;
  fromToken: Token;
  toToken: Token;
  amount: string;
  receiveAmount: string;
}

export const TOKENS: Token[] = [
  {
    symbol: "USDC",
    name: "USD Coin (Ethereum)",
    icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    network: Network.ETHEREUM_SEPOLIA,
    balance: 0,
    decimals: 6,
  },
  {
    symbol: "USDC",
    name: "USD Coin (Stacks)",
    icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    network: Network.STACKS_L2,
    balance: 0,
    decimals: 6,
  },
];

export const INITIAL_STATE: BridgeState = {
  fromNetwork: Network.ETHEREUM_SEPOLIA,
  toNetwork: Network.STACKS_L2,
  fromToken: TOKENS[0] ?? TOKENS[0]!, // Fallback with assertion
  toToken: TOKENS[1] ?? TOKENS[1]!, // Fallback with assertion
  amount: "0",
  receiveAmount: "0",
};

export enum BridgeStatus {
  IDLE = "IDLE",
  WITHDRAWING = "WITHDRAWING",
  BRIDGING = "BRIDGING",
  COMPLETED = "COMPLETED",
}

// Extracted Ethereum functionality from AppKit example
const useEthereumBalances = () => {
  const [USDCBalance, setUSDCBalance] = useState("0");
  const [ETHBalance, setETHBalance] = useState("0");
  const [loading, setLoading] = useState(false);

  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetworkCore();
  const { walletProvider } = useAppKitProvider<Provider>("eip155");

  const handleGetBalance = async () => {
    if (!address || !walletProvider || !chainId) return;

    try {
      const provider = new BrowserProvider(walletProvider);
      const balance = await provider.getBalance(address!);
      const eth = formatEther(balance);
      setETHBalance(eth);
    } catch (error) {
      setETHBalance("0");
    }
  };

  const getTokenBalance = async () => {
    if (!isConnected || !address || !walletProvider) return;

    if (chainId !== 11155111) {
      alert("Please switch to Sepolia testnet (chainId: 11155111)");
      return;
    }

    setLoading(true);

    try {
      const contractAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
      const ethersProvider = new BrowserProvider(walletProvider);

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

  // Auto-fetch balances
  useEffect(() => {
    if (isConnected && address && walletProvider) {
      handleGetBalance();
      if (chainId === 11155111) {
        getTokenBalance();
      }
    }
  }, [isConnected, address, walletProvider, chainId]);

  return { USDCBalance, ETHBalance, loading, refetch: getTokenBalance };
};

// Stacks mock balance function
const getStacksUSDCBalance = (): number => {
  // Generate random balance between 100-5000 USDC for demo
  return Math.floor(Math.random() * (5000 - 100) + 100) / 100;
};

export const BridgeUI: React.FC = () => {
  const [state, setState] = useState<BridgeState>(INITIAL_STATE);
  const [stacksAddress, setStacksAddress] = useState<string | null>(null);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [tokenSelectorOpen, setTokenSelectorOpen] = useState<
    "FROM" | "TO" | null
  >(null);
  const [status, setStatus] = useState<BridgeStatus>(BridgeStatus.IDLE);

  // Ethereum balances from AppKit
  const { USDCBalance, ETHBalance, loading } = useEthereumBalances();
  const { address: ethAddress, isConnected } = useAppKitAccount();

  // Update token balances from real data
  useEffect(() => {
    if (isConnected) {
      setState((prev) => ({
        ...prev,
        fromToken: { ...prev.fromToken, balance: parseFloat(USDCBalance) },
      }));
    }
  }, [USDCBalance, isConnected]);

  // Mock Stacks balance update
  useEffect(() => {
    if (stacksAddress) {
      const stacksBalance = getStacksUSDCBalance();
      setState((prev) => ({
        ...prev,
        toToken: { ...prev.toToken, balance: stacksBalance },
      }));
    }
  }, [stacksAddress]);

  useEffect(() => {
    const num = parseFloat(state.amount);
    if (!isNaN(num) && num > 0) {
      setState((prev) => ({ ...prev, receiveAmount: num.toFixed(2) }));
    } else {
      setState((prev) => ({ ...prev, receiveAmount: "0.00" }));
    }
  }, [state.amount]);

  const swapNetworks = () => {
    if (status !== BridgeStatus.IDLE) return;
    setState((prev) => ({
      ...prev,
      fromNetwork: prev.toNetwork,
      toNetwork: prev.fromNetwork,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      amount: prev.receiveAmount,
      receiveAmount: prev.amount,
    }));
  };

  const setPercentage = (pct: number) => {
    const amt = (state.fromToken.balance * pct).toFixed(2);
    setState((prev) => ({ ...prev, amount: amt }));
  };

  const handleConnectStacks = () =>
    setStacksAddress("SP3GP0447GHS4PGEBSR3W11H80EEXX81A5SBRT70");

  const handleBridgeAction = () => {
    if (!ethAddress || !stacksAddress) {
      setWalletModalOpen(true);
      return;
    }
    setStatus(BridgeStatus.WITHDRAWING);
    setTimeout(() => {
      setStatus(BridgeStatus.BRIDGING);
      setTimeout(() => {
        setStatus(BridgeStatus.COMPLETED);
        setTimeout(() => {
          setStatus(BridgeStatus.IDLE);
          setState((prev) => ({ ...prev, amount: "0" }));
        }, 3000);
      }, 4000);
    }, 3000);
  };

  const isBothConnected = !!ethAddress && !!stacksAddress;

  const renderTokenPanel = (type: "FROM" | "TO") => {
    const isFrom = type === "FROM";
    const token = isFrom ? state.fromToken : state.toToken;
    const network = isFrom ? state.fromNetwork : state.toNetwork;
    const networkNameParts = network.split(" ");

    return (
      <div
        className={`bg-[#141414] p-6 ${
          isFrom ? "rounded-t-2xl mb-1" : "rounded-b-2xl"
        } group hover:bg-[#181818] transition-colors relative`}
      >
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            {isFrom ? "You Send" : "You Receive"}
          </span>
          {isFrom && (
            <div className="flex gap-2">
              {[0.25, 0.5, 1].map((p) => (
                <button
                  key={p}
                  onClick={() => setPercentage(p)}
                  className="px-2 py-0.5 text-[10px] font-bold bg-[#202020] hover:bg-blue-500/20 hover:text-blue-400 rounded-md transition-all text-gray-400"
                >
                  {p === 1 ? "MAX" : `${p * 100}%`}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-[160px]">
            <div className="relative flex-shrink-0">
              <img src={token.icon} className="w-12 h-12 rounded-full" alt="" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center border-2 border-[#1c1c1c] overflow-hidden shadow-lg">
                <img
                  src={
                    network.includes("Ethereum")
                      ? "https://cryptologos.cc/logos/ethereum-eth-logo.png"
                      : "https://cryptologos.cc/logos/stacks-stx-logo.png"
                  }
                  className="w-3.5 h-3.5 object-contain"
                  alt=""
                />
              </div>
            </div>
            <div className="flex flex-col items-start leading-tight">
              <div className="font-bold text-base">{token.symbol}</div>
              {/* <div className="text-[11px] text-gray-500 font-medium">
                {networkNameParts[0]}
              </div> */}
              {/* <div className="text-[11px] text-blue-400/80 font-bold uppercase tracking-tight">
                {networkNameParts[1] || ""}
              </div> */}
            </div>
          </div>

          <div className="flex flex-col items-end flex-grow">
            {isFrom ? (
              <input
                type="number"
                min="0"
                step="0.01"
                value={state.amount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || parseFloat(val) >= 0) {
                    setState((prev) => ({ ...prev, amount: val }));
                  }
                }}
                className="bg-transparent text-3xl font-bold outline-none w-full text-right placeholder-gray-800"
                placeholder="0.00"
                disabled={status !== BridgeStatus.IDLE}
              />
            ) : (
              <div className="text-3xl font-bold text-white/90 text-right">
                {state.receiveAmount}
              </div>
            )}
            <div className="text-[11px] text-gray-500 mt-1 font-medium">
              ~$
              {(
                parseFloat(isFrom ? state.amount : state.receiveAmount) || 0
              ).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#050505] text-white selection:bg-blue-500/30">
      <main className="flex-1 w-full max-w-[480px] px-4 py-12 flex flex-col">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-1 relative shadow-2xl">
          {renderTokenPanel("FROM")}

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <button
              onClick={swapNetworks}
              disabled={status !== BridgeStatus.IDLE}
              className="w-12 h-12 bg-[#0d1117] border-[3px] rounded-[14px] flex items-center justify-center hover:scale-110 transition-all shadow-[0_0_20px_rgba(0,0,0,0.6)] disabled:opacity-50 disabled:scale-100 pointer-events-auto active:scale-95 group"
            >
              <div className="flex flex-col items-center gap-0.5 group-hover:rotate-180 transition-transform duration-500">
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 11l5-5 5 5"
                  />
                </svg>
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 13l-5 5-5-5"
                  />
                </svg>
              </div>
            </button>
          </div>

          {renderTokenPanel("TO")}
        </div>

        <button
          onClick={handleBridgeAction}
          disabled={
            status !== BridgeStatus.IDLE ||
            (isBothConnected && parseFloat(state.amount || "0") <= 0) ||
            loading
          }
          className={`mt-6 w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-[0.98] ${
            status === BridgeStatus.IDLE
              ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/10 disabled:bg-[#1a1a1a] disabled:text-gray-600 disabled:shadow-none"
              : "bg-[#1a1a1a] text-blue-400 cursor-not-allowed border border-white/5"
          }`}
        >
          {status === BridgeStatus.IDLE &&
            (isBothConnected ? "Bridge Now" : "Connect Wallets")}
          {status === BridgeStatus.WITHDRAWING && (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <span>Withdrawing...</span>
            </div>
          )}
          {status === BridgeStatus.BRIDGING && (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <span>Verifying...</span>
            </div>
          )}
          {status === BridgeStatus.COMPLETED && (
            <div className="flex items-center justify-center gap-3 text-green-400">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Success</span>
            </div>
          )}
        </button>
      </main>
    </div>
  );
};
