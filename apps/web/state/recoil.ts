import { atom, selector } from 'recoil';

// Connected user address (wallet)
export const userAddressState = atom<string | null>({
  key: 'userAddressState',
  default: null,
});

// List of favorite stock symbols
export const favoritesState = atom<string[]>({
  key: 'favoritesState',
  default: [],
});

// Currently selected stock symbol
export const selectedStockState = atom<string | null>({
  key: 'selectedStockState',
  default: null,
});

// Stock data map: symbol -> { price, marketCap, volume, ... }
export type StockData = {
  price: number;
  marketCap: number;
  volume: number;
  change24h: number;
  [key: string]: any;
};
export const stockDataState = atom<Record<string, StockData>>({
  key: 'stockDataState',
  default: {},
});

// Selector for selected stock's data
export const selectedStockDataState = selector<StockData | null>({
  key: 'selectedStockDataState',
  get: ({ get }) => {
    const selected = get(selectedStockState);
    const data = get(stockDataState);
    return selected && data[selected] ? data[selected] : null;
  },
});

// Selector for checking if selected stock is a favorite
export const isSelectedStockFavoriteState = selector<boolean>({
  key: 'isSelectedStockFavoriteState',
  get: ({ get }) => {
    const selected = get(selectedStockState);
    const favorites = get(favoritesState);
    return !!selected && favorites.includes(selected);
  },
});
