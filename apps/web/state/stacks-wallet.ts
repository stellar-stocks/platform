import { atom } from 'jotai';

export interface StacksWalletState {
  isConnected: boolean;
  address: string | null;
  walletInfo: any | null;
}

export const stacksWalletAtom = atom<StacksWalletState>({
  isConnected: false,
  address: null,
  walletInfo: null,
});
