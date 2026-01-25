"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { stocks } from "@/utils/constants";
import Image from "next/image";
import { Stock } from "@/utils/constants";

interface SidebarProps {
  selectedStock: Stock | null;
  onSelectSymbol: (symbol: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedStock, onSelectSymbol }) => {
  const [search, setSearch] = useState("");

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
      stock.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-84 bg-[#0b0e11] border-r border-[#1e2329] flex flex-col">
      <div className="p-4 border-b border-[#1e2329]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search stocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1e2329] border border-[#2b2f36] rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-[#1e2329]">
              <th className="px-4 py-2">Symbol</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Change</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock) => (
              <tr
                key={stock.symbol}
                onClick={() => onSelectSymbol(`NASDAQ:${stock.symbol}`)}
                className={`cursor-pointer hover:bg-[#16181e] group transition-colors ${
                  selectedStock?.symbol === stock.symbol ? "bg-[#16181e]" : ""
                }`}
              >
                <td className="px-4 py-2 border-b border-[#1e2329]/30">
                  <div className="flex items-center gap-3">
                    <Image
                      src={`/icons/${stock.icon}`}
                      alt={stock.name}
                      width={24}
                      height={24}
                    />
                    <div>
                      <div className="font-medium text-sm">{stock.symbol}</div>
                      <div className="text-xs text-gray-400">{stock.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2 border-b border-[#1e2329]/30">
                  <div className="text-sm font-medium">{stock.price}</div>
                </td>
                <td className="px-4 py-2 border-b border-[#1e2329]/30">
                  <div
                    className={`text-sm font-medium ${
                      stock.change.startsWith("+")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {stock.change}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sidebar;
