import { atom } from "recoil";

export const userAddressState = atom<string | null>({
  key: "userAddressState",
  default: null,
});
