"use client";

import React from "react";
// Change the import to match the actual export (likely useAlpacaMarketData based on previous context)
import { useAlpacaMarketData } from "@/hooks/use-realtime-data";

export default function MarketDataProvider({ children }: { children: React.ReactNode }) {
  // Use the correct hook name
  useAlpacaMarketData();
  return <>{children}</>;
}
