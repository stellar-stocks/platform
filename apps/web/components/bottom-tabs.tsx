"use client";

import { motion } from "motion/react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { OpenOrdersTable } from "./table/open-orders";
import { TradeHistoryTable } from "./table/trade-history";

interface BottomTabsProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const BottomTabs: React.FC<BottomTabsProps> = ({
  isCollapsed,
  onToggleCollapse,
}) => {
  const [activeTab, setActiveTab] = useState("Open orders");
  const tabs = [
    { name: "Assets", count: 0, component: null },
    { name: "Open orders", count: 0, component: OpenOrdersTable },
    { name: "Order history", count: null, component: TradeHistoryTable },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0b0e11]">
      {/* Tab Header */}
      <div className="flex items-center justify-between px-4 h-8 shrink-0 border-b border-[#1e2329]">
        <div className="flex items-center gap-4 h-full flex-1 overflow-hidden">
          {tabs.map((tab) => (
            <Button
              variant="ghost"
              key={tab.name}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab(tab.name);
                // FIX: Always expand when tapping ANY tab
                if (isCollapsed) {
                  onToggleCollapse();
                }
              }}
              className={`relative font-bold h-full transition-all flex items-center px-1 flex-shrink-0 ${
                activeTab === tab.name
                  ? "text-white"
                  : "text-[#848e9c] hover:text-white"
              }`}
            >
              <span className="relative z-10 text-[12px]">{tab.name}</span>

              {activeTab === tab.name && (
                <>
                  <motion.span
                    layoutId="active-bottom-tab"
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-blue-500"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.2 }}
                  />
                </>
              )}
            </Button>
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse();
          }}
          className="p-1 hover:bg-[#1e2329] rounded text-[#848e9c] hover:text-white transition-all flex-shrink-0"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }}>
            <ChevronDown size={16} />
          </motion.div>
        </button>
      </div>

      { !isCollapsed && activeTab !== "Assets" && (
        <div className="p-4 overflow-auto flex-1">
          {tabs.find(tab => tab.name === activeTab)?.component && React.createElement(tabs.find(tab => tab.name === activeTab)!.component!)}
        </div>
      )}
    </div>
  );
};

export default BottomTabs;
