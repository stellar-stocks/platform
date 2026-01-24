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
  const { wallets } = useWallets();
  const { ready, authenticated, login, logout, user, getAccessToken } =
    usePrivy();
  const { createWallet } = useCreateWallet();

  const [walletId, setWalletId] = useState<string | null>(null);
  const [testnetAddress, setTestnetAddress] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);

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
        className={`${className} text-center`}
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
              <div className="mx-auto w-auto flex items-center justify-center py-2">
                {testnetAddress && <QRCodeSVG value={testnetAddress} />}
              </div>
              {testnetAddress ? (
                <div className="font-mono text-sm break-all text-center mt-4">
                  {testnetAddress}
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
