"use client";
import React from "react";

import { Provider } from "jotai";

export default function AppStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider children={children} />;
}
