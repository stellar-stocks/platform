import { NextRequest, NextResponse } from "next/server";
import Alpaca from "@alpacahq/alpaca-trade-api";

// ALPACA API KEYS
// NEXT_PUBLIC_ALPACA_BASE_URL=""
// ALPACA_API_KEY=""
// ALPACA_API_SECRET=""

const alpaca = new Alpaca({
  keyId: process.env.ALPACA_API_KEY!,
  secretKey: process.env.ALPACA_API_SECRET!,
  paper: true,
});

// createOrder({
//   symbol: string, // any valid ticker symbol
//   qty: number,
//   notional: number, // qty or notional required, not both
//   side: 'buy' | 'sell',
//   type: 'market' | 'limit' | 'stop' | 'stop_limit' | 'trailing_stop',
//   time_in_force: 'day' | 'gtc' | 'opg' | 'ioc',
//   limit_price: number, // optional,
//   stop_price: number, // optional,
//   client_order_id: string, // optional,
//   extended_hours: boolean, // optional,
//   order_class: string, // optional,
//   take_profit: object, // optional,
//   stop_loss: object, // optional,
//   trail_price: string, // optional,
//   trail_percent: string // optional,
// }) => Promise<Order>

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { symbol, qty, side, type, time_in_force, limit_price } = body;

    console.log("Placing order:", {
      symbol,
      qty,
      side,
      type,
      time_in_force,
      limit_price,
    });

    const orderParams: any = {
      symbol,
      qty,
      side,
      type,
      time_in_force,
    };

    // Add limit_price for limit orders
    if (type === "limit" && limit_price) {
      orderParams.limit_price = parseFloat(limit_price);
    }

    const order = await alpaca.createOrder(orderParams);

    console.log("Order placed successfully:", order);
    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error("Order failed:", error);
    let errorMessage = "Unknown error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (error && typeof error === "object" && "message" in error) {
      errorMessage = String(error.message);
    }

    return NextResponse.json(
      {
        error: "Trade failed",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
