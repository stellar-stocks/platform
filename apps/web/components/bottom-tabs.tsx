"use client";

import React, { useState } from "react";

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
    { name: "Assets", count: 0 },
    { name: "Open orders", count: 0 },
    { name: "Order history", count: null },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0b0e11]">
      {/* Tab Header */}
      <div className="flex items-center justify-between px-4 h-8 shrink-0 border-b border-[#1e2329]">
        <div className="flex items-center gap-4 h-full flex-1 overflow-hidden">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab(tab.name);
                // FIX: Always expand when tapping ANY tab
                if (isCollapsed) {
                  onToggleCollapse();
                }
              }}
              className={`text-[10px] font-bold h-full border-b-2 transition-all flex items-center px-1 flex-shrink-0 ${
                activeTab === tab.name
                  ? "text-white border-blue-500"
                  : "text-[#848e9c] border-transparent hover:text-white"
              }`}
            >
              <span className="truncate">{tab.name}</span>
              {tab.count !== null && (
                <span className="ml-1 opacity-60 text-[9px]">
                  ({tab.count})
                </span>
              )}
            </button>
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
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className={`transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* Content Area */}
      {!isCollapsed && (
        <>
          <div className="flex-1 flex flex-col items-center justify-center text-[#848e9c] p-3 min-h-[150px]">
            <div className="p-3 rounded-xl bg-[#1e2329]/50 mb-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="opacity-20"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </div>
            <p className="text-[10px] font-medium tracking-wide">
              No records found
            </p>
          </div>

          <div className="px-3 py-1.5 border-t border-[#1e2329] flex items-center gap-2 bg-[#0d0f13]">
            <button className="text-[9px] font-bold px-2 py-1 bg-[#1e2329] rounded-md text-white border border-[#2b2f36] hover:bg-[#2b2f36] transition-colors flex-1">
              Market (0)
            </button>
            <button className="text-[9px] font-bold px-2 py-1 text-[#848e9c] hover:text-white transition-colors">
              Limit/TP/SL (0)
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BottomTabs;
