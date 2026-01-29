import express, { Request, Response } from "express";
import cors from "cors";
import cron from "node-cron";
import { HermesClient } from "@pythnetwork/hermes-client";

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration
const HERMES_URL = "https://hermes.pyth.network";

// Middleware
app.use(cors());
app.use(express.json());

// 1. Initialize Hermes Client
const connection = new HermesClient(HERMES_URL, {});

// 2. State Management
// We use a Set to ensure unique IDs. Initializing with BTC, ETH, and TSLA.
const trackedPriceIds = new Set<string>([
  "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", // BTC/USD
  "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", // ETH/USD
  "0x16dad506d7db8da01c87581c87ca897a012a153557d4d578c3b9c9e1bc0632f1", // TSLA/USD (Tesla)
  "0xb1073854ed24cbc755dc527418f52b7d271f6cc967bbf8d8129112b18860a593", // NVDA
  // microsoft
  "0xd0ca23c1cc005e004ccf1db5bf76aeb6a49218f43dac3d4b275e92de12ded4d1",
  // Amazon
  "0xb5d0e0fa58a1f8b81498ae670ce93c872d14434b72c364885d4fa1b257cbb07a",
  // Meta
  "0x78a3e3b8e676a8f73c439f5d749737034b139bbbe899ba5775216fba596607fe",
]);

// simple in-memory cache
interface PriceCache {
  lastUpdated: Date;
  binary: string[];
  parsed: any[];
}

let latestData: PriceCache = {
  lastUpdated: new Date(0),
  binary: [],
  parsed: [],
};

// --- BACKGROUND TASK ---
const fetchPrices = async () => {
  if (trackedPriceIds.size === 0) return;

  try {
    const ids = Array.from(trackedPriceIds);
    console.log(`[CronJob] Fetching updates for ${ids.length} assets...`);

    const priceUpdates = await connection.getLatestPriceUpdates(ids);

    latestData = {
      lastUpdated: new Date(),
      binary: priceUpdates.binary,
      parsed:
        priceUpdates.parsed?.map((update) => ({
          id: update.id,
          symbol: "Unknown",
          price: update.price,
          ema_price: update.ema_price,
        })) || [],
    };

    console.log(
      `[CronJob] Success. Last update: ${latestData.lastUpdated.toISOString()}`,
    );
  } catch (error) {
    console.error("[CronJob] Error updating prices:", error);
  }
};

// --- CRON SCHEDULE ---
// Schedule task to run every minute
// Syntax: 'second minute hour day-of-month month day-of-week'
// '* * * * *' = Every minute
const task = cron.schedule("* * * * *", () => {
  fetchPrices();
});

// Start the cron job
task.start();

// --- API ENDPOINTS ---

/**
 * GET /api/prices
 * Returns the latest CACHED price updates. Instant response.
 */
app.get("/api/prices", (req: Request, res: Response) => {
  res.json(latestData);
});

/**
 * POST /api/admin/track
 * Add new IDs to the heartbeat (e.g. add TSLA, META).
 * Body: { "ids": ["0x...", "0x..."] }
 */
app.post("/api/admin/track", (req: Request, res: Response) => {
  const { ids } = req.body;
  if (Array.isArray(ids)) {
    ids.forEach((id) => trackedPriceIds.add(id));
    // Force an immediate update
    fetchPrices();
    res.json({
      message: "Added IDs to tracker",
      currentCount: trackedPriceIds.size,
      trackedIds: Array.from(trackedPriceIds),
    });
  } else {
    res.status(400).json({ error: "Invalid body. Expected { ids: [] }" });
  }
});

/**
 * GET /api/feeds/search
 * Aggregates results by Base Currency so you don't get overwhelmed with 20 BTC variants.
 */
app.get("/api/feeds/search", async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || "crypto";
    const feeds = await connection.getPriceFeeds({
      query,
      assetType: (req.query.type as string) || undefined,
    });

    // Aggregation Logic: Group by the "base" attribute
    const aggregated: Record<string, any[]> = {};

    feeds.forEach((feed: any) => {
      const base = feed.attributes?.base || "Other";
      if (!aggregated[base]) aggregated[base] = [];
      aggregated[base].push({
        symbol: feed.attributes.symbol,
        id: feed.id,
        description: feed.attributes.description,
      });
    });

    res.json({
      count: feeds.length,
      groups: Object.keys(aggregated).length,
      results: aggregated, // Returns { "BTC": [ {available btc IDs...} ], "ETH": [...] }
    });
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Price Feed Server running at http://localhost:${PORT}`);
  console.log(`   - Cached Prices: http://localhost:${PORT}/api/prices`);
  console.log(
    `   - Search Assets: http://localhost:${PORT}/api/feeds/search?q=btc`,
  );

  // Initial fetch on startup
  fetchPrices();
});
