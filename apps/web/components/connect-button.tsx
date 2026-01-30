"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
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
import { useStacksWallet } from "@/hooks/use-stacks-wallet";

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
  
  const { isConnected, address: testnetAddress, bnsName, connectWallet, disconnectWallet } = useStacksWallet();

  const handleDisconnect = () => {
    disconnectWallet();
    setShowWalletModal(false);
  };

  const handleCopy = async () => {
    if (!testnetAddress) return;
    await copy(testnetAddress);
  };

  const handleWalletClick = () => {
    if (showModalOnMobile) {
      setShowWalletModal(true);
    } else {
      handleDisconnect();
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
        {bnsName || (testnetAddress
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
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
