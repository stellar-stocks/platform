import { atom } from "recoil";

export const selectedStockState = atom<string | null>({
  key: "selectedStockState",
  default: null,
});
