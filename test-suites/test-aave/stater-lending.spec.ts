import { makeSuite, TestEnv } from "./helpers/make-suite";
const { expect } = require("chai");

makeSuite("Stater Lending Routes", (testEnv: TestEnv) => {
  it("Tries to invoke mint not being the LendingPool", async () => {
    //const { staterHealthFactor } = testEnv;
    //await pool.FLASHLOAN_PREMIUM_TOTAL();
    //await staterHealthFactor.MAX_SQRT_RATIO();
  });
});
