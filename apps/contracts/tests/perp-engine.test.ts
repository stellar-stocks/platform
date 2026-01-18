import { describe, it, expect } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const user = accounts.get("wallet_1")!;

describe("Perp DEX Test Suite", () => {
  it("Should allow a user to open a 10x TSLA Long", () => {
    // 1. Setup inputs (100 USDCx at 10x leverage)
    const amount = Cl.uint(100_000_000);
    const leverage = Cl.uint(10);
    const symbol = Cl.ascii("TSLA/USD");

    // 2. Call the contract
    const result = simnet.callPublicFn(
      "perp-engine",
      "open-position",
      [amount, leverage, symbol, Cl.bool(true)],
      user,
    );

    // 3. Assert (Check if it was successful)
    expect(result.result).toBeOk(Cl.bool(true));

    // 4. Check if the map was updated correctly
    const position = simnet.getMapValue(
      "perp-engine",
      "Positions",
      Cl.principal(user),
    );
    expect(position).toBeSome();
  });
});
