"use client";

import { useEffect, useRef } from "react";

export const TVChartContainer = ({
  symbol = "AAPL",
  interval = "D",
  libraryPath = "/static/charting_library/",
  locale = "en",
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).TradingView) return;

    const widgetOptions = {
      symbol,
      interval,
      container: chartContainerRef.current,
      library_path: libraryPath,
      locale,
      theme: "dark",
      const [isReady, setIsReady] = useState(false);

      useEffect(() => {
        const checkReady = () => {
          if (typeof window !== "undefined" && (window as any).TradingView) {
            setIsReady(true);
          } else {
            setTimeout(checkReady, 100);
          }
        };
        checkReady();
      }, []);

      useEffect(() => {
        if (!isReady || !chartContainerRef.current) return;
        const widgetOptions = {
          symbol,
          interval,
          container: chartContainerRef.current,
          library_path: libraryPath,
          locale,
          theme: "dark",
          autosize: true,
          fullscreen: false,
        };
        const tvWidget = new (window as any).TradingView.widget(widgetOptions);
        return () => {
          if (tvWidget) tvWidget.remove();
        };
      }, [isReady, symbol, interval, libraryPath, locale]);

      if (!isReady) {
        return <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading chart...</div>;
      }
