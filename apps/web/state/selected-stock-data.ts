import { selector } from "recoil";
import { selectedStockState } from "./selected-stock";
import { stockDataState, StockData } from "./stock-data";

export const selectedStockDataState = selector<StockData | null>({
  key: "selectedStockDataState",
  get: ({ get }) => {
    const selected = get(selectedStockState);
    const data = get(stockDataState);
    return selected && data[selected] ? data[selected] : null;
  },
});
