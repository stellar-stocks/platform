import {
  usePrivy,
  useSessionSigners,
  useAuthorizationSignature,
} from "@privy-io/react-auth";
import { useCreateWallet } from "@privy-io/react-auth/extended-chains";
import { getAddressFromPublicKey } from "@stacks/transactions";
import { useState } from "react";

export function useWalletManager() {
  const { ready, authenticated, user, logout, getAccessToken } = usePrivy();
  const { createWallet } = useCreateWallet();
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

  return {
    ready,
    authenticated,
    walletId,
    walletPublicKey,
    mainnetAddress,
    testnetAddress,
    walletCreationError,
    walletCreationSuccess,
    isCreatingClientWallet,
    isCreatingServerWallet,
    handleCreateClientWallet,
    handleCreateServerWallet,
    logout,
  };
}
