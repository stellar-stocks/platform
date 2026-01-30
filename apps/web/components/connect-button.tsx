"use client";

import React, { useState, createContext, useContext } from "react";
import { QRCodeSVG } from "qrcode.react";
import { connect, disconnect } from '@stacks/connect';
import type { GetAddressesResult } from '@stacks/connect/dist/types/methods';
import { useAtom } from 'jotai';
import { stacksWalletAtom } from "@/state/stacks-wallet";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { useClipboard } from "@/hooks/use-clipboard";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy } from "lucide-react";

interface ConnectButtonProps {
  disabled?: boolean;
  className?: string;
  showModalOnMobile?: boolean;
}

export function ConnectButton({
  disabled,
  className,
  showModalOnMobile = true,
}: ConnectButtonProps) {
  const { copy, isCopied } = useClipboard();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletState, setWalletState] = useAtom(stacksWalletAtom);
  const [bns, setBns] = useState<string>('');

  const { isConnected, address: testnetAddress } = walletState;

  async function connectWallet() {
    try {
      let connectionResponse: GetAddressesResult = await connect();
      const targetAddress = connectionResponse.addresses[2]?.address || connectionResponse.addresses[0]?.address;
      
      if (targetAddress) {
        setWalletState({
          isConnected: true,
          address: targetAddress,
          walletInfo: connectionResponse,
        });
        
        await getBns(targetAddress);
      }
    } catch (error) {
      console.error("Connection failed", error);
    }
  }

  function disconnectWallet() {
    disconnect();
    setWalletState({
      isConnected: false,
      address: null,
      walletInfo: null,
    });
    setBns('');
    setShowWalletModal(false);
  }
  
  async function getBns(stxAddress: string) {
    try {
      let response = await fetch(`https://api.bnsv2.com/testnet/names/address/${stxAddress}/valid`);
      let data = await response.json();
      if (data.names && data.names.length > 0) {
        setBns(data.names[0].full_name);
        return data.names[0].full_name;
      }
    } catch (e) {
      console.error("Failed to get BNS", e);
    }
    return "";
  }

  const handleCopy = async () => {
    if (!testnetAddress) return;
    await copy(testnetAddress);
  };

  const handleWalletClick = () => {
    if (showModalOnMobile) {
      setShowWalletModal(true);
    } else {
      disconnectWallet();
    }
  };

  if (!isConnected) {
    return (
      <Button
        onClick={connectWallet}
        variant="outline"
        disabled={disabled}
        className={className}
        size={className?.includes("text-xs") ? "sm" : "default"}
      >
        Connect
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={handleWalletClick}
        variant="outline"
        disabled={disabled}
        className={`${className} text-center flex items-center gap-2`}
      >
        {bns || (testnetAddress
          ? `${testnetAddress.slice(0, 6)}...${testnetAddress.slice(-4)}`
          : "Wallet")}
      </Button>
      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogContent className="sm:max-w-md max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Connected Wallet</DialogTitle>
            <DialogDescription>
              <span className="mx-auto w-auto flex items-center justify-center py-4 py-8">
                {testnetAddress && <QRCodeSVG value={testnetAddress} />}
              </span>
              {testnetAddress ? (
                <div className="font-mono text-sm break-all text-center mt-4 flex items-center justify-center gap-2">
                  <span className="hidden md:block">{testnetAddress}</span>
                  <span className="md:hidden">
                    {`${testnetAddress.slice(0, 8)}...${testnetAddress.slice(-6)} `}
                  </span>
                  <button
                    onClick={handleCopy}
                    className={`p-2 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-800 ${className}`}
                    disabled={isCopied}
                    aria-label={isCopied ? "Copied!" : "Copy to clipboard"}
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.div
                        key={isCopied ? "check" : "copy"}
                        initial={{
                          opacity: 0,
                          scale: 0.25,
                          filter: "blur(4px)",
                        }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                        transition={{
                          type: "spring",
                          duration: 0.3,
                          bounce: 0,
                        }}
                      >
                        {isCopied ? (
                          <Check className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </button>
                </div>
              ) : (
                "Wallet connected"
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={disconnectWallet}
            >
              Disconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface StacksConnectionContextValue {
  isConnected: boolean;
  testnetAddress: string | null;
  walletInfo: any;
  bns: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const StacksConnectionContext = createContext<StacksConnectionContextValue | null>(null);

// ✅ PROVIDER - Wrap your app or BridgeUI
export const StacksConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [testnetAddress, setTestnetAddress] = useState<string | null>(null);
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [bns, setBns] = useState('');

  async function connectWallet() {
    try {
      let connectionResponse: GetAddressesResult = await connect();
      const targetAddress = connectionResponse.addresses[2]?.address || connectionResponse.addresses[0]?.address;

      if (targetAddress) {
        setIsConnected(true);
        setWalletInfo(connectionResponse);
        setTestnetAddress(targetAddress);
        const bnsName = await getBns(targetAddress);
        setBns(bnsName);
      }
    } catch (error) {
      console.error("Connection failed", error);
    }
  }

  async function disconnectWallet() {
    disconnect();
    setIsConnected(false);
    setWalletInfo(null);
    setTestnetAddress(null);
    setBns('');
  }

  async function getBns(stxAddress: string) {
    try {
      let response = await fetch(`https://api.bnsv2.com/testnet/names/address/${stxAddress}/valid`);
      let data = await response.json();
      if (data.names && data.names.length > 0) {
        return data.names[0].full_name;
      }
    } catch (e) {
      console.error("Failed to get BNS", e);
    }
    return "";
  }

  return (
    <StacksConnectionContext.Provider value={{
      isConnected,
      testnetAddress,
      walletInfo,
      bns,
      connectWallet,
      disconnectWallet,
    }}>
      {children}
    </StacksConnectionContext.Provider>
  );
};

// ✅ HOOK - Use in BridgeUI
export const useStacksConnection = () => {
  const context = useContext(StacksConnectionContext);
  if (!context) {
    throw new Error('useStacksConnection must be used within StacksConnectionProvider');
  }
  return context;
};
