import { makeSuite, TestEnv } from "./helpers/make-suite";
const { expect } = require("chai");

makeSuite("Stater Lending Routes", (testEnv: TestEnv) => {
  it("Tries to invoke mint not being the LendingPool", async () => {
    const { staterHealthFactor, usdc } = testEnv;
    /*
    let ok = await staterHealthFactor.id();
    console.log("Lending pool is >> " + JSON.stringify(ok));
    console.log("USDC address >> " + usdc.address);
    let verify = await staterHealthFactor.whitelistedCurrencies("0xB29A60829E73C88f0A289c0000981245Bca2eAa4");
    console.log("Verified >> " + JSON.stringify(verify));
    */
  });
});
