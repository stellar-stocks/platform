"use client";

import React, { useState } from "react";
import Sidebar from "@/components/sidebar";
import OrderPanel from "@/components/order-panel";
import TradeHistory from "@/components/trading-history";
import BottomTabs from "@/components/bottom-tabs";
import AssetHeader from "@/components/asset-header";
import { MarketDrawer } from "@/components/market-drawer";
import { MobileOrderDrawer } from "@/components/mobile-order-drawer";
import TradingViewChart from "@/components/trading-view-chart";
import { useIsMobile } from "@/hooks/use-mobile";

import { Stock, stocks } from "@/utils/constants";
import { Footer } from "react-day-picker";
import MobileAssetHeader from "@/components/mobile-asset-header";
import { Button } from "@/components/ui/button";

const App: React.FC = () => {
  const isMobile = useIsMobile();
  const [selectedStock, setSelectedStock] = useState<Stock | undefined>(
    stocks[0],
  );
  const [isBottomPanelCollapsed, setIsBottomPanelCollapsed] = useState(false);

  const currentTicker = selectedStock?.symbol || "AAPL";

  const handleSelectSymbol = (symbol: string) => {
    // Extract stock symbol from full symbol (e.g., "NASDAQ:AAPL" -> "AAPL")
    const stockSymbol = symbol.split(":").pop() || symbol;
    const stock = stocks.find((s) => s.symbol === stockSymbol);
    setSelectedStock(stock);
  };

  if (isMobile) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden bg-[#0b0e11] text-[#eaecef]">
        {/* Mobile Asset Switcher */}
        <MarketDrawer
          activeStock={selectedStock}
          onSelectSymbol={handleSelectSymbol}
          trigger={
            <MobileAssetHeader
              symbol={selectedStock?.symbol || ""}
              icon={selectedStock?.icon || ""}
            />
          }
        />

        <div className="flex-1 flex flex-col min-h-0">
          {/* Chart Area */}
          <div className="flex-1 border-b border-[#2b2f36] flex min-h-0 relative z-10">
            <div className="flex-1 min-h-0">
              <TradingViewChart selectedStock={selectedStock} />
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

        {/* Mobile Floating Action ButtonHigher z-index */}
        <div className="p-3 bg-[#0b0e11] border-t border-[#1e2329] flex gap-2 shrink-0">
          <MobileOrderDrawer
            initialSide="buy"
            selectedStock={selectedStock}
            trigger={
              <Button className="flex-1 bg-[#2ebd85] hover:bg-[#26a672] text-white font-bold py-3 rounded text-sm transition-colors shadow-lg shadow-green-900/10">
                Buy / Long
              </Button>
            }
          />
          <MobileOrderDrawer
            initialSide="sell"
            selectedStock={selectedStock}
            trigger={
              <Button className="flex-1 bg-[#f6465d] hover:bg-[#d03a4d] text-white font-bold py-3 rounded text-sm transition-colors shadow-lg shadow-red-900/10">
                Sell / Short
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0b0e11] text-[#eaecef]">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedStock={selectedStock || null}
          onSelectSymbol={handleSelectSymbol}
        />
        <main className="flex-1 flex flex-col border-r border-[#2b2f36] overflow-hidden">
          <AssetHeader selectedStock={selectedStock} />
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 border-b border-[#2b2f36] flex min-h-0">
              <div className="flex-1 min-h-0">
                <TradingViewChart selectedStock={selectedStock} />
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
      <Footer />
    </div>
  );
};

export default App;
