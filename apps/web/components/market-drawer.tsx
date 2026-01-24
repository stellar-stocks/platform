"use client";
import React, { useEffect, useMemo } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Stock, stocks } from "@/utils/constants";
import { Input } from "./ui/input";

interface MarketDrawerProps {
  onSelectSymbol: (symbol: string) => void;
  activeSymbol: string;
  trigger: React.ReactNode;
}

export const MarketDrawer: React.FC<MarketDrawerProps> = ({
  onSelectSymbol,
  activeSymbol,
  trigger,
}) => {
  const [searchText, setSearchText] = React.useState("");

  // ✅ FIXED: Proper filtering with useMemo for performance
  const filteredStocks = useMemo(() => {
    if (!searchText.trim()) {
      return stocks; // Show all when no search
    }
    return stocks.filter((stock) =>
      stock.symbol.toLowerCase().includes(searchText.toLowerCase().trim()),
    );
  }, [searchText]);

  // ✅ Call filter on search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // ✅ Clear search when drawer closes (optional UX improvement)
  const handleClose = () => {
    setSearchText("");
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="bg-[#0b0e11] flex flex-col rounded-t-[10px] h-[85%] mt-24 fixed bottom-0 left-0 right-0 z-50 border-t border-[#1e2329] outline-none">
        <div className="p-4 bg-[#0b0e11] rounded-t-[10px] flex-1 overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Markets</h2>
          </div>

          <div className="flex items-center gap-4 mb-4 border-b border-[#1e2329] pb-2">
            <button className="text-sm font-bold border-b-2 border-white pb-2">
              All
            </button>
            <button className="text-sm font-bold text-[#848e9c] pb-2">
              Perps
            </button>
            <button className="text-sm font-bold text-[#848e9c] pb-2">
              Spot
            </button>
          </div>

          <div className="relative mb-4">
            <Input
              value={searchText}
              onChange={handleSearchChange}
              type="text"
              placeholder="Search symbols (AAPL, BTC...)"
              className="w-full bg-[#1e2329] border-none rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none placeholder-[#848e9c]"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#848e9c]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex text-[10px] font-bold text-[#848e9c] px-2 mb-2 uppercase tracking-wider">
              <div className="flex-1">Market</div>
              <div className="w-24 text-right">Last Price</div>
              <div className="w-20 text-right">Volume</div>
            </div>

            {/* ✅ FIXED: Use filteredStocks instead of stocks */}
            {filteredStocks.length > 0 ? (
              filteredStocks.map((m) => (
                <DrawerClose key={m.symbol} asChild>
                  <button
                    onClick={() =>
                      onSelectSymbol(
                        m.symbol === "ETH" ||
                          m.symbol === "BTC" ||
                          m.symbol === "SOL" ||
                          m.symbol === "BNB"
                          ? `BINANCE:${m.symbol}USDT`
                          : `NASDAQ:${m.symbol}`,
                      )
                    }
                    className={`flex items-center p-2 rounded-lg transition-colors w-full text-left ${
                      activeSymbol.includes(m.symbol)
                        ? "bg-[#1e2329]"
                        : "hover:bg-[#1e2329]/50"
                    }`}
                  >
                    <div className="flex-1 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#2b2f36] flex items-center justify-center text-blue-400 font-bold text-xs border border-blue-500/10">
                        {m.symbol.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm">{m.symbol}</span>
                          <span className="text-[9px] text-[#848e9c] bg-[#1e2329] px-1 rounded">
                            {m.leverage}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#848e9c] truncate max-w-[80px]">
                          {m.name}
                        </div>
                      </div>
                    </div>
                    <div className="w-24 text-right">
                      <div className="text-sm font-bold">{m.price}</div>
                      <div
                        className={`text-[10px] font-bold ${
                          m.change.startsWith("+")
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {m.change}
                      </div>
                    </div>
                    <div className="w-20 text-right text-[11px] font-medium text-[#848e9c]">
                      {m.vol}
                    </div>
                  </button>
                </DrawerClose>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-[#848e9c]">
                <div className="w-12 h-12 mb-2 flex items-center justify-center rounded-lg bg-[#1e2329]/50">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-center">
                  No symbols found
                </p>
                <p className="text-[10px] text-center mt-1">
                  Try searching "AAPL", "BTC", etc.
                </p>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
