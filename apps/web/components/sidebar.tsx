"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { stocks } from "@/utils/constants";

interface SidebarProps {
  onSelectSymbol: (symbol: string) => void;
  activeSymbol: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectSymbol, activeSymbol }) => {
  const [search, setSearch] = useState("");

  const filteredStocks = stocks.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.symbol.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <aside className="w-[320px] hidden md:flex flex-col border-r border-[#1e2329] bg-[#0b0e11]">
      <div className="p-4">
        <div className="relative group">
          <Input
            type="text"
            placeholder="Search markets"
            className="w-full bg-[#1e2329] border border-[#2b2f36] group-focus-within:border-[#5e6673] rounded-xl px-9 py-2 text-[13px] outline-none placeholder-[#474d57] transition-all text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute left-1.5 top-1.5 text-[#474d57]">
            <Search />
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6 px-4 py-2 border-b border-[#1e2329] text-[11px] font-bold text-[#848e9c] uppercase tracking-wider">
        <button className="text-white border-b-2 border-white pb-2 transition-all">
          All
        </button>
        <button className="hover:text-white pb-2 transition-all">
          S&P 500
        </button>
        <button className="hover:text-white pb-2 transition-all">Nasdaq</button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <table className="w-full text-left">
          <tbody className="text-xs">
            {filteredStocks.map((stock) => (
              <tr
                key={stock.symbol}
                onClick={() => onSelectSymbol(`NASDAQ:${stock.symbol}`)}
                className={`cursor-pointer hover:bg-[#16181e] group transition-colors ${activeSymbol.includes(stock.symbol) ? "bg-[#16181e]" : ""}`}
              >
                <td className="px-4 py-2 border-b border-[#1e2329]/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1e2329] border border-[#2b2f36] flex items-center justify-center text-[10px] font-bold text-[#eaecef] group-hover:border-[#5e6673] transition-all">
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-[#eaecef] tracking-tight">
                        {stock.symbol}
                      </div>
                      <div className="text-[10px] text-[#474d57] font-medium">
                        {stock.vol}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-right border-b border-[#1e2329]/30">
                  <div className="font-bold text-[#eaecef] tracking-tight">
                    ${stock.price}
                  </div>
                  <div
                    className={`text-[10px] font-bold ${stock.change.startsWith("+") ? "text-[#2ebd85]" : "text-[#f6465d]"}`}
                  >
                    {stock.change}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </aside>
  );
};

export default Sidebar;
