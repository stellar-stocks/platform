"use client";

import { useAtom } from 'jotai';
import { stacksWalletAtom } from '@/state/stacks-wallet';
import { AppConfig, UserSession, authenticate } from '@stacks/connect';
import { useEffect, useCallback } from 'react';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export function useStacksWallet() {
  const [walletState, setWalletState] = useAtom(stacksWalletAtom);

  const getBns = useCallback(async (stxAddress: string) => {
    try {
      const response = await fetch(`https://api.bnsv2.com/testnet/names/address/${stxAddress}/valid`);
      const data = await response.json();
      if (data.names && data.names.length > 0) {
        return data.names[0].full_name;
      }
    } catch (e) {
      console.error("Failed to get BNS", e);
    }
    return "";
  }, []);

  const syncWalletState = useCallback(async () => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      // Default to testnet as per previous context, but fallback to mainnet or generic logic if needed
      // The user's previous code used connectionResponse.addresses[2] which was likely testnet
      const address = userData.profile.stxAddress.testnet || userData.profile.stxAddress.mainnet;

      if (address) {
        let bnsName = walletState.bnsName;
        // fetch BNS if not already present or if address changed (though logic below sets everything)
        // Simplified: just fetch. 
        const fetchedBns = await getBns(address);
        
        setWalletState({
          isConnected: true,
          address: address,
          walletInfo: userData,
          bnsName: fetchedBns || null,
        });
      }
    } else {
       // Explicitly clear if not signed in (e.g. storage cleared externally?)
       // Usually we don't need to do this on mount if default is false, but good for consistency
    }
  }, [getBns, setWalletState, walletState.bnsName]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        if (userSession.isSignInPending()) {
            userSession.handlePendingSignIn().then(() => {
                syncWalletState();
            });
        } else if (userSession.isUserSignedIn() && !walletState.isConnected) {
            syncWalletState();
        }
    }
  }, [syncWalletState, walletState.isConnected]);

  const connectWallet = () => {
    authenticate({
      appDetails: {
        name: 'Stellar Stocks',
        icon: typeof window !== 'undefined' ? window.location.origin + '/favicon.ico' : '/favicon.ico',
      },
      redirectTo: '/',
      onFinish: () => {
        syncWalletState();
      },
      userSession,
    });
  };

  const disconnectWallet = () => {
    userSession.signUserOut();
    setWalletState({
      isConnected: false,
      address: null,
      walletInfo: null,
      bnsName: null
    });
  };

  return { 
      ...walletState, 
      connectWallet, 
      disconnectWallet,
      userSession 
  };
}
