"use client";
// TradingViewWidget.jsx - FIXED
import React, { useEffect, useRef, memo, useState } from "react";

function TradingViewWidget({ symbol = "NASDAQ:AAPL" }) {
  const container = useRef<HTMLDivElement>(null);
  const [interval, setInterval] = useState("D");
  const intervals = [
    { label: "1m", value: "1" },
    { label: "5m", value: "5" },
    { label: "15m", value: "15" },
    { label: "1H", value: "60" },
    { label: "4H", value: "240" },
    { label: "1D", value: "D" },
    { label: "1W", value: "W" },
    { label: "1M", value: "M" },
  ];

  useEffect(() => {
    // Clean up previous widget
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
        "hide_side_toolbar": false,
        "hide_top_toolbar": true,
        "hide_legend": true,
        "hide_volume": false,
        "hotlist": false,
        "interval": "${interval}",
        "locale": "en",
        "save_image": true,
        "style": "1",
        "symbol": "${symbol}",
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
  }, [interval, symbol]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* FIX: Interval buttons OUTSIDE chart container */}
      <div className="flex gap-2 p-2 bg-[#0d0f13] border-b border-[#1e2329] shrink-0 z-10">
        {intervals.map((intv) => (
          <button
            key={intv.value}
            onClick={() => setInterval(intv.value)}
            className={`px-2 py-1 rounded text-[12px] font-medium transition-all flex-shrink-0 ${
              interval === intv.value
                ? "bg-blue-600 text-white shadow-md"
                : "text-[#eaecef]/60 hover:text-white hover:bg-[#1e2329]"
            }`}
          >
            {intv.label}
          </button>
        ))}
      </div>

      {/* Chart - Full available height */}
      <div
        className="tradingview-widget-container flex-1 relative z-0"
        ref={container}
        style={{ height: "100%", width: "100%" }}
      >
        <div
          className="tradingview-widget-container__widget"
          style={{ height: "100%", width: "100%" }}
        />
        <div className="tradingview-widget-copyright">
          <a
            href="https://www.tradingview.com/symbols/NASDAQ-AAPL/"
            rel="noopener nofollow"
            target="_blank"
          />
        </div>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
