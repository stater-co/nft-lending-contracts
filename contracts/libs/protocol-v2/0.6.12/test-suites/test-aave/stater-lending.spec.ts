import { makeSuite, TestEnv } from './helpers/make-suite';
const { expect } = require('chai');

makeSuite('Stater Lending Routes', (testEnv: TestEnv) => {

  it('Tries to invoke mint not being the LendingPool', async () => {
    const { deployer, pool, dai, helpersContract } = testEnv;

    const daiStableDebtTokenAddress = (await helpersContract.getReserveTokensAddresses(dai.address))
      .stableDebtTokenAddress;

    const stableDebtContract = await getStableDebtToken(daiStableDebtTokenAddress);

    await expect(
      stableDebtContract.mint(deployer.address, deployer.address, '1', '1')
    ).to.be.revertedWith(CT_CALLER_MUST_BE_LENDING_POOL);
  });

  it('Tries to deploy the health factor route', async () => {
  
  });

});
