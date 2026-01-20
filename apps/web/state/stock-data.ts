import { atom } from "recoil";

export type StockData = {
  price: number;
  marketCap: number;
  volume: number;
  change24h: number;
  [key: string]: any;
};

export const stockDataState = atom<Record<string, StockData>>({
  key: "stockDataState",
  default: {},
});
