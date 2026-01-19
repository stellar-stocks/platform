import React, { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useCreateWallet } from "@privy-io/react-auth/extended-chains";
import { getAddressFromPublicKey } from "@stacks/transactions";
import { Button } from "./ui/button";

export function ConnectButton({ disabled }: { disabled?: boolean }) {
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

  // Create wallet automatically after authentication
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
    if (authenticated && !walletId && !isCreating) {
      create();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  if (!authenticated) {
    return (
      <Button onClick={login} variant={"default"} disabled={disabled}>
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-md">
      <Button
        onClick={logout}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full"
        disabled={disabled}
      >
        Disconnect
      </Button>
      {isCreating && (
        <div className="w-full bg-blue-100 text-blue-700 p-2 rounded text-sm text-center">
          Creating wallet...
        </div>
      )}
      {error && (
        <div className="w-full bg-red-100 text-red-700 p-2 rounded text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="w-full bg-green-100 text-green-700 p-2 rounded text-sm">
          {success}
        </div>
      )}
      {walletId && (
        <div className="w-full text-left bg-black text-green-400 p-2 rounded font-mono text-sm mb-2">
          <div>Wallet ID: {walletId}</div>
          {walletPublicKey && <div>Public Key: {walletPublicKey}</div>}
          {mainnetAddress && <div>Mainnet Address: {mainnetAddress}</div>}
          {testnetAddress && <div>Testnet Address: {testnetAddress}</div>}
        </div>
      )}
    </div>
  );
}
