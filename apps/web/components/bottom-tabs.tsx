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
      {/* Tab Header Area */}
      <div className="flex items-center justify-between px-4 h-[40px] shrink-0 border-b border-[#1e2329]">
        <div className="flex items-center gap-6 h-full">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => {
                setActiveTab(tab.name);
                if (isCollapsed) onToggleCollapse();
              }}
              className={`text-xs font-bold h-full border-b-2 transition-all flex items-center ${
                activeTab === tab.name
                  ? "text-white border-blue-500"
                  : "text-[#848e9c] border-transparent hover:text-white"
              }`}
            >
              {tab.name}{" "}
              {tab.count !== null && (
                <span className="ml-1 opacity-60">({tab.count})</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-5">
          {!isCollapsed && (
            <>
              <div className="flex items-center gap-2 text-[11px] font-medium text-[#848e9c] cursor-pointer hover:text-white transition-colors">
                <input
                  type="checkbox"
                  id="show-current"
                  className="accent-blue-500 rounded"
                />
                <label htmlFor="show-current" className="cursor-pointer">
                  Show current
                </label>
              </div>
              <button className="text-[11px] font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-tight">
                More
              </button>
            </>
          )}

          <button
            onClick={onToggleCollapse}
            className="p-1 hover:bg-[#1e2329] rounded text-[#848e9c] hover:text-white transition-colors"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content Area - Only visible when not collapsed */}
      {!isCollapsed && (
        <>
          <div className="flex-1 flex flex-col items-center justify-center text-[#848e9c]">
            <div className="p-4 rounded-xl bg-[#1e2329]/50 mb-3">
              <svg
                width="32"
                height="32"
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
            <p className="text-xs font-medium tracking-wide">
              No records found
            </p>
          </div>

          <div className="px-4 py-2 border-t border-[#1e2329] flex items-center gap-4 bg-[#0d0f13]">
            <button className="text-[10px] font-bold px-3 py-1 bg-[#1e2329] rounded-md text-white border border-[#2b2f36] hover:bg-[#2b2f36] transition-colors">
              Market (0)
            </button>
            <button className="text-[10px] font-bold px-3 py-1 text-[#848e9c] hover:text-white transition-colors">
              Limit/TP/SL (0)
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BottomTabs;
