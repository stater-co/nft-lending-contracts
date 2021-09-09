import { makeSuite, TestEnv } from "./helpers/make-suite";
const { expect } = require("chai");

makeSuite("Stater Lending Routes", (testEnv: TestEnv) => {
  it("Tries to create some ERC1155 tokens to be used later", async () => {
    const { gameItems1155, deployer } = testEnv;
    await gameItems1155.createTokens(
      deployer.address,
      0,
      10000,
      "0x00",
      "Test token",
      "Test token description",
      "Test token image"
    );
  });

  it("Tries to create some ERC1155 tokens to be used later", async () => {
    const { staterHealthFactor, gameItems1155 } = testEnv;
    await gameItems1155.setApprovalForAll(staterHealthFactor.address, true);
  });

  it("Tries to get the uniswap v3 nft address", async () => {
    const { staterHealthFactor } = testEnv;
    const theAddress = await staterHealthFactor.uniswapV3NftAddress();
    console.log(">> " + theAddress);
  });
  /*
  it("Tries to create a loan", async () => {
    const { staterHealthFactor, dai } = testEnv;
    await staterHealthFactor.createLoan({
      currency: dai.address,
      installmentTime: 70000000,
      nftTokenIdArray: [0, 0, 0],
      loanAmount: 6000000,
      nrOfInstallments: 7
    });
  });
  */
});
