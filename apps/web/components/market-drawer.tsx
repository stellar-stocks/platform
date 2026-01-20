"use client";
import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface MarketDrawerProps {
  onSelectSymbol: (symbol: string) => void;
  activeSymbol: string;
  trigger: React.ReactNode;
}

const markets = [
  {
    symbol: "ETH",
    name: "Ethereum",
    price: "3,341.43",
    change: "+0.87%",
    vol: "679.56M",
    leverage: "50x",
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: "95,300.7",
    change: "+0.02%",
    vol: "858.83M",
    leverage: "50x",
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: "228.24",
    change: "+1.10%",
    vol: "52.4M",
    leverage: "50x",
  },
  {
    symbol: "NVDA",
    name: "Nvidia Corp.",
    price: "142.12",
    change: "+2.36%",
    vol: "184.2M",
    leverage: "50x",
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: "348.50",
    change: "-1.72%",
    vol: "82.1M",
    leverage: "50x",
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: "142.304",
    change: "-1.32%",
    vol: "123.25M",
    leverage: "25x",
  },
  {
    symbol: "HYPE",
    name: "Hyperliquid",
    price: "25.1547",
    change: "-1.69%",
    vol: "38.61M",
    leverage: "20x",
  },
];

export const MarketDrawer: React.FC<MarketDrawerProps> = ({
  onSelectSymbol,
  activeSymbol,
  trigger,
}) => {
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
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#1e2329] border-none rounded-lg px-10 py-2.5 text-sm outline-none placeholder-[#848e9c]"
            />
            <span className="absolute left-3 top-3 text-[#848e9c]">
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
            {markets.map((m) => (
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
                  className={`flex items-center p-2 rounded-lg transition-colors ${activeSymbol.includes(m.symbol) ? "bg-[#1e2329]" : "hover:bg-[#1e2329]/50"}`}
                >
                  <div className="flex-1 flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-full bg-[#2b2f36] flex items-center justify-center text-blue-400 font-bold text-xs border border-blue-500/10">
                      {m.symbol.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm">{m.symbol}</span>
                        <span className="text-[9px] text-[#848e9c] bg-[#1e2329] px-1 rounded">
                          {m.leverage}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#848e9c] whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]">
                        {m.name}
                      </div>
                    </div>
                  </div>
                  <div className="w-24 text-right">
                    <div className="text-sm font-bold">{m.price}</div>
                    <div
                      className={`text-[10px] font-bold ${m.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                    >
                      {m.change}
                    </div>
                  </div>
                  <div className="w-20 text-right text-[11px] font-medium text-[#848e9c]">
                    {m.vol}
                  </div>
                </button>
              </DrawerClose>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
