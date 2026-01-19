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
import OrderPanel from "./order-panel";

interface MobileOrderDrawerProps {
  trigger: React.ReactNode;
  initialSide: "buy" | "sell";
  symbol: string;
}

export const MobileOrderDrawer: React.FC<MobileOrderDrawerProps> = ({
  trigger,
  initialSide,
  symbol,
}) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="bg-[#0b0e11] flex flex-col rounded-t-[20px] max-h-[96%] fixed bottom-0 left-0 right-0 z-50 border-t border-[#1e2329] outline-none">
        <div className="bg-[#0b0e11] rounded-t-[20px] flex-1 overflow-y-auto no-scrollbar pb-8">
          {/* Handle for swiping */}
          <div className="sticky top-0 bg-[#0b0e11] z-10 pt-4 pb-2">
            <div className="mx-auto w-12 h-1.5 rounded-full bg-[#2b2f36]" />
            {/* Asset Mini Header inside Drawer */}
            <div className="flex items-center justify-between px-5 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">
                  {symbol.charAt(0)}
                </div>
                <span className="font-bold text-sm uppercase">{symbol}</span>
                <span className="text-[10px] text-[#848e9c] bg-[#1e2329] px-1 rounded">
                  50x
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">3,341.39</div>
                <div className="text-[10px] text-green-500 font-bold">
                  +0.87%
                </div>
              </div>
            </div>
          </div>
          <div className="px-1">
            <OrderPanel />
          </div>
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
