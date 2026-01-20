import { selector } from "recoil";
import { selectedStockState } from "./selected-stock";
import { favoritesState } from "./favorites";

export const isSelectedStockFavoriteState = selector<boolean>({
  key: "isSelectedStockFavoriteState",
  get: ({ get }) => {
    const selected = get(selectedStockState);
    const favorites = get(favoritesState);
    return !!selected && favorites.includes(selected);
  },
});
