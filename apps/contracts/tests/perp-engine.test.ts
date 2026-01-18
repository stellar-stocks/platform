import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe("Perp Engine", () => {
  it("should open and close a position", () => {
    // 1. Setup: Mint collateral to wallet1
    const mintAmount = 10000000; // 10 tokens
    simnet.callPublicFn(
      "collateral-vault",
      "mint",
      [Cl.standardPrincipal(wallet1), Cl.uint(mintAmount)],
      deployer,
    );

    // 2. Setup: Set Oracle price check
    const symbol = "BTC";
    const price = 50000000000; // $50k
    simnet.callPublicFn(
      "dia-oracle-wrapper",
      "set-price",
      [Cl.stringAscii(symbol), Cl.uint(price)],
      deployer,
    );

    // 3. Open Position
    const leverage = 5;
    const size = 1000000;
    const openResponse = simnet.callPublicFn(
      "perp-engine",
      "open-position",
      [
        Cl.stringAscii(symbol),
        Cl.bool(true), // Long
        Cl.uint(leverage),
        Cl.uint(size),
        Cl.contractPrincipal(deployer, "collateral-vault"), // Vault trait
      ],
      wallet1,
    );
    expect(openResponse.result).toBeOk(
      Cl.tuple({
        collateral: Cl.uint(5000000),
        size: Cl.int(1000000),
        leverage: Cl.uint(5),
        "entry-price": Cl.uint(price),
        "unrealized-pnl": Cl.int(0),
        "last-funding": Cl.uint(2),
      }),
    );

    // 4. Close Position
    const closeResponse = simnet.callPublicFn(
      "perp-engine",
      "close-position",
      [
        Cl.stringAscii(symbol),
        Cl.contractPrincipal(deployer, "collateral-vault"),
      ],
      wallet1,
    );
    expect(closeResponse.result).toBeOk(
      Cl.tuple({
        pnl: Cl.int(0),
        payout: Cl.uint(5000000), // Collateral returned
      }),
    );
  });
});
