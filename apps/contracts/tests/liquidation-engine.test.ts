import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe("Liquidation Engine", () => {
  it("should liquidate an underwater position", () => {
    // 1. Setup
    const mintAmount = 100000000;
    simnet.callPublicFn(
      "collateral-vault",
      "mint",
      [Cl.standardPrincipal(wallet1), Cl.uint(mintAmount)],
      deployer,
    );

    const symbol = "ETH";
    const initialPrice = 3000000000; // 3000.00
    simnet.callPublicFn(
      "dia-oracle-wrapper",
      "set-price",
      [Cl.stringAscii(symbol), Cl.uint(initialPrice)],
      deployer,
    );

    // 2. Open 5x Long
    // 5x => 20% collateral. Health ~ 2000 (20.00%).
    const leverage = 5;
    const size = 1000000;
    simnet.callPublicFn(
      "perp-engine",
      "open-position",
      [
        Cl.stringAscii(symbol),
        Cl.bool(true),
        Cl.uint(leverage),
        Cl.uint(size),
        Cl.contractPrincipal(deployer, "collateral-vault"),
      ],
      wallet1,
    );

    // 3. Drop Price
    // Drop by 15%. Leverage 5 => -75% equity.
    // Remaining equity = 25% of original collateral.
    // Original Collateral = 20% of Notional.
    // New Equity = 5% of Notional.
    // Health ~ 500.
    // Threshold set to 1000.
    const newPrice = 2550000000; // 3000 * 0.85
    simnet.callPublicFn(
      "dia-oracle-wrapper",
      "set-price",
      [Cl.stringAscii(symbol), Cl.uint(newPrice)],
      deployer,
    );

    // 4. Set Liquidator
    const liquidatorEngine = Cl.contractPrincipal(
      deployer,
      "liquidation-engine",
    );
    simnet.callPublicFn(
      "perp-engine",
      "set-liquidator",
      [liquidatorEngine, Cl.bool(true)],
      deployer,
    );

    // 5. Liquidate
    const response = simnet.callPublicFn(
      "liquidation-engine",
      "liquidate",
      [
        Cl.contractPrincipal(deployer, "perp-engine"),
        Cl.contractPrincipal(deployer, "collateral-vault"),
        Cl.standardPrincipal(wallet1),
        Cl.stringAscii(symbol),
      ],
      deployer, // Keeper
    );
    expect(response.result).toBeOk(Cl.bool(true));
  });
});
