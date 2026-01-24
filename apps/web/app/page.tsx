"use client";

import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import OrderPanel from "@/components/order-panel";
import TradeHistory from "@/components/trading-history";
import BottomTabs from "@/components/bottom-tabs";
import AssetHeader from "@/components/asset-header";
import { MarketDrawer } from "@/components/market-drawer";
import { MobileOrderDrawer } from "@/components/mobile-order-drawer";
import TradingViewChart from "@/components/trading-view-chart";
import { useIsMobile } from "@/hooks/use-mobile";

const App: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("NASDAQ:AAPL");
  const [isBottomPanelCollapsed, setIsBottomPanelCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const currentTicker = selectedSymbol.split(":").pop() || "AAPL";

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#0b0e11] text-[#eaecef]">
        {/* Mobile Navbar */}
        <Navbar isMobile={true} />

        {/* Mobile Asset Switcher */}
        <MarketDrawer
          activeSymbol={selectedSymbol}
          onSelectSymbol={setSelectedSymbol}
          trigger={
            <div className="h-12 bg-[#0d0f13] border-b border-[#1e2329] flex items-center justify-between px-3 shrink-0 cursor-pointer active:bg-[#1e2329] transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">
                  {currentTicker.charAt(0)}
                </div>
                <span className="font-bold text-sm">{currentTicker}</span>
                <span className="text-[10px] text-[#848e9c] bg-[#1e2329] px-1 rounded">
                  50x
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">3,341.26</span>
                <span className="text-[11px] text-green-500">+0.95%</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#848e9c"
                  strokeWidth="3"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          }
        />

        <div className="flex-1 flex flex-col min-h-0">
          {/* Chart Area */}
          <div className="flex-1 border-b border-[#2b2f36] flex min-h-0 relative z-10">
            <div className="flex-1 min-h-0">
              <TradingViewChart symbol={selectedSymbol} />
            </div>
          </div>

          {/* Bottom Panel - Fixed Toggle */}
          <div
            className={`transition-all duration-300 ease-in-out border-t border-[#2b2f36] bg-[#0b0e11] relative z-20 ${
              isBottomPanelCollapsed ? "h-[32px]" : "flex-1 min-h-[230px]"
            }`}
          >
            <BottomTabs
              isCollapsed={isBottomPanelCollapsed}
              onToggleCollapse={() =>
                setIsBottomPanelCollapsed(!isBottomPanelCollapsed)
              }
            />
          </div>
        </div>

        {/* Mobile Floating Action Buttons - Higher z-index */}
        <div className="p-3 bg-[#0b0e11] border-t border-[#1e2329] flex gap-2 shrink-0">
          <MobileOrderDrawer
            initialSide="buy"
            symbol={currentTicker}
            trigger={
              <button className="flex-1 bg-[#2ebd85] hover:bg-[#26a672] text-white font-bold py-3 rounded text-sm transition-colors shadow-lg shadow-green-900/10">
                Buy / Long
              </button>
            }
          />
          <MobileOrderDrawer
            initialSide="sell"
            symbol={currentTicker}
            trigger={
              <button className="flex-1 bg-[#f6465d] hover:bg-[#d03a4d] text-white font-bold py-3 rounded text-sm transition-colors shadow-lg shadow-red-900/10">
                Sell / Short
              </button>
            }
          />
        </div>
      </div>
    );
  }

  // Desktop Layout (unchanged)
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0b0e11] text-[#eaecef]">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onSelectSymbol={setSelectedSymbol}
          activeSymbol={selectedSymbol}
        />
        <main className="flex-1 flex flex-col border-r border-[#2b2f36] overflow-hidden">
          <AssetHeader symbol={selectedSymbol} />
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 border-b border-[#2b2f36] flex min-h-0">
              <div className="flex-1 min-h-0">
                <TradingViewChart symbol={selectedSymbol} />
              </div>
            </div>
            <div
              className={`transition-all duration-300 ease-in-out border-t border-[#2b2f36] bg-[#0b0e11] ${
                isBottomPanelCollapsed ? "h-[32px]" : "flex-1 h-[230px]"
              }`}
            >
              <BottomTabs
                isCollapsed={isBottomPanelCollapsed}
                onToggleCollapse={() =>
                  setIsBottomPanelCollapsed(!isBottomPanelCollapsed)
                }
              />
            </div>
          </div>
        </main>
        <aside className="w-[320px] hidden lg:flex flex-col bg-[#0b0e11]">
          <OrderPanel />
          <div className="flex-1 border-t border-[#2b2f36]">
            <TradeHistory />
          </div>
        </aside>
      </div>
      <footer className="h-6 bg-[#181a20] border-t border-[#2b2f36] flex items-center px-3 text-[10px] text-[#848e9c] justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Real-time Feed Connected
          </span>
          <span>Account: TRA-9X2...K4</span>
        </div>
        <div className="flex items-center gap-4 uppercase font-bold tracking-tighter text-[9px]">
          <span>Institutional trading</span>
          <span>Help center</span>
          <span>API docs</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
