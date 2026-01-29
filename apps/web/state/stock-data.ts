import { atom } from "jotai";

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
}

export const stockDataState = atom<Record<string, StockData>>({});
