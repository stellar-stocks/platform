"use client";
import React, { useEffect, useMemo, useCallback } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Stock, stocks } from "@/lib/constants";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { motion } from "motion/react";

interface MarketDrawerProps {
  onSelectSymbol: (symbol: string) => void;
  activeStock?: Stock;
  trigger: React.ReactNode;
}

export const MarketDrawer: React.FC<MarketDrawerProps> = ({
  onSelectSymbol,
  activeStock,
  trigger,
}) => {
  const [activeTab, setActiveTab] = React.useState<"All" | "Perps" | "Spot">("All");
  const [searchText, setSearchText] = React.useState("");

  // Filter stocks by tab and search
  const filteredStocks = useMemo(() => {
    let filtered = stocks;
    
    // Filter by tab
    if (activeTab === "Perps") {
      filtered = filtered.filter(stock => ["ETH", "BTC", "SOL", "BNB"].includes(stock.symbol));
    } else if (activeTab === "Spot") {
      filtered = filtered.filter(stock => !["ETH", "BTC", "SOL", "BNB"].includes(stock.symbol));
    }
    
    // Filter by search
    if (searchText.trim()) {
      filtered = filtered.filter((stock) =>
        stock.symbol.toLowerCase().includes(searchText.toLowerCase().trim()) ||
        stock.name.toLowerCase().includes(searchText.toLowerCase().trim())
      );
    }
    
    return filtered;
  }, [searchText, activeTab]);

  // Memoized search handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, []);

  // Memoized tab handler
  const handleTabChange = useCallback((tab: "All" | "Perps" | "Spot") => {
    setActiveTab(tab);
    // Reset search when switching tabs
    setSearchText("");
  }, []);

  // Memoized symbol selection
  const handleSelectSymbol = useCallback((stock: Stock) => {
    const symbol = stock.symbol === "ETH" || 
                  stock.symbol === "BTC" || 
                  stock.symbol === "SOL" || 
                  stock.symbol === "BNB"
      ? `BINANCE:${stock.symbol}USDT`
      : `NASDAQ:${stock.symbol}`;
    
    onSelectSymbol(symbol);
  }, [onSelectSymbol]);

  // Reset search when drawer closes
  const handleClose = useCallback(() => {
    setSearchText("");
    setActiveTab("All");
  }, []);

  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent className="bg-[#0b0e11] flex flex-col rounded-t-[10px] h-[85%] mt-24 fixed bottom-0 left-0 right-0 z-50 border-t border-[#1e2329] outline-none max-h-[85vh]">
          <div className="p-4 flex flex-col h-full bg-[#0b0e11]">
            {/* Header */}
            <h2 className="text-xl font-bold text-white pb-2">Markets</h2>

            {/* Tabs */}
            <div className="flex items-center gap-1 mb-3">
              {["All", "Perps", "Spot"].map((tab) => (
                <Button
                  key={tab}
                  variant="ghost"
                  onClick={() => handleTabChange(tab as "All" | "Perps" | "Spot")}
                  className={`relative font-bold px-3 py-2 text-[12px] h-auto transition-all flex items-center flex-shrink-0 ${
                    activeTab === tab
                      ? "text-white"
                      : "text-[#848e9c] hover:text-white"
                  }`}
                >
                  <span className="relative z-10">{tab}</span>
                  {activeTab === tab && (
                    <motion.span
                      layoutId="active-tab-indicator"
                      className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                      style={{ scaleX: 1 }}
                    />
                  )}
                </Button>
              ))}
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Input
                value={searchText}
                onChange={handleSearchChange}
                type="text"
                placeholder="Search symbols (AAPL, TSLA, Bitcoin...)"
                className="w-full bg-[#1e2329] border border-[#2a3441] rounded-xl pl-11 pr-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-[#1e2329] placeholder-[#848e9c]"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-[#848e9c]"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>

            {/* Results Header */}
            <div className="flex text-[11px] font-bold text-[#848e9c] px-3 mb-4 uppercase tracking-wider">
              <div className="flex-1 min-w-0">Market</div>
              <div className="w-24 text-right">Last Price</div>
              <div className="w-20 text-right">Volume</div>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {filteredStocks.length > 0 ? (
                <div className="space-y-2">
                  {filteredStocks.map((stock) => (
                    <DrawerClose key={stock.symbol} asChild>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectSymbol(stock)}
                        className={`group flex items-center p-1 rounded-xl transition-all w-full text-left border border-transparent hover:border-[#2a3441] hover:bg-[#1e2329]/50 ${
                          activeStock?.symbol === stock.symbol
                            ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/50"
                            : ""
                        }`}
                      >
                        <div className="flex-1 flex items-center gap-3 min-w-0">
                          <div className="flex-shrink-0">
                            <img
                              src={`/icons/${stock.icon}`}
                              alt={stock.symbol}
                              width={36}
                              height={36}
                              className="rounded-lg"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-sm text-white group-hover:text-blue-400">
                                {stock.symbol}
                              </span>
                              <span className="text-[10px] font-bold bg-[#1e2329] text-[#848e9c] px-2 py-0.5 rounded-full">
                                {stock.leverage}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#848e9c] truncate">
                              {stock.name}
                            </div>
                          </div>
                        </div>
                        <div className="w-24 text-right">
                          <div className="text-sm font-bold text-white mb-0.5">
                            ${stock.price}
                          </div>
                          <div
                            className={`text-[11px] font-bold ${
                              stock.change.startsWith("+")
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {stock.change}
                          </div>
                        </div>
                        <div className="w-20 text-right text-[11px] font-medium text-[#848e9c] ml-4">
                          {stock.vol}
                        </div>
                      </motion.button>
                    </DrawerClose>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-[#848e9c]">
                  <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-xl bg-[#1e2329]/50">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-center mb-1">
                    No symbols found
                  </p>
                  <p className="text-[11px] text-center max-w-[250px] leading-relaxed">
                    Try searching "AAPL", "TSLA", "Bitcoin", "Ethereum", or switch to another tab.
                  </p>
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
};
