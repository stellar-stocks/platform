import { atom } from "jotai";
import { selectedStockState } from "./selected-stock";
import { favoritesState } from "./favorites";

export const isSelectedStockFavoriteState = atom<boolean>((get) => {
    const selected = get(selectedStockState);
    const favorites = get(favoritesState);
    return !!selected && favorites.includes(selected);
});
