import { atom } from "jotai";
import { selectedStockState } from "./selected-stock";
import { stockDataState, StockData } from "./stock-data";

export const selectedStockDataState = atom<StockData | null>((get) => {
  const selected = get(selectedStockState);
  const data = get(stockDataState);
  return selected && data[selected] ? data[selected] : null;
});
