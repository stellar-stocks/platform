import { atom } from 'jotai';

// Connected user address (wallet)
export const userAddressState = atom<string | null>(null);

// List of favorite stock symbols
export const favoritesState = atom<string[]>([]);

// Currently selected stock symbol
export const selectedStockState = atom<string | null>(null);

// Stock data map: symbol -> { price, marketCap, volume, ... }
export interface StockData {
  symbol: string;
  price: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
  lastUpdateDirection: 'up' | 'down' | 'none';
  source: 't' | 'q' | 'b' | 'none';
  priceHistory: { val: number; time: number }[];
  marketCap: number;
  change24h: number;
  openInterest?: number;
  [key: string]: any;
};

export const stockDataState = atom<Record<string, StockData>>({});

// Selector for selected stock's data
export const selectedStockDataState = atom<StockData | null>((get) => {
  const selected = get(selectedStockState);
  const data = get(stockDataState);
  return selected && data[selected] ? data[selected] : null;
});

// Selector for checking if selected stock is a favorite
export const isSelectedStockFavoriteState = atom<boolean>((get) => {
  const selected = get(selectedStockState);
  const favorites = get(favoritesState);
  return !!selected && favorites.includes(selected);
});
