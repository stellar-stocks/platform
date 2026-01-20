"use client";
// TradingViewWidget.jsx
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
    // Clean up any previous widget/script
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
          "autosize": true
        }`;

    if (container.current) {
      container.current.appendChild(script);
    }

    // Cleanup function to remove the widget and script
    return () => {
      if (container.current) {
        while (container.current.firstChild) {
          container.current.removeChild(container.current.firstChild);
        }
      }
    };
  }, [interval, symbol]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div className="flex gap-2 mb-2">
        {intervals.map((intv) => (
          <button
            key={intv.value}
            onClick={() => setInterval(intv.value)}
            className={`px-2 py-1 rounded text-xs font-bold border transition-colors ${interval === intv.value ? "bg-blue-600 text-white border-blue-600" : "bg-[#181a20] text-[#eaecef] border-[#23272f] hover:bg-[#23272f]"}`}
          >
            {intv.label}
          </button>
        ))}
      </div>
      <div
        className="tradingview-widget-container"
        ref={container}
        style={{ height: "100%", width: "100%" }}
      >
        <div
          className="tradingview-widget-container__widget"
          style={{ height: "100%", width: "100%" }}
        ></div>
        <div className="tradingview-widget-copyright">
          <a
            href="https://www.tradingview.com/symbols/NASDAQ-AAPL/"
            rel="noopener nofollow"
            target="_blank"
          ></a>
        </div>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
