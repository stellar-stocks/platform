"use client";

import React, { useEffect, useRef, useState } from "react";

declare const TradingView: any;

interface TradingViewChartProps {
  symbol: string;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ symbol }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [interval, setIntervalState] = useState("60");
  const [chartType, setChartType] = useState("1");

  useEffect(() => {
    if (containerRef.current && typeof TradingView !== "undefined") {
      containerRef.current.innerHTML = "";

      widgetRef.current = new TradingView.widget({
        autosize: true,
        symbol: symbol,
        interval: interval,
        timezone: "Etc/UTC",
        theme: "dark",
        style: chartType,
        locale: "en",
        toolbar_bg: "#16181e",
        enable_publishing: false,
        hide_top_toolbar: true,
        hide_side_toolbar: false,
        allow_symbol_change: false,
        container_id: containerRef.current.id,
        studies: ["MASimple@tv-basicstudies"],
        backgroundColor: "#0b0e11",
        gridColor: "rgba(43, 47, 54, 0.2)",
        save_image: false,
        custom_css_url: "",
      });
    }
  }, [symbol, interval, chartType]);

  const intervals = [
    { label: "1m", value: "1" },
    { label: "5m", value: "5" },
    { label: "15m", value: "15" },
    { label: "1h", value: "60" },
    { label: "4h", value: "240" },
    { label: "D", value: "D" },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#0b0e11]">
      {/* Refined Toolbar */}
      <div className="flex items-center justify-between border-b border-[#1e2329] bg-[#16181e] shrink-0">
        <div className="flex items-center overflow-x-auto no-scrollbar py-1 px-3 gap-1 scroll-smooth">
          <div className="flex items-center gap-0.5 shrink-0">
            {intervals.map((item) => (
              <button
                key={item.value}
                onClick={() => setIntervalState(item.value)}
                className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-md transition-all whitespace-nowrap ${
                  interval === item.value
                    ? "bg-[#2b2f36] text-[#fff]"
                    : "text-[#848e9c] hover:bg-[#1e2329] hover:text-[#eaecef]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-[#2b2f36] mx-2 shrink-0"></div>

          {/* Indicators Button Restored */}
          <button className="flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold text-[#848e9c] hover:bg-[#1e2329] hover:text-[#eaecef] rounded-md transition-all whitespace-nowrap shrink-0">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 20V10M18 20V4M6 20v-4" />
            </svg>
            Indicators
          </button>

          <div className="h-4 w-[1px] bg-[#2b2f36] mx-2 shrink-0"></div>

          {/* Chart Style Switcher */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setChartType("1")}
              className={`p-1.5 rounded-md transition-colors ${chartType === "1" ? "bg-[#2b2f36] text-white" : "text-[#848e9c] hover:bg-[#1e2329]"}`}
              title="Candlesticks"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 3v18M6 7h4v10H6M14 3v18M14 5h4v8h-4" />
              </svg>
            </button>
            <button
              onClick={() => setChartType("2")}
              className={`p-1.5 rounded-md transition-colors ${chartType === "2" ? "bg-[#2b2f36] text-white" : "text-[#848e9c] hover:bg-[#1e2329]"}`}
              title="Line"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 17l6-6 4 4 8-8" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 shrink-0">
          <button
            className="p-1.5 text-[#848e9c] hover:text-white rounded-md hover:bg-[#2b2f36]"
            title="Settings"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 w-full relative">
        <div
          id={`tv_chart_${symbol.replace(/[:]/g, "_")}`}
          ref={containerRef}
          className="absolute inset-0"
        />
      </div>
    </div>
  );
};

export default TradingViewChart;
