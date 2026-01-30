import { atom } from 'jotai';

export interface StacksWalletState {
  isConnected: boolean;
  address: string | null;
  walletInfo: any | null;
  bnsName: string | null;
}

export const stacksWalletAtom = atom<StacksWalletState>({
  isConnected: false,
  address: null,
  walletInfo: null,
  bnsName: null,
});
