import { NextRequest, NextResponse } from "next/server";
import Alpaca from "@alpacahq/alpaca-trade-api";

const alpaca = new Alpaca({
  keyId: process.env.ALPACA_API_KEY!,
  secretKey: process.env.ALPACA_API_SECRET!,
  paper: true,
});

// ✅ GET single unit price (last traded price per share)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol")?.toUpperCase();

    if (!symbol) {
      return NextResponse.json(
        { error: "Symbol is required (e.g., ?symbol=AAPL)" },
        { status: 400 }
      );
    }

    console.log("Fetching latest price for:", symbol);

    // Get the LAST TRADED PRICE (single unit price)
    const latestTrade = await alpaca.getLatestTrade(symbol);
    
    const priceData = {
      symbol,
      price: parseFloat(latestTrade.price), // ✅ Single unit price per share
      timestamp: latestTrade.timestamp,
    };

    console.log(`Latest ${symbol} price: $${priceData.price}`);
    return NextResponse.json({ price: priceData }, { status: 200 });

  } catch (error) {
    console.error("Price fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch price" },
      { status: 500 }
    );
  }
}
