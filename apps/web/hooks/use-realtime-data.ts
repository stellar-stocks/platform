import { useEffect, useRef } from "react";
import { useSetAtom } from "jotai";
import { stockDataState, StockData } from "@/state/recoil";
import { stocks } from "@/lib/constants";

const ALPACA_KEY = process.env.NEXT_PUBLIC_ALPACA_KEY;
const ALPACA_SECRET = process.env.NEXT_PUBLIC_ALPACA_SECRET;
const WS_URL = "wss://stream.data.alpaca.markets/v2/iex"; // Free tier IEX data

if (!ALPACA_KEY || !ALPACA_SECRET) {
  console.warn("Alpaca keys missing in environment variables");
}


export const useAlpacaMarketData = () => {
  const setStockData = useSetAtom(stockDataState);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!ALPACA_KEY || !ALPACA_SECRET) {
      console.warn("Alpaca keys missing in environment variables");
      return;
    }

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to Alpaca Stream");
      
      const authMsg = {
        action: "auth",
        key: ALPACA_KEY,
        secret: ALPACA_SECRET,
      };
      ws.send(JSON.stringify(authMsg));
    };

    ws.onmessage = (event) => {
      const messages = JSON.parse(event.data);
      
      if (Array.isArray(messages)) {
        // Handle Auth Success & Subscribe
        if (messages[0]?.msg === "authenticated") {
          const subscribeMsg = {
            action: "subscribe",
            trades: stocks.map(s => s.symbol),
            // quotes: stocks.map(s => s.symbol), // Optional: subscribe to quotes for spread
          };
          ws.send(JSON.stringify(subscribeMsg));
          return;
        }

        // Process Trades
        messages.forEach((msg) => {
          if (msg.T === "t") {
            setStockData((prev) => {
              const currentStock = prev[msg.S];
              const prevPrice = currentStock?.price || msg.p;
              
              const newDirection = 
                msg.p > prevPrice ? 'up' : 
                msg.p < prevPrice ? 'down' : 
                currentStock?.lastUpdateDirection || 'none';

              // Create default structure if it doesn't exist
              const baseData: StockData = currentStock || {
                symbol: msg.S,
                price: msg.p,
                open: msg.p,
                high: msg.p,
                low: msg.p,
                prevClose: msg.p,
                change: 0,
                changePercent: 0,
                volume: 0,
                timestamp: new Date().toISOString(),
                lastUpdateDirection: 'none',
                source: 't',
                priceHistory: [],
                marketCap: 0,
                change24h: 0
              };

              return {
                ...prev,
                [msg.S]: {
                  ...baseData,
                  price: msg.p,
                  volume: (baseData.volume || 0) + msg.s,
                  timestamp: msg.t, // Alpaca sends timestamp as string in 't'
                  lastUpdateDirection: newDirection,
                  source: 't',
                  // Simple history tracking for sparklines
                  priceHistory: [
                    ...(baseData.priceHistory || []),
                    { val: msg.p, time: new Date(msg.t).getTime() }
                  ].slice(-50) // Keep last 50 points
                },
              };
            });
          }
        });
      }
    };

    ws.onerror = (error) => console.error("Alpaca WS Error:", error);
    
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [setStockData]);
};