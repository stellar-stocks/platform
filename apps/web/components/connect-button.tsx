"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useCreateWallet } from "@privy-io/react-auth/extended-chains";
import { getAddressFromPublicKey } from "@stacks/transactions";
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
  const { wallets } = useWallets();
  const { ready, authenticated, login, logout, user, getAccessToken } =
    usePrivy();
  const { createWallet } = useCreateWallet();

  const [walletId, setWalletId] = useState<string | null>(null);
  const [testnetAddress, setTestnetAddress] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleCopy = async () => {
    if (!testnetAddress) return;
    await copy(testnetAddress);
  };

  // Simplified wallet logic - update addresses when authenticated
  React.useEffect(() => {
    if (authenticated && wallets?.length > 0) {
      const wallet = wallets[0];
      if (wallet?.address) {
        setWalletId(wallet.address);
        setTestnetAddress(
          getAddressFromPublicKey(wallet.address, "testnet") ?? null,
        );
      }
    } else {
      setWalletId(null);
      setTestnetAddress(null);
    }
  }, [authenticated, wallets]);

  if (!ready || !authenticated) {
    return (
      <Button
        onClick={login}
        variant="outline"
        disabled={disabled}
        className={className}
        size={className?.includes("text-xs") ? "sm" : "default"}
      >
        Connect
      </Button>
    );
  }

  const handleWalletClick = () => {
    if (showModalOnMobile) {
      setShowWalletModal(true);
    } else {
      logout();
    }
  };

  return (
    <>
      <Button
        onClick={handleWalletClick}
        variant="outline"
        disabled={disabled}
        className={`${className} text-center flex items-center gap-2`}
      >
        {testnetAddress
          ? `${testnetAddress.slice(0, 6)}...${testnetAddress.slice(-4)}`
          : "Wallet"}
      </Button>
      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogContent className="sm:max-w-md max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Connected Wallet</DialogTitle>
            <DialogDescription>
              <div className="mx-auto w-auto flex items-center justify-center py-4 py-8">
                {testnetAddress && <QRCodeSVG value={testnetAddress} />}
              </div>
              {testnetAddress ? (
                <div className="font-mono text-sm break-all text-center mt-4 flex items-center justify-center gap-2">
                  {/* use turnicated for mobile */}
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
              onClick={() => {
                logout();
                setShowWalletModal(false);
              }}
            >
              Disconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
