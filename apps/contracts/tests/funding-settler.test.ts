import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;

describe("Funding Settler", () => {
  it("should fail to settle funding too early", () => {
    const response = simnet.callPublicFn(
      "funding-settler",
      "settle-funding",
      [],
      deployer,
    );
    // blocks-since = 0 (initially) < 2880
    expect(response.result).toBeErr(Cl.int(300)); // err-too-early
  });

  it("should settle funding after interval", () => {
    // Advance blocks
    simnet.mineEmptyBlocks(2881);

    const response = simnet.callPublicFn(
      "funding-settler",
      "settle-funding",
      [],
      deployer,
    );
    expect(response.result).toBeOk(Cl.bool(true));
  });
});
