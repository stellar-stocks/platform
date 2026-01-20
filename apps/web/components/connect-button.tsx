import React, { useState, useEffect } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useCreateWallet } from "@privy-io/react-auth/extended-chains";
import { getAddressFromPublicKey } from "@stacks/transactions";
import { Button } from "./ui/button";

export function ConnectButton({ disabled }: { disabled?: boolean }) {
  const { wallets } = useWallets();
  const { ready, authenticated, login, logout, user, getAccessToken } =
    usePrivy();
  const { createWallet } = useCreateWallet();
  const [walletId, setWalletId] = useState<string | null>(null);
  const [walletPublicKey, setWalletPublicKey] = useState<string | null>(null);
  const [mainnetAddress, setMainnetAddress] = useState<string | null>(null);
  const [testnetAddress, setTestnetAddress] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Always set addresses from existing wallet(s) after authentication or wallet change
  useEffect(() => {
    if (authenticated && wallets && wallets.length > 0) {
      // Use the first wallet for address display (customize as needed)
      const wallet = wallets[0];
      if (wallet && wallet.address) {
        setWalletId(wallet.address ?? null);
        setWalletPublicKey(wallet.address ?? null);
        setMainnetAddress(
          getAddressFromPublicKey(wallet.address, "mainnet") ?? null,
        );
        setTestnetAddress(
          getAddressFromPublicKey(wallet.address, "testnet") ?? null,
        );
      }
    } else {
      setWalletId(null);
      setWalletPublicKey(null);
      setMainnetAddress(null);
      setTestnetAddress(null);
    }
  }, [authenticated, wallets]);

  // Create wallet automatically after authentication if none exists
  useEffect(() => {
    const create = async () => {
      setIsCreating(true);
      setError(null);
      setSuccess(null);
      try {
        const walletResult = await createWallet({
          chainType: "bitcoin-segwit",
        });
        setWalletId(walletResult.wallet.id ?? null);
        setWalletPublicKey(walletResult.wallet.public_key ?? null);
        if (walletResult.wallet.public_key) {
          setMainnetAddress(
            getAddressFromPublicKey(
              walletResult.wallet.public_key,
              "mainnet",
            ) ?? null,
          );
          setTestnetAddress(
            getAddressFromPublicKey(
              walletResult.wallet.public_key,
              "testnet",
            ) ?? null,
          );
        }
        setSuccess("Wallet created successfully!");
      } catch (e: any) {
        setError(e.message || "Failed to create wallet");
      } finally {
        setIsCreating(false);
      }
    };
    if (authenticated && (!wallets || wallets.length === 0) && !isCreating) {
      create();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, wallets]);

  if (!authenticated) {
    return (
      <Button onClick={login} variant={"default"} disabled={disabled}>
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 w-full max-w-md">
      {/* only show first 6 and last 4 characters if address exists */}
      {testnetAddress ? (
        <Button variant={"ghost"}>
          {`${testnetAddress.slice(0, 6)}...${testnetAddress.slice(-4)}`}
        </Button>
      ) : null}
      <Button
        onClick={logout}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        disabled={disabled}
      >
        Disconnect
      </Button>
    </div>
  );
}
