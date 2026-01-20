"use client";
import { RecoilRoot } from "recoil";

export default function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <RecoilRoot children={children} />;
}
