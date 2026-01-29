import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe("Collateral Vault", () => {
  it("should fail to lock collateral if balance is insufficient", () => {
    const amount = 1000;
    const lockResponse = simnet.callPublicFn(
      "collateral-vault",
      "lock-collateral",
      [Cl.standardPrincipal(wallet1), Cl.uint(amount)],
      wallet1,
    );
    // Expect error because wallet1 has no tokens initially (no mint function public)
    expect(lockResponse.result).toBeErr(Cl.uint(1));
  });
});
