"use client";

import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
import OrderPanel from "./order-panel";
import AssetHeader from "./asset-header";
import { Stock } from "@/lib/constants";

interface MobileOrderDrawerProps {
  trigger: React.ReactNode;
  initialSide: "buy" | "sell";
  selectedStock: Stock | undefined;
}

export const MobileOrderDrawer: React.FC<MobileOrderDrawerProps> = ({
  trigger,
  selectedStock,
}) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="bg-[#0b0e11] flex flex-col rounded-t-[20px] max-h-[96%] fixed bottom-0 left-0 right-0 z-50 border-t border-[#1e2329] outline-none">
        {/* Hidden DrawerTitle for accessibility */}
        <DrawerTitle className="sr-only">
          Order Panel - {selectedStock?.symbol || 'Select Stock'}
        </DrawerTitle>
        <div className="bg-[#0b0e11] rounded-t-[20px] flex-1 overflow-y-auto no-scrollbar pb-8">
          <AssetHeader selectedStock={selectedStock} />
          <OrderPanel />
          {/* Account Summaries - Matches the visual style of the screenshot */}
          <div className="px-5 mt-4 space-y-4 border-t border-[#1e2329] pt-6">
            <div>
              <h4 className="text-[11px] font-bold text-[#eaecef] mb-3 uppercase tracking-wider">
                Accounts
              </h4>
              <div className="space-y-2.5 text-[11px]">
                <div className="flex justify-between items-center text-[#848e9c]">
                  <span className="underline decoration-dotted">
                    Perpetuals Equity
                  </span>
                  <span className="text-[#eaecef]">-</span>
                </div>
                <div className="flex justify-between items-center text-[#848e9c]">
                  <span className="underline decoration-dotted">
                    Spot Equity
                  </span>
                  <span className="text-[#eaecef]">-</span>
                </div>
              </div>
            </div>
            <div className="pb-4">
              <h4 className="text-[11px] font-bold text-[#eaecef] mb-3 uppercase tracking-wider">
                Perpetuals Overview
              </h4>
              <div className="space-y-2.5 text-[11px]">
                <div className="flex justify-between items-center text-[#848e9c]">
                  <span className="underline decoration-dotted">
                    Unrealized PnL
                  </span>
                  <span className="text-[#eaecef]">-</span>
                </div>
                <div className="flex justify-between items-center text-[#848e9c]">
                  <span className="underline decoration-dotted">
                    Cross Leverage
                  </span>
                  <span className="text-[#eaecef]">-</span>
                </div>
                <div className="flex justify-between items-center text-[#848e9c]">
                  <span className="underline decoration-dotted">
                    Cross Margin Usage
                  </span>
                  <span className="text-[#eaecef]">-</span>
                </div>
                <div className="flex justify-between items-center text-[#848e9c]">
                  <span className="underline decoration-dotted">
                    Maintenance Margin
                  </span>
                  <span className="text-[#eaecef]">-</span>
                </div>
                <div className="flex justify-between items-center text-[#848e9c]">
                  <span className="underline decoration-dotted">
                    Cross Margin Ratio
                  </span>
                  <span className="text-[#eaecef]">-</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};