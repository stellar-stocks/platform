"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import dynamic from "next/dynamic";
import OrderPanel from "@/components/order-panel";
import TradeHistory from "@/components/trading-history";
import BottomTabs from "@/components/bottom-tabs";
import AssetHeader from "@/components/asset-header";
import { MarketDrawer } from "@/components/market-drawer";
import { MobileOrderDrawer } from "@/components/mobile-order-drawer";
import TradingViewChart from "@/components/trading-view-chart";

const App: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("NASDAQ:AAPL");
  const [isBottomPanelCollapsed, setIsBottomPanelCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 1024);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const currentTicker = selectedSymbol.split(":").pop() || "AAPL";

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#0b0e11] text-[#eaecef]">
        {/* Mobile Header */}
        <div className="h-12 flex items-center justify-between px-3 border-b border-[#1e2329] bg-[#0b0e11] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-black transform rotate-45"></div>
            </div>
            <span className="text-lg font-bold tracking-tight">Lighter</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-2 py-1 bg-[#1e2329] rounded text-[10px] font-bold border border-[#2b2f36]">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <svg
                width="8"
                height="8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
            <div className="p-1.5 bg-[#1e2329] rounded border border-[#2b2f36]">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div className="p-1.5 bg-[#1e2329] rounded border border-[#2b2f36]">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </div>
        </div>

        {/* Mobile Banner */}
        <div className="bg-[#1a1c24] px-4 py-2 flex items-center justify-between text-[11px] border-b border-[#1e2329]">
          <p className="text-white">
            Mobile App Competition Live Now. Download on{" "}
            <span className="text-blue-400 underline cursor-pointer">iOS</span>{" "}
            or{" "}
            <span className="text-blue-400 underline cursor-pointer">
              Android
            </span>
            .
          </p>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#848e9c"
            strokeWidth="2"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </div>

        {/* Mobile Asset Switcher with Drawer Trigger */}
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

        {/* Content Tabs */}
        <div className="flex items-center px-2 border-b border-[#1e2329] bg-[#0b0e11] overflow-x-auto no-scrollbar shrink-0">
          {["Price", "Order Book", "Trades", "Depth", "Funding", "Details"].map(
            (t) => (
              <button
                key={t}
                className={`px-4 py-2.5 text-[11px] font-bold whitespace-nowrap transition-colors ${t === "Price" ? "text-white border-b-2 border-blue-500 bg-[#1e2329]/30" : "text-[#848e9c]"}`}
              >
                {t}
              </button>
            ),
          )}
        </div>

        {/* Mobile Main Body */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 relative">
            <div style={{ width: "100%", height: "400px" }}>
              <TradingViewChart symbol={selectedSymbol} />
            </div>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out border-t border-[#1e2329] bg-[#0b0e11] flex flex-col overflow-hidden ${
              isBottomPanelCollapsed ? "h-[40px]" : "h-[250px]"
            }`}
          >
            <div className="flex items-center justify-between px-4 h-10 border-b border-[#1e2329] shrink-0">
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar h-full">
                {["Positions", "Assets", "Open Orders", "Order History"].map(
                  (t) => (
                    <button
                      key={t}
                      onClick={() =>
                        isBottomPanelCollapsed &&
                        setIsBottomPanelCollapsed(false)
                      }
                      className={`px-1 py-2 text-[10px] font-bold whitespace-nowrap h-full flex items-center ${t === "Positions" ? "text-white border-b-2 border-blue-500" : "text-[#848e9c]"}`}
                    >
                      {t}
                    </button>
                  ),
                )}
              </div>
              <button
                onClick={() =>
                  setIsBottomPanelCollapsed(!isBottomPanelCollapsed)
                }
                className="p-1 text-[#848e9c] hover:text-white"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={`transition-transform duration-300 ${isBottomPanelCollapsed ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
            {!isBottomPanelCollapsed && (
              <div className="flex-1 flex items-center justify-center text-[#474d57] text-[11px]">
                No active positions
              </div>
            )}
          </div>
        </div>

        {/* Mobile Floating Action Buttons - Now triggers MobileOrderDrawer */}
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
          <div className="flex-1 flex flex-col min-h-0 relative">
            <div className="flex-1 border-b border-[#2b2f36] relative z-0">
              <div style={{ width: "100%", height: "400px" }}>
                <TradingViewChart symbol={selectedSymbol} />
              </div>
            </div>
            <div
              className={`transition-all duration-300 ease-in-out border-t border-[#2b2f36] bg-[#0b0e11] overflow-hidden ${isBottomPanelCollapsed ? "h-[40px]" : "h-[250px]"}`}
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
