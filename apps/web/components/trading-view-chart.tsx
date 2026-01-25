"use client";
import { CandlestickChart, LineChart } from "lucide-react";
import React, { useEffect, useRef, memo, useState } from "react";

import { Stock } from "@/utils/constants";
import { Button } from "./ui/button";

function TradingViewWidget({
  selectedStock,
}: {
  selectedStock: Stock | undefined;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [interval, setInterval] = useState("D");
  const [chartType, setChartType] = useState("1"); // 1=candles, 0=bars, 2=line, 8=area

  const intervals = [
    { label: "1m", value: "1" },
    { label: "5m", value: "5" },
    { label: "15m", value: "15" },
    { label: "1H", value: "60" },
    { label: "4H", value: "240" },
    { label: "1D", value: "D" },
  ];

  const chartTypes = [
    { label: "Candles", value: "1", icon: <CandlestickChart size={14} /> },
    { label: "Line", value: "2", icon: <LineChart size={14} /> },
  ];

  useEffect(() => {
    if (container.current) {
      while (container.current.firstChild) {
        container.current.removeChild(container.current.firstChild);
      }
    }

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "allow_symbol_change": true,
        "calendar": false,
        "details": false,
        "hide_side_toolbar": "${chartType === "2" ? "true" : "false"}",
        "hide_top_toolbar": "true",
        "hide_legend": "true",
        "hide_volume": "${chartType === "2" ? "true" : "false"}",
        "hotlist": false,
        "interval": "${interval}",
        "locale": "en",
        "save_image": true,
        "style": "${chartType}",
        "symbol": "${selectedStock?.symbol}",
        "theme": "dark",
        "timezone": "Etc/UTC",
        "backgroundColor": "#0F0F0F",
        "gridColor": "rgba(242, 242, 242, 0.06)",
        "watchlist": [],
        "withdateranges": false,
        "compareSymbols": [],
        "studies": [],
        "autosize": true,
        "support_host": "https://www.tradingview.com"
      }`;

    if (container.current) {
      container.current.appendChild(script);
    }

    return () => {
      if (container.current) {
        while (container.current.firstChild) {
          container.current.removeChild(container.current.firstChild);
        }
      }
    };
  }, [interval, selectedStock?.symbol, chartType]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Top Controls: Time LEFT + Icons RIGHT */}
      <div className="flex items-center justify-between p-2 bg-[#0d0f13] border-b border-[#1e2329] shrink-0 z-10">
        {/* Time Intervals - Left */}
        <div className="flex gap-1">
          {intervals.map((intv) => (
            <button
              key={intv.value}
              onClick={() => setInterval(intv.value)}
              className={`text-white px-2 py-1 rounded text-[12px] font-medium transition-all shrink-0 ${
                interval === intv.value ? "font-bold" : "opacity-60"
              }`}
              title={intv.label}
            >
              {intv.label}
            </button>
          ))}
        </div>

        {/* Chart Type Icon Buttons - Far RIGHT */}
        <div className="flex gap-1 ml-auto">
          {chartTypes.map((type) => (
            <Button
              variant={"ghost"}
              key={type.value}
              onClick={() => setChartType(type.value)}
              title={`Switch to ${type.label}`}
            >
              <span>{type.icon}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div
        className="tradingview-widget-container flex-1 relative z-0"
        ref={container}
        style={{ height: "100%", width: "100%" }}
      >
        <div
          className="tradingview-widget-container__widget"
          style={{ height: "100%", width: "100%" }}
        />
        <div className="tradingview-widget-container__widget" />
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
