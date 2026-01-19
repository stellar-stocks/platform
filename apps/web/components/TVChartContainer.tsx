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
      autosize: true,
      fullscreen: false,
    };

    const tvWidget = new (window as any).TradingView.widget(widgetOptions);

    return () => {
      if (tvWidget) tvWidget.remove();
    };
  }, [symbol, interval, libraryPath, locale]);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", height: "100%" }} />
  );
};
