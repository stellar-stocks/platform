import express, { Request, Response } from "express";
import cors from "cors";
import cron from "node-cron";
import { HermesClient } from "@pythnetwork/hermes-client";
import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  uintCV,
  stringAsciiCV,
  listCV,
  tupleCV,
  PostConditionMode,
} from "@stacks/transactions";
import { StacksMocknet } from "@stacks/network";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration
const HERMES_URL = "https://hermes.pyth.network";
const DEPLOYER_KEY =
  process.env.DEPLOYER_KEY ||
  "753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601"; // Default Devnet Key
const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const CONTRACT_NAME = "dia-oracle-wrapper";

// Network Setup
const network = new StacksMocknet();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Initialize Hermes Client
const connection = new HermesClient(HERMES_URL, {});

// 2. State Management
const trackedPriceIds = new Set<string>([
  "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", // BTC/USD
  "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", // ETH/USD
  "0x16dad506d7db8da01c87581c87ca897a012a153557d4d578c3b9c9e1bc0632f1", // TSLA/USD (Tesla)
  "0xb1073854ed24cbc755dc527418f52b7d271f6cc967bbf8d8129112b18860a593", // NVDA
  "0xd0ca23c1cc005e004ccf1db5bf76aeb6a49218f43dac3d4b275e92de12ded4d1", // MSFT
  "0xb5d0e0fa58a1f8b81498ae670ce93c872d14434b72c364885d4fa1b257cbb07a", // AMZN
  "0x78a3e3b8e676a8f73c439f5d749737034b139bbbe899ba5775216fba596607fe", // META
]);

const PYTH_MAPPING: Record<string, string> = {
  "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43": "BTC",
  "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace": "ETH",
  "0x16dad506d7db8da01c87581c87ca897a012a153557d4d578c3b9c9e1bc0632f1": "TSLA",
  "0xb1073854ed24cbc755dc527418f52b7d271f6cc967bbf8d8129112b18860a593": "NVDA",
  "0xd0ca23c1cc005e004ccf1db5bf76aeb6a49218f43dac3d4b275e92de12ded4d1": "MSFT",
  "0xb5d0e0fa58a1f8b81498ae670ce93c872d14434b72c364885d4fa1b257cbb07a": "AMZN",
  "0x78a3e3b8e676a8f73c439f5d749737034b139bbbe899ba5775216fba596607fe": "META",
};

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

// --- STACKS ORACLE UPDATE ---
const updateOracle = async (updates: any[]) => {
  try {
    const batchedUpdates = updates
      .map((u) => {
        const symbol = PYTH_MAPPING[u.id];
        if (!symbol) return null;

        // Normalize to 8 decimals as expected by contracts (previously 1e8)
        // Pyth returns price and exponent.
        const rawPrice = parseInt(u.price.price);
        const expo = u.price.expo;
        
        // Example: 5000000000 * 10^-8 = 50.00
        // We want 50.00 * 10^8 = 5000000000
        // Result = rawPrice * 10^(8 + expo)
        const power = 8 + expo;
        const price = Math.floor(rawPrice * Math.pow(10, power));
        
        // Ensure price is positive for uint
        if (price < 0) return null;

        return tupleCV({
          symbol: stringAsciiCV(symbol),
          price: uintCV(price),
        });
      })
      .filter((u) => u !== null);

    if (batchedUpdates.length === 0) return;

    console.log(
      `[Oracle] Broadcasting update for ${batchedUpdates.length} assets...`,
    );

    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: "set-multiple-prices",
      functionArgs: [listCV(batchedUpdates)],
      senderKey: DEPLOYER_KEY,
      validateWithAbi: false, 
      network,
      postConditionMode: PostConditionMode.Allow,
      anchorMode: AnchorMode.Any,
    };

    const transaction = await makeContractCall(txOptions);
    const result = await broadcastTransaction(transaction, network);

    console.log(`[Oracle] Tx ID: ${result.txid} (Reason: ${result})`);
  } catch (err) {
    console.error(`[Oracle] Update failed:`, err);
  }
};

// --- BACKGROUND TASK ---
const fetchPrices = async () => {
  if (trackedPriceIds.size === 0) return;

  try {
    const ids = Array.from(trackedPriceIds);
    console.log(`[CronJob] Fetching updates for ${ids.length} assets...`);

    const priceUpdates = await connection.getLatestPriceUpdates(ids);

    if (priceUpdates.parsed) {
      await updateOracle(priceUpdates.parsed);
    }

    latestData = {
      lastUpdated: new Date(),
      binary: priceUpdates.binary,
      parsed:
        priceUpdates.parsed?.map((update) => ({
          id: update.id,
          symbol: PYTH_MAPPING[update.id] || "Unknown",
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
// Run every minute
const task = cron.schedule("* * * * *", () => {
  fetchPrices();
});

// Start the cron job
task.start();

// --- API ENDPOINTS ---
app.get("/api/prices", (req: Request, res: Response) => {
  res.json(latestData);
});

app.post("/api/admin/track", (req: Request, res: Response) => {
  const { ids } = req.body;
  if (Array.isArray(ids)) {
    ids.forEach((id) => trackedPriceIds.add(id));
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

app.get("/api/feeds/search", async (req: Request, res: Response) => {
 try {
    const query = (req.query.q as string) || "crypto";
    const feeds = await connection.getPriceFeeds({
      query,
      assetType: (req.query.type as string) || undefined,
    });

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
      results: aggregated,
    });
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Price Oracle Service running at http://localhost:${PORT}`);
  console.log(`   - Network: Stacks Mocknet`);
  console.log(`   - Updates on-chain every minute.`);

  // Initial fetch
  fetchPrices();
});
