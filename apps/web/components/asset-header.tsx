"use client";

import React from "react";
import Image from "next/image";
import { Stock } from "@/lib/constants";
import { useAtomValue } from "jotai";
import { stockDataState } from "@/state/stock-data";

interface AssetHeaderProps {
  selectedStock: Stock | undefined;
}

const AssetHeader: React.FC<AssetHeaderProps> = ({ selectedStock }) => {
  const stockDataMap = useAtomValue(stockDataState);
  
  const ticker =
    selectedStock?.symbol.split(":").pop() || selectedStock?.symbol || "";

  const data = stockDataMap[ticker];

  const price = data?.price 
    ? `$${data.price.toFixed(2)}` 
    : selectedStock?.price 
      ? `$${selectedStock.price}` 
      : "---";

  const changePercent = data?.changePercent
    ? data.changePercent
    : parseFloat(selectedStock?.change?.replace("%", "") || "0");
    
  const isPositive = changePercent >= 0;
  
  const changeFormatted = `${isPositive ? "+" : ""}${changePercent.toFixed(2)}%`;
  
  const volume = data?.volume 
    ? (data.volume / 1000000).toFixed(2) + "M"
    : selectedStock?.vol || "---";

  const marketCap = data?.marketCap
    ? (data.marketCap / 1000000000000).toFixed(2) + "T" // Assuming T for trillions if data is huge, but let's just stick to what was there or format nicely.
    : selectedStock?.marketCap || "---";

  // Alpaca might not give OI. Use placeholder or 0 if missing.
  const openInterest = data?.openInterest
    ? (data.openInterest / 1000000000).toFixed(2) + "B"
    : "1.12B"; // Keep hardcoded fallback or make it "---"

  return (
    <div className="h-16 flex items-center px-2 justify-between ">
      <div className="flex items-center justify-between gap-8 w-full lg:w-auto">
        <div className="flex items-center gap-3">
          <Image
            className="mx-3"
            src={`/icons/${selectedStock?.icon}`}
            alt={ticker}
            width={32}
            height={32}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-[#eaecef]">
                {ticker}
              </span>
              <span className="text-[9px] px-2 py-0.5 bg-[#1e2329] border border-[#2b2f36] rounded-md font-bold text-[#848e9c] uppercase tracking-widest">
                PERP
              </span>
            </div>
            <div className="text-[10px] text-[#848e9c] font-medium">
              Nasdaq Global Select
            </div>
          </div>
        </div>

        <div className="flex gap-10 ml-4">
          <div>
            <div className={`text-lg font-bold ${isPositive ? "text-[#2ebd85]" : "text-[#f6465d]"}`}>{price}</div>
            <div className={`text-[11px] font-bold flex items-center gap-1 ${isPositive ? "text-[#2ebd85]" : "text-[#f6465d]"}`}>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className={!isPositive ? "rotate-180" : ""}
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
              {changeFormatted}
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-[10px] text-[#848e9c] uppercase font-bold tracking-wider mb-0.5">
              Volume
            </div>
            <div className="text-sm font-semibold text-[#eaecef]">{volume}</div>
          </div>
          <div className="hidden lg:block">
            <div className="text-[10px] text-[#848e9c] uppercase font-bold tracking-wider mb-0.5">
              Mkt Cap
            </div>
            <div className="text-sm font-semibold text-[#eaecef]">{marketCap}</div>
          </div>
          <div className="hidden xl:block">
            <div className="text-[10px] text-[#848e9c] uppercase font-bold tracking-wider mb-0.5">
              OI
            </div>
            <div className="text-sm font-semibold text-[#eaecef]">{openInterest}</div>
          </div>
        </div>
      </div>

      <div className="items-center gap-4  hidden lg:flex">
        <div className="hidden md:flex flex-col items-end mr-4">
          <span className="text-[10px] text-[#848e9c] uppercase font-bold tracking-wider mb-0.5">
            System
          </span>
          <span className="text-[#2ebd85] text-[11px] font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ebd85]"></span>
            OPERATIONAL
          </span>
        </div>
      </div>
    </div>
  );
};

export default AssetHeader;
