import { atom } from "recoil";

export const favoritesState = atom<string[]>({
  key: "favoritesState",
  default: [],
});
