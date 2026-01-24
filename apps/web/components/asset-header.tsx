"use client";

import React from "react";
import { ConnectButton } from "./connect-button";

interface AssetHeaderProps {
  symbol: string;
}

const AssetHeader: React.FC<AssetHeaderProps> = ({ symbol }) => {
  const ticker = symbol.split(":").pop() || symbol;

  return (
    <div className="h-16 border-b border-[#1e2329] flex items-center px-2 justify-between ">
      <div className="flex items-center justify-between gap-8 w-full lg:w-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1e2329] border border-[#2b2f36] flex items-center justify-center font-bold text-white text-sm">
            {ticker.charAt(0)}
          </div>
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

        <div className="flex gap-10 ml-2">
          <div>
            <div className="text-lg font-bold text-[#2ebd85]">$228.24</div>
            <div className="text-[11px] text-[#2ebd85] font-bold flex items-center gap-1">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
              +1.10%
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-[10px] text-[#848e9c] uppercase font-bold tracking-wider mb-0.5">
              Volume
            </div>
            <div className="text-sm font-semibold text-[#eaecef]">52.41M</div>
          </div>
          <div className="hidden lg:block">
            <div className="text-[10px] text-[#848e9c] uppercase font-bold tracking-wider mb-0.5">
              Mkt Cap
            </div>
            <div className="text-sm font-semibold text-[#eaecef]">3.46T</div>
          </div>
          <div className="hidden xl:block">
            <div className="text-[10px] text-[#848e9c] uppercase font-bold tracking-wider mb-0.5">
              OI
            </div>
            <div className="text-sm font-semibold text-[#eaecef]">1.12B</div>
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
