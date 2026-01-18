"use client";
import {
  usePrivy,
  useSessionSigners,
  useAuthorizationSignature,
} from "@privy-io/react-auth";
import { useCreateWallet } from "@privy-io/react-auth/extended-chains";
import { getAddressFromPublicKey } from "@stacks/transactions";
import { useState, useEffect } from "react";

export default function Home() {
  const {
    ready,
    authenticated,
    user,
    login,
    logout,
    exportWallet,
    getAccessToken,
  } = usePrivy();
  const { createWallet } = useCreateWallet();
  const { addSessionSigners } = useSessionSigners();
  const { generateAuthorizationSignature } = useAuthorizationSignature();
  const [isCreatingClientWallet, setIsCreatingClientWallet] = useState(false);
  const [isCreatingServerWallet, setIsCreatingServerWallet] = useState(false);
  const [walletCreationError, setWalletCreationError] = useState<string | null>(
    null,
  );
  const [walletCreationSuccess, setWalletCreationSuccess] = useState<
    string | null
  >(null);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [walletPublicKey, setWalletPublicKey] = useState<string | null>(null);
  const [mainnetAddress, setMainnetAddress] = useState<string | null>(null);
  const [testnetAddress, setTestnetAddress] = useState<string | null>(null);
  const [isExportingKey, setIsExportingKey] = useState(false);
  const [exportKeyError, setExportKeyError] = useState<string | null>(null);
  const [exportedKeyData, setExportedKeyData] = useState<any>(null);

  // Create client-side wallet
  const handleCreateClientWallet = async () => {
    setIsCreatingClientWallet(true);
    setWalletCreationError(null);
    setWalletCreationSuccess(null);
    try {
      const walletResult = await createWallet({ chainType: "bitcoin-segwit" });
      setWalletId(walletResult.wallet.id ?? null);
      setWalletPublicKey(walletResult.wallet.public_key ?? null);
      if (walletResult.wallet.public_key) {
        setMainnetAddress(
          getAddressFromPublicKey(walletResult.wallet.public_key, "mainnet") ??
            null,
        );
        setTestnetAddress(
          getAddressFromPublicKey(walletResult.wallet.public_key, "testnet") ??
            null,
        );
      }
      setWalletCreationSuccess("Client-side wallet created successfully!");
    } catch (e: any) {
      setWalletCreationError(e.message || "Failed to create wallet");
    } finally {
      setIsCreatingClientWallet(false);
    }
  };

  // Create server-side wallet
  const handleCreateServerWallet = async () => {
    setIsCreatingServerWallet(true);
    setWalletCreationError(null);
    setWalletCreationSuccess(null);
    try {
      if (!user?.id) throw new Error("User not found");
      const accessToken = await getAccessToken();
      const response = await fetch("/api/create-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId: user.id, chainType: "bitcoin-segwit" }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to create server wallet");
      }
      setWalletId(result.wallet.id ?? null);
      setWalletPublicKey(result.wallet.public_key ?? null);
      if (result.wallet.public_key) {
        setMainnetAddress(
          getAddressFromPublicKey(result.wallet.public_key, "mainnet") ?? null,
        );
        setTestnetAddress(
          getAddressFromPublicKey(result.wallet.public_key, "testnet") ?? null,
        );
      }
      setWalletCreationSuccess("Server-side wallet created successfully!");
    } catch (e: any) {
      setWalletCreationError(e.message || "Failed to create server wallet");
    } finally {
      setIsCreatingServerWallet(false);
    }
  };

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Stellar Stocks (Stacks Wallet Demo)
      </h1>
      {!authenticated ? (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={login}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login with Email
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 items-center border p-6 rounded bg-white shadow w-full max-w-lg mx-auto">
          <h2 className="text-xl mb-2">Stacks Wallet Dashboard</h2>
          <div className="flex gap-2 w-full">
            <button
              onClick={handleCreateClientWallet}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={isCreatingClientWallet || !!walletId}
            >
              {isCreatingClientWallet
                ? "Creating..."
                : walletId
                  ? "Wallet Ready"
                  : "Create Client Wallet"}
            </button>
            <button
              onClick={handleCreateServerWallet}
              className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
              disabled={isCreatingServerWallet || !!walletId}
            >
              {isCreatingServerWallet
                ? "Creating..."
                : walletId
                  ? "Wallet Ready"
                  : "Create Server Wallet"}
            </button>
          </div>
          {walletCreationError && (
            <div className="w-full bg-red-100 text-red-700 p-2 rounded text-sm">
              {walletCreationError}
            </div>
          )}
          {walletCreationSuccess && (
            <div className="w-full bg-green-100 text-green-700 p-2 rounded text-sm">
              {walletCreationSuccess}
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

          <button
            onClick={logout}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
